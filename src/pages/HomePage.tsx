import { useState, Fragment, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Building2, Home, Store, Users, LayoutGrid,
  CheckCircle2, ChevronDown, Briefcase, ShoppingBag,
} from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { LocationIcon } from '@/components/shared/LocationIcon'
import { company, whyChooseUs } from '@/data/mockData'
import heroVideo from '@/assets/13761467-uhd_3840_2160_30fps.mp4'
import imgDoha       from '@/assets/pexels-stephen-leonardi-587681991-34276136.webp'
import imgAlSadd     from '@/assets/pexels-mr-location-scout-22994825-25525976.webp'
import imgBinMahmoud from '@/assets/pexels-juan-nino-3824481-9556696.webp'
import imgAlWakra    from '@/assets/pexels-athena-2962124.webp'

/* ── Section 5: areas data ────────────────────────────────────────────── */
const AREAS_AR = [
  { slug: 'doha',           name: 'وسط الدوحة',               img: imgDoha,        desc: 'تغطية شاملة في وسط الدوحة والدفنة والهلال والمعمورة. مثالي للتنقل اليومي.' },
  { slug: 'al-sadd',        name: 'السد',                      img: imgAlSadd,      desc: 'شقق سكنية راقية ومحلات تجارية قرب محطات المترو ومراكز الترفيه.' },
  { slug: 'bin-mahmoud',    name: 'بن محمود',                  img: imgBinMahmoud,  desc: 'خيارات سكنية مريحة قريبة من العيادات والمراكز التجارية الكبرى.' },
  { slug: 'al-wakra',       name: 'الوكرة',                    img: imgAlWakra,     desc: 'إسكان مجتمعي عائلي وشقق للإيجار خارج نطاق مدينة الدوحة.' },
  { slug: 'al-aziziya',     name: 'العزيزية وأبو هامور',       img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80', desc: 'عقارات نشطة قرب الطرق التجارية الرئيسية والمجمعات العائلية والمدارس.' },
  { slug: 'old-airport',    name: 'المطار القديم وروضة المطار', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80', desc: 'عقارات تاريخية راسخة وشقق مشتركة وعقارات تجارية على طرق المطار القديم.' },
  { slug: 'umm-salal',      name: 'أم صلال',                   img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80', desc: 'إسكان اقتصادي يشمل أم صلال محمد وأم صلال علي وأم قرن.' },
  { slug: 'al-kharaitiyat', name: 'الخريطيات',                 img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', desc: 'أحياء سكنية هادئة في الشمال مثالية للمجمعات العائلية.' },
]

const AREAS = [
  { slug: 'doha',           name: 'Central Doha',                  img: imgDoha,        desc: 'Strategic coverage across Central Doha, Al Dafna, Al Hilal, and Al Mamoura. Perfect for city commuting.' },
  { slug: 'al-sadd',        name: 'Al Sadd',                       img: imgAlSadd,      desc: 'Premium residential flats and commercial spots near main metro routes and lifestyle hubs.' },
  { slug: 'bin-mahmoud',    name: 'Bin Mahmoud',                   img: imgBinMahmoud,  desc: 'Convenient urban living options close to clinics, major hypermarkets, and office centers.' },
  { slug: 'al-wakra',       name: 'Al Wakra',                      img: imgAlWakra,     desc: 'Family-friendly community housing and rental flats outside the dense Doha city perimeter.' },
  { slug: 'al-aziziya',     name: 'Al Aziziya & Abu Hamour',       img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80', desc: 'Active properties near popular commercial avenues, family compounds, and schools.' },
  { slug: 'old-airport',    name: 'Old Airport & Rawdat Al Matar', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80', desc: 'Established historic properties, flat shares, and business rentals along Al Matar Al Qadeem routes.' },
  { slug: 'umm-salal',      name: 'Umm Salal',                     img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80', desc: 'Budget accommodations covering Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn zones.' },
  { slug: 'al-kharaitiyat', name: 'Al Kharaitiyat',                img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', desc: 'Quieter northern suburban residential quarters perfect for dedicated family compound spaces.' },
]

/* ── Section 9: showcase listing blocks ──────────────────────────────── */
const SHOWCASES = [
  { h3: 'Furnished Apartments for Rent in Doha',   text: 'Luxury 2BHK setups located in central zones.',    to: '/apartments-for-rent/',     img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { h3: 'Premium Family Compounds',                 text: 'Spacious standalone estates in Al Aziziya.',      to: '/villas-for-rent/',          img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80' },
  { h3: 'Budget-Friendly Studio Partition Rentals', text: 'All-inclusive single professional units.',        to: '/studio-partition-rentals/', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
  { h3: 'Approved Staff Accommodation Buildings',   text: 'Turnkey labor housing complexes.',                to: '/staff-accommodation/',      img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80' },
]


/* ── Why Choose Us AR data ────────────────────────────────────────────── */
const WHY_CHOOSE_US_AR = [
  { title: 'خبرة محلية عميقة',          description: 'خبرة متخصصة في قيم إيجار الأحياء والأنظمة البلدية والمشاريع العقارية المتميزة.' },
  { title: 'برامج شاملة للمرافق',        description: 'احصل على فرص إيجار شاملة تغطي فواتير كهرمة الشهرية بالكامل.' },
  { title: 'إجراءات التحقق من العقارات', description: 'وداعاً للإعلانات المزيفة. كل شقة أو محل في شبكتنا يخضع لعمليات تحقق صارمة.' },
  { title: 'أطر مؤسسية مرنة',           description: 'إجراءات تشغيلية مخصصة لخدمة متطلبات السكن المؤسسي وعقود الإيجار التجاري.' },
  { title: 'تواصل فوري عبر واتساب',     description: 'بدون نماذج معقدة. تواصل مباشرة مع متخصصي الإيجار المحليين عبر قنوات المراسلة السريعة.' },
]

/* ─── Section 1: Hero ────────────────────────────────────────────────── */
function HeroSection() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  // The H1 carries the brand after a "|" (e.g. "...in Doha | Dania Real Estate").
  // Drop the divider and render the brand name as an animated luxury wordmark.
  const [h1Lead, h1Brand] = t('home.hero.h1').split('|').map(s => s.trim())

  // For Latin script, split into words → letters so a light-sweep can cascade
  // letter by letter. (Arabic is kept whole so its glyphs stay connected.)
  let _li = 0
  const brandWords = (h1Brand ?? '').split(' ').map(word => ({
    word,
    letters: [...word].map(ch => ({ ch, i: _li++ })),
  }))

  return (
    <section className="relative overflow-hidden text-white py-28 md:py-40 min-h-[600px] flex items-center">
      <video autoPlay muted loop playsInline preload="none" className="absolute inset-0 w-full h-full object-cover pointer-events-none">
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-forest/75 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-forest/60 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
        <p className="text-lime text-sm font-semibold tracking-widest uppercase mb-4">{t('home.hero.eyebrow')}</p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 max-w-3xl">
          {h1Lead}{' '}
          {h1Brand && (
            isAr ? (
              <span className="brand-wordmark inline-block pb-1 tracking-tight">{h1Brand}</span>
            ) : (
              <span className="inline tracking-tight" aria-label={h1Brand}>
                {brandWords.map(({ letters }, wi) => (
                  <Fragment key={wi}>
                    {wi > 0 ? ' ' : null}
                    <span className="inline-block whitespace-nowrap pb-1" aria-hidden="true">
                      {letters.map(({ ch, i }) => (
                        <span key={i} className="brand-letter" style={{ '--i': i } as CSSProperties}>
                          {ch}
                        </span>
                      ))}
                    </span>
                  </Fragment>
                ))}
              </span>
            )
          )}
        </h1>
        <p className="text-white/75 text-lg max-w-2xl mb-8 leading-relaxed">
          {t('home.hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link to="/apartments-for-rent/"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-lime text-forest font-bold px-7 py-3.5 rounded-full text-sm">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('home.hero.exploreBtn')}</span>
          </Link>
          <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full text-sm backdrop-blur-sm">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('home.hero.whatsappBtn')}</span>
          </a>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[t('home.hero.trust0'), t('home.hero.trust1'), t('home.hero.trust2'), t('home.hero.trust3')].map(v => (
            <span key={v} className="flex items-center gap-2 text-white/60 text-sm">
              <CheckCircle2 size={14} className="text-lime shrink-0" /> {v}
            </span>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-white/55 text-sm leading-relaxed">{t('home.hero.trustLine')}</p>
      </div>
    </section>
  )
}

/* ─── Section 8: Journey ─────────────────────────────────────────────── */
function JourneySection() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const journeySteps = t('home.journey.steps', { returnObjects: true }) as Array<{num: string, title: string, desc: string}>
  const [hovered, setHovered] = useState<number | null>(null)
  const isActive = (i: number) => hovered !== null && i <= hovered
  const isLineOn  = (i: number) => hovered !== null && i < hovered

  return (
    <section className="bg-forest py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{t('home.journey.h2')}</h2>
            <p className="text-white/60 text-lg">{isAr ? 'لقد بسّطنا عملية الإيجار في أربع خطوات سلسة.' : "We've simplified the leasing process into four seamless steps."}</p>
          </div>
          <span className="shrink-0 self-start bg-lime text-forest text-sm font-bold px-5 py-2 rounded-full">
            {isAr ? 'ضمان الموافقة خلال 48 ساعة' : '48hr Approval Guarantee'}
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="flex items-center">
            {journeySteps.map((step, i) => (
              <Fragment key={step.num}>
                <div
                  className="relative z-10 shrink-0 cursor-default"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-xl transition-all duration-300 ${
                    isActive(i)
                      ? 'bg-lime text-forest shadow-[0_0_28px_6px_rgba(188,239,95,0.50)]'
                      : 'border-2 border-lime/30 text-white/35 bg-transparent'
                  }`}>
                    {step.num}
                  </div>
                </div>
                {i < journeySteps.length - 1 && (
                  <div className="flex-1 h-[2px] bg-lime/20 relative"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-lime transition-all duration-500 ease-in-out"
                      style={{ width: isLineOn(i) ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          <div className="grid grid-cols-4 mt-8">
            {journeySteps.map((step, i) => (
              <div key={step.num} className="text-center px-4 cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <p className={`font-bold text-base mb-2 transition-colors duration-300 ${isActive(i) ? 'text-lime' : 'text-white/40'}`}>
                  {step.title}
                </p>
                <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-10">
          {journeySteps.map(step => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-lime flex items-center justify-center text-forest font-black text-lg mb-4 shadow-lg shadow-lime/30">
                {step.num}
              </div>
              <p className="font-bold text-lime mb-2">{step.title}</p>
              <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── HOME PAGE ──────────────────────────────────────────────────────── */
export function HomePage() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const homeFaqs = t('home.faq.items', { returnObjects: true }) as Array<{q: string, a: string}>
  const showcaseItems = t('home.showcases.items', { returnObjects: true }) as Array<{h3: string, text: string}>
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeShowcase, setActiveShowcase] = useState(0)

  return (
    <div className="bg-white">
      <title>Property Management Company in Doha | Dania Real Estate</title>
      <meta name="description" content="Looking for premium villas or apartments for rent in Doha? Dania Real Estate offers 0% commission, all-inclusive rentals with 24/7 support. View listings!" />

      {/* ── 1. HERO ── */}
      <HeroSection />

      {/* ── 3. MAIN RENTAL SERVICES ── */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-2">{t('home.services.h2')}</h2></Reveal>
        <Reveal delay={100}><p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">{t('home.services.subtitle')}</p></Reveal>

        {/* Row 1: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Reveal delay={0}>
            <div className="bg-white rounded-2xl border border-border p-7 hover:shadow-md transition-shadow h-full flex flex-col">
              <Building2 size={28} className="text-ink mb-4" />
              <h3 className="font-bold text-xl text-ink mb-2">{t('home.services.apartments.title')}</h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-6 flex-1">{t('home.services.apartments.desc')}</p>
              <Link to="/apartments-for-rent/" className="flex items-center gap-1.5 text-forest font-semibold text-sm hover:gap-2.5 transition-all mt-auto">
                {t('home.services.apartments.cta')} <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-white rounded-2xl border border-border p-7 hover:shadow-md transition-shadow h-full flex flex-col">
              <Home size={28} className="text-ink mb-4" />
              <h3 className="font-bold text-xl text-ink mb-2">{t('home.services.villas.title')}</h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-6 flex-1">{t('home.services.villas.desc')}</p>
              <Link to="/villas-for-rent/" className="flex items-center gap-1.5 text-forest font-semibold text-sm hover:gap-2.5 transition-all mt-auto">
                {t('home.services.villas.cta')} <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="bg-forest rounded-2xl p-7 hover:shadow-md transition-shadow h-full flex flex-col">
              <Users size={28} className="text-lime mb-4" />
              <h3 className="font-bold text-xl text-lime mb-2">{t('home.services.staff.title')}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6 flex-1">{t('home.services.staff.desc')}</p>
              <Link to="/staff-accommodation/" className="flex items-center gap-1.5 text-lime font-semibold text-sm hover:gap-2.5 transition-all mt-auto">
                {t('home.services.staff.cta')} <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Row 2: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Reveal delay={0}>
            <div className="relative rounded-2xl overflow-hidden min-h-52 bg-ink h-full">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Shops for Rent in Doha" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative p-7 h-full flex flex-col justify-between">
                <div>
                  <Store size={28} className="text-white mb-4" />
                  <h3 className="font-bold text-xl text-white mb-2">{t('home.services.shops.title')}</h3>
                  <p className="text-lime text-sm leading-relaxed">{t('home.services.shops.desc')}</p>
                </div>
                <Link to="/shops-for-rent/" className="flex items-center gap-1.5 text-white font-semibold text-sm mt-6 hover:gap-2.5 transition-all">
                  {t('home.services.shops.cta')} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-lime-light rounded-2xl border border-lime/30 p-7 hover:shadow-md transition-shadow h-full flex flex-col">
              <LayoutGrid size={28} className="text-forest mb-4" />
              <h3 className="font-bold text-xl text-ink mb-2">{t('home.services.studios.title')}</h3>
              <p className="text-forest text-sm leading-relaxed mb-6 flex-1">{t('home.services.studios.desc')}</p>
              <Link to="/studio-partition-rentals/" className="flex items-center gap-1.5 text-forest font-semibold text-sm hover:gap-2.5 transition-all mt-auto">
                {t('home.services.studios.cta')} <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4. FILTER PROPERTY TYPES ── */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-2">{isAr ? 'تصفية أنواع العقارات المتاحة للإيجار في قطر' : 'Filter Practical Property Rent in Qatar'}</h2></Reveal>
          <Reveal delay={100}><p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">{isAr ? 'اختر النوع المناسب من العقارات بما يتناسب مع احتياجاتك. استعرض صفحات الإيجار المتخصصة مباشرة.' : 'Match your lifestyle and operational business demands with curated property formats. Access optimized landing pages directly through our core real estate index.'}</p></Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Apartments */}
            <Reveal delay={0}>
              <div className="bg-white rounded-2xl border border-border p-6 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center shrink-0">
                    <Building2 size={16} className="text-lime" />
                  </div>
                  <h3 className="font-bold text-ink text-base">{isAr ? 'الشقق' : 'Apartments'}</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <Link to="/apartments-for-rent/1-bedroom/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'شقق غرفة نوم واحدة' : '1 Bedroom Apartments'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'تصميمات مثالية للعزاب والمديرين التنفيذيين والأزواج الشباب.' : 'Optimal layout setups for singles, corporate executives, and young couples.'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/apartments-for-rent/2-bedroom/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'شقق غرفتي نوم' : '2 Bedroom Apartments'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'خيارات واسعة للعائلات الصغيرة الباحثة عن القرب من وسط المدينة.' : 'Spacious rental options for small families seeking city-center proximity.'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/apartments-for-rent/3-bedroom/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'شقق 3 غرف نوم' : '3 Bedroom Apartments'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'مساحات كبيرة بمرافق شاملة للعائلات الممتدة.' : 'Large layouts with comprehensive amenities for extended family living.'}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </Reveal>

            {/* Column 2: Villas */}
            <Reveal delay={120}>
              <div className="bg-white rounded-2xl border border-border p-6 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center shrink-0">
                    <Home size={16} className="text-lime" />
                  </div>
                  <h3 className="font-bold text-ink text-base">{isAr ? 'الفلل' : 'Villas'}</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <Link to="/villas-for-rent/standard-villas/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'فلل عادية' : 'Standard Villas'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'خيارات سكنية منفصلة خاصة بحوش خاص وتصميمات مخصصة.' : 'Private, detached residential options with independent yards and custom configurations.'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/villas-for-rent/compound-villas/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'فلل المجمعات' : 'Compound Villas'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'مجتمعات مسوّرة آمنة توفر مسابح مشتركة وملاعب للأطفال.' : "Secure gated communities offering shared swimming pools, clubhouses, and kids' play zones."}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </Reveal>

            {/* Column 3: Studios */}
            <Reveal delay={240}>
              <div className="bg-white rounded-2xl border border-border p-6 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center shrink-0">
                    <LayoutGrid size={16} className="text-lime" />
                  </div>
                  <h3 className="font-bold text-ink text-base">{isAr ? 'الاستوديوهات والأقسام' : 'Studios & Partitions'}</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <Link to="/studio-partition-rentals/studio-for-rent/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'استوديو للإيجار' : 'Studio for Rent'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'وحدات مدمجة كاملة تضم مطابخ صغيرة وحمامات.' : 'Fully self-contained, compact units featuring integrated kitchenettes and bathrooms.'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/studio-partition-rentals/partition-room-for-rent/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'غرفة قسم للإيجار' : 'Partition Room for Rent'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'خيارات سكنية اقتصادية بمرافق مشتركة للعمالة ذات الميزانية المحدودة.' : 'Economical housing options with shared amenities for budget-focused workers.'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/studio-partition-rentals/one-bedroom-for-rent/" className="group flex flex-col gap-0.5 hover:bg-surface-low rounded-xl p-2 -mx-2 transition-colors">
                      <span className="font-semibold text-ink text-sm group-hover:text-forest transition-colors">{isAr ? 'غرفة نوم واحدة للإيجار' : 'One Bedroom for Rent'}</span>
                      <span className="text-ink-muted text-xs leading-relaxed">{isAr ? 'شقق غرفة واحدة عملية قريبة من خطوط النقل الرئيسية.' : 'Practical single-room apartments positioned near main transit lines.'}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. AREAS GRID ── */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-2">{t('home.areas.h2')}</h2></Reveal>
          <Reveal delay={100}><p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">{t('home.areas.subtitle')}</p></Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(isAr ? AREAS_AR : AREAS).map((area, i) => (
              <Reveal key={area.slug} delay={i * 60}>
                <Link
                  to={`/areas/${area.slug}/`}
                  className="group relative flex flex-col gap-3 bg-white border border-border rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-2xl active:shadow-md hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 min-h-[190px] sm:min-h-[210px] lg:min-h-[220px]"
                >
                  {/* sweep fill — GPU-accelerated translate */}
                  <div className="absolute inset-0 bg-forest translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out will-animate" />

                  {/* Luxury location badge */}
                  <div className="relative z-10 inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-lime-dark text-white shadow-md shadow-lime/30 ring-1 ring-white/30 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-110 transition-transform duration-300 ease-out">
                    <LocationIcon size={19} />
                  </div>

                  {/* text */}
                  <div className="relative z-10 flex flex-col flex-1 gap-1.5">
                    <h3 className="font-bold text-ink group-hover:text-white group-active:text-white text-sm leading-tight transition-colors duration-300">
                      {area.name}
                    </h3>
                    <p className="text-ink-muted group-hover:text-white/70 group-active:text-white/70 text-xs leading-relaxed flex-1 transition-colors duration-300 line-clamp-3">
                      {area.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-forest group-hover:text-lime group-active:text-lime font-semibold text-xs transition-colors duration-300">
                      {t('home.areas.exploreBtn')}
                      <ArrowRight size={11} className="group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHY CHOOSE DANIA ── */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-2">{t('home.whyUs.h2')}</h2></Reveal>
          <Reveal delay={100}><p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">{t('home.whyUs.subtitle')}</p></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(isAr ? WHY_CHOOSE_US_AR : whyChooseUs).map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow h-full">
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle2 size={16} className="text-forest" />
                  </div>
                  <h3 className="font-bold text-ink mb-2 text-sm">{item.title}</h3>
                  <p className="text-ink-muted text-xs leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. RENTAL SUPPORT ── */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-2">{t('home.rentalSupport.h2')}</h2></Reveal>
          <Reveal delay={100}><p className="text-ink-muted text-center mb-12 max-w-lg mx-auto">{t('home.rentalSupport.subtitle')}</p></Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Reveal delay={0}>
              <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow h-full">
                <div className="w-10 h-10 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                  <Home size={18} className="text-forest" />
                </div>
                <h3 className="font-bold text-ink mb-2">{isAr ? 'الإسكان العائلي السكني' : 'Residential Family Housing'}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{isAr ? 'مجمعات ومساكن متعددة الغرف قريبة من المدارس والمراكز التجارية والمستشفيات.' : 'Dedicated compounds and multi-bedroom apartments situated near schools, supermarkets, and primary medical hubs.'}</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow h-full">
                <div className="w-10 h-10 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                  <Briefcase size={18} className="text-forest" />
                </div>
                <h3 className="font-bold text-ink mb-2">{isAr ? 'المهنيون العاملون' : 'Working Professionals'}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{isAr ? 'استوديوهات حديثة وغرف فردية ووحدات أقسام متميزة قريبة من مراكز الأعمال ومحطات المترو.' : 'Modern, compact studios, single rooms, and premium partition units located near major business complexes and metro link stations.'}</p>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="bg-forest rounded-2xl p-6 hover:shadow-md transition-shadow h-full">
                <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center mb-4">
                  <Users size={18} className="text-lime" />
                </div>
                <h3 className="font-bold text-lime mb-2">{isAr ? 'إسكان القوى العاملة المؤسسية' : 'Corporate Workforce Accommodations'}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{isAr ? 'إدارة شاملة لفلل الموظفين الكبيرة ومنشآت متكاملة وفق معايير الامتثال المؤسسي.' : 'Comprehensive management of large staff villas and fully equipped facilities built to strict enterprise compliance guidelines.'}</p>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow h-full">
                <div className="w-10 h-10 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag size={18} className="text-forest" />
                </div>
                <h3 className="font-bold text-ink mb-2">{isAr ? 'أصحاب الأعمال التجارية' : 'Commercial Business Operators'}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{isAr ? 'واجهات ومحلات تجارية للإيجار في الدوحة مصممة لضمان حركة مرور منتظمة للعملاء.' : 'Retail storefronts and commercial shops for rent in Doha tailored to secure steady customer traffic.'}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 8. 4-STEP PROCESS ── */}
      <JourneySection />

      {/* ── 9. FEATURED TRENDING RENTALS ── */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">{t('home.showcases.h2')}</h2>
              <p className="text-ink-muted max-w-xl mx-auto">{isAr ? 'استعرض بعض عقاراتنا المطلوبة للإيجار في قطر. تواصل معنا فوراً عبر واتساب للتحقق من الأسعار وجدولة الزيارات.' : 'Take a look at some of our highly requested properties for rent in Qatar. Connect with us instantly via WhatsApp to cross-check real-time pricing and schedule a viewing today.'}</p>
            </div>
          </Reveal>

          {/* ── Mobile / Tablet: 2×2 simple cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {SHOWCASES.map((sc, i) => (
              <Link
                key={i}
                to={sc.to}
                className="group relative rounded-2xl overflow-hidden block h-56 active:scale-[0.98] transition-transform duration-150"
              >
                <img
                  src={sc.img}
                  alt={showcaseItems[i]?.h3 ?? sc.h3}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-active:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest/55 to-forest/10" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-bold text-white text-sm leading-snug mb-1.5">{showcaseItems[i]?.h3 ?? sc.h3}</h3>
                  <p className="text-white/65 text-xs mb-3">{showcaseItems[i]?.text ?? sc.text}</p>
                  <span className="inline-flex items-center gap-1.5 bg-lime text-forest font-bold text-xs px-4 py-2.5 rounded-full">
                    {t('home.showcases.checkLiveStatus')} <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Desktop: horizontal accordion ── */}
          <div className="hidden lg:flex gap-3 h-[420px]">
            {SHOWCASES.map((sc, i) => {
              const isActive = activeShowcase === i
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveShowcase(i)}
                  onTouchStart={() => setActiveShowcase(i)}
                  onClick={() => setActiveShowcase(i)}
                  style={{ flex: isActive ? '4 1 0%' : '1 1 0%' }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out min-w-0"
                >
                  <img
                    src={sc.img}
                    alt={showcaseItems[i]?.h3 ?? sc.h3}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                    style={{ willChange: 'transform' }}
                  />
                  <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-forest/60' : 'bg-forest/82'}`} />

                  {/* INACTIVE: rotated title */}
                  <div className={`absolute inset-0 flex items-end justify-center pb-8 transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span
                      className="text-white font-bold text-sm whitespace-nowrap leading-none"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {showcaseItems[i]?.h3 ?? sc.h3}
                    </span>
                  </div>

                  {/* ACTIVE: full content */}
                  <div className={`absolute inset-0 flex flex-col justify-end p-8 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
                    <h3 className="font-extrabold text-white text-xl leading-snug mb-3">{showcaseItems[i]?.h3 ?? sc.h3}</h3>
                    <p className="text-white/75 text-sm leading-relaxed mb-6">{showcaseItems[i]?.text ?? sc.text}</p>
                    <Link
                      to={sc.to}
                      className="inline-flex items-center gap-2 bg-lime text-forest font-bold text-sm px-5 py-2.5 rounded-full w-fit hover:bg-white transition-colors duration-200"
                    >
                      {t('home.showcases.checkLiveStatus')} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[860px] mx-auto px-6">
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-2">{t('home.faq.h2')}</h2></Reveal>
          <Reveal delay={100}><p className="text-ink-muted text-center mb-12">{isAr ? 'كل ما تحتاج معرفته حول الاستئجار مع دانية للعقارات.' : 'Everything you need to know about renting with Dania Real Estate.'}</p></Reveal>

          <div className="space-y-3">
            {homeFaqs.map((faq, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="font-semibold text-ink text-sm leading-snug">{faq.q}</h3>
                    <ChevronDown
                      size={18}
                      className={`text-forest shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}>
                    <p className="px-6 pb-5 text-ink-muted text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FINAL CTA ── */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <Reveal direction="up" duration={800}>
          <div className="relative bg-lime rounded-3xl px-8 py-16 text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-dark/30 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-dark/30 rounded-full" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
                {t('home.cta.h2')}
              </h2>
              <p className="text-forest/70 text-lg mb-10 max-w-xl mx-auto">
                {t('home.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-forest text-white font-bold px-8 py-4 rounded-full text-base">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('home.cta.primary')}</span>
                </a>
                <Link to="/contact-us/"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white text-ink font-bold px-8 py-4 rounded-full text-base">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-forest scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{t('home.cta.secondary')}</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
