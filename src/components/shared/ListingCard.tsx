import { memo } from 'react'
import { ArrowRight, BedDouble, Bath, Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Property } from '@/data/mockData'

export const ListingCard = memo(function ListingCard({ property }: { property: Property }) {
  const { t } = useTranslation()
  const { title, type, price, currency, period, bedrooms, bathrooms, area, location, verified, tags, image } = property

  const typeLabel: Record<string, string> = {
    apartment: t('listing.apartment'),
    villa: t('listing.villa'),
    'compound-villa': t('listing.compoundVilla'),
    shop: t('listing.commercial'),
    staff: t('listing.staffHousing'),
    studio: t('listing.studio'),
    partition: t('listing.partition'),
  }

  return (
    /* Outer div = hover trigger — never moves */
    <div className="group relative cursor-pointer active:scale-[0.985] transition-transform duration-150">

      {/* Card shell — clips the rotating border gradient */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-border">
        {/* Rotating conic-gradient — fades in on hover */}
        <div className="absolute inset-0 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: 'conic-gradient(from 0deg, transparent 0deg, #C4622D 40deg, #F5E8DC 52deg, #C4622D 64deg, transparent 110deg)',
            animation: 'border-spin 3s linear infinite',
          }} />
        </div>
      </div>

      {/* Inner white card — inset 2px to expose the spinning border */}
      <div
        className="relative z-[2] rounded-[14px] bg-white overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow duration-300"
        style={{ margin: '2px' }}
      >

        {/* ── Image section ── */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ willChange: 'transform' }}
          />

          {/* Featured badge */}
          {verified && (
            <span className="absolute top-3 left-3 bg-forest text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wide uppercase">
              {t('listing.featured')}
            </span>
          )}

          {/* First tag badge */}
          {tags?.[0] && (
            <span className="absolute top-3 right-3 bg-white/90 text-ink text-[10px] font-semibold px-2.5 py-1 rounded-full">
              {tags[0]}
            </span>
          )}
        </div>

        {/* ── Content section ── */}
        <div className="p-4">

          {/* Type label */}
          <p className="text-lime text-[10px] font-black uppercase tracking-[0.15em] mb-1">
            {typeLabel[type] ?? type}
          </p>

          {/* Title */}
          <h3 className="font-bold text-ink text-[15px] leading-snug mb-1 line-clamp-2">
            {title}
          </h3>

          {/* Location */}
          <p className="text-ink-muted text-xs mb-3 truncate">{location}</p>

          {/* Icons row */}
          <div className="flex items-center gap-3 text-ink-muted text-xs mb-4">
            {bedrooms !== null && (
              <span className="flex items-center gap-1">
                <BedDouble size={13} className="text-lime" />
                {bedrooms === 0 ? t('listing.studioLabel') : bedrooms}
              </span>
            )}
            {bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath size={13} className="text-lime" />
                {bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize2 size={13} className="text-lime" />
              {area} m²
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-3 flex items-center justify-between">
            {/* Price */}
            <div>
              <span className="text-lg font-black text-ink">{currency} {price.toLocaleString()}</span>
              <span className="text-ink-muted text-xs ml-1">{period}</span>
            </div>

            {/* Details button */}
            <span className="inline-flex items-center gap-1.5 bg-forest text-white font-semibold text-xs px-4 py-2.5 rounded-full group-hover:bg-lime group-hover:text-forest transition-colors duration-300">
              {t('listing.details')} <ArrowRight size={11} />
            </span>
          </div>

        </div>
      </div>

      {/* Outer glow halo on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: '0 0 28px 4px rgba(196,98,45,0.20)' }}
      />
    </div>
  )
})
