# 🚀 Vercel Multi-Branch Deployment Guide

## ✅ Branches Created

All branches have been created and pushed to GitHub:

```
✅ main       → origin/main       (abdalkader.dev)
✅ develop    → origin/develop    (dev.abdalkader.dev)
✅ components → origin/components (components.abdalkader.dev)
✅ blog       → origin/blog       (blog.abdalkader.dev)
```

---

## 📋 Vercel Project Setup

### Project 1: Portfolio Production (main)

**URL**: https://vercel.com/new

1. **Import Repository**: Select `Abdalkaderdev/abdalkader`
2. **Project Settings**:
   - Name: `abdalkader-portfolio`
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `pnpm turbo run build --filter=@abdalkader/portfolio`
   - Output Directory: `apps/portfolio/.next`
   - Install Command: `pnpm install`
   - Node Version: 18.x

3. **Git Configuration**:
   - Production Branch: `main`
   - Ignored Build Step: (leave empty)

4. **Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
   ```

5. **Domains**:
   - Add: `abdalkader.dev`
   - Add: `www.abdalkader.dev`

6. **Deploy**: Click "Deploy"

---

### Project 2: Portfolio Staging (develop)

**URL**: https://vercel.com/new

1. **Import Repository**: Select `Abdalkaderdev/abdalkader`
2. **Project Settings**:
   - Name: `abdalkader-portfolio-dev`
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `pnpm turbo run build --filter=@abdalkader/portfolio`
   - Output Directory: `apps/portfolio/.next`
   - Install Command: `pnpm install`
   - Node Version: 18.x

3. **Git Configuration**:
   - Production Branch: `develop`

4. **Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://dev.abdalkader.dev
   NEXT_PUBLIC_ENABLE_DEBUG=true
   ```

5. **Domains**:
   - Add: `dev.abdalkader.dev`

6. **Deploy**: Click "Deploy"

---

### Project 3: Component Library (components)

**URL**: https://vercel.com/new

1. **Import Repository**: Select `Abdalkaderdev/abdalkader`
2. **Project Settings**:
   - Name: `abdalkader-components`
   - Framework: Other
   - Root Directory: `./`
   - Build Command: `cd apps/docs && pnpm install && pnpm build-storybook`
   - Output Directory: `apps/docs/storybook-static`
   - Install Command: `pnpm install`
   - Node Version: 18.x

3. **Git Configuration**:
   - Production Branch: `components`

4. **Environment Variables**:
   ```
   NODE_ENV=production
   STORYBOOK_BASE_URL=https://components.abdalkader.dev
   ```

5. **Domains**:
   - Add: `components.abdalkader.dev`

6. **Deploy**: Click "Deploy"

---

### Project 4: Blog (blog)

**URL**: https://vercel.com/new

1. **Import Repository**: Select `Abdalkaderdev/abdalkader`
2. **Project Settings**:
   - Name: `abdalkader-blog`
   - Framework: Other
   - Root Directory: `./`
   - Build Command: `cd apps/blog && npm install && npm run build`
   - Output Directory: `apps/blog/public`
   - Install Command: `npm install`
   - Node Version: 18.x

3. **Git Configuration**:
   - Production Branch: `blog`

4. **Environment Variables**:
   ```
   NODE_ENV=production
   HEXO_ENV=production
   ```

5. **Domains**:
   - Add: `blog.abdalkader.dev`

6. **Deploy**: Click "Deploy"

---

## 🌐 DNS Configuration

Add these CNAME records in your domain provider (e.g., Cloudflare, Namecheap):

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

**Note**: Main domain (abdalkader.dev) should already be configured.

---

## 🧪 Test Builds Locally

### Test Components Branch
```bash
git checkout components
pnpm install
pnpm --filter @abdalkader/docs build-storybook
# Check: apps/docs/storybook-static/
```

### Test Blog Branch
```bash
git checkout blog
cd apps/blog
npm install
npm run build
# Check: apps/blog/public/
```

### Test Develop Branch
```bash
git checkout develop
pnpm install
pnpm --filter @abdalkader/portfolio build
# Check: apps/portfolio/.next/
```

