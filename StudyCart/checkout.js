function renderCheckout() {
    
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('stepIndicator' + i);
        if (!el) continue;
        el.classList.remove('active', 'completed');
        if (i < checkoutStep) el.classList.add('completed');
        if (i === checkoutStep) el.classList.add('active');
        el.querySelector('.step-circle').innerHTML = i < checkoutStep
            ? '<i class="fas fa-check"></i>'
            : i;
    }

    const container = document.getElementById('checkoutContent');
    if (!container) return;

    if (checkoutStep === 1) renderDeliveryStep(container);
    else if (checkoutStep === 2) renderPaymentStep(container);
    else if (checkoutStep === 3) renderConfirmStep(container);
    else if (checkoutStep === 4) renderSuccessStep(container);
}

function renderDeliveryStep(container) {
    container.innerHTML = `
        <h2 style="font-size:1.3rem; color:var(--primary-dark); margin-bottom:1.5rem; font-weight:800;">
            <i class="fas fa-truck" style="color:var(--primary);"></i> Delivery Information
        </h2>
        <div class="form-group">
                 <label for="dName">Full Name <span class="required">*</span></label>
            <input type="text" class="form-control" id="dName"
                     value="${escapeHTML(deliveryInfo.name || '')}"
                   placeholder="e.g. Nimal Perera">
            <div class="form-error" id="err-dName">Please enter your full name</div>
        </div>
        <div class="form-row">
            <div class="form-group">
                  <label for="dPhone">Phone Number <span class="required">*</span></label>
                <input type="tel" class="form-control" id="dPhone"
                      value="${escapeHTML(deliveryInfo.phone || '')}"
                       placeholder="07X XXX XXXX">
                <div class="form-error" id="err-dPhone">Please enter a valid phone number</div>
            </div>
            <div class="form-group">
                  <label for="dEmail">Email <span class="required">*</span></label>
                <input type="email" class="form-control" id="dEmail"
                      value="${escapeHTML(deliveryInfo.email || '')}"
                       placeholder="you@example.com">
                <div class="form-error" id="err-dEmail">Please enter a valid email</div>
            </div>
        </div>
        <div class="form-group">
                 <label for="dAddress">Delivery Address <span class="required">*</span></label>
            <input type="text" class="form-control" id="dAddress"
                     value="${escapeHTML(deliveryInfo.address || '')}"
                   placeholder="House number, street name">
            <div class="form-error" id="err-dAddress">Please enter your address</div>
        </div>
        <div class="form-row">
            <div class="form-group">
                  <label for="dCity">City <span class="required">*</span></label>
                <input type="text" class="form-control" id="dCity"
                      value="${escapeHTML(deliveryInfo.city || '')}"
                       placeholder="e.g. Colombo">
                <div class="form-error" id="err-dCity">Please enter your city</div>
            </div>
            <div class="form-group">
                  <label for="dPostal">Postal Code</label>
                <input type="text" class="form-control" id="dPostal"
                      value="${escapeHTML(deliveryInfo.postal || '')}"
                       placeholder="e.g. 00400">
            </div>
        </div>
        <div class="form-group">
            <label for="dDistrict">District <span class="required">*</span></label>
            <select class="form-control" id="dDistrict">
                <option value="">Select your district</option>
                ${sriLankanDistricts.map(d => `
                    <option value="${d}" ${deliveryInfo.district === d ? 'selected' : ''}>
                        ${d}
                    </option>
                `).join('')}
            </select>
            <div class="form-error" id="err-dDistrict">Please select your district</div>
        </div>
        <button class="btn-primary" onclick="validateDelivery()">
            <i class="fas fa-arrow-right"></i> Continue to Payment
        </button>
    `;
}

