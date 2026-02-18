import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import useReducedMotion from './useReducedMotion';

interface MagneticOptions {
    /** Strength of the magnetic pull (default: 0.3) */
    strength?: number;
    /** Distance threshold for magnetic effect in pixels (default: 100) */
    threshold?: number;
    /** Duration of the return animation in seconds (default: 0.8) */
    returnDuration?: number;
}

interface MagneticHandlers {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
}

/**
 * Custom hook that creates a magnetic hover effect on elements.
 * The element will slightly move toward the cursor position on hover.
 * Respects prefers-reduced-motion for accessibility.
 *
 * @param ref - React ref to the element that should have the magnetic effect
 * @param options - Configuration options for the magnetic effect
 * @returns Event handlers to attach to the magnetic element
 */
export function useMagneticEffect<T extends HTMLElement>(
    ref: React.RefObject<T>,
    options: MagneticOptions = {}
): MagneticHandlers {
    const {
        strength = 0.3,
        threshold = 100,
        returnDuration = 0.8
    } = options;

    const prefersReducedMotion = useReducedMotion();
    const animationRef = useRef<gsap.core.Tween | null>(null);

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!ref.current || prefersReducedMotion) return;

        const element = ref.current;
        const rect = element.getBoundingClientRect();

        // Calculate center of element
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from cursor to center
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Only apply effect if cursor is within threshold
        if (distance < threshold) {
            // Kill any existing animation
            if (animationRef.current) {
                animationRef.current.kill();
            }

            // Calculate magnetic pull (stronger when closer to edge)
            const moveX = deltaX * strength;
            const moveY = deltaY * strength;

            animationRef.current = gsap.to(element, {
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    }, [ref, strength, threshold, prefersReducedMotion]);

    const onMouseLeave = useCallback(() => {
        if (!ref.current || prefersReducedMotion) return;

        // Kill any existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        // Animate back to original position with the portfolio's signature easing
        animationRef.current = gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: returnDuration,
            ease: 'power4.out', // Matches the cubic-bezier(0.19, 1, 0.22, 1) from variables.scss
        });
    }, [ref, returnDuration, prefersReducedMotion]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, []);

    return { onMouseMove, onMouseLeave };
}

export default useMagneticEffect;
