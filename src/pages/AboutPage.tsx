import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Home,
  Users,
  Store,
  LayoutGrid,
  MapPin,
  MessageCircle,
  ChevronDown,
  ShieldCheck,
  Zap,
  Star,
  Heart,
  Briefcase,
  Globe,
} from 'lucide-react'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { ProcessSteps } from '@/components/shared/ProcessSteps'

// ─── S3 Rental Focus cards ───────────────────────────────────────────────────
const rentalFocusCards = [
  {
    h3: 'Apartments for Rent',
    text: 'From compact single-executive flats to expansive multi-room living arrangements across central Doha sectors.',
    link: '/apartments-for-rent/',
    icon: Home,
  },
  {
    h3: 'Villas for Rent',
    text: 'Premium independent layouts and highly secure compound villas structured around secure, community-style amenities.',
    link: '/villas-for-rent/',
    icon: Building2,
  },
  {
    h3: 'Staff Accommodation',
    text: 'Enterprise-grade operational labor housing complexes and dedicated staff villas built to strict corporate safety guidelines.',
    link: '/staff-accommodation/',
    icon: Users,
  },
  {
    h3: 'Shops for Rent',
    text: 'Highly strategic retail storefronts and active commercial properties tailored to drive retail operations successfully.',
    link: '/shops-for-rent/',
    icon: Store,
  },
  {
    h3: 'Studio & Partition Rentals',
    text: 'Budget-friendly private studio spaces and partitioned single rooms mapped close to major rapid transit systems.',
    link: '/studio-partition-rentals/',
    icon: LayoutGrid,
  },
]

// ─── S4 Why Clients Choose Us cards ─────────────────────────────────────────
const trustCards = [
  {
    h3: 'Local Market Intelligence',
    text: 'Our dedicated agents possess an intuitive grasp of localized zoning legalities, real-time rental value shifts, and optimal neighborhood conveniences.',
    icon: MapPin,
  },
  {
    h3: 'Verifiable Asset Catalogs',
    text: 'We protect our users from marketplace disinformation by running strict multi-point physical inspections before any property goes live on our network.',
    icon: ShieldCheck,
  },
  {
    h3: 'Versatile Portfolio Layouts',
    text: 'Our capability spans fluidly across low-cost micro-housing setups, luxury family estates, and scalable commercial installations.',
    icon: LayoutGrid,
  },
  {
    h3: 'Rapid Communication Architecture',
    text: 'We eliminate delayed corporate ticketing models, opting for instant, direct phone consults and active WhatsApp support pipelines.',
    icon: Zap,
  },
  {
    h3: 'Client-Centric Operational Care',
    text: 'Whether handling a brief single-tenant studio search or managing bulk corporate relocation contracts, our delivery standard remains pristine.',
    icon: Heart,
  },
]

// ─── S5 Who We Support cards ─────────────────────────────────────────────────
const audienceCards = [
  {
    h3: 'Growing Families',
    text: 'Sourcing safe residential solutions positioned directly within premium school zones, local medical clinics, and grocery centers.',
    icon: Home,
  },
  {
    h3: 'Working Professionals',
    text: 'Aligning single executives and corporate professionals with low-maintenance studios or partition rooms near commercial business hubs.',
    icon: Briefcase,
  },
  {
    h3: 'Enterprise Corporate Entities',
    text: 'Assisting human resource departments and enterprise managers in securing scalable, regulatory-compliant workforce accommodations safely.',
    icon: Building2,
  },
  {
    h3: 'Local Business Owners',
    text: 'Placing ambitious local retail owners and commercial operators into spaces engineered for optimum market visibility and consumer traffic.',
    icon: Store,
  },
]

