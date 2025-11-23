/**
 * Abdalkader Portfolio Design Tokens
 * 
 * This file contains all design tokens that define the visual language
 * of the Abdalkader portfolio. These tokens are used across all applications
 * to ensure consistency and maintainability.
 */

// ============================================
// COLOR TOKENS
// ============================================

export const colors = {
  // Primary brand colors
  primary: '#f44e00',
  secondary: '#fa7300',
  
  // Neutral colors
  background: '#000000',
  backgroundSecondary: '#0a0a0a',
  backgroundTertiary: '#1a1a1a',
  
  // Text colors
  text: '#f8f8f8',
  textSecondary: '#787878',
  textTertiary: '#131313',
  
  // UI colors
  border: '#252525',
  navigation: '#2d2d2d59',
  
  // Semantic colors
  success: '#00c896',
  warning: '#ffc107',
  error: '#ff4444',
  info: '#2196f3',
  
  // Gradient definitions
  gradients: {
    primary: 'linear-gradient(135deg, #f44e00 0%, #fa7300 100%)',
    background: 'linear-gradient(135deg, #000 0%, #0a0a0a 50%, #1a1a1a 100%)',
    text: 'linear-gradient(to bottom, #f44e00, #fa7300)',
  }
} as const;

// ============================================
// TYPOGRAPHY TOKENS
// ============================================

export const typography = {
  // Font families
  fonts: {
    primary: '"PP Neue Montreal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  // Font sizes using clamp for responsive behavior
  fontSizes: {
    display: 'clamp(3.2rem, 8vw, 6rem)',
    h1: 'clamp(2.2rem, 5vw, 4.5rem)',
    h2: 'clamp(1.2rem, 3vw, 1.8rem)',
    h3: 'clamp(1rem, 2.5vw, 1.25rem)',
    h4: 'clamp(0.875rem, 2vw, 1rem)',
    bodyLarge: 'clamp(1rem, 2.5vw, 1.2rem)',
    body: 'clamp(0.9rem, 2vw, 1rem)',
    bodySmall: 'clamp(0.8rem, 1.8vw, 0.9rem)',
    caption: 'clamp(0.7rem, 1.5vw, 0.8rem)',
    micro: 'clamp(0.625rem, 1.2vw, 0.7rem)'
  },
  
  // Font weights
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  
  // Line heights
  lineHeights: {
    tight: '0.9',
    normal: '1',
    relaxed: '1.4',
    loose: '1.6'
  },
  
  // Letter spacing
  letterSpacings: {
    tight: '0.025rem',
    normal: '0.05rem',
    wide: '0.08rem',
    wider: '0.1rem'
  },
  
  // Text transformations
  textTransform: {
    none: 'none',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize'
  }
} as const;

// ============================================
// SPACING TOKENS
// ============================================

export const spacing = {
  // Base unit is 8px (0.5rem)
  base: '0.5rem',
  
  // Spacing scale based on powers of 2
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
  '6xl': '12rem',  // 192px
  
  // Component-specific spacing
  componentPadding: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  
  // Layout spacing
  layout: {
    section: '8rem',
    sectionMobile: '4rem',
    container: '2rem',
    containerMobile: '1rem'
  }
} as const;

// ============================================
// BORDER RADIUS TOKENS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px'
} as const;

// ============================================
// SHADOW TOKENS
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(244, 78, 0, 0.3)',
  glowSecondary: '0 0 20px rgba(250, 115, 0, 0.3)'
} as const;

// ============================================
// ANIMATION TOKENS
// ============================================

export const animations = {
  // Durations
  durations: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.8s',
    slower: '1.2s'
  },
  
  // Easing functions
  easings: {
    ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Transitions
  transitions: {
    fast: 'all 0.15s cubic-bezier(0.19, 1, 0.22, 1)',
    normal: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
    slow: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
    colors: 'color 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
    transform: 'transform 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
    opacity: 'opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1)'
  }
} as const;

// ============================================
// BREAKPOINT TOKENS
// ============================================

