# 🤖 Intelligent Build System

Automatic branch detection and app-specific builds using Turborepo.

---

## 🎯 How It Works

The build system automatically detects the current Git branch and builds the appropriate app:

```
Branch: main       → Build: Portfolio (Production)
Branch: develop    → Build: Portfolio (Staging)
Branch: components → Build: Storybook Documentation
Branch: blog       → Build: Hexo Blog
```

---

## 🔧 Configuration

### 1. Turborepo Tasks (turbo.json)

```json
{
  "tasks": {
    "@abdalkader/portfolio#build": {
      "dependsOn": ["^build"],
      "outputs": ["apps/portfolio/.next/**"],
      "cache": true
    },
    "@abdalkader/docs#build": {
      "dependsOn": ["^build"],
      "outputs": ["apps/docs/storybook-static/**"],
      "cache": true
    },
    "@abdalkader/blog#build": {
      "outputs": ["apps/blog/public/**"],
      "cache": true
    },
    "@abdalkader/ui#build": {
      "outputs": ["packages/ui/dist/**"],
      "cache": true
    }
  }
}
```

### 2. Build Scripts (package.json)

```json
{
  "scripts": {
    "build": "node scripts/build-branch.js",
    "build:portfolio": "turbo run build --filter=@abdalkader/portfolio",
    "build:docs": "turbo run build --filter=@abdalkader/ui && cd apps/docs && pnpm build-storybook",
    "build:blog": "cd apps/blog && npm run build",
    "build:ui": "turbo run build --filter=@abdalkader/ui"
  }
}
```

### 3. Intelligent Build Script (scripts/build-branch.js)

Automatically detects branch from:
- `VERCEL_GIT_COMMIT_REF` (Vercel)
- `GITHUB_REF_NAME` (GitHub Actions)
- `git branch --show-current` (Local)

---

## 🚀 Usage

### Local Development

```bash
# Automatic branch detection
pnpm build

# Or build specific app
pnpm build:portfolio
pnpm build:docs
pnpm build:blog
pnpm build:ui
```

### Vercel Deployment

Each Vercel project uses the same build command:

```bash
pnpm build
```

The script automatically detects the branch and builds the correct app.

---

## 📋 Vercel Configuration

### Portfolio Projects (main, develop)

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/portfolio/.next",
  "installCommand": "pnpm install"
}
```

### Storybook Project (components)

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/docs/storybook-static",
  "installCommand": "pnpm install"
}
```

### Blog Project (blog)

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/blog/public",
  "installCommand": "pnpm install"
}
```

**Note:** Same build command for all projects! The script handles routing.

---

## 🔍 Branch Detection Logic

```javascript
// Priority order:
1. VERCEL_GIT_COMMIT_REF (Vercel environment)
2. GITHUB_REF_NAME (GitHub Actions)
3. git branch --show-current (Local development)

// Build mapping:
const buildConfig = {
  main: 'Portfolio Production',
  develop: 'Portfolio Staging',
  components: 'Storybook',
  blog: 'Hexo Blog',
};
```

---

## 🎨 Build Outputs

### Portfolio
```
apps/portfolio/.next/
├── static/
├── server/
└── standalone/
```

### Storybook
```
apps/docs/storybook-static/
├── index.html
├── iframe.html
└── assets/
```

### Blog
```
apps/blog/public/
├── index.html
├── archives/
├── posts/
└── assets/
```

### UI Library
```
packages/ui/dist/
├── index.js
├── index.esm.js
├── index.d.ts
└── styles.css
```

---

## ⚡ Turborepo Caching

All builds are cached by Turborepo:

```bash
# First build
pnpm build  # Takes ~26s

# Cached build (no changes)
pnpm build  # Takes ~0.5s

# Partial cache (only changed app rebuilds)
pnpm build  # Takes ~5-10s
```

### Cache Keys

Turborepo caches based on:
- File hashes in the app directory
- Dependencies in package.json
- Environment variables
- Task configuration

---

## 🧪 Testing Build Detection

### Test Locally

```bash
# Test main branch
git checkout main
pnpm build
# Should build Portfolio

