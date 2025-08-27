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

