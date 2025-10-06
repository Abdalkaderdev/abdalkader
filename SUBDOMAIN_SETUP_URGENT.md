# 🚨 URGENT: SUBDOMAIN SETUP REQUIRED

## 📊 CURRENT STATUS

| Domain | Status | Details |
|--------|--------|---------|
| `abdalkader.dev` | ✅ **LIVE** | Portfolio working perfectly |
| `dev.abdalkader.dev` | ❌ **DNS ERROR** | "Could not resolve host" |
| `components.abdalkader.dev` | ❌ **DNS ERROR** | "Could not resolve host" |
| `blog.abdalkader.dev` | ❌ **404 ERROR** | DNS resolves but no deployment |

## 🔧 IMMEDIATE FIXES NEEDED

### 1. **DNS Configuration Required**

You need to add these DNS records to your domain provider:

```dns
# Add these CNAME records:
dev                     CNAME   cname.vercel-dns.com
components              CNAME   cname.vercel-dns.com
blog                    CNAME   cname.vercel-dns.com

# Alternative: Point to main domain
dev                     CNAME   abdalkader.dev
components              CNAME   abdalkader.dev  
blog                    CNAME   abdalkader.dev
```

### 2. **Vercel Projects Setup**

Create the missing Vercel projects:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Create the missing projects
vercel --name abdalkader-dev
vercel --name abdalkader-components  
vercel --name abdalkader-blog
```

### 3. **Domain Assignment**

Add domains to each Vercel project:

```bash
# For dev staging
vercel domains add dev.abdalkader.dev --project abdalkader-dev

# For components
vercel domains add components.abdalkader.dev --project abdalkader-components

# For blog  
vercel domains add blog.abdalkader.dev --project abdalkader-blog
```

## 📋 STEP-BY-STEP SETUP

### Step 1: DNS Setup (Do this first)
1. Go to your domain registrar (where you bought abdalkader.dev)
2. Find DNS settings or DNS management
3. Add these CNAME records:
   ```
   dev        → cname.vercel-dns.com
   components → cname.vercel-dns.com
   blog       → cname.vercel-dns.com
   ```

### Step 2: Vercel Project Creation
```bash
# Create staging project for develop branch
vercel --name abdalkader-dev
# Select: Link to existing project? No
# Select: Scope: Your personal account
# Select: Link to Git? Yes
# Select: Repository: abdalkader
# Select: Branch: develop

# Create components project
vercel --name abdalkader-components
# Select: Branch: components

# Create blog project  
vercel --name abdalkader-blog
# Select: Branch: blog
```

### Step 3: Configure Build Settings

For each project, set the correct build configuration:

#### Dev Project (abdalkader-dev)
```bash
vercel env add NEXT_PUBLIC_SITE_URL preview
# Value: https://dev.abdalkader.dev

vercel env add NODE_ENV development
# Value: development
```

#### Components Project (abdalkader-components)
```bash
# Use vercel-docs.json configuration
# Build command: pnpm install --no-frozen-lockfile && pnpm turbo run build --filter=@abdalkader/ui && cd apps/docs && pnpm build
# Output directory: apps/docs/storybook-static
```

#### Blog Project (abdalkader-blog)
```bash
# Use vercel-blog.json configuration  
# Build command: cd apps/blog && npm install && npm run build
# Output directory: apps/blog/public
```

## 🧪 VERIFICATION COMMANDS

After setup, test each domain:

```bash
# Test all domains
curl -I https://abdalkader.dev          # Should return 200
curl -I https://dev.abdalkader.dev      # Should return 200
curl -I https://components.abdalkader.dev # Should return 200
curl -I https://blog.abdalkader.dev     # Should return 200
```

## 📝 DEPLOYMENT COMMANDS

Once setup is complete:

```bash
# Deploy to staging
git push origin develop
# → Should deploy to dev.abdalkader.dev

# Deploy components
git push origin components  
# → Should deploy to components.abdalkader.dev

# Deploy blog
git push origin blog
# → Should deploy to blog.abdalkader.dev
```

## 🚨 PRIORITY ORDER

1. **HIGHEST**: Set up DNS records (this is blocking everything)
2. **HIGH**: Create Vercel projects for missing subdomains
3. **MEDIUM**: Configure build settings for each project
4. **LOW**: Test and verify all deployments

## 📞 NEXT STEPS

1. **Check your domain registrar** - Where did you buy abdalkader.dev?
2. **Add DNS records** - The CNAME records listed above
3. **Create Vercel projects** - Using the commands provided
4. **Test the subdomains** - They should resolve after DNS propagation (5-30 minutes)

---

**The main site is working perfectly, but the subdomains need DNS configuration to go live! 🎯**