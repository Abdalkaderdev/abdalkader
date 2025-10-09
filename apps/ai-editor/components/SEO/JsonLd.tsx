import Script from 'next/script';
import { 
  personJsonLd, 
  labWebsiteJsonLd, 
  labCollectionJsonLd, 
  experimentJsonLd,
  breadcrumbsJsonLd 
} from '../../utils/jsonld';

interface JsonLdProps {
  type: 'person' | 'website' | 'collection' | 'experiment' | 'breadcrumbs';
  data?: any;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const getJsonLd = () => {
    switch (type) {
      case 'person':
        return personJsonLd();
      case 'website':
        return labWebsiteJsonLd();
      case 'collection':
        return labCollectionJsonLd();
      case 'experiment':
        return experimentJsonLd(data);
      case 'breadcrumbs':
        return breadcrumbsJsonLd(data);
      default:
        return {};
    }
  };

  const jsonLd = getJsonLd();

  if (!jsonLd || Object.keys(jsonLd).length === 0) {
    return null;
  }

  return (
    <Script
      id={`jsonld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2),
      }}
    />
  );
}