import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown, ChevronUp, Eye, Camera, LayoutGrid, ArrowRight } from 'lucide-react'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'Show All' | 'Apartments' | 'Villas' | 'Staff Housing' | 'Shops' | 'Studios' | 'Partition Rooms'

interface GalleryImage {
  src: string
  label: string
  labelAr: string
  alt: string
  category: Exclude<FilterKey, 'Show All'>
}

// ─── Static data ──────────────────────────────────────────────────────────────

const FILTERS: FilterKey[] = ['Show All', 'Apartments', 'Villas', 'Staff Housing', 'Shops', 'Studios', 'Partition Rooms']

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Doha Apartment Style',
    labelAr: 'تصميم شقة الدوحة',
    alt: 'Verified contemporary apartment rental interior layout style in Doha Qatar.',
    category: 'Apartments',
  },
  {
    src: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Al Sadd Apartment Layout',
    labelAr: 'تخطيط شقة السد',
    alt: 'Modern residential flat interior layout and design within the Al Sadd district.',
    category: 'Apartments',
  },
  {
    src: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Bin Mahmoud Rental Interior',
    labelAr: 'داخلية إيجار بن محمود',
    alt: 'Open-plan kitchen and living room layout inside a family apartment rental in Doha.',
    category: 'Apartments',
  },
  {
    src: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Family Apartment Interior',
    labelAr: 'داخلية الشقة العائلية',
    alt: 'Spacious family apartment interior layout configuration in Qatar.',
    category: 'Apartments',
  },
  {
    src: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Qatar Villa Exterior',
    labelAr: 'مظهر خارجي للفيلا في قطر',
    alt: 'High-quality independent residential villa rental structural design in Qatar.',
    category: 'Villas',
  },
  {
    src: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Family Villa Style',
    labelAr: 'طراز الفيلا العائلية',
    alt: 'Symmetrical exterior landscape view of a multi-bedroom family villa rental compound.',
    category: 'Villas',
  },
  {
    src: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Compound Villa Estate',
    labelAr: 'مجمع الفلل الراقية',
    alt: 'External architectural view of a secure family compound villa rental in Qatar.',
    category: 'Villas',
  },
  {
    src: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Staff Accommodation Setup',
    labelAr: 'تهيئة سكن الموظفين',
    alt: 'Certified regulatory-compliant corporate workforce staff accommodation layout structure.',
    category: 'Staff Housing',
  },
  {
    src: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Workforce Room Standard',
    labelAr: 'غرفة العمال المعيارية',
    alt: 'Clean, spacious bedroom configuration within an enterprise staff accommodation building.',
    category: 'Staff Housing',
  },
  {
    src: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Shop Space in Doha',
    labelAr: 'مساحة محل تجاري في الدوحة',
    alt: 'High-visibility commercial shop space for rent in an active Doha trade lane.',
    category: 'Shops',
  },
  {
    src: 'https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Commercial Retail Shell',
    labelAr: 'واجهة المحل التجاري',
    alt: 'Exterior storefront and commercial retail shop rental layout design in Qatar.',
    category: 'Shops',
  },
  {
    src: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Studio Rental Interior',
    labelAr: 'داخلية استوديو للإيجار',
    alt: 'Compact modern studio apartment rental layout configuration for professionals.',
    category: 'Studios',
  },
  {
    src: 'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=400',
    label: 'Partition Room Layout',
    labelAr: 'تخطيط غرفة القسم',
    alt: 'Orderly, affordable private partition room rental setup for single executives in Doha.',
    category: 'Partition Rooms',
  },
]

// ─── Static hrefs and icons (non-translatable) ───────────────────────────────

const CATEGORY_HREFS = [
  '/apartments-for-rent/',
  '/villas-for-rent/',
  '/staff-accommodation/',
  '/shops-for-rent/',
  '/studio-partition-rentals/',
]

const HOW_IT_HELPS_ICONS = [Eye, Camera, LayoutGrid, ArrowRight]

const SERVICE_HREFS = [
  '/apartments-for-rent/',
  '/villas-for-rent/',
  '/staff-accommodation/',
  '/shops-for-rent/',
  '/studio-partition-rentals/',
]

