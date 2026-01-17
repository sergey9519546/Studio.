# Cumulative Layout Shift (CLS) Optimization Guide

## Overview
This document outlines the CLS optimizations implemented in Studio Roster to improve Core Web Vitals and user experience.

## What is CLS?
Cumulative Layout Shift (CLS) measures visual stability. It quantifies how much unexpected layout shift occurs during the page lifecycle. A good CLS score is below 0.1.

## Implemented Optimizations

### 1. Image Optimization
**Problem**: Images without dimensions cause layout shifts when they load.

**Solutions Implemented**:
- Added explicit `width` and `height` attributes to all images
- Implemented `loading="lazy"` for below-the-fold images
- Implemented `loading="eager"` for above-the-fold images (hero images, avatars)
- Created `ImageWithPlaceholder` component for consistent image loading

**Example Usage**:
```tsx
import ImageWithPlaceholder from './components/ui/ImageWithPlaceholder';

<ImageWithPlaceholder
  src={user.avatar}
  alt={user.name}
  width="64"
  height="64"
  aspectRatio="square"
  loading="eager"
/>
```

### 2. Font Loading Optimization
**Problem**: Web fonts loading can cause FOUT (Flash of Unstyled Text) and layout shifts.

**Solutions Implemented**:
- Added font preconnect hints in HTML
- Defined fallback fonts in CSS
- Added critical CSS for font-family before external stylesheets load

**Files Modified**:
- `index.html`: Added preconnect and fallback font definitions

### 3. Fixed Dimensions for Dynamic Elements
**Problem**: Elements without fixed dimensions shift when content loads.

**Solutions Implemented**:
- Fixed dimensions for floating action button
- Fixed dimensions for chat window
- Reserved space for loading spinners
- Added skeleton loaders with fixed dimensions

**Files Modified**:
- `components/Layout.tsx`: Fixed FAB and chat window positioning
- `App.tsx`: Added fixed dimensions to loading spinner

### 4. Aspect Ratio Containers
**Problem**: Dynamic content without aspect ratios causes shifts.

**Solutions Implemented**:
- Created `AspectRatioBox` component
- Added CSS aspect-ratio utilities
- Applied aspect ratios to image containers

**Example Usage**:
```tsx
import AspectRatioBox from './components/ui/AspectRatioBox';

<AspectRatioBox ratio="video">
  <img src={thumbnail} alt="Video thumbnail" />
</AspectRatioBox>
```

### 5. CSS Improvements
**Problem**: Missing base styles and utilities for CLS prevention.

**Solutions Implemented**:
- Added base image styles to prevent overflow
- Added skeleton loading utilities
- Added aspect-ratio utilities
- Added transform-gpu for hardware acceleration

**Files Modified**:
- `src/index.css`: Added comprehensive CLS prevention utilities
- `index.html`: Added critical CSS

### 6. Build Optimization
**Problem**: Large bundle sizes and poor code splitting can delay rendering.

**Solutions Implemented**:
- Enabled minification in production
- Improved code splitting strategy
- Enabled CSS code splitting
- Added terser compression

**Files Modified**:
- `vite.config.ts`: Updated build configuration

## Best Practices Going Forward

### For Images
1. Always specify `width` and `height` attributes
2. Use `loading="lazy"` for below-the-fold images
3. Use `loading="eager"` for critical above-the-fold images
4. Wrap images in aspect ratio containers when dimensions are unknown
5. Use `ImageWithPlaceholder` component for consistent UX

### For Dynamic Content
1. Reserve space with skeleton loaders
2. Use fixed dimensions when possible
3. Avoid injecting content above existing content
4. Use CSS `content-visibility: auto` for long lists

### For Fonts
1. Use system fonts as fallbacks
2. Preload critical fonts
3. Use `font-display: swap` for web fonts
4. Define font-family in critical CSS

### For Animations
1. Use `transform` and `opacity` for animations (GPU-accelerated)
2. Avoid animating `width`, `height`, `top`, `left`
3. Use `will-change` sparingly and only when needed
4. Add `transform: translateZ(0)` for hardware acceleration

## Testing CLS

### Local Testing
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run Performance audit
4. Check CLS score in Core Web Vitals

### Production Testing
1. Use Google PageSpeed Insights: https://pagespeed.web.dev/
2. Use Chrome User Experience Report
3. Monitor Real User Monitoring (RUM) data

## Monitoring

### Key Metrics to Track
- CLS score (target: < 0.1)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)

### Tools
- Google PageSpeed Insights
- Chrome DevTools Lighthouse
- WebPageTest
- Google Search Console (Core Web Vitals report)

## Component Checklist

When creating new components, ensure:
- [ ] Images have explicit dimensions
- [ ] Lazy loading is configured appropriately
- [ ] Skeleton loaders are used for async content
- [ ] Fixed dimensions for containers
- [ ] Aspect ratios defined for media
- [ ] No content injection above existing content
- [ ] Animations use transform/opacity only

## Resources
- [Web.dev CLS Guide](https://web.dev/cls/)
- [Chrome DevTools CLS Debugging](https://web.dev/debug-layout-shifts/)
- [Optimize Web Vitals](https://web.dev/vitals/)