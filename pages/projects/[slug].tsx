import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { projects } from '@/data/projectsData'; // Import the data from the new file
import styles from './ProjectPage.module.scss';
import Button from '@/components/Button';
import BookCallSection from '@/components/HomePage/BookCallSection';
import Head from 'next/head';
import { gsap } from '@/libs/gsap';
import { useEffect, useRef } from 'react';
import JsonLd from '@/components/SEO/JsonLd';
import { projectJsonLd, breadcrumbsJsonLd } from '@/utils/jsonld';
import { SITE_URL } from '@/utils/seo';

// Fetch the list of possible slugs for static generation
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = projects.map((project) => ({
        params: { slug: project.slug },
    }));

    return {
        paths,
        fallback: false, // Use 'blocking' if you want to handle undefined slugs dynamically
    };
};

// Fetch the project data based on the slug
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params!;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        return { notFound: true }; // Return 404 if project not found
    }

    return {
        props: { project },
    };
};

type ProjectPageProps = {
    project: {
        title: string;
        category: string[];
        img: string;
        owner: string;
        date: string;
        services: string;
        duration: string;
        budget: string;
        live: string;
        overview: string;
        objective: string;
        process: string;
        impact: string;
        slug: string;
    };
};

const ProjectPage = ({ project }: ProjectPageProps) => {
    const imageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        gsap.from(imageRef.current, {
            duration: 1.5,
            ease: "power3.out",
            scale: '1.4',
        });
    }, []);

    return (
        <>
            <Head>
                <title>{`${project?.title || 'Untitled Project'} | Abdalkader Alhamoud`}</title>
                <meta name="description" content={`${project?.overview?.substring(0, 160)}...`} />
                <meta property="og:title" content={`${project?.title || 'Untitled Project'} | Abdalkader Alhamoud`} />
                <meta property="og:description" content={`${project?.overview?.substring(0, 160)}...`} />
                <meta property="og:image" content={project?.img} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'CreativeWork',
                            name: project.title,
                            url: `https://abdalkader-alhamoud.vercel.app/projects/${project.slug}`,
                            image: project.img,
                            datePublished: project.date,
                            author: {
                                '@type': 'Person',
                                name: 'Abdalkader Alhamoud',
                                url: 'https://abdalkader-alhamoud.vercel.app/'
                            },
                            about: project.overview,
                            keywords: project.category.join(', ')
                        })
                    }}
                />
            </Head>
            <JsonLd data={[
                projectJsonLd(project),
                breadcrumbsJsonLd([
                    { name: 'Home', item: SITE_URL },
                    { name: 'Projects', item: `${SITE_URL}/projects` },
                    { name: project.title, item: `${SITE_URL}/projects/${project.title}` },
                ]),
            ]} />
            {/*========= Header ==========*/}
            <header className={styles.ProjectSinglePage}>
                <div ref={imageRef} className={styles.imageWrapper}>
                    <Image
                        src={project.img}
                        alt={project.title}
                        width={800}
                        height={500}
                        priority
                        placeholder="empty"
                    />
                </div>

                {/* Project Details */}
                <div className={styles.projectDetails}>
                    <h1>{project.title}</h1>
                    <div className={styles.category}>
                        {project.category.map((cat, idx) => (
                            <h5 key={idx}>{cat}</h5>
                        ))}
                    </div>
                </div>
            </header>

            {/*========= Content ==========*/}
            <section className={styles.projectContent}>
                {/* Sticky project details */}
                <div className={styles.sticky}>
                    <div className={styles.wrapper}>
                        <h2>Project Details</h2>
                        <div>
                            <h3>Owner</h3>
                            <h4>{project.owner}</h4>
                        </div>
                        <div>
                            <h3>Release Date</h3>
                            <h4>{project.date}</h4>
                        </div>
                        <div>
                            <h3>Services</h3>
                            <h4>{project.services}</h4>
                        </div>
                        <div>
                            <h3>Duration</h3>
                            <h4>{project.duration}</h4>
                        </div>
                        <div>
                            <h3>Budget</h3>
                            <h4>{project.budget}</h4>
                        </div>
                    </div>
                    <Button text="Launch Project" targetBlank={true} href={project.live} />
                </div>

                {/* Scroll project Content */}
                <div className={styles.scroll}>
                    <div>
                        <h2>Overview</h2>
                        <p>{project.overview}</p>
                    </div>
                    <div>
                        <h2>Objective</h2>
                        <p>{project.objective}</p>
                    </div>
                    <div>
                        <h2>Process</h2>
                        <p>{project.process}</p>
                    </div>
                    <div>
                        <h2>Impact</h2>
                        <p>{project.impact}</p>
                    </div>
                </div>
            </section>

            {/*========= Book Call Section ==========*/}
            <BookCallSection />
        </>
    );
};

export default ProjectPage;
