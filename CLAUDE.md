# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server (hot reload)
npm run build      # tsc type-check + Vite production build
npm run lint       # ESLint
npm run preview    # serve the dist/ build locally
```

There are no tests. Build (`npm run build`) is the correctness gate — it runs `tsc -b` before bundling, so TypeScript errors are build errors.

## Architecture

React 19 + TypeScript SPA, bundled with Vite 8. Deployed on Vercel; `vercel.json` rewrites all paths to `index.html` for client-side routing.

**Routing** — React Router DOM v7. All routes live in `src/App.tsx` under a shared `<Layout>` outlet. Every page is `lazy()`-loaded for code splitting.

**Data** — No backend. All property listings, area data, FAQ entries, and company info live in `src/data/mockData.ts`. Editing content means editing that file. Listings are built through the `mk()` helper there, which fills in the photo gallery, agent, reference, and generated description from the unit's own attributes — add a seed object and the listing, its detail page, its SEO head, and its sitemap entry all follow automatically.

**Property search** — `src/lib/search.ts` owns the whole model: the `Filters` shape, URL (de)serialisation (`filtersToParams` / `paramsToFilters`), the pure filter/sort pipeline, and the label maps. It imports no React, so the same logic drives the hero bar, the sticky bar, and the results page. Search UI lives in `src/components/search/`:
- `SearchFilterBar` — the controlled bar (location field + type / beds & baths / price / filters chips). `layout="stacked"` for hero and results header, `layout="inline"` for the pinned bar.
- `StickySearchBar` — rendered once in `Layout`, pinned under the navbar on every page. On `/properties/` it binds to the URL (same state as the page's own bar); elsewhere it holds a draft and navigates on submit.
- `PropertyCard` / `PropertyRowCard`, `PropertyPhotoStrip`, `CategoryChips`, `HeroSearch`.

Routes: `/properties/` (results, filter state lives entirely in the query string) and `/properties/:slug/` (detail). Per-listing `<head>` copy is generated in `src/lib/seo.ts` (`propertySeoEntry` / `PROPERTY_SEO`), and `scripts/prerender.mjs` bakes an HTML file plus a sitemap entry for every slug.

**Styling** — Tailwind CSS v4 via `@tailwindcss/vite`. There is **no `tailwind.config.js`**. Brand tokens are declared in the `@theme {}` block in `src/index.css`. The color naming is intentionally non-semantic:
- `forest` = dark brown (`#2C100A`) — backgrounds, nav, footer
- `lime` = burnt orange (`#C4622D`) — accents, CTAs, highlights
- `surface` = warm off-white (`#FDFAF7`)
- `ink` = near-black (`#1A0808`), `ink-muted` = muted brown

**`@` path alias** — `@/` maps to `src/`. Use it for all imports.

**Navigation** — `navItems` in `Header.tsx` is the single source: Home · Properties for Rent · Areas · About Company · Contact Us. "Properties for Rent" is a **heading with no `to`** — it renders as a `<button>` that only opens its panel, and the panel omits the "Browse the section" row. Sub-items may carry their own `children` (Apartments → 1/2/3 BHK), rendered as an indented second level in both the desktop panel and the mobile accordion.

**Contact surfaces** — the business runs two mobile lines plus an office line, all from `settings.json`. The navbar action area shows the **two mobile lines** (the office line lives in the footer and on `/contact-us/` only); `FloatingContact` renders the Call + WhatsApp FABs, each opening a Line 1 / Line 2 picker. `company.mapUrl` (directions) and `company.mapEmbedUrl` (contact-page iframe) are the single source for every map link — the iframe needs `https://www.google.com` in the `frame-src` CSP directive in `vercel.json`.

**Component layers:**
- `src/components/layout/` — `Header`, `Footer`, `Layout` (wraps outlet + site-wide search bar + floating contact widgets)
- `src/components/shared/` — reusable pieces: `ProcessSteps`, `Reveal`, `CountUp`, `WhatsAppButton`, `HeroSequence`, `ErrorBoundary`, `StackedCards`, `CardCarousel`, `ScrollRevealText`, `Seo`
- `src/pages/` — one file per route; pages own their own section-level layout (listing/property cards are rendered inline per page, not via a shared card component)

**Key interaction patterns:**
- Hover effects use Tailwind `group` / `group-hover:` on a wrapper, never on the element itself
- Touch feedback: `group-active:` mirrors `group-hover:` on interactive cards (sweep-fill, scale)
- `ProcessSteps` connecting line: animates via `scaleX(0 → 1)` transform (not `width`) from `origin-left` for GPU acceleration
- Accordion in HomePage Featured Trending section: `flex: 4 1 0%` (active) vs `flex: 1 1 0%` (inactive) with `writing-mode: vertical-rl` for collapsed titles — desktop only (`hidden lg:flex`); a separate grid is shown on mobile (`lg:hidden`)
- Qatar map widget in `AreasPage.tsx` is a self-contained SVG component (`QatarMapWidget`) with hex-dot background pattern, bezier arc connections, and interactive pins

**Performance globals** (in `src/index.css`):
- `.will-animate` utility: `will-change: transform; backface-visibility: hidden`
- `prefers-reduced-motion: reduce` cuts all animation/transition durations to `0.01ms`
- `touch-action: manipulation` removes 300 ms tap delay globally

**Manual chunk split** in `vite.config.ts`: React/Router → `vendor`, Lucide icons → `icons`. Keep lucide imports tree-shakeable — import named icons only, never `import * from 'lucide-react'`.
