// Performance optimizations
(function() {
    // Lazy load images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            '/css/custom.css',
            '/css/force-colors.css',
            '/favicon.png'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }

    // Optimize font loading
    function optimizeFonts() {
        const fontDisplay = document.createElement('style');
        fontDisplay.textContent = `
            @font-face {
                font-family: system;
                font-style: normal;
                font-weight: 300 900;
                font-display: swap;
                src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
            }
        `;
        document.head.appendChild(fontDisplay);
    }

    // Initialize performance optimizations
    function initPerformance() {
        lazyLoadImages();
        preloadCriticalResources();
        optimizeFonts();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformance);
    } else {
        initPerformance();
    }
})();