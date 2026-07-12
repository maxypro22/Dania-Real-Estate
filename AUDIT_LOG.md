# AUDIT_LOG.md — Stage 2 Execution

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT v3 · Branch: `audit/remediation`
Plan: `AUDIT_AND_PLAN.md`. Baseline this session: `npx vitest run` → **11 passed**; `npm run build` → clean.

**Operator decisions:** `FIX` given without answers to Q1–Q6. Applied defaults: **Q1** = `+974 3326 0393` is the correct number (used in 6 places), header's `+974 4444 0085` replaced (flagged for confirmation). **Deferred for lack of an answer/dependency:** Q2 (prerender dep → Batch 8), Q3/Q4 (listing content + privacy text → Batch 7), Q5 (real hours → F-016 part of Batch 2), Q6 (error-tracker dep → Batch 10).

---

## Batch 1 — Test-harness top-up  [test]

**Files changed**
- `src/lib/asArray.ts` (new) — safe `returnObjects` coercion helper (precondition for Batch 3).
- `src/lib/__tests__/asArray.test.ts` (new) — proves `asArray('key') === []` (the i18next missing-key failure mode) and array passthrough.

**Checks:** `npx vitest run` → before **11 passed** → after **14 passed** (+3). Build gate unaffected.

**Acceptance:** ✅ helper + tests run in the suite; the string→[] behavior that guards F-003 is locked in.

**Definition of Done:** Correct ✅ · Typed ✅ · Tested ✅ · Readable ✅ · comment explains *why* ✅.

**Deliberate compromises:** none.

**Commit:** `83508b7`

---

## Batch 2 — Single source of truth: phone + tel:  [bugfix]

Fixes **F-001** (header advertised `+974 4444 0085` vs `+974 3326 0393` everywhere else) and **F-017** (footer `tel:` contained spaces). **F-016 (hours) DEFERRED** — no answer to Q5 (real hours unknown).

**Files changed**
- `src/components/layout/Header.tsx:233-237` — top-bar number now `company.phone`; `tel:` href space-stripped (matches ContactPage). Retired the hardcoded `+974 4444 0085`.
- `src/components/layout/Footer.tsx:109` — `tel:` href space-stripped.
- `src/test/setup.ts` — added a `ResizeObserver` stub (jsdom lacks it; Header mounts one).
- `src/components/layout/__tests__/phone-consistency.test.tsx` (new) — regression: Header shows `company.phone`, the old number is gone, every `tel:` equals `tel:+97433260393` (no whitespace); Footer likewise.

**Checks:** `npx vitest run` → **16 passed** (was 14). `npm run build` → clean. `grep 4444 0085 src/` → none.

**Acceptance:** ✅ one phone number sitewide; regression test was red before the Header edit (wrong number present), green after.

**Definition of Done:** Correct ✅ · Tested (regression) ✅ · Typed/Linted ✅ (build green) · Readable ✅ · Consistent ✅.

**Deliberate compromises:** **Q1 assumption** — `+974 3326 0393` taken as correct (used in 6 places) and `+974 4444 0085` retired. If `4444 0085` is a real office landline, it must be re-added (in `company`, labeled) — flagged in the final report.

**Things noticed, left alone:** hours copy still inconsistent (F-016) — deferred to Q5.

**Commit:** `6d3f9d8`

---

## Batch 3 — Resilience: error boundary + safe returnObjects  [bugfix]

Fixes **F-003** (no error boundary + unguarded `returnObjects` maps → whole-app white-screen), **F-018** (HomePage FAQ answers clipped to 192px). **F-015 mitigated** (see compromises).

**Files changed**
- `src/components/shared/ErrorBoundary.tsx` (new) — class boundary; `getDerivedStateFromError` → on-brand recovery panel (`role="alert"`, reload/home). `componentDidCatch` logs to console (F-019/Batch 10 will wire a reporter).
- `src/components/layout/Layout.tsx` — wraps `<Outlet/>` in `<ErrorBoundary key={pathname}>` so a crash on one route clears on navigation.
- `src/lib/asArray.ts` — now consumed by the flagged crash sites.
- `HomePage.tsx` (:61,147,148 via asArray; :591 `max-h-48`→`max-h-[1000px]`), `StudiosPage.tsx` (tTrust now `asArray` over both branches — fixes the length-only guard that a string passes), `ShopsPage.tsx` (shopFaqs ×2, shops.trust inline map), `StaffAccommodationPage.tsx` (mainFaqs ×2, staff.trust inline map), `ApartmentsPage.tsx` (all/oneBed/twoBed/threeBed `trust` string[] maps).
- `src/components/shared/__tests__/ErrorBoundary.test.tsx` (new) — throwing child → recovery panel; normal child → passthrough.

