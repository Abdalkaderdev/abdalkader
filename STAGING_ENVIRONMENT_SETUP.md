# Staging Environment Setup - Abdalkader Web Ecosystem

## 🚀 Overview

This document outlines the complete staging environment setup for the Abdalkader Web Ecosystem. The staging environment (`dev.abdalkader.dev`) provides a comprehensive testing platform with advanced monitoring, feature flags, and development tools.

## 📋 Environment Architecture

### Branch Strategy
- **Production**: `main` → `abdalkader.dev` (production environment)
- **Staging**: `main` → `dev.abdalkader.dev` (staging environment)
- **Development**: Feature branches → Preview deployments

### Domain Structure
```
abdalkader.dev          → Production (main branch, production env)
dev.abdalkader.dev      → Staging (main branch, staging env)
docs.abdalkader.dev     → Documentation site
```

## 🛠️ Staging Features

### 1. Feature Flag System
- **Location**: `apps/portfolio/src/lib/feature-flags.ts`
- **Purpose**: Enable/disable features without code deployment
- **Features**:
  - Performance monitoring toggle
  - Error tracking toggle
  - Debug mode toggle
  - A/B testing toggle
  - UI/UX experiment toggles

### 2. Performance Monitoring
- **Location**: `apps/portfolio/src/lib/performance-monitor.ts`
- **Capabilities**:
  - Core Web Vitals tracking
  - Custom performance metrics
  - Resource loading analysis
  - Bundle size monitoring
  - User interaction tracking

### 3. Error Tracking
- **Location**: `apps/portfolio/src/lib/error-tracker.ts`
- **Features**:
  - JavaScript error capture
  - React error boundary integration
  - Network error tracking
  - Unhandled promise rejection handling
  - Error context and fingerprinting

### 4. A/B Testing Framework
- **Location**: `apps/portfolio/src/lib/ab-testing.ts`
- **Capabilities**:
  - Experiment configuration
  - Variant assignment
  - Event tracking
  - Results analysis
  - React hooks integration

### 5. Development Tools
- **Staging Banner**: Visual indicator of staging environment
- **Staging Tools Panel**: Interactive debugging interface
- **Performance Dashboard**: Real-time metrics display
- **Error Dashboard**: Error tracking and analysis
- **A/B Testing Dashboard**: Experiment management

## 🔧 Configuration Files

### Vercel Configuration
- **Main**: `vercel.json` - Production configuration
- **Staging**: `vercel-dev.json` - Staging-specific settings
- **Portfolio**: `vercel-portfolio.json` - Portfolio app settings

### Environment Variables
```bash
# Staging Environment
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_FEATURE_FLAGS=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
NEXT_PUBLIC_AB_TESTING=true
```

### CI/CD Pipeline
- **File**: `.github/workflows/staging-deploy.yml`
- **Features**:
  - Automated testing
  - Build verification
  - Lighthouse CI integration
  - Bundle size monitoring
  - Auto-deployment to staging

## 🚀 Deployment Process

### 1. Manual Deployment
```bash
# Switch to main branch
git checkout main

# Run staging deployment script
node scripts/deploy-staging.js
```

### 2. Automated Deployment
- **Trigger**: Push to `main` branch
- **Process**: GitHub Actions → Tests → Build → Deploy → Lighthouse Audit
- **URL**: `https://dev.abdalkader.dev`

### 3. Vercel CLI Deployment
```bash
# Deploy to staging
vercel --prod --confirm

# Deploy specific branch
vercel --target staging
```

## 🧪 Testing & Quality Assurance

### Automated Tests
- **Linting**: ESLint + TypeScript checks
- **Type Checking**: Full TypeScript validation
- **Unit Tests**: Component and utility testing
- **Build Tests**: Production build verification

### Performance Testing
- **Lighthouse CI**: Automated performance audits
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Bundle Analysis**: JavaScript bundle size tracking
- **Resource Monitoring**: Loading performance metrics

### Manual Testing
- **Feature Flag Testing**: Toggle features on/off
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Desktop, tablet, mobile
- **Accessibility Testing**: WCAG compliance checks

## 📊 Monitoring & Analytics

### Performance Metrics
- Page load times
- Core Web Vitals
- Bundle sizes
- Resource loading
- User interactions

### Error Tracking
- JavaScript errors
- React errors
- Network failures
- Performance issues

### A/B Testing Results
- Conversion rates
- User engagement
- Feature adoption
- Performance impact

## 🔒 Security & Privacy

### Staging-Specific Security
- **No Indexing**: `noindex, nofollow` meta tags
- **Environment Headers**: Clear staging identification
- **Debug Information**: Detailed error reporting
- **Feature Flags**: Safe feature toggling

### Data Handling
- **No Production Data**: Staging uses test data only
- **Privacy Compliance**: GDPR/CCPA considerations
- **Error Sanitization**: Sensitive data filtering

## 🎯 Success Criteria

### ✅ Completed Features
- [x] Develop branch setup
- [x] Vercel project configuration
- [x] CI/CD pipeline implementation
- [x] Feature flag system
- [x] Performance monitoring
- [x] Error tracking
- [x] A/B testing framework
- [x] Staging tools interface
- [x] Environment banner
- [x] Lighthouse CI integration
- [x] Bundle size monitoring

### 🎯 Deployment Verification
- [ ] `dev.abdalkader.dev` is live and accessible
- [ ] Auto-deploys work on develop branch pushes
- [ ] Feature flags are functional
- [ ] Performance monitoring is active
- [ ] Error tracking is operational
- [ ] A/B testing framework is ready
- [ ] Staging tools are accessible
- [ ] Lighthouse audits pass
- [ ] Bundle size monitoring works

## 🔄 Workflow Integration

### Development Workflow
1. **Feature Development**: Create feature branch
2. **Local Testing**: Test with staging configuration
3. **Pull Request**: Submit PR to main branch
4. **Staging Deployment**: Auto-deploy to staging environment
5. **Testing**: Comprehensive staging testing
6. **Production**: Same code runs in production environment

### Staging Testing Checklist
- [ ] Feature functionality
- [ ] Performance impact
- [ ] Error handling
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] SEO optimization

## 📚 Resources

### Documentation
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)
- [Feature Flag Documentation](./FEATURE_FLAGS.md)
- [Performance Monitoring Guide](./PERFORMANCE_MONITORING.md)
- [A/B Testing Framework](./AB_TESTING.md)

### Tools & Services
- **Vercel**: Deployment platform
- **GitHub Actions**: CI/CD pipeline
- **Lighthouse CI**: Performance testing
- **Sentry**: Error tracking (optional)
- **Google Analytics**: Analytics (optional)

### Support
- **Documentation**: Check project README files
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions

---

## 🎉 Staging Environment Ready!

The staging environment is now fully configured and ready for development and testing. Access it at `https://dev.abdalkader.dev` and use the staging tools for comprehensive testing and debugging.

**Happy Testing! 🚀**