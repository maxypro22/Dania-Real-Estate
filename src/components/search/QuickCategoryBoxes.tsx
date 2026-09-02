import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Building2, Home, BedDouble, Users, Store, type LucideIcon } from 'lucide-react'

interface Category {
  icon: LucideIcon
  en: string
  ar: string
  to: string
}

/** The five rental categories, in the order and wording the client specified. */
const CATEGORIES: Category[] = [
  { icon: Building2, en: 'Apartments',            ar: 'شقق',                     to: '/apartments-for-rent/' },
  { icon: Home,      en: 'Villas',                ar: 'فلل',                     to: '/villas-for-rent/' },
  { icon: BedDouble, en: 'Studios & Partitions',  ar: 'استوديوهات وبارتيشن',      to: '/studio-partition-rentals/' },
  { icon: Users,     en: 'Staff Accommodation',   ar: 'سكن عمال',                to: '/staff-accommodation/' },
  { icon: Store,     en: 'Shops',                 ar: 'محلات',                   to: '/shops-for-rent/' },
]

/**
 * The quick-category row that sits directly under the hero search panel: one
 * card per rental category, each a direct link to its landing page.
 *
 * Desktop shows all five in a single row. Below `lg` the row becomes a
 * horizontal swipe rail (snap points, hidden scrollbar) so it stays one gesture
 * rather than a tall stack; the narrowest screens fall back to two columns.
 */
export function QuickCategoryBoxes() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <section className="relative z-20 bg-surface py-10 lg:py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:snap-x sm:snap-mandatory sm:overflow-x-auto sm:pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(({ icon: Icon, en, ar, to }) => (
            <Link
              key={to}
              to={to}
              className="group flex snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-lime hover:bg-lime-light hover:shadow-lg hover:shadow-forest/10 active:-translate-y-1 active:bg-lime-light sm:min-w-[190px] sm:flex-1 lg:min-w-0"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-green text-forest transition-colors duration-300 group-hover:bg-lime group-hover:text-white group-active:bg-lime group-active:text-white">
                <Icon size={26} strokeWidth={1.6} />
              </span>
              <span className="text-sm font-bold leading-snug text-ink sm:text-base">
                {isAr ? ar : en}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
