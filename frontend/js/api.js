/**
 * CraftCart Centralized API Client & State Helper
 */

const API_BASE = (window.location.port === '5000' || window.location.hostname === 'localhost')
  ? (window.location.port === '5000' ? '/api' : 'http://localhost:5000/api')
  : '/api';

const api = {
  getToken: () => localStorage.getItem('craftcart_token'),
  getUser: () => {
    try {
      const u = localStorage.getItem('craftcart_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },
  isLoggedIn: () => !!localStorage.getItem('craftcart_token'),
  isAdmin: () => {
    const user = api.getUser();
    return user && user.role === 'admin';
  },
  setAuth: (token, user) => {
    localStorage.setItem('craftcart_token', token);
    localStorage.setItem('craftcart_user', JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem('craftcart_token');
    localStorage.removeItem('craftcart_user');
  },

  request: async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = api.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If 401 unauthorized on protected call, clear expired session
        if (response.status === 401 && api.isLoggedIn()) {
          api.clearAuth();
          showToast('Session expired. Please log in again.', 'warning');
          setTimeout(() => {
            if (!window.location.pathname.includes('login.html')) {
              window.location.href = 'login.html';
            }
          }, 1200);
        }
        throw new Error(data.message || 'An error occurred while connecting to server.');
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  get: (endpoint) => api.request(endpoint, 'GET'),
  post: (endpoint, body) => api.request(endpoint, 'POST', body),
  put: (endpoint, body) => api.request(endpoint, 'PUT', body),
  delete: (endpoint) => api.request(endpoint, 'DELETE')
};

// Currency Formatter
function formatPrice(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Toast Notifications System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';
  if (type === 'warning') icon = '⚠';

  toast.innerHTML = `
    <span style="font-weight: 700; font-size: 1.1rem;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global update for Cart & Wishlist counts in Navbar
async function updateNavBadges() {
  const cartBadge = document.getElementById('nav-cart-badge');
  const wishBadge = document.getElementById('nav-wishlist-badge');

  if (!api.isLoggedIn()) {
    if (cartBadge) cartBadge.textContent = '0';
    if (wishBadge) wishBadge.textContent = '0';
    return;
  }

  try {
    const [cartRes, wishRes] = await Promise.all([
      api.get('/cart').catch(() => ({ cart: { itemCount: 0 } })),
      api.get('/wishlist').catch(() => ({ count: 0 }))
    ]);

    if (cartBadge && cartRes.cart) {
      cartBadge.textContent = cartRes.cart.itemCount || 0;
    }
    if (wishBadge) {
      wishBadge.textContent = wishRes.count !== undefined ? wishRes.count : (wishRes.wishlist ? wishRes.wishlist.length : 0);
    }
  } catch (err) {
    // Non-critical badge update failure
  }
}
