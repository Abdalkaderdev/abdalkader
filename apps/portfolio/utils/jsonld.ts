import { SITE_URL } from './seo';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdalkader Alhamoud',
    url: SITE_URL,
    jobTitle: 'Web Developer & AI Engineer',
    sameAs: [
      'https://github.com/abdalkader',
      'https://www.linkedin.com/in/abdalkader',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Abdalkader Alhamoud Portfolio',
    url: SITE_URL,
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    image: project.img,
    description: project.overview,
    url: project.live || SITE_URL,
    creator: personJsonLd(),
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

