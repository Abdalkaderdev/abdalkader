import Link from 'next/link';
import styles from './ProjectSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/libs/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { isReducedMotion } from '@/utils/motion';
import VideoBackground from '@/components/VideoBackground';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Word with cover box that scatters on scroll
interface WordCoverProps {
    word: string;
    index: number;
    onRegisterBox: (el: HTMLSpanElement | null, index: number) => void;
    className?: string;
}

function WordCover({ word, index, onRegisterBox, className }: WordCoverProps) {
    return (
        <span className={`${styles.wordWrapper} ${className || ''}`}>
            <span className={styles.wordText}>{word}</span>
            <span
                ref={(el) => onRegisterBox(el, index)}
                className={styles.wordCover}
                data-word-index={index}
            />
        </span>
    );
}

interface ProjectCardProps {
    title: string;
    category: string;
    year: string;
    slug: string;
    index: number;
}

// Magnetic Button Component
function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
    const btnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (isReducedMotion()) return;

        const btn = btnRef.current;
        if (!btn) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const handleMouseLeave = () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <Link href={href} ref={btnRef} className={styles.magneticBtn}>
            {children}
        </Link>
    );
}

// Project Card Component
function ProjectCard({ title, category, year, slug, index }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isReducedMotion()) return;

        const card = cardRef.current;
        const animationContainer = animationRef.current;
        const content = contentRef.current;
        if (!card || !animationContainer || !content) return;

        const ctx = gsap.context(() => {
            // Clip-path reveal animation
            gsap.fromTo(animationContainer,
                { clipPath: 'inset(25% 25% 25% 25%)' },
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        end: 'top 20%',
                        scrub: 1,
                    }
                }
            );

            // Content fade in
            gsap.fromTo(content,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, card);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className={styles.projectCard} style={{ zIndex: 10 + index }}>
            {/* Blueprint Grid Lines */}
            <div className={styles.gridLines}>
                {[...Array(13)].map((_, i) => (
                    <div key={i} className={styles.gridLine} />
                ))}
            </div>

            <div className={styles.cardInner}>
                {/* Left: Metadata */}
                <div className={styles.metadata}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>YEAR</span>
                        <span className={styles.metaValue}>{year}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>TYPE</span>
                        <span className={styles.metaValue}>{category.toUpperCase()}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>NO.</span>
                        <span className={styles.metaValue}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                </div>

                {/* Center: Video Background with Title */}
                <div ref={animationRef} className={styles.imageContainer}>
                    <VideoBackground
                        src="/videos/projects-bg.mp4"
                        opacity={0.8}
                        overlay={false}
                    />
                    <div className={styles.projectTitle}>{title}</div>
                </div>

                {/* Right: CTA */}
                <div ref={contentRef} className={styles.content}>
                    <MagneticButton href={`/projects/${slug}`}>
                        <span>VIEW PROJECT</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </MagneticButton>
                </div>
            </div>

            {/* Index number */}
            <div className={styles.indexNumber}>{String(index + 1).padStart(2, '0')}</div>
        </div>
    );
}

// Main Projects Section for Home Page
export default function ProjectSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const wordBoxesRef = useRef<(HTMLSpanElement | null)[]>([]);
    const [, setBoxesVisible] = useState(true);

    // Register word cover boxes
    const registerBox = (el: HTMLSpanElement | null, index: number) => {
        wordBoxesRef.current[index] = el;
    };

    useEffect(() => {
        if (isReducedMotion()) {
            setBoxesVisible(false);
            return;
        }

        const ctx = gsap.context(() => {
            const boxes = wordBoxesRef.current.filter(Boolean) as HTMLSpanElement[];

            if (boxes.length > 0) {
                const screenBottom = window.innerHeight + 300;

                // Create scroll-driven animations for each box
                // Boxes drop progressively as you scroll

                // Box 0: FEATURED WORK - drifts LEFT
                if (boxes[0]) {
                    gsap.to(boxes[0], {
                        y: screenBottom,
                        x: -350,
                        rotation: -45,
                        scale: 0.2,
                        opacity: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: 'top 90%',
                            end: 'top 20%',
                            scrub: 1,
                        }
                    });
                }

                // Box 1: 2024 — PRESENT - drifts RIGHT
                if (boxes[1]) {
                    gsap.to(boxes[1], {
                        y: screenBottom,
                        x: 380,
                        rotation: 50,
                        scale: 0.2,
                        opacity: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: 'top 85%',
                            end: 'top 15%',
                            scrub: 1.2,
                        }
                    });
                }

                // Box 2: Big WORK - drifts RIGHT (heavier, slower)
                if (boxes[2]) {
                    gsap.to(boxes[2], {
                        y: screenBottom,
                        x: 300,
                        rotation: 35,
                        scale: 0.15,
                        opacity: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: 'top 80%',
                            end: 'top 10%',
                            scrub: 1.5,
                        }
                    });
                }

                // Box 3: Selected projects - drifts LEFT
                if (boxes[3]) {
                    gsap.to(boxes[3], {
                        y: screenBottom,
                        x: -320,
                        rotation: -40,
                        scale: 0.2,
                        opacity: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: 'top 75%',
                            end: 'top 5%',
                            scrub: 1.3,
                        }
                    });
                }

                // Box 4: crafted with precision - drifts RIGHT
                if (boxes[4]) {
                    gsap.to(boxes[4], {
                        y: screenBottom,
                        x: 360,
                        rotation: 48,
                        scale: 0.2,
                        opacity: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: 'top 70%',
                            end: 'top 0%',
                            scrub: 1.4,
                            onLeave: () => setBoxesVisible(false),
                        }
                    });
                }
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Show only first 4 projects on home page
    const displayProjects = projects.slice(0, 4);

    return (
        <section ref={sectionRef} className={styles.workSection}>
            {/* Video Background - Code/Matrix effect */}
            <VideoBackground
                src="/videos/projects-bg.mp4"
                opacity={0.12}
                overlay
                overlayDirection="radial"
            />

            {/* Section Header with Word Cover Boxes */}
            <div ref={headerRef} className={styles.header}>
                <div className={styles.headerMeta}>
                    <WordCover word="FEATURED WORK" index={0} onRegisterBox={registerBox} />
                    <WordCover word="2024 — PRESENT" index={1} onRegisterBox={registerBox} />
                </div>
                <h1 className={styles.headerTitle}>
                    <WordCover word="WORK" index={2} onRegisterBox={registerBox} className={styles.bigWord} />
                </h1>
                <p className={styles.headerSub}>
                    <WordCover word="Selected projects" index={3} onRegisterBox={registerBox} />
                    {' '}
                    <WordCover word="crafted with precision" index={4} onRegisterBox={registerBox} />
                </p>
            </div>

            {/* Project Cards */}
            <div className={styles.projectsContainer}>
                {displayProjects.map((project, index) => (
                    <ProjectCard
                        key={project.slug}
                        title={project.title.toUpperCase()}
                        category={project.category?.[0] || 'Development'}
                        year="2024"
                        slug={project.slug}
                        index={index}
                    />
                ))}
            </div>

            {/* Footer CTA */}
            <div className={styles.sectionFooter}>
                <Link href="/projects" className={styles.viewAllBtn}>
                    <span>VIEW ALL PROJECTS</span>
                    <div className={styles.btnLine} />
                </Link>
            </div>
        </section>
    );
}
