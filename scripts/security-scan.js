#!/usr/bin/env node

/**
 * Security Scanning Script
 *
 * Scans the codebase for common security issues:
 * - Exposed API keys and secrets
 * - Hardcoded credentials
 * - Dangerous patterns
 * - NEXT_PUBLIC_ exposure of sensitive data
 *
 * Run with: node scripts/security-scan.js
 * Use as pre-commit hook: Add to .husky/pre-commit
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  scanDirs: ['apps', 'packages', 'scripts'],

  // Files to skip
  skipPatterns: [
    /node_modules/,
    /\.next/,
    /dist/,
    /build/,
    /\.git/,
    /storybook-static/,
    /public/,
    /\.lock$/,
    /\.log$/,
  ],

  // File extensions to scan
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.env', '.yaml', '.yml'],
};

// Security patterns to detect
const SECURITY_PATTERNS = [
  {
    name: 'Exposed API Key',
    pattern: /NEXT_PUBLIC_.*(?:API_KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL)/i,
    severity: 'critical',
    message: 'API keys should not use NEXT_PUBLIC_ prefix - they will be exposed to clients',
  },
  {
    name: 'Hardcoded API Key',
    pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
    severity: 'critical',
    message: 'Hardcoded API key detected',
  },
  {
    name: 'Hardcoded Password',
    pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]+['"]/i,
    severity: 'critical',
    message: 'Hardcoded password detected',
  },
  {
    name: 'Hardcoded Secret',
    pattern: /(?:secret|private[_-]?key)\s*[:=]\s*['"][a-zA-Z0-9_+/=-]{16,}['"]/i,
    severity: 'critical',
    message: 'Hardcoded secret detected',
  },
  {
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/,
    severity: 'critical',
    message: 'AWS Access Key ID detected',
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/,
    severity: 'critical',
    message: 'Private key detected in code',
  },
  {
    name: 'GitHub Token',
    pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/,
    severity: 'critical',
    message: 'GitHub token detected',
  },
  {
    name: 'JWT Token',
    pattern: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
    severity: 'high',
    message: 'JWT token detected - ensure this is not a production token',
  },
  {
    name: 'Console.log with sensitive data',
    pattern: /console\.log\s*\([^)]*(?:password|secret|token|key|credential)[^)]*\)/i,
    severity: 'medium',
    message: 'Console.log may expose sensitive data',
  },
  {
    name: 'Eval usage',
    pattern: /\beval\s*\(/,
    severity: 'high',
    message: 'eval() is dangerous and can lead to code injection',
  },
  {
    name: 'innerHTML assignment',
    pattern: /\.innerHTML\s*=\s*(?!['"]<)/,
    severity: 'medium',
    message: 'innerHTML with dynamic content can lead to XSS',
  },
  {
    name: 'Dangerously Set HTML',
    pattern: /dangerouslySetInnerHTML/,
    severity: 'low',
    message: 'dangerouslySetInnerHTML should be used carefully',
  },
  {
    name: 'HTTP URL in Production',
    pattern: /['"]http:\/\/(?!localhost|127\.0\.0\.1)/,
    severity: 'medium',
    message: 'Non-HTTPS URL detected - ensure this is intentional',
  },
  {
    name: 'Disabled Security Feature',
    pattern: /(?:ignoreBuildErrors|typescript.*ignore|eslint-disable.*security)/i,
    severity: 'medium',
    message: 'Security or type checking disabled',
  },
];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const severityColors = {
  critical: colors.red,
  high: colors.red,
  medium: colors.yellow,
  low: colors.gray,
};

/**
 * Check if a file should be scanned
 */
function shouldScan(filePath) {
  // Check skip patterns
  for (const pattern of CONFIG.skipPatterns) {
    if (pattern.test(filePath)) {
      return false;
    }
  }

  // Check extension
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG.extensions.includes(ext);
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip certain directories
      if (!CONFIG.skipPatterns.some((p) => p.test(fullPath))) {
        getAllFiles(fullPath, files);
      }
    } else if (shouldScan(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Scan a file for security issues
 */
function scanFile(filePath) {
  const issues = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];

      for (const pattern of SECURITY_PATTERNS) {
        if (pattern.pattern.test(line)) {
          issues.push({
            file: filePath,
            line: lineNum + 1,
            severity: pattern.severity,
            name: pattern.name,
            message: pattern.message,
            snippet: line.trim().substring(0, 100),
          });
        }
      }
    }
  } catch (error) {
    // Skip files that can't be read
  }

  return issues;
}

/**
 * Main scanning function
 */
function runSecurityScan() {
  console.log(`${colors.cyan}🔒 Running Security Scan...${colors.reset}\n`);

  const projectRoot = path.join(__dirname, '..');
  const allIssues = [];
  let filesScanned = 0;

  // Scan all configured directories
  for (const dir of CONFIG.scanDirs) {
    const dirPath = path.join(projectRoot, dir);
    const files = getAllFiles(dirPath);

    for (const file of files) {
      filesScanned++;
      const issues = scanFile(file);
      allIssues.push(...issues);
    }
  }

  // Also scan root config files
  const rootFiles = fs.readdirSync(projectRoot).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return CONFIG.extensions.includes(ext) && !f.includes('lock');
  });

  for (const file of rootFiles) {
    filesScanned++;
    const issues = scanFile(path.join(projectRoot, file));
    allIssues.push(...issues);
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Group by severity
  const grouped = {
    critical: allIssues.filter((i) => i.severity === 'critical'),
    high: allIssues.filter((i) => i.severity === 'high'),
    medium: allIssues.filter((i) => i.severity === 'medium'),
    low: allIssues.filter((i) => i.severity === 'low'),
  };

  // Print results
  console.log(`Scanned ${filesScanned} files\n`);

  if (allIssues.length === 0) {
    console.log(`${colors.green}✅ No security issues found!${colors.reset}\n`);
    return 0;
  }

  // Print summary
  console.log('Summary:');
  console.log(`  ${colors.red}Critical: ${grouped.critical.length}${colors.reset}`);
  console.log(`  ${colors.red}High: ${grouped.high.length}${colors.reset}`);
  console.log(`  ${colors.yellow}Medium: ${grouped.medium.length}${colors.reset}`);
  console.log(`  ${colors.gray}Low: ${grouped.low.length}${colors.reset}`);
  console.log('');

  // Print detailed issues
  for (const issue of allIssues) {
    const color = severityColors[issue.severity];
    const relativePath = path.relative(projectRoot, issue.file);

    console.log(`${color}[${issue.severity.toUpperCase()}]${colors.reset} ${issue.name}`);
    console.log(`  ${colors.cyan}${relativePath}:${issue.line}${colors.reset}`);
    console.log(`  ${issue.message}`);
    console.log(`  ${colors.gray}${issue.snippet}${colors.reset}`);
    console.log('');
  }

  // Return exit code
  const hasCritical = grouped.critical.length > 0;
  const hasHigh = grouped.high.length > 0;

  if (hasCritical || hasHigh) {
    console.log(`${colors.red}❌ Security scan failed with critical/high issues${colors.reset}`);
    return 1;
  }

  console.log(`${colors.yellow}⚠️  Security scan completed with warnings${colors.reset}`);
  return 0;
}

// Run the scan
if (require.main === module) {
  const exitCode = runSecurityScan();
  process.exit(exitCode);
}

module.exports = { runSecurityScan, SECURITY_PATTERNS };
