import { useSyncExternalStore } from 'react'

// Saved ("favourite") listings, kept in localStorage on the visitor's own
// device. There is no backend, so this is deliberately client-only: it lets a
// client shortlist properties while browsing and compare them later.

const KEY = 'dania:saved-properties'

function read(): ReadonlySet<number> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [])
  } catch {
    return new Set()
  }
}

let snapshot: ReadonlySet<number> = typeof localStorage === 'undefined' ? new Set() : read()
const listeners = new Set<() => void>()
const EMPTY: ReadonlySet<number> = new Set()

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Another tab shortlisted something — stay in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) { snapshot = read(); emit() }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Add or remove a listing from the shortlist. */
export function toggleSaved(id: number): void {
  const next = new Set(snapshot)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  snapshot = next
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    // Private mode / storage full — the shortlist just won't persist.
  }
  emit()
}

/** The current shortlist. Re-renders every consumer when it changes. */
export function useSavedProperties(): ReadonlySet<number> {
  return useSyncExternalStore(subscribe, () => snapshot, () => EMPTY)
}
