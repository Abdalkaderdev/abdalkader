@echo off
REM Intelligent branch-based build script for Windows
REM Automatically detects branch and builds the correct app

setlocal enabledelayedexpansion

REM Get current branch
if defined VERCEL_GIT_COMMIT_REF (
    set BRANCH=%VERCEL_GIT_COMMIT_REF%
) else (
    for /f "tokens=*" %%i in ('git branch --show-current') do set BRANCH=%%i
)

echo Detected branch: %BRANCH%

if "%BRANCH%"=="main" (
    echo Building Portfolio Production...
    pnpm turbo run build --filter=@abdalkader/portfolio
) else if "%BRANCH%"=="develop" (
    echo Building Portfolio Staging...
    pnpm turbo run build --filter=@abdalkader/portfolio
) else if "%BRANCH%"=="components" (
    echo Building Storybook Documentation...
    pnpm turbo run build --filter=@abdalkader/ui
    cd apps\docs && pnpm build-storybook
) else if "%BRANCH%"=="blog" (
    echo Building Hexo Blog...
    cd apps\blog && npm run build
) else (
    echo Unknown branch, building Portfolio by default...
    pnpm turbo run build --filter=@abdalkader/portfolio
)

echo Build complete for branch: %BRANCH%
