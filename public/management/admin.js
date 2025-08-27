// Simple Admin Panel JavaScript - Connected to Supabase
class SimpleAdminPanel {
    constructor() {
        this.currentContentType = 'shop';
        this.shopItems = [];
        this.galleryItems = [];
        this.config = null;
        
        this.init();
    }
    
    async init() {
        await this.loadConfig();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadCurrentContent();
    }
    
    async loadConfig() {
        try {
            const response = await fetch('/api/admin/config');
            if (response.ok) {
                this.config = await response.json();
                console.log('Loaded config:', this.config);
            } else {
                console.error('Failed to load config');
                // Use fallback config
                this.config = {
                    supabaseUrl: 'https://your-project.supabase.co',
                    storageBucket: 'media'
                };
            }
        } catch (error) {
            console.error('Error loading config:', error);
            // Use fallback config
            this.config = {
                supabaseUrl: 'https://your-project.supabase.co',
                storageBucket: 'media'
            };
        }
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
                title,
                price,
                description,
                imageUrl,
                tags,
                processorUrl
            };
            
            // Send to Supabase via API
            const response = await fetch('/api/admin/shop/commit', {
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
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.error || errorData.details || 'Failed to add shop item');
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
            const shopResponse = await fetch('/api/admin/shop/list');
            if (shopResponse.ok) {
                this.shopItems = await shopResponse.json();
                console.log('Loaded shop items:', this.shopItems);
            } else {
                const errorData = await shopResponse.json();
                console.error('Failed to load shop items:', errorData);
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
            this.updateDebugInfo(); // Update debug info after content is loaded
            
        } catch (error) {
            console.error('Error loading current content:', error);
            this.showAlert('Error loading current content', 'error');
        }
    }
    
    // Helper method to construct proper image URLs
    getImageUrl(fileId) {
        if (!fileId || !this.config) return this.getPlaceholderImage();
        return `${this.config.supabaseUrl}/storage/v1/object/public/${this.config.storageBucket}/${fileId}`;
    }
    
