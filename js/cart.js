/**
 * Sukoon by Pallavi — Cart Page JavaScript
 * Handles cart item rendering, quantity updates, item removal, and WhatsApp order checkout.
 */

(function () {
  const cartEmpty = document.getElementById('cart-empty');
  const cartLayout = document.getElementById('cart-layout');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const whatsappOrderBtn = document.getElementById('btn-whatsapp-order');

  function renderCart() {
    const items = Cart.getItems();

    if (!items || items.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'block';
      if (cartLayout) cartLayout.style.display = 'none';
      Cart.updateCount();
      return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartLayout) cartLayout.style.display = 'grid';

    // Render items list
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = items.map(item => {
        const itemImg = item.image || 'https://placehold.co/100x130/F0EBE1/9A938C?text=No+Image';
        const metaParts = [];
        if (item.size) metaParts.push(`Size: ${escapeHtml(item.size)}`);
        if (item.colour) metaParts.push(`Colour: ${escapeHtml(item.colour)}`);
        const metaStr = metaParts.length > 0 ? metaParts.join(' &nbsp;|&nbsp; ') : 'Standard';

        return `
          <div class="cart-item" data-key="${escapeHtml(item.key)}">
            <div class="cart-item-image">
              <img src="${escapeHtml(itemImg)}" alt="${escapeHtml(item.name)}" loading="lazy">
            </div>
            <div>
              <h3 class="cart-item-name">
                <a href="product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a>
              </h3>
              <p class="cart-item-meta">${metaStr}</p>
              <div class="cart-item-actions">
                <div class="quantity-selector" style="margin-bottom: 0;">
                  <button class="qty-btn btn-qty-dec" type="button" data-key="${escapeHtml(item.key)}" aria-label="Decrease quantity">−</button>
                  <input type="number" class="qty-input" value="${item.quantity}" readonly>
                  <button class="qty-btn btn-qty-inc" type="button" data-key="${escapeHtml(item.key)}" aria-label="Increase quantity">+</button>
                </div>
                <button class="cart-item-remove" type="button" data-key="${escapeHtml(item.key)}">Remove</button>
              </div>
            </div>
            <div class="cart-item-price">
              ${formatPrice(item.price * item.quantity)}
            </div>
          </div>
        `;
      }).join('');
    }

    // Update Totals
    const total = Cart.getTotal();
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(total);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);

    Cart.updateCount();
    attachCartEvents();
  }

  function attachCartEvents() {
    if (!cartItemsContainer) return;

    // Decrease quantity
    cartItemsContainer.querySelectorAll('.btn-qty-dec').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const items = Cart.getItems();
        const item = items.find(i => i.key === key);
        if (item) {
          if (item.quantity > 1) {
            Cart.updateQuantity(key, item.quantity - 1);
            renderCart();
          } else {
            Cart.removeItem(key);
            showToast(`${item.name} removed from bag.`, 'success');
            renderCart();
          }
        }
      });
    });

    // Increase quantity
    cartItemsContainer.querySelectorAll('.btn-qty-inc').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const items = Cart.getItems();
        const item = items.find(i => i.key === key);
        if (item) {
          Cart.updateQuantity(key, item.quantity + 1);
          renderCart();
        }
      });
    });

    // Remove item
    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const items = Cart.getItems();
        const item = items.find(i => i.key === key);
        const name = item ? item.name : 'Item';
        Cart.removeItem(key);
        showToast(`${name} removed from bag.`, 'success');
        renderCart();
      });
    });
  }

  // Handle WhatsApp Order Button
  if (whatsappOrderBtn) {
    whatsappOrderBtn.addEventListener('click', () => {
      const items = Cart.getItems();
      if (!items || items.length === 0) {
        showToast('Your shopping bag is empty.', 'error');
        return;
      }

      let message = `Hello Pallavi, I would like to place an order with *${CONFIG.businessName}*:\n\n`;
      message += `🛍️ *ORDER DETAILS:*\n`;
      message += `─────────────────────────\n`;

      items.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   • ID: ${item.id}\n`;
        if (item.size) message += `   • Size: ${item.size}\n`;
        if (item.colour) message += `   • Colour: ${item.colour}\n`;
        message += `   • Quantity: ${item.quantity}\n`;
        message += `   • Unit Price: ${formatPrice(item.price)}\n`;
        message += `   • Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
      });

      const total = Cart.getTotal();
      const count = Cart.getCount();
      message += `─────────────────────────\n`;
      message += `*Total Items:* ${count}\n`;
      message += `*Total Amount:* ${formatPrice(total)}\n`;
      message += `─────────────────────────\n\n`;
      message += `Please confirm product availability and share shipping/payment details. Thank you!`;

      const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      showToast('Opening WhatsApp with your order details...', 'success');
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
  });
})();
