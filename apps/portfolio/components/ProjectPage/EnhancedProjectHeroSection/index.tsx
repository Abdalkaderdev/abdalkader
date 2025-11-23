import { splitText } from '@/utils/textUtils';
import { useRef, useEffect } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './EnhancedProjectHeroSection.module.scss';
import { isReducedMotion } from '@/utils/motion';

export default function EnhancedProjectHeroSection() {
    const bannerHeadingRef = useRef<HTMLDivElement | null>(null);
    const subtitleRef = useRef<HTMLDivElement | null>(null);
    const techTagsRef = useRef<HTMLDivElement | null>(null);
    const animatedTextRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isReducedMotion()) return;

        const tl = gsap.timeline();

        // Animate the main heading
        if (bannerHeadingRef.current) {
            const headingSpans = bannerHeadingRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "105%", duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.4);
        }

        // Animate the animated text
        if (animatedTextRef.current) {
            const textSpans = animatedTextRef.current.querySelectorAll('.animated-word');
            tl.from(textSpans, { 
                opacity: 0, 
                y: 50, 
                duration: 0.6, 
                stagger: 0.2, 
                ease: "power2.out" 
            }, 0.8);

            // Add continuous animation to highlight words
            textSpans.forEach((span, index) => {
                tl.to(span, {
                    color: '#f44e00',
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.inOut",
                    repeat: 1,
                    yoyo: true,
                    repeatDelay: index * 0.1
                }, 1.5 + index * 0.2);
            });
        }

        // Animate subtitle
        if (subtitleRef.current) {
            tl.from(subtitleRef.current, { 
                opacity: 0, 
                y: 30, 
                duration: 0.6, 
                ease: "power2.out" 
            }, 1.2);
        }

        // Animate tech tags
        if (techTagsRef.current) {
            const tags = techTagsRef.current.querySelectorAll('.tech-tag');
            tl.from(tags, { 
                opacity: 0, 
                scale: 0.8, 
                duration: 0.4, 
                stagger: 0.1, 
                ease: "back.out(1.7)" 
            }, 1.6);
        }

        return () => {
            tl.kill();
        };
    }, []);

    const techTags = [
        'AI/ML', 'Full-Stack', 'React', 'Python', 'Next.js', 'TypeScript'
    ];

    const animatedWords = [
        'Innovative', 'Scalable', 'User-Focused', 'Performance-Driven', 'Modern'
    ];

    return (
        <>
            <section className={styles.enhancedProjectHero}>
                {/* Animated Background Elements */}
                <div className={styles.backgroundElements}>
                    <div className={styles.floatingElement} style={{ '--delay': '0s' } as React.CSSProperties}></div>
                    <div className={styles.floatingElement} style={{ '--delay': '2s' } as React.CSSProperties}></div>
                    <div className={styles.floatingElement} style={{ '--delay': '4s' } as React.CSSProperties}></div>
                </div>

                <div className={styles.content}>
                    {/* Main Heading */}
                    <div className={styles.headingContainer}>
                        <h1 ref={bannerHeadingRef}>
                            {splitText("projects")}
                        </h1>
                    </div>

                    {/* Animated Text */}
                    <div className={styles.animatedTextContainer} ref={animatedTextRef}>
                        <div className={styles.animatedText}>
                            {animatedWords.map((word, index) => (
                                <span key={index} className="animated-word" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
                                    {word}
                                </span>
                            ))}
                        </div>
                        <div className={styles.animatedTextSubtext}>
                            Solutions that make an impact
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className={styles.subtitleContainer} ref={subtitleRef}>
                        <p>
                            From AI-powered applications to pixel-perfect interfaces, 
                            each project represents a unique challenge solved with 
                            cutting-edge technology and creative problem-solving.
                        </p>
                    </div>

                    {/* Technology Tags */}
                    <div className={styles.techTagsContainer} ref={techTagsRef}>
                        <div className={styles.techTags}>
                            {techTags.map((tag, index) => (
                                <span key={index} className="tech-tag" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className={styles.scrollIndicator}>
                        <div className={styles.scrollLine}></div>
                        <div className={styles.scrollText}>Explore Projects</div>
                    </div>
                </div>
            </section>
        </>
    );
}
