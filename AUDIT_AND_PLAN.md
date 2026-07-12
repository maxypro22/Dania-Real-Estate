# AUDIT_AND_PLAN.md — Dania Real Estate

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT **v3** · Stage 1 (read-only)
Date: 2026-07-11 · Branch at audit: `audit/remediation` · Product: bilingual (EN/AR) real-estate marketing SPA for a Doha property-management company · Deployment: presumed live (Vercel static).
Note: this is a **re-audit**. A prior remediation cycle already ran on this branch (10 commits; `FINAL_REPORT.md` claims OVERALL 7.4). Per Rule 11 those numbers are treated as **claims**; every score and finding below was independently re-verified against the current working tree this session.

---

## SCORE TABLE — BEFORE (current state, re-verified)

```
Area                     Before   Weight
Security          S        7        3
Errors/Robust     E        6        3
Clean Code        C        5        2
Performance       P        7        2
Images/Assets     IMG      7        1.5
Accessibility     A11Y     5        1.5
Responsive        R        8        1
SEO               SEO      6        1
Testing           T        6        2
Content/Release   CR       6        1
Load/Stress       LT       —        —     (N/A — no server request path)
----------------------------------------------------
OVERALL                    6.3
```
Weight math (ΣW = 18): `(7·3 + 6·3 + 5·2 + 7·2 + 7·1.5 + 5·1.5 + 8·1 + 6·1 + 6·2 + 6·1) / 18 = 113 / 18 = 6.28 ≈ 6.3`

**Plain-language verdict:** The site is fast, clean-building, and safe from the classic web attacks — but it ships **two different phone numbers**, has **no keyboard skip-link and several inaccessible menus/accordions**, **can white-screen from a single missing translation key** (no error boundary), and its **social-share previews are blank** because it's a client-only SPA. None of these lose data; the phone-number mismatch is the one that quietly costs the business leads.

**Deploy verdict: `SAFE WITH CAVEATS`** — nothing here corrupts data or exposes a secret, but the wrong phone number and the missing error boundary should be fixed before this is considered done.

> **Why this is below the prior report's 7.4:** the earlier cycle scored Clean Code 7 and A11Y 7. Both agents this session independently found the page-level duplication (FaqAccordion ×5, CTA banner ×5, area grid ×7, a 1,840-line data blob) is still fully present, and there is still no skip-link and multiple accordion/heading a11y gaps. A re-verified 5 beats a fabricated 7 (Rule 13).

---

## EXECUTIVE SUMMARY

Dania Real Estate is a React 19 + TypeScript SPA (Vite 8, Tailwind v4, React Router v7, i18next EN/AR) deployed as static assets on Vercel with **no backend**. It is a marketing/lead-gen site: the "contact form" hands the lead off to WhatsApp client-side, and all listings are mock data. Code quality gate (`tsc -b && eslint . && vite build`) **passes clean**; the Vitest suite (11 tests) **passes**.

The prior remediation cycle genuinely fixed the big things: the multi-megabyte image payload is gone, images are dimensioned, security headers are set, a test harness exists, and the contact hand-off has an honest popup-blocked fallback. What remains splits into three buckets:

1. **Correctness/trust that costs the business now** — the header advertises `+974 4444 0085` while the entire rest of the site uses `+974 3326 0393`; a customer who taps the header number reaches the wrong line.
2. **Robustness & accessibility gaps** — no React error boundary (one bad `t()` key white-screens the app), no skip-link, five FAQ accordions and a homepage showcase that are invisible/inoperable to keyboard & screen-reader users.
3. **Maintainability & reach** — pervasive copy-paste across the large page files and hardcoded bilingual strings make edits error-prone (this is the root of the mojibake and EN/AR drift), and the client-only rendering means Facebook/WhatsApp/LinkedIn share cards are blank for every URL.

The three most likely to hurt the operator: **(1)** wrong phone number → lost leads; **(2)** missing error boundary → a future content edit takes the whole site white; **(3)** blank social cards → shared links look broken and convert worse.

---

## FINDINGS REGISTER
Sorted by severity, then effort. IDs are stable.

### F-001 — Header advertises a different phone number than the rest of the site
- **Severity:** HIGH  **Domain:** D18 — Content/Release (also D1)
- **Location:** `src/components/layout/Header.tsx:233-237`
- **Evidence:**
  ```tsx
  <a href="tel:+97444440085" ...>
    <Phone size={13} className="text-lime shrink-0" />
    <span dir="ltr">+974 4444 0085</span>
  ```
- **Fact:** The header top-bar hardcodes `+974 4444 0085`. Every other channel uses `company.phone = '+974 3326 0393'` / `whatsapp = '97433260393'` (`src/data/mockData.ts:83-85`), including the Footer, ContactPage, and both i18n FAQ answers (`en.json:190,290`, `ar.json:229,447`).
- **Means:** The phone number at the top of every page is different from the one everywhere else.
- **Impact:** A visitor who taps the most prominent number reaches the wrong line — silently lost leads on a site whose entire purpose is lead capture. It is also hardcoded, bypassing the single source of truth.
- **Root cause:** Number typed inline instead of read from `company`.
- **Fix:** Decide which number is correct (see Decision Q1), put it in `company`, and reference `company.phone` (space-stripped for the `tel:` href). 
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-002 — No skip-to-content link; `<main>` has no id
- **Severity:** HIGH  **Domain:** D14 — Accessibility
- **Location:** `src/components/layout/Layout.tsx:24-31` (and confirmed absent from `Header.tsx` / `index.css`)
- **Evidence:**
  ```tsx
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
  ```
