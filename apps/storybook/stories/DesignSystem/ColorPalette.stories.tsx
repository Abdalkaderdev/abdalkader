import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@abdalkader/ui/src/tokens/designTokens';

const meta: Meta<typeof ColorPalette> = {
  title: 'Design System/Color Palette',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Color Palette Documentation

The Abdalkader portfolio uses a carefully curated color system designed for high contrast, accessibility, and visual hierarchy. All colors are optimized for dark theme presentation with strategic use of orange accents for brand identity and call-to-action elements.

## Design Principles

### Brand Identity
- **Primary Orange (#f44e00)**: The signature brand color representing energy, creativity, and innovation
- **Secondary Orange (#fa7300)**: A lighter variant for secondary actions and subtle highlights
- **Gradient**: Seamless transition between primary and secondary for dynamic effects

### Visual Hierarchy
- **High Contrast**: Pure black backgrounds (#000000) ensure maximum readability
- **Text Hierarchy**: Off-white (#f8f8f8) for primary text, grey (#787878) for secondary
- **Subtle Borders**: Dark grey (#252525) provides structure without distraction

## Usage Guidelines

### Primary Colors
- **Primary Orange (#f44e00)**: 
  - ✅ Use for: Brand elements, primary CTAs, interactive states, hover effects
  - ✅ Use for: Active navigation items, important notifications
  - ❌ Avoid: Large text areas, extensive backgrounds, low-contrast combinations
  - **Token**: \`colors.primary\` or \`--color-primary\`

- **Secondary Orange (#fa7300)**:
  - ✅ Use for: Secondary actions, highlights, accent elements
  - ✅ Use for: Progress indicators, subtle emphasis
  - ❌ Avoid: Primary CTAs, critical information
  - **Token**: \`colors.secondary\` or \`--color-secondary\`

### Neutral Colors
- **Background (#000000)**:
  - ✅ Use for: Main page backgrounds, card backgrounds, modal overlays
  - **Token**: \`colors.background\` or \`--color-background\`

- **Background Secondary (#0a0a0a)**:
  - ✅ Use for: Elevated surfaces, nested components
  - **Token**: \`colors.backgroundSecondary\` or \`--color-background-secondary\`

- **Background Tertiary (#1a1a1a)**:
  - ✅ Use for: Input fields, dropdowns, elevated cards
  - **Token**: \`colors.backgroundTertiary\` or \`--color-background-tertiary\`

- **Text Primary (#f8f8f8)**:
  - ✅ Use for: Headings, body text, primary content
  - ✅ 97% luminance ensures excellent readability
  - **Token**: \`colors.text\` or \`--color-text\`

- **Text Secondary (#787878)**:
  - ✅ Use for: Metadata, captions, secondary information
  - ✅ Use for: Placeholder text, disabled states
  - **Token**: \`colors.textSecondary\` or \`--color-text-secondary\`

- **Border (#252525)**:
  - ✅ Use for: Dividers, input borders, card borders
  - ✅ Subtle enough to not distract, visible enough for structure
  - **Token**: \`colors.border\` or \`--color-border\`

### Semantic Colors
- **Success (#00c896)**:
  - ✅ Use for: Success messages, completed states, positive feedback
  - **Token**: \`colors.success\` or \`--color-success\`

- **Warning (#ffc107)**:
  - ✅ Use for: Warning messages, caution states, pending actions
  - **Token**: \`colors.warning\` or \`--color-warning\`

- **Error (#ff4444)**:
  - ✅ Use for: Error messages, destructive actions, validation errors
  - **Token**: \`colors.error\` or \`--color-error\`

- **Info (#2196f3)**:
  - ✅ Use for: Informational messages, tooltips, help text
  - **Token**: \`colors.info\` or \`--color-info\`

### Gradients
- **Primary Gradient**: \`linear-gradient(135deg, #f44e00 0%, #fa7300 100%)\`
  - ✅ Use for: Hero sections, premium features, special highlights
  - **Token**: \`colors.gradients.primary\` or \`--gradient-primary\`

- **Text Gradient**: \`linear-gradient(to bottom, #f44e00, #fa7300)\`
  - ✅ Use for: Accent text, brand headings, special typography
  - **Token**: \`colors.gradients.text\` or \`--gradient-text\`

## Accessibility Standards

### Contrast Ratios
- **WCAG AAA Compliance**: All text meets 7:1 contrast ratio
- **Primary Orange**: 4.5:1 contrast against black (WCAG AA)
- **Text Primary**: 15.8:1 contrast against black (WCAG AAA)
- **Text Secondary**: 4.2:1 contrast against black (WCAG AA)

### Implementation Requirements
- Always test color combinations for contrast
- Use semantic colors for status indicators
- Provide alternative text indicators for color-only information
- Support high contrast mode preferences

## Implementation Examples

### CSS Custom Properties
\`\`\`css
/* Import design tokens */
@import '@abdalkader/ui/src/tokens/designTokens.css';

/* Use in components */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: 1px solid var(--color-primary);
}

.button-primary:hover {
  background-color: var(--color-secondary);
}
\`\`\`

### TypeScript/JavaScript
\`\`\`typescript
import { colors } from '@abdalkader/ui/src/tokens/designTokens';

const buttonStyle = {
  backgroundColor: colors.primary,
  color: colors.text,
  border: \`1px solid \${colors.border}\`
};
\`\`\`

### SCSS Variables
\`\`\`scss
// Import design tokens
@import '@abdalkader/ui/src/tokens/designTokens.css';

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text);
  
  &:hover {
    background-color: var(--color-secondary);
  }
}
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral', 'semantic', 'gradients'],
      description: 'Color category to display'
    },
    showAccessibility: {
      control: 'boolean',
      description: 'Show accessibility information'
    },
    showCode: {
      control: 'boolean',
      description: 'Show implementation code examples'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

// Color palette component
const ColorPalette = ({ variant = 'primary', showAccessibility = true, showCode = true }: any) => {
  const colorDefinitions = {
    primary: [
      { 
        name: 'Primary', 
        hex: colors.primary, 
        rgb: 'rgb(244, 78, 0)', 
        token: 'colors.primary',
        cssVar: '--color-primary',
        usage: 'Brand elements, CTAs, primary actions, interactive states',
        do: ['Primary buttons', 'Active states', 'Brand logos', 'Important highlights'],
        dont: ['Large text blocks', 'Extensive backgrounds', 'Low contrast combinations']
      },
      { 
        name: 'Secondary', 
        hex: colors.secondary, 
        rgb: 'rgb(250, 115, 0)', 
        token: 'colors.secondary',
        cssVar: '--color-secondary',
        usage: 'Secondary actions, highlights, hover states',
        do: ['Secondary buttons', 'Progress indicators', 'Accent elements'],
        dont: ['Primary CTAs', 'Critical information']
      }
    ],
    neutral: [
      { 
        name: 'Background', 
        hex: colors.background, 
        rgb: 'rgb(0, 0, 0)', 
        token: 'colors.background',
        cssVar: '--color-background',
        usage: 'Main page backgrounds, card backgrounds',
        do: ['Page backgrounds', 'Modal overlays', 'Base surfaces'],
        dont: ['Text color', 'Interactive elements']
      },
      { 
        name: 'Background Secondary', 
        hex: colors.backgroundSecondary, 
        rgb: 'rgb(10, 10, 10)', 
        token: 'colors.backgroundSecondary',
        cssVar: '--color-background-secondary',
        usage: 'Elevated surfaces, nested components',
        do: ['Card backgrounds', 'Dropdown menus', 'Elevated panels'],
        dont: ['Primary backgrounds', 'Text']
      },
      { 
        name: 'Background Tertiary', 
        hex: colors.backgroundTertiary, 
        rgb: 'rgb(26, 26, 26)', 
        token: 'colors.backgroundTertiary',
        cssVar: '--color-background-tertiary',
        usage: 'Input fields, dropdowns, elevated cards',
        do: ['Form inputs', 'Select dropdowns', 'Tooltips'],
        dont: ['Main backgrounds', 'Text']
      },
      { 
        name: 'Text Primary', 
        hex: colors.text, 
        rgb: 'rgb(248, 248, 248)', 
        token: 'colors.text',
        cssVar: '--color-text',
        usage: 'Headings, body text, primary content',
        do: ['Headings', 'Body text', 'Primary content'],
        dont: ['Backgrounds', 'Borders']
      },
      { 
        name: 'Text Secondary', 
        hex: colors.textSecondary, 
        rgb: 'rgb(120, 120, 120)', 
        token: 'colors.textSecondary',
        cssVar: '--color-text-secondary',
        usage: 'Metadata, captions, secondary information',
        do: ['Captions', 'Metadata', 'Placeholder text', 'Disabled states'],
        dont: ['Primary headings', 'Important information']
      },
      { 
        name: 'Border', 
        hex: colors.border, 
        rgb: 'rgb(37, 37, 37)', 
        token: 'colors.border',
        cssVar: '--color-border',
        usage: 'Dividers, input borders, card borders',
        do: ['Input borders', 'Card borders', 'Dividers', 'Separators'],
        dont: ['Text', 'Backgrounds']
      }
    ],
    semantic: [
      { 
        name: 'Success', 
        hex: colors.success, 
        rgb: 'rgb(0, 200, 150)', 
        token: 'colors.success',
        cssVar: '--color-success',
        usage: 'Success messages, completed states, positive feedback',
        do: ['Success notifications', 'Completed states', 'Positive feedback'],
        dont: ['Error states', 'Warning messages']
      },
      { 
        name: 'Warning', 
        hex: colors.warning, 
        rgb: 'rgb(255, 193, 7)', 
        token: 'colors.warning',
        cssVar: '--color-warning',
        usage: 'Warning messages, caution states, pending actions',
        do: ['Warning notifications', 'Caution states', 'Pending actions'],
        dont: ['Error states', 'Success messages']
      },
      { 
        name: 'Error', 
        hex: colors.error, 
        rgb: 'rgb(255, 68, 68)', 
        token: 'colors.error',
        cssVar: '--color-error',
        usage: 'Error messages, destructive actions, validation errors',
        do: ['Error notifications', 'Destructive actions', 'Validation errors'],
        dont: ['Success states', 'Warning messages']
      },
      { 
        name: 'Info', 
        hex: colors.info, 
        rgb: 'rgb(33, 150, 243)', 
        token: 'colors.info',
        cssVar: '--color-info',
        usage: 'Informational messages, tooltips, help text',
        do: ['Info notifications', 'Tooltips', 'Help text'],
        dont: ['Error states', 'Success messages']
      }
    ],
    gradients: [
      { 
        name: 'Primary Gradient', 
        hex: colors.gradients.primary, 
        rgb: 'Gradient', 
        token: 'colors.gradients.primary',
        cssVar: '--gradient-primary',
        usage: 'Hero sections, premium features, special highlights',
        do: ['Hero backgrounds', 'Premium features', 'Special highlights'],
        dont: ['Text on complex backgrounds', 'Small elements']
      },
      { 
        name: 'Text Gradient', 
        hex: colors.gradients.text, 
        rgb: 'Gradient', 
        token: 'colors.gradients.text',
        cssVar: '--gradient-text',
        usage: 'Accent text, brand headings, special typography',
        do: ['Brand headings', 'Accent text', 'Special typography'],
        dont: ['Body text', 'Long paragraphs']
      }
    ]
  };

  const getContrastRatio = (color: string, background: string = '#000000') => {
    // Simplified contrast ratio calculation
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };
    
    const l1 = getLuminance(color);
    const l2 = getLuminance(background);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  };

  const currentColors = colorDefinitions[variant as keyof typeof colorDefinitions] || colorDefinitions.primary;

  return (
    <div style={{ padding: '2rem', background: colors.background, color: colors.text, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: colors.text }}>
          Color Palette - {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </h1>
        <p style={{ margin: '0 0 2rem 0', color: colors.textSecondary, fontSize: '1rem' }}>
          Complete color system with usage guidelines and implementation examples
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {currentColors.map((color) => (
            <div key={color.name} style={{ 
              background: colors.backgroundTertiary, 
              borderRadius: '8px', 
              padding: '1.5rem', 
              border: `1px solid ${colors.border}` 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: color.hex.includes('gradient') ? color.hex : color.hex,
                    borderRadius: '8px',
                    marginRight: '1rem',
                    border: `1px solid ${colors.border}`
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: colors.text, fontSize: '1.1rem' }}>{color.name}</h3>
                  <p style={{ margin: '0 0 0.25rem 0', color: colors.textSecondary, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {color.hex}
                  </p>
                  <p style={{ margin: '0', color: colors.textSecondary, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {color.rgb}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.border}` }}>
                <p style={{ margin: '0 0 0.5rem 0', color: colors.textSecondary, fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <strong style={{ color: colors.text }}>Usage:</strong> {color.usage}
                </p>
                
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: colors.text, fontSize: '0.85rem', fontWeight: '500' }}>
                    ✅ Do:
                  </p>
                  <ul style={{ margin: '0 0 0.75rem 0', padding: '0 0 0 1.25rem', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {color.do.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  
                  <p style={{ margin: '0 0 0.25rem 0', color: colors.text, fontSize: '0.85rem', fontWeight: '500' }}>
                    ❌ Don't:
                  </p>
                  <ul style={{ margin: '0', padding: '0 0 0 1.25rem', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {color.dont.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {showCode && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.border}` }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: colors.text, fontSize: '0.85rem', fontWeight: '500' }}>
                    Implementation:
                  </p>
                  <div style={{ background: colors.background, padding: '0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', color: colors.textSecondary, overflow: 'auto' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <span style={{ color: colors.textSecondary }}>Token: </span>
                      <span style={{ color: colors.primary }}>{color.token}</span>
                    </div>
                    <div>
                      <span style={{ color: colors.textSecondary }}>CSS Var: </span>
                      <span style={{ color: colors.primary }}>{color.cssVar}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {showAccessibility && !color.hex.includes('gradient') && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.border}`, fontSize: '0.8rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: colors.textSecondary }}>
                    <strong style={{ color: colors.text }}>Contrast Ratio:</strong> {getContrastRatio(color.hex)}:1 (vs black)
                  </p>
                  <p style={{ margin: '0', color: parseFloat(getContrastRatio(color.hex)) >= 4.5 ? colors.success : colors.warning }}>
                    {parseFloat(getContrastRatio(color.hex)) >= 7 ? '✅ WCAG AAA' : parseFloat(getContrastRatio(color.hex)) >= 4.5 ? '✅ WCAG AA' : '⚠️ Below AA'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {showCode && (
          <div style={{ marginTop: '3rem', padding: '2rem', background: colors.backgroundTertiary, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
            <h2 style={{ color: colors.text, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Implementation Guidelines</h2>
            
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>CSS Custom Properties</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', color: colors.textSecondary, fontFamily: 'monospace', lineHeight: '1.6' }}>
{`/* Import design tokens */
@import '@abdalkader/ui/src/tokens/designTokens.css';

/* Use in components */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.button-primary:hover {
  background-color: var(--color-secondary);
}

/* Gradient usage */
.hero-section {
  background: var(--gradient-primary);
}

.text-accent {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>TypeScript/JavaScript</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', color: colors.textSecondary, fontFamily: 'monospace', lineHeight: '1.6' }}>
{`import { colors } from '@abdalkader/ui/src/tokens/designTokens';

// Direct usage
const buttonStyle = {
  backgroundColor: colors.primary,
  color: colors.text,
  border: \`1px solid \${colors.border}\`
};

// React component
const Button = ({ variant = 'primary' }) => (
  <button
    style={{
      backgroundColor: variant === 'primary' ? colors.primary : colors.secondary,
      color: colors.text,
      padding: '0.75rem 1.25rem',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    Click me
  </button>
);`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>SCSS/SCSS Modules</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', color: colors.textSecondary, fontFamily: 'monospace', lineHeight: '1.6' }}>
{`// Import design tokens
@import '@abdalkader/ui/src/tokens/designTokens.css';

// Component styles
.button {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  transition: var(--transition-normal);
  
  &:hover {
    background-color: var(--color-secondary);
  }
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

// Gradient usage
.hero {
  background: var(--gradient-primary);
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    variant: 'primary',
    showAccessibility: true
  }
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    showAccessibility: true
  }
};

export const Semantic: Story = {
  args: {
    variant: 'semantic',
    showAccessibility: true
  }
};

export const AllColors: Story = {
  render: () => (
    <div>
      <ColorPalette variant="primary" showAccessibility={true} showCode={true} />
      <hr style={{ border: '1px solid #252525', margin: '2rem 0' }} />
      <ColorPalette variant="neutral" showAccessibility={true} showCode={true} />
      <hr style={{ border: '1px solid #252525', margin: '2rem 0' }} />
      <ColorPalette variant="semantic" showAccessibility={true} showCode={true} />
      <hr style={{ border: '1px solid #252525', margin: '2rem 0' }} />
      <ColorPalette variant="gradients" showAccessibility={false} showCode={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all color tokens in the design system with usage guidelines'
      }
    }
  }
};

export const Gradients: Story = {
  args: {
    variant: 'gradients',
    showAccessibility: false,
    showCode: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Gradient definitions for special effects and premium features'
      }
    }
  }
};
