# Design System Migration Guide: Liquid Glass → Onyx & Paper

## Overview

This guide provides practical examples for transforming components from the "Liquid Glass" aesthetic to the "Onyx & Paper" monochrome aesthetic.

## Quick Reference

| Old (Liquid Glass) | New (Onyx & Paper) |
|-------------------|-------------------|
| `rounded-xl` (24px) | `rounded-none` or `rounded-sm` (0-4px) |
| `bg-[#F5F2EC]` (warm parchment) | `bg-[#FFFFFF]` (pure white) |
| `border-[#E1E1DF]` (subtle border) | `border-black` (solid black) |
| `shadow-ambient` | `shadow-none` |
| `backdrop-blur-md` | `backdrop-blur-none` |
| `bg-primary` (teal) | `bg-black` (pure black) |
| `text-primary` (teal) | `text-black` (pure black) |
| `hover:bg-primary/80` | `hover:bg-black hover:text-white` (inversion) |
| `hover:-translate-y-0.5` | `hover:transform-none` (no movement) |
| `grayscale-0` (color) | `grayscale hover:grayscale-0` (B&W by default) |
| Icon `strokeWidth={2}` | Icon `strokeWidth={1}` |

## Component Transformations

### 1. Button Component

#### Before (Liquid Glass)
```tsx
const Button = ({ variant = 'primary', children, ...props }) => (
  <button
    className={cn(
      'px-4 py-2 rounded-xl font-medium transition-all',
      'hover:-translate-y-0.5 hover:shadow-float',
      {
        'bg-primary text-white shadow-ambient': variant === 'primary',
        'bg-surface border border-border-subtle text-ink-primary': variant === 'secondary',
        'bg-transparent text-ink-secondary hover:bg-subtle': variant === 'ghost',
      }
    )}
    {...props}
  >
    {children}
  </button>
);
```

#### After (Onyx & Paper)
```tsx
const Button = ({ variant = 'primary', children, ...props }) => (
  <button
    className={cn(
      'px-4 py-2 rounded-sm font-medium transition-colors',
      'border border-black',
      {
        // Primary: Black background, white text
        'bg-black text-white border-black hover:bg-black': variant === 'primary',
        
        // Secondary: White background, black border, black text
        'bg-white text-black hover:bg-black hover:text-white': variant === 'secondary',
        
        // Ghost: Transparent, black text
        'bg-transparent text-black hover:bg-black hover:text-white': variant === 'ghost',
      }
    )}
    {...props}
  >
    {children}
  </button>
);
```

**Key Changes:**
- ✅ `rounded-xl` → `rounded-sm` (sharp corners)
- ✅ `hover:-translate-y-0.5` removed (no movement)
- ✅ `shadow-ambient` removed (use borders)
- ✅ `bg-primary` → `bg-black` (monochrome)
- ✅ Hover uses color inversion: `hover:bg-black hover:text-white`

---

### 2. Card Component

#### Before (Liquid Glass)
```tsx
const Card = ({ children, interactive = false }) => (
  <div className={cn(
    'rounded-2xl bg-surface shadow-ambient',
    'border border-border-subtle',
    'transition-all duration-300',
    interactive && 'hover:-translate-y-1 hover:shadow-float hover:border-primary/30'
  )}>
    {children}
  </div>
);
```

#### After (Onyx & Paper)
```tsx
const Card = ({ children, interactive = false }) => (
  <div className={cn(
    'rounded-sm bg-white border border-black shadow-none',
    'transition-colors duration-200',
    interactive && 'hover:bg-black hover:text-white hover:border-black'
  )}>
    {children}
  </div>
);
```

**Key Changes:**
- ✅ `rounded-2xl` → `rounded-sm`
- ✅ `bg-surface` → `bg-white`
- ✅ `shadow-ambient` → `shadow-none`
- ✅ `border-border-subtle` → `border-black`
- ✅ Hover uses color inversion instead of lift

---

### 3. Input Component

#### Before (Liquid Glass)
```tsx
const Input = ({ error = false, ...props }) => (
  <input
    className={cn(
      'w-full rounded-[24px] px-4 py-3 text-sm font-medium',
      'bg-subtle border border-border-subtle',
      'outline-none transition-all',
      'focus:ring-2 focus:ring-primary/40 focus:bg-white',
      error && 'border-state-danger focus:ring-state-danger/40'
    )}
    {...props}
  />
);
```

#### After (Onyx & Paper)
```tsx
const Input = ({ error = false, ...props }) => (
  <input
    className={cn(
      'w-full rounded-sm px-4 py-3 text-sm font-medium',
      'bg-white border border-black',
      'outline-none transition-colors',
      'focus:bg-black focus:text-white focus:border-black',
      error && 'border-black bg-[#F0F0F0]'
    )}
    {...props}
  />
);
```

