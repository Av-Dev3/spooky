// Homepage functionality for Spoookysnsfww
document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage.js loaded, initializing...');
    
    // Load quick links
    loadQuickLinks();
    
    // Load gallery preview
    loadGalleryPreview();
    
    // Load FAQ preview
    loadFAQPreview();
});

// Load quick links section
async function loadQuickLinks() {
    try {
        console.log('Loading quick links...');
        const response = await fetch('data/links.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const links = await response.json();
        console.log('Loaded links:', links);
        
        const container = document.getElementById('quickLinksContainer');
        console.log('Container element:', container);
        
        if (!container) {
            console.error('Quick links container not found!');
            return;
        }
        
        // Show first 6 links as a preview
        const previewLinks = links.slice(0, 6);
        console.log('Preview links:', previewLinks);
        
        container.innerHTML = previewLinks.map(link => `
            <a href="${link.url}" class="quick-link-card" target="_blank" rel="noopener">
                <div class="quick-link-icon">${link.icon}</div>
                <div class="quick-link-content">
                    <h3>${link.title}</h3>
                    <span class="quick-link-badge">${link.badge}</span>
                </div>
            </a>
        `).join('');
        
        console.log('Quick links rendered successfully');
        
    } catch (error) {
        console.error('Error loading quick links:', error);
    }
}

// Load gallery preview section
async function loadGalleryPreview() {
    try {
        console.log('Loading gallery preview...');
        const response = await fetch('data/gallery.json');
        console.log('Gallery response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const galleryItems = await response.json();
        console.log('Loaded gallery items:', galleryItems);
        
        const container = document.getElementById('galleryPreviewContainer');
        console.log('Gallery container element:', container);
        
        if (!container) {
            console.error('Gallery preview container not found!');
            return;
        }
        
        // Show first 3 gallery items as a preview
        const previewItems = galleryItems.slice(0, 3);
        console.log('Preview gallery items:', previewItems);
        
        container.innerHTML = previewItems.map(item => `
            <div class="gallery-preview-item">
                <div class="gallery-preview-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    ${item.locked ? '<div class="gallery-lock-overlay">🔒</div>' : ''}
                </div>
                <div class="gallery-preview-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
        
        console.log('Gallery preview rendered successfully');
        
    } catch (error) {
        console.error('Error loading gallery preview:', error);
    }
}

// Load FAQ preview section
async function loadFAQPreview() {
    try {
        console.log('Loading FAQ preview...');
        
        // Since we don't have a FAQ JSON file, we'll create some common FAQs
        const commonFAQs = [
            {
                question: "How do I subscribe to your OnlyFans?",
                answer: "Simply click the OnlyFans link in my bio or visit my profile directly. You'll need to create an account and add a payment method to subscribe."
            },
            {
                question: "What's included in your subscription?",
                answer: "My subscription includes daily posts, exclusive photos and videos, behind-the-scenes content, and direct messaging access."
            },
            {
                question: "How long do custom orders take?",
                answer: "Most custom orders are delivered within 3-7 business days. Complex requests may take longer, and I'll always communicate any delays."
            }
        ];
        
        const container = document.getElementById('faqPreviewContainer');
        console.log('FAQ container element:', container);
        
        if (!container) {
            console.error('FAQ preview container not found!');
            return;
        }
        
        container.innerHTML = commonFAQs.map(faq => `
            <div class="faq-preview-item">
                <h4 class="faq-preview-question">${faq.question}</h4>
                <p class="faq-preview-answer">${faq.answer}</p>
            </div>
        `).join('');
        
        console.log('FAQ preview rendered successfully');
        
    } catch (error) {
        console.error('Error loading FAQ preview:', error);
    }
}
