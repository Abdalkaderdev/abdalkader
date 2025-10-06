# Quick Command Reference

## ✅ Component Library Already Integrated!

Location: `packages/ui/`

## 🚀 Essential Commands

### Initial Setup (Run Once)

```bash
# 1. Install dependencies
pnpm install

# 2. Build UI library
pnpm --filter @abdalkader/ui build

# 3. Start everything
pnpm dev
```

### Daily Development

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm --filter @abdalkader/portfolio dev    # Portfolio only
pnpm --filter @abdalkader/docs dev         # Storybook only
pnpm --filter @abdalkader/ui dev           # UI watch mode
```

### Building

```bash
# Build everything
pnpm build

# Build specific package
pnpm --filter @abdalkader/ui build
pnpm --filter @abdalkader/portfolio build
pnpm --filter @abdalkader/docs build
```

### Testing

```bash
# Test UI library
pnpm --filter @abdalkader/ui test

# Test with coverage
pnpm --filter @abdalkader/ui test:coverage

# Watch mode
pnpm --filter @abdalkader/ui test:watch
```

### Type Checking

```bash
# Check all packages
pnpm typecheck

# Check specific package
pnpm --filter @abdalkader/ui typecheck
pnpm --filter @abdalkader/portfolio typecheck
```

### Cleaning

```bash
# Clean all builds
pnpm clean

# Clean specific package
pnpm --filter @abdalkader/ui clean
```

## 📦 Package Filters

Use `--filter` to target specific packages:

- `@abdalkader/portfolio` - Portfolio app
- `@abdalkader/docs` - Storybook + Mintlify
- `@abdalkader/ui` - Component library

## 🎯 Common Workflows

### Adding a New Component

```bash
# 1. Create component in packages/ui/src/components/
# 2. Add tests
# 3. Add Storybook story
# 4. Build
pnpm --filter @abdalkader/ui build

# 5. Test
pnpm --filter @abdalkader/ui test

# 6. View in Storybook
pnpm --filter @abdalkader/docs dev
```

### Using Component in Portfolio

```tsx
// 1. Import in portfolio
import { Button } from '@abdalkader/ui';
import '@abdalkader/ui/dist/styles.css';

// 2. Use it
<Button variant="primary">Click me</Button>
```

### Fixing Build Issues

```bash
# 1. Clean everything
pnpm clean
rm -rf node_modules pnpm-lock.yaml

# 2. Reinstall
pnpm install

# 3. Rebuild
pnpm build
```

## 🌐 URLs

- **Portfolio**: http://localhost:3000
- **Storybook**: http://localhost:6006

## 📝 File Locations

- **Portfolio**: `apps/portfolio/`
- **UI Library**: `packages/ui/`
- **Storybook**: `apps/docs/`
- **Root Config**: `package.json`, `turbo.json`, `pnpm-workspace.yaml`