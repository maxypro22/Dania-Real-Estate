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

**Data** — No backend. All property listings, area data, FAQ entries, and company info live in `src/data/mockData.ts`. Editing content means editing that file.

**Styling** — Tailwind CSS v4 via `@tailwindcss/vite`. There is **no `tailwind.config.js`**. Brand tokens are declared in the `@theme {}` block in `src/index.css`. The color naming is intentionally non-semantic:
- `forest` = dark brown (`#2C100A`) — backgrounds, nav, footer
- `lime` = burnt orange (`#C4622D`) — accents, CTAs, highlights
- `surface` = warm off-white (`#FDFAF7`)
- `ink` = near-black (`#1A0808`), `ink-muted` = muted brown

**`@` path alias** — `@/` maps to `src/`. Use it for all imports.

**Component layers:**
- `src/components/layout/` — `Header`, `Footer`, `Layout` (wraps outlet + floating WhatsApp button)
- `src/components/shared/` — reusable pieces: `ListingCard`, `ProcessSteps`, `SearchBar`, `Reveal`, `CountUp`, `WhatsAppButton`, `PropertyCard`
- `src/components/ui/` — shadcn-style primitives (`button`, `card`) using CVA + `clsx`
- `src/pages/` — one file per route; pages own their own section-level layout

**Key interaction patterns:**
- Hover effects use Tailwind `group` / `group-hover:` on a wrapper, never on the element itself
- Touch feedback: `group-active:` mirrors `group-hover:` on interactive cards (sweep-fill, scale)
- `ListingCard` spinning border: `@keyframes border-spin` (defined in `index.css`) rotates a conic-gradient overlay; animation plays only when `.group:hover` is active
- `ProcessSteps` connecting line: animates via `scaleX(0 → 1)` transform (not `width`) from `origin-left` for GPU acceleration
- Accordion in HomePage Featured Trending section: `flex: 4 1 0%` (active) vs `flex: 1 1 0%` (inactive) with `writing-mode: vertical-rl` for collapsed titles — desktop only (`hidden lg:flex`); a separate grid is shown on mobile (`lg:hidden`)
- Qatar map widget in `AreasPage.tsx` is a self-contained SVG component (`QatarMapWidget`) with hex-dot background pattern, bezier arc connections, and interactive pins

**Performance globals** (in `src/index.css`):
- `.will-animate` utility: `will-change: transform; backface-visibility: hidden`
- `prefers-reduced-motion: reduce` cuts all animation/transition durations to `0.01ms`
- `touch-action: manipulation` removes 300 ms tap delay globally

**Manual chunk split** in `vite.config.ts`: React/Router → `vendor`, Lucide icons → `icons`. Keep lucide imports tree-shakeable — import named icons only, never `import * from 'lucide-react'`.
