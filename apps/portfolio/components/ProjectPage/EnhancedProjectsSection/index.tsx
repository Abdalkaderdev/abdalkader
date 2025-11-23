import Link from 'next/link';
import Image from 'next/image';
import styles from './EnhancedProjectsSection.module.scss';
import { projects } from '@/data/projectsData';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { gsap } from '@/libs/gsap';
import ProjectModal from '@/components/ProjectModal';
import { Skeleton, Button, Card, Badge } from '@abdalkader/ui';
import { Filter, TrendingUp, Target, Zap } from 'lucide-react';

export default function EnhancedProjectsSection() {
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'All' | 'AI' | 'Web' | 'Full Stack'>('All');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const cardRefs = useRef<HTMLElement[]>([]);
    const router = useRouter();

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
    }, [isLoading, filteredProjects])

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

    const getThumbnailVariant = (variant: string) => {
        switch (variant) {
            case 'gradient':
                return styles.gradientThumbnail;
            case '3d':
                return styles.thumbnail3d;
            case 'minimal':
                return styles.minimalThumbnail;
            case 'data-viz':
                return styles.dataVizThumbnail;
            default:
                return styles.defaultThumbnail;
        }
    };

    const filterButtons = [
        { label: 'All', value: 'All' as const, icon: <Filter size={16} /> },
        { label: 'AI', value: 'AI' as const, icon: <Zap size={16} /> },
        { label: 'Web', value: 'Web' as const, icon: <Target size={16} /> },
        { label: 'Full Stack', value: 'Full Stack' as const, icon: <TrendingUp size={16} /> },
    ];

    return (
        <section className={styles.EnhancedProjectsSection}>
            <div className={styles.wrapper}>
                {/* Filter Section */}
                <div className={styles.filterSection}>
                    <h2>Filter by Technology</h2>
                    <div className={styles.filterButtons}>
                        {filterButtons.map((filter) => (
                            <Button
                                key={filter.value}
                                variant={activeFilter === filter.value ? 'primary' : 'ghost'}
                                onClick={() => setActiveFilter(filter.value)}
                                className={styles.filterButton}
                            >
                                {filter.icon}
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                    <div className={styles.resultsCount}>
                        Showing {filteredProjects.length} of {projects.length} projects
                    </div>
                </div>

                {/* Projects Grid */}
                <div className={styles.projectsGrid}>
                    {isLoading ? (
                        // Show skeleton loaders while loading
                        Array.from({ length: Math.min(6, filteredProjects.length) }).map((_, index) => (
                            <Card key={`skeleton-${index}`} className={styles.projectCard}>
                                <div className={`${styles.thumbnail} ${getThumbnailVariant('default')}`}>
                                    <Skeleton variant="rectangular" width="100%" height="200px" />
                                </div>
                                <div className={styles.projectDetails}>
                                    <div className={styles.title}>
                                        <Skeleton variant="text" lines={1} />
                                    </div>
                                    <div className={styles.category}>
                                        <Skeleton variant="text" lines={1} width="60%" />
                                    </div>
                                    <div className={styles.businessContext}>
                                        <Skeleton variant="text" lines={2} />
                                    </div>
                                </div>
                                <div className={styles.quickActions}>
                                    <Skeleton variant="text" lines={1} width="80px" />
                                </div>
                            </Card>
                        ))
                    ) : (
                        // Show actual projects when loaded
                        filteredProjects.map((project) => (
                            <Card key={project.slug} className={styles.projectCard} ref={addToRefs}>
                                <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                                    <div className={`${styles.thumbnail} ${getThumbnailVariant(project.thumbnailVariant)}`}>
                                        <Image 
                                            src={project.img} 
                                            alt={project.title}
                                            width={400}
                                            height={250}
                                            className={styles.thumbnailImage}
                                        />
                                        <div className={styles.thumbnailOverlay}>
                                            <div className={styles.technologyBadge}>
                                                {project.technologyFilter}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.projectDetails}>
                                        <div className={styles.title}>
                                            <h3>{project.title}</h3>
                                        </div>
                                        <div className={styles.category}>
                                            {project.category.map((cat, idx) => (
                                                <Badge key={idx} variant="secondary">{cat}</Badge>
                                            ))}
                                        </div>
                                        {/* Enhanced Business Context */}
                                        <div className={styles.businessContext}>
                                            <div className={styles.problemSolved}>
                                                <h4>Problem Solved</h4>
                                                <p>{project.problemSolved}</p>
                                            </div>
                                            <div className={styles.technicalChallenge}>
                                                <h4>Technical Challenge</h4>
                                                <p>{project.technicalChallenge}</p>
                                            </div>
                                            <div className={styles.resultsAchieved}>
                                                <h4>Results Achieved</h4>
                                                <div className={styles.metrics}>
                                                    {project.resultsAchieved.metrics.slice(0, 3).map((metric, idx) => (
                                                        <div key={idx} className={styles.metric}>
                                                            <span className={styles.metricValue}>{metric}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className={styles.businessImpact}>{project.resultsAchieved.businessImpact}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className={styles.quickActions}>
                                    <Button variant="ghost" onClick={() => openModal(project.slug)}>Quick View</Button>
                                </div>
                                <ProjectModal
                                    isOpen={openSlug === project.slug}
                                    onClose={closeModal}
                                    project={project}
                                />
                            </Card>
                        ))
                    )}
                </div>

                {/* No Results */}
                {filteredProjects.length === 0 && !isLoading && (
                    <div className={styles.noResults}>
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters to see more projects.</p>
                        <Button onClick={() => setActiveFilter('All')}>Show All Projects</Button>
                    </div>
                )}
            </div>
        </section>
    );
}
