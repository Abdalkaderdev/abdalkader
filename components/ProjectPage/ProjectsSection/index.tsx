// /pages/project.tsx
import Link from 'next/link';
import styles from './ProjectsSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { gsap } from '@/libs/gsap';
import ProjectModal from '@/components/ProjectModal';

export default function ProjectsSection() {
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const cardRefs = useRef<HTMLElement[]>([]);
    const router = useRouter();

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    useEffect(() => {
        gsap.from(cardRefs.current, {
            opacity: 0,
            y: "10%", // Move cards from below
            duration: 1.2,
            stagger: 0.1, // Stagger animation for each card
            ease: "power3.out",
            delay: 1,
        });
    }, [])

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
                {projects.map((project) => (
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
                            title={project.title}
                            categories={project.category}
                            overview={project.overview}
                            live={project.live}
                            github={project.github}
                            slug={project.slug}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
