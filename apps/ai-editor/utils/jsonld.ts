import { LAB_SITE_URL } from './seo';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdalkader Alhamoud',
    url: LAB_SITE_URL,
    jobTitle: 'AI & Full-Stack Developer',
    knowsAbout: [
      'Machine Learning',
      'Deep Learning',
      'Neural Networks',
      'Computer Vision',
      'Natural Language Processing',
      'TensorFlow.js',
      'TensorFlow',
      'PyTorch',
      'Python',
      'React',
      'Next.js',
      'TypeScript',
      'Full-Stack Development',
      'AI Model Deployment',
      'Interactive AI Applications',
      'Real-time Object Detection',
      'Neural Network Visualization'
    ],
    sameAs: [
      'https://github.com/abdalkaderdev',
      'https://www.linkedin.com/in/abdalkaderdev',
      'https://www.instagram.com/abdalkader.dev',
      'https://abdalkader.dev'
    ],
  };
}

export function labWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI & Interactive Experiments Lab',
    url: LAB_SITE_URL,
    description: 'Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications. Real-time object detection, neural network visualizations, and AI code generation.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${LAB_SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: personJsonLd(),
  };
}

export function labCollectionJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name: 'AI & Interactive Experiments Lab',
    description: 'A collection of interactive AI experiments, machine learning demos, and TensorFlow.js applications showcasing real-time computer vision, neural network visualizations, and AI code generation.',
    url: LAB_SITE_URL,
    creator: personJsonLd(),
    about: [
      'Machine Learning',
      'Computer Vision',
      'Neural Networks',
      'TensorFlow.js',
      'Interactive AI',
      'Object Detection',
      'AI Code Generation'
    ],
    inLanguage: 'en',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
  };
}

export function experimentJsonLd(experiment: {
  title: string;
  description: string;
  url: string;
  category: string;
  technologies: string[];
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: experiment.title,
    description: experiment.description,
    url: experiment.url,
    image: experiment.image || `${LAB_SITE_URL}/images/experiments/${experiment.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    creator: personJsonLd(),
    applicationCategory: 'MLApplication',
    programmingLanguage: experiment.technologies,
    runtimePlatform: 'Web',
    about: experiment.category,
    isAccessibleForFree: true,
    inLanguage: 'en',
  };
}

export function breadcrumbsJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: it.name,
      item: it.item,
    })),
  };
}