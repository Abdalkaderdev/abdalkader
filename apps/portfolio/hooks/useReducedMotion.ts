import { useState, useEffect } from 'react';

/**
 * Custom hook that detects and tracks the user's reduced motion preference.
 * This hook is SSR-safe and listens for changes to the preference.
 *
 * @returns {boolean} True if the user prefers reduced motion, false otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * // Conditionally render animations
 * if (!prefersReducedMotion) {
 *   // Run animations
 * }
 * ```
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

export default useReducedMotion;
