# 🚀 Quick Start: Multi-Branch Deployment

## Step-by-Step Setup (15 minutes)

### 1. Create Git Branches (2 min)

```bash
cd C:\Users\max\Desktop\react\abdalkader

# Create develop branch
git checkout -b develop
git push -u origin develop

# Create components branch
git checkout -b components
git push -u origin components

# Back to main
git checkout main
```

### 2. Create Vercel Projects (10 min)

#### Project A: Portfolio Production
1. Visit https://vercel.com/new
2. Import your GitHub repo
3. Settings:
   - Name: `abdalkader-portfolio`
   - Framework: Next.js
   - Root: `./`
   - Build: `pnpm turbo run build --filter=@abdalkader/portfolio`
   - Output: `apps/portfolio/.next`
   - Install: `pnpm install`
4. Git → Production Branch: `main`
5. Deploy

#### Project B: Portfolio Staging
1. New project, same repo
2. Settings:
   - Name: `abdalkader-dev`
   - Same build settings
3. Git → Production Branch: `develop`
4. Deploy

#### Project C: Component Library
1. New project, same repo
2. Settings:
   - Name: `abdalkader-components`
   - Framework: Other
   - Build: `cd apps/docs && pnpm build-storybook`
   - Output: `apps/docs/storybook-static`
3. Git → Production Branch: `components`
4. Deploy

### 3. Configure Domains (3 min)

In each Vercel project → Settings → Domains:

**Project A**: Add `abdalkader.dev`
**Project B**: Add `dev.abdalkader.dev`
**Project C**: Add `components.abdalkader.dev`

Add DNS records in your domain provider:
```
Type: CNAME, Name: dev, Value: cname.vercel-dns.com
Type: CNAME, Name: components, Value: cname.vercel-dns.com
```

---

## ✅ Done!

Now when you push:
- `main` → deploys to abdalkader.dev
- `develop` → deploys to dev.abdalkader.dev
- `components` → deploys to components.abdalkader.dev

---

## Usage Examples

### Deploy to Production
```bash
git checkout main
git add .
git commit -m "feat: new feature"
git push origin main
```

### Deploy to Staging
```bash
git checkout develop
git merge main
git push origin develop
```

### Update Component Docs
```bash
git checkout components
# Edit stories
git add .
git commit -m "docs: update stories"
git push origin components
```

---

## Design System Usage

All apps can use shared components:

```tsx
import { Button, Input, Layout, Container, Stack } from '@abdalkader/ui';
import '@abdalkader/ui/dist/styles.css';

export default function Page() {
  return (
    <Layout>
      <Container size="lg">
        <Stack gap="lg">
          <Button variant="primary">Click me</Button>
          <Input label="Email" type="email" />
        </Stack>
      </Container>
    </Layout>
  );
}
```

Design tokens available:
```css
.custom {
  color: var(--brand-primary);
  padding: var(--space-4);
  border-radius: var(--radius-base);
  font-size: var(--font-size-lg);
}
```

---

## Future Apps

### Add Blog (5 min)
```bash
# Create app
cd apps
npx create-next-app@latest blog

# Update package.json
{
  "name": "@abdalkader/blog",
  "dependencies": {
    "@abdalkader/ui": "workspace:*"
  }
}

# Create branch
git checkout -b blog
git add .
git commit -m "feat: init blog"
git push -u origin blog

# Create Vercel project
# Branch: blog
# Domain: blog.abdalkader.dev
```

### Add AI Editor (5 min)
```bash
# Create app
cd apps
npx create-next-app@latest ai-editor

# Update package.json
{
  "name": "@abdalkader/ai-editor",
  "dependencies": {
    "@abdalkader/ui": "workspace:*"
  }
}

# Create branch
git checkout -b ai-editor
git add .
git commit -m "feat: init ai-editor"
git push -u origin ai-editor

# Create Vercel project
# Branch: ai-editor
# Domain: editor.abdalkader.dev
```

---

## 🎉 Enterprise Architecture Achieved!

You now have:
- ✅ Single monorepo
- ✅ Multiple subdomains
- ✅ Branch-based deployments
- ✅ Shared design system
- ✅ Scalable infrastructure
