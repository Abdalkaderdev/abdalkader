import { SITE_URL } from './seo';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdalkader Alhamoud',
    url: SITE_URL,
    jobTitle: 'AI & Full-Stack Developer',
    knowsAbout: [
      'Machine Learning',
      'Deep Learning',
      'Neural Networks',
      'Computer Vision',
      'Natural Language Processing',
      'TensorFlow',
      'PyTorch',
      'Python',
      'React',
      'Next.js',
      'TypeScript',
      'Full-Stack Development',
      'E-commerce',
      'API Development',
      'Data Science',
      'AI Model Deployment'
    ],
    sameAs: [
      'https://github.com/abdalkaderdev',
      'https://www.linkedin.com/in/abdalkaderdev',
      'https://www.instagram.com/abdalkader.dev'
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Abdalkader - AI/ML & Full-Stack Developer Portfolio',
    url: SITE_URL,
    description: 'Portfolio of Abdalkader Alhamoud, an AI-Enhanced Full-Stack Developer specializing in building intelligent web applications and ML experiments.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function projectJsonLd(project: {
  title: string;
  img: string;
  overview: string;
  live: string;
  category?: string[];
  badges?: string[];
}) {
  const isAIProject = project.category?.some(cat => 
    cat.toLowerCase().includes('ai') || 
    cat.toLowerCase().includes('machine learning') ||
    cat.toLowerCase().includes('ml') ||
    project.badges?.some(badge => 
      badge.toLowerCase().includes('tensorflow') ||
      badge.toLowerCase().includes('pytorch') ||
      badge.toLowerCase().includes('ai')
    )
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    image: project.img,
    description: project.overview,
    url: project.live || SITE_URL,
    creator: personJsonLd(),
    ...(isAIProject && {
      applicationCategory: 'MLApplication',
      programmingLanguage: project.badges?.filter(badge => 
        ['Python', 'JavaScript', 'TypeScript', 'React', 'Next.js'].includes(badge)
      ),
      runtimePlatform: 'Web'
    })
  } as const;
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

export function contactPointJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: SITE_URL,
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@example.com',
      availableLanguage: ['en'],
    }],
  };
}

