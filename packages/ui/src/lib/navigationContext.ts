/**
 * Navigation Context Utilities
 * 
 * Utilities for detecting current site context and generating
 * related content links across the ecosystem.
 */

import { RelatedContent } from '../components/GlobalNavigationHub/GlobalNavigationHub';
import { getProjectBySlug } from './projectRegistry';

export interface SiteContext {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export const SITE_CONTEXTS: Record<string, SiteContext> = {
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio',
    url: 'https://abdalkader.dev',
    icon: '👨‍💻',
    color: '#f44e00',
  },
  storybook: {
    id: 'storybook',
    name: 'Storybook',
    url: 'https://storybook.abdalkader.dev',
    icon: '📚',
    color: '#ff6b35',
  },
  docs: {
    id: 'docs',
    name: 'Documentation',
    url: 'https://docs.abdalkader.dev',
    icon: '📖',
    color: '#3b82f6',
  },
  blog: {
    id: 'blog',
    name: 'Blog',
    url: 'https://blog.abdalkader.dev',
    icon: '✍️',
    color: '#4ecdc4',
  },
  history: {
    id: 'history',
    name: 'Programming Museum',
    url: 'https://history.abdalkader.dev',
    icon: '🏛️',
    color: '#45b7d1',
  },
};

/**
 * Detect current site from hostname
 */
export function getCurrentSiteContext(): SiteContext | null {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  
  // Check for subdomain
  if (hostname.includes('storybook.')) return SITE_CONTEXTS.storybook;
  if (hostname.includes('docs.')) return SITE_CONTEXTS.docs;
  if (hostname.includes('blog.')) return SITE_CONTEXTS.blog;
  if (hostname.includes('history.')) return SITE_CONTEXTS.history;
  
  // Default to portfolio
  return SITE_CONTEXTS.portfolio;
}

/**
 * Get related content for a project
 */
export function getProjectRelatedContent(projectSlug: string): RelatedContent[] {
  const project = getProjectBySlug(projectSlug);
  if (!project) return [];

  const related: RelatedContent[] = [];

  // Add timeline milestone
  if (project.history.milestoneId) {
    related.push({
      type: 'milestone',
      title: `Development Timeline: ${project.title}`,
      url: project.history.url || `https://history.abdalkader.dev?milestone=${project.history.milestoneId}`,
      description: 'View this project on the development timeline',
    });
  }

  // Add Storybook components
  project.storybook.components.forEach(component => {
    related.push({
      type: 'component',
      title: component.name,
      url: `${project.storybook.url || 'https://storybook.abdalkader.dev'}?path=/story/${component.storybookPath}`,
      description: component.description,
    });
  });

  // Add documentation
  project.docs.sections.forEach(doc => {
    related.push({
      type: 'doc',
      title: doc.title,
      url: doc.url,
      description: `View ${doc.type} documentation`,
    });
  });

  // Add blog posts
  project.blog.posts.forEach(post => {
    related.push({
      type: 'blog',
      title: post.title,
      url: post.url,
      description: post.excerpt,
    });
  });

  return related;
}

/**
 * Get related content for a component (Storybook)
 */
export function getComponentRelatedContent(componentPath: string): RelatedContent[] {
  const related: RelatedContent[] = [];

  // Find projects using this component
  // This would need to be enhanced with actual component-to-project mapping
  related.push({
    type: 'component',
    title: 'Component Documentation',
    url: `https://docs.abdalkader.dev/components/${componentPath}`,
    description: 'View component documentation',
  });

  return related;
}

/**
 * Get related content for a documentation page
 */
export function getDocRelatedContent(docPath: string): RelatedContent[] {
  const related: RelatedContent[] = [];

  // Extract project slug from path if it's a project doc
  const projectMatch = docPath.match(/projects\/([^/]+)/);
  if (projectMatch) {
    const projectSlug = projectMatch[1];
    const projectRelated = getProjectRelatedContent(projectSlug);
    related.push(...projectRelated);
  }

  return related;
}

/**
 * Get related content for a blog post
 */
export function getBlogPostRelatedContent(postSlug: string): RelatedContent[] {
  const related: RelatedContent[] = [];

  // Try to find related project
  // This would need blog post metadata to link to projects
  related.push({
    type: 'blog',
    title: 'More Blog Posts',
    url: 'https://blog.abdalkader.dev',
    description: 'Browse all blog posts',
  });

  return related;
}

/**
 * Get related content based on current page context
 */
export function getContextRelatedContent(
  siteId: string,
  pathname: string
): RelatedContent[] {
  // Portfolio project page
  if (siteId === 'portfolio' && pathname.startsWith('/projects/')) {
    const slug = pathname.split('/projects/')[1]?.split('/')[0];
    if (slug) return getProjectRelatedContent(slug);
  }

  // Storybook component
  if (siteId === 'storybook' && pathname.includes('?path=/story/')) {
    const componentPath = pathname.split('?path=/story/')[1];
    if (componentPath) return getComponentRelatedContent(componentPath);
  }

  // Documentation page
  if (siteId === 'docs' && pathname.startsWith('/')) {
    return getDocRelatedContent(pathname);
  }

  // Blog post
  if (siteId === 'blog' && pathname.startsWith('/blog/')) {
    const slug = pathname.split('/blog/')[1]?.split('/')[0];
    if (slug) return getBlogPostRelatedContent(slug);
  }

  return [];
}

