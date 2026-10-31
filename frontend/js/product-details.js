/**
 * CraftCart Product Details Page Logic
 * Image Gallery, Stock Management, Cart/Buy Now, Related Products & Reviews
 */

let currentProduct = null;
let currentQuantity = 1;
let selectedRating = 5;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idOrSlug = params.get('id');

  if (!idOrSlug) {
    window.location.href = 'products.html';
    return;
  }

  loadProductDetails(idOrSlug);
  setupReviewForm(idOrSlug);
});

async function loadProductDetails(idOrSlug) {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  try {
    const res = await api.get(`/products/${idOrSlug}`);
    currentProduct = res.product;
    const related = res.relatedProducts || [];

    document.title = `${currentProduct.name} — CraftCart`;

    // Render breadcrumbs
    const bcCat = document.getElementById('bc-category');
    const bcTitle = document.getElementById('bc-product-name');
    if (bcCat) {
      bcCat.textContent = currentProduct.category;
      bcCat.href = `products.html?category=${encodeURIComponent(currentProduct.category)}`;
    }
    if (bcTitle) bcTitle.textContent = currentProduct.name;

    // Render Main Info
    renderProductGallery(currentProduct.images);
    renderProductInfo(currentProduct);
    renderRelatedProducts(related);
    loadProductReviews(currentProduct._id);
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠️</div>
        <h3>Product Not Found</h3>
        <p>${err.message || 'The product you are looking for does not exist or has been removed.'}</p>
        <a href="products.html" class="btn btn-primary">Browse All Products</a>
      </div>
    `;
  }
}

function renderProductGallery(images) {
  const mainImg = document.getElementById('gallery-main');
  const thumbsContainer = document.getElementById('gallery-thumbs');

  if (!images || images.length === 0) return;

  if (mainImg) {
    mainImg.src = images[0];
    mainImg.alt = currentProduct.name;
  }

  if (thumbsContainer) {
    thumbsContainer.innerHTML = images.map((imgUrl, idx) => `
      <button class="thumbnail-btn ${idx === 0 ? 'active' : ''}" onclick="switchGalleryImage('${imgUrl}', this)">
        <img src="${imgUrl}" alt="Thumbnail ${idx + 1}" onerror="this.src='https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'">
      </button>
    `).join('');
  }
}

window.switchGalleryImage = function (url, btn) {
  const mainImg = document.getElementById('gallery-main');
  if (mainImg) mainImg.src = url;

  document.querySelectorAll('.thumbnail-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
};

function renderProductInfo(p) {
  document.getElementById('details-category').textContent = p.category;
  document.getElementById('details-title').textContent = p.name;
  document.getElementById('details-rating-box').innerHTML = renderStarRating(p.rating, p.numReviews);
  document.getElementById('details-price').textContent = formatPrice(p.price);

  const origPriceEl = document.getElementById('details-orig-price');
  const discountPillEl = document.getElementById('details-discount-pill');

  if (p.originalPrice > p.price) {
    origPriceEl.textContent = formatPrice(p.originalPrice);
    origPriceEl.style.display = 'inline';
    const pct = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    discountPillEl.textContent = `${pct}% OFF`;
    discountPillEl.style.display = 'inline-block';
  } else {
    origPriceEl.style.display = 'none';
    discountPillEl.style.display = 'none';
  }

  document.getElementById('details-desc').textContent = p.description;

  // Stock status
  const stockBadge = document.getElementById('details-stock-badge');
  if (p.stock > 0) {
    stockBadge.className = 'stock-status-badge in-stock';
    stockBadge.innerHTML = `● In Stock (${p.stock} units available)`;
  } else {
    stockBadge.className = 'stock-status-badge out-stock';
    stockBadge.innerHTML = '● Out of Stock';
  }

  // Highlights
  const highlightsContainer = document.getElementById('details-highlights');
  if (p.highlights && p.highlights.length > 0) {
    highlightsContainer.innerHTML = p.highlights.map(h => `<li>${h}</li>`).join('');
  } else {
    highlightsContainer.parentElement.style.display = 'none';
  }

  // Quantity controls
  const qtyInput = document.getElementById('qty-input');
  const minusBtn = document.getElementById('qty-minus-btn');
  const plusBtn = document.getElementById('qty-plus-btn');

  if (qtyInput && minusBtn && plusBtn) {
    minusBtn.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyInput.value = currentQuantity;
      }
    });

    plusBtn.addEventListener('click', () => {
      if (currentQuantity < p.stock) {
        currentQuantity++;
        qtyInput.value = currentQuantity;
      } else {
        showToast(`Only ${p.stock} items in stock.`, 'warning');
      }
    });
  }

  // Add to cart button
  const addCartBtn = document.getElementById('add-to-cart-btn');
  if (addCartBtn) {
    if (p.stock <= 0) {
      addCartBtn.disabled = true;
      addCartBtn.textContent = 'Out of Stock';
    } else {
      addCartBtn.addEventListener('click', () => {
        handleAddToCart(p._id, currentQuantity);
      });
    }
  }

  // Buy Now button
  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    if (p.stock <= 0) {
      buyNowBtn.disabled = true;
    } else {
      buyNowBtn.addEventListener('click', async () => {
        if (!api.isLoggedIn()) {
          showToast('Please sign in to proceed with checkout.', 'warning');
          setTimeout(() => {
            window.location.href = `login.html?redirect=checkout.html`;
          }, 1200);
          return;
        }

        try {
          await api.post('/cart', { productId: p._id, quantity: currentQuantity });
          window.location.href = 'checkout.html';
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }
  }

  // Wishlist toggle
  const wishBtn = document.getElementById('details-wishlist-btn');
  if (wishBtn) {
    wishBtn.addEventListener('click', (e) => {
      handleToggleWishlist(p._id, e);
    });
  }
}

function renderRelatedProducts(products) {
  const container = document.getElementById('related-products-grid');
  if (!container || !products || products.length === 0) {
    if (container) container.parentElement.style.display = 'none';
    return;
  }

  container.innerHTML = products.map(p => createProductCardHTML(p)).join('');
}

// Reviews
async function loadProductReviews(productId) {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  try {
    const res = await api.get(`/products/${productId}/reviews`);
    if (!res.reviews || res.reviews.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 2rem;">
          <p>No customer reviews yet. Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = res.reviews.map(r => `
      <div class="review-item">
        <div class="review-item-header">
          <span class="review-author">${r.user?.name || 'Verified Buyer'}</span>
          <span class="review-date">${new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="stars" style="margin-bottom: 0.35rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        ${r.title ? `<h5 style="margin-bottom: 0.25rem;">${r.title}</h5>` : ''}
        <p class="review-comment">${r.comment}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="text-muted">Unable to load reviews.</p>';
  }
}

function setupReviewForm(productId) {
  const stars = document.querySelectorAll('#star-rating-selector .star-item');
  const form = document.getElementById('add-review-form');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'), 10);
      stars.forEach(s => {
        const val = parseInt(s.getAttribute('data-value'), 10);
        if (val <= selectedRating) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!api.isLoggedIn()) {
        showToast('Please sign in to write a review.', 'warning');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
        return;
      }

      const titleInput = document.getElementById('review-title');
      const commentInput = document.getElementById('review-comment');

      try {
        const body = {
          rating: selectedRating,
          title: titleInput ? titleInput.value.trim() : '',
          comment: commentInput.value.trim()
        };

        const res = await api.post(`/products/${productId}/reviews`, body);
        showToast(res.message || 'Review submitted successfully!', 'success');
        if (commentInput) commentInput.value = '';
        if (titleInput) titleInput.value = '';

        // Reload reviews & product rating
        loadProductReviews(productId);
      } catch (err) {
        showToast(err.message || 'Failed to submit review.', 'error');
      }
    });
  }
}
