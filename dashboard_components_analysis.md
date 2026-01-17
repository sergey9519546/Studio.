# Dashboard Components Analysis

Scope: `src/views/DashboardHome.tsx` and the dashboard cards it composes (`DashboardHeader`, `HeroProjectCard`, `SparkAICard`, `VibePaletteCard`, `RecentArtifactsCard`).

## What we inspected
- Data & loading flows: fake hydration for hero project and artifacts in `DashboardHome`, toast lifecycle, accent color propagation via `--dashboard-accent`.
- Interaction & accessibility: keyboard affordances on the artifact grid, AI prompt form semantics, palette selection buttons, notification/new project triggers.
- Resilience: how hero imagery fails, how the grid behaves while loading/empty, and how prompts are validated before dispatch.

## Findings & decisions
- Keep the dashboard accent theme centralized through CSS variables; avoid component-level hard-coding beyond the fallback color.
- The artifact gallery needed explicit `aria-busy`/status messaging plus click targets that are native buttons instead of divs.
- Hero card had no visual fallback on image failure; a gradient placeholder is acceptable to protect readability.
- The Spark AI prompt should trim whitespace and enforce a short, guided input with helper copy and a soft cap.

## Executed changes
- Hardened artifact grid semantics: added live status text, `aria-busy` during loading, and button-based gridcells with preserved keyboard focus styling.
- Added a gradient fallback when hero imagery fails to load so copy remains legible.
- Guarded Spark AI prompts with trimming, a 160-char limit, helper guidance, and live remaining count.
- Enabled `Card` to accept standard div attributes (e.g., `aria-*`, `role`) to support accessible wrappers.
- Added a regression test suite for `RecentArtifactsCard` covering grid roles, callbacks, loading state, and gallery action.

## Verification
- Planned: `npm run test:frontend -- --runInBand` (Vitest, jsdom). Run after dependency install to validate the new dashboard tests.

## Follow-ups (backlog)
- Consider migrating the palette chip styling out of `DashboardHome.css` into component-scoped styles/tokens.
- Wire real data/loading for hero and artifacts once APIs are available; keep `aria-live` messaging aligned with fetched counts.
- Add a11y snapshot for the toast stack (e.g., `aria-live` container tests) if toast volume grows.
