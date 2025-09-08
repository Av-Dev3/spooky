// Homepage functionality for Spoookysnsfww
document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage.js loaded, initializing...');
    
    // Load quick links
    loadQuickLinks();
    
    // Load gallery preview
    loadGalleryPreview();
    
    // Load FAQ preview
    loadFAQPreview();
    
    // Initialize customs modal
    initCustomsModal();
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
        // Try to load from API first
        let response = await fetch('/api/gallery');
        console.log('Gallery response status:', response.status);
        
        let galleryItems = [];
        
        if (response.ok) {
            galleryItems = await response.json();
            console.log('Loaded gallery items from API:', galleryItems);
        } else {
            // Fallback to static JSON if API fails
            console.log('API failed, trying fallback JSON...');
            response = await fetch('data/gallery.json');
            if (response.ok) {
                galleryItems = await response.json();
                console.log('Loaded gallery items from JSON fallback:', galleryItems);
            } else {
                throw new Error('Both API and JSON fallback failed');
            }
        }
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
        
        container.innerHTML = previewItems.map(item => {
            // Handle both API format (storage_path) and JSON format (image)
            let imageUrl;
            if (item.storage_path) {
                // API format - build Supabase URL
                imageUrl = `https://clmzwnhrdxgvdweflqjx.supabase.co/storage/v1/object/public/media/${item.storage_path.split('/').pop()}`;
            } else if (item.image) {
                // JSON fallback format
                imageUrl = item.image;
            } else {
                // Default fallback
                imageUrl = '/assets/logo.png';
            }
            
            return `
            <div class="gallery-preview-item">
                <div class="gallery-preview-image">
                    <img src="${imageUrl}" alt="${item.title}" loading="lazy" onerror="this.src='/assets/logo.png'">
                    ${item.locked ? '<div class="gallery-lock-overlay">🔒</div>' : ''}
                </div>
                <div class="gallery-preview-info">
                    <h4>${item.title}</h4>
                    <p>${item.description || item.details || ''}</p>
                </div>
            </div>
            `;
        }).join('');
        
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

// Initialize customs modal functionality
function initCustomsModal() {
    const modal = document.getElementById('customsModal');
    const form = document.getElementById('customsModalForm');
    
    console.log('Looking for customs modal elements...');
    console.log('Modal found:', modal);
    console.log('Form found:', form);
    
    if (!modal || !form) {
        console.error('Customs modal elements not found');
        console.error('Modal:', modal);
        console.error('Form:', form);
        return;
    }
    
    console.log('Customs modal initialized successfully');
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        console.log('Homepage customs form submitted!');
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        console.log('Homepage form data:', data);
        console.log('All form fields:');
        for (const [key, value] of Object.entries(data)) {
            console.log(`  ${key}: "${value}" (${typeof value})`);
        }
        console.log('Request type value:', data.requestType);
        console.log('Request type type:', typeof data.requestType);
        
        // Validate required fields individually for better debugging
        if (!data.platform) {
            alert('Please select a contact method.');
            return;
        }
        if (!data.requestType || data.requestType.trim() === '') {
            alert('Please select a request type.');
            return;
        }
        if (!data.budget) {
            alert('Please select a budget range.');
            return;
        }
        if (!data.details) {
            alert('Please provide request details.');
            return;
        }
        if (!data.ageConfirm) {
            alert('Please confirm you are 18+.');
            return;
        }
        
        // Validate contact information based on selected method
        let contactValid = true;
        let errorMessage = '';
        
        switch(data.platform) {
            case 'twitter':
                if (!data.handle || data.handle.trim() === '') {
                    contactValid = false;
                    errorMessage = 'Please provide your Twitter/X username.';
                }
                break;
            case 'onlyfans':
                if (!data.onlyfansUsername || data.onlyfansUsername.trim() === '') {
                    contactValid = false;
                    errorMessage = 'Please provide your OnlyFans username.';
                }
                break;
            case 'email':
                if (!data.email || data.email.trim() === '') {
                    contactValid = false;
                    errorMessage = 'Please provide your email address.';
                }
                break;
        }
        
        if (!contactValid) {
            alert(errorMessage);
            return;
        }
        
        // Submit to API
        console.log('About to submit to API with data:', data);
        try {
            console.log('Making API call to /api/customs/submit');
            const response = await fetch('/api/customs/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('API response status:', response.status);
            console.log('API response ok:', response.ok);
            const result = await response.json();
            console.log('API response data:', result);
            
            if (result.success) {
                // Show success message
                alert('Thank you for your custom content request! I will contact you using your preferred method within 24-48 hours.');
                
                        // Close modal and reset form
        window.closeCustomsModal();
        form.reset();
        window.toggleModalContactFields(); // Reset contact fields visibility
                
                // Optional: Open OnlyFans for immediate contact
                if (confirm('Would you like to visit my OnlyFans page to send a direct message as well?')) {
                    window.open('https://onlyfans.com', '_blank');
                }
            } else {
                alert('There was an error submitting your request. Please try again or contact me directly.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your request. Please try again or contact me directly.');
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            window.closeCustomsModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            window.closeCustomsModal();
        }
    });
}

// Open customs modal
function openCustomsModal() {
    const modal = document.getElementById('customsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close customs modal
function closeCustomsModal() {
    const modal = document.getElementById('customsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Toggle contact fields in modal based on selection
function toggleModalContactFields() {
    const platform = document.getElementById('modalPlatform').value;
    const twitterField = document.getElementById('modalTwitterField');
    const onlyfansField = document.getElementById('modalOnlyfansField');
    const emailField = document.getElementById('modalEmailField');
    
    // Hide all fields first
    twitterField.style.display = 'none';
    onlyfansField.style.display = 'none';
    emailField.style.display = 'none';
    
    // Clear all inputs
    document.getElementById('modalHandle').value = '';
    document.getElementById('modalOnlyfansUsername').value = '';
    document.getElementById('modalEmail').value = '';
    
    // Show relevant field based on selection
    switch(platform) {
        case 'twitter':
            twitterField.style.display = 'block';
            break;
        case 'onlyfans':
            onlyfansField.style.display = 'block';
            break;
        case 'email':
            emailField.style.display = 'block';
            break;
    }
}

// Make functions globally available immediately
window.openCustomsModal = function() {
    const modal = document.getElementById('customsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCustomsModal = function() {
    const modal = document.getElementById('customsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.toggleModalContactFields = function() {
    const platform = document.getElementById('modalPlatform').value;
    const twitterField = document.getElementById('modalTwitterField');
    const onlyfansField = document.getElementById('modalOnlyfansField');
    const emailField = document.getElementById('modalEmailField');
    
    // Hide all fields first
    twitterField.style.display = 'none';
    onlyfansField.style.display = 'none';
    emailField.style.display = 'none';
    
    // Clear all inputs
    document.getElementById('modalHandle').value = '';
    document.getElementById('modalOnlyfansUsername').value = '';
    document.getElementById('modalEmail').value = '';
    
    // Show relevant field based on selection
    switch(platform) {
        case 'twitter':
            twitterField.style.display = 'block';
            break;
        case 'onlyfans':
            onlyfansField.style.display = 'block';
            break;
        case 'email':
            emailField.style.display = 'block';
            break;
    }
};
