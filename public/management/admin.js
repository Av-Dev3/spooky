// Simple Admin Panel JavaScript
class SimpleAdminPanel {
    constructor() {
        this.currentContentType = 'shop';
        this.shopItems = [];
        this.galleryItems = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadCurrentContent();
    }
    
    setupEventListeners() {
        // File input change handlers
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], 'shop');
        });
        
        document.getElementById('galleryFileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], 'gallery');
        });
    }
    
    setupDragAndDrop() {
        const uploadAreas = [
            document.getElementById('uploadArea'),
            document.getElementById('galleryUploadArea')
        ];
        
        uploadAreas.forEach(area => {
            if (!area) return;
            
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });
            
            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });
            
            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const contentType = area.id === 'uploadArea' ? 'shop' : 'gallery';
                    this.handleFileSelect(files[0], contentType);
                }
            });
        });
    }
    
    selectContentType(type) {
        this.currentContentType = type;
        
        // Update button states
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Show/hide forms
        if (type === 'shop') {
            document.getElementById('shopForm').classList.remove('hidden');
            document.getElementById('galleryForm').classList.add('hidden');
        } else {
            document.getElementById('shopForm').classList.add('hidden');
            document.getElementById('galleryForm').classList.remove('hidden');
        }
    }
    
    async handleFileSelect(file, contentType) {
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showAlert('Please select an image file', 'error');
            return;
        }
        
        // Show preview
        this.showImagePreview(file, contentType);
        
        // Store file for later use
        if (contentType === 'shop') {
            this.shopImageFile = file;
        } else {
            this.galleryImageFile = file;
        }
    }
    
    showImagePreview(file, contentType) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (contentType === 'shop') {
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('contentPreview').classList.remove('hidden');
            } else {
                document.getElementById('galleryPreviewImage').src = e.target.result;
                document.getElementById('galleryPreview').classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
    
    async addShopItem() {
        const title = document.getElementById('title').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        const description = document.getElementById('description').value.trim();
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(Boolean);
        const processorUrl = document.getElementById('processorUrl').value.trim();
        
        if (!title || !price || !description || !processorUrl) {
            this.showAlert('Please fill in all required fields', 'error');
            return;
        }
        
        if (!this.shopImageFile) {
            this.showAlert('Please select an image', 'error');
            return;
        }
        
        try {
            // Upload image first
            const imageUrl = await this.uploadImage(this.shopImageFile);
            
            // Create shop item
            const shopItem = {
                id: Date.now(), // Simple ID generation
                title,
                price,
                image: imageUrl,
                description,
                tags,
                processorUrl,
                type: 'shop'
            };
            
            // Add to local storage (this will update the shop page)
            this.shopItems.push(shopItem);
            localStorage.setItem('spooky_admin_shop', JSON.stringify(this.shopItems));
            
            this.showAlert('Shop item added successfully!', 'success');
            this.clearForm();
            this.loadCurrentContent();
            
        } catch (error) {
            console.error('Error adding shop item:', error);
            this.showAlert('Error adding shop item', 'error');
        }
    }
    
    async addGalleryItem() {
        const title = document.getElementById('galleryTitle').value.trim();
        const description = document.getElementById('galleryDescription').value.trim();
        const locked = document.getElementById('locked').value === 'true';
        
        if (!title || !description) {
            this.showAlert('Please fill in all required fields', 'error');
            return;
        }
        
        if (!this.galleryImageFile) {
            this.showAlert('Please select an image', 'error');
            return;
        }
        
        try {
            // Upload image first
            const imageUrl = await this.uploadImage(this.galleryImageFile);
            
            // Create gallery item
            const galleryItem = {
                id: Date.now(), // Simple ID generation
                title,
                image: imageUrl,
                description,
                locked,
                type: 'gallery'
            };
            
            // Add to local storage (this will update the gallery page)
            this.galleryItems.push(galleryItem);
            localStorage.setItem('spooky_admin_gallery', JSON.stringify(this.galleryItems));
            
            this.showAlert('Gallery item added successfully!', 'success');
            this.clearGalleryForm();
            this.loadCurrentContent();
            
        } catch (error) {
            console.error('Error adding gallery item:', error);
            this.showAlert('Error adding gallery item', 'error');
        }
    }
    
    async uploadImage(file) {
        try {
            // For now, we'll use a simple approach - convert to base64
            // In production, you'd upload to Supabase storage
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    }
    
    clearForm() {
        document.getElementById('title').value = '';
        document.getElementById('price').value = '';
        document.getElementById('description').value = '';
        document.getElementById('tags').value = '';
        document.getElementById('processorUrl').value = '';
        document.getElementById('contentPreview').classList.add('hidden');
        this.shopImageFile = null;
    }
    
    clearGalleryForm() {
        document.getElementById('galleryTitle').value = '';
        document.getElementById('galleryDescription').value = '';
        document.getElementById('locked').value = 'true';
        document.getElementById('galleryPreview').classList.add('hidden');
        this.galleryImageFile = null;
    }
    
    async loadCurrentContent() {
        try {
            // Load shop items
            const shopData = localStorage.getItem('spooky_admin_shop');
            this.shopItems = shopData ? JSON.parse(shopData) : [];
            
            // Load gallery items
            const galleryData = localStorage.getItem('spooky_admin_gallery');
            this.galleryItems = galleryData ? JSON.parse(galleryData) : [];
            
            this.renderCurrentContent();
            
        } catch (error) {
            console.error('Error loading current content:', error);
            this.showAlert('Error loading current content', 'error');
        }
    }
    
    renderCurrentContent() {
        const container = document.getElementById('currentContent');
        
        let html = '<div style="display: grid; gap: 1rem;">';
        
        // Shop items
        if (this.shopItems.length > 0) {
            html += '<h3>🛍️ Shop Items (' + this.shopItems.length + ')</h3>';
            this.shopItems.forEach(item => {
                html += `
                    <div style="background: #1a1a1a; padding: 1rem; border-radius: 8px; border: 1px solid #444;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                            <div style="flex: 1;">
                                <h4 style="color: #ff6b6b; margin-bottom: 0.5rem;">${item.title}</h4>
                                <p style="color: #ccc; margin-bottom: 0.5rem;">${item.description}</p>
                                <div style="color: #28a745; font-weight: bold;">$${item.price}</div>
                            </div>
                            <button onclick="adminPanel.deleteShopItem(${item.id})" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                `;
            });
        } else {
            html += '<p style="color: #888;">No shop items yet. Add your first item above!</p>';
        }
        
        // Gallery items
        if (this.galleryItems.length > 0) {
            html += '<h3 style="margin-top: 2rem;">🖼️ Gallery Items (' + this.galleryItems.length + ')</h3>';
            this.galleryItems.forEach(item => {
                html += `
                    <div style="background: #1a1a1a; padding: 1rem; border-radius: 8px; border: 1px solid #444;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                            <div style="flex: 1;">
                                <h4 style="color: #ff6b6b; margin-bottom: 0.5rem;">${item.title}</h4>
                                <p style="color: #ccc; margin-bottom: 0.5rem;">${item.description}</p>
                                <div style="color: ${item.locked ? '#ff6b6b' : '#28a745'};">${item.locked ? '🔒 Locked' : '🔓 Public'}</div>
                            </div>
                            <button onclick="adminPanel.deleteGalleryItem(${item.id})" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                `;
            });
        } else {
            html += '<p style="color: #888;">No gallery items yet. Add your first item above!</p>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    deleteShopItem(id) {
        if (!confirm('Are you sure you want to delete this shop item?')) return;
        
        this.shopItems = this.shopItems.filter(item => item.id !== id);
        localStorage.setItem('spooky_admin_shop', JSON.stringify(this.shopItems));
        
        this.showAlert('Shop item deleted successfully!', 'success');
        this.loadCurrentContent();
    }
    
    deleteGalleryItem(id) {
        if (!confirm('Are you sure you want to delete this gallery item?')) return;
        
        this.galleryItems = this.galleryItems.filter(item => item.id !== id);
        localStorage.setItem('spooky_admin_gallery', JSON.stringify(this.galleryItems));
        
        this.showAlert('Gallery item deleted successfully!', 'success');
        this.loadCurrentContent();
    }
    
    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Insert at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(alert, container.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Global functions for button clicks
function selectContentType(type) {
    adminPanel.selectContentType(type);
}

function addShopItem() {
    adminPanel.addShopItem();
}

function addGalleryItem() {
    adminPanel.addGalleryItem();
}

function clearForm() {
    adminPanel.clearForm();
}

function clearGalleryForm() {
    adminPanel.clearGalleryForm();
}

// Initialize admin panel when page loads
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new SimpleAdminPanel();
});
