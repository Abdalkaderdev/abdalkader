# 🚀 Vercel Project Setup Guide

Step-by-step instructions to create all 4 Vercel projects.

---

## 📋 Prerequisites

- [ ] GitHub repository: `Abdalkaderdev/abdalkader`
- [ ] All branches pushed: `main`, `develop`, `components`, `blog`
- [ ] Vercel account connected to GitHub
- [ ] Domain: `abdalkader.dev` (with DNS access)

---

## 🎯 PROJECT 1: Portfolio Production

### Step 1: Create Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **"Abdalkaderdev/abdalkader"**
4. Click **"Import"**

### Step 2: Configure Project

**Project Name:**
```
abdalkader-portfolio
```

**Framework Preset:**
```
Next.js
```

**Root Directory:**
```
./
(Leave empty - monorepo root)
```

**Build & Development Settings:**

Click **"Override"** and set:

```
Build Command:
pnpm turbo run build --filter=@abdalkader/portfolio

Output Directory:
apps/portfolio/.next

Install Command:
pnpm install

Development Command:
pnpm --filter @abdalkader/portfolio dev
```

**Environment Variables:**

Click **"Add Environment Variable"**:

```
Name: NODE_ENV
Value: production
Environment: Production

Name: NEXT_PUBLIC_SITE_URL
Value: https://abdalkader.dev
Environment: Production, Preview, Development
```

### Step 3: Git Configuration

Scroll to **"Git"** section:

```
Production Branch: main
```

Click **"Deploy"**

### Step 4: Add Custom Domain

After deployment completes:

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter: `abdalkader.dev`
4. Click **"Add"**
5. Click **"Add"** again
6. Enter: `www.abdalkader.dev`
7. Click **"Add"**

### Step 5: Configure DNS

In your domain provider (Cloudflare, Namecheap, etc.):

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

### Step 6: Verify

1. Wait 5-10 minutes for DNS propagation
2. Visit https://abdalkader.dev
3. Check SSL certificate is active
4. Test navigation

✅ **PROJECT 1 COMPLETE**

---

## 🎯 PROJECT 2: Portfolio Staging

### Step 1: Create Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **"Abdalkaderdev/abdalkader"** (same repo)
4. Click **"Import"**

### Step 2: Configure Project

**Project Name:**
```
abdalkader-dev
```

**Framework Preset:**
```
Next.js
```

**Root Directory:**
```
./
```

**Build & Development Settings:**

Click **"Override"**:

```
Build Command:
pnpm turbo run build --filter=@abdalkader/portfolio

Output Directory:
apps/portfolio/.next

Install Command:
pnpm install
```

**Environment Variables:**

```
Name: NODE_ENV
Value: production

Name: NEXT_PUBLIC_SITE_URL
Value: https://dev.abdalkader.dev

Name: NEXT_PUBLIC_ENABLE_DEBUG
Value: true
```

### Step 3: Git Configuration

```
Production Branch: develop
```

Click **"Deploy"**

### Step 4: Add Custom Domain

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter: `dev.abdalkader.dev`
4. Click **"Add"**

### Step 5: Configure DNS

```
Type: CNAME
Name: dev
Value: cname.vercel-dns.com
TTL: Auto
```

### Step 6: Verify

1. Visit https://dev.abdalkader.dev
2. Verify it shows staging environment
3. Test debug features

✅ **PROJECT 2 COMPLETE**

---

## 🎯 PROJECT 3: Component Library

### Step 1: Create Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **"Abdalkaderdev/abdalkader"**
4. Click **"Import"**

### Step 2: Configure Project

**Project Name:**
```
abdalkader-components
```

**Framework Preset:**
```
Other
```

**Root Directory:**
```
./
```

**Build & Development Settings:**

Click **"Override"**:

```
Build Command:
pnpm install && pnpm turbo run build --filter=@abdalkader/ui && cd apps/docs && pnpm build-storybook

Output Directory:
apps/docs/storybook-static

Install Command:
pnpm install
```

**Environment Variables:**

```
Name: NODE_ENV
Value: production

Name: STORYBOOK_BASE_URL
Value: https://components.abdalkader.dev
```

### Step 3: Git Configuration

```
Production Branch: components
```

Click **"Deploy"**

### Step 4: Add Custom Domain

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter: `components.abdalkader.dev`
4. Click **"Add"**

### Step 5: Configure DNS

```
Type: CNAME
Name: components
Value: cname.vercel-dns.com
TTL: Auto
```

### Step 6: Verify

1. Visit https://components.abdalkader.dev
2. Check Storybook loads
3. Test component interactions
4. Verify accessibility panel

✅ **PROJECT 3 COMPLETE**

---

## 🎯 PROJECT 4: Blog

### Step 1: Create Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **"Abdalkaderdev/abdalkader"**
4. Click **"Import"**

### Step 2: Configure Project

**Project Name:**
```
abdalkader-blog
```

**Framework Preset:**
```
Other
```

**Root Directory:**
```
./
```

**Build & Development Settings:**

Click **"Override"**:

```
Build Command:
cd apps/blog && npm install && npm run build

Output Directory:
apps/blog/public

Install Command:
npm install
```

**Environment Variables:**

```
Name: NODE_ENV
Value: production

Name: HEXO_ENV
Value: production
```

