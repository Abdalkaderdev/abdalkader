import CoffeeSection from "@/components/CoffeeSection";
import EnhancedProjectHeroSection from "@/components/ProjectPage/EnhancedProjectHeroSection";
import ProjectShowcase from "@/components/ProjectPage/ProjectShowcase";
import { PageSEO, JsonLd, Breadcrumbs } from "@/components/SEO";
import { projectsItemListJsonLd } from "@/utils/jsonld";
import { projects } from '@/data/projectsData';

export default function ProjectPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects', current: true }
    ];

    // Prepare project data for ItemList schema
    const projectListItems = projects.map((project, index) => ({
        title: project.title,
        slug: project.slug,
        img: project.img,
        overview: project.overview,
        position: index + 1
    }));

    return (
        <>
            <PageSEO
                title="Projects & Portfolio | Abdalkader - Web & AI Solutions"
                description="Explore 12+ successful projects including AI-powered platforms, full-stack applications, and web solutions serving 50K+ users. View case studies and results."
                canonical="/projects"
                ogType="website"
                ogImage="/images/og-projects.jpg"
                ogImageAlt="Abdalkader's Portfolio - AI and Web Development Projects"
                keywords={[
                    'Portfolio',
                    'Projects',
                    'AI Solutions',
                    'Web Development',
                    'Full-Stack Applications',
                    'Machine Learning',
                    'React Projects',
                    'Next.js',
                    'Case Studies'
                ]}
            />
            <JsonLd data={projectsItemListJsonLd(projectListItems)} />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <EnhancedProjectHeroSection />
            <ProjectShowcase />
            <CoffeeSection />
        </>
    );
}