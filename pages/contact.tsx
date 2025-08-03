import ContactSection from '@/components/ContactPage';
import BookCallSection from '@/components/HomePage/BookCallSection';
import Head from 'next/head';

export default function ContactPage() {
    return (
        <>
            <Head>
                <title>Contact | Abdalkader Alhamoud</title>
                <meta name="description" content="Get in touch with Abdalkader Alhamoud for web development and AI engineering projects. Let's discuss your next digital solution." />
            </Head>
            <ContactSection />
            <BookCallSection />
        </>
    )
}