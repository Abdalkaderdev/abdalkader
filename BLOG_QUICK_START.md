# 🚀 Quick Start: Integrate Hexo Blog

## One-Command Integration

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Run automated script
.\scripts\integrate-blog.bat
```

## Manual Integration (5 minutes)

### Step 1: Merge Blog Repository

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Add remote
git remote add blog-remote https://github.com/Abdalkaderdev/blog.git

# Fetch
git fetch blog-remote

# Merge with history
git subtree add --prefix=apps/blog blog-remote main --squash
```

### Step 2: Configure Blog

Create `apps/blog/package.json`:
```json
{
  "name": "@abdalkader/blog",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "hexo server",
    "build": "hexo clean && hexo generate",
    "clean": "hexo clean"
  },
  "dependencies": {
    "hexo": "^7.0.0",
    "hexo-server": "^3.0.0"
  }
}
```

### Step 3: Test Locally

```bash
# Install dependencies
pnpm install

# Test blog
pnpm --filter @abdalkader/blog dev
# Visit: http://localhost:4000
```

### Step 4: Create Blog Branch

```bash
# Create branch
git checkout -b blog

# Push
git push -u origin blog

# Back to main
git checkout main
```

### Step 5: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import repository
3. Settings:
   - Name: `abdalkader-blog`
   - Framework: Other
   - Build: `cd apps/blog && npm install && npm run build`
   - Output: `apps/blog/public`
   - Branch: `blog`
4. Domain: `blog.abdalkader.dev`

## Design System Integration

Create `apps/blog/source/css/design-tokens.styl`:
```stylus
$primary = #f44e00
$white = #f8f8f8
$black = #000000
$font-primary = 'PPNeueMontreal-Regular', sans-serif
```

Update theme styles to use tokens.

## ✅ Verification

- [ ] Blog merged into apps/blog/
- [ ] Git history preserved
- [ ] Local dev works (port 4000)
- [ ] Blog branch created
- [ ] Vercel project created
- [ ] Domain configured
- [ ] Design tokens applied

## 🎉 Done!

Blog now deploys to blog.abdalkader.dev when you push to `blog` branch.
