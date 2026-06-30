import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { ProcessSteps } from '@/components/shared/ProcessSteps'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { usePageSchema } from '@/components/shared/Seo'
import { faqPageSchema } from '@/lib/seo'

interface Props { filter: 'all' | 'standard' | 'compound' }

// â"€â"€ Hero content per filter â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const heroContent = {
  all: {
    h1: 'Villas for Rent in Doha and Qatar',
    sub: 'Comprehensive residential guidance for premium standalone villas and fully managed compound communities.',
    para: "Locating an authentic villa for rent in Doha requires cross-referencing your family's space requirements with precise municipal zone codes, Baladiya registration requirements, and current utility configurations. Dania Real Estate manages an active, deeply vetted index of premium villa properties across Qatar's most sought-after residential sectors. Whether you seek the absolute privacy of an independent standalone villa or the family-oriented amenities of a secure compound villa layout, our team matches your specific long-term lifestyle needs directly against active, available inventory.",
    primaryCTA: { label: 'Request Villa Availability', href: `https://wa.me/${company.whatsapp}`, external: true },
    secondaryCTA: { label: 'Contact Our Team', href: '/contact-us/', external: false },
    trustPoints: [
      '100% verified villa listings compliant with Doha Municipality leasing laws.',
      'Direct coverage spanning independent residential plots and luxury complex compounds.',
      'Real-time vacancy confirmations and unedited media shared directly via mobile desk channels.',
    ],
  },
  standard: {
    h1: 'Standard Villas for Rent in Doha and Qatar',
    sub: 'Private standalone villa rental support for families and long-term tenants seeking absolute residential autonomy.',
    para: "Sourcing a verified standard villa for rent in Doha involves matching your required room capacity against specific plot sizes, independent perimeter privacy, and distinct Baladiya municipality registration protocols. Dania Real Estate maintains an active portfolio of completely standalone family homes across Qatar's premium residential coordinates. If your family lifestyle demands a self-contained environment free from shared compound regulations—complete with independent car parking garages, isolated domestic quarters, and private majlis structures—our specialized leasing desk provides the on-ground insights needed to complete your search efficiently.",
    primaryCTA: { label: 'Request Standard Villa Availability', href: `https://wa.me/${company.whatsapp}`, external: true },
    secondaryCTA: { label: 'Contact Our Team', href: '/contact-us/', external: false },
    trustPoints: [
      '100% independent plots with autonomous boundary walls and private access gates.',
      'Direct compliance tracking for individual municipality tenancy attestations.',
      'Unedited walk-through videos and real-time site coordination via WhatsApp.',
    ],
  },
  compound: {
    h1: 'Compound Villas for Rent in Doha and Qatar',
    sub: 'Family-friendly compound villa rental support in secure, fully managed residential communities.',
    para: "Securing a premium compound villa for rent in Doha involves more than checking room counts—it requires finding an environment that offers your family dedicated on-site security, shared recreational facilities, and seamless access to international school transit paths. Dania Real Estate manages an active, deeply vetted index of family-centric gated compound villas across Qatar's premier neighborhoods. If your household thrives in an organized neighborhood setup complete with shared swimming pools, modern fitness centers, child-safe playgrounds, and integrated property maintenance teams, our specialized leasing desk stands ready to streamline your search.",
    primaryCTA: { label: 'Request Compound Villa Availability', href: `https://wa.me/${company.whatsapp}`, external: true },
    secondaryCTA: { label: 'Contact Our Team', href: '/contact-us/', external: false },
    trustPoints: [
      'Vetted family compound networks featuring 24/7 staffed security gates.',
      'Direct clarity on Common Area Maintenance (CAM) and compound facility guidelines.',
      'Unedited interior/exterior video tours delivered instantly through direct WhatsApp updates.',
    ],
  },
}

// ── Arabic Hero content per filter ──────────────────────────────────────────
const heroContentAr = {
  all: {
    para: 'يتطلب إيجاد فيلا أصيلة للإيجار في الدوحة مطابقة احتياجات عائلتك من المساحة مع رموز المناطق البلدية الدقيقة، ومتطلبات تسجيل بلدية، والتكوينات الحالية للمرافق. تدير دانية للعقارات فهرسًا نشطًا وعميق الفحص من عقارات الفلل الفاخرة في أرقى المناطق السكنية في قطر. سواء كنت تبحث عن خصوصية مطلقة في فيلا مستقلة أو مزايا عائلية في مجمع سكني آمن، يطابق فريقنا احتياجات نمط حياتك طويلة الأمد مباشرةً مع المخزون المتاح.',
  },
  standard: {
    para: 'يستلزم الحصول على فيلا عادية موثقة للإيجار في الدوحة مطابقة السعة المطلوبة للغرف مع أحجام المخططات المحددة، والخصوصية المحيطية المستقلة، وبروتوكولات تسجيل بلدية المتميزة. تحتفظ دانية للعقارات بمحفظة نشطة من المنازل العائلية المستقلة بالكامل في أفضل الإحداثيات السكنية في قطر. إذا كان نمط حياة عائلتك يستدعي بيئة مكتفية ذاتيًا بعيدة عن لوائح المجمعات المشتركة—مع مواقف سيارات خاصة، وأجنحة للخدم، ومجالس خاصة—يوفر مكتبنا المتخصص في التأجير الرؤى الميدانية اللازمة لإتمام بحثك بكفاءة.',
  },
  compound: {
    para: 'يتجاوز تأمين فيلا مجمع فاخرة للإيجار في الدوحة مجرد التحقق من عدد الغرف—إذ يتطلب إيجاد بيئة توفر لعائلتك أمانًا ميدانيًا مخصصًا، ومرافق ترفيهية مشتركة، وسهولة الوصول إلى مسارات نقل المدارس الدولية. تدير دانية للعقارات فهرسًا نشطًا وعميق الفحص من فلل المجمعات العائلية المسوّرة في أرقى أحياء قطر. إذا كانت أسرتك تزدهر في إعداد حي منظم مزود بمسابح مشتركة، ومراكز لياقة بدنية حديثة، وملاعب آمنة للأطفال، وفرق صيانة متكاملة، يستعد مكتبنا المتخصص لتسهيل بحثك.',
  },
}

// ── Final CTA content per filter ─────────────────────────────────────────────
const finalCTA = {
  all: {
    h2: 'Ready to Find Your Ideal Villa for Rent in Qatar?',
    para: "Protect your household's long-term comfort and security. Avoid unverified, repetitive online classified ads by connecting directly with the real estate professionals at Dania Real Estate today. Share your target district parameters, budget thresholds, and space needs to receive a verified inventory list.",
    primaryCTA: { label: 'Chat on WhatsApp Now', href: `https://wa.me/${company.whatsapp}`, external: true },
    secondaryCTA: { label: 'Contact Us Today', href: '/contact-us/', external: false },
  },
  standard: {
    h2: 'Ready to Find Your Ideal Standalone Villa in Qatar?',
    para: "Protect your family's residential autonomy and long-term privacy. Avoid unverified marketplace classified advertisements by connecting directly with the real estate professionals at Dania Real Estate today. Share your desired municipal sector, bedroom counts, and budget parameters to receive a curated inventory list.",
    primaryCTA: { label: 'Chat on WhatsApp Now', href: `https://wa.me/${company.whatsapp}`, external: true },
    secondaryCTA: { label: 'Contact Us Today', href: '/contact-us/', external: false },
  },
  compound: {
    h2: 'Ready to Find Your Ideal Compound Villa in Qatar?',
    para: "Protect your family's safety, comfort, and social connection. Avoid unverified, repetitive marketplace classified ads by connecting directly with the property management professionals at Dania Real Estate today. Share your target district parameters, budget thresholds, and space needs to receive a verified inventory list.",
    primaryCTA: { label: 'Chat on WhatsApp Now', href: `https://wa.me/${company.whatsapp}`, external: true },
    secondaryCTA: { label: 'Contact Us Today', href: '/contact-us/', external: false },
  },
}

// ── Arabic Final CTA content per filter ──────────────────────────────────────
const finalCTAAr = {
  all: {
    para: 'احمِ راحة عائلتك على المدى الطويل وأمانها. تجنب الإعلانات المبوبة غير الموثوقة والمتكررة عبر الإنترنت بالتواصل مباشرةً مع خبراء العقارات في دانية للعقارات اليوم. شارك معنا معايير المنطقة المستهدفة، وحدود الميزانية، واحتياجات المساحة للحصول على قائمة مخزون موثقة.',
  },
  standard: {
    para: 'احمِ استقلالية عائلتك السكنية وخصوصيتها على المدى الطويل. تجنب إعلانات السوق المبوبة غير الموثوقة بالتواصل مباشرةً مع خبراء العقارات في دانية للعقارات اليوم. شارك معنا القطاع البلدي المطلوب، وأعداد غرف النوم، ومعايير الميزانية للحصول على قائمة مخزون مختارة.',
  },
  compound: {
    para: 'احمِ سلامة عائلتك وراحتها وتواصلها الاجتماعي. تجنب الإعلانات المبوبة غير الموثوقة والمتكررة بالتواصل مباشرةً مع متخصصي إدارة العقارات في دانية للعقارات اليوم. شارك معنا معايير المنطقة المستهدفة، وحدود الميزانية، واحتياجات المساحة للحصول على قائمة مخزون موثقة.',
  },
}

