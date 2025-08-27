// /pages/project.tsx
import Link from 'next/link';
import styles from './ProjectsSection.module.scss';
import { projects } from '@/data/projectsData';

interface ProjectItem {
    title: string;
    slug: string;
    category: string[];
    badges?: string[];
}
import { useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';

export default function ProjectsSection() {
    const cardRefs = useRef<HTMLAnchorElement[]>([]);

    const addToRefs = (el: HTMLAnchorElement | null) => {
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
                {projects.map((project: ProjectItem) => {
                    const pills: string[] = Array.isArray(project.badges)
                        ? project.badges as string[]
                        : project.category;
                    return (
                    <Link key={project.slug} href={`/projects/${project.slug}`} className={styles.projectCard} ref={addToRefs}>
                        <div className={styles.projectTextThumb}>
                            <h3>{project.title}</h3>
                            <div className={styles.meta}>
                                {pills.map((p: string) => <span key={p}>{p}</span>)}
                            </div>
                        </div>
                    </Link>
                );})}
            </div>
        </section>
    );
}
