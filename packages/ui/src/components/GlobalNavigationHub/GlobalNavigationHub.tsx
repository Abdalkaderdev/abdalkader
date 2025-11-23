import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ExternalLink, 
  Home, 
  Code, 
  BookOpen, 
  FileText,
  History,
  Sparkles,
  ChevronRight,
  Globe
} from 'lucide-react';
import './GlobalNavigationHub.css';

export interface EcosystemLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  description: string;
  status: 'active' | 'development' | 'maintenance';
}

export interface RelatedContent {
  type: 'project' | 'component' | 'doc' | 'blog' | 'milestone';
  title: string;
  url: string;
  description?: string;
}

export interface GlobalNavigationHubProps {
  currentSite: {
    id: string;
    name: string;
    url: string;
    icon: string;
    color: string;
  };
  relatedContent?: RelatedContent[];
  showContext?: boolean;
  className?: string;
}

const ECOSYSTEM_SITES: EcosystemLink[] = [
  {
    id: 'portfolio',
    name: 'Portfolio',
    url: 'https://abdalkader.dev',
    icon: '',
    color: '#f44e00',
    description: 'Personal portfolio and professional showcase',
    status: 'active',
  },
  {
    id: 'storybook',
    name: 'Storybook',
    url: 'https://storybook.abdalkader.dev',
    icon: '',
    color: '#ff6b35',
    description: 'Component library and design system',
    status: 'active',
  },
  {
    id: 'docs',
    name: 'Documentation',
    url: 'https://docs.abdalkader.dev',
    icon: '',
    color: '#3b82f6',
    description: 'Technical documentation and guides',
    status: 'active',
  },
  {
    id: 'blog',
    name: 'Blog',
    url: 'https://blog.abdalkader.dev',
    icon: '',
    color: '#4ecdc4',
    description: 'Technical articles and insights',
    status: 'active',
  },
  {
    id: 'history',
    name: 'Programming Museum',
    url: 'https://history.abdalkader.dev',
    icon: '',
    color: '#45b7d1',
    description: 'Interactive programming history',
    status: 'active',
  },
];

export function GlobalNavigationHub({
  currentSite,
  relatedContent = [],
  showContext = true,
  className = '',
}: GlobalNavigationHubProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const otherSites = ECOSYSTEM_SITES.filter(site => site.id !== currentSite.id);

  const getContentIcon = (type: RelatedContent['type']) => {
    switch (type) {
      case 'project':
        return '🚀';
      case 'component':
        return '🧩';
      case 'doc':
        return '📄';
      case 'blog':
        return '✍️';
      case 'milestone':
        return '⭐';
      default:
        return '🔗';
    }
  };

  const getContentTypeLabel = (type: RelatedContent['type']) => {
    switch (type) {
      case 'project':
        return 'Project';
      case 'component':
        return 'Component';
      case 'doc':
        return 'Documentation';
      case 'blog':
        return 'Blog Post';
      case 'milestone':
        return 'Milestone';
      default:
        return 'Content';
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className={`global-nav-hub ${className}`}>
        <div className="global-nav-container">
          {/* Logo/Home */}
          <a
            href={currentSite.url}
            className="global-nav-logo"
            aria-label={`${currentSite.name} Home`}
          >
            <span className="global-nav-logo-icon">{currentSite.icon}</span>
            <span className="global-nav-logo-text">{currentSite.name}</span>
          </a>

          {/* Quick Links - Desktop */}
          <div className="global-nav-quick-links">
            {otherSites.slice(0, 4).map(site => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="global-nav-quick-link"
                style={{ '--site-color': site.color } as React.CSSProperties}
                aria-label={`Visit ${site.name}`}
              >
                <span className="global-nav-quick-link-icon">{site.icon}</span>
                <span className="global-nav-quick-link-name">{site.name}</span>
              </a>
            ))}
          </div>

          {/* Menu Toggle */}
          <button
            type="button"
            className="global-nav-menu-toggle"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="global-nav-menu-icon" />
            ) : (
              <Menu className="global-nav-menu-icon" />
            )}
          </button>
        </div>
      </nav>

      {/* Navigation Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="global-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              className="global-nav-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Current Context */}
              {showContext && (
                <div className="global-nav-context">
                  <div className="global-nav-context-header">
                    <Sparkles className="global-nav-context-icon" />
                    <h2>Current Context</h2>
                  </div>
                  <div className="global-nav-context-site">
                    <span className="global-nav-context-site-icon">{currentSite.icon}</span>
                    <div>
                      <h3>{currentSite.name}</h3>
                      <p>You're currently viewing this site</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Content */}
              {relatedContent.length > 0 && (
                <div className="global-nav-related">
                  <div className="global-nav-related-header">
                    <Globe className="global-nav-related-icon" />
                    <h2>Related Content</h2>
                  </div>
                  <div className="global-nav-related-list">
                    {relatedContent.map((content, index) => (
                      <a
                        key={index}
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="global-nav-related-item"
                      >
                        <span className="global-nav-related-item-icon">
                          {getContentIcon(content.type)}
                        </span>
                        <div className="global-nav-related-item-content">
                          <div className="global-nav-related-item-header">
                            <span className="global-nav-related-item-type">
                              {getContentTypeLabel(content.type)}
                            </span>
                            <ChevronRight className="global-nav-related-item-arrow" />
                          </div>
                          <h4>{content.title}</h4>
                          {content.description && (
                            <p>{content.description}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* All Sites */}
              <div className="global-nav-sites">
                <div className="global-nav-sites-header">
                  <Globe className="global-nav-sites-icon" />
                  <h2>All Sites</h2>
                </div>
                <div className="global-nav-sites-list">
                  {ECOSYSTEM_SITES.map((site, index) => {
                    const isCurrent = site.id === currentSite.id;
                    return (
                      <motion.a
                        key={site.id}
                        href={isCurrent ? '#' : site.url}
                        target={isCurrent ? undefined : '_blank'}
                        rel={isCurrent ? undefined : 'noopener noreferrer'}
                        className={`global-nav-site-item ${isCurrent ? 'global-nav-site-item-current' : ''}`}
                        style={{ '--site-color': site.color } as React.CSSProperties}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onMouseEnter={() => setHoveredSite(site.id)}
                        onMouseLeave={() => setHoveredSite(null)}
                        onClick={isCurrent ? (e) => e.preventDefault() : undefined}
                      >
                        <span className="global-nav-site-icon">{site.icon}</span>
                        <div className="global-nav-site-content">
                          <div className="global-nav-site-header">
                            <h3>{site.name}</h3>
                            {isCurrent && (
                              <span className="global-nav-site-badge">Current</span>
                            )}
                            {!isCurrent && (
                              <ExternalLink className="global-nav-site-external" />
                            )}
                          </div>
                          <p>{site.description}</p>
                          {site.status !== 'active' && (
                            <span className="global-nav-site-status">{site.status}</span>
                          )}
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Close Button */}
              <button
                className="global-nav-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="global-nav-close-icon" />
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