# Test develop branch
git checkout develop
pnpm build
# Should build Portfolio

# Test components branch
git checkout components
pnpm build
# Should build Storybook

# Test blog branch
git checkout blog
pnpm build
# Should build Blog
```

### Test with Environment Variable

```bash
# Simulate Vercel environment
VERCEL_GIT_COMMIT_REF=blog pnpm build
# Should build Blog

VERCEL_GIT_COMMIT_REF=components pnpm build
# Should build Storybook
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Build

on:
  push:
    branches: [main, develop, components, blog]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
        env:
          GITHUB_REF_NAME: ${{ github.ref_name }}
```

### Vercel

Vercel automatically sets `VERCEL_GIT_COMMIT_REF`:

```bash
# No configuration needed
# Just use: pnpm build
```

---

## 📊 Build Performance

### Without Caching
```
Portfolio:  ~20s
Storybook:  ~9s
Blog:       ~2s
UI Library: ~1.3s
```

### With Turborepo Cache
```
Portfolio:  ~0.5s (cached)
Storybook:  ~0.3s (cached)
Blog:       ~0.2s (cached)
UI Library: ~0.1s (cached)
```

### Partial Cache (UI changed)
```
UI Library: ~1.3s (rebuild)
Portfolio:  ~20s (rebuild, depends on UI)
Storybook:  ~9s (rebuild, depends on UI)
Blog:       ~0.2s (cached, no dependency)
```

---

## 🐛 Troubleshooting

### Build Script Not Executing

```bash
# Make script executable (Unix)
chmod +x scripts/build-branch.sh

# Or use Node version
node scripts/build-branch.js
```

### Wrong App Building

```bash
# Check detected branch
git branch --show-current

# Check environment variable
echo $VERCEL_GIT_COMMIT_REF

# Force specific build
pnpm build:portfolio
```

### Cache Issues

```bash
# Clear Turborepo cache
rm -rf .turbo

# Clear all caches
pnpm clean
pnpm install
pnpm build
```

---

## 🎯 Best Practices

### 1. Always Use `pnpm build`

```bash
# ✅ Good - Uses intelligent routing
pnpm build

# ❌ Avoid - Builds everything
pnpm build:all
```

### 2. Let Turborepo Cache

```bash
# Turborepo automatically caches
# Don't disable unless necessary
```

### 3. Use Filters for Development

```bash
# Build only what you're working on
pnpm build:portfolio
pnpm build:docs
```

### 4. Verify Before Pushing

```bash
# Test build locally
pnpm build

# Test on correct branch
git checkout components
pnpm build
```

---

## 📈 Optimization Tips

### 1. Parallel Builds

Turborepo builds in parallel automatically:
```
UI Library → Portfolio (parallel)
          → Storybook (parallel)
Blog (independent)
```

### 2. Incremental Builds

Only changed apps rebuild:
```
Change in apps/portfolio → Only Portfolio rebuilds
Change in packages/ui → UI + Portfolio + Storybook rebuild
Change in apps/blog → Only Blog rebuilds
```

### 3. Remote Caching (Optional)

Enable Vercel Remote Cache:
```bash
turbo login
turbo link
```

Share cache across team and CI/CD.

---

## ✅ Verification Checklist

- [ ] `turbo.json` configured with app-specific tasks
- [ ] `package.json` has branch-specific scripts
- [ ] `scripts/build-branch.js` exists and is executable
- [ ] Test build on each branch locally
- [ ] Verify Vercel uses `pnpm build` command
- [ ] Check Turborepo cache is working
- [ ] Confirm correct app builds for each branch

---

## 🎉 Result

One build command (`pnpm build`) that:
- ✅ Automatically detects branch
- ✅ Builds correct app
- ✅ Uses Turborepo caching
- ✅ Works locally and on Vercel
- ✅ Optimizes build times

**Smart builds for smart deployments!** 🚀
