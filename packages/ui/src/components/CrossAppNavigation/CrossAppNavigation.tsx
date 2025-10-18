import React from 'react';
import './CrossAppNavigation.css';

interface CrossAppNavigationProps {
  currentApp?: 'portfolio' | 'blog' | 'docs' | 'storybook';
  className?: string;
}

const CrossAppNavigation: React.FC<CrossAppNavigationProps> = ({ 
  currentApp, 
  className = '' 
}) => {
  const apps = [
    { 
      name: 'Portfolio', 
      url: 'https://abdalkader.dev', 
      description: 'Main portfolio website',
      icon: '🏠'
    },
    { 
      name: 'Blog', 
      url: 'https://blog.abdalkader.dev', 
      description: 'Technical blog and articles',
      icon: '📝'
    },
    { 
      name: 'Docs', 
      url: 'https://docs.abdalkader.dev', 
      description: 'Project documentation',
      icon: '📚'
    },
    { 
      name: 'Components', 
      url: 'https://storybook.abdalkader.dev', 
      description: 'Component library',
      icon: '🧩'
    },
  ];

  return (
    <nav className={`cross-app-nav ${className}`}>
      <div className="cross-app-nav__container">
        <h3 className="cross-app-nav__title">Explore Apps</h3>
        <div className="cross-app-nav__grid">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              className={`cross-app-nav__link ${
                currentApp === app.name.toLowerCase() ? 'cross-app-nav__link--current' : ''
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cross-app-nav__icon">{app.icon}</span>
              <div className="cross-app-nav__content">
                <span className="cross-app-nav__name">{app.name}</span>
                <span className="cross-app-nav__description">{app.description}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CrossAppNavigation;