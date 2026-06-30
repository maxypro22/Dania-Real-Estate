import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown, Store, Briefcase, Wrench, TrendingUp, Users, Eye, Truck, LayoutGrid, FileText, ShieldCheck, Wifi, Zap, Star, Building2 } from 'lucide-react'
import { ProcessSteps } from '@/components/shared/ProcessSteps'
import { usePageSchema } from '@/components/shared/Seo'
import { faqPageSchema } from '@/lib/seo'


/* â"€â"€â"€ FAQ Accordion â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
function FaqAccordion() {
  const { t } = useTranslation()
  const shopFaqs = t('shops.faqs', { returnObjects: true }) as Array<{q: string, a: string}>
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {shopFaqs.map((faq, i) => (
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

/* â"€â"€â"€ Page component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
export function ShopsPage() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const shopFaqs = t('shops.faqs', { returnObjects: true }) as Array<{q: string, a: string}>
  usePageSchema([faqPageSchema(shopFaqs)])

  return (
    <>
      <title>Shops for Rent in Doha | Retail Spaces & Storefronts Qatar</title>
      <meta name="description" content="Source premium shops for rent in Doha and greater Qatar. Explore high-footfall retail storefronts, showrooms, and shell-and-core commercial spaces with direct WhatsApp support." />
      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S1 — HERO
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="bg-forest text-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <Reveal direction="up" delay={0}>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {t('shops.h1')}
              </h1>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h3 className="text-lime text-lg font-semibold max-w-2xl mb-5 leading-snug">
                {t('shops.subtitle')}
              </h3>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p className="text-white/70 text-base max-w-3xl mb-8 leading-relaxed">
                {t('shops.p')}
              </p>
            </Reveal>
            <Reveal direction="up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-lime text-forest font-bold px-7 py-3.5 rounded-full text-sm hover:bg-lime/90 transition-colors"
                >
                  {t('shops.primaryBtn')}
                </a>
                <Link
                  to="/contact-us/"
                  className="inline-flex items-center justify-center bg-white/15 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white/25 transition-colors backdrop-blur-sm"
                >
                  {t('shops.secondaryBtn')}
                </Link>
              </div>
            </Reveal>
            <Reveal direction="up" delay={400}>
              <div className="flex flex-col gap-2">
                {(t('shops.trust', { returnObjects: true }) as string[]).map(tp => (
                  <span key={tp} className="flex items-start gap-2 text-white/70 text-sm">
                    <CheckCircle2 size={15} className="text-lime shrink-0 mt-0.5" />
                    {tp}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal direction="right" delay={200}>
            <div className="relative pb-6 lg:pb-0">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img src="/shops-for-rent-doha-qatar-dania-real-estate.webp" alt="Verified high-exposure commercial shops for rent in Doha Qatar by Dania Real Estate." className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">{t('shops.badge')}</div>
              <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">{isAr ? 'بدون عمولة' : 'Zero Commission'}</div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S2 — OVERVIEW
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="bg-surface-low py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'تأجير المحلات التجارية للتجزئة والأعمال' : 'Commercial Shop Rentals for Retail and Business Use'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal direction="up" delay={0}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'يُعدّ البحث عن محل تجاري قراراً استراتيجياً بالغ الأهمية، إذ تؤثر متغيرات كعرض الواجهة وكثافة المشاة وسهولة وصول المركبات وطبيعة المستأجرين المجاورين تأثيراً مباشراً على إيراداتك اليومية. وعلى خلاف الإيجار السكني التقليدي، يجب أن تكون المساحة التجارية أداةً تسويقية فعّالة لعلامتك التجارية، مع الامتثال لمعايير السلامة الصارمة وإرشادات الدفاع المدني.'
                  : 'Sourcing a commercial shop is a highly strategic business decision where variables like facade width, pedestrian flow, vehicle accessibility, and neighboring tenant profiles directly impact your daily revenue generation. Unlike standard residential leasing, a retail space must serve as a functional marketing asset for your brand while complying with strict corporate safety standards and Civil Defense design guidelines.'}
              </p>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'تُزيل دانية للعقارات عنصر التخمين من عملية الحصول على العقارات التجارية. نرشد مجموعات التجزئة المؤسسية ورجال الأعمال المحليين ومشغّلي الخدمات خلال عملية تقييم الخيارات استناداً إلى التركيبة السكانية المستهدفة وتوافر مواقف السيارات والمتطلبات التقنية (كالأحمال الكهربائية لعمليات المطاعم والمقاهي) وإمكانيات التخطيط الإنشائي.'
                  : 'Dania Real Estate eliminates guesswork from commercial property procurement. We guide corporate retail groups, local entrepreneurs, and service operators through the process of evaluating options based on targeted demographics, parking availability, technical requirements (such as electrical loads for F&B operations), and structural layout potential.'}
              </p>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'يختص هذا الدليل المباشر حصراً بالواجهات التجارية على مستوى الشارع وصالات العرض ووحدات المجمعات التجارية. وتُدار العقارات السكنية والمكاتب المؤسسية والمساحات الصناعية المتخصصة للقوى العاملة ضمن أدلة مستقلة ومخصصة.'
                  : 'This live directory focuses exclusively on street-level storefronts, showrooms, and shopping strip units. Residential properties, corporate offices, and specialized industrial workforce spaces are managed within separate dedicated directories to avoid keyword cross-contamination.'}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S3 — WHO THIS PAGE IS FOR
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">
              {isAr ? 'من يحتاج إلى دعم استئجار المحلات؟' : 'Who Needs Shop Rental Support?'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr ? 'يعمل مكتبنا الاستشاري التجاري مباشرةً مع مشغّلي الأعمال المتنوعين لتأمين مواقع ذات ظهور عالٍ تدعم نمو المبيعات النشط.' : 'Our commercial advisory desk works directly with diverse business operators to secure high-visibility locations that support active sales growth.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {(isAr ? [
              {
                icon: Store,
                h3: 'تجار التجزئة المستقلون',
                desc: 'للأعمال التجارية التي تتعامل مع المستهلكين مباشرةً وتحتاج إلى واجهات على مستوى الشارع بظهور عالٍ وواجهات زجاجية واضحة ولافتات بارزة.',
                accent: true,
              },
              {
                icon: TrendingUp,
                h3: 'رواد الأعمال الديناميكيون',
                desc: 'لمؤسسي الأعمال الذين يطلقون مفاهيم تجزئة جديدة أو بوتيكات محلية أو مقاهٍ متخصصة أو منافذ خدمات استهلاكية متخصصة.',
                accent: false,
              },
              {
                icon: Wrench,
                h3: 'مزودو الخدمات الحديثة',
                desc: 'للوكالات والعيادات وصالونات التجميل والمستشارين الذين يحتاجون إلى حضور فعلي سهل الوصول لاستقبال العملاء.',
                accent: false,
              },
              {
                icon: Briefcase,
                h3: 'العلامات التجارية الامتيازية المتوسعة',
                desc: 'للعلامات التجارية الإقليمية والدولية التي تتوسع عبر حلقات التجزئة البارزة في الدوحة والشوارع التجارية الرئيسية.',
                accent: false,
              },
              {
                icon: Users,
                h3: 'أصحاب الأعمال الصغيرة',
                desc: 'للشركات الناشئة المحلية وأصحاب الأعمال التجارية الباحثين عن وحدات تجارية عملية بتكاليف تشغيلية منخفضة.',
                accent: false,
              },
            ] : [
              {
                icon: Store,
                h3: 'Independent Retailers',
                desc: 'For consumer-facing businesses requiring high-visibility street-level exposure, clear glass facades, and prominent signage placement.',
                accent: true,
              },
              {
                icon: TrendingUp,
                h3: 'Dynamic Entrepreneurs',
                desc: 'For business founders launching new retail concepts, local boutiques, niche cafes, or specialized consumer service outlets.',
                accent: false,
              },
              {
                icon: Wrench,
                h3: 'Modern Service Providers',
                desc: 'For agencies, clinics, salons, or consultants needing an easily accessible physical footprint for client walkthroughs.',
                accent: false,
              },
              {
                icon: Briefcase,
                h3: 'Expanding Franchise Brands',
                desc: 'For regional and international retail brands scaling their footprints across prominent Doha retail loops and high-street strips.',
                accent: false,
              },
              {
                icon: Users,
                h3: 'Small Business Operators',
                desc: 'For localized startups and trade business owners looking for budget-conscious, highly practical shop units with low operational overhead.',
                accent: false,
              },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80} direction="up">
                <div
                  className={`rounded-2xl p-6 h-full border transition-shadow hover:shadow-md ${
                    card.accent
                      ? 'bg-forest border-forest text-white'
                      : 'bg-white border-border'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                      card.accent ? 'bg-lime' : 'bg-lime-light'
                    }`}
                  >
                    <card.icon size={18} className={card.accent ? 'text-forest' : 'text-forest'} />
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>
                    {card.h3}
                  </h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/75' : 'text-ink-muted'}`}>
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S4 — WHAT BUSINESSES LOOK FOR
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="bg-surface-low py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">
              {isAr ? 'الأولويات الرئيسية عند استئجار محل في الدوحة' : 'Key Priorities for Shops for Rent in Doha'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr ? 'يجب أن يتكامل الموقع التجاري الناجح مع سير عملياتك اليومية ويرحّب لوجستياً بقاعدة عملائك المستهدفة. راجع هذه النماذج الأساسية لتخطيط التجزئة قبل تأمين مساحتك:' : 'A successful retail placement must complement your daily operational workflows and logistically welcome your target customer base. Review these core retail layout models before securing your space:'}
            </p>
          </Reveal>

          {/* Comparison table */}
          <Reveal direction="up" delay={150}>
            <div className="overflow-x-auto mb-12 rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-forest text-white">
                    <th className="text-left px-5 py-4 font-semibold w-1/3">{isAr ? 'نوع التنسيق التجاري' : 'Retail Format Type'}</th>
                    <th className="text-left px-5 py-4 font-semibold w-1/3">{isAr ? 'واجهة على مستوى الشارع' : 'Street-Level Storefront'}</th>
                    <th className="text-left px-5 py-4 font-semibold w-1/3">{isAr ? 'وحدة في مجمع تجاري' : 'Commercial Complex Unit'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(isAr ? [
                    ['مستوى الظهور', 'أقصى تعرض مباشر على الطريق الرئيسي أو الشارع التجاري', 'تخطيط داخلي يعتمد على حركة زوار المجمع'],
                    ['إمكانية اللافتات', 'علامة تجارية خارجية مستقلة على واجهة المبنى', 'لوحات دليل المجمع الموحدة'],
                    ['تكامل المواقف', 'مواقف أمامية على الرصيف أو مسارات خدمة مباشرة للعملاء', 'طوابق مواقف مركزية في القبو أو مشتركة'],
                    ['حرية التجهيز', 'مرونة عالية لتحويلات العلامة التجارية المخصصة', 'تخضع لقواعد التصميم المعماري للمجمع التجاري'],
                    ['الأنسب لـ', 'مراكز الخدمات عالية الحجم وصالات العرض ومطاعم F&B', 'العلامات التجارية المتخصصة والخدمات النوعية وتجزئة المنافذ'],
                  ] : [
                    ['Visibility Level', 'Maximum direct main road or high-street exposure', 'Internalized layout dependent on complex footfall'],
                    ['Signage Potential', 'Independent exterior building facade branding', 'Standardized complex directory signage plates'],
                    ['Parking Integration', 'Direct front curbside or service lane customer spaces', 'Centralized basement or shared block parking decks'],
                    ['Fit-out Freedom', 'High flexibility for custom brand transformations', 'Governed by shopping complex architectural rules'],
                    ['Best Suited For', 'High-volume service hubs, showrooms, F&B outlets', 'Boutique brands, specialty services, niche retail'],
                  ]).map(([label, col1, col2], i) => (
                    <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-low'}>
                      <td className="px-5 py-4 font-semibold text-ink">{label}</td>
                      <td className="px-5 py-4 text-ink-muted">{col1}</td>
                      <td className="px-5 py-4 text-ink-muted">{col2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Feature cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              {
                icon: Eye,
                h3: 'ظهور عالٍ وواجهة على الطريق',
                desc: 'تأمين عقارات تتميز بواجهات زجاجية واسعة وخطوط رؤية واضحة من الشوارع الرئيسية وإمكانية لافتات خارجية عالية.',
                accent: true,
              },
              {
                icon: Truck,
                h3: 'وصول سلس للعملاء والتوصيل',
                desc: 'إيلاء الأولوية للمواقع التي تحتوي على مواقف خاصة بالعملاء وروابط قريبة بالنقل العام وخيارات تحميل خلفية عملية.',
                accent: false,
              },
              {
                icon: LayoutGrid,
                h3: 'مخططات طوابق مناسبة للأعمال',
                desc: 'اختر من بين وحدات مفتوحة جاهزة للتجهيز أو تخطيطات متعددة المستويات أو مساحات تجزئة مجهّزة مسبقاً تناسب نموذج عملك.',
                accent: false,
              },
              {
                icon: FileText,
                h3: 'حماية عملية لعقد الإيجار التجاري',
                desc: 'التعامل مع شروط العقود المؤسسية بثقة مع توجيه واضح بشأن فترات سماح التجهيز وضمان تجديد الإيجار وإعداد المرافق.',
                accent: false,
              },
            ] : [
              {
                icon: Eye,
                h3: 'High Visibility and Road Frontage',
                desc: 'Secure properties featuring expansive glass displays, clear lines of sight from primary avenues, and high exterior signage potential.',
                accent: true,
              },
              {
                icon: Truck,
                h3: 'Seamless Customer and Delivery Access',
                desc: 'Prioritize locations with dedicated client parking layouts, close public transport connections, and functional rear loading options.',
                accent: false,
              },
              {
                icon: LayoutGrid,
                h3: 'Business-Friendly Floor Plans',
                desc: 'Select from open-plan shell-and-core units, multi-level mezzanine layouts, or pre-fitted retail spaces matching your operational model.',
                accent: false,
              },
              {
                icon: FileText,
                h3: 'Practical Commercial Lease Protection',
                desc: 'Navigate corporate contract terms confidently with clear guidance on fit-out grace periods, lease renewal security, and utility setups.',
                accent: false,
              },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80} direction="up">
                <div
                  className={`rounded-2xl p-6 h-full border transition-shadow hover:shadow-md ${
                    card.accent ? 'bg-forest border-forest' : 'bg-white border-border'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.accent ? 'bg-lime' : 'bg-lime-light'}`}>
                    <card.icon size={18} className="text-forest" />
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>
                    {card.h3}
                  </h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/75' : 'text-ink-muted'}`}>
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S5 — SHOP TYPES WE SUPPORT
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'خيارات المحلات التجارية لمختلف احتياجات الأعمال' : 'Commercial Shop Options for Different Business Needs'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              {
                icon: Building2,
                h3: 'واجهات تجزئة على الشارع الرئيسي',
                desc: 'مساحات تجارية ذات تعرض عالٍ تقع على الممرات البلدية النشطة، مصممة للتعامل مع المستهلكين بحجم كبير.',
                accent: true,
              },
              {
                icon: Store,
                h3: 'وحدات بوتيك مدمجة',
                desc: 'مساحات تجارية بأحجام فعّالة ومناسبة للميزانية، مثالية للشركات الناشئة والخدمات المحلية أو مفاهيم التجزئة منخفضة التكاليف.',
                accent: false,
              },
              {
                icon: Wrench,
                h3: 'مساحات تجارية موجهة للخدمات',
                desc: 'تخطيطات مفتوحة للزيارة المباشرة، مثالية للعيادات ووكالات السفر ونقاط البنوك وصالونات التجميل ومراكز دعم العملاء.',
                accent: false,
              },
              {
                icon: Star,
                h3: 'تخطيطات صالات عرض فاخرة',
                desc: 'مساحات تجزئة واسعة تتميز بأسقف عالية ومساحات عرض كبيرة وموقع متميز للعلامات التجارية الراقية.',
                accent: false,
              },
            ] : [
              {
                icon: Building2,
                h3: 'Main Street Retail Storefronts',
                desc: 'High-exposure commercial spaces located along active municipal corridors, tailored for high-volume consumer engagement.',
                accent: true,
              },
              {
                icon: Store,
                h3: 'Compact Boutique Units',
                desc: 'Efficiently sized, budget-aware shop spaces perfectly configured for startups, localized services, or low-overhead retail concepts.',
                accent: false,
              },
              {
                icon: Wrench,
                h3: 'Service-Oriented Commercial Spaces',
                desc: 'Functional walk-in layouts ideal for clinics, travel agencies, banking points, salons, or customer support centers.',
                accent: false,
              },
              {
                icon: Star,
                h3: 'Premium Showroom Layouts',
                desc: 'Large-scale commercial retail spaces featuring soaring ceilings, extensive display areas, and premium placement for high-end brands.',
                accent: false,
              },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80} direction="up">
                <div
                  className={`rounded-2xl p-7 h-full border transition-shadow hover:shadow-md ${
                    card.accent ? 'bg-forest border-forest' : 'bg-white border-border'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${card.accent ? 'bg-lime' : 'bg-lime-light'}`}>
                    <card.icon size={18} className="text-forest" />
                  </div>
                  <h3 className={`font-bold text-lg mb-3 ${card.accent ? 'text-white' : 'text-ink'}`}>
                    {card.h3}
                  </h3>
                  <p className={`text-sm leading-relaxed ${card.accent ? 'text-white/75' : 'text-ink-muted'}`}>
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S6 — AREAS COVERAGE
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="bg-surface-low py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'محلات للإيجار في الدوحة والمناطق الرئيسية في قطر' : 'Shops for Rent in Doha and Key Qatar Areas'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {isAr ? 'تتناسب كثافة المشاة ونسب مواقف السيارات وأسعار الإيجار للواجهات التجارية بشكل طبيعي مع أسواقها الفرعية الحضرية. تدير دانية للعقارات خيارات التجزئة التجارية عبر هذه المناطق الاقتصادية الرئيسية:' : 'Pedestrian density, parking ratios, and lease rates for retail storefronts naturally match their urban sub-markets. Dania Real Estate manages commercial retail options across these primary economic zones:'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              {
                h3: 'محلات للإيجار في الدوحة',
                desc: 'فرص تجزئة متميزة وصالات عرض وواجهات على مستوى الشارع في أكثر القطاعات التجارية نشاطاً في وسط الدوحة.',
                href: '/areas/doha/',
                accent: true,
              },
              {
                h3: 'محلات للإيجار في السد',
                desc: 'مواقع تجارية عالية الكثافة تتيح أقصى تعرض للمحترفين من الشركات والمستهلكين المحليين الميسورين.',
                href: '/areas/al-sadd/',
                accent: false,
              },
              {
                h3: 'محلات للإيجار في بن محمود',
                desc: 'مساحات تجزئة حضرية نابضة بالحياة تتميز بحركة مشاة متواصلة وتواصل استراتيجي في منطقة مكتظة بالسكان.',
                href: '/areas/bin-mahmoud/',
                accent: false,
              },
              {
                h3: 'محلات للإيجار في الوكرة',
                desc: 'مساحات تجارية ساحلية سريعة النمو ووحدات تجزئة تخدم سوقاً استهلاكياً محلياً كبيراً ومتسارع التوسع.',
                href: '/areas/al-wakra/',
                accent: false,
              },
              {
                h3: 'محلات للإيجار في العزيزية وأبو هامور',
                desc: 'مواقع تجزئة مرغوبة للغاية تقع مباشرةً على شرائط تجارية ضخمة مع تواصل ممتاز بطريق سلوى.',
                href: '/areas/al-aziziya/',
                accent: false,
              },
              {
                h3: 'محلات للإيجار في المطار القديم',
                desc: 'مساحات تجارية تاريخية موثوقة توفر ظهوراً ثابتاً للعملاء على طرق النقل والمرور الرئيسية.',
                href: '/areas/old-airport/',
                accent: false,
              },
              {
                h3: 'محلات للإيجار في أم صلال',
                desc: 'مساحات تجزئة ضاحية ناشئة ووحدات صالات عرض في أم صلال محمد، مثالية للخدمات المجتمعية والعلامات الإقليمية المتوسعة.',
                href: '/areas/umm-salal/',
                accent: false,
              },
              {
                h3: 'محلات للإيجار في الخريطيات',
                desc: 'شوارع تجارية راسخة تتميز بمواقف ممتازة، مصممة لعمليات التجزئة والتجارة الموجهة للعائلات.',
                href: '/areas/al-kharaitiyat/',
                accent: false,
              },
            ] : [
              {
                h3: 'Shops for Rent in Doha',
                desc: "Prime retail opportunities, showrooms, and street-level storefronts positioned across Central Doha's most active commercial sectors.",
                href: '/areas/doha/',
                accent: true,
              },
              {
                h3: 'Shops for Rent in Al Sadd',
                desc: 'High-density commercial street locations offering maximum exposure to corporate professionals and affluent local consumers.',
                href: '/areas/al-sadd/',
                accent: false,
              },
              {
                h3: 'Shops for Rent in Bin Mahmoud',
                desc: 'Vibrant urban retail spaces featuring continuous street footfall and strategic connectivity within a densely populated area.',
                href: '/areas/bin-mahmoud/',
                accent: false,
              },
              {
                h3: 'Shops for Rent in Al Wakra',
                desc: 'Fast-growing coastal commercial spaces and retail units serving a large, rapidly expanding local consumer market.',
                href: '/areas/al-wakra/',
                accent: false,
              },
              {
                h3: 'Shops for Rent in Al Aziziya & Abu Hamour',
                desc: 'Highly sought-after retail locations situated directly along massive commercial strips with outstanding connectivity to Salwa Road.',
                href: '/areas/al-aziziya/',
                accent: false,
              },
              {
                h3: 'Shops for Rent in Old Airport',
                desc: 'Historic, highly reliable commercial spaces offering steady customer visibility along major transportation and transit routes.',
                href: '/areas/old-airport/',
                accent: false,
              },
              {
                h3: 'Shops for Rent in Umm Salal',
                desc: 'Emerging suburban retail spaces and showroom units across Umm Salal Mohammed, ideal for community services and expanding regional brands.',
                href: '/areas/umm-salal/',
                accent: false,
              },
              {
                h3: 'Shops for Rent in Al Kharaitiyat',
                desc: 'Well-established commercial streets featuring excellent parking access, tailored for family-focused retail and trade operations.',
                href: '/areas/al-kharaitiyat/',
                accent: false,
              },
            ]).map((area, i) => (
              <Reveal key={area.h3} delay={i * 60} direction="up">
                <div
                  className={`rounded-2xl p-6 h-full border transition-shadow hover:shadow-md flex flex-col ${
                    area.accent ? 'bg-forest border-forest' : 'bg-white border-border'
                  }`}
                >
                  <h3 className={`font-bold mb-2 text-sm ${area.accent ? 'text-white' : 'text-ink'}`}>
                    {area.h3}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 flex-1 ${area.accent ? 'text-white/75' : 'text-ink-muted'}`}>
                    {area.desc}
                  </p>
                  <Link
                    to={area.href}
                    className={`text-xs font-semibold hover:underline ${area.accent ? 'text-lime' : 'text-forest'}`}
                  >
                    {isAr ? 'عرض العقارات ←' : 'View Properties →'}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S7 — WHY CHOOSE DANIA FOR SHOPS
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">
              {isAr ? 'لماذا تختار دانية للعقارات لاستئجار المحلات' : 'Why Choose Dania Real Estate for Shop Rentals'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr ? 'نُزيل المخاطر التشغيلية من عملية الحصول على العقارات التجارية من خلال ضمان المطابقة الإنشائية الدقيقة وشروط العقود الواضحة والتحقق من التقسيم الإداري.' : 'We eliminate operational risk from commercial property acquisition by ensuring exact structural matching, clear contract terms, and zoning verification.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(isAr ? [
              {
                icon: Briefcase,
                h3: 'فهم عميق للسوق التجاري',
                desc: 'نُصفّي القوائم لنقدم مساحات تتوافق تماماً مع فئة عملك واحتياجاتك المكانية وأهداف حركة الزوار.',
                accent: true,
              },
              {
                icon: Zap,
                h3: 'التحقق من البنية التحتية والمرافق',
                desc: 'يفحص فريقنا مقاييس المرافق الحيوية، بما في ذلك تكوينات الطاقة ثلاثية الأطوار وأنظمة الصرف وإمكانات التهوية قبل توقيع عقد الإيجار.',
                accent: false,
              },
              {
                icon: ShieldCheck,
                h3: 'التقييم المسبق لترخيص البلدية',
                desc: 'نتحقق من صحة عنوان الملكية البلدية مسبقاً لضمان عملية تسجيل ترخيص تجاري سلسة وخالية من المتاعب.',
                accent: false,
              },
              {
                icon: Wifi,
                h3: 'بث مباشر في الوقت الفعلي',
                desc: 'تجاوز قوائم بوابات العقارات القديمة. تواصل مباشرةً عبر واتساب لاستقبال وسائط الواجهة غير المعدّلة وأبعاد المساحة فوراً.',
                accent: false,
              },
            ] : [
              {
                icon: Briefcase,
                h3: 'Deep Commercial Market Insight',
                desc: 'We filter listings to present spaces that align perfectly with your business category, spatial needs, and footfall goals.',
                accent: true,
              },
              {
                icon: Zap,
                h3: 'Infrastructure and Utility Validation',
                desc: 'Our team checks critical utility metrics, including phase-three power configurations, drainage setups, and ventilation potential before you lease.',
                accent: false,
              },
              {
                icon: ShieldCheck,
                h3: 'Baladiya Licensing Pre-Evaluation',
                desc: "We verify the property's municipal title status beforehand to guarantee a smooth, hassle-free commercial license registration process.",
                accent: false,
              },
              {
                icon: Wifi,
                h3: 'Real-Time Direct Media Streams',
                desc: 'Skip outdated online property portal listings. Connect directly via WhatsApp to receive unedited storefront media and space dimensions instantly.',
                accent: false,
              },
            ]).map((card, i) => (
              <Reveal key={card.h3} delay={i * 80} direction="up">
                <div
                  className={`rounded-2xl p-6 h-full border transition-shadow hover:shadow-md ${
                    card.accent ? 'bg-forest border-forest' : 'bg-white border-border'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.accent ? 'bg-lime' : 'bg-lime-light'}`}>
                    <card.icon size={18} className="text-forest" />
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>
                    {card.h3}
                  </h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/75' : 'text-ink-muted'}`}>
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S8 — PROCESS (4 steps)
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="bg-surface-low py-20">
        <ProcessSteps
          title={isAr ? 'كيف تعمل عملية استئجار المحلات لدينا' : 'How Our Shop Rental Process Works'}
          steps={isAr ? [
            {
              num: '01',
              h3: 'قدّم مصفوفة مواصفات التجزئة الخاصة بك',
              desc: 'شارك مفهوم عملك وحلقة الموقع المستهدف والأمتار المربعة المطلوبة واحتياجات المرافق والميزانية الشهرية وتاريخ الإطلاق المستهدف.',
            },
            {
              num: '02',
              h3: 'مطابقة قاعدة البيانات التجارية',
              desc: 'يراجع قسمنا التجاري قواعد البيانات النشطة لاستخراج مواقع التجزئة التي تتوافق مع فئة عملك وأهداف حركة الزوار.',
            },
            {
              num: '03',
              h3: 'تسليم المخططات والوسائط',
              desc: 'راجع الصور الداخلية غير المعدّلة والمخططات وتفاصيل الامتثال البلدي المرسلة مباشرةً إلى جهازك المحمول أو بريدك المؤسسي.',
            },
            {
              num: '04',
              h3: 'معاينة العقار تحت الإشراف',
              desc: 'أكمل جولة شاملة بالوحدة التجارية وتحقق من مواقف السيارات وافحص مناطق وصول التسليم مع مستشار عقاري أول من دانية.',
            },
          ] : [
            {
              num: '01',
              h3: 'Submit Your Retail Specification Matrix',
              desc: 'Share your business concept, target location loop, required square meters, utility needs, monthly budget, and targeted launch date.',
            },
            {
              num: '02',
              h3: 'Commercial Database Matching',
              desc: 'Our commercial division reviews active databases to pull retail locations that align with your business category and footfall targets.',
            },
            {
              num: '03',
              h3: 'Layout and Media Delivery',
              desc: 'Review unedited interior photographs, floor plans, and municipal compliance details sent directly to your mobile device or corporate email.',
            },
            {
              num: '04',
              h3: 'Supervised Property Inspection',
              desc: 'Complete a comprehensive walkthrough of the retail unit, check parking spaces, and inspect delivery access areas with a senior Dania real estate advisor.',
            },
          ]}
        />
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S9 — BUSINESS SUITABILITY
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'اختيار المحل المناسب لعملك' : 'Choosing a Shop That Fits Your Business'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <Reveal direction="up" delay={0}>
                <p className="text-ink-muted leading-relaxed text-sm mb-5">
                  {isAr
                    ? 'نادراً ما تكون مساحة التجزئة الأكثر نجاحاً هي الأغلى أو الأكبر في السوق. تتحقق الكفاءة الحقيقية للتجزئة عندما يتطابق موقع واجهتك مع قاعدة عملائك الأساسية ويوفر مواقف مريحة للزوار ويمنح عملك الإعداد الدقيق للمرافق اللازم لسير العمل اليومي بسلاسة.'
                    : 'The most successful retail space is rarely just the most expensive or largest option on the market. True retail efficiency is achieved when your storefront position matches your core customer base, offers comfortable parking for visitors, and gives your business the exact utility setup required for seamless daily workflows.'}
                </p>
              </Reveal>
              <Reveal direction="up" delay={100}>
                <p className="text-ink-muted leading-relaxed text-sm">
                  {isAr
                    ? 'تحمي دانية للعقارات التدفق النقدي لشركتك من خلال مساعدة فريق المشتريات أو الإدارة لديك في مطابقة المساحات مع نموذج عملك، مما يضمن أن التكاليف الثابتة للإيجار تُترجَم مباشرةً إلى أقصى تعرض للعلامة التجارية وتحويل عالٍ للعملاء.'
                    : 'Dania Real Estate protects your corporate cash flow by assisting your procurement or management team in matching spaces with your operational model—ensuring your fixed lease overhead translates directly into maximum brand exposure and high customer conversion.'}
                </p>
              </Reveal>
            </div>
            <Reveal direction="left" delay={150}>
              <div className="bg-forest rounded-2xl p-8 text-white">
                <h3 className="font-bold text-xl mb-3">
                  {isAr ? 'هل تبحث عن مساحة تجزئة بتعرض عالٍ في الدوحة؟' : 'Looking for a High-Exposure Retail Space in Doha?'}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {isAr
                    ? 'تجنّب الإعلانات المبوبة غير الموثوقة والجولات غير المنسقة. أرسل مفهوم التجزئة الدقيق لديك وأبعاد المساحة المطلوبة ومعايير الميزانية مباشرةً إلى مكتب الإيجار التجاري لدينا اليوم للحصول على محفظة عقارية فورية ومخصصة.'
                    : 'Avoid unverified online classifieds and uncoordinated tours. Send your exact retail concept, required space dimensions, and budget parameters directly to our commercial leasing desk today for an immediate, customized property portfolio.'}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S10 — FAQ
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="bg-surface-low py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              Shop Rental FAQs
            </h2>
          </Reveal>
          <FaqAccordion />
        </div>
      </section>

      {/* â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
          S11 — FINAL CTA (lime card)
      â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <Reveal direction="up">
          <div className="relative bg-lime rounded-3xl px-8 py-16 text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-forest/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-forest/10 rounded-full pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
                {t('shops.ctaH2')}
              </h2>
              <p className="text-forest/70 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                {isAr
                  ? 'احمِ ظهور علامتك التجارية في السوق وضمان حركة عملاء ثابتة وأمّن مستقبلك التجاري. تجنّب الإعلانات المبوبة القديمة والبحث غير المنسق. تواصل مباشرةً مع متخصصي العقارات التجارية في دانية للعقارات اليوم للحصول على محفظة واجهات موثّقة ومتوافقة مع ميزانيتك ومبنية حول أهداف عملك.'
                  : "Protect your brand's market visibility, ensure consistent customer traffic, and secure your commercial future. Avoid outdated online classifieds and uncoordinated searches. Connect directly with the commercial real estate specialists at Dania Real Estate today to receive a vetted, budget-aligned storefront portfolio built around your business goals."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-forest text-white font-bold px-8 py-4 rounded-full text-base hover:bg-forest/90 transition-colors"
                >
                  {t('shops.ctaPrimary')}
                </a>
                <Link
                  to="/contact-us/"
                  className="inline-flex items-center justify-center bg-white text-ink font-bold px-8 py-4 rounded-full text-base hover:bg-white/90 transition-colors"
                >
                  {t('shops.ctaSecondary')}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

