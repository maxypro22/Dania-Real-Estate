import { createContext, useContext, useEffect } from 'react'

// Non-component SEO plumbing, kept out of Seo.tsx so that file can export only
// the <Seo> component (React Fast Refresh requires component-only modules —
// mixing a context/hook in with a component breaks HMR and fails lint).

// Lets a child page push page-specific JSON-LD up to the single <Seo> head
// manager rendered in Layout, so there is never more than one head writer.
const SeoExtraContext = createContext<(schemas: object[]) => void>(() => {})
export const SeoExtraProvider = SeoExtraContext.Provider

/** Register page-specific JSON-LD (e.g. FAQPage, ContactPage) for this route. */
export function usePageSchema(schemas: object[]) {
  const setExtra = useContext(SeoExtraContext)
  const key = JSON.stringify(schemas)
  useEffect(() => {
    setExtra(schemas)
    return () => setExtra([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
