# 📁 Deployment Folder Structure Guide

## 🎯 Root of Each Deployment Folder

When deploying to Vercel, each app has a specific **root directory** and **output directory**. Here's the complete breakdown:

---

## 🏠 **Portfolio App** (`abdalkader.dev`)

### **Root Directory**: `apps/portfolio/`
```
apps/portfolio/
├── .next/                    # ← OUTPUT DIRECTORY (Vercel serves from here)
├── components/
├── pages/
├── styles/
├── public/
├── package.json
├── next.config.js
├── vercel.json              # ← Vercel configuration
└── ...
```

### **Vercel Configuration**:
- **Framework**: Next.js
- **Build Command**: `cd apps/portfolio && pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### **What Vercel Serves**:
- Static files from `public/`
- Built pages from `.next/`
- API routes from `pages/api/`

---

## 📝 **Blog App** (`blog.abdalkader.dev`)

### **Root Directory**: `apps/blog/`
```
apps/blog/
├── public/                  # ← OUTPUT DIRECTORY (Vercel serves from here)
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── images/
│   └── ...
├── source/
│   ├── _posts/
│   ├── css/
│   └── ...
├── themes/
├── _config.yml
├── package.json
├── vercel.json              # ← Vercel configuration
└── ...
```

### **Vercel Configuration**:
- **Framework**: Hexo
- **Build Command**: `cd apps/blog && pnpm build`
- **Output Directory**: `public`
- **Install Command**: `pnpm install`

### **What Vercel Serves**:
- Static HTML files from `public/`
- CSS, JS, and images from `public/`
- All blog posts and pages

---

## 📚 **Docs App** (`docs.abdalkader.dev`)

### **Root Directory**: `apps/docs/`
```
apps/docs/
├── .mintlify/               # ← OUTPUT DIRECTORY (Vercel serves from here)
│   ├── index.html
│   ├── assets/
│   ├── css/
│   └── ...
├── docs/
│   ├── getting-started/
│   ├── components/
│   └── ...
├── docs.json                # ← Mintlify configuration
├── package.json
├── vercel.json              # ← Vercel configuration
└── ...
```

### **Vercel Configuration**:
- **Framework**: Docusaurus (Mintlify)
- **Build Command**: `cd apps/docs && pnpm build`
- **Output Directory**: `.mintlify`
- **Install Command**: `pnpm install`

### **What Vercel Serves**:
- Documentation pages from `.mintlify/`
- Assets and CSS from `.mintlify/assets/`
- All documentation content

---

## 🧩 **Storybook App** (`components.abdalkader.dev`)

### **Root Directory**: `apps/storybook/`
```
apps/storybook/
├── storybook-static/        # ← OUTPUT DIRECTORY (Vercel serves from here)
│   ├── index.html
│   ├── static/
│   ├── assets/
│   └── ...
├── stories/
│   ├── Button.stories.tsx
│   ├── CrossAppNavigation.stories.tsx
│   └── ...
├── .storybook/
│   ├── main.ts
│   ├── manager-head.html
│   └── ...
├── package.json
├── vercel.json              # ← Vercel configuration
└── ...
```

### **Vercel Configuration**:
- **Framework**: Other (Static)
- **Build Command**: `cd apps/storybook && pnpm build`
- **Output Directory**: `storybook-static`
- **Install Command**: `pnpm install`

### **What Vercel Serves**:
- Storybook interface from `storybook-static/`
- All component stories and documentation
- Interactive component playground

---

## 🔧 **Vercel Configuration Files**

Each app has a `vercel.json` file that tells Vercel how to build and serve it:

### **Portfolio** (`apps/portfolio/vercel.json`)
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
```

### **Blog** (`apps/blog/vercel.json`)
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "public",
  "framework": "hexo",
  "installCommand": "pnpm install"
}
```

### **Docs** (`apps/docs/vercel.json`)
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".mintlify",
  "framework": "docusaurus",
  "installCommand": "pnpm install"
}
```

### **Storybook** (`apps/storybook/vercel.json`)
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "storybook-static",
  "framework": "other",
  "installCommand": "pnpm install"
}
```

---

## 🚀 **Deployment Process**

### **1. Build Phase**
Vercel runs the build command in each app's root directory:
```bash
cd apps/portfolio && pnpm build    # Creates .next/
cd apps/blog && pnpm build        # Creates public/
cd apps/docs && pnpm build        # Creates .mintlify/
cd apps/storybook && pnpm build   # Creates storybook-static/
```

### **2. Serve Phase**
Vercel serves static files from the output directory:
- **Portfolio**: Serves from `.next/` (Next.js static export)
- **Blog**: Serves from `public/` (Hexo static files)
- **Docs**: Serves from `.mintlify/` (Mintlify static files)
- **Storybook**: Serves from `storybook-static/` (Storybook static files)

---

## 📊 **File Size & Performance**

### **Typical Output Sizes**:
- **Portfolio**: ~2-5MB (Next.js optimized)
- **Blog**: ~1-3MB (Static HTML/CSS/JS)
- **Docs**: ~3-8MB (Documentation assets)
- **Storybook**: ~5-15MB (Component library + stories)

### **Performance Optimizations**:
- **CDN**: All files served via Vercel's global CDN
- **Caching**: Static assets cached for 1 year
- **Compression**: Gzip/Brotli compression enabled
- **Images**: Optimized and served in modern formats

---

## 🔍 **Troubleshooting**

### **Common Issues**:

#### **Build Failures**
```bash
# Check if output directory exists after build
ls -la apps/portfolio/.next/
ls -la apps/blog/public/
ls -la apps/docs/.mintlify/
ls -la apps/storybook/storybook-static/
```

#### **Missing Files**
- Verify build command creates the output directory
- Check if all dependencies are installed
- Ensure build process completes successfully

#### **404 Errors**
- Verify output directory is correct in `vercel.json`
- Check if files exist in the output directory
- Ensure build process generates all required files

---

## 🎯 **Key Takeaways**

1. **Root Directory**: Where Vercel runs the build command
2. **Output Directory**: What Vercel serves to users
3. **Build Command**: How Vercel builds your app
4. **Framework**: Tells Vercel how to optimize the build

**Remember**: The output directory is what users actually see when they visit your domain! 🚀