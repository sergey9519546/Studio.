/** @type {import('tailwindcss').Config} */
const { colors, typography, radii, shadows, glass } = require('./src/theme/tokens');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Text', '-apple-system', 'sans-serif'],
        display: ['"Inter Tight"', 'SF Pro Display', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SF Mono', 'monospace'],
      },
      colors: {
        app: '#F6F6FA',
        surface: '#FFFFFF',
        subtle: '#ECEEF5',
        border: { subtle: '#E2E4EA', hover: '#B0B5C8' },
        ink: { DEFAULT: '#101118', primary: '#101118', secondary: '#5D6070', tertiary: '#8F93A3', inverse: '#FFFFFF' },
        primary: { DEFAULT: '#2463E6', hover: '#1E4EC8', tint: '#E1EBFF' },
        edge: { teal: '#18C9AE', magenta: '#E14BF7' },
        state: { success: '#16A34A', 'success-bg': '#E6F9EC', warning: '#D97706', 'warning-bg': '#FFF4DE', danger: '#DC2626', 'danger-bg': '#FDE4E4' }
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.02)',
        'card': '0 4px 20px rgba(16, 17, 24, 0.03)',
        'elevation': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'float': '0 20px 40px -10px rgba(16, 17, 24, 0.08)',
        'glow': '0 0 20px rgba(36, 99, 230, 0.15)',
      },
      backgroundImage: {
        'rival-gradient': 'linear-gradient(90deg, #2463E6 0%, #18C9AE 50%, #E14BF7 100%)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      spacing: {
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
      },
      backdropFilter: {
        'glass': 'blur(20px) saturate(180%)',
      },
      backgroundColor: {
        'glass': glass.backdrop.background,
        'glass-dark': glass.backdropDark.background,
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          backdropFilter: glass.backdrop.filter,
          backgroundColor: glass.backdrop.background,
          borderRadius: radii.xl,
        },
        '.glass-dark': {
          backdropFilter: glass.backdropDark.filter,
          backgroundColor: glass.backdropDark.background,
          borderRadius: radii.xl,
        },
        '.glass-sm': {
          backdropFilter: glass.backdrop.filter,
          backgroundColor: glass.backdrop.background,
          borderRadius: radii.md,
        },
        '.text-primary': {
          color: colors.text.primary,
        },
        '.text-secondary': {
          color: colors.text.secondary,
        },
        '.text-tertiary': {
          color: colors.text.tertiary,
        },
      });
    },
  ],
}