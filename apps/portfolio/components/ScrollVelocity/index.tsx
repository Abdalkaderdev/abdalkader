'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/libs/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from './ScrollVelocity.module.scss';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollVelocityProps {
    children: string;
    baseVelocity?: number;
    className?: string;
}

// Text that moves based on scroll velocity - faster scroll = faster text
export default function ScrollVelocity({
    children,
    baseVelocity = 100,
    className = '',
}: ScrollVelocityProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const text = textRef.current;
        let xPercent = 0;
        let direction = -1;

        const animate = () => {
            xPercent += direction * 0.05;
            if (xPercent < -100) xPercent = 0;
            if (xPercent > 0) xPercent = -100;

            gsap.set(text, { xPercent: xPercent });
            requestAnimationFrame(animate);
        };

        // Change direction based on scroll
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                direction = self.direction === 1 ? -1 : 1;
                // Speed up based on scroll velocity
                const velocity = Math.abs(self.getVelocity()) / 1000;
                gsap.to({}, {
                    duration: 0.5,
                    onUpdate: () => {
                        xPercent += direction * velocity * 0.1;
                    },
                });
            },
        });

        animate();
    }, [baseVelocity]);

    // Repeat text multiple times for seamless loop
    const repeatedText = `${children} — `.repeat(10);

    return (
        <div ref={containerRef} className={`${styles.scrollVelocity} ${className}`}>
            <div ref={textRef} className={styles.text}>
                <span>{repeatedText}</span>
                <span>{repeatedText}</span>
            </div>
        </div>
    );
}
