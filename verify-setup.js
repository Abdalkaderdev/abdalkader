const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Monorepo Setup...\n');

const checks = [
  { path: 'pnpm-workspace.yaml', name: 'Workspace config' },
  { path: 'turbo.json', name: 'Turborepo config' },
  { path: 'package.json', name: 'Root package.json' },
  { path: 'tsconfig.base.json', name: 'Base TypeScript config' },
  { path: 'apps/portfolio/package.json', name: 'Portfolio package' },
  { path: 'apps/portfolio/pages', name: 'Portfolio pages' },
  { path: 'apps/docs/package.json', name: 'Docs package' },
  { path: 'apps/docs/.storybook', name: 'Storybook config' },
  { path: 'packages/ui/package.json', name: 'UI package' },
  { path: 'packages/ui/src', name: 'UI source' },
];

let allGood = true;

checks.forEach(({ path: filePath, name }) => {
  const exists = fs.existsSync(filePath);
  const icon = exists ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (!exists) allGood = false;
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ All checks passed!');
  console.log('\nNext steps:');
  console.log('1. Run: pnpm install');
  console.log('2. Run: pnpm --filter @abdalkader/ui build');
  console.log('3. Run: pnpm dev');
} else {
  console.log('❌ Some checks failed. Review the setup.');
}

console.log('='.repeat(50) + '\n');