/**
 * Cross-domain linking utilities for seamless navigation between ecosystem properties
 */

export interface CrossDomainLink {
  type: 'portfolio' | 'storybook' | 'docs' | 'blog' | 'history';
  subdomain: string;
  baseUrl: string;
}

export const DOMAIN_LINKS: Record<string, CrossDomainLink> = {
  portfolio: {
    type: 'portfolio',
    subdomain: 'www',
    baseUrl: 'https://abdalkader.dev',
  },
  storybook: {
    type: 'storybook',
    subdomain: 'storybook',
    baseUrl: 'https://storybook.abdalkader.dev',
  },
  docs: {
    type: 'docs',
    subdomain: 'docs',
    baseUrl: 'https://docs.abdalkader.dev',
  },
  blog: {
    type: 'blog',
    subdomain: 'blog',
    baseUrl: 'https://blog.abdalkader.dev',
  },
  history: {
    type: 'history',
    subdomain: 'history',
    baseUrl: 'https://history.abdalkader.dev',
  },
};

/**
 * Generate a URL for a portfolio project
 */
export function getPortfolioProjectUrl(slug: string): string {
  return `${DOMAIN_LINKS.portfolio.baseUrl}/projects/${slug}`;
}

/**
 * Generate a URL for a Storybook component
 */
export function getStorybookComponentUrl(componentPath: string): string {
  return `${DOMAIN_LINKS.storybook.baseUrl}?path=/story/${componentPath}`;
}

/**
 * Generate a URL for a documentation section
 */
export function getDocsUrl(path: string): string {
  return `${DOMAIN_LINKS.docs.baseUrl}/${path}`;
}

/**
 * Generate a URL for a blog post
 */
export function getBlogPostUrl(slug: string): string {
  return `${DOMAIN_LINKS.blog.baseUrl}/blog/${slug}`;
}

/**
 * Open a link in a new tab with proper security attributes
 */
export function openCrossDomainLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Navigate to a cross-domain link (same tab)
 */
export function navigateCrossDomain(url: string): void {
  window.location.href = url;
}

/**
 * Check if we're currently on a specific domain
 */
export function isOnDomain(type: CrossDomainLink['type']): boolean {
  if (typeof window === 'undefined') return false;
  const link = DOMAIN_LINKS[type];
  if (!link) return false;
  return window.location.hostname.includes(link.subdomain);
}

/**
 * Get the current domain type
 */
export function getCurrentDomainType(): CrossDomainLink['type'] | null {
  if (typeof window === 'undefined') return null;
  
  for (const [key, link] of Object.entries(DOMAIN_LINKS)) {
    if (window.location.hostname.includes(link.subdomain)) {
      return link.type;
    }
  }
  
  return null;
}

