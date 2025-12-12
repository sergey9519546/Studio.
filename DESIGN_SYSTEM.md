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

#### 1. Liquid Glass Aesthetic
Our design language is built around "liquid glass" - a modern approach that creates depth through subtle transparency, blur effects, and ambient lighting. This creates a sense of elevation and separation without overwhelming the content.

#### 2. Contextual Intelligence
The design should adapt intelligently to the content and user's workflow. Every interface element should feel purposeful and contribute to the overall user experience.

#### 3. Subtlety Over Flash
We prioritize clear information hierarchy and smooth interactions over flashy animations or overwhelming visual effects.

#### 4. Content-First Design
The design system exists to serve the content and functionality, not the other way around. Every visual decision should enhance comprehension and task completion.

### Design Values

| Value | Description | Application |
|-------|-------------|-------------|
| **Clarity** | Clear information hierarchy and intuitive navigation | Consistent typography scale, clear spacing system |
| **Efficiency** | Fast loading, responsive interactions | Optimized assets, efficient animations |
| **Elegance** | Sophisticated visual language without complexity | Refined color palette, thoughtful micro-interactions |
| **Empowerment** | Tools that enhance user productivity | Contextual UI, smart defaults, keyboard shortcuts |

## Visual Language

### Color Psychology

Our color system is designed to support both functional and emotional needs:

