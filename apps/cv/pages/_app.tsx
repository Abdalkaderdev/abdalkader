import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Abdalkader Alhamoud - Interactive CV | Full Stack AI Engineer</title>
        <meta name="description" content="Interactive resume of Abdalkader Alhamoud - Full Stack AI Engineer specializing in React, Node.js, AI/ML, and SaaS development." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="Abdalkader Alhamoud - Interactive CV" />
        <meta property="og:description" content="Interactive resume of Abdalkader Alhamoud - Full Stack AI Engineer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cv.abdalkader.dev" />

        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
