#!/bin/bash
# Intelligent branch-based build script
# Automatically detects branch and builds the correct app

set -e

# Get current branch
BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current)}

echo "🔍 Detected branch: $BRANCH"

case "$BRANCH" in
  "main")
    echo "🏗️  Building Portfolio (Production)"
    pnpm turbo run build --filter=@abdalkader/portfolio
    ;;
  "develop")
    echo "🏗️  Building Portfolio (Staging)"
    pnpm turbo run build --filter=@abdalkader/portfolio
    ;;
  "components")
    echo "🏗️  Building Storybook Documentation"
    pnpm turbo run build --filter=@abdalkader/ui
    cd apps/docs && pnpm build-storybook
    ;;
  "blog")
    echo "🏗️  Building Hexo Blog"
    cd apps/blog && npm run build
    ;;
  *)
    echo "⚠️  Unknown branch, building Portfolio by default"
    pnpm turbo run build --filter=@abdalkader/portfolio
    ;;
esac

echo "✅ Build complete for branch: $BRANCH"