function validateDelivery() {
    const fields = [
        { id: 'dName',     err: 'err-dName',     check: v => v.trim().length >= 2 },
        { id: 'dPhone',    err: 'err-dPhone',    check: v => /^\+?[\d\s()-]+$/.test(v.trim()) && v.replace(/\D/g, '').length >= 9 && v.replace(/\D/g, '').length <= 12 },
        { id: 'dEmail',    err: 'err-dEmail',    check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
        { id: 'dAddress',  err: 'err-dAddress',  check: v => v.trim().length >= 3 },
        { id: 'dCity',     err: 'err-dCity',     check: v => v.trim().length >= 2 },
        { id: 'dDistrict', err: 'err-dDistrict', check: v => v !== '' }
    ];

    let valid = true;

    fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.err);
        if (!f.check(input.value)) {
            input.classList.add('error');
            errEl.classList.add('show');
            valid = false;
        } else {
            input.classList.remove('error');
            errEl.classList.remove('show');
        }
    });

    if (!valid) {
        showToast('Please fill all required fields correctly.', true);
        return;
    }

    deliveryInfo = {
        name:     document.getElementById('dName').value.trim(),
        phone:    document.getElementById('dPhone').value.trim(),
        email:    document.getElementById('dEmail').value.trim(),
        address:  document.getElementById('dAddress').value.trim(),
        city:     document.getElementById('dCity').value.trim(),
        postal:   document.getElementById('dPostal').value.trim(),
        district: document.getElementById('dDistrict').value
    };

    checkoutStep = 2;
    renderCheckout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPaymentStep(container) {
    container.innerHTML = `
        <h2 style="font-size:1.3rem; color:var(--primary-dark); margin-bottom:1.5rem; font-weight:800;">
            <i class="fas fa-truck" style="color:var(--primary);"></i> Payment Method
        </h2>
        <div class="payment-note" role="note">
            <i class="fas fa-money-bill-wave" aria-hidden="true"></i>
            <div>
                <strong>Cash on delivery</strong>
                <p>This is a demo checkout. No payment will be collected or processed.</p>
            </div>
        </div>

        <div class="summary-row" style="border-top:1px solid #f3e8ff; margin-top:1rem; padding-top:1rem;">
            <span>Total to pay</span>
            <span style="font-weight:800; color:var(--primary-dark); font-size:1.15rem;">
                ${formatPrice(getFinalTotal())}
            </span>
        </div>

        <div style="display:flex; gap:0.8rem; margin-top:1.5rem; flex-wrap:wrap;">
            <button class="btn-secondary" style="flex:1;"
                    onclick="checkoutStep=1; renderCheckout();">
                <i class="fas fa-arrow-left"></i> Back
            </button>
            <button class="btn-primary" style="flex:2;" onclick="continueToConfirmation()">
                <i class="fas fa-arrow-right"></i> Review Order
            </button>
        </div>
    `;
}

