# ESM Loader Error Fix Implementation

## Problem Analysis
The application is failing with ESM loader errors due to missing `.js` extensions in import statements. Node.js ESM requires explicit file extensions for relative imports when using file:// URLs.

## Current Status
- Identified the root cause: Missing `.js` extensions in import statements
- Analyzed the codebase: Found mixed usage of `.js` and bare imports
- Updated `common.module.ts` to include `.js` extension
- Automated fix applied for `jwt-auth.guard` imports; broader pass still pending

## Implementation Plan

### Phase 1: Import Resolution Strategy
- [x] 1.1 Create a script to automatically add .js extensions to relative imports (`fix-esm-imports-v2.js`)
- [x] 1.2 Fix `jwt-auth.guard` imports in `apps/api/src/**`
- [ ] 1.3 Run the script across remaining imports (as needed)
- [ ] 1.4 Rebuild the application
- [ ] 1.5 Test the fix

### Phase 2: Alternative Approach (if needed)
- [ ] 2.1 Consider switching to CommonJS module system
- [ ] 2.2 Update TypeScript configuration
- [ ] 2.3 Test with CommonJS

### Phase 3: Validation
- [ ] 3.1 Run build process successfully
- [ ] 3.2 Start the application without ESM loader errors
- [ ] 3.3 Verify all modules load correctly

## Next Steps
- Decide whether to run `fix-esm-imports-v2.js` across all relative imports
- Rebuild the API and run it to confirm the loader error is resolved
