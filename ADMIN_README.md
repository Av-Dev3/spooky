# Admin Panel Setup & Usage Guide

## Overview
This admin panel allows you to manage your site content without editing code directly. You can update shop products, gallery items, links, and upload images through a user-friendly interface.

## Files Created
- `admin-login.html` - Login page for admin access
- `admin.html` - Main admin panel interface
- `admin-api.php` - Backend API for data management
- `data/gallery.json` - Gallery data storage
- `assets/uploads/` - Directory for uploaded images

## Setup Instructions

### 1. Server Requirements
- PHP 7.4 or higher
- Web server (Apache, Nginx, or built-in PHP server)
- Write permissions for the `data/` and `assets/uploads/` directories

### 2. Default Login Credentials
- **Username:** `admin`
- **Password:** `spooky123`

**⚠️ IMPORTANT:** Change these credentials in `admin-api.php` before going live!

### 3. Directory Permissions
Make sure the following directories are writable by your web server:
```bash
chmod 755 data/
chmod 755 assets/uploads/
```

### 4. Start the Server
You can use PHP's built-in server for testing:
```bash
php -S localhost:8000
```

Or upload to your web hosting provider.

## Usage Guide

### Accessing the Admin Panel
1. Navigate to `admin-login.html` on your site
2. Enter your username and password
3. You'll be redirected to the main admin panel

### Managing Shop Products
1. Click "Shop Products" in the admin navigation
2. Click "+ Add New Product" to create a new product
3. Fill in:
   - Product title
   - Price
   - Description
   - Upload an image
   - Add tags (comma-separated)
   - Processor URL (where customers can buy)
4. Click "Save Product"
5. Use Edit/Delete buttons to modify existing products

### Managing Gallery Items
1. Click "Gallery" in the admin navigation
2. Click "+ Add New Gallery Item" to create a new item
3. Fill in:
   - Title
   - Description
   - Upload an image
   - Check "Locked" if it requires purchase
4. Click "Save Gallery Item"
5. Use Edit/Delete buttons to modify existing items

### Managing Links
1. Click "Links" in the admin navigation
2. Click "+ Add New Link" to create a new link
3. Fill in:
   - Icon (emoji or text)
   - Title
   - Badge text (optional)
   - URL
4. Click "Save Link"
5. Use Edit/Delete buttons to modify existing links

### Image Management
1. Click "Image Manager" in the admin navigation
2. Click "Choose Images" to select files
3. Click "Upload Images" to upload them
4. Uploaded images will appear in the list below
5. Use "Copy Path" to copy the image URL for use in products/gallery
6. Use "Delete" to remove images from the list

## Data Storage

### File Locations
- **Shop Products:** `data/shop.json`
- **Gallery Items:** `data/gallery.json`
- **Links:** `data/links.json`
- **Uploaded Images:** `assets/uploads/`

### Data Format
All data is stored in JSON format for easy editing if needed. The admin panel automatically handles the formatting.

## Security Notes

### Current Implementation
- Basic session-based authentication
- Simple username/password check
- No CSRF protection
- No rate limiting

### Production Recommendations
- Implement proper password hashing
- Add CSRF tokens
- Add rate limiting
- Use HTTPS
- Implement proper session management
- Add input validation and sanitization
- Consider using a framework like Laravel or Symfony

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**
   - Check if you're logged in
   - Verify session cookies are enabled
   - Check PHP session configuration

2. **Upload failures**
   - Verify `assets/uploads/` directory exists and is writable
   - Check file size limits in PHP configuration
   - Verify file type restrictions

3. **Data not saving**
   - Check if `data/` directory is writable
   - Verify PHP has write permissions
   - Check server error logs

4. **Images not displaying**
   - Verify image paths are correct
   - Check if images were uploaded successfully
   - Verify file permissions

### Debug Mode
Open browser developer tools (F12) to see console logs and network requests for debugging.

## Customization

### Styling
The admin panel uses your existing CSS variables from `assets/css/styles.css`. You can customize the appearance by modifying the CSS variables or adding custom styles.

### Adding New Content Types
To add new content types (e.g., blog posts, testimonials):
1. Create a new JSON data file
2. Add a new section to `admin.html`
3. Add corresponding functions to `admin-api.php`
4. Update the admin navigation

### Extending Functionality
The admin panel is built with vanilla JavaScript and can be easily extended. All functions are available in the global `window.adminPanel` object for debugging and extension.

## Support
If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check server error logs
3. Verify file permissions
4. Test with a simple PHP setup first

## Updates
The admin panel automatically loads your existing data from the JSON files. When you make changes through the interface, they're saved back to these files, keeping your site content synchronized.
