# AUDIT_AND_PLAN.md — Dania Real Estate

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT **v3** · Stage 1 (read-only)
Date: 2026-07-11 · Independent pass — pre-existing `AUDIT_REPORT.md` / `AUDIT_AFTER.md` treated as **claims**; every number below was re-checked this session by re-running the real commands (`eslint .`, on-disk asset measurement) and re-reading the cited source.
Priority (operator left blank → default): **security > correctness > maintainability > performance**
Supersedes the v2.1 `AUDIT_REPORT.md`.

---

## SCORE TABLE (Before)

| Area | | Before | Weight | Basis (verified) |
|---|---|:---:|:---:|---|
| Security | S | 7 | 3 | 5 headers, **no CSP**; no server input to inject; unpinned deps |
| Errors/Robustness | E | 7 | 3 | No silent catches; contact popup shows success even if blocked (F-009) |
| Clean Code | C | 5 | 2 | **Lint red (4 errors)**, dead code, 2.5k-LOC pages, no VCS |
| Performance | P | 3 | 2 | ~14 MB homepage image payload; 120 frames eager-preloaded |
| Images/Assets | IMG | 2 | 1.5 | 9.36 MiB of oversized imports into ≤400px cards |
| Accessibility | A11Y | 7 | 1.5 | Labels, real `<h1>`, RTL correct; no skip-link |
| Responsive | R | 6 | 1 | Tailwind responsive, but no `width`/`height` on 31 imgs → CLS |
| SEO | SEO | 7 | 1 | robots/sitemap/canonical good; OG/Twitter client-injected only |
| Testing | T | 0 | 2 | No runner, zero tests → mandated FAIL |
| Content/Release | CR | 6 | 1 | No Lorem Ipsum; but ~30 stock placeholder images hotlinked |
| Load/Stress | LT | — | — | N/A — no server request path (static SPA) |

**OVERALL = (7·3 + 7·3 + 5·2 + 3·2 + 2·1.5 + 7·1.5 + 6·1 + 7·1 + 0·2 + 6·1) / 18 = 90.5 / 18 = `5.0`**

**Plain-language verdict:** The site is safe — nothing can be hacked and no data can be lost, because there is no server or database. But the homepage secretly loads about **14 MB of oversized images** (≈4× what the previous report claimed it had fixed), there are **zero automated tests**, and the code-quality check (`lint`) is failing and isn't wired into the build.

**Deploy verdict: `SAFE WITH CAVEATS`** — it will not fall over, but it ships ~4× the image weight the prior audit claims, and that claim should not be trusted.

---

## 1. Executive Summary

Dania Real Estate is a bilingual (en/ar) **static marketing SPA** for a Doha property-management firm — 14 content routes, no backend, leads handed to WhatsApp. Code quality is above average for the class: semantic HTML, real `<h1>` behind the animated hero, associated form labels, per-route SEO, JSON-LD via safe `textContent`, RTL/i18n correctness, route-level code splitting. **Nothing is exploitable or data-losing — there is no data layer.**

The three things most likely to hurt you:
1. **The prior audit's headline perf win is incomplete and its metric is wrong.** It recompressed only `public/*.webp` and never touched `src/assets/` — the path Vite actually bundles. The homepage imports **9.36 MiB** of Pexels images (one is 5998×8000 px in a ~400 px card) plus **120 hero frames (4.54 MiB) eagerly preloaded on mount**. Real payload ~14 MB, not "3.9 MB".
2. **No `width`/`height` on any of 31 `<img>`** → CLS on every image-heavy page.
3. **`npm run lint` fails (4 errors) and is not in the build gate** — `tsc` passing is reported as "clean" while lint rots.

---

## 2. Findings Register (severity, then effort asc)

