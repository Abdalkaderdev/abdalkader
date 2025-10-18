import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const CrossAppNavigation = () => {
  const apps = [
    { 
      name: 'Portfolio', 
      url: 'https://abdalkader.dev', 
      description: 'Main portfolio website',
      icon: '🏠'
    },
    { 
      name: 'Blog', 
      url: 'https://blog.abdalkader.dev', 
      description: 'Technical blog and articles',
      icon: '📝'
    },
    { 
      name: 'Docs', 
      url: 'https://docs.abdalkader.dev', 
      description: 'Project documentation',
      icon: '📚'
    },
    { 
      name: 'Components', 
      url: 'https://storybook.abdalkader.dev', 
      description: 'Component library and playground',
      icon: '🧩'
    },
  ];

  return (
    <div className="cross-app-nav">
      <h3 className="cross-app-nav__title">Explore Apps</h3>
      <div className="cross-app-nav__grid">
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.url}
            className="cross-app-nav__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="cross-app-nav__icon">{app.icon}</span>
            <div className="cross-app-nav__content">
              <span className="cross-app-nav__name">{app.name}</span>
              <span className="cross-app-nav__description">{app.description}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const meta: Meta<typeof CrossAppNavigation> = {
  title: 'Navigation/CrossAppNavigation',
  component: CrossAppNavigation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Cross-app navigation component that provides links to all applications in the monorepo with consistent portfolio styling.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The component uses portfolio design tokens for consistent styling across all apps.',
      },
    },
  },
};