import { useTranslation } from 'react-i18next'
import { availableTypes, typeCounts, typeLabel, type Filters } from '@/lib/search'
import type { PropertyType } from '@/data/mockData'

interface Props {
  value: Filters
  onChange: (next: Filters) => void
}

/**
 * The category row above the results — one chip per property type with its
 * live count. Counts ignore the type filter itself, so the row always shows
 * what you would get by switching category.
 */
export function CategoryChips({ value: f, onChange }: Readonly<Props>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const counts = typeCounts(f)
  // Only categories the portfolio actually contains are offered.
  const types = availableTypes()
  const total = types.reduce((sum, t) => sum + counts[t], 0)

  const select = (t: PropertyType) => {
    const on = f.types.length === 1 && f.types[0] === t
    onChange({ ...f, types: on ? [] : [t] })
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onChange({ ...f, types: [] })}
        className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          f.types.length === 0
            ? 'border-forest bg-forest text-white'
            : 'border-border bg-white text-ink hover:border-forest/40 hover:bg-surface-low'
        }`}
      >
        {isAr ? 'الكل' : 'All'}
        <span className="ms-2 text-xs opacity-70">{total}</span>
      </button>

      {types.map((t) => {
        const on = f.types.includes(t)
        const empty = counts[t] === 0
        return (
          <button
            key={t}
            type="button"
            onClick={() => select(t)}
            disabled={empty && !on}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              on
                ? 'border-forest bg-forest text-white'
                : empty
                  ? 'cursor-not-allowed border-border/60 bg-white text-ink-faint'
                  : 'border-border bg-white text-ink hover:border-forest/40 hover:bg-surface-low'
            }`}
          >
            {typeLabel(t, isAr)}
            <span className="ms-2 text-xs opacity-70">{counts[t]}</span>
          </button>
        )
      })}
    </div>
  )
}
