/**
 * CraftCart Shopping Cart Logic
 * Real-time Quantity Sync, Coupon Code (CRAFT10), Shipping Calculator & Empty States
 */

let appliedCoupon = localStorage.getItem('craftcart_coupon') || '';

document.addEventListener('DOMContentLoaded', () => {
  if (!api.isLoggedIn()) {
    renderGuestCart();
    return;
  }

  loadCart();
  setupCouponForm();
});

function renderGuestCart() {
  const container = document.getElementById('cart-page-content');
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <div class="empty-state-icon">🛒</div>
      <h3>Your Shopping Cart is Empty</h3>
      <p>Sign in to view your saved cart items, synchronize across devices, and check out securely.</p>
      <div style="display:flex; justify-content:center; gap:1rem;">
        <a href="login.html?redirect=cart.html" class="btn btn-primary">Sign In</a>
        <a href="products.html" class="btn btn-secondary">Continue Shopping</a>
      </div>
    </div>
  `;
}

async function loadCart() {
  const container = document.getElementById('cart-page-content');
  if (!container) return;

  try {
    const res = await api.get('/cart');
    const cart = res.cart;

    if (!cart || !cart.items || cart.items.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🧺</div>
          <h3>Your CraftCart Bag is Empty</h3>
          <p>Explore our handcrafted collections and discover timeless artisan treasures.</p>
          <a href="products.html" class="btn btn-primary">Explore Products</a>
        </div>
      `;
      updateNavBadges();
      return;
    }

    renderCartUI(cart);
    updateNavBadges();
  } catch (err) {
    showToast('Failed to load cart.', 'error');
  }
}

function renderCartUI(cart) {
  const itemsContainer = document.getElementById('cart-items-tbody');
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');
  const progressText = document.getElementById('free-shipping-text');
  const progressBar = document.getElementById('free-shipping-bar');

  if (itemsContainer) {
    itemsContainer.innerHTML = cart.items.map(item => `
      <tr data-id="${item.productId}">
        <td class="cart-product-cell">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'">
          <div>
            <h4 class="cart-item-name"><a href="product-details.html?id=${item.productId}">${item.name}</a></h4>
            <span class="cart-item-price">${formatPrice(item.price)} each</span>
          </div>
        </td>
        <td>
          <div class="qty-control">
            <button class="qty-btn" onclick="updateItemQuantity('${item.productId}', ${item.quantity - 1})">−</button>
            <input type="text" class="qty-input" value="${item.quantity}" readonly>
            <button class="qty-btn" onclick="updateItemQuantity('${item.productId}', ${item.quantity + 1})">+</button>
          </div>
        </td>
        <td>
          <strong>${formatPrice(item.itemTotal)}</strong>
        </td>
        <td>
          <button class="cart-item-remove-btn" onclick="removeItemFromCart('${item.productId}')">
            ✕ Remove
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Calculate discounts if applied
  let discountAmount = 0;
  if (appliedCoupon.toUpperCase() === 'CRAFT10') {
    discountAmount = Math.round(cart.subtotal * 0.1);
  }

  const finalTotal = Math.max(0, cart.subtotal + cart.shippingCost - discountAmount);

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

  // Free shipping threshold (₹999)
  if (progressText && progressBar) {
    if (cart.subtotal >= 999) {
      progressText.textContent = '🎉 Congratulations! You have unlocked FREE Express Delivery.';
      progressBar.style.width = '100%';
    } else {
      const remaining = 999 - cart.subtotal;
      const pct = Math.min(100, (cart.subtotal / 999) * 100);
      progressText.textContent = `Add ${formatPrice(remaining)} more to qualify for FREE Delivery.`;
      progressBar.style.width = `${pct}%`;
    }
  }
}

window.updateItemQuantity = async function (productId, newQty) {
  try {
    await api.put(`/cart/${productId}`, { quantity: newQty });
    loadCart();
  } catch (err) {
    showToast(err.message || 'Could not update quantity.', 'error');
  }
};

window.removeItemFromCart = async function (productId) {
  try {
    await api.delete(`/cart/${productId}`);
    showToast('Item removed from cart.', 'info');
    loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

window.clearEntireCart = async function () {
  if (!confirm('Are you sure you want to empty your entire cart?')) return;
  try {
    await api.delete('/cart');
    showToast('Cart emptied.', 'info');
    loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

function setupCouponForm() {
  const form = document.getElementById('coupon-form');
  const input = document.getElementById('coupon-input');
  const statusEl = document.getElementById('coupon-status');

  if (input && appliedCoupon) {
    input.value = appliedCoupon;
    if (statusEl) {
      statusEl.textContent = 'Coupon CRAFT10 applied (10% off)';
      statusEl.style.color = 'var(--success)';
    }
  }

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = input.value.trim().toUpperCase();

      if (code === 'CRAFT10') {
        appliedCoupon = 'CRAFT10';
        localStorage.setItem('craftcart_coupon', 'CRAFT10');
        showToast('Promo code CRAFT10 applied! 10% discount included.', 'success');
        if (statusEl) {
          statusEl.textContent = 'Coupon CRAFT10 applied (10% off)';
          statusEl.style.color = 'var(--success)';
        }
        loadCart();
      } else {
        showToast('Invalid promo code. Try "CRAFT10"', 'warning');
        if (statusEl) {
          statusEl.textContent = 'Invalid code. Use CRAFT10 for 10% off.';
          statusEl.style.color = 'var(--danger)';
        }
      }
    });
  }
}
