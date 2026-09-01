// Property search: the filter model, URL (de)serialisation, and the pure
// filter/sort pipeline. Kept free of React so it can be unit-tested and reused
// by the hero bar, the sticky bar, and the results page alike.

import { properties, type Property, type PropertyType } from '@/data/mockData'

export type SortKey =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'beds-asc'
  | 'beds-desc'
  | 'area-desc'
export type Furnishing = 'any' | 'furnished' | 'unfurnished'

export interface Filters {
  /** Free text: city, community, building, or listing reference. */
  q: string
  types: PropertyType[]
  /** '0' = studio, '1'…'6', '7' means 7+. */
  beds: string[]
  /** '1'…'4', '5' means 5+. */
  baths: string[]
  minPrice: number | null
  maxPrice: number | null
  furnishing: Furnishing
  amenities: string[]
  minArea: number | null
  maxArea: number | null
  sort: SortKey
}

export const emptyFilters: Filters = {
  q: '',
  types: [],
  beds: [],
  baths: [],
  minPrice: null,
  maxPrice: null,
  furnishing: 'any',
  amenities: [],
  minArea: null,
  maxArea: null,
  sort: 'featured',
}

// ── Labels ───────────────────────────────────────────────────────────────────

export const TYPE_ORDER: PropertyType[] = [
  'apartment', 'villa', 'compound-villa', 'studio', 'partition', 'staff', 'shop',
]

const TYPE_LABEL_EN: Record<PropertyType, string> = {
  apartment: 'Apartments',
  villa: 'Villas',
  'compound-villa': 'Compound Villas',
  studio: 'Studios',
  partition: 'Partition Rooms',
  staff: 'Staff Accommodation',
  shop: 'Shops & Commercial',
}

const TYPE_LABEL_AR: Record<PropertyType, string> = {
  apartment: 'شقق',
  villa: 'فلل',
  'compound-villa': 'فلل في مجمعات',
  studio: 'استوديوهات',
  partition: 'غرف بارتيشن',
  staff: 'سكن عمال',
  shop: 'محلات ومكاتب',
}

export function typeLabel(type: PropertyType, isAr: boolean): string {
  return isAr ? TYPE_LABEL_AR[type] : TYPE_LABEL_EN[type]
}

/** Singular form used in card meta rows and detail-page headings. */
const TYPE_SINGULAR_EN: Record<PropertyType, string> = {
  apartment: 'Apartment',
  villa: 'Villa',
  'compound-villa': 'Compound Villa',
  studio: 'Studio',
  partition: 'Partition Room',
  staff: 'Staff Accommodation',
  shop: 'Shop',
}

const TYPE_SINGULAR_AR: Record<PropertyType, string> = {
  apartment: 'شقة',
  villa: 'فيلا',
  'compound-villa': 'فيلا في مجمع',
  studio: 'استوديو',
  partition: 'غرفة بارتيشن',
  staff: 'سكن عمال',
  shop: 'محل',
}

export function typeSingular(type: PropertyType, isAr: boolean): string {
  return isAr ? TYPE_SINGULAR_AR[type] : TYPE_SINGULAR_EN[type]
}

/**
 * One-word labels for the type pills inside the filter panel. "Staff
 * Accommodation" and "Shops & Commercial" are wide enough to claim a whole row
 * on their own, which breaks the pill grid — these keep every option packing
 * onto shared rows.
 */
const TYPE_SHORT_EN: Record<PropertyType, string> = {
  apartment: 'Apartment',
  villa: 'Villa',
  'compound-villa': 'Compound',
  studio: 'Studio',
  partition: 'Partition',
  staff: 'Staff',
  shop: 'Shop',
}

const TYPE_SHORT_AR: Record<PropertyType, string> = {
  apartment: 'شقة',
  villa: 'فيلا',
  'compound-villa': 'مجمع',
  studio: 'استوديو',
  partition: 'بارتيشن',
  staff: 'سكن عمال',
  shop: 'محل',
}

export function typeShort(type: PropertyType, isAr: boolean): string {
  return isAr ? TYPE_SHORT_AR[type] : TYPE_SHORT_EN[type]
}

/** The route each property type maps to, so listing pages stay cross-linked. */
export const TYPE_ROUTE: Record<PropertyType, string> = {
  apartment: '/apartments-for-rent/',
  villa: '/villas-for-rent/standard-villas/',
  'compound-villa': '/villas-for-rent/compound-villas/',
  studio: '/studio-partition-rentals/studio-for-rent/',
  partition: '/studio-partition-rentals/partition-room-for-rent/',
  staff: '/staff-accommodation/',
  shop: '/shops-for-rent/',
}

