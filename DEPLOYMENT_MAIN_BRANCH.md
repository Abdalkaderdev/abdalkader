# Main Branch Staging Deployment Guide

## 🎯 Overview

This guide explains how to deploy the staging environment using the `main` branch, following the same pattern as the blog and docs deployments. This approach uses environment variables to differentiate between production and staging environments.

## 🏗️ Architecture

### Branch Strategy
- **Single Branch**: `main` branch serves both environments
- **Environment Differentiation**: Via `NEXT_PUBLIC_ENVIRONMENT` variable
- **Domain Routing**: Different domains point to different Vercel projects

### Domain Structure
```
abdalkader.dev          → Production (main branch, production env)
dev.abdalkader.dev      → Staging (main branch, staging env)
docs.abdalkader.dev     → Documentation site
```

## 🚀 Deployment Methods

### Method 1: Vercel Dashboard Configuration

#### Step 1: Create Staging Project
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository: `abdalkader-web-ecosystem`
4. Set project name: `abdalkader-dev`

#### Step 2: Configure Build Settings
- **Framework Preset**: `Next.js`
- **Root Directory**: `apps/portfolio`
- **Build Command**: `pnpm turbo run build --filter=@abdalkader/portfolio`
- **Output Directory**: `apps/portfolio/.next`
- **Install Command**: `pnpm install`

#### Step 3: Set Environment Variables
```bash
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_FEATURE_FLAGS=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
NEXT_PUBLIC_AB_TESTING=true
```

#### Step 4: Configure Branch Settings
- **Production Branch**: `main`
- **Auto-deploy**: Enable for `main` branch

### Method 2: Using Vercel Configuration Files

The project includes these configuration files:

#### Main Configuration (`vercel.json`)
```json
{
  "buildCommand": "pnpm turbo run build --filter=@abdalkader/portfolio",
  "installCommand": "pnpm install",
  "outputDirectory": "apps/portfolio/.next",
  "framework": "nextjs",
  "git": {
    "deploymentEnabled": {
      "main": true,
      "components": true,
      "blog": true,
      "docs": true
    }
  }
}
```

#### Staging Configuration (`vercel-staging.json`)
```json
{
  "name": "abdalkader-dev",
  "buildCommand": "pnpm turbo run build --filter=@abdalkader/portfolio",
  "installCommand": "pnpm install",
  "outputDirectory": "apps/portfolio/.next",
  "framework": "nextjs",
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "env": {
    "NODE_ENV": "staging",
    "NEXT_PUBLIC_ENVIRONMENT": "staging",
    "NEXT_PUBLIC_FEATURE_FLAGS": "true",
    "NEXT_PUBLIC_PERFORMANCE_MONITORING": "true",
    "NEXT_PUBLIC_ERROR_TRACKING": "true"
  }
}
```

### Method 3: Vercel CLI Deployment

#### Step 1: Install and Login
```bash
npm install -g vercel
vercel login
```

#### Step 2: Deploy Staging Project
```bash
cd /workspace

# Deploy staging project
vercel --prod --confirm

# Link to existing project (if already created)
vercel link
```

#### Step 3: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_ENVIRONMENT
# Enter: staging

vercel env add NEXT_PUBLIC_FEATURE_FLAGS
# Enter: true

vercel env add NEXT_PUBLIC_PERFORMANCE_MONITORING
# Enter: true

vercel env add NEXT_PUBLIC_ERROR_TRACKING
# Enter: true

vercel env add NEXT_PUBLIC_DEBUG
# Enter: true
```

## 🌐 Domain Configuration

### Step 1: Add Custom Domain
1. Go to Vercel dashboard
2. Select your staging project (`abdalkader-dev`)
3. Go to "Settings" → "Domains"
4. Add domain: `dev.abdalkader.dev`

### Step 2: Configure DNS
Add this DNS record to your domain provider:

```
Type: CNAME
Name: dev
Value: cname.vercel-dns.com
```

## 🔄 Deployment Workflow

### Automatic Deployment
1. **Push to Main**: Code is pushed to `main` branch
2. **Vercel Detection**: Vercel detects the push
3. **Environment Check**: Checks which project to deploy to
4. **Environment Variables**: Applies staging environment variables
5. **Build & Deploy**: Builds and deploys to `dev.abdalkader.dev`

### Manual Deployment
```bash
# Push changes to main branch
git add .
git commit -m "feat: staging environment updates"
git push origin main

# Vercel will automatically deploy both:
# - Production: abdalkader.dev
# - Staging: dev.abdalkader.dev
```

## 🧪 Testing Staging Environment

### Access Staging
- **URL**: `https://dev.abdalkader.dev`
- **Banner**: Purple staging banner should be visible
- **Tools**: Click 🛠️ button for staging tools

### Verify Environment
```javascript
// Check environment in browser console
console.log(process.env.NEXT_PUBLIC_ENVIRONMENT); // Should log "staging"
```

### Test Features
- ✅ Staging banner visible
- ✅ Staging tools accessible
- ✅ Feature flags working
- ✅ Performance monitoring active
- ✅ Error tracking operational

## 📊 Environment Differentiation

### Production Environment (`abdalkader.dev`)
```bash
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_FEATURE_FLAGS=false
```

### Staging Environment (`dev.abdalkader.dev`)
```bash
NEXT_PUBLIC_ENVIRONMENT=staging
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_FEATURE_FLAGS=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
```

## 🔧 Configuration Files

### Environment Detection
The app uses this logic to determine the environment:

```typescript
// apps/portfolio/src/config/staging.ts
export function isStagingEnvironment(): boolean {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging' || 
         process.env.NODE_ENV === 'development';
}
```

### Feature Flags
```typescript
// Different behavior based on environment
const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging';

if (isStaging) {
  // Show staging tools, enable debugging, etc.
}
```

## 🚨 Troubleshooting

### Common Issues

#### Environment Variables Not Working
- Check variable names in Vercel dashboard
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Verify variables are set for correct project

#### Staging Tools Not Showing
- Confirm `NEXT_PUBLIC_ENVIRONMENT=staging`
- Check browser console for errors
- Verify feature flags are enabled

#### Wrong Environment Deployed
- Check which Vercel project is being deployed
- Verify domain is pointing to correct project
- Check environment variables in Vercel dashboard

### Debug Commands
```bash
# Check current branch
git branch --show-current

# Check Vercel projects
vercel ls

# Check environment variables
vercel env ls
```

## 🎯 Benefits of Main Branch Approach

### Advantages
- ✅ **Simpler Workflow**: Single branch for both environments
- ✅ **Consistent Code**: Same codebase in both environments
- ✅ **Easy Rollback**: No branch merging issues
- ✅ **Reduced Complexity**: No develop branch management
- ✅ **Faster Deployments**: Direct main branch deployment

### Environment Separation
- **Code**: Same codebase
- **Configuration**: Different environment variables
- **Behavior**: Environment-specific features
- **Monitoring**: Separate analytics and error tracking

## 📈 Next Steps

1. **Deploy to Vercel**: Use one of the deployment methods above
2. **Configure Domain**: Set up `dev.abdalkader.dev` domain
3. **Test Environment**: Verify staging features work
4. **Set Up Monitoring**: Configure alerts and notifications
5. **Document Process**: Update team documentation

The staging environment is now ready for deployment using the main branch approach! 🚀