// ─── S6 Areas cards ───────────────────────────────────────────────────────────
const areaCards = [
  {
    h3: 'Doha',
    text: 'Strategic property presence within Central Doha, Al Dafna, Al Hilal, and Al Mamoura zones.',
    link: '/areas/doha/',
  },
  {
    h3: 'Al Sadd',
    text: 'Premium residential flat listings and active commercial spots positioned near primary metro transport lines.',
    link: '/areas/al-sadd/',
  },
  {
    h3: 'Bin Mahmoud',
    text: 'Central urban apartment options tailored for occupants requiring immediate office and medical center proximity.',
    link: '/areas/bin-mahmoud/',
  },
  {
    h3: 'Al Wakra',
    text: 'Excellent suburban community homes and multi-bedroom options positioned well outside dense downtown core congestion.',
    link: '/areas/al-wakra/',
  },
  {
    h3: 'Al Aziziya',
    text: 'Family-focused independent compound villas and rental options flanking popular commercial avenues and schools.',
    link: '/areas/al-aziziya/',
  },
  {
    h3: 'Old Airport',
    text: 'Character-rich, affordable property layouts and strategic flat shares along the historic Al Matar Al Qadeem transit paths.',
    link: '/areas/old-airport/',
  },
  {
    h3: 'Umm Salal',
    text: 'Integrated budget housing options serving the extensive Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn sectors seamlessly.',
    link: '/areas/umm-salal/',
  },
  {
    h3: 'Al Kharaitiyat',
    text: 'Exceptionally quiet northern residential layout spaces perfectly suited for extended family lifestyle setups.',
    link: '/areas/al-kharaitiyat/',
  },
]

const areaCardsAr = [
  {
    h3: 'الدوحة',
    text: 'تغطية شاملة لوسط الدوحة والمناطق التجارية الرئيسية.',
    link: '/areas/doha/',
  },
  {
    h3: 'السد',
    text: 'شقق راقية ووحدات تجارية قرب محطات المترو والمراكز الحيوية.',
    link: '/areas/al-sadd/',
  },
  {
    h3: 'بن محمود',
    text: 'خيارات سكنية مركزية قريبة من العيادات والمراكز التجارية.',
    link: '/areas/bin-mahmoud/',
  },
  {
    h3: 'الوكرة',
    text: 'إسكان مجتمعي عائلي هادئ خارج نطاق الدوحة.',
    link: '/areas/al-wakra/',
  },
  {
    h3: 'العزيزية',
    text: 'عقارات نشطة قرب الطرق التجارية والمجمعات العائلية.',
    link: '/areas/al-aziziya/',
  },
  {
    h3: 'المطار القديم',
    text: 'عقارات راسخة ووحدات تجارية على طرق المطار القديم.',
    link: '/areas/old-airport/',
  },
  {
    h3: 'أم صلال',
    text: 'إسكان اقتصادي يشمل منطقة أم صلال الكبرى.',
    link: '/areas/umm-salal/',
  },
  {
    h3: 'الخريطيات',
    text: 'مجمعات سكنية هادئة في الشمال للعائلات الكبيرة.',
    link: '/areas/al-kharaitiyat/',
  },
]


// ─── S9 Core Values cards ─────────────────────────────────────────────────────
const coreValues = [
  {
    h3: 'Uncompromising Clarity',
    text: 'Eliminating vague property descriptions and hidden fees by keeping all leasing interactions fundamentally honest and direct.',
    icon: ShieldCheck,
  },
  {
    h3: 'Operational Reliability',
    text: 'Serving as a dependable point of support for our clients, providing verified real-time property metadata and reliable assistance.',
    icon: CheckCircle2,
  },
  {
    h3: 'Hyper-Localized Mastery',
    text: 'Deploying deep neighborhood knowledge to protect consumers from choosing poorly connected or mispriced rental spaces.',
    icon: Globe,
  },
  {
    h3: 'Continuous Client Alignment',
    text: 'Adapting our portfolio deployment strategy dynamically to fit the evolving personal and operational business budgets of our users.',
    icon: Star,
  },
]


