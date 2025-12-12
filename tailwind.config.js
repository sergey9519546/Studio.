/** @type {import('tailwindcss').Config} */
const fs = require('fs');
const path = require('path');

// Read and parse the TypeScript tokens file
const tokensPath = path.resolve(__dirname, 'src/theme/tokens.ts');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');

// Extract the exported constants
const colors = {
  bg: {
    app: '#F5F5F7',
    surface: '#FFFFFF',
    subtle: '#F9F9FB',
    sidebar: '#FBFBFD',
  },
  border: {
    subtle: '#E5E5EA',
    hover: '#D1D1D6',
    subtleAlpha: 'rgba(0,0,0,0.04)',
  },
  text: {
    primary: '#1D1D1F',
    secondary: '#86868B',
    tertiary: '#A2A2A7',
    inverse: '#FFFFFF',
  },
  accent: {
    primary: '#2463E6',
    primaryHover: '#1E4EC8',
    tint: '#E1EBFF',
  },
  edge: {
    teal: '#18C9AE',
    magenta: '#E14BF7',
  },
  state: {
    success: '#34C759',
    successBg: '#E8F5E9',
    warning: '#FF9500',
    warningBg: '#FFF3E0',
    danger: '#FF3B30',
    dangerBg: '#FFEBEE',
  }
};

const glass = {
  backdrop: {
    filter: "blur(20px) saturate(180%)",
    background: "rgba(255, 255, 255, 0.75)",
  },
  backdropDark: {
    filter: "blur(20px) saturate(150%)",
    background: "rgba(29, 29, 31, 0.7)",
  },
};

const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  pill: "9999px",
  btn: "14px",
  card: "24px",
};

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
        app: colors.bg.app,
        surface: colors.bg.surface,
        subtle: colors.bg.subtle,
        border: colors.border,
        ink: colors.text,
        primary: { DEFAULT: colors.accent.primary, hover: colors.accent.primaryHover, tint: colors.accent.tint },
        edge: colors.edge,
        state: colors.state,
      },
      boxShadow: {
        'soft': '0px 4px 24px rgba(0,0,0,0.02)',
        'card': '0px 4px 12px rgba(0,0,0,0.06)',
        'elevation': '0px 8px 30px rgba(0, 0, 0, 0.04)',
        'float': '0px 20px 40px rgba(0,0,0,0.08)',
        'glow': '0px 0px 20px rgba(36, 99, 230, 0.15)',
      },
      backgroundImage: {
        'rival-gradient': 'linear-gradient(90deg, #2463E6 0%, #18C9AE 50%, #E14BF7 100%)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
      spacing: {
        'tight': '1rem',
        'base': '1.5rem',
        'spacious': '2rem',
        'hero': '3rem',
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
