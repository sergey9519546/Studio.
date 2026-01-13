# Studio Roster Design System

## Table of Contents

1. [Introduction](#introduction)
2. [Design Philosophy](#design-philosophy)
3. [Visual Language](#visual-language)
4. [Components](#components)
5. [Layout System](#layout-system)
6. [Accessibility](#accessibility)
7. [Implementation Guidelines](#implementation-guidelines)
8. [Brand Guidelines](#brand-guidelines)
9. [Motion & Animation](#motion--animation)
10. [Dark Mode Support](#dark-mode-support)
11. [Contributing](#contributing)

## Introduction

The Studio Roster Design System is a comprehensive guide that ensures visual consistency, accessibility, and usability across our AI-native agency management platform. This system provides designers, developers, and content creators with the tools and guidelines needed to build exceptional user experiences.

### Design Goals

- **Consistency**: Unified visual language across all touchpoints
- **Accessibility**: WCAG 2.1 AA compliant by default
- **Scalability**: Flexible system that grows with our platform
- **Performance**: Lightweight, efficient implementations
- **Maintainability**: Clear documentation and version control

## Design Philosophy

### Core Principles

#### 1. Onyx & Paper Aesthetic
Our design language is built around "Onyx & Paper" - a monochrome, high-contrast approach inspired by high-end fashion lookbooks and architectural portfolios. This "brutalist-light" aesthetic creates depth through structure, borders, and stark typography rather than color, blur, or shadow.

**Key Characteristics:**
- **Pure White Background**: Crisp, paper-like canvas (#FFFFFF)
- **Solid Black Elements**: Absolute black (#000000) for maximum contrast
- **Sharp Corners**: Minimal rounding (0px-4px) for architectural precision
- **Border-Defined Structure**: Hairline black borders create visual hierarchy
- **Monochromatic Palette**: No gradients or colorful accents

#### 2. Contrast & Structure
Depth is created through:
- **Border weight**: 1px-2px black lines define the grid
- **Fill inversion**: Hover states invert colors (white → black, black → white)
- **Typography hierarchy**: Bold uppercase headers vs. monospace metadata
- **Spacing**: Precise gaps between borders create the grid system

#### 3. Swiss-Inspired Minimalism
- **Grid-based layouts**: Elements align to a strict visual grid
- **Kinetic typography**: Large, heavy headlines with tight tracking
- **Functional over decorative**: Every element serves a purpose
- **Technical aesthetic**: Monospace fonts for metadata and "AI" outputs

#### 4. Curation Engine UX
The interface shifts from "Friendly Assistant" to "Curation Engine":
- **Precise interactions**: Clear feedback via color inversion
- **Structured presentation**: Grid-based asset organization
- **Technical polish**: Refined details feel expensive and curated
- **Content-first**: Design serves the work, not the brand

### Design Values

| Value | Description | Application |
|-------|-------------|-------------|
| **Clarity** | High contrast, maximum legibility | Black on white, clear borders |
| **Precision** | Architectural lines and spacing | Sharp corners, exact alignment |
| **Efficiency** | Fast loading, responsive interactions | Minimal overhead, crisp transitions |
| **Refinement** | Sophisticated minimalism | Thoughtful details, no excess |

## Visual Language

### Color Psychology

Our monochrome system communicates through contrast and structure rather than color:

#### Primary Colors (Monochrome)
- **Background (#FFFFFF)**: Pure white paper canvas
- **Surface (#FFFFFF)**: Solid white with black borders
- **Surface Highlight (#000000)**: Pure black for CTAs, sidebars
- **Text Primary (#000000)**: Absolute black for maximum legibility
- **Text Secondary (#666666)**: Mid-range gray for subtext
- **Borders (#000000)**: Solid black lines define the grid

#### Interaction States
- **Default**: White background, black text, black border
- **Hover**: Black background, white text (color inversion)
- **Active**: Same as hover (black background)
- **Disabled**: Gray text (#999999) with no hover effects

#### Semantic States (Monochrome)
- **Success**: Black checkmark on light gray background
- **Warning**: Medium gray (#666666) text
- **Error**: Black X on light gray background

### Typography System

#### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Type Scale & Usage
- **Display Headers**: `font-black tracking-tighter uppercase text-4xl+` - Hero sections, major announcements
- **Section Headers**: `font-bold uppercase tracking-tighter text-2xl` - Page titles, major section headers
- **Body Text**: `font-normal text-base leading-relaxed` - Standard body text
- **Metadata/Data**: `font-mono text-xs uppercase` - Technical data, timestamps, labels
- **Caption**: `font-mono text-[11px] uppercase` - Small metadata

#### Typography Guidelines
- **Headers**: All uppercase, tight letter-spacing (-0.04em to -0.06em)
- **Line Height**: 0.95 for kinetic headers, 1.5 for body text
- **Font Weight**: 400 (normal), 600 (semibold), 700 (bold), 900 (black)
- **Monospace**: Used for all metadata, technical info, and "AI" outputs

### Iconography

#### Icon Principles
- **Thinner Lines**: `strokeWidth={1}` for refined, expensive look
- **Consistency**: Unified stroke width and corner radius
- **Clarity**: Simple, recognizable shapes that work at small sizes
- **Context**: Icons support content, never replace it
- **Accessibility**: Text alternatives provided for all icons

#### Icon Library
- **Lucide React**: Primary icon library with `strokeWidth={1}`
- **Custom Icons**: Created when specific functionality requires it
- **Icon Sizes**: 16px, 20px, 24px standard sizes

## Components

### Foundation Components

#### Button
Buttons use color inversion for interaction feedback.

**Variants:**
- **Primary**: Black background, white text (primary actions)
- **Secondary**: White background, black border, black text (alternative actions)
- **Ghost**: Transparent background, black text (subtle actions)
- **Destructive**: Black background, white text (same as primary)

**States:**
- **Default**: White background with black border, black text
- **Hover**: Black background, white text (color inversion)
- **Active**: Same as hover
- **Disabled**: Gray text, no hover effects

**Sizes:**
- Small (32px height), Medium (40px height), Large (48px height)

**Border Radius:**
- `rounded-none` or `rounded-sm` (max 4px) - Sharp corners for precision

```css
/* Button Base Styles */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-bold);
  transition: background-color var(--duration-base) var(--ease-out);
  border: 1px solid black;
  cursor: pointer;
}

/* Primary Button - Black background */
.button--primary {
  background-color: #000000;
  color: #FFFFFF;
  border: 1px solid #000000;
}

.button--primary:hover {
  background-color: #000000; /* Same color - no change */
  transform: none; /* No lift - borders define structure */
}
```

#### Card
Cards are content containers defined by borders, not shadows.

**Features:**
- Solid white background
- Black border (1px or 2px)
- Sharp corners (0px-4px)
- Responsive padding

**Variants:**
- **Default**: White background, black border
- **Elevated**: Same as default (no elevation via shadow)
- **Interactive**: Hover inverts to black background with white text

#### Input Components

**Text Input:**
- White background, black border
- Focus state: Black background with white text (inversion)
- Sharp corners (0px-4px)
- Error state: Black border with gray background

**Select/Dropdown:**
- Black border, white background
- Keyboard navigation support
- Clear selection indicators

**Checkbox/Radio:**
- Square shape (no circles)
- Black border, white background
- Checked state: Black fill, white checkmark
- Large touch targets (44px minimum)

### Navigation Components

#### Sidebar
- Fixed position navigation
- White background with black border
- Active state: Black background with white text
- Keyboard navigation support

#### Breadcrumbs
- Black borders between items
- Clear hierarchical navigation
- Truncation handling for long paths

#### Tabs
- Horizontal orientation only
- Active tab: Black background with white text
- Inactive tab: White background with black border
- Keyboard arrow navigation

### Feedback Components

#### Toast/Notification
- Black background, white text
- No backdrop blur (solid colors only)
- Non-intrusive positioning
- Priority levels: all use black/white

#### Loading States
- Solid black spinner on white background
- No skeleton loading (use solid indicators)
- Progress indicators in black
- Empty states with black borders

#### Modals
- White background, black border
- No backdrop blur (solid overlay)
- Multiple size options
- Escape key handling

## Layout System

### Grid System

We use a flexible 12-column grid system with border-defined structure.

```css
.container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.row {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid black; /* Border defines structure */
  margin: 0 calc(var(--grid-gap) * -0.5);
}

.col {
  flex: 1;
  border: 1px solid black; /* Borders create true grid */
  padding: 0 calc(var(--grid-gap) * 0.5);
}
```

### Spacing System

Based on a 4px base unit for precision and rhythm.

**Spacing Scale:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Usage Guidelines:**
- **Tight spaces**: 8px-16px for related elements
- **Standard spacing**: 24px for regular content flow
- **Generous spacing**: 48px+ for major sections
- **Component padding**: 16px-24px for cards and modals

### Responsive Design

#### Breakpoints
- **Mobile**: 0px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

#### Mobile-First Approach
Start with mobile styles and progressively enhance for larger screens.

```css
/* Mobile first */
.component {
  padding: var(--spacing-md);
  border: 1px solid black;
  border-radius: 0;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: var(--spacing-xl);
  }
}
```

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal text**: Black on white meets 21:1 ratio (exceeds 4.5:1)
- **Large text**: Black on white meets 21:1 ratio (exceeds 3:1)
- **UI components**: Black on white meets 21:1 ratio (exceeds 3:1)

#### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the application
- Visible focus indicators on all focusable elements
- Focus state: Black outline (2px solid)

#### Screen Reader Support
- Semantic HTML elements used appropriately
- ARIA labels and descriptions where needed
- Proper heading hierarchy (h1-h6)
- Alternative text for all images and icons

#### Motor Accessibility
- Touch targets minimum 44px x 44px
- Generous click areas for interactive elements
- No time-based interactions without user control
- Error prevention and clear error messaging

### Implementation Checklist

- [x] Color contrast ratios exceed WCAG standards
- [ ] All interactive elements have keyboard access
- [ ] Focus indicators are clearly visible
- [ ] Screen reader testing completed
- [ ] Touch target sizes verified
- [ ] Semantic HTML structure validated
- [ ] ARIA attributes properly implemented

## Implementation Guidelines

### CSS Architecture

#### CSS Custom Properties
We use CSS custom properties for theming and dynamic values.

```css
:root {
  --color-bg: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-text-primary: #000000;
  --color-border: #000000;
  --radius-sm: 0px;
  --radius-md: 4px;
}
```

#### Component Structure
Each component follows a consistent pattern:

```css
/* Component namespace */
.component {
  /* Component-specific styles */
  border: 1px solid black;
  border-radius: var(--radius-sm);
}

.component__element {
  /* Element-specific styles */
}

.component--modifier {
  /* Modifier-specific styles */
}

/* Component states */
.component:is(:hover, :focus) {
  /* Hover/focus styles - color inversion */
  background-color: #000000;
  color: #FFFFFF;
}
```

#### BEM Methodology
Block, Element, Modifier naming convention for CSS classes.

```html
<div class="card card--interactive">
  <div class="card__header">
    <h2 class="card__title">Card Title</h2>
  </div>
  <div class="card__content">
    <p class="card__text">Card content</p>
  </div>
</div>
```

### React Components

#### Component Structure
```tsx
// Component interface
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Component implementation
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  ...props
}) => {
  return (
    <button
      className={cn(
        'button',
        `button--${variant}`,
        `button--${size}`,
        { 'button--disabled': disabled }
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Accessibility in Components
```tsx
// Proper ARIA implementation
const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <dialog
      className="modal"
      open={isOpen}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="modal__header">
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="modal__close"
        >
          ×
        </button>
      </div>
      <div id="modal-description" className="modal__content">
        {children}
      </div>
    </dialog>
  );
};
```

## Brand Guidelines

### Logo Usage

#### Primary Logo
- Minimum size: 32px height
- Clear space: Logo height on all sides
- Do not stretch, rotate, or alter proportions
- Use black logo on white background

#### Logo Variations
- **Horizontal**: For wide spaces, headers
- **Stacked**: For square spaces, social profiles
- **Icon only**: For small spaces, favicons

### Voice & Tone

#### Voice Characteristics
- **Precise**: Expert knowledge without pretension
- **Architectural**: Structured, organized communication
- **Technical**: Informed, data-driven insights
- **Refined**: Sophisticated, minimalist expression

#### Tone Variations
- **Feature announcements**: Concise, direct
- **Error messages**: Helpful, solution-focused
- **Loading states**: Brief, informative
- **Success messages**: Clear, confirmation-focused

### Photography & Imagery

#### Style Guidelines
- **Grayscale by default**: All images display in black and white
- **Color on hover**: Images reveal color only on interaction
- **Architecture-focused**: Lines, structure, composition over color
- **High contrast**: Clear separation between elements

#### Image Treatment
```css
/* Default grayscale state */
.asset-image {
  filter: grayscale(100%);
  transition: filter 300ms ease;
}

/* Color revealed on hover */
.asset-image:hover {
  filter: grayscale(0%);
}
```

## Motion & Animation

### Animation Principles

#### Purposeful Motion
Every animation should serve a functional purpose:
- **Feedback**: Confirm user actions (color inversion)
- **Orientation**: Guide user attention
- **Navigation**: Smooth transitions between states
- **Structure**: Emphasize grid and borders

#### Performance Considerations
- **Hardware acceleration**: Use transform and opacity
- **Reduced motion**: Respect user preferences
- **Loading states**: Non-blocking animations
- **Battery impact**: Efficient animation loops

### Animation Tokens

#### Duration Scale
```css
--duration-instant: 0ms;     /* Immediate state changes */
--duration-fast: 150ms;      /* Quick feedback */
--duration-normal: 200ms;    /* Standard transitions */
--duration-slow: 300ms;      /* Complex transitions */
--duration-page: 500ms;      /* Page-level changes */
```

#### Easing Functions
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Animations

#### Micro-interactions
- **Button hover**: Color inversion (white → black)
- **Input focus**: Background inversion (white → black)
- **Card hover**: Background inversion with text color change
- **Image hover**: Grayscale → Color reveal

#### Page Transitions
- **Slide transitions**: For navigation between pages
- **Fade transitions**: For modal opens/closes
- **No scale**: Avoid scaling, use color inversion instead

## Dark Mode Support

### Color Adaptation

#### Color Strategy
```css
:root {
  --color-bg: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-text: #000000;
  --color-border: #000000;
}

[data-theme="dark"] {
  --color-bg: #000000;
  --color-surface: #000000;
  --color-text: #FFFFFF;
  --color-border: #FFFFFF;
}
```

#### Implementation Approach
- **CSS custom properties**: Dynamic color switching
- **System preference detection**: Respect user settings
- **Smooth transitions**: Animated color changes
- **High contrast mode**: Enhanced accessibility

### Dark Mode Considerations

#### Color Adjustments
- **Complete inversion**: White ↔ Black swap
- **Grayscale maintained**: No color accents in either mode
- **Border consistency**: Borders remain visible in both modes
- **Text readability**: High contrast maintained

#### Performance
- **CSS variables**: Efficient theme switching
- **Image optimization**: Same grayscale treatment
- **Transition timing**: Smooth theme transitions

## Contributing

### Design System Governance

#### Version Control
- Semantic versioning (major.minor.patch)
- Changelog maintained for all changes
- Breaking changes documented with migration guides
- Release notes for new features

#### Review Process
- **Design review**: Visual consistency and accessibility
- **Code review**: Implementation quality and performance
- **User testing**: Usability and effectiveness
- **Accessibility audit**: WCAG compliance verification

#### Documentation Standards
- Clear examples for all components
- Interactive component playground
- Migration guides for major changes
- Contribution guidelines for new components

## Migration Guide: Liquid Glass → Onyx & Paper

### Key Changes

1. **Color Palette**
   - Warm parchment backgrounds → Pure white (#FFFFFF)
   - Teal/magenta accents → Pure black (#000000)
   - Gradients removed → Solid monochrome
   - All borders → Solid black (1px-2px)

2. **Shapes & Radius**
   - Rounded corners (24px) → Sharp/minimal (0px-4px)
   - Pill buttons → Square buttons with minimal rounding
   - Consistent `rounded-none` or `rounded-sm`

3. **Depth & Shadows**
   - Glass morphism → Solid backgrounds
   - Blur effects → Removed
   - Shadows → None (use borders instead)

4. **Typography**
   - Display font → Bold uppercase tracking-tighter
   - Body text → Inter (same)
   - Metadata → Monospace font required
   - All headers → Uppercase

5. **Interaction States**
   - Color changes → Color inversion
   - Hover lifts → Color inversion (no movement)
   - Shadows → None

6. **Imagery**
   - Color by default → Grayscale by default
   - Hover effects → Grayscale → Color reveal
   - `grayscale hover:grayscale-0 transition-all`

### Implementation Checklist

- [ ] Update color tokens in `src/theme/tokens.ts`
- [ ] Replace rounded-xl with rounded-none or rounded-sm
- [ ] Remove all shadow classes
- [ ] Convert button hover to color inversion
- [ ] Add grayscale filter to images
- [ ] Update typography to uppercase headers
- [ ] Use monospace for metadata
- [ ] Set icon strokeWidth to 1
- [ ] Remove gradient classes
- [ ] Test all interactive states
- [ ] Verify accessibility compliance
- [ ] Update documentation

---

*Design System v2.0 - Onyx & Paper Aesthetic*