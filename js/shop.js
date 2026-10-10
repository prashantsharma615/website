/**
 * Sukoon by Pallavi — Shop Page JavaScript
 * Category filtering, search, sort, product grid rendering.
 */

(function () {
  let allProducts = [];
  let currentCategory = '';
  let currentSearch = '';
  let currentSort = 'newest';

  const grid = document.getElementById('products-grid');
  const noProducts = document.getElementById('no-products');
  const resultsInfo = document.getElementById('results-info');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const categoryTabs = document.getElementById('category-tabs');
  const shopTitle = document.getElementById('shop-title');

  // Read category from URL
  function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || '';
  }

  // Load all products
  async function loadProducts() {
    try {
      allProducts = await apiFetch('/products');
      currentCategory = getCategoryFromURL();

      // Set active category tab
      updateCategoryTabs();
      renderProducts();
    } catch (err) {
      grid.innerHTML = '<p style="text-align:center; color:var(--color-text-muted); grid-column:1/-1;">Failed to load products. Please try again.</p>';
    }
  }

  // Filter & sort, then render
  function renderProducts() {
    let filtered = [...allProducts];

    // Category filter
    if (currentCategory) {
      filtered = filtered.filter(p => p.category === currentCategory);
      const catName = getCategoryName(currentCategory);
      shopTitle.textContent = catName;
    } else {
      shopTitle.textContent = 'All Products';
    }

    // Search filter
    if (currentSearch) {
      const query = currentSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (currentSort) {
      case 'price_asc':
        filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Render
    if (filtered.length > 0) {
      grid.innerHTML = filtered.map(renderProductCard).join('');
      grid.style.display = '';
      noProducts.style.display = 'none';
      resultsInfo.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`;
    } else {
      grid.innerHTML = '';
      grid.style.display = 'none';
      noProducts.style.display = '';
      resultsInfo.textContent = '';
    }
  }

  function updateCategoryTabs() {
    categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
      const cat = tab.dataset.category;
      if (cat === currentCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  // Event listeners
  categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-tab')) {
      currentCategory = e.target.dataset.category;

      // Update URL without reload
      const url = new URL(window.location);
      if (currentCategory) {
        url.searchParams.set('category', currentCategory);
      } else {
        url.searchParams.delete('category');
      }
      window.history.pushState({}, '', url);

      updateCategoryTabs();
      renderProducts();
    }
  });

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderProducts();
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    currentCategory = getCategoryFromURL();
    updateCategoryTabs();
    renderProducts();
  });

  // Initialize
  loadProducts();
})();
