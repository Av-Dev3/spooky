/**
 * Color.js - Logo Color Analysis
 * Samples the logo image to extract dominant colors and set CSS variables
 */

(function() {
    'use strict';

    // Default colors (fallback) - Based on your spooky logo
    const defaultColors = {
        bg: '#0a0a0a',
        ink: '#ffffff',
        accent1: '#dc2626', // Red for spooky theme
        accent2: '#000000', // Black for spooky theme
        surface: '#1a1a1a',
        border: '#333333',
        glitter1: '#ef4444', // Red glitter
        glitter2: '#000000', // Black glitter
        ghostGlow: '#dc2626' // Red ghost glow
    };

    // Set default colors first
    setCSSVariables(defaultColors);

    // Disable automatic logo color analysis to maintain black/red theme
    // analyzeLogoColors();

    function analyzeLogoColors() {
        const logo = document.querySelector('.logo, .logo-large');
        if (!logo) {
            console.log('Logo not found, using default colors');
            return;
        }

        // Create canvas to analyze image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Wait for image to load
        if (logo.complete) {
            processLogo();
        } else {
            logo.addEventListener('load', processLogo);
        }

        function processLogo() {
            try {
                // Set canvas size
                canvas.width = logo.naturalWidth || logo.width;
                canvas.height = logo.naturalHeight || logo.height;
                
                // Draw image to canvas
                ctx.drawImage(logo, 0, 0);
                
                // Sample pixels
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                
                // Analyze colors
                const colors = analyzePixels(pixels);
                
                // Set CSS variables
                setCSSVariables(colors);
                
                console.log('Logo colors analyzed and applied:', colors);
                
            } catch (error) {
                console.warn('Could not analyze logo colors:', error);
                console.log('Using default colors');
            }
        }
    }

    function analyzePixels(pixels) {
        const colorCounts = {};
        const sampleSize = Math.min(pixels.length / 4, 10000); // Sample up to 10k pixels
        
        // Sample pixels at regular intervals
        for (let i = 0; i < sampleSize; i++) {
            const index = Math.floor(i * (pixels.length / 4 / sampleSize)) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const a = pixels[index + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Create color key
            const colorKey = `${r},${g},${b}`;
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        
        // Sort colors by frequency
        const sortedColors = Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Top 10 colors
        
        // Extract dominant colors
        const dominantColors = sortedColors.map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return { r, g, b };
        });
        
        // Generate theme colors
        return generateThemeColors(dominantColors);
    }

    function generateThemeColors(dominantColors) {
        if (dominantColors.length === 0) {
            return defaultColors;
        }
        
        // Find darkest color for background
        const darkest = dominantColors.reduce((min, color) => {
            const brightness = (color.r + color.g + color.b) / 3;
            const minBrightness = (min.r + min.g + min.b) / 3;
            return brightness < minBrightness ? color : min;
        });
        
        // Find brightest color for text
        const brightest = dominantColors.reduce((max, color) => {
            const brightness = (color.r + color.g + color.b) / 3;
            const maxBrightness = (max.r + max.g + max.b) / 3;
            return brightness > maxBrightness ? color : max;
        });
        
        // Find vibrant colors for accents
        const vibrant = dominantColors.filter(color => {
            const r = color.r / 255;
            const g = color.g / 255;
            const b = color.b / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;
            return saturation > 0.3 && max > 0.5; // Saturated and not too dark
        });
        
        // Generate theme
        const bg = `rgb(${Math.max(0, darkest.r - 40)}, ${Math.max(0, darkest.g - 40)}, ${Math.max(0, darkest.b - 40)})`;
        const surface = `rgb(${Math.max(0, darkest.r - 20)}, ${Math.max(0, darkest.g - 20)}, ${Math.max(0, darkest.b - 20)})`;
        const border = `rgb(${Math.max(0, darkest.r + 20)}, ${Math.max(0, darkest.g + 20)}, ${Math.max(0, darkest.b + 20)})`;
        
        const ink = `rgb(${Math.min(255, brightest.r + 20)}, ${Math.min(255, brightest.g + 20)}, ${Math.min(255, brightest.b + 20)})`;
        
        let accent1, accent2;
        if (vibrant.length >= 2) {
            accent1 = `rgb(${vibrant[0].r}, ${vibrant[0].g}, ${vibrant[0].b})`;
            accent2 = `rgb(${vibrant[1].r}, ${vibrant[1].g}, ${vibrant[1].b})`;
        } else if (vibrant.length === 1) {
            accent1 = `rgb(${vibrant[0].r}, ${vibrant[0].g}, ${vibrant[0].b})`;
            // Generate complementary color
            accent2 = `rgb(${255 - vibrant[0].r}, ${255 - vibrant[0].g}, ${255 - vibrant[0].b})`;
        } else {
            // Fallback to default accents
            accent1 = defaultColors.accent1;
            accent2 = defaultColors.accent2;
        }
        
        return { bg, ink, accent1, accent2, surface, border };
    }

    function setCSSVariables(colors) {
        const root = document.documentElement;
        
        // Set main colors
        root.style.setProperty('--bg', colors.bg);
        root.style.setProperty('--ink', colors.ink);
        root.style.setProperty('--accent1', colors.accent1);
        root.style.setProperty('--accent2', colors.accent2);
        root.style.setProperty('--surface', colors.surface);
        root.style.setProperty('--border', colors.border);
        
        // Set new spooky colors
        root.style.setProperty('--glitter1', colors.glitter1 || '#c084fc');
        root.style.setProperty('--glitter2', colors.glitter2 || '#fbbf24');
        root.style.setProperty('--ghost-glow', colors.ghostGlow || 'rgba(255, 255, 255, 0.3)');
        
        // Set derived colors
        root.style.setProperty('--shadow', `rgba(0, 0, 0, 0.5)`);
        root.style.setProperty('--glow', `rgba(220, 38, 38, 0.4)`); // Red glow
    }

    // Export for debugging
    window.logoColors = {
        analyze: analyzeLogoColors,
        setDefaults: () => setCSSVariables(defaultColors),
        forceSpookyTheme: () => {
            const spookyColors = {
                bg: '#0a0a0a',
                ink: '#ffffff',
                accent1: '#dc2626',
                accent2: '#000000',
                surface: '#1a1a1a',
                border: '#333333',
                glitter1: '#ef4444',
                glitter2: '#000000',
                ghostGlow: '#dc2626'
            };
            setCSSVariables(spookyColors);
            console.log('Forced spooky black/red theme');
        }
    };

    // Force the spooky theme immediately
    window.logoColors.forceSpookyTheme();

})();
