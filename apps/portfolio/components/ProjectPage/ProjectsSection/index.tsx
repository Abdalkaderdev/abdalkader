// /pages/project.tsx
import Link from 'next/link';
import styles from './ProjectsSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { gsap } from '@/libs/gsap';
import ProjectModal from '@/components/ProjectModal';
import { Skeleton } from '@abdalkader/ui';

export default function ProjectsSection() {
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const cardRefs = useRef<HTMLElement[]>([]);
    const router = useRouter();

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    useEffect(() => {
        // Simulate loading
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // Card entrance
        gsap.from(cardRefs.current, {
            opacity: 0,
            y: "10%",
            duration: 1.0,
            stagger: 0.08,
            ease: "power3.out",
            delay: isLoading ? 2.0 : 0.4,
        });

        // Title/category reveal per card
        cardRefs.current.forEach((card) => {
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
        });

        return () => {
            clearTimeout(loadingTimer);
        };
    }, [isLoading])

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

    return (
        <section className={styles.ProjectsSection}>
            <div className={styles.wrapper}>
                {isLoading ? (
                    // Show skeleton loaders while loading
                    Array.from({ length: projects.length }).map((_, index) => (
                        <div key={`skeleton-${index}`} className={`${styles.projectCard} ${styles.textOnly}`}>
                            <div className={styles.projectDetails}>
                                <div className={styles.title}>
                                    <Skeleton variant="text" lines={1} />
                                </div>
                                <div className={styles.category}>
                                    <Skeleton variant="text" lines={1} width="60%" />
                                </div>
                            </div>
                            <div className={styles.quickActions}>
                                <Skeleton variant="text" lines={1} width="80px" />
                            </div>
                        </div>
                    ))
                ) : (
                    // Show actual projects when loaded
                    projects.map((project) => (
                    <div key={project.slug} className={`${styles.projectCard} ${styles.textOnly}`} ref={addToRefs}>
                        <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                            <div className={styles.projectDetails}>
                                <div className={styles.title}>
                                    <h3>{project.title}</h3>
                                </div>
                                <div className={styles.category}>
                                    {project.category.map((cat, idx) => (
                                        <h5 key={idx}>{cat}</h5>
                                    ))}
                                </div>
                            </div>
                        </Link>
                        <div className={styles.quickActions}>
                            <button className={styles.quickView} onClick={() => openModal(project.slug)}>Quick View</button>
                        </div>
                        <ProjectModal
                            isOpen={openSlug === project.slug}
                            onClose={closeModal}
                            project={{
                                title: project.title,
                                category: project.category,
                                overview: project.overview,
                                live: project.live,
                                github: project.github,
                                slug: project.slug,
                            }}
                        />
                    </div>
                ))
                )}
            </div>
        </section>
    );
}
