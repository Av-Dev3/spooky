// Custom Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('customNotification');
    const messageElement = notification.querySelector('.notification-message');
    
    // Set the message
    messageElement.textContent = message;
    
    // Remove existing type classes
    notification.classList.remove('success', 'error');
    
    // Add the appropriate type class
    notification.classList.add(type);
    
    // Show the notification
    notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    const notification = document.getElementById('customNotification');
    notification.classList.remove('show');
}

// Make functions globally available
window.showNotification = showNotification;
window.closeNotification = closeNotification;

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
            <div class="gallery-item ${item.locked ? 'locked' : ''}" data-image="${imageUrl}" data-title="${item.title}" data-description="${item.description || item.details || ''}">
                <div class="gallery-image">
                    <img src="${imageUrl}" alt="${item.title}" loading="lazy" onerror="this.src='/assets/logo.png'" style="width: 100% !important; height: 100% !important; object-fit: cover !important;">
                    ${item.locked ? `
                        <div class="lock-overlay">
                            <svg class="lock-icon" viewBox="0 0 24 24">
                                <path d="M12 1C9.24 1 7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5zm6 10v10H6V10h12zm-9-2V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
                            </svg>
                        </div>
                    ` : ''}
                </div>
                <div class="gallery-caption">
                    <h3>${item.title}</h3>
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

// Toggle modal request options based on selection
function toggleModalRequestOptions() {
    const requestType = document.getElementById('modalRequestType').value;
    const dickRateField = document.getElementById('modalDickRateField');
    const photosField = document.getElementById('modalPhotosField');
    const videosField = document.getElementById('modalVideosField');
    const extrasField = document.getElementById('modalExtrasField');
    
    // Hide all fields first
    dickRateField.style.display = 'none';
    photosField.style.display = 'none';
    videosField.style.display = 'none';
    extrasField.style.display = 'none';
    
    // Clear all selections
    document.getElementById('modalDickRatePrices').value = '';
    document.getElementById('modalNudePictures').value = '';
    document.getElementById('modalNudeVideos').value = '';
    document.getElementById('modalExtras').value = 'none';
    
    // Show relevant fields based on selection
    switch(requestType) {
        case 'dickrate':
            dickRateField.style.display = 'block';
            document.getElementById('modalDickRatePrices').required = true;
            document.getElementById('modalNudePictures').required = false;
            document.getElementById('modalNudeVideos').required = false;
            break;
        case 'photos':
            photosField.style.display = 'block';
            extrasField.style.display = 'block';
            document.getElementById('modalDickRatePrices').required = false;
            document.getElementById('modalNudePictures').required = true;
            document.getElementById('modalNudeVideos').required = false;
            break;
        case 'videos':
            videosField.style.display = 'block';
            extrasField.style.display = 'block';
            document.getElementById('modalDickRatePrices').required = false;
            document.getElementById('modalNudePictures').required = false;
            document.getElementById('modalNudeVideos').required = true;
            break;
        default:
            document.getElementById('modalDickRatePrices').required = false;
            document.getElementById('modalNudePictures').required = false;
            document.getElementById('modalNudeVideos').required = false;
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
            showNotification('Please select a contact method.', 'error');
            return;
        }
        if (!data.requestType || data.requestType.trim() === '') {
            showNotification('Please select a request type.', 'error');
            return;
        }
        
        // Validate second-level dropdowns based on request type
        if (data.requestType === 'dickrate') {
            if (!data.dickRatePrices) {
                showNotification('Please select a dick rate option.', 'error');
                return;
            }
        } else if (data.requestType === 'photos') {
            if (!data.nudePictures) {
                showNotification('Please select a nude pictures option.', 'error');
                return;
            }
        } else if (data.requestType === 'videos') {
            if (!data.nudeVideos) {
                showNotification('Please select a nude videos option.', 'error');
                return;
            }
        }
        if (!data.details) {
            showNotification('Please provide request details.', 'error');
            return;
        }
        if (!data.ageConfirm) {
            showNotification('Please confirm you are 18+.', 'error');
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
            showNotification(errorMessage, 'error');
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
                showNotification('Thank you for your custom content request! I will contact you using your preferred method within 24-48 hours.', 'success');
                
                // Close modal and reset form
                window.closeCustomsModal();
                form.reset();
                window.toggleModalContactFields(); // Reset contact fields visibility
                toggleModalRequestOptions(); // Reset request options visibility
            } else {
                showNotification('There was an error submitting your request. Please try again or contact me directly.', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showNotification('There was an error submitting your request. Please try again or contact me directly.', 'error');
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
