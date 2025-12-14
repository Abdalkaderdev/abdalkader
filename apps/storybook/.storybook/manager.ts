import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

/**
 * Portfolio Theme for Storybook Manager (Sidebar & Toolbar)
 * Matches the portfolio color system exactly
 */
const portfolioTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Abdalkader UI',
  brandUrl: 'https://abdalkader.com',
  brandImage: undefined,
  brandTarget: '_self',

  // Colors - EXACT portfolio values
  colorPrimary: '#f44e00',
  colorSecondary: '#fa7300',

  // UI
  appBg: '#000',
  appContentBg: '#000',
  appBorderColor: 'rgb(37, 37, 37)',
  appBorderRadius: 6,

  // Text colors
  textColor: '#f8f8f8',
  textInverseColor: '#000',
  textMutedColor: '#787878',

  // Toolbar default and active colors
  barTextColor: '#f8f8f8',
  barSelectedColor: '#f44e00',
  barBg: 'rgba(45, 45, 45, 0.35)',

  // Form colors
  inputBg: 'transparent',
  inputBorder: 'rgb(37, 37, 37)',
  inputTextColor: '#f8f8f8',
  inputBorderRadius: 6,

  // Typography - Portfolio fonts
  fontBase: '"PPNeueMontreal-Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: 'Monaco, Menlo, "Ubuntu Mono", monospace',
});

addons.setConfig({
  theme: portfolioTheme,
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: false,
    collapsedRoots: [],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
