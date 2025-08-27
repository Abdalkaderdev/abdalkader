import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SmoothScrolling from "@/components/SmoothScrolling";
import "@/styles/globals.scss";  // Ensure this is your global SCSS import
import type { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "@/components/Loader";
import { useMemo } from "react";
import { SITE_URL } from "@/utils/seo";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const scrollPositions = useRef<{ [key: string]: number }>({});
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    // Scroll position management
    useEffect(() => {
        const saveScrollPosition = (url: string) => {
            scrollPositions.current[url] = window.scrollY;
        };

        const restoreScrollPosition = (url: string) => {
            const savedPosition = scrollPositions.current[url] || 0;
            window.scrollTo(0, savedPosition);
        };

        router.events.on("routeChangeStart", saveScrollPosition);
        router.events.on("routeChangeComplete", restoreScrollPosition);

        return () => {
            router.events.off("routeChangeStart", saveScrollPosition);
            router.events.off("routeChangeComplete", restoreScrollPosition);
        };
    }, [router.events]);

    return (
        <>
            <Head>
                <title>Abdalkader Alhamoud | Web Developer & AI Engineer</title>
                <link rel="icon" type="image/x-icon" href="/images/favicon.png" />
                <link rel="canonical" href={`${SITE_URL}${router.asPath === '/' ? '' : router.asPath}`.replace(/\/$/, '')} />
                <meta
                    name="description"
                    content="Portfolio of Abdalkader Alhamoud, a Web Developer and AI Engineer specializing in building modern, user-focused digital experiences."
                />
                <meta name="author" content="Abdalkader Alhamoud" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="Abdalkader Alhamoud | Web Developer & AI Engineer" />
                <meta property="og:description" content="Portfolio of Abdalkader Alhamoud, showcasing projects in web development and AI engineering." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://abdalkader-alhamoud.vercel.app/" />
                <meta property="og:image" content="https://abdalkader-alhamoud.vercel.app/images/og-image.jpg" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Abdalkader Alhamoud | Web Developer & AI Engineer" />
                <meta name="twitter:description" content="Portfolio of Abdalkader Alhamoud, showcasing projects in web development and AI engineering." />
                <meta name="twitter:image" content="https://abdalkader-alhamoud.vercel.app/images/twitter-image.jpg" />
                
                {/* Additional SEO tags */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content="web developer, AI engineer, frontend developer, React, Next.js, TypeScript, portfolio" />
            </Head>

            <Loader />
            <AnimatePresence mode="wait">
                <motion.div key={router.asPath}>
                    {/* Slide-in animation */}
                    {!prefersReducedMotion && (
                    <motion.div
                        className="slide-in"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 0 }}
                        exit={{ scaleY: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationComplete={() => window.scrollTo(0, 0)}
                    />)}

                    {/* Slide-out animation */}
                    {!prefersReducedMotion && (
                    <motion.div
                        className="slide-out"
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: 0 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />)}

                    <SmoothScrolling>
                        <Nav />
                        <motion.main
                            key="main-content"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}  // Disable fade on exit if reduced motion
                            transition={{ duration: prefersReducedMotion ? 0 : 0, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Component {...pageProps} />
                        </motion.main>
                        <Footer />
                    </SmoothScrolling>
                </motion.div>
            </AnimatePresence>
        </>
    );
}