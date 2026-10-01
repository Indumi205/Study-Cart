let cart = [];
let activeCategory = 'all';
let searchQuery = '';
let currentPage = 'shop';
let checkoutStep = 1;
let deliveryInfo = {};
let appliedDiscountCode = '';

function showPage(page) {
    const pageEl = document.getElementById('page-' + page);
    if (!pageEl) return;

    currentPage = page;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.classList.remove('active');
        button.removeAttribute('aria-current');
    });

    pageEl.classList.add('active');

    const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
    if (navBtn) {
        navBtn.classList.add('active');
        navBtn.setAttribute('aria-current', 'page');
    }

    if (page === 'cart') {
        renderCart();
    }
    if (page === 'checkout') {
        checkoutStep = 1;
        renderCheckout();
    }
    if (page === 'shop') {
        renderProducts();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    cart = loadCart();
    renderProducts();
    updateCartBadge();
    initShop();
});