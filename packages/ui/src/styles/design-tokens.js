/**
 * Design Tokens - JavaScript Export
 * Extracted from Portfolio Design System
 * Use for GSAP animations, Framer Motion, and JavaScript styling
 */

export const colors = {
  brand: {
    primary: '#f44e00',
    primaryLight: '#fa7300',
    gradient: 'linear-gradient(to bottom, #f44e00, #fa7300)',
    gradientTop: 'linear-gradient(to top, #f44e00, #fa7300)',
  },
  neutral: {
    white: '#f8f8f8',
    black: '#000000',
    textDark: '#131313',
    textGrey: '#787878',
    navigation: 'rgba(45, 45, 45, 0.35)',
    border: 'rgb(37, 37, 37)',
  },
};

export const typography = {
  fonts: {
    primary: "'PPNeueMontreal-Regular', -apple-system, BlinkMacSystemFont, sans-serif",
    medium: "'PPNeueMontreal-Medium', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  sizes: {
    xs: '0.6rem',
    sm: '0.7rem',
    base: '0.9rem',
    md: '1rem',
    lg: '1.8rem',
    xl: '2.75rem',
    '2xl': '4.5rem',
  },
  responsive: {
    hero: {
      desktop: '4.5rem',
      tablet: '3.2rem',
      mobile: '2.5rem',
    },
    heading: {
      desktop: '2.75rem',
      tablet: '2.2rem',
      mobile: '1.8rem',
    },
    subheading: {
      desktop: '1.8rem',
      tablet: '1.2rem',
    },
  },
  weights: {
    light: 300,
    normal: 400,
    bold: 700,
  },
  lineHeights: {
    tight: 0.9,
    base: 1.6,
  },
  letterSpacing: {
    tight: '0.05rem',
    base: '0.08rem',
    wide: '0.1rem',
  },
};

export const spacing = {
  0: '0',
  xs: '0.7rem',
  sm: '0.8rem',
  1: '1rem',
  2: '2rem',
  3: '3rem',
  5: '5rem',
  6: '6rem',
  8: '8rem',
  10: '10rem',
  section: {
    desktop: '2rem',
    mobile: '1rem',
  },
  button: '1rem 2rem',
  nav: '1.4rem 2rem',
  gap: {
    desktop: '10rem',
    tablet: '8rem',
    mobile: '6rem',
  },
};

export const borderRadius = {
  sm: '6px',
  base: '8px',
  md: '12px',
  full: '100px',
};

export const shadows = {
  glow: '0px 0px 5px #f44e00',
  glowHover: '0px 0px 10px #f44e00',
  insetLight: 'inset 0px -20px 20px rgba(255, 255, 255, 0.2)',
  insetLightHover: 'inset 0px -30px 20px rgba(255, 255, 255, 0.2)',
  insetDark: 'inset 0px -15px 15px rgba(0, 0, 0, 0.2)',
  textGlow: '0 0 6px rgba(244, 78, 0, 0.6)',
};

export const transitions = {
  smooth: '0.8s cubic-bezier(0.19, 1, 0.22, 1)',
  base: '0.5s ease',
  fast: '0.3s ease-in-out',
  color: 'color 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
};

export const easings = {
  portfolio: 'cubic-bezier(0.19, 1, 0.22, 1)',
  // GSAP equivalents
  gsap: {
    smooth: [0.19, 1, 0.22, 1],
    power1: 'power1.inOut',
    power2: 'power2.inOut',
    power3: 'power3.inOut',
    power4: 'power4.inOut',
  },
};

export const breakpoints = {
  mobile: 600,
  tablet: 840,
  desktop: 1080,
  // Media query strings
  mq: {
    mobile: '@media (max-width: 600px)',
    tablet: '@media (max-width: 840px)',
    desktop: '@media (max-width: 1080px)',
  },
};

export const zIndex = {
  base: 0,
  menu: 10,
  nav: 20,
  transition: 1000,
  intro: 5000000,
};

export const animations = {
  // GSAP animation configs
  gsap: {
    fadeIn: {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out',
    },
    slideUp: {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    },
    stagger: {
      text: 0.003,
      cards: 0.1,
    },
    scrollTrigger: {
      start: '70% bottom',
      startAlt: '80% bottom',
      once: true,
    },
  },
  // Framer Motion variants
  framer: {
    slideIn: {
      initial: { scaleY: 0 },
      animate: { scaleY: 0 },
      exit: { scaleY: 1 },
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
    slideOut: {
      initial: { scaleY: 1 },
      animate: { scaleY: 0 },
      exit: { scaleY: 0 },
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
    },
  },
};

export const components = {
  button: {
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.1rem',
    textTransform: 'uppercase',
    boxShadow: 'inset 0px -20px 20px rgba(255, 255, 255, 0.2)',
    filter: 'drop-shadow(0px 0px 5px #f44e00)',
  },
  nav: {
    barWidth: '140px',
    barWidthHover: '160px',
    barHeight: '5px',
    padding: '1.4rem 2rem',
  },
  menu: {
    topOffset: '10px',
    borderRadius: '8px',
    backdropFilter: 'blur(50px)',
  },
};

// Helper function to get CSS variable
export const getCSSVar = (varName) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return null;
};

// Export all tokens as default
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  easings,
  breakpoints,
  zIndex,
  animations,
  components,
  getCSSVar,
};
