import Head from 'next/head';
import { buildCanonical } from '@/utils/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  twitterImage?: string;
  noIndex?: boolean;
  keywords?: string[];
  structuredData?: any;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function SEOHead({
  title = 'Abdalkader - AI/ML & Full-Stack Web Developer | Python, React, TensorFlow',
  description = 'Specializing in AI-powered web solutions. I build machine learning models, full-stack applications, and high-converting e-commerce stores. Explore my portfolio and interactive AI lab.',
  canonical,
  ogImage = 'https://abdalkader.dev/images/og-image.jpg',
  twitterImage = 'https://abdalkader.dev/images/twitter-image.jpg',
  noIndex = false,
  keywords = [],
  structuredData,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Abdalkader Alhamoud',
  section,
  tags = []
}: SEOHeadProps) {
  const canonicalUrl = canonical || buildCanonical('/');
  const defaultKeywords = [
    'AI developer',
    'machine learning engineer',
    'full-stack developer',
    'React developer',
    'Python developer',
    'TensorFlow.js',
    'AI integration',
    'ML applications',
    'intelligent web apps',
    'AI specialist',
    'e-commerce development',
    'Abdalkader Alhamoud',
    'Jordan developer',
    'MENA tech',
    'Amman developer'
  ];
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Abdalkader Alhamoud" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.length > 0 && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:site" content="@abdalkaderdev" />
      <meta name="twitter:creator" content="@abdalkaderdev" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#f44e00" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Abdalkader Portfolio" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/images/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/icon-192.png" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      )}
    </Head>
  );
}