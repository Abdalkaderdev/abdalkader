# 🎨 Portfolio Design System

Complete design system extracted from the portfolio for reuse across all projects.

---

## 📦 Installation

```tsx
// Import CSS tokens
import '@abdalkader/ui/dist/styles.css';

// Import JS tokens (for animations)
import tokens from '@abdalkader/ui/src/styles/design-tokens.js';

// Import SCSS mixins
@import '@abdalkader/ui/src/styles/design-tokens.css';
@import '@abdalkader/ui/src/styles/mixins.scss';
```

---

## 🎨 Colors

### Brand Colors
```css
--brand-primary: #f44e00;        /* Orange - Primary brand color */
--brand-primary-light: #fa7300;  /* Light orange */
--brand-gradient: linear-gradient(to bottom, #f44e00, #fa7300);
```

**Usage:**
```css
.element {
  background: var(--brand-primary);
  background: var(--brand-gradient);
}
```

```tsx
import { colors } from '@abdalkader/ui/src/styles/design-tokens.js';
element.style.background = colors.brand.primary;
```

### Neutral Colors
```css
--color-white: #f8f8f8;          /* Off-white background */
--color-black: #000000;          /* Pure black */
--color-text-dark: #131313;      /* Dark text */
--color-text-grey: #787878;      /* Grey text */
```

---

## ✍️ Typography

### Font Families
```css
--font-primary: 'PPNeueMontreal-Regular';
--font-medium: 'PPNeueMontreal-Medium';
```

**Setup fonts:**
```css
@font-face {
  font-family: 'PPNeueMontreal-Regular';
  src: url('/fonts/PPNeueMontreal-Regular.woff2');
}
```

### Font Sizes

#### Fixed Sizes
```css
--font-size-xs: 0.6rem;    /* 9.6px - Labels */
--font-size-sm: 0.7rem;    /* 11.2px - Small text */
--font-size-base: 0.9rem;  /* 14.4px - Buttons */
--font-size-md: 1rem;      /* 16px - Body */
--font-size-lg: 1.8rem;    /* 28.8px - Subheadings */
--font-size-xl: 2.75rem;   /* 44px - Headings */
--font-size-2xl: 4.5rem;   /* 72px - Hero */
```

#### Responsive Sizes
```css
/* Hero Text */
--font-size-hero-desktop: 4.5rem;
--font-size-hero-tablet: 3.2rem;
--font-size-hero-mobile: 2.5rem;

/* Headings */
--font-size-heading-desktop: 2.75rem;
--font-size-heading-tablet: 2.2rem;
--font-size-heading-mobile: 1.8rem;
```

### SCSS Mixins
```scss
@import '@abdalkader/ui/src/styles/mixins.scss';

.hero-title {
  @include font-hero;  // Responsive hero text
}

.heading {
  @include font-heading;  // Responsive heading
}

.subheading {
  @include font-subheading;  // Responsive subheading
}

.gradient-text {
  @include gradient-text;  // Orange gradient text
}
```

### Font Weights
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-bold: 700;
```

### Line Heights & Letter Spacing
```css
--line-height-tight: 0.9;
--line-height-base: 1.6;
--letter-spacing-tight: 0.05rem;
--letter-spacing-base: 0.08rem;
--letter-spacing-wide: 0.1rem;
```

---

## 📏 Spacing

### Spacing Scale
```css
--space-xs: 0.7rem;   /* 11.2px */
--space-sm: 0.8rem;   /* 12.8px */
--space-1: 1rem;      /* 16px */
--space-2: 2rem;      /* 32px */
--space-3: 3rem;      /* 48px */
--space-5: 5rem;      /* 80px */
--space-6: 6rem;      /* 96px */
--space-8: 8rem;      /* 128px */
--space-10: 10rem;    /* 160px */
```

### Section Spacing
```css
--gap-section-desktop: 10rem;
--gap-section-tablet: 8rem;
--gap-section-mobile: 6rem;
```

**Usage:**
```scss
main {
  gap: var(--gap-section-desktop);
  
  @media (max-width: 840px) {
    gap: var(--gap-section-tablet);
  }
  
  @media (max-width: 600px) {
    gap: var(--gap-section-mobile);
  }
}
```

### SCSS Mixins
```scss
.section {
  @include section;  // Responsive section padding
}

