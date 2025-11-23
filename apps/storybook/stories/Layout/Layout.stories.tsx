import type { Meta, StoryObj } from '@storybook/react';
import { Layout, Container, Stack, Grid, Section } from '@abdalkader/ui';
import { Card } from '@abdalkader/ui';

const meta: Meta<typeof Layout> = {
  title: 'Layout/Layout Primitives',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Layout Primitives

Comprehensive layout system with Container, Stack, Grid, and Section components for building consistent, responsive layouts.

## Components

- **Container**: Constrains content width with responsive padding
- **Stack**: Flexbox-based layout for arranging items
- **Grid**: CSS Grid system with responsive columns
- **Section**: Semantic section wrapper with spacing and background variants
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const ContainerSizes: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '100vh' }}>
      <Container size="sm" style={{ background: '#1a1a1a', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#f8f8f8', margin: 0 }}>Small Container (640px)</h3>
      </Container>
      <Container size="md" style={{ background: '#1a1a1a', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#f8f8f8', margin: 0 }}>Medium Container (768px)</h3>
      </Container>
      <Container size="lg" style={{ background: '#1a1a1a', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#f8f8f8', margin: 0 }}>Large Container (1024px)</h3>
      </Container>
      <Container size="xl" style={{ background: '#1a1a1a', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#f8f8f8', margin: 0 }}>Extra Large Container (1280px)</h3>
      </Container>
    </div>
  ),
};

export const StackLayout: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '100vh' }}>
      <Container size="lg">
        <Stack gap="lg">
          <Card>
            <h3 style={{ color: '#f8f8f8', margin: 0 }}>Stack Column (Default)</h3>
            <p style={{ color: '#787878', margin: '0.5rem 0 0 0' }}>Items stacked vertically</p>
          </Card>
          <Stack direction="row" gap="md" wrap>
            <Card style={{ flex: 1, minWidth: '200px' }}>
              <h4 style={{ color: '#f8f8f8', margin: 0 }}>Item 1</h4>
            </Card>
            <Card style={{ flex: 1, minWidth: '200px' }}>
              <h4 style={{ color: '#f8f8f8', margin: 0 }}>Item 2</h4>
            </Card>
            <Card style={{ flex: 1, minWidth: '200px' }}>
              <h4 style={{ color: '#f8f8f8', margin: 0 }}>Item 3</h4>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </div>
  ),
};

export const GridSystem: Story = {
  render: () => (
    <div style={{ background: '#000', padding: '2rem', minHeight: '100vh' }}>
      <Container size="lg">
        <h3 style={{ color: '#f8f8f8', marginBottom: '1rem' }}>Fixed Columns</h3>
        <Grid columns={3} gap="md" style={{ marginBottom: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <h4 style={{ color: '#f8f8f8', margin: 0 }}>Card {i}</h4>
            </Card>
          ))}
        </Grid>

        <h3 style={{ color: '#f8f8f8', marginBottom: '1rem' }}>Responsive Grid</h3>
        <Grid
          gap="md"
          responsive={{
            mobile: 1,
            tablet: 2,
            desktop: 4,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <h4 style={{ color: '#f8f8f8', margin: 0 }}>Responsive Card {i}</h4>
            </Card>
          ))}
        </Grid>
      </Container>
    </div>
  ),
};

export const SectionComponent: Story = {
  render: () => (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <Section variant="default" spacing="lg" background="default">
        <Container size="lg">
          <h2 style={{ color: '#f8f8f8', margin: 0 }}>Default Section</h2>
          <p style={{ color: '#787878', margin: '1rem 0 0 0' }}>
            Standard section with default background and spacing
          </p>
        </Container>
      </Section>

      <Section variant="narrow" spacing="md" background="secondary">
        <Container size="sm">
          <h2 style={{ color: '#f8f8f8', margin: 0 }}>Narrow Section</h2>
          <p style={{ color: '#787878', margin: '1rem 0 0 0' }}>
            Narrow section with secondary background
          </p>
        </Container>
      </Section>

      <Section variant="wide" spacing="xl" background="tertiary">
        <Container size="xl">
          <h2 style={{ color: '#f8f8f8', margin: 0 }}>Wide Section</h2>
          <p style={{ color: '#787878', margin: '1rem 0 0 0' }}>
            Wide section with tertiary background and extra spacing
          </p>
        </Container>
      </Section>
    </div>
  ),
};

