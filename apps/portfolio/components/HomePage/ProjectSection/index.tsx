import Link from 'next/link';
import styles from './ProjectSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { isReducedMotion } from '@/utils/motion';
import MatrixCodeAnimation from '@/components/MatrixCodeAnimation';
import VideoBackground from '@/components/VideoBackground';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ProjectCardProps {
    title: string;
    category: string;
    year: string;
    slug: string;
    index: number;
    colorVariant: 'orange' | 'gold' | 'blue' | 'green';
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
function ProjectCard({ title, category, year, slug, index, colorVariant }: ProjectCardProps) {
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

                {/* Center: Matrix Animation */}
                <div ref={animationRef} className={styles.imageContainer}>
                    <MatrixCodeAnimation
                        variant={colorVariant}
                        speed="normal"
                        density="normal"
                        text={title}
                    />
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

    useEffect(() => {
        if (isReducedMotion()) return;

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 85%',
                    }
                }
            );
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

            {/* Section Header */}
            <div ref={headerRef} className={styles.header}>
                <div className={styles.headerMeta}>
                    <span>FEATURED WORK</span>
                    <span>2024 — PRESENT</span>
                </div>
                <h1 className={styles.headerTitle}>WORK</h1>
                <p className={styles.headerSub}>
                    Selected projects crafted with precision
                </p>
            </div>

            {/* Project Cards */}
            <div className={styles.projectsContainer}>
                {displayProjects.map((project, index) => {
                    const colorVariants: Array<'orange' | 'gold' | 'blue' | 'green'> = ['orange', 'gold', 'blue', 'green'];
                    return (
                        <ProjectCard
                            key={project.slug}
                            title={project.title.toUpperCase()}
                            category={project.category?.[0] || 'Development'}
                            year="2024"
                            slug={project.slug}
                            index={index}
                            colorVariant={colorVariants[index % colorVariants.length]}
                        />
                    );
                })}
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
