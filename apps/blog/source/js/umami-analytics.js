// Umami Analytics - Privacy-respecting analytics
(function() {
    // Only load if not in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return;
    }

    // Create Umami script
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = 'https://analytics.umami.is/script.js';
    script.setAttribute('data-website-id', 'YOUR_UMAMI_WEBSITE_ID'); // Replace with your Umami website ID
    script.setAttribute('data-domains', 'abdalkader.dev');
    
    // Add to head
    document.head.appendChild(script);

    // Track custom events
    window.umami = window.umami || {
        track: function(event, data) {
            if (typeof umami !== 'undefined' && umami.track) {
                umami.track(event, data);
            }
        }
    };

    // Track social shares
    document.addEventListener('click', function(e) {
        const shareBtn = e.target.closest('.share-btn');
        if (shareBtn) {
            const platform = shareBtn.dataset.platform;
            window.umami.track('social-share', { platform: platform });
        }
    });

    // Track theme toggle
    document.addEventListener('click', function(e) {
        if (e.target.closest('.theme-toggle')) {
            const theme = document.documentElement.getAttribute('data-theme');
            window.umami.track('theme-toggle', { theme: theme });
        }
    });
})();