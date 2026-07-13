// Persistence layer — the ONE seam you swap when moving to Supabase.
//
// The rest of the app talks only to the `CmsStore` interface, so migrating from
// the browser-local store to Supabase means implementing the same five methods
// against the DB and changing the single `export const store` line at the bottom.
// Nothing else in the codebase needs to change.
//
// The Supabase implementation is already written and ready in
//   src/cms/store.supabase.ts.template   (adapter — rename to .ts to activate)
//   supabase/schema.sql                   (tables + Row Level Security + seed)
//   supabase/README.md                    (step-by-step connect guide)

import { emptyOverrides, type CmsOverrides, type CmsMessage } from './types'

export interface CmsStore {
  loadOverrides(): Promise<CmsOverrides>
  saveOverrides(overrides: CmsOverrides): Promise<void>
  listMessages(): Promise<CmsMessage[]>
  addMessage(message: CmsMessage): Promise<void>
  deleteMessage(id: string): Promise<void>
}

const OVERRIDES_KEY = 'dania-cms:overrides'
const MESSAGES_KEY = 'dania-cms:messages'

/**
 * Browser-local store backed by localStorage. Synchronous under the hood, but
 * exposed through the async `CmsStore` interface so the Supabase swap is a drop
 * in replacement with zero changes to callers.
 *
 * localStorage (not IndexedDB) is deliberate for the test phase: it loads
 * synchronously at boot, which lets the site apply saved content on the very
 * first paint with no flash of default text.
 */
export const localStore: CmsStore = {
  async loadOverrides() {
    return readOverridesSync()
  },

  async saveOverrides(overrides) {
    try {
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
    } catch (err) {
      // localStorage has a ~5 MB quota — most likely tripped by large uploaded
      // images stored as data: URLs. Surface it instead of failing silently.
      throw new Error(
        'Could not save — browser storage is full. Use image URLs instead of ' +
          'large uploads, or remove some, then try again.',
        { cause: err },
      )
    }
  },

  async listMessages() {
    return readMessagesSync().sort((a, b) => b.createdAt - a.createdAt)
  },

  async addMessage(message) {
    const all = readMessagesSync()
    all.push(message)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(all))
  },

  async deleteMessage(id) {
    const all = readMessagesSync().filter((m) => m.id !== id)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(all))
  },
}

/**
 * Synchronous read used by the boot-time overlay (before React renders) so
 * there is no flash of un-edited content. Falls back to empty on any parse
 * error so a corrupted entry can never white-screen the site.
 */
export function readOverridesSync(): CmsOverrides {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    if (!raw) return emptyOverrides()
    const parsed = JSON.parse(raw) as Partial<CmsOverrides>
    // Merge onto a fresh shell so newly-added fields always exist.
    return { ...emptyOverrides(), ...parsed, i18n: { en: {}, ar: {}, ...parsed.i18n } }
  } catch {
    return emptyOverrides()
  }
}

function readMessagesSync(): CmsMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY)
    return raw ? (JSON.parse(raw) as CmsMessage[]) : []
  } catch {
    return []
  }
}

/** Active store. Swap this single line for `supabaseStore` to go live. */
export const store: CmsStore = localStore
