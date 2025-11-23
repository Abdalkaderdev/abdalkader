import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/portfolio-theme.css';
// @ts-expect-error - Direct import
import { GlobalNavigation } from '../src/components/GlobalNavigation/GlobalNavigation';
// @ts-expect-error - CSS import
import '../../packages/ui/src/components/GlobalNavigationHub/GlobalNavigationHub.css';
// @ts-expect-error - CSS import
import '../../packages/ui/src/components/GlobalFooter/GlobalFooter.css';

const preview: Preview = {
  decorators: [
    (Story: any) => React.createElement(React.Fragment, null,
      React.createElement(GlobalNavigation),
      React.createElement('div', { style: { paddingTop: '80px' } },
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
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#000000' },
        { name: 'portfolio', value: '#0a0a0a' },
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