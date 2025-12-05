/** @type {import('tailwindcss').Config} */
const { colors, typography, radii, shadows, glass } = require('./src/theme/tokens');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // App structure
        app: colors.bg.app,
        surface: colors.bg.surface,
        subtle: colors.bg.subtle,
        
        // Borders
        border: {
          subtle: colors.border.subtle,
          hover: colors.border.hover,
        },

        // Typography
        ink: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          tertiary: colors.text.tertiary,
          inverse: colors.text.inverse,
        },

        // Accents
        primary: {
          DEFAULT: colors.accent.primary,
          hover: colors.accent.primaryHover,
          tint: colors.accent.tint,
        },

        edge: {
          teal: colors.edge.teal,
          magenta: colors.edge.magenta,
        },

        // Semantic states
        state: {
          success: colors.state.success,
          'success-bg': colors.state.successBg,
          warning: colors.state.warning,
          'warning-bg': colors.state.warningBg,
          danger: colors.state.danger,
          'danger-bg': colors.state.dangerBg,
        }
      },
      fontFamily: typography.fontFamily,
      letterSpacing: typography.letterSpacing,
      borderRadius: {
        ...radii,
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        ambient: shadows.ambient,
        subtle: shadows.subtle,
        card: shadows.card,
        float: shadows.float,
        glow: shadows.glow,
      },
      backgroundImage: {
        'rival-gradient': colors.edge.gradient,
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
