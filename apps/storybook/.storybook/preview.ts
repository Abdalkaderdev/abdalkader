import type { Preview } from '@storybook/react';
import { create } from '@storybook/theming/create';
import React from 'react';
import '../src/styles/portfolio-theme.css';

/**
 * Portfolio Theme for Storybook Preview (Docs & Canvas)
 * Matches the portfolio color system exactly
 */
const portfolioTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Abdalkader UI',
  brandUrl: 'https://abdalkader.com',
  brandTarget: '_self',

  // Colors - EXACT portfolio values
  colorPrimary: '#f44e00',
  colorSecondary: '#fa7300',

  // UI
  appBg: '#000',
  appContentBg: '#000',
  appPreviewBg: '#000',
  appBorderColor: 'rgb(37, 37, 37)',
  appBorderRadius: 6,

  // Text colors
  textColor: '#f8f8f8',
  textInverseColor: '#000',
  textMutedColor: '#787878',

  // Toolbar default and active colors
  barTextColor: '#f8f8f8',
  barSelectedColor: '#f44e00',
  barHoverColor: '#fa7300',
  barBg: 'rgba(45, 45, 45, 0.35)',

  // Form colors
  inputBg: 'transparent',
  inputBorder: 'rgb(37, 37, 37)',
  inputTextColor: '#f8f8f8',
  inputBorderRadius: 6,

  // Boolean (toggle) colors
  booleanBg: '#0a0a0a',
  booleanSelectedBg: '#f44e00',

  // Button colors
  buttonBg: '#f44e00',
  buttonBorder: '#f44e00',

  // Typography - Portfolio fonts
  fontBase: '"PPNeueMontreal-Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: 'Monaco, Menlo, "Ubuntu Mono", monospace',
});
// // @ts-expect-error - Direct import
// import { GlobalNavigation } from '../src/components/GlobalNavigation/GlobalNavigation';
// // @ts-expect-error - CSS import
// import '../../packages/ui/src/components/GlobalNavigationHub/GlobalNavigationHub.css';
// // @ts-expect-error - CSS import
// import '../../packages/ui/src/components/GlobalFooter/GlobalFooter.css';

const preview: Preview = {
  decorators: [
    (Story: any) => React.createElement(React.Fragment, null,
      // React.createElement(GlobalNavigation),
      React.createElement('div', { style: { paddingTop: '20px' } },
        React.createElement(Story)
      )
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      theme: portfolioTheme,
      toc: true,
      source: {
        type: 'code',
        language: 'tsx',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        wide: {
          name: 'Wide',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
    backgrounds: {
      default: 'portfolio',
      values: [
        { name: 'portfolio', value: '#000000' },
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'portfolio',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'portfolio', title: 'Portfolio Theme', icon: 'paintbrush' },
          { value: 'light', title: 'Light Theme', icon: 'sun' },
          { value: 'dark', title: 'Dark Theme', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;