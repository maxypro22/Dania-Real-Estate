// Write path — the single place that commits an overrides change: update the
// in-memory state, re-apply it to the live content, and persist it to the store.

import { getOverrides, setOverrides } from './state'
import { applyOverrides } from './apply'
import { store } from './store'
import type { CmsOverrides } from './types'

/**
 * Commit a new overrides patch: bump the revision, publish it (which re-renders
 * the app and reverts/re-applies live content), then persist. Persistence
 * errors (e.g. storage full) are thrown so the caller can surface them.
 */
export async function commitOverrides(next: CmsOverrides): Promise<void> {
  const patch: CmsOverrides = { ...next, rev: (getOverrides().rev ?? 0) + 1 }
  setOverrides(patch)
  applyOverrides()
  await store.saveOverrides(patch)
}