**Checks:** `npm run build` → clean. `npx vitest run` → **18 passed** (was 16, +2 boundary).

**Acceptance:** ✅ a child that throws renders the fallback, not a blank page (test proves it). ✅ the enumerated fragile `returnObjects` sites can no longer throw on a missing key. ✅ FAQ answers no longer clip at 192px.

**Definition of Done:** Correct ✅ · Resilient ✅ (graceful degradation) · Tested ✅ · Typed/Linted ✅ · Observable (console for now) ✅.

**Deliberate compromises:**
- **asArray adoption is targeted, not exhaustive.** The boundary is the blanket protection for all ~50 `returnObjects` reads; `asArray` was applied to the specific sites the audit flagged as crash risks (HomePage, StudiosPage, ShopsPage, StaffAccommodationPage, ApartmentsPage trust arrays). Wrapping the remaining reads (AboutPage, WhyChooseUsPage, VillasPage, GalleryPage, ContactPage) is a mechanical follow-up; they are boundary-protected in the meantime.
- **F-015 (index-coupled parallel arrays) mitigated, not fully guarded.** A `to={undefined}`/`<Icon/>` throw is now caught by the boundary (fallback, not white-screen). Per-site guards remain a follow-up; safe today since lengths match.

**Commit:** `c4e518d`

---

## Batch 4 — Accessibility pass  [bugfix]

Fixes **F-002** (skip-link), **F-006** (accordion state + keyboard operability), **F-007** (heading hierarchy), **F-011** (mobile menu).

**Files changed**
- `src/components/layout/Layout.tsx` — bilingual skip link (`sr-only` → visible on focus) as first focusable element; `<main id="main-content">`; `useTranslation` for the label.
- `src/components/layout/Header.tsx` — mobile menu is now `<nav id="mobile-menu" aria-label>`; toggle has `aria-controls="mobile-menu"`; **Escape** closes it; submenu chevron labels i18n'd (`Collapse`/`Expand` → AR/EN).
- `src/pages/{Apartments,Shops,Villas,StaffAccommodation}Page.tsx` — FAQ accordion buttons gain `aria-expanded` (StudiosPage already had it).
- `src/pages/{Areas,Apartments,Shops,AreaDetail,StaffAccommodation}Page.tsx` — 6 hero subtitles `<h3>`→`<p>` (no more h1→h3 skip; Staff has two).
- `src/pages/HomePage.tsx` — desktop showcase panel expands `onFocus` so a keyboard user reaching its inner link makes it visible/usable.
- `src/pages/AreasPage.tsx` — Qatar-map pins are `role="button" tabIndex=0` with `aria-label`, `onFocus`, and Enter/Space `onKeyDown`.
- `src/components/layout/__tests__/a11y-landmarks.test.tsx` (new) — asserts the skip link targets `main#main-content`.

**Checks:** `npm run build` → clean. `npx vitest run` → **19 passed** (was 18).

**Acceptance:** ✅ first Tab reaches "Skip to content" → jumps to `#main-content`. ✅ all FAQ accordions announce expanded/collapsed. ✅ no h1→h3 skips on the fixed pages. ✅ mobile menu is a nav landmark, closes on Escape, labels localized. ✅ map pins keyboard-operable.

**Definition of Done:** Correct ✅ · Accessible ✅ (2.4.1, 4.1.2, 1.3.1, 2.1.1 addressed) · Tested (skip-link) ✅ · Typed/Linted ✅ · Consistent ✅.

**Deliberate compromises:**
- **Accordion a11y added in-place, not via a shared component.** Adding `aria-expanded` to each existing accordion is a zero-visual-risk fix; extracting one shared `<Accordion>` (and adding `aria-controls`/`role="region"`) stays with the F-012 refactor (Batch 9) to avoid mixing an a11y fix with a structural change.
- **Mobile menu: no full focus-trap.** Landmark + Escape + `aria-controls` shipped; trapping/returning focus is a further enhancement, logged as residual.

**Commit:** `80eabdf`

---

## Batch 5 — Security: enforce CSP  [security]

Fixes **F-005** (CSP was `-Report-Only` with no reporting endpoint — a no-op).

**Static verification before promoting:** inspected `dist/index.html` — it contains **no inline `<script>`** (only one external `type="module" src="/assets/…"`), so `script-src 'self'` won't break boot. JSON-LD is `type="application/ld+json"` (data, not executed → unaffected by `script-src`). Inline `style={}`/Tailwind covered by `style-src 'unsafe-inline'`. The contact form uses `window.open`, not a form POST, so `form-action 'self'` is fine.

