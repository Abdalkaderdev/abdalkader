import Link from 'next/link';

export default function Custom500() {
    return (
        <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '5rem', lineHeight: 1 }}>Something went wrong</h1>
            <p style={{ marginTop: '1rem' }}>Were working on it. Please try again later.</p>
            <p style={{ marginTop: '2rem' }}>
                <Link href="/">Go back home</Link>
            </p>
        </section>
    );
}

