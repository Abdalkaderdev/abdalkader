import Head from 'next/head';
import Signpost from '@/components/Signpost';
import styles from '@/styles/GuidancePage.module.scss';

export default function GuidancePage() {
    return (
        <>
            <Head>
                <title>Guidance | Abdalkader</title>
                <meta name="description" content="Biblical guidance and wisdom - Verses for direction and faith" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <section className={styles.guidancePage}>
                <Signpost />
            </section>
        </>
    );
}
