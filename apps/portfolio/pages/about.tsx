import AboutDetailsSection from "@/components/AboutPage/AboutDetailsSection";
import AboutHeroSection from "@/components/AboutPage/AboutHeroSection";
import BookCallSection from "@/components/HomePage/BookCallSection";
import EnhancedSkillsSection from "@/components/HomePage/EnhancedSkillsSection";
import { PageSEO, JsonLd, Breadcrumbs } from "@/components/SEO";
import { aboutPageJsonLd, personJsonLd } from "@/utils/jsonld";
import Head from "next/head";

export default function AboutPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about', current: true }
    ];

    return (
        <>
            <PageSEO
                title="About Abdalkader Alhamoud | 8+ Years in Tech, AI & Full-Stack Engineer"
                description="Abdalkader Alhamoud's path from telecom engineering to lead AI and full-stack engineer — 8+ years in technology, building software professionally since 2023."
                canonical="/about"
                ogType="profile"
                ogImage="/images/og-image.jpg"
                ogImageAlt="About Abdalkader Alhamoud - AI Engineer and Developer"
                keywords={[
                    'Abdalkader Alhamoud',
                    'Web Developer',
                    'AI Engineer',
                    'About',
                    'Experience',
                    'Skills',
                    'Portfolio',
                    'Full-Stack Developer'
                ]}
            />
            {/* Additional profile-specific OG tags */}
            <Head>
                <meta property="profile:first_name" content="Abdalkader" />
                <meta property="profile:last_name" content="Alhamoud" />
            </Head>
            <JsonLd data={[
                aboutPageJsonLd(),
                personJsonLd()
            ]} />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <AboutHeroSection />
            <AboutDetailsSection />
            <EnhancedSkillsSection />
            <BookCallSection />
        </>
    );
}