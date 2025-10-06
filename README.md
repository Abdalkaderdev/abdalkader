# 🚀 Abdalkader Monorepo

Enterprise-level monorepo featuring portfolio, component library, documentation, and blog with multi-branch deployment strategy.

## 🌐 Live URLs

- **Portfolio (Production)**: https://abdalkader.dev
- **Portfolio (Staging)**: https://dev.abdalkader.dev
- **Component Library**: https://components.abdalkader.dev
- **Blog**: https://blog.abdalkader.dev

## 📦 Architecture

```
abdalkader/
├── apps/
│   ├── portfolio/      # Next.js 14 portfolio (main, develop)
│   ├── docs/           # Storybook documentation (components)
│   └── blog/           # Hexo blog (blog)
├── packages/
│   └── ui/             # Shared component library
├── scripts/            # Build and deployment scripts
└── docs/              # Documentation
```

## 🎯 Tech Stack

- **Framework**: Next.js 14, Hexo 8
- **UI Library**: React 18, TypeScript 5
- **Styling**: SCSS Modules, CSS Custom Properties
- **Animations**: GSAP, Framer Motion
- **Build**: Turborepo, Rollup, pnpm workspaces
- **Documentation**: Storybook 7, Mintlify
- **Testing**: Vitest, Testing Library, jest-axe
- **Deployment**: Vercel (multi-branch)

## 🚀 Quick Start

### Prerequisites

- Node.js ≥18.0.0
- pnpm ≥8.0.0

### Installation

```bash
# Clone repository
git clone https://github.com/Abdalkaderdev/abdalkader.git
cd abdalkader

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### Development Servers

- Portfolio: http://localhost:3000
- Storybook: http://localhost:6006
- Blog: http://localhost:4000

## 📋 Available Commands

### Root Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all projects
pnpm lint             # Lint all packages
pnpm test             # Test all packages
pnpm typecheck        # Type check all packages
pnpm clean            # Clean build artifacts
```

### Portfolio Commands

```bash
pnpm --filter @abdalkader/portfolio dev
pnpm --filter @abdalkader/portfolio build
pnpm --filter @abdalkader/portfolio start
```

### Component Library Commands

```bash
pnpm --filter @abdalkader/ui dev
pnpm --filter @abdalkader/ui build
pnpm --filter @abdalkader/ui test
pnpm --filter @abdalkader/ui test:coverage
```

### Storybook Commands

```bash
pnpm --filter @abdalkader/docs dev
pnpm --filter @abdalkader/docs build-storybook
```

### Blog Commands

```bash
pnpm --filter @abdalkader/blog dev
pnpm --filter @abdalkader/blog build
pnpm --filter @abdalkader/blog clean
```

## 🌿 Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|------------|
| `main` | Production portfolio | abdalkader.dev |
| `develop` | Staging portfolio | dev.abdalkader.dev |
| `components` | Component documentation | components.abdalkader.dev |
| `blog` | Blog content | blog.abdalkader.dev |

## 🎨 Design System

All apps share a unified design system from `@abdalkader/ui`:

```tsx
import { Button, Input, Layout } from '@abdalkader/ui';
import '@abdalkader/ui/dist/styles.css';

// Use design tokens
import tokens from '@abdalkader/ui/src/styles/design-tokens.js';
```

### Design Tokens

- **Colors**: `#f44e00` (primary), `#fa7300` (accent)
- **Fonts**: PPNeueMontreal-Regular, PPNeueMontreal-Medium
- **Spacing**: 0.7rem to 10rem scale
- **Animations**: GSAP with `cubic-bezier(0.19, 1, 0.22, 1)`

## 🔄 Development Workflow

### Adding a New Feature

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ...

# Test locally
pnpm dev
pnpm build

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature

# Create PR to develop
```

### Deploying to Production

```bash
# Merge develop to main
git checkout main
git merge develop
git push origin main

# Auto-deploys to abdalkader.dev
```

### Adding a Blog Post

```bash
# Switch to blog branch
git checkout blog

# Create new post
cd apps/blog
npm run new "My New Post"

# Edit post
# apps/blog/source/_posts/My-New-Post.md

# Commit and push
git add .
git commit -m "post: add new blog post"
git push origin blog

# Auto-deploys to blog.abdalkader.dev
```

## 📚 Documentation

- **Architecture**: `MULTI_BRANCH_DEPLOYMENT.md`
- **Design System**: `packages/ui/DESIGN_SYSTEM.md`
- **Blog Integration**: `BLOG_INTEGRATION_SUCCESS.md`
- **Deployment**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **Future Development**: `FUTURE_DEVELOPMENT.md`
- **Maintenance**: `MAINTENANCE.md`

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test specific package
pnpm --filter @abdalkader/ui test

# Coverage report
pnpm --filter @abdalkader/ui test:coverage

# Accessibility tests
pnpm --filter @abdalkader/ui test:a11y
```

## 🏗️ Building

```bash
# Build all projects
pnpm build

# Build specific project
pnpm --filter @abdalkader/portfolio build
pnpm --filter @abdalkader/ui build
pnpm --filter @abdalkader/docs build-storybook
pnpm --filter @abdalkader/blog build
```

## 🚀 Deployment

All branches auto-deploy to Vercel on push:

- Push to `main` → abdalkader.dev
- Push to `develop` → dev.abdalkader.dev
- Push to `components` → components.abdalkader.dev
- Push to `blog` → blog.abdalkader.dev

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request to `develop`

## 📄 License

Private - All rights reserved

## 👤 Author

**Abdalkader**
- Website: https://abdalkader.dev
- GitHub: [@Abdalkaderdev](https://github.com/Abdalkaderdev)
- Blog: https://blog.abdalkader.dev

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- GSAP for animation library
- Hexo for blog platform
- Storybook for component documentation
