import AboutSection from "@/components/HomePage/AboutSection";
import BookCallSection from "@/components/HomePage/BookCallSection";
import InstagramSection from "@/components/HomePage/DribbleSection";
import HeroSection from "@/components/HomePage/HeroSection";
import ProjectSection from "@/components/HomePage/ProjectSection";
import ServiceSection from "@/components/HomePage/ServiceSection";
// LiveDemos removed per text-only preference
import Head from "next/head";
import { buildCanonical } from "@/utils/seo";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Abdalkader - AI/ML & Full-Stack Developer | React, Python, TensorFlow.js</title>
                <meta name="description" content="Full-Stack Developer & AI Specialist. I build intelligent web applications, e-commerce stores, and interactive ML experiments. Explore my professional projects and AI lab." />
                <link rel="canonical" href={buildCanonical('/')} />
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