### Step 3: Git Configuration

```
Production Branch: blog
```

Click **"Deploy"**

### Step 4: Add Custom Domain

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter: `blog.abdalkader.dev`
4. Click **"Add"**

### Step 5: Configure DNS

```
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
TTL: Auto
```

### Step 6: Verify

1. Visit https://blog.abdalkader.dev
2. Check all blog posts load
3. Test navigation
4. Verify RSS feed works

✅ **PROJECT 4 COMPLETE**

---

## 🌐 Complete DNS Configuration

Add all records at once in your DNS provider:

```
# Main domain
Type: A
Name: @
Value: 76.76.21.21

# WWW redirect
Type: CNAME
Name: www
Value: cname.vercel-dns.com

# Staging
Type: CNAME
Name: dev
Value: cname.vercel-dns.com

# Components
Type: CNAME
Name: components
Value: cname.vercel-dns.com

# Blog
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
```

---

## ✅ Verification Checklist

### Project 1: Portfolio Production
- [ ] Project created: `abdalkader-portfolio`
- [ ] Branch: `main`
- [ ] Build successful
- [ ] Domain: `abdalkader.dev` working
- [ ] SSL certificate active
- [ ] All pages load correctly

### Project 2: Portfolio Staging
- [ ] Project created: `abdalkader-dev`
- [ ] Branch: `develop`
- [ ] Build successful
- [ ] Domain: `dev.abdalkader.dev` working
- [ ] Debug mode enabled
- [ ] Staging environment verified

### Project 3: Component Library
- [ ] Project created: `abdalkader-components`
- [ ] Branch: `components`
- [ ] Build successful
- [ ] Domain: `components.abdalkader.dev` working
- [ ] Storybook loads
- [ ] All components visible

### Project 4: Blog
- [ ] Project created: `abdalkader-blog`
- [ ] Branch: `blog`
- [ ] Build successful
- [ ] Domain: `blog.abdalkader.dev` working
- [ ] All posts load
- [ ] RSS feed works

---

## 🔄 Testing Deployments

### Test Auto-Deploy

```bash
# Test Portfolio Production
git checkout main
echo "test" >> README.md
git add .
git commit -m "test: deployment"
git push origin main
# Check: https://vercel.com/abdalkader-portfolio/deployments

# Test Portfolio Staging
git checkout develop
git merge main
git push origin develop
# Check: https://vercel.com/abdalkader-dev/deployments

# Test Components
git checkout components
git merge main
git push origin components
# Check: https://vercel.com/abdalkader-components/deployments

# Test Blog
git checkout blog
# Add new post
cd apps/blog
npm run new "Test Post"
git add .
git commit -m "post: test deployment"
git push origin blog
# Check: https://vercel.com/abdalkader-blog/deployments
```

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** "Cannot find module '@abdalkader/ui'"

**Solution:**
1. Go to Project Settings → General
2. Check "Root Directory" is `./` (not `apps/portfolio`)
3. Verify "Install Command" is `pnpm install` (not `npm install`)
4. Redeploy

**Issue:** "Build command not found"

**Solution:**
1. Check build command includes full path
2. For blog: `cd apps/blog && npm run build`
3. For docs: `cd apps/docs && pnpm build-storybook`

### Domain Not Working

**Issue:** Domain shows "Domain not found"

**Solution:**
1. Check DNS records are correct
2. Wait 5-30 minutes for propagation
3. Use https://dnschecker.org to verify
4. In Vercel, click "Refresh" on domain

**Issue:** SSL certificate error

**Solution:**
1. Wait 10-15 minutes after adding domain
2. Vercel auto-provisions SSL
3. Check domain is verified in Vercel

### Wrong Branch Deploys

**Issue:** Main branch deploys to staging

**Solution:**
1. Go to Project Settings → Git
2. Verify "Production Branch" is correct
3. Each project should watch different branch

---

## 📊 Project Summary

| Project | Branch | Domain | Status |
|---------|--------|--------|--------|
| abdalkader-portfolio | main | abdalkader.dev | ⏳ |
| abdalkader-dev | develop | dev.abdalkader.dev | ⏳ |
| abdalkader-components | components | components.abdalkader.dev | ⏳ |
| abdalkader-blog | blog | blog.abdalkader.dev | ⏳ |

---

## 🎯 Next Steps

After all projects are deployed:

1. **Enable Analytics**
   - Go to each project → Analytics
   - Enable Web Analytics
   - Enable Speed Insights

2. **Set Up Notifications**
   - Project Settings → Notifications
   - Enable deployment notifications
   - Add Slack/Discord webhook (optional)

3. **Configure Preview Deployments**
   - Project Settings → Git
   - Enable "Automatic Preview Deployments"
   - Every PR gets preview URL

4. **Add Team Members**
   - Team Settings → Members
   - Invite collaborators
   - Set permissions

---

## 🎉 Deployment Complete!

All 4 projects are now configured and deployed:

- ✅ Portfolio Production: https://abdalkader.dev
- ✅ Portfolio Staging: https://dev.abdalkader.dev
- ✅ Component Library: https://components.abdalkader.dev
- ✅ Blog: https://blog.abdalkader.dev

**Your enterprise monorepo is live!** 🚀
