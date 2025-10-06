# 🏗️ Multi-Branch Deployment Architecture

## Overview

Enterprise-level deployment strategy using **ONE monorepo** with **multiple Vercel projects** for different branches and subdomains.

---

## 🎯 Target Architecture

| Branch | Subdomain | App | Purpose |
|--------|-----------|-----|---------|
| `main` | `abdalkader.dev` | Portfolio | Production portfolio |
| `develop` | `dev.abdalkader.dev` | Portfolio | Staging/preview |
| `components` | `components.abdalkader.dev` | Storybook | Component library docs |
| `blog` | `blog.abdalkader.dev` | Blog | Future blog (Next.js) |
| `ai-editor` | `editor.abdalkader.dev` | AI Editor | AI code editor app |

---

## 🏛️ Architecture Strategy

### Approach: Multiple Vercel Projects (Recommended)

**Why?** Vercel doesn't support branch → subdomain mapping in a single project. Solution: Create separate Vercel projects, each watching a specific branch.

### Structure

```
abdalkader/ (monorepo)
├── apps/
│   ├── portfolio/      → main, develop branches
│   ├── docs/           → components branch
│   ├── blog/           → blog branch (future)
│   └── ai-editor/      → ai-editor branch (future)
├── packages/
│   ├── ui/             → Shared component library
│   └── design-system/  → Shared design tokens
└── vercel-*.json       → Branch-specific configs
```

---

## 📋 Implementation Steps

### Phase 1: Create Branches

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Create and push develop branch
git checkout -b develop
git push -u origin develop

# Create and push components branch
git checkout -b components
git push -u origin components

# Back to main
git checkout main
```

### Phase 2: Create Vercel Projects

#### Project 1: Portfolio (Production)
1. Go to https://vercel.com/new
2. Import repository
3. Configure:
   - **Project Name**: `abdalkader-portfolio`
   - **Framework**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `pnpm turbo run build --filter=@abdalkader/portfolio`
   - **Output Directory**: `apps/portfolio/.next`
   - **Install Command**: `pnpm install`
4. **Git Settings**:
   - Production Branch: `main`
   - Ignored Build Step: Leave empty
5. **Domains**: `abdalkader.dev`, `www.abdalkader.dev`

#### Project 2: Portfolio (Staging)
1. Create new project from same repo
2. Configure:
   - **Project Name**: `abdalkader-portfolio-dev`
   - Same build settings as Project 1
3. **Git Settings**:
   - Production Branch: `develop`
4. **Domains**: `dev.abdalkader.dev`

#### Project 3: Component Library
1. Create new project from same repo
2. Configure:
   - **Project Name**: `abdalkader-components`
   - **Framework**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd apps/docs && pnpm build-storybook`
   - **Output Directory**: `apps/docs/storybook-static`
   - **Install Command**: `pnpm install`
3. **Git Settings**:
   - Production Branch: `components`
4. **Domains**: `components.abdalkader.dev`

---

## 🎨 Design System Setup

### Shared Design Tokens

All apps import from `@abdalkader/ui`:

```tsx
// In any app
import '@abdalkader/ui/dist/styles.css';
import { Button, Input } from '@abdalkader/ui';
```

### Design Token Structure

```
packages/ui/src/styles/
├── design-tokens.css    ← Brand colors, spacing, typography
├── base.css             ← Reset + design tokens
├── components/
│   ├── Button.css
│   └── Input.css
└── utilities.css        ← Helper classes
```

### Using Design Tokens

```css
/* In any app's custom styles */
.my-component {
  color: var(--brand-primary);
  padding: var(--space-4);
  border-radius: var(--radius-base);
  font-size: var(--font-size-lg);
  box-shadow: var(--shadow-md);
}
```

---

## 🚀 Deployment Workflow

### Main Branch (Production)
```bash
git checkout main
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main
# → Auto-deploys to abdalkader.dev
```

### Develop Branch (Staging)
```bash
git checkout develop
git merge main  # or make changes directly
git push origin develop
# → Auto-deploys to dev.abdalkader.dev
```

### Components Branch (Storybook)
```bash
git checkout components
# Update Storybook stories
git add .
git commit -m "docs: add new component story"
git push origin components
# → Auto-deploys to components.abdalkader.dev
```

---

## 🔧 Branch-Specific Configuration

### vercel-portfolio.json (main, develop)
```json
{
  "buildCommand": "pnpm turbo run build --filter=@abdalkader/portfolio",
  "outputDirectory": "apps/portfolio/.next"
}
```

### vercel-docs.json (components)
```json
{
  "buildCommand": "cd apps/docs && pnpm build-storybook",
  "outputDirectory": "apps/docs/storybook-static"
}
```

### Using Branch-Specific Configs

In Vercel Dashboard → Project Settings → General:
- Override build command with config file path
- Or use environment variables to detect branch

---

## 🌿 Future Apps Setup

### Blog App (blog branch)