### Test Main Branch
```bash
git checkout main
pnpm install
pnpm build
# Check all builds
```

---

## 📊 Deployment Matrix

| Branch | Subdomain | App | Vercel Project | Status |
|--------|-----------|-----|----------------|--------|
| `main` | abdalkader.dev | Portfolio | abdalkader-portfolio | ✅ Ready |
| `develop` | dev.abdalkader.dev | Portfolio (staging) | abdalkader-portfolio-dev | ✅ Ready |
| `components` | components.abdalkader.dev | Storybook | abdalkader-components | ✅ Ready |
| `blog` | blog.abdalkader.dev | Hexo Blog | abdalkader-blog | ✅ Ready |

---

## 🔄 Deployment Workflow

### Deploy to Production (main)
```bash
git checkout main
# Make changes
git add .
git commit -m "feat: new feature"
git push origin main
# → Auto-deploys to abdalkader.dev
```

### Deploy to Staging (develop)
```bash
git checkout develop
git merge main
git push origin develop
# → Auto-deploys to dev.abdalkader.dev
```

### Update Components (components)
```bash
git checkout components
git merge main
# Update Storybook stories
git add .
git commit -m "docs: update component docs"
git push origin components
# → Auto-deploys to components.abdalkader.dev
```

### Add Blog Post (blog)
```bash
git checkout blog
cd apps/blog
npm run new "My New Post"
# Edit: apps/blog/source/_posts/My-New-Post.md
git add .
git commit -m "post: add new blog post"
git push origin blog
# → Auto-deploys to blog.abdalkader.dev
```

---

## ✅ Verification Checklist

### Branches
- [x] main branch exists
- [x] develop branch created and pushed
- [x] components branch created and pushed
- [x] blog branch created and pushed

### Vercel Projects
- [ ] Portfolio Production project created (main)
- [ ] Portfolio Staging project created (develop)
- [ ] Component Library project created (components)
- [ ] Blog project created (blog)

### DNS Configuration
- [ ] dev.abdalkader.dev CNAME added
- [ ] components.abdalkader.dev CNAME added
- [ ] blog.abdalkader.dev CNAME added

### Deployments
- [ ] abdalkader.dev deployed and accessible
- [ ] dev.abdalkader.dev deployed and accessible
- [ ] components.abdalkader.dev deployed and accessible
- [ ] blog.abdalkader.dev deployed and accessible

---

## 🔍 Troubleshooting

### Build Fails on Vercel

**Issue**: "Cannot find module '@abdalkader/ui'"
**Fix**: Ensure `pnpm install` runs at monorepo root

**Issue**: "Build command not found"
**Fix**: Verify build command includes `cd apps/[app-name]`

### Domain Not Resolving

**Issue**: Subdomain shows "Domain not found"
**Fix**: 
1. Check DNS propagation (can take 5-30 minutes)
2. Verify CNAME record points to `cname.vercel-dns.com`
3. Check Vercel project has domain added

### Wrong App Deploys

**Issue**: Portfolio deploys instead of Storybook
**Fix**: Verify Vercel project is watching correct branch

---

## 📈 Monitoring

### Vercel Dashboard

Each project shows:
- Build logs
- Deployment history
- Performance metrics
- Error tracking

### Analytics

Enable in each Vercel project:
- Web Analytics
- Speed Insights
- Audience Insights

---

## 🎯 Quick Commands

```bash
# List all branches
git branch -a

# Switch branches
git checkout main
git checkout develop
git checkout components
git checkout blog

# Check branch status
git status

# View remote branches
git remote -v

# Pull latest changes
git pull origin main
```

---

## 🎉 Success Criteria

Your multi-branch deployment is successful when:

1. ✅ All 4 branches exist on GitHub
2. ✅ All 4 Vercel projects created
3. ✅ All 4 subdomains configured
4. ✅ All 4 sites deploy successfully
5. ✅ Each branch auto-deploys on push

**Result**: Enterprise-level multi-branch deployment architecture! 🚀
