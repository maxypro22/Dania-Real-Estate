// Image override resolution.
//
// Data-driven images (property photos, homepage showcase images) are edited
// directly on their data records, so they need nothing here. This module covers
// the *hardcoded* images baked into pages/components (the public .webp heroes):
// after each render we rewrite any <img> whose source matches an override key.

import { getOverrides } from './state'

/** Resolve a single src through the override map (identity if not overridden). */
export function cmsSrc(src: string): string {
  return getOverrides().images[src] ?? src
}

/**
 * The override "key" for an <img> element: same-origin images key on their
 * pathname (e.g. "/about-...webp"); cross-origin images key on the full URL.
 */
function keyForImg(img: HTMLImageElement): string {
  const raw = img.getAttribute('data-cms-src') ?? img.getAttribute('src') ?? ''
  try {
    const u = new URL(raw, window.location.origin)
    return u.origin === window.location.origin ? u.pathname : raw
  } catch {
    return raw
  }
}

/**
 * Rewrite every <img> in the document to its overridden source (and restore any
 * whose override was removed). Idempotent — safe to call after each render.
 */
export function applyImageOverrides(): void {
  const images = getOverrides().images
  document.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    const key = keyForImg(img)
    const override = images[key]
    if (override) {
      // Remember the original source so we can match again / revert later.
      if (!img.getAttribute('data-cms-src')) img.setAttribute('data-cms-src', key)
      if (img.getAttribute('src') !== override) img.setAttribute('src', override)
    } else if (img.getAttribute('data-cms-src')) {
      // Override was removed — restore the original source.
      const orig = img.getAttribute('data-cms-src')!
      if (img.getAttribute('src') !== orig) img.setAttribute('src', orig)
      img.removeAttribute('data-cms-src')
    }
  })
}

/**
 * Collect the distinct hardcoded image sources currently on the page, so the
 * dashboard can present them as a pick-list to override.
 */
export function collectPageImages(): string[] {
  const set = new Set<string>()
  document.querySelectorAll<HTMLImageElement>('img').forEach((img) => set.add(keyForImg(img)))
  return [...set].sort()
}
