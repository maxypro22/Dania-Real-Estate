// Framework-agnostic holder for the currently-applied overrides.
//
// This module has NO imports on purpose — it is the shared bottom layer that
// both non-React code (seo.ts, image resolution) and React code (the provider)
// read from, so it must never create an import cycle.

import { emptyOverrides, type CmsOverrides } from './types'

let current: CmsOverrides = emptyOverrides()
const listeners = new Set<() => void>()

/** The overrides currently applied to the live site. */
export function getOverrides(): CmsOverrides {
  return current
}

/** Replace the active overrides and notify every subscriber. */
export function setOverrides(next: CmsOverrides): void {
  current = next
  listeners.forEach((fn) => fn())
}

/** Subscribe to override changes. Returns an unsubscribe function. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Resolve an image `src` through the override map (identity if not overridden). */
export function resolveImage(src: string): string {
  return current.images[src] ?? src
}

/** Per-route SEO override for a pathname, or undefined. */
export function getSeoOverride(pathname: string) {
  return current.seo[pathname]
}
