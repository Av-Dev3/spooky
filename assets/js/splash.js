/**
 * Splash Screen
 * Handles the splash video that plays once per session before age verification
 */

(function() {
    'use strict';

    const SPLASH_KEY = 'spoookysnsfww_splash_shown';
    const splashScreen = document.getElementById('splashScreen');
    const splashVideo = document.getElementById('splashVideo');
    
    if (!splashScreen || !splashVideo) {
        console.warn('Splash screen elements not found');
        return;
    }

    // Check if splash has been shown this session
    function checkSplashShown() {
        const shown = sessionStorage.getItem(SPLASH_KEY);
        return shown === 'true';
    }

    // Mark splash as shown for this session
    function markSplashShown() {
        sessionStorage.setItem(SPLASH_KEY, 'true');
    }

    // Hide splash screen
    function hideSplash() {
        splashScreen.classList.add('hidden');
        splashScreen.style.display = 'none';
        document.body.style.overflow = 'hidden'; // Keep body locked for age gate
        
        // Track in console
        console.log('Splash screen hidden');
        
        // Show age gate after splash is hidden
        setTimeout(() => {
            if (window.ageGate && window.ageGate.show) {
                window.ageGate.show();
            }
        }, 500);
    }

    // Show splash screen
    function showSplash() {
        splashScreen.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Track in console
        console.log('Splash screen shown');
    }

    // Handle video events
    function handleVideoEvents() {
        // Video ended - hide splash and show age gate
        splashVideo.addEventListener('ended', function() {
            console.log('Splash video ended - playing full duration');
            hideSplash();
        });

        // Video error - fallback to hiding splash
        splashVideo.addEventListener('error', function(e) {
            console.warn('Splash video error:', e);
            hideSplash();
        });

        // Video can play - ensure it's playing
        splashVideo.addEventListener('canplay', function() {
            console.log('Splash video can play - starting playback');
            splashVideo.play().catch(function(error) {
                console.warn('Could not autoplay video:', error);
                // If autoplay fails, hide splash after a delay
                setTimeout(hideSplash, 2000);
            });
        });

        // Video loaded metadata
        splashVideo.addEventListener('loadedmetadata', function() {
            console.log('Splash video metadata loaded - duration:', splashVideo.duration);
        });

        // Video time update - log progress
        splashVideo.addEventListener('timeupdate', function() {
            if (splashVideo.currentTime > 0) {
                console.log('Video playing:', Math.round(splashVideo.currentTime), 'seconds');
            }
        });
    }

    // Handle skip button
    function handleSkipButton() {
        const skipBtn = document.getElementById('skipSplash');
        if (skipBtn) {
            skipBtn.addEventListener('click', function() {
                console.log('Splash skipped by user');
                hideSplash();
            });
        }
    }

    // Initialize splash screen
    function init() {
        // Ensure age gate is hidden initially
        if (window.ageGate && window.ageGate.hide) {
            window.ageGate.hide();
        }
        
        // Check if splash should be shown
        if (checkSplashShown()) {
            console.log('Splash already shown this session, skipping to age gate');
            splashScreen.style.display = 'none';
            return;
        }

        // Mark as shown for this session
        markSplashShown();
        
        // Show splash screen
        showSplash();
        
        // Set up video event handlers
        handleVideoEvents();
        
        // Set up skip button
        handleSkipButton();
        
        // Fallback: hide splash after video duration + buffer (in case video doesn't load)
        const maxDuration = 8000; // 6 seconds + 2 second buffer
        setTimeout(function() {
            if (!splashScreen.classList.contains('hidden')) {
                console.log('Splash screen timeout - hiding after maximum duration');
                hideSplash();
            }
        }, maxDuration);
        
        console.log('Splash screen initialized');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for debugging
    window.splashScreen = {
        show: showSplash,
        hide: hideSplash,
        reset: () => {
            sessionStorage.removeItem(SPLASH_KEY);
            location.reload();
        }
    };

})();
