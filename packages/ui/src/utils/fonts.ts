/**
 * Portfolio Font Loading Utility
 * Ensures PPNeueMontreal fonts load consistently across all subdomains
 */

export const portfolioFonts = {
  // Font URLs - these should be served from each app's public/fonts directory
  urls: {
    regular: '/fonts/PPNeueMontreal-Regular.woff2',
    medium: '/fonts/PPNeueMontreal-Medium.woff2',
  },
  
  // Font families
  families: {
    regular: 'PPNeueMontreal-Regular',
    medium: 'PPNeueMontreal-Medium',
  },
  
  // CSS Variables
  cssVariables: {
    regular: '--font-pp-regular',
    medium: '--font-pp-medium',
  },
};

/**
 * Generate @font-face declarations for portfolio fonts
 */
export const generateFontFaces = () => `
@font-face {
  font-family: '${portfolioFonts.families.regular}';
  src: url('${portfolioFonts.urls.regular}') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: '${portfolioFonts.families.medium}';
  src: url('${portfolioFonts.urls.medium}') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
`;

/**
 * Generate Next.js font configuration
 */
export const generateNextFontConfig = () => `
import localFont from 'next/font/local';

export const ppRegular = localFont({
  src: [
    { path: '../public/fonts/PPNeueMontreal-Regular.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-pp-regular',
  display: 'swap',
  preload: true,
});

export const ppMedium = localFont({
  src: [
    { path: '../public/fonts/PPNeueMontreal-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-pp-medium',
  display: 'swap',
  preload: true,
});
`;

/**
 * Generate HTML link tags for font preloading
 */
export const generateFontPreloadLinks = () => `
<link
  rel="preload"
  href="/fonts/PPNeueMontreal-Regular.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
<link
  rel="preload"
  href="/fonts/PPNeueMontreal-Medium.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
`;

/**
 * Font loading status checker
 */
export class FontLoader {
  private static instance: FontLoader;
  private loadedFonts = new Set<string>();

  static getInstance(): FontLoader {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader();
    }
    return FontLoader.instance;
  }

  async loadFont(fontFamily: string): Promise<boolean> {
    try {
      await document.fonts.load(`1em "${fontFamily}"`);
      this.loadedFonts.add(fontFamily);
      return true;
    } catch (error) {
      console.warn(`Failed to load font: ${fontFamily}`, error);
      return false;
    }
  }

  async loadPortfolioFonts(): Promise<void> {
    const fonts = Object.values(portfolioFonts.families);
    const loadPromises = fonts.map(font => this.loadFont(font));
    await Promise.all(loadPromises);
  }

  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  arePortfolioFontsLoaded(): boolean {
    return Object.values(portfolioFonts.families).every(font => 
      this.isFontLoaded(font)
    );
  }

  // Wait for fonts to be loaded
  async waitForFonts(): Promise<void> {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    } else {
      // Fallback for browsers without document.fonts.ready
      await this.loadPortfolioFonts();
    }
  }
}

// Export singleton instance
export const fontLoader = FontLoader.getInstance();

// Utility function to check if fonts are available
export const checkFontAvailability = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('span');
  testElement.style.fontFamily = portfolioFonts.families.regular;
  testElement.style.visibility = 'hidden';
  testElement.textContent = 'Test';
  document.body.appendChild(testElement);
  
  const computedStyle = window.getComputedStyle(testElement);
  const isLoaded = computedStyle.fontFamily.includes(portfolioFonts.families.regular);
  
  document.body.removeChild(testElement);
  return isLoaded;
};

export default portfolioFonts;