import Head from 'next/head';
import Signpost from '@/components/Signpost';
import VideoBackground from '@/components/VideoBackground';
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
                <VideoBackground
                    src="/videos/guidance-bg.mp4"
                    opacity={0.25}
                    overlay
                    overlayDirection="radial"
                />
                <Signpost />
            </section>
        </>
    );
}
