import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, SlidersHorizontal, ArrowDownUp, MapPin, X } from 'lucide-react'
import { FilterPopover } from './FilterPopover'
import { RangeSlider } from './RangeSlider'
import {
  amenityCounts, amenityOptions, areaBounds, availableTypes, bathCounts, bathOptions,
  bedCounts, bedLabel, bedOptions, emptyFilters, extraFilterCount, filterProperties,
  locationSuggestions, priceBounds, pricePresets, SORTS, typeCounts, typeLabel, typeShort,
  type Filters, type SortKey,
} from '@/lib/search'
import type { PropertyType } from '@/data/mockData'

const SORT_LABEL: Record<SortKey, [string, string]> = {
  featured:     ['Featured', 'المميزة'],
  newest:       ['Newest', 'الأحدث'],
  'price-asc':  ['Price (low)', 'السعر (الأقل)'],
  'price-desc': ['Price (high)', 'السعر (الأعلى)'],
  'beds-asc':   ['Beds (least)', 'الغرف (الأقل)'],
  'beds-desc':  ['Beds (most)', 'الغرف (الأكثر)'],
  'area-desc':  ['Largest area', 'الأكبر مساحة'],
}

/** How many pills a wrapping group shows before it collapses behind "View more". */
const COLLAPSED = 6

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

/** Section heading inside a filter panel. */
function PanelHeading({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="mb-2.5 text-base font-bold text-ink">{children}</p>
}

/**
 * A wrapping pill group that collapses to `COLLAPSED` options with a
 * "View more" toggle — the panel stays a readable height however many options
 * the portfolio grows to.
 */
function PillGroup({ count, children }: Readonly<{ count: number; children: (limit: number) => ReactNode }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [expanded, setExpanded] = useState(false)
  const collapsible = count > COLLAPSED

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {children(collapsible && !expanded ? COLLAPSED : count)}
      </div>
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 rounded-xl border border-lime px-4 py-2 text-sm font-semibold text-lime transition-colors hover:bg-lime hover:text-white"
        >
          {expanded ? (isAr ? 'عرض أقل' : 'View less') : (isAr ? 'عرض المزيد' : 'View more')}
        </button>
      )}
    </>
  )
}

/**
 * Compact pill used inside the Beds / Baths / Furnishing / Amenities panels.
 * `count` is how many listings the option would return right now; an option
 * that would return none is dimmed and unclickable rather than hidden, so the
 * shape of the portfolio stays visible.
 */
function Pill({
  on, onClick, count, muted, children,
}: Readonly<{ on: boolean; onClick: () => void; count?: number; muted?: boolean; children: ReactNode }>) {
  const dead = (muted ?? count === 0) && !on
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={dead}
      aria-pressed={on}
      className={`inline-flex min-w-[44px] items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        on
          ? 'border-forest bg-forest text-white'
          : dead
            ? 'cursor-not-allowed border-border/60 bg-white text-ink-faint'
            : 'border-border bg-white text-ink hover:border-forest/40 hover:bg-surface-low'
      }`}
    >
      {children}
      {count !== undefined && <span className="text-[11px] opacity-70">{count}</span>}
    </button>
  )
}

function NumberField({
  label, value, onChange, placeholder,
}: Readonly<{ label: string; value: number | null; onChange: (v: number | null) => void; placeholder: string }>) {
  return (
    <label className="flex-1 min-w-0">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === '' ? null : Math.max(0, Number(e.target.value)))}
        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-forest"
      />
    </label>
  )
}

interface Props {
  value: Filters
  onChange: (next: Filters) => void
  /** Enter / the Search button — used to navigate to the results page. */
  onSubmit?: (next: Filters) => void
  /** 'stacked' = input row above the chip row; 'inline' = one scrolling row. */
  layout?: 'stacked' | 'inline'
  tone?: 'light' | 'dark'
  /** Close open panels when the page scrolls (needed inside the hero). */
  closeOnScroll?: boolean
  showSort?: boolean
  className?: string
}

