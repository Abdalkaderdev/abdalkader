import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, ErrorState, LoadingState } from '@abdalkader/ui';

const meta: Meta = {
  title: 'Components/States',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# State Components

Components for displaying different application states: empty, loading, and error.

## Components

- **EmptyState**: Displayed when there's no data to show
- **LoadingState**: Shows loading indicators with multiple variants
- **ErrorState**: Displays error messages with retry functionality
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const EmptyStateDefault: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <EmptyState
        title="No items found"
        description="There are no items to display. Try adjusting your filters or create a new item."
      />
    </div>
  ),
};

export const EmptyStateWithAction: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <EmptyState
        title="No projects yet"
        description="Get started by creating your first project."
        action={{
          label: 'Create Project',
          onClick: () => alert('Create project clicked'),
        }}
      />
    </div>
  ),
};

export const ErrorStateDefault: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <ErrorState
        title="Failed to load data"
        message="Unable to fetch the requested data. Please check your connection and try again."
      />
    </div>
  ),
};

export const ErrorStateWithRetry: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <ErrorState
        title="Something went wrong"
        error="Network request failed"
        onRetry={() => alert('Retrying...')}
      />
    </div>
  ),
};

export const LoadingStateSpinner: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <LoadingState message="Loading data..." variant="spinner" size="medium" />
    </div>
  ),
};

export const LoadingStateSkeleton: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <LoadingState variant="skeleton" />
    </div>
  ),
};

export const LoadingStatePulse: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <LoadingState message="Processing..." variant="pulse" />
    </div>
  ),
};

export const LoadingStateFullScreen: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '400px' }}>
      <LoadingState message="Loading application..." variant="spinner" fullScreen />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

