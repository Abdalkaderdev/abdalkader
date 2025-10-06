// Dark/Light mode toggle
(function() {
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Create toggle button
    function createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.title = 'Toggle dark/light mode';
        
        // Add to navbar
        const navbar = document.querySelector('.navbar-end') || document.querySelector('.navbar');
        if (navbar) {
            navbar.appendChild(toggle);
        }

        // Toggle functionality
        toggle.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createThemeToggle);
    } else {
        createThemeToggle();
    }
})();