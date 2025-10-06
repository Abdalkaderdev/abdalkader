# Component Library Integration Test

## ✅ Current Status

The component library is **already integrated** into `packages/ui/`!

### What's Already Done:

1. ✅ Component library copied to `packages/ui/`
2. ✅ Package name set to `@abdalkader/ui`
3. ✅ TypeScript config extends monorepo base
4. ✅ Build scripts configured
5. ✅ All source files in place

## 🧪 Test the Integration

### Step 1: Install Dependencies

```bash
cd c:\Users\max\Desktop\react\abdalkader
pnpm install
```

### Step 2: Build UI Library

```bash
# From monorepo root
pnpm --filter @abdalkader/ui build
```

**Expected output:**
```
> @abdalkader/ui@1.0.0 build
> rollup -c

✓ Built in XXXms
```

**Verify build artifacts:**
```bash
dir packages\ui\dist
```

Should see:
- `index.js` (CommonJS)
- `index.esm.js` (ES Module)
- `index.d.ts` (TypeScript types)
- `styles.css` (Extracted CSS)

### Step 3: Run Tests

```bash
# From monorepo root
pnpm --filter @abdalkader/ui test
```

**Expected:** All tests pass ✅

### Step 4: Test in Watch Mode

```bash
# From monorepo root
pnpm --filter @abdalkader/ui dev
```

This starts Rollup in watch mode for development.

### Step 5: View in Storybook

```bash
# From monorepo root
pnpm --filter @abdalkader/docs dev
```

Visit: http://localhost:6006

**Verify:**
- ✅ Button stories load
- ✅ Input stories load
- ✅ Interactive controls work
- ✅ Accessibility tab shows no violations

## 🔗 Test Portfolio Integration

### Step 1: Create Test Page

Create `apps/portfolio/pages/test-ui.tsx`:

```tsx
import { Button, Input } from '@abdalkader/ui';
import '@abdalkader/ui/dist/styles.css';
import { useState } from 'react';

export default function TestUI() {
  const [email, setEmail] = useState('');

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>UI Library Test</h1>
      
      <h2>Buttons</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Button variant="primary" size="small">Small</Button>
        <Button variant="secondary" size="medium">Medium</Button>
        <Button variant="danger" size="large">Large</Button>
      </div>

      <h2>Input</h2>
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        helperText="We'll never share your email"
      />

      <div style={{ marginTop: '1rem' }}>
        <Button variant="primary" onClick={() => alert(`Email: ${email}`)}>
          Submit
        </Button>
      </div>
    </div>
  );
}
```

### Step 2: Start Portfolio

```bash
# From monorepo root
pnpm --filter @abdalkader/portfolio dev
```

### Step 3: Test the Page

Visit: http://localhost:3000/test-ui

**Verify:**
- ✅ Buttons render with correct styles
- ✅ Input works and accepts text
- ✅ Hover states work
- ✅ Click handlers work
- ✅ TypeScript autocomplete works in VS Code

## 🎯 Verification Checklist

### UI Library Build
- [ ] `pnpm install` completes successfully
- [ ] `pnpm --filter @abdalkader/ui build` succeeds
- [ ] `dist/` folder created with all files
- [ ] No TypeScript errors

### UI Library Tests
- [ ] `pnpm --filter @abdalkader/ui test` passes
- [ ] All component tests pass
- [ ] Accessibility tests pass

### Storybook
- [ ] `pnpm --filter @abdalkader/docs dev` starts
- [ ] Button stories visible
- [ ] Input stories visible
- [ ] Interactive controls work
- [ ] No console errors

### Portfolio Integration
- [ ] Can import from `@abdalkader/ui`
- [ ] TypeScript types work
- [ ] Components render correctly
- [ ] Styles apply correctly
- [ ] No build errors

## 🐛 Troubleshooting

### "Cannot find module '@abdalkader/ui'"

**Solution:**
```bash
pnpm --filter @abdalkader/ui build
```

### "Module not found: Can't resolve '@abdalkader/ui/dist/styles.css'"

**Solution:**
Make sure UI library is built first:
```bash
pnpm --filter @abdalkader/ui build
```

### TypeScript errors in portfolio

**Solution:**
```bash
# Rebuild UI library
pnpm --filter @abdalkader/ui build

# Check types
pnpm --filter @abdalkader/portfolio typecheck
```

### Storybook not loading components

**Solution:**
```bash
# Clean and rebuild
pnpm --filter @abdalkader/ui clean
pnpm --filter @abdalkader/ui build
pnpm --filter @abdalkader/docs dev
```

## ✅ Success Criteria

All of these should work:

1. ✅ UI library builds without errors
2. ✅ All tests pass
3. ✅ Storybook displays components
4. ✅ Portfolio can import and use components
5. ✅ TypeScript autocomplete works
6. ✅ No console errors in browser

## 🎉 Integration Complete!

If all tests pass, your component library is fully integrated and ready to use!

## 📝 Next Steps

1. **Use components in portfolio:**
   - Replace custom buttons with `<Button />`
   - Replace form inputs with `<Input />`

2. **Add more components:**
   - Create new components in `packages/ui/src/components/`
   - Add tests
   - Add Storybook stories

3. **Deploy:**
   - Push to GitHub
   - Vercel will auto-deploy both apps