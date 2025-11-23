import type { Meta, StoryObj } from '@storybook/react';
import { useState, useMemo } from 'react';
import { Input, Card, Stack, Grid } from '@abdalkader/ui';

const meta: Meta = {
  title: 'Documentation/Component Search',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Component registry
const components = [
  {
    id: 'button',
    name: 'Button',
    category: 'Core',
    description: 'Primary interactive element for user actions',
    tags: ['interactive', 'action', 'click'],
    status: 'stable',
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Core',
    description: 'Text input field for user data entry',
    tags: ['form', 'text', 'data'],
    status: 'stable',
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout',
    description: 'Container component for grouping content',
    tags: ['container', 'layout', 'content'],
    status: 'stable',
  },
  {
    id: 'datatable',
    name: 'DataTable',
    category: 'Data',
    description: 'Advanced table with sorting, filtering, and pagination',
    tags: ['table', 'data', 'sort', 'filter'],
    status: 'stable',
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'Overlay',
    description: 'Dialog overlay for focused interactions',
    tags: ['dialog', 'overlay', 'focus'],
    status: 'stable',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    description: 'Tabbed interface for organizing content',
    tags: ['navigation', 'tabs', 'organization'],
    status: 'stable',
  },
  {
    id: 'emptystate',
    name: 'EmptyState',
    category: 'States',
    description: 'Display when there is no data to show',
    tags: ['state', 'empty', 'placeholder'],
    status: 'stable',
  },
  {
    id: 'loadingstate',
    name: 'LoadingState',
    category: 'States',
    description: 'Loading indicator with multiple variants',
    tags: ['state', 'loading', 'spinner'],
    status: 'stable',
  },
  {
    id: 'errorstate',
    name: 'ErrorState',
    category: 'States',
    description: 'Error message display with retry functionality',
    tags: ['state', 'error', 'retry'],
    status: 'stable',
  },
  {
    id: 'multistepform',
    name: 'MultiStepForm',
    category: 'Forms',
    description: 'Multi-step form with validation and progress tracking',
    tags: ['form', 'multi-step', 'validation'],
    status: 'stable',
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'Layout',
    description: 'CSS Grid system with responsive columns',
    tags: ['layout', 'grid', 'responsive'],
    status: 'stable',
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'Layout',
    description: 'Flexbox-based layout for arranging items',
    tags: ['layout', 'flexbox', 'arrangement'],
    status: 'stable',
  },
];

const categories = ['All', ...Array.from(new Set(components.map(c => c.category)))];

function ComponentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = 
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || component.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  return (
    <div style={{ background: '#000', padding: '2rem', minHeight: '100vh', color: '#f8f8f8' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Component Library</h1>
        <p style={{ color: '#787878', marginBottom: '2rem' }}>
          Search and filter components in the design system
        </p>

        {/* Search and Filters */}
        <Stack gap="md" style={{ marginBottom: '2rem' }}>
          <Input
            type="text"
            placeholder="Search components by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />

          <Stack direction="row" gap="md" wrap>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: '#1a1a1a',
                border: '1px solid #252525',
                borderRadius: '8px',
                color: '#f8f8f8',
                fontSize: '1rem',
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: '#1a1a1a',
                border: '1px solid #252525',
                borderRadius: '8px',
                color: '#f8f8f8',
                fontSize: '1rem',
              }}
            >
              <option value="all">All Status</option>
              <option value="stable">Stable</option>
              <option value="beta">Beta</option>
              <option value="experimental">Experimental</option>
            </select>
          </Stack>
        </Stack>

        {/* Results */}
        <div style={{ marginBottom: '1rem', color: '#787878' }}>
          Found {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
        </div>

        <Grid
          responsive={{
            mobile: 1,
            tablet: 2,
            desktop: 3,
          }}
          gap="md"
        >
          {filteredComponents.map(component => (
            <Card key={component.id} hoverable>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8f8f8' }}>
                    {component.name}
                  </h3>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: component.status === 'stable' ? '#00c896' : '#ffc107',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      color: '#000',
                    }}
                  >
                    {component.status}
                  </span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#787878', fontSize: '0.9rem' }}>
                  {component.description}
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {component.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '0.25rem 0.5rem',
                        background: '#0a0a0a',
                        border: '1px solid #252525',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: '#787878',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#787878' }}>
                  Category: <strong style={{ color: '#f8f8f8' }}>{component.category}</strong>
                </div>
              </div>
            </Card>
          ))}
        </Grid>

        {filteredComponents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#787878' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No components found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <ComponentSearch />,
  parameters: {
    layout: 'fullscreen',
  },
};

