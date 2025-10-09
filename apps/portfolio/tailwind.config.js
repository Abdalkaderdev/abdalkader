/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Portfolio brand colors
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
        // Portfolio specific colors
        'portfolio-primary': '#f44e00',
        'portfolio-primary-light': '#fa7300',
        'portfolio-white': '#f8f8f8',
        'portfolio-black': '#000000',
        'portfolio-text-grey': '#787878',
        'portfolio-border': 'rgb(37, 37, 37)',
      },
      fontFamily: {
        // Portfolio fonts
        sans: ['PPNeueMontreal-Regular', 'Inter', 'system-ui', 'sans-serif'],
        'portfolio-regular': ['PPNeueMontreal-Regular', 'system-ui', 'sans-serif'],
        'portfolio-medium': ['PPNeueMontreal-Medium', 'system-ui', 'sans-serif'],
      },
      animation: {
        // Portfolio animations
        'fade-in': 'portfolioFadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
        'slide-up': 'portfolioSlideUp 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
        'portfolio-fade-in': 'portfolioFadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
        'portfolio-slide-in': 'portfolioSlideIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        portfolioFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        portfolioSlideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        portfolioSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};