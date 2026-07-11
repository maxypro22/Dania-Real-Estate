import { createContext, useContext, useEffect } from 'react'
import { company } from '@/data/mockData'
import { SITE_ORIGIN, organizationSchema } from '@/lib/seo'

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

interface SeoProps {
  title: string
  description: string
  /** Route pathname (with trailing slash) — used for canonical + og:url. */
  path: string
  /** Share/hero image path under /public. */
  image?: string
  /** Extra page-specific JSON-LD (ContactPage, FAQPage, …). */
  jsonLd?: object[]
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Augments the document <head> for the current route with the tags the pages
 * themselves don't render: canonical, Open Graph / Twitter cards, and JSON-LD
 * structured data. Each page still owns its own <title> + <meta description>
 * (React 19 native hoisting); this layer reads those for the social cards so
 * there is a single source of truth and no duplicate description tag.
 * Implemented imperatively so it works reliably in this client-rendered SPA.
 */
export function Seo({ title, description, path, image, jsonLd = [] }: SeoProps) {
  const url = SITE_ORIGIN + path
  const imageUrl = SITE_ORIGIN + (image ?? '/Dania_Real_Estate_logo.png')
  const ldKey = JSON.stringify(jsonLd)

  useEffect(() => {
    // The resolveSeo map is the single source of truth for per-route copy and
    // matches each page's own <title>/<meta description>, so use it directly
    // (reading document.title is unreliable under lazy/Suspense route loads).
    upsertLink('canonical', url)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', company.name)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:locale', 'en_US')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)

    // JSON-LD: sitewide organization schema on every page + page-specific extras.
    const schemas = [...organizationSchema(), ...jsonLd]
    document.head
      .querySelectorAll('script[data-seo-jsonld]')
      .forEach((s) => s.remove())
    for (const obj of schemas) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.setAttribute('data-seo-jsonld', '')
      s.textContent = JSON.stringify(obj)
      document.head.appendChild(s)
    }
  }, [title, description, url, imageUrl, ldKey])

  return null
}
