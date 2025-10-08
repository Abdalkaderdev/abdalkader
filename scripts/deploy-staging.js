#!/usr/bin/env node

/**
 * Staging Environment Deployment Script
 * Handles deployment of staging environment with proper configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const STAGING_BRANCH = 'main';
const STAGING_DOMAIN = 'dev.abdalkader.dev';
const PROJECT_ROOT = path.join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    log(`Executing: ${command}`, 'cyan');
    return execSync(command, { 
      stdio: 'inherit', 
      cwd: PROJECT_ROOT,
      ...options 
    });
  } catch (error) {
    log(`Command failed: ${command}`, 'red');
    throw error;
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'blue');
  
  // Check if we're in a git repository
  try {
    exec('git status --porcelain');
  } catch (error) {
    throw new Error('Not in a git repository');
  }
  
  // Check if pnpm is available
  try {
    exec('pnpm --version');
  } catch (error) {
    throw new Error('pnpm is not installed');
  }
  
  // Check if we're on the main branch
  const currentBranch = exec('git branch --show-current', { stdio: 'pipe' }).toString().trim();
  if (currentBranch !== STAGING_BRANCH) {
    throw new Error(`Must be on ${STAGING_BRANCH} branch. Current branch: ${currentBranch}`);
  }
  
  log('✅ Prerequisites check passed', 'green');
}

function updateEnvironmentVariables() {
  log('🔧 Updating environment variables for staging...', 'blue');
  
  // Create staging-specific environment file
  const stagingEnv = `
# Staging Environment Variables
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_FEATURE_FLAGS=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
NEXT_PUBLIC_AB_TESTING=true

# Analytics (staging-specific)
NEXT_PUBLIC_GA_TRACKING_ID=GA-STAGING-ID
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here

# API endpoints
NEXT_PUBLIC_API_URL=https://api-staging.abdalkader.dev

# Vercel deployment
VERCEL_PROJECT_ID=your-vercel-project-id
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_TOKEN=your-vercel-token
  `.trim();
  
  // Write to .env.local for staging
  const envPath = path.join(PROJECT_ROOT, 'apps/portfolio/.env.local');
  fs.writeFileSync(envPath, stagingEnv);
  
  log('✅ Environment variables updated', 'green');
}

function runTests() {
  log('🧪 Running tests...', 'blue');
  
  try {
    exec('pnpm install --frozen-lockfile');
    exec('pnpm turbo run lint --filter=@abdalkader/portfolio');
    exec('pnpm turbo run typecheck --filter=@abdalkader/portfolio');
    exec('pnpm turbo run test --filter=@abdalkader/portfolio');
  } catch (error) {
    log('❌ Tests failed. Deployment aborted.', 'red');
    throw error;
  }
  
  log('✅ All tests passed', 'green');
}

function buildProject() {
  log('🏗️  Building project...', 'blue');
  
  try {
    exec('pnpm turbo run build --filter=@abdalkader/portfolio');
  } catch (error) {
    log('❌ Build failed. Deployment aborted.', 'red');
    throw error;
  }
  
  log('✅ Build completed successfully', 'green');
}

function deployToVercel() {
  log('🚀 Deploying to Vercel...', 'blue');
  
  try {
    // Check if Vercel CLI is installed
    try {
      exec('vercel --version');
    } catch (error) {
      log('Installing Vercel CLI...', 'yellow');
      exec('npm install -g vercel');
    }
    
    // Deploy to staging
    exec(`vercel --prod --confirm`, {
      env: {
        ...process.env,
        VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
        VERCEL_ORG_ID: process.env.VERCEL_ORG_ID,
      }
    });
    
  } catch (error) {
    log('❌ Vercel deployment failed', 'red');
    throw error;
  }
  
  log('✅ Deployment completed', 'green');
}

function runLighthouseAudit() {
  log('🔍 Running Lighthouse audit...', 'blue');
  
  try {
    // Check if Lighthouse CI is installed
    try {
      exec('lhci --version');
    } catch (error) {
      log('Installing Lighthouse CI...', 'yellow');
      exec('npm install -g @lhci/cli');
    }
    
    // Run Lighthouse audit
    exec(`lhci autorun --upload.target=temporary-public-storage`);
    
  } catch (error) {
    log('⚠️  Lighthouse audit failed (non-blocking)', 'yellow');
  }
}

function cleanup() {
  log('🧹 Cleaning up...', 'blue');
  
  // Remove staging environment file
  const envPath = path.join(PROJECT_ROOT, 'apps/portfolio/.env.local');
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }
  
  log('✅ Cleanup completed', 'green');
}

function main() {
  try {
    log('🚀 Starting staging environment deployment...', 'magenta');
    
    checkPrerequisites();
    updateEnvironmentVariables();
    runTests();
    buildProject();
    deployToVercel();
    runLighthouseAudit();
    cleanup();
    
    log('🎉 Staging deployment completed successfully!', 'green');
    log(`🌐 Staging URL: https://${STAGING_DOMAIN}`, 'cyan');
    
  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the deployment script
if (require.main === module) {
  main();
}

module.exports = {
  deployStaging: main,
  STAGING_BRANCH,
  STAGING_DOMAIN,
};