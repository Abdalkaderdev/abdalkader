import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './EnhancedProjectHeroSection.module.scss';
import { isReducedMotion } from '@/utils/motion';
import VideoBackground from '@/components/VideoBackground';

const rotatingWords = ['Creative', 'Scalable', 'Modern', 'Innovative'];

export default function EnhancedProjectHeroSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const lineRef = useRef<HTMLDivElement | null>(null);
    const descRef = useRef<HTMLParagraphElement | null>(null);
    const statsRef = useRef<HTMLDivElement | null>(null);
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        if (isReducedMotion()) return;

        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isReducedMotion()) return;

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Animate heading
        if (headingRef.current) {
            tl.from(headingRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
            }, 0.3);
        }

        // Animate line
        if (lineRef.current) {
            tl.from(lineRef.current, {
                scaleX: 0,
                duration: 1,
            }, 0.6);
        }

        // Animate description
        if (descRef.current) {
            tl.from(descRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
            }, 0.9);
        }

        // Animate stats
        if (statsRef.current) {
            const statItems = statsRef.current.querySelectorAll('.stat-item');
            tl.from(statItems, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
            }, 1.1);
        }

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section className={styles.hero} ref={sectionRef}>
            {/* Video Background */}
            <VideoBackground
                src="/videos/particle-bg.mp4"
                opacity={0.4}
                overlay
                overlayDirection="bottom"
            />

            {/* Background gradient orbs */}
            <div className={styles.bgOrb1} />
            <div className={styles.bgOrb2} />

            <div className={styles.container}>
                {/* Main Content */}
                <div className={styles.mainContent}>
                    <div className={styles.labelRow}>
                        <span className={styles.label}>Portfolio</span>
                        <span className={styles.year}>2024</span>
                    </div>

                    <h1 ref={headingRef} className={styles.heading}>
                        <span className={styles.line1}>
                            <span className={styles.rotatingWord} key={currentWord}>
                                {rotatingWords[currentWord]}
                            </span>
                        </span>
                        <span className={styles.line2}>Projects</span>
                    </h1>

                    <div className={styles.dividerLine} ref={lineRef} />

                    <p className={styles.description} ref={descRef}>
                        A collection of work crafted with passion, precision, and purpose.
                        Each project tells a story of solving real problems with elegant solutions.
                    </p>
                </div>

                {/* Stats Row */}
                <div className={styles.statsRow} ref={statsRef}>
                    <div className={`${styles.statItem} stat-item`}>
                        <span className={styles.statNumber}>8+</span>
                        <span className={styles.statLabel}>Projects</span>
                    </div>
                    <div className={`${styles.statItem} stat-item`}>
                        <span className={styles.statNumber}>50K+</span>
                        <span className={styles.statLabel}>Users Reached</span>
                    </div>
                    <div className={`${styles.statItem} stat-item`}>
                        <span className={styles.statNumber}>100%</span>
                        <span className={styles.statLabel}>Satisfaction</span>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollMouse}>
                        <div className={styles.scrollWheel} />
                    </div>
                    <span>Scroll to explore</span>
                </div>
            </div>
        </section>
    );
}
