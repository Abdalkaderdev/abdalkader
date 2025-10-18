# Deployment Guide

## Overview

This guide covers the deployment strategy for the Abdalkader monorepo using Vercel's multi-branch deployment system.

## 🚀 Deployment Strategy

### Multi-Branch Deployment

Each branch deploys to a specific subdomain:

| Branch | App | URL | Framework |
|--------|-----|-----|-----------|
| `main` | Portfolio | https://abdalkader.dev | Next.js |
| `blog` | Blog | https://blog.abdalkader.dev | Hexo |
| `components` | Storybook | https://components.abdalkader.dev | Storybook |
| `docs` | Documentation | https://docs.abdalkader.dev | Mintlify |

## 📦 Vercel Configuration

### Root Configuration (`vercel.json`)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm turbo run build --filter=@abdalkader/portfolio",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "outputDirectory": "apps/portfolio/.next",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_ENVIRONMENT": "@vercel/git-branch-name"
  },
  "git": {
    "deploymentEnabled": {
      "main": true,
      "components": true,
      "blog": true,
      "docs": true
    }
  }
}
```

### App-Specific Configurations

#### Portfolio (`apps/portfolio/vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm turbo run build --filter=@abdalkader/portfolio",
  "outputDirectory": ".next"
}
```

#### Blog (`apps/blog/vercel.json`)
```json
{
  "framework": "hexo",
  "buildCommand": "hexo generate",
  "outputDirectory": "public"
}
```

#### Storybook (`apps/storybook/vercel.json`)
```json
{
  "framework": "storybook",
  "buildCommand": "pnpm turbo run build --filter=@abdalkader/storybook",
  "outputDirectory": "storybook-static"
}
```

#### Docs (`apps/docs/vercel.json`)
```json
{
  "framework": "docusaurus",
  "buildCommand": "echo 'Mintlify docs are built on deployment'",
  "outputDirectory": "."
}
```

## 🔧 Environment Variables

### Required Environment Variables

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_UMAMI_ID=your-umami-id

# API Keys
NEXT_PUBLIC_API_URL=https://api.abdalkader.dev

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_COMMENTS=true
```

### Branch-Specific Variables

#### Main Branch (Portfolio)
```bash
NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
NEXT_PUBLIC_ENVIRONMENT=production
```

#### Blog Branch
```bash
BLOG_URL=https://blog.abdalkader.dev
HEXO_THEME=icarus
```

#### Components Branch
```bash
STORYBOOK_URL=https://components.abdalkader.dev
```

#### Docs Branch
```bash
DOCS_URL=https://docs.abdalkader.dev
```

## 🚀 Deployment Process

### Automatic Deployment

Deployments are triggered automatically on push to respective branches:

```bash
# Deploy portfolio
git push origin main

# Deploy blog
git push origin blog

# Deploy storybook
git push origin components

# Deploy docs
git push origin docs
```

### Manual Deployment

```bash
# Deploy specific app
vercel --prod --cwd apps/portfolio

# Deploy with specific configuration
vercel --prod --cwd apps/blog --config vercel-blog.json
```

### Preview Deployments

Every pull request creates a preview deployment:

```bash
# Create feature branch
git checkout -b feature/new-feature

# Push for preview
git push origin feature/new-feature
```

## 🔍 Build Process

### Build Commands

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build:portfolio
pnpm build:blog
pnpm build:storybook
pnpm build:docs
```

### Build Dependencies

The build process follows this dependency order:

1. **UI Package** - Built first as other apps depend on it
2. **Portfolio** - Depends on UI package
3. **Blog** - Independent build
4. **Storybook** - Depends on UI package
5. **Docs** - Independent build

### Build Optimization

- **Caching** - Turborepo caches build outputs
- **Parallel Builds** - Independent apps build in parallel
- **Incremental Builds** - Only changed packages rebuild

## 📊 Monitoring and Analytics

### Performance Monitoring

- **Core Web Vitals** - Tracked via Google Analytics
- **Build Times** - Monitored via Vercel dashboard
- **Error Tracking** - Sentry integration for error monitoring

### Analytics Setup

```javascript
// Google Analytics 4
gtag('config', 'G-XXXXXXXXXX', {
  page_title: document.title,
  page_location: window.location.href
});

// Umami Analytics
umami.track('page_view', {
  url: window.location.pathname,
  referrer: document.referrer
});
```

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

#### Deployment Issues

```bash
# Check Vercel logs
vercel logs

# Redeploy specific app
vercel --prod --cwd apps/portfolio --force
```

#### Environment Variable Issues

```bash
# Check environment variables
vercel env ls

# Add missing variable
vercel env add VARIABLE_NAME
```

### Debug Commands

```bash
# Check build locally
pnpm build:portfolio

# Test specific app
pnpm dev --filter=@abdalkader/portfolio

# Verify Vercel configuration
vercel --cwd apps/portfolio --debug
```

## 🔒 Security

### Security Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Content Security Policy

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

## 📈 Performance Optimization

### Build Optimization

- **Tree Shaking** - Remove unused code
- **Code Splitting** - Split code by routes
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Preload critical fonts

### Runtime Optimization

- **CDN** - Vercel Edge Network
- **Caching** - Static asset caching
- **Compression** - Gzip/Brotli compression
- **Minification** - CSS and JS minification

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main, blog, components, docs]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Quality Gates

- **Linting** - ESLint and Prettier
- **Type Checking** - TypeScript compilation
- **Testing** - Unit and integration tests
- **Build Verification** - Successful build required

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Hexo Deployment](https://hexo.io/docs/deployment)
- [Storybook Deployment](https://storybook.js.org/docs/react/sharing/publish-storybook)