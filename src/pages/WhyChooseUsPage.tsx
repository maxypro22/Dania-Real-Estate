import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  MapPin,
  Layers,
  Filter,
  RefreshCw,
  Users,
  Briefcase,
  Home,
  Building2,
} from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { ProcessSteps } from '@/components/shared/ProcessSteps'
import { company } from '@/data/mockData'

/* ─── Icons (non-translatable) ───────────────────────────────────────────── */

const TRUST_ICONS = [Shield, Zap, MapPin, Layers, Filter, RefreshCw]

const CLIENT_ICONS = [Home, Users, Building2, Briefcase]
const CLIENT_ACCENTS = [false, true, false, true]

/* ─── Static area data (area names stay English) ─────────────────────────── */

const areaCards = [
  {
    name: 'Doha',
    slug: 'doha',
    text: 'Full property management presence across Central Doha, Al Dafna, Al Hilal, and Al Mamoura corridors.',
  },
  {
    name: 'Al Sadd',
    slug: 'al-sadd',
    text: "Modern apartment options and prime retail positions inside Doha's most active commercial core.",
  },
  {
    name: 'Bin Mahmoud',
    slug: 'bin-mahmoud',
    text: 'Central residential options tailored for corporate professionals requiring fast office and highway connectivity.',
  },
  {
    name: 'Al Wakra',
    slug: 'al-wakra',
    text: 'Highly affordable residential options and standalone family properties positioned outside central urban hubs.',
  },
  {
    name: 'Al Aziziya',
    slug: 'al-aziziya',
    text: 'Family-centric compound villas and specialized property layouts flanking main neighborhood amenities.',
  },
  {
    name: 'Old Airport',
    slug: 'old-airport',
    text: 'Highly accessible, historic neighborhood flat arrangements and budget single units near transit hubs.',
  },
  {
    name: 'Umm Salal',
    slug: 'umm-salal',
    text: 'Scalable, budget-friendly living properties covering Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn sectors perfectly.',
  },
  {
    name: 'Al Kharaitiyat',
    slug: 'al-kharaitiyat',
    text: 'Quiet northern suburban residential spaces designed primarily for extended family households.',
  },
]

const areaCardsAr = [
  {
    name: 'الدوحة',
    slug: 'doha',
    text: 'عقارات في وسط الدوحة والسد والهلال ومناطق الدفنة.',
  },
  {
    name: 'السد',
    slug: 'al-sadd',
    text: 'شقق راقية ومحلات قرب محطات المترو ومراكز الترفيه.',
  },
  {
    name: 'بن محمود',
    slug: 'bin-mahmoud',
    text: 'خيارات سكنية مركزية قريبة من العيادات والأسواق الكبرى.',
  },
  {
    name: 'الوكرة',
    slug: 'al-wakra',
    text: 'إسكان هادئ للعائلات خارج محيط الدوحة.',
  },
  {
    name: 'العزيزية',
    slug: 'al-aziziya',
    text: 'عقارات نشطة قرب الطرق التجارية والمدارس.',
  },
  {
    name: 'المطار القديم',
    slug: 'old-airport',
    text: 'عقارات راسخة وشقق مشتركة ومحلات تجارية.',
  },
  {
    name: 'أم صلال',
    slug: 'umm-salal',
    text: 'خيارات إيجارية اقتصادية تشمل منطقة أم صلال الكبرى.',
  },
  {
    name: 'الخريطيات',
    slug: 'al-kharaitiyat',
    text: 'مجمعات سكنية هادئة في شمال قطر.',
  },
]

const trustBlocks = [
  {
    title: 'Actionable Advisory Solutions',
    text: 'We replace generic listing sheets with tailored data, focusing entirely on your actual property goals and realities.',
  },
  {
    title: 'Granular Zoning Knowledge',
    text: 'Every property consultation balances daily commute patterns, school access points, budget constraints, and corporate needs.',
  },
  {
    title: 'Reliable Professional Care',
    text: 'Our property management specialists remain continuously accessible, providing prompt viewing setups and lease support.',
  },
]