export const breakpoints = {
  // Pixel values
  values: {
    xs: '0px',
    sm: '600px',
    md: '840px',
    lg: '1200px',
    xl: '1440px',
    '2xl': '1920px'
  },
  
  // Media queries
  mediaQueries: {
    xs: '@media (min-width: 0px)',
    sm: '@media (min-width: 600px)',
    md: '@media (min-width: 840px)',
    lg: '@media (min-width: 1200px)',
    xl: '@media (min-width: 1440px)',
    '2xl': '@media (min-width: 1920px)',
    
    // Max-width queries
    smDown: '@media (max-width: 599px)',
    mdDown: '@media (max-width: 839px)',
    lgDown: '@media (max-width: 1199px)',
    xlDown: '@media (max-width: 1439px)',
    
    // Range queries
    smOnly: '@media (min-width: 600px) and (max-width: 839px)',
    mdOnly: '@media (min-width: 840px) and (max-width: 1199px)',
    lgOnly: '@media (min-width: 1200px) and (max-width: 1439px)'
  }
} as const;

// ============================================
// Z-INDEX TOKENS
// ============================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
} as const;

// ============================================
// COMPONENT-SPECIFIC TOKENS
// ============================================

export const components = {
  // Button tokens
  button: {
    sizes: {
      xs: { padding: '0.25rem 0.5rem', fontSize: typography.fontSizes.micro },
      sm: { padding: '0.5rem 0.75rem', fontSize: typography.fontSizes.bodySmall },
      md: { padding: '0.75rem 1.25rem', fontSize: typography.fontSizes.body },
      lg: { padding: '1rem 1.5rem', fontSize: typography.fontSizes.bodyLarge },
      xl: { padding: '1.25rem 2rem', fontSize: typography.fontSizes.h4 }
    },
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeights.medium,
    textTransform: typography.textTransform.uppercase,
    letterSpacing: typography.letterSpacings.normal,
    transition: animations.transitions.normal
  },
  
  // Card tokens
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    background: colors.backgroundTertiary,
    border: `1px solid ${colors.border}`,
    transition: animations.transitions.normal,
    shadow: shadows.md
  },
  
  // Input tokens
  input: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    background: colors.backgroundTertiary,
    border: `1px solid ${colors.border}`,
    fontSize: typography.fontSizes.body,
    transition: animations.transitions.normal,
    focusBorder: colors.primary,
    errorBorder: colors.error
  },
  
  // Badge tokens
  badge: {
    padding: '0.25rem 0.5rem',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSizes.micro,
    fontWeight: typography.fontWeights.medium,
    textTransform: typography.textTransform.uppercase,
    letterSpacing: typography.letterSpacings.wide
  }
} as const;

// ============================================
// CSS CUSTOM PROPERTIES GENERATOR
// ============================================

export const generateCSSVariables = () => {
  return {
    // Color variables
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-background': colors.background,
    '--color-background-secondary': colors.backgroundSecondary,
    '--color-background-tertiary': colors.backgroundTertiary,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-border': colors.border,
    
    // Typography variables
    '--font-primary': typography.fonts.primary,
    '--font-mono': typography.fonts.mono,
    
    // Spacing variables
    '--spacing-xs': spacing.xs,
    '--spacing-sm': spacing.sm,
    '--spacing-md': spacing.md,
    '--spacing-lg': spacing.lg,
    '--spacing-xl': spacing.xl,
    '--spacing-2xl': spacing['2xl'],
    '--spacing-3xl': spacing['3xl'],
    
    // Border radius variables
    '--border-radius-sm': borderRadius.sm,
    '--border-radius-md': borderRadius.md,
    '--border-radius-lg': borderRadius.lg,
    '--border-radius-xl': borderRadius.xl,
    
    // Animation variables
    '--transition-normal': animations.transitions.normal,
    '--transition-fast': animations.transitions.fast,
    '--transition-slow': animations.transitions.slow,
  };
};

// ============================================
// UTILITY TYPES
// ============================================

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type FontSizeToken = keyof typeof typography.fontSizes;
export type FontWeightToken = keyof typeof typography.fontWeights;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type BreakpointToken = keyof typeof breakpoints.values;
export type ZIndexToken = keyof typeof zIndex;

// ============================================
// THEME CONFIGURATION
// ============================================

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components
} as const;

export type Theme = typeof theme;
