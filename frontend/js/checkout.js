/**
 * CraftCart Checkout Page Logic
 * Address Selection, Server-Side Order Total Verification & Cash on Delivery Processing
 */

let selectedAddress = null;
let savedAddresses = [];
let currentCart = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!api.isLoggedIn()) {
    showToast('Please sign in to complete checkout.', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=checkout.html';
    }, 800);
    return;
  }

  initCheckout();
});

async function initCheckout() {
  await Promise.all([loadCheckoutCart(), loadUserAddresses()]);
  setupAddressRadioListeners();
  setupOrderSubmission();
}

async function loadCheckoutCart() {
  try {
    const res = await api.get('/cart');
    currentCart = res.cart;

    if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
      showToast('Your cart is empty. Add products before checkout.', 'warning');
      window.location.href = 'cart.html';
      return;
    }

    renderCheckoutSummary(currentCart);
  } catch (err) {
    showToast('Failed to load cart summary.', 'error');
  }
}

function renderCheckoutSummary(cart) {
  const itemsContainer = document.getElementById('checkout-items-list');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const shippingEl = document.getElementById('checkout-shipping');
  const discountRow = document.getElementById('checkout-discount-row');
  const discountEl = document.getElementById('checkout-discount');
  const totalEl = document.getElementById('checkout-total');

  const couponCode = localStorage.getItem('craftcart_coupon') || '';
  let discountAmount = 0;
  if (couponCode.toUpperCase() === 'CRAFT10') {
    discountAmount = Math.round(cart.subtotal * 0.1);
  }

  const finalTotal = Math.max(0, cart.subtotal + cart.shippingCost - discountAmount);

  if (itemsContainer) {
    itemsContainer.innerHTML = cart.items.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; font-size: 0.9rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: var(--radius-xs); object-fit: cover; border: 1px solid var(--border);">
          <div>
            <div style="font-weight: 600; color: var(--text-primary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">Qty: ${item.quantity} × ${formatPrice(item.price)}</div>
          </div>
        </div>
        <div style="font-weight: 600;">${formatPrice(item.itemTotal)}</div>
      </div>
    `).join('');
  }

  if (subtotalEl) subtotalEl.textContent = formatPrice(cart.subtotal);
  if (shippingEl) shippingEl.textContent = cart.shippingCost === 0 ? 'FREE' : formatPrice(cart.shippingCost);

  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `- ${formatPrice(discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (totalEl) totalEl.textContent = formatPrice(finalTotal);
}

async function loadUserAddresses() {
  const container = document.getElementById('saved-addresses-container');
  const user = api.getUser();

  try {
    const res = await api.get('/auth/me');
    savedAddresses = res.user.addresses || [];

    // Pre-fill user name and phone in new address form
    const nameInput = document.getElementById('addr-name');
    const phoneInput = document.getElementById('addr-phone');
    if (nameInput && !nameInput.value) nameInput.value = res.user.name || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = res.user.phone || '';

    if (!container) return;

    if (savedAddresses.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'grid';
    container.innerHTML = savedAddresses.map((addr, idx) => `
      <div class="address-radio-card ${addr.isDefault || idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
          <strong style="font-size: 0.95rem;">${addr.label || 'Address'}</strong>
          ${addr.isDefault ? '<span class="badge badge-primary">Default</span>' : ''}
        </div>
        <p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-secondary);">
          ${addr.street}, ${addr.city}<br>
          ${addr.state} — ${addr.postalCode}, ${addr.country}
        </p>
      </div>
    `).join('');

    // Set first or default address as selected
    const defaultIdx = savedAddresses.findIndex(a => a.isDefault);
    selectedAddress = defaultIdx > -1 ? savedAddresses[defaultIdx] : savedAddresses[0];
  } catch (err) {
    console.error('Failed to load user addresses:', err);
  }
}

function setupAddressRadioListeners() {
  const container = document.getElementById('saved-addresses-container');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.address-radio-card');
    if (!card) return;

    document.querySelectorAll('.address-radio-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    const idx = parseInt(card.getAttribute('data-idx'), 10);
    selectedAddress = savedAddresses[idx];

    // Pre-fill form fields with selected address for transparency
    document.getElementById('addr-street').value = selectedAddress.street;
    document.getElementById('addr-city').value = selectedAddress.city;
    document.getElementById('addr-state').value = selectedAddress.state;
    document.getElementById('addr-postal').value = selectedAddress.postalCode;
  });
}

function setupOrderSubmission() {
  const btn = document.getElementById('place-order-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const fullName = document.getElementById('addr-name')?.value.trim();
    const phone = document.getElementById('addr-phone')?.value.trim();
    const street = document.getElementById('addr-street')?.value.trim();
    const city = document.getElementById('addr-city')?.value.trim();
    const state = document.getElementById('addr-state')?.value.trim();
    const postalCode = document.getElementById('addr-postal')?.value.trim();

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      showToast('Please complete all shipping address fields.', 'warning');
      return;
    }

    const shippingAddress = {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country: 'India'
    };

    const couponCode = localStorage.getItem('craftcart_coupon') || '';

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Processing Order...`;

    try {
      const res = await api.post('/orders', {
        shippingAddress,
        couponCode
      });

      // Clear coupon
      localStorage.removeItem('craftcart_coupon');
      updateNavBadges();

      // Show Confirmation Modal
      showConfirmationModal(res.order);
    } catch (err) {
      showToast(err.message || 'Failed to place order.', 'error');
      btn.disabled = false;
      btn.innerHTML = 'Place Order (Cash on Delivery)';
    }
  });
}

function showConfirmationModal(order) {
  const modal = document.getElementById('order-confirmed-modal');
  if (!modal) {
    window.location.href = 'orders.html';
    return;
  }

  document.getElementById('conf-order-num').textContent = order.orderNumber;
  document.getElementById('conf-order-amount').textContent = formatPrice(order.totalAmount);
  document.getElementById('conf-order-address').textContent = `${order.shippingAddress.fullName}, ${order.shippingAddress.street}, ${order.shippingAddress.city}`;

  modal.classList.add('show');
}
