@echo off
echo ========================================
echo Abdalkader Monorepo Quick Start
echo ========================================
echo.

echo [1/4] Checking pnpm installation...
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo pnpm not found. Installing...
    npm install -g pnpm
) else (
    echo pnpm is installed
)
echo.

echo [2/4] Installing dependencies...
pnpm install
echo.

echo [3/4] Building UI library...
pnpm --filter @abdalkader/ui build
echo.

echo [4/4] Starting development servers...
echo.
echo Portfolio will be available at: http://localhost:3000
echo Storybook will be available at: http://localhost:6006
echo.
pnpm dev