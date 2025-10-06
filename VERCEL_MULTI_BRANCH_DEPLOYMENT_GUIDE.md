# 🚀 VERCEL MULTI-BRANCH DEPLOYMENT GUIDE

## 📋 DEPLOYMENT STRATEGY

### 4 Vercel Projects Configuration

| Branch | Subdomain | Project Name | Purpose | Build Config |
|--------|-----------|--------------|---------|--------------|
| `main` | `abdalkader.dev` | `abdalkader-portfolio` | Portfolio Production | `vercel-portfolio.json` |
| `develop` | `dev.abdalkader.dev` | `abdalkader-dev` | Portfolio Staging | `vercel-portfolio.json` |
| `components` | `components.abdalkader.dev` | `abdalkader-components` | Storybook Docs | `vercel-docs.json` |
| `blog` | `blog.abdalkader.dev` | `abdalkader-blog` | Hexo Blog | `vercel-blog.json` |

## 🔧 VERCEL PROJECT SETUP

### Step 1: Create Vercel Projects

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Create projects (run from repository root)
vercel --name abdalkader-portfolio
vercel --name abdalkader-dev  
vercel --name abdalkader-components
vercel --name abdalkader-blog
```

### Step 2: Configure Each Project

#### Portfolio Production (`main` branch)
```bash
# Set project settings
vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://abdalkader.dev

vercel env add NODE_ENV production  
# Value: production

# Link to main branch
vercel --prod --confirm
```

#### Portfolio Staging (`develop` branch)
```bash
# Set project settings  
vercel env add NEXT_PUBLIC_SITE_URL preview
# Value: https://dev.abdalkader.dev

vercel env add NODE_ENV development
# Value: development
```

#### Components Documentation (`components` branch)
```bash
# Set project settings
vercel env add NODE_ENV production
# Value: production

# No additional env vars needed for Storybook
```

#### Blog (`blog` branch)
```bash
# Set project settings
vercel env add NODE_ENV production  
# Value: production

vercel env add HEXO_ENV production
# Value: production
```

## 📁 BUILD CONFIGURATIONS

### Portfolio Configuration (`vercel-portfolio.json`)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm install --no-frozen-lockfile && pnpm turbo run build --filter=@abdalkader/portfolio...",
  "installCommand": null,
  "outputDirectory": "apps/portfolio/.next",
  "framework": "nextjs",
  "functions": {
    "apps/portfolio/pages/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Docs Configuration (`vercel-docs.json`)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm install --no-frozen-lockfile && pnpm turbo run build --filter=@abdalkader/ui && cd apps/docs && pnpm build",
  "installCommand": null,
  "outputDirectory": "apps/docs/storybook-static",
  "framework": null,
  "trailingSlash": false,
  "cleanUrls": true
}
```

### Blog Configuration (`vercel-blog.json`)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json", 
  "buildCommand": "cd apps/blog && npm install && npm run build",
  "installCommand": null,
  "outputDirectory": "apps/blog/public",
  "framework": null,
  "trailingSlash": true,
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🌐 DNS CONFIGURATION

### Vercel Domain Setup

1. **Add Custom Domain to Each Project:**

```bash
# Portfolio (main)
vercel domains add abdalkader.dev --project abdalkader-portfolio

# Development
vercel domains add dev.abdalkader.dev --project abdalkader-dev

# Components  
vercel domains add components.abdalkader.dev --project abdalkader-components

# Blog
vercel domains add blog.abdalkader.dev --project abdalkader-blog
```

2. **DNS Records (Add to your DNS provider):**

```dns
# Main domain
abdalkader.dev          A     76.76.19.61
abdalkader.dev          AAAA  2600:1f18:3c3c:3200::2

# Subdomains  
dev                     CNAME abdalkader.dev
components              CNAME abdalkader.dev  
blog                    CNAME abdalkader.dev

# Alternative: Direct CNAME to Vercel
dev                     CNAME cname.vercel-dns.com
components              CNAME cname.vercel-dns.com
blog                    CNAME cname.vercel-dns.com
```

## 🔄 DEPLOYMENT WORKFLOW

### Automatic Deployments

Each branch automatically deploys when pushed:

```bash
# Portfolio Production
git push origin main
# → Deploys to abdalkader.dev

# Portfolio Staging  
git push origin develop
# → Deploys to dev.abdalkader.dev

# Components Documentation
git push origin components  
# → Deploys to components.abdalkader.dev

# Blog
git push origin blog
# → Deploys to blog.abdalkader.dev
```

### Manual Deployments

```bash
# Deploy specific project
vercel --prod --project abdalkader-portfolio

# Deploy with specific config
vercel --local-config vercel-portfolio.json --prod

# Deploy preview
vercel --project abdalkader-dev
```

## 🧪 TESTING DEPLOYMENTS

### Verification Checklist

```bash
# Test all endpoints
curl -I https://abdalkader.dev
curl -I https://dev.abdalkader.dev  
curl -I https://components.abdalkader.dev
curl -I https://blog.abdalkader.dev

# Check build status
vercel ls --project abdalkader-portfolio
vercel ls --project abdalkader-dev
vercel ls --project abdalkader-components  
vercel ls --project abdalkader-blog
```

### Performance Testing

```bash
# Lighthouse CI for each domain
npx lighthouse-ci https://abdalkader.dev
npx lighthouse-ci https://dev.abdalkader.dev
npx lighthouse-ci https://components.abdalkader.dev
npx lighthouse-ci https://blog.abdalkader.dev
```

## 📊 MONITORING & ANALYTICS

### Vercel Analytics Setup

```bash
# Enable analytics for each project
vercel env add NEXT_PUBLIC_VERCEL_ANALYTICS_ID production
# Get ID from Vercel dashboard

# Enable Web Vitals
vercel env add NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS production  
# Value: 1
```

### Error Monitoring

```bash
# Optional: Add Sentry for error tracking
vercel env add SENTRY_DSN production
# Value: your-sentry-dsn

vercel env add SENTRY_ORG production
# Value: your-org

vercel env add SENTRY_PROJECT production  
# Value: your-project
```

## 🔐 SECURITY CONFIGURATION

### Environment Variables

```bash
# Security headers (already in configs)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY  
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains

# CSP for Next.js (in next.config.mjs)
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### Access Control

```bash
# Optional: Password protection for dev environment
vercel env add VERCEL_PASSWORD preview
# Value: your-dev-password (for dev.abdalkader.dev)
```

## 🚀 DEPLOYMENT COMMANDS

### Quick Deploy All Projects

```bash
#!/bin/bash
# deploy-all.sh

echo "🚀 Deploying all projects..."

# Portfolio Production
echo "📱 Deploying Portfolio..."
vercel --prod --project abdalkader-portfolio --local-config vercel-portfolio.json

# Components Documentation  
echo "📚 Deploying Components..."
vercel --prod --project abdalkader-components --local-config vercel-docs.json

# Blog
echo "📝 Deploying Blog..."  
vercel --prod --project abdalkader-blog --local-config vercel-blog.json

echo "✅ All deployments complete!"
```

## 📈 SUCCESS METRICS

### Deployment Targets

- **Build Time:** < 3 minutes per project
- **First Load:** < 200KB (Portfolio)
- **Lighthouse Score:** > 90 (All projects)
- **Uptime:** 99.9%
- **TTFB:** < 200ms

### Monitoring URLs

- Portfolio: https://abdalkader.dev
- Development: https://dev.abdalkader.dev  
- Components: https://components.abdalkader.dev
- Blog: https://blog.abdalkader.dev

---

**All 4 Vercel projects are now configured for automatic multi-branch deployment! 🎯**