function continueToConfirmation() {
    if (cart.length === 0) {
        showToast('Your cart is empty.', true);
        showPage('cart');
        return;
    }
    checkoutStep = 3;
    renderCheckout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderConfirmStep(container) {
    const itemsHTML = cart.map(item => {
        const p = products.find(pr => pr.id === item.id);
        if (!p) return '';
        return `
            <div class="order-details-row">
                <span>${p.name} × ${item.quantity}</span>
                <span>${formatPrice(p.price * item.quantity)}</span>
            </div>
        `;
    }).join('');
    const discountRow = getDiscount() > 0 ? `
        <div class="order-details-row" style="color:var(--green);">
            <span>Discount (${DISCOUNT_CODE} · 10%)</span>
            <span>− ${formatPrice(getDiscount())}</span>
        </div>
    ` : '';

    container.innerHTML = `
        <h2 style="font-size:1.3rem; color:var(--primary-dark); margin-bottom:1.5rem; font-weight:800;">
            <i class="fas fa-check-circle" style="color:var(--green);"></i> Confirm Your Order
        </h2>

        <div class="order-details">
            <h4 style="font-size:0.9rem; color:var(--primary-dark); margin-bottom:0.8rem; text-transform:uppercase; letter-spacing:1px;">
                <i class="fas fa-truck"></i> Delivery To
            </h4>
            <div class="order-details-row"><span>Name</span><span>${escapeHTML(deliveryInfo.name)}</span></div>
            <div class="order-details-row"><span>Phone</span><span>${escapeHTML(deliveryInfo.phone)}</span></div>
            <div class="order-details-row"><span>Address</span><span>${escapeHTML(deliveryInfo.address)}, ${escapeHTML(deliveryInfo.city)}</span></div>
            <div class="order-details-row"><span>District</span><span>${escapeHTML(deliveryInfo.district)}</span></div>
        </div>

        <div class="order-details">
            <h4 style="font-size:0.9rem; color:var(--primary-dark); margin-bottom:0.8rem; text-transform:uppercase; letter-spacing:1px;">
                <i class="fas fa-money-bill-wave"></i> Payment Method
            </h4>
            <div class="order-details-row"><span>Method</span><span>Cash on delivery (demo)</span></div>
            <div class="order-details-row"><span>Payment status</span><span>Not processed</span></div>
        </div>

        <div class="order-details">
            <h4 style="font-size:0.9rem; color:var(--primary-dark); margin-bottom:0.8rem; text-transform:uppercase; letter-spacing:1px;">
                <i class="fas fa-box"></i> Order Summary
            </h4>
            ${itemsHTML}
            <div class="order-details-row" style="border-top:1px dashed #e9d5ff; margin-top:0.6rem; padding-top:0.6rem;">
                <span>Subtotal</span><span>${formatPrice(getSubtotal())}</span>
            </div>
            ${discountRow}
            <div class="order-details-row">
                <span>Delivery</span><span>${formatPrice(DELIVERY_FEE)}</span>
            </div>
            <div class="order-details-row" style="border-top:1px solid #e9d5ff; margin-top:0.6rem; padding-top:0.8rem; font-size:1.1rem;">
                <span style="font-weight:800; color:var(--primary-dark);">Total</span>
                <span style="font-weight:800; color:var(--primary-dark);">${formatPrice(getFinalTotal())}</span>
            </div>
        </div>

        <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
            <button class="btn-secondary" style="flex:1;"
                    onclick="checkoutStep=2; renderCheckout();">
                <i class="fas fa-arrow-left"></i> Back
            </button>
            <button class="btn-primary" style="flex:2;" onclick="placeOrder()">
                <i class="fas fa-check"></i> Complete Demo Order · ${formatPrice(getFinalTotal())}
            </button>
        </div>
    `;
}

function placeOrder() {
    if (checkoutStep !== 3 || cart.length === 0) {
        showToast('Your cart is empty.', true);
        showPage('cart');
        return;
    }

    checkoutStep = 4;
    renderCheckout();
    cart = [];
    appliedDiscountCode = '';
    saveCart();
    updateCartBadge();
}

function renderSuccessStep(container) {
    const orderId = 'SC' + Date.now().toString().slice(-8);

    container.innerHTML = `
        <div class="success-box">
            <div class="success-icon"><i class="fas fa-check"></i></div>
            <h2>Demo Order Complete</h2>
            <p>Thank you, ${escapeHTML(deliveryInfo.name)}. This order was not sent to a store or delivery service.</p>
            <div class="order-details">
                <div class="order-details-row"><span>Order ID</span><span>${orderId}</span></div>
                <div class="order-details-row"><span>Delivery To</span><span>${escapeHTML(deliveryInfo.city)}, ${escapeHTML(deliveryInfo.district)}</span></div>
                <div class="order-details-row"><span>Contact</span><span>${escapeHTML(deliveryInfo.phone)}</span></div>
                <div class="order-details-row"><span>Payment</span><span>Cash on delivery, not processed</span></div>
                <div class="order-details-row" style="border-top:1px dashed #e9d5ff; margin-top:0.6rem; padding-top:0.8rem;">
                    <span style="font-weight:800; color:var(--primary-dark);">Demo Total</span>
                    <span style="font-weight:800; color:var(--primary-dark);">${formatPrice(getFinalTotal())}</span>
                </div>
            </div>
            <p style="font-size:0.9rem;">No payment was collected and no confirmation email was sent.</p>
            <button class="btn-primary" style="max-width:320px; margin:1rem auto 0;" onclick="resetAndShop()">
                <i class="fas fa-store"></i> Continue Shopping
            </button>
        </div>
    `;
    showToast('Demo order completed; no payment was processed.', true);
}

function resetAndShop() {
    deliveryInfo = {};
    checkoutStep = 1;
    showPage('shop');
}