# 📝 Hexo Blog Integration Guide

Complete step-by-step guide to integrate existing Hexo blog into monorepo.

---

## 🎯 Goal

Integrate https://github.com/Abdalkaderdev/blog.git into `apps/blog/` with:
- ✅ Full Git history preserved
- ✅ Deploy to blog.abdalkader.dev via `blog` branch
- ✅ Design system integration
- ✅ Hexo functionality maintained

---

## 📋 Step 1: Merge Blog Repository (Preserve History)

### Method A: Git Subtree (Recommended)

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Add blog as remote
git remote add blog-remote https://github.com/Abdalkaderdev/blog.git

# Fetch blog repository
git fetch blog-remote

# Create apps directory if not exists
mkdir apps\blog

# Merge blog into apps/blog/ with full history
git subtree add --prefix=apps/blog blog-remote main --squash

# Or without squash to keep all commits
git subtree add --prefix=apps/blog blog-remote main
```

### Method B: Git Filter-Repo (Alternative)

```bash
# Clone blog separately
cd C:\Users\max\Desktop
git clone https://github.com/Abdalkaderdev/blog.git blog-temp

# Move all files to apps/blog structure
cd blog-temp
git filter-repo --to-subdirectory-filter apps/blog

# Add as remote and merge
cd C:\Users\max\Desktop\react\abdalkader
git remote add blog-temp ../blog-temp
git fetch blog-temp
git merge blog-temp/main --allow-unrelated-histories

# Cleanup
git remote remove blog-temp
cd ..
rmdir /s /q blog-temp
```

### Method C: Manual Merge (Simplest)

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Add blog remote
git remote add blog-remote https://github.com/Abdalkaderdev/blog.git
git fetch blog-remote

# Create orphan branch for blog
git checkout -b blog-integration blog-remote/main

# Move everything to apps/blog
mkdir apps
git mv * apps/blog/ 2>nul || true
git mv .* apps/blog/ 2>nul || true

# Commit the move
git add .
git commit -m "chore: move blog files to apps/blog/"

# Merge into main
git checkout main
git merge blog-integration --allow-unrelated-histories -m "feat: integrate Hexo blog into monorepo"

# Cleanup
git branch -d blog-integration
```

---

## 📦 Step 2: Configure Hexo for Monorepo

### Create apps/blog/package.json

```json
{
  "name": "@abdalkader/blog",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "hexo server",
    "build": "hexo clean && hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy"
  },
  "dependencies": {
    "hexo": "^7.0.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-index": "^3.0.0",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^6.0.0",
    "hexo-renderer-stylus": "^3.0.0",
    "hexo-server": "^3.0.0"
  }
}
```

### Update apps/blog/_config.yml

```yaml
# Site
title: Abdalkader Blog
subtitle: 'Thoughts on development and design'
description: 'Technical blog by Abdalkader'
author: Abdalkader
language: en
timezone: ''

# URL
url: https://blog.abdalkader.dev
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:

# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing
new_post_name: :title.md
default_layout: post
titlecase: false
external_link:
  enable: true
  field: site
  exclude: ''
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: ''
  wrap: true
  hljs: false

# Deployment
deploy:
  type: ''
```

---

## 🚀 Step 3: Vercel Configuration

### Create apps/blog/vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd apps/blog && npm run build",
  "outputDirectory": "apps/blog/public",
  "framework": null
}
```

### Update Root vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true,
      "components": true,
      "blog": true,
      "ai-editor": true
    }
  }
}
```

### Create vercel-blog.json (Root)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm install && cd apps/blog && pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": "apps/blog/public",
  "framework": null
}
```

---

## 🎨 Step 4: Integrate Design System

### Create apps/blog/source/css/design-tokens.styl

```stylus
// Import design tokens from UI package
$primary = #f44e00
$primary-light = #fa7300
$white = #f8f8f8
$black = #000000
$text-dark = #131313
$text-grey = #787878

// Typography
$font-primary = 'PPNeueMontreal-Regular', -apple-system, BlinkMacSystemFont, sans-serif
$font-medium = 'PPNeueMontreal-Medium', -apple-system, BlinkMacSystemFont, sans-serif

// Font sizes
$font-xs = 0.6rem
$font-sm = 0.7rem
$font-base = 0.9rem
$font-md = 1rem
$font-lg = 1.8rem
$font-xl = 2.75rem
$font-2xl = 4.5rem

// Spacing
$space-1 = 1rem
$space-2 = 2rem
$space-3 = 3rem
$space-5 = 5rem
$space-8 = 8rem

// Border radius
$radius-sm = 6px
$radius-base = 8px
$radius-md = 12px

// Transitions
$transition-smooth = 0.8s cubic-bezier(0.19, 1, 0.22, 1)
$transition-base = 0.5s ease

// Shadows
$shadow-glow = 0px 0px 5px $primary
$shadow-glow-hover = 0px 0px 10px $primary

// Breakpoints
$mobile = 600px
$tablet = 840px
$desktop = 1080px
```

### Update apps/blog/themes/[your-theme]/source/css/style.styl

```stylus
@import '../../../source/css/design-tokens.styl'

body
  font-family $font-primary
  background $black
  color $white
  line-height 1.6

a
  color $primary
  transition color $transition-base
  
  &:hover
    color $primary-light

h1, h2, h3
  font-family $font-medium
  line-height 0.9

h1
  font-size $font-2xl
  
  @media (max-width: $desktop)
    font-size $font-xl
  
  @media (max-width: $mobile)
    font-size $font-lg

