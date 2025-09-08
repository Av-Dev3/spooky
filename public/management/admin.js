// Simple Admin Panel JavaScript - Connected to Supabase (Gallery Only)
class SimpleAdminPanel {
    constructor() {
        this.galleryItems = [];
        this.config = null;
        
        this.init();
    }
    
    async init() {
        await this.loadConfig();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadCurrentContent();
        this.loadSubmissions();
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
        // Gallery file input change handler
        document.getElementById('galleryFileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], 'gallery');
        });
    }
    
    setupDragAndDrop() {
        const uploadArea = document.getElementById('galleryUploadArea');
        
        if (!uploadArea) return;
        
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
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0], 'gallery');
            }
        });
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
        if (contentType === 'gallery') {
            this.galleryImageFile = file;
        }
    }
    
    showImagePreview(file, contentType) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (contentType === 'gallery') {
                document.getElementById('galleryPreviewImage').src = e.target.result;
                document.getElementById('galleryPreview').classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
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
                title,
                description,
                imageUrl,
                locked
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
                this.clearForm();
                await this.loadCurrentContent();
            } else {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.error || errorData.details || 'Failed to add gallery item');
            }
            
        } catch (error) {
            console.error('Error adding gallery item:', error);
            this.showAlert(`Error adding gallery item: ${error.message}`, 'error');
        }
    }
    
    async uploadImage(file) {
        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);
            
            // Upload to Supabase storage via API
            const response = await fetch('/api/admin/media/signed-upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }
            
            const result = await response.json();
            return result.url;
            
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
    
    clearForm() {
        // Clear gallery form
        document.getElementById('galleryTitle').value = '';
        document.getElementById('galleryDescription').value = '';
        document.getElementById('locked').value = 'false';
        document.getElementById('galleryPreview').classList.add('hidden');
        this.galleryImageFile = null;
    }
    
    async loadCurrentContent() {
        try {
            // Load gallery items from Supabase
            const galleryResponse = await fetch('/api/admin/list/media');
            if (galleryResponse.ok) {
                this.galleryItems = await galleryResponse.json();
                console.log('Loaded gallery items:', this.galleryItems);
            } else {
                const errorData = await galleryResponse.json();
                console.error('Failed to load gallery items:', errorData);
                this.galleryItems = [];
            }
            
            this.renderContent();
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showAlert('Error loading content', 'error');
        }
    }
    
    renderContent() {
        const contentContainer = document.getElementById('contentContainer');
        if (!contentContainer) return;
        
        let html = '';
        
        console.log('Gallery items count:', this.galleryItems.length);
        
        // Gallery items
        if (this.galleryItems.length > 0) {
            console.log('Rendering gallery items...');
            html += '<h3 class="content-section-title">📸 Gallery Items (' + this.galleryItems.length + ')</h3>';
            this.galleryItems.forEach((item, index) => {
                console.log(`Rendering gallery item ${index}:`, item);
                
                const itemHtml = `
                    <div class="content-item" data-id="${item.id}" data-type="gallery">
                        <div class="content-image">
                            <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='/assets/logo.png'">
                        </div>
                        <div class="content-details">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <div class="content-meta">
                                <span class="content-type">Gallery</span>
                                <span class="content-status ${item.locked ? 'locked' : 'unlocked'}">
                                    ${item.locked ? '🔒 Locked' : '🔓 Unlocked'}
                                </span>
                            </div>
                            <div class="content-actions">
                                <button onclick="deleteGalleryItemGlobal('${item.id}')" class="delete-btn">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                
                html += itemHtml;
                console.log(`Generated HTML for gallery item ${index}:`, itemHtml);
            });
            console.log('Finished rendering gallery items');
        } else {
            console.log('No gallery items to render');
            html += '<p class="no-content-message">No gallery items yet. Add your first item above!</p>';
        }
        
        contentContainer.innerHTML = html;
    }
    
    async deleteGalleryItem(id) {
        console.log('deleteGalleryItem called with ID:', id);
        
        try {
            if (!confirm('Are you sure you want to delete this gallery item?')) {
                return;
            }
            
            console.log('Sending delete request to /api/admin/media/delete with ID:', id);
            const response = await fetch('/api/admin/media/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });
            
            if (response.ok) {
                this.showAlert('Gallery item deleted successfully!', 'success');
                await this.loadCurrentContent();
            } else {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.error || errorData.details || 'Failed to delete gallery item');
            }
            
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            this.showAlert(`Error deleting gallery item: ${error.message}`, 'error');
        }
    }
    
    async testImages() {
        try {
            this.showAlert('Testing images...', 'info');
            
            // Test gallery item images
            for (const item of this.galleryItems) {
                try {
                    const img = new Image();
                    img.onload = () => {
                        console.log(`✅ Image loads successfully: ${item.title}`);
                    };
                    img.onerror = () => {
                        console.log(`❌ Image failed to load: ${item.title}`);
                        this.showAlert(`Image failed to load: ${item.title}`, 'error');
                    };
                    img.src = item.imageUrl;
                } catch (error) {
                    console.error(`Error testing image for ${item.title}:`, error);
                }
            }
            
            this.showAlert('Image testing completed. Check console for results.', 'success');
            
        } catch (error) {
            console.error('Error testing images:', error);
            this.showAlert('Error testing images', 'error');
        }
    }
    
    showStats() {
        let html = '<div class="stats-container">';
        html += '<h3>Content Statistics</h3>';
        html += '<div class="stats-grid">';
        html += `<div>Gallery Items: ${this.galleryItems.length}</div>`;
        html += '</div>';
        html += '</div>';
        
        this.showAlert(html, 'info', true);
    }
    
    showAlert(message, type = 'info', isHTML = false) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        if (isHTML) {
            alert.innerHTML = message;
        } else {
            alert.textContent = message;
        }
        
        alertContainer.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }
}

// Global functions for HTML onclick handlers
function addGalleryItem() {
    adminPanel.addGalleryItem();
}

function deleteGalleryItemGlobal(id) {
    console.log('deleteGalleryItemGlobal called with ID:', id);
    
    try {
        if (adminPanel && typeof adminPanel.deleteGalleryItem === 'function') {
            console.log('Calling adminPanel.deleteGalleryItem...');
            adminPanel.deleteGalleryItem(id);
        } else {
            console.error('adminPanel not available or deleteGalleryItem method not found');
        }
    } catch (error) {
        console.error('Error in deleteGalleryItemGlobal:', error);
        alert('Error deleting gallery item: ' + error.message);
    }
}

function testImages() {
    adminPanel.testImages();
}

function showStats() {
    adminPanel.showStats();
}

// Add submissions methods to the class
SimpleAdminPanel.prototype.loadSubmissions = async function() {
    try {
        const response = await fetch('/api/admin/submissions');
        const result = await response.json();
        
        if (result.success) {
            this.displaySubmissions(result.submissions);
        } else {
            console.error('Failed to load submissions:', result.error);
            document.getElementById('submissionsContainer').innerHTML = 
                '<p class="no-submissions">Failed to load submissions</p>';
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        document.getElementById('submissionsContainer').innerHTML = 
            '<p class="no-submissions">Error loading submissions</p>';
    }
};

SimpleAdminPanel.prototype.displaySubmissions = function(submissions) {
    const container = document.getElementById('submissionsContainer');
    
    if (!submissions || submissions.length === 0) {
        container.innerHTML = '<p class="no-submissions">No custom content submissions yet</p>';
        return;
    }
    
    container.innerHTML = submissions.map(submission => {
        const timestamp = new Date(submission.timestamp).toLocaleString();
        const contactInfo = this.getContactInfo(submission);
        
        return `
            <div class="submission-item status-${submission.status}">
                <div class="submission-header">
                    <div class="submission-info">
                        <div class="submission-id">ID: ${submission.id}</div>
                        <div class="submission-timestamp">${timestamp}</div>
                    </div>
                    <div class="submission-status ${submission.status}">${submission.status}</div>
                </div>
                
                <div class="submission-details">
                    <div class="submission-field">
                        <strong>Contact Method:</strong>
                        ${submission.platform}
                    </div>
                    <div class="submission-field">
                        <strong>Contact Info:</strong>
                        ${contactInfo}
                    </div>
                    <div class="submission-field">
                        <strong>Request Type:</strong>
                        ${submission.request_type}
                    </div>
                    <div class="submission-field">
                        <strong>Budget:</strong>
                        $${submission.budget}
                    </div>
                    <div class="submission-field submission-description">
                        <strong>Details:</strong>
                        ${submission.details}
                    </div>
                </div>
                
                <div class="submission-actions">
                    ${submission.status === 'new' ? `
                        <button class="status-btn" onclick="updateSubmissionStatus('${submission.id}', 'contacted')">
                            Mark as Contacted
                        </button>
                    ` : ''}
                    ${submission.status !== 'completed' ? `
                        <button class="complete-btn" onclick="updateSubmissionStatus('${submission.id}', 'completed')">
                            Mark as Completed
                        </button>
                    ` : ''}
                    <button class="delete-btn" onclick="deleteSubmission('${submission.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
};

SimpleAdminPanel.prototype.getContactInfo = function(submission) {
    switch(submission.platform) {
        case 'twitter':
            return submission.handle || 'Not provided';
        case 'onlyfans':
            return submission.onlyfans_username || 'Not provided';
        case 'email':
            return submission.email || 'Not provided';
        default:
            return 'Unknown';
    }
};

SimpleAdminPanel.prototype.updateSubmissionStatus = async function(id, status) {
    try {
        const response = await fetch('/api/admin/submissions', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, status })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Reload submissions to reflect changes
            this.loadSubmissions();
            this.showAlert('Submission status updated successfully', 'success');
        } else {
            this.showAlert('Failed to update submission status', 'error');
        }
    } catch (error) {
        console.error('Error updating submission:', error);
        this.showAlert('Error updating submission status', 'error');
    }
};

SimpleAdminPanel.prototype.deleteSubmission = async function(id) {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/submissions', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Reload submissions to reflect changes
            this.loadSubmissions();
            this.showAlert('Submission deleted successfully', 'success');
        } else {
            this.showAlert('Failed to delete submission', 'error');
        }
    } catch (error) {
        console.error('Error deleting submission:', error);
        this.showAlert('Error deleting submission', 'error');
    }
};

// Global functions for onclick handlers
function updateSubmissionStatus(id, status) {
    adminPanel.updateSubmissionStatus(id, status);
}

function deleteSubmission(id) {
    adminPanel.deleteSubmission(id);
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new SimpleAdminPanel();
});
