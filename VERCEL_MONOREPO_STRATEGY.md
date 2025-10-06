# 🚀 Vercel Monorepo Strategy

## ⚠️ Important: Vercel Limitations

**Vercel does NOT support:**
- Branch-specific output directories in a single project
- Automatic subdomain routing based on branches
- Different build commands per branch in one project

**Reality:** You need **separate Vercel projects** for different apps, even in a monorepo.

---

## ✅ Recommended Approach: Multiple Projects

### Strategy: One Project Per Deployment Target

This is the **official Vercel recommendation** for monorepos with multiple apps.

```
GitHub Repo (abdalkader)
├── Vercel Project 1: abdalkader-portfolio (main branch)
├── Vercel Project 2: abdalkader-dev (develop branch)
├── Vercel Project 3: abdalkader-components (components branch)
└── Vercel Project 4: abdalkader-blog (blog branch)
```

### Why This Works
- ✅ Each project watches specific branch
- ✅ Each project has custom build command
- ✅ Each project has custom output directory
- ✅ Each project has custom domain
- ✅ Independent scaling and configuration

---

## 🔧 Optimized Configuration

### Root vercel.json (Shared Settings)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm turbo run build --filter=$VERCEL_APP",
  "installCommand": "pnpm install",
  "framework": null,
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true,
      "components": true,
      "blog": true
    }
  }
}
```

### Environment Variable Approach

Set `VERCEL_APP` in each Vercel project:

**Project 1 (Portfolio Production)**:
```
VERCEL_APP=@abdalkader/portfolio
```

**Project 2 (Portfolio Dev)**:
```
VERCEL_APP=@abdalkader/portfolio
```

**Project 3 (Components)**:
```
VERCEL_APP=@abdalkader/docs
```

**Project 4 (Blog)**:
```
VERCEL_APP=@abdalkader/blog
```

---

## 📋 Vercel Project Setup

### Project 1: Portfolio Production

**Settings:**
```
Name: abdalkader-portfolio
Repository: Abdalkaderdev/abdalkader
Framework: Next.js
Root Directory: ./
Build Command: pnpm turbo run build --filter=@abdalkader/portfolio
Output Directory: apps/portfolio/.next
Install Command: pnpm install
Node Version: 18.x

Git:
  Production Branch: main
  
Environment Variables:
  NODE_ENV=production
  NEXT_PUBLIC_SITE_URL=https://abdalkader.dev

Domains:
  - abdalkader.dev
  - www.abdalkader.dev
```

### Project 2: Portfolio Staging

**Settings:**
```
Name: abdalkader-dev
Repository: Abdalkaderdev/abdalkader
Framework: Next.js
Root Directory: ./
Build Command: pnpm turbo run build --filter=@abdalkader/portfolio
Output Directory: apps/portfolio/.next
Install Command: pnpm install
Node Version: 18.x

Git:
  Production Branch: develop
  
Environment Variables:
  NODE_ENV=production
  NEXT_PUBLIC_SITE_URL=https://dev.abdalkader.dev
  NEXT_PUBLIC_ENABLE_DEBUG=true

Domains:
  - dev.abdalkader.dev
```

### Project 3: Component Library

**Settings:**
```
Name: abdalkader-components
Repository: Abdalkaderdev/abdalkader
Framework: Other
Root Directory: ./
Build Command: pnpm install && cd apps/docs && pnpm build-storybook
Output Directory: apps/docs/storybook-static
Install Command: pnpm install
Node Version: 18.x

Git:
  Production Branch: components
  
Environment Variables:
  NODE_ENV=production
  STORYBOOK_BASE_URL=https://components.abdalkader.dev

Domains:
  - components.abdalkader.dev
```

### Project 4: Blog

**Settings:**
```
Name: abdalkader-blog
Repository: Abdalkaderdev/abdalkader
Framework: Other
Root Directory: ./
Build Command: cd apps/blog && npm install && npm run build
Output Directory: apps/blog/public
Install Command: npm install
Node Version: 18.x

Git:
  Production Branch: blog
  
Environment Variables:
  NODE_ENV=production
  HEXO_ENV=production

Domains:
  - blog.abdalkader.dev
```

---

## 🌐 DNS Configuration

### Option 1: Individual CNAME Records (Recommended)

```
Type: CNAME
Name: dev
Value: cname.vercel-dns.com
TTL: Auto

