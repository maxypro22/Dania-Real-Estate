import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, SearchX, X } from 'lucide-react'
import { SearchFilterBar } from '@/components/search/SearchFilterBar'
import { CategoryChips } from '@/components/search/CategoryChips'
import { PropertyCard, PropertyRowCard } from '@/components/search/PropertyCard'
import { usePageSchema } from '@/components/shared/seo-context'
import { useSavedProperties } from '@/hooks/useSavedProperties'
import { properties } from '@/data/mockData'
import { SITE_ORIGIN } from '@/lib/seo'
import {
  activeFilterCount, bedLabel, emptyFilters, filterProperties, filtersToParams,
  paramsToFilters, propertyHref, typeLabel, type Filters,
} from '@/lib/search'

const PAGE_SIZE = 9

/** One removable chip per active filter, so the current query is never hidden. */
function ActiveFilterPills({ f, onChange }: Readonly<{ f: Filters; onChange: (n: Filters) => void }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const pills: { key: string; label: string; clear: Partial<Filters> }[] = []
  if (f.q.trim()) pills.push({ key: 'q', label: `“${f.q.trim()}”`, clear: { q: '' } })
  for (const t of f.types) {
    pills.push({ key: `type-${t}`, label: typeLabel(t, isAr), clear: { types: f.types.filter((x) => x !== t) } })
  }
  for (const b of f.beds) {
    pills.push({ key: `bed-${b}`, label: `${bedLabel(b, isAr)} ${isAr ? 'غرف' : 'Beds'}`, clear: { beds: f.beds.filter((x) => x !== b) } })
  }
  for (const b of f.baths) {
    pills.push({ key: `bath-${b}`, label: `${b} ${isAr ? 'حمام' : 'Baths'}`, clear: { baths: f.baths.filter((x) => x !== b) } })
  }
  if (f.minPrice !== null || f.maxPrice !== null) {
    const lo = f.minPrice?.toLocaleString('en-US') ?? '0'
    const hi = f.maxPrice?.toLocaleString('en-US') ?? (isAr ? 'أي' : 'Any')
    pills.push({ key: 'price', label: `${lo} – ${hi} QAR`, clear: { minPrice: null, maxPrice: null } })
  }
  if (f.furnishing !== 'any') {
    pills.push({
      key: 'furnishing',
      label: f.furnishing === 'furnished' ? (isAr ? 'مفروش' : 'Furnished') : (isAr ? 'غير مفروش' : 'Unfurnished'),
      clear: { furnishing: 'any' },
    })
  }
  if (f.minArea !== null || f.maxArea !== null) {
    pills.push({ key: 'area', label: `${f.minArea ?? 0} – ${f.maxArea ?? (isAr ? 'أي' : 'Any')} m²`, clear: { minArea: null, maxArea: null } })
  }
  for (const a of f.amenities) {
    pills.push({ key: `am-${a}`, label: a, clear: { amenities: f.amenities.filter((x) => x !== a) } })
  }

  if (!pills.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={() => onChange({ ...f, ...pill.clear })}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3 py-1.5 text-xs font-semibold text-forest transition-colors hover:bg-lime hover:text-white"
        >
          {pill.label}
          <X size={13} />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...emptyFilters, sort: f.sort })}
        className="text-xs font-bold text-lime hover:underline"
      >
        {isAr ? 'مسح الكل' : 'Clear all'}
      </button>
    </div>
  )
}

