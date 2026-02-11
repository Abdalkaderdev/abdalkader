import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 - Page Not Found | Abdalkader</title>
                <meta name="description" content="The page you are looking for could not be found. Return to the homepage to explore Abdalkader's portfolio." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '8rem', lineHeight: 1 }}>404</h1>
                <p style={{ marginTop: '1rem' }}>Page not found.</p>
                <p style={{ marginTop: '2rem' }}>
                    <Link href="/">Go back home</Link>
                </p>
            </section>
        </>
    );
}
