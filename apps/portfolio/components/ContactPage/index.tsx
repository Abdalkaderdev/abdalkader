import { useEffect, useRef } from 'react';
import styles from './ContactPage.module.scss';
import { splitText } from '@/utils/textUtils';
import { gsap } from '@/libs/gsap';
import Link from 'next/link';
import { isReducedMotion } from '@/utils/motion';

export default function ContactSection() {
    const bannerHeadingRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const linksWrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isReducedMotion()) return; // Skip animations for reduced motion
        const tl = gsap.timeline({ paused: true });

        // Animate the banner heading
        if (bannerHeadingRef.current) {
            const headingSpans = bannerHeadingRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "105%", duration: 0.6, stagger: 0.1 }, 0.4);
        }

        // Animate the text before links
        if (textRef.current) {
            const textSpans = textRef.current.querySelectorAll('span span');
            tl.from(textSpans, { y: "115%", duration: 0.6, stagger: 0.001 }, 0.4);
        }

        // Animate links one by one using `fromTo` via wrapper ref
        if (linksWrapperRef.current) {
            const links = linksWrapperRef.current.querySelectorAll('a');
            if (links.length) {
                tl.fromTo(
                    links,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: "-.9" }
                );
            }
        }

        // Play the animation
        tl.play();

        // Cleanup function to kill the timeline
        return () => {
            tl.kill();
        };
    }, []); // Empty dependency array to run once

    return (
        <>
            <section className={styles.contact}>
                <h1 ref={bannerHeadingRef}>{splitText("Contact")}</h1>
            </section>

            <section className={styles.linkSection}>
                <p ref={textRef}>{splitText("Contact me on")}</p>
                <div className={styles.wrapper} ref={linksWrapperRef}>
                    <Link href="mailto:hello@abdalkader.dev" className={styles.emailLink}>Email</Link>
                    <Link href="https://github.com/abdalkaderdev" target="_blank" rel="noopener noreferrer">GitHub</Link>
                    <Link href="https://linkedin.com/in/abdalkaderdev" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
                    <Link href="https://www.instagram.com/abdalkader.dev" target="_blank" rel="noopener noreferrer">Instagram</Link>
                </div>
            </section>
        </>
    );
}