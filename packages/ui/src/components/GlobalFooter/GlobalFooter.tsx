import React from 'react';
import { ExternalLink, Github, Mail, Linkedin, Twitter } from 'lucide-react';
import './GlobalFooter.css';

export interface GlobalFooterProps {
  currentSite?: {
    id: string;
    name: string;
  };
  className?: string;
}

const FOOTER_LINKS = {
  portfolio: [
    { name: 'About', url: 'https://abdalkader.dev/about' },
    { name: 'Projects', url: 'https://abdalkader.dev/projects' },
    { name: 'Contact', url: 'https://abdalkader.dev/contact' },
  ],
  storybook: [
    { name: 'Components', url: 'https://storybook.abdalkader.dev' },
    { name: 'Design System', url: 'https://storybook.abdalkader.dev/?path=/story/design-system-overview' },
  ],
  docs: [
    { name: 'Getting Started', url: 'https://docs.abdalkader.dev/introduction' },
    { name: 'API Reference', url: 'https://docs.abdalkader.dev/api' },
    { name: 'Guides', url: 'https://docs.abdalkader.dev/guides' },
  ],
  blog: [
    { name: 'All Posts', url: 'https://blog.abdalkader.dev' },
    { name: 'Tutorials', url: 'https://blog.abdalkader.dev/tutorials' },
    { name: 'Case Studies', url: 'https://blog.abdalkader.dev/case-studies' },
  ],
  history: [
    { name: 'Timeline', url: 'https://history.abdalkader.dev' },
    { name: 'My Journey', url: 'https://history.abdalkader.dev?view=unified-timeline' },
    { name: 'Exhibitions', url: 'https://history.abdalkader.dev?view=exhibitions' },
  ],
};

const ECOSYSTEM_SITES = [
  { name: 'Portfolio', url: 'https://abdalkader.dev' },
  { name: 'Storybook', url: 'https://storybook.abdalkader.dev' },
  { name: 'Documentation', url: 'https://docs.abdalkader.dev' },
  { name: 'Blog', url: 'https://blog.abdalkader.dev' },
  { name: 'Programming Museum', url: 'https://history.abdalkader.dev' },
];

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/abdalkaderdev', icon: Github },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/abdalkaderdev', icon: Linkedin },
  { name: 'Twitter', url: 'https://twitter.com/abdalkaderdev', icon: Twitter },
  { name: 'Email', url: 'mailto:hello@abdalkader.dev', icon: Mail },
];

export function GlobalFooter({ currentSite, className = '' }: GlobalFooterProps) {
  const currentSiteLinks = currentSite ? FOOTER_LINKS[currentSite.id as keyof typeof FOOTER_LINKS] || [] : [];

  return (
    <footer className={`global-footer ${className}`}>
      <div className="global-footer-container">
        {/* Main Footer Content */}
        <div className="global-footer-content">
          {/* Current Site Links */}
          {currentSiteLinks.length > 0 && (
            <div className="global-footer-section">
              <h3 className="global-footer-section-title">{currentSite?.name || 'Site'}</h3>
              <ul className="global-footer-links">
                {currentSiteLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : undefined}
                      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="global-footer-link"
                    >
                      {link.name}
                      {link.url.startsWith('http') && (
                        <ExternalLink className="global-footer-link-icon" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ecosystem Sites */}
          <div className="global-footer-section">
            <h3 className="global-footer-section-title">Ecosystem</h3>
            <ul className="global-footer-links">
              {ECOSYSTEM_SITES.map((site, index) => (
                <li key={index}>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="global-footer-link"
                  >
                    {site.name}
                    <ExternalLink className="global-footer-link-icon" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="global-footer-section">
            <h3 className="global-footer-section-title">Connect</h3>
            <ul className="global-footer-links">
              {SOCIAL_LINKS.map((social, index) => {
                const Icon = social.icon;
                return (
                  <li key={index}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="global-footer-link"
                      aria-label={social.name}
                    >
                      <Icon className="global-footer-link-icon" />
                      {social.name}
                      <ExternalLink className="global-footer-link-icon" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="global-footer-bottom">
          <p className="global-footer-copyright">
            © {new Date().getFullYear()} Abdalkader Alhamoud. All rights reserved.
          </p>
          <p className="global-footer-tagline">
            Building the future, one project at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}

