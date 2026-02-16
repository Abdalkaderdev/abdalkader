import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/libs/gsap';

interface StaggeredRevealOptions {
    /** Delay between each element in seconds (default: 0.08) */
    stagger?: number;
    /** Animation duration in seconds (default: 0.8) */
    duration?: number;
    /** Distance to animate from in pixels (default: 40) */
    distance?: number;
    /** Direction of entrance (default: 'up') */
    direction?: 'up' | 'down' | 'left' | 'right';
    /** ScrollTrigger start position (default: 'top 85%') */
    start?: string;
    /** ScrollTrigger end position (default: 'bottom 20%') */
    end?: string;
    /** Reverse animation when scrolling back (default: true) */
    reverseOnLeave?: boolean;
    /** Initial delay before animation starts (default: 0) */
    delay?: number;
    /** Easing function (default: 'power3.out') */
    ease?: string;
    /** Include scale animation (default: true) */
    scale?: boolean;
    /** Starting scale value (default: 0.95) */
    scaleFrom?: number;
    /** Include opacity animation (default: true) */
    opacity?: boolean;
    /** Starting opacity value (default: 0) */
    opacityFrom?: number;
    /** Callback when animation starts */
    onStart?: () => void;
    /** Callback when animation completes */
    onComplete?: () => void;
}

interface UseStaggeredRevealReturn {
    /** Ref callback to add elements to the reveal group */
    addToRefs: (el: HTMLElement | null) => void;
    /** Clear all refs (useful for dynamic lists) */
    clearRefs: () => void;
    /** Manually trigger the reveal animation */
    triggerReveal: () => void;
    /** Manually reverse the reveal animation */
    reverseReveal: () => void;
}

/**
 * Custom hook for creating staggered reveal animations with ScrollTrigger.
 * Elements animate in sequence when they enter the viewport.
 *
 * @param options - Configuration options for the staggered reveal
 * @returns Object with ref callback and control functions
 */
export function useStaggeredReveal(
    options: StaggeredRevealOptions = {}
): UseStaggeredRevealReturn {
    const {
        stagger = 0.08,
        duration = 0.8,
        distance = 40,
        direction = 'up',
        start = 'top 85%',
        end = 'bottom 20%',
        reverseOnLeave = true,
        delay = 0,
        ease = 'power3.out',
        scale = true,
        scaleFrom = 0.95,
        opacity = true,
        opacityFrom = 0,
        onStart,
        onComplete,
    } = options;

    const elementsRef = useRef<HTMLElement[]>([]);
    const triggerRef = useRef<ScrollTrigger | null>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Calculate transform based on direction
    const getTransformValues = () => {
        switch (direction) {
            case 'up':
                return { y: distance, x: 0 };
            case 'down':
                return { y: -distance, x: 0 };
            case 'left':
                return { x: distance, y: 0 };
            case 'right':
                return { x: -distance, y: 0 };
            default:
                return { y: distance, x: 0 };
        }
    };

    // Add element to refs array
    const addToRefs = (el: HTMLElement | null) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    // Clear all refs
    const clearRefs = () => {
        elementsRef.current = [];
    };

    // Manually trigger reveal
    const triggerReveal = () => {
        if (timelineRef.current) {
            timelineRef.current.play();
        }
    };

    // Manually reverse reveal
    const reverseReveal = () => {
        if (timelineRef.current) {
            timelineRef.current.reverse();
        }
    };

    // Set up animations
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion || elementsRef.current.length === 0) {
            // Make elements visible immediately if reduced motion
            elementsRef.current.forEach((el) => {
                gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
            });
            return;
        }

        const transform = getTransformValues();

        // Set initial state
        const fromVars: gsap.TweenVars = {
            ...transform,
        };

        if (scale) {
            fromVars.scale = scaleFrom;
        }

        if (opacity) {
            fromVars.opacity = opacityFrom;
        }

        gsap.set(elementsRef.current, fromVars);

        // Create timeline for staggered animation
        const tl = gsap.timeline({
            paused: true,
            onStart,
            onComplete,
        });

        // Animate to final state
        const toVars: gsap.TweenVars = {
            y: 0,
            x: 0,
            duration,
            stagger,
            ease,
            delay,
        };

        if (scale) {
            toVars.scale = 1;
        }

        if (opacity) {
            toVars.opacity = 1;
        }

        tl.to(elementsRef.current, toVars);

        timelineRef.current = tl;

        // Set up ScrollTrigger
        if (elementsRef.current[0]) {
            triggerRef.current = ScrollTrigger.create({
                trigger: elementsRef.current[0].parentElement || elementsRef.current[0],
                start,
                end,
                toggleActions: reverseOnLeave
                    ? 'play reverse play reverse'
                    : 'play none none none',
                onEnter: () => tl.play(),
                onLeave: () => {
                    if (reverseOnLeave) tl.reverse();
                },
                onEnterBack: () => {
                    if (reverseOnLeave) tl.play();
                },
                onLeaveBack: () => {
                    if (reverseOnLeave) tl.reverse();
                },
            });
        }

        // Cleanup
        return () => {
            if (triggerRef.current) {
                triggerRef.current.kill();
            }
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [
        stagger,
        duration,
        distance,
        direction,
        start,
        end,
        reverseOnLeave,
        delay,
        ease,
        scale,
        scaleFrom,
        opacity,
        opacityFrom,
        onStart,
        onComplete,
    ]);

    return {
        addToRefs,
        clearRefs,
        triggerReveal,
        reverseReveal,
    };
}

export default useStaggeredReveal;
