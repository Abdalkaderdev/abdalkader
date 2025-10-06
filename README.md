# Abdalkader Monorepo

Personal portfolio and component library monorepo.

## Structure

```
abdalkader/
├── apps/
│   ├── portfolio/    # Next.js portfolio (abdalkader.dev)
│   └── docs/         # Storybook + Mintlify docs
├── packages/
│   └── ui/           # @abdalkader/ui component library
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm --filter @abdalkader/portfolio dev
pnpm --filter @abdalkader/docs dev
pnpm --filter @abdalkader/ui dev
```

### Building

```bash
# Build all
pnpm build

# Build specific package
pnpm --filter @abdalkader/ui build
pnpm --filter @abdalkader/portfolio build
```

### Testing

```bash
# Run all tests
pnpm test

# Test UI library
pnpm --filter @abdalkader/ui test
```

## Apps

### Portfolio (`apps/portfolio`)
- **URL**: https://abdalkader.dev
- **Tech**: Next.js 14, SCSS, GSAP, Framer Motion
- **Purpose**: Personal portfolio website

### Docs (`apps/docs`)
- **URL**: https://abdalkader.dev/storybook
- **Tech**: Storybook, Mintlify
- **Purpose**: Component library documentation

## Packages

### UI (`packages/ui`)
- **Package**: `@abdalkader/ui`
- **Tech**: React, TypeScript, Rollup
- **Purpose**: Reusable component library

## Deployment

### Portfolio
- Platform: Vercel
- Auto-deploys from `main` branch
- URL: https://abdalkader.dev

### Docs
- Platform: Vercel
- Auto-deploys from `main` branch
- URL: https://abdalkader.dev/storybook

## Scripts

```bash
pnpm dev          # Start all apps in dev mode
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm test         # Test all packages
pnpm typecheck    # Type check all packages
pnpm clean        # Clean all build artifacts
```

## License

MIT © Abdalkader