/**
 * The property search bar: a location field plus type / beds & baths / price /
 * more-filters chips. Fully controlled — the results page keeps the filter
 * state in the URL, while the hero and sticky bars keep it in local state and
 * hand it to `onSubmit`.
 */
export function SearchFilterBar({
  value: f, onChange, onSubmit, layout = 'stacked',
  tone = 'light', closeOnScroll = false, showSort = false, className = '',
}: Readonly<Props>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const dark = tone === 'dark'

  const [text, setText] = useState(f.q)
  const [syncedQ, setSyncedQ] = useState(f.q)
  const [suggestOpen, setSuggestOpen] = useState(false)
  const inputWrapRef = useRef<HTMLDivElement>(null)

  // Keep the field in step when the query changes from outside (the URL is the
  // source of truth on the results page). Adjusting state during render is the
  // documented pattern for derived state — cheaper than an effect + re-render.
  if (syncedQ !== f.q) {
    setSyncedQ(f.q)
    setText(f.q)
  }

  useEffect(() => {
    if (!suggestOpen) return
    const onDown = (e: PointerEvent) => {
      if (inputWrapRef.current && !inputWrapRef.current.contains(e.target as Node)) setSuggestOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [suggestOpen])

  // Every option list and every bound comes from the live portfolio, so the
  // filters can never offer something that returns nothing.
  const counts = useMemo(() => typeCounts(f), [f])
  const suggestions = useMemo(() => locationSuggestions(text), [text])
  const types = useMemo(() => availableTypes(), [])
  const bedList = useMemo(() => bedOptions(), [])
  const bathList = useMemo(() => bathOptions(), [])
  const amenities = useMemo(() => amenityOptions(), [])
  const priceScale = useMemo(() => priceBounds(), [])
  const areaScale = useMemo(() => areaBounds(), [])
  const presets = useMemo(() => pricePresets(), [])
  const bedTally = useMemo(() => bedCounts(f), [f])
  const bathTally = useMemo(() => bathCounts(f), [f])
  const amenityTally = useMemo(() => amenityCounts(f), [f])
  const matchCount = useMemo(() => filterProperties(f).length, [f])

  const fmtNum = (n: number) => n.toLocaleString(isAr ? 'ar-QA' : 'en-US')

  const set = (patch: Partial<Filters>) => onChange({ ...f, ...patch })
  const submit = (next: Filters) => { setSuggestOpen(false); onSubmit?.(next) }

  // ── Chip labels ────────────────────────────────────────────────────────────
  const typeChip = f.types.length === 0
    ? (isAr ? 'نوع العقار' : 'Property type')
    : f.types.length === 1
      ? typeLabel(f.types[0], isAr)
      : (isAr ? 'نوع العقار' : 'Property type')

  const bedsChip = (() => {
    if (!f.beds.length && !f.baths.length) return isAr ? 'الغرف والحمامات' : 'Beds & Baths'
    const beds = f.beds.length ? `${f.beds.map((b) => bedLabel(b, isAr)).join(', ')} ${isAr ? 'غرف' : 'Beds'}` : ''
    const baths = f.baths.length ? `${f.baths.join(', ')} ${isAr ? 'حمام' : 'Baths'}` : ''
    return [beds, baths].filter(Boolean).join(' · ')
  })()

  const priceChip = (() => {
    const fmt = (n: number) => n.toLocaleString(isAr ? 'ar-QA' : 'en-US')
    if (f.minPrice === null && f.maxPrice === null) return isAr ? 'السعر' : 'Price'
    if (f.minPrice !== null && f.maxPrice !== null) return `${fmt(f.minPrice)} – ${fmt(f.maxPrice)}`
    if (f.maxPrice !== null) return `${isAr ? 'حتى' : 'Up to'} ${fmt(f.maxPrice)}`
    return `${isAr ? 'من' : 'From'} ${fmt(f.minPrice ?? 0)}`
  })()

  const extras = extraFilterCount(f)

  // ── Sub-panels ─────────────────────────────────────────────────────────────
  const chips = (
    <>
      <FilterPopover
        label={typeChip}
        badge={f.types.length > 1 ? f.types.length : undefined}
        active={f.types.length > 0}
        tone={tone}
        closeOnScroll={closeOnScroll}
        panelClass="w-[300px]"
      >
        {() => (
          <div>
            <PillGroup count={types.length}>
              {(limit) => types.slice(0, limit).map((t: PropertyType) => (
                <Pill key={t} on={f.types.includes(t)} count={counts[t]}
                  onClick={() => set({ types: toggle(f.types, t) })}>
                  {typeShort(t, isAr)}
                </Pill>
              ))}
            </PillGroup>
            {f.types.length > 0 && (
              <button type="button" onClick={() => set({ types: [] })}
                className="mt-3 block text-xs font-semibold text-lime hover:underline">
                {isAr ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>
        )}
      </FilterPopover>

      <FilterPopover
        label={bedsChip}
        active={f.beds.length > 0 || f.baths.length > 0}
        tone={tone}
        closeOnScroll={closeOnScroll}
        panelClass="w-[300px]"
      >
        {() => (
          <div className="flex flex-col gap-4">
            {/* No count badges on these — "3  12" beside a bedroom pill reads
                as a second number. Options with no matches dim instead. */}
            <div>
              <PanelHeading>{isAr ? 'غرف النوم' : 'Bedrooms'}</PanelHeading>
              <div className="flex flex-wrap gap-2">
                {bedList.map((b) => (
                  <Pill key={b} on={f.beds.includes(b)} muted={(bedTally[b] ?? 0) === 0}
                    onClick={() => set({ beds: toggle(f.beds, b) })}>
                    {bedLabel(b, isAr)}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <PanelHeading>{isAr ? 'الحمامات' : 'Bathrooms'}</PanelHeading>
              <div className="flex flex-wrap gap-2">
                {bathList.map((b) => (
                  <Pill key={b} on={f.baths.includes(b)} muted={(bathTally[b] ?? 0) === 0}
                    onClick={() => set({ baths: toggle(f.baths, b) })}>
                    {b === '5' ? '5+' : b}
                  </Pill>
                ))}
              </div>
            </div>
            {(f.beds.length > 0 || f.baths.length > 0) && (
              <button type="button" onClick={() => set({ beds: [], baths: [] })}
                className="self-start text-xs font-semibold text-lime hover:underline">
                {isAr ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>
        )}
      </FilterPopover>

      <FilterPopover
        label={priceChip}
        active={f.minPrice !== null || f.maxPrice !== null}
        tone={tone}
        closeOnScroll={closeOnScroll}
        panelClass="w-[320px]"
      >
        {() => (
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <NumberField label={isAr ? 'الحد الأدنى' : 'Min (QAR)'} value={f.minPrice}
                onChange={(v) => set({ minPrice: v })} placeholder={fmtNum(priceScale.min)} />
              <span className="pb-2.5 text-ink-faint">–</span>
              <NumberField label={isAr ? 'الحد الأعلى' : 'Max (QAR)'} value={f.maxPrice}
                onChange={(v) => set({ maxPrice: v })} placeholder={fmtNum(priceScale.max)} />
            </div>

            <RangeSlider
              bounds={priceScale}
              value={[f.minPrice, f.maxPrice]}
              onChange={([lo, hi]) => set({ minPrice: lo, maxPrice: hi })}
              format={fmtNum}
              minLabel={isAr ? 'أقل سعر' : 'Minimum price'}
              maxLabel={isAr ? 'أعلى سعر' : 'Maximum price'}
            />

            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => {
                const on = f.minPrice === p.min && f.maxPrice === p.max
                const label = p.min === null
                  ? `${isAr ? 'حتى' : 'Under'} ${fmtNum(p.max ?? 0)}`
                  : p.max === null
                    ? `${fmtNum(p.min)}+`
                    : `${fmtNum(p.min)} – ${fmtNum(p.max)}`
                return (
                  <Pill key={label} on={on}
                    onClick={() => set(on ? { minPrice: null, maxPrice: null } : { minPrice: p.min, maxPrice: p.max })}>
                    {label}
                  </Pill>
                )
              })}
            </div>

            <p className="text-xs text-ink-muted">
              {isAr
                ? `الإيجارات المتاحة من ${fmtNum(priceScale.min)} إلى ${fmtNum(priceScale.max)} ر.ق شهريًا — ${fmtNum(matchCount)} عقارًا مطابقًا.`
                : `Live rents run ${fmtNum(priceScale.min)} – ${fmtNum(priceScale.max)} QAR/month · ${matchCount} matching now.`}
            </p>
          </div>
        )}
      </FilterPopover>

      <FilterPopover
        label={isAr ? 'فلاتر' : 'Filters'}
        badge={extras || undefined}
        active={extras > 0}
        tone={tone}
        align="end"
        closeOnScroll={closeOnScroll}
        panelClass="w-[340px]"
        icon={<SlidersHorizontal size={14} />}
      >
        {(close) => (
          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
            <div>
              <PanelHeading>{isAr ? 'التأثيث' : 'Furnishing'}</PanelHeading>
              <div className="flex flex-wrap gap-2">
                {(['any', 'furnished', 'unfurnished'] as const).map((v) => (
                  <Pill key={v} on={f.furnishing === v} onClick={() => set({ furnishing: v })}>
                    {v === 'any' ? (isAr ? 'الكل' : 'Any') : v === 'furnished' ? (isAr ? 'مفروش' : 'Furnished') : (isAr ? 'غير مفروش' : 'Unfurnished')}
                  </Pill>
                ))}
              </div>
            </div>

            <div>
              <PanelHeading>{isAr ? 'المساحة (م²)' : 'Area (m²)'}</PanelHeading>
              <div className="mb-3 flex items-end gap-3">
                <NumberField label={isAr ? 'الأدنى' : 'Min'} value={f.minArea}
                  onChange={(v) => set({ minArea: v })} placeholder={String(areaScale.min)} />
                <span className="pb-2.5 text-ink-faint">–</span>
                <NumberField label={isAr ? 'الأعلى' : 'Max'} value={f.maxArea}
                  onChange={(v) => set({ maxArea: v })} placeholder={String(areaScale.max)} />
              </div>
              <RangeSlider
                bounds={areaScale}
                value={[f.minArea, f.maxArea]}
                onChange={([lo, hi]) => set({ minArea: lo, maxArea: hi })}
                format={(n) => `${n} m²`}
                minLabel={isAr ? 'أقل مساحة' : 'Minimum area'}
                maxLabel={isAr ? 'أكبر مساحة' : 'Maximum area'}
              />
            </div>

            <div>
              <PanelHeading>{isAr ? 'المرافق' : 'Amenities'}</PanelHeading>
              <PillGroup count={amenities.length}>
                {(limit) => amenities.slice(0, limit).map((a) => (
                  <Pill key={a} on={f.amenities.includes(a)} count={amenityTally[a] ?? 0}
                    onClick={() => set({ amenities: toggle(f.amenities, a) })}>
                    {a}
                  </Pill>
                ))}
              </PillGroup>
            </div>

            <div className="sticky bottom-0 -mx-4 -mb-4 flex items-center justify-between gap-3 border-t border-border bg-white px-4 py-3">
              <button
                type="button"
                onClick={() => onChange({ ...emptyFilters, q: f.q, sort: f.sort })}
                className="text-sm font-semibold text-ink-muted hover:text-ink"
              >
                {isAr ? 'إعادة ضبط الكل' : 'Reset all'}
              </button>
              <button
                type="button"
                onClick={() => { close(); submit(f) }}
                className="rounded-full bg-forest px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-forest-mid"
              >
                {isAr ? `عرض ${fmtNum(matchCount)} عقارًا` : `Show ${matchCount} ${matchCount === 1 ? 'property' : 'properties'}`}
              </button>
            </div>
          </div>
        )}
      </FilterPopover>

      {showSort && (
        <FilterPopover
          label={isAr ? SORT_LABEL[f.sort][1] : SORT_LABEL[f.sort][0]}
          active={f.sort !== emptyFilters.sort}
          tone={tone}
          align="end"
          closeOnScroll={closeOnScroll}
          panelClass="w-[220px]"
          icon={<ArrowDownUp size={14} />}
        >
          {(close) => (
            <div>
              <PanelHeading>{isAr ? 'ترتيب حسب' : 'Sort by'}</PanelHeading>
              <div role="radiogroup" aria-label={isAr ? 'ترتيب حسب' : 'Sort by'} className="flex flex-col">
                {SORTS.map((k) => {
                  const on = f.sort === k
                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => { set({ sort: k }); close() }}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-start transition-colors hover:bg-surface-low"
                    >
                      <span className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 transition-colors ${
                        on ? 'border-forest' : 'border-border'
                      }`}>
                        {on && <span className="h-2.5 w-2.5 rounded-full bg-forest" />}
                      </span>
                      <span className={`text-sm ${on ? 'font-semibold text-ink' : 'text-ink'}`}>
                        {isAr ? SORT_LABEL[k][1] : SORT_LABEL[k][0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </FilterPopover>
      )}
    </>
  )

  // ── The location field ─────────────────────────────────────────────────────
  const searchField = (
    <div ref={inputWrapRef} className={`relative ${layout === 'inline' ? 'min-w-[190px] flex-1 sm:min-w-[280px]' : 'w-full'}`}>
      <div className={`flex items-center gap-2 rounded-full border px-4 transition-colors ${
        layout === 'inline' ? 'h-11' : 'h-12 sm:h-14'
      } ${dark ? 'border-white/30 bg-white/12 backdrop-blur-sm focus-within:border-lime' : 'border-border bg-white focus-within:border-forest'}`}>
        <Search size={layout === 'inline' ? 17 : 19} className={dark ? 'shrink-0 text-white/70' : 'shrink-0 text-ink-faint'} />
        <input
          type="search"
          value={text}
          onChange={(e) => { setText(e.target.value); setSuggestOpen(true) }}
          onFocus={() => setSuggestOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); const next = { ...f, q: text }; onChange(next); submit(next) }
            if (e.key === 'Escape') setSuggestOpen(false)
          }}
          placeholder={isAr ? 'المدينة أو المنطقة أو المبنى' : 'City, community or building'}
          aria-label={isAr ? 'ابحث عن عقار' : 'Search properties'}
          className={`w-full min-w-0 bg-transparent text-sm outline-none sm:text-base ${
            dark ? 'text-white placeholder:text-white/60' : 'text-ink placeholder:text-ink-faint'
          } [&::-webkit-search-cancel-button]:hidden`}
        />
        {text && (
          <button
            type="button"
            aria-label={isAr ? 'مسح البحث' : 'Clear search'}
            onClick={() => { setText(''); const next = { ...f, q: '' }; onChange(next) }}
            className={`shrink-0 rounded-full p-1 transition-colors ${dark ? 'text-white/70 hover:bg-white/15' : 'text-ink-faint hover:bg-surface-low'}`}
          >
            <X size={15} />
          </button>
        )}
        <button
          type="button"
          onClick={() => { const next = { ...f, q: text }; onChange(next); submit(next) }}
          className={`shrink-0 rounded-full font-bold transition-colors ${
            layout === 'inline'
              ? 'bg-forest px-4 py-1.5 text-xs text-white hover:bg-forest-mid'
              : 'bg-lime px-5 py-2 text-sm text-white hover:bg-lime-dark sm:px-6 sm:py-2.5'
          }`}
        >
          {isAr ? 'بحث' : 'Search'}
        </button>
      </div>

      {suggestOpen && suggestions.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-forest/20">
          <p className="border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            {isAr ? 'المناطق الشائعة' : 'Popular locations'}
          </p>
          {suggestions.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => { setText(s.name); const next = { ...f, q: s.name }; onChange(next); submit(next) }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors hover:bg-surface-low"
            >
              <MapPin size={15} className="shrink-0 text-lime" />
              <span className="flex-1 truncate text-sm text-ink">{s.name}</span>
              <span className="text-xs text-ink-faint">{s.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  if (layout === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {searchField}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {searchField}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips}
      </div>
    </div>
  )
}
