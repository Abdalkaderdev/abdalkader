import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

export function useAnimations() {
  const reducedMotion = useReducedMotion();

  return {
    reducedMotion,
    // Animation variants that respect reduced motion
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: reducedMotion ? 0 : 0.5 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: reducedMotion ? 0 : 0.5 }
    },
    scale: {
      initial: { scale: 0.9 },
      animate: { scale: 1 },
      transition: { duration: reducedMotion ? 0 : 0.3 }
    }
  };
}