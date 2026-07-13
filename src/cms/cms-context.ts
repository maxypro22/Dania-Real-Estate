// CMS React context + hook. Kept separate from the provider component so the
// provider file can export a component only (React Fast Refresh / lint rule).

import { createContext, useContext } from 'react'
import type { CmsOverrides, CmsMessage } from './types'

export interface CmsContextValue {
  /** Currently applied overrides. */
  overrides: CmsOverrides
  /** Increments whenever content changes — handy as a render key. */
  rev: number
  /** Commit a new overrides patch (applies live + persists). */
  save: (next: CmsOverrides) => Promise<void>
  /** Captured contact-form messages, newest first. */
  messages: CmsMessage[]
  markRead: (id: string) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
  refreshMessages: () => Promise<void>
}

export const CmsContext = createContext<CmsContextValue | null>(null)

/** Access the live CMS content + mutators. Must be inside <CmsProvider>. */
export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within <CmsProvider>')
  return ctx
}