### F-001 — Homepage ships ~9.4 MiB of grossly oversized images via `src/assets` imports
Severity: **HIGH** · Domain: D10 / IMG · Location: `src/pages/HomePage.tsx:15-18`, used at `:22-25,33-36`
Evidence:
```
import imgDoha       from '@/assets/pexels-stephen-leonardi-587681991-34276136.webp' // 3.71 MiB, 5998×8000
import imgAlSadd     from '@/assets/pexels-mr-location-scout-22994825-25525976.webp' // 0.71 MiB
import imgBinMahmoud from '@/assets/pexels-juan-nino-3824481-9556696.webp'           // 3.01 MiB
import imgAlWakra    from '@/assets/pexels-athena-2962124.webp'                      // 1.93 MiB
```
Fact: Four bundled images (sizes measured on disk this session) render in area cards ≤400 px wide; Vite emits them 1:1 into `dist/assets/`.
Means: Every homepage visitor downloads ~9.4 MB just for four thumbnails.
Impact: On a Doha 4G phone this is several seconds of transfer and blows the LCP/INP budgets. **This is the payload the prior audit claimed was 3.9 MB — `src/assets/` was never touched.**
Root cause: Prior remediation recompressed only `public/*.webp`; `src/assets/` (the bundled path) was out of scope and unmeasured.
Fix: Resize to ~800 px, re-encode webp q80 (sharp already in devDeps), serve `srcset`/`sizes`; or move to `/public` and reference by path.
Effort: **M** · Fix risk: Low · Confidence: High.

### F-002 — 120 hero frames (4.54 MiB) eagerly bundled and preloaded on homepage mount
Severity: **HIGH** · Domain: D10 · Location: `src/components/shared/HeroSequence.tsx:10-15`, `:52-60`
Evidence:
```
const frameMap = import.meta.glob('../../assets/hero/*.webp', { eager: true, ... }) // all 120 bundled
FRAMES.forEach((src, i) => { const img = new Image(); img.src = src; imgs[i] = img }) // all 120 fetched on mount
```
Fact: `eager: true` bundles all 120 frames; the mount effect issues 120 `Image()` requests immediately, regardless of scroll. 4.54 MiB total (measured).
Means: The homepage fires 120 image downloads the instant it opens, even if you never scroll.
Impact: The LCP element is this canvas; 120 parallel requests contend with hero paint and the F-001 payload, saturating the connection on first load.
Root cause: Scroll-scrubbed sequence favors "all frames ready" over progressive loading.
Fix: Load the first keyframe eagerly, defer the rest to `requestIdleCallback`/on-scroll; or decimate to ~40 frames; or gate behind IntersectionObserver + `prefers-reduced-motion` (already computed at `:17`).
Effort: M · Fix risk: Med (animation smoothness) · Confidence: High.

### F-003 — No `width`/`height` on any `<img>` (31 images) → CLS
Severity: **MEDIUM** · Domain: D10 / D14 (R) · Location: 31 `<img>` across pages (e.g. `HomePage.tsx:240,500,532`, `ContactPage.tsx:114-119`)
Fact: Not one image declares intrinsic dimensions. `loading="lazy"` is on 27/31 (good), but nothing reserves space.
Means: Content jumps around as images pop in while the page loads.
Impact: Fails CLS < 0.1 on image-dense pages.
Fix: Add `width`/`height` (or `aspect-ratio`) matching each render box.
Effort: S · Fix risk: Low · Confidence: High.

### F-004 — No Content-Security-Policy header
Severity: **MEDIUM** · Domain: D4 (S) · Location: `vercel.json:4-14`
Evidence: Header block sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, HSTS, `Permissions-Policy` — **no `Content-Security-Policy`**.
Means: No last line of defense if a third-party image host or dependency were ever compromised into injecting a script.
Impact: No defense-in-depth against injected `<script>`.
Fix: Ship `Content-Security-Policy-Report-Only` first (`'self'`, `images.unsplash.com`, `images.pexels.com`, `'unsafe-inline'` styles or hashes for JSON-LD), verify against the live site, then enforce.
Effort: M · Fix risk: Med (can break rendering if wrong) · Confidence: High.

### F-005 — `npm run lint` fails with 4 errors and is not in the build gate
Severity: **MEDIUM** · Domain: D8 / D12 (C) · Location: `Header.tsx:189`, `Seo.tsx:8,11`, `StaffAccommodationPage.tsx:29`
Evidence (real `eslint .` output, re-run this session):
```
Header.tsx:189:21  error  Calling setState synchronously within an effect (react-hooks/set-state-in-effect)
Seo.tsx:8:14       error  Fast refresh only works when a file only exports components (react-refresh/only-export-components)
Seo.tsx:11:17      error  Fast refresh only works when a file only exports components (react-refresh/only-export-components)
StaffAccommodationPage.tsx:29:7  error  'staffMainFaqs' is assigned a value but only used as a type (@typescript-eslint/no-unused-vars)
✖ 5 problems (4 errors, 1 warning)
```
Fact: `build` = `tsc -b && vite build` — **lint is never invoked by the gate**. `tsc --noEmit` exits 0, which is what "clean" meant — but it omits the lint failures.
Means: The quality checker is red, and nothing stops it getting redder.
Impact: Dead code ships (`staffMainFaqs`); no mechanism prevents further lint rot.
Fix: Remove the dead var; move `Seo.tsx` non-component exports to `seo-context.ts`; refactor or justifiably scope-disable the Header effect; add `eslint` to the build/CI gate.
Effort: S–M · Fix risk: Low · Confidence: High.

