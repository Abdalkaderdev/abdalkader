import Head from 'next/head';
import { buildCanonical, generatePageTitle, generatePageDescription, labSeoConfig } from '../../utils/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
  structuredData?: any;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = labSeoConfig.ogImage,
  noIndex = false,
  keywords = [],
  structuredData
}: SEOHeadProps) {
  const pageTitle = generatePageTitle(title);
  const pageDescription = generatePageDescription(description);
  const canonicalUrl = canonical || buildCanonical('/');
  const allKeywords = [...labSeoConfig.keywords.split(', '), ...keywords].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={labSeoConfig.author} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={labSeoConfig.siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content={labSeoConfig.twitterHandle} />
      <meta name="twitter:site" content={labSeoConfig.twitterHandle} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#f44e00" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="AI Lab" />
      
      {/* Favicon */}
      <link rel="icon" href={labSeoConfig.favicon} />
      <link rel="apple-touch-icon" href="/images/icons/icon-192.png" />
      
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