Type: CNAME
Name: components
Value: cname.vercel-dns.com
TTL: Auto

Type: CNAME
Name: blog
Value: cname.vercel-dns.com
TTL: Auto
```

### Option 2: Wildcard (Not Recommended for Production)

```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: Auto
```

**Note:** Wildcard can cause issues with email and other services.

---

## 🔄 Alternative: Vercel CLI Deployment

If you want more control, use Vercel CLI:

### Install Vercel CLI

```bash
npm i -g vercel
vercel login
```

### Deploy Specific Apps

```bash
# Deploy portfolio to production
cd apps/portfolio
vercel --prod

# Deploy to specific project
vercel --prod --scope=abdalkader-portfolio

# Deploy with environment
vercel --prod -e NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
```

### Automated CLI Deployment (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop, components, blog]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install Vercel CLI
        run: npm i -g vercel
      
      - name: Deploy Portfolio (main)
        if: github.ref == 'refs/heads/main'
        run: |
          cd apps/portfolio
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Portfolio (develop)
        if: github.ref == 'refs/heads/develop'
        run: |
          cd apps/portfolio
          vercel --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Storybook (components)
        if: github.ref == 'refs/heads/components'
        run: |
          cd apps/docs
          pnpm build-storybook
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Blog (blog)
        if: github.ref == 'refs/heads/blog'
        run: |
          cd apps/blog
          npm run build
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🎯 Best Practices

### 1. Use Ignored Build Step

Prevent unnecessary builds:

```bash
# In Vercel Project Settings → Git → Ignored Build Step
git diff HEAD^ HEAD --quiet . ':(exclude)apps/portfolio'
```

This only builds when files in `apps/portfolio` change.

### 2. Optimize Build Commands

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "public/**", "storybook-static/**"],
      "cache": true
    }
  }
}
```

### 3. Share Environment Variables

Use Vercel's environment variable inheritance:
1. Set in Team settings
2. Inherit in all projects

---

## 📊 Comparison: Single vs Multiple Projects

| Feature | Single Project | Multiple Projects |
|---------|---------------|-------------------|
| Branch-specific builds | ❌ No | ✅ Yes |
| Different output dirs | ❌ No | ✅ Yes |
| Independent scaling | ❌ No | ✅ Yes |
| Custom domains per branch | ❌ Limited | ✅ Full |
| Build optimization | ⚠️ Limited | ✅ Full |
| **Recommended** | ❌ | ✅ |

---

## 🚀 Quick Setup Script

```bash
#!/bin/bash
# setup-vercel-projects.sh

echo "Setting up Vercel projects..."

# Project 1: Portfolio Production
vercel link --scope=your-team --project=abdalkader-portfolio
vercel env add NEXT_PUBLIC_SITE_URL production
vercel domains add abdalkader.dev

# Project 2: Portfolio Dev
vercel link --scope=your-team --project=abdalkader-dev
vercel env add NEXT_PUBLIC_SITE_URL production
vercel domains add dev.abdalkader.dev

# Project 3: Components
vercel link --scope=your-team --project=abdalkader-components
vercel domains add components.abdalkader.dev

# Project 4: Blog
vercel link --scope=your-team --project=abdalkader-blog
vercel domains add blog.abdalkader.dev

echo "✅ All projects configured!"
```

---

## ✅ Final Recommendation

**Use 4 separate Vercel projects** as documented in `VERCEL_DEPLOYMENT_GUIDE.md`.

This is:
- ✅ Official Vercel recommendation
- ✅ Most flexible
- ✅ Best performance
- ✅ Easiest to maintain
- ✅ Independent scaling

**Do NOT try to use a single project** - it will cause more problems than it solves.

---

## 📚 Resources

- **Vercel Monorepo Docs**: https://vercel.com/docs/monorepos
- **Turborepo + Vercel**: https://turbo.build/repo/docs/handbook/deploying-with-docker
- **Multiple Projects Guide**: https://vercel.com/docs/concepts/git/monorepos

---

## 🎯 Summary

1. Create 4 Vercel projects (one per branch/app)
2. Configure each with specific build commands
3. Set up custom domains
4. Let Vercel auto-deploy on push

This is the **correct** and **recommended** approach for monorepo deployments on Vercel.
