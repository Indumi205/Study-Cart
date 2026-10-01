function getFilteredProducts() {
    return products.filter(p => {
        const matchesCat = activeCategory === 'all' || p.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(q)
            || p.desc.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
    });
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-box-open"></i>
                No stationery found. Try a different search.
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <article class="product-card"
             style="--icon-gradient:${p.gradient}; --accent-gradient:${p.gradient};">
            <div class="product-icon" style="background:${p.gradient};">
                <i class="fas ${p.icon}"></i>
            </div>
            <div class="product-title">${p.name}</div>
            <div class="product-desc">${p.desc}</div>
            <div class="price-row">
                <div class="price">${formatPrice(p.price)}<small>LKR</small></div>
                <button class="btn-add" type="button"
                        onclick="addToCart(${p.id})"
                    aria-label="Add ${p.name} to cart">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </article>
    `).join('');
}

function initShop() {
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.getElementById('filterChips');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderProducts();
        });
    }

    if (filterChips) {
        filterChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.chip');
            if (!chip) return;

            document.querySelectorAll('#filterChips .chip').forEach(c => {
                const isActive = c === chip;
                c.classList.toggle('active', isActive);
                c.setAttribute('aria-pressed', String(isActive));
            });

            activeCategory = chip.dataset.category;
            renderProducts();
        });
    }
}