- **Fact:** There is no skip link anywhere and `<main>` has no `id`. The only landmark a keyboard user lands on is the header.
- **Means:** Keyboard and screen-reader users must tab through the entire top bar and full nav on every single page before reaching content.
- **Impact:** WCAG 2.2 **2.4.1 (Bypass Blocks)** failure — a baseline a11y requirement.
- **Root cause:** Skip-link pattern never added.
- **Fix:** Give `<main id="main-content">` and render a visually-hidden-until-focused `<a href="#main-content">` as the first focusable element in `Layout`.
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-003 — No React error boundary; unguarded `returnObjects` maps can white-screen the app
- **Severity:** HIGH  **Domain:** D1/D9 — Correctness & Resilience
- **Location:** No `ErrorBoundary`/`getDerivedStateFromError`/`errorElement` anywhere (grep clean). Fragile maps e.g. `src/pages/HomePage.tsx:61`, `src/pages/StudiosPage.tsx:918-1002`, `ApartmentsPage.tsx:98`, `StaffAccommodationPage.tsx:263`.
- **Evidence:**
  ```tsx
  // HomePage.tsx:61
  const journeySteps = t('home.journey.steps', { returnObjects: true }) as Array<{...}>
  // StudiosPage guard is length-only — a string also has .length, so .map() still throws
  ```
- **Fact:** Many pages cast `t(key, {returnObjects:true})` to an array and `.map()` it. If a key is ever missing/renamed, i18next returns the **string** key; `.map()` throws. With no error boundary, any thrown render error blanks the whole SPA (`main.tsx` renders `<App/>` with a Suspense fallback but no error fallback).
- **Means:** One mistyped translation key = the entire website goes blank, not just one section.
- **Impact:** Currently latent (EN/AR key parity is 462/462, verified), but this is a live white-screen vector the moment anyone edits `en.json`/`ar.json`. No graceful degradation.
- **Root cause:** No error boundary; unchecked `returnObjects` casts.
- **Fix:** Add a top-level `ErrorBoundary` around the routed `<Outlet/>` with an on-brand fallback; add an `asArray()` helper that returns `[]` when the value isn't an array, and route the `returnObjects` reads through it.
- **Effort:** M  **Fix risk:** Low  **Confidence:** High

### F-004 — Client-only rendering: social-share cards are blank for every URL
- **Severity:** HIGH  **Domain:** D17 — SEO/Meta
- **Location:** `index.html:1-19` (0 OG/Twitter tags), `src/components/shared/Seo.tsx:52-69` (all OG/Twitter injected in `useEffect`), `src/main.tsx` (client `createRoot`, no SSR/SSG).
- **Evidence:** `grep -c "og:|twitter:" index.html` → `0`. Every card tag is set client-side after hydration.
- **Fact:** The served HTML is one static shell (home `<title>`/description/canonical only). All per-page `<title>`, OG, Twitter, and JSON-LD are injected by JavaScript at runtime.
- **Means:** When someone shares any page on WhatsApp/Facebook/LinkedIn, the preview has no image and generic text, because those scrapers don't run JavaScript.
- **Impact:** Broken/blank share previews for 100% of URLs → lower click-through on shared links. Googlebot renders JS so organic indexing is largely unaffected; social + non-JS crawlers are.
- **Root cause:** SPA with no prerender/SSG step.
- **Fix:** Add a build-time prerender/SSG pass (e.g. `vite-plugin-prerender`/`react-snap`, or migrate routes to a static export) emitting per-route HTML with baked meta. Requires a new dependency + build step — see Decision Q2.
- **Effort:** L  **Fix risk:** Med (build pipeline change)  **Confidence:** High

### F-005 — Content-Security-Policy is report-only with no reporting endpoint (a no-op)
- **Severity:** MEDIUM  **Domain:** D4 — Security: Config
- **Location:** `vercel.json:14`
- **Evidence:**
  ```json
  { "key": "Content-Security-Policy-Report-Only", "value": "default-src 'self'; ... script-src 'self'; style-src 'self' 'unsafe-inline'; ..." }
  ```
- **Fact:** The CSP is `-Report-Only` and contains no `report-uri`/`report-to`. Report-only does not enforce; with no reporting endpoint it also collects nothing.
- **Means:** The security policy that's supposed to block script injection is switched off and isn't even recording what it would block.
- **Impact:** No XSS mitigation from CSP is actually active. It reads as "we have a CSP" while providing zero protection.
- **Root cause:** Correctly deferred enforcement (JSON-LD/inline-style concerns) but never followed through to enforce or to wire reporting.
- **Fix:** Add a `report-to`/`report-uri` endpoint, observe for a short window, then promote to enforcing `Content-Security-Policy`. The injected JSON-LD uses `textContent` (safe) and styles are inline (`'unsafe-inline'` already allowed), so enforcement is low-risk. 
- **Effort:** M  **Fix risk:** Med — an over-tight policy can break rendering; test in report-only with an endpoint first.  **Confidence:** High