export function bedLabel(v: string, isAr: boolean): string {
  if (v === '0') return isAr ? 'استوديو' : 'Studio'
  if (v === '7') return isAr ? '+٧' : '7+'
  return isAr ? String(v) : v
}

export function formatPrice(value: number, currency = 'QAR', isAr = false): string {
  const n = value.toLocaleString(isAr ? 'ar-QA' : 'en-US')
  return isAr ? `${n} ${currency === 'QAR' ? 'ر.ق' : currency}` : `${n} ${currency}`
}

/** "Listed 2 days ago" / "Listed 3 months ago", matching the reference UI. */
export function listedAgo(days: number, isAr: boolean): string {
  if (days <= 0) return isAr ? 'أُدرج اليوم' : 'Listed today'
  if (days === 1) return isAr ? 'أُدرج منذ يوم' : 'Listed 1 day ago'
  if (days < 30) return isAr ? `أُدرج منذ ${days} يومًا` : `Listed ${days} days ago`
  const months = Math.round(days / 30)
  if (months === 1) return isAr ? 'أُدرج منذ شهر' : 'Listed 1 month ago'
  return isAr ? `أُدرج منذ ${months} أشهر` : `Listed ${months} months ago`
}

// ── URL (de)serialisation ────────────────────────────────────────────────────
// Only non-default values are written, so a bare /properties/ URL stays clean
// and every filtered view is a shareable, bookmarkable link.

export function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q.trim()) p.set('q', f.q.trim())
  if (f.types.length) p.set('type', f.types.join(','))
  if (f.beds.length) p.set('beds', f.beds.join(','))
  if (f.baths.length) p.set('baths', f.baths.join(','))
  if (f.minPrice !== null) p.set('min', String(f.minPrice))
  if (f.maxPrice !== null) p.set('max', String(f.maxPrice))
  if (f.furnishing !== 'any') p.set('furnishing', f.furnishing)
  if (f.amenities.length) p.set('amenities', f.amenities.join(','))
  if (f.minArea !== null) p.set('minArea', String(f.minArea))
  if (f.maxArea !== null) p.set('maxArea', String(f.maxArea))
  if (f.sort !== emptyFilters.sort) p.set('sort', f.sort)
  return p
}

/** Full query string including the leading "?" (empty when unfiltered). */
export function filtersToQuery(f: Filters): string {
  const s = filtersToParams(f).toString()
  return s ? `?${s}` : ''
}

export const SORTS: SortKey[] = [
  'featured', 'newest', 'price-asc', 'price-desc', 'beds-asc', 'beds-desc', 'area-desc',
]
const FURNISHINGS: Furnishing[] = ['any', 'furnished', 'unfurnished']

function csv(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key)
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : []
}

function num(params: URLSearchParams, key: string): number | null {
  const raw = params.get(key)
  if (raw === null || raw === '') return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export function paramsToFilters(params: URLSearchParams): Filters {
  const sort = params.get('sort') as SortKey | null
  const furnishing = params.get('furnishing') as Furnishing | null
  return {
    q: params.get('q') ?? '',
    types: csv(params, 'type').filter((t): t is PropertyType =>
      (TYPE_ORDER as string[]).includes(t)),
    beds: csv(params, 'beds'),
    baths: csv(params, 'baths'),
    minPrice: num(params, 'min'),
    maxPrice: num(params, 'max'),
    furnishing: furnishing && FURNISHINGS.includes(furnishing) ? furnishing : 'any',
    amenities: csv(params, 'amenities'),
    minArea: num(params, 'minArea'),
    maxArea: num(params, 'maxArea'),
    sort: sort && SORTS.includes(sort) ? sort : emptyFilters.sort,
  }
}

/** How many filter groups are active — drives the "Filters (2)" badge. */
export function activeFilterCount(f: Filters): number {
  return [
    f.types.length > 0,
    f.beds.length > 0,
    f.baths.length > 0,
    f.minPrice !== null || f.maxPrice !== null,
    f.furnishing !== 'any',
    f.amenities.length > 0,
    f.minArea !== null || f.maxArea !== null,
  ].filter(Boolean).length
}

/** Extra filters only (the ones behind the "Filters" popover). */
export function extraFilterCount(f: Filters): number {
  return [
    f.furnishing !== 'any',
    f.amenities.length > 0,
    f.minArea !== null || f.maxArea !== null,
    f.baths.length > 0,
  ].filter(Boolean).length
}

// ── The filter pipeline ──────────────────────────────────────────────────────

function bedBucket(p: Property): string | null {
  if (p.bedrooms === null) return null
  return p.bedrooms >= 7 ? '7' : String(p.bedrooms)
}

function matchesText(p: Property, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    p.title, p.location, p.district, p.reference, ...p.tags, ...p.amenities,
  ].join(' ').toLowerCase()
  // Every word must appear somewhere — "sadd 2 bedroom" narrows sensibly.
  return needle.split(/\s+/).every((word) => haystack.includes(word))
}

