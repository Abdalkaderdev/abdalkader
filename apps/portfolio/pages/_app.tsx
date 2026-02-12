import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SmoothScrolling from "@/components/SmoothScrolling";
// CustomCursor removed per user preference
import "@/styles/globals.scss";  // Ensure this is your global SCSS import
import type { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "@/components/Loader";
import { useMemo } from "react";
import { SITE_URL } from "@/utils/seo";
import JsonLd from "@/components/SEO/JsonLd";
import { personJsonLd, websiteJsonLd } from "@/utils/jsonld";
import { ppRegular, ppMedium } from "@/libs/fonts";
import { getEnvironment } from "@/src/utils/environment";
import Plausible from "@/components/Analytics/Plausible";
import '@abdalkader/ui/dist/styles.css';
import StagingDashboard from "@/components/StagingDashboard";
import { ErrorBoundary } from "@abdalkader/ui";
import { initPerformanceMonitoring, reportWebVitals } from "@/utils/performanceMonitoring";
import StagingBanner from "@/src/components/StagingBanner";
import StagingTools from "@/src/components/StagingTools";
import { initializeStagingEnvironment } from "@/src/config/staging";
import dynamic from "next/dynamic";

// Dynamically import heavy components that don't need to load immediately
const WelcomeModal = dynamic(() => import("@/components/WelcomeModal"), { ssr: false });
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const scrollPositions = useRef<{ [key: string]: number }>({});
    const [showStagingDashboard, setShowStagingDashboard] = useState(false);
    const isStaging = getEnvironment() === 'staging';

    const [isMusicEnabled, setIsMusicEnabled] = useState(false);

    const handleMusicToggle = useCallback((enabled: boolean) => {
        setIsMusicEnabled(enabled);
    }, []);
    
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
                <title>Abdalkader - AI/ML & Full-Stack Web Developer | Python, React, TensorFlow</title>
                <link rel="icon" type="image/x-icon" href="/images/favicon.png" />
                <link rel="canonical" href={`${SITE_URL}${router.asPath === '/' ? '' : router.asPath}`.replace(/\/$/, '')} />
                <meta
                    name="description"
                    content="Specializing in AI-powered web solutions. I build machine learning models, full-stack applications, and high-converting e-commerce stores. Explore my portfolio and interactive AI lab."
                />
                <meta name="author" content="Abdalkader Alhamoud" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="Abdalkader - AI/ML & Full-Stack Web Developer | Python, React, TensorFlow" />
                <meta property="og:description" content="Specializing in AI-powered web solutions. I build machine learning models, full-stack applications, and high-converting e-commerce stores. Explore my portfolio and interactive AI lab." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://abdalkader.dev/" />
                <meta property="og:image" content="https://abdalkader.dev/images/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Abdalkader - AI/ML & Full-Stack Web Developer | Python, React, TensorFlow" />
                <meta name="twitter:description" content="Specializing in AI-powered web solutions. I build machine learning models, full-stack applications, and high-converting e-commerce stores. Explore my portfolio and interactive AI lab." />
                <meta name="twitter:image" content="https://abdalkader.dev/images/twitter-image.jpg" />
                <meta name="twitter:site" content="@abdalkaderdev" />
                
                {/* Additional SEO tags */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content="AI developer, machine learning engineer, full-stack developer, React developer, Python developer, TensorFlow.js, AI integration, ML applications, intelligent web apps, AI specialist, e-commerce development" />
            </Head>

            <Loader />
            <Plausible domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ''} />
            <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
            <AnimatePresence mode="wait">
                <motion.div key={router.asPath} className={`${ppRegular.variable} ${ppMedium.variable}`}>
                    {/* Slide-in animation with cross */}
                    {!prefersReducedMotion && (
                    <motion.div
                        className="slide-in"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 0 }}
                        exit={{ scaleY: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationComplete={() => { if (typeof window !== 'undefined') { window.scrollTo(0, 0); } }}
                    >
                        <div className="page-cross-loader">
                            <div className="loading-wide">
                                <div className="l1 color" />
                                <div className="l2 color" />
                                <div className="e1 color animation-effect-light" />
                                <div className="e2 color animation-effect-light-d" />
                                <div className="e3">✝</div>
                                <div className="e4 color animation-effect-light" />
                                <div className="e5 color animation-effect-light-d" />
                                <div className="e6 animation-effect-scale">✦</div>
                                <div className="e7 color" />
                                <div className="e8 color" />
                            </div>
                        </div>
                    </motion.div>)}

                    {/* Slide-out animation with cross */}
                    {!prefersReducedMotion && (
                    <motion.div
                        className="slide-out"
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: 0 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="page-cross-loader">
                            <div className="loading-wide">
                                <div className="l1 color" />
                                <div className="l2 color" />
                                <div className="e1 color animation-effect-light" />
                                <div className="e2 color animation-effect-light-d" />
                                <div className="e3">✝</div>
                                <div className="e4 color animation-effect-light" />
                                <div className="e5 color animation-effect-light-d" />
                                <div className="e6 animation-effect-scale">✦</div>
                                <div className="e7 color" />
                                <div className="e8 color" />
                            </div>
                        </div>
                    </motion.div>)}

                    <ErrorBoundary
                        customMessage="Something went wrong with the portfolio. Please try refreshing the page."
                        showRetry={true}
                        showHome={true}
                        onError={(error: Error) => {
                            // Log to existing error tracking system
                            if (typeof window !== 'undefined' && 'gtag' in window) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (window as any).gtag('event', 'exception', {
                                    description: error.message,
                                    fatal: false,
                                });
                            }
                        }}
                    >
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

            {/* Custom cursor removed per user preference */}

            {/* Spiritual Enhancement Components */}
            <WelcomeModal onMusicToggle={handleMusicToggle} />
            <MusicPlayer isEnabled={isMusicEnabled} />
        </>
    );
}

// Export Web Vitals function for Next.js
export { reportWebVitals };