/**
 * Shop JavaScript
 * Handles product loading, filtering, and shop functionality
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupShopFilters();
        loadProducts();
        
        console.log('Shop JavaScript initialized');
    }

    // Setup filter buttons
    function setupShopFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const shopContainer = document.getElementById('shopContainer');
        
        if (!filterButtons.length || !shopContainer) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Apply filter
                applyFilter(filter);
                
                // Track in console
                console.log('Shop filter applied:', filter);
            });
        });
    }

    // Load products from JSON
    async function loadProducts() {
        try {
            const response = await fetch('data/shop.json?v=' + Date.now());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            renderProducts(products);
            
            console.log('Products loaded successfully:', products);
            
        } catch (error) {
            console.warn('Could not load shop.json, using fallback:', error);
            renderFallbackProducts();
        }
    }

    // Render products
    function renderProducts(products) {
        const container = document.getElementById('shopContainer');
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card" data-tags="${product.tags.join(',')}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">$${product.price}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-tags">
                        ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="product-actions">
                        <a href="${product.processorUrl}" class="btn btn-primary" target="_blank" rel="noopener">
                            Buy / Unlock
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click tracking to product cards
        setupProductTracking();
    }

    // Render fallback products
    function renderFallbackProducts() {
        const container = document.getElementById('shopContainer');
        if (!container) return;
        
        const fallbackProducts = [
            {
                id: 1,
                title: "Spooky Photo Set",
                price: 15,
                image: "assets/logo.png",
                tags: ["photos", "spooky"],
                processorUrl: "https://onlyfans.com",
                description: "Exclusive spooky-themed photo collection"
            },
            {
                id: 2,
                title: "Dark Fantasy Video",
                price: 25,
                image: "assets/logo.png",
                tags: ["videos", "fantasy"],
                processorUrl: "https://fansly.com",
                description: "Immersive dark fantasy experience"
            },
            {
                id: 3,
                title: "Premium Bundle",
                price: 45,
                image: "assets/logo.png",
                tags: ["bundles", "premium"],
                processorUrl: "https://onlyfans.com",
                description: "Complete premium content package"
            },
            {
                id: 4,
                title: "Custom Audio",
                price: 20,
                image: "assets/logo.png",
                tags: ["audio", "custom"],
                processorUrl: "https://fansly.com",
                description: "Personalized audio content"
            }
        ];
        
        renderProducts(fallbackProducts);
    }

    // Apply filter to products
    function applyFilter(filter) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const tags = card.dataset.tags.toLowerCase();
                if (tags.includes(filter.toLowerCase())) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
        
        // Track filter in console
        console.log('Filter applied:', filter);
    }

    // Setup product click tracking
    function setupProductTracking() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent || 'Product';
            const price = card.querySelector('.product-price')?.textContent || '';
            const buyButton = card.querySelector('.btn');
            
            if (buyButton) {
                buyButton.addEventListener('click', function() {
                    console.log('Product purchased:', title, price);
                });
            }
            
            // Track product view
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('btn')) {
                    console.log('Product viewed:', title);
                }
            });
        });
    }

    // Search functionality
    function setupSearch() {
        const searchInput = document.querySelector('.shop-search input');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            searchProducts(query);
        });
    }

    // Search products
    function searchProducts(query) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
            const tags = card.dataset.tags.toLowerCase();
            
            if (title.includes(query) || description.includes(query) || tags.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        if (query) {
            console.log('Products searched for:', query);
        }
    }

    // Sort products
    function setupSorting() {
        const sortSelect = document.querySelector('.shop-sort select');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortProducts(sortBy);
        });
    }

    // Sort products by criteria
    function sortProducts(sortBy) {
        const container = document.getElementById('shopContainer');
        if (!container) return;
        
        const productCards = Array.from(container.querySelectorAll('.product-card'));
        
        productCards.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'price-low':
                    aValue = parseFloat(a.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                    bValue = parseFloat(b.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                    return aValue - bValue;
                    
                case 'price-high':
                    aValue = parseFloat(a.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                    bValue = parseFloat(b.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                    return bValue - aValue;
                    
                case 'name':
                    aValue = a.querySelector('.product-title')?.textContent.toLowerCase() || '';
                    bValue = b.querySelector('.product-title')?.textContent.toLowerCase() || '';
                    return aValue.localeCompare(bValue);
                    
                default:
                    return 0;
            }
        });
        
        // Re-render sorted products
        productCards.forEach(card => container.appendChild(card));
        
        console.log('Products sorted by:', sortBy);
    }

    // Initialize additional features
    setupSearch();
    setupSorting();

    // Export for debugging
    window.shopApp = {
        reloadProducts: loadProducts,
        applyFilter: applyFilter,
        searchProducts: setupSearch,
        sortProducts: setupSorting
    };

})();
