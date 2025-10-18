# Vercel Deployment Guide for Abdalkader Apps

## 🚀 Overview

This guide will help you deploy all your apps to Vercel with custom domains:
- **Portfolio**: `abdalkader.dev`
- **Blog**: `blog.abdalkader.dev`
- **Docs**: `docs.abdalkader.dev`
- **Storybook**: `storybook.abdalkader.dev`

## 📋 Prerequisites

- Vercel account (free tier works)
- Domain registered and accessible
- GitHub repository connected to Vercel
- All apps building successfully locally

## 🎯 Step 1: Prepare Your Repository

### 1.1 Verify Build Commands
Ensure these commands work locally:
```bash
# Test all builds
pnpm build

# Test individual apps
pnpm build:portfolio
pnpm build:blog
pnpm build:docs
pnpm build:storybook
```

### 1.2 Check Vercel Configurations
Each app should have proper `vercel.json` files:

#### Portfolio (`apps/portfolio/vercel.json`)
```json
{
  "buildCommand": "cd apps/portfolio && pnpm build",
  "outputDirectory": "apps/portfolio/.next",
  "framework": "nextjs",
  "installCommand": "pnpm install"
}
```

#### Blog (`apps/blog/vercel.json`)
```json
{
  "buildCommand": "cd apps/blog && pnpm build",
  "outputDirectory": "apps/blog/public",
  "framework": "hexo",
  "installCommand": "pnpm install"
}
```

#### Docs (`apps/docs/vercel.json`)
```json
{
  "buildCommand": "cd apps/docs && pnpm build",
  "outputDirectory": "apps/docs/.mintlify",
  "framework": "docusaurus",
  "installCommand": "pnpm install"
}
```

#### Storybook (`apps/storybook/vercel.json`)
```json
{
  "buildCommand": "cd apps/storybook && pnpm build",
  "outputDirectory": "apps/storybook/storybook-static",
  "framework": "storybook",
  "installCommand": "pnpm install"
}
```

## 🌐 Step 2: Domain Setup

### 2.1 Configure DNS Records
In your domain registrar's DNS settings, add these records:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: blog
Value: cname.vercel-dns.com

Type: CNAME
Name: docs
Value: cname.vercel-dns.com

