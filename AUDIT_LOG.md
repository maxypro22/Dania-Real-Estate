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

**Commit:** `refactor: make lint pass and gate it in the build` (`bc542ec`)

---

## Batch 3 — Contact popup fallback  [bugfix]  ✅

**Goal:** Never show "success" when the WhatsApp handoff didn't actually open. (Fixes F-009)

**Files changed (one-line reason each):**
- `src/pages/ContactPage.tsx` — capture `window.open`'s return; on `null` (blocked popup) set `blockedUrl` and render a fallback panel with a direct `href={blockedUrl}` "Send via WhatsApp" link + "Back to form", instead of the false success state.
- `src/pages/__tests__/ContactPage.wa.test.tsx` — add the F-009 regression test.

**Fail-before / pass-after (real output):**
- Stashed the source fix, ran the suite against pre-fix code → **regression test FAILED** (`expected null not to be null` — no fallback link rendered), original characterization test still passed.
- Restored the fix, re-ran → **5/5 passed**.

**Checks (real output):** `npx vitest run` → **5 passed** (was 4). `npx tsc -b` → exit 0. `npx eslint .` → exit 0.

**Acceptance:** ✅ Regression test: `window.open` → null ⇒ fallback link shown, success NOT shown; fails before, passes after.

**Definition of Done:** Correct ✅ (null path handled) · Resilient ✅ (user-visible fallback for the silent-failure case) · Typed ✅ · Tested ✅ (regression) · A11y ✅ (real `<a href>`, keyboard-reachable) · Consistent ✅ (matches the success-panel markup + bilingual ternary style) · No new lint ✅.

**Deliberate compromises:** none.
**Noticed, left alone:** the form does no field-format validation beyond `required`/`type=email`/`type=tel` (browser-native) — acceptable for a WhatsApp handoff; out of scope.

**Commit:** `fix: show a direct WhatsApp link when the contact popup is blocked` (`a3670bd`)

---

## Batch 4 — Cut the oversized homepage image weight  [perf]  ✅

**Goal:** Cut the ~9.4 MiB homepage image payload. (Fixes F-001)

**⚠ Plan-premise correction (surfaced, not silently changed):** the audit assumed these four `src/assets` Pexels images render "in area cards ≤400px wide." On inspection the AREAS card render (`HomePage.tsx:375-403`) shows only a badge + name + description — **it never reads `area.img`.** The four images (9.36 MiB) were imported, stored in the data array, bundled into `dist/`, and displayed to **no one**. So the correct remediation is *removal*, not resize+srcset — a strictly smaller, lower-risk change than planned (interrupt condition (b) covers larger/riskier; this is neither), with a better result (9.36 MiB → 0, zero visual change).

**Files changed (one-line reason each):**
- `src/pages/HomePage.tsx` — deleted the 4 dead `@/assets/pexels-*.webp` imports; stripped the unused `img` field from all 16 area entries (both `AREAS_AR` and `AREAS`). `SHOWCASES` imgs (which *are* rendered) untouched.
- `src/assets/pexels-stephen-leonardi-*.webp`, `pexels-mr-location-scout-*.webp`, `pexels-juan-nino-*.webp`, `pexels-athena-*.webp` — deleted (now unreferenced; grep-confirmed only HomePage used them).

**Checks (real output):**
- `npx tsc -b` → exit 0 · `npx eslint .` → exit 0 · `npx vitest run` → 5 passed.
- `npm run build` → exit 0. **dist webp payload:** was ~13.9 MiB (9.36 MiB Pexels + 4.54 MiB hero frames) → now **4.54 MiB** (hero frames only). **Homepage-imported image weight: 9.36 MiB → 0 (−100%),** vs the plan's `< 0.7 MiB` target (exceeded).

**Acceptance:** ✅ Homepage bundled image payload 9.36 MiB → 0 (number pair shown). ✅ Each of the 4 images ≤ ~150 KB (trivially — removed).

**Definition of Done:** Correct ✅ · Performant ✅ (dead weight removed from hot path) · Readable ✅ (dead imports + dead data field gone) · Typed ✅ · No new lint ✅ · Consistent ✅. No regression test — pure removal of never-rendered assets; the build byte-count is the verification.

**Deliberate compromises:** none.
**Noticed, left alone:** if area *thumbnails* are actually wanted in those cards, they should be added deliberately as ~800px optimized images with `width`/`height` — flagged as a follow-up, not invented here. The 120 hero frames (4.54 MiB) are the next target (F-002 / Batch 5).

**Commit:** `perf: drop 9.4 MiB of never-rendered homepage images` (`d007f16`)

---

