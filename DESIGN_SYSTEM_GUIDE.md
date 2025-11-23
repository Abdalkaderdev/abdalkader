# Design System & Standardization Guide

## 🎨 Design System Overview

This guide outlines the unified design system across all Abdalkader apps, ensuring consistency in colors, typography, animations, and user experience.

---

## 📋 Design Tokens

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Primary** | `#f44e00` | Buttons, links, accents, hover states |
| **Primary Light** | `#fa7300` | Gradients, secondary accents |
| **Background** | `#000` | Main background |
| **Text Light** | `#f8f8f8` | Primary text color |
| **Text Dark** | `#131313` | Dark text on light backgrounds |
| **Text Grey** | `#787878` | Secondary text, placeholders |
| **Navigation** | `rgba(45, 45, 45, 0.35)` | Navigation menu background |
| **Border** | `rgb(37, 37, 37)` | Borders, dividers |

### Typography

**Font Family**: PP Neue Montreal (or system fallback)

| Size | Value | Usage |
|------|-------|-------|
| **4XL** | 4.5rem | Page titles, hero sections |
| **3XL** | 2.75rem | Section headings |
| **2XL** | 1.8rem | Subheadings |
| **LG** | 1rem | Body text, navigation |
| **SM** | 0.7rem | Small text, captions |

**Line Heights**: 0.9 (headings), 1 (body)
**Letter Spacing**: 0.05rem - 0.1rem
**Text Transform**: UPPERCASE for headings

### Animations

| Property | Value | Usage |
|----------|-------|-------|
| **Primary Duration** | 0.8s | Page transitions, major animations |
| **Secondary Duration** | 0.3s | Hover effects, quick interactions |
| **Easing** | `cubic-bezier(0.19, 1, 0.22, 1)` | All transitions |

### Spacing

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| **XS** | 0.5rem | 0.5rem | 0.5rem |
| **SM** | 1rem | 1rem | 1rem |
| **MD** | 2rem | 1.5rem | 1rem |
| **LG** | 3rem | 2rem | 1.5rem |
| **XL** | 8rem | 6rem | 4rem |
| **2XL** | 10rem | 8rem | 6rem |

---

## 🎯 Component Standards

### Buttons

**Primary Button**
```css
background: var(--color-primary);
color: var(--color-background);
padding: 0.75rem 1.5rem;
border-radius: 4px;
transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
```

**Hover State**
- Background: `var(--color-primary-light)`
- Transform: `translateY(-2px)`
- Box Shadow: `0 8px 24px rgba(244, 78, 0, 0.3)`

### Cards

- Background: `rgba(45, 45, 45, 0.5)`
- Border: `1px solid var(--color-border)`
- Border Radius: `8px`
- Backdrop Filter: `blur(10px)`
- Hover: Border color changes to primary, slight lift effect

### Forms

- Background: `rgba(45, 45, 45, 0.5)`
- Border: `1px solid var(--color-border)`
- Focus: Border color changes to primary, glow effect
- Placeholder: `var(--color-text-grey)`

### Header/Navigation

- Position: Fixed, top of page
- Z-index: 50
- Mix-blend-mode: difference
- Menu animation: Clip-path with smooth easing

### Footer

- Background: Gradient dark
- Multi-column layout
- Large gradient text at bottom
- Responsive: Stack on mobile

---

## 🚀 Implementation Checklist

### Phase 1: Foundation ✅
- [x] Create shared design system CSS
- [x] Define color palette
- [x] Define typography scale
- [x] Create Header/Footer components

### Phase 2: History App
- [ ] Apply design system colors
- [ ] Update button styles
- [ ] Implement card components
- [ ] Add animations
- [ ] Update forms

### Phase 3: Blog App
- [ ] Customize Hexo theme
- [ ] Apply color palette
- [ ] Update typography
- [ ] Add animations

### Phase 4: Docs App
- [ ] Update Mintlify theme
- [ ] Apply colors
- [ ] Update buttons
- [ ] Ensure consistency

### Phase 5: Storybook
- [ ] Update component library
- [ ] Ensure all components match design system
- [ ] Add design tokens documentation

---

## 🎬 Animation Guidelines

### Transitions
- Use `cubic-bezier(0.19, 1, 0.22, 1)` for all transitions
- Primary animations: 0.8s
- Secondary animations: 0.3s

### Common Patterns

**Hover Lift**
```css
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(244, 78, 0, 0.3);
```

**Fade In**
```css
animation: fadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1);
```

**Slide In**
```css
animation: slideIn 0.8s cubic-bezier(0.19, 1, 0.22, 1);
```

---

## ♿ Accessibility Standards

### Focus States
- All interactive elements must have visible focus states
- Use `outline: 2px dashed var(--color-primary)`
- Outline offset: 3px

### Keyboard Navigation
- All buttons and links must be keyboard accessible
- Tab order must be logical
- Escape key should close modals/menus

### ARIA Labels
- Use semantic HTML
- Add ARIA labels where needed
- Ensure screen reader compatibility

### Color Contrast
- Primary text: WCAG AA compliant
- Minimum contrast ratio: 4.5:1

---

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1080px
- **Tablet**: 600px - 1080px
- **Mobile**: < 600px

### Mobile-First Approach
1. Design for mobile first
2. Add tablet adjustments
3. Add desktop enhancements

### Responsive Typography
```css
@media (max-width: 1080px) {
  --font-size-4xl: 3.2rem;
}

@media (max-width: 600px) {
  --font-size-4xl: 2.5rem;
}
```

---

## 🔍 Quality Checklist

Before deploying any changes:

- [ ] Colors match design system
- [ ] Typography follows scale
- [ ] Animations use correct easing
- [ ] Spacing is consistent
- [ ] Focus states are visible
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] No console errors
- [ ] Performance optimized
- [ ] Cross-browser tested

---

## 📚 Resources

- **Design System CSS**: `packages/ui/src/styles/design-system.css`
- **Portfolio Variables**: `apps/portfolio/styles/variables.scss`
- **Header Component**: `apps/portfolio/components/Nav/index.tsx`
- **Footer Component**: `apps/portfolio/components/Footer/index.tsx`

---

## 🔄 Maintenance

### Updating Design Tokens
1. Update `design-system.css` with new values
2. Update this guide
3. Rebuild all apps
4. Test across all applications

### Adding New Components
1. Follow design system guidelines
2. Use CSS variables for colors/spacing
3. Ensure accessibility
4. Add to component library
5. Document in this guide

---

## 📞 Support

For questions about the design system, refer to:
- Portfolio app implementation (source of truth)
- This guide
- Design system CSS file
