import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '@/libs/gsap';
import useReducedMotion from './useReducedMotion';

interface TiltOptions {
    /** Maximum tilt angle in degrees (default: 15) */
    maxTilt?: number;
    /** Perspective value in pixels (default: 1000) */
    perspective?: number;
    /** Scale on hover (default: 1.02) */
    scale?: number;
    /** Enable glare effect (default: false) */
    glare?: boolean;
    /** Maximum glare opacity (default: 0.3) */
    maxGlare?: number;
    /** Duration of tilt animation in seconds (default: 0.3) */
    duration?: number;
    /** Duration of return animation in seconds (default: 0.6) */
    returnDuration?: number;
    /** Easing for tilt animation */
    ease?: string;
}

interface TiltHandlers {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
}

interface TiltState {
    isHovering: boolean;
    isTouchDevice: boolean;
}

/**
 * Custom hook that creates a 3D tilt effect on elements.
 * The element tilts toward the cursor position on hover.
 * Respects prefers-reduced-motion for accessibility.
 * Automatically disables on touch devices.
 *
 * @param ref - React ref to the element that should have the tilt effect
 * @param options - Configuration options for the tilt effect
 * @returns Event handlers to attach to the tilt element, plus state info
 */
export function useTiltEffect<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    options: TiltOptions = {}
): TiltHandlers & { state: TiltState } {
    const {
        maxTilt = 15,
        perspective = 1000,
        scale = 1.02,
        glare = false,
        maxGlare = 0.3,
        duration = 0.3,
        returnDuration = 0.6,
        ease = 'power2.out',
    } = options;

    const prefersReducedMotion = useReducedMotion();
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const animationRef = useRef<gsap.core.Tween | null>(null);
    const glareRef = useRef<HTMLElement | null>(null);

    // Check for touch device
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkTouch = () => {
            setIsTouchDevice(
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0
            );
        };
        checkTouch();
    }, []);

    // Create glare element if enabled
    useEffect(() => {
        if (!glare || !ref.current || typeof document === 'undefined') return;

        const glareEl = document.createElement('div');
        glareEl.className = 'tilt-glare';
        glareEl.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, ${maxGlare}) 0%,
                transparent 60%
            );
            z-index: 10;
            border-radius: inherit;
            transition: opacity 0.3s ease;
        `;

        ref.current.style.position = 'relative';
        ref.current.appendChild(glareEl);
        glareRef.current = glareEl;

        return () => {
            if (glareRef.current && ref.current) {
                ref.current.removeChild(glareRef.current);
            }
        };
    }, [glare, maxGlare, ref]);

    const onMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!ref.current || prefersReducedMotion || isTouchDevice) return;

        setIsHovering(true);

        // Set perspective on parent for 3D effect
        if (ref.current.parentElement) {
            ref.current.parentElement.style.perspective = `${perspective}px`;
        }

        // Kill any existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        // Scale up
        animationRef.current = gsap.to(ref.current, {
            scale,
            duration: duration,
            ease,
        });

        // Show glare
        if (glareRef.current) {
            gsap.to(glareRef.current, {
                opacity: 1,
                duration: 0.3,
            });
        }
    }, [ref, perspective, scale, duration, ease, prefersReducedMotion, isTouchDevice]);

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!ref.current || prefersReducedMotion || isTouchDevice) return;

        const element = ref.current;
        const rect = element.getBoundingClientRect();

        // Calculate cursor position relative to element center (0 to 1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Convert to tilt angles (-maxTilt to +maxTilt)
        // Tilt toward cursor: if cursor is on right, tilt right (negative rotateY)
        const tiltX = (0.5 - y) * maxTilt * 2; // rotateX (pitch)
        const tiltY = (x - 0.5) * maxTilt * 2; // rotateY (yaw)

        // Kill any existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        // Apply tilt with smooth animation
        animationRef.current = gsap.to(element, {
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d',
            duration: duration * 0.5,
            ease,
        });

        // Update glare position
        if (glareRef.current) {
            const glareX = x * 100;
            const glareY = y * 100;
            gsap.to(glareRef.current, {
                background: `radial-gradient(
                    circle at ${glareX}% ${glareY}%,
                    rgba(255, 255, 255, ${maxGlare}) 0%,
                    transparent 60%
                )`,
                duration: 0.2,
            });
        }
    }, [ref, maxTilt, duration, ease, maxGlare, prefersReducedMotion, isTouchDevice]);

    const onMouseLeave = useCallback(() => {
        if (!ref.current || prefersReducedMotion || isTouchDevice) return;

        setIsHovering(false);

        // Kill any existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        // Animate back to original position with elastic ease
        animationRef.current = gsap.to(ref.current, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: returnDuration,
            ease: 'elastic.out(1, 0.5)',
        });

        // Hide glare
        if (glareRef.current) {
            gsap.to(glareRef.current, {
                opacity: 0,
                duration: 0.3,
            });
        }
    }, [ref, returnDuration, prefersReducedMotion, isTouchDevice]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, []);

    return {
        onMouseMove,
        onMouseEnter,
        onMouseLeave,
        state: {
            isHovering,
            isTouchDevice,
        },
    };
}

export default useTiltEffect;