### F-006 — Deep-link social share cards are client-rendered (non-JS scrapers see home metadata)
Severity: **MEDIUM** · Domain: D17 (SEO) · Location: `Seo.tsx:60-95`, `index.html:8-13`
Fact: `index.html` static head hardcodes home title/description/canonical; per-route OG/Twitter tags are set imperatively inside a `useEffect` (`Seo.tsx:65-95`).
Means: When someone shares a deep link on WhatsApp/Facebook, the preview shows the homepage, not that page.
Impact: Wrong titles/images on shared listing/area links; weaker social CTR. Googlebot (renders JS) largely unaffected.
Fix: Build-time prerender (`vite-plugin-prerender`/`react-snap`) or static per-route head generation.
Effort: L (new dependency + product decision) · Fix risk: Med · Confidence: High.

### F-007 — ~30 property/gallery images hotlink third-party CDNs
Severity: **MEDIUM** · Domain: D10 / D4 (CR) · Location: `mockData.ts:21-37`, `HomePage.tsx:26-48`, `GalleryPage.tsx`
Fact: ~30 images are hotlinked from Unsplash/Pexels at request time.
Means: If those free photo sites remove an image or throttle, parts of the site show broken images.
Impact: Availability dependency on external CDNs; also an `img-src` surface for any future CSP.
Fix: Self-host resized copies under `/public`; add to `img-src` when CSP lands. **Precondition: confirm these are placeholders, not licensed inventory (see Blind Spots).**
Effort: M · Fix risk: Low · Confidence: High.

### F-008 — 37.53 MB unused video committed to `src/assets`
Severity: **LOW** · Domain: D8 (C) · Location: `src/assets/13761467-uhd_3840_2160_30fps.mp4`
Fact: A 37.53 MB 4K mp4 (measured) sits in the bundled-assets tree, imported nowhere, so Vite does not ship it — but it bloats the repo and risks an accidental future `import`.
Means: A huge dead file is sitting in the project doing nothing.
Fix: Delete, or move to a media store outside the repo.
Effort: S · Fix risk: Low · Confidence: High.

### F-009 — Contact handoff shows "success" even if the popup is blocked
Severity: **LOW** · Domain: D9 (E) · Location: `ContactPage.tsx:43-61`
Evidence:
```
const waUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
window.open(waUrl, '_blank', 'noopener,noreferrer')
setSent(true)
```
Fact: All six fields are encoded correctly (the prior CRITICAL is genuinely fixed), but `setSent(true)` fires unconditionally even if `window.open` returns `null` (blocked).
Means: If the browser blocks the WhatsApp popup, the visitor sees "Inquiry Submitted!" but the lead never actually reached anyone.
Impact: Silent lead loss in the popup-blocked case.
Fix: If `window.open(...)` is falsy, render a visible fallback link (`href={waUrl}`) instead of the success state.
Effort: S · Fix risk: Low · Confidence: High.

### F-010 — Zero automated tests / no test runner
Severity: **LOW** (impact) / mandated **FAIL** (D11, T) · Location: `package.json` (no test dep, no `test` script), no `*.test.*` under `src`
Fact: There is no way to run a test.
Means: Nothing automatically catches a regression before it ships.
Impact: Every change verified only by `tsc` + eyeballs; F-001-style regressions recur silently.
Fix: Add Vitest + React Testing Library; regression tests for the contact-handoff URL and `resolveSeo` mapping.
Effort: M · Confidence: High.

---

## 3. Attack Surface Summary

