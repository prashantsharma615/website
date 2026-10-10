/**
 * Sukoon by Pallavi — Main JavaScript
 * Shared utilities: cart management, mobile menu, toast, product card rendering.
 */

// ===================== CART (LocalStorage) =====================
const Cart = {
  KEY: 'sukoon_cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateCount();
  },

  addItem(product, selectedSize, selectedColour, quantity = 1) {
    const items = this.getItems();
    const key = `${product.id}_${selectedSize}_${selectedColour}`;

    const existing = items.find(item => item.key === key);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        key,
        id: product.id,
        name: product.name,
        price: product.discount_price || product.price,
        originalPrice: product.price,
        image: product.images?.[0] || '',
        size: selectedSize,
        colour: selectedColour,
        quantity,
      });
    }

    this.saveItems(items);
    return true;
  },

  removeItem(key) {
    const items = this.getItems().filter(item => item.key !== key);
    this.saveItems(items);
  },

  updateQuantity(key, quantity) {
    const items = this.getItems();
    const item = items.find(i => i.key === key);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveItems(items);
    }
  },

  getTotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateCount();
  },

  updateCount() {
    const countEls = document.querySelectorAll('#cart-count');
    const count = this.getCount();
    countEls.forEach(el => { el.textContent = count; });
  },
};

// ===================== TOAST =====================
function showToast(message, type = 'success', duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ===================== MOBILE MENU =====================
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// ===================== CATEGORY NAMES =====================
function getCategoryName(slug) {
  const cat = CONFIG.categories.find(c => c.slug === slug);
  return cat ? cat.name : slug;
}

// ===================== FORMAT PRICE =====================
function formatPrice(amount) {
  return `${CONFIG.currency}${Number(amount).toLocaleString('en-IN')}`;
}

// ===================== PRODUCT CARD HTML =====================
function renderProductCard(product) {
  const image = product.images?.[0] || 'https://placehold.co/400x533/F0EBE1/9A938C?text=No+Image';
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : 0;

  let badgeHTML = '';
  if (hasDiscount) {
    badgeHTML = `<span class="product-badge sale">${discountPercent}% Off</span>`;
  } else if (product.is_new_arrival) {
    badgeHTML = `<span class="product-badge">New</span>`;
  }

  let priceHTML = '';
  if (hasDiscount) {
    priceHTML = `
      <span class="price-current">${formatPrice(product.discount_price)}</span>
      <span class="price-original">${formatPrice(product.price)}</span>
    `;
  } else {
    priceHTML = `<span class="price-current">${formatPrice(product.price)}</span>`;
  }

  return `
    <a href="product.html?id=${product.id}" class="product-card" id="product-${product.id}">
      <div class="product-card-image">
        <img src="${image}" alt="${product.name}" loading="lazy">
        ${badgeHTML}
      </div>
      <h3 class="product-card-name">${product.name}</h3>
      <p class="product-card-category">${getCategoryName(product.category)}</p>
      <div class="product-card-price">
        ${priceHTML}
      </div>
    </a>
  `;
}

// ===================== API FETCH HELPER WITH STATIC FALLBACK =====================
function handleProductsFallback(endpoint) {
  const url = new URL(endpoint, 'http://localhost');
  const pathParts = url.pathname.split('/').filter(Boolean);
  const products = (window.CONFIG && window.CONFIG.defaultProducts) ? window.CONFIG.defaultProducts : [];

  // Single product: /products/:id
  if (pathParts.length === 2 && pathParts[0] === 'products') {
    const id = pathParts[1];
    const found = products.find(p => p.id === id);
    if (!found) throw new Error('Product not found');
    return found;
  }

  // Product collection: /products?...
  let filtered = [...products];
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const featured = url.searchParams.get('featured');
  const newArrivals = url.searchParams.get('new_arrivals');
  const sort = url.searchParams.get('sort');

  if (category) filtered = filtered.filter(p => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }
  if (featured === '1') filtered = filtered.filter(p => p.is_featured === 1);
  if (newArrivals === '1') filtered = filtered.filter(p => p.is_new_arrival === 1);

  if (sort === 'price_asc') {
    filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
  } else {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return filtered;
}

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${CONFIG.apiBase}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // If backend is not running, fall back gracefully for GET requests
  }

  if (!options.method || options.method.toUpperCase() === 'GET') {
    if (endpoint.startsWith('/products')) {
      return handleProductsFallback(endpoint);
    }
  }

  throw new Error('Unable to communicate with server. Please ensure the backend server is running.');
}

// ===================== HOMEPAGE INIT =====================
async function initHomepage() {
  // Load new arrivals
  try {
    const newArrivals = await apiFetch('/products?new_arrivals=1');
    const grid = document.getElementById('new-arrivals-grid');
    if (grid) {
      if (newArrivals.length > 0) {
        grid.innerHTML = newArrivals.slice(0, 4).map(renderProductCard).join('');
      } else {
        grid.innerHTML = '<p style="text-align:center; color:var(--color-text-muted); grid-column:1/-1;">New arrivals coming soon.</p>';
      }
    }
  } catch (err) {
    console.error('Failed to load new arrivals:', err);
  }

  // Load featured products
  try {
    const featured = await apiFetch('/products?featured=1');
    const grid = document.getElementById('featured-grid');
    if (grid) {
      if (featured.length > 0) {
        grid.innerHTML = featured.slice(0, 4).map(renderProductCard).join('');
      } else {
        grid.innerHTML = '<p style="text-align:center; color:var(--color-text-muted); grid-column:1/-1;">Featured products coming soon.</p>';
      }
    }
  } catch (err) {
    console.error('Failed to load featured products:', err);
  }

  // Load category counts
  try {
    const allProducts = await apiFetch('/products');
    CONFIG.categories.forEach(cat => {
      const count = allProducts.filter(p => p.category === cat.slug).length;
      const el = document.getElementById(`count-${cat.slug}`);
      if (el) el.textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
    });
  } catch (err) {
    console.error('Failed to load category counts:', err);
  }
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCount();
  initMobileMenu();

  // Only run homepage init on index.html
  if (document.getElementById('new-arrivals-grid')) {
    initHomepage();
  }
});
