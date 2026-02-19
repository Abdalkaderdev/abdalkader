import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Abdalkader's Blog | AI, Web Development & Tech Insights</title>
        <meta name="description" content="Technical blog by Abdalkader Alhamoud covering AI engineering, web development, React, Node.js, and building SaaS products." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="Abdalkader's Blog" />
        <meta property="og:description" content="Technical blog covering AI engineering, web development, and building SaaS products." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blog.abdalkader.dev" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