Internet-facing but **no server logic and no data store**. An unauthenticated attacker reaches only static CDN assets and client JS. No injection sink (0 `dangerouslySetInnerHTML`; i18n output escaped by React JSX at `i18n/index.ts:19`), no auth to bypass, no IDOR, no upload, no redirect param. Only outbound trust edges: Unsplash/Pexels hotlinks (F-007) and `wa.me` deep links. Residual header gap: no CSP (F-004). **Attack surface is minimal by architecture.**

## 4. Systemic Patterns (worth more than the register)

1. **The prior remediation optimized only what it could see (`public/`) and never measured the Vite-bundled `src/assets/` path** — so its "25 MB → 3.9 MB" metric and Performance 3→7 jump are unsupported. Real homepage image weight ~14 MB. **The single most important correction here.**
2. **"The build passes" conflates `tsc` with the full quality gate.** Lint is red and ungated; there are no tests.
3. **No source control and no CI** underlies F-005/F-008/F-010 — nothing mechanical prevents dead code, asset bloat, or regressions accumulating.
4. **Content duplicated as parallel `_AR`/`EN` arrays inside 2k-LOC page components** — why the largest files are huge and dead code slips past review.

## 5. What Is Genuinely Good (specific)

- Original CRITICAL lead-loss bug is **actually fixed** (`ContactPage.tsx:48-58`, `encodeURIComponent`) — verified by reading, not trusting the log.
- Real semantic `<h1>` behind the `aria-hidden` canvas hero (`HeroSequence.tsx`).
- JSON-LD via `textContent` (`Seo.tsx:93`), not `innerHTML` — no injection vector.
- Form labels associated (`htmlFor`/`id`) with correct `autoComplete` (`ContactPage.tsx`).
- Correct `robots.txt` + complete `sitemap.xml`; per-route canonical + titles; `noindex` 404.
- Route-level code splitting via `lazy()` for all 14 pages.

## 6. Blind Spots & Assumptions

- **ASSUMPTION:** the Unsplash/Pexels images and `mockData.ts` listings are stock placeholders, not real inventory. A human must confirm before F-007 self-hosting.
- **UNVERIFIED:** live production response headers (no deployed URL curled). `vercel.json` correct in source.
- **UNVERIFIED:** real-world Core Web Vitals; F-001/F-002 are static byte/dimension analysis (strong, not a field LCP). `dist/` not built this pass (kept Stage 1 read-only).
- **UNKNOWN:** whether the 37.53 MB `.mp4` is staged for a future feature.
- `npm audit` not run this pass — dependency CVE status unassessed.

---

# REMEDIATION PLAN

## Strategy

There are no tests and no version control, so the first move is to make change **safe and observable**: create a git baseline (Rule 8) and stand up a test harness with characterization tests around the two pieces of real logic we will touch (the WhatsApp handoff and `resolveSeo`). Only then do we touch behavior. The end state is not "findings closed" — it is that **every file we touch meets the Definition of Done** (typed, lint-clean, tested, sized images, CLS-safe, accessible).

Sequencing follows the ordering law: test harness → quick low-risk wins that also unblock the gate (lint green + gated) → the one real behavior bug (popup fallback) → the performance work that is the headline problem (image right-sizing, hero deferral, CLS dimensions) → the security header → repo hygiene. The two heavy items — social-card prerender (F-006, new dependency + product decision) and self-hosting the ~30 hotlinked images (F-007, blocked on confirming they are placeholders) — are treated carefully: F-007 is a batch with an explicit precondition, and F-006 is **out of scope** for this pass and recommended as the top follow-up.

Each batch is independently shippable and never mixes a behavior change with a pure refactor.

## Batches

