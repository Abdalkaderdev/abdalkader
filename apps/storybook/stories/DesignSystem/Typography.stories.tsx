import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { typography, colors } from '@abdalkader/ui/src/tokens/designTokens';

// Typography scale component
const TypographyScale = ({ showCode = true, showResponsive = true, showUsage = true }: any) => {
  const typographyScale = [
    {
      name: 'Display',
      size: typography.fontSizes.display,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacings.normal,
      transform: typography.textTransform.uppercase,
      usage: 'Hero sections, main headings, landing page titles',
      token: 'typography.fontSizes.display',
      cssVar: '--font-size-display',
      do: ['Hero sections', 'Landing page titles', 'Major announcements'],
      dont: ['Body text', 'Regular headings', 'Long paragraphs'],
      mobile: '3.2rem',
      desktop: '6rem'
    },
    {
      name: 'Heading 1',
      size: typography.fontSizes.h1,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacings.normal,
      transform: typography.textTransform.uppercase,
      usage: 'Page titles, section headings, main content headers',
      token: 'typography.fontSizes.h1',
      cssVar: '--font-size-h1',
      do: ['Page titles', 'Section headings', 'Main headers'],
      dont: ['Subheadings', 'Body text', 'Captions'],
      mobile: '2.2rem',
      desktop: '4.5rem'
    },
    {
      name: 'Heading 2',
      size: typography.fontSizes.h2,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacings.wide,
      transform: typography.textTransform.uppercase,
      usage: 'Subheadings, card titles, subsection headers',
      token: 'typography.fontSizes.h2',
      cssVar: '--font-size-h2',
      do: ['Subheadings', 'Card titles', 'Subsection headers'],
      dont: ['Main headings', 'Body text', 'UI labels'],
      mobile: '1.2rem',
      desktop: '1.8rem'
    },
    {
      name: 'Heading 3',
      size: typography.fontSizes.h3,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacings.normal,
      transform: typography.textTransform.uppercase,
      usage: 'Tertiary headings, component titles',
      token: 'typography.fontSizes.h3',
      cssVar: '--font-size-h3',
      do: ['Tertiary headings', 'Component titles', 'Small section headers'],
      dont: ['Main headings', 'Body text'],
      mobile: '1rem',
      desktop: '1.25rem'
    },
    {
      name: 'Body Large',
      size: typography.fontSizes.bodyLarge,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.loose,
      letterSpacing: typography.letterSpacings.tight,
      transform: typography.textTransform.none,
      usage: 'Lead paragraphs, important text, emphasized content',
      token: 'typography.fontSizes.bodyLarge',
      cssVar: '--font-size-body-large',
      do: ['Lead paragraphs', 'Important text', 'Emphasized content'],
      dont: ['Headings', 'UI labels', 'Captions'],
      mobile: '1rem',
      desktop: '1.2rem'
    },
    {
      name: 'Body Regular',
      size: typography.fontSizes.body,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.loose,
      letterSpacing: typography.letterSpacings.tight,
      transform: typography.textTransform.none,
      usage: 'Standard body text, paragraphs, descriptions',
      token: 'typography.fontSizes.body',
      cssVar: '--font-size-body',
      do: ['Body text', 'Paragraphs', 'Descriptions', 'Content'],
      dont: ['Headings', 'UI elements', 'Captions'],
      mobile: '0.9rem',
      desktop: '1rem'
    },
    {
      name: 'Body Small',
      size: typography.fontSizes.bodySmall,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.relaxed,
      letterSpacing: typography.letterSpacings.tight,
      transform: typography.textTransform.none,
      usage: 'Secondary text, fine print, less important content',
      token: 'typography.fontSizes.bodySmall',
      cssVar: '--font-size-body-small',
      do: ['Secondary text', 'Fine print', 'Less important content'],
      dont: ['Primary content', 'Headings'],
      mobile: '0.8rem',
      desktop: '0.9rem'
    },
    {
      name: 'Caption',
      size: typography.fontSizes.caption,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.relaxed,
      letterSpacing: typography.letterSpacings.wider,
      transform: typography.textTransform.uppercase,
      usage: 'Metadata, timestamps, small labels, captions',
      token: 'typography.fontSizes.caption',
      cssVar: '--font-size-caption',
      do: ['Metadata', 'Timestamps', 'Small labels', 'Captions'],
      dont: ['Body text', 'Headings', 'Important information'],
      mobile: '0.7rem',
      desktop: '0.8rem'
    },
    {
      name: 'Micro',
      size: typography.fontSizes.micro,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacings.wider,
      transform: typography.textTransform.uppercase,
      usage: 'Tiny labels, badges, extreme small text',
      token: 'typography.fontSizes.micro',
      cssVar: '--font-size-micro',
      do: ['Tiny labels', 'Badges', 'Extreme small text'],
      dont: ['Body text', 'Readable content', 'Important information'],
      mobile: '0.625rem',
      desktop: '0.7rem'
    }
  ];

  const getResponsiveSizes = (size: string) => {
    // Extract clamp values for demonstration
    const match = size.match(/clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
    if (match) {
      return {
        mobile: match[1].trim(),
        fluid: match[2].trim(),
        desktop: match[3].trim()
      };
    }
    return { mobile: size, fluid: size, desktop: size };
  };

  return (
    <div style={{ padding: '2rem', background: colors.background, color: colors.text, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: colors.text }}>
          Typography Scale
        </h1>
        <p style={{ margin: '0 0 2rem 0', color: colors.textSecondary, fontSize: '1rem' }}>
          Complete typography system with responsive scaling and usage guidelines
        </p>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          {typographyScale.map((type) => {
            const responsive = getResponsiveSizes(type.size);
            return (
              <div key={type.name} style={{ 
                background: colors.backgroundTertiary, 
                borderRadius: '8px', 
                padding: '2rem', 
                border: `1px solid ${colors.border}` 
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ 
                    fontSize: type.size, 
                    fontWeight: type.weight,
                    lineHeight: type.lineHeight,
                    letterSpacing: type.letterSpacing,
                    textTransform: type.transform,
                    color: colors.primary,
                    margin: '0 0 0.5rem 0',
                    fontFamily: typography.fonts.primary
                  }}>
                    {type.name}
                  </h2>
                  <p style={{ 
                    fontSize: type.size, 
                    fontWeight: type.weight,
                    lineHeight: type.lineHeight,
                    letterSpacing: type.letterSpacing,
                    textTransform: type.transform,
                    color: colors.text,
                    margin: '0 0 1rem 0',
                    fontFamily: typography.fonts.primary
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                  {type.transform === 'none' && (
                    <p style={{ 
                      fontSize: type.size, 
                      fontWeight: type.weight,
                      lineHeight: type.lineHeight,
                      letterSpacing: type.letterSpacing,
                      textTransform: type.transform,
                      color: colors.textSecondary,
                      margin: '0',
                      fontFamily: typography.fonts.primary
                    }}>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                    </p>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ color: colors.primary, margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Properties</h4>
                    <ul style={{ margin: '0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.6' }}>
                      <li>Size: {type.size}</li>
                      <li>Weight: {type.weight}</li>
                      <li>Line Height: {type.lineHeight}</li>
                      <li>Letter Spacing: {type.letterSpacing}</li>
                      <li>Transform: {type.transform}</li>
                    </ul>
                  </div>
                  
                  {showUsage && (
                    <div>
                      <h4 style={{ color: colors.primary, margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Usage</h4>
                      <p style={{ margin: '0 0 0.75rem 0', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                        {type.usage}
                      </p>
                      <div>
                        <p style={{ margin: '0 0 0.25rem 0', color: colors.text, fontSize: '0.8rem', fontWeight: '500' }}>
                          ✅ Do:
                        </p>
                        <ul style={{ margin: '0 0 0.5rem 0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {type.do.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                        <p style={{ margin: '0 0 0.25rem 0', color: colors.text, fontSize: '0.8rem', fontWeight: '500' }}>
                          ❌ Don't:
                        </p>
                        <ul style={{ margin: '0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {type.dont.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {showResponsive && (
                    <div>
                      <h4 style={{ color: colors.primary, margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Responsive</h4>
                      <ul style={{ margin: '0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.6' }}>
                        <li>Mobile: {type.mobile}</li>
                        <li>Fluid: {responsive.fluid}</li>
                        <li>Desktop: {type.desktop}</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                {showCode && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.border}` }}>
                    <h4 style={{ color: colors.primary, margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Implementation</h4>
                    <div style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                      <pre style={{ margin: '0', fontFamily: typography.fonts.mono, fontSize: '0.8rem', color: colors.textSecondary, lineHeight: '1.6' }}>
{`// TypeScript Token
${type.token}

// CSS Custom Property
${type.cssVar}: ${type.size};

// CSS Usage
.${type.name.toLowerCase().replace(/\s+/g, '-')} {
  font-size: var(${type.cssVar});
  font-weight: ${type.weight};
  line-height: ${type.lineHeight};
  letter-spacing: ${type.letterSpacing};
  text-transform: ${type.transform};
  font-family: var(--font-primary);
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {showCode && (
          <div style={{ marginTop: '3rem', padding: '2rem', background: colors.backgroundTertiary, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
            <h2 style={{ color: colors.text, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Typography System Guidelines</h2>
            
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Font Loading</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: typography.fonts.mono, color: colors.textSecondary, lineHeight: '1.6' }}>
{`// Font Face Declaration
@font-face {
  font-family: 'PP Neue Montreal';
  src: url('/fonts/PPNeueMontreal-Regular.woff2') format('woff2'),
       url('/fonts/PPNeueMontreal-Regular.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'PP Neue Montreal';
  src: url('/fonts/PPNeueMontreal-Medium.woff2') format('woff2'),
       url('/fonts/PPNeueMontreal-Medium.woff') format('woff');
  font-weight: 500;
  font-display: swap;
}`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Responsive Typography</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: typography.fonts.mono, color: colors.textSecondary, lineHeight: '1.6' }}>
{`// Fluid Typography Formula
font-size: clamp(
  min-size,        // Minimum size (mobile)
  preferred-size,  // Preferred size (fluid)
  max-size         // Maximum size (desktop)
);

// Example from design tokens
font-size: clamp(2.2rem, 5vw, 4.5rem);

// Using CSS variables
.heading-1 {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-normal);
  text-transform: uppercase;
}`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>TypeScript Implementation</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: typography.fonts.mono, color: colors.textSecondary, lineHeight: '1.6' }}>
{`import { typography } from '@abdalkader/ui/src/tokens/designTokens';

// React component
const Heading = ({ level = 1, children }) => {
  const styles = {
    fontSize: typography.fontSizes[\`h\${level}\`],
    fontWeight: typography.fontWeights.light,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacings.normal,
    textTransform: typography.textTransform.uppercase,
    fontFamily: typography.fonts.primary
  };
  
  return <h{level} style={styles}>{children}</h{level}>;
};`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Best Practices</h3>
                <ul style={{ margin: '0', padding: '0 0 0 1.25rem', color: colors.textSecondary, fontSize: '0.9rem', lineHeight: '1.8' }}>
                  <li>Maintain consistent line height ratios (0.9 for headings, 1.6 for body)</li>
                  <li>Use uppercase only for headings and UI elements</li>
                  <li>Implement letter spacing for improved readability</li>
                  <li>Test typography at all viewport sizes</li>
                  <li>Ensure minimum 16px font size for body text (accessibility)</li>
                  <li>Use semantic HTML tags (h1-h6, p, span)</li>
                  <li>Import design tokens from centralized source</li>
                  <li>Support reduced motion preferences</li>
                  <li>Maintain consistent font family across components</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof TypographyScale> = {
  title: 'Design System/Typography',
  component: TypographyScale,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Typography Scale Documentation

The Abdalkader portfolio typography system is built on PP Neue Montreal with a modular scale optimized for readability and visual hierarchy. All typography follows a strict uppercase convention for headings and uses strategic letter-spacing for enhanced legibility.

## Design Principles

### Font Family
- **Primary**: PP Neue Montreal with system font fallbacks
- **Monospace**: SF Mono, Monaco, Cascadia Code for code
- **Weights**: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)
- **Token**: \`typography.fonts.primary\` or \`--font-primary\`

### Scale System
- **Modular Scale**: Based on 1.25 ratio for harmonious proportions
- **Responsive**: Fluid scaling using clamp() for seamless adaptation
- **Line Height**: 0.9 for headings, 1.0-1.6 for body text
- **Letter Spacing**: 0.025rem - 0.1rem for enhanced readability

### Typography Hierarchy

#### Display (clamp(3.2rem, 8vw, 6rem))
- **Usage**: Hero sections, landing page titles, major announcements
- **Weight**: 300 (Light)
- **Line Height**: 0.9 (Tight)
- **Transform**: Uppercase
- **Token**: \`typography.fontSizes.display\` or \`--font-size-display\`
- **When to Use**: Only for the most prominent text on a page

#### Heading 1 (clamp(2.2rem, 5vw, 4.5rem))
- **Usage**: Page titles, section headings, main content headers
- **Weight**: 300 (Light)
- **Line Height**: 0.9 (Tight)
- **Transform**: Uppercase
- **Token**: \`typography.fontSizes.h1\` or \`--font-size-h1\`
- **When to Use**: Primary page or section titles

#### Heading 2 (clamp(1.2rem, 3vw, 1.8rem))
- **Usage**: Subheadings, card titles, subsection headers
- **Weight**: 300 (Light)
- **Line Height**: 0.9 (Tight)
- **Transform**: Uppercase
- **Token**: \`typography.fontSizes.h2\` or \`--font-size-h2\`
- **When to Use**: Secondary headings within sections

#### Heading 3 (clamp(1rem, 2.5vw, 1.25rem))
- **Usage**: Tertiary headings, component titles
- **Weight**: 300 (Light)
- **Line Height**: 1.0 (Normal)
- **Transform**: Uppercase
- **Token**: \`typography.fontSizes.h3\` or \`--font-size-h3\`

#### Body Large (clamp(1rem, 2.5vw, 1.2rem))
- **Usage**: Lead paragraphs, important text, emphasized content
- **Weight**: 400 (Regular)
- **Line Height**: 1.6 (Loose)
- **Transform**: None
- **Token**: \`typography.fontSizes.bodyLarge\` or \`--font-size-body-large\`

#### Body (clamp(0.9rem, 2vw, 1rem))
- **Usage**: Standard body text, paragraphs, descriptions
- **Weight**: 400 (Regular)
- **Line Height**: 1.6 (Loose)
- **Transform**: None
- **Token**: \`typography.fontSizes.body\` or \`--font-size-body\`
- **Minimum**: 16px for accessibility

#### Caption (clamp(0.7rem, 1.5vw, 0.8rem))
- **Usage**: Metadata, timestamps, small labels, captions
- **Weight**: 400 (Regular)
- **Line Height**: 1.4 (Relaxed)
- **Transform**: Uppercase
- **Token**: \`typography.fontSizes.caption\` or \`--font-size-caption\`

## Usage Guidelines

### Headings
- ✅ **Always uppercase** for visual consistency
- ✅ **Tight line height (0.9)** for compact appearance
- ✅ **Letter spacing (0.05-0.08rem)** for improved readability
- ✅ **Light weight (300)** for modern, elegant look
- ❌ **Don't use** for body text or long paragraphs

### Body Text
- ✅ **Mixed case** for natural reading flow
- ✅ **Loose line height (1.6)** for comfortable reading
- ✅ **Regular weight (400)** for optimal readability
- ✅ **Minimum 16px** for accessibility compliance
- ❌ **Don't use** uppercase for body text

### UI Elements
- ✅ **Uppercase** for buttons, labels, navigation
- ✅ **Increased letter spacing (0.1rem)** for clarity
- ✅ **Medium weight (500)** for emphasis
- ✅ **Consistent sizing** across similar elements

## Responsive Behavior

### Fluid Typography
All font sizes use \`clamp()\` for fluid scaling:
\`\`\`css
font-size: clamp(min-size, preferred-size, max-size);
\`\`\`

### Breakpoint Behavior
- **Mobile (≤600px)**: Minimum sizes apply
- **Tablet (601-840px)**: Fluid scaling between min and max
- **Desktop (841-1200px)**: Optimal sizes
- **Large (≥1201px)**: Maximum sizes apply

## Accessibility Standards

### Requirements
- **Minimum font size**: 16px for body text (WCAG AA)
- **Contrast ratios**: All text meets 7:1 (WCAG AAA)
- **Line height**: Minimum 1.4 for body text
- **Letter spacing**: Minimum 0.05rem for headings

### Best Practices
- Test typography at all viewport sizes
- Ensure text doesn't overflow containers
- Maintain consistent hierarchy
- Use semantic HTML (h1-h6, p, span)
- Support reduced motion preferences
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    showCode: {
      control: 'boolean',
      description: 'Show implementation code examples'
    },
    showResponsive: {
      control: 'boolean',
      description: 'Show responsive breakpoints'
    },
    showUsage: {
      control: 'boolean',
      description: 'Show usage guidelines'
    }
  }
};

export default meta;
type Story = StoryObj<typeof TypographyScale>;
    {
      name: 'Display',
      size: typography.fontSizes.display,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacings.normal,
      transform: typography.textTransform.uppercase,
      usage: 'Hero sections, main headings, landing page titles',
      token: 'typography.fontSizes.display',
      cssVar: '--font-size-display',
      do: ['Hero sections', 'Landing page titles', 'Major announcements'],
      dont: ['Body text', 'Regular headings', 'Long paragraphs'],
      mobile: '3.2rem',
      desktop: '6rem'
    },
    {
      name: 'Heading 1',
      size: typography.fontSizes.h1,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacings.normal,
      transform: typography.textTransform.uppercase,
      usage: 'Page titles, section headings, main content headers',
      token: 'typography.fontSizes.h1',
      cssVar: '--font-size-h1',
      do: ['Page titles', 'Section headings', 'Main headers'],
      dont: ['Subheadings', 'Body text', 'Captions'],
      mobile: '2.2rem',
      desktop: '4.5rem'
    },
    {
      name: 'Heading 2',
      size: typography.fontSizes.h2,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacings.wide,
      transform: typography.textTransform.uppercase,
      usage: 'Subheadings, card titles, subsection headers',
      token: 'typography.fontSizes.h2',
      cssVar: '--font-size-h2',
      do: ['Subheadings', 'Card titles', 'Subsection headers'],
      dont: ['Main headings', 'Body text', 'UI labels'],
      mobile: '1.2rem',
      desktop: '1.8rem'
    },
    {
      name: 'Heading 3',
      size: typography.fontSizes.h3,
      weight: typography.fontWeights.light,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacings.normal,
      transform: typography.textTransform.uppercase,
      usage: 'Tertiary headings, component titles',
      token: 'typography.fontSizes.h3',
      cssVar: '--font-size-h3',
      do: ['Tertiary headings', 'Component titles', 'Small section headers'],
      dont: ['Main headings', 'Body text'],
      mobile: '1rem',
      desktop: '1.25rem'
    },
    {
      name: 'Body Large',
      size: typography.fontSizes.bodyLarge,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.loose,
      letterSpacing: typography.letterSpacings.tight,
      transform: typography.textTransform.none,
      usage: 'Lead paragraphs, important text, emphasized content',
      token: 'typography.fontSizes.bodyLarge',
      cssVar: '--font-size-body-large',
      do: ['Lead paragraphs', 'Important text', 'Emphasized content'],
      dont: ['Headings', 'UI labels', 'Captions'],
      mobile: '1rem',
      desktop: '1.2rem'
    },
    {
      name: 'Body Regular',
      size: typography.fontSizes.body,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.loose,
      letterSpacing: typography.letterSpacings.tight,
      transform: typography.textTransform.none,
      usage: 'Standard body text, paragraphs, descriptions',
      token: 'typography.fontSizes.body',
      cssVar: '--font-size-body',
      do: ['Body text', 'Paragraphs', 'Descriptions', 'Content'],
      dont: ['Headings', 'UI elements', 'Captions'],
      mobile: '0.9rem',
      desktop: '1rem'
    },
    {
      name: 'Body Small',
      size: typography.fontSizes.bodySmall,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.relaxed,
      letterSpacing: typography.letterSpacings.tight,
      transform: typography.textTransform.none,
      usage: 'Secondary text, fine print, less important content',
      token: 'typography.fontSizes.bodySmall',
      cssVar: '--font-size-body-small',
      do: ['Secondary text', 'Fine print', 'Less important content'],
      dont: ['Primary content', 'Headings'],
      mobile: '0.8rem',
      desktop: '0.9rem'
    },
    {
      name: 'Caption',
      size: typography.fontSizes.caption,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.relaxed,
      letterSpacing: typography.letterSpacings.wider,
      transform: typography.textTransform.uppercase,
      usage: 'Metadata, timestamps, small labels, captions',
      token: 'typography.fontSizes.caption',
      cssVar: '--font-size-caption',
      do: ['Metadata', 'Timestamps', 'Small labels', 'Captions'],
      dont: ['Body text', 'Headings', 'Important information'],
      mobile: '0.7rem',
      desktop: '0.8rem'
    },
    {
      name: 'Micro',
      size: typography.fontSizes.micro,
      weight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacings.wider,
      transform: typography.textTransform.uppercase,
      usage: 'Tiny labels, badges, extreme small text',
      token: 'typography.fontSizes.micro',
      cssVar: '--font-size-micro',
      do: ['Tiny labels', 'Badges', 'Extreme small text'],
      dont: ['Body text', 'Readable content', 'Important information'],
      mobile: '0.625rem',
      desktop: '0.7rem'
    }
  ];

  const getResponsiveSizes = (size: string) => {
    // Extract clamp values for demonstration
    const match = size.match(/clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
    if (match) {
      return {
        mobile: match[1].trim(),
        fluid: match[2].trim(),
        desktop: match[3].trim()
      };
    }
    return { mobile: size, fluid: size, desktop: size };
  };

  return (
    <div style={{ padding: '2rem', background: colors.background, color: colors.text, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: colors.text }}>
          Typography Scale
        </h1>
        <p style={{ margin: '0 0 2rem 0', color: colors.textSecondary, fontSize: '1rem' }}>
          Complete typography system with responsive scaling and usage guidelines
        </p>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          {typographyScale.map((type) => {
            const responsive = getResponsiveSizes(type.size);
            return (
              <div key={type.name} style={{ 
                background: colors.backgroundTertiary, 
                borderRadius: '8px', 
                padding: '2rem', 
                border: `1px solid ${colors.border}` 
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ 
                    fontSize: type.size, 
                    fontWeight: type.weight,
                    lineHeight: type.lineHeight,
                    letterSpacing: type.letterSpacing,
                    textTransform: type.transform,
                    color: colors.primary,
                    margin: '0 0 0.5rem 0',
                    fontFamily: typography.fonts.primary
                  }}>
                    {type.name}
                  </h2>
                  <p style={{ 
                    fontSize: type.size, 
                    fontWeight: type.weight,
                    lineHeight: type.lineHeight,
                    letterSpacing: type.letterSpacing,
                    textTransform: type.transform,
                    color: colors.text,
                    margin: '0 0 1rem 0',
                    fontFamily: typography.fonts.primary
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                  {type.transform === 'none' && (
                    <p style={{ 
                      fontSize: type.size, 
                      fontWeight: type.weight,
                      lineHeight: type.lineHeight,
                      letterSpacing: type.letterSpacing,
                      textTransform: type.transform,
                      color: colors.textSecondary,
                      margin: '0',
                      fontFamily: typography.fonts.primary
                    }}>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                    </p>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ color: colors.primary, margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Properties</h4>
                    <ul style={{ margin: '0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.6' }}>
                      <li>Size: {type.size}</li>
                      <li>Weight: {type.weight}</li>
                      <li>Line Height: {type.lineHeight}</li>
                      <li>Letter Spacing: {type.letterSpacing}</li>
                      <li>Transform: {type.transform}</li>
                    </ul>
                  </div>
                  
                  {showUsage && (
                    <div>
                      <h4 style={{ color: colors.primary, margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Usage</h4>
                      <p style={{ margin: '0 0 0.75rem 0', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.5' }}>
                        {type.usage}
                      </p>
                      <div>
                        <p style={{ margin: '0 0 0.25rem 0', color: colors.text, fontSize: '0.8rem', fontWeight: '500' }}>
                          ✅ Do:
                        </p>
                        <ul style={{ margin: '0 0 0.5rem 0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {type.do.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                        <p style={{ margin: '0 0 0.25rem 0', color: colors.text, fontSize: '0.8rem', fontWeight: '500' }}>
                          ❌ Don't:
                        </p>
                        <ul style={{ margin: '0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {type.dont.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {showResponsive && (
                    <div>
                      <h4 style={{ color: colors.primary, margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Responsive</h4>
                      <ul style={{ margin: '0', padding: '0 0 0 1rem', color: colors.textSecondary, fontSize: '0.85rem', lineHeight: '1.6' }}>
                        <li>Mobile: {type.mobile}</li>
                        <li>Fluid: {responsive.fluid}</li>
                        <li>Desktop: {type.desktop}</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                {showCode && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.border}` }}>
                    <h4 style={{ color: colors.primary, margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Implementation</h4>
                    <div style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                      <pre style={{ margin: '0', fontFamily: typography.fonts.mono, fontSize: '0.8rem', color: colors.textSecondary, lineHeight: '1.6' }}>
{`// TypeScript Token
${type.token}

// CSS Custom Property
${type.cssVar}: ${type.size};

// CSS Usage
.${type.name.toLowerCase().replace(/\s+/g, '-')} {
  font-size: var(${type.cssVar});
  font-weight: ${type.weight};
  line-height: ${type.lineHeight};
  letter-spacing: ${type.letterSpacing};
  text-transform: ${type.transform};
  font-family: var(--font-primary);
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {showCode && (
          <div style={{ marginTop: '3rem', padding: '2rem', background: colors.backgroundTertiary, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
            <h2 style={{ color: colors.text, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Typography System Guidelines</h2>
            
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Font Loading</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: typography.fonts.mono, color: colors.textSecondary, lineHeight: '1.6' }}>
{`// Font Face Declaration
@font-face {
  font-family: 'PP Neue Montreal';
  src: url('/fonts/PPNeueMontreal-Regular.woff2') format('woff2'),
       url('/fonts/PPNeueMontreal-Regular.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'PP Neue Montreal';
  src: url('/fonts/PPNeueMontreal-Medium.woff2') format('woff2'),
       url('/fonts/PPNeueMontreal-Medium.woff') format('woff');
  font-weight: 500;
  font-display: swap;
}`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Responsive Typography</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: typography.fonts.mono, color: colors.textSecondary, lineHeight: '1.6' }}>
{`// Fluid Typography Formula
font-size: clamp(
  min-size,        // Minimum size (mobile)
  preferred-size,  // Preferred size (fluid)
  max-size         // Maximum size (desktop)
);

// Example from design tokens
font-size: clamp(2.2rem, 5vw, 4.5rem);

// Using CSS variables
.heading-1 {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-normal);
  text-transform: uppercase;
}`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>TypeScript Implementation</h3>
                <pre style={{ background: colors.background, padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: typography.fonts.mono, color: colors.textSecondary, lineHeight: '1.6' }}>
{`import { typography } from '@abdalkader/ui/src/tokens/designTokens';

// React component
const Heading = ({ level = 1, children }) => {
  const styles = {
    fontSize: typography.fontSizes[\`h\${level}\`],
    fontWeight: typography.fontWeights.light,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacings.normal,
    textTransform: typography.textTransform.uppercase,
    fontFamily: typography.fonts.primary
  };
  
  return <h{level} style={styles}>{children}</h{level}>;
};`}
                </pre>
              </div>
              
              <div>
                <h3 style={{ color: colors.primary, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Best Practices</h3>
                <ul style={{ margin: '0', padding: '0 0 0 1.25rem', color: colors.textSecondary, fontSize: '0.9rem', lineHeight: '1.8' }}>
                  <li>Maintain consistent line height ratios (0.9 for headings, 1.6 for body)</li>
                  <li>Use uppercase only for headings and UI elements</li>
                  <li>Implement letter spacing for improved readability</li>
                  <li>Test typography at all viewport sizes</li>
                  <li>Ensure minimum 16px font size for body text (accessibility)</li>
                  <li>Use semantic HTML tags (h1-h6, p, span)</li>
                  <li>Import design tokens from centralized source</li>
                  <li>Support reduced motion preferences</li>
                  <li>Maintain consistent font family across components</li>
                </ul>
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
    showCode: true,
    showResponsive: true,
    showUsage: true
  }
};

export const WithoutCode: Story = {
  args: {
    showCode: false,
    showResponsive: true,
    showUsage: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Typography scale without implementation code for cleaner presentation'
      }
    }
  }
};

export const UsageGuidelines: Story = {
  args: {
    showCode: false,
    showResponsive: false,
    showUsage: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on usage guidelines and best practices for each typography scale'
      }
    }
  }
};

export const MobileView: Story = {
  render: () => (
    <div style={{ maxWidth: '375px', margin: '0 auto', border: `1px solid ${colors.border}` }}>
      <TypographyScale showCode={false} showResponsive={true} showUsage={true} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'iphone12'
    },
    docs: {
      description: {
        story: 'Typography scale as it appears on mobile devices with responsive behavior'
      }
    }
  }
};
