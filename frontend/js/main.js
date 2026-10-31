/**
 * CraftCart Main Global Script
 * Manages Header, Mobile Navigation, User Dropdown, Global Search & Footer
 */

document.addEventListener('DOMContentLoaded', () => {
  setupUserDropdown();
  setupMobileDrawer();
  setupGlobalSearch();
  setupNewsletter();
  updateNavBadges();
  highlightActiveNav();
});

// User Menu Dropdown & Auth state
function setupUserDropdown() {
  const userBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');
  const user = api.getUser();

  if (!dropdown) return;

  if (api.isLoggedIn() && user) {
    dropdown.innerHTML = `
      <div class="user-dropdown-header">
        <div class="dropdown-user-name">${user.name}</div>
        <div class="dropdown-user-email">${user.email}</div>
      </div>
      ${user.role === 'admin' ? `
        <a href="admin.html" class="user-dropdown-item">
          <span>🛡️</span> Admin Dashboard
        </a>
      ` : ''}
      <a href="profile.html" class="user-dropdown-item">
        <span>👤</span> My Profile
      </a>
      <a href="orders.html" class="user-dropdown-item">
        <span>📦</span> My Orders
      </a>
      <a href="wishlist.html" class="user-dropdown-item">
        <span>🤍</span> Wishlist
      </a>
      <div class="user-dropdown-divider"></div>
      <button id="logout-btn" class="user-dropdown-item" style="color: var(--danger); width: 100%; text-align: left;">
        <span>🚪</span> Logout
      </button>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        api.clearAuth();
        showToast('Logged out successfully.', 'info');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      });
    }
  } else {
    dropdown.innerHTML = `
      <a href="login.html" class="user-dropdown-item">
        <span>🔑</span> Sign In
      </a>
      <a href="register.html" class="user-dropdown-item">
        <span>✨</span> Create Account
      </a>
    `;
  }

  if (userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== userBtn) {
        dropdown.classList.remove('show');
      }
    });
  }
}

// Mobile Drawer
function setupMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const closeBtn = document.getElementById('close-drawer-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
}

// Global Search
function setupGlobalSearch() {
  const searchForm = document.getElementById('global-search-form');
  const searchInput = document.getElementById('global-search-input');
  const mobileSearchForm = document.getElementById('mobile-search-form');
  const mobileSearchInput = document.getElementById('mobile-search-input');

  const handleSearch = (query) => {
    if (!query || !query.trim()) return;
    window.location.href = `products.html?q=${encodeURIComponent(query.trim())}`;
  };

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSearch(searchInput.value);
    });
  }

  if (mobileSearchForm && mobileSearchInput) {
    mobileSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSearch(mobileSearchInput.value);
    });
  }
}

// Global Newsletter Subscription
function setupNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  if (!form || !input) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return;

    try {
      const res = await api.post('/newsletter/subscribe', { email });
      showToast(res.message || 'Subscribed successfully!', 'success');
      input.value = '';
    } catch (err) {
      showToast(err.message || 'Subscription failed.', 'error');
    }
  });
}

// Active Nav link
function highlightActiveNav() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (path.endsWith(href) || (path === '/' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

// Helper to generate star rating HTML
function renderStarRating(rating, numReviews = null) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  let starsHtml = '';

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHtml += '★';
    } else if (i === fullStars + 1 && hasHalf) {
      starsHtml += '★';
    } else {
      starsHtml += '☆';
    }
  }

  return `
    <div class="product-rating">
      <span class="stars">${starsHtml}</span>
      <span class="rating-val" style="font-weight:600; font-size:0.8rem; color:var(--text-primary);">${rating.toFixed(1)}</span>
      ${numReviews !== null ? `<span class="rating-count">(${numReviews})</span>` : ''}
    </div>
  `;
}

// Helper to create Product Card HTML
function createProductCardHTML(p) {
  const discount = p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

  let badgeHtml = '';
  if (p.isBestSeller) {
    badgeHtml = '<span class="product-tag-badge tag-bestseller">Best Seller</span>';
  } else if (p.isTrending) {
    badgeHtml = '<span class="product-tag-badge tag-trending">Trending</span>';
  } else if (p.isNewArrival) {
    badgeHtml = '<span class="product-tag-badge tag-new">New</span>';
  } else if (discount > 0) {
    badgeHtml = `<span class="product-tag-badge tag-sale">${discount}% OFF</span>`;
  }

  const primaryImage = (p.images && p.images.length > 0)
    ? p.images[0]
    : 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80';

  return `
    <div class="product-card" data-id="${p._id}">
      <div class="product-img-box">
        ${badgeHtml}
        <button class="product-wishlist-btn" onclick="handleToggleWishlist('${p._id}', event)" title="Save to Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <a href="product-details.html?id=${p.slug || p._id}">
          <img src="${primaryImage}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'">
        </a>
      </div>
      <div class="product-card-body">
        <span class="product-category-meta">${p.category}</span>
        <h3 class="product-title">
          <a href="product-details.html?id=${p.slug || p._id}">${p.name}</a>
        </h3>
        ${renderStarRating(p.rating, p.numReviews)}
        <div class="product-price-row">
          <span class="current-price">${formatPrice(p.price)}</span>
          ${p.originalPrice > p.price ? `<span class="original-price">${formatPrice(p.originalPrice)}</span>` : ''}
          ${discount > 0 ? `<span class="discount-tag">${discount}% off</span>` : ''}
        </div>
      </div>
      <div class="product-card-footer">
        <button class="product-add-cart-btn" onclick="handleAddToCart('${p._id}', 1, event)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

// Global Add to Cart Handler
async function handleAddToCart(productId, quantity = 1, event) {
  if (event) event.stopPropagation();

  if (!api.isLoggedIn()) {
    showToast('Please sign in to add items to your cart.', 'warning');
    setTimeout(() => {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    }, 1200);
    return;
  }

  try {
    const res = await api.post('/cart', { productId, quantity });
    showToast(res.message || 'Added to cart!', 'success');
    updateNavBadges();
  } catch (err) {
    showToast(err.message || 'Could not add to cart.', 'error');
  }
}

// Global Wishlist Toggle Handler
async function handleToggleWishlist(productId, event) {
  if (event) event.stopPropagation();

  if (!api.isLoggedIn()) {
    showToast('Please sign in to manage your wishlist.', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
    return;
  }

  try {
    const res = await api.post(`/wishlist/${productId}`);
    showToast(res.message, res.isAdded ? 'success' : 'info');
    updateNavBadges();
    
    // Update button styling if on page
    if (event && event.currentTarget) {
      if (res.isAdded) {
        event.currentTarget.classList.add('active');
      } else {
        event.currentTarget.classList.remove('active');
      }
    }
  } catch (err) {
    showToast(err.message || 'Could not update wishlist.', 'error');
  }
}
