import ContactSection from '@/components/ContactPage';
import { PageSEO, JsonLd, Breadcrumbs } from '@/components/SEO';
import { contactPointJsonLd, localBusinessJsonLd, faqPageJsonLd } from '@/utils/jsonld';

export default function ContactPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Contact', href: '/contact', current: true }
    ];

    return (
        <>
            <PageSEO
                title="Contact Abdalkader Alhamoud | Hire AI & Web Developer"
                description="Ready to start your project? Contact Abdalkader for AI integration, web development, and custom software solutions. Fast response within 24 hours."
                canonical="/contact"
                ogType="website"
                ogImage="/images/og-contact.jpg"
                ogImageAlt="Contact Abdalkader Alhamoud - AI and Web Developer"
                keywords={[
                    'Contact',
                    'Hire Developer',
                    'AI Integration',
                    'Web Development',
                    'Custom Software',
                    'Freelance Developer',
                    'Remote Developer',
                    'Full-Stack Developer'
                ]}
            />
            <JsonLd data={[
                contactPointJsonLd(),
                localBusinessJsonLd(),
                faqPageJsonLd()
            ]} />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <ContactSection />
        </>
    )
}