export function AboutPage() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const rentalFocusTexts = t('about.rentalFocus.cards', { returnObjects: true }) as Array<{title: string, text: string}>
  const trustTexts = t('about.trust.cards', { returnObjects: true }) as Array<{title: string, text: string}>
  const audienceTexts = t('about.audience.cards', { returnObjects: true }) as Array<{title: string, text: string}>
  const processStepsData = t('about.process.steps', { returnObjects: true }) as Array<{num: string, h3: string, desc: string}>
  const coreValueTexts = t('about.values.cards', { returnObjects: true }) as Array<{title: string, text: string}>
  const faqItems = t('about.faq.items', { returnObjects: true }) as Array<{q: string, a: string}>
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <title>About Dania Real Estate | Property Management Experts in Doha</title>
      <meta name="description" content="Discover Dania Real Estate, a certified property management company in Doha, Qatar. We provide trusted, transparent leasing solutions for apartments, villas, and commercial shops." />
      {/* ── S1 Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Typography + CTAs + Trust Points */}
          <Reveal direction="left">
            <p className="text-lime font-semibold text-sm tracking-widest uppercase mb-3">
              {t('about.hero.eyebrow')}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              {t('about.hero.h1')}
            </h1>
            <p className="text-white/80 text-lg mb-3 max-w-lg">
              {t('about.hero.subtitle')}
            </p>
            <p className="text-white/65 text-base mb-8 max-w-lg">
              {t('about.hero.p')}
            </p>
            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/apartments-for-rent/"
                className="bg-lime text-forest px-7 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {t('about.hero.primaryBtn')}
              </Link>
              <Link
                to="/contact-us/"
                className="flex items-center gap-2 border border-white/40 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                {t('about.hero.secondaryBtn')} <ArrowRight size={14} />
              </Link>
            </div>
            {/* Trust Points */}
            <ul className="space-y-3">
              {(isAr ? [
                'خبراء إيجار ميدانيون نشطون في وسط الدوحة والمناطق المحيطة بها.',
                'محافظ شاملة للمنازل العائلية والعقارات التجارية.',
                'تواصل مباشر وشفاف عبر قنوات الدعم الرقمي المباشرة.',
              ] : [
                'On-ground leasing experts active across central Doha and outer municipalities.',
                'Comprehensive portfolio setups for both family homes and enterprise entities.',
                'Transparent direct communications via live digital assistance desks.',
              ]).map((point) => (
                <li key={point} className="flex items-start gap-2 text-white/75 text-sm">
                  <CheckCircle2 size={16} className="text-lime mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Right: Modern Doha tower photo */}
          <Reveal direction="right" delay={150}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/about-dania-real-estate-qatar.webp"
                alt="About Dania Real Estate property management company corporate headquarters at Al Muftah Plaza on Al Rayyan Road Doha Qatar."
                className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
              {/* floating badge */}
              <div className="absolute bottom-5 left-5 bg-lime text-forest font-extrabold text-sm px-5 py-2.5 rounded-2xl shadow-lg">
                {isAr ? 'إدارة عقارات متميزة — الدوحة' : 'Premier Property Management — Doha'}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S2 Company Introduction ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8 text-center">
              {isAr ? 'من نحن' : 'Who We Are'}
            </h2>
          </Reveal>
          <div className="max-w-3xl mx-auto space-y-5">
            <Reveal delay={100}>
              <p className="text-ink-muted leading-relaxed text-base">
                {isAr
                  ? 'دانية للعقارات (شركة دانية للعقارات) هي شركة إدارة عقارات متكاملة تأسست خصيصاً لتلبية احتياجات المستأجرين والشركات في قطر. مبنية على ركائز الشفافية السوقية والذكاء المحلي للإيجار، نعمل شريكاً مخصصاً للمقيمين المحليين والمغتربين الدوليين والكيانات المؤسسية وأصحاب الأعمال الطموحين.'
                  : (<>Dania Real Estate (<span className="font-medium text-ink" dir="rtl">شركة دانية للعقارات</span>) is a comprehensively structured property management company in Doha, Qatar. Built on the foundational pillars of market transparency and local leasing intelligence, we operate as a dedicated partner for local residents, international expatriates, corporate entities, and ambitious business owners.</>)}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-ink-muted leading-relaxed text-base">
                {isAr
                  ? 'تجاوز تركيزنا المتخصص الطبقات المرهقة من التعقيدات المرتبطة بسوق الإيجارات في قطر. من خلال تقديم مصفوفات التوافر في الوقت الفعلي ورؤى جولات التفتيش الموثقة وتسعير غير مضخوم تماماً، نجسر الفجوة بين عرض الأصول الإيجارية عالية الجودة والطلب الاستهلاكي المتطور.'
                  : 'Our specialized focus bypasses the stressful layers of traditional real estate browsing. By presenting real-time availability matrices, verified walk-through insights, and completely uninflated pricing indexation, we bridge the gap between quality rental asset supply and evolving consumer demand.'}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-ink-muted leading-relaxed text-base">
                {isAr
                  ? 'ننطلق من مكاتبنا المؤسسية في شارع الريان، لنقدم دعماً مباشراً يتجاوز الوساطة العقارية التقليدية. تمتد محفظتنا عبر مراكز سكنية حضرية عالية الكثافة ومجمعات عائلية خاصة فاخرة وإسكانات عمالية ملتزمة بالمواصفات ومناطق تجارية عالية الحركة.'
                  : 'Operating from our corporate offices on Al Rayyan Road, our localized property management portfolio spans across high-density urban residential hubs, premium private family compounds, compliant logistical staff accommodations, and high-footfall commercial zones.'}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── S3 Rental Focus ──────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3 text-center">
              {t('about.rentalFocus.h2')}
            </h2>
            <p className="text-ink-muted text-center mb-10 max-w-2xl mx-auto">
              {t('about.rentalFocus.subtitle')}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rentalFocusCards.map((card, i) => {
              const Icon = card.icon
              const isAccent = i === 0
              return (
                <Reveal key={card.h3} delay={i * 80}>
                  <div
                    className={`rounded-2xl border p-6 flex flex-col h-full transition-shadow hover:shadow-md ${
                      isAccent
                        ? 'bg-forest border-forest text-white'
                        : 'bg-white border-border'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                        isAccent ? 'bg-lime/20' : 'bg-lime'
                      }`}
                    >
                      <Icon size={20} className={isAccent ? 'text-lime' : 'text-forest'} />
                    </div>
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        isAccent ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {rentalFocusTexts[i]?.title ?? card.h3}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed flex-1 mb-4 ${
                        isAccent ? 'text-white/75' : 'text-ink-muted'
                      }`}
                    >
                      {rentalFocusTexts[i]?.text ?? card.text}
                    </p>
                    <Link
                      to={card.link}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                        isAccent
                          ? 'text-lime hover:text-lime-light'
                          : 'text-forest hover:text-forest-mid'
                      } transition-colors`}
                    >
                      {isAr ? 'عرض العقارات' : 'View listings'} <ArrowRight size={14} />
                    </Link>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S4 Why Clients Choose Us ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3 text-center">
              {t('about.trust.h2')}
            </h2>
            <p className="text-ink-muted text-center mb-10 max-w-2xl mx-auto">
              {isAr
                ? 'التعامل مع منظومة شركات العقارات في قطر يستلزم شريكاً موثوقاً مدعوماً بخبرة ميدانية قابلة للتحقق ودقة صارمة في القوائم واستجابة فورية للسوق.'
                : 'Navigating the real estate companies in Qatar ecosystem requires a partner backed by verifiable field experience, rigorous listing accuracy, and immediate market responsiveness.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trustCards.map((card, i) => {
              const Icon = card.icon
              const isAccent = i === 1
              return (
                <Reveal key={card.h3} delay={i * 80}>
                  <div
                    className={`rounded-2xl border p-6 h-full transition-shadow hover:shadow-md ${
                      isAccent
                        ? 'bg-forest border-forest text-white'
                        : 'bg-white border-border'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                        isAccent ? 'bg-lime/20' : 'bg-lime'
                      }`}
                    >
                      <Icon size={20} className={isAccent ? 'text-lime' : 'text-forest'} />
                    </div>
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        isAccent ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {trustTexts[i]?.title ?? card.h3}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isAccent ? 'text-white/75' : 'text-ink-muted'
                      }`}
                    >
                      {trustTexts[i]?.text ?? card.text}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S5 Who We Support ────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10 text-center">
              {t('about.audience.h2')}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audienceCards.map((card, i) => {
              const Icon = card.icon
              const isAccent = i === 2
              return (
                <Reveal key={card.h3} delay={i * 80}>
                  <div
                    className={`rounded-2xl border p-6 h-full transition-shadow hover:shadow-md ${
                      isAccent
                        ? 'bg-forest border-forest'
                        : 'bg-white border-border'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                        isAccent ? 'bg-lime/20' : 'bg-lime'
                      }`}
                    >
                      <Icon size={20} className={isAccent ? 'text-lime' : 'text-forest'} />
                    </div>
                    <h3
                      className={`font-bold text-base mb-2 ${
                        isAccent ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {audienceTexts[i]?.title ?? card.h3}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isAccent ? 'text-white/75' : 'text-ink-muted'
                      }`}
                    >
                      {audienceTexts[i]?.text ?? card.text}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S6 Areas ─────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3 text-center">
              {t('about.areas.h2')}
            </h2>
            <p className="text-ink-muted text-center mb-10 max-w-2xl mx-auto">
              {t('about.areas.subtitle')}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? areaCardsAr : areaCards).map((card, i) => (
              <Reveal key={card.h3} delay={i * 60}>
                <div className="bg-white border border-border rounded-2xl p-5 h-full flex flex-col hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-ink text-base mb-2">{card.h3}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1 mb-4">{card.text}</p>
                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-forest-mid transition-colors bg-lime/20 hover:bg-lime/30 px-3 py-1.5 rounded-full w-fit"
                  >
                    {isAr ? 'عرض المنطقة' : 'View area'} <ArrowRight size={12} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── S7 Rental Process ────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <ProcessSteps
          title={t('about.process.h2')}
          steps={processStepsData}
        />
      </section>

      {/* ── S8 Our Approach ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-6 text-center">
              {t('about.approach.h2')}
            </h2>
          </Reveal>
          <div className="max-w-3xl mx-auto">
            <Reveal delay={100}>
              <p className="text-ink-muted leading-relaxed mb-5">
                {t('about.approach.p1')}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-ink-muted leading-relaxed mb-8">
                {t('about.approach.p2')}
              </p>
            </Reveal>
            {/* Highlight Box */}
            <Reveal delay={300}>
              <div className="border-l-4 border-forest bg-surface-low rounded-r-2xl p-6">
                <h3 className="font-bold text-ink text-lg mb-2">{isAr ? 'هل تحتاج إلى حالة المحفظة الحالية؟' : 'Need Current Portfolio Status?'}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {isAr
                    ? 'أرسل لنا أهدافك المنطقية ونطاقات ميزانيتك وأنواع العقارات المفضلة لديك، وسنوفر لك بيانات المخزون الحالي المتاح فوراً.'
                    : 'Forward your exact neighborhood targets, budget ranges, and ideal property formats directly to our team. We will generate a matching live property list within minutes.'}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── S9 Core Values ───────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10 text-center">
              {t('about.values.h2')}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((val, i) => {
              const Icon = val.icon
              const isAccent = i === 0
              return (
                <Reveal key={val.h3} delay={i * 80}>
                  <div
                    className={`rounded-2xl border p-6 h-full transition-shadow hover:shadow-md ${
                      isAccent
                        ? 'bg-forest border-forest'
                        : 'bg-white border-border'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                        isAccent ? 'bg-lime/20' : 'bg-lime'
                      }`}
                    >
                      <Icon size={20} className={isAccent ? 'text-lime' : 'text-forest'} />
                    </div>
                    <h3
                      className={`font-bold text-base mb-2 ${
                        isAccent ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {coreValueTexts[i]?.title ?? val.h3}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isAccent ? 'text-white/75' : 'text-ink-muted'
                      }`}
                    >
                      {coreValueTexts[i]?.text ?? val.text}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S10 FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10 text-center">
              {t('about.faq.h2')}
            </h2>
          </Reveal>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={faq.q} delay={i * 60}>
                  <div className="bg-white border border-border rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-surface-low transition-colors"
                      aria-expanded={isOpen}
                    >
                      <h3 className="font-semibold text-ink text-sm leading-snug">{faq.q}</h3>
                      <ChevronDown
                        size={18}
                        className={`text-forest shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="px-6 pb-5 text-sm text-ink-muted leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── S11 Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-surface-low">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <div className="bg-lime rounded-3xl px-8 py-14 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
                {t('about.cta.h2')}
              </h2>
              <p className="text-forest/75 mb-8 max-w-xl mx-auto leading-relaxed">
                {t('about.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-forest text-white px-8 py-4 rounded-full font-bold text-base hover:bg-forest-mid transition-colors"
                >
                  <MessageCircle size={18} />
                  {t('about.cta.primary')}
                </a>
                <Link
                  to="/contact-us/"
                  className="inline-flex items-center justify-center gap-2 border-2 border-forest text-forest px-8 py-4 rounded-full font-bold text-base hover:bg-forest hover:text-white transition-colors"
                >
                  {t('about.cta.secondary')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
