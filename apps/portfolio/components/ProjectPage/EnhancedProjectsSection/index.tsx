import Link from 'next/link';
import styles from './EnhancedProjectsSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
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
}

// Magnetic Button Component
function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
    const btnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
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
        const card = cardRef.current;
        const animationContainer = animationRef.current;
        const content = contentRef.current;
        if (!card || !animationContainer || !content) return;

        const ctx = gsap.context(() => {
            // Sticky stacking effect
            ScrollTrigger.create({
                trigger: card,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                pinSpacing: false,
            });

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

// Main Work Section
export default function EnhancedProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

    const displayProjects = projects.slice(0, 6);

    return (
        <section ref={sectionRef} className={styles.workSection}>
            {/* Video Background - Code/Matrix effect */}
            <VideoBackground
                src="/videos/projects-bg.mp4"
                opacity={0.1}
                overlay
                overlayDirection="radial"
            />

            {/* Section Header */}
            <div ref={headerRef} className={styles.header}>
                <div className={styles.headerMeta}>
                    <span>SELECTED WORK</span>
                    <span>2024 — PRESENT</span>
                </div>
                <h1 className={styles.headerTitle}>PROJECTS</h1>
                <p className={styles.headerSub}>
                    Crafted with precision. Built for impact.
                </p>
            </div>

            {/* Footer CTA - Sticky, projects scroll over it */}
            <div className={styles.sectionFooter}>
                <Link href="/projects" className={styles.viewAllBtn}>
                    <span>VIEW ALL PROJECTS</span>
                    <div className={styles.btnLine} />
                </Link>
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
        </section>
    );
}
