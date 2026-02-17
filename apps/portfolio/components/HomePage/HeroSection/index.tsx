import { useEffect, useRef, useState } from "react";
import { gsap } from "@/libs/gsap";
import styles from './HeroSection.module.scss';
import ImageTrailEffect from "@/components/HomePage/ImageTrail";
import BibleVerse from "@/components/BibleVerse";
import VideoBackground from '@/components/VideoBackground';
import ThreeBackground from '@/components/ThreeBackground';

// Split text into individual letter spans for animation
function ExplodingText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isAnimated, setIsAnimated] = useState(false);
    const [modalClosed, setModalClosed] = useState(false);

    // Listen for welcome modal close event
    useEffect(() => {
        const handleModalClose = () => setModalClosed(true);
        window.addEventListener('welcomeModalClosed', handleModalClose);
        return () => window.removeEventListener('welcomeModalClosed', handleModalClose);
    }, []);

    useEffect(() => {
        // Wait for modal to close before animating
        if (!containerRef.current || isAnimated || !modalClosed) return;

        const letters = containerRef.current.querySelectorAll(`.${styles.letter}`);
        if (letters.length === 0) return;

        setIsAnimated(true);

        // Set initial state - letters scattered across screen
        letters.forEach((letter) => {
            const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
            const randomY = (Math.random() - 0.5) * window.innerHeight * 1.5;
            const randomRotation = (Math.random() - 0.5) * 720;
            const randomScale = 0.1 + Math.random() * 0.5;

            gsap.set(letter, {
                x: randomX,
                y: randomY,
                rotation: randomRotation,
                scale: randomScale,
                opacity: 0,
                filter: 'blur(20px)',
            });
        });

        // Animate letters flying into place
        gsap.to(letters, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power4.out',
            stagger: {
                each: 0.03,
                from: 'random',
            },
            delay: delay,
        });
    }, [delay, isAnimated, modalClosed]);

    return (
        <span ref={containerRef} className={`${styles.explodingText} ${className || ''}`}>
            {text.split('').map((char, i) => (
                <span key={i} className={styles.letter}>
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
}

export default function HeroSection() {
    const marqueeRef = useRef<HTMLDivElement | null>(null);
    const marqueeTextRef = useRef<HTMLDivElement | null>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);
    const verseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Marquee animation - runs immediately
        const marqueeElement = marqueeRef.current;
        const marqueeTextElement = marqueeTextRef.current;

        if (marqueeElement && marqueeTextElement) {
            gsap.to(marqueeTextElement, {
                xPercent: -100,
                ease: "none",
                duration: 450,
                repeat: -1,
                modifiers: {
                    xPercent: gsap.utils.wrap(-100, 0),
                },
            });
        }

        // Wait for welcome modal to close before animating verse
        const animateHeroElements = () => {
            // Bible verse fade in
            if (verseRef.current) {
                gsap.fromTo(verseRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 0.9, duration: 1, ease: 'power3.out', delay: 1.2 }
                );
            }
        };

        window.addEventListener('welcomeModalClosed', animateHeroElements);
        return () => window.removeEventListener('welcomeModalClosed', animateHeroElements);
    }, []);

    return (
        <section className={styles.hero}>
            {/* 3D Background */}
            <ThreeBackground
                variant="blobs"
                primaryColor="#f44e00"
                secondaryColor="#d4af37"
                opacity={0.15}
                count={8}
                speed={0.5}
            />

            {/* Video Background */}
            <VideoBackground
                src="/videos/home-hero-bg.mp4"
                opacity={0.3}
                overlay
                overlayDirection="radial"
                startTime={1}
                endTime={6}
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
            <div className={styles.heroContent} ref={heroContentRef}>
                <h1 className={styles.tagline}>
                    <ExplodingText text="Web Developer & AI Engineer" delay={0.3} />
                </h1>
                <div ref={verseRef} style={{ opacity: 0 }}>
                    <BibleVerse className={styles.bibleVerse} />
                </div>
            </div>
        </section>
    );
}