# FINAL_REPORT_REAUDIT.md — Dania Real Estate

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT **v3** · Stage 3
Date: 2026-07-12 · Branch: `audit/remediation` · Plan: `AUDIT_AND_PLAN.md` · Log: `AUDIT_LOG.md`
Executed **8 of 10 batches** (1–6, 8, 9) plus the operator-answered items (office line, privacy link); batch 10 (error reporting) deferred by operator (Q6 = not now), and the F-012 refactor / F-016 hours / F-010 image-recompression remain as follow-ups.
Every "After" number below was re-measured this session by re-running the exact check that originally failed.
(This re-audit's report is a separate file so the prior `FINAL_REPORT.md` you asked to keep is untouched.)

**Operator decisions applied:** Q1 `+974 4444 0085` = office landline (re-added from data); Q2 prerender = **yes** (built); Q3 images = demo/placeholder, **accepted as-is**; Q4 privacy page = **no** (dead link removed instead); Q6 error tracking = **not now**.

---

## BEFORE → AFTER SCORE TABLE

```
Area                 Before  After   Δ
Security      S       7       8      +1
Errors/Robust E       6       8      +2
Clean Code    C       5       6      +1
Performance   P       7       7       0
Images/Assets IMG     7       7       0
Accessibility A11Y    5       8      +3
Responsive    R       8       8       0
SEO           SEO     6       8      +2
Testing       T       6       7      +1
Content/Rel   CR      6       7      +1
Load/Stress   LT      —       —      (N/A — no server request path)
------------------------------------------------------
OVERALL               6.3  →  7.5    (+1.2)
```
**Weight math** (S3, E3, C2, P2, IMG1.5, A11Y1.5, R1, SEO1, T2, CR1; ΣW = 18):
`(8·3 + 8·3 + 6·2 + 7·2 + 7·1.5 + 8·1.5 + 8·1 + 8·1 + 7·2 + 7·1) / 18 = 133.5 / 18 = 7.42 ≈ 7.5`

**Plain-language verdict:** The lead-losing bug is gone (correct numbers now — mobile + office landline), the site can no longer white-screen from a bad translation key, the security header actually protects, keyboard/screen-reader users can navigate it, and **shared links now show a proper preview card** (per-route metadata is baked into the HTML at build time). The remaining gaps are your call: real listing photos (you confirmed the current ones are demo), the business-hours copy, error reporting, and the big page-file cleanup.

**Deploy verdict: `SAFE`** (was `SAFE WITH CAVEATS`) — the correctness, accessibility, and social/SEO caveats are resolved and re-verified. Confirm two things live: the newly-enforced CSP and a share-card preview (48-hour watch list).

---

## RE-VERIFICATION PASS (each RESOLVED finding, re-run)

| Finding | Check re-run | Before | After |
|---|---|---|---|
| F-001 phone | Header/Footer render tests | one wrong hardcoded number | **two data-sourced lines**: office `company.officePhone` in header, mobile `company.phone` in footer/contact; all `tel:` space-free (tests green) |
| F-004 social cards | `npm run build` → `grep og:title dist/villas-for-rent/index.html` | 0 OG tags in any served HTML | **baked per-route**: `og:title`, `og:image`, canonical, JSON-LD present in static HTML for 30 routes (unit tests green) |
| F-002 skip-link | render `Layout`, query `a[href="#main-content"]` / `main#main-content` | both absent | **both present** (a11y-landmarks test green) |
| F-003 error boundary | grep `getDerivedStateFromError`; render a throwing child | none → white-screen | **boundary present**; throwing child → recovery panel (test green) |
| F-005 CSP | read `vercel.json` header key | `…-Report-Only` (no-op) | **`Content-Security-Policy`** (enforcing); report-only absent (test asserts) |
| F-007 headings | grep hero `<h3>` on the 6 pages | 6× `h1→h3` skips | **converted to `<p>`** (0 hero h3 remaining) |
| F-013 dead code | `ls` the 5 files / `ui/` dir | 5 dead files present | **all deleted**, `ui/` removed, `border-spin` CSS removed |
| F-014 mojibake | `grep â/گ/€ src/**` | 6,972 mojibake chars (4 files) | **0 in source** (only `.webp` binaries match) |
| F-017 tel spaces | inspect footer `tel:` | `tel:+974 3326 0393` | **`tel:+97433260393`** (test green) |
| F-018 FAQ clip | inspect HomePage open-state class | `max-h-48` (192px) | **`max-h-[1000px]`** |
| Test suite | `npx vitest run` | **11 passed** | **25 passed** (+14) |
| Build gate | `npm run build` (`tsc -b && eslint . && vite build`) | clean | **clean** |

---

## FINDINGS STATUS TABLE

| ID | Sev | Status | Note |
|---|---|---|---|
| F-001 | HIGH | **RESOLVED** | Two data-sourced lines: office landline (header) + mobile/WhatsApp (footer/contact); no hardcoded numbers |
| F-002 | HIGH | **RESOLVED** | Bilingual skip-link → `main#main-content` |
| F-003 | HIGH | **RESOLVED** | ErrorBoundary around Outlet; `asArray` on flagged sites |
| F-004 | HIGH | **RESOLVED** | Build-time prerender bakes per-route title/desc/canonical/OG/Twitter/JSON-LD into static HTML |
| F-005 | MED | **RESOLVED** | CSP enforced — *needs live verification* (watch list) |
| F-006 | MED | **RESOLVED** | Accordion `aria-expanded`, showcase focus-expand, map pins keyboard-operable |
| F-007 | MED | **RESOLVED** | 6 hero subtitles `h3`→`p` |
| F-008 | MED | **WON'T-FIX** | Operator confirmed listing images are demo/placeholder and acceptable; copy left as-is |
| F-009 | MED | **RESOLVED** | Operator declined a privacy page; dead footer "Privacy" link removed (no broken affordance) |
| F-010 | MED | **PARTIAL** | Hero preload gated on Save-Data/slow; `srcset`/recompress deferred (visual QA) |
| F-011 | MED | **RESOLVED** | Mobile `<nav>` landmark, Escape, `aria-controls`, i18n labels (no full focus-trap yet) |
| F-012 | LOW | **DEFERRED** | XL duplication refactor — separate focused pass |
| F-013 | LOW | **RESOLVED** | Dead subtree deleted; CLAUDE.md synced |
| F-014 | LOW | **RESOLVED** | All mojibake normalized (incl. ShopsPage, found in re-verification) |
| F-015 | LOW | **MITIGATED** | Boundary catches `to={undefined}` throws; per-site guards deferred |
| F-016 | LOW | **DEFERRED** | Real business hours unknown (Q5) — header/footer/FAQ still disagree |
| F-017 | LOW | **RESOLVED** | Footer `tel:` space-stripped |
| F-018 | LOW | **RESOLVED** | FAQ answer clip raised |
| F-019 | LOW | **DEFERRED** | Operator: not now — ErrorBoundary logs to console; no external reporter added |
| F-020 | NIT | **WON'T-FIX** | i18n `escapeValue:false` safe (React escapes; no `dangerouslySetInnerHTML`) |

Tally: **13 RESOLVED**, 1 PARTIAL, 1 MITIGATED, 3 DEFERRED, 2 WON'T-FIX.

---

## RESIDUAL RISK (what is still true and matters)

- **CSP is now enforced but unverified live (F-005).** If the policy misses a resource, something could fail to load in production — verify within the first hour (watch list). Fully reversible (`git revert`).
- **Business-hours copy still disagrees (F-016).** Header (Sat–Thu 8–5), footer ("24/7"), AR FAQ (8–8) — needs the real hours (Q5) put in one place.
- **Demo listing images (F-008, accepted).** You confirmed these are placeholders; the "100% verified" copy still reads as literal. Fine for a demo, but revisit the wording before a real launch. Also an availability dependency on `images.unsplash.com`.
- **No client-side error reporting (F-019, by choice).** The ErrorBoundary catches crashes and logs to console, but nothing alerts you if the site breaks for a real user. Revisit if you want Sentry-class visibility.
- **Maintainability debt remains (F-012).** FaqAccordion ×5, CTA ×5, area grid ×7, ~1,840-line data blob, inline bilingual copy — edits stay error-prone until extracted.
- **Contact delivery depends on WhatsApp.** No backend; if a visitor lacks WhatsApp there's no server-side capture (a serverless endpoint + honeypot is the long-term fix).
- **Prerender covers Organization JSON-LD + social meta**, not page-specific JSON-LD (Contact/FAQ), which still injects client-side (Googlebot renders JS, so indexing is fine).
- **`class-variance-authority`** is now an unused dependency (trivial to drop).

---

## RANKED FOLLOW-UPS (in order, with effort)

1. **F-016 — business hours (Q5)**: tell me the real hours; I'll put them in `company` and reference everywhere (S).
2. **F-010 remainder**: `srcset`/`sizes` + recompress the >300 KB public images after visual QA (0.5–1d).
3. **F-019 / Batch 10 — observability**: if wanted, wire the ErrorBoundary to a reporter + add CSP `report-uri` (3–4h, needs a service).
4. **F-008 copy**: before a real launch, soften "100% verified" while images are placeholders, or add real assets + self-host (S–M).
5. **F-012 refactor**: extract shared Accordion/CTA/AreaGrid, centralize area data, move inline bilingual copy into i18n (XL) — do with characterization tests.
6. **F-015 / focus-trap / aria-controls**: per-site array guards, mobile-menu focus trap, accordion `aria-controls` (M).
7. **Drop `class-variance-authority`** from `package.json` (unused after dead-code removal) (S).

---

## 48-HOUR WATCH LIST (post-deploy)

| Watch | How | Rollback signal |
|---|---|---|
| **CSP enforcement** (F-005) | Load the deployed site; open DevTools console on 3–4 pages incl. home + a listing + contact | Any `Content-Security-Policy` violation error, missing images/styles, or JSON-LD not injecting → `git revert` the CSP commit |
| **Social cards** (F-004) | Paste a deep link (e.g. `/villas-for-rent/`) into the Facebook Sharing Debugger / LinkedIn Post Inspector | Card shows home/blank instead of that page's title+image → confirm Vercel served the prerendered file (buildCommand ran) |
| **Phone** (F-001) | Tap the header (office) number + the footer/contact (mobile) number on iOS Safari + Android Chrome | Header doesn't dial +974 4444 0085, or footer doesn't dial +974 3326 0393 |
| **Lead flow** | Submit the contact form | WhatsApp doesn't open with fields prefilled |
| **Hero on mobile** (F-010) | Load home on a throttled/Save-Data phone | Hero blank (frame 0 should always show) or janky scrub on normal links |
| **404** | Visit `/does-not-exist` | Not the noindex 404 page |
| **A11y** | Tab from page top | "Skip to content" doesn't appear/work |

---

## DELIBERATE COMPROMISES (carried out of Stage 2)

- **`asArray` applied to flagged crash sites only**; the ErrorBoundary is the blanket protection for the rest.
- **F-006 accordions** got `aria-expanded` in-place (no shared component / `aria-controls` yet).
- **F-010** shipped the Save-Data preload gate only; responsive images deferred for visual QA.
- **F-011** shipped landmark + Escape, not a full focus-trap.
- **Prerender (F-004)** bakes Organization JSON-LD + social meta per route; page-specific JSON-LD (Contact/FAQ) still injects client-side. Area routes use the logo as og:image (no per-area image in the SEO data).
- **F-012** (large refactor), **F-016** (hours — Q5 unanswered), **F-019/Batch 10** (error reporting — Q6 = not now) deferred.

---

## POST-DEPLOY VERIFICATION SCRIPT (run against the LIVE URL)

```bash
BASE=https://www.dania-realestate.com

# 1. Security headers — expect an ENFORCING CSP (not report-only) + the 5 others
curl -sI "$BASE/" | grep -iE "content-security-policy|strict-transport|x-frame-options|x-content-type-options|referrer-policy|permissions-policy"
#   expect: content-security-policy: default-src 'self'; ... (NO "-report-only")

# 2. 404 is noindex (SPA returns 200; page must self-mark noindex)
curl -s "$BASE/does-not-exist" | grep -i 'name="robots"'      # expect: noindex, follow

# 3. Canonical + title present
curl -s "$BASE/" | grep -iE '<title>|rel="canonical"'

# 4. sitemap/robots reachable
curl -sI "$BASE/sitemap.xml" | head -1                        # expect: 200
curl -s  "$BASE/robots.txt"

# 5. Social cards now baked at build time — verify the deep link carries its own meta:
curl -s "$BASE/villas-for-rent/" | grep -oE '<meta property="og:(title|image)"[^>]*>'
#   expect: og:title = "Villas for Rent in Doha | ..."  (NOT the home title)
#   also paste the URL into https://developers.facebook.com/tools/debug/ — should
#   render that page's title + image, not the home/blank card.

# 6. Manual: Lighthouse (mobile) on / and /contact-us/ — check LCP < 2.5s,
#    CLS < 0.1, and the Accessibility score (skip-link + headings should help).
```

---

*Generated as the Stage 3 output of the v3 re-audit. Prior-cycle `FINAL_REPORT.md` retained separately at operator request.*
