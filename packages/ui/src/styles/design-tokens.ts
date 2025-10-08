/**
 * Abdalkader Design System - TypeScript Tokens
 * EXACT values extracted from portfolio
 * Single source of truth for all subdomains
 */

export const designTokens = {
  colors: {
    primary: '#f44e00',
    primaryLight: '#fa7300',
    white: '#f8f8f8',
    black: '#000',
    textDark: '#131313',
    textGrey: '#787878',
    navigation: '#2d2d2d59',
    border: 'rgb(37, 37, 37)',
    gradient: 'linear-gradient(to bottom, #f44e00, #fa7300)',
  },
  
  typography: {
    fontPrimary: 'PPNeueMontreal-Regular',
    fontSecondary: 'PPNeueMontreal-Medium',
    
    // Font Variables for Next.js
    fontPpRegular: '--font-pp-regular',
    fontPpMedium: '--font-pp-medium',
    
    // Responsive Typography Scale
    hero: {
      desktop: '4.5rem',
      tablet: '3.2rem',
      mobile: '2.5rem',
    },
    large: {
      desktop: '2.75rem',
      tablet: '2.2rem',
      mobile: '1.8rem',
    },
    medium: {
      desktop: '1.8rem',
      tablet: '1.2rem',
      mobile: '1.2rem',
    },
    base: {
      desktop: '1rem',
      tablet: '0.8rem',
      mobile: '0.8rem',
    },
    small: '0.7rem',
    
    // Line Heights
    lineHeight: {
      tight: 0.9,
      normal: 1,
      relaxed: 1.2,
    },
    
    // Letter Spacing
    letterSpacing: {
      tight: '0.05rem',
      normal: '0.08rem',
      wide: '0.1rem',
    },
  },
  
  animations: {
    easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    duration: {
      slow: 0.8,
      fast: 0.3,
      focus: 0.2,
    },
    staggerDelay: 0.003,
    transition: '0.8s cubic-bezier(0.19, 1, 0.22, 1)',
  },
  
  spacing: {
    xs: '0.8rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '5rem',
    '3xl': '6rem',
    '4xl': '8rem',
    '5xl': '10rem',
    
    // Section Spacing
    sectionGap: {
      desktop: '10rem',
      tablet: '8rem',
      mobile: '6rem',
    },
    sectionPadding: {
      desktop: '2rem',
      mobile: '1rem',
    },
  },
  
  layout: {
    containerMaxWidth: '1200px',
    borderRadius: '12px',
    borderRadiusSm: '6px',
  },
  
  breakpoints: {
    mobile: '600px',
    tablet: '840px',
    desktop: '1080px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
    loading: 5000000,
  },
  
  shadows: {
    glow: '0 0 20px rgba(244, 78, 0, 0.3)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 2px #f44e00',
  },
  
  effects: {
    backdropBlur: 'blur(10px)',
  },
} as const;

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof designTokens.colors;
export type TypographyToken = keyof typeof designTokens.typography;
export type SpacingToken = keyof typeof designTokens.spacing;
export type AnimationToken = keyof typeof designTokens.animations;

// Utility functions for accessing design tokens
export const getColor = (color: ColorToken): string => designTokens.colors[color];
export const getSpacing = (spacing: SpacingToken): string | object => designTokens.spacing[spacing];
export const getAnimation = (animation: AnimationToken) => designTokens.animations[animation];

// Responsive utility functions
export const getResponsiveValue = (
  values: { desktop: string; tablet: string; mobile: string },
  breakpoint: 'desktop' | 'tablet' | 'mobile'
): string => values[breakpoint];

// CSS Variable helpers
export const getCSSVariable = (variable: string): string => `var(--${variable})`;

// Animation helpers
export const createStaggerDelay = (index: number): string => 
  `calc(${index} * ${designTokens.animations.staggerDelay}s)`;

export const getTransition = (property: string = 'all'): string => 
  `${property} ${designTokens.animations.transition}`;

// Typography helpers
export const getHeroFontSize = (breakpoint: 'desktop' | 'tablet' | 'mobile'): string => 
  designTokens.typography.hero[breakpoint];

export const getLargeFontSize = (breakpoint: 'desktop' | 'tablet' | 'mobile'): string => 
  designTokens.typography.large[breakpoint];

// Export default for easy importing
export default designTokens;