**Key Changes:**
- ✅ `rounded-[24px]` → `rounded-sm`
- ✅ `bg-subtle` → `bg-white`
- ✅ `border-border-subtle` → `border-black`
- ✅ Focus uses color inversion: `focus:bg-black focus:text-white`
- ✅ `ring` removed (no focus rings, use color inversion)
- ✅ Error state uses grayscale: `bg-[#F0F0F0]`

---

### 4. Select/Dropdown Component

#### Before (Liquid Glass)
```tsx
const Select = ({ children, ...props }) => (
  <div className="relative">
    <select
      className={cn(
        'w-full rounded-xl px-4 py-3 text-sm font-medium',
        'bg-subtle border border-border-subtle',
        'outline-none transition-all',
        'focus:ring-2 focus:ring-primary/40 focus:bg-white'
      )}
      {...props}
    >
      {children}
    </select>
  </div>
);
```

#### After (Onyx & Paper)
```tsx
const Select = ({ children, ...props }) => (
  <div className="relative">
    <select
      className={cn(
        'w-full rounded-sm px-4 py-3 text-sm font-medium',
        'bg-white border border-black',
        'outline-none transition-colors',
        'focus:bg-black focus:text-white focus:border-black'
      )}
      {...props}
    >
      {children}
    </select>
  </div>
);
```

**Key Changes:**
- Same as Input component transformation

---

### 5. Modal Component

#### Before (Liquid Glass)
```tsx
const Modal = ({ isOpen, onClose, children }) => (
  <dialog
    open={isOpen}
    className={cn(
      'rounded-3xl bg-surface shadow-2xl',
      'border border-border-subtle',
      'backdrop-blur-md bg-opacity-75'
    )}
  >
    <div className="p-6">
      {children}
    </div>
  </dialog>
);
```

#### After (Onyx & Paper)
```tsx
const Modal = ({ isOpen, onClose, children }) => (
  <dialog
    open={isOpen}
    className={cn(
      'rounded-sm bg-white border border-black shadow-none',
      'backdrop-blur-none'
    )}
  >
    <div className="p-10">
      {children}
    </div>
  </dialog>
);
```

**Key Changes:**
- ✅ `rounded-3xl` → `rounded-sm`
- ✅ `bg-surface` → `bg-white`
- ✅ `shadow-2xl` → `shadow-none`
- ✅ `border-border-subtle` → `border-black`
- ✅ `backdrop-blur-md` → `backdrop-blur-none`
- ✅ `bg-opacity-75` removed (solid colors)

---

### 6. Toast/Notification Component

#### Before (Liquid Glass)
```tsx
const Toast = ({ type = 'info', children }) => (
  <div className={cn(
    'rounded-xl p-4 shadow-ambient',
    'border border-border-subtle',
    'backdrop-blur-md bg-opacity-90',
    {
      'border-state-success/40 bg-state-success/10': type === 'success',
      'border-state-danger/40 bg-state-danger/10': type === 'error',
      'border-state-warning/40 bg-state-warning/10': type === 'warning',
      'bg-white': type === 'info',
    }
  )}>
    {children}
  </div>
);
```

#### After (Onyx & Paper)
```tsx
const Toast = ({ type = 'info', children }) => (
  <div className={cn(
    'rounded-sm p-4 shadow-none',
    'border border-black bg-black text-white',
    'backdrop-blur-none'
  )}>
    {children}
  </div>
);
```

**Key Changes:**
- ✅ All toast types use same monochrome style
- ✅ `bg-black text-white` (high contrast)
- ✅ No colored backgrounds or borders
- ✅ No backdrop blur

---

### 7. Tab Component

#### Before (Liquid Glass)
```tsx
const Tabs = ({ items, activeTab }) => (
  <div className="flex gap-2">
    {items.map((item) => (
      <button
        key={item.id}
        className={cn(
          'px-4 py-2 rounded-xl text-sm font-medium',
          'transition-all',
          activeTab === item.id
            ? 'bg-primary text-white shadow-ambient'
            : 'bg-subtle text-ink-secondary hover:bg-surface hover:text-ink-primary'
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);
```

#### After (Onyx & Paper)
```tsx
const Tabs = ({ items, activeTab }) => (
  <div className="flex gap-0 border-b border-black">
    {items.map((item) => (
      <button
        key={item.id}
        className={cn(
          'px-4 py-2 rounded-none text-sm font-bold uppercase',
          'transition-colors border-t-2',
          activeTab === item.id
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-transparent hover:bg-black hover:text-white'
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);
```

**Key Changes:**
- ✅ Tabs touch borders (`gap-0`)
- ✅ Active tab: Black background, white text
- ✅ Inactive tab: White background, black border
- ✅ Hover: Color inversion
- ✅ `font-bold uppercase` (kinetic typography)

---

### 8. Image/Asset Component

