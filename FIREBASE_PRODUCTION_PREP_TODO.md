# Firebase Production Deployment Preparation Checklist

## Project Analysis & Setup
- [ ] Review current Firebase project linkage (`.firebaserc`, firebase.json) and confirm target project ID for prod
- [ ] Inspect existing deployment scripts (`deploy-production.sh`, `deploy.ps1`, `deploy.sh`, `deploy-hosting`, `nx` targets) and align on one prod path
- [ ] Inventory security rules (Firestore, Storage) and hosting headers for prod suitability
- [ ] Verify environment configs (`.env.production`, `.env`, build/apps/api env) are present and secrets resolved
- [ ] Audit build/deploy dependencies in package.json; ensure firebase-tools version is pinned if used in CI

## Environment & Configuration
- [ ] Populate `.env.production` with prod API keys, DB URLs, and Firebase keys; avoid local-only values
- [ ] Set `firebase use <prod-project>` and verify `.firebaserc` default target
- [ ] Update `firebase.json` hosting config (public dir, rewrites to SPA entry, headers, caching)
- [ ] Confirm hosting site and channel for prod; decide on preview channels for staging
- [ ] Verify custom domain mapping and SSL status in Firebase Hosting

## Security & Rules
- [ ] Review `firestore.rules` for least-privilege and prod indexes; run `firebase deploy --only firestore:rules --dry-run` (or equivalent)
- [ ] Review `storage.rules` for upload/download permissions and signed URL usage
- [ ] Confirm auth providers enabled match prod needs; disable unused providers
- [ ] Ensure API endpoints (if proxied) enforce auth/role checks; align with Hosting rewrites
- [ ] Re-check `.firebaserc` targets for accidental multi-project deploys

## Build & Optimization
- [ ] Validate production build commands (e.g., `npm run build:client`, `npm run build:api`) and outputs
- [ ] Ensure server build artifacts land in `build/apps/api` and client assets in `dist`
- [ ] Add/build-time lint/type checks to CI (eslint, tsc) before deploy
- [ ] Audit bundle size (Vite stats) and tree-shake unused deps
- [ ] Set caching headers in `firebase.json` (immutable for hashed assets, shorter for HTML/API)

## Testing & Validation
- [ ] Dry-run deploy to staging/preview channel; verify rewrites and 404 handling
- [ ] Run production build locally (`npm run build`) and serve to validate routes/assets
- [ ] Exercise Firebase services: auth flows, Firestore CRUD, Storage upload/download, any callable functions
- [ ] Basic performance check (Lighthouse/Pagespeed) on preview
- [ ] Security smoke: confirm rules reject unauthorized access; ensure environment vars not leaked to client

## Deployment Execution
- [ ] Final preflight: env set, rules validated, build succeeds, target confirmed
- [ ] Deploy Hosting + rules (or full suite) to prod project
- [ ] Verify deploy: check Hosting version, inspect prod site for errors in console/network
- [ ] Run live smoke test of critical flows (auth, CRUD, uploads)
- [ ] Enable/inspect monitoring: Firebase dashboard, error logs, real-time DB/Firestore metrics

## Documentation & Maintenance
- [ ] Update deployment docs with exact commands, targets, env keys, and rollback steps
- [ ] Configure alerts (quota, errors) and uptime monitoring for prod endpoint
- [ ] Document rollback: `firebase hosting:rollback`, redeploy previous release, or switch channel
- [ ] Record environment-specific config and secrets ownership (who updates/where stored)
