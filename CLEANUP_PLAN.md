# Cleanup Plan (Fresh)

**Goals**

- Drive lint to zero (`no-explicit-any`, unused vars, empty object types).
- Replace mocks/simulations with real endpoints or feature flags (no fake data in prod paths).
- Close out dead UI actions (AI panels/dashboards) by wiring to real APIs or visibly disabling.
- Keep generated outputs and build artifacts out of lint scope.

**Findings**

- TODO/FIXME/HACK scan: no actionable matches in source (only helper command in `COMMAND_LINE_FIXES_SUMMARY.md`).
- Remaining verification needed: rerun eslint to confirm all warnings cleared after type fixes.
- Real endpoint audit: AI components (Vision/Document/Audio panels), mock data generators, and any “simulated” storage flows still need explicit backend wiring review.

**Next Actions**

- [ ] Rerun `npm run lint -- --max-warnings=0` to confirm zero warnings after latest fixes.
- [ ] Validate AI UI flows hit real API routes; if backend unavailable, gate the UI instead of mocking responses.
- [ ] Remove/replace any remaining mock generators used at runtime; keep them scoped to tests only.
- [ ] Confirm storage/signing flows use real services or are clearly flagged as disabled (no silent simulation in prod).
- [ ] Add/align types for any new API responses or DTOs uncovered during endpoint wiring.

**Verification**

- [ ] Lint + typecheck.
- [ ] Smoke: Projects dashboard → AI panels → Moodboard → Writer’s room; ensure no dead buttons and no fake responses.
- [ ] If generators emit d.ts with unused symbols, keep eslint disabled in generated folders only (already added).
