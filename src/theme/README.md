# Design System Tokens - Studio Roster

## Overview

This document provides a comprehensive reference for all design system tokens used throughout the Studio Roster application. These tokens ensure consistency and maintainability across the entire UI.

## Color Tokens

### Brand Colors
```css
/* Primary Brand Colors */
--color-primary: #2463E6;        /* Main brand blue */
--color-primary-hover: #1E4EC8;  /* Darker shade for hover states */
--color-primary-tint: #E1EBFF;   /* Light tint for backgrounds */

/* Surface Colors */
--color-app: #F5F5F7;            /* Main app background */
--color-surface: #FFFFFF;        /* Card and modal backgrounds */
--color-subtle: #F9F9FB;         /* Subtle backgrounds */
--color-sidebar: #FBFBFD;        /* Sidebar background */

/* Text Colors */
--color-ink-primary: #1D1D1F;    /* Primary text */
--color-ink-secondary: #86868B;  /* Secondary text */
--color-ink-tertiary: #A2A2A7;   /* Tertiary text */
--color-ink-inverse: #FFFFFF;    /* Text on dark backgrounds */

/* Accent Colors */
--color-accent-success: #18C9AE; /* Success states */
--color-accent-warning: #F59E0B; /* Warning states */
--color-accent-error: #EF4444;   /* Error states */
--color-accent-info: #3B82F6;    /* Info states */
```

### Semantic Color Usage
```css
/* Status Colors */
--color-status-active: #18C9AE;
--color-status-inactive: #A2A2A7;
--color-status-pending: #F59E0B;
--color-status-error: #EF4444;

/* Interactive States */
--color-interactive-hover: #1E4EC8;
--color-interactive-active: #1A4CB8;
--color-interactive-disabled: #E5E7EB;
```

## Typography Tokens

### Font Families
```css
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
--font-family-display: 'Cal Sans', 'Inter', sans-serif;
```

### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px - Captions, labels */
--font-size-sm: 0.875rem;   /* 14px - Body text */
--font-size-base: 1rem;     /* 16px - Default body */
--font-size-lg: 1.125rem;   /* 18px - Large body */
--font-size-xl: 1.25rem;    /* 20px - Small headings */
--font-size-2xl: 1.5rem;    /* 24px - Headings */
--font-size-3xl: 1.875rem;  /* 30px - Large headings */
--font-size-4xl: 2.25rem;   /* 36px - Display text */
```

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Line Heights
```css
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;
```

## Spacing Tokens

### Base Spacing Scale
```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Semantic Spacing
```css
--spacing-tight: 1rem;    /* 16px - Compact spacing */
--spacing-base: 1.5rem;   /* 24px - Default spacing */
--spacing-spacious: 2rem; /* 32px - Generous spacing */
--spacing-hero: 3rem;     /* 48px - Large section spacing */
```

## Border Radius Tokens

### Standard Radii
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px - Small elements */
--radius-base: 0.25rem;  /* 4px - Default radius */
--radius-md: 0.5rem;     /* 8px - Medium radius */
--radius-lg: 0.75rem;    /* 12px - Large radius */
--radius-xl: 1rem;       /* 16px - Extra large */
--radius-2xl: 1.5rem;    /* 24px - Card radius */
--radius-pill: 9999px;   /* Fully rounded */
```

## Shadow Tokens

### Elevation System
```css
/* Ambient Light - Subtle overall illumination */
--shadow-ambient: 0 0 0 1px rgba(0, 0, 0, 0.05),
                  0 2px 4px rgba(0, 0, 0, 0.1);

/* Card Shadows - Standard elevation */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.12),
               0 1px 2px rgba(0, 0, 0, 0.24);

/* Float Shadows - Elements hovering above surface */
--shadow-float: 0 4px 6px rgba(0, 0, 0, 0.07),
                0 2px 4px rgba(0, 0, 0, 0.06);

/* Soft Shadows - Gentle depth */
--shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.04),
               0 1px 3px rgba(0, 0, 0, 0.08);

/* Subtle Shadows - Minimal elevation */
--shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Glow Shadows - Accent elements */
--shadow-glow: 0 0 20px rgba(36, 99, 230, 0.15);
```

## Glass Effect Tokens

### Glass Morphism
```css
/* Primary Glass Effect */
--glass-bg: rgba(255, 255, 255, 0.75);
--glass-blur: blur(20px);
--glass-saturation: saturate(180%);
--glass-border: rgba(255, 255, 255, 0.2);

/* Interactive Glass States */
--glass-light: rgba(255, 255, 255, 0.9);     /* Light emphasis */
--glass-interactive: rgba(255, 255, 255, 0.6); /* Hover/active states */
--glass-dark: rgba(0, 0, 0, 0.1);             /* Dark mode support */
```

## Animation Tokens

### Duration Scale
```css
--duration-fast: 150ms;      /* Quick interactions */
--duration-base: 200ms;      /* Standard transitions */
--duration-slow: 300ms;      /* Longer transitions */
--duration-slower: 500ms;    /* Page transitions */

/* Physics-based timing for natural feel */
--duration-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--duration-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--duration-sharp: cubic-bezier(0.4, 0, 0.6, 1);
```

### Easing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-back: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## Layout Tokens

### Component Dimensions
```css
/* Sidebar */
--sidebar-width: 18rem;      /* 288px */
--sidebar-collapsed: 4rem;   /* 64px */

/* Header */
--header-height: 3.5rem;     /* 56px */

/* Content */
--content-max-width: 80rem;  /* 1280px */
--card-max-width: 48rem;     /* 768px */

/* Grid */
--grid-gap: 1.5rem;          /* 24px */
--grid-columns: 12;
```

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

## Usage Examples

### Button Component
```css
.button {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: var(--color-ink-inverse);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-base) var(--ease-smooth);
}

.button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-float);
}
```

### Card Component
```css
.card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur) var(--glass-saturation);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-6);
}
```

### Text Styles
```css
.heading-xl {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-ink-primary);
}

.body-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
  color: var(--color-ink-secondary);
}
```

## Design Principles

### 1. Consistency
- Use tokens instead of hardcoded values
- Maintain consistent spacing scale
- Apply consistent color usage patterns

### 2. Accessibility
- Ensure sufficient color contrast (WCAG AA)
- Use semantic spacing for touch targets (44px minimum)
- Respect reduced motion preferences

### 3. Performance
- Minimize CSS custom property usage in critical paths
- Use CSS variables for theming and dynamic values
- Prefer transform over position changes for animations

### 4. Scalability
- Design tokens work at any scale
- Semantic naming makes changes predictable
- Component composition over inheritance

## Migration Guide

### From Hardcoded Values
```css
/* Before */
.button {
  padding: 12px 24px;
  background-color: #2463E6;
  border-radius: 8px;
}

/* After */
.button {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  border-radius: var(--radius-lg);
}
```

### Creating New Tokens
1. Identify the design pattern
2. Choose appropriate semantic name
3. Add to relevant token category
4. Update documentation
5. Test in all contexts

## Contributing

When adding new design tokens:
1. Follow the established naming convention
2. Consider semantic meaning over implementation
3. Update this documentation
4. Test accessibility impact
5. Consider theme compatibility

---

**Note**: This design system is built on CSS custom properties and should be compatible with all modern browsers. For older browser support, consider using a CSS preprocessor or build-time transformation.
