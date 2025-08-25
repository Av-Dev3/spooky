/**
 * Main JavaScript
 * Handles navigation, links loading, gallery lightbox, and general functionality
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupNavigation();
        setupCurrentYear();
        setupLinksPage();
        setupGallery();
        setupClickTracking();
        setupMobileSplash();
        
        console.log('Main JavaScript initialized');
    }

    // Mobile Navigation Toggle
    function setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!navToggle || !mobileNav) return;
        
        navToggle.addEventListener('click', function() {
            console.log('Hamburger clicked!');
            console.log('Mobile nav before:', mobileNav.classList.toString());
            
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            console.log('Mobile nav after:', mobileNav.classList.toString());
            console.log('Has active class:', mobileNav.classList.contains('active'));
            
            // Prevent body scroll when nav is open
            if (mobileNav.classList.contains('active')) {
                document.body.classList.add('nav-open');
                console.log('Body scroll locked');
            } else {
                document.body.classList.remove('nav-open');
                console.log('Body scroll unlocked');
            }
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
        
        // Close nav when clicking on a link
        mobileNav.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Set current year in footer
    function setupCurrentYear() {
        const yearElements = document.querySelectorAll('#currentYear');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }

    // Load and render links from JSON
    function setupLinksPage() {
        const linksContainer = document.getElementById('linksContainer');
        if (!linksContainer) return;
        
        loadLinks();
    }

    async function loadLinks() {
        try {
            const response = await fetch('data/links.json?v=' + Date.now());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const links = await response.json();
            renderLinks(links);
            
            console.log('Links loaded successfully:', links);
            
        } catch (error) {
            console.warn('Could not load links.json, using fallback:', error);
            renderFallbackLinks();
        }
    }

    function renderLinks(links) {
        const container = document.getElementById('linksContainer');
        if (!container) return;
        
        container.innerHTML = links.map(link => `
            <a href="${link.url}" class="link-card" target="_blank" rel="noopener">
                <div class="link-icon">${link.icon}</div>
                <h3>${link.title}</h3>
                <div class="link-badge">${link.badge}</div>
            </a>
        `).join('');
    }

    function renderFallbackLinks() {
        const container = document.getElementById('linksContainer');
        if (!container) return;
        
        const fallbackLinks = [
            { icon: '💕', title: 'OnlyFans', badge: 'Premium', url: 'https://onlyfans.com' },
            { icon: '🐦', title: 'Twitter/X', badge: 'Updates', url: 'https://twitter.com' },
            { icon: '🌟', title: 'Fansly', badge: 'Alternative', url: 'https://fansly.com' },
            { icon: '🎁', title: 'Wishlist', badge: 'Support', url: 'https://amazon.com' },
            { icon: '💝', title: 'Tip Jar', badge: 'Appreciation', url: 'https://cashapp.com' }
        ];
        
        renderLinks(fallbackLinks);
    }

    // Gallery Lightbox
    function setupGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxDescription = document.getElementById('lightboxDescription');
        const lightboxClose = document.querySelector('.lightbox-close');
        
        if (!lightbox || !lightboxImage) return;
        
        // Open lightbox on gallery item click
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const image = item.querySelector('img');
                const title = item.querySelector('h3')?.textContent || 'Gallery Image';
                const description = item.querySelector('p')?.textContent || '';
                
                if (image) {
                    lightboxImage.src = image.src;
                    lightboxImage.alt = image.alt;
                    lightboxTitle.textContent = title;
                    lightboxDescription.textContent = description;
                    
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Track in console
                    console.log('Lightbox opened:', title);
                }
            });
        });
        
        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        // Close on background click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Track in console
            console.log('Lightbox closed');
        }
    }

    // Click tracking (console only)
    function setupClickTracking() {
        // Track CTA clicks
        const ctaCards = document.querySelectorAll('.cta-card');
        ctaCards.forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h3')?.textContent || 'CTA';
                console.log('CTA clicked:', title);
            });
        });
        
        // Track button clicks
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const text = this.textContent.trim();
                console.log('Button clicked:', text);
            });
        });
        
        // Track external links
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', function() {
                const href = this.href;
                const text = this.textContent.trim();
                console.log('External link clicked:', text, '->', href);
            });
        });
    }

    // Utility function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Lazy loading for images
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Performance monitoring
    function setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('Page load performance:', {
                            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            totalTime: perfData.loadEventEnd - perfData.fetchStart
                        });
                    }
                }, 0);
            });
        }
    }

    // Initialize additional features
    setupLazyLoading();
    setupPerformanceMonitoring();
    setupGlitterTrail();
    setupInteractiveDecorations();

    // Glitter trail effect
    function setupGlitterTrail() {
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        let moveTimeout;
        let lastParticleTime = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            const now = Date.now();
            if (now - lastParticleTime > 30) { // Limit particle creation rate
                createGlitterParticle();
                lastParticleTime = now;
            }
        });

        // Glitter explosion on click
        document.addEventListener('click', function(e) {
            createGlitterExplosion(e.clientX, e.clientY);
        });

        function createGlitterParticle() {
            const particle = document.createElement('div');
            particle.className = 'glitter-particle';
            
            // Randomize particle properties
            const size = Math.random() * 6 + 2; // 2-8px
            const offsetX = (Math.random() - 0.5) * 20; // Random offset
            const offsetY = (Math.random() - 0.5) * 20;
            
            particle.style.cssText = `
                position: fixed;
                left: ${mouseX + offsetX}px;
                top: ${mouseY + offsetY}px;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, var(--accent1), var(--accent2), var(--glitter1));
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.9;
                box-shadow: 0 0 ${size * 2}px var(--accent1);
                animation: particle-fade 0.8s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }

        function createGlitterExplosion(x, y) {
            const particleCount = 30; // More particles for bigger explosion
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'glitter-explosion-particle';
                
                // Create a REAL explosion effect that bursts outward
                const size = Math.random() * 10 + 4; // 4-14px
                const angle = (Math.PI * 2 * i) / particleCount; // Evenly distributed in circle
                const velocity = Math.random() * 300 + 200; // Much faster - 200-500px
                const offsetX = Math.cos(angle) * velocity;
                const offsetY = Math.sin(angle) * velocity;
                
                // Random colors for explosion
                const colors = ['var(--accent1)', 'var(--accent2)', 'var(--glitter1)', 'var(--glitter2)', 'var(--ghost-glow)', '#dc2626', '#991b1b', '#7f1d1d'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Random rotation and scale for more chaos
                const rotation = Math.random() * 720 - 360; // -360 to 360 degrees
                const scale = Math.random() * 1.5 + 0.5; // 0.5 to 2.0 scale
                
                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${randomColor};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 1;
                    box-shadow: 0 0 ${size * 3}px ${randomColor};
                    transform: scale(${scale}) rotate(${rotation}deg);
                    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                `;
                
                document.body.appendChild(particle);
                
                // Force the explosion outward immediately
                requestAnimationFrame(() => {
                    particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.1) rotate(${rotation + 720}deg)`;
                    particle.style.opacity = '0';
                });
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 600);
            }
        }
    }

    // Interactive spooky decorations
    function setupInteractiveDecorations() {
        const decorations = document.querySelectorAll('.bat-decoration, .ghost-decoration');
        console.log('Found decorations:', decorations.length);
        
        // Debug image loading
        decorations.forEach((decoration, index) => {
            const img = decoration.querySelector('img');
            if (img) {
                console.log(`Decoration ${index}:`, img.src);
                img.addEventListener('load', () => console.log(`Image ${index} loaded successfully`));
                img.addEventListener('error', (e) => console.error(`Image ${index} failed to load:`, e));
            }
        });
        
        let mouseX = 0;
        let mouseY = 0;

        // Simple click interaction for decorations
        decorations.forEach(decoration => {
            decoration.addEventListener('click', function() {
                this.style.transform = 'scale(1.3) rotate(360deg)';
                this.style.filter = 'drop-shadow(0 0 25px var(--accent2)) brightness(1.4)';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.filter = '';
                }, 600);
            });
        });
        
        // Add click interaction for decorations
        decorations.forEach(decoration => {
            decoration.addEventListener('click', function() {
                this.style.transform = 'scale(1.5) rotate(360deg)';
                this.style.filter = 'drop-shadow(0 0 30px var(--accent2))';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.filter = '';
                }, 500);
            });
        });
    }

    // Export for debugging
    window.mainApp = {
        reloadLinks: loadLinks,
        openLightbox: (title, imageSrc, description) => {
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');
            const lightboxTitle = document.getElementById('lightboxTitle');
            const lightboxDescription = document.getElementById('lightboxDescription');
            
            if (lightbox && lightboxImage) {
                lightboxImage.src = imageSrc;
                lightboxTitle.textContent = title;
                lightboxDescription.textContent = description;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    };

    // Setup mobile splash video playback rate
    function setupMobileSplash() {
        const mobileVideo = document.getElementById('mobileSplashVideo');
        console.log('Looking for mobile splash video:', mobileVideo);
        
        if (mobileVideo) {
            // Let video play at its natural speed (no playback rate modification)
            console.log('Mobile splash video found - playing at natural speed');
            
            // Add error handling
            mobileVideo.addEventListener('error', function(e) {
                console.error('Mobile splash video error:', e);
            });
            
            // Add load handling
            mobileVideo.addEventListener('loadeddata', function() {
                console.log('Mobile splash video loaded successfully');
            });
            
            // Check if video is visible
            const computedStyle = window.getComputedStyle(mobileVideo);
            console.log('Mobile video display:', computedStyle.display);
            console.log('Mobile video visibility:', computedStyle.visibility);
            console.log('Mobile video position:', computedStyle.position);
        } else {
            console.error('Mobile splash video element not found!');
        }
    }

    // Initialize interactive decorations
    setupInteractiveDecorations();

})();
