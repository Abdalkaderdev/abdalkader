# Monorepo Migration Guide

## ✅ Migration Complete

Your portfolio has been successfully transformed into a monorepo!

## 📁 New Structure

```
abdalkader/ (monorepo root)
├── apps/
│   ├── portfolio/              # Your Next.js portfolio
│   │   ├── components/         # Portfolio components
│   │   ├── pages/              # Next.js pages
│   │   ├── public/             # Static assets
│   │   ├── styles/             # SCSS styles
│   │   └── package.json
│   │
│   └── docs/                   # Storybook + Mintlify
│       ├── .storybook/
│       ├── stories/
│       ├── docs/
│       └── package.json
│
├── packages/
│   └── ui/                     # Component library
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button/
│       │   │   └── Input/
│       │   └── styles/
│       ├── dist/
│       └── package.json
│
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace config
├── turbo.json                  # Turborepo config
└── tsconfig.base.json          # Base TypeScript config
```

## 🚀 Next Steps

### 1. Install Dependencies

```bash
# Install pnpm if you haven't
npm install -g pnpm

# Install all dependencies
cd c:\Users\max\Desktop\react\abdalkader
pnpm install
```

### 2. Build UI Library

```bash
# Build the UI package first
pnpm --filter @abdalkader/ui build
```

### 3. Test Portfolio

```bash
# Start portfolio in dev mode
pnpm --filter @abdalkader/portfolio dev

# Visit: http://localhost:3000
```

### 4. Test Storybook

```bash
# Start Storybook
pnpm --filter @abdalkader/docs dev

# Visit: http://localhost:6006
```

### 5. Run All Apps

```bash
# Start everything
pnpm dev
```

## 🔧 Using UI Components in Portfolio

### Import Components

```tsx
// In any portfolio component
import { Button, Input } from '@abdalkader/ui';
import '@abdalkader/ui/dist/styles.css';

export default function MyPage() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Input label="Email" type="email" />
    </div>
  );
}
```

### TypeScript Support

TypeScript paths are already configured:

```json
{
  "paths": {
    "@abdalkader/ui": ["../../packages/ui/src"]
  }
}
```

## 📝 Available Scripts

### Root Level

```bash
pnpm dev          # Start all apps
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm test         # Test all packages
pnpm typecheck    # Type check all
pnpm clean        # Clean builds
```

### Portfolio

```bash
pnpm --filter @abdalkader/portfolio dev
pnpm --filter @abdalkader/portfolio build
pnpm --filter @abdalkader/portfolio start
```

### UI Library

```bash
pnpm --filter @abdalkader/ui dev
pnpm --filter @abdalkader/ui build
pnpm --filter @abdalkader/ui test
```

### Docs

```bash
pnpm --filter @abdalkader/docs dev
pnpm --filter @abdalkader/docs build
```

## 🌐 Deployment

### Vercel Setup

1. **Connect Repository**
   - Go to Vercel dashboard
   - Import `abdalkader` repository

2. **Configure Portfolio**
   - Framework: Next.js
   - Root Directory: `apps/portfolio`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @abdalkader/portfolio build`
   - Output Directory: `apps/portfolio/.next`

3. **Configure Docs**
   - Create new project
   - Root Directory: `apps/docs`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @abdalkader/docs build`
   - Output Directory: `apps/docs/storybook-static`

### Environment Variables

No changes needed - your existing env vars work the same.

## 🔄 Git Workflow

### Commit Changes

```bash
git add .
git commit -m "feat: migrate to monorepo"
git push origin main
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/new-component

# Make changes in packages/ui or apps/portfolio

# Commit and push
git add .
git commit -m "feat: add new component"
git push origin feature/new-component
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean everything
pnpm clean
rm -rf node_modules
rm pnpm-lock.yaml

# Reinstall
pnpm install
pnpm build
```

### TypeScript Errors

```bash
# Rebuild UI package
pnpm --filter @abdalkader/ui build

# Check types
pnpm typecheck
```

### Import Errors

Make sure UI library is built:

```bash
pnpm --filter @abdalkader/ui build
```

## 📚 Documentation

- **Portfolio**: Same as before, now in `apps/portfolio`
- **UI Library**: See `packages/ui/README.md`
- **Storybook**: http://localhost:6006 when running

## ✨ Benefits

1. **Shared Components**: Use UI library in portfolio
2. **Unified Codebase**: Everything in one repo
3. **Fast Builds**: Turborepo caching
4. **Type Safety**: Shared TypeScript configs
5. **Easy Development**: Run all apps with one command

## 🎯 What Changed

### Portfolio
- ✅ Moved to `apps/portfolio`
- ✅ Can now import from `@abdalkader/ui`
- ✅ All functionality preserved
- ✅ Same deployment process

### Component Library
- ✅ Moved to `packages/ui`
- ✅ Integrated with portfolio
- ✅ Storybook in `apps/docs`
- ✅ All tests working

### New Features
- ✅ Monorepo structure
- ✅ Turborepo for fast builds
- ✅ pnpm workspaces
- ✅ Shared TypeScript config
- ✅ Unified CI/CD

## 🚨 Important Notes

1. **Always build UI first**: `pnpm --filter @abdalkader/ui build`
2. **Use pnpm**: Not npm or yarn
3. **Run from root**: Most commands should run from monorepo root
4. **Import styles**: Remember to import CSS from UI package

## 📞 Need Help?

If you encounter issues:

1. Check this guide
2. Run `pnpm clean && pnpm install`
3. Rebuild UI package
4. Check Turborepo logs

## ✅ Verification Checklist

- [ ] pnpm installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] UI library builds (`pnpm --filter @abdalkader/ui build`)
- [ ] Portfolio runs (`pnpm --filter @abdalkader/portfolio dev`)
- [ ] Storybook runs (`pnpm --filter @abdalkader/docs dev`)
- [ ] All apps run together (`pnpm dev`)
- [ ] Tests pass (`pnpm test`)
- [ ] TypeScript checks pass (`pnpm typecheck`)

## 🎉 You're Ready!

Your monorepo is set up and ready to use. Start developing with:

```bash
pnpm dev
```

Happy coding! 🚀