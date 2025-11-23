import AboutSection from "@/components/HomePage/AboutSection";
import BookCallSection from "@/components/HomePage/BookCallSection";
import InstagramSection from "@/components/HomePage/DribbleSection";
import HeroSection from "@/components/HomePage/HeroSection";
import ProjectSection from "@/components/HomePage/ProjectSection";
import ServiceSection from "@/components/HomePage/ServiceSection";
import EnhancedSkillsSection from "@/components/HomePage/EnhancedSkillsSection";
// LiveDemos removed per text-only preference
import Head from "next/head";
import { buildCanonical } from "@/utils/seo";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Abdalkader - AI/ML & Full-Stack Web Developer | Python, React, TensorFlow</title>
                <meta name="description" content="Specializing in AI-powered web solutions. I build machine learning models, full-stack applications, and high-converting e-commerce stores. Explore my portfolio and interactive AI lab." />
                <link rel="canonical" href={buildCanonical('/')} />
            </Head>
            <HeroSection />
            <AboutSection />
            <EnhancedSkillsSection />
            <ProjectSection />
            <ServiceSection />
                            <InstagramSection />
            <BookCallSection />
        </>
    );
}
