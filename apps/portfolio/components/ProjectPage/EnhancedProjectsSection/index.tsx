import Link from 'next/link';
import Image from 'next/image';
import styles from './EnhancedProjectsSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/libs/gsap';
import { Grid, List } from 'lucide-react';

export default function EnhancedProjectsSection() {
    const [activeFilter, setActiveFilter] = useState<'All' | 'AI' | 'Web' | 'Full Stack'>('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const cardRefs = useRef<HTMLElement[]>([]);

    // Filter projects based on selected technology
    useEffect(() => {
        if (activeFilter === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(project => project.technologyFilter === activeFilter));
        }
    }, [activeFilter]);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    useEffect(() => {
        const cards = cardRefs.current;

        // Card entrance animation
        gsap.fromTo(cards,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2,
            }
        );

        return () => {
            gsap.killTweensOf(cards);
        };
    }, [filteredProjects]);

    const filterButtons = [
        { label: 'All', value: 'All' as const },
        { label: 'AI', value: 'AI' as const },
        { label: 'Web', value: 'Web' as const },
        { label: 'Full Stack', value: 'Full Stack' as const },
    ];

    return (
        <section className={styles.EnhancedProjectsSection}>
            <div className={styles.wrapper}>
                {/* Filter Section */}
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        {filterButtons.map((filter) => (
                            <button
                                key={filter.value}
                                className={`${styles.filterButton} ${activeFilter === filter.value ? styles.active : ''}`}
                                onClick={() => setActiveFilter(filter.value)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.filterMeta}>
                        <span className={styles.resultsCount}>
                            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                        </span>
                        {/* View Toggle */}
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid view"
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Grid/List */}
                <div className={`${styles.projectsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
                    {filteredProjects.map((project) => (
                        <article key={project.slug} className={styles.projectCard} ref={addToRefs}>
                            <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={project.img}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className={styles.projectImage}
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <span className={styles.projectCategory}>
                                        {project.category[0]}
                                    </span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {/* No Results */}
                {filteredProjects.length === 0 && (
                    <div className={styles.noResults}>
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters to see more projects.</p>
                        <button onClick={() => setActiveFilter('All')}>Show All Projects</button>
                    </div>
                )}
            </div>
        </section>
    );
}
