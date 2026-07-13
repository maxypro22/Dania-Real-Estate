import { useEffect, useMemo, useState, useCallback, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { getOverrides, setOverrides, subscribe } from './state'
import { commitOverrides } from './actions'
import { applyOverrides } from './apply'
import { applyImageOverrides } from './img'
import { store, readOverridesSync } from './store'
import { CmsContext, type CmsContextValue } from './cms-context'
import type { CmsOverrides, CmsMessage } from './types'

/**
 * Wraps the whole app. Subscribes to override changes so any content edit
 * re-renders every page live, and holds the message inbox in state.
 */
export function CmsProvider({ children }: { children: ReactNode }) {
  // `rev` forces a re-render of the tree whenever overrides change, so pages
  // re-read the patched i18n bundles / company object on the next paint.
  const [rev, setRev] = useState(getOverrides().rev)
  const [messages, setMessages] = useState<CmsMessage[]>([])
  const { pathname } = useLocation()

  // ── Callbacks (declared before the effects that use them) ──────────────────
  const refreshMessages = useCallback(async () => {
    setMessages(await store.listMessages())
  }, [])

  const save = useCallback(async (next: CmsOverrides) => {
    await commitOverrides(next)
  }, [])

  const markRead = useCallback(async (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
    // Persist the read flag by rewriting the message via delete+add-equivalent:
    // the local store keeps the full list, so re-listing after a targeted update
    // is simplest here — mark in place, then push the whole set back.
    const all = await store.listMessages()
    const target = all.find((m) => m.id === id)
    if (target && !target.read) {
      await store.deleteMessage(id)
      await store.addMessage({ ...target, read: true })
    }
  }, [])

  const deleteMessage = useCallback(async (id: string) => {
    await store.deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }, [])

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => subscribe(() => setRev(getOverrides().rev)), [])

  // Load the inbox once on mount (setState runs in the async .then, not the
  // effect body, so it doesn't trigger a synchronous cascading render).
  useEffect(() => {
    let alive = true
    store.listMessages().then((m) => {
      if (alive) setMessages(m)
    })
    return () => {
      alive = false
    }
  }, [])

  // Cross-tab real-time: when the dashboard saves in another tab, localStorage
  // fires a 'storage' event here — reload + re-apply so an open site tab updates
  // without a manual refresh.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key && e.key.startsWith('dania-cms:')) {
        setOverrides(readOverridesSync())
        applyOverrides()
        void refreshMessages()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refreshMessages])

  // Rewrite hardcoded <img> sources to their overrides after each render/route
  // change. A rAF lets the DOM settle first (lazy pages, image swaps).
  useEffect(() => {
    const id = requestAnimationFrame(applyImageOverrides)
    return () => cancelAnimationFrame(id)
  }, [rev, pathname])

  const value = useMemo<CmsContextValue>(
    () => ({
      overrides: getOverrides(),
      rev,
      save,
      messages,
      markRead,
      deleteMessage,
      refreshMessages,
    }),
    [rev, messages, save, markRead, deleteMessage, refreshMessages],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}
