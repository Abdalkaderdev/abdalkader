# Quick Start Guide

## 🚀 Getting Started

### Install Dependencies
```bash
pnpm install
```

### Start Development
```bash
# Start Portfolio only
pnpm --filter @abdalkader/portfolio run dev

# Start all apps
pnpm run dev
```

### Build for Production
```bash
# Build all apps
pnpm run build

# Build specific app
pnpm run build:portfolio
```

---

## 🎨 Using Design System

### Import Design System CSS
```jsx
import '@/styles/design-system.css';
```

### Use CSS Variables
```css
.button {
  background: var(--color-primary);
  color: var(--color-background);
  padding: var(--spacing-md);
  transition: all var(--transition-secondary);
}
```

### Available Variables
```css
/* Colors */
--color-primary: #f44e00;
--color-primary-light: #fa7300;
--color-background: #000;
--color-text-light: #f8f8f8;
--color-text-grey: #787878;

/* Spacing */
--spacing-sm: 1rem;
--spacing-md: 2rem;
--spacing-lg: 3rem;

/* Animations */
--transition-primary: 0.8s cubic-bezier(0.19, 1, 0.22, 1);
--transition-secondary: 0.3s cubic-bezier(0.19, 1, 0.22, 1);
```

---

## 🛡️ Error Handling

### Wrap Components with Error Boundary
```jsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

---

## 🔔 Toast Notifications

### Show Notifications
```jsx
import { useToast, ToastContainer } from '@/components/Toast';

export default function Page() {
  const { toasts, removeToast, success, error, warning, info } = useToast();

  return (
    <>
      <button onClick={() => success('Success!')}>Success</button>
      <button onClick={() => error('Error!')}>Error</button>
      <button onClick={() => warning('Warning!')}>Warning</button>
      <button onClick={() => info('Info!')}>Info</button>
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
```

---

## ⏳ Loading States

### Show Skeleton Loaders
```jsx
import { SkeletonCard, SkeletonGrid, SkeletonList } from '@/components/Skeleton';

// Single skeleton
<Skeleton width={200} height={20} />

// Card skeleton
<SkeletonCard />

// Grid of skeletons
<SkeletonGrid columns={3} count={6} />

// List of skeletons
<SkeletonList count={5} />
```

---

## 📊 Analytics

### Track Events
```jsx
import { 
  trackButtonClick, 
  trackFormSubmission, 
  trackLinkClick,
  trackError 
} from '@/lib/analytics';

// Track button click
<button onClick={() => trackButtonClick('submit_btn')}>
  Submit
</button>

// Track form submission
const handleSubmit = () => {
  trackFormSubmission('contact_form', true);
};

// Track link click
<a href="/about" onClick={() => trackLinkClick('about_link', '/about')}>
  About
</a>

// Track error
try {
  // code
} catch (error) {
  trackError('FormError', error.message);
}
```

---

## ✅ Form Validation

### Validate Form Data
```jsx
import { validateForm, validationRules } from '@/lib/validation';

const handleSubmit = (data) => {
  const result = validateForm(data, {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required, validationRules.strongPassword],
    name: [validationRules.required, validationRules.minLength(3)],
  });

  if (!result.isValid) {
    console.log(result.errors);
    return;
  }

  // Submit form
};
```

### Available Validators
```javascript
// Individual validators
isValidEmail(email)
isValidUrl(url)
isValidPhone(phone)
isStrongPassword(password)
isValidCreditCard(cardNumber)
isValidFileSize(file, maxSizeMB)
isValidFileType(file, allowedTypes)

// Sanitizers
sanitizeHtml(html)
sanitizeInput(input)

// Validation rules
validationRules.required
validationRules.email
validationRules.url
validationRules.phone
validationRules.minLength(min)
validationRules.maxLength(max)
validationRules.strongPassword
validationRules.creditCard
```

---

## 🎯 Common Patterns

### Button with Analytics
```jsx
<button 
  onClick={() => {
    trackButtonClick('cta_button');
    handleClick();
  }}
  className="btn btn-primary"
>
  Click Me
</button>
```

### Form with Validation and Toast
```jsx
import { useToast, ToastContainer } from '@/components/Toast';
import { validateForm, validationRules } from '@/lib/validation';

export default function ContactForm() {
  const { toasts, removeToast, success, error } = useToast();
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = validateForm(formData, {
      email: [validationRules.required, validationRules.email],
      message: [validationRules.required, validationRules.minLength(10)],
    });

    if (!result.isValid) {
      error('Please fix the errors in the form');
      return;
    }

    // Submit
    success('Message sent successfully!');
    trackFormSubmission('contact_form', true);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
```

### Loading State with Skeleton
```jsx
import { SkeletonGrid } from '@/components/Skeleton';

export default function ProductList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return loading ? <SkeletonGrid /> : <ProductGrid products={products} />;
}
```

---

## 🔍 Debugging

### Check Console for Errors
```bash
# Development
npm run dev

# Check browser console for errors
# Error Boundary will catch and display them
```

### Enable Analytics Logging
```javascript
// In development, analytics calls are logged to console
console.log('Analytics event:', eventName);
```

### Test Validation
```javascript
import { isValidEmail } from '@/lib/validation';

console.log(isValidEmail('test@example.com')); // true
console.log(isValidEmail('invalid')); // false
```

---

## 📚 Documentation

- **DESIGN_SYSTEM_GUIDE.md** - Complete design system
- **IMPLEMENTATION_EXAMPLES.md** - Code examples
- **IMPROVEMENTS_ROADMAP.md** - Feature checklist
- **IMPLEMENTATION_COMPLETE.md** - What was implemented

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3003
lsof -ti:3003 | xargs kill -9

# Or use different port
next dev -p 3004
```

### Dependencies Not Installed
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm run build
```

---

## 🚀 Deployment

### Build for Production
```bash
pnpm run build
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review implementation examples
3. Check browser console for errors
4. Run tests: `pnpm run test`

---

**Happy coding! 🎉**
