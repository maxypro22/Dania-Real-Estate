import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { ProcessSteps } from '@/components/shared/ProcessSteps'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown, Sofa, Zap, Car, ShieldCheck, Utensils, Wifi, ArrowRight } from 'lucide-react'
import { usePageSchema } from '@/components/shared/Seo'
import { faqPageSchema } from '@/lib/seo'
import { StackedCards } from '@/components/shared/StackedCards'
import { CardCarousel } from '@/components/shared/CardCarousel'
import { LocationIcon } from '@/components/shared/LocationIcon'

interface Props { filter: 'all' | '1-bedroom' | '2-bedroom' | '3-bedroom' }

/* ─── Section 2 core flat amenity icons (paired by index with apartments.all.amenities) ─── */
const AMENITY_ICONS = [Sofa, Zap, Car, ShieldCheck, Utensils, Wifi]


/* ─── FAQ accordion component ──────────────────────────────────────────── */
function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <Reveal key={i} delay={i * 60}>
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

/* ─── Shared Final CTA Banner ───────────────────────────────────────────── */
function FinalCtaBanner({
  h2, para, primaryLabel, primaryHref, secondaryLabel, secondaryHref,
}: {
  h2: string; para: string;
  primaryLabel: string; primaryHref: string;
  secondaryLabel: string; secondaryHref: string;
}) {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-16">
      <Reveal>
        <div className="relative bg-lime rounded-3xl px-5 py-10 sm:px-8 sm:py-16 text-center overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-light/30 rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-light/30 rounded-full" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">{h2}</h2>
            <p className="text-forest/70 text-lg mb-10 max-w-md mx-auto">{para}</p>
            <div className="flex flex-row flex-wrap gap-2 sm:gap-3 justify-center">
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-forest text-white font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base hover:opacity-90 transition-opacity"
              >
                {primaryLabel}
              </a>
              <Link
                to={secondaryHref}
                className="inline-flex items-center justify-center bg-white text-ink font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base hover:bg-white/90 transition-colors"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   FILTER = "all"  — Main Apartments page (11 sections)
══════════════════════════════════════════════════════════════════════════ */
function AllApartmentsContent() {
  const { t } = useTranslation()

  /* Hero */
  const trust = t('apartments.all.trust', { returnObjects: true }) as string[]

  /* Section data */
  const support = t('apartments.all.support', { returnObjects: true }) as string[]
  const amenities = t('apartments.all.amenities', { returnObjects: true }) as string[]
  const categories = t('apartments.all.categories', { returnObjects: true }) as Array<{ h3: string; desc: string; btn: string }>
  const categoryHrefs = ['/apartments-for-rent/1-bedroom/', '/apartments-for-rent/2-bedroom/', '/apartments-for-rent/3-bedroom/']
  const consider = t('apartments.all.consider', { returnObjects: true }) as Array<{ h3: string; desc: string }>
  const areaItems = t('apartments.all.areas', { returnObjects: true }) as Array<{ h3: string; desc: string }>
  const areaHrefs = ['/areas/doha/', '/areas/al-sadd/', '/areas/bin-mahmoud/', '/areas/al-wakra/', '/areas/al-aziziya/', '/areas/old-airport/', '/areas/umm-salal/', '/areas/al-kharaitiyat/']
  const why = t('apartments.all.why', { returnObjects: true }) as Array<{ h3: string; desc: string }>
  const processSteps = t('apartments.all.processSteps', { returnObjects: true }) as Array<{ num: string; h3: string; desc: string }>
  const needs = t('apartments.all.needs', { returnObjects: true }) as Array<{ h3: string; desc: string }>
  const exploreLinks = t('apartments.all.exploreLinks', { returnObjects: true }) as string[]
  const exploreHrefs = ['/apartments-for-rent/1-bedroom/', '/apartments-for-rent/2-bedroom/', '/apartments-for-rent/3-bedroom/']
  const allFaqs = t('apartments.all.faqs', { returnObjects: true }) as Array<{ q: string; a: string }>
  usePageSchema([faqPageSchema(allFaqs)])

  return (
    <>
      {/* S1 — Hero */}
      <section className="bg-forest text-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <Reveal>
                <p className="text-lime text-xs font-bold uppercase tracking-widest mb-4">{t('apartments.all.eyebrow')}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                  {t('apartments.all.h1')}
                </h1>
              </Reveal>
              <Reveal delay={80}>
                <p className="text-lime text-lg max-w-2xl mb-4">
                  {t('apartments.all.subtitle')}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-white/70 text-base max-w-3xl mb-8 leading-relaxed">
                  {t('apartments.all.p')}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mb-8">
                  <a
                    href="#apartment-types"
                    className="inline-flex items-center justify-center bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-lime/90 transition-colors"
                  >
                    {t('apartments.all.primaryBtn')}
                  </a>
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white/15 border border-white/30 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/25 transition-colors backdrop-blur-sm"
                  >
                    {t('apartments.all.whatsappBtn')}
                  </a>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2">
                  {trust.map(tp => (
                    <span key={tp} className="flex items-start gap-2 text-white/60 text-sm max-w-xs">
                      <CheckCircle2 size={14} className="text-lime shrink-0 mt-0.5" />
                      {tp}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — hero image */}
            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="/apartments-for-rent-doha-qatar-dania-real-estate.webp"
                    alt="Verified residential apartments for rent in Doha Qatar managed by Dania Real Estate."
                    className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">
                  {t('apartments.all.badge')}
                </div>
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">
                  {t('common.zeroCommission')}
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* S2 — Apartment Rental Support in Qatar */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">{t('apartments.all.supportH2')}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {support.map((para, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="text-ink-muted leading-relaxed text-sm">{para}</p>
              </Reveal>
            ))}
          </div>

          {/* Core flat amenities icon strip */}
          {Array.isArray(amenities) && amenities.length > 0 && (
            <Reveal delay={120}>
              <div className="mt-10 flex flex-wrap gap-3">
                {amenities.map((label, i) => {
                  const Icon = AMENITY_ICONS[i] ?? CheckCircle2
                  return (
                    <div
                      key={label}
                      className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2"
                    >
                      <span className="w-7 h-7 bg-lime/15 rounded-full flex items-center justify-center text-forest shrink-0">
                        <Icon size={15} />
                      </span>
                      <span className="text-ink text-sm font-medium">{label}</span>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* S3 — Browse Apartment Rental Categories */}
      <section id="apartment-types" className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{t('apartments.all.categoriesH2')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {t('apartments.all.categoriesSubtitle')}
            </p>
          </Reveal>
          {/* Mobile: Pitch-style stacked deck */}
          <div className="lg:hidden max-w-md mx-auto">
            <StackedCards
              items={categories.map((card, i) => {
                const forest = i === 0
                return (
                  <div key={i} className={`rounded-3xl border p-6 min-h-[248px] flex flex-col shadow-xl shadow-forest/10 ${forest ? 'bg-forest border-forest' : 'bg-white border-border'}`}>
                    <h3 className={`font-bold text-xl mb-2 ${forest ? 'text-lime' : 'text-ink'}`}>{card.h3}</h3>
                    <p className={`text-sm leading-relaxed flex-1 mb-5 ${forest ? 'text-white/75' : 'text-ink-muted'}`}>{card.desc}</p>
                    <Link to={categoryHrefs[i]} className={`inline-flex items-center gap-1.5 font-semibold text-sm mt-auto ${forest ? 'text-lime' : 'text-forest'}`}>
                      {card.btn} <ArrowRight size={15} className="rtl:-scale-x-100" />
                    </Link>
                  </div>
                )
              })}
            />
          </div>
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((card, i) => (
              <Reveal key={card.h3} delay={i * 100}>
                <div className="bg-white border border-border rounded-2xl p-7 linear-card flex flex-col h-full">
                  <h3 className="font-bold text-xl text-ink mb-3">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
                  <Link
                    to={categoryHrefs[i]}
                    className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-full text-sm transition-colors bg-forest text-white hover:opacity-90"
                  >
                    {card.btn}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S4 — What to Consider */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{t('apartments.all.considerH2')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {t('apartments.all.considerSubtitle')}
            </p>
          </Reveal>
          {/* Mobile: Apple-style carousel */}
          <div className="lg:hidden">
            <CardCarousel
              items={consider.map((card, i) => (
                <div key={i} className="bg-white rounded-3xl border border-border p-7 h-full min-h-[224px] shadow-lg shadow-forest/5">
                  <div className="w-11 h-11 bg-lime rounded-xl flex items-center justify-center mb-5">
                    <CheckCircle2 size={18} className="text-forest" />
                  </div>
                  <h3 className="font-bold text-ink mb-2 text-lg">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            />
          </div>
          <div className="hidden lg:grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {consider.map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${i === 0 ? 'border-l-4 border-l-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S5 — Apartments by Key Area */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{t('apartments.all.areasH2')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {t('apartments.all.areasSubtitle')}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {areaItems.map((area, i) => (
              <Reveal key={area.h3} delay={i * 60}>
                <Link to={areaHrefs[i]} className="group relative flex flex-col gap-3 bg-white border border-border rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-2xl active:shadow-md hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 min-h-[190px] sm:min-h-[210px] lg:min-h-[220px]">
                  <div className="absolute inset-0 bg-forest translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out will-animate" />
                  <div className="relative z-10 inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-lime-dark text-white shadow-md shadow-lime/30 ring-1 ring-white/30 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-110 transition-transform duration-300 ease-out">
                    <LocationIcon size={19} />
                  </div>
                  <div className="relative z-10 flex flex-col flex-1 gap-1.5">
                    <h3 className="font-bold text-ink group-hover:text-white group-active:text-white text-sm leading-tight transition-colors duration-300">{area.h3}</h3>
                    <p className="text-ink-muted group-hover:text-white/70 group-active:text-white/70 text-xs leading-relaxed flex-1 transition-colors duration-300 line-clamp-3">{area.desc}</p>
                    <span className="inline-flex items-center gap-1 text-forest group-hover:text-lime group-active:text-lime font-semibold text-xs transition-colors duration-300">
                      {t('common.viewProperties')} <ArrowRight size={11} className="group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300 rtl:-scale-x-100" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S6 — Why Choose Dania Real Estate */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{t('apartments.all.whyH2')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {t('apartments.all.whySubtitle')}
            </p>
          </Reveal>
          {/* Mobile: Apple-style carousel */}
          <div className="lg:hidden">
            <CardCarousel
              items={why.map((card, i) => (
                <div key={i} className="bg-white rounded-3xl border border-border p-7 h-full min-h-[224px] shadow-lg shadow-forest/5">
                  <div className="w-11 h-11 bg-lime rounded-xl flex items-center justify-center mb-5">
                    <CheckCircle2 size={18} className="text-forest" />
                  </div>
                  <h3 className="font-bold text-ink mb-2 text-lg">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            />
          </div>
          <div className="hidden lg:grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {why.map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${i === 0 ? 'border-t-4 border-t-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S7 — How Our Apartment Rental Process Works */}
      <section className="py-20">
        <ProcessSteps
          title={t('apartments.all.processH2')}
          steps={processSteps}
        />
      </section>

      {/* S8 — Common Apartment Rental Needs */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">{t('apartments.all.needsH2')}</h2>
          </Reveal>
          {/* Mobile: Pitch-style stacked deck */}
          <div className="lg:hidden max-w-md mx-auto">
            <StackedCards
              items={needs.map((card, i) => {
                const forest = i === 0
                return (
                  <div key={i} className={`rounded-3xl border p-6 min-h-[248px] flex flex-col shadow-xl shadow-forest/10 ${forest ? 'bg-forest border-forest' : 'bg-white border-border'}`}>
                    <h3 className={`font-bold text-xl mb-2 ${forest ? 'text-lime' : 'text-ink'}`}>{card.h3}</h3>
                    <p className={`text-sm leading-relaxed flex-1 ${forest ? 'text-white/75' : 'text-ink-muted'}`}>{card.desc}</p>
                  </div>
                )
              })}
            />
          </div>
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
            {needs.map((card, i) => (
              <Reveal key={card.h3} delay={i * 100}>
                <div className={`bg-white border border-border rounded-2xl p-7 linear-card h-full ${i === 0 ? 'border-l-4 border-l-forest' : ''}`}>
                  <h3 className="font-bold text-xl text-ink mb-3">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S9 — Explore Apartment Options by Bedroom */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{t('apartments.all.exploreH2')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-8 max-w-2xl">
              {t('apartments.all.exploreSubtitle')}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex flex-wrap gap-3">
              {exploreLinks.map((label, i) => (
                <Link
                  key={exploreHrefs[i]}
                  to={exploreHrefs[i]}
                  className="inline-flex items-center justify-center bg-forest text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity"
                >
                  {label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S10 — FAQ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">{t('apartments.all.faqH2')}</h2>
          </Reveal>
          <FaqAccordion faqs={allFaqs} />
        </div>
      </section>

      {/* S11 — Final CTA */}
      <FinalCtaBanner
        h2={t('apartments.all.ctaH2')}
        para={t('apartments.all.ctaPara')}
        primaryLabel={t('apartments.all.ctaPrimary')}
        primaryHref={`https://wa.me/${company.whatsapp}`}
        secondaryLabel={t('apartments.all.ctaSecondary')}
        secondaryHref="/contact-us/"
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   FILTER = "1-bedroom"
══════════════════════════════════════════════════════════════════════════ */
function OneBedContent() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'


  const trust = t('apartments.oneBed.trust', { returnObjects: true }) as string[]

  const faqs = isAr ? [
    {
      q: 'ما المزايا الجوهرية لشقة غرفة نوم واحدة مقارنةً بالاستوديو في قطر؟',
      a: 'توفر شقة غرفة نوم واحدة (1-BHK) جدارًا فاصلًا حقيقيًا بين غرفة النوم الرئيسية ومناطق المعيشة أو الطعام، مما يمنح خصوصيةً أفضل ومطبخًا منعزلًا واستخدامًا أمثل للمساحة مقارنةً بالاستوديو المفتوح.',
    },
    {
      q: 'هل تتوفر شقق غرفة نوم واحدة مفروشة بالكامل للإيجار في الدوحة؟',
      a: 'نعم. تدير دانية للعقارات مجموعة متنوعة من شقق غرفة نوم واحدة، تشمل وحدات مفروشة بالكامل، وشبه مفروشة مجهزة بالأجهزة الكبرى، وأخرى غير مفروشة في مناطق الدوحة الرئيسية.',
    },
    {
      q: 'ما أفضل أحياء الدوحة للمهنيين الباحثين عن شقة BHK-1؟',
      a: 'للمهنيين التجاريين، تتميز أحياء السد وبن محمود بروابط مواصلات ممتازة وخدمات متكاملة. أما الراغبون في خيارات اقتصادية خارج المركز فيجدون في الوكرة والخريطيات تصاميم مساحات رائعة.',
    },
    {
      q: 'هل يمكنني الاطلاع على حالة شقة BHK-1 عبر مقطع مصور قبل حجز موعد زيارة؟',
      a: 'بالتأكيد. لتوفير وقتك وحمايتك من الإعلانات المضللة، يمكنك التواصل مع فريق الإيجار عبر واتساب لاستلام صور ومقاطع غير معدّلة للوحدات المتاحة.',
    },
    {
      q: 'هل يُشترط دفع تأمين عند استئجار شقة غرفة نوم واحدة عبر دانية للعقارات؟',
      a: 'نعم. تستلزم الإجراءات العقارية المعيارية في قطر دفع تأمين يعادل عادةً شهر إيجار، إلى جانب الشيكات المؤجلة، لإتمام عقد الإيجار المصدّق من البلدية.',
    },
  ] : [
    {
      q: 'What distinct advantages does a 1-bedroom apartment offer compared to a studio unit in Qatar?',
      a: 'A standard 1-bedroom apartment (1-BHK) provides structural wall separation between the master bedroom and the central living or dining areas. This layout provides superior privacy, isolated kitchen configurations, and better overall spatial utility than an open-concept studio.',
    },
    {
      q: 'Are fully furnished 1-bedroom apartments readily available for rent across Doha?',
      a: 'Yes. Dania Real Estate manages a diverse index of 1-bedroom flats encompassing fully furnished turnkey styles, semi-furnished units equipped with major appliances, and completely unfurnished spaces across key Doha areas.',
    },
    {
      q: 'Which Doha neighborhoods are best suited for single professionals seeking a 1-BHK flat?',
      a: 'For corporate professionals, districts like Al Sadd and Bin Mahmoud offer excellent transit links and amenities. For those seeking cost-effective or suburban options outside the city center, Al Wakra and Al Kharaitiyat provide excellent layout choices.',
    },
    {
      q: 'Can I verify the interior condition of a 1-bedroom flat via video before booking a visit?',
      a: 'Absolutely. To save you time and protect against misleading listings, you can connect with our active Al Rayyan Road leasing desk via WhatsApp to receive unedited media and photos of available units.',
    },
    {
      q: 'Is a security deposit required when leasing a 1-bedroom apartment through Dania Real Estate?',
      a: "Yes. Standard real estate procedures in Qatar require a security deposit—typically equivalent to one month's rent—alongside your post-dated cheques to secure a municipality-attested lease agreement.",
    },
  ]
  usePageSchema([faqPageSchema(faqs)])

  return (
    <>
      {/* S1 — Hero */}
      <section className="bg-forest text-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <Reveal direction="up">
                <p className="text-lime text-xs font-bold uppercase tracking-widest mb-4">{t('apartments.oneBed.eyebrow')}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                  {t('apartments.oneBed.h1')}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <h3 className="text-lime/90 text-lg mb-4 font-semibold leading-snug">
                  {t('apartments.oneBed.subtitle')}
                </h3>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/70 text-base mb-8 leading-relaxed">
                  {isAr
                    ? 'يتطلب إيجاد شقة غرفة نوم واحدة موثوقة في الدوحة تصفية الإعلانات القديمة وفهم خصائص المرافق في كل حي. تحتفظ دانية للعقارات بمخزون فعّال من الوحدات السكنية ذات غرفة نوم واحدة عبر قطاعات الأعمال والمناطق السكنية الرئيسية في قطر، متوافقةً مع ميزانيتك الدقيقة وموعد الانتقال.'
                    : 'Locating a verified 1 bedroom apartment for rent in Doha requires filtering out outdated listings and understanding specific district utility setups. Dania Real Estate maintains an active inventory of functional one-bedroom residential layouts across Qatar\'s premier business and residential sectors. Our property management experts cross-reference your specific target location, monthly rental budget, and furnishing preferences directly against vacant units, ensuring a fast and secure transition into your new space.'}
                </p>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mb-8">
                  <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity">
                    {t('apartments.oneBed.primaryBtn')}
                  </a>
                  <Link to="/contact-us/"
                    className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/20 transition-colors">
                    {t('apartments.oneBed.secondaryBtn')}
                  </Link>
                </div>
              </Reveal>
              <Reveal direction="up" delay={320}>
                <div className="flex flex-col gap-2.5">
                  {trust.map(tp => (
                    <span key={tp} className="flex items-start gap-2.5 text-white/70 text-sm">
                      <CheckCircle2 size={15} className="text-lime shrink-0 mt-0.5" />
                      {tp}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — 1-bedroom flat photo */}
            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="/1-bedroom-apartments-for-rent-doha-qatar.webp"
                    alt="Verified 1 bedroom apartments for rent in Doha Qatar managed by Dania Real Estate."
                    className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">
                  {t('apartments.oneBed.badge')}
                </div>
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">
                  {t('common.zeroCommission')}
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* S2 — Who This Page Is For */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'لمن هذه الصفحة — شقق غرفة نوم واحدة' : 'Who This 1 Bedroom Apartment Page Is For'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(isAr ? [
              'توفر دانية للعقارات خيارات شقق غرفة نوم واحدة للمهنيين العاملين والمديرين التنفيذيين والأزواج الباحثين عن مساحة مستقلة وميسورة التكلفة.',
              'تشمل قوائمنا وحدات مفروشة وشبه مفروشة وغير مفروشة عبر مناطق الدوحة الرئيسية.',
            ] : [
              'This specialized database is designed for tenants searching exclusively for independent one-bedroom apartment units within Qatar\'s municipal borders. Unlike studios or shared partition spaces, a standard 1-BHK layout delivers dedicated structural separation between your sleeping quarters and active living areas, making it the premier choice for corporate employees, medical staff, and young married couples.',
              "If your objective involves comparing localized monthly rents, evaluating independent building amenities, or validating Kahramaa meter configurations across various Doha neighborhoods, our real estate framework provides the direct guidance needed to finalize your tenancy safely.",
            ]).map((para, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="text-ink-muted leading-relaxed text-sm">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S3 — What to Consider */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'ما يجب مراعاته عند استئجار شقة بغرفة نوم واحدة' : 'What to Consider When Renting a 1 Bedroom Apartment'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'قبل الالتزام بعقد إيجار طويل الأمد لغرفة نوم واحدة، يساعدك تقييم التفاصيل الهيكلية ونقاط الاندماج المجتمعي على حماية راحتك اليومية.'
                : 'Prior to committing to a long-term 1-bedroom lease, evaluating structural details and community integration points helps protect your daily comfort.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'تصميم الوحدة والخصوصية', desc: 'استمتع بغرفة نوم مستقلة تمامًا وصالة معيشة منفصلة ومطبخ خاص يمنحك مزايا مكانية واضحة مقارنةً بصيغ الاستوديو الأساسية.', accent: true },
              { h3: 'الميزانية وتوافق المرافق', desc: 'نوائم معايير بحثك مع مستويات الأسعار الدقيقة في السوق، مع مراعاة ما إذا كانت الوحدات تتضمن برامج مرافق شاملة أو فواتير منفصلة.', accent: false },
              { h3: 'كفاءة التنقل من المنطقة', desc: 'تبرز محفظتنا خيارات BHK-1 القريبة من خطوط المترو الرئيسية ومراكز الأعمال والمجمعات التجارية والطرق السريعة الكبرى.', accent: false },
              { h3: 'خيارات التأثيث', desc: 'اختر بين وحدات غرفة نوم واحدة مفروشة بالكامل للانتقال الفوري، أو وحدات غير مفروشة مهيأة لإضافة أثاثك الشخصي.', accent: false },
            ] : [
              { h3: 'Structural Layout & Privacy', desc: 'Enjoy completely separate bedroom, standalone living room, and private kitchen configurations that offer distinct spatial advantages over basic studio formats.', accent: true },
              { h3: 'Budget & Utility Alignment', desc: 'We align your search parameters with market-accurate pricing tiers, factoring in whether units feature all-inclusive utility programs or standard billing.', accent: false },
              { h3: 'District Commute Efficiency', desc: 'Our portfolio highlights 1-BHK options positioned close to key metro lines, central business offices, supermarkets, and major highways.', accent: false },
              { h3: 'Furnishing Matrix Selections', desc: 'Choose between turnkey fully furnished 1-bedroom setups for rapid move-ins or unfurnished shells optimized for personal furniture configurations.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${card.accent ? 'border-t-4 border-t-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S4 — 1 Bedroom Apartments by Area */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'شقق غرفة نوم واحدة في الدوحة والمناطق الرئيسية' : '1 Bedroom Apartments in Doha and Key Qatar Areas'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {isAr
                ? 'تختلف تشطيبات التصميم الداخلي وحدود مواقف السيارات والأسعار الشهرية الأساسية لوحدات BHK-1 باختلاف المناطق. تدير دانية للعقارات عقارات فعّالة في هذه المناطق الرئيسية:'
                : 'Interior layout finishes, building parking limits, and monthly rental baselines for 1-BHK units differ across municipalities. Dania Real Estate manages active properties across these essential local hubs:'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'شقق غرفة نوم واحدة في الدوحة', desc: 'خيارات شقق تنفيذية في قلب الدوحة والممرات السكنية في الدفنة والهلال والمعمورة.', href: '/areas/doha/' },
              { h3: 'شقق غرفة نوم واحدة في السد', desc: 'وحدات BHK-1 حضرية عالية الكثافة في القلب التجاري والترفيهي المركزي للدوحة.', href: '/areas/al-sadd/' },
              { h3: 'إيجارات غرفة نوم واحدة في بن محمود', desc: 'مبانٍ سكنية داخل المدينة مناسبة للمهنيين الذين يحتاجون وصولًا سريعًا إلى العيادات والمكاتب والطرق الرئيسية.', href: '/areas/bin-mahmoud/' },
              { h3: 'شقق غرفة نوم واحدة في الوكرة', desc: 'تصاميم شقق ساحلية هادئة وميسورة التكلفة بعيدًا عن ازدحام المدينة المركزية.', href: '/areas/al-wakra/' },
              { h3: 'إيجارات غرفة نوم واحدة في العزيزية وأبو هامور', desc: 'مساحات سكنية متصلة جيدًا في أحياء راسخة صديقة للأسرة.', href: '/areas/al-aziziya/' },
              { h3: 'شقق غرفة نوم واحدة في المطار القديم', desc: 'تصاميم شقق اقتصادية وسهلة الوصول تتيح تنقلًا سريعًا إلى مناطق المدينة التاريخية.', href: '/areas/old-airport/' },
              { h3: 'إيجارات غرفة نوم واحدة في أم صلال', desc: 'خيارات سكنية ضاحوية شمالية ناشئة في أم صلال محمد والتطويرات المحيطة.', href: '/areas/umm-salal/' },
              { h3: 'إيجارات غرفة نوم واحدة في الخريطيات', desc: 'مبانٍ سكنية هادئة ومنخفضة الحركة للأفراد الذين يُفضّلون أسلوب الحياة الضاحوي الهادئ.', href: '/areas/al-kharaitiyat/' },
            ] : [
              { h3: '1 Bedroom Apartments in Doha', desc: 'Executive flat options inside Central Doha, the high-rise corridors of Al Dafna, Al Hilal, and Al Mamoura residential zones.', href: '/areas/doha/' },
              { h3: '1 Bedroom Apartments in Al Sadd', desc: 'High-density urban 1-BHK units located inside the retail, dining, and central commercial heart of Doha.', href: '/areas/al-sadd/' },
              { h3: '1 Bedroom Rentals in Bin Mahmoud', desc: 'Strategic inner-city apartment blocks tailored for corporate professionals requiring fast access to clinics, offices, and main roads.', href: '/areas/bin-mahmoud/' },
              { h3: '1 Bedroom Apartments in Al Wakra', desc: 'Peaceful, highly cost-effective coastal 1-bedroom flat configurations positioned outside central city congestions.', href: '/areas/al-wakra/' },
              { h3: '1 Bedroom Rentals in Al Aziziya & Abu Hamour', desc: 'Well-connected residential spaces located inside established, family-friendly neighborhoods.', href: '/areas/al-aziziya/' },
              { h3: '1 Bedroom Apartments in Old Airport', desc: 'Budget-friendly, highly accessible apartment layouts offering quick commutes to historical city center points.', href: '/areas/old-airport/' },
              { h3: '1 Bedroom Rentals in Umm Salal', desc: 'Emerging northern suburban 1-bedroom housing choices spanning Umm Salal Mohammed and surrounding developments.', href: '/areas/umm-salal/' },
              { h3: '1 Bedroom Rentals in Al Kharaitiyat', desc: 'Quiet, low-traffic residential flat structures catering to individuals prioritizing a serene suburban lifestyle.', href: '/areas/al-kharaitiyat/' },
            ]).map((area, i) => (
              <Reveal key={area.h3} delay={i * 60}>
                <div className="bg-white border border-border rounded-2xl p-6 linear-card h-full flex flex-col">
                  <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                  <p className="text-ink-muted text-xs leading-relaxed mb-4 flex-1">{area.desc}</p>
                  <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                    {t('common.viewProperties')}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S5 — Why Choose Dania Real Estate for Your 1-BHK Search */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'لماذا تختار دانية للعقارات للبحث عن شقة بغرفة نوم واحدة' : 'Why Choose Dania Real Estate for Your 1-BHK Search'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'يتطلب إيجاد شقة غرفة نوم واحدة متميزة معرفة عميقة بالأحياء وتنفيذًا عمليًا سريعًا.'
                : 'Finding a premium 1-bedroom flat requires deep neighborhood insights and fast operational execution.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'تحليلات BHK-1 المستهدفة', desc: 'نتجاوز الفئات العقارية غير ذات الصلة للعثور على مخططات الطابق الدقيقة المكوّنة من غرفة نوم واحدة والمناسبة لأسلوب حياتك.', accent: true },
              { h3: 'إشراف محلي عميق على الأحياء', desc: 'تضمن معرفتنا المحلية إطلاعك على توافر مواقف السيارات وأنماط حركة المرور والخدمات القريبة قبل التوقيع.', accent: false },
              { h3: 'التحقق الفوري من المخزون', desc: 'تجنّب قوائم السوق المسدودة. تواصل مباشرةً عبر واتساب لمشاهدة الوحدات الشاغرة مع تأكيدات حالة فورية.', accent: false },
              { h3: 'تنسيق جولات المشاهدة', desc: 'تفقّد الوحدات التي اخترتها بصحبة متخصص عقاري مخصص يجيب على جميع الأسئلة القانونية والهيكلية في الموقع.', accent: false },
            ] : [
              { h3: 'Targeted 1-BHK Analytics', desc: 'We bypass irrelevant property categories to isolate exact one-bedroom floor plans that fit your exact living profile.', accent: true },
              { h3: 'Deep Neighborhood Oversight', desc: 'Our localized knowledge ensures you understand community parking availability, traffic patterns, and nearby services before signing.', accent: false },
              { h3: 'Real-Time Inventory Checks', desc: 'Avoid dead-end marketplace listings. Connect directly via WhatsApp to view active, vacant units with real-time status confirmations.', accent: false },
              { h3: 'Guided Viewing Coordination', desc: 'Walk through your chosen units alongside a dedicated property professional who can answer all legal and structural questions on-site.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${card.accent ? 'border-t-4 border-t-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S6 — How the 1 Bedroom Apartment Inquiry Process Works */}
      <section className="py-20">
        <ProcessSteps
          title={isAr ? 'كيف تعمل عملية الاستئجار لدينا' : 'How the 1 Bedroom Apartment Inquiry Process Works'}
          steps={isAr ? [
            { num: '01', h3: 'أرسل معايير المساحة المستهدفة', desc: 'شارك فريقنا بالمنطقة السكنية المفضلة وحدود الإيجار الشهري وموعد الانتقال وتفضيلاتك في التأثيث.' },
            { num: '02', h3: 'مطابقة المحفظة المخصصة', desc: 'يتحقق مكتب الإيجار لدينا من مخزون غرف النوم الواحدة الشاغر والفعّال للعثور على الوحدات المطابقة لمعاييرك.' },
            { num: '03', h3: 'مراجعة الوسائط الحية والشروط', desc: 'استلم تفاصيل هيكلية واضحة وصورًا حديثة غير معدّلة ومصفوفات تسعير واضحة عبر قنوات الاتصال المباشرة.' },
            { num: '04', h3: 'تأكيد الجولات الميدانية', desc: 'جدوِل جولة مصحوبة للمساحة الفعلية للتحقق من معايير المخطط قبل إتمام عقدك البلدي.' },
          ] : [
            { num: '01', h3: 'Submit Your Target Space Parameters', desc: 'Share your preferred residential sector, monthly rent limits, move-in timeline, and furnishing preferences with our team.' },
            { num: '02', h3: 'Custom Portfolio Matching', desc: 'Our leasing desks cross-examine active, unleased 1-bedroom inventories to identify units matching your criteria.' },
            { num: '03', h3: 'Review Live Media & Terms', desc: 'Receive clear structural details, recent unedited photographic assets, and clear pricing matrices through direct mobile channels.' },
            { num: '04', h3: 'Confirm On-Site Inspections', desc: 'Schedule an accompanied walkthrough of the physical space to confirm layout parameters before finalizing your municipal contract.' },
          ]}
        />
      </section>

      {/* S7 — Common 1 Bedroom Apartment Needs */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'الاحتياجات الشائعة لاستئجار شقق بغرفة نوم واحدة' : 'Common 1 Bedroom Apartment Needs We Support'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(isAr ? [
              { h3: 'تصاميم BHK-1 للمهنيين في الشركات', desc: 'مساحات سكنية حديثة وسهلة الصيانة مُحسَّنة للأفراد العاملين في أبراج المكاتب التجارية الرئيسية بالدوحة.', accent: true },
              { h3: 'شقق غرفة نوم واحدة آمنة للأزواج', desc: 'تصاميم سكنية مريحة توفر مناطق طعام وطهي ونوم منفصلة مناسبة للأسر الصغيرة.', accent: false },
              { h3: 'خيارات سكنية موفّرة للتكاليف', desc: 'اختيارات شقق موفرة للتكاليف تمنح خصوصية مستقلة مع الحفاظ على أهدافك المالية الشخصية.', accent: false },
            ] : [
              { h3: '1-BHK Layouts for Corporate Professionals', desc: "Modern, low-maintenance residential spaces optimized for individuals working inside Doha's primary commercial office towers.", accent: true },
              { h3: 'Secure 1 Bedroom Spaces for Couples', desc: 'Comfortable residential designs offering separate dining, cooking, and sleeping zones suitable for small households.', accent: false },
              { h3: 'Budget-Conscious Residential Selections', desc: 'Cost-efficient apartment selections engineered to deliver independent privacy while remaining aligned with specific personal savings targets.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 100}>
                <div className={`bg-white border border-border rounded-2xl p-7 linear-card h-full ${card.accent ? 'border-l-4 border-l-forest' : ''}`}>
                  <h3 className="font-bold text-xl text-ink mb-3">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S8 — Need a Different Apartment Size? */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'هل تحتاج إلى حجم مختلف؟' : 'Need a Different Apartment Size?'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-8 max-w-2xl">
              {isAr
                ? 'إذا كان تصميم غرفة نوم واحدة القياسي لا يلبي احتياجاتك المكانية بالكامل، استكشف بدائلنا السكنية الموثوقة أدناه:'
                : 'If a standard 1-bedroom configuration does not fully accommodate your spatial needs, explore our alternative verified residential silos below:'}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex flex-col sm:flex-row gap-4">
              {(isAr ? [
                { label: 'شقق غرفتي نوم للإيجار', sub: 'مُحسَّنة للأسر المتنامية التي تحتاج مساحة عمل إضافية أو غرفة عائلية.', href: '/apartments-for-rent/2-bedroom/' },
                { label: 'شقق ثلاث غرف نوم للإيجار', sub: 'شقق واسعة النطاق توفر مخططات طوابق فسيحة للعائلات الممتدة.', href: '/apartments-for-rent/3-bedroom/' },
                { label: 'شقق للإيجار', sub: 'العودة إلى صفحة الفهرس السكني الرئيسية لمراجعة جميع عروض المحفظة العامة.', href: '/apartments-for-rent/' },
              ] : [
                { label: '2 Bedroom Apartments for Rent', sub: 'Optimized for growing households requiring extra workspace or family room.', href: '/apartments-for-rent/2-bedroom/' },
                { label: '3 Bedroom Apartments for Rent', sub: 'Large-scale flats offering expansive floor plans for extended families.', href: '/apartments-for-rent/3-bedroom/' },
                { label: 'Apartments for Rent', sub: 'Return to our master residential index page to review all broad portfolio offerings.', href: '/apartments-for-rent/' },
              ]).map((link, i) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex-1 rounded-2xl p-6 border border-border bg-white linear-card ${i === 0 ? 'border-t-4 border-t-forest' : ''}`}
                >
                  <p className="font-bold text-forest text-sm mb-1">{link.label}</p>
                  <p className="text-ink-muted text-xs leading-relaxed">{link.sub}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S9 — FAQ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'الأسئلة الشائعة — إيجار شقة غرفة نوم واحدة' : '1 Bedroom Apartment Rental FAQs'}
            </h2>
          </Reveal>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* S10 — Final CTA */}
      <FinalCtaBanner
        h2={t('apartments.oneBed.ctaH2')}
        para={isAr
          ? 'توقف عن تصفح الإعلانات المكررة والقديمة. تواصل مع محترفي الإيجار في دانية للعقارات اليوم.'
          : 'Stop scrolling through repetitive, outdated online classifieds. Connect directly with the property management professionals at Dania Real Estate today. Share your desired location, move-in timeline, and budget limits to receive a verified list of active 1-BHK options.'}
        primaryLabel={t('apartments.oneBed.ctaPrimary')}
        primaryHref={`https://wa.me/${company.whatsapp}`}
        secondaryLabel={t('apartments.oneBed.ctaSecondary')}
        secondaryHref="/contact-us/"
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   FILTER = "2-bedroom"
══════════════════════════════════════════════════════════════════════════ */
function TwoBedContent() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'


  const trust = t('apartments.twoBed.trust', { returnObjects: true }) as string[]

  const faqs = isAr ? [
    {
      q: 'ما المزايا المكانية المحددة التي تقدمها شقة غرفتي نوم مقارنةً بتصميم BHK-1؟',
      a: 'تضيف شقة غرفتي نوم (2-BHK) القياسية غرفة نوم ثانية مستقلة وغالبًا تصميم حمام ثانٍ، مما يوفر العمق المكاني الجوهري اللازم لاستيعاب الأسر النووية أو الضيوف أو مساحة عمل منزلية مخصصة بكل راحة.',
    },
    {
      q: 'هل يمكنني استئجار شقة غرفتي نوم غير مفروشة وتركيب أجهزتي الشخصية؟',
      a: 'نعم، بالكامل. يتميز مخزوننا المتنوع من BHK-2 بوحدات غير مفروشة مثالية للتصميم المخصص، ونماذج شبه مفروشة مجهزة بأجهزة المطبخ الرئيسية، وشقق عائلية مفروشة بالكامل جاهزة للانتقال الفوري.',
    },
    {
      q: 'كيف يمكنني التحقق من وجود موقف سيارات مخصص للسكان في وحدة غرفتي نوم متاحة؟',
      a: 'تختلف قواعد المواقف حسب المبنى السكني. عند مشاركة متخصصي العقارات لدينا قائمةً منسّقة تناسب احتياجاتك، سيوضحون صراحةً ما إذا كانت الوحدة تتميز بموقف داخلي مخصص أو أماكن شارع مظللة أو مواقف سطحية مفتوحة.',
    },
    {
      q: 'هل تقدم دانية للعقارات مقاطع جولة داخلية غير معدّلة لشقق غرفتي نوم؟',
      a: 'نعم. لحمايتك من الإعلانات السوقية المضللة، يمكننا توفير صور غير معدّلة ومخططات طوابق تفصيلية ووسائط جولة مباشرةً عبر قنوات دعم واتساب الفعّالة.',
    },
    {
      q: 'ما المدة القياسية لعقد إيجار الشقة العائلية في قطر؟',
      a: 'تتبع أطر عقود الإيجار السكنية القياسية في الدوحة والبلديات المجاورة عادةً نموذج عقد سنوي قابل للتجديد لمدة 12 شهرًا، مدعومًا بشيكات مؤجلة مقابلة وتأمين لشهر واحد.',
    },
  ] : [
    {
      q: 'What specific spatial advantages does a 2-bedroom apartment offer over a 1-BHK layout?',
      a: 'A standard 2-bedroom apartment (2-BHK) introduces a secondary independent bedroom and frequently a secondary bathroom layout. This configuration provides the essential spatial depth required to accommodate nuclear family structures, overnight guests, or a dedicated home workspace comfortably.',
    },
    {
      q: 'Can I rent an unfurnished 2-bedroom apartment and install personal appliances?',
      a: 'Yes, completely. Our diverse 2-BHK inventory features unfurnished shells perfect for custom styling, semi-furnished models equipped with key kitchen appliances, and turnkey fully furnished family apartments ready for immediate move-in.',
    },
    {
      q: 'How can I verify if an available 2-bedroom unit includes dedicated resident parking?',
      a: 'Parking rules vary by residential building. When our property specialists share a curated listing matching your needs, they will explicitly detail whether the unit features dedicated basement parking, shaded street bays, or open surface lots.',
    },
    {
      q: 'Does Dania Real Estate provide unedited interior walk-through videos of 2-bedroom apartments?',
      a: 'Yes. To protect you from misleading marketplace advertisements, we can supply unedited photos, detailed interior floor plans, and walk-through media directly via our active WhatsApp support channels.',
    },
    {
      q: 'What is the standard duration for a family apartment lease agreement in Qatar?',
      a: 'Standard residential lease frameworks across Doha and nearby municipalities typically follow a 12-month renewable contract template, backed by matching post-dated cheques and a single-month security deposit.',
    },
  ]
  usePageSchema([faqPageSchema(faqs)])

  return (
    <>
      {/* S1 — Hero */}
      <section className="bg-forest text-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <Reveal direction="up">
                <p className="text-lime text-xs font-bold uppercase tracking-widest mb-4">{t('apartments.twoBed.eyebrow')}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                  {t('apartments.twoBed.h1')}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-lime/90 text-lg mb-4 font-semibold leading-snug">
                  {t('apartments.twoBed.subtitle')}
                </p>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/70 text-base mb-8 leading-relaxed">
                  {isAr
                    ? 'يستلزم الحصول على شقة غرفتي نوم موثوقة للإيجار في الدوحة تحديد متطلبات المساحة ومقارنتها بمرافق الأحياء ومستويات الأسعار. تدير دانية للعقارات مخزونًا فعّالًا من تصاميم BHK-2 السكنية العملية — سواء احتجت إلى شقة عائلية بمطبخ مغلق أو تصميم مزدوج رئيسي للسكن المشترك، يطابق خبراؤنا ميزانيتك مباشرةً مع الشواغر الفعلية.'
                    : 'Sourcing a verified 2 bedroom apartment for rent in Doha involves mapping floor space requirements against specific neighborhood amenities and pricing tiers. Dania Real Estate manages an active inventory of practical 2-BHK residential layouts tailored to bridge the gap between compact flats and large independent homes. Whether you require a closed-kitchen configuration for family privacy or a dual-master layout for shared professional residency, our property management experts match your budget directly against active inventory to secure a smooth transition.'}
                </p>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mb-8">
                  <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity">
                    {t('apartments.twoBed.primaryBtn')}
                  </a>
                  <Link to="/contact-us/"
                    className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/20 transition-colors">
                    {t('apartments.twoBed.secondaryBtn')}
                  </Link>
                </div>
              </Reveal>
              <Reveal direction="up" delay={320}>
                <div className="flex flex-col gap-2.5">
                  {trust.map(tp => (
                    <span key={tp} className="flex items-start gap-2.5 text-white/70 text-sm">
                      <CheckCircle2 size={15} className="text-lime shrink-0 mt-0.5" />
                      {tp}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — contemporary family living room photo */}
            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="/2-bedroom-apartments-for-rent-doha-qatar.webp"
                    alt="Verified 2 bedroom apartments for rent in Doha Qatar managed by Dania Real Estate."
                    className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">
                  {t('apartments.twoBed.badge')}
                </div>
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">
                  {t('common.zeroCommission')}
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* S2 — Who This Page Is For */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'لمن هذه الصفحة — شقق غرفتي نوم' : 'Who This 2 Bedroom Apartment Page Is For'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(isAr ? [
              'يستهدف هذا الكتالوج المخصص المستأجرين الذين يحتاجون شقق غرفتي نوم مستقلتين داخل المناطق السكنية الرئيسية في قطر. يوفر تصميم BHK-2 المرونة المكانية اللازمة للأسر الصغيرة والعائلات النووية المتنامية أو الأزواج الذين يحتاجون مساحة عمل معزولة أو غرف ضيوف دون تكاليف فيلا كبيرة.',
              'يخدم هذا الإطار أيضًا المهنيين في الشركات والمستأجرين التنفيذيين المزدوجين الراغبين في تقاسم تكاليف الإيجار بشكل مريح. إذا كنت توازن بين الإيجارات الشهرية ومعايير كمواقف السيارات أو قرب المدارس أو أرصدة كهرماء، فإن فريقنا يوفر الإشراف المحلي اللازم لإتمام بحثك بأمان.',
            ] : [
              "This dedicated catalog is engineered explicitly for tenants requiring independent two-bedroom apartment rentals within Qatar's core residential districts. A standard 2-BHK layout provides the necessary spatial flexibility to support small households, expanding nuclear families, or young married couples needing isolated workspace or guest rooms without committing to the overhead of a large villa.",
              "Additionally, this framework serves corporate professionals and dual-executive tenants seeking to share tenancy costs comfortably. If you are actively balancing monthly rents against parameters like designated residential parking space, nearby school access, or Kahramaa utility balances, our team delivers the localized oversight needed to finalize your search safely.",
            ]).map((para, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="text-ink-muted leading-relaxed text-sm">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S3 — What to Consider */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'ما يجب مراعاته عند استئجار شقة بغرفتي نوم' : 'What to Consider When Renting a 2 Bedroom Apartment'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'تقييم الفائدة طويلة الأمد لتصميم شقة غرفتي نوم قبل إبرام عقد الإيجار يحمي تفضيلات أسلوب حياتك والتزاماتك المالية.'
                : 'Evaluating the long-term utility of a 2-bedroom flat layout before entering a lease protects your lifestyle preferences and financial commitments.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'المساحة والمرونة الغرفية', desc: 'عظّم استخدام المنزل بغرف نوم رئيسية منفصلة ومساحات ضيوف مخصصة أو مساحات عمل منزلية مستقلة ضمن مخططات BHK-2 المتوازنة.', accent: true },
              { h3: 'البنية التحتية الملائمة للأسرة', desc: 'نُولي الأولوية للعقارات الواقعة داخل مجمعات سكنية توفر وصولًا سريعًا للمدارس الدولية والعيادات الصحية والمجمعات التجارية الكبرى.', accent: false },
              { h3: 'الرياضيات الإيجارية وتوافق الميزانية', desc: 'طابق حدود إنفاقك المستهدفة مع منحنيات التسعير الدقيقة للمنطقة للعثور على التوازن المثالي لأسرتك.', accent: false },
              { h3: 'التأثيث والتصاميم الداخلية', desc: 'حدد تصميمات المطبخ المغلق والملامح متعددة الحمامات والتهيئات المفروشة وشبه المفروشة المناسبة لأسلوب حياتك.', accent: false },
            ] : [
              { h3: 'Spatial Sizing & Room Flexibility', desc: 'Maximize household utility with separate master bedrooms, dedicated guest quarters, or independent home-office spaces configured within balanced 2-BHK frames.', accent: true },
              { h3: 'Family-Friendly Infrastructure', desc: 'We prioritize properties situated inside residential complexes offering rapid access to international schools, health clinics, and essential supermarkets.', accent: false },
              { h3: 'Rental Math & Budget Alignment', desc: 'Match your target spending thresholds directly against district-accurate pricing curves to find your ideal household balance.', accent: false },
              { h3: 'Furnishing & Interior Layouts', desc: 'Identify closed-kitchen variations, multi-bathroom profiles, and fully furnished versus semi-furnished configurations that align with your lifestyle.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${card.accent ? 'border-t-4 border-t-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S4 — 2 Bedroom Apartments by Area */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'شقق غرفتي نوم في الدوحة والمناطق الرئيسية' : '2 Bedroom Apartments in Doha and Key Qatar Areas'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {isAr
                ? 'تتباين التشطيبات المعمارية وتخصيصات مواقف السيارات وشروط الإيجار الأساسية لوحدات غرفتي نوم بحسب قطاعاتها البلدية. تقدم دانية للعقارات إشرافًا عقاريًا محليًا في هذه المواقع الرئيسية:'
                : 'Architectural finishes, parking space allocations, and baseline lease terms for 2-bedroom units naturally correspond with their municipal sectors. Dania Real Estate provides localized property oversight across these core locations:'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'شقق غرفتي نوم في الدوحة', desc: 'تصميمات شقق عائلية متوازنة في قلب الدوحة وخيارات الأبراج في الدفنة والهلال والمعمورة.', href: '/areas/doha/' },
              { h3: 'شقق غرفتي نوم في السد', desc: 'إيجارات BHK-2 حضرية عالية الكثافة ضمن ممرات التجزئة والمطاعم والمكاتب التجارية المركزية الرائدة في الدوحة.', href: '/areas/al-sadd/' },
              { h3: 'إيجارات غرفتي نوم في بن محمود', desc: 'مبانٍ سكنية داخل المدينة مُحسَّنة للمهنيين الذين يتطلبون وصولًا سريعًا للطرق السريعة والعيادات والمدارس.', href: '/areas/bin-mahmoud/' },
              { h3: 'شقق غرفتي نوم في الوكرة', desc: 'تصاميم شقق ساحلية هادئة وميسورة التكلفة للعائلات الباحثة عن مساحة خارج المركز.', href: '/areas/al-wakra/' },
              { h3: 'إيجارات غرفتي نوم في العزيزية وأبو هامور', desc: 'مجمعات سكنية متكاملة قريبة من الحدائق العائلية والمراكز التجارية الكبرى.', href: '/areas/al-aziziya/' },
              { h3: 'شقق غرفتي نوم في المطار القديم', desc: 'شقق سهلة الوصول وميسورة التكلفة مع تنقل مريح إلى المعالم التاريخية للمدينة.', href: '/areas/old-airport/' },
              { h3: 'إيجارات غرفتي نوم في أم صلال', desc: 'خيارات شقق سكنية شمالية متوسعة تشمل مجتمعات أم صلال محمد وأم صلال علي والمناطق المحيطة.', href: '/areas/umm-salal/' },
              { h3: 'إيجارات غرفتي نوم في الخريطيات', desc: 'خيارات شقق ضاحوية هادئة ومنخفضة الكثافة للأفراد الباحثين عن بيئة مجتمعية هادئة.', href: '/areas/al-kharaitiyat/' },
            ] : [
              { h3: '2 Bedroom Apartments in Doha', desc: 'Balanced family flat configurations located inside Central Doha, high-rise options in Al Dafna, Al Hilal, and Al Mamoura residential loops.', href: '/areas/doha/' },
              { h3: '2 Bedroom Apartments in Al Sadd', desc: "High-density urban 2-BHK rentals situated within Doha's premier retail, dining, and central commercial corridors.", href: '/areas/al-sadd/' },
              { h3: '2 Bedroom Rentals in Bin Mahmoud', desc: 'Strategic inner-city apartment buildings optimized for professionals demanding rapid highway access and proximity to clinics and schools.', href: '/areas/bin-mahmoud/' },
              { h3: '2 Bedroom Apartments in Al Wakra', desc: 'Highly serene, cost-effective coastal 2-bedroom flat layouts catering to families looking for space outside the central city center.', href: '/areas/al-wakra/' },
              { h3: '2 Bedroom Rentals in Al Aziziya & Abu Hamour', desc: 'Well-integrated residential apartment complexes positioned near family-focused parks and prominent commercial trading centers.', href: '/areas/al-aziziya/' },
              { h3: '2 Bedroom Apartments in Old Airport', desc: 'Highly accessible and budget-friendly apartment spaces offering convenient commutes to historical city spots and transportation paths.', href: '/areas/old-airport/' },
              { h3: '2 Bedroom Rentals in Umm Salal', desc: 'Expanding northern residential flat options covering the communities of Umm Salal Mohammed, Umm Salal Ali, and surrounding zones.', href: '/areas/umm-salal/' },
              { h3: '2 Bedroom Rentals in Al Kharaitiyat', desc: 'Peaceful, low-density suburban apartment selections tailored for individuals seeking a quiet community setup.', href: '/areas/al-kharaitiyat/' },
            ]).map((area, i) => (
              <Reveal key={area.h3} delay={i * 60}>
                <div className="bg-white border border-border rounded-2xl p-6 linear-card h-full flex flex-col">
                  <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                  <p className="text-ink-muted text-xs leading-relaxed mb-4 flex-1">{area.desc}</p>
                  <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                    {t('common.viewProperties')}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S5 — Why Choose Dania for 2-BHK */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'لماذا تختار دانية للعقارات للبحث عن شقة بغرفتي نوم' : 'Why Choose Dania Real Estate for Your 2-BHK Search'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'يستلزم إيجاد شقة غرفتي نوم متميزة تقييم المساحة ولوائح الحي وتوافر المخزون الفعلي.'
                : 'Finding a premium 2-bedroom flat requires evaluating space, neighborhood regulations, and real-time inventory availability.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'مطابقة مستهدفة لغرفتي نوم', desc: 'نتجاوز النطاقات العقارية غير ذات الصلة لاستخراج ملامح غرفتي نوم الدقيقة التي توازن مساحتك وميزانيتك.', accent: true },
              { h3: 'مقاييس الأحياء الموثّقة', desc: 'تضمن رؤيتنا المحلية فهمك لقواعد مواقف سيارات المجمع ومعايير أمان المباني ومسارات العقود البلدية بوضوح.', accent: false },
              { h3: 'إدارة الشواغر الفعّالة', desc: 'تجنب القوائم المكررة أو الوهمية. تواصل مباشرةً عبر واتساب للحصول على ملفات وسائط غير معدّلة للوحدات الشاغرة فورًا.', accent: false },
              { h3: 'جولات مصحوبة للعقارات', desc: 'جوّل مساحاتك المستهدفة بصحبة متخصص إيجار متفرغ يجيب على جميع الأسئلة الهيكلية والقانونية في الموقع.', accent: false },
            ] : [
              { h3: 'Targeted 2-Bedroom Matching', desc: 'We bypass irrelevant property scales to pull exact two-bedroom profiles that balance your space and budget preferences perfectly.', accent: true },
              { h3: 'Verified Neighborhood Metrics', desc: 'Our localized insights ensure you understand specific complex parking rules, building safety metrics, and municipal contract paths clearly.', accent: false },
              { h3: 'Active Vacancy Management', desc: 'Eliminate duplicate or phantom listings. Connect directly via WhatsApp to receive unedited media files of vacant units instantly.', accent: false },
              { h3: 'Accompanied Property Walkthroughs', desc: 'Tour your target spaces alongside a dedicated leasing professional who answers all structural and legal questions on-site.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${card.accent ? 'border-t-4 border-t-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S6 — Inquiry Process */}
      <section className="py-20">
        <ProcessSteps
          title={isAr ? 'كيف تعمل عملية الاستئجار لدينا' : 'How the 2 Bedroom Apartment Inquiry Process Works'}
          steps={isAr ? [
            { num: '01', h3: 'أرسل ملف المساحة المنزلية', desc: 'شارك المنطقة البلدية المستهدفة وحدود الميزانية وحجم الأسرة أو توزيع الشراكة وتواريخ الانتقال المتوقعة.' },
            { num: '02', h3: 'حلقة عزل المحفظة', desc: 'يتحقق متخصص الإيجار لدينا من مخزون BHK-2 المُدار فعليًا للعثور على الوحدات المطابقة لمتطلباتك المكانية.' },
            { num: '03', h3: 'التسليم المباشر للوسائط', desc: 'راجع صورًا داخلية غير معدّلة ومواصفات مخطط الطابق وقواعد مرافق المبنى وتفاصيل التسعير الدقيقة عبر التحديثات المباشرة.' },
            { num: '04', h3: 'التقييم الميداني النهائي', desc: 'أتمم جولة ميدانية مصحوبة لتفتيش الوحدة شخصيًا قبل إتمام عقد إيجارك المصدّق من البلدية.' },
          ] : [
            { num: '01', h3: 'Submit Your Household Space Profile', desc: 'Share your target municipal district, budget boundaries, family size or sharing layout, and expected moving dates.' },
            { num: '02', h3: 'Portfolio Isolation Loop', desc: 'Our leasing specialist checks our actively managed 2-BHK inventories to find units matching your spatial requirements.' },
            { num: '03', h3: 'Direct Media Delivery', desc: 'Review unedited interior photographs, floor plan specifics, building amenity rules, and precise pricing details via direct mobile updates.' },
            { num: '04', h3: 'Final Physical Evaluation', desc: 'Complete an accompanied site walkthrough to inspect the unit firsthand before completing your municipality-attested lease agreement.' },
          ]}
        />
      </section>

      {/* S7 — Common 2 Bedroom Needs */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'الاحتياجات الشائعة لاستئجار شقق بغرفتي نوم' : 'Common 2 Bedroom Apartment Needs We Support'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(isAr ? [
              { h3: 'تصاميم BHK-2 للعائلات المتنامية', desc: 'بيئات سكنية آمنة وملائمة للأطفال توفر قربًا من المساحات الخضراء والحدائق والمراكز التعليمية الكبرى.', accent: true },
              { h3: 'مساحات مشتركة للشركاء المهنيين', desc: 'تصاميم شقق متناسبة مع مساحات نوم متوازنة لتوفير خصوصية مثالية للمستأجرين المشتركين.', accent: false },
              { h3: 'اختيارات عائلية محسّنة للميزانية', desc: 'خيارات شقق غرفتي نوم فعّالة من حيث التكلفة مُهيأة لتوفير اتصالية بلدية ممتازة مع حماية أهداف مدخرات الأسرة.', accent: false },
            ] : [
              { h3: '2-BHK Layouts for Growing Families', desc: 'Secure, child-friendly residential environments offering close proximity to green spaces, parks, and major educational hubs.', accent: true },
              { h3: 'Shared Spaces for Professional Partners', desc: 'Well-proportioned apartment layouts designed with balanced bedroom spaces to provide optimal privacy for co-tenants.', accent: false },
              { h3: 'Budget-Optimized Family Selections', desc: 'Cost-efficient 2-bedroom flat options configured to deliver excellent municipal connectivity while protecting family savings targets.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 100}>
                <div className={`bg-white border border-border rounded-2xl p-7 linear-card h-full ${card.accent ? 'border-l-4 border-l-forest' : ''}`}>
                  <h3 className="font-bold text-xl text-ink mb-3">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S8 — Need a Different Size? */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'هل تحتاج إلى حجم مختلف؟' : 'Need a Different Apartment Size?'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-8 max-w-2xl">
              {isAr
                ? 'إذا كان تصميم غرفتي نوم لا يتناسب مع احتياجاتك الهيكلية، استكشف بدائلنا السكنية الموثوقة أدناه:'
                : 'If a 2-bedroom space configuration does not align with your structural needs, explore our alternative verified residential avenues below:'}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex flex-col sm:flex-row gap-4">
              {(isAr ? [
                { label: 'شقق غرفة نوم واحدة للإيجار', sub: 'مناسبة للأفراد والمديرين التنفيذيين أو الأزواج الباحثين عن مسكن مدمج.', href: '/apartments-for-rent/1-bedroom/' },
                { label: 'شقق ثلاث غرف نوم للإيجار', sub: 'مُصممة للأسر الكبيرة والعائلات الممتدة التي تحتاج مساحةً وراحةً متميزتين.', href: '/apartments-for-rent/3-bedroom/' },
                { label: 'شقق للإيجار', sub: 'العودة إلى صفحة الفهرس السكني الرئيسية لتقييم محفظة العقارات الأوسع.', href: '/apartments-for-rent/' },
              ] : [
                { label: '1 Bedroom Apartments for Rent', sub: 'Tailored for singles, corporate executives, or couples looking for a compact living setup.', href: '/apartments-for-rent/1-bedroom/' },
                { label: '3 Bedroom Apartments for Rent', sub: 'Designed for larger households and extended families needing premium comfort and space.', href: '/apartments-for-rent/3-bedroom/' },
                { label: 'Apartments for Rent', sub: 'Head back to our main residential index page to evaluate our broader property portfolio.', href: '/apartments-for-rent/' },
              ]).map((link, i) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex-1 rounded-2xl p-6 border border-border bg-white linear-card ${i === 0 ? 'border-t-4 border-t-forest' : ''}`}
                >
                  <p className="font-bold text-forest text-sm mb-1">{link.label}</p>
                  <p className="text-ink-muted text-xs leading-relaxed">{link.sub}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S9 — FAQ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'الأسئلة الشائعة — إيجار شقة غرفتي نوم' : '2 Bedroom Apartment Rental FAQs'}
            </h2>
          </Reveal>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* S10 — Final CTA */}
      <FinalCtaBanner
        h2={t('apartments.twoBed.ctaH2')}
        para={isAr
          ? 'تجنّب إضاعة الوقت في إعلانات العقارات غير الموثّقة والمكررة. تواصل مباشرةً مع متخصصي إدارة العقارات في دانية للعقارات اليوم.'
          : 'Avoid wasting time on unvetted, repetitive property classifieds. Connect directly with the property management specialists at Dania Real Estate today. Share your desired location, family spacing parameters, and budget ceilings to secure a verified list of active 2-BHK choices.'}
        primaryLabel={t('apartments.twoBed.ctaPrimary')}
        primaryHref={`https://wa.me/${company.whatsapp}`}
        secondaryLabel={t('apartments.twoBed.ctaSecondary')}
        secondaryHref="/contact-us/"
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   FILTER = "3-bedroom"
══════════════════════════════════════════════════════════════════════════ */
function ThreeBedContent() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'


  const trust = t('apartments.threeBed.trust', { returnObjects: true }) as string[]

  const faqs = isAr ? [
    {
      q: 'ما التغيرات الداخلية الشائعة في شقق ثلاث غرف نوم المتاحة لديكم؟',
      a: 'يتميز مخزون شققنا المتنوعة البالغة ثلاث غرف نوم (3-BHK) بتصاميم حمامات متعددة ومطابخ عائلية مغلقة ومناطق غسيل مستقلة ومخططات متميزة تشمل غرف خادمة مخصصة وحمامات ضيوف خاصة.',
    },
    {
      q: 'هل يمكن للعائلات تأمين شقق ثلاث غرف نوم مفروشة بالكامل عبر وكالتكم؟',
      a: 'نعم. تقدم دانية للعقارات محفظة واسعة من عقارات ثلاث غرف نوم تتراوح بين شقق مفروشة بالكامل جاهزة للانتقال الفوري إلى شقق عائلية شبه مفروشة وغير مفروشة بالكامل.',
    },
    {
      q: 'هل تتضمن قوائم شقق ثلاث غرف نوم لديكم مواقف سيارات متعددة؟',
      a: 'تعتمد قواعد المواقف على المبنى والمجمع المحدد. تشمل معظم عقاراتنا العائلية ذات ثلاث غرف نوم موقف سيارات داخليًا واحدًا على الأقل، ويُوضّح فريقنا صراحةً توافر خيارات المواقف الإضافية قبل المضي قدمًا.',
    },
    {
      q: 'كيف يمكنني طلب جولات مصوّرة حقيقية لشقة BHK-3 قبل تحديد موعد مشاهدة فعلية؟',
      a: 'لحمايتك من القوائم المضللة وتوفير وقتك، يمكن لمستشاري العقارات لدينا إرسال صور داخلية غير معدّلة ومقاطع جولات فعلية مباشرةً عبر واتساب.',
    },
    {
      q: 'هل تشمل رسوم المجمع وتكاليف صيانة المبنى الإيجار الشهري؟',
      a: 'نعم، تُغطّى عادةً الصيانة القياسية للمبنى والرسوم التشغيلية للمجمع بالكامل ضمن الإيجار الشهري. يقدم فريقنا تفصيلًا شفافًا لأي مسؤوليات خدمات خارجية قبل توقيع العقد.',
    },
  ] : [
    {
      q: 'What specific interior variations are common across your 3-bedroom apartments for rent?',
      a: 'Our diverse 3-bedroom (3-BHK) apartment inventory features multiple bathroom designs, closed family kitchens, independent laundry zones, and premium layouts that include dedicated maid\'s rooms and private guest bathrooms.',
    },
    {
      q: 'Can families secure fully furnished 3-bedroom apartments through your agency?',
      a: 'Yes. Dania Real Estate offers an extensive portfolio of 3-bedroom properties ranging from turnkey fully furnished apartments ready for immediate move-in to semi-furnished and completely unfurnished family flats.',
    },
    {
      q: 'Do your 3-bedroom apartment listings include multiple allocated parking spaces?',
      a: "Parking rules depend on the specific building and complex. Most of our 3-bedroom family properties include at least one dedicated basement parking bay, and our team explicitly details the availability of secondary parking options before you proceed.",
    },
    {
      q: 'How can I request authentic video tours of a 3-BHK flat before setting up a physical viewing?',
      a: 'To protect you from misleading listings and save you time, our property consultants can send unedited interior photos and real-time walk-through videos directly to your WhatsApp.',
    },
    {
      q: 'Are compound fees and building maintenance costs included in the monthly rent?',
      a: 'Yes, standard building maintenance and compound operational fees are typically fully covered within the monthly rent. Our team provides a transparent breakdown of any external utility responsibilities before contract signing.',
    },
  ]
  usePageSchema([faqPageSchema(faqs)])

  return (
    <>
      {/* S1 — Hero */}
      <section className="bg-forest text-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <Reveal direction="up">
                <p className="text-lime text-xs font-bold uppercase tracking-widest mb-4">{t('apartments.threeBed.eyebrow')}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                  {t('apartments.threeBed.h1')}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-lime/90 text-lg mb-4 font-semibold leading-snug">
                  {t('apartments.threeBed.subtitle')}
                </p>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/70 text-base mb-8 leading-relaxed">
                  {isAr
                    ? 'يستلزم العثور على شقة واسعة بثلاث غرف نوم للإيجار في الدوحة توازنًا دقيقًا بين المقياس الهيكلي وسلامة المجتمع وروابط النقل المباشرة إلى المدارس الدولية. يتجاوز مستشارو العقارات لدينا الإعلانات القديمة لمطابقة بصمة أسرتك وتفضيلات غرفة الخادمة وميزانيتك الشهرية مع المجمعات العائلية الشاغرة فعليًا.'
                    : "Locating a spacious 3 bedroom apartment for rent in Doha demands a careful balance between structural scale, community safety, and direct transport links to international schools. Dania Real Estate maintains a thoroughly inspected inventory of high-capacity 3-BHK flats across Qatar's premier neighborhood sectors. Our dedicated property consultants bypass outdated marketplace classifieds to match your specific household footprint, maid's room preferences, and monthly budget directly against actively vacant family complexes."}
                </p>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mb-8">
                  <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity">
                    {t('apartments.threeBed.primaryBtn')}
                  </a>
                  <Link to="/contact-us/"
                    className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/20 transition-colors">
                    {t('apartments.threeBed.secondaryBtn')}
                  </Link>
                </div>
              </Reveal>
              <Reveal direction="up" delay={320}>
                <div className="flex flex-col gap-2.5">
                  {trust.map(tp => (
                    <span key={tp} className="flex items-start gap-2.5 text-white/70 text-sm">
                      <CheckCircle2 size={15} className="text-lime shrink-0 mt-0.5" />
                      {tp}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — luxury residential complex photo */}
            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="/3-bedroom-apartments-for-rent-doha-qatar.webp"
                    alt="Verified 3 bedroom apartments for rent in Doha Qatar managed by Dania Real Estate."
                    className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">
                  {t('apartments.threeBed.badge')}
                </div>
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">
                  {t('common.zeroCommission')}
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* S2 — Who This Page Is For */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'لمن هذه الصفحة — شقق ثلاث غرف نوم' : 'Who This 3 Bedroom Apartment Page Is For'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(isAr ? [
              'يختص هذا الدليل العقاري المستهدف بالمستأجرين الذين يحتاجون شققًا سكنية مستقلة واسعة بثلاث غرف نوم داخل الحدود البلدية لقطر. يوفر تصميم BHK-3 القياسي العمق المكاني الجوهري الذي تحتاجه العائلات متعددة الأجيال والمغتربون طويلو الإقامة والحسابات المؤسسية التي تدير إسكان المديرين التنفيذيين.',
              'سواء كانت أسرتك تحتاج غرفًا مخصصة لأطفال متعددين أو أماكن إقامة ضيوف خاصة أو جناح مكتب منزلي معزول أو مطبخ مغلق فسيح، توفر قاعدة بيانات العقارات لدينا الفلاتر المحلية الدقيقة اللازمة لمقارنة الإيجارات الأساسية ومرافق المجمعات بأمان.',
            ] : [
              "This targeted real estate directory is curated exclusively for tenants requiring large-scale, independent three-bedroom residential flats within Qatar's municipal borders. A standard 3-BHK configuration delivers the essential spatial depth required by multi-generational families, long-term expatriates, and corporate accounts managing executive relocation housing where separate bedrooms and individual domestic spaces are absolute requirements.",
              "Whether your household profile requires dedicated rooms for multiple children, private guest accommodations, an isolated home office suite, or an expansive closed-kitchen framework, our property database provides the precise local filters necessary to compare baseline rents and complex facilities securely.",
            ]).map((para, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="text-ink-muted leading-relaxed text-sm">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S3 — What to Consider */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'ما يجب مراعاته عند استئجار شقة بثلاث غرف نوم' : 'What to Consider When Renting a 3 Bedroom Apartment'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'يستلزم تأمين عقد إيجار ثلاث غرف نوم طويل الأمد التحقق من المتغيرات الهيكلية والمجتمعية لضمان استمرارية نمط حياة صحي لجميع أفراد الأسرة.'
                : 'Securing a long-term 3-bedroom lease agreement requires checking structural and community variables to ensure healthy lifestyle continuity for your entire household.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'الفخامة المكانية والتصاميم المنزلية', desc: 'وفّر المساحة الهيكلية الجوهرية بأنظمة حمامات متعددة وغرف غسيل مستقلة وأجنحة خادمة اختيارية ضمن نماذج BHK-3 الرائدة.', accent: true },
              { h3: 'مرونة الغرف الداخلية المتعددة', desc: 'حوّل غرف النوم الثانوية والثالثية إلى غرف أطفال وظيفية أو مناطق دراسة مخصصة أو مكاتب منزلية هادئة.', accent: false },
              { h3: 'الأحياء الملائمة للأسرة', desc: 'نُولي الأولوية للعقارات الكبيرة القريبة من شبكات المدارس الدولية الرائدة والحدائق المجتمعية الخضراء والعيادات الطبية ومراكز البقالة.', accent: false },
              { h3: 'الاستقرار والراحة طويلة الأمد', desc: 'استقر بأسرتك داخل تطويرات سكنية موثوقة وجيدة الإدارة مُحسَّنة للإيجارات المستقرة متعددة السنوات في قطر.', accent: false },
            ] : [
              { h3: 'Spatial Luxury & Domestic Layouts', desc: "Secure essential structural space featuring multi-bathroom setups, independent laundry rooms, and optional maid's quarters configured within prime 3-BHK models.", accent: true },
              { h3: 'Multi-Room Interior Flexibility', desc: 'Adapt your secondary and tertiary bedrooms into functional children\'s rooms, dedicated study zones, or quiet home office layouts.', accent: false },
              { h3: 'Family-Focused Neighborhoods', desc: 'We prioritize large properties situated near leading international school networks, green community parks, medical clinics, and grocery centers.', accent: false },
              { h3: 'Long-Term Stability & Comfort', desc: 'Establish your household inside verified, well-managed residential developments optimized for stable, multi-year tenancies in Qatar.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${card.accent ? 'border-t-4 border-t-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S4 — 3 Bedroom Apartments by Area */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'شقق ثلاث غرف نوم في الدوحة والمناطق الرئيسية' : '3 Bedroom Apartments in Doha and Key Qatar Areas'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {isAr
                ? 'تتوافق تشطيبات المخطط ومخصصات مواقف السيارات الداخلية وشروط الإيجار الأساسية لوحدات ثلاث غرف نوم مع قطاعاتها البلدية. تقدم دانية للعقارات إشرافًا عقاريًا محليًا عبر هذه الممرات السكنية الرئيسية:'
                : 'Floor plan finishes, basement parking allocations, and baseline lease terms for 3-bedroom units naturally correspond with their municipal sectors. Dania Real Estate provides localized property oversight across these core residential corridors:'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'شقق ثلاث غرف نوم في الدوحة', desc: 'خيارات شقق عائلية واسعة في قلب الدوحة ومساحات أبراج متميزة في الدفنة والهلال والمعمورة.', href: '/areas/doha/' },
              { h3: 'شقق ثلاث غرف نوم في السد', desc: 'إيجارات BHK-3 حضرية فسيحة في قطاعات التجزئة والمطاعم والمكاتب التجارية المركزية الرائدة في الدوحة.', href: '/areas/al-sadd/' },
              { h3: 'إيجارات ثلاث غرف نوم في بن محمود', desc: 'شقق عائلية داخل المدينة بوصول سريع إلى الطرق الدائرية الرئيسية والمرافق الطبية المتميزة والمدارس.', href: '/areas/bin-mahmoud/' },
              { h3: 'شقق ثلاث غرف نوم في الوكرة', desc: 'تصاميم شقق ساحلية هادئة وواسعة للعائلات الكبيرة التي تُفضّل البيئة الضاحوية الهادئة.', href: '/areas/al-wakra/' },
              { h3: 'إيجارات ثلاث غرف نوم في العزيزية وأبو هامور', desc: 'مبانٍ سكنية آمنة مجاورة للمساحات الترفيهية العائلية الكبرى والأسواق التجارية.', href: '/areas/al-aziziya/' },
              { h3: 'شقق ثلاث غرف نوم في المطار القديم', desc: 'تصاميم BHK-3 سهلة الوصول وميسورة التكلفة مع تنقل مريح إلى مراكز المدينة التاريخية وخطوط النقل.', href: '/areas/old-airport/' },
              { h3: 'إيجارات ثلاث غرف نوم في أم صلال', desc: 'خيارات سكنية ضاحوية شمالية متنامية تمتد عبر التطويرات العائلية في أم صلال محمد والقطاعات المجاورة.', href: '/areas/umm-salal/' },
              { h3: 'إيجارات ثلاث غرف نوم في الخريطيات', desc: 'مبانٍ شقق ضاحوية عائلية ومنخفضة الكثافة للمستأجرين الباحثين عن أقصى مساحة بعيدًا عن ازدحام المدينة.', href: '/areas/al-kharaitiyat/' },
            ] : [
              { h3: '3 Bedroom Apartments in Doha', desc: 'Large-scale family apartment options across Central Doha, premium high-rise spaces in Al Dafna, Al Hilal, and Al Mamoura community loops.', href: '/areas/doha/' },
              { h3: '3 Bedroom Apartments in Al Sadd', desc: "Expansive urban 3-BHK rentals situated within Doha's premier central retail, dining, and commercial office sectors.", href: '/areas/al-sadd/' },
              { h3: '3 Bedroom Rentals in Bin Mahmoud', desc: 'Strategic inner-city family apartments offering quick access to central ring roads, premium medical facilities, and schools.', href: '/areas/bin-mahmoud/' },
              { h3: '3 Bedroom Apartments in Al Wakra', desc: 'Highly peaceful, space-dense coastal 3-bedroom flat layouts catering to large households prioritizing a quiet suburban environment.', href: '/areas/al-wakra/' },
              { h3: '3 Bedroom Rentals in Al Aziziya & Abu Hamour', desc: 'Secure residential apartment blocks positioned immediately adjacent to major family-focused recreational spaces and shopping markets.', href: '/areas/al-aziziya/' },
              { h3: '3 Bedroom Apartments in Old Airport', desc: 'Highly accessible and budget-friendly 3-BHK layouts offering convenient commutes to historical city center points and transit lanes.', href: '/areas/old-airport/' },
              { h3: '3 Bedroom Rentals in Umm Salal', desc: 'Growing northern suburban residential choices spanning the family-friendly developments of Umm Salal Mohammed and adjacent sectors.', href: '/areas/umm-salal/' },
              { h3: '3 Bedroom Rentals in Al Kharaitiyat', desc: 'Low-density, family-centric suburban apartment blocks tailored for tenants seeking maximum space away from inner-city traffic.', href: '/areas/al-kharaitiyat/' },
            ]).map((area, i) => (
              <Reveal key={area.h3} delay={i * 60}>
                <div className="bg-white border border-border rounded-2xl p-6 linear-card h-full flex flex-col">
                  <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                  <p className="text-ink-muted text-xs leading-relaxed mb-4 flex-1">{area.desc}</p>
                  <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                    {t('common.viewProperties')}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S5 — Why Choose Dania for 3-BHK */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'لماذا تختار دانية للعقارات للبحث عن شقة بثلاث غرف نوم' : 'Why Choose Dania Real Estate for Your 3-BHK Search'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'مطابقة أسرة كبيرة مع شقة ثلاث غرف نوم المناسبة تتطلب بيانات عقارية محلية عميقة ووضوحًا تامًا في التعاقد.'
                : 'Matching a large household with the right 3-bedroom flat requires deep local property data and absolute contract clarity.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              { h3: 'توريد أصول المساحات الكبيرة المتخصص', desc: 'نستبعد التصاميم المتكدسة لعزل تهيئات ثلاث غرف نوم المتميزة التي توفر فائدة مكانية ممتازة وراحة عائلية.', accent: true },
              { h3: 'الشفافية التشغيلية الكاملة', desc: 'نحمي إيجارك بضمان الامتثال الواضح لقواعد بلدية الدوحة وشروط الإيداع وفحوصات أحمال كهرماء.', accent: false },
              { h3: 'دعم انتقال الأسرة المتخصص', desc: 'يمتلك مستشارونا خبرة عميقة في إدارة ملامح أسرية متعددة الأفراد وانتقالات المديرين التنفيذيين والانتقالات العائلية المعقدة.', accent: false },
              { h3: 'تحديثات مباشرة سريعة عبر الجوال', desc: 'تخطَّ بوابات قوائم العقارات البطيئة والمحبطة. تواصل مباشرةً عبر واتساب لاستلام وسائط داخلية غير معدّلة للوحدات الشاغرة فورًا.', accent: false },
            ] : [
              { h3: 'Specialized Large-Space Asset Sourcing', desc: 'We screen out cramped layouts to isolate premium 3-bedroom configurations that deliver excellent spatial utility and family comfort.', accent: true },
              { h3: 'Total Operational Transparency', desc: 'We protect your tenancy by ensuring clear compliance with Doha Municipality attestation rules, deposit terms, and Kahramaa load checks.', accent: false },
              { h3: 'Dedicated Family Relocation Support', desc: 'Our consultants possess deep experience managing multi-passenger domestic profiles, corporate executive relocations, and complex family transitions.', accent: false },
              { h3: 'Rapid Direct Mobile Updates', desc: 'Skip slow, frustrating property listing portals. Connect directly via WhatsApp to receive unedited interior media of vacant units instantly.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80}>
                <div className={`bg-white border border-border rounded-2xl p-6 linear-card h-full ${card.accent ? 'border-t-4 border-t-forest' : ''}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
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

      {/* S6 — Inquiry Process */}
      <section className="py-20">
        <ProcessSteps
          title={isAr ? 'كيف تعمل عملية الاستئجار لدينا' : 'How the 3 Bedroom Apartment Inquiry Process Works'}
          steps={isAr ? [
            { num: '01', h3: 'حدد مجموعة معايير أسرتك', desc: 'أخبر فريقنا بالقطاع البلدي المفضل وحدود الميزانية وعدد غرف النوم المحدد والجدول الزمني المستهدف للانتقال.' },
            { num: '02', h3: 'حلقة تصفية العقارات المُدارة', desc: 'يفحص مكتب الإيجار لدينا محافظ BHK-3 المُدارة فعليًا للعثور على العقارات المطابقة لمعاييرك المكانية والعائلية.' },
            { num: '03', h3: 'التحقق من الوسائط والمرافق', desc: 'راجع صورًا داخلية غير معدّلة ومصفوفات مخطط طابق مفصّلة وتفاصيل تسعير واضحة عبر تحديثات التواصل المباشر.' },
            { num: '04', h3: 'جولة مصحوبة للمجمع', desc: 'أتمم فحصًا ميدانيًا فعليًا بصحبة مستشار عقاري خبير قبل التوقيع على عقد إيجارك المصدّق من البلدية.' },
          ] : [
            { num: '01', h3: 'Define Your Household Parameter Set', desc: 'Inform our team of your preferred municipal sector, budget boundaries, specific bedroom count, and target moving timeline.' },
            { num: '02', h3: 'Managed Property Filtering Loop', desc: 'Our leasing desks scan actively managed 3-BHK portfolios to find properties matching your spatial and family criteria.' },
            { num: '03', h3: 'Media & Facility Verification', desc: 'Review unedited interior photographs, detailed floor plan matrices, and clear pricing details through direct communication updates.' },
            { num: '04', h3: 'Accompanied Complex Walkthrough', desc: 'Complete an on-site physical inspection alongside an expert property consultant before signing your municipality-attested lease.' },
          ]}
        />
      </section>

      {/* S7 — Common 3 Bedroom Needs */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'الاحتياجات الشائعة لاستئجار شقق بثلاث غرف نوم' : 'Common 3 Bedroom Apartment Needs We Support'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(isAr ? [
              { h3: 'تصاميم عالية الطاقة الاستيعابية للعائلات متعددة الأطفال', desc: 'بيئات سكنية آمنة وفسيحة قريبة من المدارس والمراكز الترفيهية والحدائق الملائمة للأطفال.', accent: true },
              { h3: 'حلول إيجار ممتدة للاستقرار', desc: 'مبانٍ سكنية جيدة الإدارة مدعومة بمديرين عقاريين موثوقين لتوفير راحة بال لإشغالات الأسرة متعددة السنوات.', accent: false },
              { h3: 'مساحات متعددة الوظائف لأنماط الحياة الحديثة', desc: 'تصاميم BHK-3 توفر القدرة الهيكلية لدعم بيئات العمل المنزلي المتكاملة ودور الحضانة أو احتياجات التخزين الكبيرة.', accent: false },
            ] : [
              { h3: 'High-Capacity Layouts for Multi-Child Families', desc: 'Secure, spacious residential environments located near top-tier schools, recreational centers, and child-friendly parks.', accent: true },
              { h3: 'Extended Tenancy Solutions for Stability', desc: 'Well-managed apartment blocks backed by stable property managers, ensuring peace of mind for multi-year family occupancies.', accent: false },
              { h3: 'Multi-Functional Spaces for Modern Lifestyles', desc: '3-BHK layouts offering the structural capacity to support integrated home work environments, nurseries, or large storage needs.', accent: false },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 100}>
                <div className={`bg-white border border-border rounded-2xl p-7 linear-card h-full ${card.accent ? 'border-l-4 border-l-forest' : ''}`}>
                  <h3 className="font-bold text-xl text-ink mb-3">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S8 — Need a Different Size? */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'هل تحتاج إلى حجم مختلف؟' : 'Need a Different Apartment Size?'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-ink-muted mb-8 max-w-2xl">
              {isAr
                ? 'إذا كان مخطط ثلاث غرف نوم يوفر مساحةً أكبر مما تحتاجه أسرتك، استكشف بدائلنا السكنية الموثوقة أدناه:'
                : 'If a 3-bedroom floor plan provides more space than your household requires, explore our alternative verified residential silos below:'}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex flex-col sm:flex-row gap-4">
              {(isAr ? [
                { label: 'شقق غرفة نوم واحدة للإيجار', sub: 'تصاميم حضرية مدمجة وسهلة الصيانة مُهندسة للمديرين التنفيذيين الأفراد والمهنيين المشغولين.', href: '/apartments-for-rent/1-bedroom/' },
                { label: 'شقق غرفتي نوم للإيجار', sub: 'التوازن الهيكلي المثالي للعائلات النووية المتنامية أو ترتيبات الشراكة السكنية المؤسسية.', href: '/apartments-for-rent/2-bedroom/' },
                { label: 'شقق للإيجار', sub: 'العودة إلى مركز الفهرس السكني الرئيسي لتقييم محفظة الإيجار الكاملة.', href: '/apartments-for-rent/' },
              ] : [
                { label: '1 Bedroom Apartments for Rent', sub: 'Compact, low-maintenance urban layouts engineered for single executives and busy professionals.', href: '/apartments-for-rent/1-bedroom/' },
                { label: '2 Bedroom Apartments for Rent', sub: 'The ideal structural balance for growing nuclear families or corporate flat-sharing arrangements.', href: '/apartments-for-rent/2-bedroom/' },
                { label: 'Apartments for Rent', sub: 'Return to our master residential index hub to evaluate our entire rental property portfolio.', href: '/apartments-for-rent/' },
              ]).map((link, i) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex-1 rounded-2xl p-6 border border-border bg-white linear-card ${i === 0 ? 'border-t-4 border-t-forest' : ''}`}
                >
                  <p className="font-bold text-forest text-sm mb-1">{link.label}</p>
                  <p className="text-ink-muted text-xs leading-relaxed">{link.sub}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S9 — FAQ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'الأسئلة الشائعة — إيجار شقة ثلاث غرف نوم' : '3 Bedroom Apartment Rental FAQs'}
            </h2>
          </Reveal>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* S10 — Final CTA */}
      <FinalCtaBanner
        h2={t('apartments.threeBed.ctaH2')}
        para={isAr
          ? 'احمِ راحة أسرتك واستقرارها على المدى الطويل. تواصل مع متخصصي إدارة العقارات في دانية للعقارات اليوم.'
          : "Protect your family's comfort and long-term stability. Connect with the property management professionals at Dania Real Estate today. Share your target district, required space parameters, and budget ceilings to receive a curated list of active 3-BHK options."}
        primaryLabel={t('apartments.threeBed.ctaPrimary')}
        primaryHref={`https://wa.me/${company.whatsapp}`}
        secondaryLabel={t('apartments.threeBed.ctaSecondary')}
        secondaryHref="/contact-us/"
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════════════════ */
export function ApartmentsPage({ filter }: Readonly<Props>) {
  const seo = {
    all: { title: 'Apartments for Rent in Doha | Verified Flats Qatar | Dania Real Estate', desc: 'Browse verified apartments for rent in Doha and greater Qatar. Discover 1, 2, and 3-bedroom flat layouts with transparent leasing options and direct WhatsApp support.' },
    '1-bedroom': { title: '1 Bedroom Apartments for Rent in Doha | 1 BHK Flats Qatar', desc: 'Explore verified 1 bedroom apartments for rent in Doha and greater Qatar. Find modern 1-BHK layouts for single professionals and couples with direct WhatsApp support.' },
    '2-bedroom': { title: '2 Bedroom Apartments for Rent in Doha | 2 BHK Flats Qatar', desc: 'Browse verified 2 bedroom apartments for rent in Doha and greater Qatar. Find spacious 2-BHK layouts for small families and shared executive living with direct WhatsApp support.' },
    '3-bedroom': { title: '3 Bedroom Apartments for Rent in Doha | 3 BHK Family Flats Qatar', desc: 'Find verified 3 bedroom apartments for rent in Doha and greater Qatar. Explore spacious 3-BHK floor plans with dedicated family amenities and direct WhatsApp support.' },
  }[filter]

  const content = filter === '1-bedroom' ? <OneBedContent />
    : filter === '2-bedroom' ? <TwoBedContent />
    : filter === '3-bedroom' ? <ThreeBedContent />
    : <AllApartmentsContent />

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.desc} />
      {content}
    </>
  )
}
