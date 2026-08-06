import { SITE_URL } from './seo';
import { faqItems } from '@/data/faqData';

// ============================================
// Core Person & Website Schemas
// ============================================

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Abdalkader Alhamoud',
    url: SITE_URL,
    image: `${SITE_URL}/images/og-image.jpg`,
    jobTitle: 'AI & Full-Stack Developer',
    description: 'AI-Enhanced Full-Stack Developer specializing in building intelligent web applications, machine learning models, and high-converting e-commerce solutions.',
    email: 'hello@abdalkader.dev',
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
      'AI Model Deployment',
      'LangChain',
      'OpenAI API',
      'AWS',
      'Cloud Infrastructure'
    ],
    sameAs: [
      'https://github.com/abdalkaderdev',
      'https://www.linkedin.com/in/abdalkaderdev',
      'https://www.instagram.com/abdalkader.dev'
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Computer Science Education'
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Full-Stack AI Developer',
      occupationLocation: {
        '@type': 'Country',
        name: 'Worldwide (Remote)'
      },
      skills: 'AI/ML Engineering, Full-Stack Development, Cloud Architecture'
    }
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Abdalkader - AI/ML & Full-Stack Developer Portfolio',
    url: SITE_URL,
    description: 'Portfolio of Abdalkader Alhamoud, an AI-Enhanced Full-Stack Developer specializing in building intelligent web applications and ML experiments.',
    publisher: {
      '@id': `${SITE_URL}/#person`
    },
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
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
  live?: string;
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
      email: 'hello@abdalkader.dev',
      availableLanguage: ['en'],
    }],
  };
}

// ============================================
// Professional Service Schema
// ============================================

export function professionalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: 'Abdalkader - AI & Full-Stack Development',
    description: 'Professional AI engineering and full-stack web development services. Specializing in machine learning integration, custom web applications, and intelligent e-commerce solutions.',
    url: SITE_URL,
    logo: `${SITE_URL}/images/favicon.png`,
    image: `${SITE_URL}/images/og-image.jpg`,
    email: 'hello@abdalkader.dev',
    founder: {
      '@id': `${SITE_URL}/#person`
    },
    priceRange: '$$-$$$',
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 0,
        longitude: 0
      },
      geoRadius: '40075000'
    },
    serviceType: [
      'AI & Machine Learning Development',
      'Full-Stack Web Development',
      'Custom Software Solutions',
      'E-commerce Development',
      'API Development & Integration'
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Web Development',
      'React',
      'Next.js',
      'Python',
      'Node.js'
    ],
    sameAs: [
      'https://github.com/abdalkaderdev',
      'https://www.linkedin.com/in/abdalkaderdev',
      'https://www.instagram.com/abdalkader.dev'
    ]
  };
}

// ============================================
// Local Business Schema for Contact Page
// ============================================

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Abdalkader - AI & Full-Stack Developer',
    description: 'Professional AI engineering and full-stack web development services available worldwide. Building intelligent web applications, machine learning solutions, and high-converting e-commerce stores.',
    url: SITE_URL,
    logo: `${SITE_URL}/images/favicon.png`,
    image: `${SITE_URL}/images/og-image.jpg`,
    email: 'hello@abdalkader.dev',
    priceRange: '$$-$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'United States'
      },
      {
        '@type': 'Country',
        name: 'Germany'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom'
      },
      {
        '@type': 'GeoCircle',
        description: 'Worldwide Remote Services',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 0,
          longitude: 0
        },
        geoRadius: '40075000'
      }
    ],
    sameAs: [
      'https://github.com/abdalkaderdev',
      'https://www.linkedin.com/in/abdalkaderdev',
      'https://www.instagram.com/abdalkader.dev'
    ]
  };
}

// ============================================
// FAQ Page Schema
// ============================================

/**
 * FAQPage schema, generated from `data/faqData.ts` — the same source the visible
 * FAQSection renders. Google requires the declared Q&As to be present on the
 * page, so these must never be maintained separately.
 */
export function faqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

// ============================================
// Service Schema
// ============================================

export interface ServiceData {
  name: string;
  description: string;
  serviceType: string;
}

export function serviceJsonLd(service: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.serviceType,
    name: service.name,
    description: service.description,
    provider: {
      '@id': `${SITE_URL}/#person`
    },
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide'
    },
    url: SITE_URL
  };
}

export function allServicesJsonLd() {
  const services: ServiceData[] = [
    {
      name: 'AI & Machine Learning Development',
      description: 'Custom AI solutions including OpenAI API integration, LangChain implementations, vector databases, LLMOps, and responsible AI practices for intelligent applications.',
      serviceType: 'AI Engineering'
    },
    {
      name: 'Frontend Development',
      description: 'Modern, responsive frontend development using React, Next.js, Three.js, TypeScript, Tailwind CSS, and advanced animation libraries like GSAP and Framer Motion.',
      serviceType: 'Web Development'
    },
    {
      name: 'Backend Development',
      description: 'Scalable backend solutions using Python, Node.js, Express.js, MongoDB, PostgreSQL, REST APIs, and GraphQL for robust application architecture.',
      serviceType: 'Software Development'
    },
    {
      name: 'Cloud & DevOps',
      description: 'Cloud infrastructure setup and management on AWS, Docker containerization, CI/CD pipelines, and deployment automation for reliable application delivery.',
      serviceType: 'Cloud Services'
    }
  ];

  return services.map(service => serviceJsonLd(service));
}

// ============================================
// ItemList Schema for Projects
// ============================================

export interface ProjectListItem {
  title: string;
  slug: string;
  img: string;
  overview: string;
  position: number;
}

export function projectsItemListJsonLd(projects: ProjectListItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Portfolio Projects',
    description: 'A collection of AI-powered web applications, machine learning projects, and full-stack development solutions by Abdalkader Alhamoud.',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: `${SITE_URL}/projects/${project.slug}`,
      image: project.img.startsWith('http') ? project.img : `${SITE_URL}${project.img}`,
      description: project.overview.substring(0, 160)
    }))
  };
}

// ============================================
// Article Schema for Project Detail Pages
// ============================================

export interface ArticleProjectData {
  title: string;
  slug: string;
  img: string;
  overview: string;
  date: string;
  category: string[];
  badges?: string[];
}

export function projectArticleJsonLd(project: ArticleProjectData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.overview.substring(0, 160),
    image: project.img.startsWith('http') ? project.img : `${SITE_URL}${project.img}`,
    datePublished: project.date,
    dateModified: project.date,
    author: {
      '@id': `${SITE_URL}/#person`
    },
    publisher: {
      '@id': `${SITE_URL}/#person`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/projects/${project.slug}`
    },
    keywords: [...project.category, ...(project.badges || [])].join(', '),
    articleSection: 'Portfolio'
  };
}

// ============================================
// WebPage Schema
// ============================================

export function webPageJsonLd(options: {
  name: string;
  description: string;
  url: string;
  breadcrumb?: Array<{ name: string; item: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.name,
    description: options.description,
    url: options.url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`
    },
    about: {
      '@id': `${SITE_URL}/#person`
    },
    ...(options.breadcrumb && {
      breadcrumb: breadcrumbsJsonLd(options.breadcrumb)
    })
  };
}

// ============================================
// About Page Profile Schema
// ============================================

export function aboutPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@id': `${SITE_URL}/#person`
    },
    name: 'About Abdalkader Alhamoud',
    description: 'Learn about Abdalkader Alhamoud, an AI-Enhanced Full-Stack Developer specializing in building intelligent web applications and ML solutions.',
    url: `${SITE_URL}/about`,
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  };
}

