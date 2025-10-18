import type { Meta, StoryObj } from '@storybook/react';
import { Button, Input } from '@abdalkader/ui';
import React, { useState } from 'react';
import InteractivePlayground from '../src/components/InteractivePlayground';
import DesignSystemVisualizer from '../src/components/DesignSystemVisualizer';
import TestingTools from '../src/components/TestingTools';

const meta: Meta = {
  title: 'Playground/Interactive Features',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive playground showcasing all the enhanced Storybook features including live code editing, design system visualization, and comprehensive testing tools.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LiveCodeEditor: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--color-white, #f8f8f8)', marginBottom: '2rem' }}>
        Live Code Editor with Monaco
      </h2>
      <p style={{ color: 'var(--color-text-grey, #787878)', marginBottom: '2rem' }}>
        Edit code in real-time and see instant preview updates. Features syntax highlighting, 
        IntelliSense, and error detection.
      </p>
      
      <InteractivePlayground
        componentName="Button"
        initialCode={`<Button 
  variant="primary" 
  size="large"
  onClick={() => alert('Hello World!')}
>
  Click Me!
</Button>`}
        component={Button}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Monaco Editor integration with live code editing, real-time preview, and error detection.',
      },
    },
  },
};

export const DesignSystemExplorer: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--color-white, #f8f8f8)', marginBottom: '2rem' }}>
        Design System Visualizer
      </h2>
      <p style={{ color: 'var(--color-text-grey, #787878)', marginBottom: '2rem' }}>
        Explore our design tokens including colors, typography, spacing, and animations. 
        Interactive visualizations with contrast ratios and usage examples.
      </p>
      
      <DesignSystemVisualizer />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive design system explorer with color palettes, typography scales, spacing systems, and animation timing.',
      },
    },
  },
};

export const ComprehensiveTestingTools: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--color-white, #f8f8f8)', marginBottom: '2rem' }}>
        Comprehensive Testing Tools
      </h2>
      <p style={{ color: 'var(--color-text-grey, #787878)', marginBottom: '2rem' }}>
        Built-in testing tools for viewport testing, accessibility scanning, visual regression, 
        and interaction tracking. Perfect for ensuring quality across all devices and use cases.
      </p>
      
      <TestingTools>
        <div style={{ 
          padding: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          minWidth: '400px',
          background: 'var(--color-bg-primary, #000)',
          borderRadius: 'var(--border-radius, 12px)',
          border: '1px solid var(--color-border, rgb(37, 37, 37))'
        }}>
          <h3 style={{ 
            color: 'var(--color-white, #f8f8f8)', 
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 500
          }}>
            Contact Form
          </h3>
          
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
            label="Phone Number"
            type="tel"
            placeholder="(555) 555-5555"
          />
          
          <Input
            label="Message"
            placeholder="Tell us about your project..."
            helperText="Please provide as much detail as possible"
          />
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="primary">
              Send Message
            </Button>
            <Button variant="secondary">
              Save Draft
            </Button>
          </div>
        </div>
      </TestingTools>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete testing suite with viewport testing, accessibility scanning, visual regression testing, and interaction tracking.',
      },
    },
  },
};

export const MultiComponentPlayground: Story = {
  render: () => {
    const [selectedComponent, setSelectedComponent] = useState('Button');
    
    const components = {
      Button: {
        name: 'Button',
        initialCode: `<Button 
  variant="primary" 
  size="large"
  onClick={() => console.log('Clicked!')}
>
  Interactive Button
</Button>`,
        component: Button
      },
      Input: {
        name: 'Input',
        initialCode: `<Input 
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
  helperText="We'll never share your email"
/>`,
        component: Input
      }
    };

    const currentComponent = components[selectedComponent as keyof typeof components];

    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: 'var(--color-white, #f8f8f8)', marginBottom: '2rem' }}>
          Multi-Component Playground
        </h2>
        <p style={{ color: 'var(--color-text-grey, #787878)', marginBottom: '2rem' }}>
          Switch between different components and experiment with their props in real-time.
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {Object.keys(components).map(componentName => (
              <Button
                key={componentName}
                variant={selectedComponent === componentName ? 'primary' : 'secondary'}
                onClick={() => setSelectedComponent(componentName)}
              >
                {componentName}
              </Button>
            ))}
          </div>
        </div>
        
        <InteractivePlayground
          componentName={currentComponent.name}
          initialCode={currentComponent.initialCode}
          component={currentComponent.component}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-component playground allowing you to switch between different components and experiment with their properties.',
      },
    },
  },
};

