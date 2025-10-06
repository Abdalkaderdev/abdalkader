# 🔧 Maintenance Guide

Regular maintenance tasks and troubleshooting for the monorepo.

---

## 📅 Regular Maintenance Tasks

### Weekly Tasks

#### 1. Dependency Updates (Security)
```bash
# Check for security vulnerabilities
pnpm audit

# Fix automatically
pnpm audit fix

# Update critical dependencies
pnpm update --latest
```

#### 2. Test Suite
```bash
# Run all tests
pnpm test

# Check coverage
pnpm --filter @abdalkader/ui test:coverage
```

#### 3. Build Verification
```bash
# Test production builds
pnpm build

# Verify no errors
```

### Monthly Tasks

#### 1. Dependency Updates (All)
```bash
# Check outdated packages
pnpm outdated

# Update all dependencies
pnpm update --latest --recursive

# Test after updates
pnpm build
pnpm test
```

#### 2. Performance Audit
```bash
# Check bundle sizes
pnpm --filter @abdalkader/ui size

# Run Lighthouse on deployed sites
# - abdalkader.dev
# - dev.abdalkader.dev
# - components.abdalkader.dev
# - blog.abdalkader.dev
```

#### 3. Clean Up
```bash
# Remove old build artifacts
pnpm clean

# Clear Turbo cache
rm -rf .turbo

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Quarterly Tasks

#### 1. Major Version Updates
```bash
# Update Next.js
pnpm --filter @abdalkader/portfolio add next@latest

# Update React
pnpm add -w react@latest react-dom@latest

# Update Hexo
pnpm --filter @abdalkader/blog add hexo@latest

# Test thoroughly
pnpm build
pnpm test
```

#### 2. Documentation Review
- Update README.md
- Review FUTURE_DEVELOPMENT.md
- Update CHANGELOG.md
- Check Storybook stories

#### 3. Security Audit
```bash
# Full security scan
pnpm audit --audit-level=moderate

# Check for known vulnerabilities
npm audit
```

---

## 🔄 Update Procedures

### Updating Dependencies

#### Safe Update Process
```bash
# 1. Create branch
git checkout -b chore/update-dependencies

# 2. Update dependencies
pnpm update --latest

# 3. Test locally
pnpm build
pnpm test
pnpm dev

# 4. Commit
git add .
git commit -m "chore: update dependencies"

# 5. Push and test on Vercel preview
git push origin chore/update-dependencies

# 6. Merge to develop first
# Create PR to develop
# Test on dev.abdalkader.dev

# 7. Merge to main
# Create PR to main
# Deploy to production
```

#### Critical Security Updates
```bash
# Immediate fix
pnpm audit fix --force

# Test
pnpm build

# Deploy immediately
git add .
git commit -m "security: fix critical vulnerabilities"
git push origin main
```

### Updating Design System

```bash
# 1. Update in packages/ui
cd packages/ui
# Make changes

# 2. Rebuild
pnpm build

# 3. Test in all apps
cd ../..
pnpm build

# 4. Update version
cd packages/ui
npm version patch  # or minor, major

# 5. Commit and sync to all branches
git add .
git commit -m "design: update design system"
git push origin main

# Sync to other branches
git checkout develop && git merge main && git push
git checkout components && git merge main && git push
git checkout blog && git merge main && git push
```

### Updating Node.js Version

```bash
# 1. Update .nvmrc
echo "18.19.0" > .nvmrc

# 2. Update package.json engines
{
  "engines": {
    "node": ">=18.19.0",
    "pnpm": ">=8.0.0"
  }
}

# 3. Update Vercel settings
# Go to each Vercel project
# Settings → General → Node.js Version → 18.x

# 4. Test locally
nvm use
pnpm install
pnpm build
```

---

## 🐛 Troubleshooting

### Build Failures

#### Issue: "Cannot find module '@abdalkader/ui'"
```bash
# Solution 1: Rebuild UI library
pnpm --filter @abdalkader/ui build

# Solution 2: Clear cache and reinstall
rm -rf node_modules .turbo
pnpm install
```

#### Issue: "Module parse failed: Unexpected token"
```bash
# Solution: Check transpilePackages in next.config.mjs
{
  transpilePackages: ['@abdalkader/ui']
}
```

#### Issue: Turbo cache issues
```bash
# Clear Turbo cache
rm -rf .turbo
pnpm build
```

### Deployment Failures

#### Issue: Vercel build timeout
```bash
# Solution: Optimize build command
# Instead of: pnpm build
# Use: pnpm turbo run build --filter=@abdalkader/[app]
```

#### Issue: Out of memory
```bash
# Solution: Increase Node memory in Vercel
# Add to package.json:
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

#### Issue: Wrong branch deploys
```bash
# Solution: Check Vercel project settings
# Settings → Git → Production Branch
# Ensure correct branch is selected
```

### Development Issues

#### Issue: Port already in use
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID [PID] /F

# Or use different port
pnpm --filter @abdalkader/portfolio dev -- -p 3001
```

#### Issue: pnpm install fails
```bash
# Clear pnpm cache
pnpm store prune

