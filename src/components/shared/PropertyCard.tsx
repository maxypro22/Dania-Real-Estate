import { BedDouble, Bath, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Property } from '@/data/mockData'

interface PropertyCardProps {
  property: Readonly<Property>
}

const typeLabel: Record<string, string> = {
  apartment: 'APARTMENT',
  villa: 'VILLA',
  'compound-villa': 'COMPOUND VILLA',
  shop: 'COMMERCIAL',
  staff: 'STAFF HOUSING',
  studio: 'STUDIO',
  partition: 'PARTITION',
}

export function PropertyCard({ property }: Readonly<PropertyCardProps>) {
  const { title, type, price, currency, period, bedrooms, bathrooms, area, location, furnished, verified, image } = property

  return (
    <div className="bg-white rounded-2xl border border-border hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-row">
      {/* Image */}
      <div className="relative w-44 shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {verified && (
          <span className="absolute top-3 left-3 bg-lime text-forest text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
        <div>
          <p className="text-[10px] font-bold text-ink-muted tracking-widest uppercase mb-1">{typeLabel[type] ?? type}</p>
          <h3 className="font-bold text-ink text-base leading-snug mb-1 truncate">{title}</h3>
          <p className="text-ink-muted text-xs mb-3 truncate">{location}</p>

          <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap">
            {bedrooms !== null && (
              <span className="flex items-center gap-1">
                <BedDouble size={12} /> {bedrooms === 0 ? 'Studio' : `${bedrooms} BR`}
              </span>
            )}
            {bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath size={12} /> {bathrooms} Bath
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize2 size={12} /> {area} m²
            </span>
            {furnished && <span className="bg-surface-green text-forest text-[10px] px-2 py-0.5 rounded-full font-medium">Furnished</span>}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div>
            <span className="text-lg font-black text-forest">{currency} {price.toLocaleString()}</span>
            <span className="text-ink-muted text-xs ml-1">{period}</span>
          </div>
          <Button variant="dark" size="sm">Details</Button>
        </div>
      </div>
    </div>
  )
}
