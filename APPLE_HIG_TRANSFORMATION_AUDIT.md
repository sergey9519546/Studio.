# Apple HIG Transformation - Phase 1: The Ruthless Audit

**Auditor:** Senior Principal Designer (Apple)  
**Date:** 2026-01-13  
**Target:** Complete UI/UX overhaul following Apple Human Interface Guidelines

---

## I Believe The Purpose Is...

**Core Mission:** Studio Roster is a **creative agency operating system** - a centralized command center for managing projects, talent, creative assets, and AI-driven ideation in a collaborative environment.

**Target User:** Creative agency professionals (Art Directors, Copywriters, Designers) who need clarity, speed, and intuitive navigation across complex creative workflows.

---

## Current State Assessment

### ✅ What's Working

1. **Core Functionality Intact**
   - Routing works correctly (React Router)
   - API integration via hooks (useApiData)
   - Component modularity is present
   - State management via React Context

2. **Data Flow Established**
   - Projects → Moodboard → Writers Room flow
   - Freelancer roster integration
   - Demo data fallback system

3. **Basic Layout Structure**
   - Sidebar + Main content area
   - Grid-based dashboard
   - Responsive breakpoints

---

### ❌ Critical Design System Violations

#### 1. **THEME: Wrong Foundation**

**Issue:** Current `glassmorphism.css` is DARK-MODE CENTRIC

```css
/* Current - Dark mode hardcoded values */
--glass-level-1: rgba(15, 23, 42, 0.4);      /* Dark blue-gray */
--glass-level-2: rgba(15, 23, 42, 0.6);
--glass-level-3: rgba(15, 23, 42, 0.8);
```

**Problem:** This is NOT Apple HIG. Apple uses light, airy backgrounds with subtle depth.

**Fix Required:** Switch to `#F2F2F7` base with System Ultra Thin Material Light

---

#### 2. **MATERIALITY: Wrong Glass Effect**

**Issue:** Current glass uses heavy blur and dark overlays

```css
/* Current - Heavy, dark glass */
background: var(--glass-level-2);
backdrop-filter: blur(24px);  /* Too heavy for light mode */
border: 1px solid rgba(255,255,255,0.1);
```

**Problem:** Apple's "System Ultra Thin Material" uses:
- Frosted glass with luminance injection
- Subtle blur (12-16px, not 24px)
- Light background: `rgba(255, 255, 255, 0.72)`
- Border: `rgba(0, 0, 0, 0.05)` (very subtle)

**Fix Required:** Redefine material system to Apple's exact specifications

---

#### 3. **SHAPE: Missing Squircles**

**Issue:** All corners use standard `rounded-xl`, `rounded-2xl`

```tsx
<div className="rounded-2xl">  {/* Standard rounded corners */}
```

**Problem:** Apple uses **superellipse** (squircle) shape - `border-radius: 20px` with special CSS for iOS devices.

**Fix Required:** Implement squircle utility class with `border-radius: 18px` fallback + `backdrop-filter` for iOS

---

#### 4. **TYPOGRAPHY: No Hierarchy**

**Issue:** Typography uses arbitrary sizes

```tsx
<h1 className="text-lg font-bold">Studio.</h1>
<p className="text-sm font-semibold">Project Context</p>
```

**Problem:** Apple uses semantic **typography ramps**:
- Large Title: 34pt, Bold
- Title 1: 28pt, Bold
- Headline: 17pt, Semibold
- Body: 17pt, Regular
- Footnote: 13pt, Regular
- Caption 1: 12pt, Regular

**Fix Required:** Create typography scale following Apple's exact specifications

---

#### 5. **SIDEBAR: Wrong Width & Material**

**Issue:** Current sidebar has no fixed width or proper material

```tsx
<nav className="app-sidebar">  {/* No width, no Apple glass */}
```

**Problem:** Apple sidebar must be:
- Fixed width: 320px (not fluid)
- System Ultra Thin Material Light
- Full height frosted glass
- Active state: Subtle rounded rectangle fill

**Fix Required:** Complete sidebar redesign

---

#### 6. **LAYOUT: Not Bento Grid**

