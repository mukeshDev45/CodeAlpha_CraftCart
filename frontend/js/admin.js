/**
 * CraftCart Admin Dashboard Controller
 * Metric Aggregations, Product CRUD, Order Status Management & Customer Overview
 */

let editingProductId = null;
let allProductsCache = [];
let allOrdersCache = [];

document.addEventListener('DOMContentLoaded', () => {
  // Enforce Admin Authentication
  if (!api.isLoggedIn() || !api.isAdmin()) {
    showToast('Administrator privileges required.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=admin.html';
    }, 1000);
    return;
  }

  setupAdminTabs();
  loadDashboardData();
  setupProductModal();
  setupAdminLogout();
});

function setupAdminTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add('active');

      // Refresh corresponding data
      if (targetTab === 'products') loadProductsTable();
      if (targetTab === 'orders') loadOrdersTable();
      if (targetTab === 'users') loadUsersTable();
    });
  });
}

function setupAdminLogout() {
  const btn = document.getElementById('admin-logout-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      api.clearAuth();
      showToast('Logged out of Admin Dashboard.', 'info');
      setTimeout(() => (window.location.href = 'index.html'), 700);
    });
  }
}

// 1. Dashboard Metrics
async function loadDashboardData() {
  try {
    const res = await api.get('/admin/dashboard');
    const stats = res.stats;

    document.getElementById('stat-revenue').textContent = formatPrice(stats.totalRevenue);
    document.getElementById('stat-orders').textContent = stats.totalOrders;
    document.getElementById('stat-products').textContent = stats.totalProducts;
    document.getElementById('stat-users').textContent = stats.totalUsers;

    // Recent orders table
    const recentTbody = document.getElementById('recent-orders-tbody');
    if (recentTbody && res.recentOrders) {
      if (res.recentOrders.length === 0) {
        recentTbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No orders placed yet.</td></tr>';
      } else {
        recentTbody.innerHTML = res.recentOrders.map(o => `
          <tr>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.user?.name || 'Customer'}</td>
            <td>${formatPrice(o.totalAmount)}</td>
            <td>${getStatusBadge(o.orderStatus)}</td>
            <td>${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    showToast('Failed to load dashboard metrics.', 'error');
  }
}

// 2. Products Management
async function loadProductsTable() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted"><div class="spinner"></div></td></tr>';

  try {
    const res = await api.get('/products?limit=100');
    allProductsCache = res.products || [];

    if (allProductsCache.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products found. Click "Add New Product" to create one.</td></tr>';
      return;
    }

    renderProductsRows(allProductsCache);
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load products.</td></tr>';
  }
}

function renderProductsRows(products) {
  const tbody = document.getElementById('admin-products-tbody');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <img src="${(p.images && p.images.length > 0) ? p.images[0] : ''}" class="admin-thumb" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'">
      </td>
      <td>
        <strong>${p.name}</strong><br>
        <span style="font-size:0.8rem; color:var(--text-muted);">${p.category}</span>
      </td>
      <td>${formatPrice(p.price)}</td>
      <td>
        <span style="font-weight: 600; color: ${p.stock <= 5 ? 'var(--danger)' : 'var(--text-primary)'};">
          ${p.stock} units
        </span>
      </td>
      <td>
        <span class="stars" style="color:#f59e0b;">★</span> ${p.rating.toFixed(1)} (${p.numReviews})
      </td>
      <td>
        <div style="display:flex; gap:0.45rem;">
          <button class="action-icon-btn" onclick="openEditProductModal('${p._id}')" title="Edit Product">✏️</button>
          <button class="action-icon-btn delete" onclick="deleteProductAdmin('${p._id}')" title="Delete Product">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 3. Orders Management
async function loadOrdersTable() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted"><div class="spinner"></div></td></tr>';

  try {
    const res = await api.get('/orders');
    allOrdersCache = res.orders || [];

    if (allOrdersCache.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No customer orders recorded yet.</td></tr>';
      return;
    }

    tbody.innerHTML = allOrdersCache.map(o => `
      <tr>
        <td><strong>${o.orderNumber}</strong></td>
        <td>
          ${o.user?.name || o.shippingAddress?.fullName || 'Customer'}<br>
          <span style="font-size:0.8rem; color:var(--text-muted);">${o.shippingAddress?.phone || ''}</span>
        </td>
        <td>${o.items?.length || 0} item(s)</td>
        <td><strong>${formatPrice(o.totalAmount)}</strong></td>
        <td>
          <select class="form-select" style="padding:0.35rem 0.65rem; font-size:0.85rem;" onchange="updateOrderStatusAdmin('${o._id}', this.value)">
            <option value="Confirmed" ${o.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load orders.</td></tr>';
  }
}

window.updateOrderStatusAdmin = async function (orderId, newStatus) {
  try {
    await api.put(`/orders/${orderId}/status`, { status: newStatus });
    showToast(`Order status updated to "${newStatus}"`, 'success');
    loadDashboardData();
  } catch (err) {
    showToast(err.message || 'Failed to update order status.', 'error');
    loadOrdersTable();
  }
};

// 4. Users Overview
async function loadUsersTable() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;

  try {
    const res = await api.get('/admin/users');
    const users = res.users || [];

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No registered customers yet.</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || '—'}</td>
        <td>${u.orderCount || 0} orders</td>
        <td>${new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load customer list.</td></tr>';
  }
}

// 5. Product Modal & CRUD
function setupProductModal() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const originalPrice = parseFloat(document.getElementById('prod-orig-price').value) || price;
    const stock = parseInt(document.getElementById('prod-stock').value, 10);
    const image1 = document.getElementById('prod-image1').value.trim();
    const image2 = document.getElementById('prod-image2').value.trim();
    const description = document.getElementById('prod-desc').value.trim();
    const featured = document.getElementById('prod-featured').checked;
    const trending = document.getElementById('prod-trending').checked;
    const bestSeller = document.getElementById('prod-bestseller').checked;
    const newArrival = document.getElementById('prod-newarrival').checked;

    const images = [image1];
    if (image2) images.push(image2);

    const body = {
      name,
      category,
      price,
      originalPrice,
      stock,
      images,
      description,
      featured,
      isTrending: trending,
      isBestSeller: bestSeller,
      isNewArrival: newArrival
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, body);
        showToast('Product updated successfully.', 'success');
      } else {
        await api.post('/products', body);
        showToast('New product created successfully.', 'success');
      }

      closeModal('product-modal');
      form.reset();
      editingProductId = null;
      loadProductsTable();
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to save product.', 'error');
    }
  });
}

