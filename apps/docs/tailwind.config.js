/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './docs/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Component library brand colors
        primary: {
          50: '#fef2f1',
          100: '#fee4e2',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f44e00', // Main brand color
          600: '#fa7300', // Light variant
          700: '#dc2626',
          800: '#b91c1c',
          900: '#991b1b',
        },
        // Component library specific colors
        'component-primary': '#f44e00',
        'component-primary-light': '#fa7300',
        'component-white': '#f8f8f8',
        'component-black': '#000000',
        'component-text-grey': '#787878',
        'component-border': 'rgb(37, 37, 37)',
      },
      fontFamily: {
        // Component library fonts
        sans: ['PPNeueMontreal-Regular', 'Inter', 'system-ui', 'sans-serif'],
        'component-regular': ['PPNeueMontreal-Regular', 'system-ui', 'sans-serif'],
        'component-medium': ['PPNeueMontreal-Medium', 'system-ui', 'sans-serif'],
      },
      animation: {
        // Component library animations
        'fade-in': 'componentFadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
        'slide-up': 'componentSlideUp 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
        'component-fade-in': 'componentFadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
        'component-slide-in': 'componentSlideIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        componentFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        componentSlideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        componentSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};