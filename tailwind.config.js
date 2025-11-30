
/** @type {import('tailwindcss').Config} */
const { colors, typography, radii, shadows } = require('./src/theme/tokens'); // Adjust path if necessary based on build

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapping tokens to Tailwind classes
        app: colors.bg.app,
        surface: colors.bg.surface,
        subtle: colors.bg.subtle,
        
        border: {
          subtle: colors.border.subtle,
          hover: colors.border.hover,
        },

        ink: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          tertiary: colors.text.tertiary,
          inverse: colors.text.inverse,
        },

        primary: {
          DEFAULT: colors.accent.primary,
          hover: colors.accent.primaryHover,
          tint: colors.accent.tint,
        },

        edge: {
          teal: colors.edge.teal,
          magenta: colors.edge.magenta,
        },

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
        ...shadows,
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
      }
    },
  },
  plugins: [],
}