```bash
# Create blog app
cd apps
npx create-next-app@latest blog

# Update package.json
{
  "name": "@abdalkader/blog",
  "dependencies": {
    "@abdalkader/ui": "workspace:*"
  }
}

# Create branch
git checkout -b blog
git add .
git commit -m "feat: initialize blog app"
git push -u origin blog

# Create Vercel project
# - Branch: blog
# - Build: pnpm turbo run build --filter=@abdalkader/blog
# - Output: apps/blog/.next
# - Domain: blog.abdalkader.dev
```

### AI Editor App (ai-editor branch)

```bash
# Create AI editor app
cd apps
npx create-next-app@latest ai-editor

# Update package.json
{
  "name": "@abdalkader/ai-editor",
  "dependencies": {
    "@abdalkader/ui": "workspace:*",
    "@monaco-editor/react": "^4.6.0"
  }
}

# Create branch
git checkout -b ai-editor
git add .
git commit -m "feat: initialize AI editor app"
git push -u origin ai-editor

# Create Vercel project
# - Branch: ai-editor
# - Build: pnpm turbo run build --filter=@abdalkader/ai-editor
# - Output: apps/ai-editor/.next
# - Domain: editor.abdalkader.dev
```

---

## 🔐 Environment Variables

### Shared Across All Projects
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.abdalkader.dev
```

### Project-Specific

**Portfolio**:
```
NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
```

**Portfolio Dev**:
```
NEXT_PUBLIC_SITE_URL=https://dev.abdalkader.dev
NEXT_PUBLIC_ENABLE_DEBUG=true
```

**Components**:
```
STORYBOOK_BASE_URL=https://components.abdalkader.dev
```

Set in: Vercel Dashboard → Project → Settings → Environment Variables

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable for each project:
- Web Analytics
- Speed Insights
- Audience Insights

### Branch Deployments

Each project shows:
- Production deployments (from configured branch)
- Preview deployments (from PRs)
- Deployment history
- Build logs

---

## 🎯 Best Practices

### 1. Keep Design System in Sync

```bash
# Update design system
cd packages/ui
# Make changes
pnpm build

# Merge to all branches
git checkout main && git pull
git checkout develop && git merge main
git checkout components && git merge main
git checkout blog && git merge main
git checkout ai-editor && git merge main
```

### 2. Use Turbo for Efficient Builds

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "storybook-static/**"]
    }
  }
}
```

### 3. Shared Components Pattern

```tsx
// packages/ui/src/components/Layout/Layout.tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header>/* Portfolio-style header */</header>
      <main>{children}</main>
      <footer>/* Portfolio-style footer */</footer>
    </div>
  );
}

// Use in any app
import { Layout } from '@abdalkader/ui';

export default function Page() {
  return <Layout>Content</Layout>;
}
```

### 4. Branch Protection Rules

In GitHub Settings → Branches:
- Protect `main`: Require PR reviews
- Protect `develop`: Require status checks
- Allow direct pushes to feature branches

---

## 🚨 Troubleshooting

### Build Fails on Specific Branch

**Issue**: Build works locally but fails on Vercel
**Fix**: Check branch-specific vercel.json is correct

### Wrong App Deploys

**Issue**: Portfolio deploys instead of Storybook
**Fix**: Verify Vercel project is watching correct branch

### Design System Out of Sync

**Issue**: Styles differ between apps
**Fix**: Rebuild UI library and merge to all branches

### Domain Not Working

**Issue**: Subdomain doesn't resolve
**Fix**: Add DNS records:
```
Type: CNAME
Name: dev (or components, blog, editor)
Value: cname.vercel-dns.com
```

---

## 📈 Scaling Strategy

### Adding New Apps

1. Create app in `apps/` directory
2. Add to `pnpm-workspace.yaml`
3. Create Git branch
4. Create Vercel project
5. Configure domain
6. Push and deploy

### Shared Packages

```
packages/
├── ui/              ← Components
├── design-system/   ← Tokens, themes
├── utils/           ← Shared utilities
├── config/          ← Shared configs
└── types/           ← Shared TypeScript types
```

All apps can import:
```tsx
import { Button } from '@abdalkader/ui';
import { formatDate } from '@abdalkader/utils';
import type { User } from '@abdalkader/types';
```

---

## ✅ Deployment Checklist

### Initial Setup
- [ ] Create all Git branches
- [ ] Create Vercel projects for each branch
- [ ] Configure build commands
- [ ] Set up custom domains
- [ ] Add DNS records
- [ ] Configure environment variables
- [ ] Enable Vercel Analytics

### Per-Branch Deployment
- [ ] Push to branch
- [ ] Verify build succeeds
- [ ] Check deployment preview
- [ ] Test on subdomain
- [ ] Verify design system works
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit

---

## 🎉 Result

You now have:
- ✅ Single monorepo
- ✅ Multiple subdomains
- ✅ Branch-based deployments
- ✅ Shared design system
- ✅ Independent app deployments
- ✅ Scalable architecture

**Enterprise-level deployment achieved!** 🚀
