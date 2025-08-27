// /pages/project.tsx
import Link from 'next/link';
// Image import removed for text-only cards
import styles from './ProjectsSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/libs/gsap';
import ProjectModal from '@/components/ProjectModal';

export default function ProjectsSection() {
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const cardRefs = useRef<HTMLElement[]>([]);

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
                            <button className={styles.quickView} onClick={() => setOpenSlug(project.slug)}>Quick View</button>
                        </div>
                        <ProjectModal
                            isOpen={openSlug === project.slug}
                            onClose={() => setOpenSlug(null)}
                            title={project.title}
                            categories={project.category}
                            overview={project.overview}
                            live={project.live}
                            github={project.github}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
