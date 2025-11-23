/**
 * Global Navigation Hub for Mintlify Docs
 * Injects navigation hub into Mintlify documentation
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Create navigation hub container
    const navHub = document.createElement('div');
    navHub.id = 'global-navigation-hub';
    navHub.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; z-index: 10000;';
    document.body.insertBefore(navHub, document.body.firstChild);

    // Load React and navigation components
    loadNavigationHub();
  }

  function loadNavigationHub() {
    // Create a simple navigation bar that works without React
    const nav = document.createElement('nav');
    nav.className = 'mintlify-nav-hub';
    nav.innerHTML = `
      <div style="background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(244, 78, 0, 0.2); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between;">
        <a href="/" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: #f8f8f8; font-weight: 600;">
          <span style="font-size: 1.5rem;">📖</span>
          <span>Documentation</span>
        </a>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <a href="https://abdalkader.dev" target="_blank" rel="noopener" style="padding: 0.5rem 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; text-decoration: none; color: #b8b8b8; font-size: 0.875rem; transition: all 0.3s;">
            👨‍💻 Portfolio
          </a>
          <a href="https://storybook.abdalkader.dev" target="_blank" rel="noopener" style="padding: 0.5rem 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; text-decoration: none; color: #b8b8b8; font-size: 0.875rem; transition: all 0.3s;">
            📚 Storybook
          </a>
          <a href="https://blog.abdalkader.dev" target="_blank" rel="noopener" style="padding: 0.5rem 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; text-decoration: none; color: #b8b8b8; font-size: 0.875rem; transition: all 0.3s;">
            ✍️ Blog
          </a>
          <a href="https://history.abdalkader.dev" target="_blank" rel="noopener" style="padding: 0.5rem 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; text-decoration: none; color: #b8b8b8; font-size: 0.875rem; transition: all 0.3s;">
            🏛️ History
          </a>
          <button id="nav-menu-toggle" style="display: flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; color: #f8f8f8; cursor: pointer; transition: all 0.3s;">
            ☰
          </button>
        </div>
      </div>
    `;

    document.getElementById('global-navigation-hub').appendChild(nav);

    // Add menu toggle functionality
    const menuToggle = document.getElementById('nav-menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }

    // Add padding to body to account for fixed nav
    document.body.style.paddingTop = '80px';

    // Add hover effects
    const links = nav.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(244, 78, 0, 0.1)';
        this.style.borderColor = 'rgba(244, 78, 0, 0.3)';
        this.style.color = '#f44e00';
      });
      link.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.05)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        this.style.color = '#b8b8b8';
      });
    });
  }

  function toggleMenu() {
    // Simple menu toggle - can be enhanced later
    alert('Full navigation menu coming soon! Use the links above to navigate.');
  }
})();

