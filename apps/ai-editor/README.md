# AI Lab - Interactive Machine Learning Platform

A production-ready AI laboratory showcasing interactive machine learning experiments, built with Next.js, TypeScript, and TensorFlow.js.

## 🏗️ Architecture

### **State Management**
- **React Context** for global state management
- **React Hook Form** with **Zod validation** for forms
- **Custom hooks** for business logic and performance monitoring

### **Performance Budgets**
- **First Load JS:** < 150KB
- **LCP:** < 2.0s on 3G networks
- **FID:** < 100ms
- **Bundle Limits:** TensorFlow.js models lazy loaded separately

### **Accessibility Standards**
- **WCAG 2.1 AA** compliance mandatory
- **Screen reader** testing required
- **Keyboard navigation** for all interactive elements
- **Prefers-reduced-motion** support

### **Browser Support**
- Chrome 90+ (primary)
- Firefox 88+
- Safari 15+ (critical for iOS)
- Mobile Chrome & Safari

## 🚀 Features

### **Core Functionality**
- Interactive AI experiments with real-time visualizations
- TensorFlow.js integration with lazy loading
- Computer vision demos with webcam support
- Neural network visualizations
- AI code generation playground

### **Business Features**
- Lead capture forms with validation
- Regional expertise showcase (MENA focus)
- Client testimonials and success metrics
- Authority building components
- Performance monitoring and analytics

### **Technical Features**
- Performance budget monitoring
- Bundle size analysis
- Accessibility testing suite
- SEO optimization for multiple regions
- Mobile-first responsive design

## 📦 Dependencies

### **Core Dependencies**
```json
{
  "next": "14.2.25",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.0"
}
```

### **AI/ML Dependencies**
```json
{
  "@tensorflow/tfjs": "^4.15.0",
  "@tensorflow/tfjs-backend-webgl": "^4.15.0",
  "@tensorflow/tfjs-converter": "^4.15.0",
  "@tensorflow/tfjs-core": "^4.15.0",
  "@tensorflow-models/coco-ssd": "^2.2.2",
  "@tensorflow-models/mobilenet": "^2.1.0",
  "@tensorflow-models/posenet": "^2.2.2"
}
```

### **Form & Validation**
```json
{
  "react-hook-form": "^7.48.2",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.22.4"
}
```

## 🛠️ Development

### **Getting Started**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

### **Environment Setup**
1. Copy `.env.local.example` to `.env.local`
2. Configure your environment variables
3. Set up analytics tracking IDs
4. Configure business contact information

### **Performance Monitoring**
The app includes built-in performance monitoring:
- **Performance Monitor:** Real-time Core Web Vitals tracking
- **Bundle Analyzer:** Bundle size and composition analysis
- **Accessibility Tester:** WCAG compliance testing

Enable in development:
```bash
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR=true
```

## 📁 Project Structure

```
apps/ai-editor/
├── components/
│   ├── Accessibility/          # Accessibility testing components
│   ├── Analytics/              # Business analytics tracking
│   ├── Business/               # Lead generation and business features
│   ├── Navigation/             # Navigation components
│   ├── Performance/            # Performance monitoring
│   └── SEO/                    # SEO and meta components
├── hooks/
│   ├── useAccessibility.ts     # Accessibility utilities
│   ├── usePerformance.ts       # Performance monitoring
│   ├── usePerformanceBudget.ts # Performance budget tracking
│   ├── useSearch.ts            # Search functionality
│   └── useTensorFlowLazy.ts    # Lazy TensorFlow.js loading
├── lib/
│   └── validations.ts          # Zod validation schemas
├── pages/
│   ├── business.tsx            # Business solutions page
│   ├── experiments/            # Dynamic experiment pages
│   └── api/                    # API endpoints
├── styles/
│   ├── globals.css             # Global styles
│   └── variables.scss          # SCSS variables
└── utils/
    ├── businessSeo.ts          # Business-focused SEO
    ├── performanceConfig.ts    # Performance configuration
    └── seo.ts                  # SEO utilities
```

## 🎯 Business Optimization

### **Lead Generation**
- Strategic lead capture forms
- Sticky CTA components
- Business-focused messaging
- Regional expertise showcase

### **SEO Strategy**
- Regional keyword targeting (Jordan, Saudi, UAE, Qatar)
- Industry-specific content
- Technical expertise demonstration
- Authority building components

### **Performance Focus**
- Bundle size optimization
- Lazy loading for heavy dependencies
- Performance budget enforcement
- Mobile-first optimization

## 🔧 Configuration

### **Performance Budgets**
```typescript
const PERFORMANCE_BUDGET = {
  lcp: 2000,        // 2.0s
  fid: 100,         // 100ms
  cls: 0.1,         // 0.1
  bundleSize: 150000 // 150KB
};
```

### **Accessibility Standards**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation
- Touch target sizing

### **Browser Support**
- Chrome 90+ (primary target)
- Firefox 88+
- Safari 15+ (iOS critical)
- Mobile browsers

## 📊 Monitoring

### **Performance Metrics**
- Core Web Vitals tracking
- Bundle size monitoring
- Load time analysis
- User interaction metrics

### **Business Metrics**
- Lead generation tracking
- Page view analytics
- User engagement metrics
- Conversion rate monitoring

### **Accessibility Metrics**
- WCAG compliance scoring
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm start
```

### **Performance Optimization**
- Bundle splitting for TensorFlow.js
- Image optimization
- Lazy loading implementation
- CDN configuration

### **SEO Optimization**
- Sitemap generation
- Robots.txt configuration
- Meta tag optimization
- Structured data implementation

## 📈 Analytics

### **Business Tracking**
- Lead generation events
- Page view tracking
- User interaction metrics
- Conversion rate monitoring

### **Performance Tracking**
- Core Web Vitals
- Bundle size metrics
- Load time analysis
- Error rate monitoring

## 🤝 Contributing

1. Follow the established architecture patterns
2. Maintain performance budgets
3. Ensure accessibility compliance
4. Test across supported browsers
5. Update documentation

## 📄 License

This project is part of the Abdalkader AI Lab portfolio.