## Batch 5 — Defer the hero frame sequence  [perf]  ✅

**Goal:** Stop 120 image requests firing on homepage mount. (Fixes F-002)

**Files changed (one-line reason each):**
- `src/components/shared/HeroSequence.tsx` — replaced the eager `FRAMES.forEach(new Image())` (120 immediate requests) with a progressive loader: frame 0 loads immediately (LCP paint), the other 119 load in idle-time batches of 8 via `requestIdleCallback` (setTimeout fallback); under `prefers-reduced-motion` only frame 0 loads. Existing `nearestLoaded()` already draws the closest available frame, so scrubbing is unaffected. Added idle-handle cleanup on unmount.
- `src/components/shared/__tests__/HeroSequence.defer.test.tsx` (new) — regression test.

**Fail-before / pass-after (real output):**
- Stashed the fix, ran the test against the eager source → **FAILED: `expected 120 to be 1`** (120 Images constructed on mount).
- Restored the fix → **passed** (1 Image on mount; the rest scheduled via `requestIdleCallback`).

**Checks (real output):** `npx vitest run` → **6 passed** (was 5). `npx tsc -b` → 0. `npx eslint .` → 0. `npm run build` → exit 0.

**Acceptance:** ✅ On mount with no scroll, only 1 frame request is made (not 120) — asserted by the regression test (via a stubbed 2D canvas context + Image counter).

**Definition of Done:** Correct ✅ (bounds + idempotent `loadFrame`; cleanup cancels the idle handle) · Performant ✅ (first paint no longer contends with 119 requests) · Resilient ✅ (`requestIdleCallback` feature-detected with a `setTimeout` fallback) · Typed ✅ · Tested ✅ (regression) · Consistent ✅.

**Deliberate compromises:** the automated test stubs the 2D canvas context because jsdom has no canvas (the real effect would otherwise bail); it verifies the *scheduling* (1 eager + idle-deferred), not pixel output. Real-browser LCP/network confirmation is a manual step noted for Stage 3.
**Noticed, left alone:** frames load sequentially 0→119 (aligns with top-down scroll); a scroll-position-prioritised loader would be marginally better but adds complexity beyond this batch.

**Commit:** `perf: defer hero frame preloading instead of loading 120 on mount` (`01ce5c9`)

---

## Batch 6 — Add image dimensions (CLS)  [perf/a11y]  ✅

**Goal:** Reserve layout space for all 31 images. (Fixes F-003)

**Files changed (one-line reason each):**
- Added `width`/`height` to **all 31 `<img>`** across 13 files (`AboutPage`, `ApartmentsPage`×4, `ContactPage`, `AreaDetailPage`, `GalleryPage`×7, `FaqPage`, `ShopsPage`, `StaffAccommodationPage`×2, `StudiosPage`×2, `HomePage`×3, `VillasPage`×3, `WhyChooseUsPage`, `Header`, `Footer`, `ListingCard`, `PropertyCard`).
- For `/public` images and the logo, used the **real intrinsic dimensions** (measured with `sharp`: e.g. logo 480×320, hero webps 2000×~1335). For dynamic-src cards (gallery/listing/property/showcase, whose URL varies), used a representative ratio — those already reserve space via their fixed-height/aspect containers, so the attributes are ratio hints.
- `src/__tests__/img-dimensions.test.ts` (new) — regression guard that scans every `<img>` in `src/**` and fails if any lacks `width`/`height`.

**Checks (real output):**
- Custom scan: **31 `<img>` tags, 0 missing dimensions.**
- `npx tsc -b` → 0 · `npx eslint .` → 0 · `npx vitest run` → **8 passed** (was 6; +CLS guard which itself asserts 0 offenders) · `npm run build` → exit 0.

**Acceptance:** ✅ All 31 `<img>` declare dimensions (verified by scan + the new test). ✅ Objects with fixed-height/aspect containers already reserved space; attributes add the intrinsic ratio.

**Definition of Done:** Correct ✅ · Accessible/Responsive ✅ (space reserved → no CLS) · Typed ✅ · Tested ✅ (regression guard prevents recurrence) · Consistent ✅ (attribute order matches existing tags) · No new lint ✅.

**Deliberate compromises:** dynamic-src cards (gallery/listing/property/showcase) use a representative 4:3/3:2 ratio rather than the true per-image dimensions (unknowable at build time for remote/variable sources); CLS is still controlled by their sized containers and `object-cover` ignores the intrinsic ratio there.
**Noticed, left alone:** the `/public` hero webps are ~2000px (appropriate for full-width retina heroes) — not oversized for their render box, so no resize needed here.

**Commit:** `perf: add width/height to all images to prevent layout shift`
