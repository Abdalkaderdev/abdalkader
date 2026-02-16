import AboutSection from "@/components/HomePage/AboutSection";
import CoffeeSection from "@/components/CoffeeSection";
import InstagramSection from "@/components/HomePage/DribbleSection";
import HeroSection from "@/components/HomePage/HeroSection";
import ProjectSection from "@/components/HomePage/ProjectSection";
import ServiceSection from "@/components/HomePage/ServiceSection";
import Marquee, { marqueeStyles } from "@/components/Marquee";
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

            {/* Marquee Banner */}
            <div style={{ padding: '3rem 0', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Marquee speed="slow" direction="left">
                    <span className={marqueeStyles.text}>AVAILABLE FOR PROJECTS</span>
                    <span className={marqueeStyles.text}>OPEN TO COLLABORATE</span>
                    <span className={marqueeStyles.text}>LET&apos;S CREATE TOGETHER</span>
                </Marquee>
            </div>

            <ProjectSection />
            <ServiceSection />
            <InstagramSection />
            <CoffeeSection />
        </>
    );
}
