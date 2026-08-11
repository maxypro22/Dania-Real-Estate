// CMS data model — shared by the store, the overlay engine, and the dashboard.
//
// Everything the dashboard can change is expressed as an "overrides" patch that
// is layered on top of the site's built-in defaults at runtime. Storing only
// the *changes* (not a full copy of the content) keeps the payload small and
// makes it trivial to reset a field back to its default.

import type { Property } from '@/data/mockData'

/** A single contact-form submission captured into the inbox. */
export interface CmsMessage {
  id: string
  name: string
  phone: string
  email: string
  type: string
  area: string
  message: string
  /** Epoch ms. */
  createdAt: number
  read: boolean
}

/** Company / contact details (mirrors src/content/settings.json → company). */
export interface CompanyOverride {
  name?: string
  nameAr?: string
  tagline?: string
  address?: string
  addressAr?: string
  phone?: string
  phone2?: string
  whatsapp?: string
  whatsappDisplay?: string
  officePhone?: string
  email?: string
  hours?: string
  hoursAr?: string
  hoursSat?: string
  hoursSatAr?: string
  hoursShort?: string
  hoursShortAr?: string
  footerHours?: string
  footerHoursAr?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  founded?: string
  properties?: string
  clients?: string
  experience?: string
}

/** Per-route SEO override, keyed by exact pathname (e.g. "/contact-us/"). */
export interface SeoOverride {
  title?: string
  description?: string
}

/** Homepage showcase card (mirrors src/content/home.json → showcases[]). */
export interface Showcase {
  image: string
  link: string
  titleEn: string
  titleAr: string
  textEn: string
  textAr: string
  visible: boolean
}

/** "Why Choose Us" benefit (English list from mockData). */
export interface Benefit {
  title: string
  description: string
}

/** A recursive partial translation tree (subset of the i18n JSON). */
export type I18nTree = { [key: string]: string | I18nTree }

/**
 * The complete overrides patch. Every field is optional — an absent field
 * means "use the built-in default". This is exactly the shape persisted to the
 * local store today and to a Supabase row tomorrow.
 */
export interface CmsOverrides {
  /** Bumped on every save so consumers can cheaply detect a change. */
  rev: number
  /** Overridden translation strings, by language. Only changed keys are kept. */
  i18n: { en: I18nTree; ar: I18nTree }
  /** Per-route SEO title/description overrides. */
  seo: Record<string, SeoOverride>
  /** Contact / company detail overrides. */
  company: CompanyOverride
  /** Full replacement of the property listings (when edited in the dashboard). */
  properties?: Property[]
  /** Full replacement of the homepage showcase cards. */
  showcases?: Showcase[]
  /** Full replacement of the "Why Choose Us" benefit list (English). */
  whyChooseUs?: Benefit[]
  /**
   * Image overrides keyed by the original `src` (e.g. "/about-...webp" or an
   * Unsplash URL). Value is a replacement URL or an uploaded data: URL.
   */
  images: Record<string, string>
}

/** A fresh, empty overrides patch. */
export function emptyOverrides(): CmsOverrides {
  return { rev: 0, i18n: { en: {}, ar: {} }, seo: {}, company: {}, images: {} }
}
