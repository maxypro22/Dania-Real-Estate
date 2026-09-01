import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bed, Bath, Maximize2, Home, Heart, Phone, BadgeCheck } from 'lucide-react'
import { WhatsappIcon } from '@/components/shared/WhatsappIcon'
import { PropertyPhotoStrip } from './PropertyPhotoStrip'
import { useSavedProperties, toggleSaved } from '@/hooks/useSavedProperties'
import { formatPrice, listedAgo, propertyHref, typeSingular, whatsappEnquiry } from '@/lib/search'
import type { Property } from '@/data/mockData'

function SaveButton({ p }: Readonly<{ p: Property }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const saved = useSavedProperties()
  const on = saved.has(p.id)
  return (
    <button
      type="button"
      onClick={() => toggleSaved(p.id)}
      aria-pressed={on}
      aria-label={on ? (isAr ? 'إزالة من المحفوظات' : 'Remove from saved') : (isAr ? 'حفظ العقار' : 'Save property')}
      className="absolute end-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-forest shadow-md backdrop-blur-sm transition-colors hover:bg-white"
    >
      <Heart size={17} className={on ? 'fill-lime text-lime' : ''} />
    </button>
  )
}

function Badges({ p }: Readonly<{ p: Property }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  return (
    <div className="absolute start-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
      {p.premium && (
        <span className="rounded-md bg-forest/90 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-lime backdrop-blur-sm">
          {isAr ? 'مميز' : 'Premium'}
        </span>
      )}
      {p.verified && (
        <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-forest backdrop-blur-sm">
          <BadgeCheck size={12} className="text-lime" />
          {isAr ? 'موثّق' : 'Verified'}
        </span>
      )}
    </div>
  )
}

function MetaRow({ p }: Readonly<{ p: Property }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const beds = p.bedrooms === null ? null : p.bedrooms === 0 ? (isAr ? 'استوديو' : 'studio') : String(p.bedrooms)
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-ink-muted">
      {beds !== null && (
        <span className="inline-flex items-center gap-1.5"><Bed size={16} className="text-ink-faint" />{beds}</span>
      )}
      {p.bathrooms !== null && (
        <span className="inline-flex items-center gap-1.5"><Bath size={16} className="text-ink-faint" />{p.bathrooms}</span>
      )}
      <span aria-hidden="true" className="text-border">|</span>
      <span className="inline-flex items-center gap-1.5">
        <Maximize2 size={15} className="text-ink-faint" />
        {isAr ? `المساحة: ${p.area} م²` : `Area: ${p.area} m²`}
      </span>
      <span aria-hidden="true" className="text-border">|</span>
      <span className="inline-flex items-center gap-1.5"><Home size={15} className="text-ink-faint" />{typeSingular(p.type, isAr)}</span>
    </div>
  )
}

function AgentRow({ p, compact = false }: Readonly<{ p: Property; compact?: boolean }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  return (
    <div className="mt-auto flex items-center gap-3 border-t border-border pt-3">
      <img
        src={p.agent.photo}
        alt=""
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
        className="h-9 w-9 shrink-0 rounded-full border border-border bg-white object-contain p-0.5"
      />
      <div className={`min-w-0 flex-1 ${compact ? 'hidden sm:block' : ''}`}>
        <p className="text-[10px] font-bold uppercase tracking-wide text-lime">{p.agent.role}</p>
        <p className="truncate text-sm font-semibold text-ink">{p.agent.name}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={`tel:${p.agent.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3 py-2 text-xs font-bold text-forest transition-colors hover:bg-lime hover:text-white sm:px-4"
        >
          <Phone size={14} />
          <span>{isAr ? 'اتصال' : 'Call'}</span>
        </a>
        <a
          href={whatsappEnquiry(p, isAr)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-3 py-2 text-xs font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:px-4"
        >
          <WhatsappIcon size={14} />
          <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
        </a>
      </div>
    </div>
  )
}

/** The standard grid card. */
export function PropertyCard({ p, eager = false }: Readonly<{ p: Property; eager?: boolean }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const href = propertyHref(p)

  return (
    <article className="linear-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative">
        <Link to={href} aria-label={p.title} className="block">
          <PropertyPhotoStrip images={p.images} alt={p.title} eager={eager} />
        </Link>
        <Badges p={p} />
        <SaveButton p={p} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-ink-faint">{listedAgo(p.listedDaysAgo, isAr)}</p>
        <p className="text-2xl font-extrabold leading-none text-ink">
          {formatPrice(p.price, p.currency, isAr)}
          <span className="ms-1 text-sm font-medium text-ink-muted">{p.period}</span>
        </p>
        <h3 className="text-base font-semibold leading-snug text-forest">
          <Link to={href} className="transition-colors hover:text-lime">{p.title}</Link>
        </h3>
        <MetaRow p={p} />
        <p className="text-sm text-ink-muted">{p.location}</p>
        <AgentRow p={p} compact />
      </div>
    </article>
  )
}

/** The wide "Premium" row card shown above the grid, as in the reference UI. */
export function PropertyRowCard({ p }: Readonly<{ p: Property }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const href = propertyHref(p)

  return (
    <article className="linear-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-white md:flex-row">
      <div className="relative md:w-[38%] md:shrink-0">
        <Link to={href} aria-label={p.title} className="block h-full">
          <PropertyPhotoStrip images={p.images} alt={p.title} className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[260px]" />
        </Link>
        <Badges p={p} />
        <SaveButton p={p} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-ink-faint">{listedAgo(p.listedDaysAgo, isAr)}</p>
          <span className="rounded-full bg-lime-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lime">
            {isAr ? 'مميز' : 'Premium'}
          </span>
        </div>
        <p className="text-3xl font-extrabold leading-none text-ink">
          {formatPrice(p.price, p.currency, isAr)}
          <span className="ms-1.5 text-sm font-medium text-ink-muted">{p.period}</span>
        </p>
        <h3 className="text-lg font-semibold leading-snug text-forest">
          <Link to={href} className="transition-colors hover:text-lime">{p.title}</Link>
        </h3>
        <MetaRow p={p} />
        <p className="text-sm text-ink-muted">{p.location}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">{p.description}</p>
        <AgentRow p={p} />
      </div>
    </article>
  )
}
