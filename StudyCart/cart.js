function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem('studycart-cart') || '[]');
        const validCart = Array.isArray(savedCart) ? savedCart.filter(item => item
            && products.some(product => product.id === item.id)
            && Number.isSafeInteger(item.quantity)
            && item.quantity > 0) : [];
        const savedCode = localStorage.getItem('studycart-coupon');
        appliedDiscountCode = validCart.length > 0 && savedCode === DISCOUNT_CODE
            ? savedCode
            : '';
        return validCart;
    } catch {
        appliedDiscountCode = '';
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('studycart-cart', JSON.stringify(cart));
        localStorage.setItem('studycart-coupon', appliedDiscountCode);
    } catch {
        showToast('Cart changes could not be saved on this device.', true);
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => {
        const p = products.find(pr => pr.id === item.id);
        return sum + (p ? p.price * item.quantity : 0);
    }, 0);
}

function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getSubtotal() { return getCartTotal(); }
function getDiscount() {
    return appliedDiscountCode === DISCOUNT_CODE ? getSubtotal() * DISCOUNT_RATE : 0;
}
function getFinalTotal() {
    const subtotal = getSubtotal();
    return subtotal - getDiscount() + (subtotal > 0 ? DELIVERY_FEE : 0);
}

function applyDiscount() {
    const input = document.getElementById('couponInput');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (code !== DISCOUNT_CODE) {
        appliedDiscountCode = '';
        showToast('That discount code is not valid.', true);
    } else {
        appliedDiscountCode = code;
        showToast('KIDS10 discount applied!');
    }
    saveCart();
    renderCart();
}

function addToCart(id) {
    if (!products.some(product => product.id === id)) return;

    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, quantity: 1 });
    }
    saveCart();
    updateCartBadge();
    showToast('Added to cart! 🛒');
    if (currentPage === 'cart') renderCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
        showToast('Item removed from cart');
    }

    if (cart.length === 0) appliedDiscountCode = '';
    saveCart();
    updateCartBadge();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    if (cart.length === 0) appliedDiscountCode = '';
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('Item removed from cart');
}

function renderCart() {
    const container = document.getElementById('cartContent');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-items-container">
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some stationery for your little one!</p>
                    <button class="btn-primary"
                            style="max-width:280px; margin:0 auto;"
                            onclick="showPage('shop')">
                        <i class="fas fa-store"></i> Start Shopping
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const itemsHTML = cart.map(item => {
        const p = products.find(pr => pr.id === item.id);
        if (!p) return '';

        return `
            <div class="cart-item">
                <div class="cart-item-icon" style="background:${p.gradient};">
                    <i class="fas ${p.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${formatPrice(p.price)} each</div>
                </div>
                <div class="qty-controls">
                        <button class="qty-btn" type="button" onclick="changeQty(${p.id}, -1)"
                            aria-label="Decrease ${p.name} quantity">−</button>
                        <span class="qty-value" aria-live="polite">${item.quantity}</span>
                        <button class="qty-btn" type="button" onclick="changeQty(${p.id}, 1)"
                            aria-label="Increase ${p.name} quantity">+</button>
                </div>
                <div class="cart-item-total">${formatPrice(p.price * item.quantity)}</div>
                <button class="btn-remove" type="button"
                        onclick="removeItem(${p.id})"
                        aria-label="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    const subtotal = getSubtotal();
    const discount = getDiscount();
    const total = getFinalTotal();
    const discountRow = discount > 0 ? `
        <div class="summary-row discount">
            <span>Discount (${DISCOUNT_CODE} · 10%)</span>
            <span>− ${formatPrice(discount)}</span>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="cart-items-container">${itemsHTML}</div>
        <div class="cart-summary-box">
            <div class="coupon-form">
                <label for="couponInput">Discount code</label>
                <div class="coupon-entry">
                    <input class="form-control" id="couponInput" type="text"
                           value="${appliedDiscountCode}" placeholder="Enter code"
                           autocomplete="off">
                    <button class="btn-secondary" type="button" onclick="applyDiscount()">Apply</button>
                </div>
            </div>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            ${discountRow}
            <div class="summary-row">
                <span>Delivery Fee</span>
                <span>${formatPrice(DELIVERY_FEE)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
            </div>
            <button class="btn-primary" onclick="proceedToCheckout()">
                <i class="fas fa-arrow-right"></i> Proceed to Checkout
            </button>
            <button class="btn-secondary"
                    style="width:100%; margin-top:0.8rem;"
                    onclick="showPage('shop')">
                <i class="fas fa-plus"></i> Continue Shopping
            </button>
        </div>
    `;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', true);
        return;
    }
    checkoutStep = 1;
    showPage('checkout');
}