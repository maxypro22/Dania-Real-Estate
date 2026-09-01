import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchFilterBar } from './SearchFilterBar'
import { properties } from '@/data/mockData'
import { emptyFilters, filtersToQuery, type Filters } from '@/lib/search'

/**
 * One-tap starting points under the hero search field. Labels are deliberately
 * short — the full "Staff accommodation" / "Shops & commercial" wording pushed
 * those two onto a second line of their own. The row is `flex-nowrap` and
 * scrolls sideways, so all six stay on one line at every width.
 */
const QUICK: { to: string; en: string; ar: string }[] = [
  { to: '/properties/?type=apartment&beds=1',      en: '1 Bedroom',   ar: 'غرفة نوم' },
  { to: '/properties/?type=apartment&beds=2,3',    en: 'Family',      ar: 'عائلية' },
  { to: '/properties/?type=villa,compound-villa',  en: 'Villas',      ar: 'فلل' },
  { to: '/properties/?type=studio,partition',      en: 'Studios',     ar: 'استوديو' },
  { to: '/properties/?type=staff',                 en: 'Staff',       ar: 'سكن عمال' },
  { to: '/properties/?type=shop',                  en: 'Shops',       ar: 'محلات' },
]

/**
 * The search block that opens the homepage hero — the visitor's first move is
 * finding a property, not reading a paragraph. Submitting hands the built
 * filter set to /properties/ as a shareable query string.
 */
export function HeroSearch() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const navigate = useNavigate()
  const [f, setF] = useState<Filters>(emptyFilters)

  return (
    <div className="max-w-3xl">
      <SearchFilterBar
        value={f}
        onChange={setF}
        onSubmit={(next) => navigate(`/properties/${filtersToQuery(next)}`)}
        tone="dark"
        closeOnScroll
      />

      {/* Phone screens keep the hero short — the chips above already cover this */}
      <div className="mt-4 hidden items-center gap-2 overflow-x-auto sm:flex [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-white/55">
          {isAr ? 'بحث سريع' : 'Popular'}
        </span>
        {QUICK.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:border-lime hover:bg-lime hover:text-forest"
          >
            {isAr ? q.ar : q.en}
          </Link>
        ))}
      </div>

      <p className="mt-4 text-sm text-white/60">
        {isAr
          ? `${properties.length} عقارًا موثقًا متاحًا الآن للإيجار — بدون عمولة خفية.`
          : `${properties.length} verified listings available right now — zero hidden commission.`}
      </p>
    </div>
  )
}
