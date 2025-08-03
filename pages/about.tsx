import AboutDetailsSection from "@/components/AboutPage/AboutDetailsSection";
import AboutHeroSection from "@/components/AboutPage/AboutHeroSection";
import AwardSection from "@/components/HomePage/AwardSection";
import BookCallSection from "@/components/HomePage/BookCallSection";
import Head from "next/head";

export default function AboutPage() {

    return (
        <>
            <Head>
                <title>About | Abdalkader Alhamoud</title>
                <meta name="description" content="Learn more about Abdalkader Alhamoud, a Web Developer and AI Engineer passionate about creating innovative digital solutions." />
            </Head>
            <AboutHeroSection />
            <AboutDetailsSection />
            <AwardSection />
            <BookCallSection />
        </>
    );
}