#### Before (Liquid Glass)
```tsx
const AssetImage = ({ src, alt }) => (
  <div className="group relative overflow-hidden rounded-2xl">
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
  </div>
);
```

#### After (Onyx & Paper)
```tsx
const AssetImage = ({ src, alt }) => (
  <div className="group relative overflow-hidden rounded-sm border border-black">
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
  </div>
);
```

**Key Changes:**
- ✅ `grayscale` by default (monochrome aesthetic)
- ✅ `group-hover:grayscale-0` (color revealed on hover)
- ✅ `rounded-2xl` → `rounded-sm`
- ✅ Added `border border-black`
- ✅ No scale transform (use color inversion)

---

### 9. Sidebar Navigation

#### Before (Liquid Glass)
```tsx
const Sidebar = ({ items, activeItem }) => (
  <nav className="bg-surface border-r border-border-subtle">
    {items.map((item) => (
      <button
        key={item.id}
        className={cn(
          'w-full px-6 py-3 text-left transition-all',
          'hover:bg-subtle hover:translate-x-1',
          activeItem === item.id
            ? 'border-l-4 border-primary bg-primary/5 text-primary'
            : 'text-ink-secondary'
        )}
      >
        {item.label}
      </button>
    ))}
  </nav>
);
```

#### After (Onyx & Paper)
```tsx
const Sidebar = ({ items, activeItem }) => (
  <nav className="bg-white border-r border-black">
    {items.map((item) => (
      <button
        key={item.id}
        className={cn(
          'w-full px-6 py-3 text-left transition-colors font-mono text-xs uppercase',
          'border-b border-black',
          activeItem === item.id
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-black hover:text-white'
        )}
      >
        {item.label}
      </button>
    ))}
  </nav>
);
```

**Key Changes:**
- ✅ `bg-surface` → `bg-white`
- ✅ `border-border-subtle` → `border-black`
- ✅ Active item: Black background, white text
- ✅ Inactive item: White background, black text
- ✅ Hover: Color inversion
- ✅ `font-mono text-xs uppercase` for metadata
- ✅ Borders between items (`border-b`)

---

### 10. Checkbox Component

#### Before (Liquid Glass)
```tsx
const Checkbox = ({ checked, onChange, children }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className={cn(
      'w-6 h-6 rounded-lg border-2 transition-all',
      'flex items-center justify-center',
      checked
        ? 'border-primary bg-primary'
        : 'border-border-subtle hover:border-primary'
    )}>
      {checked && <Check size={14} className="text-white" />}
    </div>
    <span className="text-sm font-medium">{children}</span>
  </label>
);
```

#### After (Onyx & Paper)
```tsx
const Checkbox = ({ checked, onChange, children }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className={cn(
      'w-6 h-6 rounded-sm border-2 border-black transition-colors',
      'flex items-center justify-center',
      checked
        ? 'bg-black border-black'
        : 'bg-white border-black hover:bg-black hover:border-black'
    )}>
      {checked && <Check size={14} className="text-white" strokeWidth={2} />}
    </div>
    <span className="text-sm font-medium">{children}</span>
  </label>
);
```

**Key Changes:**
- ✅ `rounded-lg` → `rounded-sm` (square shape)
- ✅ `border-border-subtle` → `border-black`
- ✅ `border-primary` → `border-black`
- ✅ Checked state: Black background with white check
- ✅ Unchecked state: White background with black border
- ✅ Hover: Black background
- ✅ Icon `strokeWidth={2}` for visibility

---

### 11. Loading Spinner

#### Before (Liquid Glass)
```tsx
const Spinner = () => (
  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
);
```

#### After (Onyx & Paper)
```tsx
const Spinner = () => (
  <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-none animate-spin" />
);
```

**Key Changes:**
- ✅ `border-primary/30` → `border-black/20`
- ✅ `border-t-primary` → `border-t-black`
- ✅ `rounded-full` → `rounded-none` (square spinner)

---

### 12. Badge/Tag Component

#### Before (Liquid Glass)
```tsx
const Badge = ({ variant = 'default', children }) => (
  <span className={cn(
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-primary/10 text-primary': variant === 'success',
      'bg-state-warning/10 text-state-warning': variant === 'warning',
      'bg-state-danger/10 text-state-danger': variant === 'danger',
      'bg-subtle text-ink-secondary': variant === 'default',
    }
  )}>
    {children}
  </span>
);
```

#### After (Onyx & Paper)
```tsx
const Badge = ({ variant = 'default', children }) => (
  <span className={cn(
    'px-3 py-1 rounded-none text-xs font-mono uppercase',
    'border border-black transition-colors',
    {
      'bg-black text-white': variant === 'success',
      'bg-black text-white': variant === 'warning',
      'bg-black text-white': variant === 'danger',
      'bg-white text-black': variant === 'default',
    }
  )}>
    {children}
  </span>
);
```

