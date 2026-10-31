/**
 * CraftCart Homepage Logic
 * Loads Categories, Trending, Best Sellers, and New Arrivals
 */

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadTrendingProducts();
  loadBestSellerProducts();
  loadNewArrivals();
});

// Category images fallback map
const categoryImages = {
  'Electronics': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
  'Fashion': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  'Home & Living': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  'Lifestyle': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'
};

async function loadCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  try {
    const res = await api.get('/products/meta/categories');
    if (!res.categories || res.categories.length === 0) return;

    container.innerHTML = res.categories.map(c => `
      <a href="products.html?category=${encodeURIComponent(c._id)}" class="category-card">
        <div class="cat-img-box">
          <img src="${c.sampleImage || categoryImages[c._id] || ''}" alt="${c._id}" loading="lazy">
        </div>
        <div class="cat-info">
          <h4 class="cat-title">${c._id}</h4>
          <span class="cat-count">${c.count} Handcrafted Items</span>
        </div>
      </a>
    `).join('');
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

async function loadTrendingProducts() {
  const container = document.getElementById('trending-products-grid');
  if (!container) return;

  try {
    const res = await api.get('/products?trending=true&limit=4');
    if (res.products && res.products.length > 0) {
      container.innerHTML = res.products.map(p => createProductCardHTML(p)).join('');
    }
  } catch (err) {
    container.innerHTML = '<p class="text-muted">Unable to load trending products.</p>';
  }
}

async function loadBestSellerProducts() {
  const container = document.getElementById('bestseller-products-grid');
  if (!container) return;

  try {
    const res = await api.get('/products?bestSeller=true&limit=4');
    if (res.products && res.products.length > 0) {
      container.innerHTML = res.products.map(p => createProductCardHTML(p)).join('');
    }
  } catch (err) {
    container.innerHTML = '<p class="text-muted">Unable to load best-selling products.</p>';
  }
}

async function loadNewArrivals() {
  const container = document.getElementById('newarrivals-products-grid');
  if (!container) return;

  try {
    const res = await api.get('/products?newArrival=true&limit=4');
    if (res.products && res.products.length > 0) {
      container.innerHTML = res.products.map(p => createProductCardHTML(p)).join('');
    }
  } catch (err) {
    container.innerHTML = '<p class="text-muted">Unable to load new arrivals.</p>';
  }
}
