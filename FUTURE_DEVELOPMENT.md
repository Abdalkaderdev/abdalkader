# 🔮 Future Development Guide

Guide for extending the monorepo with new projects and features.

---

## 🎯 Adding New Projects


## 🎨 Using Design System in New Apps

### Import Components

```tsx
import { 
  Button, 
  Input, 
  Layout, 
  Container, 
  Stack 
} from '@abdalkader/ui';
import '@abdalkader/ui/dist/styles.css';
```

### Use Design Tokens (CSS)

```css
.my-component {
  color: var(--brand-primary);
  padding: var(--space-4);
  border-radius: var(--radius-base);
  font-size: var(--font-size-lg);
  transition: var(--transition-smooth);
}
```

### Use Design Tokens (JavaScript)

```tsx
import tokens from '@abdalkader/ui/src/styles/design-tokens.js';

// Colors
element.style.background = tokens.colors.brand.primary;

// GSAP Animations
gsap.from(element, {
  ...tokens.animations.gsap.fadeIn,
  ease: tokens.easings.portfolio,
});

// Framer Motion
<motion.div
  initial={tokens.animations.framer.fadeIn.initial}
  animate={tokens.animations.framer.fadeIn.animate}
/>
```

### Use SCSS Mixins

```scss
@import '@abdalkader/ui/src/styles/design-tokens.css';
@import '@abdalkader/ui/src/styles/mixins.scss';

.hero-title {
  @include font-hero;        // Responsive hero text
  @include gradient-text;    // Orange gradient
  @include margin-top-xl;    // Responsive margin
}

.button {
  @include glow-effect;      // Glow on hover
  @include button-inset;     // Inset shadow
  @include focus-visible;    // Focus outline
}
```

---

## 🌿 Branch Strategy for New Features

### Feature Development

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Develop feature
# ...

# Test
pnpm dev
pnpm build
pnpm test

# Commit
git add .
git commit -m "feat: add my feature"

# Push and create PR to develop
git push origin feature/my-feature
```

### Bug Fixes

```bash
# Create fix branch from main
git checkout main
git pull origin main
git checkout -b fix/bug-description

# Fix bug
# ...

# Test
pnpm build
pnpm test

# Commit
git add .
git commit -m "fix: resolve bug description"

# Push and create PR to main
git push origin fix/bug-description
```

### Design System Updates

```bash
# Create branch from main
git checkout main
git checkout -b design/update-tokens

# Update design system
cd packages/ui
# Make changes

# Rebuild
pnpm build

# Test in all apps
cd ../..
pnpm build

# Commit
git add .
git commit -m "design: update design tokens"

# Merge to all branches
git checkout main && git merge design/update-tokens
git checkout develop && git merge main
git checkout components && git merge main
git checkout blog && git merge main

# Push all
git push origin main develop components blog
```

---

## 📦 Adding New Components to UI Library

### Step 1: Create Component

```bash
cd packages/ui/src/components
mkdir Card
cd Card
```

### Step 2: Component Implementation

```tsx
// Card.tsx
import React from 'react';
import './Card.css';

export interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ title, children, variant = 'default' }: CardProps) {
  return (
    <div className={`card card--${variant}`}>
      <h3 className="card__title">{title}</h3>
      <div className="card__content">{children}</div>
    </div>
  );
}
```

### Step 3: Component Styles

```css
/* Card.css */
.card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  transition: var(--transition-base);
}

.card--elevated {
  box-shadow: var(--shadow-md);
}

.card--outlined {
  border: 1px solid var(--color-border);
}

.card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
}
```

### Step 4: Export Component

```ts
// index.ts
export { Card } from './Card';
export type { CardProps } from './Card';
```

```ts
// components/index.ts
export * from './Button';
export * from './Input';
export * from './Layout';
export * from './Card'; // Add new component
```

### Step 5: Add Tests

```tsx
// __tests__/Card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders title and children', () => {
    render(<Card title="Test">Content</Card>);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

### Step 6: Add Storybook Story

```tsx
// apps/docs/stories/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@abdalkader/ui';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    children: 'Card content goes here',
  },
};
```

### Step 7: Build and Test

```bash
# Build UI library
cd packages/ui
pnpm build

# Test
pnpm test

# Update Storybook
cd ../../apps/docs
pnpm dev
```

---

## 🔄 Syncing Design System Across Branches

When design system changes, sync to all branches:

```bash
# Update design system in main
git checkout main
cd packages/ui
# Make changes
pnpm build
git add .
git commit -m "design: update components"
git push origin main

# Sync to develop
git checkout develop
git merge main
git push origin develop

# Sync to components
git checkout components
git merge main
git push origin components

# Sync to blog
git checkout blog
git merge main
git push origin blog

```

---

## 📊 Project Templates

### Next.js App Template

```bash
# Create app
cd apps
npx create-next-app@latest my-app

# Configure
{
  "name": "@abdalkader/my-app",
  "dependencies": {
    "@abdalkader/ui": "workspace:*"
  }
}

# Import design system
import '@abdalkader/ui/dist/styles.css';
```

### React SPA Template

```bash
# Create app
cd apps
npm create vite@latest my-spa -- --template react-ts

# Configure
{
  "name": "@abdalkader/my-spa",
  "dependencies": {
    "@abdalkader/ui": "workspace:*"
  }
}
```

### Node.js API Template

```bash
# Create app
cd apps
mkdir api && cd api
npm init -y

# Configure
{
  "name": "@abdalkader/api",
  "type": "module"
}
```

---

## 🎯 Best Practices

### 1. Always Use Design System

```tsx
// ❌ Don't
<button style={{ background: '#f44e00' }}>Click</button>

// ✅ Do
import { Button } from '@abdalkader/ui';
<Button variant="primary">Click</Button>
```

### 2. Keep Branches Synced

```bash
# Regularly merge main to feature branches
git checkout feature/my-feature
git merge main
```

### 3. Test Before Merging

```bash
pnpm build
pnpm test
pnpm typecheck
```

### 4. Document New Features

- Update README.md
- Add Storybook stories
- Write tests
- Update CHANGELOG.md

---

## 🚀 Deployment Checklist

- [ ] Create app in `apps/` directory
- [ ] Add to pnpm workspace (automatic)
- [ ] Import `@abdalkader/ui`
- [ ] Use design tokens
- [ ] Write tests
- [ ] Create Storybook stories (if UI components)
- [ ] Create Git branch
- [ ] Push to GitHub
- [ ] Create Vercel project
- [ ] Configure custom domain
- [ ] Test deployment
- [ ] Update documentation

---

## 📚 Resources

- **Design System**: `packages/ui/DESIGN_SYSTEM.md`
- **Component Examples**: `apps/docs/stories/`
- **Architecture**: `MULTI_BRANCH_DEPLOYMENT.md`
- **Maintenance**: `MAINTENANCE.md`

---

## 🎉 You're Ready!

The monorepo is designed for easy expansion. Follow these patterns to add new projects while maintaining consistency and quality.