window.openAddProductModal = function () {
  editingProductId = null;
  const form = document.getElementById('product-form');
  if (form) form.reset();
  document.getElementById('modal-product-title').textContent = 'Add New Product';
  document.getElementById('product-modal').classList.add('show');
};

window.openEditProductModal = function (productId) {
  const p = allProductsCache.find(item => item._id === productId);
  if (!p) return;

  editingProductId = productId;
  document.getElementById('modal-product-title').textContent = 'Edit Product';

  document.getElementById('prod-name').value = p.name;
  document.getElementById('prod-category').value = p.category;
  document.getElementById('prod-price').value = p.price;
  document.getElementById('prod-orig-price').value = p.originalPrice || p.price;
  document.getElementById('prod-stock').value = p.stock;
  document.getElementById('prod-image1').value = p.images && p.images[0] ? p.images[0] : '';
  document.getElementById('prod-image2').value = p.images && p.images[1] ? p.images[1] : '';
  document.getElementById('prod-desc').value = p.description;

  document.getElementById('prod-featured').checked = !!p.featured;
  document.getElementById('prod-trending').checked = !!p.isTrending;
  document.getElementById('prod-bestseller').checked = !!p.isBestSeller;
  document.getElementById('prod-newarrival').checked = !!p.isNewArrival;

  document.getElementById('product-modal').classList.add('show');
};

window.deleteProductAdmin = async function (productId) {
  if (!confirm('Are you sure you want to permanently delete this product?')) return;

  try {
    await api.delete(`/products/${productId}`);
    showToast('Product deleted.', 'info');
    loadProductsTable();
    loadDashboardData();
  } catch (err) {
    showToast(err.message || 'Could not delete product.', 'error');
  }
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
};

function getStatusBadge(status) {
  let badgeClass = 'badge-neutral';
  if (status === 'Delivered') badgeClass = 'badge-success';
  if (status === 'Confirmed') badgeClass = 'badge-primary';
  if (status === 'Processing') badgeClass = 'badge-warning';
  if (status === 'Shipped') badgeClass = 'badge-accent';
  if (status === 'Cancelled') badgeClass = 'badge-danger';
  return `<span class="badge ${badgeClass}">${status}</span>`;
}
