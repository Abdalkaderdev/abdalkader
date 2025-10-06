# Run These Commands in Order

```bash
# 1. Update lockfile
pnpm install --no-frozen-lockfile

# 2. Test build locally
pnpm turbo run build --filter=@abdalkader/portfolio...

# 3. Commit and push
git add .
git commit -m "fix: sync lockfile and update build configs"
git push origin main
```
