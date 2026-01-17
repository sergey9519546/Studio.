# Design System Guide
## Enhanced Liquid Glass Design System v2.0

### Overview

The Liquid Glass Design System is a comprehensive design framework built on Swiss International + Apple precision principles, focused on ultra-high luminance and weightless interfaces. This enhanced version prioritizes accessibility, WCAG 2.1 AA compliance, and mobile-first responsive design.

---

## Design Philosophy

### Core Principles
- **Weightless**: Interfaces that feel ethereal and unobtrusive
- **Luminous**: High contrast, readable text and clear visual hierarchy
- **Reductionist**: Clean, minimal design with purposeful elements
- **Accessible**: Inclusive design serving all users
- **Responsive**: Seamless experience across all devices

### Visual Identity
- **Aesthetic**: Swiss International Design + Apple precision
- **Primary Brand**: Rival Blue (#2463E6)
- **Supporting Colors**: Teal (#18C9AE), Magenta (#E14BF7)
- **Base Canvas**: System Mist (#F5F5F7) with Porcelain surfaces

---

## Color System

### Primary Palette
```css
/* Background Colors */
--bg-app: #F5F5F7        /* System Mist - Main canvas */
--bg-surface: #FFFFFF     /* Porcelain - Cards & modals */
--bg-subtle: #F9F9FB      /* Subtle backgrounds */
--bg-sidebar: #FBFBFD     /* Navigation surfaces */

/* Text Colors */
--text-primary: #1D1D1F   /* Obsidian - Primary content */
--text-secondary: #86868B /* Slate - Secondary info */
--text-tertiary: #A2A2A7  /* Tertiary - Placeholders */
--text-inverse: #FFFFFF   /* White text on dark */

/* Border Colors */
--border-subtle: #E5E5EA  /* Delicate structural lines */
--border-hover: #D1D1D6   /* Interactive states */

/* Accent Colors */
--accent-primary: #2463E6      /* Rival Blue - Brand */
--accent-primary-hover: #1E4EC8 /* Darker brand state */
--accent-tint: #E1EBFF         /* Light brand background */

/* Edge Colors */
--edge-teal: #18C9AE           /* Intelligence, Freshness */
--edge-magenta: #E14BF7        /* Creative spark, AI */

/* State Colors */
--state-success: #34C759
--state-success-bg: #E8F5E9
--state-warning: #FF9500
--state-warning-bg: #FFF3E0
--state-danger: #FF3B30
--state-danger-bg: #FFEBEE
```

### Glass Effects
```css
/* Light Glass */
--glass-backdrop: blur(20px) saturate(180%)
--glass-background: rgba(255, 255, 255, 0.75)

/* Dark Glass */
--glass-dark-backdrop: blur(20px) saturate(150%)
--glass-dark-background: rgba(29, 29, 31, 0.7)
```

---

## Typography

### Font Stack
```css
--font-sans: Inter, SF Pro Text, -apple-system, sans-serif;
--font-display: "Inter Tight", SF Pro Display, sans-serif;
--font-mono: "JetBrains Mono", SF Mono, monospace;
```

### Text Scale
- **Display**: 48px / 56px (Hero titles)
- **H1**: 40px / 48px (Page titles)
- **H2**: 32px / 40px (Section headers)
- **H3**: 24px / 32px (Subsection headers)
- **Body**: 16px / 24px (Regular text)
- **Small**: 14px / 20px (Secondary text)
- **Caption**: 12px / 16px (Metadata)
- **Micro**: 10px / 14px (Fine print)

### Letter Spacing
- **Tight**: -0.02em (Headers)
- **Tighter**: -0.04em (Display text)
- **Kinetic**: -0.06em (Studio OS style)
- **Normal**: 0em (Body text)
- **Wide**: +0.02em (Captions)

### Line Heights
- **Kinetic**: 0.9 (Studio OS style)
- **Tight**: 1.25 (Headers)
- **Normal**: 1.5 (Body text)
- **Relaxed**: 1.6 (Long-form content)

---

## Spacing System

### Base Scale (4px increments)
```css
--space-0: 0px
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px (base unit)
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

### Semantic Spacing
- **tight**: 1rem (16px) - Component padding
- **base**: 1.5rem (24px) - Section spacing
- **spacious**: 2rem (32px) - Major sections
- **hero**: 3rem (48px) - Page sections
- **touch**: 44px - Minimum touch target
- **touch-lg**: 48px - Comfortable touch target

---

## Border Radius

### Standard Radius
- **sm**: 8px (Small components)
- **md**: 12px (Inputs, small cards)
- **lg**: 16px (Medium components)
- **xl**: 24px (Cards, panels)
- **2xl**: 32px (Large cards, modals)
- **pill**: 9999px (Pills, badges)
- **btn**: 14px (Buttons)
- **card**: 24px (Default card radius)

---

## Shadow System

### Elevation Levels
```css
/* Subtle shadows for minimal elevation */
--shadow-soft: 0px 4px 24px rgba(0,0,0,0.02);

/* Card shadows for content elevation */
--shadow-card: 0px 4px 12px rgba(0,0,0,0.06);

/* Standard elevation for interactive elements */
--shadow-elevation: 0px 8px 30px rgba(0,0,0,0.04);

/* Floating elements */
--shadow-float: 0px 20px 40px rgba(0,0,0,0.08);

/* Glow effects for interactive states */
--shadow-glow: 0px 0px 20px rgba(36,99,230,0.15);

/* Accessibility focus rings */
--shadow-focus-ring: 0 0 0 3px rgba(36, 99, 230, 0.5);
--shadow-focus-error: 0 0 0 3px rgba(255, 59, 48, 0.5);
--shadow-focus-success: 0 0 0 3px rgba(52, 199, 89, 0.5);
```

---

## Animation System

### Timing Functions
- **fast**: 150ms cubic-bezier(0.16, 1, 0.3, 1)
- **base**: 200ms cubic-bezier(0.16, 1, 0.3, 1)
- **slow**: 300ms cubic-bezier(0.16, 1, 0.3, 1)
- **slower**: 500ms cubic-bezier(0.16, 1, 0.3, 1)

### Animations
```css
/* Fade in effect */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Slide up from bottom */
@keyframes slideUp {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* Scale in effect */
@keyframes scaleIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Loading shimmer effect */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-xs: 475px   /* Small phones */
--breakpoint-sm: 640px   /* Large phones */
--breakpoint-md: 768px   /* Tablets */
--breakpoint-lg: 1024px  /* Small laptops */
--breakpoint-xl: 1280px  /* Desktops */
--breakpoint-2xl: 1536px /* Large desktops */
--breakpoint-3xl: 1600px /* Ultra-wide */
```

### Touch Targets
- **Minimum**: 44px x 44px (iOS/Android guidelines)
- **Comfortable**: 48px x 48px (Enhanced usability)
- **Padding**: Minimum 8px around interactive elements

---

## Accessibility Features

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus rings with 3px offset
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Touch Targets**: Minimum 44px for mobile interaction

### Focus Management
```css
/* Standard focus ring */
.focus-ring:focus {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 3px rgba(36, 99, 230, 0.5);
}

/* Error focus state */
.focus-error:focus {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.5);
}

/* Success focus state */
.focus-success:focus {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.5);
}
```

### Screen Reader Support
- `.sr-only`: Hide from visual users, available to screen readers
- `.not-sr-only`: Make visible to all users
- Proper heading hierarchy (h1 > h2 > h3)
- Descriptive link text
- Form labels and error messages

---

## Component Guidelines

### Button Variants
```css
/* Primary Button */
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverse);
  min-height: 44px;
  min-width: 44px;
  border-radius: var(--radius-btn);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  min-height: 44px;
  min-width: 44px;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  min-height: 44px;
  min-width: 44px;
}
```

### Form Inputs
```css
/* Standard Input */
.form-input {
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

/* Focus State */
.form-input:focus {
  outline: 2px solid transparent;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(36, 99, 230, 0.1);
}

/* Error State */
.form-input:invalid {
  border-color: var(--state-danger);
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
}
```

### Card Component
```css
.card {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}
```

---

## Usage Guidelines

### Do's
- Use the glass morphism effects sparingly for depth
- Maintain consistent spacing using the 4px base unit
- Ensure all interactive elements meet touch target minimums
- Use proper heading hierarchy for accessibility
- Implement focus indicators for keyboard navigation
- Test with screen readers for semantic correctness

### Don'ts
- Don't use colors that fail WCAG contrast ratios
- Don't make interactive elements smaller than 44px
- Don't rely solely on color to convey information
- Don't skip heading levels (h1 > h3)
- Don't use motion effects that could trigger vestibular disorders
- Don't forget to test with real assistive technologies

---

## Implementation

### Tailwind Classes
The design system is implemented using custom Tailwind utilities:

```css
/* Colors */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.bg-surface { background-color: var(--bg-surface); }

/* Spacing */
.p-touch { padding: 44px; }
.mb-base { margin-bottom: 24px; }

/* Effects */
.glass { backdrop-filter: var(--glass-backdrop); background: var(--glass-background); }
.shadow-focus-ring { box-shadow: var(--shadow-focus-ring); }

/* Touch targets */
.touch-target { min-height: 44px; min-width: 44px; }
```

### React Components
Use the accessibility-enhanced components from `src/components/Accessibility.tsx`:

```tsx
import { AccessibleButton, AccessibleInput, AccessibleModal } from '@/components/Accessibility';

// Accessible button with proper ARIA
<AccessibleButton variant="primary" size="md" loading={isLoading}>
  Create Project
</AccessibleButton>

// Form input with error handling
<AccessibleInput
  id="project-name"
  label="Project Name"
  error={errors.name}
  required
/>

// Modal with focus trap
<AccessibleModal isOpen={isOpen} onClose={onClose} title="Create Project">
  Modal content
</AccessibleModal>
```

---

## Testing Checklist

### Accessibility Testing
- [ ] Run automated accessibility tests (axe-core)
- [ ] Test with keyboard navigation only
- [ ] Verify screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast ratios
- [ ] Validate ARIA labels and roles
- [ ] Test focus management in modals and dropdowns

### Responsive Testing
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify touch target sizes (minimum 44px)
- [ ] Check layout at all breakpoints
- [ ] Test landscape vs portrait orientations
- [ ] Verify mobile navigation behavior

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install @tailwindcss/forms @tailwindcss/typography
   ```

2. **Update Tailwind Config**
   ```javascript
   module.exports = {
     // Use the enhanced config provided
   }
   ```

3. **Import Design Tokens**
   ```typescript
   import { colors, spacing, radii } from './src/theme/tokens';
   ```

4. **Use Accessibility Components**
   ```tsx
   import { SkipLink, FocusTrap, AccessibleButton } from './src/components/Accessibility';
   ```

5. **Test Accessibility**
   ```bash
   npm run test:a11y
   ```

---

This design system ensures a consistent, accessible, and beautiful user experience across all platforms while maintaining the elegant "Liquid Glass" aesthetic.