export function filterProperties(f: Filters, list: Property[] = properties): Property[] {
  const out = list.filter((p) => {
    if (!matchesText(p, f.q)) return false
    if (f.types.length && !f.types.includes(p.type)) return false
    if (f.beds.length) {
      const b = bedBucket(p)
      if (b === null || !f.beds.includes(b)) return false
    }
    if (f.baths.length) {
      if (p.bathrooms === null) return false
      const b = p.bathrooms >= 5 ? '5' : String(p.bathrooms)
      if (!f.baths.includes(b)) return false
    }
    if (f.minPrice !== null && p.price < f.minPrice) return false
    if (f.maxPrice !== null && p.price > f.maxPrice) return false
    if (f.furnishing === 'furnished' && !p.furnished) return false
    if (f.furnishing === 'unfurnished' && p.furnished) return false
    if (f.minArea !== null && p.area < f.minArea) return false
    if (f.maxArea !== null && p.area > f.maxArea) return false
    if (f.amenities.length && !f.amenities.every((a) => p.amenities.includes(a))) return false
    return true
  })
  return sortProperties(out, f.sort)
}

/** Listings without a bedroom count (staff blocks, shops) sort last either way. */
function bedsOf(p: Property, whenMissing: number): number {
  return p.bedrooms ?? whenMissing
}

export function sortProperties(list: Property[], sort: SortKey): Property[] {
  const out = [...list]
  const newestFirst = (a: Property, b: Property) => a.listedDaysAgo - b.listedDaysAgo
  switch (sort) {
    case 'newest':     return out.sort(newestFirst)
    case 'price-asc':  return out.sort((a, b) => a.price - b.price)
    case 'price-desc': return out.sort((a, b) => b.price - a.price)
    case 'beds-asc':   return out.sort((a, b) => bedsOf(a, Infinity) - bedsOf(b, Infinity))
    case 'beds-desc':  return out.sort((a, b) => bedsOf(b, -Infinity) - bedsOf(a, -Infinity))
    case 'area-desc':  return out.sort((a, b) => b.area - a.area)
    // 'featured': the units we want seen first, then the freshest.
    default:           return out.sort((a, b) =>
      Number(Boolean(b.premium)) - Number(Boolean(a.premium)) || newestFirst(a, b))
  }
}

/**
 * Counts per property type for the category chip row, computed against every
 * filter EXCEPT the type filter itself — so the chips always show what you'd
 * get by switching type, exactly like the reference UI.
 */
export function typeCounts(f: Filters, list: Property[] = properties): Record<PropertyType, number> {
  const matched = filterProperties({ ...f, types: [] }, list)
  const counts = Object.fromEntries(TYPE_ORDER.map((t) => [t, 0])) as Record<PropertyType, number>
  for (const p of matched) counts[p.type]++
  return counts
}

