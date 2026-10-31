/**
 * CraftCart Order History & Tracking Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!api.isLoggedIn()) {
    showToast('Please sign in to view your order history.', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=orders.html';
    }, 800);
    return;
  }

  loadMyOrders();
});

let myOrdersCache = [];

async function loadMyOrders() {
  const container = document.getElementById('orders-list-container');
  if (!container) return;

  try {
    const res = await api.get('/orders/my-orders');
    myOrdersCache = res.orders || [];

    if (myOrdersCache.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>You Haven't Placed Any Orders Yet</h3>
          <p>Once you make your first handcrafted purchase, you can track its packaging, dispatch, and delivery progress here.</p>
          <a href="products.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = myOrdersCache.map(order => createOrderCardHTML(order)).join('');
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Unable to Load Orders</h3>
        <p>${err.message || 'Please check your connection and try again.'}</p>
        <button class="btn btn-primary" onclick="loadMyOrders()">Retry</button>
      </div>
    `;
  }
}

function getStatusBadge(status) {
  let badgeClass = 'badge-neutral';
  if (status === 'Delivered') badgeClass = 'badge-success';
  if (status === 'Confirmed') badgeClass = 'badge-primary';
  if (status === 'Processing') badgeClass = 'badge-warning';
  if (status === 'Shipped') badgeClass = 'badge-accent';
  if (status === 'Cancelled') badgeClass = 'badge-danger';

  return `<span class="badge ${badgeClass}">${status}</span>`;
}

function createOrderCardHTML(order) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return `
    <div class="order-card">
      <div class="order-header-bar">
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Order ID</div>
          <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">${order.orderNumber}</div>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Placed On</div>
          <div style="font-size: 0.95rem; font-weight: 500;">${orderDate}</div>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Total Amount</div>
          <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">${formatPrice(order.totalAmount)}</div>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 0.25rem;">Status</div>
          ${getStatusBadge(order.orderStatus)}
        </div>
        <div>
          <button class="btn btn-secondary btn-sm" onclick="openOrderDetailsModal('${order._id}')">
            View Details
          </button>
        </div>
      </div>

      <div class="order-items-preview">
        ${order.items.map(item => `
          <div class="order-preview-row">
            <div class="order-preview-left">
              <img src="${item.image}" alt="${item.name}" class="order-item-thumb" onerror="this.src='https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'">
              <div>
                <h4 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem;">${item.name}</h4>
                <span style="font-size: 0.85rem; color: var(--text-muted);">Quantity: ${item.quantity} × ${formatPrice(item.price)}</span>
              </div>
            </div>
            <div style="font-weight: 600; font-size: 0.95rem;">
              ${formatPrice(item.price * item.quantity)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.openOrderDetailsModal = function (orderId) {
  const order = myOrdersCache.find(o => o._id === orderId);
  if (!order) return;

  const modal = document.getElementById('order-details-modal');
  if (!modal) return;

  document.getElementById('modal-order-number').textContent = order.orderNumber;
  document.getElementById('modal-order-status').innerHTML = getStatusBadge(order.orderStatus);
  document.getElementById('modal-order-date').textContent = new Date(order.createdAt).toLocaleString('en-IN');
  document.getElementById('modal-payment-method').textContent = `${order.paymentMethod} (${order.paymentStatus})`;

  document.getElementById('modal-shipping-name').textContent = order.shippingAddress.fullName;
  document.getElementById('modal-shipping-phone').textContent = order.shippingAddress.phone;
  document.getElementById('modal-shipping-address').textContent = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;

  document.getElementById('modal-subtotal').textContent = formatPrice(order.subtotal);
  document.getElementById('modal-shipping').textContent = order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost);
  document.getElementById('modal-discount').textContent = `- ${formatPrice(order.discountAmount || 0)}`;
  document.getElementById('modal-total').textContent = formatPrice(order.totalAmount);

  // Status timeline
  const timelineEl = document.getElementById('modal-order-timeline');
  if (timelineEl) {
    if (order.statusHistory && order.statusHistory.length > 0) {
      timelineEl.innerHTML = order.statusHistory.map((s, idx) => `
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; position: relative;">
          <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--primary); margin-top: 4px; flex-shrink: 0;"></div>
          <div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${s.status}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.2rem 0;">${s.note || ''}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(s.updatedAt).toLocaleString('en-IN')}</div>
          </div>
        </div>
      `).join('');
    } else {
      timelineEl.innerHTML = '<p class="text-muted">No timeline updates recorded.</p>';
    }
  }

  modal.classList.add('show');
};

window.closeOrderDetailsModal = function () {
  const modal = document.getElementById('order-details-modal');
  if (modal) modal.classList.remove('show');
};