const AREA_BADGES = [
  { label: 'Doha', labelAr: 'الدوحة', href: '/areas/doha/' },
  { label: 'Al Sadd', labelAr: 'السد', href: '/areas/al-sadd/' },
  { label: 'Bin Mahmoud', labelAr: 'بن محمود', href: '/areas/bin-mahmoud/' },
  { label: 'Al Wakra', labelAr: 'الوكرة', href: '/areas/al-wakra/' },
  { label: 'Al Aziziya', labelAr: 'العزيزية', href: '/areas/al-aziziya/' },
  { label: 'Old Airport', labelAr: 'المطار القديم', href: '/areas/old-airport/' },
  { label: 'Umm Salal', labelAr: 'أم صلال', href: '/areas/umm-salal/' },
  { label: 'Al Kharaitiyat', labelAr: 'الخريطيات', href: '/areas/al-kharaitiyat/' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-surface-low transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-ink">{q}</span>
        {open ? (
          <ChevronUp size={18} className="text-ink-muted shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-ink-muted shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-ink-muted text-sm leading-relaxed">{a}</div>
      )}
    </div>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

const PHOTO_REQUEST_AREAS = ['Doha', 'Al Sadd', 'Bin Mahmoud', 'Al Wakra', 'Al Aziziya', 'Old Airport', 'Umm Salal', 'Al Kharaitiyat']
const PHOTO_REQUEST_AREAS_AR = ['الدوحة', 'السد', 'بن محمود', 'الوكرة', 'العزيزية', 'المطار القديم', 'أم صلال', 'الخريطيات']
const PHOTO_REQUEST_CATEGORIES = ['Apartments', 'Villas', 'Staff Housing', 'Shops', 'Studios', 'Partition Rooms']
const PHOTO_REQUEST_CATEGORIES_AR = ['شقق', 'فلل', 'سكن الموظفين', 'محلات', 'استوديوهات', 'غرف مقسمة']

export function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('Show All')
  const [photoForm, setPhotoForm] = useState({ name: '', phone: '', area: '', category: '', budget: '', moveIn: '' })
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const FILTER_LABELS: Record<string, string> = {
    'Show All': t('gallery.showcase.filters.showAll'),
    'Apartments': t('gallery.showcase.filters.apartments'),
    'Villas': t('gallery.showcase.filters.villas'),
    'Staff Housing': t('gallery.showcase.filters.staffHousing'),
    'Shops': t('gallery.showcase.filters.shops'),
    'Studios': t('gallery.showcase.filters.studios'),
    'Partition Rooms': t('gallery.showcase.filters.partitionRooms'),
  }

  const CATEGORIES = (t('gallery.categories.items', { returnObjects: true }) as Array<{ title: string; description: string }>)
    .map((item, i) => ({ ...item, href: CATEGORY_HREFS[i] }))

  const HOW_IT_HELPS = (t('gallery.howItHelps.items', { returnObjects: true }) as Array<{ title: string; description: string }>)
    .map((item, i) => ({ ...item, icon: HOW_IT_HELPS_ICONS[i] }))

  const FAQS = t('gallery.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>

  const serviceLabels = t('gallery.services.links', { returnObjects: true }) as string[]
  const SERVICE_LINKS = serviceLabels.map((label, i) => ({ label, href: SERVICE_HREFS[i] }))

  const visibleImages =
    activeFilter === 'Show All'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter(img => img.category === activeFilter)

  const waLink = `https://wa.me/${company.whatsapp}`

  function handlePhotoRequest(e: React.FormEvent) {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hello, I would like to request current photos of available units.\n` +
      `Name: ${photoForm.name}\n` +
      `Phone: ${photoForm.phone}\n` +
      `Area: ${photoForm.area}\n` +
      `Category: ${photoForm.category}\n` +
      (photoForm.budget ? `Budget: QAR ${photoForm.budget}/month\n` : '') +
      (photoForm.moveIn ? `Move-in Date: ${photoForm.moveIn}` : '')
    )
    window.open(`https://wa.me/${company.whatsapp}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <title>Dania Real Estate Gallery | Rental Property Layout Photos Qatar</title>
      <meta name="description" content="Explore verified rental property layouts across Doha and Qatar. View high-quality interior and exterior photos of apartments, villas, shops, and staff housing." />
      {/* ── S1 Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: text content */}
            <div>
              <Reveal direction="up">
                <p className="text-lime text-sm font-semibold uppercase tracking-widest mb-3">
                  {t('gallery.hero.eyebrow')}
                </p>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                  {t('gallery.hero.h1')}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/80 text-xl mb-5 leading-snug">
                  {t('gallery.hero.subtitle')}
                </p>
                <p className="text-white/65 text-base mb-10 leading-relaxed">
                  {t('gallery.hero.p')}
                </p>
              </Reveal>

              <Reveal direction="up" delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link
                    to="/apartments-for-rent/"
                    className="bg-lime text-forest px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center"
                  >
                    {t('gallery.hero.primaryBtn')}
                  </Link>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center justify-center"
                  >
                    {t('gallery.hero.whatsappBtn')}
                  </a>
                </div>
              </Reveal>

              <Reveal direction="up" delay={320}>
                <div className="flex flex-col sm:flex-row gap-4">
                  {[t('gallery.hero.trust0'), t('gallery.hero.trust1'), t('gallery.hero.trust2')].map(point => (
                    <div key={point} className="flex items-start gap-2 text-white/80 text-sm max-w-xs">
                      <CheckCircle2 size={16} className="text-lime shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: interactive masonry image collage */}
            <Reveal direction="right" delay={200}>
              <div className="hidden lg:grid grid-cols-2 gap-3 h-[520px]">
                {/* Column A — tall then short */}
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl overflow-hidden flex-1 group cursor-pointer">
                    <img
                      src={GALLERY_IMAGES[0].src}
                      alt={GALLERY_IMAGES[0].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-40 group cursor-pointer relative">
                    <img
                      src={GALLERY_IMAGES[4].src}
                      alt={GALLERY_IMAGES[4].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-semibold">{isAr ? GALLERY_IMAGES[4].labelAr : GALLERY_IMAGES[4].label}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden h-32 group cursor-pointer">
                    <img
                      src={GALLERY_IMAGES[7].src}
                      alt={GALLERY_IMAGES[7].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Column B — short then tall */}
                <div className="flex flex-col gap-3 pt-8">
                  <div className="rounded-2xl overflow-hidden h-40 group cursor-pointer">
                    <img
                      src={GALLERY_IMAGES[1].src}
                      alt={GALLERY_IMAGES[1].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden flex-1 group cursor-pointer relative">
                    <img
                      src={GALLERY_IMAGES[5].src}
                      alt={GALLERY_IMAGES[5].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-semibold">{isAr ? GALLERY_IMAGES[5].labelAr : GALLERY_IMAGES[5].label}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden h-28 group cursor-pointer">
                    <img
                      src={GALLERY_IMAGES[10].src}
                      alt={GALLERY_IMAGES[10].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── S2 Overview ─────────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <Reveal direction="up">
          <h2 className="text-3xl font-extrabold text-ink mb-6">
            {t('gallery.overview.h2')}
          </h2>
        </Reveal>
        <Reveal direction="up" delay={100}>
          <p className="text-ink-muted leading-relaxed mb-4">
            {t('gallery.overview.p1')}
          </p>
        </Reveal>
        <Reveal direction="up" delay={200}>
          <p className="text-ink-muted leading-relaxed">
            {t('gallery.overview.p2')}
          </p>
        </Reveal>
      </section>

      {/* ── S3 Featured Categories ──────────────────────────────────────────── */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-3">
              {t('gallery.categories.h2')}
            </h2>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {t('gallery.categories.subtitle')}
            </p>
          </Reveal>

          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {CATEGORIES.slice(0, 3).map((cat, i) => (
              <Reveal key={cat.title} direction="up" delay={i * 100}>
                <Link
                  to={cat.href}
                  className="block bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow group h-full"
                >
                  <h3 className="font-bold text-ink mb-2 group-hover:text-forest transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{cat.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Row 2: 2 cards centered */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-5 lg:w-2/3 lg:mx-auto">
            {CATEGORIES.slice(3).map((cat, i) => (
              <Reveal key={cat.title} direction="up" delay={(i + 3) * 100}>
                <Link
                  to={cat.href}
                  className="block bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow group h-full"
                >
                  <h3 className="font-bold text-ink mb-2 group-hover:text-forest transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{cat.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── S4 Image Grid ───────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <Reveal direction="up">
          <h2 className="text-3xl font-extrabold text-ink mb-3">
            {t('gallery.showcase.h2')}
          </h2>
          <p className="text-ink-muted mb-8 max-w-2xl">
            {t('gallery.showcase.subtitle')}
          </p>
        </Reveal>

        {/* Filter tabs */}
        <Reveal direction="up" delay={100}>
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f
                    ? 'bg-forest text-white'
                    : 'bg-surface-low text-ink hover:bg-border'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Image grid — 4 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleImages.map((img, i) => (
            <Reveal key={`${img.src}-${img.label}`} direction="up" delay={i * 60}>
              <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-surface-low">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-semibold text-sm leading-tight">{isAr ? img.labelAr : img.label}</p>
                    <p className="text-lime text-xs mt-0.5">{FILTER_LABELS[img.category]}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Under-grid CTA */}
        <Reveal direction="up" delay={200}>
          <div className="mt-12 bg-surface-low rounded-2xl border border-border p-8 text-center">
            <h3 className="text-xl font-bold text-ink mb-4">
              {t('gallery.showcase.ctaTitle')}
            </h3>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center"
            >
              {t('gallery.showcase.ctaBtn')}
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── S5 How to Use ───────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-10 text-center">
              {t('gallery.howItHelps.h2')}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_HELPS.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} direction="up" delay={i * 100}>
                  <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow h-full">
                    <div className="w-10 h-10 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                      <Icon size={20} className="text-forest" />
                    </div>
                    <h3 className="font-bold text-ink mb-2">{item.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S6 Explore by Service ───────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <Reveal direction="up">
          <h2 className="text-3xl font-extrabold text-ink mb-3">
            {t('gallery.services.h2')}
          </h2>
          <p className="text-ink-muted mb-8 max-w-2xl">
            {t('gallery.services.subtitle')}
          </p>
        </Reveal>
        <Reveal direction="up" delay={100}>
          <div className="flex flex-wrap gap-3">
            {SERVICE_LINKS.map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="bg-forest text-white px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── S7 Coverage by Area ─────────────────────────────────────────────── */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-3">
              {t('gallery.coverage.h2')}
            </h2>
            <p className="text-ink-muted mb-8 max-w-2xl">
              {t('gallery.coverage.subtitle')}
            </p>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <div className="flex flex-wrap gap-3">
              {AREA_BADGES.map(area => (
                <Link
                  key={area.label}
                  to={area.href}
                  className="px-5 py-2 rounded-full bg-white border border-border text-ink text-sm font-medium hover:bg-forest hover:text-white hover:border-forest transition-colors"
                >
                  {isAr ? area.labelAr : area.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S8 Photo Request ────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="border border-border rounded-3xl p-10 bg-surface-low">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-4 text-center">
              {t('gallery.photoRequest.h2')}
            </h2>
            <p className="text-ink-muted mb-8 max-w-2xl mx-auto leading-relaxed text-center">
              {t('gallery.photoRequest.subtitle')}
            </p>
            <form onSubmit={handlePhotoRequest} className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={photoForm.name}
                  onChange={e => setPhotoForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={isAr ? 'اسمك الكامل' : 'Your full name'}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">{isAr ? 'رقم الهاتف النشط' : 'Active Mobile Number'}</label>
                <input
                  type="tel"
                  required
                  value={photoForm.phone}
                  onChange={e => setPhotoForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+974 XXXX XXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">{isAr ? 'المنطقة البلدية المفضلة' : 'Preferred Municipal Area'}</label>
                <select
                  required
                  value={photoForm.area}
                  onChange={e => setPhotoForm(f => ({ ...f, area: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime transition-colors"
                >
                  <option value="">{isAr ? 'اختر منطقة' : 'Select an area'}</option>
                  {(isAr ? PHOTO_REQUEST_AREAS_AR : PHOTO_REQUEST_AREAS).map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">{isAr ? 'فئة العقار المستهدفة' : 'Target Layout Category'}</label>
                <select
                  required
                  value={photoForm.category}
                  onChange={e => setPhotoForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime transition-colors"
                >
                  <option value="">{isAr ? 'اختر فئة' : 'Select a category'}</option>
                  {(isAr ? PHOTO_REQUEST_CATEGORIES_AR : PHOTO_REQUEST_CATEGORIES).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">{isAr ? 'حد الميزانية المخصص (ريال/شهر)' : 'Allocated Budget Ceiling (QAR/month)'}</label>
                <input
                  type="number"
                  min="0"
                  value={photoForm.budget}
                  onChange={e => setPhotoForm(f => ({ ...f, budget: e.target.value }))}
                  placeholder="e.g. 8000"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">{isAr ? 'تاريخ الانتقال المقصود' : 'Intended Move-in Date'}</label>
                <input
                  type="date"
                  value={photoForm.moveIn}
                  onChange={e => setPhotoForm(f => ({ ...f, moveIn: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime transition-colors"
                />
              </div>
              <div className="sm:col-span-2 flex justify-center mt-2">
                <button
                  type="submit"
                  className="bg-[#25D366] text-white px-10 py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity inline-flex items-center justify-center"
                >
                  {t('gallery.photoRequest.btn')}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── S9 FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-8">
              {t('gallery.faq.h2')}
            </h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} direction="up" delay={i * 80}>
                <FaqItem q={faq.q} a={faq.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── S10 Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <div className="bg-lime rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-extrabold text-forest mb-4">
                {t('gallery.cta.h2')}
              </h2>
              <p className="text-forest/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                {t('gallery.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-forest text-white px-8 py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity inline-flex items-center justify-center"
                >
                  {t('gallery.cta.primary')}
                </a>
                <Link
                  to="/apartments-for-rent/"
                  className="bg-white text-forest border border-forest/20 px-8 py-4 rounded-full font-bold text-base hover:bg-forest/5 transition-colors inline-flex items-center justify-center"
                >
                  {t('gallery.cta.secondary')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
