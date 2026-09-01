import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Bed, Bath, Maximize2, Home, MapPin, Heart, Phone, Mail, ChevronLeft, ChevronRight,
  X, CheckCircle2, BadgeCheck, Share2, Images, ArrowRight, ShieldCheck,
} from 'lucide-react'
import { WhatsappIcon } from '@/components/shared/WhatsappIcon'
import { PropertyCard } from '@/components/search/PropertyCard'
import { usePageSchema } from '@/components/shared/seo-context'
import { useSavedProperties, toggleSaved } from '@/hooks/useSavedProperties'
import { company, properties, propertyBySlug, type Property } from '@/data/mockData'
import { SITE_ORIGIN } from '@/lib/seo'
import {
  formatPrice, listedAgo, propertyHref, similarProperties, TYPE_ROUTE,
  typeSingular, whatsappEnquiry,
} from '@/lib/search'
import { NotFoundPage } from './NotFoundPage'

// Read once at module load: `datePosted` in the JSON-LD must be stable across
// re-renders (and a listing's age only changes between sessions anyway).
const PAGE_LOAD_MS = Date.now()

/* ── Full-screen photo viewer ─────────────────────────────────────────────── */
function Lightbox({
  images, start, alt, onClose,
}: Readonly<{ images: string[]; start: number; alt: string; onClose: () => void }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [i, setI] = useState(start)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % images.length)
      if (e.key === 'ArrowLeft') setI((v) => (v - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [images.length, onClose])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label={alt}>
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-medium">{i + 1} / {images.length}</span>
        <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
          <X size={20} />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
        <button type="button" onClick={() => setI((v) => (v - 1 + images.length) % images.length)}
          aria-label={isAr ? 'السابق' : 'Previous'}
          className="absolute start-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25">
          <ChevronLeft size={22} className="rtl:-scale-x-100" />
        </button>
        <img src={images[i]} alt={alt} width={1600} height={1067} className="max-h-full max-w-full rounded-xl object-contain" />
        <button type="button" onClick={() => setI((v) => (v + 1) % images.length)}
          aria-label={isAr ? 'التالي' : 'Next'}
          className="absolute end-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25">
          <ChevronRight size={22} className="rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  )
}

