/**
 * LIQUID GLASS DESIGN SYSTEM
 * "Weightless. Luminous. Reductionist."
 * 
 * Aesthetic: Swiss International + Apple precision. Ultra-high luminance.
 * The interface is engineered as a state of flow.
 */

export const colors = {
  // THE CANVAS (Luminance)
  bg: {
    app: '#F5F5F7',      // System Mist. The infinite void.
    surface: '#FFFFFF',  // Porcelain. Cards sit *on* the mist.
    subtle: '#F9F9FB',   // Subdued backgrounds for container nesting.
  },
  border: {
    subtle: '#E5E5EA',   // Delicate structural lines (use sparingly).
    hover: '#D1D1D6',    // Slightly darker for interactions.
  },
  text: {
    primary: '#1D1D1F',  // Obsidian. Primary data.
    secondary: '#86868B', // Slate. Metadata, secondary information.
    tertiary: '#A2A2A7', // Tertiary. Placeholders, disabled.
    inverse: '#FFFFFF',  // Inverse text on primary actions.
  },

  // PRIMARY ACCENT (Rival Blue)
  accent: {
    primary: '#2463E6',      // Main brand color.
    primaryHover: '#1E4EC8', // Interaction state.
    tint: '#E1EBFF',         // Subtlety (chips, active backgrounds).
  },

  // THE "DANGEROUS EDGE" (Gradients & Highlights)
  edge: {
    teal: '#18C9AE',    // Intelligence, Freshness
    magenta: '#E14BF7', // Creative spark, AI
    gradient: 'linear-gradient(90deg, #2463E6 0%, #18C9AE 50%, #E14BF7 100%)',
  },

  // SEMANTIC STATES
  state: {
    success: '#34C759',
    successBg: '#E8F5E9',
    warning: '#FF9500',
    warningBg: '#FFF3E0',
    danger: '#FF3B30',
    dangerBg: '#FFEBEE',
  }
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['SF Pro Display', 'Inter', 'sans-serif'],
    mono: ['SF Mono', 'IBM Plex Mono', 'monospace'],
  },
  letterSpacing: {
    tight: '-0.02em',
    tighter: '-0.04em',
    wide: '0.02em',
    widest: '0.08em',
  }
} as const;

export const spacing = {
  tight: '1rem',      // 16px
  base: '1.5rem',     // 24px
  spacious: '2rem',   // 32px
  hero: '3rem',       // 48px
} as const;

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',         // Squircles. The preferred radius.
  pill: '9999px',
} as const;

export const shadows = {
  ambient: '0px 10px 40px rgba(0,0,0,0.04)', // Ambient Levitation. Primary shadow.
  subtle: '0px 1px 2px rgba(0,0,0,0.05)',
  card: '0px 4px 12px rgba(0,0,0,0.06)',
  float: '0px 12px 32px rgba(0,0,0,0.08)',
  glow: '0px 0px 20px rgba(36, 99, 230, 0.15)',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  base: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
  slower: '500ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

// LIQUID GLASS MATERIAL
export const glass = {
  backdrop: {
    filter: 'blur(20px) saturate(180%)',
    background: 'rgba(255, 255, 255, 0.75)',
  },
  backdropDark: {
    filter: 'blur(20px) saturate(150%)',
    background: 'rgba(29, 29, 31, 0.7)',
  },
} as const;
