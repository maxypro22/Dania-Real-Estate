import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { SearchFilterBar } from './SearchFilterBar'
import { QuickSearchPanel } from './QuickSearchPanel'
import { emptyFilters, filtersToParams, filtersToQuery, paramsToFilters, type Filters } from '@/lib/search'

/** Scroll distance after which the bar reveals itself, per route. */
const REVEAL_AT: Record<'home' | 'results', (vh: number) => number> = {
  home: (vh) => vh * 1.55,
  results: () => 220,
}

/**
 * The site-wide property search, pinned under the navbar on every page.
 *
 * - On the homepage it waits until the hero (which has the same search built
 *   in) has scrolled past, then slides in.
 * - On the results page it mirrors the page's own bar — same URL-bound filter
 *   state — and takes over as soon as that one scrolls away.
 * - Everywhere else it is simply always there, one field away from a search.
 */
export function StickySearchBar() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [local, setLocal] = useState<Filters>(emptyFilters)

  const isHome = pathname === '/'
  const onResults = pathname === '/properties/'
  const reveals = isHome || onResults
  const [past, setPast] = useState(false)

  useEffect(() => {
    if (!reveals) return
    const threshold = REVEAL_AT[isHome ? 'home' : 'results']
    const onScroll = () => setPast(window.scrollY > threshold(window.innerHeight))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reveals, isHome])

  // On the results page the URL is the source of truth, so both bars stay in
  // lockstep; elsewhere the bar holds a draft that a search hands over.
  const f = onResults ? paramsToFilters(params) : local
  const apply = (next: Filters) => {
    if (!onResults) { setLocal(next); return }
    const p = filtersToParams(next)
    if (params.get('saved') === '1') p.set('saved', '1')
    setParams(p, { replace: true })
  }
  const submit = (next: Filters) => {
    if (onResults) apply(next)
    else navigate(`/properties/${filtersToQuery(next)}`)
  }

  const shown = !reveals || past

  // Where it reveals, the bar floats over the page so it never reserves layout
  // space while hidden; elsewhere it is part of the flow and simply sticks.
  const position = reveals
    ? `fixed inset-x-0 top-16 transition-all duration-300 ease-out ${
        shown ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
      }`
    : 'sticky top-16'

  return (
    <div
      aria-hidden={!shown}
      className={`z-30 border-b border-border bg-white/95 backdrop-blur-sm ${position}`}
    >
      <div className="mx-auto max-w-[1720px] px-4 py-2.5 sm:px-6">
        {/* On the results page the visitor is actively filtering, so the chip
            bar (type / beds / price / sort, all URL-bound) is what belongs
            here. Everywhere else it is the same Looking-for → Location →
            Property Type panel the homepage banner uses. */}
        {onResults ? (
          <SearchFilterBar value={f} onChange={apply} onSubmit={submit} layout="inline" showSort />
        ) : (
          <>
            {/* The panel stacks its four cells below lg, which would make a
                300px-tall bar on a phone — there it collapses to one tap. */}
            <QuickSearchPanel variant="bar" className="hidden shadow-none ring-0 lg:block" />
            <Link
              to="/properties/"
              className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white lg:hidden"
            >
              <Search size={16} />
              {isAr ? 'ابحث عن عقار' : 'Search properties'}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
