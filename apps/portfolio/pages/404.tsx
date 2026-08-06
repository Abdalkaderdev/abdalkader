import Link from 'next/link';
import Head from 'next/head';
import { ArrowUpRight } from 'lucide-react';
import { NAVIGATION_LINKS } from '@/data/navigation';
import styles from '@/styles/NotFound.module.scss';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 — Page Not Found | Abdalkader</title>
                <meta
                    name="description"
                    content="That page does not exist. Here are the pages that do."
                />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <section className={styles.notFound}>
                <div className={styles.container}>
                    {/* aria-hidden: the numeral is decorative at this scale; the
                        heading below carries the actual message for screen readers. */}
                    <p className={styles.numeral} aria-hidden="true">
                        404
                    </p>

                    <h1 className={styles.heading}>This page does not exist</h1>

                    <p className={styles.body}>
                        Either the address is wrong, or something used to live here and no
                        longer does. Here is everything that is actually on the site.
                    </p>

                    <nav className={styles.links} aria-label="Site pages">
                        <ul>
                            {/* Sourced from the same NAVIGATION_LINKS the nav and footer
                                use, so this list cannot drift out of date. */}
                            {NAVIGATION_LINKS.map((link) => (
                                <li key={link.path}>
                                    <Link href={link.path} className={styles.link}>
                                        <span>{link.name}</span>
                                        <ArrowUpRight
                                            size={18}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                            className={styles.linkIcon}
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </section>
        </>
    );
}
