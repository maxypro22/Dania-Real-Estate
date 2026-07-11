# AUDIT_LOG.md — Stage 2 execution log

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT v3 · Stage 2
Safety point: branch `audit/remediation`, baseline commit `3c9d806` (no VCS existed → `git init` + baseline per Rule 8).

---

## Batch 1 — Test harness + characterization tests  [test]  ✅

**Goal:** Stand up Vitest + RTL and pin current behaviour before touching code. (Fixes F-010)

**Baseline (before):** no test runner; `tsc -b` exit 0; `eslint .` red with the 4 known F-005 errors.

**Files changed (one-line reason each):**
- `package.json` — add `vitest`/`@testing-library/*`/`jsdom` devDeps + `test`/`test:watch` scripts.
- `vitest.config.ts` (new) — jsdom env, `@` alias, React plugin, setup file; kept separate from `vite.config.ts` so the prod build is untouched.
- `src/test/setup.ts` (new) — jest-dom matchers + stubs for `IntersectionObserver`/`matchMedia` (jsdom lacks both; shared reveal components call them on mount).
- `src/lib/__tests__/seo.test.ts` (new) — characterizes `resolveSeo` (known route, `/areas/<slug>/`, unknown→home fallback).
- `src/pages/__tests__/ContactPage.wa.test.tsx` (new) — characterizes the WhatsApp lead handoff: renders the real page, fills all fields, asserts the exact `wa.me` URL with every field URL-encoded.

**New dependencies (pre-flagged in plan, approved via `FIX`):** vitest ^3, @testing-library/react ^16, @testing-library/jest-dom ^6, jsdom ^25. `npm audit`: 0 vulnerabilities.

**Checks (real output):**
- `npx vitest run` → **2 files, 4 tests passed**.
- `npx tsc -b` → **exit 0**.
- `npx eslint .` → 4 errors, 1 warning — **all pre-existing (F-005)**, none introduced by this batch.

**Acceptance:** ✅ `vitest run` green; both characterization suites assert real current output.

**Definition of Done:** Correct ✅ · Typed ✅ (tsc 0) · Tested ✅ (this batch IS the harness) · Readable ✅ · Consistent ✅ · No new lint ✅. Observability/Perf/A11y — N/A (test-only, no runtime surface).

**Deliberate compromises:** none.
**Noticed, left alone:** the 4 F-005 lint errors (Batch 2); component tests query by stable `#id` rather than translated label text (intentional — resilient to copy changes).

**Commit:** `test: add Vitest harness + characterization tests for SEO + contact handoff` (`5c30e72`)

---

## Batch 2 — Lint green + wire lint into the gate  [chore/refactor]  ✅

**Goal:** Zero lint errors and lint enforced by the build. (Fixes F-005)

**Baseline (before):** `eslint .` = 4 errors + 1 warning; `build` = `tsc -b && vite build` (lint never invoked).

**Files changed (one-line reason each):**
- `src/components/shared/seo-context.ts` (new) — houses `SeoExtraContext`/`SeoExtraProvider`/`usePageSchema` so `Seo.tsx` can be component-only.
- `src/components/shared/Seo.tsx` — removed the context/provider/hook (and now-unused `createContext`/`useContext` imports); added a justified `exhaustive-deps` disable on the `ldKey` effect. Now exports only the `<Seo>` component → clears both `react-refresh` errors.
- `src/components/layout/Layout.tsx` — import `SeoExtraProvider` from `seo-context`.
- 8 pages (`AreaDetail`, `Apartments`, `Contact`, `Faq`, `Studios`, `Villas`, `Shops`, `StaffAccommodation`) — import `usePageSchema` from `seo-context`.
- `src/pages/StaffAccommodationPage.tsx` — deleted the dead `staffMainFaqs` data array (26 lines, never rendered — real FAQ data comes from i18n) and its stale comment header; retyped `FaqAccordion` prop as `Array<{ q: string; a: string }>` → clears the `no-unused-vars` error.
- `src/components/layout/Header.tsx` — justified `set-state-in-effect` disable on the close-menus-on-route-change effect (legitimate router→UI sync, no render-derived equivalent).
- `package.json` — `build` now `tsc -b && eslint . && vite build`; lint is gated.

**Checks (real output):**
- `npx eslint .` → **0 problems (0 errors, 0 warnings)** — was 4 errors + 1 warning.
- `npx tsc -b` → **exit 0**.
- `npx vitest run` → **4 tests passed** (Batch 1 characterization still green → refactor behaviour-preserving).
- `npm run build` → **exit 0**, lint now runs inside the gate; bundle built (index 293.65 kB / gzip 83.52 kB).

**Acceptance:** ✅ `npm run lint` exits 0. ✅ `npm run build` runs lint and fails on any error.

**Definition of Done:** Correct ✅ · Typed ✅ · Tested ✅ (characterization proves the SEO hook move is behaviour-preserving) · Readable ✅ (dead code + stale comment gone) · Consistent ✅ (reused the repo's existing justified-disable pattern) · No new warnings ✅.

**Deliberate compromises:** the two `eslint-disable` lines (Header effect, Seo deps) are justified in-code rather than refactored away — both are correct-as-written patterns the rule flags conservatively; a full refactor would be behaviour-risk outside this batch's scope.
**Noticed, left alone:** the 2.5k-LOC page files and duplicated `_AR`/`EN` arrays (out of scope per plan).

**Commit:** `refactor: make lint pass and gate it in the build`
