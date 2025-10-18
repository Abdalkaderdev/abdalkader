/**
 * Font loading utility for PP Neue Montreal fonts
 * Ensures consistent typography across all apps
 */

export const loadPortfolioFonts = () => {
  // Check if fonts are already loaded
  if (typeof document === 'undefined') return;

  const fontFaces = [
    {
      family: 'PPNeueMontreal-Regular',
      url: '/fonts/PPNeueMontreal-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      family: 'PPNeueMontreal-Medium',
      url: '/fonts/PPNeueMontreal-Medium.woff2',
      weight: '500',
      style: 'normal'
    }
  ];

  fontFaces.forEach(font => {
    // Check if font is already loaded
    if (document.fonts.check(`16px ${font.family}`)) return;

    const fontFace = new FontFace(
      font.family,
      `url(${font.url})`,
      {
        weight: font.weight,
        style: font.style,
        display: 'swap'
      }
    );

    fontFace.load().then(loadedFont => {
      document.fonts.add(loadedFont);
    }).catch(error => {
      console.warn(`Failed to load font ${font.family}:`, error);
    });
  });
};

export const getPortfolioFonts = () => ({
  primary: 'PPNeueMontreal-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  secondary: 'PPNeueMontreal-Medium, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
});

export const createFontCSS = () => `
@font-face {
  font-family: 'PPNeueMontreal-Regular';
  src: url('/fonts/PPNeueMontreal-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PPNeueMontreal-Medium';
  src: url('/fonts/PPNeueMontreal-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
`;