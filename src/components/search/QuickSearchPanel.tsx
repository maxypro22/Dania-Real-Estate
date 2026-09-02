import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Phone } from 'lucide-react'
import { WhatsappIcon } from '@/components/shared/WhatsappIcon'
import { company, propertyDistricts, type PropertyType } from '@/data/mockData'
import { availableTypes, emptyFilters, filtersToQuery, typeLabel } from '@/lib/search'

/**
 * The top-level intent, which narrows the Property Type list beneath it — the
 * same two-step the client's reference site uses ("Looking for" → "Property
 * Type"), mapped onto the categories this portfolio actually carries.
 */
const LOOKING_FOR: { value: string; en: string; ar: string; types: PropertyType[] }[] = [
  { value: 'residential', en: 'Residential Rent', ar: 'إيجار سكني', types: ['apartment', 'villa', 'compound-villa', 'studio', 'partition'] },
  { value: 'commercial',  en: 'Commercial Rent',  ar: 'إيجار تجاري', types: ['shop'] },
  { value: 'staff',       en: 'Staff Housing',    ar: 'سكن عمال',   types: ['staff'] },
]

function Field({
  label, children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-0.5 px-4 py-2.5 sm:gap-1 sm:px-5 sm:py-3">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  )
}

const selectClass =
  'w-full cursor-pointer truncate bg-transparent text-sm font-semibold text-forest outline-none sm:text-base'

interface Props {
  /** 'panel' = the full hero widget; 'bar' = the slimmer site-wide version. */
  variant?: 'panel' | 'bar'
  className?: string
}

/**
 * The main search widget: Looking for · Location · Property Type · Ask for
 * Price. The fourth cell deliberately holds no dropdown — the client wants a
 * visitor who cares about price to reach a human, so it carries direct Call and
 * WhatsApp actions instead. The magnifier runs the search against the same
 * filter engine the results page uses.
 */
export function QuickSearchPanel({ variant = 'panel', className = '' }: Readonly<Props>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const navigate = useNavigate()

  const [lookingFor, setLookingFor] = useState('')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const districts = useMemo(() => propertyDistricts(), [])
  const allTypes = useMemo(() => availableTypes(), [])
  const group = LOOKING_FOR.find((g) => g.value === lookingFor)
  const typeOptions = group ? allTypes.filter((t) => group.types.includes(t)) : allTypes

  const search = () => {
    // A chosen type wins; otherwise fall back to the whole "Looking for" group.
    const types = propertyType
      ? [propertyType as PropertyType]
      : group?.types.filter((t) => allTypes.includes(t)) ?? []
    navigate(`/properties/${filtersToQuery({ ...emptyFilters, types, q: location })}`)
  }

  const callHref = `tel:${company.phone.replace(/\s/g, '')}`
  const waHref = `https://wa.me/${company.whatsapp}`
  const compact = variant === 'bar'

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white shadow-2xl shadow-forest/25 ring-1 ring-black/5 ${className}`}
    >
      <div className="flex flex-col divide-y divide-border lg:flex-row lg:items-stretch lg:divide-x lg:divide-y-0 rtl:lg:divide-x-reverse">
        <Field label={isAr ? 'أبحث عن' : 'Looking for'}>
          <select
            value={lookingFor}
            onChange={(e) => { setLookingFor(e.target.value); setPropertyType('') }}
            className={selectClass}
          >
            <option value="">{isAr ? 'اختر' : 'Select'}</option>
            {LOOKING_FOR.map((g) => (
              <option key={g.value} value={g.value}>{isAr ? g.ar : g.en}</option>
            ))}
          </select>
        </Field>

        <Field label={isAr ? 'الموقع' : 'Location'}>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
            <option value="">{isAr ? 'اختر' : 'Select'}</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>

        <Field label={isAr ? 'نوع العقار' : 'Property Type'}>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={selectClass}>
            <option value="">{isAr ? 'اختر' : 'Select'}</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>{typeLabel(t, isAr)}</option>
            ))}
          </select>
        </Field>

        {/* Ask for Price — two direct actions instead of a dropdown */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-4 py-2.5 sm:px-5 sm:py-3">
          <span className="text-xs font-medium text-ink-muted">{isAr ? 'اسأل عن السعر' : 'Ask for Price'}</span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={callHref}
              className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-forest px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-forest-mid sm:text-sm"
            >
              <Phone size={14} />
              {isAr ? 'اتصل للسعر' : 'Call for Price'}
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-whatsapp px-3 py-2 text-xs font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:text-sm"
            >
              <WhatsappIcon size={14} />
              {isAr ? 'واتساب' : 'WhatsApp'}
            </a>
          </div>
        </div>

        {/* Search */}
        <div className={`flex items-center justify-center px-4 pb-3 pt-1 lg:px-5 lg:py-3 ${compact ? 'lg:py-2.5' : ''}`}>
          <button
            type="button"
            onClick={search}
            aria-label={isAr ? 'ابحث عن العقارات' : 'Search properties'}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime font-bold text-white shadow-md shadow-lime/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-dark lg:aspect-square lg:w-12 ${
              compact ? 'h-11 lg:h-12' : 'h-12 lg:h-14 lg:w-14'
            }`}
          >
            <Search size={20} />
            <span className="lg:hidden">{isAr ? 'بحث' : 'Search'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