```
## Batch 1 — Test harness + characterization tests   [test]
Fixes:        F-010
Goal:         Stand up Vitest + RTL and pin current behavior before touching code.
Files:        package.json, vite.config.ts (test config), src/lib/__tests__/seo.test.ts,
              src/pages/__tests__/ContactPage.wa.test.ts
Precondition: git baseline commit exists (Rule 8).
Steps:        1. Add vitest + @testing-library/react + jsdom (ASK before install).
              2. Characterization test: contact form builds the exact wa.me URL from all 6 fields.
              3. Characterization test: resolveSeo maps a known route to its title/canonical.
Acceptance:   - [ ] `npx vitest run` green; both tests assert real current output.
Tests added:  contact-wa-url (baseline), resolveSeo-mapping (baseline)
Risk:         Low — Blast radius: none (additive, no source change).
Rollback:     Revert the batch commit.
Effort:       3–4h

## Batch 2 — Lint green + wire lint into the gate   [chore/refactor]
Fixes:        F-005
Goal:         Zero lint errors and lint enforced by the build.
Files:        StaffAccommodationPage.tsx, Seo.tsx, src/components/shared/seo-context.ts (new),
              components using SeoExtraProvider/usePageSchema, Header.tsx, package.json
Steps:        1. Delete dead `staffMainFaqs`. 2. Move SeoExtraProvider/usePageSchema to
              seo-context.ts; update imports. 3. Resolve Header.tsx:189 effect (functional
              refactor or scoped disable with a WHY comment). 4. Add `eslint .` to the build script.
Acceptance:   - [ ] `npm run lint` exits 0. - [ ] `npm run build` runs lint and fails on any error.
Tests added:  none (no behavior change); rely on Batch 1 to prove Seo behavior unchanged.
Risk:         Low — Blast radius: Seo import paths.
Rollback:     Revert the batch commit.
Effort:       2–3h

## Batch 3 — Contact popup fallback   [bugfix]
Fixes:        F-009
Goal:         Never show success when the WhatsApp handoff didn't open.
Files:        src/pages/ContactPage.tsx, src/pages/__tests__/ContactPage.wa.test.ts
Steps:        1. Capture `const win = window.open(...)`. 2. If falsy, render a visible
              fallback anchor (href={waUrl}) instead of the success panel.
Acceptance:   - [ ] Regression test: window.open stubbed to return null → fallback link shown,
              success NOT shown. Fails before, passes after.
Tests added:  contact-popup-blocked-fallback (regression)
Risk:         Low — Blast radius: contact success UI only.
Rollback:     Revert the batch commit.
Effort:       1–2h

## Batch 4 — Right-size the bundled homepage images   [perf]
Fixes:        F-001
Goal:         Cut ~9.4 MiB of homepage image weight to the render box.
Files:        src/assets/*.webp (4 files) or new /public copies, HomePage.tsx, a sharp script
Steps:        1. sharp-resize the 4 Pexels images to ~800px q80 (+ a 2× variant). 2. Wire
              srcset/sizes on the four area cards. 3. Re-measure emitted bytes.
Acceptance:   - [ ] Each of the 4 images ≤ ~150 KB. - [ ] Homepage bundled image payload
              9.36 MiB → < 0.7 MiB (show the number pair).
Tests added:  none (asset change); verified by measured byte size.
Risk:         Low — Blast radius: homepage area-card visuals.
Rollback:     Restore originals from the safety commit.
Effort:       2–3h

## Batch 5 — Defer the hero frame sequence   [perf]
Fixes:        F-002
Goal:         Stop 120 image requests firing on mount.
Files:        src/components/shared/HeroSequence.tsx
Steps:        1. Eager-load frame 0 only. 2. Defer the rest via requestIdleCallback / on first
              scroll into view (IntersectionObserver). 3. Keep prefers-reduced-motion path.
Acceptance:   - [ ] On mount with no scroll, ≤ a handful of frame requests (not 120) —
              verified in the network panel / a mock-counted test.
Tests added:  hero-defer (asserts not-all-frames-eager if feasible in jsdom, else documented manual check)
Risk:         Med — Blast radius: hero scrub smoothness. Rollback below.
Rollback:     Revert to eager glob.
Effort:       3–4h

## Batch 6 — Add image dimensions (CLS)   [perf/a11y]
Fixes:        F-003
Goal:         Reserve layout space for all 31 images.
Files:        pages/components rendering <img>
Steps:        1. Add width/height or aspect-ratio matching each render box.
Acceptance:   - [ ] All 31 <img> declare dimensions. - [ ] No CLS from images on smoke pass.
Tests added:  none (markup); grep assertion that every <img> has width/height or aspect-ratio.
Risk:         Low.
Rollback:     Revert the batch commit.
Effort:       2–3h

## Batch 7 — Content-Security-Policy (report-only → enforce)   [security]
Fixes:        F-004
Goal:         Add CSP without breaking rendering.
Files:        vercel.json
Steps:        1. Add Content-Security-Policy-Report-Only allowing 'self', image CDNs, style
              needs, JSON-LD. 2. Verify against the deployed site. 3. Promote to enforcing.
Acceptance:   - [ ] CSP present; no console CSP violations on any route in the smoke pass.
Tests added:  none (header config); verified against the running site.
Risk:         Med — Blast radius: could block styles/scripts if wrong (report-only first mitigates).
Rollback:     Remove the header.
Effort:       2–4h

## Batch 8 — Repo hygiene: remove dead 37.5 MB video   [chore]
Fixes:        F-008
Goal:         Drop the unused 4K mp4 from the repo.
Files:        src/assets/13761467-uhd_3840_2160_30fps.mp4 (delete)
Steps:        1. Re-confirm 0 references. 2. Delete. 3. Confirm build unaffected.
Acceptance:   - [ ] File gone; `npm run build` still green.
Tests added:  none.
Risk:         Low.
Rollback:     Restore from the safety commit.
Effort:       <1h

## Batch 9 — Self-host the hotlinked stock images   [perf/chore]  (CONDITIONAL)
Fixes:        F-007
Goal:         Remove the third-party CDN availability dependency.
Files:        mockData.ts, HomePage.tsx, GalleryPage.tsx, /public/img/*
Precondition: HUMAN CONFIRMS these are replaceable placeholders, not licensed inventory.
Steps:        1. Download + resize the ~30 images to /public. 2. Repoint references.
              3. Add to CSP img-src.
Acceptance:   - [ ] 0 remaining images.unsplash/images.pexels references. - [ ] All grids render.
Tests added:  none (asset change).
Risk:         Low (once confirmed).
Rollback:     Revert the batch commit.
Effort:       3–4h
```

