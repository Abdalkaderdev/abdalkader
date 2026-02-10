import Head from 'next/head';
import LordsPrayer from '@/components/LordsPrayer';

export default function PrayerPage() {
    return (
        <>
            <Head>
                <title>Prayers | Abdalkader</title>
                <meta name="description" content="A collection of prayers - The Lord&apos;s Prayer, Psalm 23, Serenity Prayer, and more" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <LordsPrayer />
        </>
    );
}
