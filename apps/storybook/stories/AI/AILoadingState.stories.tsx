import type { Meta, StoryObj } from '@storybook/react';
import { AILoadingState } from '@abdalkader/ui';
import React from 'react';

const meta: Meta<typeof AILoadingState> = {
  title: 'AI Components/AILoadingState',
  component: AILoadingState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component for displaying loading states during AI operations. Supports multiple animation types and progress indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['spinner', 'dots', 'pulse', 'skeleton', 'progress'],
      description: 'Loading animation type',
    },
    message: {
      control: 'text',
      description: 'Loading message',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (for progress type)',
    },
    stage: {
      control: 'text',
      description: 'Current processing stage',
    },
    modelName: {
      control: 'text',
      description: 'Name of the AI model',
    },
    estimatedTime: {
      control: 'number',
      description: 'Estimated time remaining in seconds',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the loading indicator',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Spinner: Story = {
  args: {
    type: 'spinner',
    message: 'Processing your request...',
    modelName: 'GPT-4',
  },
};

export const Dots: Story = {
  args: {
    type: 'dots',
    message: 'Analyzing data...',
    modelName: 'Claude-3',
  },
};

export const Pulse: Story = {
  args: {
    type: 'pulse',
    message: 'Generating response...',
    modelName: 'Llama-2',
  },
};

export const Skeleton: Story = {
  args: {
    type: 'skeleton',
    message: 'Loading content...',
  },
};

export const Progress: Story = {
  args: {
    type: 'progress',
    message: 'Processing images...',
    progress: 65,
    modelName: 'ResNet-50',
  },
};

export const WithStage: Story = {
  args: {
    type: 'spinner',
    message: 'Processing request...',
    stage: 'Step 2 of 4: Analyzing input',
    modelName: 'GPT-4',
  },
};

export const WithEstimatedTime: Story = {
  args: {
    type: 'spinner',
    message: 'Generating response...',
    modelName: 'GPT-4 Turbo',
    estimatedTime: 45,
  },
};

export const FullProgress: Story = {
  args: {
    type: 'progress',
    message: 'Training model...',
    progress: 75,
    stage: 'Epoch 15 of 20',
    modelName: 'Custom Model',
    estimatedTime: 120,
  },
};

export const Small: Story = {
  args: {
    type: 'spinner',
    message: 'Loading...',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    type: 'spinner',
    message: 'Processing...',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    type: 'spinner',
    message: 'Generating response...',
    size: 'large',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '1200px',
      }}
    >
      <AILoadingState type="spinner" message="Spinner loading..." modelName="GPT-4" />
      <AILoadingState type="dots" message="Dots loading..." modelName="Claude-3" />
      <AILoadingState type="pulse" message="Pulse loading..." modelName="Llama-2" />
      <AILoadingState type="skeleton" message="Skeleton loading..." />
      <AILoadingState
        type="progress"
        message="Progress loading..."
        progress={60}
        modelName="ResNet-50"
      />
    </div>
  ),
};

export const ProgressStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      <AILoadingState
        type="progress"
        message="Starting..."
        progress={0}
        modelName="Model"
      />
      <AILoadingState
        type="progress"
        message="Processing..."
        progress={25}
        modelName="Model"
      />
      <AILoadingState
        type="progress"
        message="Almost done..."
        progress={75}
        modelName="Model"
      />
      <AILoadingState
        type="progress"
        message="Complete!"
        progress={100}
        modelName="Model"
      />
    </div>
  ),
};

