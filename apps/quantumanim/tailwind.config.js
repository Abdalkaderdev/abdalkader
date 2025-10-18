/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          blue: '#00d4ff',
          purple: '#8b5cf6',
          pink: '#ec4899',
          green: '#10b981',
          orange: '#f59e0b',
        },
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
        }
      },
      animation: {
        'quantum-pulse': 'quantum-pulse 2s ease-in-out infinite',
        'quantum-float': 'quantum-float 3s ease-in-out infinite',
        'quantum-spin': 'quantum-spin 4s linear infinite',
        'quantum-wave': 'quantum-wave 2s ease-in-out infinite',
        'quantum-collapse': 'quantum-collapse 0.5s ease-out',
        'quantum-superposition': 'quantum-superposition 1.5s ease-in-out infinite',
      },
      keyframes: {
        'quantum-pulse': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'quantum-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'quantum-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'quantum-wave': {
          '0%, 100%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(10px) scaleY(1.2)' },
        },
        'quantum-collapse': {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        'quantum-superposition': {
          '0%, 100%': { transform: 'translateX(0) scale(1)', opacity: '0.7' },
          '25%': { transform: 'translateX(-5px) scale(1.1)', opacity: '0.9' },
          '50%': { transform: 'translateX(0) scale(1.2)', opacity: '1' },
          '75%': { transform: 'translateX(5px) scale(1.1)', opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
}