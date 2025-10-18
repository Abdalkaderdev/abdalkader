module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "../../packages/bible-ui/src/**/*.{js,ts,jsx,tsx}",
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
        sans: ['System'],
        serif: ['System'],
      },
    },
  },
  plugins: [],
};
