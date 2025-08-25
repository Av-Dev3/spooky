# Spoookysnsfww - Adult Content Creator Website

A mobile-first, vanilla web development site for adult content creator "Spoookysnsfww" with automatic color theming derived from the logo.

## 🌟 Features

- **Mobile-First Design**: Optimized for mobile devices with responsive desktop enhancements
- **Automatic Color Theming**: JavaScript analyzes the logo to extract and apply color scheme
- **18+ Age Gate**: Strict age verification modal with localStorage persistence
- **Responsive Navigation**: Mobile hamburger menu that expands to horizontal on larger screens
- **Dynamic Content Loading**: Links and shop products loaded from JSON files
- **Gallery Lightbox**: Interactive image preview with locked content indicators
- **Custom Forms**: Contact and custom content request forms
- **Legal Compliance**: Complete legal pages (Terms, Privacy, DMCA, 2257)
- **Accessibility**: ARIA labels, focus styles, reduced motion support

## 📁 File Structure

```
spooky/
├── index.html              # Home page with hero and CTAs
├── links.html              # Social media and platform links
├── gallery.html            # Content preview gallery
├── shop.html               # Product catalog
├── customs.html            # Custom content requests
├── faq.html                # Frequently asked questions
├── contact.html            # Contact information
├── 404.html               # Error page
├── legal/                  # Legal compliance pages
│   ├── terms.html
│   ├── privacy.html
│   ├── dmca.html
│   └── 2257.html
├── assets/
│   ├── logo.png            # Creator logo (existing)
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   ├── color.js        # Logo color analysis
│   │   ├── agegate.js      # Age verification modal
│   │   ├── main.js         # Core functionality
│   │   └── shop.js         # Shop functionality
│   └── icons/              # SVG icons
│       ├── bat.svg
│       ├── ghost.svg
│       ├── x.svg
│       ├── of.svg
│       ├── lock.svg
│       └── heart.svg
└── data/
    ├── links.json          # Platform links data
    └── shop.json           # Product catalog data
```

## 🚀 Getting Started

1. **Clone/Download** the project files
2. **Serve** the files using a local web server (required for JSON loading)
3. **Open** `index.html` in a modern web browser

### Local Development Server

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🎨 Color System

The site automatically generates its color scheme by analyzing the logo image:

- **Background**: Darkest color from logo
- **Surface**: Slightly lighter than background
- **Text**: Brightest color from logo
- **Accents**: Most vibrant/saturated colors from logo
- **Borders**: Intermediate color between background and surface

Colors are applied as CSS custom properties and can be overridden if needed.

## 📱 Mobile-First Design

- **Base styles**: Optimized for mobile devices (320px+)
- **Breakpoint 1**: 768px+ (tablet landscape, small desktop)
- **Breakpoint 2**: 1200px+ (large desktop)

### Mobile Optimizations

- Touch-friendly button sizes (44px minimum)
- Full-width layouts on small screens
- Hamburger navigation by default
- Optimized typography for readability
- Safe area insets support

## 🔒 Age Gate System

- **Full-screen modal** on first visit
- **localStorage persistence** after verification
- **No escape** - users must confirm age or leave
- **Responsive design** for all screen sizes
- **Console logging** for debugging

## 📊 Data Files

### `data/links.json`
```json
[
  {
    "icon": "💕",
    "title": "OnlyFans",
    "badge": "Premium",
    "url": "https://onlyfans.com"
  }
]
```

### `data/shop.json`
```json
[
  {
    "id": 1,
    "title": "Spooky Photo Set",
    "price": 15,
    "image": "assets/logo.png",
    "tags": ["photos", "spooky"],
    "processorUrl": "https://onlyfans.com",
    "description": "Exclusive spooky-themed photo collection"
  }
]
```

## 🛠️ Customization

### Adding New Pages
1. Copy an existing HTML file
2. Update the navigation menu
3. Modify content and styling as needed

### Modifying Colors
- Edit `assets/js/color.js` for algorithm changes
- Override CSS variables in `assets/css/styles.css`
- Use the `window.logoColors.setDefaults()` function for testing

### Adding Products
- Edit `data/shop.json` to add new products
- Ensure images are placed in `assets/` directory
- Update tags for proper filtering

## 🌐 Browser Support

- **Modern browsers**: Full support (Chrome 90+, Firefox 88+, Safari 14+)
- **ES6 features**: Arrow functions, async/await, template literals
- **CSS Grid**: Used for responsive layouts
- **CSS Custom Properties**: For dynamic theming

## 📝 Development Notes

### JavaScript Architecture
- **Modular design** with IIFE pattern
- **Event delegation** for dynamic content
- **Console logging** for debugging and analytics
- **Error handling** with fallback content

### CSS Architecture
- **Mobile-first** with progressive enhancement
- **CSS custom properties** for theming
- **Utility classes** for common patterns
- **Responsive breakpoints** for device optimization

### Performance Features
- **Lazy loading** for images
- **Intersection Observer** for viewport detection
- **Efficient DOM manipulation** with event delegation
- **Minimal dependencies** (vanilla JavaScript only)

## 🔧 Debugging

### Console Commands
```javascript
// Reset age gate
window.ageGate.reset()

// Reload links
window.mainApp.reloadLinks()

// Reload products
window.shopApp.reloadProducts()

// Analyze logo colors
window.logoColors.analyze()

// Set default colors
window.logoColors.setDefaults()
```

### Common Issues
1. **JSON not loading**: Ensure using a web server (not file:// protocol)
2. **Age gate not working**: Check localStorage in browser dev tools
3. **Colors not applying**: Verify logo image is loaded before color.js runs

## 📄 License

This project is for the exclusive use of "Spoookysnsfww" and contains adult content. All rights reserved.

## 🤝 Support

For technical support or customization requests, contact the developer.

---

**Note**: This website contains adult content and is intended for viewers 18+ years of age. By accessing this site, you confirm you are of legal age in your jurisdiction.
