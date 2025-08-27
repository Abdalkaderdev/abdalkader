import { Html, Head, Main, NextScript } from "next/document";
import { buildCanonical } from "@/utils/seo";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="canonical" href={buildCanonical('/')} />
                <link rel="manifest" href="/manifest.webmanifest" />
                <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/icon-192.png" />
                <meta name="theme-color" content="#ff6a00" />
            </Head>
            <body>
                <a href="#main" className="skip-link">Skip to content</a>
                <Main />
                <NextScript />
            </body>
        </Html >
    );
}