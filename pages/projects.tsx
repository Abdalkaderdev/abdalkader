import BookCallSection from "@/components/HomePage/BookCallSection";
import ProjectHeroSection from "@/components/ProjectPage/ProjectHeroSection";
import ProjectsSection from "@/components/ProjectPage/ProjectsSection";
import Head from "next/head";

export default function ProjectPage() {

    return (
        <>
            <Head>
                <title>Projects | Abdalkader Alhamoud</title>
                <meta name="description" content="Explore the portfolio of projects by Abdalkader Alhamoud, featuring web development, AI engineering, and innovative digital solutions." />
            </Head>
            <ProjectHeroSection />
            <ProjectsSection />
            <BookCallSection />
        </>
    );
}