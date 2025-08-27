import ContactSection from '@/components/ContactPage';
import BookCallSection from '@/components/HomePage/BookCallSection';
import Head from 'next/head';
import { buildCanonical } from '@/utils/seo';

export default function ContactPage() {
    return (
        <>
            <Head>
                <title>Contact | Abdalkader Alhamoud</title>
                <meta name="description" content="Get in touch with Abdalkader Alhamoud for web development and AI engineering projects. Let's discuss your next digital solution." />
                <link rel="canonical" href={buildCanonical('/contact')} />
            </Head>
            <ContactSection />
            <BookCallSection />
        </>
    )
}