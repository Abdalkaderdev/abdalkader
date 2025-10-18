import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@abdalkader/ui';
import React from 'react';
import InteractivePlayground from '../src/components/InteractivePlayground';
import DesignSystemVisualizer from '../src/components/DesignSystemVisualizer';
import { EnhancedButton } from '../src/components/EnhancedButton';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and full accessibility support. Supports all standard HTML button attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Button',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary button for main actions.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary button for less prominent actions.',
      },
    },
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Danger button for destructive actions.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons are available in three sizes: small, medium, and large.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="primary" disabled>Primary Disabled</Button>
        <Button variant="secondary" disabled>Secondary Disabled</Button>
        <Button variant="danger" disabled>Danger Disabled</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants in enabled and disabled states.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons are not interactive and have reduced opacity.',
      },
    },
  },
};

export const WithAriaLabel: Story = {
  args: {
    'aria-label': 'Close dialog',
    children: '×',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use aria-label for buttons with icon-only content to ensure accessibility.',
      },
    },
  },
};

export const AsSubmitButton: Story = {
  args: {
    type: 'submit',
    children: 'Submit Form',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button can be used as a form submit button by setting type="submit".',
      },
    },
  },
};

export const ButtonPlayground: Story = {
  render: () => (
    <InteractivePlayground
      componentName="Button"
      initialCode={`<Button variant="primary" size="medium">
  Click me!
</Button>`}
      component={Button}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground where you can edit code and see live preview of the Button component.',
      },
    },
  },
};

export const DesignSystemVisualizerStory: Story = {
  render: () => <DesignSystemVisualizer />,
  parameters: {
    docs: {
      description: {
        story: 'Explore the design system tokens including colors, typography, spacing, and animations.',
      },
    },
  },
};

// Enhanced Button Stories
export const EnhancedButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <EnhancedButton variant="primary" status="stable">
        Primary Stable
      </EnhancedButton>
      <EnhancedButton variant="secondary" status="beta">
        Secondary Beta
      </EnhancedButton>
      <EnhancedButton variant="outline" status="experimental">
        Outline Experimental
      </EnhancedButton>
      <EnhancedButton variant="danger" status="deprecated">
        Danger Deprecated
      </EnhancedButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Enhanced buttons with component status indicators and improved accessibility features.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <EnhancedButton variant="primary" loading>
        Loading Primary
      </EnhancedButton>
      <EnhancedButton variant="secondary" loading disabled>
        Loading Disabled
      </EnhancedButton>
      <EnhancedButton variant="outline" loading status="beta">
        Loading Beta
      </EnhancedButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons in various loading states with proper accessibility indicators.',
      },
    },
  },
};

export const AccessibilityFeatures: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <EnhancedButton 
        variant="primary" 
        aria-label="Save document"
        aria-describedby="save-help"
      >
        Save
      </EnhancedButton>
      <EnhancedButton 
        variant="secondary" 
        disabled
        aria-label="This action is currently disabled"
      >
        Disabled Action
      </EnhancedButton>
      <EnhancedButton 
        variant="outline" 
        loading
        aria-label="Processing request, please wait"
      >
        Process
      </EnhancedButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with enhanced accessibility features including proper ARIA labels and descriptions.',
      },
    },
  },
};