.container {
  @include padding-around;  // Responsive padding
}

.element {
  @include margin-top-xl;  // Responsive large margin
  @include margin-top-lg;  // Responsive medium margin
}
```

---

## 🎭 Effects & Shadows

### Glow Effects
```css
--shadow-glow: 0px 0px 5px var(--brand-primary);
--shadow-glow-hover: 0px 0px 10px var(--brand-primary);
```

**Usage:**
```css
.button {
  filter: var(--shadow-glow);
}

.button:hover {
  filter: var(--shadow-glow-hover);
}
```

### Inset Shadows
```css
--shadow-inset-light: inset 0px -20px 20px rgba(255, 255, 255, 0.2);
--shadow-inset-light-hover: inset 0px -30px 20px rgba(255, 255, 255, 0.2);
--shadow-inset-dark: inset 0px -15px 15px rgba(0, 0, 0, 0.2);
```

### Text Glow
```css
--text-shadow-glow: 0 0 6px rgba(244, 78, 0, 0.6);
```

### Backdrop Blur
```css
--backdrop-blur: blur(50px);
```

**SCSS Mixin:**
```scss
.element {
  @include glow-effect;  // Adds glow + hover
  @include button-inset;  // Adds inset shadow + hover
  @include backdrop-blur;  // Adds backdrop blur
}
```

---

## 🎬 Animations & Transitions

### Transitions
```css
--transition-smooth: 0.8s cubic-bezier(0.19, 1, 0.22, 1);
--transition-base: 0.5s ease;
--transition-fast: 0.3s ease-in-out;
```

### Easing
```css
--ease-portfolio: cubic-bezier(0.19, 1, 0.22, 1);
```

### GSAP Animations

```tsx
import { animations } from '@abdalkader/ui/src/styles/design-tokens.js';

// Fade in animation
gsap.from(element, animations.gsap.fadeIn);

// Slide up animation
gsap.from(element, animations.gsap.slideUp);

// Stagger text
gsap.from(chars, {
  opacity: 0,
  y: 50,
  stagger: animations.gsap.stagger.text,  // 0.003
  ease: animations.gsap.smooth,
});

// ScrollTrigger
gsap.from(element, {
  scrollTrigger: {
    trigger: element,
    start: animations.gsap.scrollTrigger.start,  // '70% bottom'
    once: animations.gsap.scrollTrigger.once,    // true
  },
  ...animations.gsap.fadeIn,
});
```

### Framer Motion

```tsx
import { animations } from '@abdalkader/ui/src/styles/design-tokens.js';

// Page transitions
<motion.div
  initial={animations.framer.slideIn.initial}
  animate={animations.framer.slideIn.animate}
  exit={animations.framer.slideIn.exit}
  transition={animations.framer.slideIn.transition}
/>

// Fade in
<motion.div
  initial={animations.framer.fadeIn.initial}
  animate={animations.framer.fadeIn.animate}
  transition={animations.framer.fadeIn.transition}
/>
```

---

## 📐 Border Radius

```css
--radius-sm: 6px;
--radius-base: 8px;
--radius-md: 12px;
--radius-full: 100px;
```

---

## 📱 Breakpoints

```css
--breakpoint-mobile: 600px;
--breakpoint-tablet: 840px;
--breakpoint-desktop: 1080px;
```

### SCSS Mixins
```scss
.element {
  @include mobile {
    // Styles for mobile
  }
  
  @include tablet {
    // Styles for tablet
  }
  
  @include desktop {
    // Styles for desktop
  }
}
```

### JavaScript
```tsx
import { breakpoints } from '@abdalkader/ui/src/styles/design-tokens.js';

