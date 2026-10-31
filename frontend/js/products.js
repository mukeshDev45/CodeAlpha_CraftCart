/**
 * CraftCart Products Catalog Page
 * Search, Category Filtering, Price Slider, Rating, Sort & Pagination
 */

let state = {
  q: '',
  category: 'All',
  minPrice: '',
  maxPrice: '',
  rating: '',
  sort: 'newest',
  page: 1,
  limit: 12
};

document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  setupFilterEvents();
  fetchProducts();
});

function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) state.q = params.get('q');
  if (params.get('category')) state.category = params.get('category');
  if (params.get('sort')) state.sort = params.get('sort');
  if (params.get('minPrice')) state.minPrice = params.get('minPrice');
  if (params.get('maxPrice')) state.maxPrice = params.get('maxPrice');
  if (params.get('rating')) state.rating = params.get('rating');
  if (params.get('page')) state.page = parseInt(params.get('page'), 10) || 1;

  // Sync inputs with state
  const searchInput = document.getElementById('shop-search-input');
  if (searchInput && state.q) searchInput.value = state.q;

  const minInput = document.getElementById('min-price-input');
  if (minInput && state.minPrice) minInput.value = state.minPrice;

  const maxInput = document.getElementById('max-price-input');
  if (maxInput && state.maxPrice) maxInput.value = state.maxPrice;

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect && state.sort) sortSelect.value = state.sort;

  // Check category radio
  const catRadios = document.querySelectorAll('input[name="category-filter"]');
  catRadios.forEach(r => {
    if (r.value.toLowerCase() === state.category.toLowerCase()) {
      r.checked = true;
    }
  });

  // Check rating radio
  if (state.rating) {
    const ratingRadio = document.querySelector(`input[name="rating-filter"][value="${state.rating}"]`);
    if (ratingRadio) ratingRadio.checked = true;
  }
}

function setupFilterEvents() {
  // Category change
  const catRadios = document.querySelectorAll('input[name="category-filter"]');
  catRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      state.category = radio.value;
      state.page = 1;
      fetchProducts();
    });
  });

  // Rating change
  const ratingRadios = document.querySelectorAll('input[name="rating-filter"]');
  ratingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      state.rating = radio.value;
      state.page = 1;
      fetchProducts();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      state.page = 1;
      fetchProducts();
    });
  }

  // Price apply button
  const priceForm = document.getElementById('price-filter-form');
  if (priceForm) {
    priceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const minInput = document.getElementById('min-price-input');
      const maxInput = document.getElementById('max-price-input');
      state.minPrice = minInput ? minInput.value.trim() : '';
      state.maxPrice = maxInput ? maxInput.value.trim() : '';
      state.page = 1;
      fetchProducts();
    });
  }

  // Shop internal search form
  const shopSearchForm = document.getElementById('shop-search-form');
  if (shopSearchForm) {
    shopSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('shop-search-input');
      state.q = input ? input.value.trim() : '';
      state.page = 1;
      fetchProducts();
    });
  }

  // Clear filters button
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state = {
        q: '',
        category: 'All',
        minPrice: '',
        maxPrice: '',
        rating: '',
        sort: 'newest',
        page: 1,
        limit: 12
      };

      document.querySelectorAll('input[name="category-filter"]').forEach(r => (r.checked = r.value === 'All'));
      document.querySelectorAll('input[name="rating-filter"]').forEach(r => (r.checked = false));
      const minInput = document.getElementById('min-price-input');
      const maxInput = document.getElementById('max-price-input');
      const searchInput = document.getElementById('shop-search-input');
      const sortSelect = document.getElementById('sort-select');

      if (minInput) minInput.value = '';
      if (maxInput) maxInput.value = '';
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'newest';

      fetchProducts();
    });
  }
}

async function fetchProducts() {
  const grid = document.getElementById('products-catalog-grid');
  const countEl = document.getElementById('results-count');
  const paginationEl = document.getElementById('pagination-container');

  if (!grid) return;

  grid.innerHTML = `
    <div class="loading-container" style="grid-column: 1 / -1;">
      <div class="spinner"></div>
      <p>Discovering handcrafted items...</p>
    </div>
  `;

  // Build query string
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.category && state.category !== 'All') params.set('category', state.category);
  if (state.minPrice) params.set('minPrice', state.minPrice);
  if (state.maxPrice) params.set('maxPrice', state.maxPrice);
  if (state.rating) params.set('rating', state.rating);
  if (state.sort) params.set('sort', state.sort);
  params.set('page', state.page);
  params.set('limit', state.limit);

  // Update browser address bar without reload
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);

  try {
    const data = await api.get(`/products?${params.toString()}`);

    if (countEl) {
      countEl.textContent = `Showing ${data.count} of ${data.total} products`;
    }

    if (!data.products || data.products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔍</div>
          <h3>No products match your criteria</h3>
          <p>Try resetting your filters, searching for another term, or exploring different categories.</p>
          <button class="btn btn-outline" onclick="document.getElementById('clear-filters-btn').click()">Reset Filters</button>
        </div>
      `;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    grid.innerHTML = data.products.map(p => createProductCardHTML(p)).join('');
    renderPagination(data.currentPage, data.totalPages);
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠️</div>
        <h3>Unable to load catalog</h3>
        <p>${err.message || 'Please check your connection and try again.'}</p>
        <button class="btn btn-primary" onclick="fetchProducts()">Retry</button>
      </div>
    `;
  }
}

function renderPagination(current, total) {
  const container = document.getElementById('pagination-container');
  if (!container || total <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  let html = '';

  // Prev Button
  html += `
    <button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="goToPage(${current - 1})">
      &larr; Prev
    </button>
  `;

  for (let i = 1; i <= total; i++) {
    html += `
      <button class="page-btn ${i === current ? 'active' : ''}" onclick="goToPage(${i})">
        ${i}
      </button>
    `;
  }

  // Next Button
  html += `
    <button class="page-btn" ${current === total ? 'disabled' : ''} onclick="goToPage(${current + 1})">
      Next &rarr;
    </button>
  `;

  container.innerHTML = html;
}

window.goToPage = function (page) {
  state.page = page;
  fetchProducts();
  window.scrollTo({ top: 180, behavior: 'smooth' });
};
