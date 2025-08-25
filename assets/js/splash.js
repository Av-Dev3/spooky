/**
 * Splash Screen
 * Handles the splash video that plays once per session before age verification
 */

(function() {
    'use strict';

    const SPLASH_KEY = 'spoookysnsfww_splash_shown';
    const splashScreen = document.getElementById('splashScreen');
    const splashVideo = document.getElementById('splashVideo');
    const mobileSplashVideo = document.getElementById('mobileSplashVideo');
    
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
        // Desktop video events
        splashVideo.addEventListener('ended', function() {
            console.log('Desktop splash video ended - playing full duration');
            hideSplash();
        });

        splashVideo.addEventListener('error', function(e) {
            console.warn('Desktop splash video error:', e);
            hideSplash();
        });

        splashVideo.addEventListener('canplay', function() {
            console.log('Desktop splash video can play - starting playback');
            splashVideo.play().catch(function(error) {
                console.warn('Could not autoplay desktop video:', error);
                setTimeout(hideSplash, 2000);
            });
        });

        splashVideo.addEventListener('loadedmetadata', function() {
            console.log('Desktop splash video metadata loaded - duration:', splashVideo.duration);
        });

        // Mobile video events
        if (mobileSplashVideo) {
            mobileSplashVideo.addEventListener('ended', function() {
                console.log('Mobile splash video ended - playing full duration');
                hideSplash();
            });

            mobileSplashVideo.addEventListener('error', function(e) {
                console.warn('Mobile splash video error:', e);
                hideSplash();
            });

            mobileSplashVideo.addEventListener('canplay', function() {
                console.log('Mobile splash video can play - starting playback');
                mobileSplashVideo.play().catch(function(error) {
                    console.warn('Could not autoplay mobile video:', error);
                    setTimeout(hideSplash, 2000);
                });
            });

            mobileSplashVideo.addEventListener('loadedmetadata', function() {
                console.log('Mobile splash video metadata loaded - duration:', mobileSplashVideo.duration);
            });
        }
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
