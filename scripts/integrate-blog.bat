@echo off
REM Automated Blog Integration Script for Windows
REM Integrates Hexo blog into monorepo with full Git history

echo Starting Hexo Blog Integration...

REM Step 1: Add blog remote
echo Adding blog remote...
git remote add blog-remote https://github.com/Abdalkaderdev/blog.git 2>nul

REM Step 2: Fetch blog repository
echo Fetching blog repository...
git fetch blog-remote

REM Step 3: Create apps directory
echo Creating apps directory...
if not exist apps mkdir apps

REM Step 4: Merge blog using subtree
echo Merging blog into apps/blog/...
git subtree add --prefix=apps/blog blog-remote main --squash

echo.
echo Blog integration complete!
echo.
echo Next steps:
echo 1. Run: pnpm install
echo 2. Test: pnpm --filter @abdalkader/blog dev
echo 3. Create Vercel project for blog branch
echo 4. Configure domain: blog.abdalkader.dev
echo.
pause
