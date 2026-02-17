'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './TiltCard.module.scss';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    intensity?: number;
    scale?: number;
    glare?: boolean;
    perspective?: number;
}

export default function TiltCard({
    children,
    className = '',
    intensity = 15,
    scale = 1.02,
    glare = true,
    perspective = 1000,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const glareEl = glareRef.current;
        if (!card) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateX = (mouseY / (rect.height / 2)) * -intensity;
            const rotateY = (mouseX / (rect.width / 2)) * intensity;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: scale,
                duration: 0.3,
                ease: 'power2.out',
            });

            if (glareEl && glare) {
                const glareX = ((e.clientX - rect.left) / rect.width) * 100;
                const glareY = ((e.clientY - rect.top) / rect.height) * 100;
                gsap.to(glareEl, {
                    background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
                    opacity: 1,
                    duration: 0.3,
                });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)',
            });
            if (glareEl) {
                gsap.to(glareEl, { opacity: 0, duration: 0.3 });
            }
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [intensity, scale, glare]);

    return (
        <div
            ref={cardRef}
            className={`${styles.tiltCard} ${className}`}
            style={{ perspective: `${perspective}px` }}
        >
            {children}
            {glare && <div ref={glareRef} className={styles.glare} />}
        </div>
    );
}
