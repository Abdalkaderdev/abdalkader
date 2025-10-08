import BookCallSection from "@/components/HomePage/BookCallSection";
import ProjectHeroSection from "@/components/ProjectPage/ProjectHeroSection";
import ProjectsSection from "@/components/ProjectPage/ProjectsSection";
import Head from "next/head";
import { buildCanonical } from "@/utils/seo";

export default function ProjectPage() {

    return (
        <>
            <Head>
                <title>AI & Web Development Projects | End-to-End Solutions | Abdalkader.dev</title>
                <meta name="description" content="Discover AI-powered web applications, machine learning projects, and intelligent e-commerce solutions. From recommendation engines to computer vision applications." />
                <link rel="canonical" href={buildCanonical('/projects')} />
            </Head>
            <ProjectHeroSection />
            <ProjectsSection />
            <BookCallSection />
        </>
    );
}