export const AccessibilityTestingDemo: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--color-white, #f8f8f8)', marginBottom: '2rem' }}>
        Accessibility Testing Demo
      </h2>
      <p style={{ color: 'var(--color-text-grey, #787878)', marginBottom: '2rem' }}>
        This demo shows how our testing tools help identify and fix accessibility issues. 
        Try the accessibility scanner to see real-time a11y analysis.
      </p>
      
      <TestingTools>
        <div style={{ 
          padding: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          minWidth: '400px',
          background: 'var(--color-bg-primary, #000)',
          borderRadius: 'var(--border-radius, 12px)',
          border: '1px solid var(--color-border, rgb(37, 37, 37))'
        }}>
          <h3 style={{ 
            color: 'var(--color-white, #f8f8f8)', 
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 500
          }}>
            Accessibility Test Form
          </h3>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input
              label="First Name"
              placeholder="Enter first name"
              required
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            placeholder="email@example.com"
            required
            helperText="Required for account verification"
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            required
            helperText="Must be at least 8 characters with numbers and symbols"
          />
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="primary" type="submit">
              Create Account
            </Button>
            <Button variant="secondary">
              Cancel
            </Button>
          </div>
          
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--color-bg-secondary, #0a0a0a)',
            borderRadius: 'var(--border-radius-sm, 6px)',
            border: '1px solid var(--color-border, rgb(37, 37, 37))'
          }}>
            <h4 style={{ 
              color: 'var(--color-white, #f8f8f8)', 
              margin: '0 0 0.5rem 0',
              fontSize: '1rem'
            }}>
              Accessibility Features Demonstrated:
            </h4>
            <ul style={{ 
              color: 'var(--color-text-grey, #787878)', 
              margin: 0,
              paddingLeft: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}>
              <li>Proper form labels and associations</li>
              <li>Required field indicators</li>
              <li>Helpful error messages and helper text</li>
              <li>Keyboard navigation support</li>
              <li>Focus management and indicators</li>
              <li>Screen reader compatibility</li>
            </ul>
          </div>
        </div>
      </TestingTools>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility testing demonstration showing how our tools help identify and resolve a11y issues.',
      },
    },
  },
};

export const ResponsiveDesignTesting: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--color-white, #f8f8f8)', marginBottom: '2rem' }}>
        Responsive Design Testing
      </h2>
      <p style={{ color: 'var(--color-text-grey, #787878)', marginBottom: '2rem' }}>
        Test how components adapt across different screen sizes and devices. 
        Use the viewport testing tools to ensure optimal user experience on all devices.
      </p>
      
      <TestingTools>
        <div style={{ 
          padding: '2rem', 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          minWidth: '300px',
          background: 'var(--color-bg-primary, #000)',
          borderRadius: 'var(--border-radius, 12px)',
          border: '1px solid var(--color-border, rgb(37, 37, 37))'
        }}>
          <div style={{ 
            padding: '1.5rem',
            background: 'var(--color-bg-secondary, #0a0a0a)',
            borderRadius: 'var(--border-radius-sm, 6px)',
            border: '1px solid var(--color-border, rgb(37, 37, 37))'
          }}>
            <h4 style={{ 
              color: 'var(--color-white, #f8f8f8)', 
              margin: '0 0 1rem 0',
              fontSize: '1.1rem'
            }}>
              Mobile Card
            </h4>
            <p style={{ 
              color: 'var(--color-text-grey, #787878)', 
              margin: '0 0 1rem 0',
              fontSize: '0.9rem'
            }}>
              This card adapts to different screen sizes and maintains readability.
            </p>
            <Button variant="primary" size="small">
              Learn More
            </Button>
          </div>
          
          <div style={{ 
            padding: '1.5rem',
            background: 'var(--color-bg-secondary, #0a0a0a)',
            borderRadius: 'var(--border-radius-sm, 6px)',
            border: '1px solid var(--color-border, rgb(37, 37, 37))'
          }}>
            <h4 style={{ 
              color: 'var(--color-white, #f8f8f8)', 
              margin: '0 0 1rem 0',
              fontSize: '1.1rem'
            }}>
              Tablet Card
            </h4>
            <p style={{ 
              color: 'var(--color-text-grey, #787878)', 
              margin: '0 0 1rem 0',
              fontSize: '0.9rem'
            }}>
              Responsive grid layout that adjusts based on available space.
            </p>
            <Button variant="secondary" size="small">
              View Details
            </Button>
          </div>
          
          <div style={{ 
            padding: '1.5rem',
            background: 'var(--color-bg-secondary, #0a0a0a)',
            borderRadius: 'var(--border-radius-sm, 6px)',
            border: '1px solid var(--color-border, rgb(37, 37, 37))'
          }}>
            <h4 style={{ 
              color: 'var(--color-white, #f8f8f8)', 
              margin: '0 0 1rem 0',
              fontSize: '1.1rem'
            }}>
              Desktop Card
            </h4>
            <p style={{ 
              color: 'var(--color-text-grey, #787878)', 
              margin: '0 0 1rem 0',
              fontSize: '0.9rem'
            }}>
              Full-featured layout with optimal spacing and typography.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="primary" size="small">
                Action
              </Button>
              <Button variant="secondary" size="small">
                More
              </Button>
            </div>
          </div>
        </div>
      </TestingTools>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive design testing demonstration showing how components adapt across different screen sizes.',
      },
    },
  },
};