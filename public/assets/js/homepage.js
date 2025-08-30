// Homepage functionality for Spoookysnsfww
document.addEventListener('DOMContentLoaded', function() {
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
        const response = await fetch('/data/links.json');
        const links = await response.json();
        
        const container = document.getElementById('quickLinksContainer');
        if (!container) return;
        
        // Show first 6 links as a preview
        const previewLinks = links.slice(0, 6);
        
        container.innerHTML = previewLinks.map(link => `
            <a href="${link.url}" class="quick-link-card" target="_blank" rel="noopener">
                <div class="quick-link-icon">${link.icon}</div>
                <div class="quick-link-content">
                    <h3>${link.title}</h3>
                    <span class="quick-link-badge">${link.badge}</span>
                </div>
            </a>
        `).join('');
        
    } catch (error) {
        console.error('Error loading quick links:', error);
    }
}

// Load gallery preview section
async function loadGalleryPreview() {
    try {
        const response = await fetch('/data/gallery.json');
        const galleryItems = await response.json();
        
        const container = document.getElementById('galleryPreviewContainer');
        if (!container) return;
        
        // Show first 3 gallery items as a preview
        const previewItems = galleryItems.slice(0, 3);
        
        container.innerHTML = previewItems.map(item => `
            <div class="gallery-preview-item">
                <div class="gallery-preview-image">
                    <img src="/${item.image}" alt="${item.title}" loading="lazy">
                    ${item.locked ? '<div class="gallery-lock-overlay">🔒</div>' : ''}
                </div>
                <div class="gallery-preview-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading gallery preview:', error);
    }
}

// Load FAQ preview section
async function loadFAQPreview() {
    try {
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
        if (!container) return;
        
        container.innerHTML = commonFAQs.map(faq => `
            <div class="faq-preview-item">
                <h4 class="faq-preview-question">${faq.question}</h4>
                <p class="faq-preview-answer">${faq.answer}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading FAQ preview:', error);
    }
}
