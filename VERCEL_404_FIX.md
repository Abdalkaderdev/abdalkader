# 🔧 Vercel 404 Fix - Next.js Monorepo

## 🎯 ROOT CAUSE
Vercel can't find Next.js output because Root Directory is wrong.

## ✅ SOLUTION: Update Vercel Project Settings

### Step 1: Vercel Dashboard Settings

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **General**

2. **Root Directory**:
   - Change from: `./`
   - Change to: `apps/portfolio`
   - Click **Save**

3. **Build & Development Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `cd ../.. && pnpm install --no-frozen-lockfile && pnpm turbo run build --filter=@abdalkader/portfolio...`
   - Output Directory: (leave empty - auto-detected)
   - Install Command: (leave empty - handled in build command)

### Step 2: Deploy

```bash
cd C:\Users\max\Desktop\react\abdalkader
git add vercel.json
git commit -m "fix: update vercel config for monorepo Next.js deployment"
git push origin main
```

## 🔍 Why This Works

**Before (404 Error)**:
- Root Directory: `./` (monorepo root)
- Vercel looks for `.next` at root level
- Can't find it → 404

**After (Working)**:
- Root Directory: `apps/portfolio`
- Vercel sees `package.json` with `next` dependency
- Finds `.next` folder in correct location
- Serves Next.js app correctly

## 🧪 Verify Fix

After deployment:
1. Check build logs show: `Build Completed in /vercel/output`
2. Check deployment shows: `Deployment Ready`
3. Visit site - should load homepage (no 404)

## 📋 Complete Vercel Settings

```
Project Settings → General:

Root Directory: apps/portfolio
Node.js Version: 18.x

Build & Development Settings:

Framework Preset: Next.js
Build Command: cd ../.. && pnpm install --no-frozen-lockfile && pnpm turbo run build --filter=@abdalkader/portfolio...
Output Directory: (empty)
Install Command: (empty)
Development Command: pnpm dev
```

## 🚀 Alternative: Keep Root at ./

If you want to keep Root Directory as `./`:

1. Delete `vercel.json`
2. In Vercel Settings:
   - Root Directory: `./`
   - Build Command: `pnpm install --no-frozen-lockfile && pnpm turbo run build --filter=@abdalkader/portfolio... && cp -r apps/portfolio/.next .next && cp -r apps/portfolio/public public`
   - Output Directory: `.next`

**Not recommended** - copying files is hacky.

## ✅ RECOMMENDED ACTION

**Change Root Directory to `apps/portfolio` in Vercel Dashboard NOW.**

This is the standard approach for Next.js monorepos on Vercel.
