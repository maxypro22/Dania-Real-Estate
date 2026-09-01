// Overlay engine — layers the current overrides onto the site's live content.
//
// The site's default content lives in ordinary modules (mockData, home.json,
// the i18n bundles). Rather than refactor every one of the ~20 files that
// import them, we mutate those shared objects/arrays IN PLACE so every existing
// consumer keeps working unchanged and simply re-reads the patched values on
// the next render. A React re-render is triggered separately by the provider.

import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import ar from '@/i18n/locales/ar.json'
import homeContent from '@/content/home.json'
import { company, properties, whyChooseUs } from '@/data/mockData'
import { getOverrides } from './state'
import type { CmsOverrides, I18nTree } from './types'

// ── Default snapshots, captured once before anything is mutated ──────────────
// Used to RESET a field back to its built-in value when its override is removed.
const defaultCompany = { ...company }
const defaultProperties = properties.map((p) => ({ ...p }))
const defaultWhyChooseUs = whyChooseUs.map((w) => ({ ...w }))
const defaultShowcases = homeContent.showcases.map((s) => ({ ...s }))

/**
 * Apply every part of the current overrides to the live content. Safe to call
 * repeatedly (boot + after each save): each call first restores defaults, then
 * re-applies, so removing an override cleanly reverts to the original text.
 */
export function applyOverrides(): void {
  const o = getOverrides()
  applyI18n(o)
  applyCompany(o)
  applyProperties(o)
  applyWhyChooseUs(o)
  applyShowcases(o)
  // Force every react-i18next consumer (i.e. essentially the whole visible UI)
  // to re-render so edits appear live without a page reload. The provider's own
  // state change can't do this — the app subtree is passed as a stable `children`
  // element and React bails out of re-rendering it.
  i18n.emit('languageChanged', i18n.language)
}

function applyI18n(o: CmsOverrides): void {
  // Reset each language to its base bundle, then layer the overrides on top.
  i18n.addResourceBundle('en', 'translation', en, true, true)
  i18n.addResourceBundle('ar', 'translation', ar, true, true)
  if (Object.keys(o.i18n.en).length) {
    i18n.addResourceBundle('en', 'translation', o.i18n.en, true, true)
  }
  if (Object.keys(o.i18n.ar).length) {
    i18n.addResourceBundle('ar', 'translation', o.i18n.ar, true, true)
  }
}

function applyCompany(o: CmsOverrides): void {
  Object.assign(company, defaultCompany, o.company)
}

function applyProperties(o: CmsOverrides): void {
  const next = o.properties ?? defaultProperties
  // Layer each override over its built-in listing (matched by id) rather than
  // replacing it outright: an override saved before the listing model grew its
  // search fields (slug, gallery, amenities, agent) would otherwise strip them
  // and break the listing pages.
  const base = new Map(defaultProperties.map((p) => [p.id, p]))
  properties.splice(0, properties.length, ...next.map((p) => ({ ...base.get(p.id), ...p })))
}

function applyWhyChooseUs(o: CmsOverrides): void {
  const next = o.whyChooseUs ?? defaultWhyChooseUs
  whyChooseUs.splice(0, whyChooseUs.length, ...next.map((w) => ({ ...w })))
}

function applyShowcases(o: CmsOverrides): void {
  const next = o.showcases ?? defaultShowcases
  homeContent.showcases.splice(0, homeContent.showcases.length, ...next.map((s) => ({ ...s })))
}

// ── Helpers exposed to the dashboard for building override patches ───────────

/** The built-in (un-overridden) base i18n trees, for diffing in the editor. */
export const baseI18n = { en: en as unknown as I18nTree, ar: ar as unknown as I18nTree }

/** The built-in company defaults, for the "reset to default" affordance. */
export const baseCompany = defaultCompany

/** The built-in homepage showcase cards. */
export const baseShowcases = defaultShowcases
