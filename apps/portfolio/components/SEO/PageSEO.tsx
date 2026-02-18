import Head from 'next/head';
import { SITE_URL } from '@/utils/seo';

interface PageSEOProps {
  title: string;
  description: string;
  canonical: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  ogImageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export default function PageSEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/images/og-image.jpg',
  ogImageAlt = 'Abdalkader - AI & Full-Stack Developer Portfolio',
  publishedTime,
  modifiedTime,
  author = 'Abdalkader Alhamoud',
  keywords,
  noindex = false,
  nofollow = false,
}: PageSEOProps) {
  const fullCanonical = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  // Ensure title is within 50-60 characters for optimal SEO
  const optimizedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;

  // Ensure description is within 150-160 characters for optimal SEO
  const optimizedDescription = description.length > 160
    ? `${description.substring(0, 157)}...`
    : description;

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1'
  ].join(', ');

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="title" content={optimizedTitle} />
      <meta name="description" content={optimizedDescription} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullCanonical} />
      <meta name="robots" content={robotsContent} />

      {/* Keywords (still useful for some search engines) */}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Abdalkader Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific OG tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      <meta name="twitter:site" content="@abdalkaderdev" />
      <meta name="twitter:creator" content="@abdalkaderdev" />
    </Head>
  );
}