### F-006 — FAQ accordions & interactive widgets not exposed to assistive tech / keyboard
- **Severity:** MEDIUM  **Domain:** D14 — Accessibility
- **Location:** `ApartmentsPage.tsx:29-38`, `VillasPage.tsx:113-122`, `ShopsPage.tsx:26-35`, `StaffAccommodationPage.tsx:92-101` (accordion buttons, no `aria-expanded`/`aria-controls`); `HomePage.tsx:522-528` (showcase panels are `<div onClick>` with no `role`/`tabIndex`/key handler); `AreasPage.tsx:508-513` (Qatar-map `<g>` pins, mouse/touch only).
- **Evidence:**
  ```tsx
  // HomePage.tsx:522-528 — desktop showcase accordion
  <div onMouseEnter={...} onTouchStart={...} onClick={() => setActiveShowcase(i)}
       style={{ flex: isActive ? '4 1 0%' : '1 1 0%' }} className="... cursor-pointer ...">
  ```
- **Fact:** Multiple expand/collapse and map controls are operable only by mouse/touch and/or announce no state.
- **Means:** Keyboard and screen-reader users can't open several FAQ sections, the homepage showcase, or the area map.
- **Impact:** WCAG 2.2 **2.1.1 (Keyboard)** and **4.1.2 (Name, Role, Value)** failures across the most-visited pages. (Note: `HomePage.tsx:583` and `AreaDetailPage.tsx:2503` already do this correctly — the pattern exists, it's just not applied uniformly.)
- **Root cause:** Accordions/panels hand-rolled per page without the a11y attributes.
- **Fix:** Extract one accessible accordion (button + `aria-expanded`/`aria-controls`, `<Panel role="region">`); make showcase panels real `<button>`s; give map pins `role="link"`/`tabIndex`/`onKeyDown`/accessible name (the bottom-panel `<Link>` already provides a fallback path).
- **Effort:** M  **Fix risk:** Low  **Confidence:** High

### F-007 — Heading hierarchy skips h1 → h3 on ~5 pages
- **Severity:** MEDIUM  **Domain:** D14/D17
- **Location:** `AreasPage.tsx:671→677`, `ApartmentsPage.tsx:584`, `StaffAccommodationPage.tsx:236` & `:890`, `ShopsPage.tsx:73`, `AreaDetailPage.tsx:2070`.
- **Evidence:** hero `<h1>` immediately followed by an `<h3>` used as a tagline (the data key is even named `h3`), with no `<h2>` in between.
- **Fact:** Subtitles are marked up as `<h3>`, skipping the `<h2>` level.
- **Means:** Screen-reader users navigating by heading hear a broken outline; search engines see a malformed structure.
- **Impact:** WCAG 1.3.1 + SEO structure weakness. (`StudiosPage.tsx:975` already uses `<p>` correctly.)
- **Fix:** Change hero subtitles to `<p>` (or a proper `<h2>` where it genuinely is a section heading).
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-008 — Stock photos + unverified claims presented as verified real inventory
- **Severity:** MEDIUM  **Domain:** D18 — Content (also D10 availability)
- **Location:** `src/data/mockData.ts:21-37` (17 `images.unsplash.com` listing photos), `HomePage.tsx:41-44`/`:236`/`:484` (showcase stock + "cross-check real-time pricing"), claims: `mockData.ts:55,67`, `AreaDetailPage.tsx:131,956,1360,1874`, `VillasPage.tsx:26,38` ("100% verified"/"personally checked"), `HomePage.tsx:74-76` ("48hr Approval Guarantee"), `mockData.ts:92-94` ("500+", "2,000+", "15+").
- **Fact:** All listings are Unsplash stock photos hotlinked at runtime with fabricated prices/areas, while the copy repeatedly asserts every property is "100% verified" and "physically verified by our team."
- **Means:** The demo listings are stock photos, but the site tells visitors they're real, verified properties.
- **Impact:** Trust/legal-integrity risk on a live commercial site; also an availability dependency (if Unsplash throttles hotlinking the grid breaks). 37 unsplash refs total across `mockData`/`HomePage`/`GalleryPage`.
- **Fix:** Operator decision (Q3): supply real listing assets + honest stats, or clearly mark the grid as representative/sample. Then self-host the chosen images (removes the third-party dependency).
- **Effort:** M (+content)  **Fix risk:** Low  **Confidence:** High

### F-009 — Dead "Privacy" link and no privacy policy on a PII-collecting site
- **Severity:** MEDIUM  **Domain:** D18 (also D15 compliance)
- **Location:** `src/components/layout/Footer.tsx:120`; no `privacy`/`terms` page exists in `src/pages`.
- **Evidence:**
  ```tsx
  <span className="hover:text-white cursor-pointer transition-colors">{t('footer.privacy')}</span>
  ```
- **Fact:** "Privacy" is a `<span>` styled like a link with `cursor-pointer` but no `href`/handler and no target page. The contact form collects name, phone, and email.
- **Means:** The Privacy link looks clickable but does nothing, and there's no privacy policy at all.
- **Impact:** Dead affordance (also not keyboard-focusable) + a compliance gap for a site capturing personal data.
- **Fix:** Add a real Privacy Policy route and make the footer entry a `<Link>` (Q4 for policy content).
- **Effort:** M (+content)  **Fix risk:** Low  **Confidence:** High

### F-010 — Hero ships ~4.9 MB of frame images on every home visit; no responsive images anywhere
- **Severity:** MEDIUM  **Domain:** D10 — Performance / Images
- **Location:** `src/components/shared/HeroSequence.tsx:10-15,75-83` (120 webp frames, ~4.9 MB total, idle-loaded in batches of 8); public images up to 730 KB (`public/compound-villas-for-rent-doha-qatar.webp`); no `srcset`/`sizes` in any `<img>`.
- **Fact:** Frame 0 is the LCP paint (good); the other 119 frames (~4.9 MB) are fetched on idle on every homepage visit regardless of whether the user scrolls. No image uses responsive `srcset`/`sizes`, so phones download desktop-sized assets.
- **Means:** Every homepage visitor quietly downloads ~5 MB of scroll-animation frames, and mobile users get full-size images.
- **Impact:** Wasted bandwidth (costly on mobile data), background network contention; largest single image is 730 KB served to a ~460 px box.
- **Fix:** Gate frame preloading on Save-Data/connection and on the hero actually being in view; consider reducing frame count or resolution; add `srcset`/`sizes` (or `<picture>`) for the public hero images and recompress the >300 KB ones.
- **Effort:** M  **Fix risk:** Low  **Confidence:** High

### F-011 — Mobile menu: no nav landmark, no Escape/focus management, hardcoded English labels
- **Severity:** MEDIUM  **Domain:** D14 — Accessibility
- **Location:** `src/components/layout/Header.tsx:281` (desktop `<nav>`) vs `:324-380` (mobile menu in a bare `<div>`), `:339` (`aria-label={isExpanded ? 'Collapse' : 'Expand'}`).
- **Fact:** The `<nav>` landmark wraps only the ≥1280 px desktop menu; the mobile menu (the only nav on phones/tablets) is a `<div>` with no landmark, no Escape-to-close, and no focus move into the panel. Its expand chevrons use hardcoded English `'Collapse'`/`'Expand'` while the rest of the UI is i18n'd.
- **Means:** On phones there's no "navigation" landmark for screen readers, the menu can't be closed with Escape, and Arabic users get English button labels.
- **Impact:** WCAG 1.3.1/2.1.2 gaps on the primary mobile navigation.
- **Fix:** Wrap the mobile menu in `<nav aria-label>`, add Escape handling + focus management (mirror the desktop dropdown's `:197-209`), and route the labels through `t()`.
- **Effort:** M  **Fix risk:** Low  **Confidence:** High

### F-012 — Pervasive duplication across the large page files
- **Severity:** LOW (maintainability, not shipping risk)  **Domain:** D7/D8
- **Location:** FaqAccordion re-implemented ×5 (`ApartmentsPage.tsx:22-49`, `VillasPage.tsx:106-133`, `ShopsPage.tsx:17-46`, `StaffAccommodationPage.tsx:86-111`, `StudiosPage.tsx:880-901`); final-CTA banner ×5; 8-area card grid ×~7; the 8-area dataset re-declared in 5 files; `AREA_DETAIL` is ~1,840 lines (`AreaDetailPage.tsx:117-1959`) with byte-identical `nearby` blurbs repeated; bilingual copy hardcoded as inline `isAr ? '…' : '…'` at large scale.
- **Fact:** The seven page files (17,928 LOC total; largest 2,568) are substantially copy-paste, and localized strings live inline rather than in i18n.
- **Means:** Changing one shared piece of UI or copy means editing it in 5–7 places by hand.
- **Impact:** This is the dominant maintainability risk and the **root cause** of F-014 (mojibake) and EN/AR drift (F-016, the D18 EN/AR inconsistency at `ApartmentsPage.tsx:504/525`).
- **Fix:** Extract shared `Accordion`, `FinalCtaBanner`, `AreaGrid` components (partly exists — `ApartmentsPage.tsx:52-89` `FinalCtaBanner`); centralize the area dataset; migrate inline bilingual copy into i18n. Large, staged, behavior-preserving.
- **Effort:** XL  **Fix risk:** Med — big diff; needs characterization first.  **Confidence:** High

### F-013 — Dead component subtree shipped in the repo
- **Severity:** LOW  **Domain:** D8
- **Location:** `src/components/shared/ListingCard.tsx`, `PropertyCard.tsx`, `SearchBar.tsx`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx` — none imported by any live page (grep-verified; they only reference each other).
- **Fact:** These are unused (tree-shaken out of the build, so they don't reach users), but they contain latent bugs if revived: `ListingCard` renders a `cursor-pointer` card that isn't a link/focusable; `SearchBar`'s Search button has no handler and its `useState` snapshots translated strings (stale on language switch); `button.tsx:6` does `focus-visible:outline-none` with no ring restored.
- **Means:** Dead code that looks live — a trap for the next developer, and it contradicts CLAUDE.md which lists them as active shared components.
- **Impact:** Maintainability/confusion only; no user impact.
- **Fix:** Delete the unused files (or, if intended for use, wire them up and fix the inert affordances + focus ring). Confirm against CLAUDE.md before deleting.
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-014 — Mojibake (encoding corruption) in section-separator comments
- **Severity:** LOW  **Domain:** D8/D18
- **Location:** `VillasPage.tsx` (e.g. `:918,920`), `StaffAccommodationPage.tsx` (e.g. `:790,879,1422`), `StudiosPage.tsx` (e.g. `:851,878,966`).
- **Evidence:** `{/* â•گâ•گâ•گ… */}` where clean files use `{/* ═══ */}`.
- **Fact:** Box-drawing characters in comments are corrupted (double-encoded UTF-8/Windows-1256), verified by direct read.
- **Means:** Some files were saved with the wrong encoding at some point; only comments are affected.
- **Impact:** None at runtime (comments are stripped); a signal of the encoding hazard that the inline-Arabic pattern (F-012) creates.
- **Fix:** Normalize the comment separators; ensure editors save UTF-8. Do alongside F-012.
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-015 — Index-coupled parallel arrays can render `to={undefined}`
- **Severity:** LOW  **Domain:** D1
- **Location:** `ApartmentsPage.tsx:252,267,330,444`, `AreaDetailPage.tsx:2189,2201`, `StudiosPage.tsx:1137,1164`, `WhyChooseUsPage.tsx:318,334,394`, `GalleryPage.tsx:203`.
- **Fact:** Code maps over a translated array but indexes a separate fixed-length const array of hrefs/icons with `arr[i]` and no length invariant. If a translation array grows, `arr[i]` is `undefined` → `<Link to={undefined}>` or `<Icon/>` throws.
- **Means:** Adding an item to a translated list without adding the matching icon/link crashes or mis-links the section.
- **Impact:** Latent; safe today because lengths currently match. Widespread `key={i}` in `.map` is a related minor smell.
- **Fix:** Co-locate icon/href with the data, or guard with `i % arr.length` / fallback (some code already does `i % len` correctly).
- **Effort:** M  **Fix risk:** Low  **Confidence:** High

### F-016 — Inconsistent business-hours copy (three variants)
- **Severity:** LOW  **Domain:** D18
- **Location:** `Header.tsx:231` (`Sat–Thu · 8AM–5PM`), `mockData.ts:88` (`footerHours: '24/7 Professional Rental Assistance'`), `ar.json` FAQ (Sat–Thu 8am–8pm), `ContactPage.tsx:30` (Sat–Thu 8–5, Fri closed).
- **Fact:** At least three different statements of opening hours ship simultaneously with no single source of truth.
- **Means:** The site tells visitors different things about when it's open.
- **Fix:** Pick the correct hours (Q5), store once in `company`, reference everywhere.
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-017 — Footer `tel:` link contains spaces
- **Severity:** LOW  **Domain:** D1/D14
- **Location:** `src/components/layout/Footer.tsx:109` — `href={`tel:${company.phone}`}` → `tel:+974 3326 0393`.
- **Fact:** `company.phone` has spaces; the footer uses it raw in the `tel:` URI. `ContactPage.tsx:101` strips spaces (`.replace(/\s/g,'')`); the footer does not.
- **Means:** Some dialers mishandle spaces in `tel:` links.
- **Fix:** Strip whitespace for the `tel:` href (fold into the F-001 phone cleanup).
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-018 — HomePage FAQ answers clipped to 192 px
- **Severity:** LOW  **Domain:** D1/UX
- **Location:** `src/pages/HomePage.tsx:591` — open panel is `max-h-48` (192 px) with `overflow-hidden`, no scroll.
- **Fact:** Any FAQ answer taller than 192 px is silently cut off.
- **Means:** Longer answers get visually truncated with no way to read the rest.
- **Impact:** Current answers are short so it doesn't bite yet; latent.
- **Fix:** Use `grid-template-rows` 0fr→1fr or `max-h-[1000px]`/measured height for the open state.
- **Effort:** S  **Fix risk:** Low  **Confidence:** High

### F-019 — No client-side error/observability reporting
- **Severity:** LOW  **Domain:** D13
- **Location:** whole app — no error reporting wired.
- **Fact:** A static site with no error tracking; the error boundary from F-003 should report to something.
- **Means:** If the site breaks for a real user, no one finds out unless they report it.
- **Fix:** Wire the F-003 error boundary (and a `window.onerror`/`unhandledrejection` hook) to a lightweight reporter (e.g. Sentry free tier) — gated to production. Needs a new dependency (Q6).
- **Effort:** M  **Fix risk:** Low  **Confidence:** Med

### F-020 — i18n `escapeValue: false` (latent constraint, not a live bug)
- **Severity:** NIT  **Domain:** D2
- **Location:** `src/i18n/index.ts:19`.
- **Fact:** i18next output escaping is off. Safe **today** because React escapes JSX and there is no `dangerouslySetInnerHTML` in the codebase (grep clean).
- **Means:** Fine now; would become an XSS vector if anyone ever renders a translated string as raw HTML.
- **Fix:** Leave as-is (React's default). Documented so it isn't reintroduced unsafely. Likely **WON'T-FIX**.
- **Effort:** S  **Confidence:** High

---

## ATTACK SURFACE SUMMARY
Internet-facing but **no server request path**: static assets on Vercel's CDN, client-side routing, and a contact form that opens `wa.me` in a new tab. No backend, DB, auth, uploads, or user input reaching a server. The realistic surface is: (a) client-side XSS — mitigated by React's escaping and the absence of `dangerouslySetInnerHTML`; CSP would add defense-in-depth but is currently a no-op (F-005); (b) third-party availability — Unsplash hotlinking (F-008); (c) header hygiene — mostly present (HSTS, X-Frame, X-CTO, Referrer, Permissions-Policy). No secrets in code (grep clean), no prod source maps.

## SYSTEMIC PATTERNS (root causes behind the findings)
1. **Hand-rolled-per-page instead of shared components** — accordions, CTA banners, area grids, and the area dataset are duplicated 5–7× (F-012), which directly causes the mojibake (F-014), the a11y inconsistency (F-006/F-007), and EN/AR drift.
2. **Inline bilingual strings instead of i18n** — huge `isAr ? … : …` blocks bypass the (otherwise complete, 462/462) i18n system, making copy edits error-prone.
3. **Values typed inline instead of read from the single source (`company`)** — the wrong phone number (F-001), spaced `tel:` (F-017), and inconsistent hours (F-016) all stem from this.
4. **Affordance without behavior/semantics** — clickable divs, dead links, and non-labeled controls (F-006, F-009, F-013) — the visual is built before the interaction contract.
5. **No safety net** — no error boundary and no observability (F-003/F-019), so latent fragilities fail loudly and invisibly.

## WHAT IS GENUINELY GOOD
- Build gate is real and green: `tsc -b && eslint .` runs **before** `vite build`; lint is enforced. 11 Vitest tests pass, including the critical lead-capture WhatsApp hand-off and its popup-blocked fallback (`ContactPage.tsx:62-69`) — an honest success state, not a fake one.
- Per-route code splitting; images below the fold are lazy-loaded **and** dimensioned (CLS reserved); reduced-motion is respected globally.
- SEO copy is strong and per-page; JSON-LD (RealEstateAgent/WebSite/Contact/FAQ) is injected safely via `textContent` (`Seo.tsx:80`); `sitemap.xml` is complete and matches the routes; `robots.txt` is sane.
- Security headers are present; no secrets, no prod source maps, no `console.log`/`TODO`/`href="#"` in shipped code; i18n EN/AR key parity is exact (462/462).
- Unknown routes correctly render a `noindex` 404 (`NotFoundPage.tsx`) and legacy `/contact/` 301s to `/contact-us/`.

## BLIND SPOTS & ASSUMPTIONS
- **ASSUMPTION:** The correct company phone is `+974 3326 0393` (it's the one used in 6 places); `+974 4444 0085` is assumed to be a stale/typo'd office line — **needs confirmation** (Q1).
- **ASSUMPTION:** Marketing stats ("500+ properties", "2,000+ clients", "15+ years", "48hr guarantee", "100% verified") are real commitments — unverifiable from code.
- **BLIND SPOT:** No live URL was tested this session; header enforcement, real CWV field data, and social-scraper behavior are inferred statically (confirmable post-deploy).
- **BLIND SPOT:** Visual/responsive correctness and cross-browser rendering were assessed from code, not a running browser or device lab.
- **NOT RUN:** Load/stress testing — N/A, no server request path (revisit if a form/API backend is ever added).

---

## REMEDIATION PLAN

**Strategy.** The end state is: touched areas meet the Definition of Done. We fix in risk order — the lead-losing content bug and the app-wide fragilities first (cheap, high value), then accessibility, then the two decisions that need operator input (social prerender, real listing content), and finally the large maintainability refactor. Because the pages are near-duplicates, several fixes (accordion a11y, heading levels, CTA/area-grid extraction) are best done **once in a shared component and reused**, which is why F-006/F-007 partly ride on the F-012 refactor — but each is shippable independently first as a targeted fix. Every behavior change ships with a Vitest regression test that fails before and passes after; the existing green build/lint/test gate is the guardrail.

Batches are independently shippable and never mix a behavior change with a pure refactor.

```
## Batch 1 — Test-harness top-up for code about to change   [test]
Fixes:        precondition for B2/B3/B6
Goal:         Characterization tests around the pieces later batches touch.
Files:        src/**/__tests__/* (new), src/lib/asArray.ts (new helper, tested)
Precondition: existing 11 tests green (verified)
Steps:        1. Test that company phone is used by Header/Footer (will fail on F-001).
              2. Test asArray() returns [] for a string, passthrough for arrays.
              3. Snapshot the routes render without throwing (guards F-003).
Acceptance:   - [ ] new tests run in `npm test`; the F-001 assertion fails (red) pre-fix
Tests added:  header-phone.test, asArray.test, routes-smoke.test
Risk:         Low — Blast radius: test-only
Effort:       2–3h

## Batch 2 — Single source of truth: phone, tel:, hours       [bugfix]
Fixes:        F-001, F-017, F-016
Goal:         Every phone/hours reference reads from `company`; tel: has no spaces.
Files:        src/data/mockData.ts, src/components/layout/Header.tsx, Footer.tsx
Steps:        1. Set correct number (per Q1) + `hours` in company. 2. Replace inline
              header number & hours. 3. Space-strip all tel: hrefs.
Acceptance:   - [ ] only one phone number appears sitewide (grep) - [ ] Batch-1 phone test green
Tests added:  header-phone (now passes), hours-consistency
Risk:         Low — Blast radius: header/footer render
Effort:       1–2h

## Batch 3 — Resilience: error boundary + safe returnObjects   [bugfix]
Fixes:        F-003, F-015, F-018
Goal:         One bad key/array can't white-screen the app; no undefined links.
Files:        src/components/shared/ErrorBoundary.tsx (new), src/App.tsx,
              src/lib/asArray.ts, the pages listed in F-003/F-015, HomePage.tsx:591
Steps:        1. ErrorBoundary with on-brand fallback around <Outlet/>. 2. Route
              returnObjects reads through asArray(). 3. Guard index-coupled arrays.
              4. Fix FAQ max-height clip.
Acceptance:   - [ ] deleting a test key renders the fallback, not a blank page
Tests added:  errorboundary.test (throws → fallback), asArray usage test
Risk:         Low/Med — Blast radius: app root + several pages
Effort:       4–6h

## Batch 4 — Accessibility pass                                 [bugfix]
Fixes:        F-002, F-006, F-007, F-011
Goal:         Keyboard + screen-reader can reach content, operate menus/accordions.
Files:        Layout.tsx, index.css, Header.tsx, a shared Accordion, AreasPage.tsx,
              HomePage.tsx, the 5 FAQ pages, the h1→h3 pages
Steps:        1. Skip-link + <main id>. 2. Shared accessible Accordion (aria-expanded/
              controls) used by all FAQ pages. 3. h3→p hero subtitles. 4. Showcase
              panels → buttons; map pins keyboard-operable. 5. Mobile menu: <nav>,
              Escape, focus mgmt, i18n labels.
Acceptance:   - [ ] Tab from top reaches "skip to content"; all accordions operable by
              keyboard and announce state; no h1→h3 skips (axe/manual)
Tests added:  accordion-a11y.test (aria-expanded toggles), skiplink.test
Risk:         Low — Blast radius: nav + accordions
Effort:       1–1.5d

## Batch 5 — Security: enforce CSP                              [security]
Fixes:        F-005
Goal:         A real, enforced CSP with reporting.
Files:        vercel.json, src/__tests__/csp-header.test.ts
Steps:        1. Add report-to/report-uri. 2. Verify report-only clean against the
              running JSON-LD/inline-style usage. 3. Promote to enforcing CSP.
Acceptance:   - [ ] response carries enforcing CSP; site renders; csp test updated
Risk:         Med — Blast radius: could block rendering if too tight; staged via report-only
Effort:       3–4h

## Batch 6 — Performance / images                              [perf]
Fixes:        F-010
Goal:         Stop shipping ~5 MB of hero frames unconditionally; responsive images.
Files:        HeroSequence.tsx, public/* heroes, the <img> tags on hero sections
Steps:        1. Gate frame preload on in-view + Save-Data/connection. 2. Reduce frame
              count/res if acceptable. 3. srcset/sizes (or <picture>) for hero images;
              recompress >300 KB assets.
Acceptance:   - [ ] home does not fetch all 120 frames when hero never scrolled (Network)
              - [ ] largest image ≤ ~250 KB at mobile widths
Risk:         Low/Med — Blast radius: hero visual; verify scrub still smooth
Effort:       0.5–1d

## Batch 7 — Content & compliance                              [chore + content]
Fixes:        F-008, F-009  (needs Q3/Q4)
Goal:         Honest inventory + a privacy policy; drop third-party image dependency.
Files:        mockData.ts, GalleryPage.tsx, HomePage.tsx, new PrivacyPage + route,
              Footer.tsx, public/* (self-hosted images)
Steps:        1. Per Q3: real assets/stats or mark sample; self-host chosen images.
              2. Per Q4: add Privacy route; make footer a <Link>.
Acceptance:   - [ ] no images.unsplash.com at runtime - [ ] /privacy renders & is linked
Risk:         Low — Blast radius: content + one route
Effort:       0.5–1d (excl. content authoring)

## Batch 8 — SEO: prerender for social cards                   [perf/seo]
Fixes:        F-004  (needs Q2)
Goal:         Per-route static HTML with baked meta for non-JS scrapers.
Files:        vite.config.ts / build pipeline, package.json (new dep)
Steps:        1. Add prerender/SSG step. 2. Verify OG/title baked per route in dist.
Acceptance:   - [ ] curl of a deep-link URL shows correct og:title/og:image in raw HTML
Risk:         Med — Blast radius: build pipeline
Effort:       1–2d

## Batch 9 — Dead code + maintainability refactor             [refactor]
Fixes:        F-013, F-014, F-012 (staged)
Goal:         Delete dead subtree; normalize encoding; extract shared components;
              migrate inline bilingual copy to i18n.
Files:        remove ListingCard/PropertyCard/SearchBar/ui(button,card) if confirmed
              dead; VillasPage/Studios/Staff comments; shared Accordion/CTA/AreaGrid;
              en.json/ar.json (moved copy)
Precondition: Batch 1 characterization tests exist for pages being refactored
Steps:        1. Delete dead files (confirm vs CLAUDE.md). 2. Fix mojibake. 3. Extract
              components incrementally, one type at a time, keeping build green.
Acceptance:   - [ ] build/lint/test green after each extraction - [ ] no behavior change
Risk:         Med — Blast radius: large; do last, incrementally
Effort:       XL (3d+)

## Batch 10 — Observability                                    [chore]
Fixes:        F-019  (needs Q6)
Goal:         Production error reporting behind the error boundary.
Files:        ErrorBoundary.tsx, main.tsx
Effort:       3–4h
```

**Explicitly Out of Scope**
- **F-020 (i18n escapeValue):** WON'T-FIX — safe as-is; documented so it isn't reintroduced unsafely.
- **Load/stress testing:** N/A — no server request path. Revisit only if a backend/API is added.
- **Full rewrite of the page files:** rejected — the pages work; incremental extraction (Batch 9) is the correct, lower-risk path.
- **Migrating off React Router to a full SSG framework:** out of scope unless F-004/Batch 8 proves a plugin insufficient.

**Sequencing table**
| Batch | Type | Effort | Risk | Depends on |
|------|------|--------|------|-----------|
| 1 | test | 2–3h | Low | — |
| 2 | bugfix | 1–2h | Low | 1, Q1 |
| 3 | bugfix | 4–6h | Low/Med | 1 |
| 4 | bugfix | 1–1.5d | Low | 1 |
| 5 | security | 3–4h | Med | — |
| 6 | perf | 0.5–1d | Low/Med | — |
| 7 | content | 0.5–1d | Low | Q3, Q4 |
| 8 | seo | 1–2d | Med | Q2 |
| 9 | refactor | 3d+ | Med | 1, 4 |
| 10 | chore | 3–4h | Low | 3, Q6 |

---

## PROJECTED AFTER (if the full plan executes)

```
Area              Before  Proj. After   Drivers
Security   S        7         8         CSP enforced + reporting (B5); self-hosted images (B7)
Errors/Rob E        6         8         Error boundary + asArray guards (B3)
Clean Code C        5         7         Dead-code removal + shared components (B9); realistic, not 8
Performance P       7         8         Hero frame gating + responsive images (B6)
Images     IMG      7         8         srcset/sizes + recompress (B6/B7)
Access.    A11Y     5         8         Skip-link, accordion/heading/menu a11y (B4)
Responsive R        8         8         Already strong
SEO        SEO      6         8         Prerendered per-route meta (B8)
Testing    T        6         7         Regression tests per batch (B1/B3/B4)
Content    CR       6         8         Phone/hours/privacy/content fixes (B2/B7)
------------------------------------------------------------------
OVERALL             6.3   →   7.8       (weighted, ΣW 18)
```
Projected math: `(8·3 + 8·3 + 7·2 + 8·2 + 8·1.5 + 8·1.5 + 8·1 + 8·1 + 7·2 + 8·1)/18 = 140/18 = 7.78 ≈ 7.8`. No score is projected to rise without a re-verifiable fix behind it.

**GAP TO TARGET:** No operator target was set, so scope is the auditor's judgment; the plan above is the recommended scope. If a target of "all ≥ 8" were set, the blockers would be: **C** (would need the full XL refactor, not just dead-code removal) and **T** (would need E2E coverage of the main flows). Both are called out as larger structural work, not quick wins.

---

## DECISIONS NEEDED FROM YOU (answer alongside `FIX`)
1. **Q1 — Phone number:** Is the correct company number `+974 3326 0393` (used in 6 places), and is `+974 4444 0085` in the header a mistake to remove? Or is `4444 0085` a real second (office) line that should stay — and if so, labeled how? *(blocks Batch 2)*
2. **Q2 — Social prerender:** OK to add a build-time prerender/SSG step (one new dev dependency, ~1–2d) so shared links show correct previews? yes/no. *(blocks Batch 8)*
3. **Q3 — Listing content:** Do you have real listing photos + real stats to replace the Unsplash stock and the "500+/2,000+/15+/100% verified/48hr guarantee" claims? Or should the grid be labeled "sample listings" until then? *(blocks Batch 7 content)*
4. **Q4 — Privacy policy:** Do you have privacy-policy text (or approve a standard template) for a new `/privacy` page? *(blocks Batch 7)*
5. **Q5 — Business hours:** What are the real hours? (Header says Sat–Thu 8–5, footer says "24/7", AR FAQ says 8–8.) *(blocks the F-016 part of Batch 2)*
6. **Q6 — Error reporting:** OK to add a lightweight error tracker (e.g. Sentry free tier — one new dependency, production-only)? yes/no. *(blocks Batch 10)*

---

> Stage 1 complete — report + plan written to `AUDIT_AND_PLAN.md`.
> Reply `FIX` to execute the full plan, `FIX 1,3` to execute selected batches only, or ask questions.
> You can answer the decisions inline, e.g. `FIX — Q1: 3326 0393 is correct, remove the other; Q2: yes; Q3: mark as sample; Q4: use a template; Q5: Sat–Thu 8–5; Q6: yes`.