**Issue:** Current dashboard uses basic grid

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
```

**Problem:** Apple's **Bento Box** requires:
- Fixed widget sizes (Small, Medium, Large, Wide)
- 24pt gutters (not 24px gap)
- Perfect alignment grid
- No borders - material definition creates edges

**Fix Required:** Implement proper Bento Box system

---

#### 7. **WIDGETS: Missing Pro Components**

**Issue:** Current widgets lack polish

**Hero Project Card:** Basic image + text
- **Missing:** Smooth gradient line graph (System Green)
- **Missing:** Subtle X/Y axis labels
- **Missing:** Focus on data curve shape

**Status Widget:** Missing entirely
- **Missing:** Apple Watch activity rings (3 circular progress rings)
- **Missing:** CPU, Memory, Network load visualization

**Data Table:** Basic list
- **Missing:** Pill-shaped colored badges for status
- **Missing:** Rounded rectangle row separation
- **Missing:** Subtle translucent header

**Fix Required:** Implement all 3 Pro widgets with Apple specs

---

#### 8. **COLOR: Overuse of Color**

**Issue:** Large blocks of color, vibrant backgrounds

```tsx
bg-ink-primary
bg-primary
```

**Problem:** Apple HIG principle: **Color is for action and status ONLY**
- Content should be neutral
- System colors (Blue, Green, Orange) sparingly
- No large color blocks

**Fix Required:** Restrained palette, content-first design

---

### 📊 Design System Inconsistencies

| Area | Current State | Apple HIG Requirement |
|-------|--------------|---------------------|
| **Background** | Dark charcoal | Light gray (#F2F2F7) |
| **Glass Material** | Heavy blur, dark | Ultra Thin Light, frosted |
| **Corner Radius** | Standard rounded | Squircle (superellipse) |
| **Sidebar Width** | Fluid | Fixed 320px |
| **Typography** | Arbitrary sizes | Semantic ramps (Large Title → Caption) |
| **Spacing** | `gap-6` (24px) | 24pt gutters |
| **Borders** | Visible borders | Material-defined edges |
| **Shadows** | Dark, harsh | Soft, subtle |

---

### 🎨 Specific Component Issues

#### Sidebar.tsx
```tsx
// ❌ Current
<nav className="app-sidebar">

// ✅ Required
<nav className="apple-sidebar" style={{ width: '320px' }}>
  <div className="sidebar-material">
    {/* Frosted glass background */}
  </div>
</nav>
```

#### glassmorphism.css
```css
/* ❌ Current */
--glass-level-1: rgba(15, 23, 42, 0.4);

/* ✅ Required */
--apple-ultra-thin-light: rgba(255, 255, 255, 0.72);
--apple-blur-light: blur(14px) saturate(180%);
```

#### DashboardHome.tsx
```tsx
// ❌ Current
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

// ✅ Required
<div className="apple-bento-grid" style={{ gap: '24pt' }}>
```

---

## 🔧 Critical Fixes Required

### Priority 1: Material System (Foundation)
1. Create new `apple-hig.css` with light mode base
2. Define System Ultra Thin Material Light
3. Implement squircle utility
4. Create typography scale (Large Title → Caption)

### Priority 2: Sidebar Redesign
1. Fix width to 320px
2. Apply Ultra Thin Material
3. Add proper navigation with SF Symbols
4. Implement active state (rounded rectangle fill)

### Priority 3: Bento Box Layout
1. Define widget sizes (Small, Medium, Large, Wide)
2. Set 24pt gutters
3. Remove borders, let materials define edges
4. Implement perfect alignment grid

### Priority 4: Pro Widgets
1. Hero Widget: Line graph with System Green gradient
2. Status Widget: Activity rings (CPU, Memory, Network)
3. Data Table: Pill badges, rounded rows, translucent header

---

## 📋 Standardization Checklist

- [ ] Background: #F2F2F7
- [ ] Glass: Ultra Thin Light (frosted)
- [ ] Shapes: Squircle (superellipse)
- [ ] Font: SF Pro
- [ ] Typography: Semantic ramps
- [ ] Sidebar: 320px fixed
- [ ] Layout: Bento Box grid
- [ ] Colors: Restrained, action-only
- [ ] Spacing: 24pt gutters
- [ ] Borders: Material-defined

---

## Next Phase: Deep Comprehension

**Task:** Map component hierarchy and data flow to identify friction points in current architecture before proposing revolutionary features.

---

**Status:** ✅ AUDIT COMPLETE  
**Severity:** CRITICAL - Complete redesign required  
**Complexity:** HIGH - Foundation-level changes needed