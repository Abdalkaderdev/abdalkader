# Apps Quick Reference Guide

## 🚀 Active Apps

### Portfolio
- **URL**: https://abdalkader.dev
- **Framework**: Next.js 14.2.25
- **Dev Port**: 3000
- **Build**: `pnpm run build:portfolio`
- **Dev**: `cd apps/portfolio && pnpm run dev`
- **Key Files**: `pages/`, `components/`, `data/projectsData.ts`

### Blog
- **URL**: https://blog.abdalkader.dev
- **Framework**: Hexo 8.0.0
- **Dev Port**: 4000
- **Build**: `pnpm run build:blog`
- **Dev**: `cd apps/blog && pnpm run dev`
- **Key Files**: `source/_posts/`, `_config.yml`

### History (Programming Museum)
- **URL**: https://history.abdalkader.dev
- **Framework**: Next.js 14.2.25
- **Dev Port**: 3001
- **Build**: `pnpm run build:history`
- **Dev**: `cd apps/history && pnpm run dev`
- **Key Files**: `src/components/`, `src/lib/data/`
- **Requires**: `NEXT_PUBLIC_GROQ_API_KEY` env var

### Docs
- **URL**: https://docs.abdalkader.dev
- **Framework**: Mintlify 4.2.173
- **Dev Port**: 3333
- **Build**: `pnpm run build:docs`
- **Dev**: `cd apps/docs && pnpm run dev`
- **Key Files**: `docs/`, `mint.json`

### Storybook
- **URL**: https://storybook.abdalkader.dev
- **Framework**: Storybook 7.0.0
- **Dev Port**: 6006
- **Build**: `pnpm run build:storybook`
- **Dev**: `cd apps/storybook && pnpm run dev`
- **Key Files**: `stories/`, `src/components/`

---

## 📦 Shared Package

### UI Library
- **Package**: `@abdalkader/ui`
- **Location**: `packages/ui/`
- **Build**: `pnpm run build:ui`
- **Dev**: `cd packages/ui && pnpm run dev`
- **Test**: `cd packages/ui && pnpm run test`
- **Used By**: All 5 apps

---

## 🔧 Development Workflow

### Start All Apps
```bash
pnpm install
pnpm run dev
```

### Start Specific App
```bash
cd apps/portfolio && pnpm run dev
cd apps/blog && pnpm run dev
cd apps/history && pnpm run dev
cd apps/docs && pnpm run dev
cd apps/storybook && pnpm run dev
```

### Build All
```bash
pnpm run build
```

### Build Specific
```bash
pnpm run build:portfolio
pnpm run build:blog
pnpm run build:history
pnpm run build:docs
pnpm run build:storybook
pnpm run build:ui
```

### Quality Checks
```bash
pnpm run lint        # Lint all apps
pnpm run typecheck   # Type check all apps
pnpm run test        # Run all tests
```

### Clean Everything
```bash
pnpm run clean       # Remove all builds and node_modules
```

---

## 🌐 Deployment

### Vercel Configs
- `vercel-portfolio.json` - Portfolio deployment
- `vercel-blog.json` - Blog deployment
- `vercel-docs.json` - Docs deployment
- `vercel-dev.json` - History deployment
- `vercel-staging.json` - Storybook deployment
- `vercel.json` - Main config

### Deploy Specific App
```bash
# Portfolio
vercel deploy --prod --config vercel-portfolio.json

# Blog
vercel deploy --prod --config vercel-blog.json

# History
vercel deploy --prod --config vercel-dev.json

# Docs
vercel deploy --prod --config vercel-docs.json

# Storybook
vercel deploy --prod --config vercel-staging.json
```

---

## 🔐 Environment Variables

### Portfolio
```env
NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
```

### History
```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_APP_URL=https://history.abdalkader.dev
```

### All Apps
```env
NODE_ENV=production
VERCEL_GIT_COMMIT_REF=main
```

---

## 📊 Build Times (Approximate)

