#!/usr/bin/env node
/**
 * Intelligent branch-based build script
 * Automatically detects branch and builds the correct app
 */

const { execSync } = require('child_process');

// Get current branch from environment or git
const branch = process.env.VERCEL_GIT_COMMIT_REF || 
               process.env.GITHUB_REF_NAME ||
               execSync('git branch --show-current').toString().trim();

console.log(`🔍 Detected branch: ${branch}`);

// Build configuration for each branch
const buildConfig = {
  main: {
    name: 'Portfolio (Production)',
    command: 'pnpm turbo run build --filter=@abdalkader/portfolio',
  },
  develop: {
    name: 'Portfolio (Staging)',
    command: 'pnpm turbo run build --filter=@abdalkader/portfolio',
  },
  components: {
    name: 'Storybook Documentation',
    command: 'pnpm turbo run build --filter=@abdalkader/ui && cd apps/docs && pnpm build-storybook',
  },
  blog: {
    name: 'Hexo Blog',
    command: 'cd apps/blog && npm run build',
  },
};

// Get build config for current branch or default to portfolio
const config = buildConfig[branch] || buildConfig.main;

console.log(`🏗️  Building ${config.name}...`);

try {
  execSync(config.command, { stdio: 'inherit' });
  console.log(`✅ Build complete for branch: ${branch}`);
  process.exit(0);
} catch (error) {
  console.error(`❌ Build failed for branch: ${branch}`);
  process.exit(1);
}
