# Quick Commands Reference

## 🚀 Development

```bash
# Start all development servers
pnpm dev

# Start specific app
pnpm dev --filter=@abdalkader/portfolio
pnpm dev --filter=@abdalkader/blog
pnpm dev --filter=@abdalkader/storybook
pnpm dev --filter=@abdalkader/docs
```

## 🏗️ Building

```bash
# Build all apps
pnpm build

# Build specific apps
pnpm build:portfolio
pnpm build:blog
pnpm build:storybook
pnpm build:docs
pnpm build:ui
```

## 🧹 Cleanup

```bash
# Clean all build artifacts
pnpm clean

# Clean specific app
pnpm clean --filter=@abdalkader/portfolio

# Clean everything including node_modules
pnpm clean && rm -rf node_modules
```

## 🔍 Quality Checks

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=@abdalkader/ui
```

## 📦 Package Management

```bash
# Install dependencies
pnpm install

# Add dependency to specific package
pnpm add react --filter=@abdalkader/portfolio

# Add dev dependency
pnpm add -D typescript --filter=@abdalkader/ui

# Update dependencies
pnpm update

# Remove dependency
pnpm remove react --filter=@abdalkader/portfolio
```

## 🚀 Deployment

```bash
# Deploy to Vercel (from root)
vercel --prod

# Deploy specific app
vercel --prod --cwd apps/portfolio
vercel --prod --cwd apps/blog
vercel --prod --cwd apps/storybook
vercel --prod --cwd apps/docs

# Deploy with specific config
vercel --prod --cwd apps/blog --config vercel-blog.json
```

## 📝 Blog Management

```bash
# Navigate to blog
cd apps/blog

# Create new post
hexo new "Post Title"

# Create draft
hexo new draft "Draft Title"

# Publish draft
hexo publish "draft-title"

# Start development server
hexo server

# Build blog
hexo generate

# Clean blog
hexo clean
```

## 🎨 Storybook

```bash
# Navigate to storybook
cd apps/storybook

# Start development server
pnpm dev

# Build storybook
pnpm build

# Run tests
pnpm test

# Clean build
pnpm clean
```

## 📚 Documentation

```bash
# Navigate to docs
cd apps/docs

# Start Mintlify dev server
pnpm dev

# Build docs (if needed)
pnpm build

# Clean docs
pnpm clean
```

## 🔧 Troubleshooting

```bash
# Clear all caches
pnpm clean
rm -rf node_modules
rm -rf .turbo
pnpm install

# Reset specific app
cd apps/portfolio
rm -rf .next
rm -rf node_modules
pnpm install

# Check for issues
pnpm lint
pnpm typecheck
pnpm test
```

## 📊 Monitoring

```bash
# Check build status
pnpm build --dry-run

# Check dependencies
pnpm list

# Check outdated packages
pnpm outdated

# Check for security issues
pnpm audit
```

## 🌐 URLs

- **Portfolio:** http://localhost:3000
- **Blog:** http://localhost:4000
- **Storybook:** http://localhost:6006
- **Docs:** http://localhost:3001

## 📁 Important Directories

```
workspace/
├── apps/
│   ├── portfolio/     # Next.js app
│   ├── blog/          # Hexo blog
│   ├── storybook/     # Storybook
│   └── docs/          # Mintlify docs
├── packages/
│   └── ui/            # Shared components
└── scripts/           # Build scripts
```

## ⚡ Turbo Commands

```bash
# Run command for all packages
turbo run build

# Run command for specific package
turbo run build --filter=@abdalkader/portfolio

# Run command for packages that depend on UI
turbo run build --filter=...@abdalkader/ui

# Run command with dependencies
turbo run build --filter=@abdalkader/portfolio...
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Create blog branch
git checkout -b blog

# Create components branch
git checkout -b components

# Create docs branch
git checkout -b docs

# Push and deploy
git push origin main
git push origin blog
git push origin components
git push origin docs
```