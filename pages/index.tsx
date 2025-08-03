import AboutSection from "@/components/HomePage/AboutSection";
import BookCallSection from "@/components/HomePage/BookCallSection";
import InstagramSection from "@/components/HomePage/DribbleSection";
import HeroSection from "@/components/HomePage/HeroSection";
import ProjectSection from "@/components/HomePage/ProjectSection";
import ServiceSection from "@/components/HomePage/ServiceSection";
import Head from "next/head";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Abdalkader Alhamoud | Web Developer & AI Engineer</title>
                <meta name="description" content="Portfolio of Abdalkader Alhamoud, a Web Developer and AI Engineer specializing in building modern, user-focused digital experiences." />
            </Head>
            <HeroSection />
            <AboutSection />
            <ProjectSection />
            <ServiceSection />
                            <InstagramSection />
            <BookCallSection />
        </>
    );
}
