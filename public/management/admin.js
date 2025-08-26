// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentTab = 'shop';
        this.shopItems = [];
        this.galleryItems = [];
        this.mediaItems = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadContent();
        this.setupDragAndDrop();
    }
    
    bindEvents() {
        // Shop form
        document.getElementById('shopForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addShopItem();
        });
        
        // Gallery form
        document.getElementById('galleryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGalleryItem();
        });
        
        // Settings form
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
        
        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });
    }
    
    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files);
        });
    }
    
    showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(tabName).classList.add('active');
        
        // Add active class to selected tab
        event.target.classList.add('active');
        
        this.currentTab = tabName;
        
        // Load content for the selected tab
        if (tabName === 'shop') {
            this.loadShopItems();
        } else if (tabName === 'gallery') {
            this.loadGalleryItems();
        } else if (tabName === 'upload') {
            this.loadMediaLibrary();
        }
    }
    
    async loadContent() {
        await Promise.all([
            this.loadShopItems(),
            this.loadGalleryItems(),
            this.loadMediaLibrary()
        ]);
    }
    
    async loadShopItems() {
        try {
            const response = await fetch('/api/admin/list/media?type=shop');
            if (response.ok) {
                this.shopItems = await response.json();
                this.renderShopItems();
            }
        } catch (error) {
            console.error('Error loading shop items:', error);
            this.showAlert('Error loading shop items', 'error');
        }
    }
    
    async loadGalleryItems() {
        try {
            const response = await fetch('/api/admin/list/media?type=gallery');
            if (response.ok) {
                this.galleryItems = await response.json();
                this.renderGalleryItems();
            }
        } catch (error) {
            console.error('Error loading gallery items:', error);
            this.showAlert('Error loading gallery items', 'error');
        }
    }
    
    async loadMediaLibrary() {
        try {
            const response = await fetch('/api/admin/list/media?type=all');
            if (response.ok) {
                this.mediaItems = await response.json();
                this.renderMediaLibrary();
            }
        } catch (error) {
            console.error('Error loading media library:', error);
            this.showAlert('Error loading media library', 'error');
        }
    }
    
    async addShopItem() {
        const formData = {
            title: document.getElementById('shopTitle').value,
            price: parseFloat(document.getElementById('shopPrice').value),
            image: document.getElementById('shopImage').value,
            tags: document.getElementById('shopTags').value.split(',').map(tag => tag.trim()),
            processorUrl: document.getElementById('shopProcessor').value,
            description: document.getElementById('shopDescription').value,
            type: 'shop'
        };
        
        try {
            const response = await fetch('/api/admin/media/commit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                this.showAlert('Shop item added successfully!', 'success');
                document.getElementById('shopForm').reset();
                await this.loadShopItems();
            } else {
                throw new Error('Failed to add shop item');
            }
        } catch (error) {
            console.error('Error adding shop item:', error);
            this.showAlert('Error adding shop item', 'error');
        }
    }
    
    async addGalleryItem() {
        const formData = {
            title: document.getElementById('galleryTitle').value,
            image: document.getElementById('galleryImage').value,
            description: document.getElementById('galleryDescription').value,
            locked: document.getElementById('galleryLocked').value === 'true',
            type: 'gallery'
        };
        
        try {
            const response = await fetch('/api/admin/media/commit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                this.showAlert('Gallery item added successfully!', 'success');
                document.getElementById('galleryForm').reset();
                await this.loadGalleryItems();
            } else {
                throw new Error('Failed to add gallery item');
            }
        } catch (error) {
            console.error('Error adding gallery item:', error);
            this.showAlert('Error adding gallery item', 'error');
        }
    }
    
    async saveSettings() {
        const settings = {
            siteTitle: document.getElementById('siteTitle').value,
            siteDescription: document.getElementById('siteDescription').value,
            maintenanceMode: document.getElementById('maintenanceMode').value === 'true'
        };
        
        try {
            // Save to localStorage for now (you can implement API endpoint later)
            localStorage.setItem('siteSettings', JSON.stringify(settings));
            this.showAlert('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showAlert('Error saving settings', 'error');
        }
    }
    
    async handleFileSelect(files) {
        for (let file of files) {
            await this.uploadFile(file);
        }
    }
    
    async uploadFile(file) {
        try {
            // Get signed upload URL
            const response = await fetch('/api/admin/media/signed-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to get upload URL');
            }
            
            const { uploadUrl, fileId } = await response.json();
            
            // Upload file to Supabase
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                }
            });
            
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file');
            }
            
            // Commit the upload
            const commitResponse = await fetch('/api/admin/media/commit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileId,
                    title: file.name,
                    type: 'media'
                })
            });
            
            if (commitResponse.ok) {
                this.showAlert(`File ${file.name} uploaded successfully!`, 'success');
                await this.loadMediaLibrary();
            } else {
                throw new Error('Failed to commit upload');
            }
            
        } catch (error) {
            console.error('Error uploading file:', error);
            this.showAlert(`Error uploading ${file.name}`, 'error');
        }
    }
    
    renderShopItems() {
        const container = document.getElementById('shopItems');
        container.innerHTML = '';
        
        this.shopItems.forEach(item => {
            const card = this.createShopCard(item);
            container.appendChild(card);
        });
    }
    
    renderGalleryItems() {
        const container = document.getElementById('galleryItems');
        container.innerHTML = '';
        
        this.galleryItems.forEach(item => {
            const card = this.createGalleryCard(item);
            container.appendChild(card);
        });
    }
    
    renderMediaLibrary() {
        const container = document.getElementById('mediaLibrary');
        container.innerHTML = '';
        
        this.mediaItems.forEach(item => {
            const card = this.createMediaCard(item);
            container.appendChild(card);
        });
    }
    
    createShopCard(item) {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='/assets/logo.png'">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="price">$${item.price}</div>
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary" onclick="adminPanel.editShopItem(${item.id})">Edit</button>
                <button class="btn btn-danger" onclick="adminPanel.deleteShopItem(${item.id})">Delete</button>
            </div>
        `;
        
        return card;
    }
    
    createGalleryCard(item) {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='/assets/logo.png'">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="status-badge ${item.locked ? 'status-draft' : 'status-published'}">
                ${item.locked ? 'Locked' : 'Public'}
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary" onclick="adminPanel.editGalleryItem(${item.id})">Edit</button>
                <button class="btn btn-danger" onclick="adminPanel.deleteGalleryItem(${item.id})">Delete</button>
            </div>
        `;
        
        return card;
    }
    
    createMediaCard(item) {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        const isVideo = item.contentType && item.contentType.startsWith('video/');
        const mediaElement = isVideo ? 
            `<video src="${item.url}" controls></video>` : 
            `<img src="${item.url}" alt="${item.title}" onerror="this.src='/assets/logo.png'">`;
        
        card.innerHTML = `
            ${mediaElement}
            <h3>${item.title}</h3>
            <p>${item.contentType || 'Unknown type'}</p>
            <div class="card-actions">
                <button class="btn btn-secondary" onclick="adminPanel.copyMediaUrl('${item.url}')">Copy URL</button>
                <button class="btn btn-danger" onclick="adminPanel.deleteMediaItem(${item.id})">Delete</button>
            </div>
        `;
        
        return card;
    }
    
    async editShopItem(id) {
        const item = this.shopItems.find(item => item.id === id);
        if (!item) return;
        
        // Populate form with item data
        document.getElementById('shopTitle').value = item.title;
        document.getElementById('shopPrice').value = item.price;
        document.getElementById('shopImage').value = item.image;
        document.getElementById('shopTags').value = item.tags.join(', ');
        document.getElementById('shopProcessor').value = item.processorUrl;
        document.getElementById('shopDescription').value = item.description;
        
        // Switch to shop tab
        this.showTab('shop');
        
        // Change button text
        const submitBtn = document.querySelector('#shopForm button[type="submit"]');
        submitBtn.textContent = 'Update Shop Item';
        submitBtn.dataset.editId = id;
    }
    
    async editGalleryItem(id) {
        const item = this.galleryItems.find(item => item.id === id);
        if (!item) return;
        
        // Populate form with item data
        document.getElementById('galleryTitle').value = item.title;
        document.getElementById('galleryImage').value = item.image;
        document.getElementById('galleryDescription').value = item.description;
        document.getElementById('galleryLocked').value = item.locked.toString();
        
        // Switch to gallery tab
        this.showTab('gallery');
        
        // Change button text
        const submitBtn = document.querySelector('#galleryForm button[type="submit"]');
        submitBtn.textContent = 'Update Gallery Item';
        submitBtn.dataset.editId = id;
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
                await this.loadShopItems();
            } else {
                throw new Error('Failed to delete shop item');
            }
        } catch (error) {
            console.error('Error deleting shop item:', error);
            this.showAlert('Error deleting shop item', 'error');
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
                await this.loadGalleryItems();
            } else {
                throw new Error('Failed to delete gallery item');
            }
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            this.showAlert('Error deleting gallery item', 'error');
        }
    }
    
    async deleteMediaItem(id) {
        if (!confirm('Are you sure you want to delete this media item?')) return;
        
        try {
            const response = await fetch('/api/admin/media/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, type: 'media' })
            });
            
            if (response.ok) {
                this.showAlert('Media item deleted successfully!', 'success');
                await this.loadMediaLibrary();
            } else {
                throw new Error('Failed to delete media item');
            }
        } catch (error) {
            console.error('Error deleting media item:', error);
            this.showAlert('Error deleting media item', 'error');
        }
    }
    
    copyMediaUrl(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showAlert('Media URL copied to clipboard!', 'success');
        }).catch(() => {
            this.showAlert('Failed to copy URL', 'error');
        });
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
    
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
            if (settings.siteTitle) document.getElementById('siteTitle').value = settings.siteTitle;
            if (settings.siteDescription) document.getElementById('siteDescription').value = settings.siteDescription;
            if (settings.maintenanceMode !== undefined) document.getElementById('maintenanceMode').value = settings.maintenanceMode.toString();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
}

// Global function for tab switching
function showTab(tabName) {
    adminPanel.showTab(tabName);
}

// Initialize admin panel when page loads
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    adminPanel.loadSettings();
});