//â"€â"€ FAQ Accordion â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <Reveal key={i} delay={i * 60} direction="up">
          <div className="border border-border rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-surface-low transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-semibold text-ink text-sm leading-snug">{faq.q}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-forest transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-5 pt-1 bg-surface-low">
                <p className="text-ink-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// â"€â"€ Main component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export function VillasPage({ filter }: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const heroBase = heroContent[filter]
  const ctaBase = finalCTA[filter]
  const hero = {
    ...heroBase,
    h1: t(`villas.${filter}.h1`),
    sub: t(`villas.${filter}.subtitle`),
    para: isAr ? heroContentAr[filter].para : heroBase.para,
    primaryCTA: { ...heroBase.primaryCTA, label: t(`villas.${filter}.primaryBtn`) },
    secondaryCTA: { ...heroBase.secondaryCTA, label: t(`villas.${filter}.secondaryBtn`) },
    trustPoints: t(`villas.${filter}.trust`, { returnObjects: true }) as string[],
  }
  const cta = {
    ...ctaBase,
    h2: t(`villas.${filter}.ctaH2`),
    primaryCTA: { ...ctaBase.primaryCTA, label: t(`villas.${filter}.ctaPrimary`) },
    secondaryCTA: { ...ctaBase.secondaryCTA, label: t(`villas.${filter}.ctaSecondary`) },
    para: isAr ? finalCTAAr[filter].para : ctaBase.para,
  }

  const allVillaFaqs = t('villas.all.faqs', { returnObjects: true }) as Array<{q: string, a: string}>
  const standardVillaFaqs = t('villas.standard.faqs', { returnObjects: true }) as Array<{q: string, a: string}>
  const compoundVillaFaqs = t('villas.compound.faqs', { returnObjects: true }) as Array<{q: string, a: string}>
  const activeFaqs = filter === 'standard' ? standardVillaFaqs : filter === 'compound' ? compoundVillaFaqs : allVillaFaqs
  usePageSchema([faqPageSchema(activeFaqs)])

  const villasSeo = {
    all: { title: 'Villas for Rent in Doha | Luxury & Compound Villas Qatar', desc: 'Discover premium villas for rent in Doha and greater Qatar. Explore standalone private properties and managed compound villas with active WhatsApp leasing support.' },
    standard: { title: 'Standard Villas for Rent in Doha | Standalone Private Homes Qatar', desc: 'Browse verified standard and standalone villas for rent in Doha and greater Qatar. Find independent family homes with private perimeters and direct WhatsApp support.' },
    compound: { title: 'Compound Villas for Rent in Doha | Gated Family Communities Qatar', desc: 'Find premium compound villas for rent in Doha and greater Qatar. Explore secure, managed family complexes with shared pools, gyms, and direct WhatsApp support.' },
  }[filter]

  return (
    <>
      <title>{villasSeo.title}</title>
      <meta name="description" content={villasSeo.desc} />
      {/* â"€â"€ SECTION 1: HERO â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="bg-forest text-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Reveal direction="up" delay={0}>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{hero.h1}</h1>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-lime text-lg max-w-2xl mb-4">{hero.sub}</p>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/70 text-base max-w-3xl mb-8 leading-relaxed">{hero.para}</p>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mb-8">
                  {hero.primaryCTA.external ? (
                    <a
                      href={hero.primaryCTA.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-lime/90 transition-colors"
                    >
                      {hero.primaryCTA.label}
                    </a>
                  ) : (
                    <Link
                      to={hero.primaryCTA.href}
                      className="inline-flex items-center justify-center bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-lime/90 transition-colors"
                    >
                      {hero.primaryCTA.label}
                    </Link>
                  )}
                  {hero.secondaryCTA.external ? (
                    <a
                      href={hero.secondaryCTA.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-white/15 border border-white/30 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/25 transition-colors backdrop-blur-sm"
                    >
                      {hero.secondaryCTA.label}
                    </a>
                  ) : (
                    <Link
                      to={hero.secondaryCTA.href}
                      className="inline-flex items-center justify-center bg-white/15 border border-white/30 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/25 transition-colors backdrop-blur-sm"
                    >
                      {hero.secondaryCTA.label}
                    </Link>
                  )}
                </div>
              </Reveal>
              <Reveal direction="up" delay={320}>
                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2">
                  {hero.trustPoints.map(tp => (
                    <span key={tp} className="flex items-start gap-2 text-white/60 text-sm max-w-xs">
                      <CheckCircle2 size={14} className="text-lime shrink-0 mt-0.5" />
                      {tp}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {filter === 'all' && (
              <Reveal direction="right" delay={200}>
                <div className="relative pb-6 lg:pb-0">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <img src="/villas-for-rent-doha-qatar-dania-real-estate.webp" alt="Verified villas for rent in Doha Qatar managed by Dania Real Estate." className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">{isAr ? 'فلل · قوائم موثقة' : 'Villas · Verified Listings'}</div>
                  <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">{isAr ? 'بدون عمولة' : 'Zero Commission'}</div>
                </div>
              </Reveal>
            )}

            {filter === 'standard' && (
              <Reveal direction="right" delay={200}>
                <div className="relative pb-6 lg:pb-0">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <img src="/standard-villas-for-rent-doha-qatar.webp" alt="Verified standard villas for rent in Doha Qatar managed by Dania Real Estate." className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">{isAr ? 'فلل عادية · قطر' : 'Standard Villas · Qatar'}</div>
                  <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">{isAr ? 'بدون عمولة' : 'Zero Commission'}</div>
                </div>
              </Reveal>
            )}

            {filter === 'compound' && (
              <Reveal direction="right" delay={200}>
                <div className="relative pb-6 lg:pb-0">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <img src="/compound-villas-for-rent-doha-qatar.webp" alt="Verified compound villas for rent in Doha Qatar managed by Dania Real Estate." className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">{isAr ? 'فلل المجمعات · قطر' : 'Compound Villas · Qatar'}</div>
                  <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">{isAr ? 'بدون عمولة' : 'Zero Commission'}</div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      {/* SECTIONS FOR filter="all"                                             */}
      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      {filter === 'all' && (
        <>
          {/* SECTION 2: Villa Rental Overview */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">{isAr ? 'دعم استئجار الفلل في قطر' : 'Villa Rental Support in Qatar'}</h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Reveal direction="up" delay={100}>
                  <p className="text-ink-muted leading-relaxed text-sm">
                    {isAr ? 'يُعدّ اختيار تكوين الفيلا في سوق الإيجار القطري الخيار الأمثل للعائلات النامية والأسر التنفيذية والعملاء من الشركات الذين يُعطون الأولوية للمساقط الداخلية الواسعة والمساحات الخارجية الخاصة والاستقرار على المدى الطويل. على عكس بيئات الشقق التقليدية، توفر الفيلا المخصصة مناطق مستقلة لوقوف السيارات المتعددة، وأجنحة خاصة للخدم، وغرف استقبال الضيوف المنفصلة، والعمق المكاني اللازم لإدارة أسرة كبيرة بشكل مريح.' : 'Selecting a villa configuration within the Qatari rental market is the premier choice for growing families, executive households, and corporate clients who prioritize expansive interior floor plans, private outdoor space, and long-term stability. Unlike traditional apartment environments, a dedicated villa layout supplies independent multi-car parking zones, isolated domestic quarters, separate guest reception majlis areas, and the spatial depth needed to run a large household comfortably.'}
                  </p>
                </Reveal>
                <Reveal direction="up" delay={180}>
                  <p className="text-ink-muted leading-relaxed text-sm">
                    {isAr ? 'تُبسّط دانية للعقارات هذا القطاع المتخصص من السوق من خلال مساعدة المستأجرين المحتملين على تقييم العقارات بناءً على الأساليب الهيكلية الدقيقة وكفاءة التنقل في المنطقة واحتياجات البنية التحتية للأسرة. يُشكّل هذا الإطار الشامل بوابتك لاستكشاف أصول الفلل في قطر، مما يُتيح مقارنة واضحة قبل تضييق تركيزك على الفئات الفرعية المحددة من الفلل المستقلة أو مجمعات الفلل.' : 'Dania Real Estate simplifies this specialized market sector by helping prospective tenants evaluate properties based on precise structural styles, district commute efficiencies, and family infrastructure needs. This master framework serves as your gateway to exploring Qatar\'s villa assets, enabling a clear comparison before you narrow your focus down to specific standalone or compound sub-categories.'}
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* SECTION 3: Explore Villa Types */}
          <section id="villa-types" className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'اختر نمط الفيلا المفضل لديك' : 'Choose Your Preferred Villa Style'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-2xl">
                  {isAr ? 'لا تتبع جميع هياكل الفلل السكنية نفس النماذج القانونية أو التشغيلية المجتمعية. اختر تنسيق السكن المحدد الذي يتوافق مع قيم نمط حياتك ومعايير الخصوصية وتفضيلات المرافق.' : 'Not all residential villa structures follow the same legal or community operational models. Select the specific housing format that matches your lifestyle values, privacy parameters, and facility preferences.'}
                </p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(isAr ? [
                  {
                    h3: 'فلل عادية للإيجار',
                    desc: 'مثالية للأسر الكبيرة والحسابات المؤسسية التي تبحث عن حدود معيشية مستقلة تمامًا، ومحيطات خاصة مطلقة، وتكوينات مواقف سيارات مستقلة، وبدون جدران هيكلية مشتركة.',
                    btn: 'استكشف الفلل العادية',
                    href: '/villas-for-rent/standard-villas/',
                  },
                  {
                    h3: 'فلل المجمعات للإيجار',
                    desc: 'مصمّمة للعائلات التي تُعطي الأولوية للمعيشة المجتمعية المتكاملة، والمرافق الترفيهية المشتركة، والمسابح، والملاعب الآمنة للأطفال، والصيانة الميدانية، وحدود الأمن على مدار الساعة.',
                    btn: 'استكشف فلل المجمعات',
                    href: '/villas-for-rent/compound-villas/',
                  },
                ] : [
                  {
                    h3: 'Standard Villas for Rent',
                    desc: 'Ideal for large households and corporate accounts seeking completely independent living boundaries, absolute private perimeters, standalone parking configurations, and zero shared structural walls.',
                    btn: 'Explore Standard Villas',
                    href: '/villas-for-rent/standard-villas/',
                  },
                  {
                    h3: 'Compound Villas for Rent',
                    desc: 'Engineered for families who prioritize integrated community living, shared recreational facilities, swimming pools, child-safe playgrounds, on-site maintenance, and 24/7 security boundaries.',
                    btn: 'Explore Compound Villas',
                    href: '/villas-for-rent/compound-villas/',
                  },
                ]).map((card, i) => (
                  <Reveal key={card.h3} direction="up" delay={160 + i * 100}>
                    <div className="bg-white border border-border rounded-2xl p-7 hover:shadow-md transition-shadow flex flex-col h-full">
                      <h3 className="font-bold text-xl text-ink mb-3">{card.h3}</h3>
                      <p className="text-ink-muted text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
                      <Link
                        to={card.href}
                        className="inline-flex items-center justify-center bg-forest text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-forest/90 transition-colors"
                      >
                        {card.btn}
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: Why Villas Are a Practical Rental Choice */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'لماذا تُعدّ الفلل خياراً عملياً للإيجار في قطر' : 'Why Villas Are a Practical Rental Choice in Qatar'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-2xl">
                  {isAr ? 'توفر استئجار فيلا للأسر متعددة الأفراد والمديرين التنفيذيين في الشركات مزايا عملية جوهرية تتجاوز بكثير أعداد الغرف الأساسية.' : 'For multi-passenger households and corporate executives, leasing a villa provides essential practical advantages that go far beyond basic room counts.'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'عمق مكاني متعدد الأجيال',
                    desc: 'استمتع بتصاميم داخلية واسعة تضم أجنحة رئيسية متعددة، وأجنحة خاصة للخدم، وغرف للسائقين الخارجيين، وغرف استقبال رسمية للضيوف.',
                  },
                  {
                    h3: 'خصوصية المحيط المستقل',
                    desc: 'احمِ نمط الحياة اليومي لعائلتك داخل محيطات معزولة وجدران حدودية خاصة وبيئات سكنية هادئة بعيدة عن المباني عالية الكثافة.',
                  },
                  {
                    h3: 'المرافق الخارجية الخاصة',
                    desc: 'احصل على فناء أمامي خاص، ومناطق لعب آمنة في الفناء الخلفي، ومواقف سيارات مستقلة متعددة، وهياكل تخزين خارجية مخصصة.',
                  },
                  {
                    h3: 'الاستمرارية المنزلية طويلة الأمد',
                    desc: 'أسّس منصة حياة آمنة وقابلة للتنبؤ للغاية مصممة لإقامة عائلية متعددة السنوات واستقرار سكني متميز.',
                  },
                ] : [
                  {
                    h3: 'Multi-Generational Spatial Depth',
                    desc: 'Enjoy expansive interior layouts featuring multiple master suites, isolated domestic quarters, external driver rooms, and formal guest reception spaces.',
                  },
                  {
                    h3: 'Independent Boundary Privacy',
                    desc: "Protect your family's daily lifestyle within isolated perimeters, private boundary walls, and quiet residential environments far removed from high-density buildings.",
                  },
                  {
                    h3: 'Private Outdoor Utility',
                    desc: 'Access private front courtyards, secure backyard play areas, independent multi-car parking bays, and dedicated external storage structures.',
                  },
                  {
                    h3: 'Long-Term Domestic Continuity',
                    desc: 'Establish a secure, highly predictable lifestyle platform designed for multi-year family occupancies and premium residential stability.',
                  },
                ]).map((card, i) => (
                  <Reveal key={card.h3} direction="up" delay={160 + i * 80}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 size={16} className="text-forest" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-sm">{card.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed">{card.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: Who This Villa Rental Page Is For */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">{isAr ? 'لمن هذه الصفحة' : 'Who This Villa Rental Page Is For'}</h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {(isAr ? [
                  'العائلات الباحثة عن فلل موثقة وواسعة للإيجار في الدوحة أو البلديات المجاورة.',
                  'المستأجرون الذين يحتاجون إلى مساحات سكنية مستقلة واسعة النطاق بخصوصية محيطية عالية.',
                  'المقيمون على المدى الطويل الذين يبحثون عن عقارات عائلية متميزة مستقرة وحسنة الإدارة.',
                  'العملاء المميزون الذين يقارنون بنشاط الاختلافات التشغيلية والاجتماعية بين الفلل العادية وفلل المجمعات.',
                  'فرق الشراء المؤسسي الباحثة عن أماكن إقامة فلل ممتثلة وعالية السعة لدعم متطلبات إسكان موظفي الشركات.',
                ] : [
                  'Families searching for verified, spacious villas for rent in Doha or nearby municipalities.',
                  'Tenants require large-scale independent residential spaces with high perimeter privacy.',
                  'Long-Term Residents looking for stable, well-managed premium family properties.',
                  'Discerning Clients actively comparing the operational and social differences between standard villas and compound villas.',
                  'Corporate Procurement Teams searching for compliant, high-capacity villa accommodations to support corporate staff housing requirements.',
                ]).map((item, i) => (
                  <Reveal key={item} direction="up" delay={80 + i * 60}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                      <p className="text-ink-muted text-sm leading-relaxed">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: Villas by Key Qatar Areas */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'فلل للإيجار في الدوحة والمناطق الرئيسية في قطر' : 'Villas for Rent in Doha and Key Qatar Areas'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-3xl">
                  {isAr ? 'تتفاوت القواعد الشهرية للإيجار ومقاييس مساحة الفناء والأساليب الهيكلية للمنازل الفاخرة عبر مناطق محددة. توجّه دانية للعقارات استفسارات التأجير النشطة عبر هذه المراكز السكنية المحلية الحيوية:' : 'Monthly rental baselines, yard square-footage metrics, and structural styles for luxury homes vary across specific districts. Dania Real Estate directs active leasing inquiries across these vital local residential hubs:'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'فلل في الدوحة',
                    desc: 'عقارات مستقلة فاخرة ومجمعات حصرية في أحياء الدوحة المركزية والدفنة والمناطق السكنية الراقية.',
                    href: '/areas/doha/',
                  },
                  {
                    h3: 'فلل في السد',
                    desc: 'هياكل فلل عائلية تقع مركزيًا بالقرب من أبراج المكاتب التجارية الرئيسية في الدوحة ومناطق التجزئة والطرق الأساسية.',
                    href: '/areas/al-sadd/',
                  },
                  {
                    h3: 'فلل في بن محمود',
                    desc: 'خيارات فلل سكنية حضرية مصممة للحسابات المؤسسية والأسر الكبيرة التي تطلب اتصالية مركزية بالنقل.',
                    href: '/areas/bin-mahmoud/',
                  },
                  {
                    h3: 'فلل في الوكرة',
                    desc: 'خيارات فلل ساحلية واسعة ومجمعات عائلية توفر أسعارًا تنافسية خارج مركز المدينة.',
                    href: '/areas/al-wakra/',
                  },
                  {
                    h3: 'فلل في العزيزية وأبو هامور',
                    desc: 'أحياء عائلية راسخة وشهيرة تضم مجمعات مستقلة كبيرة بالقرب من المدارس الدولية والأسواق.',
                    href: '/areas/al-aziziya/',
                  },
                  {
                    h3: 'فلل في المطار القديم',
                    desc: 'قطع أراضي سكنية تاريخية سهلة الوصول توفر مساقط واسعة واتصالية سريعة بالطرق الدائرية الرئيسية.',
                    href: '/areas/old-airport/',
                  },
                  {
                    h3: 'فلل في أم صلال',
                    desc: 'خيارات فلل ضاحية شمالية ناشئة تمتد عبر أم صلال محمد، مثالية للمستأجرين الباحثين عن هدوء بعيد عن حركة المرور الحضرية.',
                    href: '/areas/umm-salal/',
                  },
                  {
                    h3: 'فلل في الخريطيات',
                    desc: 'أصول فلل ضاحية هادئة منخفضة الكثافة مصممة للعائلات الكبيرة التي تُعطي الأولوية للمساحات الواسعة.',
                    href: '/areas/al-kharaitiyat/',
                  },
                ] : [
                  {
                    h3: 'Villas in Doha',
                    desc: 'Luxury standalone properties and exclusive compounds inside central Doha neighborhoods, Al Dafna, and premium residential loops.',
                    href: '/areas/doha/',
                  },
                  {
                    h3: 'Villas in Al Sadd',
                    desc: "Centrally located family villa structures situated near Doha's primary commercial office towers, retail zones, and essential roads.",
                    href: '/areas/al-sadd/',
                  },
                  {
                    h3: 'Villas in Bin Mahmoud',
                    desc: 'Urban residential villa options tailored for corporate accounts and large households demanding central transit connectivity.',
                    href: '/areas/bin-mahmoud/',
                  },
                  {
                    h3: 'Villas in Al Wakra',
                    desc: 'Expansive coastal villa choices and family complexes offering cost-efficient pricing tiers outside the city center.',
                    href: '/areas/al-wakra/',
                  },
                  {
                    h3: 'Villas in Al Aziziya & Abu Hamour',
                    desc: 'Established, highly popular family neighborhoods featuring large independent compounds near international schools and markets.',
                    href: '/areas/al-aziziya/',
                  },
                  {
                    h3: 'Villas in Old Airport',
                    desc: 'Highly accessible, historic residential villa plots providing expansive floor plans and rapid connectivity to major ring roads.',
                    href: '/areas/old-airport/',
                  },
                  {
                    h3: 'Villas in Umm Salal',
                    desc: 'Emerging northern suburban villa choices spanning Umm Salal Mohammed, perfect for tenants seeking quiet space away from urban traffic.',
                    href: '/areas/umm-salal/',
                  },
                  {
                    h3: 'Villas in Al Kharaitiyat',
                    desc: 'Highly peaceful, low-density suburban villa assets engineered for large families prioritizing expansive yard spaces.',
                    href: '/areas/al-kharaitiyat/',
                  },
                ]).map((area, i) => (
                  <Reveal key={area.h3} direction="up" delay={160 + i * 60}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed mb-4">{area.desc}</p>
                      <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                        {isAr ? 'عرض العقارات ←' : 'View Properties →'}
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: Why Choose Dania Real Estate */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'لماذا تختار دانية للعقارات لاستئجار الفلل' : 'Why Choose Dania Real Estate for Villa Rentals'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-2xl">
                  {isAr ? 'يتطلب إيجاد المنزل العائلي المثالي تقييم وظائف التصميم وسجلات إدارة العقارات وتحديثات المخزون في الوقت الفعلي.' : 'Locating the ideal family home requires evaluating layout functionality, property management track records, and real-time inventory updates.'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'إشراف متخصص على سوق الفلل',
                    desc: 'نتجاوز قوائم الشقق غير ذات الصلة لننتقي تكوينات الفلل المستقلة والمجمعات الدقيقة التي تتوافق مع ملف نمط حياتك.',
                  },
                  {
                    h3: 'خبرة في الهندسة المعمارية الهيكلية',
                    desc: 'يشرح مستشارونا بسرعة الاختلافات التشغيلية الدقيقة بين القطع الخاصة المستقلة تمامًا والمساحات المُدارة في المجمعات.',
                  },
                  {
                    h3: 'مواءمة البنية التحتية العائلية',
                    desc: 'نربط معايير البحث الخاصة بك بالمتغيرات اليومية الحرجة مثل خطوط التنقل إلى المدارس الدولية والخدمات الصحية والحدائق المجتمعية.',
                  },
                  {
                    h3: 'مكتب استقطاب مباشر عبر الجوال',
                    desc: 'تجنب حلقات البوابات العقارية القديمة. تواصل مباشرةً مع وكلائنا الميدانيين عبر واتساب للحصول على مقاطع فيديو داخلية غير مُعدّلة للفلل الشاغرة فورًا.',
                  },
                ] : [
                  {
                    h3: 'Specialist Villa Market Oversight',
                    desc: 'We skip irrelevant apartment listings to curate exact standalone and compound villa configurations that align with your lifestyle profile.',
                  },
                  {
                    h3: 'Structural Architecture Expertise',
                    desc: 'Our consultants quickly explain the precise operational differences between completely independent private plots and managed complex spaces.',
                  },
                  {
                    h3: 'Family Infrastructure Alignment',
                    desc: 'We map your specific search parameters against critical daily variables like international school commute lines, health services, and community parks.',
                  },
                  {
                    h3: 'Direct Mobile Sourcing Desk',
                    desc: 'Skip outdated property portal loops. Connect directly with our on-ground agents via WhatsApp to receive unedited interior videos of vacant villas instantly.',
                  },
                ]).map((card, i) => (
                  <Reveal key={card.h3} direction="up" delay={160 + i * 80}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 size={16} className="text-forest" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-sm">{card.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed">{card.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: How Our Villa Rental Process Works */}
          <section className="py-20">
            <ProcessSteps
              title={isAr ? 'كيف تعمل عملية استئجار الفلل لدينا' : 'How Our Villa Rental Process Works'}
              steps={isAr ? [
                { num: '01', h3: 'قدّم مصفوفة العقار المستهدفة', desc: 'شارك قطاعك البلدي المفضل وتنسيق الفيلا المحدد ومتطلبات غرف النوم ومعايير الميزانية وتواريخ الانتقال المقصودة.' },
                { num: '02', h3: 'اختيار المخزون المُدار', desc: 'تقوم مكاتب التأجير لدينا بالتحقق المتبادل من قواعد بيانات الفلل المستقلة والمجمعات النشطة وغير المؤجرة للعثور على العقارات التي تلبي متطلباتك.' },
                { num: '03', h3: 'مراجعة تفاصيل العقار الموثقة', desc: 'احصل على معايير العقار الشاملة والأصول التصويرية الأصلية غير المُعدّلة وبيانات وسائل الراحة في الحي ومصفوفات العقود عبر التحديثات المباشرة للجوال.' },
                { num: '04', h3: 'جولة تفتيشية منسقة', desc: 'أتمّ معاينة فعلية في الموقع إلى جانب مستشار عقاري مخصص قبل المضي قدمًا في تسجيل عقد بلدية.' },
              ] : [
                { num: '01', h3: 'Submit Your Target Property Matrix', desc: 'Share your preferred municipal sector, specific villa format, bedroom requirements, budget parameters, and intended move-in dates.' },
                { num: '02', h3: 'Managed Inventory Selection', desc: 'Our leasing desks cross-examine active, unleased standalone and compound villa databases to find properties matching your requirements.' },
                { num: '03', h3: 'Review Verified Property Details', desc: 'Receive comprehensive property parameters, clear unedited photographic assets, neighborhood amenity sheets, and contract matrices via direct mobile updates.' },
                { num: '04', h3: 'Coordinated Inspection Walkthrough', desc: 'Complete a physical on-site inspection alongside a dedicated real estate advisor before moving forward to Baladiya contract registration.' },
              ]}
            />
          </section>

          {/* SECTION 9: Explore Villa Rental Options */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'استكشف خيارات استئجار الفلل' : 'Explore Villa Rental Options'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-8 max-w-2xl">
                  {isAr ? 'تفضل بزيارة مجلداتنا الفرعية المتخصصة لمراجعة مجموعات العقارات المستهدفة بناءً على أسلوب المعيشة العائلية المفضل لديك:' : 'Visit our specialized sub-directories to review targeted property collections based on your preferred style of family living:'}
                </p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                {(isAr ? [
                  {
                    label: 'فلل عادية للإيجار',
                    desc: 'مصمّمة للأسر الكبيرة التي تتطلب حدود معيشية مستقلة تمامًا وخصوصية محيطية مطلقة.',
                    href: '/villas-for-rent/standard-villas/',
                  },
                  {
                    label: 'فلل مجمعات للإيجار',
                    desc: 'مهيأة للعائلات الباحثة عن مرافق مجتمعية مشتركة، ومساحات ترفيهية، وبروتوكولات أمنية متكاملة.',
                    href: '/villas-for-rent/compound-villas/',
                  },
                ] : [
                  {
                    label: 'Standard Villas for Rent',
                    desc: 'Tailored for large households requiring completely independent living boundaries and absolute perimeter privacy.',
                    href: '/villas-for-rent/standard-villas/',
                  },
                  {
                    label: 'Compound Villas for Rent',
                    desc: 'Configured for families seeking shared community facilities, recreation spaces, and integrated security protocols.',
                    href: '/villas-for-rent/compound-villas/',
                  },
                ]).map((link, i) => (
                  <Reveal key={link.href} direction="up" delay={160 + i * 100}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-ink mb-2 text-sm">{link.label}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed mb-4">{link.desc}</p>
                      <Link to={link.href} className="text-forest font-semibold text-xs hover:underline">
                        {isAr ? 'استكشف الآن ←' : 'Explore Now →'}
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 10: Villa Rental FAQs */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">{isAr ? 'الأسئلة الشائعة حول استئجار الفلل' : 'Villa Rental FAQs'}</h2>
              </Reveal>
              <FaqAccordion faqs={allVillaFaqs} />
            </div>
          </section>
        </>
      )}

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      {/* SECTIONS FOR filter="standard"                                        */}
      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      {filter === 'standard' && (
        <>
          {/* SECTION 2: Private Villa Rentals Overview */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">{isAr ? 'استئجار الفلل الخاصة للمعيشة العائلية المستقلة' : 'Private Villa Rentals for Independent Family Living'}</h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Reveal direction="up" delay={100}>
                  <p className="text-ink-muted leading-relaxed text-sm">
                    {isAr ? 'يُعدّ اختيار فيلا عادية في سوق الإيجار القطري المسار المثالي للأسر التي تُعطي الأولوية للخصوصية المطلقة للمحيط والتحكم الفردي في تصميمها المنزلي. على عكس عقارات المجمعات التي تعمل ضمن تصميم حي جماعي، تقف الفيلا العادية المستقلة كوحدة سكنية مستقلة تمامًا. يمنح هذا التنسيق عائلتك وصولًا حصريًا لجميع الهياكل الخارجية ومناطق الفناء الخاصة والأسطح دون أي جدران مجتمعية مشتركة.' : 'Choosing a standard villa within the Qatari rental market is the ideal path for households prioritizing absolute perimeter privacy and individual control over their domestic layout. Unlike compound properties that function within a collective neighborhood layout, a standard standalone villa stands as an entirely independent residential unit. This format gives your family exclusive access to all outdoor structures, private courtyard zones, and rooftop spaces without any shared community walls.'}
                  </p>
                </Reveal>
                <Reveal direction="up" delay={180}>
                  <p className="text-ink-muted leading-relaxed text-sm">
                    {isAr ? 'توفر الفلل العادية للمغتربين على المدى الطويل والعائلات المحلية البارزة مرونة هيكلية لا مثيل لها. تقدم هذه العقارات بانتظام تكوينات داخلية واسعة، وأجنحة سائقين خارجية منفصلة، وملاحق منفصلة، وبوابات مواقف سيارات خاصة كبيرة مبنية لاستيعاب مركبات متعددة بأمان.' : 'For long-term expatriates and prominent local families, standard villas deliver unmatched structural flexibility. These properties regularly offer expansive indoor configurations, detached exterior driver blocks, separate outhouses, and large private parking gates built to hold multiple vehicles safely.'}
                  </p>
                </Reveal>
                <Reveal direction="up" delay={260}>
                  <div>
                    <p className="text-ink-muted leading-relaxed text-sm mb-4">
                      {isAr ? 'يختص هذا الدليل بالهياكل السكنية المستقلة. إذا كانت عائلتك تُفضّل إعداد مجتمعًا مشتركًا مع مرافق ترفيهية جماعية مشتركة، يرجى زيارة دليل المجمعات المخصص أدناه.' : 'This specific directory is optimized for standalone residential structures. If your family instead prefers a shared community setup with shared communal recreational amenities, please visit our dedicated compound directory below.'}
                    </p>
                    <Link
                      to="/villas-for-rent/compound-villas/"
                      className="inline-flex items-center justify-center bg-forest text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-forest/90 transition-colors"
                    >
                      {isAr ? 'استكشف فلل المجمعات للإيجار' : 'Explore Compound Villas for Rent'}
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* SECTION 3: Why Standard Villas Are a Practical Rental Choice */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'لماذا تُعدّ الفلل العادية خياراً عملياً للإيجار' : 'Why Standard Villas Are a Practical Rental Choice'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-2xl">
                  {isAr ? 'تمنح الهياكل السكنية المستقلة المستأجرين تحكمًا كاملًا في مساحة منزلهم والمساحات الخارجية وتفضيلات نمط الحياة اليومية.' : 'Standalone residential structures give tenants total control over their home footprint, exterior spaces, and daily lifestyle preferences.'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'خصوصية سكنية مطلقة',
                    desc: 'استمتع ببوابات سكنية منفصلة تمامًا وجدران حدودية معزولة وتصاميم مستقلة بدون نقاط هيكلية مشتركة أو ممرات مشتركة.',
                  },
                  {
                    h3: 'تصاميم متعددة الأجنحة الواسعة',
                    desc: 'احصل على مساقط داخلية ضخمة تضم صالات عائلية كبيرة وغرف مجالس ضيوف منفصلة وأجنحة خاصة للخدم في الموقع.',
                  },
                  {
                    h3: 'أفنية خاصة ومواقف مسوّرة',
                    desc: 'احصل على ملكية حصرية لفنائك الأمامي الخارجي ومناطق السطح المفتوح ومنافذ مواقف السيارات المتعددة المسوّرة الآمنة.',
                  },
                  {
                    h3: 'تحكم ذاتي كامل',
                    desc: 'أدر جداول الصيانة الخاصة بك وإعدادات التصميم الداخلي وملفات المرافق طويلة الأمد دون إشراف إداري من المجمع.',
                  },
                ] : [
                  {
                    h3: 'Absolute Residential Privacy',
                    desc: 'Enjoy completely separate residential gates, isolated boundary walls, and standalone layouts with zero shared structural points or shared common corridors.',
                  },
                  {
                    h3: 'Expansive Multi-Suite Layouts',
                    desc: 'Access massive interior footprints featuring large family lounges, separate guest majlis rooms, and detached on-site domestic quarters.',
                  },
                  {
                    h3: 'Private Yards & Gated Parking',
                    desc: 'Secure exclusive ownership of your outdoor front courtyard, open rooftop zones, and secure gated multi-car garage ports.',
                  },
                  {
                    h3: 'Total Autonomous Control',
                    desc: 'Manage your own maintenance timelines, interior styling setups, and long-term utility profiles without compound administrative oversight.',
                  },
                ]).map((card, i) => (
                  <Reveal key={card.h3} direction="up" delay={160 + i * 80}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 size={16} className="text-forest" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-sm">{card.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed">{card.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: Standard Villa vs Compound Villa */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'الفيلا العادية مقابل فيلا المجمع: ما الفرق؟' : 'Standard Villa vs Compound Villa: What Is the Difference?'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-8 max-w-2xl">
                  {isAr ? 'بينما يوفر كلا الخيارين مساحات عائلية واسعة، إلا أنهما يلبيان أولويات نمط حياة مختلفة جدًا. راجع الاختلافات الهيكلية قبل الشروع في البحث عن منزلك المستهدف:' : 'While both options offer expansive family spaces, they cater to very different lifestyle priorities. Review the structural differences before launching your target home search:'}
                </p>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-2xl overflow-hidden text-sm">
                    <thead>
                      <tr className="bg-forest text-white">
                        <th className="text-left px-6 py-4 font-semibold">{isAr ? 'معيار التقييم الأساسي' : 'Core Evaluation Metric'}</th>
                        <th className="text-left px-6 py-4 font-semibold">{isAr ? 'الفيلا العادية المستقلة' : 'Standard Standalone Villa'}</th>
                        <th className="text-left px-6 py-4 font-semibold">{isAr ? 'فيلا المجمع المُدار' : 'Managed Compound Villa'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isAr ? [
                        ['النظام البيئي للمعيشة', 'محيط مستقل ومكتفٍ ذاتيًا تمامًا', 'تصميم مجتمعي مشترك يركز على العائلة'],
                        ['المرافق الترفيهية', 'خاصة بالمخطط أو العقار المحدد', 'وصول مشترك لمسابح وصالات رياضية وملاعب'],
                        ['التحكم بالوصول', 'بوابات مدخل خاصة ومرائب شخصية', 'نقاط تفتيش أمنية ذات طاقم وبوابات مشتركة'],
                        ['الأنسب لـ', 'الأسر التي تطلب أقصى قدر من الخصوصية', 'العائلات الساعية إلى بيئات اجتماعية متكاملة'],
                      ] : [
                        ['Living Ecosystem', 'Fully independent, self-contained perimeter', 'Shared, family-centric community layout'],
                        ['Recreational Amenities', 'Private to the plot or property-specific', 'Shared access to pools, gyms, and courts'],
                        ['Access Control', 'Private entrance gates and personal garages', 'Staffed security checkpoints and shared gates'],
                        ['Best Suited For', 'Households demanding maximum privacy', 'Families seeking integrated social settings'],
                      ]).map(([metric, standard, compound], i) => (
                        <tr key={metric} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-low'}>
                          <td className="px-6 py-4 font-semibold text-ink">{metric}</td>
                          <td className="px-6 py-4 text-ink-muted">{standard}</td>
                          <td className="px-6 py-4 text-ink-muted">{compound}</td>
                        </tr>
                      ))}
                      <tr className="bg-white">
                        <td className="px-6 py-4 font-semibold text-ink">{isAr ? 'التنقل بين الأقسام' : 'Silo Navigation'}</td>
                        <td className="px-6 py-4 text-ink-muted">{isAr ? 'صفحة الدليل الحالية' : 'Current Live Directory Page'}</td>
                        <td className="px-6 py-4 text-ink-muted">
                          <Link to="/villas-for-rent/compound-villas/" className="text-forest font-semibold hover:underline">
                            {isAr ? 'استكشف فلل المجمعات' : 'Explore Compound Villas'}
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          </section>

          {/* SECTION 5: Who Should Consider a Standard Villa? */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">{isAr ? 'من يجب أن يفكر في الفيلا العادية؟' : 'Who Should Consider a Standard Villa?'}</h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {(isAr ? [
                  'العائلات الباحثة عن فلل مستقلة آمنة وخاصة تمامًا للإيجار في مناطق الدوحة الرئيسية.',
                  'المستأجرون الذين يريدون سيطرة مطلقة على محيطات عقاراتهم وحدائقهم وحدود أسطحهم.',
                  'الأسر متعددة الأجيال التي تحتاج إلى مساقط متعددة الأجنحة المستقلة وأجنحة ضيوف خاصة.',
                  'العملاء المميزون الذين يُفضّلون بوابات وصول خاصة تمامًا ومصفوفات مواقف منفصلة على ممرات المجمعات المشتركة.',
                  'الحسابات المؤسسية والدبلوماسيون الذين يحتاجون إلى إعدادات سكنية معزولة وعالية الأمان للتوظيف التنفيذي.',
                ] : [
                  'Families searching for secure, completely private standalone villas for rent within core Doha sectors.',
                  'Tenants who want absolute control over their property perimeters, gardens, and rooftop boundaries.',
                  'Multi-Generational Households requiring independent multi-suite floor plans and private guest wings.',
                  'Discerning Clients who prefer completely private access gates and separate parking arrays over shared compound lanes.',
                  'Corporate Accounts & Diplomats requiring isolated, highly secure residential setups for executive placement.',
                ]).map((item, i) => (
                  <Reveal key={item} direction="up" delay={80 + i * 60}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                      <p className="text-ink-muted text-sm leading-relaxed">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: Standard Villas by Key Qatar Areas */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'الفلل العادية في الدوحة والمناطق الرئيسية في قطر' : 'Standard Villas in Doha and Key Qatar Areas'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-3xl">
                  {isAr ? 'تتوافق القواعد الشهرية للإيجار ومقاييس مساحة الفناء والتكوينات المعمارية للفلل المستقلة بشكل طبيعي مع مناطقها البلدية. تدير دانية للعقارات الاستفسارات النشطة عبر هذه القطاعات الحيوية:' : 'Monthly rental baselines, yard square-footage metrics, and architectural configurations for standalone villas naturally align with their municipal zones. Dania Real Estate manages active inquiries across these vital sectors:'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'فلل عادية في الدوحة',
                    desc: 'منازل مستقلة متميزة وعقارات مستقلة متعددة الغرف في أحياء الدوحة المركزية والدفنة والمناطق السكنية الراقية.',
                    href: '/areas/doha/',
                  },
                  {
                    h3: 'فلل عادية في السد',
                    desc: 'منازل عائلية مستقلة عالية الطلب تقع مركزيًا بالقرب من قنوات التجزئة الراقية وشبكات الطرق الدائرية الرئيسية.',
                    href: '/areas/al-sadd/',
                  },
                  {
                    h3: 'فلل عادية في بن محمود',
                    desc: 'هياكل فلل حضرية مستقلة نادرة مصممة للمستأجرين المؤسسيين الذين يحتاجون إلى قرب فوري من مراكز الأعمال وسط المدينة.',
                    href: '/areas/bin-mahmoud/',
                  },
                  {
                    h3: 'فلل عادية في الوكرة',
                    desc: 'عقارات ساحلية مستقلة واسعة تقدم مساقط عالية المساحة ونماذج تسعير تنافسية خارج مركز المدينة.',
                    href: '/areas/al-wakra/',
                  },
                  {
                    h3: 'فلل عادية في العزيزية وأبو هامور',
                    desc: 'أحياء سكنية شهيرة للغاية تضم فللًا مستقلة خاصة كبيرة تقع بالقرب من مجمعات المدارس الدولية الكبرى.',
                    href: '/areas/al-aziziya/',
                  },
                  {
                    h3: 'فلل عادية في المطار القديم',
                    desc: 'قطع أراضي فلل مستقلة تقليدية سهلة الوصول توفر أفنية أمامية كبيرة وتنقلات سريعة إلى مسارات النقل التاريخية.',
                    href: '/areas/old-airport/',
                  },
                  {
                    h3: 'فلل عادية في أم صلال',
                    desc: 'خيارات مستقلة ضاحية شمالية عميقة عبر أم صلال محمد، مثالية للعائلات التي تُعطي الأولوية للعقارات الواسعة والمحيط الهادئ.',
                    href: '/areas/umm-salal/',
                  },
                  {
                    h3: 'فلل عادية في الخريطيات',
                    desc: 'أصول عائلية مستقلة ضاحية هادئة منخفضة الكثافة تتميز بتصاميم مفتوحة واسعة بعيدًا عن حركة مرور المدينة الداخلية.',
                    href: '/areas/al-kharaitiyat/',
                  },
                ] : [
                  {
                    h3: 'Standard Villas in Doha',
                    desc: 'Premium standalone homes and independent multi-bedroom estates situated inside central Doha districts, Al Dafna, and elite residential loops.',
                    href: '/areas/doha/',
                  },
                  {
                    h3: 'Standard Villas in Al Sadd',
                    desc: 'Centrally located, high-demand independent family homes positioned near premium retail channels and major ring road networks.',
                    href: '/areas/al-sadd/',
                  },
                  {
                    h3: 'Standard Villas in Bin Mahmoud',
                    desc: 'Rare independent urban villa structures tailored for corporate tenants requiring immediate proximity to downtown business cores.',
                    href: '/areas/bin-mahmoud/',
                  },
                  {
                    h3: 'Standard Villas in Al Wakra',
                    desc: 'Expansive standalone coastal properties offering high square-footage layouts and competitive pricing models outside the city center.',
                    href: '/areas/al-wakra/',
                  },
                  {
                    h3: 'Standard Villas in Al Aziziya & Abu Hamour',
                    desc: 'Highly popular residential neighborhoods featuring large private standalone villas situated close to major international school complexes.',
                    href: '/areas/al-aziziya/',
                  },
                  {
                    h3: 'Standard Villas in Old Airport',
                    desc: 'Traditional, highly accessible standalone villa plots providing large front yards and quick commutes to historical transit paths.',
                    href: '/areas/old-airport/',
                  },
                  {
                    h3: 'Standard Villas in Umm Salal',
                    desc: 'Deep northern suburban standalone choices across Umm Salal Mohammed, ideal for families prioritizing expansive properties and quiet surroundings.',
                    href: '/areas/umm-salal/',
                  },
                  {
                    h3: 'Standard Villas in Al Kharaitiyat',
                    desc: 'Quiet, low-density suburban standalone family assets featuring expansive open layouts away from inner-city traffic.',
                    href: '/areas/al-kharaitiyat/',
                  },
                ]).map((area, i) => (
                  <Reveal key={area.h3} direction="up" delay={160 + i * 60}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed mb-4">{area.desc}</p>
                      <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                        {isAr ? 'عرض العقارات ←' : 'View Properties →'}
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: Why Choose Dania Real Estate for Standard Villa Rentals */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'لماذا تختار دانية للعقارات لاستئجار الفلل العادية' : 'Why Choose Dania Real Estate for Standard Villa Rentals'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-2xl">
                  {isAr ? 'يتطلب إيجاد فيلا مستقلة ممتثلة التنقل عبر مقاييس الحمل على المرافق المحلية وحدود المخططات الدقيقة وتسجيلات العقود البلدية المباشرة.' : 'Finding a compliant standalone villa requires navigating localized utility load metrics, accurate plot boundaries, and direct municipal contract registrations.'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'خبرة في سوق الفلل المستقلة',
                    desc: 'نتجاوز مجموعات المجمعات الشائعة للتركيز على الفلل المستقلة الأصيلة التي تتوافق مع تفضيلات الخصوصية الدقيقة لديك.',
                  },
                  {
                    h3: 'تتبع دقيق للحدود',
                    desc: 'يضمن مستشارو العقارات لدينا التحقق الواضح من جميع المباني الخارجية وغرف السائقين وخطوط المرافق قبل توقيع العقد.',
                  },
                  {
                    h3: 'مطابقة عائلية منظمة',
                    desc: 'نوائم بحثك في العقار المستقل مع المتغيرات اليومية الحرجة مثل أنماط تنقل العائلة ومناطق المدارس والوصول إلى محلات البقالة.',
                  },
                  {
                    h3: 'تحديثات واتساب عند الطلب',
                    desc: 'تجنب الإعلانات المبوبة غير الموثوقة والمتكررة. تواصل مباشرةً مع وكلائنا الميدانيين عبر واتساب للحصول على وسائط داخلية غير مُعدّلة فورًا.',
                  },
                ] : [
                  {
                    h3: 'Standalone Market Expertise',
                    desc: 'We bypass common compound clusters to focus on authentic independent villas that match your precise privacy preferences.',
                  },
                  {
                    h3: 'Accurate Boundary Tracking',
                    desc: 'Our expert property consultants ensure all external outbuildings, driver rooms, and utility lines are clearly verified before contract signing.',
                  },
                  {
                    h3: 'Structured Family Matching',
                    desc: 'We align your standalone property search with critical daily variables like family transit patterns, school zones, and grocery access.',
                  },
                  {
                    h3: 'On-Demand WhatsApp Updates',
                    desc: 'Skip unverified, repetitive classified ads. Connect directly with our on-ground agents via WhatsApp to receive unedited interior media instantly.',
                  },
                ]).map((card, i) => (
                  <Reveal key={card.h3} direction="up" delay={160 + i * 80}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 size={16} className="text-forest" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-sm">{card.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed">{card.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: How Our Standard Villa Rental Process Works */}
          <section className="py-20">
            <ProcessSteps
              title={isAr ? 'كيف تعمل عملية استئجار الفلل العادية لدينا' : 'How Our Standard Villa Rental Process Works'}
              steps={isAr ? [
                { num: '01', h3: 'قدّم معايير الفيلا المستقلة', desc: 'شارك قطاعك البلدي المفضل وأعداد غرف النوم المطلوبة ومعايير الميزانية المستهدفة وتاريخ الانتقال المقصود.' },
                { num: '02', h3: 'حلقة عزل المحفظة', desc: 'يبحث فريق العقارات لدينا في قواعد بياناتنا المستقلة النشطة وغير المؤجرة لاستخراج العقارات التي تتوافق مع أهدافك المكانية والخصوصية.' },
                { num: '03', h3: 'تسليم الوسائط المباشر', desc: 'راجع وسائط داخلية غير مُعدّلة واضحة وحدود المخطط الدقيقة وشروط التسعير الشفافة المرسلة مباشرةً إلى جهازك المحمول.' },
                { num: '04', h3: 'معاينة موقع مصحوبة', desc: 'تجوّل في عقارك المستقل المستهدف إلى جانب خبير تأجير مخصص قبل المضي قدمًا في تسجيل عقد بلدية رسمي.' },
              ] : [
                { num: '01', h3: 'Submit Your Standalone Criteria Set', desc: 'Share your preferred municipal sector, required bedroom counts, target budget parameters, and intended move-in date.' },
                { num: '02', h3: 'Portfolio Isolation Loop', desc: 'Our property team searches our active, unleased standalone databases to pull properties that match your spatial and privacy goals.' },
                { num: '03', h3: 'Direct Media Delivery', desc: 'Review clear unedited interior media, exact plot boundaries, and transparent pricing terms sent directly to your mobile device.' },
                { num: '04', h3: 'Accompanied Site Inspection', desc: 'Walk through your target standalone property alongside a dedicated leasing expert before moving forward to formal Baladiya contract registration.' },
              ]}
            />
          </section>

          {/* SECTION 9: Explore More Villa Rental Options */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'استكشف المزيد من خيارات استئجار الفلل' : 'Explore More Villa Rental Options'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-8 max-w-2xl">
                  {isAr ? 'إذا كانت الفيلا المستقلة تمامًا لا تتوافق مع احتياجات نمط حياتك، استكشف خياراتنا السكنية العائلية الموثقة البديلة أدناه:' : 'If a completely independent standalone villa does not align with your lifestyle needs, explore our alternative verified family residential options below:'}
                </p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                {(isAr ? [
                  {
                    label: 'فلل للإيجار',
                    desc: 'عد إلى دليل مركز الفلل الرئيسي لدينا لاستكشاف نظرتنا الشاملة على العقارات المتميزة في قطر.',
                    href: '/villas-for-rent/',
                  },
                  {
                    label: 'فلل مجمعات للإيجار',
                    desc: 'استكشف المجتمعات العائلية المتميزة التي تقدم مرافق ترفيهية مشتركة وصالات رياضية ومسابح وأمنًا على مدار الساعة.',
                    href: '/villas-for-rent/compound-villas/',
                  },
                ] : [
                  {
                    label: 'Villas for Rent',
                    desc: 'Return to our main villa hub directory to explore our complete overview of premium properties in Qatar.',
                    href: '/villas-for-rent/',
                  },
                  {
                    label: 'Compound Villas for Rent',
                    desc: 'Explore premium family-centric communities offering shared recreational amenities, gyms, pools, and 24/7 security.',
                    href: '/villas-for-rent/compound-villas/',
                  },
                ]).map((link, i) => (
                  <Reveal key={link.href} direction="up" delay={160 + i * 100}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-ink mb-2 text-sm">{link.label}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed mb-4">{link.desc}</p>
                      <Link to={link.href} className="text-forest font-semibold text-xs hover:underline">
                        {isAr ? 'استكشف الآن ←' : 'Explore Now →'}
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 10: Standard Villa Rental FAQs */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">{isAr ? 'الأسئلة الشائعة حول استئجار الفلل العادية' : 'Standard Villa Rental FAQs'}</h2>
              </Reveal>
              <FaqAccordion faqs={standardVillaFaqs} />
            </div>
          </section>
        </>
      )}

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      {/* SECTIONS FOR filter="compound"                                        */}
      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      {filter === 'compound' && (
        <>
          {/* SECTION 2: Community-Based Villa Rentals Overview */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">{isAr ? 'استئجار فلل المجتمعات للمعيشة العائلية' : 'Community-Based Villa Rentals for Family Living'}</h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Reveal direction="up" delay={100}>
                  <p className="text-ink-muted leading-relaxed text-sm">
                    {isAr ? 'يُعدّ اختيار فيلا مجمع في سوق الإيجار القطري الخيار المفضل للعائلات التي تريد الموازنة بين التصميم الواسع للمنزل التقليدي ومرافق مجتمع سكني مُدار منظم. على عكس العقارات المستقلة التي تقف في عزلة خلف جدران خاصة، تقع فيلا المجمع داخل مشروع سكني آمن مخطط رئيسي. يوفر هذا النظام البيئي لعائلتك وصولًا مشتركًا إلى مرافق اجتماعية متميزة ومناطق ترفيهية ودعم صيانة احترافي، كل ذلك ضمن إعداد حي مكتفٍ ذاتيًا.' : 'Selecting a compound villa within the Qatari rental market is the preferred choice for families who want to balance the spacious layout of a traditional house with the structured amenities of a managed residential community. Unlike standalone properties that stand in isolation behind private walls, a compound villa sits inside a secure, master-planned residential development. This ecosystem offers your family shared access to premium social facilities, recreational zones, and professional maintenance support, all within a self-contained neighborhood setting.'}
                  </p>
                </Reveal>
                <Reveal direction="up" delay={180}>
                  <p className="text-ink-muted leading-relaxed text-sm">
                    {isAr ? 'توفر الحياة في المجمع للمغتربين على المدى الطويل والحسابات المؤسسية راحة البال والمعيشة اليومية السهلة. تُزيل هذه العقارات ضغط إدارة الصيانة المستقلة للعقار، مما يمنح أسرتك وصولًا فوريًا إلى شعور آمن بالجوار حيث يمكن للأطفال اللعب بحرية ويتولى فرق ميدانية مخصصة معالجة طلبات الصيانة.' : 'For long-term expatriates and corporate accounts, compound living provides peace of mind and effortless daily living. These properties remove the stress of managing independent property upkeep, giving your household immediate access to a safe neighborhood feel where children can play freely and maintenance requests are handled by dedicated on-site teams.'}
                  </p>
                </Reveal>
                <Reveal direction="up" delay={260}>
                  <div>
                    <p className="text-ink-muted leading-relaxed text-sm mb-4">
                      {isAr ? 'يختص هذا الدليل بالهياكل السكنية للمجمعات المُدارة. إذا كانت عائلتك تُفضّل الخصوصية المطلقة لمنزل مستقل بدون جدران مجتمعية مشتركة، يرجى زيارة دليل الفلل المستقلة المخصص.' : 'This specific directory covers managed compound residential structures. If your family instead prefers the absolute privacy of an independent standalone home with no shared community walls, please visit our dedicated standalone villa directory.'}
                    </p>
                    <Link
                      to="/villas-for-rent/standard-villas/"
                      className="inline-flex items-center justify-center bg-forest text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-forest/90 transition-colors"
                    >
                      {isAr ? 'استكشف الفلل العادية للإيجار' : 'Explore Standard Villas for Rent'}
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* SECTION 3: Why Compound Villas Are a Practical Rental Choice */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'لماذا تُعدّ فلل المجمعات خياراً عملياً للإيجار' : 'Why Compound Villas Are a Practical Rental Choice'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-2xl">
                  {isAr ? 'توفر بيئات المجمعات المسوّرة منصة معيشية خالية من القلق حيث تتلاقى راحة نمط الحياة وخيارات اللياقة البدنية المجتمعية والسلامة المتميزة بشكل مثالي.' : 'Gated compound environments deliver a worry-free living platform where lifestyle convenience, communal fitness options, and premium safety intersect perfectly.'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'معيشة تمحورت حول المجتمع',
                    desc: 'استمتع ببيئة ترحيبية على طراز الجوار تجعل من السهل على أفراد الأسرة التواصل والبقاء نشطين والشعور بالراحة خلال فترات الإيجار الطويلة.',
                  },
                  {
                    h3: 'سلامة وأمن مسوّر',
                    desc: 'احمِ عائلتك داخل محيطات مُدارة تضم نقاط تفتيش أمنية ذات طاقم وبوابات تحكم في الوصول وممرات مرور داخلية آمنة للأطفال.',
                  },
                  {
                    h3: 'مرافق مشتركة شاملة',
                    desc: 'احصل على وصول فوري لنوادي مجتمعية متميزة ومسابح سباحة ومراكز لياقة بدنية وملاعب تنس وملاعب أطفال آمنة.',
                  },
                  {
                    h3: 'دعم صيانة خالٍ من الإجهاد',
                    desc: 'وفّر وقتًا ثمينًا مع فرق صيانة المرافق الميدانية المخصصة المسؤولة عن معالجة التدفئة والتبريد والسباكة والصيانة الهيكلية.',
                  },
                ] : [
                  {
                    h3: 'Community-Centric Living',
                    desc: 'Enjoy a welcoming neighborhood-style environment that makes it easy for family members to connect, stay active, and feel at home during long-term tenancies.',
                  },
                  {
                    h3: 'Gated Safety and Security',
                    desc: 'Protect your family inside managed perimeters featuring staffed security checkpoints, access control gates, and slow, child-safe interior traffic lanes.',
                  },
                  {
                    h3: 'Comprehensive Shared Facilities',
                    desc: "Gain immediate access to premium community clubhouses, swimming pools, fitness centers, tennis courts, and secure children's playgrounds.",
                  },
                  {
                    h3: 'Stress-Free Maintenance Support',
                    desc: 'Save valuable time with dedicated, on-site facility maintenance teams responsible for handling your heating, cooling, plumbing, and structural upkeep.',
                  },
                ]).map((card, i) => (
                  <Reveal key={card.h3} direction="up" delay={160 + i * 80}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 size={16} className="text-forest" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-sm">{card.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed">{card.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: Compound Villa vs Standard Villa */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'فيلا المجمع مقابل الفيلا العادية: ما الفرق؟' : 'Compound Villa vs Standard Villa: What Is the Difference?'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-8 max-w-2xl">
                  {isAr ? 'بينما يوفر كلا الخيارين السكنيين مساحات عائلية واسعة، إلا أنهما يخدمان أنماط حياة مختلفة. راجع هذه الاختلافات الهيكلية والتشغيلية قبل اختيار تصميمك:' : 'While both residential choices provide extensive family spaces, they serve different lifestyles. Review these structural and operational variations before picking your layout:'}
                </p>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-2xl overflow-hidden text-sm">
                    <thead>
                      <tr className="bg-forest text-white">
                        <th className="text-left px-6 py-4 font-semibold">{isAr ? 'معيار التقييم الأساسي' : 'Core Evaluation Metric'}</th>
                        <th className="text-left px-6 py-4 font-semibold">{isAr ? 'فيلا المجمع المُدار' : 'Managed Compound Villa'}</th>
                        <th className="text-left px-6 py-4 font-semibold">{isAr ? 'الفيلا العادية المستقلة' : 'Standard Standalone Villa'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isAr ? [
                        ['النظام البيئي للمعيشة', 'تصميم مجتمعي مشترك يركز على العائلة', 'محيط مستقل ومكتفٍ ذاتيًا تمامًا'],
                        ['المرافق الترفيهية', 'وصول مشترك لمسابح وصالات رياضية ونوادٍ', 'خاصة بالمخطط أو العقار المحدد'],
                        ['الوصول والأمن', 'نقاط تفتيش أمنية ذات طاقم وبوابات مشتركة', 'بوابات مدخل خاصة ومرائب شخصية'],
                        ['نموذج الصيانة', 'تتولاها فرق مرافق ميدانية مركزية', 'تُدار بشكل مستقل من المالك أو المستأجر'],
                      ] : [
                        ['Living Ecosystem', 'Shared, family-centric community layout', 'Fully independent, self-contained perimeter'],
                        ['Recreational Amenities', 'Shared access to pools, gyms, and clubhouses', 'Private to the plot or property-specific'],
                        ['Access & Security', 'Staffed security checkpoints and shared gates', 'Private entrance gates and personal garages'],
                        ['Maintenance Model', 'Handled by centralized on-site facilities teams', 'Managed independently by landlord or tenant'],
                      ]).map(([metric, compound, standard], i) => (
                        <tr key={metric} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-low'}>
                          <td className="px-6 py-4 font-semibold text-ink">{metric}</td>
                          <td className="px-6 py-4 text-ink-muted">{compound}</td>
                          <td className="px-6 py-4 text-ink-muted">{standard}</td>
                        </tr>
                      ))}
                      <tr className="bg-white">
                        <td className="px-6 py-4 font-semibold text-ink">{isAr ? 'التنقل بين الأقسام' : 'Silo Navigation'}</td>
                        <td className="px-6 py-4 text-ink-muted">{isAr ? 'صفحة الدليل الحالية' : 'Current Live Directory Page'}</td>
                        <td className="px-6 py-4 text-ink-muted">
                          <Link to="/villas-for-rent/standard-villas/" className="text-forest font-semibold hover:underline">
                            {isAr ? 'استكشف الفلل العادية' : 'Explore Standard Villas'}
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          </section>

          {/* SECTION 5: Who Should Consider a Compound Villa? */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">{isAr ? 'من يجب أن يفكر في فيلا المجمع؟' : 'Who Should Consider a Compound Villa?'}</h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {(isAr ? [
                  'العائلات الباحثة عن فلل مجمعات موثقة للإيجار في المناطق السكنية الرئيسية بالدوحة.',
                  'المغتربون الذين يبحثون عن مجتمع جوار نشط ومرحب يحتوي على مرافق ترفيهية مدمجة.',
                  'الآباء الذين يُعطون الأولوية للوصول إلى مناطق لعب خارجية آمنة ومناسبة للأطفال ومسابح مشتركة.',
                  'المستأجرون الذين يُفضّلون نموذج صيانة سكنية عدم التدخل مدعومًا بفرق مرافق ميدانية احترافية.',
                  'فرق الموارد البشرية المؤسسية التي تحتاج إلى بيئات مجمعات آمنة وممتثلة تمامًا لإسكان موظفي الشركات أو التوظيف التنفيذي.',
                ] : [
                  'Families searching for verified compound villas for rent within core Doha residential zones.',
                  'Expatriates looking for an active, welcoming neighborhood community with built-in recreational amenities.',
                  'Parents prioritizing access to secure, child-friendly outdoor play zones and shared swimming pools.',
                  'Tenants who prefer a hands-off residential maintenance model backed by professional on-site facility teams.',
                  'Corporate HR Teams require secure, fully compliant compound environments for corporate staff housing or executive placement.',
                ]).map((item, i) => (
                  <Reveal key={item} direction="up" delay={80 + i * 60}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                      <p className="text-ink-muted text-sm leading-relaxed">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: Compound Villas by Key Qatar Areas */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'فلل المجمعات في الدوحة والمناطق الرئيسية في قطر' : 'Compound Villas in Doha and Key Qatar Areas'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-3xl">
                  {isAr ? 'تتوافق معايير الإيجار الشهرية ومساحات مرافق النادي والتصاميم المتاحة لفلل المجمعات بشكل طبيعي مع مناطقها البلدية. توجّه دانية للعقارات استفسارات التأجير النشطة عبر هذه القطاعات الأساسية:' : 'Monthly rental parameters, clubhouse facility footprints, and available layouts for compound villas naturally correspond with their municipal zones. Dania Real Estate directs active leasing inquiries across these core sectors:'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'فلل مجمعات في الدوحة',
                    desc: 'مشاريع مجتمعات مسوّرة متميزة وتصاميم مجمعات متعددة الغرف عبر الدوحة المركزية والهلال والمناطق السكنية الراقية.',
                    href: '/areas/doha/',
                  },
                  {
                    h3: 'فلل مجمعات في السد',
                    desc: 'إيجارات مجمعات عائلية عالية الطلب توفر مرافق صالة رياضية متكاملة بالقرب من أبراج المكاتب التجارية الرئيسية في الدوحة ومناطق التجزئة.',
                    href: '/areas/al-sadd/',
                  },
                  {
                    h3: 'فلل مجمعات في بن محمود',
                    desc: 'إعدادات مجمعات حضرية استراتيجية توفر تصاميم متعددة الغرف حديثة ووصولًا سريعًا إلى مسارات النقل داخل المدينة.',
                    href: '/areas/bin-mahmoud/',
                  },
                  {
                    h3: 'فلل مجمعات في الوكرة',
                    desc: 'مجمعات عائلية ساحلية موفّرة التكلفة تضم مسابح مجتمعية مشتركة واسعة وملاعب أطفال خارج مركز المدينة.',
                    href: '/areas/al-wakra/',
                  },
                  {
                    h3: 'فلل مجمعات في العزيزية وأبو هامور',
                    desc: 'مواقع عائلية مرغوبة للغاية تضم مجمعات متميزة تقع على الفور بجانب أفضل المدارس الدولية.',
                    href: '/areas/al-aziziya/',
                  },
                  {
                    h3: 'فلل مجمعات في المطار القديم',
                    desc: 'كتل سكنية مجمعات راسخة وسهلة الوصول توفر تنقلات سريعة إلى خطوط النقل التاريخية ومراكز التسوق.',
                    href: '/areas/old-airport/',
                  },
                  {
                    h3: 'فلل مجمعات في أم صلال',
                    desc: 'مشاريع مجمعات ضاحية شمالية هادئة عبر أم صلال محمد، مثالية للأسر الكبيرة التي تُعطي الأولوية للمساحة والمحيط الهادئ.',
                    href: '/areas/umm-salal/',
                  },
                  {
                    h3: 'فلل مجمعات في الخريطيات',
                    desc: 'مشاريع مجمعات ضاحية منخفضة الكثافة تركز على العائلة وتوفر مساحات خضراء واسعة بعيدًا عن ممرات حركة مرور وسط المدينة.',
                    href: '/areas/al-kharaitiyat/',
                  },
                ] : [
                  {
                    h3: 'Compound Villas in Doha',
                    desc: 'Premium gated community developments and multi-bedroom compound layouts across Central Doha, Al Hilal, and premium residential loops.',
                    href: '/areas/doha/',
                  },
                  {
                    h3: 'Compound Villas in Al Sadd',
                    desc: "High-demand family compound rentals providing integrated gym facilities close to Doha's primary commercial office towers and retail zones.",
                    href: '/areas/al-sadd/',
                  },
                  {
                    h3: 'Compound Villas in Bin Mahmoud',
                    desc: 'Strategic urban compound settings offering modern multi-room layouts and quick access to inner-city transport routes.',
                    href: '/areas/bin-mahmoud/',
                  },
                  {
                    h3: 'Compound Villas in Al Wakra',
                    desc: "Cost-efficient coastal family compounds featuring extensive shared community pools and children's playgrounds outside the city center.",
                    href: '/areas/al-wakra/',
                  },
                  {
                    h3: 'Compound Villas in Al Aziziya & Abu Hamour',
                    desc: 'Highly sought-after family locations featuring premium compounds positioned immediately adjacent to top international schools.',
                    href: '/areas/al-aziziya/',
                  },
                  {
                    h3: 'Compound Villas in Old Airport',
                    desc: 'Highly accessible, well-established compound residential blocks providing quick commutes to historical transit lines and shopping centers.',
                    href: '/areas/old-airport/',
                  },
                  {
                    h3: 'Compound Villas in Umm Salal',
                    desc: 'Peaceful northern suburban compound developments across Umm Salal Mohammed, perfect for large households prioritizing space and quiet surroundings.',
                    href: '/areas/umm-salal/',
                  },
                  {
                    h3: 'Compound Villas in Al Kharaitiyat',
                    desc: 'Low-density, family-focused suburban compound developments providing extensive green spaces far removed from downtown traffic lanes.',
                    href: '/areas/al-kharaitiyat/',
                  },
                ]).map((area, i) => (
                  <Reveal key={area.h3} direction="up" delay={160 + i * 60}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed mb-4">{area.desc}</p>
                      <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                        {isAr ? 'عرض العقارات ←' : 'View Properties →'}
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: Why Choose Dania Real Estate for Compound Villa Rentals */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'لماذا تختار دانية للعقارات لاستئجار فلل المجمعات' : 'Why Choose Dania Real Estate for Compound Villa Rentals'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-10 max-w-2xl">
                  {isAr ? 'يتطلب إيجاد مجمع عائلي ممتثل فهمًا واضحًا لقواعد المجتمع وحالات المرافق الدقيقة وشروط العقود الواضحة.' : 'Finding a compliant family compound requires a clear understanding of community rules, accurate facility conditions, and clear contract terms.'}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isAr ? [
                  {
                    h3: 'معرفة متخصصة بسوق المجمعات',
                    desc: 'نستبعد القوائم المستقلة المعزولة للتركيز حصريًا على المجمعات المسوّرة الموثقة التي تتوافق مع معايير نمط حياة عائلتك.',
                  },
                  {
                    h3: 'التحقق من المرافق والمنشآت',
                    desc: 'يفحص مستشارونا بدقة المناطق المجتمعية المشتركة وسياسات الوصول للنوادي وسلامة الملاعب قبل ترتيب الجولات.',
                  },
                  {
                    h3: 'مواءمة نمط الحياة العائلية',
                    desc: 'نطابق بحثك في المجمع مع المتغيرات اليومية الحرجة مثل مسارات توجيه حافلات المدارس والسوبرماركت وأوقات التنقل.',
                  },
                  {
                    h3: 'تحديثات جوال مباشرة سريعة',
                    desc: 'تجنب منصات قوائم العقارات القديمة. تواصل مباشرةً عبر واتساب للحصول على مقاطع فيديو داخلية غير مُعدّلة لوحدات المجمع الشاغرة فورًا.',
                  },
                ] : [
                  {
                    h3: 'Dedicated Compound Market Knowledge',
                    desc: "We screen out isolated standalone listings to focus exclusively on vetted gated compounds that match your family's lifestyle criteria.",
                  },
                  {
                    h3: 'Amenity and Facility Verification',
                    desc: 'Our consultants thoroughly inspect shared community zones, clubhouse access policies, and playground safety before arranging tours.',
                  },
                  {
                    h3: 'Family Lifestyle Alignment',
                    desc: 'We match your compound search with critical daily variables like school bus routing paths, supermarkets, and commute times.',
                  },
                  {
                    h3: 'Rapid Direct Mobile Updates',
                    desc: 'Skip outdated property listing platforms. Connect directly via WhatsApp to receive unedited interior videos of vacant compound units instantly.',
                  },
                ]).map((card, i) => (
                  <Reveal key={card.h3} direction="up" delay={160 + i * 80}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-lime-light rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 size={16} className="text-forest" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-sm">{card.h3}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed">{card.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: How Our Compound Villa Rental Process Works */}
          <section className="py-20">
            <ProcessSteps
              title={isAr ? 'كيف تعمل عملية استئجار فلل المجمعات لدينا' : 'How Our Compound Villa Rental Process Works'}
              steps={isAr ? [
                { num: '01', h3: 'قدّم متطلبات مجتمعك', desc: 'شارك قطاعك البلدي المفضل وعدد غرف النوم المطلوب وحدود الميزانية ومتطلبات المرافق وتاريخ الانتقال المقصود.' },
                { num: '02', h3: 'مطابقة محفظة المجمع', desc: 'تبحث مكاتب التأجير لدينا في مخزونات المجمعات النشطة وغير المؤجرة لاستخراج الخيارات التي تتوافق مع معايير المرافق المكانية والمجتمعية لديك.' },
                { num: '03', h3: 'مراجعة مباشرة للوسائط والمرافق', desc: 'راجع الصور الداخلية غير المُعدّلة ومصفوفات مخططات الطوابق وقوائم واضحة من وسائل الراحة المشتركة في المجمع المرسلة مباشرةً إلى جهازك المحمول.' },
                { num: '04', h3: 'جولة منسقة في المجمع', desc: 'أتمّ جولة فعلية في الموقع للفيلا والمرافق المشتركة إلى جانب خبير تأجير مخصص قبل المضي قدمًا في توقيع العقد.' },
              ] : [
                { num: '01', h3: 'Submit Your Community Requirements', desc: 'Share your preferred municipal sector, required bedroom count, budget thresholds, facility requirements, and intended move-in date.' },
                { num: '02', h3: 'Compound Portfolio Matching', desc: 'Our leasing desks search active, unleased compound inventories to pull options that match your spatial and communal facility parameters.' },
                { num: '03', h3: 'Direct Media and Amenity Review', desc: 'Review unedited interior photographs, floor plan matrices, and clear lists of shared compound amenities sent directly to your mobile device.' },
                { num: '04', h3: 'Coordinated Compound Walkthrough', desc: 'Complete an on-site physical tour of the villa and shared facilities alongside a dedicated leasing expert before moving forward to contract signing.' },
              ]}
            />
          </section>

          {/* SECTION 9: Explore More Villa Rental Options */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{isAr ? 'استكشف المزيد من خيارات استئجار الفلل' : 'Explore More Villa Rental Options'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted mb-8 max-w-2xl">
                  {isAr ? 'إذا كان تصميم مجتمع مسوّر لا يتوافق مع أهداف نمط حياتك، استكشف خياراتنا السكنية العائلية الموثقة البديلة أدناه:' : 'If a gated community layout does not align with your lifestyle goals, explore our alternative verified family residential options below:'}
                </p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                {(isAr ? [
                  {
                    label: 'فلل للإيجار',
                    desc: 'عد إلى دليل مركز الفلل الرئيسي لدينا لاستكشاف نظرتنا الشاملة على العقارات المتميزة في قطر.',
                    href: '/villas-for-rent/',
                  },
                  {
                    label: 'فلل عادية للإيجار',
                    desc: 'استكشف عقارات مستقلة تمامًا مبنية على مخططات منفصلة بجدران حدودية خاصة وخصوصية مطلقة.',
                    href: '/villas-for-rent/standard-villas/',
                  },
                ] : [
                  {
                    label: 'Villas for Rent',
                    desc: 'Return to our main villa hub directory to explore our complete overview of premium properties in Qatar.',
                    href: '/villas-for-rent/',
                  },
                  {
                    label: 'Standard Villas for Rent',
                    desc: 'Explore completely independent standalone properties built on separate plots with private boundary walls and absolute privacy.',
                    href: '/villas-for-rent/standard-villas/',
                  },
                ]).map((link, i) => (
                  <Reveal key={link.href} direction="up" delay={160 + i * 100}>
                    <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-ink mb-2 text-sm">{link.label}</h3>
                      <p className="text-ink-muted text-xs leading-relaxed mb-4">{link.desc}</p>
                      <Link to={link.href} className="text-forest font-semibold text-xs hover:underline">
                        {isAr ? 'استكشف الآن ←' : 'Explore Now →'}
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 10: Compound Villa Rental FAQs */}
          <section className="bg-surface-low py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">{isAr ? 'الأسئلة الشائعة حول استئجار فلل المجمعات' : 'Compound Villa Rental FAQs'}</h2>
              </Reveal>
              <FaqAccordion faqs={compoundVillaFaqs} />
            </div>
          </section>
        </>
      )}

      {/* â"€â"€ SECTION 11: FINAL CTA â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <Reveal direction="up" delay={0}>
          <div className="relative bg-lime rounded-3xl px-5 py-10 sm:px-8 sm:py-16 text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-forest/10 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-forest/10 rounded-full" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">{cta.h2}</h2>
              <p className="text-forest/70 text-lg mb-10 max-w-md mx-auto">{cta.para}</p>
              <div className="flex flex-row flex-wrap gap-2 sm:gap-3 justify-center">
                <a
                  href={cta.primaryCTA.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-forest text-white font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base hover:bg-forest/90 transition-colors"
                >
                  {cta.primaryCTA.label}
                </a>
                {cta.secondaryCTA.external ? (
                  <a
                    href={cta.secondaryCTA.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white text-ink font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base hover:bg-white/90 transition-colors"
                  >
                    {cta.secondaryCTA.label}
                  </a>
                ) : (
                  <Link
                    to={cta.secondaryCTA.href}
                    className="inline-flex items-center justify-center bg-white text-ink font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base hover:bg-white/90 transition-colors"
                  >
                    {cta.secondaryCTA.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