.button
  background $primary
  color $white
  padding $space-1 $space-2
  border-radius $radius-base
  transition all $transition-base
  
  &:hover
    filter $shadow-glow-hover
```

### Copy Portfolio Fonts

```bash
# Copy fonts from portfolio to blog
xcopy apps\portfolio\public\fonts apps\blog\source\fonts\ /E /I /Y
```

### Update apps/blog/themes/[your-theme]/layout/_partial/head.ejs

```ejs
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= config.title %></title>
  
  <!-- Portfolio Fonts -->
  <style>
    @font-face {
      font-family: 'PPNeueMontreal-Regular';
      src: url('/fonts/PPNeueMontreal-Regular.woff2');
    }
    @font-face {
      font-family: 'PPNeueMontreal-Medium';
      src: url('/fonts/PPNeueMontreal-Medium.woff2');
    }
  </style>
  
  <%- css('css/style') %>
</head>
```

---

## 🔧 Step 5: Update Monorepo Configuration

### Update pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Update turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        "dist/**",
        "storybook-static/**",
        "public/**"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Update Root package.json

```json
{
  "name": "abdalkader-monorepo",
  "scripts": {
    "dev": "turbo run dev",
    "dev:blog": "pnpm --filter @abdalkader/blog dev",
    "build": "turbo run build",
    "build:blog": "pnpm --filter @abdalkader/blog build"
  }
}
```

---

## 🌿 Step 6: Create Blog Branch

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Create blog branch from main
git checkout -b blog

# Push blog branch
git push -u origin blog

# Back to main
git checkout main
```

---

## 🚀 Step 7: Vercel Deployment Setup

### Create Vercel Project for Blog

1. Go to https://vercel.com/new
2. Import repository
3. Configure:
   - **Project Name**: `abdalkader-blog`
   - **Framework**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd apps/blog && npm install && npm run build`
   - **Output Directory**: `apps/blog/public`
   - **Install Command**: `npm install`
4. **Git Settings**:
   - Production Branch: `blog`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   HEXO_ENV=production
   ```
6. **Domains**: `blog.abdalkader.dev`

### Add DNS Record

In your domain provider:
```
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
```

---

## ✅ Step 8: Verification

### Test Locally

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Install dependencies
pnpm install

# Test blog dev server
pnpm --filter @abdalkader/blog dev
# Visit: http://localhost:4000

# Test blog build
pnpm --filter @abdalkader/blog build
# Check: apps/blog/public/ folder
```

### Deploy to Vercel

```bash
# Commit all changes
git add .
git commit -m "feat: integrate Hexo blog into monorepo"

# Push to main
git push origin main

# Push to blog branch
git checkout blog
git merge main
git push origin blog

# Vercel will auto-deploy
```

### Verify Deployment

1. Check Vercel dashboard for build logs
2. Visit https://blog.abdalkader.dev
3. Verify:
   - ✅ Blog loads
   - ✅ Design system fonts applied
   - ✅ Colors match portfolio
   - ✅ All posts visible
   - ✅ Navigation works

---

## 🔄 Workflow After Integration

### Update Blog Content

```bash
# Switch to blog branch
git checkout blog

# Create new post
cd apps\blog
npx hexo new post "My New Post"

# Edit: apps/blog/source/_posts/My-New-Post.md

# Test locally
pnpm dev

# Commit and push
git add .
git commit -m "post: add new blog post"
git push origin blog

# Auto-deploys to blog.abdalkader.dev
```

### Sync Design System Updates

```bash
# When design system changes in main
git checkout blog
git merge main
git push origin blog
```

---

## 🎨 Advanced: Custom Hexo Theme with Design System

### Create apps/blog/themes/portfolio-theme/

```bash
cd apps\blog\themes
mkdir portfolio-theme
cd portfolio-theme

# Create structure
mkdir -p layout/_partial source/css source/js
```

### themes/portfolio-theme/_config.yml

```yaml
# Theme configuration
menu:
  Home: /
  Archives: /archives
  About: /about

# Widgets
widgets:
  - category
  - tag
  - recent_posts

# Social links
social:
  GitHub: https://github.com/Abdalkaderdev
  Twitter: https://twitter.com/abdalkaderdev
```

### themes/portfolio-theme/layout/layout.ejs

```ejs
<!DOCTYPE html>
<html>
<%- partial('_partial/head') %>
<body>
  <%- partial('_partial/header') %>
  <main>
    <%- body %>
  </main>
  <%- partial('_partial/footer') %>
</body>
</html>
```

### Update apps/blog/_config.yml

```yaml
theme: portfolio-theme
```

---

## 📊 Final Structure

```
abdalkader/
├── apps/
│   ├── portfolio/      → main, develop
│   ├── docs/           → components
│   └── blog/           → blog (NEW!)
│       ├── _config.yml
│       ├── package.json
│       ├── source/
│       │   ├── _posts/
│       │   ├── css/
│       │   │   └── design-tokens.styl
│       │   └── fonts/
│       ├── themes/
│       └── public/ (generated)
├── packages/
│   └── ui/
└── vercel-blog.json
```

---

## 🎯 Summary

✅ Blog integrated with full Git history
✅ Deploys to blog.abdalkader.dev via `blog` branch
✅ Design system tokens applied to Hexo
✅ Fonts and colors match portfolio
✅ Independent deployment pipeline
✅ Monorepo workflow maintained

**Next Steps:**
1. Run integration commands
2. Test locally
3. Push to blog branch
4. Create Vercel project
5. Verify deployment

Your Hexo blog is now part of the enterprise monorepo! 🚀
