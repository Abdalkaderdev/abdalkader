'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './VideoBackground.module.scss';

export interface VideoBackgroundProps {
    /** Path to the video file */
    src: string;
    /** Opacity of the video (0-1, default: 0.3) */
    opacity?: number;
    /** Whether to apply a gradient overlay */
    overlay?: boolean;
    /** Overlay gradient direction */
    overlayDirection?: 'top' | 'bottom' | 'radial';
    /** Playback speed (default: 1) */
    playbackRate?: number;
    /** Additional CSS class name */
    className?: string;
    /** Poster image to show before video loads */
    poster?: string;
}

/**
 * VideoBackground - A performant looping video background component.
 *
 * Features:
 * - Lazy loads video for performance
 * - Loops seamlessly
 * - Configurable opacity and overlay
 * - Respects prefers-reduced-motion
 * - Pauses when not in viewport
 *
 * @example
 * ```tsx
 * <VideoBackground
 *   src="/videos/particle-bg.mp4"
 *   opacity={0.3}
 *   overlay
 *   overlayDirection="bottom"
 * />
 * ```
 */
export default function VideoBackground({
    src,
    opacity = 0.3,
    overlay = true,
    overlayDirection = 'bottom',
    playbackRate = 1,
    className = '',
    poster,
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Set playback rate
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // Intersection Observer - pause video when not in viewport
    useEffect(() => {
        if (!videoRef.current || prefersReducedMotion) return;

        const video = videoRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => {
                            // Autoplay might be blocked, that's okay
                        });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(video);

        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    const handleLoadedData = () => {
        setIsLoaded(true);
    };

    // Don't render video if user prefers reduced motion
    if (prefersReducedMotion) {
        return (
            <div
                className={`${styles.videoBackground} ${styles.reducedMotion} ${className}`}
                style={{ opacity }}
            />
        );
    }

    return (
        <div
            ref={containerRef}
            className={`${styles.videoBackground} ${className}`}
            style={{ opacity: isLoaded ? opacity : 0 }}
        >
            <video
                ref={videoRef}
                className={styles.video}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={poster}
                onLoadedData={handleLoadedData}
            >
                <source src={src} type="video/mp4" />
            </video>

            {overlay && (
                <div
                    className={`${styles.overlay} ${styles[`overlay-${overlayDirection}`]}`}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

export { VideoBackground };
