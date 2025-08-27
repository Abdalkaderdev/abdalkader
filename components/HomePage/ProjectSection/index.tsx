import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { gsap, ScrollTrigger } from '@/libs/gsap';
import { splitText } from '@/utils/textUtils';
import styles from './ProjectSection.module.scss';
// Image import removed for text-only cards
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
                        {splitText("A look into my latest projects")}
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
                        <ProjectModal
                            isOpen={openSlug === project.slug}
                            onClose={closeModal}
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