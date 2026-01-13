/**
 * ONYX & PAPER DESIGN SYSTEM
 * "Contrast. Structure. Precision."
 * 
 * Aesthetic: High-end creative studio / Architectural portfolio.
 * Brutalist-light approach: bold enough to be modern, refined enough to stay premium.
 * Inspired by Swiss International minimalism and fashion lookbooks.
 */

export const colors = {
  // THE CANVAS (Crisp Paper)
  bg: {
    app: "#FFFFFF", // Pure white paper background.
    surface: "#FFFFFF", // Solid white. No transparency.
    subtle: "#FAFAFA", // Very subtle gray for subtle layers.
    sidebar: "#FFFFFF", // Unified with canvas.
  },
  border: {
    subtle: "#000000", // Solid black lines define the grid.
    hover: "#000000", // Same - interaction shown via fill inversion.
    subtleAlpha: "rgba(0,0,0,0.8)", // High contrast for borders
  },
  text: {
    primary: "#000000", // Absolute black for maximum legibility.
    secondary: "#666666", // Mid-range gray for subtext.
    tertiary: "#999999", // Ghosted metadata.
    inverse: "#FFFFFF", // White on black surfaces.
  },

  // PRIMARY ACCENT (Pure Black - Inversion for Interaction)
  accent: {
    primary: "#000000", // Pure black for CTAs.
    primaryHover: "#000000", // Same color - interaction via text inversion.
    tint: "#F5F5F5", // Subtle background for hover states.
  },

  // REMOVED: No gradients or colorful accents in Onyx & Paper
  edge: {
    teal: "#000000", // All accents become black
    magenta: "#000000",
    gradient: "#000000", // No gradients - pure monochrome
  },

  // SEMANTIC STATES (Monochrome versions)
  state: {
    success: "#000000", // Black checkmarks on white
    successBg: "#F0F0F0", // Subtle gray background
    warning: "#666666", // Medium gray for warnings
    warningBg: "#F5F5F5", // Light gray background
    danger: "#000000", // Black for destructive actions
    dangerBg: "#F0F0F0", // Subtle background
  },
} as const;

export const typography = {
  fontFamily: {
    sans: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif",
    ],
    display: ["Inter", "Space Grotesk", "sans-serif"], // Heavy display font
    mono: ["SF Mono", "IBM Plex Mono", "monospace"], // For metadata and technical data
  },
  letterSpacing: {
    tight: "-0.02em",
    tighter: "-0.04em",
    kinetic: "-0.06em", // Kinetic text for headlines
    wide: "0.02em",
    wider: "0.04em",
    widest: "0.08em",
  },
  lineHeight: {
    kinetic: "0.95", // Tighter for architectural headlines
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.6",
  },
} as const;

export const spacing = {
  tight: '1rem',      // 16px
  base: '1.5rem',     // 24px
  spacious: '2rem',   // 32px
  hero: '3rem',       // 48px
} as const;

export const radii = {
  sm: "0px",      // Sharp corners for precision
  md: "4px",      // Slight rounding (max 4px)
  lg: "4px",      // Consistent slight rounding
  xl: "4px",      // Uniform rounded-sm
  "2xl": "4px",   // All corners consistent
  pill: "9999px", // Only pills stay rounded
  btn: "2px",     // Minimal button rounding
  card: "4px",    // Consistent card radius
} as const;

export const shadows = {
  ambient: "none", // No shadows - borders create structure
  subtle: "none",  // No shadows - use borders
  card: "none",    // No shadows - use borders
  float: "none",   // No shadows - use borders
  soft: "none",    // No shadows - use borders
  inner: "none",   // No shadows - use borders
  glow: "none",    // No glow effects
  "2xl": "none",   // No shadows
} as const;

export const transitions = {
  fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
  base: "200ms cubic-bezier(0.16, 1, 0.3, 1)",
  slow: "300ms cubic-bezier(0.16, 1, 0.3, 1)",
  slower: "500ms cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

// REMOVED: No glass effects in Onyx & Paper
// Use solid backgrounds and borders instead
export const glass = {
  backdrop: {
    filter: "none",
    background: "#FFFFFF", // Solid white
  },
  backdropDark: {
    filter: "none",
    background: "#000000", // Solid black
  },
} as const;

// DESIGN SYSTEM HELPERS FOR ONYX & PAPER

export const DS = {
  colors: {
    bg: "bg-[#FFFFFF]",
    surface: "bg-white border border-black",
    surfaceHighlight: "bg-black text-white",
    textPrimary: "text-black",
    textSecondary: "text-neutral-500",
    border: "border-black",
    accent: "bg-black",
    shadow: "shadow-none",
  },
  layout: {
    radius: "rounded-none", // Sharp, high-end look
    radiusSm: "rounded-none",
    gap: "gap-0", // Borders touch to create a true grid
    pad: "p-10",
  },
  type: {
    header: "font-bold uppercase tracking-tighter text-2xl",
    body: "font-mono text-[13px] leading-tight",
  },
} as const;