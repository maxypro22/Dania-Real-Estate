# Design System: Dania Real Estate
**Project ID:** 5589211303400258489 (Stitch: Interactive Motion Real Estate)

## 1. Visual Theme & Atmosphere
Authoritative yet breathable — a premium "local expert" feel that blends institutional strength with modern minimalism. High-impact white space signals luxury. Deep botanical greens ground the brand in trust and stability while a vibrant neon lime accent creates a modern pop for CTAs.

## 2. Color Palette & Roles
- **Deep Forest Green** (#003527) — Primary brand color. Used for headers, hero backgrounds, primary nav, and brand identity surfaces.
- **Botanical Container Green** (#064e3b) — Darker primary surface. Used for secondary hero bands, stat strips, and the nav on-hover state.
- **Vibrant Lime Green** (#bcf063) — High-visibility CTA accent. Used exclusively for primary action buttons, badges, and key highlights.
- **Soft Lime** (#a4d64c) — CTA hover state.
- **Pale Mint** (#95d3ba) — Primary light. Used in footer body text, subtle tints on dark backgrounds.
- **Near-White Blue Surface** (#f8f9ff) — Page background. Prevents the harshness of pure white while maintaining a clean, "un-busy" atmosphere.
- **Light Blue Container** (#e6eeff / #eff4ff) — Card and filter chip backgrounds. Provides logical grouping without heavy borders.
- **Deep Navy Text** (#0d1c2f) — All body copy. Softer than pure black for long browsing sessions.
- **Slate Variant** (#404944) — Secondary labels, metadata, icon descriptions.
- **WhatsApp Green** (#25D366) — Reserved exclusively for WhatsApp CTAs.
- **Muted Border** (#E2E8F0) — Card and input borders. Keeps surfaces integrated rather than floating.

## 3. Typography Rules
Single typeface: **Inter** across all weights. Headlines at 700 weight with -0.02em letter-spacing project confidence. Section titles at 600 weight. Body copy at 400 weight with 1.6 line-height for readability. Labels use 600 weight with +0.05em tracking to stay distinct at small sizes.

## 4. Component Stylings
- **Buttons (Primary):** Lime Green (#bcf063) fill, Deep Navy text, 0.5rem (8px) radius, bold label. High-conversion, high-contrast.
- **Buttons (Dark):** Deep Forest Green fill, white text. Used for search triggers and secondary actions.
- **Buttons (WhatsApp):** WhatsApp Green (#25D366), white text, pill-shape, fixed floating position.
- **Property Cards:** White background, 1px #E2E8F0 border, 0.75–1rem radius, `y:4 blur:20 opacity:5%` ambient shadow. 4:3 image ratio. Hover elevates shadow slightly. Verified badge uses white/90 glassmorphism overlay.
- **Inputs / Selects:** Rounded (0.75rem), 1px #E2E8F0 border, `#f8f9ff` fill. Focus triggers `ring-2 ring-primary/30`.
- **Filter Pills:** Full-pill shape. Active state uses Primary fill, inactive uses surface-container.

## 5. Layout Principles
12-column grid on desktop, max-width 1280px, 64px side margins. Mobile: 16px margins, single-column stacks. Section vertical gap: 120px equivalent (py-16/py-20). Property grids: 4 columns desktop → 2 tablet → 1 mobile. Sticky header at 64px height with subtle `backdrop-blur`. Floating WhatsApp button fixed bottom-right.
