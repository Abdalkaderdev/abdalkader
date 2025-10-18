# Design System Documentation

## Overview

The Abdalkader Design System is a comprehensive collection of reusable components, design tokens, and guidelines that ensure consistency across all applications in the monorepo.

## 🎨 Design Tokens

### Colors

#### Primary Palette
```css
--color-primary: #f44e00;
--color-primary-light: #fa7300;
--color-primary-dark: #d63384;
```

#### Neutral Palette
```css
--color-white: #ffffff;
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
--color-black: #000000;
```

#### Semantic Colors
```css
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Typography

#### Font Families
```css
--font-primary: 'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

#### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

#### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Border Radius

```css
--radius-sm: 0.125rem;  /* 2px */
--radius: 0.25rem;      /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;
```

## 🧩 Components

### Button

A versatile button component with multiple variants and sizes.

#### Variants
- `primary` - Main action button
- `secondary` - Secondary action button
- `outline` - Outlined button
- `ghost` - Minimal button without background
- `link` - Link-style button

#### Sizes
- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

#### Usage
```tsx
import { Button } from '@abdalkader/ui';

<Button variant="primary" size="md">
  Click me
</Button>
```

### Input

Form input component with validation states.

#### States
- `default` - Normal state
- `error` - Error state with red styling
- `success` - Success state with green styling
- `disabled` - Disabled state

#### Usage
```tsx
import { Input } from '@abdalkader/ui';

<Input
  placeholder="Enter your email"
  type="email"
  state="default"
/>
```

### Layout

Layout components for consistent page structure.

#### Components
- `Container` - Centered container with max-width
- `Grid` - CSS Grid layout
- `Flex` - Flexbox layout
- `Stack` - Vertical stack layout

#### Usage
```tsx
import { Layout, Container, Stack } from '@abdalkader/ui';

<Layout>
  <Container>
    <Stack spacing="md">
      <h1>Page Title</h1>
      <p>Page content</p>
    </Stack>
  </Container>
</Layout>
```

## 🎭 Animations

### Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-normal: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;
```

### Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## 📱 Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Mobile-First Approach

All components are designed mobile-first and scale up for larger screens.

## ♿ Accessibility

### Guidelines

- All interactive elements are keyboard accessible
- Proper ARIA labels and roles
- Sufficient color contrast ratios
- Focus indicators for keyboard navigation
- Screen reader friendly markup

### Color Contrast

- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio

## 🛠️ Development

### Adding New Components

1. Create component directory in `packages/ui/src/components/`
2. Add component files (Component.tsx, index.ts, Component.stories.tsx)
3. Export from `packages/ui/src/components/index.ts`
4. Add to Storybook stories
5. Update documentation

### Testing Components

```bash
# Run component tests
pnpm test --filter=@abdalkader/ui

# Run Storybook for visual testing
pnpm dev --filter=@abdalkader/storybook
```

## 📚 Resources

- [Storybook Component Library](https://components.abdalkader.dev)
- [Figma Design Files](https://figma.com/abdalkader-design-system)
- [Component API Reference](./api/component-props.mdx)