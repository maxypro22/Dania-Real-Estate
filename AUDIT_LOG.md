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

**Commit:** `test: add Vitest harness + characterization tests for SEO + contact handoff`
