// Final Intro: Welcome [Ball] Let's Build - CORRECT TIMING
(function () {
    'use strict';

    window.addEventListener('load', function () {
        const overlay = document.getElementById('intro-overlay');
        const container = document.getElementById('intro-container');
        const ball = document.getElementById('intro-ball');
        const flash = document.getElementById('intro-flash');
        const heroElements = document.querySelectorAll('.hero-element');

        if (!overlay || !container || !ball || !flash) {
            console.error('Intro elements not found');
            return;
        }

        // Ensure hero elements become visible
        setTimeout(function () {
            heroElements.forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 100);

        // Step 1: Fade in text at 0.2s
        setTimeout(function () {
            container.style.transition = 'opacity 0.6s ease-out';
            container.style.opacity = '1';
        }, 200);

        // Step 2: Drop ball at 0.8s (after text is visible)
        setTimeout(function () {
            ball.style.opacity = '1';
            ball.style.animation = 'ballDrop 2.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }, 800);

        // Step 3: Fade out text at 2.6s (just before flash)
        setTimeout(function () {
            container.style.transition = 'opacity 0.3s ease-out';
            container.style.opacity = '0';
        }, 2600);

        // Step 4: Trigger flash at 2.8s (when ball settles and text is faded)
        setTimeout(function () {
            flash.classList.add('active');
        }, 2800);

        // Step 5: Hide overlay at 4.3s (AFTER flash completes - flash is 1.5s, so 2.8 + 1.5 = 4.3)
        setTimeout(function () {
            overlay.style.display = 'none';
        }, 4300);
    });
})();
