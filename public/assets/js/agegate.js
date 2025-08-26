/**
 * Age Gate Modal
 * Handles the 18+ age verification modal with localStorage persistence
 */

(function() {
    'use strict';

    const AGE_GATE_KEY = 'spoookysnsfww_age_verified';
    const ageGate = document.getElementById('ageGate');
    
    if (!ageGate) {
        console.warn('Age gate element not found');
        return;
    }

    // Check if user has already verified age
    function checkAgeVerification() {
        const verified = localStorage.getItem(AGE_GATE_KEY);
        if (verified === 'true') {
            hideAgeGate();
        }
    }

    // Hide age gate
    function hideAgeGate() {
        ageGate.classList.add('hidden');
        ageGate.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Track in console
        console.log('Age gate hidden - user verified as 18+');
    }

    // Show age gate
    function showAgeGate() {
        // Check if user has already verified age
        const verified = localStorage.getItem(AGE_GATE_KEY);
        if (verified === 'true') {
            hideAgeGate();
            return;
        }
        
        ageGate.classList.remove('hidden');
        ageGate.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Track in console
        console.log('Age gate shown - requiring age verification');
    }

    // Handle age confirmation
    function confirmAge() {
        localStorage.setItem(AGE_GATE_KEY, 'true');
        hideAgeGate();
        
        // Track in console
        console.log('Age verification confirmed and stored');
    }

    // Handle leaving site
    function leaveSite() {
        // Track in console
        console.log('User chose to leave site');
        
        // Redirect to external site (already handled by href)
    }

    // Initialize age gate
    function init() {
        // Don't show age gate immediately - wait for splash screen to finish
        // The splash screen will call showAgeGate() when it's done
        
        // Add event listeners
        const confirmBtn = document.getElementById('confirmAge');
        const leaveBtn = ageGate.querySelector('a[href*="google.com"]');
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', confirmAge);
        }
        
        if (leaveBtn) {
            leaveBtn.addEventListener('click', leaveSite);
        }
        
        // Add escape key support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !ageGate.classList.contains('hidden')) {
                // Don't allow escape to close age gate
                e.preventDefault();
                console.log('Escape key blocked - age verification required');
            }
        });
        
        // Prevent right-click context menu on age gate
        ageGate.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        // Prevent drag and drop
        ageGate.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
        
        console.log('Age gate initialized - waiting for splash screen');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for debugging
    window.ageGate = {
        show: showAgeGate,
        hide: hideAgeGate,
        reset: () => {
            localStorage.removeItem(AGE_GATE_KEY);
            showAgeGate();
            console.log('Age gate reset');
        }
    };

})();