**Files changed**
- `vercel.json` — `Content-Security-Policy-Report-Only` → **`Content-Security-Policy`** (same policy, now enforced).
- `src/__tests__/csp-header.test.ts` — now asserts the header is enforcing and the report-only key is absent.

**Checks:** `npx vitest run` (csp) → **3 passed**. `npm run build` → clean (below).

**Acceptance:** ✅ response will carry an enforcing CSP; policy matches the site's real resource usage (verified against the build output).

**Definition of Done:** Secure ✅ (real enforcement) · Tested ✅ · Documented (this entry) ✅.

**Deliberate compromises:** **No `report-uri`/`report-to` wired** — that needs a collector endpoint (ties to Q6/observability, Batch 10, deferred). Enforcement (the substance of F-005) shipped; reporting is a follow-up. **Needs live verification** — browser CSP enforcement can't be exercised in this env; added to the 48h watch list (load the deployed site, confirm no console CSP violations and the page renders/JSON-LD injects).

**Commit:** `568dab4`

---

## Batch 6 — Performance: gate the hero frame preload  [perf]

Partially fixes **F-010** (hero shipped ~4.9 MB of frames to every visitor).

**Files changed**
- `src/components/shared/HeroSequence.tsx` — new `shouldSkipHeavyPreload()` (reads `navigator.connection.saveData`/`effectiveType` at mount). When Save-Data is on or the link is 2G-class, the 119-frame sequence is not preloaded; the hero stays on frame 0 (static), same graceful path as reduced-motion.
- `src/components/shared/__tests__/HeroSequence.defer.test.tsx` — added a Save-Data regression: with idle running synchronously, only frame 0 (1 `Image`) is created.

**Checks:** `npm run build` → clean. `npx vitest run` → **20 passed** (was 19).

**Acceptance:** ✅ on Save-Data/2G, only frame 0 is fetched (test-proven); on normal links the animation is unchanged.

**Definition of Done:** Performant ✅ (metered users spared ~4.9 MB) · Correct ✅ (frame 0 LCP intact) · Tested ✅ · Resilient ✅ (degrades like reduced-motion).

**Deliberate compromises:** **Responsive `srcset`/`sizes` and recompression of the >300 KB public images (F-010 remainder) NOT done** — recompression needs visual sign-off (marketing imagery), and srcset needs generated width variants; deferred to a follow-up so this batch stays zero-visual-risk. Normal-connection visitors still download the full frame set (the intended cinematic hero); reducing frame count is a visual/product decision.

**Commit:** `6fb9e66`

---

## Batch 9 (partial) — Dead code + encoding  [refactor/chore]

Fixes **F-013** (dead component subtree) and **F-014** (mojibake). **F-012 (large extraction) DEFERRED** — XL, needs its own focused pass with characterization tests; boundary/scope risk too high to bundle here.

**Files changed**
- Deleted (grep-verified unused — only referenced each other): `src/components/shared/ListingCard.tsx`, `PropertyCard.tsx`, `SearchBar.tsx`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx` (the `ui/` dir is now gone).
- `src/index.css` — removed the now-orphaned `@keyframes border-spin` (only ListingCard used it).
- `CLAUDE.md` — component-layers + interaction-patterns updated to match reality (cards render inline per page; removed the deleted primitives and the border-spin note).
- `src/pages/{Villas,StaffAccommodation,Studios}Page.tsx` — normalized 2,207 corrupted mojibake chars in comment separators back to clean ASCII `===`/`---` (comments only; no code/Arabic content touched — verified `â/گ/€` count = 0 after, build green).

**Checks:** `npm run build` → clean. `npx vitest run` → **20 passed**. `cn()` (utils.ts) still used by LanguageSwitcher — kept.

**Acceptance:** ✅ no dead ListingCard/PropertyCard/SearchBar/ui primitives; ✅ no mojibake remains; ✅ build/tests green.

**Definition of Done:** Readable ✅ (no dead code, clean separators) · Documented ✅ (CLAUDE.md synced) · Consistent ✅.

**Deliberate compromises / left alone:**
- **F-012 extraction (FaqAccordion ×5, CTA ×5, area grid ×7, ~1,840-line AREA_DETAIL, inline bilingual copy) NOT done** — the dominant maintainability item, deferred as XL per the plan.
- **`class-variance-authority` is now an unused dependency** — left in `package.json` to avoid lockfile churn in this batch; trivial follow-up to remove.

**Commit:** `deadcode` below.
