'use client';

import { useRef, useEffect } from 'react';
import styles from './Marquee.module.scss';
import useReducedMotion from '@/hooks/useReducedMotion';

export type MarqueeDirection = 'left' | 'right';
export type MarqueeSpeed = 'slow' | 'normal' | 'fast';

interface MarqueeProps {
    children: React.ReactNode;
    /** Direction of scroll */
    direction?: MarqueeDirection;
    /** Speed preset */
    speed?: MarqueeSpeed;
    /** Pause on hover */
    pauseOnHover?: boolean;
    /** Custom duration in seconds */
    duration?: number;
    /** Number of duplicates for seamless loop */
    repeat?: number;
    /** Additional className */
    className?: string;
    /** Separator between items */
    separator?: React.ReactNode;
}

// Export style classes for external use
export const marqueeStyles = {
    text: styles.text,
    textLarge: styles.textLarge,
    textGradient: styles.textGradient,
};

export default function Marquee({
    children,
    direction = 'left',
    speed = 'normal',
    pauseOnHover = true,
    duration,
    repeat = 4,
    className = '',
    separator = <span className={styles.separator}>•</span>,
}: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Speed presets in seconds
    const speedDurations: Record<MarqueeSpeed, number> = {
        slow: 40,
        normal: 25,
        fast: 15,
    };

    const animationDuration = duration || speedDurations[speed];

    // Pause animation when reduced motion is preferred
    useEffect(() => {
        if (prefersReducedMotion && containerRef.current) {
            const track = containerRef.current.querySelector(`.${styles.track}`) as HTMLElement;
            if (track) {
                track.style.animationPlayState = 'paused';
            }
        }
    }, [prefersReducedMotion]);

    const marqueeClasses = [
        styles.marquee,
        styles[direction],
        pauseOnHover && styles.pauseOnHover,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div ref={containerRef} className={marqueeClasses}>
            <div
                className={styles.track}
                style={{ animationDuration: `${animationDuration}s` }}
            >
                {[...Array(repeat)].map((_, i) => (
                    <span key={i} className={styles.content}>
                        {children}
                        {separator}
                    </span>
                ))}
            </div>
        </div>
    );
}

export { Marquee };
