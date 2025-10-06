# @abdalkader/ui

React Component Library for the Abdalkader monorepo.

## Components

- **Button**: Versatile button with variants and sizes
- **Input**: Accessible input with label and error states

## Development

```bash
# From monorepo root
pnpm --filter @abdalkader/ui dev

# Or from this directory
pnpm dev
```

## Building

```bash
# From monorepo root
pnpm --filter @abdalkader/ui build

# Or from this directory
pnpm build
```

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Usage in Portfolio

```tsx
import { Button, Input } from '@abdalkader/ui';
import '@abdalkader/ui/dist/styles.css';

function MyComponent() {
  return (
    <>
      <Button variant="primary">Click me</Button>
      <Input label="Email" type="email" />
    </>
  );
}
```

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   └── Input/
│   ├── styles/
│   └── index.ts
├── dist/              # Build output
├── package.json
├── rollup.config.js
├── tsconfig.json
└── vitest.config.ts
```