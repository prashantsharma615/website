/**
 * Sukoon by Pallavi — Admin Dashboard JavaScript
 * Complete admin functionality: authentication, stats, product CRUD,
 * image preview & upload, tags management, and confirmation dialogs.
 */

(function () {
  // State
  let products = [];
  let currentEditId = null;
  let currentDeleteId = null;
  let currentSizes = [];
  let currentColours = [];
  let selectedFiles = [];
  let removeImages = [];

  // DOM Elements - Auth
  const loginScreen = document.getElementById('login-screen');
  const loginForm = document.getElementById('login-form');
  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');
  const btnLogin = document.getElementById('btn-login');
  const adminDashboard = document.getElementById('admin-dashboard');
  const btnLogout = document.getElementById('btn-logout');

  // DOM Elements - Stats
  const statTotal = document.getElementById('stat-total');
  const statInStock = document.getElementById('stat-in-stock');
  const statOutOfStock = document.getElementById('stat-out-of-stock');
  const statFeatured = document.getElementById('stat-featured');

  // DOM Elements - Table
  const productsTableBody = document.getElementById('products-table-body');
  const btnAddProduct = document.getElementById('btn-add-product');

  // DOM Elements - Modal & Form
  const productModal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalSave = document.getElementById('btn-modal-save');
  const productForm = document.getElementById('product-form');

  const prodName = document.getElementById('prod-name');
  const prodCategory = document.getElementById('prod-category');
  const prodPrice = document.getElementById('prod-price');
  const prodDiscount = document.getElementById('prod-discount');
  const prodDescription = document.getElementById('prod-description');
  const prodStock = document.getElementById('prod-stock');
  const prodFeatured = document.getElementById('prod-featured');
  const prodNew = document.getElementById('prod-new');
  const prodAvailable = document.getElementById('prod-available');

  // Tags
  const sizesInput = document.getElementById('sizes-input');
  const sizesText = document.getElementById('sizes-text');
  const prodSizesHidden = document.getElementById('prod-sizes');
  const coloursInput = document.getElementById('colours-input');
  const coloursText = document.getElementById('colours-text');
  const prodColoursHidden = document.getElementById('prod-colours');

  // Images
  const imageUploadArea = document.getElementById('image-upload-area');
  const prodImagesInput = document.getElementById('prod-images');
  const imagePreviews = document.getElementById('image-previews');
  const existingImagesGroup = document.getElementById('existing-images-group');
  const existingImages = document.getElementById('existing-images');

  // Confirm Dialog
  const confirmDialog = document.getElementById('confirm-dialog');
  const confirmMessage = document.getElementById('confirm-message');
  const confirmCancel = document.getElementById('confirm-cancel');
  const confirmOk = document.getElementById('confirm-ok');

  // Toast
  const adminToast = document.getElementById('admin-toast');

  // ===================== TOAST NOTIFICATIONS =====================
  function showAdminToast(msg, isError = false) {
    if (!adminToast) return;
    adminToast.textContent = msg;
    adminToast.style.background = isError ? 'var(--admin-error)' : 'var(--admin-black)';
    adminToast.classList.add('show');
    setTimeout(() => {
      adminToast.classList.remove('show');
    }, 3200);
  }

  // ===================== AUTHENTICATION =====================
  async function checkAuth() {
    try {
      const res = await fetch(`${CONFIG.apiBase}/auth/status`);
      const data = await res.json();
      if (data.isAuthenticated) {
        showDashboard();
      } else {
        showLogin();
      }
    } catch {
      showLogin();
    }
  }

  function showDashboard() {
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';
    loadStats();
    loadProducts();
  }

  function showLogin() {
    if (adminDashboard) adminDashboard.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    if (loginError) loginError.classList.remove('show');
    if (loginPasswordInput) loginPasswordInput.value = '';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.classList.remove('show');
      btnLogin.disabled = true;
      btnLogin.textContent = 'Signing In...';

      const username = loginUsernameInput.value.trim();
      const password = loginPasswordInput.value;

      try {
        const res = await fetch(`${CONFIG.apiBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          showDashboard();
          showAdminToast('Signed in successfully.');
        } else {
          loginError.textContent = data.error || 'Invalid credentials.';
          loginError.classList.add('show');
        }
      } catch {
        loginError.textContent = 'Unable to connect to server. Please ensure the backend is running.';
        loginError.classList.add('show');
      } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Sign In';
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try {
        await fetch(`${CONFIG.apiBase}/auth/logout`, { method: 'POST' });
      } catch (err) {
        console.error('Logout error:', err);
      }
      showLogin();
      showAdminToast('Signed out.');
    });
  }

  // ===================== STATS & PRODUCTS =====================
  async function loadStats() {
    try {
      const res = await fetch(`${CONFIG.apiBase}/admin/stats`);
      if (!res.ok) return;
      const data = await res.json();
      if (statTotal) statTotal.textContent = data.total ?? '0';
      if (statInStock) statInStock.textContent = data.inStock ?? '0';
      if (statOutOfStock) statOutOfStock.textContent = data.outOfStock ?? '0';
      if (statFeatured) statFeatured.textContent = data.featured ?? '0';
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  async function loadProducts() {
    try {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--admin-text-muted);">
            Loading products...
          </td>
        </tr>
      `;

      const res = await fetch(`${CONFIG.apiBase}/admin/products`);
      if (!res.ok) throw new Error('Failed to load products');
      products = await res.json();
      renderProductsTable();
    } catch (err) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--admin-error);">
            Failed to load products. Check server connection.
          </td>
        </tr>
      `;
    }
  }

  function getCategoryName(slug) {
    const found = CONFIG.categories.find(c => c.slug === slug);
    return found ? found.name : slug;
  }

  function renderProductsTable() {
    if (!productsTableBody) return;

    if (products.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 3rem; color: var(--admin-text-muted);">
            No products found. Click "+ Add Product" to create your first item.
          </td>
        </tr>
      `;
      return;
    }

    productsTableBody.innerHTML = products.map(p => {
      const img = p.images?.[0] || 'https://placehold.co/48x60/F0EBE1/9A938C?text=No+Img';

      let priceDisplay = `₹${Number(p.price).toLocaleString('en-IN')}`;
      if (p.discount_price && p.discount_price < p.price) {
        priceDisplay = `
          <div>₹${Number(p.discount_price).toLocaleString('en-IN')}</div>
          <del style="font-size:0.75rem; color:var(--admin-text-muted);">₹${Number(p.price).toLocaleString('en-IN')}</del>
        `;
      }

      let stockBadge = '';
      if (p.stock === 0) {
        stockBadge = '<span class="badge badge-error">Out of Stock</span>';
      } else if (p.stock <= 5) {
        stockBadge = `<span class="badge badge-warning">Low (${p.stock})</span>`;
      } else {
        stockBadge = '<span class="badge badge-success">In Stock</span>';
      }

      const flags = [];
      if (p.is_featured) flags.push('<span class="badge badge-info">Featured</span>');
      if (p.is_new_arrival) flags.push('<span class="badge badge-info">New</span>');
      if (!p.is_available) flags.push('<span class="badge badge-error">Hidden</span>');
      const flagsDisplay = flags.length > 0 ? flags.join(' ') : '—';

      return `
        <tr data-id="${p.id}">
          <td>
            <img src="${img}" alt="${escapeHtml(p.name)}" class="table-product-thumb" onerror="this.src='https://placehold.co/48x60/F0EBE1/9A938C?text=No+Img'">
          </td>
          <td>
            <div class="table-product-name">${escapeHtml(p.name)}</div>
            <div class="table-product-id">ID: ${escapeHtml(p.id)}</div>
          </td>
          <td>${escapeHtml(getCategoryName(p.category))}</td>
          <td>${priceDisplay}</td>
          <td>${p.stock}</td>
          <td>${stockBadge}</td>
          <td>${flagsDisplay}</td>
          <td>
            <div class="table-actions">
              <button class="btn-edit" data-id="${p.id}">Edit</button>
              <button class="btn-delete" data-id="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row button events
    productsTableBody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });

    productsTableBody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteConfirm(btn.dataset.id));
    });
  }

  // ===================== TAGS (Sizes & Colours) =====================
  function renderTags(container, tagsArray, onRemove) {
    // Keep the input element
    const inputEl = container.querySelector('.tags-text-input');
    container.innerHTML = '';

    tagsArray.forEach((tag, idx) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.innerHTML = `${escapeHtml(tag)} <span class="tag-remove" data-idx="${idx}">&times;</span>`;
      tagEl.querySelector('.tag-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        onRemove(idx);
      });
      container.appendChild(tagEl);
    });

    container.appendChild(inputEl);
  }

  function setupTagInputs() {
    // Sizes
    if (sizesText) {
      sizesText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = sizesText.value.trim().replace(/^,+|,+$/g, '');
          if (val && !currentSizes.includes(val)) {
            currentSizes.push(val);
            updateSizes();
          }
          sizesText.value = '';
        }
      });
    }

    if (sizesInput) {
      sizesInput.addEventListener('click', () => sizesText && sizesText.focus());
    }

    // Colours
    if (coloursText) {
      coloursText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = coloursText.value.trim().replace(/^,+|,+$/g, '');
          if (val && !currentColours.includes(val)) {
            currentColours.push(val);
            updateColours();
          }
          coloursText.value = '';
        }
      });
    }

    if (coloursInput) {
      coloursInput.addEventListener('click', () => coloursText && coloursText.focus());
    }
  }

  function updateSizes() {
    renderTags(sizesInput, currentSizes, (idx) => {
      currentSizes.splice(idx, 1);
      updateSizes();
    });
    if (prodSizesHidden) prodSizesHidden.value = JSON.stringify(currentSizes);
  }

  function updateColours() {
    renderTags(coloursInput, currentColours, (idx) => {
      currentColours.splice(idx, 1);
      updateColours();
    });
    if (prodColoursHidden) prodColoursHidden.value = JSON.stringify(currentColours);
  }

  // ===================== IMAGE UPLOAD & PREVIEWS =====================
  function setupImageUpload() {
    if (!imageUploadArea || !prodImagesInput) return;

    imageUploadArea.addEventListener('click', () => {
      prodImagesInput.click();
    });

    imageUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      imageUploadArea.style.borderColor = 'var(--admin-black)';
    });

    imageUploadArea.addEventListener('dragleave', () => {
      imageUploadArea.style.borderColor = 'var(--admin-border)';
    });

    imageUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      imageUploadArea.style.borderColor = 'var(--admin-border)';
      if (e.dataTransfer.files) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    prodImagesInput.addEventListener('change', () => {
      if (prodImagesInput.files) {
        handleFiles(Array.from(prodImagesInput.files));
      }
    });
  }

  function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    files.forEach(file => {
      if (!validTypes.includes(file.type)) {
        showAdminToast(`File "${file.name}" is not a JPG, PNG, or WebP.`, true);
        return;
      }
      if (file.size > maxSize) {
        showAdminToast(`File "${file.name}" exceeds 5MB size limit.`, true);
        return;
      }
      selectedFiles.push(file);
    });

    renderImagePreviews();
  }

  function renderImagePreviews() {
    if (!imagePreviews) return;
    imagePreviews.innerHTML = '';

    selectedFiles.forEach((file, index) => {
      const preview = document.createElement('div');
      preview.className = 'image-preview';
      const url = URL.createObjectURL(file);

      preview.innerHTML = `
        <img src="${url}" alt="Preview">
        <button type="button" class="remove-image" data-index="${index}">&times;</button>
      `;

      preview.querySelector('.remove-image').addEventListener('click', (e) => {
        e.stopPropagation();
        selectedFiles.splice(index, 1);
        renderImagePreviews();
      });

      imagePreviews.appendChild(preview);
    });
  }

  function renderExistingImages(images) {
    if (!existingImages || !existingImagesGroup) return;

    if (!images || images.length === 0) {
      existingImagesGroup.style.display = 'none';
      existingImages.innerHTML = '';
      return;
    }

    existingImagesGroup.style.display = 'block';
    existingImages.innerHTML = '';

    images.forEach(imgPath => {
      if (removeImages.includes(imgPath)) return;

      const preview = document.createElement('div');
      preview.className = 'image-preview';
      preview.innerHTML = `
        <img src="${imgPath}" alt="Existing">
        <button type="button" class="remove-image" title="Remove">&times;</button>
      `;

      preview.querySelector('.remove-image').addEventListener('click', (e) => {
        e.stopPropagation();
        removeImages.push(imgPath);
        preview.remove();
        if (existingImages.children.length === 0) {
          existingImagesGroup.style.display = 'none';
        }
      });

      existingImages.appendChild(preview);
    });
  }

  // ===================== MODAL HANDLING =====================
  function openAddModal() {
    currentEditId = null;
    modalTitle.textContent = 'Add New Product';
    productForm.reset();

    currentSizes = [];
    currentColours = [];
    selectedFiles = [];
    removeImages = [];

    updateSizes();
    updateColours();
    renderImagePreviews();

    if (existingImagesGroup) existingImagesGroup.style.display = 'none';
    if (prodAvailable) prodAvailable.checked = true;

    productModal.classList.add('show');
    prodName.focus();
  }

  function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentEditId = productId;
    modalTitle.textContent = `Edit Product — ${product.name}`;

    prodName.value = product.name || '';
    prodCategory.value = product.category || '';
    prodPrice.value = product.price || '';
    prodDiscount.value = product.discount_price || '';
    prodDescription.value = product.description || '';
    prodStock.value = product.stock ?? 0;
    prodFeatured.checked = !!product.is_featured;
    prodNew.checked = !!product.is_new_arrival;
    prodAvailable.checked = product.is_available !== 0;

    currentSizes = Array.isArray(product.sizes) ? [...product.sizes] : [];
    currentColours = Array.isArray(product.colours) ? [...product.colours] : [];
    selectedFiles = [];
    removeImages = [];

    updateSizes();
    updateColours();
    renderImagePreviews();
    renderExistingImages(product.images || []);

    productModal.classList.add('show');
    prodName.focus();
  }

  function closeModal() {
    productModal.classList.remove('show');
    currentEditId = null;
    selectedFiles = [];
    removeImages = [];
  }

  // ===================== SAVE PRODUCT =====================
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const name = prodName.value.trim();
      const category = prodCategory.value;
      const price = parseFloat(prodPrice.value);
      const discount = prodDiscount.value ? parseFloat(prodDiscount.value) : null;
      const stock = parseInt(prodStock.value) || 0;

      if (!name) {
        showAdminToast('Please provide a product name.', true);
        return;
      }

      if (!category) {
        showAdminToast('Please select a category.', true);
        return;
      }

      if (isNaN(price) || price <= 0) {
        showAdminToast('Please enter a valid price.', true);
        return;
      }

      if (discount !== null && (isNaN(discount) || discount <= 0 || discount >= price)) {
        showAdminToast('Discount price must be less than the regular price.', true);
        return;
      }

      btnModalSave.disabled = true;
      btnModalSave.textContent = 'Saving...';

      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      if (discount !== null) formData.append('discount_price', discount);
      formData.append('description', prodDescription.value.trim());
      formData.append('sizes', JSON.stringify(currentSizes));
      formData.append('colours', JSON.stringify(currentColours));
      formData.append('stock', stock);
      formData.append('is_featured', prodFeatured.checked ? '1' : '0');
      formData.append('is_new_arrival', prodNew.checked ? '1' : '0');
      formData.append('is_available', prodAvailable.checked ? '1' : '0');

      // Append newly uploaded files
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      // If editing, append removed images list
      if (currentEditId && removeImages.length > 0) {
        formData.append('remove_images', JSON.stringify(removeImages));
      }

      const url = currentEditId
        ? `${CONFIG.apiBase}/admin/products/${currentEditId}`
        : `${CONFIG.apiBase}/admin/products`;

      const method = currentEditId ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.success) {
          showAdminToast(currentEditId ? 'Product updated successfully.' : 'Product created successfully.');
          closeModal();
          await loadStats();
          await loadProducts();
        } else {
          showAdminToast(data.error || 'Failed to save product.', true);
        }
      } catch (err) {
        showAdminToast('Server error while saving product.', true);
      } finally {
        btnModalSave.disabled = false;
        btnModalSave.textContent = 'Save Product';
      }
    });
  }

  // ===================== DELETE CONFIRMATION =====================
  function openDeleteConfirm(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentDeleteId = productId;
    confirmMessage.textContent = `Are you sure you want to delete "${product.name}"? This will remove all product details and images permanently.`;
    confirmDialog.classList.add('show');
  }

  function closeDeleteConfirm() {
    confirmDialog.classList.remove('show');
    currentDeleteId = null;
  }

  if (confirmOk) {
    confirmOk.addEventListener('click', async () => {
      if (!currentDeleteId) return;

      confirmOk.disabled = true;
      confirmOk.textContent = 'Deleting...';

      try {
        const res = await fetch(`${CONFIG.apiBase}/admin/products/${currentDeleteId}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (res.ok && data.success) {
          showAdminToast('Product deleted successfully.');
          closeDeleteConfirm();
          await loadStats();
          await loadProducts();
        } else {
          showAdminToast(data.error || 'Failed to delete product.', true);
        }
      } catch {
        showAdminToast('Server error while deleting product.', true);
      } finally {
        confirmOk.disabled = false;
        confirmOk.textContent = 'Delete';
      }
    });
  }

  if (confirmCancel) confirmCancel.addEventListener('click', closeDeleteConfirm);

  // ===================== MODAL EVENT LISTENERS =====================
  if (btnAddProduct) btnAddProduct.addEventListener('click', openAddModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (btnModalCancel) btnModalCancel.addEventListener('click', closeModal);

  // Close modal on click outside
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeModal();
    });
  }

  if (confirmDialog) {
    confirmDialog.addEventListener('click', (e) => {
      if (e.target === confirmDialog) closeDeleteConfirm();
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (confirmDialog?.classList.contains('show')) closeDeleteConfirm();
      else if (productModal?.classList.contains('show')) closeModal();
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ===================== INIT =====================
  document.addEventListener('DOMContentLoaded', () => {
    setupTagInputs();
    setupImageUpload();
    checkAuth();
  });
})();
