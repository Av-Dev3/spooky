// Simple Admin Panel JavaScript - Connected to Supabase
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
            
            // Create shop item data
            const shopItem = {
                storagePath: `media/${imageUrl}`,
                title,
                description,
                contentType: this.shopImageFile.type,
                tags,
                type: 'shop',
                price,
                processorUrl
            };
            
            // Send to Supabase via API
            const response = await fetch('/api/admin/media/commit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopItem)
            });
            
            if (response.ok) {
                this.showAlert('Shop item added successfully!', 'success');
                this.clearForm();
                await this.loadCurrentContent();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add shop item');
            }
            
        } catch (error) {
            console.error('Error adding shop item:', error);
            this.showAlert(`Error adding shop item: ${error.message}`, 'error');
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
            
            // Create gallery item data
            const galleryItem = {
                storagePath: `media/${imageUrl}`,
                title,
                description,
                contentType: this.galleryImageFile.type,
                tags: [],
                type: 'gallery'
            };
            
            // Send to Supabase via API
            const response = await fetch('/api/admin/media/commit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(galleryItem)
            });
            
            if (response.ok) {
                this.showAlert('Gallery item added successfully!', 'success');
                this.clearGalleryForm();
                await this.loadCurrentContent();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add gallery item');
            }
            
        } catch (error) {
            console.error('Error adding gallery item:', error);
            this.showAlert(`Error adding gallery item: ${error.message}`, 'error');
        }
    }
    
    async uploadImage(file) {
        try {
            console.log('Starting upload for file:', file.name, 'type:', file.type);
            
            const requestBody = {
                filename: file.name,
                contentType: file.type
            };
            console.log('Request body:', requestBody);
            
            // Get signed upload URL from Supabase
            const response = await fetch('/api/admin/media/signed-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get upload URL');
            }
            
            const responseData = await response.json();
            console.log('Response data:', responseData);
            
            const { uploadUrl, fileId } = responseData;
            console.log('Upload URL:', uploadUrl);
            console.log('File ID:', fileId);
            
            // Upload file to Supabase storage
            console.log('About to upload file to Supabase storage...');
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                }
            });
            
            console.log('Upload response status:', uploadResponse.status);
            console.log('Upload response headers:', uploadResponse.headers);
            
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file to storage');
            }
            
            // Return the file ID for the commit API
            return fileId;
            
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
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
            // Load shop items from Supabase
            const shopResponse = await fetch('/api/admin/list/media?type=shop');
            if (shopResponse.ok) {
                this.shopItems = await shopResponse.json();
            } else {
                console.error('Failed to load shop items');
                this.shopItems = [];
            }
            
            // Load gallery items from Supabase
            const galleryResponse = await fetch('/api/admin/list/media?type=gallery');
            if (galleryResponse.ok) {
                this.galleryItems = await galleryResponse.json();
            } else {
                console.error('Failed to load gallery items');
                this.galleryItems = [];
            }
            
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
    
    async deleteShopItem(id) {
        if (!confirm('Are you sure you want to delete this shop item?')) return;
        
        try {
            const response = await fetch('/api/admin/media/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, type: 'shop' })
            });
            
            if (response.ok) {
                this.showAlert('Shop item deleted successfully!', 'success');
                await this.loadCurrentContent();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete shop item');
            }
        } catch (error) {
            console.error('Error deleting shop item:', error);
            this.showAlert(`Error deleting shop item: ${error.message}`, 'error');
        }
    }
    
    async deleteGalleryItem(id) {
        if (!confirm('Are you sure you want to delete this gallery item?')) return;
        
        try {
            const response = await fetch('/api/admin/media/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, type: 'gallery' })
            });
            
            if (response.ok) {
                this.showAlert('Gallery item deleted successfully!', 'success');
                await this.loadCurrentContent();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete gallery item');
            }
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            this.showAlert(`Error deleting gallery item: ${error.message}`, 'error');
        }
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
