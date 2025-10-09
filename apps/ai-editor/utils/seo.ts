export const LAB_SITE_URL = process.env.NEXT_PUBLIC_LAB_SITE_URL || 'https://lab.abdalkader.dev';

export function buildCanonical(pathname: string): string {
  if (!pathname || pathname === '/') return LAB_SITE_URL;
  const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return `${LAB_SITE_URL}${normalized}`;
}

export const labSeoConfig = {
  title: 'AI & Interactive Experiments Lab | Abdalkader Alhamoud',
  description: 'Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications. Real-time object detection, neural network visualizations, and AI code generation.',
  keywords: [
    'AI Lab',
    'Machine Learning',
    'TensorFlow.js',
    'Computer Vision',
    'Neural Networks',
    'Interactive AI',
    'Object Detection',
    'ML Experiments',
    'Abdalkader Alhamoud',
    'AI Developer'
  ].join(', '),
  author: 'Abdalkader Alhamoud',
  siteName: 'AI & Interactive Experiments Lab',
  twitterHandle: '@abdalkaderdev',
  ogImage: '/images/og-lab.jpg',
  favicon: '/favicon.ico'
};

export function generatePageTitle(pageTitle?: string): string {
  if (!pageTitle) return labSeoConfig.title;
  return `${pageTitle} | ${labSeoConfig.siteName}`;
}

export function generatePageDescription(description?: string): string {
  return description || labSeoConfig.description;
}