#### Primary Brand Colors
- **Studio Blue (#2463E6)**: Trust, professionalism, AI innovation
- **Success Green (#18C9AE)**: Completion, positive actions, AI insights
- **Warning Amber (#F59E0B)**: Attention, review needed, in-progress states
- **Error Red (#EF4444)**: Critical issues, destructive actions, validation failures

#### Surface Hierarchy
- **App Background (#F5F5F7)**: Creates a calm, spacious canvas
- **Surface Cards (#FFFFFF)**: Clear content containers with subtle elevation
- **Interactive Elements**: Maintain high contrast for accessibility

### Typography System

#### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Type Scale
- **Display**: 36px/2.25rem - Hero sections, major announcements
- **Heading 1**: 30px/1.875rem - Page titles, major section headers
- **Heading 2**: 24px/1.5rem - Section headers, card titles
- **Heading 3**: 20px/1.25rem - Subsection headers
- **Body Large**: 18px/1.125rem - Important body text, lead paragraphs
- **Body**: 16px/1rem - Standard body text
- **Body Small**: 14px/0.875rem - Supporting text, captions
- **Caption**: 12px/0.75rem - Metadata, labels, timestamps

#### Typography Guidelines
- **Line Height**: 1.5x for body text, 1.25x for headings
- **Letter Spacing**: Slightly tight for headings, normal for body
- **Font Weight**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Iconography

#### Icon Principles
- **Consistency**: Unified stroke width (2px) and corner radius
- **Clarity**: Simple, recognizable shapes that work at small sizes
- **Context**: Icons support content, never replace it
- **Accessibility**: Text alternatives provided for all icons

#### Icon Library
- **Lucide React**: Primary icon library for consistency
- **Custom Icons**: Created when specific functionality requires it
- **Icon Sizes**: 16px, 20px, 24px, 32px standard sizes

## Components

### Foundation Components

#### Button
The button component is fundamental to our interaction patterns.

**Variants:**
- **Primary**: Main actions, calls-to-action
- **Secondary**: Alternative actions, less prominent
- **Ghost**: Subtle actions, minimal visual weight
- **Destructive**: Delete, remove, other destructive actions

**States:**
- Default, Hover, Active, Disabled, Loading

**Sizes:**
- Small (32px height), Medium (40px height), Large (48px height)

```css
/* Button Base Styles */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-base) var(--ease-smooth);
  border: 1px solid transparent;
  cursor: pointer;
}

/* Primary Button */
.button--primary {
  background-color: var(--color-primary);
  color: var(--color-ink-inverse);
}

.button--primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-float);
}
```

#### Card
Cards are the primary content container in our system.

**Features:**
- Glass morphism background
- Subtle border and shadow
- Rounded corners for modern feel
- Responsive padding

**Variants:**
- **Default**: Standard content card
- **Elevated**: Higher priority content
- **Interactive**: Cards that respond to hover/click

#### Input Components

**Text Input:**
- Clear visual hierarchy
- Focus states that are accessible
- Error states with helpful messaging
- Placeholder text that doesn't replace labels

**Select/Dropdown:**
- Keyboard navigation support
- Search/filter capability for large lists
- Clear selection indicators

**Checkbox/Radio:**
- Large touch targets (44px minimum)
- Clear checked/unchecked states
- Label association for accessibility

### Navigation Components

#### Sidebar
- Fixed position navigation
- Collapsible sections
- Active state indicators
- Keyboard navigation support

#### Breadcrumbs
- Clear hierarchical navigation
- Truncation handling for long paths
- Clickable segments with proper focus management

#### Tabs
- Horizontal or vertical orientation
- Overflow handling for many tabs
- Keyboard arrow navigation
- Active indicator animations

### Feedback Components

#### Toast/Notification
- Non-intrusive positioning
- Auto-dismiss with manual close option
- Consistent timing and animation
- Priority levels (info, success, warning, error)

#### Loading States
- Skeleton loading for content
- Spinner animations for actions
- Progress indicators for multi-step processes
- Empty states with helpful messaging

#### Modals
- Focus trap for accessibility
- Backdrop blur and transparency
- Multiple size options
- Proper escape key handling

## Layout System

### Grid System

We use a flexible 12-column grid system that adapts to different screen sizes.

```css
.container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 calc(var(--grid-gap) * -0.5);
}

.col {
  flex: 1;
  padding: 0 calc(var(--grid-gap) * 0.5);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .col-sm-12 { flex: 0 0 100%; }
  .col-sm-6 { flex: 0 0 50%; }
  .col-sm-4 { flex: 0 0 33.333%; }
  .col-sm-3 { flex: 0 0 25%; }
}
```

### Spacing System

Based on a 4px base unit for consistency and rhythm.

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
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio
- **UI components**: 3:1 minimum contrast ratio

#### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the application
- Visible focus indicators on all focusable elements
- Skip links for main content areas

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

- [ ] Color contrast ratios meet WCAG standards
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
  --color-primary: #2463E6;
  --spacing-base: 1rem;
  --radius-md: 0.5rem;
}

.dark-theme {
  --color-primary: #3B82F6;
}
```

#### Component Structure
Each component follows a consistent pattern:

```css
/* Component namespace */
.component {
  /* Component-specific styles */
}

.component__element {
  /* Element-specific styles */
}

.component--modifier {
  /* Modifier-specific styles */
}

/* Component states */
.component:is(:hover, :focus) {
  /* Hover/focus styles */
}
```

#### BEM Methodology
Block, Element, Modifier naming convention for CSS classes.

```html
<div class="card card--elevated">
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

#### Logo Variations
- **Horizontal**: For wide spaces, headers
- **Stacked**: For square spaces, social profiles
- **Icon only**: For small spaces, favicons

### Voice & Tone

#### Voice Characteristics
- **Professional**: Expert knowledge without pretension
- **Helpful**: Proactive assistance and clear guidance
- **Innovative**: Forward-thinking AI capabilities
- **Approachable**: Friendly, not intimidating

#### Tone Variations
- **Feature announcements**: Excited, informative
- **Error messages**: Helpful, solution-focused
- **Loading states**: Optimistic, brief
- **Success messages**: Celebratory, clear

### Photography & Imagery

#### Style Guidelines
- **Real people**: Diverse, authentic, professional settings
- **Product shots**: Clean, well-lit, context-relevant
- **Illustrations**: Simple, consistent style matching brand colors
- **Icons**: Outlined style, consistent weight

#### Image Treatment
- Subtle shadows for depth
- Consistent filter treatment for moodboards
- High contrast for accessibility
- Optimized file sizes for performance

## Motion & Animation

### Animation Principles

#### Purposeful Motion
Every animation should serve a functional purpose:
- **Feedback**: Confirm user actions
- **Orientation**: Guide user attention
- **Navigation**: Smooth transitions between states
- **Personality**: Subtle brand expression

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
- **Button hover**: Subtle lift and shadow increase
- **Input focus**: Border color change and gentle glow
- **Card hover**: Elevated shadow and slight scale
- **Icon button**: Scale and color change

#### Page Transitions
- **Slide transitions**: For navigation between pages
- **Fade transitions**: For modal opens/closes
- **Scale transitions**: For dropdowns and popovers

## Dark Mode Support

### Color Adaptation

#### Color Strategy
```css
:root {
  --color-bg: #F5F5F7;
  --color-surface: #FFFFFF;
  --color-text: #1D1D1F;
}

[data-theme="dark"] {
  --color-bg: #1A1A1A;
  --color-surface: #2D2D2D;
  --color-text: #FFFFFF;
}
```

#### Implementation Approach
- **CSS custom properties**: Dynamic color switching
- **System preference detection**: Respect user settings
- **Smooth transitions**: Animated color changes
- **High contrast mode**: Enhanced accessibility

### Dark Mode Considerations

#### Color Adjustments
- **Increased contrast**: Dark backgrounds need lighter text
- **Saturation changes**: Colors appear more vibrant on dark backgrounds
- **Blue light**: Reduce blue light in evening hours
- **Accent colors**: Ensure visibility on dark surfaces

#### Performance
- **CSS variables**: Efficient theme switching
- **Image optimization**: Dark mode image variants
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
- Contribution guidelines for new
