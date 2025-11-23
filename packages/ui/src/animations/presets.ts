/**
 * Animation Presets Library
 * Unified animation system for all apps
 * Senior Frontend Developer - Animation Specialist
 */

import { Variants } from 'framer-motion';

// ============================================
// EASING PRESETS
// ============================================
export const easing = {
  smooth: [0.19, 1, 0.22, 1],
  easeOut: [0.23, 1, 0.32, 1],
  easeInOut: [0.645, 0.045, 0.355, 1],
  easeIn: [0.55, 0.055, 0.675, 0.19],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
} as const;

// ============================================
// DURATION PRESETS
// ============================================
export const duration = {
  instant: 0.1,
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  verySlow: 1.2,
} as const;

// ============================================
// ENTRANCE ANIMATIONS
// ============================================
export const entranceAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  zoomIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: duration.slow, ease: easing.bounce },
  } as Variants,

  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: duration.slow, ease: easing.smooth },
  } as Variants,

  blurIn: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,
} as const;

// ============================================
// EXIT ANIMATIONS
// ============================================
export const exitAnimations = {
  fadeOut: {
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.fast, ease: easing.smooth },
  } as Variants,

  slideOutUp: {
    initial: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: { duration: duration.fast, ease: easing.smooth },
  } as Variants,

  slideOutDown: {
    initial: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: duration.fast, ease: easing.smooth },
  } as Variants,

  slideOutLeft: {
    initial: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: duration.fast, ease: easing.smooth },
  } as Variants,

  slideOutRight: {
    initial: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: duration.fast, ease: easing.smooth },
  } as Variants,

  scaleOut: {
    initial: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: duration.fast, ease: easing.smooth },
  } as Variants,
} as const;

// ============================================
// HOVER ANIMATIONS
// ============================================
export const hoverAnimations = {
  scale: {
    whileHover: { scale: 1.05 },
    transition: { duration: duration.fast },
  },

  lift: {
    whileHover: { y: -5 },
    transition: { duration: duration.fast },
  },

  glow: {
    whileHover: { boxShadow: '0 8px 24px rgba(244, 78, 0, 0.3)' },
    transition: { duration: duration.fast },
  },

  rotate: {
    whileHover: { rotate: 5 },
    transition: { duration: duration.fast },
  },

  brightness: {
    whileHover: { filter: 'brightness(1.1)' },
    transition: { duration: duration.fast },
  },

  combined: {
    whileHover: { scale: 1.05, y: -5 },
    transition: { duration: duration.fast },
  },
} as const;

// ============================================
// TAP/CLICK ANIMATIONS
// ============================================
export const tapAnimations = {
  scale: {
    whileTap: { scale: 0.95 },
  },

  press: {
    whileTap: { scale: 0.95, y: 2 },
  },

  ripple: {
    whileTap: { scale: 1.1 },
  },
} as const;

// ============================================
// STAGGER ANIMATIONS
// ============================================
export const staggerAnimations = {
  container: {
    initial: 'initial',
    animate: 'animate',
    variants: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
  } as Variants,

  item: {
    variants: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  } as Variants,

  fastContainer: {
    initial: 'initial',
    animate: 'animate',
    variants: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    },
  } as Variants,

  slowContainer: {
    initial: 'initial',
    animate: 'animate',
    variants: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.3,
        },
      },
    },
  } as Variants,
} as const;

// ============================================
// SCROLL ANIMATIONS
// ============================================
export const scrollAnimations = {
  revealUp: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
    viewport: { once: true, margin: '0px 0px -100px 0px' },
  } as Variants,

  revealDown: {
    initial: { opacity: 0, y: -50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
    viewport: { once: true, margin: '0px 0px -100px 0px' },
  } as Variants,

  revealLeft: {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
    viewport: { once: true, margin: '0px 0px -100px 0px' },
  } as Variants,

  revealRight: {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: duration.normal, ease: easing.smooth },
    viewport: { once: true, margin: '0px 0px -100px 0px' },
  } as Variants,

  scaleReveal: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: duration.normal, ease: easing.smooth },
    viewport: { once: true, margin: '0px 0px -100px 0px' },
  } as Variants,
} as const;

// ============================================
// CONTINUOUS ANIMATIONS
// ============================================
export const continuousAnimations = {
  float: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },

  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },

  rotate: {
    animate: { rotate: 360 },
    transition: { duration: 4, repeat: Infinity, ease: 'linear' },
  },

  shimmer: {
    animate: { backgroundPosition: ['0% 0%', '100% 0%'] },
    transition: { duration: 2, repeat: Infinity, ease: 'linear' },
  },

  bounce: {
    animate: { y: [0, -20, 0] },
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },

  swing: {
    animate: { rotate: [-5, 5, -5] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
} as const;

// ============================================
// PAGE TRANSITION ANIMATIONS
// ============================================
export const pageTransitions = {
  fadeSlideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  fadeSlideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  fadeScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,

  fadeRotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 },
    transition: { duration: duration.normal, ease: easing.smooth },
  } as Variants,
} as const;

// ============================================
// COMBINED ANIMATION SETS
// ============================================
export const animationSets = {
  button: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 },
    transition: { duration: duration.fast },
  },

  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -8, boxShadow: '0 12px 32px rgba(244, 78, 0, 0.15)' },
    transition: { duration: duration.normal },
  },

  input: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: duration.fast },
  },

  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { duration: duration.fast },
  },

  tooltip: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: duration.fast },
  },
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Combine multiple animation presets
 */
export const combineAnimations = (...animations: any[]) => {
  return animations.reduce((acc, anim) => ({ ...acc, ...anim }), {});
};

/**
 * Create custom stagger animation
 */
export const createStaggerAnimation = (
  staggerDelay: number = 0.1,
  initialDelay: number = 0
) => ({
  container: {
    initial: 'initial',
    animate: 'animate',
    variants: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: initialDelay,
        },
      },
    },
  },
  item: {
    variants: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },
});

/**
 * Create custom scroll reveal animation
 */
export const createScrollReveal = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 50
) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    whileInView: { opacity: 1, ...Object.keys(directions[direction]).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}) },
    transition: { duration: duration.normal, ease: easing.smooth },
    viewport: { once: true, margin: '0px 0px -100px 0px' },
  };
};
