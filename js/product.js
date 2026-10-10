/**
 * Sukoon by Pallavi — Product Detail Page JavaScript
 * Image gallery, size/colour selection, quantity, add to cart, WhatsApp order.
 */

(function () {
  let product = null;
  let selectedSize = '';
  let selectedColour = '';
  let quantity = 1;

  const detailInner = document.getElementById('product-detail-inner');
  const breadcrumbProduct = document.getElementById('breadcrumb-product');

  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async function loadProduct() {
    const id = getProductId();
    if (!id) {
      detailInner.innerHTML = `
        <div style="text-align:center; padding: 4rem 1rem; grid-column: 1 / -1;">
          <p style="font-family:var(--font-display); font-size:1.4rem; color:var(--color-text-light); margin-bottom:1.5rem;">No product selected.</p>
          <a href="shop.html" class="btn btn-primary">Browse Collection</a>
        </div>
      `;
      breadcrumbProduct.textContent = 'Shop';
      return;
    }

    try {
      product = await apiFetch(`/products/${id}`);
      document.title = `${product.name} — Sukoon by Pallavi`;
      breadcrumbProduct.textContent = product.name;
      renderProduct();
    } catch (err) {
      detailInner.innerHTML = `
        <div style="text-align:center; padding: 4rem 1rem; grid-column: 1 / -1;">
          <p style="font-family:var(--font-display); font-size:1.4rem; color:var(--color-text-light); margin-bottom:1.5rem;">Product not found or unavailable.</p>
          <a href="shop.html" class="btn btn-primary">Browse Collection</a>
        </div>
      `;
      breadcrumbProduct.textContent = 'Not Found';
    }
  }

  function renderProduct() {
    const images = product.images?.length > 0
      ? product.images
      : ['https://placehold.co/600x800/F0EBE1/9A938C?text=No+Image'];

    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const discountPercent = hasDiscount
      ? Math.round((1 - product.discount_price / product.price) * 100)
      : 0;

    // Stock status
    let stockHTML = '';
    if (product.stock === 0) {
      stockHTML = '<p class="product-stock"><span class="stock-out">Out of Stock</span></p>';
    } else if (product.stock <= 5) {
      stockHTML = `<p class="product-stock"><span class="stock-low">Only ${product.stock} left in stock</span></p>`;
    } else {
      stockHTML = '<p class="product-stock"><span class="stock-in">In Stock</span></p>';
    }

    // Size options
    let sizesHTML = '';
    if (product.sizes && product.sizes.length > 0) {
      sizesHTML = `
        <div class="product-sizes">
          <p class="product-option-label">Size</p>
          <div class="size-options">
            ${product.sizes.map(s => `<button type="button" class="size-btn" data-size="${s}">${s}</button>`).join('')}
          </div>
        </div>
      `;
    }

    // Colour options
    let coloursHTML = '';
    if (product.colours && product.colours.length > 0) {
      coloursHTML = `
        <div class="product-colours">
          <p class="product-option-label">Colour</p>
          <div class="colour-options">
            ${product.colours.map(c => `<button type="button" class="colour-btn" data-colour="${c}">${c}</button>`).join('')}
          </div>
        </div>
      `;
    }

    // Badge
    let badgeHTML = '';
    if (hasDiscount) {
      badgeHTML = `<span class="product-badge sale">${discountPercent}% Off</span>`;
    } else if (product.is_new_arrival) {
      badgeHTML = '<span class="product-badge">New Arrival</span>';
    }

    // Price
    let priceHTML = '';
    if (hasDiscount) {
      priceHTML = `
        <span class="price-current">${formatPrice(product.discount_price)}</span>
        <span class="price-original">${formatPrice(product.price)}</span>
        <span class="price-discount">${discountPercent}% off</span>
      `;
    } else {
      priceHTML = `<span class="price-current">${formatPrice(product.price)}</span>`;
    }

    // Thumbnails
    const thumbsHTML = images.length > 1
      ? `<div class="product-thumbnails">
           ${images.map((img, i) => `
             <div class="product-thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">
               <img src="${img}" alt="${product.name} image ${i + 1}">
             </div>
           `).join('')}
         </div>`
      : '';

    detailInner.innerHTML = `
      <!-- Gallery -->
      <div class="product-gallery">
        <div class="product-main-image">
          <img src="${images[0]}" alt="${product.name}" id="main-product-image">
        </div>
        ${thumbsHTML}
      </div>

      <!-- Info -->
      <div class="product-info">
        ${badgeHTML}
        <h1 class="product-info-name">${product.name}</h1>
        <p class="product-info-id">ID: ${product.id}</p>

        <div class="product-info-price">
          ${priceHTML}
        </div>

        <p class="product-info-description">${product.description || ''}</p>

        ${sizesHTML}
        ${coloursHTML}

        ${stockHTML}

        <div class="quantity-selector" ${product.stock === 0 ? 'style="display:none;"' : ''}>
          <button class="qty-btn" id="qty-minus" type="button">−</button>
          <input type="number" class="qty-input" id="qty-input" value="1" min="1" max="${product.stock}" readonly>
          <button class="qty-btn" id="qty-plus" type="button">+</button>
        </div>

        <div class="product-actions">
          <button class="btn btn-primary" id="btn-add-cart" ${product.stock === 0 ? 'disabled style="opacity:0.5;"' : ''}>
            ${product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
          <button class="btn btn-whatsapp" id="btn-whatsapp-single">
            Order via WhatsApp
          </button>
        </div>
      </div>
    `;

    attachProductListeners();
  }

  function attachProductListeners() {
    // Thumbnails
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.index);
        const mainImg = document.getElementById('main-product-image');
        mainImg.src = product.images[index];
        document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Sizes
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSize = btn.dataset.size;
      });
    });

    // Colours
    document.querySelectorAll('.colour-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.colour-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColour = btn.dataset.colour;
      });
    });

    // Quantity
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        if (quantity > 1) {
          quantity--;
          qtyInput.value = quantity;
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        if (quantity < product.stock) {
          quantity++;
          qtyInput.value = quantity;
        }
      });
    }

    // Add to cart
    const addBtn = document.getElementById('btn-add-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (product.sizes?.length > 0 && !selectedSize) {
          showToast('Please select a size.', 'error');
          return;
        }
        if (product.colours?.length > 0 && !selectedColour) {
          showToast('Please select a colour.', 'error');
          return;
        }

        Cart.addItem(product, selectedSize, selectedColour, quantity);
        showToast(`${product.name} added to bag!`);
      });
    }

    // WhatsApp single product
    const waBtn = document.getElementById('btn-whatsapp-single');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        if (product.sizes?.length > 0 && !selectedSize) {
          showToast('Please select a size.', 'error');
          return;
        }
        if (product.colours?.length > 0 && !selectedColour) {
          showToast('Please select a colour.', 'error');
          return;
        }

        const price = product.discount_price || product.price;
        let message = `Hi, I'd like to order from Sukoon by Pallavi:\n\n`;
        message += `*${product.name}*\n`;
        message += `ID: ${product.id}\n`;
        if (selectedSize) message += `Size: ${selectedSize}\n`;
        if (selectedColour) message += `Colour: ${selectedColour}\n`;
        message += `Qty: ${quantity}\n`;
        message += `Price: ${formatPrice(price * quantity)}\n\n`;
        message += `Please confirm availability and total.`;

        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      });
    }
  }

  loadProduct();
})();
