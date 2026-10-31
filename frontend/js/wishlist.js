/**
 * CraftCart Wishlist Management Script
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!api.isLoggedIn()) {
    renderGuestWishlist();
    return;
  }

  loadWishlist();
});

function renderGuestWishlist() {
  const container = document.getElementById('wishlist-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <div class="empty-state-icon">🤍</div>
      <h3>Save Your Favorite Artisan Creations</h3>
      <p>Sign in to keep track of items you love, receive restock updates, and move them to your bag anytime.</p>
      <a href="login.html?redirect=wishlist.html" class="btn btn-primary">Sign In to View Wishlist</a>
    </div>
  `;
}

async function loadWishlist() {
  const container = document.getElementById('wishlist-grid');
  const countEl = document.getElementById('wishlist-header-count');
  if (!container) return;

  try {
    const res = await api.get('/wishlist');
    const items = res.wishlist || [];

    if (countEl) {
      countEl.textContent = `${items.length} saved item${items.length === 1 ? '' : 's'}`;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🤍</div>
          <h3>Your Wishlist is Empty</h3>
          <p>Tap the heart icon on any product to save items you admire for later.</p>
          <a href="products.html" class="btn btn-primary">Discover Products</a>
        </div>
      `;
      updateNavBadges();
      return;
    }

    container.innerHTML = items.map(p => `
      <div class="product-card" id="wishlist-item-${p._id}">
        <div class="product-img-box">
          <a href="product-details.html?id=${p.slug || p._id}">
            <img src="${(p.images && p.images.length > 0) ? p.images[0] : ''}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'">
          </a>
        </div>
        <div class="product-card-body">
          <span class="product-category-meta">${p.category}</span>
          <h3 class="product-title">
            <a href="product-details.html?id=${p.slug || p._id}">${p.name}</a>
          </h3>
          <div class="product-price-row">
            <span class="current-price">${formatPrice(p.price)}</span>
            ${p.originalPrice > p.price ? `<span class="original-price">${formatPrice(p.originalPrice)}</span>` : ''}
          </div>
          <div style="font-size: 0.8rem; font-weight: 600; color: ${p.stock > 0 ? 'var(--success)' : 'var(--danger)'};">
            ${p.stock > 0 ? `● In Stock (${p.stock} available)` : '● Out of Stock'}
          </div>
        </div>
        <div class="product-card-footer" style="display:flex; flex-direction:column; gap:0.5rem;">
          <button class="btn btn-primary btn-sm btn-block" onclick="moveItemToCart('${p._id}')" ${p.stock <= 0 ? 'disabled' : ''}>
            Move to Cart
          </button>
          <button class="btn btn-secondary btn-sm btn-block" onclick="removeWishlistItem('${p._id}')" style="color:var(--danger);">
            Remove from Wishlist
          </button>
        </div>
      </div>
    `).join('');

    updateNavBadges();
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p class="text-muted">Unable to load wishlist.</p>
      </div>
    `;
  }
}

window.moveItemToCart = async function (productId) {
  try {
    await api.post('/cart', { productId, quantity: 1 });
    await api.delete(`/wishlist/${productId}`);
    showToast('Moved to your shopping cart!', 'success');
    loadWishlist();
  } catch (err) {
    showToast(err.message || 'Could not move item to cart.', 'error');
  }
};

window.removeWishlistItem = async function (productId) {
  try {
    await api.delete(`/wishlist/${productId}`);
    showToast('Removed from wishlist.', 'info');
    loadWishlist();
  } catch (err) {
    showToast(err.message, 'error');
  }
};
