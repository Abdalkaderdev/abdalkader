/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/bible-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bible: {
          primary: '#3b82f6',
          'primary-hover': '#2563eb',
          secondary: '#6b7280',
          danger: '#ef4444',
          'danger-hover': '#dc2626',
          text: '#374151',
          'text-secondary': '#6b7280',
          'text-muted': '#9ca3af',
          'text-dark': '#f9fafb',
          'text-secondary-dark': '#9ca3af',
          border: '#d1d5db',
          'border-dark': '#374151',
          bg: '#ffffff',
          'bg-hover': '#f3f4f6',
          'bg-hover-dark': '#374151',
          'card-bg': '#ffffff',
          'card-bg-dark': '#1f2937',
          'input-bg': '#ffffff',
          'input-bg-dark': '#1f2937',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--bible-text)',
            h1: {
              color: 'var(--bible-text)',
            },
            h2: {
              color: 'var(--bible-text)',
            },
            h3: {
              color: 'var(--bible-text)',
            },
            h4: {
              color: 'var(--bible-text)',
            },
            strong: {
              color: 'var(--bible-text)',
            },
            a: {
              color: 'var(--bible-primary)',
              textDecoration: 'none',
              '&:hover': {
                color: 'var(--bible-primary-hover)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};
