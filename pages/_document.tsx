import { Html, Head, Main, NextScript } from "next/document";
import { buildCanonical } from "@/utils/seo";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="canonical" href={buildCanonical('/')} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html >
    );
}