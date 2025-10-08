import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SmoothScrolling from "@/components/SmoothScrolling";
import "@/styles/globals.scss";  // Ensure this is your global SCSS import
import type { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "@/components/Loader";
import { useMemo } from "react";
import { SITE_URL } from "@/utils/seo";
import JsonLd from "@/components/SEO/JsonLd";
import { personJsonLd, websiteJsonLd } from "@/utils/jsonld";
import { ppRegular, ppMedium } from "@/libs/fonts";
import Plausible from "@/components/Analytics/Plausible";
import '@abdalkader/ui/dist/styles.css';
import StagingDashboard from "@/components/StagingDashboard";
import { ErrorBoundary } from "@/utils/errorTracking";
import { initPerformanceMonitoring, reportWebVitals } from "@/utils/performanceMonitoring";
import StagingBanner from "@/src/components/StagingBanner";
import StagingTools from "@/src/components/StagingTools";
import { initializeStagingEnvironment } from "@/src/config/staging";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const scrollPositions = useRef<{ [key: string]: number }>({});
    const [showStagingDashboard, setShowStagingDashboard] = useState(false);
    const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging';
    
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    // Initialize staging environment
    useEffect(() => {
        if (isStaging) {
            initializeStagingEnvironment();
            initPerformanceMonitoring();
        }
    }, [isStaging]);

    // Scroll position management
    useEffect(() => {
        const saveScrollPosition = (url: string) => {
            if (typeof window !== 'undefined') {
                scrollPositions.current[url] = window.scrollY;
            }
        };

        const restoreScrollPosition = (url: string) => {
            if (typeof window !== 'undefined') {
                const savedPosition = scrollPositions.current[url] || 0;
                window.scrollTo(0, savedPosition);
            }
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
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Abdalkader Alhamoud | Web Developer & AI Engineer" />
                <meta name="twitter:description" content="Portfolio of Abdalkader Alhamoud, showcasing projects in web development and AI engineering." />
                <meta name="twitter:image" content="https://abdalkader-alhamoud.vercel.app/images/twitter-image.jpg" />
                <meta name="twitter:site" content="@abdalkaderdev" />
                
                {/* Additional SEO tags */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content="web developer, AI engineer, frontend developer, React, Next.js, TypeScript, portfolio" />

                {/* JSON-LD: Person */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Person',
                            name: 'Abdalkader Alhamoud',
                            url: 'https://abdalkader-alhamoud.vercel.app/',
                            jobTitle: 'Web Developer & AI Engineer',
                            sameAs: [
                                'https://github.com/abdalkaderdev',
                                'https://www.linkedin.com/in/abdalkaderdev',
                                'https://www.instagram.com/abdalkader.dev'
                            ]
                        })
                    }}
                />

                {/* JSON-LD: WebSite */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'Abdalkader Alhamoud Portfolio',
                            url: 'https://abdalkader-alhamoud.vercel.app/',
                            potentialAction: {
                                '@type': 'SearchAction',
                                target: 'https://abdalkader-alhamoud.vercel.app/?q={search_term_string}',
                                'query-input': 'required name=search_term_string'
                            }
                        })
                    }}
                />
            </Head>

            <Loader />
            <Plausible domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ''} />
            <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
            <AnimatePresence mode="wait">
                <motion.div key={router.asPath} className={`${ppRegular.variable} ${ppMedium.variable}`}>
                    {/* Slide-in animation */}
                    {!prefersReducedMotion && (
                    <motion.div
                        className="slide-in"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 0 }}
                        exit={{ scaleY: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationComplete={() => { if (typeof window !== 'undefined') { window.scrollTo(0, 0); } }}
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

                    <ErrorBoundary>
                        <SmoothScrolling>
                            <Nav />
                            <motion.main
                                key="main-content"
                                id="main"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: prefersReducedMotion ? 1 : 0 }}  // Disable fade on exit if reduced motion
                                transition={{ duration: prefersReducedMotion ? 0 : 0, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Component {...pageProps} />
                            </motion.main>
                            <Footer />
                        </SmoothScrolling>
                    </ErrorBoundary>
                    
                    {/* Staging Environment Components - Only show in staging environment */}
                    {isStaging && (
                        <>
                            <StagingBanner />
                            <StagingDashboard 
                                isVisible={showStagingDashboard}
                                onToggle={() => setShowStagingDashboard(!showStagingDashboard)}
                            />
                            <StagingTools 
                                isVisible={showStagingDashboard}
                                onToggle={() => setShowStagingDashboard(!showStagingDashboard)}
                            />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    );
}

// Export Web Vitals function for Next.js
export { reportWebVitals };