/** The amenity list offered in the Filters popover, most common first. */
export function amenityOptions(list: Property[] = properties, limit = 14): string[] {
  const counts = new Map<string, number>()
  for (const p of list) for (const a of p.amenities) counts.set(a, (counts.get(a) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([a]) => a)
}

// ── Options derived from the data ────────────────────────────────────────────
// Every dropdown offers exactly what the portfolio actually contains: no dead
// "5 bedrooms" pill when nothing has five, and a price slider whose ends are
// the cheapest and dearest live listings. Add a property to mockData.ts and the
// filters widen on their own.

/** Property types that actually appear in the portfolio, in display order. */
export function availableTypes(list: Property[] = properties): PropertyType[] {
  const present = new Set(list.map((p) => p.type))
  return TYPE_ORDER.filter((t) => present.has(t))
}

/** Bedroom buckets present in the data ('0' = studio, '7' = 7+), ascending. */
export function bedOptions(list: Property[] = properties): string[] {
  const s = new Set<string>()
  for (const p of list) if (p.bedrooms !== null) s.add(p.bedrooms >= 7 ? '7' : String(p.bedrooms))
  return [...s].sort((a, b) => Number(a) - Number(b))
}

/** Bathroom buckets present in the data ('5' = 5+), ascending. */
export function bathOptions(list: Property[] = properties): string[] {
  const s = new Set<string>()
  for (const p of list) if (p.bathrooms !== null) s.add(p.bathrooms >= 5 ? '5' : String(p.bathrooms))
  return [...s].sort((a, b) => Number(a) - Number(b))
}

export interface Bounds { min: number; max: number; step: number }

function bounds(values: number[], step: number): Bounds {
  if (!values.length) return { min: 0, max: step, step }
  return {
    min: Math.floor(Math.min(...values) / step) * step,
    max: Math.ceil(Math.max(...values) / step) * step,
    step,
  }
}

/** Cheapest → dearest rent in the portfolio, snapped outwards to round figures. */
export function priceBounds(list: Property[] = properties): Bounds {
  return bounds(list.map((p) => p.price), 100)
}

/** Smallest → largest unit size in the portfolio, in m². */
export function areaBounds(list: Property[] = properties): Bounds {
  return bounds(list.map((p) => p.area), 5)
}

/**
 * Quick-pick price bands built from the data's own quartiles (rounded to the
 * nearest 500), so each band is guaranteed to return a healthy set of results
 * rather than being a guess that lands on an empty range.
 */
export function pricePresets(list: Property[] = properties): { min: number | null; max: number | null }[] {
  const sorted = list.map((p) => p.price).sort((a, b) => a - b)
  if (sorted.length < 4) return []
  const at = (fraction: number) => {
    const raw = sorted[Math.floor(fraction * (sorted.length - 1))]
    return Math.max(500, Math.round(raw / 500) * 500)
  }
  const edges = [...new Set([at(0.25), at(0.5), at(0.75)])]
  return [
    { min: null, max: edges[0] },
    ...edges.slice(0, -1).map((lo, i) => ({ min: lo, max: edges[i + 1] })),
    { min: edges[edges.length - 1], max: null },
  ]
}

function tally<T extends string>(list: Property[], key: (p: Property) => T | null): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const p of list) {
    const k = key(p)
    if (k !== null) counts[k] = (counts[k] ?? 0) + 1
  }
  return counts
}

/** Listings per bedroom bucket under the current filters, ignoring `beds`. */
export function bedCounts(f: Filters, list: Property[] = properties): Record<string, number> {
  return tally(filterProperties({ ...f, beds: [] }, list), bedBucket)
}

/** Listings per bathroom bucket under the current filters, ignoring `baths`. */
export function bathCounts(f: Filters, list: Property[] = properties): Record<string, number> {
  return tally(filterProperties({ ...f, baths: [] }, list), (p) =>
    p.bathrooms === null ? null : p.bathrooms >= 5 ? '5' : String(p.bathrooms))
}

/** Listings per amenity under the current filters, ignoring `amenities`. */
export function amenityCounts(f: Filters, list: Property[] = properties): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const p of filterProperties({ ...f, amenities: [] }, list)) {
    for (const a of p.amenities) counts[a] = (counts[a] ?? 0) + 1
  }
  return counts
}

/** Location suggestions for the search input, ranked by listing count. */
export function locationSuggestions(query: string, list: Property[] = properties, limit = 6) {
  const counts = new Map<string, number>()
  for (const p of list) {
    for (const key of [p.district, p.location]) {
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  const needle = query.trim().toLowerCase()
  return [...counts.entries()]
    .filter(([name]) => !needle || name.toLowerCase().includes(needle))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }))
}

/** Listings similar to `p` — same type first, then same district, by price gap. */
export function similarProperties(p: Property, list: Property[] = properties, limit = 3): Property[] {
  return list
    .filter((o) => o.id !== p.id)
    .map((o) => ({
      o,
      score:
        (o.type === p.type ? 0 : 40) +
        (o.district === p.district ? 0 : 20) +
        Math.abs(o.price - p.price) / Math.max(p.price, 1) * 10,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.o)
}

// ── Listing links ────────────────────────────────────────────────────────────

/** Canonical detail-page URL for a listing. */
export function propertyHref(p: Property): string {
  return `/properties/${p.slug}/`
}

/** Pre-filled WhatsApp enquiry that names the exact unit and its reference. */
export function whatsappEnquiry(p: Property, isAr: boolean): string {
  const msg = isAr
    ? `مرحبًا دانية العقارية، أنا مهتم بـ ${p.title} (المرجع ${p.reference}) بسعر ${p.price} ريال${p.period}. هل يمكن ترتيب معاينة؟`
    : `Hello Dania Real Estate, I'm interested in "${p.title}" (Ref ${p.reference}) at ${p.price.toLocaleString('en-US')} QAR${p.period}. Can we arrange a viewing?`
  return `https://wa.me/${p.agent.whatsapp}?text=${encodeURIComponent(msg)}`
}
