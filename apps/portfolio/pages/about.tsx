import AboutDetailsSection from "@/components/AboutPage/AboutDetailsSection";
import AboutHeroSection from "@/components/AboutPage/AboutHeroSection";
import BookCallSection from "@/components/HomePage/BookCallSection";
import Head from "next/head";
import { buildCanonical } from "@/utils/seo";

export default function AboutPage() {

    return (
        <>
            <Head>
                <title>About | Abdalkader Alhamoud</title>
                <meta name="description" content="Learn more about Abdalkader Alhamoud, a Web Developer and AI Engineer passionate about creating innovative digital solutions." />
                <link rel="canonical" href={buildCanonical('/about')} />
            </Head>
            <AboutHeroSection />
            <AboutDetailsSection />
            <BookCallSection />
        </>
    );
}