const trustBlocksAr = [
  {
    title: 'الشفافية الكاملة في القائمة',
    text: 'كل عقار نشاركه موثق ومفصّل بالكامل — الأسعار والمرافق والشروط مذكورة بوضوح.',
  },
  {
    title: 'استجابة لحظية عبر واتساب',
    text: 'يستجيب فريقنا بسرعة وإرسال صور حقيقية للعقارات المتاحة عبر واتساب — بدون انتظار.',
  },
  {
    title: 'دعم متكامل من الاستفسار إلى التوقيع',
    text: 'فريقنا يرشدك في كل خطوة — من اختيار العقار إلى مراجعة العقد والتسليم.',
  },
]

/* ─── Component ───────────────────────────────────────────────────────────── */

export function WhyChooseUsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const waLink = `https://wa.me/${company.whatsapp}`

  const trustCards = t('whyUs.trust.cards', { returnObjects: true }) as Array<{ title: string; text: string }>
  const clientCards = t('whyUs.clients.cards', { returnObjects: true }) as Array<{ title: string; text: string }>
  const steps = t('whyUs.process.steps', { returnObjects: true }) as Array<{ num: string; h3: string; desc: string }>
  const faqs = t('whyUs.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>
  const highlightPoints = t('whyUs.highlights', { returnObjects: true }) as Array<{ title: string; text: string }>
  const cards = isAr ? areaCardsAr : areaCards
  const blocks = isAr ? trustBlocksAr : trustBlocks

  return (
    <>
      <title>Why Choose Dania Real Estate | Trusted Rental Support Qatar</title>
      <meta name="description" content="Discover why tenants, families, and businesses trust Dania Real Estate for direct communication, 100% verified property listings, and premium rental options in Doha." />
      {/* ── S1 Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <Reveal direction="up" delay={0}>
                <p className="text-lime text-xs font-bold uppercase tracking-widest mb-4">
                  {t('whyUs.hero.eyebrow')}
                </p>
              </Reveal>

              <Reveal direction="up" delay={80}>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
                  {t('whyUs.hero.h1')}
                </h1>
              </Reveal>

              <Reveal direction="up" delay={160}>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  {t('whyUs.hero.p')}
                </p>
              </Reveal>

              <Reveal direction="up" delay={240}>
                <div className="flex flex-wrap gap-3 mb-8">
                  {/* Primary CTA */}
                  <Link
                    to="/contact-us/"
                    className="group relative overflow-hidden inline-flex items-center gap-2 bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm"
                  >
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-forest scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-lime">
                      {t('whyUs.hero.primaryBtn')}
                    </span>
                  </Link>

                  {/* Secondary CTA */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/30 text-white font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm"
                  >
                    <MessageCircle size={15} />
                    {t('whyUs.hero.secondaryBtn')}
                  </a>
                </div>
              </Reveal>

              <Reveal direction="up" delay={320}>
                <p className="text-white/45 text-sm">
                  {t('whyUs.hero.subtitle')}
                </p>
              </Reveal>
            </div>

            {/* Right – decorative visual block */}
            <Reveal direction="left" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src="/why-choose-dania-real-estate-qatar.webp"
                    alt="Verified residential and commercial rental property search support in Doha Qatar by Dania Real Estate."
                    className="w-full h-52 sm:h-72 lg:h-[420px] object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent rounded-3xl" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold px-5 py-3 rounded-2xl shadow-xl text-sm">
                  {isAr ? '١٠٠٪ عقارات موثقة' : '100% Verified Listings'}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── S2 What Makes Us Different ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* Text block */}
            <div>
              <Reveal direction="up" delay={0}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-5">
                  {isAr ? 'طريقة أوضح للبحث عن عقارات الإيجار في قطر' : 'A Clearer Way to Search for Rental Properties in Qatar'}
                </h2>
              </Reveal>

              <Reveal direction="up" delay={80}>
                <p className="text-ink-muted leading-relaxed mb-4">
                  {isAr
                    ? 'نظام البحث التقليدي عن الإيجار غالباً ما يكون مزدحماً بإعلانات مضللة وقوائم قديمة وبنى رسوم غير شفافة تُعيق المستأجرين في كل خطوة.'
                    : 'The traditional rental search ecosystem is often cluttered with bait-and-switch advertisements, outdated pricing indices, and non-responsive agents. At Dania Real Estate, we intentionally operate on a model of absolute transparency, mapping client budget boundaries directly against live, legally compliant landlord properties.'}
                </p>
              </Reveal>

              <Reveal direction="up" delay={160}>
                <p className="text-ink-muted leading-relaxed mb-8">
                  {isAr
                    ? 'من خلال دمج شبكة خدمة رقمية منظمة مع قنوات تواصل مباشرة فورية، تُزيل دانية للعقارات هذا الاحتكاك وتُبسّط رحلة الإيجار.'
                    : 'By integrating an organized digital service grid with immediate direct communication pipelines, we remove the stressful, time-consuming administrative hurdles. This hybrid operational approach gives our tenants the distinct advantage of viewing and locking down properties before they exit the competitive Qatar market.'}
                </p>
              </Reveal>
            </div>

            {/* Highlight points */}
            <div className="space-y-4">
              {highlightPoints.map((point, i) => (
                <Reveal key={point.title} direction="right" delay={i * 100}>
                  <div className="flex items-start gap-4 bg-surface-low rounded-2xl border border-border p-5">
                    <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={15} className="text-forest" />
                    </div>
                    <span className="text-ink leading-relaxed font-medium">{point.title}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── S3 Trust Cards ──────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up" delay={0}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-3">
              {t('whyUs.trust.h2')}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted text-center max-w-2xl mx-auto mb-12">
              {isAr
                ? 'تأمين عقد إيجار تجاري طويل الأمد أو منزل عائلي آمن يتطلب شريكاً يتمتع بمعرفة محلية عميقة وشبكة علاقات موثوقة مع الملاك.'
                : 'Securing a long-term commercial lease or a secure family home requires a property management ally that values accurate data, legal compliance, and rapid action.'}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trustCards.map((card, i) => {
              const Icon = TRUST_ICONS[i]
              const isAccent = i === 0
              return (
                <Reveal key={card.title} direction="up" delay={i * 80}>
                  <div
                    className={`rounded-2xl border p-7 flex gap-5 hover:shadow-lg transition-shadow h-full ${
                      isAccent
                        ? 'bg-forest border-forest text-white'
                        : 'bg-white border-border'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isAccent ? 'bg-lime/20' : 'bg-lime'
                      }`}
                    >
                      <Icon size={20} className={isAccent ? 'text-lime' : 'text-forest'} />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                          isAccent ? 'text-lime/70' : 'text-ink-muted'
                        }`}
                      >
                        0{i + 1}
                      </p>
                      <h3
                        className={`font-bold text-base mb-2 ${
                          isAccent ? 'text-white' : 'text-ink'
                        }`}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          isAccent ? 'text-white/70' : 'text-ink-muted'
                        }`}
                      >
                        {card.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S4 Client Needs ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up" delay={0}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-12">
              {t('whyUs.clients.h2')}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clientCards.map((card, i) => {
              const Icon = CLIENT_ICONS[i]
              const isAccent = CLIENT_ACCENTS[i]
              return (
                <Reveal key={card.title} direction="up" delay={i * 80}>
                  <div
                    className={`rounded-2xl border p-8 hover:shadow-lg transition-shadow h-full ${
                      isAccent
                        ? 'bg-forest border-forest text-white'
                        : 'bg-white border-border'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                        isAccent ? 'bg-lime/20' : 'bg-lime'
                      }`}
                    >
                      <Icon size={20} className={isAccent ? 'text-lime' : 'text-forest'} />
                    </div>
                    <h3
                      className={`font-bold text-xl mb-3 ${
                        isAccent ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`leading-relaxed ${
                        isAccent ? 'text-white/70' : 'text-ink-muted'
                      }`}
                    >
                      {card.text}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S5 Process ──────────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <ProcessSteps
          title={t('whyUs.process.h2')}
          steps={steps.map((step) => ({
            num: step.num,
            h3: step.h3,
            desc: step.desc,
          }))}
        />

        {/* CTA */}
        <div className="max-w-[1280px] mx-auto px-6 mt-12">
          <Reveal direction="up" delay={200}>
            <div className="text-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex items-center gap-2 bg-forest text-white font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-base"
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
                <MessageCircle
                  size={17}
                  className="relative z-10 transition-colors duration-300 group-hover:text-forest"
                />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">
                  {isAr ? 'أرسل متطلباتك الآن' : 'Send Your Requirements Now'}
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S6 Fast Comms ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Reveal direction="up" delay={0}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-6">
                {isAr ? 'لماذا يهم التواصل السريع في سوق الإيجار القطري' : 'Why Fast Communication Matters in the Qatar Rental Market'}
              </h2>
            </Reveal>

            <Reveal direction="up" delay={80}>
              <p className="text-ink-muted leading-relaxed mb-5 text-lg">
                {isAr
                  ? 'المخزون الإيجاري المرتفع الطلب في المواقع المتميزة بالدوحة يُشغَل بسرعة كبيرة. التأخر في التواصل أو إنجاز المعاملات كثيراً ما يُفضي إلى ضياع الفرص.'
                  : 'High-demand rental inventory in prime Doha localities—such as budget studio partition rooms, modern family flats, and enterprise staff complexes—frequently changes hands within days. Relying on classic email threads or delayed listing platforms often means missing out on top-tier assets.'}
              </p>
            </Reveal>

            <Reveal direction="up" delay={160}>
              <p className="text-ink-muted leading-relaxed text-lg">
                {isAr
                  ? 'تُعالج دانية للعقارات هذه المشكلة بنشاط من خلال الجمع بين الاكتشاف الرقمي المنظم والتواصل الفوري عبر واتساب.'
                  : 'Dania Real Estate actively resolves this issue by combining structured web discovery with direct instant communication channels. Our web architecture educates you on locations and property categories, while our integrated phone and WhatsApp desks provide real-time updates on active spaces.'}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── S7 Areas ────────────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up" delay={0}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-3">
              {t('whyUs.areas.h2')}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted text-center max-w-2xl mx-auto mb-12">
              {t('whyUs.areas.subtitle')}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((area, i) => (
              <Reveal key={area.slug} direction="up" delay={i * 60}>
                <Link
                  to={`/areas/${area.slug}/`}
                  className="bg-white rounded-2xl border border-border p-6 hover:shadow-md hover:border-forest/30 transition-all group flex flex-col h-full"
                >
                  <h3 className="font-bold text-ink text-base mb-2 group-hover:text-forest transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1 mb-4">{area.text}</p>
                  {/* Pill-style link badge */}
                  <span className="inline-flex items-center gap-1.5 self-start bg-lime/20 text-forest text-xs font-bold px-3 py-1.5 rounded-full group-hover:bg-lime transition-colors">
                    {isAr ? 'استكشف' : 'Explore'} <ArrowRight size={11} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── S8 Trust Quality ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up" delay={0}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-12">
              {isAr ? 'مبنية للدعم الإيجاري الواضح والعملي والموثوق' : 'Built for Clear, Practical, and Reliable Rental Support'}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blocks.map((block, i) => (
              <Reveal key={block.title} direction="up" delay={i * 100}>
                <div className="bg-white rounded-2xl border border-border p-8 hover:shadow-md transition-shadow h-full">
                  <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center mb-5">
                    <CheckCircle2 size={19} className="text-forest" />
                  </div>
                  <h3 className="font-bold text-ink text-lg mb-3">{block.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{block.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── S9 FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up" delay={0}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-10">
              {t('whyUs.faq.h2')}
            </h2>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={faq.q} direction="up" delay={i * 60}>
                  <div className="bg-white rounded-2xl border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-surface-low transition-colors"
                      aria-expanded={isOpen}
                    >
                      <h3 className="font-bold text-ink text-sm leading-snug">{faq.q}</h3>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-forest transition-transform duration-300 mt-0.5 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-ink-muted text-sm leading-relaxed px-6 pb-5">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S10 Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up" delay={0}>
            <div className="bg-lime rounded-3xl px-5 py-10 sm:px-10 sm:py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
                {t('whyUs.cta.h2')}
              </h2>
              <p className="text-forest/70 text-lg max-w-xl mx-auto mb-10">
                {t('whyUs.cta.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {/* Primary – WhatsApp */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex items-center gap-2 bg-forest text-white font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm"
                >
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
                  <MessageCircle
                    size={15}
                    className="relative z-10 transition-colors duration-300 group-hover:text-forest"
                  />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">
                    {t('whyUs.cta.primary')}
                  </span>
                </a>

                {/* Secondary – Contact Us */}
                <Link
                  to="/contact-us/"
                  className="inline-flex items-center gap-2 border-2 border-forest text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full hover:bg-forest hover:text-white transition-colors text-sm"
                >
                  {t('whyUs.cta.secondary')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
