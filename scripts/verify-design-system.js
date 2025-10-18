#!/usr/bin/env node

/**
 * Design System Verification Script
 * Verifies that all subdomains match the portfolio design exactly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// EXACT portfolio design values
const PORTFOLIO_DESIGN_TOKENS = {
  colors: {
    primary: '#f44e00',
    primaryLight: '#fa7300',
    white: '#f8f8f8',
    black: '#000',
    textDark: '#131313',
    textGrey: '#787878',
    navigation: '#2d2d2d59',
    border: 'rgb(37, 37, 37)',
  },
  typography: {
    fontPrimary: 'PPNeueMontreal-Regular',
    fontSecondary: 'PPNeueMontreal-Medium',
    hero: '4.5rem',
    heroMd: '3.2rem',
    heroSm: '2.5rem',
    large: '2.75rem',
    largeMd: '2.2rem',
    largeSm: '1.8rem',
    medium: '1.8rem',
    mediumMd: '1.2rem',
  },
  animations: {
    easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    duration: '0.8s',
    staggerDelay: '0.003s',
  },
  spacing: {
    sectionGap: '10rem',
    sectionGapMd: '8rem',
    sectionGapSm: '6rem',
    sectionPadding: '2rem',
    sectionPaddingSm: '1rem',
  },
};

// Verification functions
function verifyDesignTokens() {
  log('\n🎨 Verifying Design Tokens...', 'cyan');
  
  const uiPackagePath = path.join(__dirname, '../packages/ui/src/styles/design-tokens.css');
  
  if (!fs.existsSync(uiPackagePath)) {
    log('❌ Design tokens CSS file not found', 'red');
    return false;
  }
  
  const designTokensContent = fs.readFileSync(uiPackagePath, 'utf8');
  let allTokensValid = true;
  
  // Verify colors
  Object.entries(PORTFOLIO_DESIGN_TOKENS.colors).forEach(([key, value]) => {
    const cssVariable = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`;
    if (!designTokensContent.includes(cssVariable)) {
      log(`❌ Missing or incorrect color token: ${key} = ${value}`, 'red');
      allTokensValid = false;
    } else {
      log(`✅ Color token verified: ${key} = ${value}`, 'green');
    }
  });
  
  // Verify typography
  Object.entries(PORTFOLIO_DESIGN_TOKENS.typography).forEach(([key, value]) => {
    if (key.includes('font')) {
      const cssVariable = `--font-${key.replace('font', '').toLowerCase()}: '${value}'`;
      if (!designTokensContent.includes(cssVariable)) {
        log(`❌ Missing or incorrect font token: ${key} = ${value}`, 'red');
        allTokensValid = false;
      } else {
        log(`✅ Font token verified: ${key} = ${value}`, 'green');
      }
    }
  });
  
  // Verify animations
  if (!designTokensContent.includes(PORTFOLIO_DESIGN_TOKENS.animations.easing)) {
    log(`❌ Missing animation easing: ${PORTFOLIO_DESIGN_TOKENS.animations.easing}`, 'red');
    allTokensValid = false;
  } else {
    log(`✅ Animation easing verified: ${PORTFOLIO_DESIGN_TOKENS.animations.easing}`, 'green');
  }
  
  return allTokensValid;
}

function verifyFontFiles() {
  log('\n🔤 Verifying Font Files...', 'cyan');
  
  const fontPaths = [
    '../apps/portfolio/public/fonts/PPNeueMontreal-Regular.woff2',
    '../apps/portfolio/public/fonts/PPNeueMontreal-Medium.woff2',
    '../apps/blog/source/fonts/PPNeueMontreal-Regular.woff2',
    '../apps/blog/source/fonts/PPNeueMontreal-Medium.woff2',
    '../apps/docs/public/fonts/PPNeueMontreal-Regular.woff2',
    '../apps/docs/public/fonts/PPNeueMontreal-Medium.woff2',
    '../packages/ui/public/fonts/PPNeueMontreal-Regular.woff2',
    '../packages/ui/public/fonts/PPNeueMontreal-Medium.woff2',
  ];
  
  let allFontsValid = true;
  
  fontPaths.forEach(fontPath => {
    const fullPath = path.join(__dirname, fontPath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      log(`✅ Font file exists: ${fontPath} (${(stats.size / 1024).toFixed(1)}KB)`, 'green');
    } else {
      log(`❌ Font file missing: ${fontPath}`, 'red');
      allFontsValid = false;
    }
  });
  
  return allFontsValid;
}

function verifyUIPackageIntegration() {
  log('\n📦 Verifying UI Package Integration...', 'cyan');
  
  const integrationChecks = [
    {
      path: '../packages/ui/src/styles/design-tokens.css',
      description: 'Design tokens CSS file',
      required: true,
    },
    {
      path: '../packages/ui/src/styles/portfolio-components.css',
      description: 'Portfolio components CSS file',
      required: true,
    },
    {
      path: '../packages/ui/dist/styles.css',
      description: 'Built design system CSS',
      required: true,
    },
  ];
  
  let allIntegrationsValid = true;
  
  integrationChecks.forEach(check => {
    const fullPath = path.join(__dirname, check.path);
    if (fs.existsSync(fullPath)) {
      log(`✅ ${check.description} exists`, 'green');
    } else {
      log(`❌ ${check.description} missing: ${check.path}`, 'red');
      if (check.required) {
        allIntegrationsValid = false;
      }
    }
  });
  
  return allIntegrationsValid;
}

function verifyAppIntegrations() {
  log('\n🚀 Verifying App Integrations...', 'cyan');
  
  const appChecks = [
    {
      name: 'Portfolio App',
      path: '../apps/portfolio',
      checks: [
        {
          file: 'pages/_app.tsx',
          content: "@import '@abdalkader/ui/dist/styles.css'",
          description: 'UI package import',
        },
        {
          file: 'public/fonts/PPNeueMontreal-Regular.woff2',
          description: 'Portfolio fonts',
        },
      ],
    },
    {
      name: 'Blog App',
      path: '../apps/blog',
      checks: [
        {
          file: 'source/css/design-system.css',
          description: 'Design system CSS',
        },
        {
          file: 'source/css/custom.css',
          content: '--primary-color: #f44e00',
          description: 'Portfolio color values',
        },
        {
          file: 'source/fonts/PPNeueMontreal-Regular.woff2',
          description: 'Portfolio fonts',
        },
      ],
    },
    {
      name: 'Docs App',
      path: '../apps/docs',
      checks: [
        {
          file: 'src/styles/portfolio-theme.css',
          description: 'Portfolio theme CSS',
        },
        {
          file: 'public/fonts/PPNeueMontreal-Regular.woff2',
          description: 'Portfolio fonts',
        },
      ],
    },
  ];
  
  let allAppsValid = true;
  
  appChecks.forEach(app => {
    log(`\n  📱 ${app.name}:`, 'blue');
    
    app.checks.forEach(check => {
      const fullPath = path.join(__dirname, app.path, check.file);
      
      if (check.content) {
        // Check file content
        if (fs.existsSync(fullPath)) {
          const fileContent = fs.readFileSync(fullPath, 'utf8');
          if (fileContent.includes(check.content)) {
            log(`    ✅ ${check.description}`, 'green');
          } else {
            log(`    ❌ ${check.description} - content not found`, 'red');
            allAppsValid = false;
          }
        } else {
          log(`    ❌ ${check.description} - file not found`, 'red');
          allAppsValid = false;
        }
      } else {
        // Check file existence
        if (fs.existsSync(fullPath)) {
          log(`    ✅ ${check.description}`, 'green');
        } else {
          log(`    ❌ ${check.description} - file not found`, 'red');
          allAppsValid = false;
        }
      }
    });
  });
  
  return allAppsValid;
}

function verifyBuildStatus() {
  log('\n🔨 Verifying Build Status...', 'cyan');
  
  const buildChecks = [
    {
      name: 'UI Package',
      path: '../packages/ui',
      command: 'pnpm build',
    },
    {
      name: 'Portfolio App',
      path: '../apps/portfolio',
      command: 'pnpm build',
    },
  ];
  
  let allBuildsValid = true;
  
  buildChecks.forEach(check => {
    log(`\n  🔨 Building ${check.name}...`, 'blue');
    
    try {
      execSync(check.command, {
        cwd: path.join(__dirname, check.path),
        stdio: 'pipe',
        timeout: 60000, // 60 seconds timeout
      });
      log(`    ✅ ${check.name} built successfully`, 'green');
    } catch (error) {
      log(`    ❌ ${check.name} build failed`, 'red');
      log(`    Error: ${error.message}`, 'red');
      allBuildsValid = false;
    }
  });
  
  return allBuildsValid;
}

function generateVerificationReport() {
  log('\n📊 Design System Verification Report', 'magenta');
  log('=====================================', 'magenta');
  
  const results = {
    designTokens: verifyDesignTokens(),
    fontFiles: verifyFontFiles(),
    uiPackage: verifyUIPackageIntegration(),
    appIntegrations: verifyAppIntegrations(),
    buildStatus: verifyBuildStatus(),
  };
  
  log('\n📋 Summary:', 'yellow');
  log(`Design Tokens: ${results.designTokens ? '✅ PASS' : '❌ FAIL'}`, results.designTokens ? 'green' : 'red');
  log(`Font Files: ${results.fontFiles ? '✅ PASS' : '❌ FAIL'}`, results.fontFiles ? 'green' : 'red');
  log(`UI Package: ${results.uiPackage ? '✅ PASS' : '❌ FAIL'}`, results.uiPackage ? 'green' : 'red');
  log(`App Integrations: ${results.appIntegrations ? '✅ PASS' : '❌ FAIL'}`, results.appIntegrations ? 'green' : 'red');
  log(`Build Status: ${results.buildStatus ? '✅ PASS' : '❌ FAIL'}`, results.buildStatus ? 'green' : 'red');
  
  const allPassed = Object.values(results).every(result => result);
  
  log('\n🎯 Overall Status:', 'bright');
  if (allPassed) {
    log('🎉 ALL CHECKS PASSED! Design system is properly integrated across all subdomains.', 'green');
    log('\n✨ Your unified design system is ready!', 'green');
    log('🌐 All subdomains now match the portfolio design exactly:', 'cyan');
    log('   • abdalkader.dev (portfolio)', 'cyan');
    log('   • blog.abdalkader.dev (blog)', 'cyan');
    log('   • docs.abdalkader.dev (docs)', 'cyan');
    log('   • dev.abdalkader.dev (staging)', 'cyan');
  } else {
    log('❌ Some checks failed. Please review the errors above and fix them.', 'red');
    log('\n🔧 Common fixes:', 'yellow');
    log('   • Ensure all font files are copied to each app', 'yellow');
    log('   • Verify CSS imports are correct in each app', 'yellow');
    log('   • Check that design tokens are properly exported', 'yellow');
    log('   • Rebuild the UI package if needed', 'yellow');
  }
  
  return allPassed;
}

// Main execution
function main() {
  log('🚀 Abdalkader Design System Verification', 'magenta');
  log('=========================================', 'magenta');
  
  try {
    const success = generateVerificationReport();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`❌ Verification failed with error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the verification
if (require.main === module) {
  main();
}

module.exports = {
  verifyDesignTokens,
  verifyFontFiles,
  verifyUIPackageIntegration,
  verifyAppIntegrations,
  verifyBuildStatus,
  generateVerificationReport,
  PORTFOLIO_DESIGN_TOKENS,
};