# 🚀 Deployment Guide

## Pre-Deployment Checklist

### 1. Test Production Build Locally

```bash
# From monorepo root
cd C:\Users\max\Desktop\react\abdalkader

# Build UI library first
pnpm --filter @abdalkader/ui build

# Build everything
pnpm build

# Test portfolio production build
cd apps\portfolio
pnpm start
```

Visit http://localhost:3000 to verify production build works.

### 2. Verify All Assets

```bash
# Check UI library dist
dir packages\ui\dist
# Should see: index.js, index.esm.js, index.d.ts, styles.css

# Check portfolio build
dir apps\portfolio\.next
# Should see: static, server folders

# Check Storybook build (optional)
cd apps\docs
pnpm build-storybook
dir storybook-static
```

## Vercel Deployment Configuration

### Portfolio (Main Site) - abdalkader.dev

**Root Configuration** (`vercel.json`):
```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": null,
  "outputDirectory": "apps/portfolio/.next"
}
```

**Environment Variables** (Set in Vercel Dashboard):
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://abdalkader.dev`
- Any other env vars from your portfolio

**Build Settings**:
- Framework Preset: Next.js
- Root Directory: `./`
- Build Command: `pnpm build` (uses Turbo)
- Output Directory: `apps/portfolio/.next`
- Install Command: `pnpm install`
- Node Version: 18.x

### Storybook (Subdomain) - storybook.abdalkader.dev

**Option 1: Separate Vercel Project**
1. Create new Vercel project
2. Link to same GitHub repo
3. Set Root Directory: `apps/docs`
4. Build Command: `pnpm build-storybook`
5. Output Directory: `storybook-static`
6. Install Command: `cd ../.. && pnpm install`

**Option 2: Static Export to Portfolio Public**
```bash
# Build Storybook
cd apps\docs
pnpm build-storybook

# Copy to portfolio public folder
xcopy storybook-static ..\portfolio\public\storybook\ /E /I /Y

# Rebuild portfolio
cd ..\portfolio
pnpm build
```

Access at: `abdalkader.dev/storybook/`

## GitHub Setup

### 1. Initialize Git (if not already)

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Check current status
git status

# If not a repo yet
git init
git branch -M main
```

### 2. Create .gitignore

Already exists, verify it includes:
```
node_modules
.next
.turbo
dist
coverage
*.log
.env*.local
storybook-static
```

### 3. Commit Everything

```bash
# Stage all files
git add .

# Commit
git commit -m "feat: complete monorepo setup with portfolio and component library

- Migrated portfolio to apps/portfolio
- Created @abdalkader/ui component library in packages/ui
- Set up Storybook documentation in apps/docs
- Configured Turborepo for build orchestration
- Added Vercel deployment configuration
- Integrated Button and Input components
- Set up TypeScript, testing, and build pipeline"

# Verify commit
git log --oneline -1
```

### 4. Push to GitHub

```bash
# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/abdalkader.git

# Push to main
git push -u origin main
```

## Vercel Deployment Steps

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `apps/portfolio/.next`
   - **Install Command**: `pnpm install`
4. Add environment variables (if any)
5. Click "Deploy"

### Method 3: GitHub Integration (Auto-Deploy)

1. Connect Vercel to your GitHub repo
2. Every push to `main` auto-deploys
3. Pull requests get preview deployments

## Post-Deployment Verification

### 1. Check Portfolio

Visit: https://abdalkader.dev (or your Vercel URL)

Verify:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Projects page loads
- ✅ About page loads
- ✅ Contact page loads
- ✅ Test UI page works: `/test-ui`
- ✅ Animations work (GSAP, Framer Motion)
- ✅ Images load correctly
- ✅ Styles apply correctly

### 2. Check Storybook (if deployed separately)

Visit: https://storybook.abdalkader.dev

Verify:
- ✅ Button stories load
- ✅ Input stories load
- ✅ Interactive controls work
- ✅ Accessibility panel works

### 3. Performance Check

Run Lighthouse audit:
- Performance: >90
- Accessibility: 100
- Best Practices: >90
- SEO: 100

## Troubleshooting

### Build Fails on Vercel

**Issue**: "Cannot find module '@abdalkader/ui'"
**Fix**: Ensure `pnpm install` runs at root, not in subdirectory

**Issue**: "Module parse failed: Unexpected token"
**Fix**: Verify `transpilePackages: ['@abdalkader/ui']` in next.config.mjs

**Issue**: "Cannot resolve './variables.css'"
**Fix**: Rebuild UI library with inlined CSS: `pnpm --filter @abdalkader/ui build`

### Styles Not Loading

**Issue**: Components render but no styles
**Fix**: Import CSS in `_app.tsx`:
```tsx
import '@abdalkader/ui/dist/styles.css';
```

### Turbo Cache Issues

```bash
# Clear Turbo cache
pnpm turbo clean

# Rebuild
pnpm build
```

## Continuous Deployment

### Automatic Deployments

Once connected to GitHub:
- **Push to main** → Production deployment
- **Pull request** → Preview deployment
- **Push to branch** → Preview deployment

### Manual Deployments

```bash
# Deploy specific commit
vercel --prod --force

# Rollback to previous deployment
vercel rollback
```

## Domain Configuration

### Custom Domain Setup

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add domain: `abdalkader.dev`
3. Add subdomain: `storybook.abdalkader.dev` (if separate project)
4. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard:
- Web Analytics
- Speed Insights
- Audience Insights

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay

## Next Steps After Deployment

1. ✅ Verify all pages work in production
2. ✅ Test on mobile devices
3. ✅ Run Lighthouse audit
4. ✅ Set up custom domain
5. ✅ Enable Vercel Analytics
6. ✅ Share portfolio link!

## Quick Reference

```bash
# Local development
pnpm dev

# Production build test
pnpm build && cd apps/portfolio && pnpm start

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## 🎉 You're Live!

Your portfolio is now deployed and accessible worldwide!

- Portfolio: https://abdalkader.dev
- Storybook: https://storybook.abdalkader.dev (or /storybook/)
- GitHub: https://github.com/YOUR_USERNAME/abdalkader

Happy deploying! 🚀
