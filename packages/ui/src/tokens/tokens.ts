export interface FluidToken {
  min: string;
  max: string;
  minVw?: string;
  maxVw?: string;
}

export interface TokenSet {
  colors: Record<string, string>;
  fluid: Record<string, FluidToken>;
  static: Record<string, string>;
  /**
   * Deprecated names kept alive as `--old: var(--new)` so existing call sites
   * keep resolving. The fluid tokens made the -md/-sm breakpoint variants
   * redundant, but rewriting every call site would risk changing values for no
   * benefit. Retire these in Phase C by migrating their call sites.
   */
  aliases: Record<string, string>;
  reducedMotion: Record<string, string>;
  highContrast: Record<string, string>;
}

/**
 * The single source of truth for every design value.
 * tokens.css and _tokens.scss are generated from this file — never hand-edit them.
 * Values marked "live" were measured from the previously-rendered bundle and must
 * not change in Phase A; consolidation is visually neutral by design.
 */
export const tokens: TokenSet = {
  colors: {
    // live
    'color-primary': '#f44e00',
    'color-primary-light': '#fa7300',
    'color-white': '#f8f8f8',
    'color-black': '#000',
    'color-text-dark': '#131313',
    'color-text-grey': '#787878',
    'color-text-light': '#a8a8a8',
    'color-navigation': '#2d2d2d59',
    'color-border': 'rgb(37, 37, 37)',
    'color-bg-primary': '#000',
    'color-bg-secondary': '#0a0a0a',
    'color-text-primary': '#f8f8f8',
    'color-text-secondary': '#787878',
    'color-accent': '#f44e00',
    // faith/spiritual accents, from apps/portfolio/styles/variables.scss
    'color-gold': '#d4af37',
    'color-soft-gold': '#f5f5dc',
    'color-holy-white': '#fafafa',
  },

  fluid: {
    // typography — ceiling is today's desktop value, floor is today's 600px value
    'fs-hero': { min: '2.5rem', max: '4.5rem' }, // was font-4_5
    'fs-h2': { min: '1.8rem', max: '2.75rem' }, // was font-2_75
    'fs-h3': { min: '1.2rem', max: '1.8rem' }, // was font-1_8
    'fs-body': { min: '0.8rem', max: '1rem' }, // was font-1
    'fs-micro': { min: '0.65rem', max: '0.7rem' }, // was font0_7 (fixed before)
    // spacing — was mT4..mT1
    'space-4': { min: '3rem', max: '8rem' },
    'space-3': { min: '2rem', max: '3rem' },
    'space-2': { min: '1rem', max: '2rem' },
    'space-1': { min: '0.8rem', max: '1rem' },
    // layout
    'pad-section': { min: '1rem', max: '2rem' }, // was section/paddingAround
    'section-gap': { min: '6rem', max: '10rem' },
    // spotlight radius (Task 9)
    'spot-r': { min: '10rem', max: '26rem' },
  },

  static: {
    // typography
    'font-primary': "'PPNeueMontreal-Regular', sans-serif",
    'font-secondary': "'PPNeueMontreal-Medium', sans-serif",
    'font-pp-regular': "'PPNeueMontreal-Regular'",
    'font-pp-medium': "'PPNeueMontreal-Medium'",
    'line-height-tight': '0.9',
    'line-height-normal': '1',
    'line-height-relaxed': '1.2',
    // motion
    'transition-smooth': '0.8s cubic-bezier(0.19, 1, 0.22, 1)',
    'transition-fast': '0.3s ease-in-out',
    'transition-focus': '0.2s ease',
    'easing-smooth': 'cubic-bezier(0.19, 1, 0.22, 1)',
    'duration-slow': '0.8s',
    'duration-fast': '0.3s',
    'duration-focus': '0.2s',
    'stagger-delay': '0.003s',
    // non-fluid spacing steps retained for existing consumers
    'space-xs': '0.8rem',
    'space-sm': '1rem',
    'space-md': '1.5rem',
    'space-lg': '2rem',
    'space-xl': '3rem',
    'space-2xl': '5rem',
    'space-3xl': '6rem',
    'space-4xl': '8rem',
    'space-5xl': '10rem',
    // layout — live values
    'container-max-width': '1200px',
    'border-radius': '12px',
    'border-radius-sm': '6px',
    'breakpoint-sm': '600px',
    'breakpoint-md': '840px',
    'breakpoint-lg': '1080px',
    // z-index
    'z-dropdown': '1000',
    'z-sticky': '1020',
    'z-fixed': '1030',
    'z-modal-backdrop': '1040',
    'z-modal': '1050',
    'z-popover': '1060',
    'z-tooltip': '1070',
    'z-toast': '1080',
    'z-loading': '5000000',
    // effects
    'shadow-glow': '0 0 20px rgba(244, 78, 0, 0.3)',
    'shadow-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    'shadow-focus': '0 0 0 2px #f44e00',
    'backdrop-blur': 'blur(10px)',
    // live — consumed by portfolio-components.css and CrossAppNavigation.css
    'color-primary-gradient': 'linear-gradient(to bottom, #f44e00, #fa7300)',
  },

  aliases: {
    // The breakpoint variants collapse into their fluid equivalents.
    'text-hero': 'var(--fs-hero)',
    'text-hero-md': 'var(--fs-hero)',
    'text-hero-sm': 'var(--fs-hero)',
    'text-large': 'var(--fs-h2)',
    'text-large-md': 'var(--fs-h2)',
    'text-large-sm': 'var(--fs-h2)',
    'text-medium': 'var(--fs-h3)',
    'text-medium-md': 'var(--fs-h3)',
    'text-base': 'var(--fs-body)',
    'text-base-md': 'var(--fs-body)',
    'text-small': 'var(--fs-micro)',
    'section-padding': 'var(--pad-section)',
    'section-padding-sm': 'var(--pad-section)',
    'section-gap-md': 'var(--section-gap)',
    'section-gap-sm': 'var(--section-gap)',
  },

  // Harvested from the previously-dead designTokens.css. NEW behaviour in Phase A.
  reducedMotion: {
    'duration-slow': '0s',
    'duration-fast': '0s',
    'duration-focus': '0s',
    'transition-smooth': 'none',
    'transition-fast': 'none',
    'transition-focus': 'none',
    'stagger-delay': '0s',
  },

  // Harvested from the previously-dead designTokens.css. NEW behaviour in Phase A.
  highContrast: {
    'color-primary': '#ff6600',
    'color-primary-light': '#ff8800',
    'color-text-primary': '#ffffff',
    'color-text-secondary': '#cccccc',
    'color-border': '#666666',
  },
};