if (window.innerWidth <= breakpoints.mobile) {
  // Mobile logic
}
```

---

## 🎯 Focus States

```css
--focus-outline: 2px dashed var(--brand-primary);
--focus-outline-solid: 2px solid var(--color-white);
--focus-offset: 3px;
```

**SCSS Mixin:**
```scss
.button {
  @include focus-visible;  // Dashed outline
}

.input {
  @include focus-visible-solid;  // Solid outline
}
```

---

## 🧩 Component Patterns

### Button
```scss
.button {
  padding: var(--padding-button);  // 1rem 2rem
  border-radius: var(--radius-base);  // 8px
  background: var(--brand-primary);
  color: var(--color-white);
  font-size: var(--font-size-base);  // 0.9rem
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  
  @include button-inset;
  @include glow-effect;
  @include focus-visible-solid;
  
  &:active {
    transform: translateY(1px) scale(0.99);
  }
}
```

### Navigation
```scss
.nav {
  padding: var(--padding-nav);  // 1.4rem 2rem
  z-index: var(--z-nav);  // 20
  
  @include mix-blend-difference;
  
  .link {
    @include font-body;
    @include smooth-transition;
    @include focus-visible;
    
    &:hover {
      color: var(--brand-primary);
      @include text-shadow-glow;
    }
  }
}
```

### Menu
```scss
.menu {
  top: var(--menu-top-offset);  // 10px
  border-radius: var(--menu-border-radius);  // 8px
  background: var(--color-navigation);
  z-index: var(--z-menu);  // 10
  
  @include backdrop-blur;
}
```

---

## 📚 Complete Example

```tsx
// App.tsx
import '@abdalkader/ui/dist/styles.css';
import { Button, Layout, Container } from '@abdalkader/ui';
import tokens from '@abdalkader/ui/src/styles/design-tokens.js';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function App() {
  const titleRef = useRef(null);
  
  useEffect(() => {
    gsap.from(titleRef.current, {
      ...tokens.animations.gsap.fadeIn,
      scrollTrigger: {
        trigger: titleRef.current,
        start: tokens.animations.gsap.scrollTrigger.start,
        once: true,
      },
    });
  }, []);
  
  return (
    <Layout>
      <Container size="lg">
        <h1 ref={titleRef} className="hero-title">
          Welcome
        </h1>
        <Button variant="primary">Get Started</Button>
      </Container>
    </Layout>
  );
}
```

```scss
// styles.scss
@import '@abdalkader/ui/src/styles/design-tokens.css';
@import '@abdalkader/ui/src/styles/mixins.scss';

.hero-title {
  @include font-hero;
  @include gradient-text;
  @include margin-top-xl;
}

.custom-button {
  background: var(--brand-gradient);
  padding: var(--padding-button);
  border-radius: var(--radius-base);
  
  @include glow-effect;
  @include button-inset;
  @include focus-visible-solid;
}
```

---

## 🎯 Q Dev Integration

This design system is structured for Q Dev to automatically apply:

1. **CSS Variables**: All tokens available as CSS custom properties
2. **JavaScript Exports**: Tokens available for GSAP/Framer Motion
3. **SCSS Mixins**: Reusable patterns for consistent styling
4. **Component Patterns**: Pre-built component styles

### For Q Dev:
When creating new apps (blog, AI editor, etc.), automatically:
- Import `@abdalkader/ui/dist/styles.css` for all tokens
- Use `tokens.colors.brand.primary` for brand colors
- Use `tokens.animations.gsap.*` for GSAP animations
- Use `@include font-hero` for hero text
- Use `@include section` for section layouts
- Follow component patterns for buttons, navigation, etc.

---

## 📖 Reference

All design tokens extracted from:
- `apps/portfolio/styles/variables.scss`
- `apps/portfolio/styles/globals.scss`
- `apps/portfolio/components/*/**.module.scss`

Maintained in:
- `packages/ui/src/styles/design-tokens.css` (CSS)
- `packages/ui/src/styles/design-tokens.js` (JavaScript)
- `packages/ui/src/styles/mixins.scss` (SCSS)
