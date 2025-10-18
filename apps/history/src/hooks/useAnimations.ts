'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAP = (callback: (ctx: gsap.Context) => void, deps: any[] = []) => {
  const ctx = useRef<gsap.Context>();

  useEffect(() => {
    ctx.current = gsap.context(callback);
    return () => ctx.current?.revert();
  }, deps);
};

export const useScrollTrigger = () => {
  const useScrollTriggerAnimation = (
    trigger: string,
    animation: gsap.TweenVars,
    scrollTrigger: ScrollTrigger.Vars
  ) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!elementRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: elementRef.current,
          ...scrollTrigger,
        },
      });

      tl.to(elementRef.current, animation);

      return () => {
        tl.kill();
      };
    }, []);

    return elementRef;
  };

  return { useScrollTriggerAnimation };
};

export const usePortfolioAnimations = () => {
  // Portfolio-matching easing
  const portfolioEase = 'cubic-bezier(0.19, 1, 0.22, 1)';
  
  // Stagger animation for cards
  const staggerCards = (selector: string, delay: number = 0.1) => {
    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: portfolioEase,
        stagger: delay,
      }
    );
  };

  // Card hover animations
  const cardHoverIn = (element: HTMLElement) => {
    gsap.to(element, {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(244, 78, 0, 0.3)',
      duration: 0.3,
      ease: portfolioEase,
    });
  };

  const cardHoverOut = (element: HTMLElement) => {
    gsap.to(element, {
      y: 0,
      scale: 1,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: portfolioEase,
    });
  };

  // Language node animations
  const animateLanguageNode = (element: HTMLElement, delay: number = 0) => {
    gsap.fromTo(
      element,
      {
        scale: 0,
        opacity: 0,
        rotation: -180,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        delay,
        ease: 'back.out(1.7)',
      }
    );
  };

  // AI typing animation
  const typeText = (element: HTMLElement, text: string, speed: number = 50) => {
    let i = 0;
    element.textContent = '';
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        // Add cursor blink
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.className = 'animate-pulse text-orange-400';
        element.appendChild(cursor);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  };

  // Page transition animations
  const pageTransitionIn = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: portfolioEase,
      }
    );
  };

  const pageTransitionOut = (element: HTMLElement) => {
    return gsap.to(element, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: portfolioEase,
    });
  };

  // Micro-interactions
  const buttonPress = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });
  };

  const iconRotate = (element: HTMLElement) => {
    gsap.to(element, {
      rotation: 360,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });
  };

  return {
    staggerCards,
    cardHoverIn,
    cardHoverOut,
    animateLanguageNode,
    typeText,
    pageTransitionIn,
    pageTransitionOut,
    buttonPress,
    iconRotate,
  };
};

// Framer Motion utilities
export const useMotionAnimations = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(springY, [-300, 300], [30, -30]);
  const rotateY = useTransform(springX, [-300, 300], [-30, 30]);

  return {
    x,
    y,
    springX,
    springY,
    rotateX,
    rotateY,
  };
};

// Accessibility: Reduced motion support
export const useReducedMotion = () => {
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion.current;
};

// Performance optimization: RAF-based animations
export const useRAF = () => {
  const rafId = useRef<number>();

  const animate = (callback: () => void) => {
    const animate = () => {
      callback();
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
  };

  const stop = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return { animate, stop };
};