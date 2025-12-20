/** @type {import('tailwindcss').Config} */
const fs = require('fs');
const path = require('path');

// Read and parse the TypeScript tokens file
const tokensPath = path.resolve(__dirname, 'src/theme/tokens.ts');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');

// Extract the exported constants
const colors = {
  bg: {
    app: "#F5F5F7",
    surface: "#FDFDFD",
    subtle: "#F9F9FB",
    sidebar: "#FDFDFD",
  },
  border: {
    subtle: "#E5E5EA",
    hover: "#D1D1D6",
    subtleAlpha: "rgba(0,0,0,0.04)",
  },
  text: {
    primary: "#000000",
    secondary: "#6E6E73",
    tertiary: "#A2A2A7",
    inverse: "#FFFFFF",
  },
  accent: {
    primary: "#2463E6",
    primaryHover: "#1E4EC8",
    tint: "#E1EBFF",
  },
  edge: {
    teal: "#18C9AE",
    magenta: "#E14BF7",
  },
  state: {
    success: "#34C759",
    successBg: "#E8F5E9",
    warning: "#FF9500",
    warningBg: "#FFF3E0",
    danger: "#FF3B30",
    dangerBg: "#FFEBEE",
  },
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
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "SF Pro Text", "-apple-system", "sans-serif"],
        display: ['"Inter Tight"', "SF Pro Display", "sans-serif"],
        mono: ['"JetBrains Mono"', "SF Mono", "monospace"],
      },
      colors: {
        app: colors.bg.app,
        surface: colors.bg.surface,
        subtle: colors.bg.subtle,
        border: colors.border,
        ink: colors.text,
        primary: {
          DEFAULT: colors.accent.primary,
          hover: colors.accent.primaryHover,
          tint: colors.accent.tint,
        },
        edge: colors.edge,
        state: colors.state,
      },
      boxShadow: {
        soft: "0px 2px 8px rgba(0,0,0,0.02)",
        card: "0px 8px 24px rgba(0,0,0,0.04)",
        elevation: "0px 10px 40px rgba(0,0,0,0.04)",
        float: "0px 20px 60px rgba(0,0,0,0.06)",
        glow: "0px 0px 20px rgba(36, 99, 230, 0.12)",
        // Accessibility focus shadows
        "focus-ring": "0 0 0 3px rgba(36, 99, 230, 0.5)",
        "focus-error": "0 0 0 3px rgba(255, 59, 48, 0.5)",
        "focus-success": "0 0 0 3px rgba(52, 199, 89, 0.5)",
      },
      backgroundImage: {
        "rival-gradient":
          "linear-gradient(90deg, #2463E6 0%, #18C9AE 50%, #E14BF7 100%)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
      },
      spacing: {
        tight: "1rem",
        base: "1.5rem",
        spacious: "2rem",
        hero: "3rem",
        // Mobile touch targets (44px minimum)
        touch: "44px",
        "touch-lg": "48px",
      },
      backdropFilter: {
        glass: "blur(20px) saturate(180%)",
      },
      backgroundColor: {
        glass: glass.backdrop.background,
        "glass-dark": glass.backdropDark.background,
      },
      // Animation and keyframe improvements
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "slide-down": "slideDown 300ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      // Enhanced spacing for responsive design
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
      minHeight: {
        touch: "44px",
        "touch-lg": "48px",
      },
      minWidth: {
        touch: "44px",
        "touch-lg": "48px",
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents }) {
      addUtilities({
        // Enhanced focus utilities for accessibility
        ".focus-ring": {
          "&:focus": {
            outline: "2px solid transparent",
            "box-shadow": "0 0 0 3px rgba(36, 99, 230, 0.5)",
          },
        },
        ".focus-ring-inset": {
          "&:focus": {
            outline: "2px solid transparent",
            "box-shadow": "inset 0 0 0 3px rgba(36, 99, 230, 0.5)",
          },
        },
        // Screen reader utilities
        ".sr-only": {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          "white-space": "nowrap",
          "border-width": "0",
        },
        ".not-sr-only": {
          position: "static",
          width: "auto",
          height: "auto",
          padding: "0",
          margin: "0",
          overflow: "visible",
          clip: "auto",
          "white-space": "normal",
        },
        // Touch-friendly interactive elements
        ".touch-target": {
          "min-height": "44px",
          "min-width": "44px",
        },
        ".touch-target-lg": {
          "min-height": "48px",
          "min-width": "48px",
        },
        // Enhanced glass effects
        ".glass": {
          "backdrop-filter": glass.backdrop.filter,
          "background-color": glass.backdrop.background,
          "border-radius": radii.xl,
        },
        ".glass-dark": {
          "backdrop-filter": glass.backdropDark.filter,
          "background-color": glass.backdropDark.background,
          "border-radius": radii.xl,
        },
        ".glass-sm": {
          "backdrop-filter": glass.backdrop.filter,
          "background-color": glass.backdrop.background,
          "border-radius": radii.md,
        },
        // Text utilities with proper contrast
        ".text-primary": {
          color: colors.text.primary,
        },
        ".text-secondary": {
          color: colors.text.secondary,
        },
        ".text-tertiary": {
          color: colors.text.tertiary,
        },
        // Skip link for accessibility
        ".skip-link": {
          position: "absolute",
          top: "-40px",
          left: "6px",
          background: colors.accent.primary,
          color: colors.text.inverse,
          padding: "8px",
          "border-radius": radii.md,
          "text-decoration": "none",
          "z-index": "9999",
          "&:focus": {
            top: "6px",
          },
        },
      });

      addComponents({
        // Enhanced button component with accessibility
        ".btn": {
          display: "inline-flex",
          "align-items": "center",
          "justify-content": "center",
          "min-height": "44px",
          "min-width": "44px",
          padding: "8px 16px",
          "font-size": "14px",
          "font-weight": "500",
          "border-radius": radii.btn,
          border: "none",
          cursor: "pointer",
          transition: "all 200ms ease-out",
          "&:focus": {
            outline: "2px solid transparent",
            "box-shadow": "0 0 0 3px rgba(36, 99, 230, 0.5)",
          },
          "&:disabled": {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
        ".btn-primary": {
          background: colors.accent.primary,
          color: colors.text.inverse,
          "&:hover:not(:disabled)": {
            "background-color": colors.accent.primaryHover,
          },
        },
        ".btn-secondary": {
          background: "transparent",
          color: colors.text.secondary,
          border: `1px solid ${colors.border.subtle}`,
          "&:hover:not(:disabled)": {
            "background-color": colors.bg.subtle,
            color: colors.text.primary,
          },
        },
        // Enhanced form inputs
        ".form-input": {
          display: "block",
          width: "100%",
          "min-height": "44px",
          padding: "12px 16px",
          "font-size": "14px",
          "line-height": "1.5",
          color: colors.text.primary,
          "background-color": colors.bg.surface,
          border: `1px solid ${colors.border.subtle}`,
          "border-radius": radii.md,
          transition: "border-color 200ms ease-out, box-shadow 200ms ease-out",
          "&:focus": {
            outline: "2px solid transparent",
            "border-color": colors.accent.primary,
            "box-shadow": "0 0 0 3px rgba(36, 99, 230, 0.1)",
          },
          "&:invalid": {
            "border-color": colors.state.danger,
            "box-shadow": "0 0 0 3px rgba(255, 59, 48, 0.1)",
          },
        },
        // Card component with proper elevation
        ".card": {
          background: colors.bg.surface,
          "border-radius": radii.xl,
          "box-shadow": "0px 4px 12px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.border.subtle}`,
          overflow: "hidden",
        },
      });
    },
  ],
};