export function PropertiesPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [params, setParams] = useSearchParams()
  const saved = useSavedProperties()

  const f = useMemo(() => paramsToFilters(params), [params])
  const savedOnly = params.get('saved') === '1'

  const results = useMemo(() => {
    const list = filterProperties(f)
    return savedOnly ? list.filter((p) => saved.has(p.id)) : list
  }, [f, savedOnly, saved])

  // Page size resets whenever the query changes (derived state, adjusted during
  // render — an effect here would cost an extra render of the whole result grid).
  const [shown, setShown] = useState(PAGE_SIZE)
  const queryKey = params.toString()
  const [syncedQuery, setSyncedQuery] = useState(queryKey)
  if (syncedQuery !== queryKey) {
    setSyncedQuery(queryKey)
    setShown(PAGE_SIZE)
  }

  const apply = (next: Filters) => {
    const p = filtersToParams(next)
    if (savedOnly) p.set('saved', '1')
    setParams(p, { replace: true })
  }

  const toggleSavedOnly = () => {
    const p = filtersToParams(f)
    if (!savedOnly) p.set('saved', '1')
    setParams(p, { replace: true })
  }

  // Premium units lead the list as wide rows, like the reference layout — but
  // only under the default "Featured" order. Once the visitor picks a sort,
  // that sort is honoured strictly and nothing gets hoisted above it.
  const premium = f.sort === 'featured' ? results.filter((p) => p.premium).slice(0, 2) : []
  const rest = results.filter((p) => !premium.includes(p))
  const visible = rest.slice(0, shown)

  const heading = (() => {
    const what = f.types.length === 1
      ? typeLabel(f.types[0], isAr)
      : (isAr ? 'عقارات' : 'Properties')
    const where = f.q.trim() ? f.q.trim() : (isAr ? 'قطر' : 'Qatar')
    return isAr ? `${what} للإيجار في ${where}` : `${what} for rent in ${where}`
  })()

  usePageSchema([
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: heading,
      numberOfItems: results.length,
      itemListElement: results.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_ORIGIN}${propertyHref(p)}`,
        name: p.title,
      })),
    },
  ])

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Page heading, then the search bar — which pins under the navbar ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 pb-4 pt-8 sm:px-6">
          <h1 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-2xl font-extrabold text-ink sm:text-3xl">
            {heading}
            <span className="text-base font-medium text-ink-faint">
              {results.length.toLocaleString(isAr ? 'ar-QA' : 'en-US')} {isAr ? 'عقار' : 'listed'}
            </span>
          </h1>
        </div>
      </div>
      {/* The compact version of this bar re-appears pinned under the navbar as
          soon as this one scrolls away — see <StickySearchBar> in Layout. */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1280px] px-4 pb-5 sm:px-6">
          <SearchFilterBar value={f} onChange={apply} onSubmit={apply} showSort />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
        {/* ── Categories + shortlist toggle ── */}
        <div className="mb-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <CategoryChips value={f} onChange={apply} />
          </div>
          <button
            type="button"
            onClick={toggleSavedOnly}
            aria-pressed={savedOnly}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              savedOnly ? 'border-forest bg-forest text-white' : 'border-border bg-white text-ink hover:border-forest/40 hover:bg-surface-low'
            }`}
          >
            <Heart size={15} className={savedOnly ? 'fill-lime text-lime' : ''} />
            <span className="hidden sm:inline">{isAr ? 'المحفوظة' : 'Saved'}</span>
            <span className="text-xs opacity-70">{saved.size}</span>
          </button>
        </div>

        {(activeFilterCount(f) > 0 || f.q.trim()) && (
          <div className="mb-5">
            <ActiveFilterPills f={f} onChange={apply} />
          </div>
        )}

        {/* ── Results ── */}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
            <SearchX size={36} className="mx-auto mb-4 text-ink-faint" />
            <h2 className="mb-2 text-lg font-bold text-ink">
              {isAr ? 'لا توجد عقارات مطابقة' : 'No properties match your search'}
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-ink-muted">
              {isAr
                ? 'جرّب توسيع نطاق السعر أو إزالة بعض الفلاتر — أو راسلنا على واتساب وسنبحث نيابةً عنك.'
                : 'Try widening the price range or removing a filter — or message us on WhatsApp and we will search on your behalf.'}
            </p>
            <button
              type="button"
              onClick={() => apply({ ...emptyFilters, sort: f.sort })}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-mid"
            >
              {isAr ? 'إعادة ضبط البحث' : 'Reset search'}
            </button>
          </div>
        ) : (
          <>
            {premium.length > 0 && (
              <div className="mb-5 flex flex-col gap-5">
                {premium.map((p) => <PropertyRowCard key={p.id} p={p} />)}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p, i) => <PropertyCard key={p.id} p={p} eager={i < 3} />)}
            </div>

            {shown < rest.length && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShown((s) => s + PAGE_SIZE)}
                  className="rounded-full border border-forest px-8 py-3 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-white"
                >
                  {isAr
                    ? `عرض المزيد (${rest.length - shown})`
                    : `Show more (${rest.length - shown})`}
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Supporting copy + cross-links (kept crawlable) ── */}
        <section className="mt-14 rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-ink">
            {isAr ? 'ابحث عن عقارك التالي في قطر' : 'Find your next property in Qatar'}
          </h2>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-ink-muted">
            {isAr
              ? `تدير دانية العقارية ${properties.length} عقارًا موثقًا للإيجار في الدوحة وقطر — شقق وفلل ومجمعات سكنية ومحلات تجارية وسكن عمال. جميع الأسعار شاملة وبدون عمولة خفية.`
              : `Dania Real Estate manages ${properties.length} verified rental listings across Doha and greater Qatar — apartments, standalone and compound villas, retail units, studios, partitions, and corporate staff accommodation. Every price is transparent, with zero hidden commission.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              ['/apartments-for-rent/', isAr ? 'شقق للإيجار' : 'Apartments for rent'],
              ['/villas-for-rent/', isAr ? 'فلل للإيجار' : 'Villas for rent'],
              ['/staff-accommodation/', isAr ? 'سكن عمال' : 'Staff accommodation'],
              ['/shops-for-rent/', isAr ? 'محلات للإيجار' : 'Shops for rent'],
              ['/studio-partition-rentals/', isAr ? 'استوديو وبارتيشن' : 'Studios & partitions'],
              ['/areas/', isAr ? 'تصفح حسب المنطقة' : 'Browse by area'],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-forest transition-colors hover:border-forest hover:bg-surface-low"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
