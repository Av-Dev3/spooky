// Gallery JavaScript for dynamic content loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery JavaScript initialized');
    
    // Load gallery items from JSON
    loadGalleryItems();
    
    // Setup lightbox functionality
    setupLightbox();
});

        // Load gallery items from Supabase API
        async function loadGalleryItems() {
            try {
                // Load from Supabase API
                const response = await fetch('/api/admin/list/media?type=gallery');
                if (response.ok) {
                    const galleryItems = await response.json();
                    renderGalleryItems(galleryItems);
                    console.log('Gallery items loaded from Supabase:', galleryItems);
                    return;
                }
                
                // Fallback to JSON file if API fails
                const jsonResponse = await fetch('data/gallery.json?v=' + Date.now());
                if (jsonResponse.ok) {
                    const galleryItems = await jsonResponse.json();
                    renderGalleryItems(galleryItems);
                    console.log('Gallery items loaded from JSON file (fallback):', galleryItems);
                    return;
                }
                
                throw new Error('Both API and JSON failed');
                
            } catch (error) {
                console.warn('Could not load gallery items, using fallback:', error);
                renderFallbackGalleryItems();
            }
        }

// Render gallery items
function renderGalleryItems(items) {
    const container = document.querySelector('.gallery-grid');
    if (!container) return;
    
    container.innerHTML = items.map(item => {
        // Build the full image URL from Supabase storage
        const imageUrl = `https://clmzwnhrdxgvdweflqjx.supabase.co/storage/v1/object/public/media/${item.storage_path.split('/').pop()}`;
        
        console.log('Gallery item:', item);
        console.log('Storage path:', item.storage_path);
        console.log('Image URL:', imageUrl);
        
        return `
        <div class="gallery-item ${item.locked ? 'locked' : ''}" data-image="${imageUrl}" data-title="${item.title}" data-description="${item.description}">
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
                <p>${item.description}</p>
            </div>
        </div>
    `;
    }).join('');
    
    // Re-setup lightbox after rendering
    setupLightbox();
}

// Render fallback gallery items
function renderFallbackGalleryItems() {
    const container = document.querySelector('.gallery-grid');
    if (!container) return;
    
    const fallbackItems = [
        {
            title: "Teaser 1",
            description: "Click to preview",
            image: "assets/logo.png",
            locked: true
        },
        {
            title: "Teaser 2", 
            description: "Click to preview",
            image: "assets/logo.png",
            locked: true
        },
        {
            title: "Teaser 3",
            description: "Click to preview", 
            image: "assets/logo.png",
            locked: true
        }
    ];
    
    renderGalleryItems(fallbackItems);
}

// Setup lightbox functionality
function setupLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Add click handlers to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const image = this.dataset.image;
            const title = this.dataset.title;
            const description = this.dataset.description;
            
            // Check if item is locked
            if (this.classList.contains('locked')) {
                // Show locked message or redirect to shop
                alert('This content is locked. Visit the shop to unlock!');
                return;
            }
            
            // Show lightbox
            lightboxImage.src = image;
            lightboxImage.style.width = '100%';
            lightboxImage.style.height = '100%';
            lightboxImage.style.objectFit = 'contain';
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            lightbox.style.display = 'flex';
        });
    });
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });
    }
    
    // Close lightbox when clicking outside
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });
}