Type: CNAME
Name: components
Value: cname.vercel-dns.com
```

### 2.2 Alternative: Use Vercel's Nameservers
1. Go to your domain registrar
2. Change nameservers to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. Add domains in Vercel dashboard

## 🚀 Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Choose "Import Git Repository"

### 3.2 Deploy Portfolio (Main Domain)
1. **Project Name**: `abdalkader-portfolio`
2. **Framework Preset**: `Next.js`
3. **Root Directory**: `apps/portfolio`
4. **Build Command**: `cd apps/portfolio && pnpm build`
5. **Output Directory**: `.next`
6. **Install Command**: `pnpm install`

**Environment Variables** (if needed):
```
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
```

### 3.3 Deploy Blog
1. **Project Name**: `abdalkader-blog`
2. **Framework Preset**: `Other`
3. **Root Directory**: `apps/blog`
4. **Build Command**: `cd apps/blog && pnpm build`
5. **Output Directory**: `public`
6. **Install Command**: `pnpm install`

### 3.4 Deploy Docs
1. **Project Name**: `abdalkader-docs`
2. **Framework Preset**: `Docusaurus`
3. **Root Directory**: `apps/docs`
4. **Build Command**: `cd apps/docs && pnpm build`
5. **Output Directory**: `.mintlify`
6. **Install Command**: `pnpm install`

### 3.5 Deploy Storybook
1. **Project Name**: `abdalkader-storybook`
2. **Framework Preset**: `Other`
3. **Root Directory**: `apps/storybook`
4. **Build Command**: `cd apps/storybook && pnpm build`
5. **Output Directory**: `storybook-static`
6. **Install Command**: `pnpm install`

## 🔧 Step 4: Configure Custom Domains

### 4.1 Add Domains in Vercel
For each project:

1. Go to **Project Settings** → **Domains**
2. Add custom domain:
   - Portfolio: `abdalkader.dev`
   - Blog: `blog.abdalkader.dev`
   - Docs: `docs.abdalkader.dev`
   - Storybook: `storybook.abdalkader.dev`

### 4.2 Verify Domain Configuration
1. Vercel will show DNS configuration
2. Update your DNS records as shown
3. Wait for propagation (5-60 minutes)
4. Check "Valid Configuration" status

## ⚙️ Step 5: Environment Configuration

### 5.1 Portfolio Environment Variables
```bash
NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_GA_ID=your_ga_id
```

### 5.2 Blog Environment Variables
```bash
HEXO_SITE_URL=https://blog.abdalkader.dev
HEXO_SITE_TITLE="Abdalkader's Blog"
```

### 5.3 Docs Environment Variables
```bash
MINTLIFY_SITE_URL=https://docs.abdalkader.dev
```

### 5.4 Storybook Environment Variables
```bash
STORYBOOK_SITE_URL=https://storybook.abdalkader.dev
```

## 🔄 Step 6: Set Up Automatic Deployments

### 6.1 Branch-based Deployments
Configure in Vercel dashboard:

- **Production Branch**: `main`
- **Preview Branches**: `develop`, `staging`
- **Auto-deploy**: Enabled

### 6.2 GitHub Actions Integration
Your existing workflow (`.github/workflows/deploy-branches.yml`) will handle:
- Automatic builds on push
- Preview deployments for PRs
- Production deployments on merge to main

## 🧪 Step 7: Testing Deployments

### 7.1 Test Each App
```bash
# Test portfolio
curl -I https://abdalkader.dev

# Test blog
curl -I https://blog.abdalkader.dev

# Test docs
curl -I https://docs.abdalkader.dev

# Test storybook
curl -I https://storybook.abdalkader.dev
```

### 7.2 Verify Cross-App Navigation
1. Visit each app
2. Test navigation links between apps
3. Verify styling consistency
4. Check responsive design

## 🚨 Step 8: Troubleshooting

### 8.1 Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Update Node.js version (18.x recommended)
- Check pnpm version compatibility
- Verify all dependencies are installed
```

#### Domain Issues
```bash
# Check DNS propagation
nslookup abdalkader.dev
dig abdalkader.dev

# Verify Vercel configuration
# Check domain status in Vercel dashboard
```

#### Cross-App Links Not Working
```bash
# Verify URLs in navigation components
# Check if external links open in new tabs
# Test on different devices/browsers
```

### 8.2 Performance Optimization

#### Enable Vercel Analytics
1. Go to **Project Settings** → **Analytics**
2. Enable Web Analytics
3. Add tracking code to apps

#### Configure Caching
```json
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 📊 Step 9: Monitoring & Maintenance

### 9.1 Set Up Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Uptime Monitoring**: Use services like UptimeRobot
- **Error Tracking**: Consider Sentry integration

### 9.2 Regular Maintenance
- Monitor build times and success rates
- Update dependencies regularly
- Check domain SSL certificates
- Review performance metrics

## 🎉 Step 10: Go Live Checklist

- [ ] All apps deployed successfully
- [ ] Custom domains configured and working
- [ ] SSL certificates active (automatic with Vercel)
- [ ] Cross-app navigation working
- [ ] Responsive design tested
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] Error monitoring set up

## 🔗 Quick Commands

```bash
# Deploy all apps
vercel --prod

# Deploy specific app
vercel --prod --cwd apps/portfolio

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

## 📞 Support

If you encounter issues:
1. Check Vercel documentation
2. Review build logs in dashboard
3. Test locally first
4. Check DNS propagation
5. Verify environment variables

---

**🎯 Result**: All your apps will be live with custom domains, unified design, and seamless cross-app navigation!