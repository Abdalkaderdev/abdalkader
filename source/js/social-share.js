// Social sharing functionality
(function() {
    function createShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share';
        shareContainer.innerHTML = `
            <h4>Share this post</h4>
            <div class="share-buttons">
                <a href="#" class="share-btn twitter" data-platform="twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
                <a href="#" class="share-btn linkedin" data-platform="linkedin">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="#" class="share-btn reddit" data-platform="reddit">
                    <i class="fab fa-reddit"></i> Reddit
                </a>
                <a href="#" class="share-btn copy" data-platform="copy">
                    <i class="fas fa-link"></i> Copy Link
                </a>
            </div>
        `;

        // Add to article content
        const article = document.querySelector('.article-content') || document.querySelector('.content');
        if (article) {
            article.appendChild(shareContainer);
        }

        // Add click handlers
        shareContainer.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = e.target.closest('.share-btn')?.dataset.platform;
            if (platform) {
                sharePost(platform);
            }
        });
    }

    function sharePost(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || title);

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            reddit: `https://reddit.com/submit?url=${url}&title=${title}`
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const btn = document.querySelector('.share-btn.copy');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => btn.innerHTML = originalText, 2000);
            });
        } else if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createShareButtons);
    } else {
        createShareButtons();
    }
})();