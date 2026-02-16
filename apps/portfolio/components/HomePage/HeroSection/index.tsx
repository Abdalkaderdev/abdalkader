import { useEffect, useRef } from "react";
import { gsap } from "@/libs/gsap";
import styles from './HeroSection.module.scss';
import ImageTrailEffect from "@/components/HomePage/ImageTrail";
import { LineReveal, ScrambleText } from "@/components/TextReveal";
import PillBadge from "@/components/PillBadge";
import BibleVerse from "@/components/BibleVerse";
import VideoBackground from '@/components/VideoBackground';

export default function HeroSection() {
    const marqueeRef = useRef<HTMLDivElement | null>(null);
    const marqueeTextRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Marquee animation (disabled for reduced motion)
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        const marqueeElement = marqueeRef.current;
        const marqueeTextElement = marqueeTextRef.current;

        if (marqueeElement && marqueeTextElement) {
            // Create the infinite marquee animation
            gsap.to(marqueeTextElement, {
                xPercent: -100, // Move by 100% of the element's width
                ease: "none",
                duration: 450, // Adjust the speed of the marquee
                repeat: -1, // Infinite loop
                modifiers: {
                    xPercent: gsap.utils.wrap(-100, 0), // Wrap the xPercent value to create a continuous effect
                },
            });
        }

    }, []);

    return (
        <section className={styles.hero}>
            {/* Video Background */}
            <VideoBackground
                src="/videos/home-hero-bg.mp4"
                opacity={0.4}
                overlay
                overlayDirection="radial"
            />
            <ImageTrailEffect />
            <div className={styles.marquee} ref={marqueeRef} aria-hidden="true">
                <div className={styles.content} ref={marqueeTextRef} aria-hidden="true">
                    <span>&nbsp;Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -</span>
                    <span>&nbsp;Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -
                    Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud - Abdalkader Alhamoud -</span>
                </div>
            </div>
            <div className={styles.heroContent}>
                <PillBadge variant="glass" size="sm">
                    <ScrambleText delay={0.5} speed={40}>Available for Projects</ScrambleText>
                </PillBadge>
                <h1 className={styles.tagline}>
                    <LineReveal delay={0.2} duration={0.8}>Web Developer</LineReveal>
                    <br />
                    <LineReveal delay={0.4} duration={0.8}>& AI Engineer</LineReveal>
                </h1>
                <BibleVerse className={styles.bibleVerse} />
            </div>
        </section>
    );
}