    // Test if an image URL is accessible
    async testImageUrl(imageUrl) {
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error('Error testing image URL:', imageUrl, error);
            return false;
        }
    }
    
    // Get a simple placeholder image as data URL
    getPlaceholderImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMCAyMEg2MFY2MEgyMFYyMFoiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yMCAyMEg2MFY2MEgyMFYyMFoiIHN0cm9rZT0iIjk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIjk5OSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj5JbWFnZTwvdGV4dD4KPC9zdmc+';
    }
    
    renderCurrentContent() {
        const container = document.getElementById('currentContent');
        
        let html = '<div style="display: grid; gap: 1rem;">';
        
        console.log('Starting to render content...');
        console.log('Shop items count:', this.shopItems.length);
        console.log('Gallery items count:', this.galleryItems.length);
        
        // Shop items
        if (this.shopItems.length > 0) {
            console.log('Rendering shop items...');
            html += '<h3>🛍️ Shop Items (' + this.shopItems.length + ')</h3>';
            this.shopItems.forEach((item, index) => {
                console.log(`Rendering shop item ${index}:`, item);
                
                // Construct proper image URL from fileId stored in image_url
                const imageUrl = this.getImageUrl(item.image_url);
                console.log('Constructed image URL:', imageUrl);
                
                // Test the image URL
                this.testImageUrl(imageUrl).then(isAccessible => {
                    console.log(`Image ${imageUrl} is accessible:`, isAccessible);
                    if (!isAccessible) {
                        console.warn('Image not accessible, this might be a storage bucket configuration issue');
                    }
                });
                
                const itemHtml = `
                    <div style="background: #1a1a1a; padding: 1rem; border-radius: 8px; border: 1px solid #444;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <img src="${imageUrl}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" onerror="this.src=adminPanel.getPlaceholderImage(); console.warn('Image failed to load:', '${imageUrl}');">
                            <div style="flex: 1;">
                                <h4 style="color: #ff6b6b; margin-bottom: 0.5rem;">${item.title}</h4>
                                <p style="color: #ccc; margin-bottom: 0.5rem;">${item.description}</p>
                                <div style="color: #28a745; font-weight: bold;">$${item.price}</div>
                                <div style="color: #888; font-size: 0.8rem;">File: ${item.image_url}</div>
                            </div>
                            <button onclick="deleteShopItemGlobal('${item.id}')" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                `;
                
                console.log(`Generated HTML for shop item ${index}:`, itemHtml);
                html += itemHtml;
            });
            console.log('Finished rendering shop items');
        } else {
            console.log('No shop items to render');
            html += '<p style="color: #888;">No shop items yet. Add your first item above!</p>';
        }
        
        // Gallery items
        if (this.galleryItems.length > 0) {
            console.log('Rendering gallery items...');
            html += '<h3 style="margin-top: 2rem;">🖼️ Gallery Items (' + this.galleryItems.length + ')</h3>';
            this.galleryItems.forEach((item, index) => {
                console.log(`Rendering gallery item ${index}:`, item);
                
                const itemHtml = `
                    <div style="background: #1a1a1a; padding: 1rem; border-radius: 8px; border: 1px solid #444;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" onerror="this.src=adminPanel.getPlaceholderImage(); console.warn('Image failed to load:', '${item.image}');">
                            <div style="flex: 1;">
                                <h4 style="color: #ff6b6b; margin-bottom: 0.5rem;">${item.title}</h4>
                                <p style="color: #ccc; margin-bottom: 0.5rem;">${item.description}</p>
                                <div style="color: ${item.locked ? '#ff6b6b' : '#28a745'};">${item.locked ? '🔒 Locked' : '🔓 Public'}</div>
                            </div>
                            <button onclick="deleteGalleryItemGlobal('${item.id}')" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                `;
                
                console.log(`Generated HTML for gallery item ${index}:`, itemHtml);
                html += itemHtml;
            });
            console.log('Finished rendering gallery items');
        } else {
            console.log('No gallery items to render');
            html += '<p style="color: #888;">No gallery items yet. Add your first item above!</p>';
        }
        
        html += '</div>';
        
        console.log('Final HTML length:', html.length);
        console.log('Setting container innerHTML...');
        
        container.innerHTML = html;
        
        console.log('Content rendered successfully');
        
        // Update debug info
        this.updateDebugInfo();
    }
    
    async deleteShopItem(id) {
        console.log('deleteShopItem called with ID:', id);
        console.log('ID type:', typeof id);
        console.log('ID value:', id);
        
        if (!confirm('Are you sure you want to delete this shop item?')) {
            console.log('User cancelled deletion');
            return;
        }
        
        try {
            console.log('Sending delete request to /api/admin/shop/delete with ID:', id);
            const response = await fetch('/api/admin/shop/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });
            
            console.log('Delete response status:', response.status);
            console.log('Delete response headers:', response.headers);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Delete successful, result:', result);
                this.showAlert('Shop item deleted successfully!', 'success');
                await this.loadCurrentContent();
            } else {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.error || errorData.details || 'Failed to delete shop item');
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
    
    // Debug method to test all current image URLs
    async testCurrentImages() {
        const debugInfo = document.getElementById('debugInfo');
        debugInfo.innerHTML = '<p>Testing image URLs...</p>';
        
        let results = [];
        
        // Test shop item images
        for (const item of this.shopItems) {
            const imageUrl = await this.getImageUrl(item.image_url);
            const isAccessible = await this.testImageUrl(imageUrl);
            results.push({
                type: 'Shop Item',
                title: item.title,
                filename: item.image_url,
                url: imageUrl,
                accessible: isAccessible
            });
        }
        
        // Display results
        let html = '<div style="background: #1a1a1a; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">';
        html += '<h4>Image URL Test Results:</h4>';
        
        results.forEach(result => {
            const statusColor = result.accessible ? '#28a745' : '#dc3545';
            const statusText = result.accessible ? '✅ Accessible' : '❌ Not Accessible';
            
            html += `
                <div style="margin-bottom: 0.5rem; padding: 0.5rem; border-left: 3px solid ${statusColor}; background: #2d2d2d;">
                    <div><strong>${result.type}:</strong> ${result.title}</div>
                    <div style="color: #888; font-size: 0.8rem;">File: ${result.filename}</div>
                    <div style="color: #888; font-size: 0.8rem;">URL: ${result.url}</div>
                    <div style="color: ${statusColor}; font-weight: bold;">${statusText}</div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add configuration info
        html += '<div style="background: #1a1a1a; padding: 1rem; border-radius: 8px;">';
        html += '<h4>Configuration:</h4>';
        html += `<div>Supabase URL: ${this.config?.supabaseUrl || 'Not loaded'}</div>`;
        html += `<div>Storage Bucket: ${this.config?.storageBucket || 'Not loaded'}</div>`;
        html += '</div>';
        
        debugInfo.innerHTML = html;
    }
    
    // Update debug info when content is loaded
    updateDebugInfo() {
        const debugInfo = document.getElementById('debugInfo');
        if (debugInfo) {
            let html = '<div style="background: #1a1a1a; padding: 1rem; border-radius: 8px;">';
            html += '<h4>Current Status:</h4>';
            html += `<div>Shop Items: ${this.shopItems.length}</div>`;
            html += `<div>Gallery Items: ${this.galleryItems.length}</div>`;
            html += `<div>Config Loaded: ${this.config ? 'Yes' : 'No'}</div>`;
            if (this.config) {
                html += `<div>Supabase URL: ${this.config.supabaseUrl}</div>`;
                html += `<div>Storage Bucket: ${this.config.storageBucket}</div>`;
            }
            html += '</div>';
            debugInfo.innerHTML = html;
        }
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

// Global delete functions
function deleteShopItemGlobal(id) {
    console.log('deleteShopItemGlobal called with ID:', id);
    console.log('adminPanel available:', typeof adminPanel !== 'undefined');
    console.log('adminPanel value:', adminPanel);
    
    try {
        if (adminPanel && typeof adminPanel.deleteShopItem === 'function') {
            console.log('Calling adminPanel.deleteShopItem...');
            adminPanel.deleteShopItem(id);
        } else {
            console.error('adminPanel not available or deleteShopItem method not found');
            alert('Admin panel not ready. Please refresh the page.');
        }
    } catch (error) {
        console.error('Error in deleteShopItemGlobal:', error);
        alert('Error deleting shop item: ' + error.message);
    }
}

function deleteGalleryItemGlobal(id) {
    console.log('deleteGalleryItemGlobal called with ID:', id);
    console.log('adminPanel available:', typeof adminPanel !== 'undefined');
    
    try {
        if (adminPanel && typeof adminPanel.deleteGalleryItem === 'function') {
            console.log('Calling adminPanel.deleteGalleryItem...');
            adminPanel.deleteGalleryItem(id);
        } else {
            console.error('adminPanel not available or deleteGalleryItem method not found');
            alert('Admin panel not ready. Please refresh the page.');
        }
    } catch (error) {
        console.error('Error in deleteGalleryItemGlobal:', error);
        alert('Error deleting gallery item: ' + error.message);
    }
}

// Initialize admin panel when page loads
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new SimpleAdminPanel();
});
