# FINAL_REPORT_REAUDIT.md — Dania Real Estate

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT **v3** · Stage 3
Date: 2026-07-12 · Branch: `audit/remediation` · Plan: `AUDIT_AND_PLAN.md` · Log: `AUDIT_LOG.md`
Executed **7 of 10 batches** (1–6 + 9); batches 7, 8, 10 deferred pending operator decisions/new dependencies.
Every "After" number below was re-measured this session by re-running the exact check that originally failed.
(This re-audit's report is a separate file so the prior `FINAL_REPORT.md` you asked to keep is untouched.)

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
SEO           SEO     6       6       0
Testing       T       6       7      +1
Content/Rel   CR      6       7      +1
Load/Stress   LT      —       —      (N/A — no server request path)
------------------------------------------------------
OVERALL               6.3  →  7.3    (+1.0)
```
**Weight math** (S3, E3, C2, P2, IMG1.5, A11Y1.5, R1, SEO1, T2, CR1; ΣW = 18):
`(8·3 + 8·3 + 6·2 + 7·2 + 7·1.5 + 8·1.5 + 8·1 + 6·1 + 7·2 + 7·1) / 18 = 131.5 / 18 = 7.31 ≈ 7.3`

**Plain-language verdict:** The lead-losing bug is gone (one phone number now), the site can no longer white-screen from a bad translation key, the security header actually protects now, and keyboard/screen-reader users can finally navigate it. The scores that didn't move are the ones I deliberately left for you to decide on — blank social-share cards (needs a build step), the stock listing photos and missing privacy page (need your content), and the big page-file cleanup (a large, separate job).

**Deploy verdict: `SAFE`** (was `SAFE WITH CAVEATS`) — the correctness and accessibility caveats are resolved and re-verified. The remaining items are enhancements or need your input, not blockers. One thing to confirm live: the newly-enforced CSP (see 48-hour watch list).

---

## RE-VERIFICATION PASS (each RESOLVED finding, re-run)

| Finding | Check re-run | Before | After |
|---|---|---|---|
| F-001 phone | `grep "4444 0085" src/` + Header render test | wrong number at `Header.tsx:236` | **0 matches**; Header renders `company.phone`; `tel:` = `tel:+97433260393` (test green) |
| F-002 skip-link | render `Layout`, query `a[href="#main-content"]` / `main#main-content` | both absent | **both present** (a11y-landmarks test green) |
| F-003 error boundary | grep `getDerivedStateFromError`; render a throwing child | none → white-screen | **boundary present**; throwing child → recovery panel (test green) |
| F-005 CSP | read `vercel.json` header key | `…-Report-Only` (no-op) | **`Content-Security-Policy`** (enforcing); report-only absent (test asserts) |
| F-007 headings | grep hero `<h3>` on the 6 pages | 6× `h1→h3` skips | **converted to `<p>`** (0 hero h3 remaining) |
| F-013 dead code | `ls` the 5 files / `ui/` dir | 5 dead files present | **all deleted**, `ui/` removed, `border-spin` CSS removed |
| F-014 mojibake | `grep â/گ/€ src/**` | 6,972 mojibake chars (4 files) | **0 in source** (only `.webp` binaries match) |
| F-017 tel spaces | inspect footer `tel:` | `tel:+974 3326 0393` | **`tel:+97433260393`** (test green) |
| F-018 FAQ clip | inspect HomePage open-state class | `max-h-48` (192px) | **`max-h-[1000px]`** |
| Test suite | `npx vitest run` | **11 passed** | **20 passed** (+9) |
| Build gate | `npm run build` (`tsc -b && eslint . && vite build`) | clean | **clean** |

---

## FINDINGS STATUS TABLE

| ID | Sev | Status | Note |
|---|---|---|---|
| F-001 | HIGH | **RESOLVED** | Header uses `company.phone`; wrong number retired (confirm Q1 if `4444 0085` was a real line) |
| F-002 | HIGH | **RESOLVED** | Bilingual skip-link → `main#main-content` |
| F-003 | HIGH | **RESOLVED** | ErrorBoundary around Outlet; `asArray` on flagged sites |
| F-004 | HIGH | **DEFERRED** | Social-card prerender needs a build step + new dep (Q2) |
| F-005 | MED | **RESOLVED** | CSP enforced — *needs live verification* (watch list) |
| F-006 | MED | **RESOLVED** | Accordion `aria-expanded`, showcase focus-expand, map pins keyboard-operable |
| F-007 | MED | **RESOLVED** | 6 hero subtitles `h3`→`p` |
| F-008 | MED | **DEFERRED** | Stock photos / "verified" claims / stats need your content (Q3) |
| F-009 | MED | **DEFERRED** | Privacy page + dead footer link need policy text (Q4) |
| F-010 | MED | **PARTIAL** | Hero preload gated on Save-Data/slow; `srcset`/recompress deferred (visual QA) |
| F-011 | MED | **RESOLVED** | Mobile `<nav>` landmark, Escape, `aria-controls`, i18n labels (no full focus-trap yet) |
| F-012 | LOW | **DEFERRED** | XL duplication refactor — separate focused pass |
| F-013 | LOW | **RESOLVED** | Dead subtree deleted; CLAUDE.md synced |
| F-014 | LOW | **RESOLVED** | All mojibake normalized (incl. ShopsPage, found in re-verification) |
| F-015 | LOW | **MITIGATED** | Boundary catches `to={undefined}` throws; per-site guards deferred |
| F-016 | LOW | **DEFERRED** | Real business hours unknown (Q5) |
| F-017 | LOW | **RESOLVED** | Footer `tel:` space-stripped |
| F-018 | LOW | **RESOLVED** | FAQ answer clip raised |
| F-019 | LOW | **DEFERRED** | Client error reporting needs a service + dep (Q6) |
| F-020 | NIT | **WON'T-FIX** | i18n `escapeValue:false` safe (React escapes; no `dangerouslySetInnerHTML`) |

Tally: **11 RESOLVED**, 1 PARTIAL, 1 MITIGATED, 6 DEFERRED, 1 WON'T-FIX.

---

## RESIDUAL RISK (what is still true and matters)

- **Blank social-share cards (F-004).** Sharing any URL on WhatsApp/Facebook/LinkedIn still shows no image/generic text — the SPA injects meta client-side and scrapers don't run JS. Googlebot (renders JS) is largely unaffected. Fix needs a prerender/SSG build step.
- **Stock listings presented as "100% verified" (F-008).** A live commercial trust/integrity concern; also an availability dependency on `images.unsplash.com`. Needs your real assets or a "sample listings" label.
- **No privacy policy on a PII-collecting site (F-009).** The contact form gathers name/phone/email; the footer "Privacy" link is dead and there's no page.
- **CSP is now enforced but unverified live (F-005).** If the policy misses a resource, something could fail to load in production — verify within the first hour (watch list). Fully reversible (`git revert`).
- **Maintainability debt remains (F-012).** FaqAccordion ×5, CTA ×5, area grid ×7, ~1,840-line data blob, inline bilingual copy — edits stay error-prone until extracted.
- **Contact delivery depends on WhatsApp.** No backend; if a visitor lacks WhatsApp there's no server-side capture (a serverless endpoint + honeypot is the long-term fix).
- **`class-variance-authority`** is now an unused dependency (trivial to drop).

---

## RANKED FOLLOW-UPS (in order, with effort)

1. **Answer Q1/Q5** and finish Batch 2 tail: confirm phone, set real hours in `company` (S).
2. **Batch 7 — content + privacy** (Q3/Q4): self-host real listing images or label as sample; add `/privacy` route (0.5–1d + content).
3. **Batch 8 — social prerender** (Q2): prerender/SSG so share cards work (1–2d).
4. **F-010 remainder**: `srcset`/`sizes` + recompress the >300 KB public images after visual QA (0.5–1d).
5. **Batch 10 — observability** (Q6): wire the ErrorBoundary to a reporter; add CSP `report-uri` (3–4h).
6. **Batch 9 remainder — F-012 refactor**: extract shared Accordion/CTA/AreaGrid, centralize area data, move inline bilingual copy into i18n (XL) — do with characterization tests.
7. **F-015 / focus-trap / aria-controls**: per-site array guards, mobile-menu focus trap, accordion `aria-controls` (M).

---

## 48-HOUR WATCH LIST (post-deploy)

| Watch | How | Rollback signal |
|---|---|---|
| **CSP enforcement** (F-005) | Load the deployed site; open DevTools console on 3–4 pages incl. home + a listing + contact | Any `Content-Security-Policy` violation error, missing images/styles, or JSON-LD not injecting → `git revert` the CSP commit |
| **Phone** (F-001) | Tap the header number on iOS Safari + Android Chrome | Dials anything other than +974 3326 0393 |
| **Lead flow** | Submit the contact form | WhatsApp doesn't open with fields prefilled |
| **Hero on mobile** (F-010) | Load home on a throttled/Save-Data phone | Hero blank (frame 0 should always show) or janky scrub on normal links |
| **404** | Visit `/does-not-exist` | Not the noindex 404 page |
| **A11y** | Tab from page top | "Skip to content" doesn't appear/work |

---

## DELIBERATE COMPROMISES (carried out of Stage 2)

- **Q1 phone** assumed `+974 3326 0393` correct; `4444 0085` retired — re-add (labeled) if it's a real second line.
- **`asArray` applied to flagged crash sites only**; the ErrorBoundary is the blanket protection for the rest.
- **F-006 accordions** got `aria-expanded` in-place (no shared component / `aria-controls` yet).
- **F-010** shipped the Save-Data preload gate only; responsive images deferred for visual QA.
- **F-011** shipped landmark + Escape, not a full focus-trap.
- **F-012** (the large refactor), **Batch 7/8/10** deferred pending your decisions/dependencies.

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

# 5. Manual: paste a deep link (e.g. /villas-for-rent/) into
#    https://developers.facebook.com/tools/debug/ — will show HOME/blank card
#    until the prerender step (F-004/Batch 8) lands. Expected known gap.

# 6. Manual: Lighthouse (mobile) on / and /contact-us/ — check LCP < 2.5s,
#    CLS < 0.1, and the Accessibility score (skip-link + headings should help).
```

---

*Generated as the Stage 3 output of the v3 re-audit. Prior-cycle `FINAL_REPORT.md` retained separately at operator request.*