/* ── Gallery: hero frame + thumbnail column ───────────────────────────────── */
function Gallery({ p, onOpen }: Readonly<{ p: Property; onOpen: (i: number) => void }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [main, setMain] = useState(0)
  const thumbs = p.images.slice(0, 5)

  return (
    <div className="grid gap-2 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
      <button type="button" onClick={() => onOpen(main)} className="group relative block overflow-hidden rounded-2xl">
        <img
          src={p.images[main]}
          alt={p.title}
          width={1200}
          height={800}
          fetchPriority="high"
          decoding="async"
          className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 end-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm">
          <Images size={14} />
          {isAr ? `عرض كل الصور (${p.images.length})` : `View all ${p.images.length} photos`}
        </span>
      </button>

      <div className="grid grid-cols-4 gap-2 md:grid-cols-1">
        {thumbs.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setMain(i)}
            aria-label={`${isAr ? 'صورة' : 'Photo'} ${i + 1}`}
            className={`overflow-hidden rounded-xl border-2 transition-colors ${
              main === i ? 'border-lime' : 'border-transparent hover:border-border'
            }`}
          >
            <img src={src} alt="" width={400} height={300} loading="lazy" decoding="async"
              className="aspect-[4/3] w-full object-cover md:aspect-[3/2]" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Sticky enquiry card ──────────────────────────────────────────────────── */
function AgentPanel({ p }: Readonly<{ p: Property }>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <img src={p.agent.photo} alt="" width={96} height={96}
          className="h-12 w-12 shrink-0 rounded-full border border-border bg-white object-contain p-1" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-lime">{p.agent.role}</p>
          <p className="truncate font-bold text-ink">{p.agent.name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <a href={`tel:${p.agent.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-mid">
          <Phone size={16} /> {isAr ? `اتصل ${p.agent.phone}` : `Call ${p.agent.phone}`}
        </a>
        <a href={whatsappEnquiry(p, isAr)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5">
          <WhatsappIcon size={16} /> {isAr ? 'راسلنا على واتساب' : 'WhatsApp us'}
        </a>
        <a href={`mailto:${company.email}?subject=${encodeURIComponent(`${p.reference} — ${p.title}`)}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-bold text-forest transition-colors hover:bg-surface-low">
          <Mail size={16} /> {isAr ? 'أرسل بريدًا' : 'Email'}
        </a>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-green px-3 py-2.5 text-xs leading-relaxed text-forest">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-lime" />
        <span>
          {isAr
            ? 'صفر عمولة على المستأجر. السعر المعلن هو ما تدفعه بالضبط.'
            : 'Zero tenant commission. The advertised price is exactly what you pay.'}
        </span>
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-faint">
        {isAr ? `المرجع: ${p.reference}` : `Ref: ${p.reference}`}
      </p>
    </div>
  )
}

/* ── PAGE ─────────────────────────────────────────────────────────────────── */
export function PropertyDetailPage() {
  const { slug = '' } = useParams()
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const saved = useSavedProperties()
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const p = propertyBySlug(slug)
  const similar = useMemo(() => (p ? similarProperties(p, properties, 3) : []), [p])

  usePageSchema(p ? [{
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${SITE_ORIGIN}${propertyHref(p)}#listing`,
    url: `${SITE_ORIGIN}${propertyHref(p)}`,
    name: p.title,
    description: p.description,
    image: p.images,
    datePosted: new Date(PAGE_LOAD_MS - p.listedDaysAgo * 86_400_000).toISOString().slice(0, 10),
    provider: { '@id': `${SITE_ORIGIN}/#organization` },
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: p.currency,
      availability: 'https://schema.org/InStock',
    },
    about: {
      '@type': 'Accommodation',
      name: p.title,
      numberOfBedrooms: p.bedrooms ?? undefined,
      numberOfBathroomsTotal: p.bathrooms ?? undefined,
      floorSize: { '@type': 'QuantitativeValue', value: p.area, unitCode: 'MTK' },
      address: { '@type': 'PostalAddress', addressLocality: p.district, addressCountry: 'QA' },
      amenityFeature: p.amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })),
    },
  }] : [])

  if (!p) return <NotFoundPage />

  const on = saved.has(p.id)
  const beds = p.bedrooms === null ? null : p.bedrooms === 0 ? (isAr ? 'استوديو' : 'Studio') : String(p.bedrooms)

  const share = async () => {
    const url = `${SITE_ORIGIN}${propertyHref(p)}`
    try {
      if (navigator.share) await navigator.share({ title: p.title, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Cancelled by the user, or the browser blocked it — nothing to do.
    }
  }

  const facts: [string, string][] = [
    [isAr ? 'النوع' : 'Type', typeSingular(p.type, isAr)],
    [isAr ? 'الغرض' : 'Purpose', isAr ? 'للإيجار' : 'For rent'],
    [isAr ? 'المرجع' : 'Reference', p.reference],
    [isAr ? 'التأثيث' : 'Furnishing', p.furnished ? (isAr ? 'مفروش' : 'Furnished') : (isAr ? 'غير مفروش' : 'Unfurnished')],
    [isAr ? 'المساحة' : 'Area', `${p.area} m²`],
    ...(beds ? [[isAr ? 'غرف النوم' : 'Bedrooms', beds] as [string, string]] : []),
    ...(p.bathrooms !== null ? [[isAr ? 'الحمامات' : 'Bathrooms', String(p.bathrooms)] as [string, string]] : []),
    ...(p.floor ? [[isAr ? 'الطابق' : 'Floor', p.floor] as [string, string]] : []),
    ...(p.parking ? [[isAr ? 'مواقف السيارات' : 'Parking', String(p.parking)] as [string, string]] : []),
    [isAr ? 'المنطقة' : 'Community', p.district],
    [isAr ? 'تاريخ الإدراج' : 'Listed', listedAgo(p.listedDaysAgo, isAr)],
  ]

  return (
    <div className="bg-surface pb-24 md:pb-0">
      <title>{`${p.title} | ${formatPrice(p.price, p.currency)} — Dania Real Estate`}</title>
      <meta name="description" content={p.description.slice(0, 158)} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
          <li><Link to="/" className="hover:text-lime">{isAr ? 'الرئيسية' : 'Home'}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/properties/" className="hover:text-lime">{isAr ? 'العقارات' : 'Properties'}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={TYPE_ROUTE[p.type]} className="hover:text-lime">{typeSingular(p.type, isAr)}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="truncate font-medium text-ink">{p.location}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6">
        <Gallery p={p} onOpen={setLightbox} />

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ── Left column ── */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-xs text-ink-faint">{listedAgo(p.listedDaysAgo, isAr)}</p>
                <p className="text-3xl font-extrabold leading-none text-ink sm:text-4xl">
                  {formatPrice(p.price, p.currency, isAr)}
                  <span className="ms-2 text-base font-medium text-ink-muted">{p.period}</span>
                </p>
                <h1 className="mt-2 text-xl font-bold leading-snug text-forest sm:text-2xl">{p.title}</h1>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                  <MapPin size={15} className="text-lime" /> {p.location}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => toggleSaved(p.id)} aria-pressed={on}
                  aria-label={on ? (isAr ? 'إزالة من المحفوظات' : 'Remove from saved') : (isAr ? 'حفظ' : 'Save')}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-forest transition-colors hover:bg-surface-low">
                  <Heart size={17} className={on ? 'fill-lime text-lime' : ''} />
                </button>
                <button type="button" onClick={share} aria-label={isAr ? 'مشاركة' : 'Share'}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-forest transition-colors hover:bg-surface-low">
                  <Share2 size={16} />
                </button>
                {copied && <span className="text-xs font-semibold text-lime">{isAr ? 'تم النسخ' : 'Link copied'}</span>}
              </div>
            </div>

            {/* Key facts */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-border bg-white px-5 py-4">
              {beds && (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                  <Bed size={18} className="text-lime" /> {beds} {isAr ? '' : 'Beds'}
                </span>
              )}
              {p.bathrooms !== null && (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                  <Bath size={18} className="text-lime" /> {p.bathrooms} {isAr ? '' : 'Baths'}
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                <Maximize2 size={17} className="text-lime" /> {p.area} m²
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                <Home size={17} className="text-lime" /> {typeSingular(p.type, isAr)}
              </span>
              {p.verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3 py-1 text-xs font-bold text-forest">
                  <BadgeCheck size={13} className="text-lime" /> {isAr ? 'عقار موثّق' : 'Verified listing'}
                </span>
              )}
            </div>

            {/* Description */}
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-ink">{isAr ? 'عن هذا العقار' : 'About this property'}</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-lime-light px-3 py-1 text-xs font-semibold text-lime">{tag}</span>
                ))}
              </div>
            </section>

            {/* Details table */}
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-ink">{isAr ? 'تفاصيل العقار' : 'Property details'}</h2>
              <dl className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-white sm:grid-cols-2">
                {facts.map(([k, v], i) => (
                  <div key={k} className={`flex items-center justify-between gap-4 px-5 py-3 text-sm ${
                    i % 2 === 0 ? 'bg-white' : 'bg-surface/60'
                  }`}>
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Amenities */}
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-ink">{isAr ? 'المرافق والخدمات' : 'Amenities'}</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {p.amenities.map((a) => (
                  <li key={a} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink">
                    <CheckCircle2 size={15} className="shrink-0 text-lime" /> {a}
                  </li>
                ))}
              </ul>
            </section>

            {/* Location */}
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-ink">{isAr ? 'الموقع' : 'Location'}</h2>
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 font-semibold text-ink">
                    <MapPin size={16} className="text-lime" /> {p.location}
                  </p>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-muted">
                    {isAr
                      ? `يقع هذا العقار في ${p.district}، إحدى المناطق التي تديرها دانية العقارية في قطر. تواصل معنا لمعرفة أقرب الخدمات والمواصلات.`
                      : `This unit sits in ${p.district}, one of the communities Dania Real Estate covers across Qatar. Ask our desk about the nearest metro, schools, and shopping.`}
                  </p>
                </div>
                <Link to="/areas/"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-forest px-5 py-2.5 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-white">
                  {isAr ? 'تصفح المناطق' : 'Explore areas'} <ArrowRight size={15} className="rtl:-scale-x-100" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── Right column ── */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <AgentPanel p={p} />
          </aside>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="text-xl font-bold text-ink">{isAr ? 'عقارات مشابهة' : 'Similar properties'}</h2>
              <Link to="/properties/" className="text-sm font-semibold text-lime hover:underline">
                {isAr ? 'عرض الكل' : 'View all'}
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {similar.map((s) => <PropertyCard key={s.id} p={s} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold text-ink">{formatPrice(p.price, p.currency, isAr)}</p>
          <p className="truncate text-[11px] text-ink-muted">{p.reference}</p>
        </div>
        <a href={`tel:${p.agent.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2.5 text-xs font-bold text-white">
          <Phone size={14} /> {isAr ? 'اتصال' : 'Call'}
        </a>
        <a href={whatsappEnquiry(p, isAr)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-4 py-2.5 text-xs font-bold text-white">
          <WhatsappIcon size={14} /> {isAr ? 'واتساب' : 'WhatsApp'}
        </a>
      </div>

      {lightbox !== null && (
        <Lightbox images={p.images} start={lightbox} alt={p.title} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}
