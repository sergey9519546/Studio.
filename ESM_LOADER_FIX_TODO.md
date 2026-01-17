# ESM Loader Error Fix Plan

## Problem
ESM loader error when importing `jwt-auth.guard` from `common.module.js`:
```
Error: Cannot find module 'C:\Users\serge\OneDrive\Documents\Sergey-Avetisyan-main\build\apps\api\src\common\guards\jwt-auth.guard'
imported from C:\Users\serge\OneDrive\Documents\Sergey-Avetisyan-main\build\apps\api\src\common\guards\common.module.js
```

## Root Cause
ESM modules require explicit file extensions when using file:// URLs. The import statement `import { JwtAuthGuard } from './jwt-auth.guard';` in the compiled JavaScript needs the `.js` extension for proper ESM resolution.

## Steps to Fix

- [x] 1. Check package.json for ESM configuration (`build/apps/api/package.json` uses `"type": "module"`)
- [x] 2. Examine TypeScript configuration for module resolution (root `tsconfig.json` uses `moduleResolution: bundler`)
- [x] 3. Review Nx build configuration (build output keeps ESM imports without extensions)
- [x] 4. Fix import paths with proper extensions (`jwt-auth.guard.js` added to all imports)
- [ ] 5. Rebuild the application
- [ ] 6. Test the fix

## Expected Solution
Add proper ESM module resolution configuration or fix import paths to include .js extensions.

## Changes Applied
- Updated all `jwt-auth.guard` imports in `apps/api/src/**` to include `.js` so compiled ESM resolves correctly.
- Confirmed build artifacts already present at `build/apps/api/src/common/guards/jwt-auth.guard.js`.

## Next Actions
- Rebuild the API (`nx build api` or project script).
- Run a quick smoke test of the built server to confirm the loader error is resolved.
