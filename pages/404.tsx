import Link from 'next/link';

export default function Custom404() {
    return (
        <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '8rem', lineHeight: 1 }}>404</h1>
            <p style={{ marginTop: '1rem' }}>Page not found.</p>
            <p style={{ marginTop: '2rem' }}>
                <Link href="/">Go back home</Link>
            </p>
        </section>
    );
}

