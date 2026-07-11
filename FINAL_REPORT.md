# FINAL_REPORT.md — Dania Real Estate

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT **v3** · Stage 3
Date: 2026-07-11 · Branch: `audit/remediation` (baseline `3c9d806`) · 8 of 9 batches executed, 1 deferred.
Every "After" number below was re-measured this session by re-running the exact check that originally failed.

---

## BEFORE → AFTER SCORE TABLE

```
Area                 Before  After   Δ
Security      S       7       8     +1
Errors/Robust E       7       8     +1
Clean Code    C       5       7     +2
Performance   P       3       7     +4
Images/Assets IMG     2       8     +6
Accessibility A11Y    7       7      0
Responsive    R       6       8     +2
SEO           SEO     7       7      0
Testing       T       0       6     +6
Content/Rel   CR      6       7     +1
Load/Stress   LT      —       —     (N/A — no server request path)
------------------------------------------------------
OVERALL               5.0  →  7.4   (+2.4)
```

**Weight math** (weights: S3, E3, C2, P2, IMG1.5, A11Y1.5, R1, SEO1, T2, CR1; ΣW = 18):
`(8·3 + 8·3 + 7·2 + 7·2 + 8·1.5 + 7·1.5 + 8·1 + 7·1 + 6·2 + 7·1) / 18 = 132.5 / 18 = 7.36 ≈ 7.4`

**Plain-language verdict:** The site is meaningfully faster and safer to change than it was. The homepage no longer ships ~14 MB of images no one saw; the code-quality gate is green and enforced; there are now automated tests where there were none. Two honest gaps remain: social-share previews for deep links (needs a build step) and self-hosting the stock photos (needs your OK).

**Deploy verdict: `SAFE`** (was `SAFE WITH CAVEATS`) — the headline performance and quality caveats are resolved and re-verified; the remaining items are enhancements, not risks.

> **Scores that did NOT rise, honestly:** A11Y (7→7) — no skip-link/keyboard fix shipped (none was batched); the image-dimension work is scored under Responsive. SEO (7→7) — F-006 (deep-link social cards) was deliberately out of scope. Per the Stage-3 rule, a score may only rise on re-verified evidence.

---

## RE-VERIFICATION PASS (each RESOLVED finding, re-run)

| ID | Check re-run this session | Before → After |
|---|---|---|
| **F-001** | Built `dist/`, counted homepage Pexels images shipped | 4 images / **9.36 MiB → 0** (removed; never rendered) |
| **F-002** | Regression test counts `Image()` constructions on hero mount | **120 → 1** (`HeroSequence.defer.test.tsx`; proven failing at 120 pre-fix) |
| **F-003** | Source scan for `<img>` without `width`/`height` + guard test | **31 missing → 0 missing** (`img-dimensions.test.ts`) |
| **F-004** | Parsed `vercel.json` for a CSP header | **absent → present** (Report-Only; `csp-header.test.ts`). *Enforcement pending — see compromises* |
| **F-005** | `npx eslint .` | **4 errors + 1 warning → 0 problems**; lint now in the `build` gate |
| **F-008** | `grep` refs + disk measure of `src/assets` | mp4 present → **deleted**; `src/assets` 51.46 MB → **4.57 MB** |
| **F-009** | Regression test: `window.open`→null shows fallback, not success | success-shown-when-blocked → **fallback link shown** (proven failing pre-fix) |
| **F-010** | `npx vitest run` | **no runner / 0 tests → 11 tests passing** across 5 files |

Aggregate final gate (real output this session): `eslint` **0**, `tsc -b` **0**, `vitest` **11 passed**, `npm run build` **exit 0**, `dist/assets` **~16 MB → 5.97 MB**.

---

## FINDINGS STATUS

| ID | Sev | Status | One-line reason | Evidence |
|---|---|---|---|---|
| F-001 | HIGH | **RESOLVED** | Dead 9.36 MiB homepage images removed | `d007f16` · dist count |
| F-002 | HIGH | **RESOLVED** | Hero loads 1 frame on mount, defers 119 | `01ce5c9` · defer test |
| F-003 | MED | **RESOLVED** | All 31 `<img>` declare dimensions | `4838603` · guard test |
| F-004 | MED | **RESOLVED (report-only)** | CSP shipped; enforcement awaits live check | `e56ecb8` · csp test |
| F-005 | MED | **RESOLVED** | Lint green + gated in build | `bc542ec` · eslint 0 |
| F-006 | MED | **DEFERRED** | Deep-link social cards need SSG/prerender (new dep + decision) | out of scope |
| F-007 | MED | **DEFERRED** | Self-hosting hotlinked images needs human confirmation they're placeholders | Batch 9 blocked |
| F-008 | LOW | **RESOLVED** | 37.5 MB unused mp4 deleted | `787847a` |
| F-009 | LOW | **RESOLVED** | Blocked-popup shows a real link, not false success | `a3670bd` · regression |
| F-010 | LOW/FAIL | **RESOLVED** | Vitest harness + 11 tests incl. regressions | `5c30e72` + later |

