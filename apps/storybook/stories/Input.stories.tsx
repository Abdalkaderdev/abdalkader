import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@abdalkader/ui';
import React, { useState } from 'react';
import InteractivePlayground from '../src/components/InteractivePlayground';
import TestingTools from '../src/components/TestingTools';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A fully accessible input component with label, error states, and helper text support. Implements controlled component pattern and supports all standard HTML input attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'HTML input type',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when error is true',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'Enter text...',
  },
};

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic input without a label.',
      },
    },
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with a label for better accessibility and UX.',
      },
    },
  },
};

export const Required: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Required fields are marked with an asterisk (*) and have proper ARIA attributes.',
      },
    },
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters long',
  },
  parameters: {
    docs: {
      description: {
        story: 'Helper text provides additional guidance to users.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    defaultValue: 'invalid-email',
    error: true,
    errorMessage: 'Please enter a valid email address',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state with message. Error messages have role="alert" for screen readers.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    defaultValue: 'Cannot edit this',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled inputs are not interactive and have reduced opacity.',
      },
    },
  },
};

export const DifferentTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
      <Input label="Text" type="text" placeholder="Enter text" />
      <Input label="Email" type="email" placeholder="email@example.com" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="Enter number" />
      <Input label="Telephone" type="tel" placeholder="(555) 555-5555" />
      <Input label="URL" type="url" placeholder="https://example.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input supports various HTML5 input types.',
      },
    },
  },
};

export const ControlledInput: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ minWidth: '300px' }}>
        <Input
          label="Controlled Input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
          helperText={`Character count: ${value.length}`}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a controlled input with character count.',
      },
    },
  },
};

export const FormValidation: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    
    const validateEmail = (value: string) => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setError(!isValid && value.length > 0);
    };

    return (
      <div style={{ minWidth: '300px' }}>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          error={error}
          errorMessage={error ? 'Please enter a valid email address' : undefined}
          required
          placeholder="email@example.com"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of real-time form validation with error handling.',
      },
    },
  },
};

export const InputPlayground: Story = {
  render: () => (
    <InteractivePlayground
      componentName="Input"
      initialCode={`<Input 
  label="Email Address" 
  type="email" 
  placeholder="Enter your email"
  required
/>`}
      component={Input}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground where you can edit code and see live preview of the Input component.',
      },
    },
  },
};

export const TestingTools: Story = {
  render: () => (
    <TestingTools>
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="email@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          helperText="Must be at least 8 characters"
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 555-5555"
        />
      </div>
    </TestingTools>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive testing tools including viewport testing, accessibility scanning, visual regression, and interaction tracking.',
      },
    },
  },
};