## Explicitly Out of Scope (this pass)

| Item | Why not now |
|---|---|
| **F-006 — SSG/prerender for social cards** | Requires a new build dependency AND a product decision on the render strategy; L effort; not worth coupling to a quality pass. **Top recommended follow-up.** |
| Splitting the 2.5k-LOC page files / de-duplicating `_AR`/`EN` arrays | Large structural refactor (D7); high blast radius, low user-visible payoff; do it deliberately, not inside a fix sweep. |
| Setting up CI hosting | No VCS remote decided yet; add once the repo is under git + a chosen host. |
| `npm audit` remediation | Run the audit first (Batch 0 side-task); no known CVE surfaced yet to plan against. |

## Sequencing Table

| Batch | Type | Effort | Risk | Depends on |
|---|---|---|---|---|
| 1 | test | 3–4h | Low | git baseline |
| 2 | chore/refactor | 2–3h | Low | 1 |
| 3 | bugfix | 1–2h | Low | 1 |
| 4 | perf | 2–3h | Low | — |
| 5 | perf | 3–4h | Med | — |
| 6 | perf/a11y | 2–3h | Low | — |
| 7 | security | 2–4h | Med | — |
| 8 | chore | <1h | Low | — |
| 9 | perf/chore | 3–4h | Low | human confirmation (F-007) |

---

## SCORE TABLE (Projected After — if the full plan executes)

| Area | | Before | Projected | Δ |
|---|---|:---:|:---:|:---:|
| Security | S | 7 | 8 | +1 |
| Errors/Robustness | E | 7 | 8 | +1 |
| Clean Code | C | 5 | 7 | +2 |
| Performance | P | 3 | 7 | +4 |
| Images/Assets | IMG | 2 | 8 | +6 |
| Accessibility | A11Y | 7 | 8 | +1 |
| Responsive | R | 6 | 8 | +2 |
| SEO | SEO | 7 | 7 | 0 (F-006 deferred) |
| Testing | T | 0 | 6 | +6 |
| Content/Release | CR | 6 | 7 | +1 |
| Load/Stress | LT | — | — | N/A |

**Projected OVERALL = (8·3 + 8·3 + 7·2 + 7·2 + 8·1.5 + 8·1.5 + 8·1 + 7·1 + 6·2 + 7·1) / 18 = 133 / 18 = `7.4`** (5.0 → 7.4). Projections only; Stage 3 raises a score **only** after the underlying fix is re-verified.

---

> Stage 1 complete — report + plan written to `AUDIT_AND_PLAN.md`.
> Reply `FIX` to execute the full plan, `FIX 1,3` to execute selected batches only, or ask questions.