**8 resolved · 2 deferred · 0 won't-fix.**

---

## RESIDUAL RISK (what is still true and dangerous, plainly)

1. **Shared deep links still preview as the homepage** (F-006). Anyone sharing a listing/area link on WhatsApp/Facebook gets the wrong title/image. Not a security risk; a marketing loss. Needs a build-time prerender step.
2. **~30 images still load from Unsplash/Pexels** (F-007). If those free CDNs remove a photo or throttle, parts of the grid break. The CSP allows them, so nothing breaks *today*.
3. **The CSP is report-only** (F-004). It observes but does not yet block. Real protection begins only when it's promoted to an enforcing `Content-Security-Policy` after live verification.
4. **No live production verification this pass** — headers, Core Web Vitals, and CSP violations were reasoned/measured statically, not observed on the deployed URL.
5. **Accessibility unchanged** — still no skip-link; keyboard/screen-reader flow was not re-audited or improved.

---

## RANKED FOLLOW-UPS

| # | Item | Effort | Why |
|---|---|---|---|
| 1 | **Confirm placeholder status → run Batch 9** (self-host images) | M | Removes the third-party availability dependency; one word unblocks it |
| 2 | **Deploy, watch CSP report-only console, then enforce** (F-004) | S–M | Turns defense-in-depth from observing to blocking |
| 3 | **F-006 — add SSG/prerender** for per-route social/meta | L | Correct share cards + non-JS crawler SEO |
| 4 | **A11y pass** — skip-link, keyboard/focus audit across routes | M | The one score that didn't move |
| 5 | **Wire CI** (lint+tsc+tests+build on every push) now that git exists | S | Makes the gate automatic, not manual |
| 6 | **Split the 2.5k-LOC page files / de-dupe `_AR`/`EN` arrays** | L | The systemic size/maintainability root cause |

---

## 48-HOUR WATCH LIST (post-deploy) — signal that means "roll back"

| Watch | Roll-back signal |
|---|---|
| **Hero animation on the homepage** | Hero frames visibly stutter/blank while scrolling on a mid-range phone (the deferral changed load timing) → revert `01ce5c9` |
| **Area cards on the homepage** | Any area card renders a broken/empty image slot (should be text-only now) → revert `d007f16` |
| **Contact form** | Users report the form shows success but no WhatsApp opens, OR the new fallback link is missing when popups are blocked → revert `a3670bd` |
| **CSP report-only** | Browser console floods with CSP violation reports for legitimate resources (means the future enforcing policy would break them) → widen the policy before enforcing; report-only itself breaks nothing |
| **Any page render** | A route shows unstyled/blank content (would implicate the `Seo`/`seo-context` refactor) → revert `bc542ec` |

---

## DELIBERATE COMPROMISES (carried out of Stage 2)

1. **CSP shipped Report-Only, not enforcing** (F-004) — Vercel headers can't be verified by `vite preview`; promotion needs live console verification. Report-only cannot break rendering, so it's safe to ship now.
2. **F-002 test stubs the 2D canvas** — jsdom has no canvas, so the automated test verifies frame *scheduling* (1 eager + idle-deferred), not pixel output; real-browser LCP is a manual follow-up.
3. **Dynamic-src image dimensions use representative ratios** (F-003) — true per-image sizes are unknowable at build time for remote/variable sources; their sized containers control CLS regardless.
4. **F-007 deferred** — blocked on human confirmation the stock images are placeholders (licensing/content decision).
5. **A11Y not raised** — no keyboard/skip-link fix was in scope this pass; score held at 7 per the re-verification rule.

---

## COMMIT TRAIL (branch `audit/remediation`)

```
787847a chore: remove unused 37.5 MB 4K video from assets            (F-008)
e56ecb8 security: add Content-Security-Policy (report-only) header    (F-004)
4838603 perf: add width/height to all images to prevent layout shift  (F-003)
01ce5c9 perf: defer hero frame preloading instead of 120 on mount     (F-002)
d007f16 perf: drop 9.4 MiB of never-rendered homepage images          (F-001)
a3670bd fix: show a direct WhatsApp link when contact popup is blocked (F-009)
bc542ec refactor: make lint pass and gate it in the build             (F-005)
5c30e72 test: add Vitest harness + characterization tests             (F-010)
3c9d806 chore: baseline before audit remediation                      (safety point)
```

Nothing is merged to a main branch (none exists); all work is isolated on `audit/remediation` for review.
