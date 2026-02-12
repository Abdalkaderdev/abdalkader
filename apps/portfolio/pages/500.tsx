import Link from 'next/link';
import Head from 'next/head';

export default function Custom500() {
    return (
        <>
            <Head>
                <title>500 - Server Error | Abdalkader</title>
                <meta name="description" content="Something went wrong on our end. We're working on it. Please try again later." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '5rem', lineHeight: 1 }}>Something went wrong</h1>
                <p style={{ marginTop: '1rem' }}>We&apos;re working on it. Please try again later.</p>
                <p style={{ marginTop: '2rem' }}>
                    <Link href="/">Go back home</Link>
                </p>
            </section>
        </>
    );
}
