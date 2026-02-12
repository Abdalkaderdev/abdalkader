import ContactSection from '@/components/ContactPage';
import CoffeeSection from '@/components/CoffeeSection';
import Head from 'next/head';
import { buildCanonical } from '@/utils/seo';
import JsonLd from '@/components/SEO/JsonLd';
import { contactPointJsonLd, breadcrumbsJsonLd } from '@/utils/jsonld';
import { SITE_URL } from '@/utils/seo';

export default function ContactPage() {
    return (
        <>
            <Head>
                <title>Contact | Abdalkader Alhamoud</title>
                <meta name="description" content="Get in touch with Abdalkader Alhamoud for web development and AI engineering projects. Let's discuss your next digital solution." />
                <link rel="canonical" href={buildCanonical('/contact')} />
            </Head>
            <JsonLd data={[
                contactPointJsonLd(),
                breadcrumbsJsonLd([
                    { name: 'Home', item: SITE_URL },
                    { name: 'Contact', item: `${SITE_URL}/contact` },
                ])
            ]} />
            <ContactSection />
            <CoffeeSection />
        </>
    )
}