# Remove lock file
rm pnpm-lock.yaml

# Reinstall
pnpm install
```

#### Issue: TypeScript errors after update
```bash
# Rebuild TypeScript
pnpm typecheck

# Clear TypeScript cache
rm -rf **/*.tsbuildinfo

# Rebuild
pnpm build
```

### Design System Issues

#### Issue: Styles not applying
```bash
# Solution 1: Check CSS import
import '@abdalkader/ui/dist/styles.css';

# Solution 2: Rebuild UI library
pnpm --filter @abdalkader/ui build

# Solution 3: Check CSS file exists
ls packages/ui/dist/styles.css
```

#### Issue: Design tokens not working
```bash
# Solution: Rebuild with inlined CSS
cd packages/ui
pnpm build

# Check output
cat dist/styles.css | grep "brand-primary"
```

---

## 📊 Performance Monitoring

### Bundle Size Monitoring

```bash
# Check UI library size
pnpm --filter @abdalkader/ui size

# Check portfolio bundle
cd apps/portfolio
pnpm build
# Check .next/static/chunks/

# Analyze bundle
ANALYZE=true pnpm build
```

### Lighthouse Audits

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://abdalkader.dev --view

# Target scores:
# Performance: >90
# Accessibility: 100
# Best Practices: >90
# SEO: 100
```

### Vercel Analytics

Enable in Vercel Dashboard:
1. Go to project
2. Analytics tab
3. Enable Web Analytics
4. Enable Speed Insights

Monitor:
- Page load times
- Core Web Vitals
- Error rates
- Traffic patterns

---

## 🔐 Security Maintenance

### Regular Security Checks

```bash
# Check for vulnerabilities
pnpm audit

# Check specific severity
pnpm audit --audit-level=high

# Generate report
pnpm audit --json > security-report.json
```

### Dependency Security

```bash
# Update security-critical packages
pnpm update react react-dom next

# Check for known CVEs
npm audit

# Use Snyk (optional)
npx snyk test
```

### Environment Variables

```bash
# Rotate secrets quarterly
# Update in Vercel Dashboard:
# Project → Settings → Environment Variables

# Never commit secrets
# Check .gitignore includes:
.env*.local
.env.production
```

---

## 📝 Logging and Monitoring

### Error Tracking

Consider adding:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Performance monitoring

### Build Logs

```bash
# View Vercel build logs
vercel logs [deployment-url]

# View local build logs
pnpm build 2>&1 | tee build.log
```

### Analytics

- **Vercel Analytics**: Built-in
- **Google Analytics**: Add to _app.tsx
- **Plausible**: Privacy-friendly alternative

---

## 🔄 Backup and Recovery

### Git Backup

```bash
# Create backup branch
git checkout -b backup/$(date +%Y-%m-%d)
git push origin backup/$(date +%Y-%m-%d)
```

### Database Backup (if applicable)

```bash
# Backup blog content
cd apps/blog
tar -czf blog-backup-$(date +%Y-%m-%d).tar.gz source/
```

### Vercel Backup

- Deployments are automatically saved
- Can rollback to any previous deployment
- Download deployment artifacts if needed

---

## 📋 Maintenance Checklist

### Weekly
- [ ] Run `pnpm audit`
- [ ] Check Vercel deployment status
- [ ] Review error logs
- [ ] Test critical user flows

### Monthly
- [ ] Update dependencies
- [ ] Run Lighthouse audits
- [ ] Review analytics
- [ ] Clean up old branches
- [ ] Update documentation

### Quarterly
- [ ] Major version updates
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup review
- [ ] Documentation overhaul

---

## 🆘 Emergency Procedures

### Site Down

```bash
# 1. Check Vercel status
# Visit: https://vercel.com/status

# 2. Check recent deployments
vercel ls

# 3. Rollback if needed
vercel rollback [deployment-url]

# 4. Check logs
vercel logs
```

### Critical Bug in Production

```bash
# 1. Create hotfix branch
git checkout main
git checkout -b hotfix/critical-bug

# 2. Fix bug
# ...

# 3. Test
pnpm build
pnpm test

# 4. Deploy immediately
git add .
git commit -m "hotfix: resolve critical bug"
git push origin hotfix/critical-bug

# 5. Merge to main
git checkout main
git merge hotfix/critical-bug
git push origin main

# 6. Backport to develop
git checkout develop
git merge main
git push origin develop
```

---

## 📞 Support Resources

- **Vercel Support**: https://vercel.com/support
- **Next.js Docs**: https://nextjs.org/docs
- **pnpm Docs**: https://pnpm.io
- **Turborepo Docs**: https://turbo.build/repo/docs

---

## 🎯 Maintenance Goals

- **Uptime**: 99.9%
- **Performance**: Lighthouse >90
- **Security**: Zero critical vulnerabilities
- **Dependencies**: Updated monthly
- **Documentation**: Always current

Keep the monorepo healthy and performant! 🚀
