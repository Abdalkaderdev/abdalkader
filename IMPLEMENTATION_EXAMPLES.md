# Implementation Examples

## How to Apply Design System Across Apps

### 1. Using Design System CSS Variables

#### In CSS/SCSS
```css
/* Button using design system */
.button {
  background: var(--color-primary);
  color: var(--color-background);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-lg);
  border-radius: 4px;
  transition: all var(--transition-secondary);
}

.button:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(244, 78, 0, 0.3);
}
```

#### In React/JSX
```jsx
// Using CSS modules with design system
import styles from './Button.module.css';

export function Button({ children, variant = 'primary' }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

---

### 2. Implementing Header/Footer in Apps

#### For Next.js Apps (History, Portfolio)

```jsx
// pages/_app.tsx
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header 
        appName="Your App Name"
        internalLinks={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
        externalLinks={[
          { name: 'Portfolio', path: 'https://abdalkader.dev' },
          { name: 'Blog', path: 'https://blog.abdalkader.dev' },
        ]}
      />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer 
        companyName="Your Company"
        email="contact@example.com"
      />
    </>
  );
}
```

#### For Hexo Blog

```yaml
# themes/icarus/_config.yml
# Update theme colors
color:
  primary: '#f44e00'
  primary_light: '#fa7300'
  background: '#000'
  text_light: '#f8f8f8'
  text_dark: '#131313'
  text_grey: '#787878'
  border: 'rgb(37, 37, 37)'

# Update typography
typography:
  font_family: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont"
  font_size_base: 1rem
  font_size_heading: 2.75rem
```

#### For Mintlify Docs

```json
{
  "colors": {
    "primary": "#f44e00",
    "light": "#fa7300",
    "dark": "#000",
    "background": {
      "light": "#f8f8f8",
      "dark": "#000"
    }
  },
  "typography": {
    "headingsFont": {
      "name": "PP Neue Montreal"
    }
  }
}
```

---

### 3. Color Application Examples

#### Primary Color Usage
```css
/* Links */
a {
  color: var(--color-primary);
  transition: color var(--transition-secondary);
}

a:hover {
  color: var(--color-primary-light);
}

/* Buttons */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-background);
}

/* Accents */
.accent {
  border-left: 4px solid var(--color-primary);
}

/* Focus states */
:focus-visible {
  outline: 2px dashed var(--color-primary);
}
```

#### Text Color Usage
```css
/* Primary text */
p {
  color: var(--color-text-light);
}

/* Secondary text */
.secondary {
  color: var(--color-text-grey);
}

/* Dark backgrounds */
.dark-bg {
  background: var(--color-background);
  color: var(--color-text-light);
}
```

---

### 4. Typography Implementation

#### Heading Styles
```css
h1 {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

h2 {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
  font-weight: 300;
  text-transform: uppercase;
}

h3 {
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-tight);
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-normal);
}
```

#### Responsive Typography
```css
@media (max-width: 1080px) {
  h1 {
    font-size: 3.2rem;
  }
  
  h2 {
    font-size: 2.2rem;
  }
}

@media (max-width: 600px) {
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 1.8rem;
  }
}
```

---

### 5. Animation Implementation

#### Hover Effects
```css
.card {
  transition: all var(--transition-secondary);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(244, 78, 0, 0.15);
}
```

#### Page Transitions
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: slideIn var(--transition-primary);
}
```

#### Loading Animation
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading {
  animation: pulse var(--transition-secondary) infinite;
}
```

---

### 6. Spacing Implementation

#### Padding
```css
.section {
  padding: var(--spacing-md);
}

.section-large {
  padding: var(--spacing-lg);
}

.container {
  padding: 0 var(--spacing-md);
}
```

#### Margins
```css
.section + .section {
  margin-top: var(--spacing-xl);
}

.card + .card {
  margin-top: var(--spacing-lg);
}

.heading {
  margin-bottom: var(--spacing-md);
}
```

#### Gaps
```css
.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.flex {
  display: flex;
  gap: var(--spacing-md);
}
```

---

### 7. Component Examples

#### Button Component
```jsx
// components/Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={`${styles.btn} ${styles[`btn-${variant}`]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
/* Button.module.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-normal);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-secondary);
  text-decoration: none;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-background);
}

.btn-primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(244, 78, 0, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-light);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

#### Card Component
```jsx
// components/Card.tsx
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {children}
    </div>
  );
}
```

```css
/* Card.module.css */
.card {
  background: rgba(45, 45, 45, 0.5);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--spacing-md);
  transition: all var(--transition-secondary);
  backdrop-filter: blur(10px);
}

.card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(244, 78, 0, 0.15);
}
```

---

### 8. Form Implementation

```jsx
// components/Form.tsx
import styles from './Form.module.css';

export function Form() {
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input 
          id="name"
          type="text" 
          placeholder="Your name"
          className={styles.input}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input 
          id="email"
          type="email" 
          placeholder="your@email.com"
          className={styles.input}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea 
          id="message"
          placeholder="Your message"
          className={styles.textarea}
          rows={5}
        />
      </div>
      
      <button type="submit" className={styles.submit}>
        Send Message
      </button>
    </form>
  );
}
```

```css
/* Form.module.css */
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.formGroup label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-transform: uppercase;
  color: var(--color-text-light);
}

.input,
.textarea {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-lg);
  background: rgba(45, 45, 45, 0.5);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: var(--color-text-light);
  transition: all var(--transition-secondary);
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(244, 78, 0, 0.1);
}

.input::placeholder,
.textarea::placeholder {
  color: var(--color-text-grey);
}

.submit {
  background: var(--color-primary);
  color: var(--color-background);
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-secondary);
}

.submit:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(244, 78, 0, 0.3);
}
```

---

### 9. Accessibility Implementation

```jsx
// components/AccessibleButton.tsx
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export function AccessibleButton({
  children,
  onClick,
  ariaLabel,
  disabled
}: AccessibleButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className="btn btn-primary"
    >
      {children}
    </button>
  );
}
```

```jsx
// components/AccessibleLink.tsx
interface AccessibleLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function AccessibleLink({
  href,
  children,
  external
}: AccessibleLinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="link"
    >
      {children}
    </a>
  );
}
```

---

### 10. Responsive Design Implementation

```css
/* Mobile-first approach */
.container {
  padding: var(--spacing-sm);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

/* Tablet */
@media (min-width: 600px) {
  .container {
    padding: var(--spacing-md);
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 1080px) {
  .container {
    padding: var(--spacing-lg);
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
  }
}
```

---

## 🎯 Quick Reference

### Import Design System
```html
<!-- In HTML head -->
<link rel="stylesheet" href="path/to/design-system.css">
```

### Use CSS Variables
```css
color: var(--color-primary);
padding: var(--spacing-md);
transition: all var(--transition-secondary);
```

### Common Patterns
```css
/* Hover lift */
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(244, 78, 0, 0.3);

/* Focus state */
outline: 2px dashed var(--color-primary);
outline-offset: 3px;

/* Gradient text */
background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

**Last Updated**: November 23, 2025
