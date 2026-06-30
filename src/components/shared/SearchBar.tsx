import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

/* Custom dropdown — matches navbar panel design */
function SearchDropdown({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  /* Close when clicking outside */
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative flex-1 min-w-32">
      {/* Trigger — pill shape matching SearchBar style */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-full border border-border text-ink bg-white text-sm font-medium hover:bg-surface-low transition-colors"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={14}
          className={`text-ink-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel — exact navbar design */}
      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-border rounded-lg shadow-lg z-50 py-1 min-w-44 max-h-52 overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-surface-green rounded-sm ${
                value === opt ? 'text-forest font-semibold' : 'text-ink-muted'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchBar() {
  const { t } = useTranslation()

  const propertyTypes  = [t('search.allTypes'), t('search.apartments'), t('search.villas'), t('search.shops'), t('search.staffHousing'), t('search.studios')]
  const bedroomOptions = [t('search.anyBedrooms'), t('search.studio'), t('search.bedroom1'), t('search.bedroom2'), t('search.bedroom3')]
  const areaOptions    = [t('search.anyArea'), t('search.alSadd'), t('search.binMahmoud'), t('search.alWakra'), t('search.alAziziya'), t('search.oldAirport'), t('search.ummSalal'), t('search.alKharaitiyat')]

  const [type, setType]         = useState(propertyTypes[0])
  const [bedrooms, setBedrooms] = useState(bedroomOptions[0])
  const [location, setLocation] = useState(areaOptions[0])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-wrap gap-2 items-center">
      <SearchDropdown value={type}     onChange={setType}     options={propertyTypes}  />
      <SearchDropdown value={bedrooms} onChange={setBedrooms} options={bedroomOptions} />
      <SearchDropdown value={location} onChange={setLocation} options={areaOptions}    />
      <Button variant="dark" size="md" className="whitespace-nowrap flex items-center gap-2">
        <Search size={15} /> {t('search.searchProperties')}
      </Button>
    </div>
  )
}
