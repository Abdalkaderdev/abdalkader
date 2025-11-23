import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Modal, 
  Tooltip, 
  Tabs, 
  Accordion,
  Skeleton,
  Spinner,
  Progress,
  CircularProgress,
  ProgressSteps,
  ErrorBoundary,
  useModal,
  entranceAnimations,
  hoverAnimations,
  easing,
  duration
} from '@abdalkader/ui';
import { 
  ChevronDown, 
  X, 
  Settings, 
  Mail, 
  Phone,
  Star,
  Heart,
  Bookmark,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const meta: Meta<typeof ComponentsDemo> = {
  title: 'Components/Complete Demo',
  component: ComponentsDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function ComponentsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [progressValue, setProgressValue] = useState(65);
  const modal = useModal();
  const [activeTab, setActiveTab] = useState('1');
  const [openAccordions, setOpenAccordions] = useState<string[]>(['1']);

  const selectOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const tabItems = [
    { id: '1', label: 'Overview', content: <div>Overview content with rich features and smooth animations.</div> },
    { id: '2', label: 'Features', content: <div>Advanced features including micro-interactions and accessibility.</div> },
    { id: '3', label: 'Documentation', content: <div>Comprehensive documentation and usage examples.</div> },
  ];

  const accordionItems = [
    { id: '1', title: 'Getting Started', content: <div>Learn how to get started with our component library.</div> },
    { id: '2', title: 'Advanced Usage', content: <div>Explore advanced features and customization options.</div> },
    { id: '3', title: 'Best Practices', content: <div>Follow best practices for optimal performance and accessibility.</div> },
  ];

  const progressSteps = [
    { id: '1', title: 'Setup', completed: true },
    { id: '2', title: 'Configuration', completed: true },
    { id: '3', title: 'Implementation', completed: false },
    { id: '4', title: 'Deployment', completed: false },
  ];

  return (
    <div style={{ padding: '2rem', background: '#000', color: '#f8f8f8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#f44e00' }}>
          Complete Component Library Demo
        </h1>

        {/* Core Components */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fa7300' }}>Core Components</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Buttons</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button loading>Loading</Button>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Form Components</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  placeholder="Enter your email"
                  value={inputValue}
                  onChange={setInputValue}
                  label="Email Address"
                />
                <Select
                  options={selectOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Choose an option"
                />
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Interactive Elements</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Tooltip content="This is a tooltip" position="top">
                  <Button>Hover me</Button>
                </Tooltip>
                <Button onClick={modal.open}>Open Modal</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Navigation Components */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fa7300' }}>Navigation Components</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tabs</h3>
              <Tabs
                items={tabItems}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="default"
              />
            </Card>

            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Accordion</h3>
              <Accordion
                items={accordionItems}
                openItems={openAccordions}
                onChange={setOpenAccordions}
                allowMultiple
              />
            </Card>
          </div>
        </section>

        {/* Loading States */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fa7300' }}>Loading States</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Skeleton Loaders</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Skeleton variant="text" lines={3} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" lines={2} width="60%" />
                </div>
                <Skeleton variant="text" lines={2} />
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Spinners</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner variant="dots" />
                <Spinner variant="pulse" />
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Progress Indicators</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Progress value={progressValue} showLabel />
                <CircularProgress value={75} size="lg" showLabel />
                <ProgressSteps steps={progressSteps} currentStep={2} />
              </div>
            </Card>
          </div>
        </section>

        {/* Error Handling */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fa7300' }}>Error Handling</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Error Boundary</h3>
              <ErrorBoundary
                customMessage="This is a demo error boundary with custom message."
                showRetry={true}
                showHome={true}
              >
                <div>Content protected by error boundary</div>
              </ErrorBoundary>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fa7300' }}>Implementation Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f44e00', marginBottom: '0.5rem' }}>14</div>
              <div style={{ color: '#787878' }}>Components</div>
            </Card>
            <Card>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>50+</div>
              <div style={{ color: '#787878' }}>Animation Presets</div>
            </Card>
            <Card>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>5k+</div>
              <div style={{ color: '#787878' }}>Lines of Code</div>
            </Card>
            <Card>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>100%</div>
              <div style={{ color: '#787878' }}>TypeScript</div>
            </Card>
          </div>
        </section>
      </div>

      {/* Modal */}
      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Demo Modal">
        <p>This is a demo modal showcasing our modal component with smooth animations and accessibility features.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={modal.close}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}

export const Default: Story = {
  render: () => <ComponentsDemo />,
};

export const LoadingStates: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: '#000', color: '#f8f8f8' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#f44e00' }}>Loading States Showcase</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <Card>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Skeleton Variants</h3>
          <Skeleton variant="text" lines={3} />
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="rectangular" width="100%" height={100} />
        </Card>
        <Card>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Spinner Variants</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Spinner variant="default" />
            <Spinner variant="dots" />
            <Spinner variant="pulse" />
            <Spinner variant="bars" />
            <Spinner variant="orbit" />
          </div>
        </Card>
        <Card>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Progress Variants</h3>
          <Progress value={30} variant="default" />
          <Progress value={60} variant="striped" />
          <Progress value={90} variant="animated" />
          <Progress value={100} variant="indeterminate" />
        </Card>
      </div>
    </div>
  ),
};

export const ErrorHandling: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: '#000', color: '#f8f8f8' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#f44e00' }}>Error Handling Showcase</h2>
      <ErrorBoundary
        customMessage="This demonstrates our enhanced error boundary with retry functionality."
        showRetry={true}
        showHome={true}
      >
        <Card>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Protected Content</h3>
          <p>This content is protected by our error boundary component.</p>
          <Button onClick={() => { throw new Error('Test error for demo'); }}>
            Trigger Error
          </Button>
        </Card>
      </ErrorBoundary>
    </div>
  ),
};
