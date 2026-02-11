import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { gsap, ScrollTrigger } from '@/libs/gsap';
import { splitText } from '@/utils/textUtils';
import styles from './ProjectSection.module.scss';
import Link from 'next/link';
import Button from '@/components/Button';
import Tag from '@/components/Tag';
import { projects } from '@/data/projectsData';
import { isReducedMotion } from '@/utils/motion';
import ProjectModal from '@/components/ProjectModal';

export default function ProjectSection() {
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const cardRefs = useRef<HTMLElement[]>([]);
    const router = useRouter();
    const headingRef = useRef<HTMLDivElement | null>(null);
    const taglineRef = useRef<HTMLDivElement | null>(null);
    const btnWrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isReducedMotion()) return; // Respect user preference
        // Create a timeline for the heading wrapper animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: `.${styles.projects} .${styles.heading}`,
                start: 'top 70%',
                onEnter: () => tl.play(),
            },
        });

        // Animation sequence
        if (taglineRef.current) {
            tl.from(taglineRef.current, { y: 50, opacity: 0, duration: .8 }, 0);
        }

        if (headingRef.current) {
            const headingSpans = headingRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "110%", duration: .6, stagger: 0.01 }, 0.4);
        }

        if (btnWrapperRef.current) {
            tl.from(btnWrapperRef.current, { y: 50, opacity: 0, duration: 0.8 }, 0.8);
        }

        // Project Card Animation
        cardRefs.current.forEach((card, i) => {
            if (i < cardRefs.current.length - 1) {
                gsap.to(card, {
                    scale: 0.8,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: cardRefs.current[i + 1],
                        start: 'top center',
                        end: 'top top',
                        scrub: 1,
                    },
                });
            }

            // Animate badges into place when each card enters
            if (card) {
                const badges = card.querySelectorAll(`.${styles.badges} .${styles.badge}`);
                if (badges.length) {
                    gsap.fromTo(
                        badges,
                        { opacity: 0, y: -10 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            stagger: 0.06,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 80%',
                                toggleActions: 'play none none reverse',
                            },
                        }
                    );
                }

                // Title reveal
                const title = card.querySelector(`.${styles.title} h3`);
                if (title) {
                    gsap.fromTo(
                        title,
                        { y: 20, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse',
                            },
                        }
                    );
                }

                // Categories reveal
                const cats = card.querySelectorAll(`.${styles.category} h5`);
                if (cats.length) {
                    gsap.fromTo(
                        cats,
                        { y: 10, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.4,
                            stagger: 0.06,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 80%',
                                toggleActions: 'play none none reverse',
                            },
                        }
                    );
                }
            }
        });

        // Cleanup on unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Sync modal with URL (?project=slug)
    useEffect(() => {
        const qp = router.query.project;
        if (typeof qp === 'string') {
            setOpenSlug(qp);
        } else if (!qp) {
            setOpenSlug(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.project]);

    const openModal = (slug: string) => {
        setOpenSlug(slug);
        router.push({ pathname: router.pathname, query: { ...router.query, project: slug } }, undefined, { shallow: true });
    };

    const closeModal = () => {
        setOpenSlug(null);
        const rest = { ...router.query } as Record<string, string | string[]>;
        delete rest.project;
        router.push({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
    };

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    return (
        <section className={styles.projects}>
            {/* heading */}
            <div className={styles.heading}>
                <div ref={taglineRef}>
                    <Tag text='Creations' />
                </div>
                <div className={styles.headingWrapper}>
                    <h1 ref={headingRef}>
                        {splitText("Selected works & experiments")}
                    </h1>
                    <div ref={btnWrapperRef}>
                        <Button text="All Projects" href="/projects" />
                    </div>
                </div>
            </div>

            {/* projects wrapper */}
            <div className={styles.wrapper}>
                {projects.map((project) => (
                    <div key={project.slug} className={`${styles.projectCard} ${styles.textOnly}`} ref={addToRefs}>
                        <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                            <div className={styles.projectDetails}>
                                <div className={styles.title}>
                                    <h3>{project.title}</h3>
                                </div>
                                <div className={styles.category}>
                                    {project.category.map((cat, j) => <h5 key={j}>{cat}</h5>)}
                                </div>
                            </div>
                        </Link>
                        <div className={styles.quickActions}>
                            <button className={styles.quickView} onClick={() => openModal(project.slug)}>Quick View</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Single modal instance - more efficient than rendering one per project */}
            {(() => {
                const selectedProject = projects.find(p => p.slug === openSlug);
                return selectedProject ? (
                    <ProjectModal
                        isOpen={!!selectedProject}
                        onClose={closeModal}
                        project={{
                            title: selectedProject.title,
                            category: selectedProject.category,
                            overview: selectedProject.overview,
                            live: selectedProject.live,
                            github: selectedProject.github,
                            slug: selectedProject.slug,
                        }}
                    />
                ) : null;
            })()}
        </section>
    );
}