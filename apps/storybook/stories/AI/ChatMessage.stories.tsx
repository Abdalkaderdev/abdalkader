import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessage } from '@abdalkader/ui';
import React, { useState } from 'react';

const meta: Meta<typeof ChatMessage> = {
  title: 'AI Components/ChatMessage',
  component: ChatMessage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A component for displaying individual chat messages in AI chat interfaces. Supports user, assistant, and system messages with loading states, errors, and metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: { type: 'select' },
      options: ['user', 'assistant', 'system'],
      description: 'The role of the message sender',
    },
    content: {
      control: 'text',
      description: 'The message content',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    modelName: {
      control: 'text',
      description: 'Name of the AI model',
    },
    onRetry: {
      action: 'retry',
      description: 'Callback when retry is clicked',
    },
    onCopy: {
      action: 'copy',
      description: 'Callback when copy is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    role: 'user',
    content: 'Hello! Can you help me understand machine learning?',
    timestamp: new Date(),
  },
};

export const AssistantMessage: Story = {
  args: {
    role: 'assistant',
    content:
      'Of course! Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
    timestamp: new Date(),
    modelName: 'GPT-4',
    metadata: {
      tokens: 45,
      latency: 1200,
      confidence: 0.95,
    },
  },
};

export const SystemMessage: Story = {
  args: {
    role: 'system',
    content: 'Connection established. Ready to assist.',
    timestamp: new Date(),
  },
};

export const LoadingState: Story = {
  args: {
    role: 'assistant',
    content: '',
    isLoading: true,
    timestamp: new Date(),
  },
};

export const ErrorState: Story = {
  args: {
    role: 'assistant',
    content: '',
    error: 'Failed to generate response. Please try again.',
    timestamp: new Date(),
    modelName: 'GPT-4',
  },
};

export const WithMetadata: Story = {
  args: {
    role: 'assistant',
    content:
      'This is a response with detailed metadata including token count, latency, and confidence score.',
    timestamp: new Date(),
    modelName: 'GPT-4 Turbo',
    metadata: {
      tokens: 156,
      latency: 2340,
      confidence: 0.87,
    },
  },
};

export const LongMessage: Story = {
  args: {
    role: 'assistant',
    content:
      'This is a very long message that demonstrates how the component handles lengthy content. It should wrap properly and maintain readability. The component is designed to handle messages of various lengths while maintaining proper formatting and accessibility. This ensures that users can read long responses from AI models without any issues.',
    timestamp: new Date(),
    modelName: 'Claude-3',
    metadata: {
      tokens: 89,
      latency: 1800,
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRetry = () => {
      setError(null);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    return (
      <div style={{ maxWidth: '600px' }}>
        <ChatMessage
          role="assistant"
          content={
            error
              ? ''
              : 'This is an interactive example. Try clicking the retry button when an error occurs.'
          }
          error={error}
          isLoading={loading}
          timestamp={new Date()}
          modelName="GPT-4"
          onRetry={handleRetry}
          onCopy={() => alert('Message copied!')}
        />
        <button
          onClick={() => setError('Simulated error occurred')}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Simulate Error
        </button>
      </div>
    );
  },
};

export const AllRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <ChatMessage
        role="system"
        content="System initialized successfully"
        timestamp={new Date(Date.now() - 300000)}
      />
      <ChatMessage
        role="user"
        content="What is artificial intelligence?"
        timestamp={new Date(Date.now() - 180000)}
      />
      <ChatMessage
        role="assistant"
        content="Artificial intelligence (AI) is the simulation of human intelligence by machines, especially computer systems."
        timestamp={new Date(Date.now() - 120000)}
        modelName="GPT-4"
        metadata={{ tokens: 28, latency: 850 }}
      />
      <ChatMessage
        role="user"
        content="Can you give me more details?"
        timestamp={new Date(Date.now() - 60000)}
      />
      <ChatMessage
        role="assistant"
        content=""
        isLoading={true}
        timestamp={new Date()}
      />
    </div>
  ),
};

