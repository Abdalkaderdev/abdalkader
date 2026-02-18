import AboutSection from "@/components/HomePage/AboutSection";
import CoffeeSection from "@/components/CoffeeSection";
import InstagramSection from "@/components/HomePage/DribbleSection";
import HeroSection from "@/components/HomePage/HeroSection";
import ProjectSection from "@/components/HomePage/ProjectSection";
import ServiceSection from "@/components/HomePage/ServiceSection";
import TestimonialsSection from "@/components/HomePage/TestimonialsSection";
import Marquee, { marqueeStyles } from "@/components/Marquee";
// LiveDemos removed per text-only preference
import { PageSEO, JsonLd } from "@/components/SEO";
import {
    professionalServiceJsonLd,
    faqPageJsonLd,
    allServicesJsonLd,
    allReviewsJsonLd,
    aggregateRatingJsonLd
} from "@/utils/jsonld";

export default function HomePage() {

    return (
        <>
            <PageSEO
                title="Abdalkader Alhamoud | AI Engineer & Full-Stack Developer"
                description="Expert AI Engineer and Full-Stack Developer specializing in React, Next.js, Python, and ML. Transform your ideas into intelligent digital solutions."
                canonical="/"
                ogType="website"
                ogImage="/images/og-home.jpg"
                ogImageAlt="Abdalkader Alhamoud - AI Engineer and Full-Stack Developer Portfolio"
                keywords={[
                    'AI Engineer',
                    'Full-Stack Developer',
                    'React Developer',
                    'Next.js',
                    'Python',
                    'Machine Learning',
                    'Web Development',
                    'TensorFlow',
                    'LangChain',
                    'OpenAI'
                ]}
            />
            <JsonLd data={[
                professionalServiceJsonLd(),
                faqPageJsonLd(),
                ...allServicesJsonLd(),
                ...allReviewsJsonLd(),
                aggregateRatingJsonLd()
            ]} />
            <HeroSection />
            <AboutSection />

            {/* Marquee Banner */}
            <div style={{ padding: '3rem 0', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Marquee speed="slow" direction="left">
                    <span className={marqueeStyles.text}>AVAILABLE FOR PROJECTS &nbsp;•&nbsp; OPEN TO COLLABORATE &nbsp;•&nbsp; LET&apos;S CREATE TOGETHER</span>
                </Marquee>
            </div>

            <ProjectSection />
            <ServiceSection />
            <TestimonialsSection />
            <InstagramSection />
            <CoffeeSection />
        </>
    );
}