| App | Time | Size (gzipped) |
|-----|------|---|
| Portfolio | 45s | 200KB |
| Blog | 30s | 150KB |
| History | 50s | 250KB |
| Docs | 20s | 100KB |
| Storybook | 60s | 300KB |
| **Total** | **2-3 min** | **1MB** |

---

## 🔍 File Structure

```
abdalkader-1/
├── apps/
│   ├── portfolio/
│   │   ├── pages/              (Next.js pages)
│   │   ├── components/         (React components)
│   │   ├── data/               (projectsData.ts)
│   │   ├── styles/             (SCSS)
│   │   └── package.json
│   │
│   ├── blog/
│   │   ├── source/
│   │   │   ├── _posts/         (Blog content)
│   │   │   ├── css/            (Stylesheets)
│   │   │   ├── js/             (Scripts)
│   │   │   └── images/         (Assets)
│   │   ├── _config.yml
│   │   └── package.json
│   │
│   ├── history/
│   │   ├── src/
│   │   │   ├── app/            (Next.js app)
│   │   │   ├── components/     (React components)
│   │   │   ├── lib/            (Utilities)
│   │   │   ├── hooks/          (Custom hooks)
│   │   │   └── services/       (AI service)
│   │   └── package.json
│   │
│   ├── docs/
│   │   ├── docs/               (Markdown docs)
│   │   ├── mint.json           (Mintlify config)
│   │   └── package.json
│   │
│   └── storybook/
│       ├── stories/            (Component stories)
│       ├── src/                (Components)
│       ├── .storybook/         (Storybook config)
│       └── package.json
│
├── packages/
│   └── ui/
│       ├── src/                (Component source)
│       ├── dist/               (Built components)
│       ├── rollup.config.js
│       └── package.json
│
├── scripts/                    (Build scripts)
├── package.json                (Root config)
├── turbo.json                  (Turbo config)
├── pnpm-workspace.yaml         (Workspace config)
└── [analysis files]
    ├── APPS_ANALYSIS.md        (Detailed analysis)
    ├── ANALYSIS_SUMMARY.md     (Executive summary)
    └── APPS_QUICK_REFERENCE.md (This file)
```

---

## 🛠️ Common Tasks

### Add New Package to App
```bash
cd apps/[app-name]
pnpm add [package-name]
```

### Update All Dependencies
```bash
pnpm update
```

### Check Dependency Tree
```bash
pnpm list
```

### View Turbo Cache
```bash
turbo run build --verbose
```

### Clear Turbo Cache
```bash
rm -rf .turbo
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
pnpm run clean
pnpm install
pnpm run build
```

### Port Already in Use
```bash
# Change port in app's dev script or:
# Kill process on port (example: 3000)
lsof -ti:3000 | xargs kill -9
```

### Dependency Issues
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
```bash
# Run type check
pnpm run typecheck

# Fix in specific app
cd apps/[app-name]
pnpm run typecheck
```

---

## 📚 Documentation

- **Full Analysis**: `APPS_ANALYSIS.md`
- **Summary**: `ANALYSIS_SUMMARY.md`
- **This Guide**: `APPS_QUICK_REFERENCE.md`
- **Portfolio README**: `apps/portfolio/README.md` (if exists)
- **Blog README**: `apps/blog/README.md`
- **History README**: `apps/history/README.md`

---

## 🔗 Links

- **Portfolio**: https://abdalkader.dev
- **Blog**: https://blog.abdalkader.dev
- **Docs**: https://docs.abdalkader.dev
- **History**: https://history.abdalkader.dev
- **Storybook**: https://storybook.abdalkader.dev
- **GitHub**: https://github.com/Abdalkaderdev
- **LinkedIn**: https://linkedin.com/in/abdalkaderdev

---

## 📞 Support

For issues or questions:
1. Check the detailed analysis in `APPS_ANALYSIS.md`
2. Review app-specific README files
3. Check Vercel deployment logs
4. Contact: hello@abdalkader.dev

---

*Last Updated: November 23, 2025*
