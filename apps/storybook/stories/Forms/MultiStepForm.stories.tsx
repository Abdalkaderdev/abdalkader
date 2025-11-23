import type { Meta, StoryObj } from '@storybook/react';
import { MultiStepForm, FormStep } from '@abdalkader/ui';
import { Input } from '@abdalkader/ui';

const meta: Meta<typeof MultiStepForm> = {
  title: 'Forms/MultiStepForm',
  component: MultiStepForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# MultiStepForm Component

Multi-step form with validation, progress tracking, and step navigation.

## Features

- **Step Validation**: Validate each step before proceeding
- **Progress Indicator**: Visual progress bar and step indicators
- **Step Navigation**: Navigate between steps (optional)
- **Form State Management**: Automatic form data management
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiStepForm>;

// Step Components
const PersonalInfoStep = ({ data, onChange, errors }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Input
      label="First Name"
      value={data.firstName || ''}
      onChange={(e) => onChange('firstName', e.target.value)}
      error={errors.firstName}
      required
    />
    <Input
      label="Last Name"
      value={data.lastName || ''}
      onChange={(e) => onChange('lastName', e.target.value)}
      error={errors.lastName}
      required
    />
    <Input
      label="Email"
      type="email"
      value={data.email || ''}
      onChange={(e) => onChange('email', e.target.value)}
      error={errors.email}
      required
    />
  </div>
);

const AddressStep = ({ data, onChange, errors }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Input
      label="Street Address"
      value={data.street || ''}
      onChange={(e) => onChange('street', e.target.value)}
      error={errors.street}
      required
    />
    <Input
      label="City"
      value={data.city || ''}
      onChange={(e) => onChange('city', e.target.value)}
      error={errors.city}
      required
    />
    <Input
      label="Zip Code"
      value={data.zipCode || ''}
      onChange={(e) => onChange('zipCode', e.target.value)}
      error={errors.zipCode}
      required
    />
  </div>
);

const ReviewStep = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#f8f8f8' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Review Your Information</h4>
    <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
    <p><strong>Email:</strong> {data.email}</p>
    <p><strong>Address:</strong> {data.street}, {data.city} {data.zipCode}</p>
  </div>
);

const steps: FormStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Enter your personal details',
    component: PersonalInfoStep,
    validation: (data) => {
      return !!(data.firstName && data.lastName && data.email);
    },
  },
  {
    id: 'address',
    title: 'Address',
    description: 'Enter your address information',
    component: AddressStep,
    validation: (data) => {
      return !!(data.street && data.city && data.zipCode);
    },
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review your information before submitting',
    component: ReviewStep,
  },
];

export const Default: Story = {
  args: {
    steps,
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      alert('Form submitted successfully!');
    },
    showProgress: true,
    allowStepNavigation: true,
  },
};

export const WithoutStepNavigation: Story = {
  args: {
    steps,
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      alert('Form submitted successfully!');
    },
    showProgress: true,
    allowStepNavigation: false,
  },
};

export const WithoutProgress: Story = {
  args: {
    steps,
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      alert('Form submitted successfully!');
    },
    showProgress: false,
    allowStepNavigation: true,
  },
};

