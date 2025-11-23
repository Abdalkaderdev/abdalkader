import type { Meta, StoryObj } from '@storybook/react';
import { ChatInterface, Message } from '@abdalkader/ui';
import React, { useState } from 'react';

const meta: Meta<typeof ChatInterface> = {
  title: 'AI Components/ChatInterface',
  component: ChatInterface,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete chat interface component for AI applications. Includes message display, input field, model selection, and loading states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Shows loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum message length',
    },
    showModelSelector: {
      control: 'boolean',
      description: 'Show model selector',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'system',
    content: 'Chat initialized. Ready to assist.',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    role: 'user',
    content: 'Hello! Can you help me with AI?',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Of course! I can help you with AI. What would you like to know?',
    timestamp: new Date(Date.now() - 120000),
    modelName: 'GPT-4',
    metadata: {
      tokens: 25,
      latency: 1200,
    },
  },
];

export const Default: Story = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('GPT-4');

    const handleSend = (message: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
      setIsLoading(true);

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `This is a simulated response to: "${message}". In a real application, this would come from an AI model.`,
          timestamp: new Date(),
          modelName: selectedModel,
          metadata: {
            tokens: Math.floor(Math.random() * 100) + 50,
            latency: Math.floor(Math.random() * 2000) + 500,
            confidence: 0.8 + Math.random() * 0.2,
          },
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    };

    return (
      <div style={{ height: '600px', maxWidth: '800px', margin: '0 auto' }}>
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSend}
          showModelSelector={true}
          availableModels={['GPT-4', 'GPT-3.5', 'Claude-3', 'Llama-2']}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          placeholder="Type your message here..."
        />
      </div>
    );
  },
};

export const WithErrorHandling: Story = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = (message: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
      setIsLoading(true);

      setTimeout(() => {
        const shouldError = Math.random() > 0.7;
        if (shouldError) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            error: 'Failed to generate response. Please try again.',
            timestamp: new Date(),
            modelName: 'GPT-4',
          };
          setMessages((prev) => [...prev, errorMessage]);
        } else {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Response to: "${message}"`,
            timestamp: new Date(),
            modelName: 'GPT-4',
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
        setIsLoading(false);
      }, 1500);
    };

    const handleRetry = (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      if (message) {
        handleSend(message.content);
      }
    };

    return (
      <div style={{ height: '600px', maxWidth: '800px', margin: '0 auto' }}>
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSend}
          onRetryMessage={handleRetry}
          placeholder="Type your message here..."
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = (message: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
      setIsLoading(true);

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `You said: "${message}"`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    };

    return (
      <div style={{ height: '600px', maxWidth: '800px', margin: '0 auto' }}>
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSend}
          placeholder="Start a conversation..."
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    messages: initialMessages,
    disabled: true,
    placeholder: 'Chat is disabled',
  },
};

export const LongConversation: Story = {
  render: () => {
    const longMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1).toString(),
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i + 1}: This is a longer conversation to test scrolling behavior.`,
      timestamp: new Date(Date.now() - (20 - i) * 60000),
      modelName: i % 2 === 1 ? 'GPT-4' : undefined,
    }));

    const [messages, setMessages] = useState<Message[]>(longMessages);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = (message: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
    };

    return (
      <div style={{ height: '600px', maxWidth: '800px', margin: '0 auto' }}>
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSend}
          placeholder="Continue the conversation..."
        />
      </div>
    );
  },
};

