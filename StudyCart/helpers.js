const DELIVERY_FEE = 350;
const DISCOUNT_CODE = 'KIDS10';
const DISCOUNT_RATE = 0.10;

function formatPrice(price) {
    return 'Rs. ' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function escapeHTML(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, character => entities[character]);
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    msg.textContent = message;
    toast.classList.toggle('error', isError);
    toast.querySelector('i').className = isError
        ? 'fas fa-exclamation-circle'
        : 'fas fa-check-circle';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateCartBadge() {
    const count = getCartItemCount();
    const badge = document.getElementById('navCartCount');
    if (badge) badge.textContent = count;
}

function submitContact(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    showToast(`Thanks, ${name}. This demo cannot send messages; your draft is still here.`, true);
}