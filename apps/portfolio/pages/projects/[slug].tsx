import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { projects, Project } from '@/data/projectsData';
import styles from './ProjectPage.module.scss';
import Button from '@/components/Button';
import BookCallSection from '@/components/HomePage/BookCallSection';
import { ProjectLifecycle } from '@/components/ProjectPage/ProjectLifecycle';
import { ShareButtons } from '@/components/ProjectPage/ShareButtons';
import { gsap } from '@/libs/gsap';
import { useEffect, useRef } from 'react';
import { PageSEO, JsonLd, Breadcrumbs } from '@/components/SEO';
import { projectJsonLd, projectArticleJsonLd } from '@/utils/jsonld';
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
    project: Project;
};

// OG image mapping for projects with dedicated social images
const OG_IMAGE_MAP: Record<string, string> = {
    'soapbox-super-app': '/images/og-soapbox-super-app.png',
    'discipleone-platform': '/images/og-discipleone-platform.png',
    'via-discipleship-app': '/images/og-via-discipleship-app.png',
    'parsalink-ai-crm': '/images/og-parsalink-ai-crm.png',
    'apple-tv-clone': '/images/og-apple-tv-clone.png',
    'virtualview': '/images/og-virtualview.png',
    'jegr-jalal-company': '/images/og-jegr-jalal-company.png',
    'doner-qr-menu-magic': '/images/og-doner-qr-menu-magic.png',
};

const ProjectPage = ({ project }: ProjectPageProps) => {
    const imageRef = useRef<HTMLDivElement | null>(null);

    // Get OG image - use dedicated OG image if available, fallback to project image
    const ogImage = OG_IMAGE_MAP[project.slug] || project.img;

    // Breadcrumb items for navigation
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: project.title, href: `/projects/${project.slug}`, current: true }
    ];

    // Format date for datetime attribute (extract year or use ISO format)
    const formatDateForSchema = (dateStr: string): string => {
        // Try to extract year from formats like "2024 - Present", "Nov 15, 2024", etc.
        const yearMatch = dateStr.match(/\b(20\d{2})\b/);
        if (yearMatch) {
            return yearMatch[1];
        }
        return dateStr;
    };

    useEffect(() => {
        gsap.from(imageRef.current, {
            duration: 1.5,
            ease: "power3.out",
            scale: '1.4',
        });
    }, []);

    return (
        <>
            <PageSEO
                title={`${project.title} - Case Study | Abdalkader Alhamoud`}
                description={project.overview.substring(0, 155) + '...'}
                canonical={`/projects/${project.slug}`}
                ogType="article"
                ogImage={ogImage}
                ogImageAlt={`${project.title} - Project Screenshot`}
                publishedTime={formatDateForSchema(project.date)}
                keywords={[
                    ...project.category,
                    ...(project.badges || []),
                    'Case Study',
                    'Portfolio',
                    'Web Development'
                ]}
            />
            <JsonLd data={[
                projectJsonLd({ ...project, img: ogImage }),
                projectArticleJsonLd({
                    title: project.title,
                    slug: project.slug,
                    img: ogImage,
                    overview: project.overview,
                    date: project.date,
                    category: project.category,
                    badges: project.badges
                })
            ]} />

            {/* Visible Breadcrumbs Navigation */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            {/*========= Article Wrapper for Semantic HTML ==========*/}
            <article itemScope itemType="https://schema.org/Article">
                {/*========= Header ==========*/}
                <header className={styles.ProjectSinglePage}>
                    <div ref={imageRef} className={styles.imageWrapper}>
                        <Image
                            src={project.img}
                            alt={`${project.title} - Project showcase featuring ${project.category.join(', ')}`}
                            width={800}
                            height={500}
                            priority
                            fetchPriority="high"
                            placeholder="empty"
                            itemProp="image"
                        />
                    </div>

                    {/* Project Details */}
                    <div className={styles.projectDetails}>
                        <h1 itemProp="headline">{project.title}</h1>
                        <div className={styles.category}>
                            {project.category.map((cat, idx) => (
                                <span key={idx} itemProp="keywords">{cat}</span>
                            ))}
                        </div>
                    </div>
                </header>

                {/*========= Content ==========*/}
                <section className={styles.projectContent}>
                    {/* Sticky project details */}
                    <aside className={styles.sticky}>
                        <div className={styles.wrapper}>
                            <h2>Project Details</h2>
                            <dl>
                                <div>
                                    <dt><h3>Owner</h3></dt>
                                    <dd><span itemProp="provider">{project.owner}</span></dd>
                                </div>
                                <div>
                                    <dt><h3>Release Date</h3></dt>
                                    <dd>
                                        <time dateTime={formatDateForSchema(project.date)} itemProp="datePublished">
                                            {project.date}
                                        </time>
                                    </dd>
                                </div>
                                <div>
                                    <dt><h3>Services</h3></dt>
                                    <dd>{project.services}</dd>
                                </div>
                                <div>
                                    <dt><h3>Duration</h3></dt>
                                    <dd>{project.duration}</dd>
                                </div>
                                <div>
                                    <dt><h3>Budget</h3></dt>
                                    <dd>{project.budget}</dd>
                                </div>
                            </dl>
                        </div>
                        {project.live && (
                            <Button text="Launch Project" targetBlank={true} href={project.live} />
                        )}
                    </aside>

                    {/* Scroll project Content */}
                    <div className={styles.scroll} itemProp="articleBody">
                        <section>
                            <h2>Overview</h2>
                            <p itemProp="description">{project.overview}</p>
                        </section>
                        <section>
                            <h2>Objective</h2>
                            <p>{project.objective}</p>
                        </section>
                        <section>
                            <h2>Process</h2>
                            <p>{project.process}</p>
                        </section>
                        <section>
                            <h2>Technical Implementation</h2>
                            <p>Leveraged advanced machine learning algorithms and AI models to enhance user experience and system performance. Implemented intelligent recommendation systems using collaborative filtering and deep learning techniques. Utilized modern AI frameworks including TensorFlow.js for real-time inference and Python-based ML pipelines for model training and optimization.</p>
                        </section>
                        <section>
                            <h2>Impact</h2>
                            <p>{project.impact}</p>
                        </section>
                    </div>
                </section>

                {/* Hidden author info for schema */}
                <div itemProp="author" itemScope itemType="https://schema.org/Person" style={{ display: 'none' }}>
                    <meta itemProp="name" content="Abdalkader Alhamoud" />
                    <meta itemProp="url" content={SITE_URL} />
                </div>
            </article>

            {/*========= Project Lifecycle Integration ==========*/}
            <ProjectLifecycle projectSlug={project.slug} />

            {/*========= Share Buttons ==========*/}
            <ShareButtons
              projectTitle={project.title}
              projectSlug={project.slug}
              projectDescription={project.overview}
            />

            {/*========= Book Call Section ==========*/}
            <BookCallSection />

            {/*========= Contact Address for SEO ==========*/}
            <address style={{ display: 'none' }} itemScope itemType="https://schema.org/Person">
                <meta itemProp="name" content="Abdalkader Alhamoud" />
                <meta itemProp="email" content="hello@abdalkader.dev" />
                <meta itemProp="url" content={SITE_URL} />
            </address>
        </>
    );
};

export default ProjectPage;