**Key Changes:**
- ✅ All variants use monochrome
- ✅ `rounded-full` → `rounded-none`
- ✅ `font-mono uppercase` for technical feel
- ✅ All use `border border-black`
- ✅ Special variants: Black background, white text
- ✅ Default: White background, black text

---

## Typography Transformations

### Headers

#### Before
```tsx
<h1 className="text-3xl font-bold text-ink-primary">
  Welcome back
</h1>
```

#### After
```tsx
<h1 className="text-3xl font-black uppercase tracking-tighter text-black">
  WELCOME BACK
</h1>
```

### Metadata/Labels

#### Before
```tsx
<span className="text-xs text-ink-tertiary">
  Last updated 2 hours ago
</span>
```

#### After
```tsx
<span className="font-mono text-[11px] uppercase text-gray-600">
  LAST UPDATED 2 HOURS AGO
</span>
```

---

## Icon Transformations

### All Icons

#### Before
```tsx
<Search size={20} className="text-ink-primary" />
<Plus size={24} />
```

#### After
```tsx
<Search size={20} strokeWidth={1} className="text-black" />
<Plus size={24} strokeWidth={1} />
```

**Key Changes:**
- ✅ All icons use `strokeWidth={1}` (thinner, refined)
- ✅ Icon colors: `text-black` or `text-white` (no colorful icons)

---

## Global CSS Transformations

### Tailwind Config Updates

Update your `tailwind.config.js` to reflect the new design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          app: '#FFFFFF',
          surface: '#FFFFFF',
          subtle: '#FAFAFA',
        },
        text: {
          primary: '#000000',
          secondary: '#666666',
          tertiary: '#999999',
        },
        border: {
          DEFAULT: '#000000',
        },
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
      },
      fontFamily: {
        mono: ['SF Mono', 'IBM Plex Mono', 'monospace'],
      },
    },
  },
};
```

---

## Testing Checklist

After transforming components, verify:

- [ ] All borders are solid black (`border-black`)
- [ ] Backgrounds are pure white (`bg-white`) or black (`bg-black`)
- [ ] Rounded corners are `rounded-none` or `rounded-sm` (max 4px)
- [ ] Shadows are removed (`shadow-none`)
- [ ] Blur effects are removed (`backdrop-blur-none`)
- [ ] Icons use `strokeWidth={1}`
- [ ] Images have `grayscale` by default
- [ ] Hover states use color inversion
- [ ] No lift/translate transforms on hover
- [ ] Headers are uppercase with tight tracking
- [ ] Metadata uses monospace font
- [ ] No gradient backgrounds
- [ ] All colors are monochrome (black/white/gray)
- [ ] Accessibility: Color contrast exceeds WCAG AA

---

## Common Pitfalls to Avoid

1. ❌ **Don't use colorful accents** - Everything should be black, white, or gray
2. ❌ **Don't use rounded corners > 4px** - Sharp corners communicate precision
3. ❌ **Don't use shadows** - Borders create structure
4. ❌ **Don't use blur effects** - Solid colors only
5. ❌ **Don't use color changes on hover** - Use color inversion instead
6. ❌ **Don't use lift/translate on hover** - Static position, color inversion
7. ❌ **Don't use images in color by default** - Grayscale by default
8. ❌ **Don't use icon strokeWidth > 1** - Thinner lines look more expensive

---

## Migration Script

Run this script to find components that need updating:

```bash
# Find components with rounded-xl
grep -r "rounded-xl\|rounded-2xl\|rounded-3xl" src/

# Find components with colored backgrounds
grep -r "bg-primary\|bg-teal\|bg-magenta" src/

# Find components with shadows
grep -r "shadow-ambient\|shadow-float\|shadow-2xl" src/

# Find components with blur effects
grep -r "backdrop-blur" src/

# Find components with colorful borders
grep -r "border-primary\|border-teal\|border-border-subtle" src/

# Find components with lift transforms
grep -r "translate-y\|scale-" src/

# Find icons without strokeWidth
grep -r "<.*[A-Z].*.*size=" src/ | grep -v "strokeWidth"
```

---

## Summary

The "Onyx & Paper" aesthetic is defined by:

1. **Monochrome palette**: Black, white, gray only
2. **Sharp corners**: 0px-4px maximum radius
3. **Border-defined structure**: Solid black borders create hierarchy
4. **Color inversion on hover**: White ↔ Black swap
5. **No shadows or blur**: Solid colors only
6. **Grayscale imagery**: B&W by default, color on hover
7. **Kinetic typography**: Uppercase headers, monospace metadata
8. **Thin icon lines**: `strokeWidth={1}`

When in doubt: **Use more black borders and less color.**

---

*Migration Guide v2.0 - Onyx & Paper Aesthetic*