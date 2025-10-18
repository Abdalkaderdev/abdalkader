# 🚀 Vercel Deployment Quick Reference

## 📱 App URLs & Configurations

| App | URL | Framework | Build Command | Output Directory |
|-----|-----|-----------|---------------|------------------|
| **Portfolio** | `abdalkader.dev` | Next.js | `cd apps/portfolio && pnpm build` | `.next` |
| **Blog** | `blog.abdalkader.dev` | Hexo | `cd apps/blog && pnpm build` | `public` |
| **Docs** | `docs.abdalkader.dev` | Docusaurus | `cd apps/docs && pnpm build` | `.mintlify` |
| **Storybook** | `components.abdalkader.dev` | Other | `cd apps/storybook && pnpm build` | `storybook-static` |

## 🔧 Vercel Project Names

- `abdalkader-portfolio`
- `abdalkader-blog` 
- `abdalkader-docs`
- `abdalkader-storybook`

## 🌐 DNS Configuration

### Option 1: CNAME Records
```
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

### Option 2: Vercel Nameservers
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## ⚡ Quick Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy all apps (run from project root)
./scripts/deploy-vercel.sh

# Deploy individual app
vercel --prod --cwd apps/portfolio
vercel --prod --cwd apps/blog
vercel --prod --cwd apps/docs
vercel --prod --cwd apps/storybook
```

## 🎯 Environment Variables

### Portfolio
```
NEXT_PUBLIC_SITE_URL=https://abdalkader.dev
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Blog
```
HEXO_SITE_URL=https://blog.abdalkader.dev
```

### Docs
```
MINTLIFY_SITE_URL=https://docs.abdalkader.dev
```

### Storybook
```
STORYBOOK_SITE_URL=https://components.abdalkader.dev
```

## 🔍 Testing Checklist

- [ ] All apps load correctly
- [ ] Custom domains working
- [ ] SSL certificates active
- [ ] Cross-app navigation working
- [ ] Responsive design on mobile
- [ ] Portfolio colors consistent
- [ ] Performance optimized

## 🚨 Common Issues & Fixes

### Build Failures
```bash
# Check Node.js version (use 18.x)
node --version

# Clear cache and reinstall
rm -rf node_modules
pnpm install

# Check build locally first
pnpm build
```

### Domain Issues
```bash
# Check DNS propagation
nslookup abdalkader.dev
dig abdalkader.dev

# Verify in Vercel dashboard
# Wait 5-60 minutes for propagation
```

### Cross-App Links
- Verify URLs are correct in navigation components
- Check if external links open in new tabs
- Test on different browsers/devices

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Uptime**: Check app availability
- **Performance**: Monitor Core Web Vitals
- **Errors**: Set up error tracking

## 🎉 Success Indicators

✅ All apps accessible via custom domains  
✅ Consistent portfolio design across all apps  
✅ Smooth cross-app navigation  
✅ Fast loading times  
✅ Mobile responsive design  
✅ SSL certificates active  
✅ Analytics tracking working  

---

**Ready to deploy?** Run `./scripts/deploy-vercel.sh` and follow the Vercel dashboard prompts! 🚀