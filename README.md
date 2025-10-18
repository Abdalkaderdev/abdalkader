# Abdalkader Monorepo

A comprehensive monorepo containing multiple applications and shared packages for Abdalkader's digital presence.

## 🏗️ Structure

```
workspace/
├── apps/
│   ├── blog/          # Hexo blog with Icarus theme
│   ├── docs/          # Mintlify documentation
│   ├── portfolio/     # Next.js portfolio website
│   └── storybook/     # Storybook component library
├── packages/
│   └── ui/            # Shared UI component library
└── scripts/           # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development servers
pnpm dev
```

## 📦 Applications

### Portfolio (`apps/portfolio/`)
- **Framework:** Next.js 14.2.25
- **Purpose:** Main portfolio website
- **URL:** https://abdalkader.dev
- **Build:** `pnpm build:portfolio`

### Blog (`apps/blog/`)
- **Framework:** Hexo with Icarus theme
- **Purpose:** Technical blog and articles
- **URL:** https://blog.abdalkader.dev
- **Build:** `pnpm build:blog`

### Storybook (`apps/storybook/`)
- **Framework:** Storybook 7.6.20
- **Purpose:** Component library documentation
- **URL:** https://components.abdalkader.dev
- **Build:** `pnpm build:storybook`

### Docs (`apps/docs/`)
- **Framework:** Mintlify
- **Purpose:** Comprehensive project documentation
- **URL:** https://docs.abdalkader.dev
- **Build:** `pnpm build:docs`

## 🎨 Design System

The shared UI component library (`packages/ui/`) provides:

- **Button** - Versatile button component with multiple variants
- **Input** - Form input components with validation states
- **Layout** - Layout components for consistent structure
- **Design Tokens** - Colors, typography, spacing, and animations

### Usage
```tsx
import { Button, Input, Layout } from '@abdalkader/ui';

function MyComponent() {
  return (
    <Layout>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Layout>
  );
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start all dev servers
pnpm dev --filter=@abdalkader/portfolio  # Start specific app

# Building
pnpm build               # Build all packages
pnpm build:portfolio     # Build portfolio
pnpm build:blog          # Build blog
pnpm build:storybook     # Build storybook
pnpm build:docs          # Build docs
pnpm build:ui            # Build UI package

# Quality
pnpm lint                # Lint all packages
pnpm typecheck           # Type check all packages
pnpm test                # Run all tests

# Cleanup
pnpm clean               # Clean all build artifacts
```

### Technology Stack

- **Frontend:** React, Next.js, TypeScript
- **Styling:** SCSS, CSS Modules
- **Blog:** Hexo with Icarus theme
- **Documentation:** Mintlify, Storybook
- **Build Tool:** Turborepo, Rollup
- **Package Manager:** pnpm
- **Deployment:** Vercel

## 🚀 Deployment

### Vercel Multi-Branch Deployment

The project uses Vercel's multi-branch deployment strategy:

- **Main Branch** → Portfolio (abdalkader.dev)
- **Blog Branch** → Blog (blog.abdalkader.dev)
- **Components Branch** → Storybook (components.abdalkader.dev)
- **Docs Branch** → Documentation (docs.abdalkader.dev)

### Environment Variables

Each app may require specific environment variables. Check individual app documentation for details.

## 📚 Documentation

- [Design System Guide](./DESIGN_SYSTEM.md)
- [Blog Integration Guide](./BLOG_INTEGRATION.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Abdalkader**
- Website: https://abdalkader.dev
- GitHub: https://github.com/Abdalkaderdev
- LinkedIn: https://linkedin.com/in/abdalkader