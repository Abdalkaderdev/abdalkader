import { splitText } from '@/utils/textUtils';
import { useRef, useEffect } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './EnhancedProjectHeroSection.module.scss';
import { isReducedMotion } from '@/utils/motion';

export default function EnhancedProjectHeroSection() {
    const bannerHeadingRef = useRef<HTMLDivElement | null>(null);
    const subtitleRef = useRef<HTMLDivElement | null>(null);
    const animatedTextRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isReducedMotion()) return;

        const tl = gsap.timeline();

        // Animate the main heading
        if (bannerHeadingRef.current) {
            const headingSpans = bannerHeadingRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "105%", duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.4);
        }

        // Animate the animated text words with stagger
        if (animatedTextRef.current) {
            const textSpans = animatedTextRef.current.querySelectorAll('.animated-word');
            tl.from(textSpans, {
                opacity: 0,
                x: -20,
                duration: 0.5,
                stagger: 0.15,
                ease: "power2.out"
            }, 0.8);
        }

        // Animate subtitle
        if (subtitleRef.current) {
            tl.from(subtitleRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power2.out"
            }, 1.2);
        }

        return () => {
            tl.kill();
        };
    }, []);

    const animatedWords = ['Innovative', 'Scalable', 'User-Focused', 'Modern'];

    return (
        <>
            <section className={styles.enhancedProjectHero}>
                {/* Cross watermark in background */}
                <div className={styles.crossWatermark} aria-hidden="true">
                    <svg viewBox="0 0 100 100" width="300" height="300">
                        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
                        <line x1="20" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>

                {/* Animated Background Elements */}
                <div className={styles.backgroundElements}>
                    <div className={styles.floatingElement} style={{ '--delay': '0s' } as React.CSSProperties}></div>
                    <div className={styles.floatingElement} style={{ '--delay': '2s' } as React.CSSProperties}></div>
                </div>

                <div className={styles.content}>
                    {/* Main Heading */}
                    <div className={styles.headingContainer}>
                        <h1 ref={bannerHeadingRef}>
                            {splitText("projects")}
                        </h1>
                    </div>

                    {/* Animated Text - Clean horizontal flow */}
                    <div className={styles.animatedTextContainer} ref={animatedTextRef}>
                        <div className={styles.animatedText}>
                            {animatedWords.map((word, index) => (
                                <span key={index} className="animated-word">
                                    {word}
                                    {index < animatedWords.length - 1 && <span className={styles.separator}>&#8226;</span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className={styles.subtitleContainer} ref={subtitleRef}>
                        <p>Crafted with purpose, built with excellence.</p>
                    </div>

                    {/* Scroll Indicator */}
                    <div className={styles.scrollIndicator}>
                        <div className={styles.scrollLine}></div>
                        <span className={styles.scrollText}>Explore</span>
                    </div>
                </div>
            </section>
        </>
    );
}
