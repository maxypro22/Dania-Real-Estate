import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import { usePageSchema } from '@/components/shared/Seo'
import { faqPageSchema } from '@/lib/seo'
import {
  CheckCircle2,
  ChevronDown,
  Shield,
  Wifi,
  Car,
  FileText,
  Users,
  Building2,
  DollarSign,
} from 'lucide-react'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { ProcessSteps } from '@/components/shared/ProcessSteps'

// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// STAFF ACCOMMODATION (main) data
// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const staffMainFaqs = [
  {
    q: 'What legally defines standard corporate staff accommodation in Qatar?',
    a: 'Corporate staff accommodation refers to dedicated residential properties leased directly by companies to house their employees, supervisors, or operations teams. These properties must comply with Qatar Ministry of Labor standards and hold valid municipality registration and safety certificates.',
  },
  {
    q: "How does Dania Real Estate ensure a property complies with Qatar's labor housing laws?",
    a: 'Our commercial division explicitly pre-screens properties to verify their active Civil Defense safety approvals, proper municipal zone classifications, and suitability for company lease attestation before presenting them to clients.',
  },
  {
    q: 'Can your team manage high-volume corporate housing requests for large operational projects?',
    a: 'Yes, completely. Dania Real Estate works directly with enterprise procurement teams, providing scalable multi-unit housing portfolios and corporate blocks tailored to support large-scale infrastructure and service mobilizations.',
  },
  {
    q: 'Is a standard corporate lease structure different from a family residential agreement?',
    a: "Yes. Corporate leases are executed directly under your company's commercial registration (CR), require specific occupancy declarations, use customized corporate payment terms, and require direct Baladiya registration to support corporate auditing.",
  },
  {
    q: 'What specific areas are best suited for employee housing requiring daily access to Salwa Road?',
    a: 'Neighborhoods like Al Aziziya, Abu Hamour, and adjacent southern sectors offer ideal logistics setups, granting your corporate transport fleets rapid, direct access to Salwa Road and central industrial zones.',
  },
  {
    q: 'What primary documentation must a company provide to secure a corporate housing contract?',
    a: "Securing a corporate lease requires a valid copy of your Company Commercial Registration (CR), the Signatory Authorization Certificate, a copy of the manager's QID, post-dated corporate cheques for the contract term, and a single-month refundable security deposit.",
  },
]

// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// STAFF VILLAS data
// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const staffVillasFaqs = [
  {
    q: 'What legally defines a staff villa for rent in Qatar?',
    a: 'A staff villa is an independent residential house leased directly by an enterprise or contractor under a Commercial Registration (CR) to house employees, technical teams, or supervisors. These properties must comply with municipal zoning rules and be cleared for corporate staff occupancy.',
  },
  {
    q: 'Can any family villa listing be converted and leased as a staff villa?',
    a: 'No. Properties used for staff housing must align with specific municipal regulations regarding location, capacity limits, and building safety. Our commercial team filters out non-compliant listings to ensure your company avoids regulatory fine exposures.',
  },
  {
    q: 'Do your staff villa options include dedicated parking for company buses and transport vehicles?',
    a: 'Many of our specialized staff villa properties feature large front courtyards, independent gates, or wide access lanes built specifically to hold company transport vans and fleet buses safely. We check these transit metrics before you schedule a physical viewing.',
  },
  {
    q: 'How is the maximum employee capacity calculated for an independent staff villa?',
    a: "Total allowed occupancy depends on the villa's absolute square footage, total bedroom layout, bathroom count, and current municipal rules. Dania Real Estate explicitly confirms these permitted numbers for each property option to ensure your contract remains fully compliant.",
  },
  {
    q: 'Is it possible to request unedited interior walkthrough videos before conducting an on-site property tour?',
    a: 'Yes, completely. To save your procurement team time and protect you from outdated listings, our agents can send current, unedited interior video walk-throughs and detailed layout specifications directly to your WhatsApp.',
  },
  {
    q: 'What core corporate documentation is required to finalize a staff villa lease agreement?',
    a: "Finalizing a corporate lease requires a valid copy of your Company Commercial Registration (CR), the Authorized Signatory Certificate, a copy of the manager's QID, post-dated corporate cheques matching the contract timeline, and a single-month refundable security deposit.",
  },
]

const staffVillasFaqsAr = [
  {
    q: 'ما التعريف القانوني لفيلا الموظفين للإيجار في قطر؟',
    a: 'فيلا الموظفين هي منزل سكني مستقل يستأجره مباشرةً مؤسسة أو مقاول تحت السجل التجاري لإيواء الموظفين أو الفرق الفنية أو المشرفين. يجب أن تمتثل هذه العقارات للوائح التخطيط البلدي وأن تكون مؤهلة للإشغال الشركاتي.',
  },
  {
    q: 'هل يمكن تحويل أي قائمة فيلا عائلية لتُستأجر كفيلا موظفين؟',
    a: 'لا. يجب أن تتوافق العقارات المستخدمة لإسكان الموظفين مع لوائح بلدية محددة تتعلق بالموقع وحدود الطاقة الاستيعابية وسلامة المبنى. يقوم فريقنا التجاري بتصفية القوائم غير المتوافقة لضمان تجنب شركتك للغرامات التنظيمية.',
  },
  {
    q: 'هل تشمل خيارات فلل الموظفين لديكم مواقف مخصصة لحافلات الشركة وسيارات النقل؟',
    a: 'كثير من عقارات فلل الموظفين المتخصصة لدينا تتميز بفناءات أمامية واسعة، وبوابات مستقلة، وممرات وصول عريضة مُصممة خصيصاً لاستيعاب حافلات نقل الشركات وأسطول السيارات بأمان. نتحقق من هذه المقاييس اللوجستية قبل جدولة معاينة ميدانية.',
  },
  {
    q: 'كيف يُحتسب الحد الأقصى لطاقة استيعاب الموظفين في فيلا موظفين مستقلة؟',
    a: 'يعتمد إجمالي الإشغال المسموح به على مساحة الفيلا الإجمالية، ومخطط الغرف الكلي، وعدد الحمامات، والقواعد البلدية الحالية. تؤكد دانية للعقارات صراحةً هذه الأعداد المسموح بها لكل خيار عقاري لضمان بقاء عقدك متوافقاً بالكامل.',
  },
  {
    q: 'هل يمكن طلب مقاطع فيديو جولة داخلية غير معدلة قبل إجراء معاينة ميدانية للعقار؟',
    a: 'نعم، بالتأكيد. لتوفير وقت فريق المشتريات لديك وحمايتك من القوائم القديمة، يمكن لوكلائنا إرسال مقاطع فيديو جولة داخلية حالية وغير معدلة ومواصفات تخطيط تفصيلية مباشرةً إلى واتساب الخاص بك.',
  },
  {
    q: 'ما الوثائق الشركاتية الأساسية المطلوبة لإتمام عقد إيجار فيلا الموظفين؟',
    a: 'يتطلب إتمام عقد إيجار شركاتي نسخة سارية من السجل التجاري للشركة، وشهادة التفويض المعتمدة للتوقيع، وصورة من بطاقة هوية المدير (QID)، وشيكات شركاتية مؤجلة تتوافق مع جدول العقد، وتأمين مبلغ مسترد يعادل شهراً واحداً.',
  },
]

// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Shared FAQ accordion
// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function FaqAccordion({ faqs }: { faqs: typeof staffMainFaqs }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-border rounded-2xl overflow-hidden">
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
      ))}
    </div>
  )
}

// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// STAFF ACCOMMODATION MAIN PAGE
// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function StaffAccommodationMain() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const mainFaqs = t('staff.mainFaqs', { returnObjects: true }) as Array<{q: string, a: string}>
  usePageSchema([faqPageSchema(mainFaqs)])

  return (
    <>
      {/* â"€â"€ SECTION 1: HERO â"€â"€ */}
      <section className="bg-forest text-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Reveal direction="up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                  {t('staff.h1')}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <h3 className="text-lime text-lg md:text-xl font-semibold max-w-2xl mb-4">
                  {t('staff.subtitle')}
                </h3>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/70 text-base max-w-3xl mb-8 leading-relaxed">
                  {t('staff.p')}
                </p>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-lime text-forest font-bold px-7 py-3.5 rounded-full text-sm hover:bg-lime/90 transition-colors"
                  >
                    {t('staff.primaryBtn')}
                  </a>
                  <Link
                    to="/contact-us/"
                    className="inline-flex items-center justify-center bg-white/15 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white/25 transition-colors backdrop-blur-sm"
                  >
                    {t('staff.secondaryBtn')}
                  </Link>
                </div>
              </Reveal>
              <Reveal direction="up" delay={320}>
                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2">
                  {(t('staff.trust', { returnObjects: true }) as string[]).map(tp => (
                    <span key={tp} className="flex items-start gap-2 text-white/60 text-sm max-w-xs">
                      <CheckCircle2 size={14} className="text-lime shrink-0 mt-0.5" />
                      {tp}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img src="/staff-accommodation-doha-qatar-dania-real-estate.webp" alt="Verified corporate staff accommodation buildings for rent in Doha Qatar by Dania Real Estate." className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">{isAr ? 'سكن العمال · قطر' : 'Staff Accommodation · Qatar'}</div>
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">{isAr ? 'جاهز للمؤسسات' : 'Corporate Ready'}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 2: OVERVIEW â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'حلول إسكان عملية للموظفين تلبي احتياجات الأعمال' : 'Practical Staff Housing Solutions for Business Needs'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Reveal direction="up" delay={80}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'يستلزم نشر سكن العمالة في قطر نهجاً مختلفاً تماماً عن الإيجار السكني الأسري المعتاد. تحتاج الشركات الكبرى وشركات الإنشاء ومزودو الخدمات ومجموعات التجزئة إلى بيئات مؤسسية قابلة للتوسع تُعطي الأولوية لإمكانية التنبؤ بالميزانية على المدى البعيد وسهولة تنقل الموظفين اليومي والتوافق الهيكلي مع شهادات السلامة البلدية.'
                  : 'Deploying workforce accommodation in Qatar demands an entirely different approach than standard family residential leasing. Enterprise accounts, construction firms, service providers, and retail groups require scalable corporate settings that prioritize long-term budget predictability, ease of daily employee transit, and structural alignment with municipal safety certificates.'}
              </p>
            </Reveal>
            <Reveal direction="up" delay={160}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'تُبسّط دانية للعقارات عملية شراء العقارات المؤسسية بالعمل كجسر استشاري مباشر لديك. نحلل متطلبات شركتك بناءً على إجمالي أعداد الموظفين ومعاملات الميزانية لكل موظف والقرب من مواقع المشاريع الرئيسية والمتطلبات المحددة لطاقات المطبخ وإعدادات الغسيل.'
                  : "Dania Real Estate simplifies corporate property procurement by acting as your direct advisory bridge. We analyze your company's requirements based on total headcounts, budget parameters per employee, proximity to primary project sites, and specific requirements for kitchen capacities and laundry setups."}
              </p>
            </Reveal>
            <Reveal direction="up" delay={240}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'تعمل صفحة الدليل الرئيسية هذه كإطار واسع لإسكان القوى العاملة متعدد الوحدات. بالنسبة للشركات التي تبحث عن عقارات مستقلة محددة مبنية على مساحات أكبر للفرق التنفيذية أو التقنية، يُرجى زيارة دليل فلل الموظفين الفرعي المخصص أدناه.'
                  : 'This master directory page serves as a broad framework for multi-unit workforce housing. For companies seeking specific independent properties built on larger layouts for executive or technical teams, please visit our dedicated staff villas sub-directory below.'}
              </p>
            </Reveal>
          </div>
          <Reveal direction="up" delay={320}>
            <Link
              to="/staff-accommodation/staff-villas/"
              className="inline-flex items-center justify-center bg-forest text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              {isAr ? 'استكشف فلل الموظفين للإيجار' : 'Explore Staff Villas for Rent'}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ SECTION 3: WHO IS THIS FOR â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'من يحتاج إلى دعم سكن العمال؟' : 'Who Needs Staff Accommodation Support?'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'يُنسّق مكتب تأجيرنا التجاري مباشرةً مع أصحاب المصلحة الرئيسيين في الشركة لضمان التوظيف السلس للفرق والاستمرارية التشغيلية.'
                : 'Our commercial leasing desk coordinates directly with key company stakeholders to ensure smooth team placement and operational continuity.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                h3: isAr ? 'مسؤولو المشتريات المؤسسية' : 'Corporate Procurement Leads',
                desc: isAr
                  ? 'للمديرين التنفيذيين المكلفين بإدارة ميزانيات الإسكان المؤسسي والتحقق من صكوك الملاك وتأمين اتفاقيات الإيجار بالحجم الكبير.'
                  : 'For business executives tasked with managing corporate housing budgets, verifying landlord titles, and securing high-volume rental agreements.',
                accent: false,
              },
              {
                h3: isAr ? 'مديرو الموارد البشرية والإدارة' : 'HR and Admin Directors',
                desc: isAr
                  ? 'لموظفي الموارد البشرية الذين ينظمون انتقالات الموظفين والتحقق من ظروف المعيشة وإعداد العمليات السكنية اليومية.'
                  : 'For human resource personnel organizing employee relocations, verifying living conditions, and setting up daily housing operations.',
                accent: false,
              },
              {
                h3: isAr ? 'مديرو المشاريع' : 'Project Managers',
                desc: isAr
                  ? 'للمهندسين والمشرفين الميدانيين الذين يحتاجون إلى إسكان وظيفي قريب من مشاريع البنية التحتية المحددة أو ممرات الخدمات اللوجستية.'
                  : 'For engineering and site supervisors who need functional team housing located close to specific infrastructure projects or logistics corridors.',
                accent: true,
              },
              {
                h3: isAr ? 'مديرو العمليات' : 'Operations Managers',
                desc: isAr
                  ? 'لقادة العمليات الإقليميين الذين يحتاجون إلى شبكات إسكان موظفين موثوقة ومتوافقة لدعم خدمات التجزئة أو الضيافة أو الأمن.'
                  : 'For regional operation leads requiring predictable, compliant employee housing networks to back up retail, hospitality, or security services.',
                accent: false,
              },
            ].map((card, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className={`rounded-2xl p-6 h-full hover:shadow-md transition-shadow ${card.accent ? 'bg-forest text-white' : 'bg-white border border-border'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${card.accent ? 'bg-lime' : 'bg-lime'}`}>
                    <CheckCircle2 size={16} className="text-forest" />
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>{card.h3}</h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/70' : 'text-ink-muted'}`}>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 4: KEY PRIORITIES â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'الأولويات الرئيسية للإسكان الوظيفي في قطر' : 'Key Priorities for Employee Housing in Qatar'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'تعتمد إعدادات الإسكان المؤسسي الناجحة على السلامة الهيكلية وسهولة النقل والأوراق القانونية الواضحة.'
                : 'Successful corporate housing setups depend on structural safety, ease of transportation, and clear legal paperwork.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Shield size={20} />,
                h3: isAr ? 'الامتثال التنظيمي الموثق' : 'Verified Regulatory Compliance',
                desc: isAr
                  ? 'نُعطي الأولوية للمساحات السكنية التي تحمل شهادات الدفاع المدني السارية وتمتثل تماماً لأحدث إرشادات كثافة وزارة العمل القطرية.'
                  : 'We prioritize residential spaces that hold active Civil Defense certificates and fully comply with the latest Qatar Ministry of Labor density guidelines.',
                accent: false,
              },
              {
                icon: <Car size={20} />,
                h3: isAr ? 'سهولة الوصول بالمركبات' : 'Fleet Transport Accessibility',
                desc: isAr
                  ? 'نحدد العقارات القريبة من مناطق انتظار الحافلات الواضحة ومسارات الطرق السريعة الرئيسية وحلقات الخدمة الصناعية المخصصة.'
                  : 'We isolate properties located near clear bus loading bays, major highway arterial paths, and dedicated industrial service loops.',
                accent: false,
              },
              {
                icon: <DollarSign size={20} />,
                h3: isAr ? 'الاستقرار طويل الأمد بتكلفة فعالة' : 'Cost-Efficient Long-Term Stability',
                desc: isAr
                  ? 'أبرم عقود إيجار مؤسسية متعددة السنوات واضحة وقابلة للتنبؤ تحمي شركتك من ارتفاعات الإيجار المفاجئة أو تكاليف الانتقال غير المتوقعة.'
                  : 'Secure clear, predictable multi-year corporate leases that protect your company from sudden rent spikes or unexpected relocation costs.',
                accent: true,
              },
              {
                icon: <FileText size={20} />,
                h3: isAr ? 'شفافية العمليات المؤسسية' : 'Transparent Corporate Operations',
                desc: isAr
                  ? 'احصل على اتصالات واضحة مع الملاك وشهادات بلدية الإيجار الرسمية وشروط صريحة لتخصيص المرافق منذ اليوم الأول.'
                  : 'Access clear landlord communications, official Baladiya tenancy attestations, and explicit terms on utility allocations from day one.',
                accent: false,
              },
            ].map((card, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className={`rounded-2xl p-6 h-full hover:shadow-md transition-shadow ${card.accent ? 'bg-forest text-white' : 'bg-white border border-border'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.accent ? 'bg-lime' : 'bg-lime'}`}>
                    <span className="text-forest">{card.icon}</span>
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>{card.h3}</h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/70' : 'text-ink-muted'}`}>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 5: STAFF HOUSING OPTIONS â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'خيارات إسكان الموظفين لمختلف احتياجات الأعمال' : 'Staff Housing Options for Different Business Needs'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'نُكيّف تطابقات العقارات لدينا لتناسب التسلسل الهرمي التنظيمي المحدد والاحتياجات التشغيلية لمؤسستك.'
                : 'We tailor our property matches to fit the specific organizational hierarchy and operational needs of your enterprise.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                h3: isAr ? 'مجمعات سكن العمالة' : 'Workforce Accommodation Blocks',
                desc: isAr
                  ? 'أنظمة إسكان متعددة الوحدات قابلة للتوسع وعالية الكفاءة مُصممة لمتطلبات الفرق عالية الكثافة ولوجستيات المواقع المباشرة.'
                  : 'Scalable, highly efficient multi-unit housing systems tailored for high-density team requirements and direct site logistics.',
                href: null,
                accent: false,
              },
              {
                h3: isAr ? 'فلل الموظفين' : 'Staff Villas',
                desc: isAr
                  ? 'خيارات عقارية مستقلة أكبر مُصممة للفرق التقنية أو الكوادر الطبية أو المشرفين من المستوى المتوسط الذين يفضلون تخطيط المنزل المشترك.'
                  : 'Larger, independent property options designed for technical teams, medical staff, or mid-level supervisors who thrive in a shared house layout.',
                href: '/staff-accommodation/staff-villas/',
                accent: true,
              },
              {
                h3: isAr ? 'شقق الموظفين التنفيذية' : 'Executive Staff Apartments',
                desc: isAr
                  ? 'وحدات سكنية متميزة تقع في مواقع مركزية مُصممة للمديرين التنفيذيين والمديرين والمهنيين المؤسسيين المكتبيين.'
                  : 'Premium, centrally located residential units engineered for senior executives, managers, and office-based corporate professionals.',
                href: null,
                accent: false,
              },
              {
                h3: isAr ? 'إسكان المشاريع طويلة الأمد' : 'Long-Term Project Housing',
                desc: isAr
                  ? 'حلول عقارية مستقرة متعددة السنوات مبنية لتتوافق تماماً مع عقود البنية التحتية طويلة الأمد وعمليات المؤسسة.'
                  : 'Stable, multi-year property solutions built to align perfectly with long-term infrastructure contracts and enterprise operations.',
                href: null,
                accent: false,
              },
            ].map((card, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className={`rounded-2xl p-6 h-full hover:shadow-md transition-shadow flex flex-col ${card.accent ? 'bg-forest text-white' : 'bg-white border border-border'}`}>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>{card.h3}</h3>
                  <p className={`text-xs leading-relaxed flex-1 ${card.accent ? 'text-white/70' : 'text-ink-muted'}`}>{card.desc}</p>
                  {card.href && (
                    <Link
                      to={card.href}
                      className={`mt-4 font-semibold text-xs hover:underline ${card.accent ? 'text-lime' : 'text-forest'}`}
                    >
                      {isAr ? 'عرض فلل الموظفين ←' : 'View Staff Villas →'}
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 6: AREAS â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'سكن العمال في الدوحة والمناطق الرئيسية في قطر' : 'Staff Accommodation in Doha and Key Qatar Areas'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {isAr
                ? 'كفاءات النقل وقواعد المناطق المحلية وتكوينات العقارات للإسكان المؤسسي تتوافق بطبيعتها مع أسواقها الصناعية والحضرية الفرعية المحلية. تدير دانية للعقارات ملفات B2B نشطة عبر هذه القطاعات الحيوية:'
                : 'Transportation efficiencies, local zone rules, and property configurations for corporate housing naturally match their local industrial and urban sub-markets. Dania Real Estate manages active B2B profiles across these critical sectors:'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                h3: isAr ? 'سكن العمال في الدوحة' : 'Staff Accommodation in Doha',
                desc: isAr
                  ? 'مجمعات حضرية مركزية وشقق مشرفين توفر قرباً فورياً من مراكز الأعمال في وسط المدينة والطرق الدائرية الرئيسية.'
                  : 'Central urban blocks and supervisor apartments offering immediate proximity to downtown business centers and main ring roads.',
                href: '/areas/doha/',
              },
              {
                h3: isAr ? 'سكن العمال في السد' : 'Staff Accommodation in Al Sadd',
                desc: isAr
                  ? 'خيارات سكنية متميزة مُصممة لموظفي المكاتب المؤسسية والمشرفين وفرق الإدارة العاملة داخل المراكز المكتبية المركزية.'
                  : 'Premium residential options tailored for corporate office staff, supervisors, and management teams working inside central office hubs.',
                href: '/areas/al-sadd/',
              },
              {
                h3: isAr ? 'سكن العمال في بن محمود' : 'Staff Accommodation in Bin Mahmoud',
                desc: isAr
                  ? 'خيارات إسكان حضرية متصلة بشكل كبير مثالية للحسابات المؤسسية التي تتطلب تخطيطات عبور مركزية للموظفين.'
                  : 'Highly connected urban housing options perfect for corporate accounts requiring centralized employee transit layouts.',
                href: '/areas/bin-mahmoud/',
              },
              {
                h3: isAr ? 'سكن العمال في الوكرة' : 'Staff Accommodation in Al Wakra',
                desc: isAr
                  ? 'مجمعات إسكان مؤسسية قابلة للتوسع توفر وصولاً سريعاً إلى منطقة مسيعيد الصناعية وممرات العبور الجنوبية.'
                  : 'Scalable corporate housing complexes providing quick access to the Mesaieed Industrial Zone and southern transit corridors.',
                href: '/areas/al-wakra/',
              },
              {
                h3: isAr ? 'سكن العمال في العزيزية وأبو هامور' : 'Staff Accommodation in Al Aziziya & Abu Hamour',
                desc: isAr
                  ? 'مراكز سكنية ذات موقع استراتيجي تتيح اتصالات سريعة ومباشرة بطريق سلوى ومنطقة الدوحة الصناعية المركزية.'
                  : 'Strategically positioned residential hubs offering quick, direct connections to both Salwa Road and the central Doha Industrial Area.',
                href: '/areas/al-aziziya/',
              },
              {
                h3: isAr ? 'سكن العمال في المطار القديم' : 'Staff Accommodation in Old Airport',
                desc: isAr
                  ? 'إعدادات إسكان للقوى العاملة يسهل الوصول إليها مبنية لفرق اللوجستيات وشبكات تقديم الطعام ومشغلي خدمات الطيران.'
                  : 'Highly accessible workforce housing setups built for logistics teams, catering networks, and aviation service operators.',
                href: '/areas/old-airport/',
              },
              {
                h3: isAr ? 'سكن العمال في أم صلال' : 'Staff Accommodation in Umm Salal',
                desc: isAr
                  ? 'حلول إسكان ضاحية شمالية عبر أم صلال محمد مثالية للشركات التي لديها مشاريع على طول ممر الطريق الشمالي.'
                  : 'Northern suburban housing solutions across Umm Salal Mohammed, ideal for companies with projects along the North Road corridor.',
                href: '/areas/umm-salal/',
              },
              {
                h3: isAr ? 'سكن العمال في الخريطيات' : 'Staff Accommodation in Al Kharaitiyat',
                desc: isAr
                  ? 'عقارات إسكان مؤسسية منخفضة الكثافة وفعالة من حيث التكلفة مُصممة للفرق التي تتطلب عبوراً سريعاً إلى المناطق التجارية والتجزئة الشمالية.'
                  : 'Cost-efficient, low-density corporate housing properties designed for teams requiring rapid transit to northern commercial and retail zones.',
                href: '/areas/al-kharaitiyat/',
              },
            ].map((area, i) => (
              <Reveal key={i} direction="up" delay={i * 60}>
                <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                  <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                  <p className="text-ink-muted text-xs leading-relaxed mb-4 flex-1">{area.desc}</p>
                  <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                    {isAr ? 'عرض العقارات ←' : 'View Properties →'}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 7: WHY CHOOSE DANIA â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'لماذا تختار دانية للعقارات لإسكان الموظفين' : 'Why Choose Dania Real Estate for Employee Housing'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'نزيل التعقيد من التأجير المؤسسي بالتركيز بشكل كبير على الامتثال القانوني ورسم خرائط المناطق المناسبة وهياكل التكلفة الواضحة.'
                : 'We eliminate the complexity from corporate leasing by focusing heavily on legal compliance, proper zone mapping, and clear cost structures.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                h3: isAr ? 'خبرة حقيقية في مجال B2B المؤسسي' : 'True Corporate B2B Domain Expertise',
                desc: isAr
                  ? 'نتجاوز قوائم العائلات غير ذات الصلة لنربط فريق المشتريات لديك مباشرةً بشبكات الملاك المؤسسيين الموثقين والأصول التجارية.'
                  : 'We bypass irrelevant family listings to connect your procurement team directly with verified corporate landlord networks and commercial assets.',
                accent: false,
              },
              {
                h3: isAr ? 'رسم خرائط الخدمات اللوجستية ومسارات العبور' : 'Logistical and Transit Route Mapping',
                desc: isAr
                  ? 'يُقيّم مستشارونا كل خيار عقاري مقابل أنماط سفر فريقك اليومية وسلامة تحميل الحافلات وخطوط الاتصال بالموقع.'
                  : 'Our consultants evaluate every property choice against your daily team travel patterns, bus loading safety, and site connection lines.',
                accent: false,
              },
              {
                h3: isAr ? 'مراجعات عقود تنظيمية شاملة' : 'Complete Regulatory Contract Reviews',
                desc: isAr
                  ? 'نضمن أن جميع تطابقات العقارات تحمل شهادات الدفاع المدني السارية ويمكنها إتمام شهادات إيجار الشركة البلدية الرسمية بسلاسة.'
                  : 'We ensure all property matches hold valid Civil Defense certificates and can complete official Baladiya company lease attestations smoothly.',
                accent: true,
              },
              {
                h3: isAr ? 'قناة المشتريات المباشرة عبر واتساب' : 'Direct WhatsApp Procurement Channel',
                desc: isAr
                  ? 'تجاوز حلقات الاستفسار البطيئة والآلية. تواصل مباشرةً مع مدير حساب مؤسسي مخصص عبر واتساب لتلقي جداول الشواغر الفورية على الفور.'
                  : 'Skip slow, automated inquiry loops. Connect directly with a dedicated corporate account manager via WhatsApp to receive real-time vacancy spreadsheets instantly.',
                accent: false,
              },
            ].map((card, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className={`rounded-2xl p-6 h-full hover:shadow-md transition-shadow ${card.accent ? 'bg-forest text-white' : 'bg-white border border-border'}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle2 size={16} className="text-forest" />
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>{card.h3}</h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/70' : 'text-ink-muted'}`}>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 8: PROCESS â"€â"€ */}
      <section className="bg-surface-low py-20">
        <ProcessSteps
          title={isAr ? 'كيف تعمل عملية سكن العمال لدينا' : 'How Our Staff Accommodation Process Works'}
          steps={[
            {
              num: '01',
              h3: isAr ? 'أرسل مصفوفة طلب عروض الأسعار المؤسسية' : 'Submit Your Corporate RFQ Matrix',
              desc: isAr
                ? 'شارك إجمالي عدد موظفيك وحلقة الموقع المطلوبة والميزانية الشهرية المستهدفة لكل وحدة والجدول الزمني المخطط للتعبئة.'
                : 'Share your total employee headcount, desired location loop, target monthly budget per unit, and planned mobilization timeline.',
            },
            {
              num: '02',
              h3: isAr ? 'تصفية الامتثال الموثق' : 'Vetted Compliance Filtering',
              desc: isAr
                ? 'تقوم قسمنا التجاري بفحص قواعد البيانات المؤسسية النشطة لسحب العقارات التي تتطابق مع احتياجات طاقتك وقواعد المناطق المحلية.'
                : 'Our commercial division scans active corporate databases to pull properties that match both your capacity needs and local zone rules.',
            },
            {
              num: '03',
              h3: isAr ? 'تسليم محفظة الوثائق' : 'Document Portfolio Delivery',
              desc: isAr
                ? 'راجع الوسائط الداخلية غير المعدلة ومواصفات المخططات الدقيقة وأوراق الامتثال الواضحة المرسلة مباشرةً إلى مكتبك المؤسسي.'
                : 'Review unedited interior media, exact floor plan specifications, and clear compliance paperwork sent directly to your corporate desk.',
            },
            {
              num: '04',
              h3: isAr ? 'معاينات ميدانية مُشرفة' : 'Supervised Site Inspections',
              desc: isAr
                ? 'أجرِ جولة ميدانية منظمة للعقار ومناطق الوصول للنقل جنباً إلى جنب مع مستشار أول من دانية للعقارات قبل الانتهاء من شروط عقد الإيجار.'
                : 'Conduct a structured on-site walkthrough of the property and transport access areas alongside a senior Dania real estate advisor before finalizing lease terms.',
            },
          ]}
        />
      </section>

      {/* â"€â"€ SECTION 9: BUSINESS SUITABILITY â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'إسكان موظفين مبني حول احتياجات العمل' : 'Staff Housing Built Around Business Operations'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal direction="up" delay={80}>
              <div>
                <p className="text-ink-muted leading-relaxed text-sm mb-4">
                  {isAr
                    ? 'يُعدّ اختيار الإسكان المؤسسي المتوافق أساساً جوهرياً لموثوقيتك التشغيلية اليومية ورفاهية الموظفين. توفير بيئات معيشية جيدة التهوية وسهلة الوصول ومُدارة بشكل صحيح لقوى العمل يُحسّن مباشرةً الاحتفاظ بالفريق ويُقلّل تأخيرات العبور اليومية ويحمي مؤسستك من التعرض للغرامات البلدية.'
                    : "Selecting compliant corporate housing is a core foundation for your daily operational reliability and employee well-being. Providing your workforce with well-ventilated, accessible, and properly managed living environments directly improves team retention, reduces daily transit delays, and protects your enterprise from municipal fine exposures."}
                </p>
                <p className="text-ink-muted leading-relaxed text-sm">
                  {isAr
                    ? 'تدعم دانية للعقارات صحة مؤسستك بضمان أن كل تخطيط إيجار يتطابق مع التسلسل الهرمي الداخلي المحدد لديك - مما يضمن عمليات سلسة وسليمة قانوناً من تسجيل الوصول الأولي وحتى تجديدات العقد طويلة الأمد.'
                    : 'Dania Real Estate supports your organizational health by ensuring every lease layout matches your specific internal hierarchy—delivering smooth, legally sound operations from initial check-in to long-term contract renewals.'}
                </p>
              </div>
            </Reveal>
            <Reveal direction="up" delay={160}>
              <div className="bg-forest rounded-2xl p-8 text-white">
                <h3 className="font-bold text-xl mb-3">
                  {isAr ? 'هل تحتاج إلى إسكان مؤسسي قابل للتوسع لقوى عملك؟' : 'Need Scalable Corporate Housing for Your Workforce?'}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {isAr
                    ? 'تجنب الإعلانات المبوبة غير الموثقة عبر الإنترنت والجولات غير المنسقة. أرسل عدد موظفيك الدقيق وحلقات الموقع المستهدفة ومواصفات الميزانية مباشرةً إلى مكتب التأجير التجاري لدينا اليوم للحصول على محفظة عقارية فورية ومُخصصة.'
                    : "Avoid unverified online classifieds and uncoordinated tours. Send your exact employee count, target location loops, and budget specifications directly to our commercial leasing desk today for an immediate, customized property portfolio."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 10: RELATED HOUSING â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'هل تبحث عن سكن موظفين بطراز الفلل؟' : 'Looking for Villa-Style Staff Housing?'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-8 max-w-2xl text-sm leading-relaxed">
              {isAr
                ? 'تتطلب بعض العمليات التقنية والمجموعات الطبية والفرق الإشرافية تخطيط ومساحة تكوين العقار المستقل. إذا كانت شركتك تحتاج إلى هياكل مستقلة كبيرة لتوظيف الموظفين، استكشف دليل فلل الموظفين المخصص لدينا أدناه:'
                : 'Some technical operations, medical groups, and supervisory teams require the layout and space of an independent property configuration. If your company needs large standalone structures for employee placement, explore our dedicated staff villas directory below:'}
            </p>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <Link
              to="/staff-accommodation/staff-villas/"
              className="inline-flex items-center justify-center bg-forest text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              {isAr ? 'استكشف فلل الموظفين للإيجار' : 'Explore Staff Villas for Rent'}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ SECTION 11: FAQ â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'أسئلة شائعة حول سكن العمال' : 'Staff Accommodation FAQs'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <FaqAccordion faqs={t('staff.mainFaqs', { returnObjects: true }) as Array<{q: string, a: string}>} />
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ SECTION 12: FINAL CTA â"€â"€ */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <Reveal direction="up">
          <div className="relative bg-lime rounded-3xl px-8 py-16 text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-light/30 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-light/30 rounded-full" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
                {t('staff.ctaH2')}
              </h2>
              <p className="text-forest/70 text-lg mb-10 max-w-2xl mx-auto">
                {isAr
                  ? 'احمِ موثوقية شركتك التشغيلية وكفاءة الخدمات اللوجستية اليومية ومكانتها في الامتثال التنظيمي. تجنب عمليات البحث عن العقارات غير المنسقة وقوائم البوابات الإلكترونية القديمة. تواصل مباشرةً مع متخصصي العقارات التجارية في دانية للعقارات اليوم للحصول على محفظة إسكان مؤسسية موثقة ومتوافقة مع الميزانية.'
                  : "Protect your company's operational reliability, daily logistics efficiency, and regulatory compliance standing. Avoid uncoordinated property searches and outdated online portal listings. Connect directly with the commercial real estate professionals at Dania Real Estate today to receive a vetted, budget-aligned corporate housing portfolio."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-forest text-white font-bold px-8 py-4 rounded-full text-base hover:opacity-90 transition-opacity"
                >
                  {t('staff.ctaPrimary')}
                </a>
                <Link
                  to="/contact-us/"
                  className="inline-flex items-center justify-center bg-white text-ink font-bold px-8 py-4 rounded-full text-base hover:bg-white/90 transition-colors"
                >
                  {t('staff.ctaSecondary')}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// STAFF VILLAS SUB-PAGE
// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const villaComparisonRows = [
  { metric: 'Primary Lease Intent', metricAr: 'الغرض الأساسي من الإيجار', staff: 'Corporate employee housing & project logistics', staffAr: 'إسكان موظفي الشركة ولوجستيات المشروع', family: 'Private residential family living', familyAr: 'المعيشة الأسرية السكنية الخاصة' },
  { metric: 'Primary Contract Signatory', metricAr: 'الموقّع الأساسي على العقد', staff: 'Company Commercial Registration (CR)', staffAr: 'السجل التجاري للشركة (CR)', family: 'Individual tenant or personal sponsor', familyAr: 'مستأجر فردي أو كفيل شخصي' },
  { metric: 'Core Selection Priority', metricAr: 'أولوية الاختيار الأساسية', staff: 'Occupancy limits, transport routes, budget setups', staffAr: 'حدود الإشغال ومسارات النقل وإعدادات الميزانية', family: 'Privacy, community amenities, school paths', familyAr: 'الخصوصية والمرافق المجتمعية ومسارات المدارس' },
  { metric: 'Internal Structural Focus', metricAr: 'التركيز الهيكلي الداخلي', staff: 'Multi-room capacity and practical shared use', staffAr: 'طاقة متعددة الغرف والاستخدام المشترك العملي', family: 'Family entertainment zones and luxury finishes', familyAr: 'مناطق ترفيه الأسرة والتشطيبات الفاخرة' },
  { metric: 'Inquiry Sourcing Channel', metricAr: 'قناة مصادر الاستفسار', staff: 'Commercial B2B Sourcing Portal', staffAr: 'بوابة التوريد التجاري B2B', family: 'Residential B2C Leasing Portfolio', familyAr: 'محفظة الإيجار السكني B2C' },
]

function StaffVillasPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  usePageSchema([faqPageSchema(isAr ? staffVillasFaqsAr : staffVillasFaqs)])

  return (
    <>
      {/* â"€â"€ SECTION 1: HERO â"€â"€ */}
      <section className="bg-forest text-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Reveal direction="up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                  {isAr ? 'فلل الموظفين للإيجار في الدوحة وقطر' : 'Staff Villas for Rent in Doha and Qatar'}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <h3 className="text-lime text-lg md:text-xl font-semibold max-w-2xl mb-4">
                  {isAr
                    ? 'دعم سكن الموظفين في الفلل للشركات والفرق التقنية واحتياجات إسكان القوى العاملة.'
                    : 'Villa-based staff accommodation support for companies, technical teams, and workforce housing needs.'}
                </h3>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/70 text-base max-w-3xl mb-8 leading-relaxed">
                  {isAr
                    ? 'يتطلب الحصول على فيلا موظفين متوافقة للإيجار في الدوحة الموازنة بين متطلبات حجم الفريق واللوائح الصارمة لبلدية البلدية وإعدادات الصرف الصحي عالية الطاقة وممرات الوصول لنقل الأسطول الثقيل. تدير دانية للعقارات مخزوناً نشطاً وموثقاً بعمق من المنازل المستقلة والمجمعات متعددة الفلل المخصصة تحديداً للإسكان الوظيفي عبر الممرات الصناعية الرئيسية في قطر. سواء كانت مؤسستك بحاجة إلى إسكان فريق هندسي بالقرب من مشروع بنية تحتية كبير أو تحديد موقع مركزي لمشرفي الضيافة أو تأمين عقارات متعددة الغرف للعمليات طويلة الأمد، تُطابق قسمنا التجاري للتأجير لوجستياتك مباشرةً مع القوائم الموثقة والمتاحة.'
                    : "Sourcing a compliant staff villa for rent in Doha requires balancing team size requirements with strict Baladiya municipality regulations, high-capacity sanitary setups, and heavy fleet transport access lanes. Dania Real Estate manages an active, deeply vetted inventory of independent standalone houses and multi-villa clusters specifically cleared for corporate workforce housing across Qatar's major industrial corridors. Whether your organization must house an engineering team close to a major infrastructure project, locate central housing for hospitality supervisors, or secure multi-room properties for long-term operations, our commercial leasing division matches your logistics directly against verified, available listings."}
                </p>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-lime text-forest font-bold px-7 py-3.5 rounded-full text-sm hover:bg-lime/90 transition-colors"
                  >
                    {isAr ? 'اطلب توفر فلل الموظفين' : 'Request Staff Villa Availability'}
                  </a>
                  <Link
                    to="/contact-us/"
                    className="inline-flex items-center justify-center bg-white/15 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white/25 transition-colors backdrop-blur-sm"
                  >
                    {isAr ? 'تواصل مع فريقنا' : 'Contact Our Team'}
                  </Link>
                </div>
              </Reveal>
              <Reveal direction="up" delay={320}>
                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2">
                  {(isAr
                    ? [
                        '100% من عقارات الفلل المستقلة معتمدة لإشغال القوى العاملة المؤسسية.',
                        'تحسين مباشر لمواقف المركبات الثقيلة والوصول إلى مسارات نقل الشركة.',
                        'صحف بيانات عقارية سريعة وشاملة ومقاطع فيديو جولات غير معدلة مشتركة عبر قنوات الأعمال النشطة.',
                      ]
                    : [
                        '100% independent villa properties approved for corporate workforce occupancy.',
                        'Direct optimization for heavy vehicle parking and company transport route access.',
                        'Fast, comprehensive property data sheets and unedited walk-through videos shared via active business channels.',
                      ]
                  ).map((tp, idx) => (
                    <span key={idx} className="flex items-start gap-2 text-white/60 text-sm max-w-xs">
                      <CheckCircle2 size={14} className="text-lime shrink-0 mt-0.5" />
                      {tp}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img src="/staff-villas-for-rent-doha-qatar.webp" alt="Verified independent staff villas for rent in Doha Qatar managed by Dania Real Estate." className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">{isAr ? 'فلل الموظفين · قطر' : 'Staff Villas · Qatar'}</div>
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">{isAr ? 'جاهز للمؤسسات' : 'Corporate Ready'}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 2: OVERVIEW â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'سكن الموظفين في الفلل لتلبية احتياجات الأعمال' : 'Villa-Based Staff Accommodation for Business Needs'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Reveal direction="up" delay={80}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'يوفر اختيار فيلا موظفين في سوق الإيجار القطري للشركات بديلاً عالي الكفاءة ومركزياً عن استئجار وحدات شقق متفرقة. يتيح تكوين الفيلا المستقل لمؤسستك إيواء فرق تقنية كاملة أو مشرفين ميدانيين أو موظفين تشغيليين تحت سقف واحد. يُبسّط هذا التخطيط المركزي بشكل كبير لوجستيات الفريق اليومية ويُقلّل النفقات العامة للنقل المؤسسي ويُبسّط عمليات إدارة الممتلكات.'
                  : 'Selecting a staff villa within the Qatari rental market provides companies with a highly efficient and centralized alternative to renting scattered apartment units. An independent villa configuration allows your organization to house entire technical teams, site supervisors, or operational staff under one roof. This centralized layout greatly simplifies daily team logistics, reduces corporate transportation overhead, and streamlines property management operations.'}
              </p>
            </Reveal>
            <Reveal direction="up" delay={160}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'تُنسّق دانية للعقارات بنشاط مع مسؤولي المشتريات المؤسسية والمقاولين من الباطن ومديري الموارد البشرية لتأمين منازل تتطابق مع إطارك التشغيلي. نحلل كل تخطيط بناءً على أبعاد الغرف ونسب الحمامات وقدرات المطبخ والملاءمة لشهادة الإيجار الرسمية تحت سجلك التجاري للشركة (CR).'
                  : "Dania Real Estate actively coordinates with corporate procurement leads, sub-contractors, and human resource directors to secure houses that match your operational framework. We analyze every layout based on room dimensions, bathroom ratios, kitchen capabilities, and suitability for official lease attestation under your company's Commercial Registration (CR)."}
              </p>
            </Reveal>
            <Reveal direction="up" delay={240}>
              <p className="text-ink-muted leading-relaxed text-sm">
                {isAr
                  ? 'هذا الدليل المستهدف مخصص حصرياً للعقارات المستقلة بطراز الفلل. بالنسبة للمنظمات التي تبحث عن مجمعات شقق عمالة أوسع أو مبانٍ تجارية مشتركة أو أماكن إقامة عمالية قابلة للتوسع، يُرجى زيارة نظرة عامة على الإسكان المؤسسي الرئيسي.'
                  : 'This targeted directory is dedicated exclusively to independent, villa-style staff properties. For organizations looking for broader workforce apartment blocks, shared commercial buildings, or scalable labor accommodations, please visit our master corporate housing overview.'}
              </p>
            </Reveal>
          </div>
          <Reveal direction="up" delay={320}>
            <Link
              to="/staff-accommodation/"
              className="inline-flex items-center justify-center bg-forest text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              {isAr ? 'استكشف خيارات سكن الموظفين الرئيسية' : 'Explore Main Staff Accommodation Options'}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ SECTION 3: WHY STAFF VILLAS â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'لماذا تُعدّ فلل الموظفين خياراً عملياً لإسكان القوى العاملة' : 'Why Staff Villas Are a Practical Workforce Housing Choice'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'مركزة موظفيك التشغيليين داخل هيكل فيلا مستقل تُحسّن أداء الفريق وتضمن السلامة التنظيمية وتُخفض إجمالي نفقات الإسكان المؤسسي.'
                : 'Centralizing your operational personnel within an independent villa structure improves team performance, ensures regulatory safety, and lowers total corporate housing expenditures.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Car size={20} />,
                h3: isAr ? 'لوجستيات الأسطول المركزية' : 'Centralized Fleet Logistics',
                desc: isAr
                  ? 'بسّط عملياتك اليومية من خلال إيصال وانتقاء فرق المشروع بالكامل من وجهة عقار واحدة يسهل الوصول إليها.'
                  : 'Streamline your daily operations by dropping off and picking up entire project teams from a single, highly accessible property destination.',
                accent: false,
              },
              {
                icon: <Building2 size={20} />,
                h3: isAr ? 'تخطيطات متعددة الغرف قابلة للتوسع' : 'Scalable Multi-Room Layouts',
                desc: isAr
                  ? 'استفد من المخططات الواسعة التي تتميز بغرف نوم متعددة وملاحق منفصلة ومساحات مجتمعية كبيرة مُصممة لراحة معيشة القوى العاملة.'
                  : 'Utilize extensive floor plans featuring multiple bedrooms, separate outhouses, and large communal spaces tailored for workforce living comfort.',
                accent: true,
              },
              {
                icon: <FileText size={20} />,
                h3: isAr ? 'أمان العقود طويلة الأمد' : 'Long-Term Contract Security',
                desc: isAr
                  ? 'أبرم اتفاقيات إيجار تجارية متعددة السنوات قابلة للتنبؤ تتوافق تماماً مع عقود البناء الجارية أو خدمات شركتك.'
                  : 'Secure predictable, multi-year commercial lease agreements that align perfectly with your ongoing construction or corporate service contracts.',
                accent: false,
              },
              {
                icon: <DollarSign size={20} />,
                h3: isAr ? 'تكلفة محسّنة لكل موظف' : 'Optimized Cost per Employee',
                desc: isAr
                  ? 'خفّض إجمالي نفقاتك التشغيلية العامة باستخدام تخصيصات الفيلا عالية الطاقة مقارنةً بتأجير عدة شقق حضرية منفصلة.'
                  : 'Lower your total operational overhead by utilizing high-capacity villa allocations compared to leasing multiple separate urban apartments.',
                accent: false,
              },
            ].map((card, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className={`rounded-2xl p-6 h-full hover:shadow-md transition-shadow ${card.accent ? 'bg-forest text-white' : 'bg-white border border-border'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-lime`}>
                    <span className="text-forest">{card.icon}</span>
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>{card.h3}</h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/70' : 'text-ink-muted'}`}>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 4: COMPARISON TABLE â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'فلل الموظفين مقابل فلل العائلات: ما الفرق؟' : 'Staff Villas vs Family Villas: What Is the Difference?'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-8 max-w-2xl">
              {isAr
                ? 'في حين يتشارك نوعا العقارات أبعاداً هيكلية مماثلة، إلا أن استخداماتهما القانونية ومقاييسهما المستهدفة وشروط الإيجار مختلفة تماماً:'
                : 'While both property types share similar structural dimensions, their legal uses, target metrics, and lease terms are completely distinct:'}
            </p>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-forest text-white">
                    <th className="text-left px-6 py-4 font-bold">{isAr ? 'المقياس التشغيلي' : 'Operational Metric'}</th>
                    <th className="text-left px-6 py-4 font-bold">{isAr ? 'فيلا الموظفين المؤسسية' : 'Corporate Staff Villa'}</th>
                    <th className="text-left px-6 py-4 font-bold">{isAr ? 'فيلا الأسرة الخاصة' : 'Private Family Villa'}</th>
                  </tr>
                </thead>
                <tbody>
                  {villaComparisonRows.map((row, i) => (
                    <tr key={row.metric} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-low'}>
                      <td className="px-6 py-4 font-semibold text-ink">{isAr ? row.metricAr : row.metric}</td>
                      <td className="px-6 py-4 text-ink-muted">{isAr ? row.staffAr : row.staff}</td>
                      <td className="px-6 py-4 text-ink-muted">{isAr ? row.familyAr : row.family}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ SECTION 5: WHO IS THIS FOR â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'من يحتاج إلى فلل الموظفين؟' : 'Who Needs Staff Villas?'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {(isAr
              ? [
                  'مقاولو البنية التحتية الذين يحتاجون إلى قواعد فيلا عالية الطاقة للفرق الهندسية والتقنية المحلية.',
                  'مديرو المشتريات المؤسسيون المكلفون بتوريد إسكان عمالة فعّال من حيث التكلفة ومتوافق تماماً.',
                  'مديرو الموارد البشرية والتنقل الذين ينظمون انتقالات مجموعات الموظفين السكنية ضمن جداول زمنية صارمة.',
                  'مشغلو الضيافة والتجزئة الذين يبحثون عن إعدادات إسكان مركزية لكبار موظفي الخدمة والمشرفين.',
                  'المقاولون من الباطن الذين يحتاجون إلى أماكن إقامة مستقرة وطويلة الأمد تقع مجاورةً مباشرةً لمشاريع البنية التحتية الكبرى.',
                ]
              : [
                  'Infrastructure Contractors requiring high-capacity villa bases for localized engineering and technical teams.',
                  'Corporate Procurement Managers tasked with sourcing cost-efficient, fully compliant workforce housing.',
                  'HR and Mobility Directors organizing group employee housing relocations under strict timelines.',
                  'Hospitality and Retail Operators seeking centralized housing setups for senior service and supervisor personnel.',
                  'Sub-Contractors needing stable, long-term accommodations located immediately adjacent to major infrastructure projects.',
                ]
            ).map((item, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className="flex items-start gap-3 bg-white border border-border rounded-2xl px-5 py-4">
                  <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                  <span className="text-ink-muted text-sm leading-relaxed">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 6: AREAS â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'فلل الموظفين في الدوحة والمناطق الرئيسية في قطر' : 'Staff Villas in Doha and Key Qatar Areas'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {isAr
                ? 'أوقات العبور اليومية وطاقات مواقف السيارات وميزانيات الإيجار للمنازل المؤسسية للموظفين مرتبطة ارتباطاً عميقاً بالمناطق البلدية المحلية. تدير دانية للعقارات بنشاط قوائم B2B عبر مسارات اللوجستيات الأساسية هذه:'
                : 'Daily transit times, parking capacities, and rental budgets for corporate staff houses are deeply tied to local municipal zones. Dania Real Estate actively manages active B2B listings across these primary logistics routes:'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                h3: isAr ? 'فلل الموظفين في الدوحة' : 'Staff Villas in Doha',
                desc: isAr
                  ? 'منازل حضرية عالية الطاقة تقع في مواقع مركزية توفر اتصالات سريعة بالمقرات التجارية والمشاريع داخل المدينة.'
                  : 'Centrally located, high-capacity urban houses offering rapid connections to commercial headquarters and inner-city projects.',
                href: '/areas/doha/',
              },
              {
                h3: isAr ? 'فلل الموظفين في السد' : 'Staff Villas in Al Sadd',
                desc: isAr
                  ? 'عقارات متميزة مُصممة لفرق المشرفين والإداريين التي تتطلب وصولاً فورياً إلى أبراج الأعمال المركزية وخطوط العبور.'
                  : 'Premium properties tailored for supervisor and administrative teams requiring instant access to central business towers and transit lines.',
                href: '/areas/al-sadd/',
              },
              {
                h3: isAr ? 'فلل الموظفين في بن محمود' : 'Staff Villas in Bin Mahmoud',
                desc: isAr
                  ? 'فلل حضرية متصلة بشكل كبير مُعدّة للفرق التقنية التي تحتاج إلى عبور سريع إلى ممرات الخدمات في وسط المدينة.'
                  : 'Highly connected urban villas configured for technical teams needing rapid transit to downtown service corridors.',
                href: '/areas/bin-mahmoud/',
              },
              {
                h3: isAr ? 'فلل الموظفين في الوكرة' : 'Staff Villas in Al Wakra',
                desc: isAr
                  ? 'عقارات كبيرة صديقة للميزانية توفر وصولاً مباشراً إلى منطقة مسيعيد الصناعية وحلقات النقل الجنوبية.'
                  : 'Large, budget-friendly properties providing direct access to the Mesaieed Industrial Area and southern transport loops.',
                href: '/areas/al-wakra/',
              },
              {
                h3: isAr ? 'فلل الموظفين في العزيزية وأبو هامور' : 'Staff Villas in Al Aziziya & Abu Hamour',
                desc: isAr
                  ? 'مواقع استراتيجية للغاية تتميز بساحات كبيرة واتصالات سريعة ومباشرة بطريق سلوى ومنطقة الدوحة الصناعية الرئيسية.'
                  : 'Highly strategic locations featuring large yards and quick, direct connections to Salwa Road and the main Doha Industrial Area.',
                href: '/areas/al-aziziya/',
              },
              {
                h3: isAr ? 'فلل الموظفين في المطار القديم' : 'Staff Villas in Old Airport',
                desc: isAr
                  ? 'عقارات راسخة يسهل الوصول إليها مثالية لفرق اللوجستيات وموظفي دعم الطيران وفرق النقل العاملة بالقرب من مراكز العبور الرئيسية.'
                  : 'Well-established, accessible properties ideal for logistics, airline support staff, and transport teams working near primary transit hubs.',
                href: '/areas/old-airport/',
              },
              {
                h3: isAr ? 'فلل الموظفين في أم صلال' : 'Staff Villas in Umm Salal',
                desc: isAr
                  ? 'خيارات ضاحية شمالية عبر أم صلال محمد تتيح مخططات واسعة للفرق العاملة على طول ممر طريق الشمال.'
                  : 'Northern suburban choices across Umm Salal Mohammed, offering extensive floor plans for teams working along the Al Shamal road corridor.',
                href: '/areas/umm-salal/',
              },
              {
                h3: isAr ? 'فلل الموظفين في الخريطيات' : 'Staff Villas in Al Kharaitiyat',
                desc: isAr
                  ? 'إعدادات فيلا مؤسسية منخفضة الكثافة وفعالة من حيث التكلفة مناسبة تماماً للفرق التي تتطلب وصولاً بسيطاً للعبور إلى التطورات الصناعية الشمالية.'
                  : 'Cost-effective, low-density corporate villa setups perfectly suited for teams requiring straightforward transit access to northern industrial developments.',
                href: '/areas/al-kharaitiyat/',
              },
            ].map((area, i) => (
              <Reveal key={i} direction="up" delay={i * 60}>
                <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                  <h3 className="font-bold text-ink mb-2 text-sm">{area.h3}</h3>
                  <p className="text-ink-muted text-xs leading-relaxed mb-4 flex-1">{area.desc}</p>
                  <Link to={area.href} className="text-forest font-semibold text-xs hover:underline">
                    {isAr ? 'عرض العقارات ←' : 'View Properties →'}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 7: WHY CHOOSE DANIA â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'لماذا تختار دانية للعقارات لتأجير فلل الموظفين' : 'Why Choose Dania Real Estate for Staff Villa Rentals'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-2xl">
              {isAr
                ? 'يتطلب العثور على فيلا موظفين متوافقة معرفةً عميقة بالسوق المحلي والتحقق الصارم من الأوراق ورسم خرائط لوجستية دقيقة.'
                : 'Finding a compliant staff villa requires deep local market knowledge, strict paperwork verification, and precise logistics mapping.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Users size={18} />,
                h3: isAr ? 'تركيز مؤسسي B2B خالص' : 'Pure Corporate B2B Focus',
                desc: isAr
                  ? 'نتجاوز القوائم السكنية المعتادة للتركيز تماماً على العقارات المستقلة المخلصة والمعتمدة لاستخدام الإسكان المؤسسي للموظفين.'
                  : 'We bypass standard residential listings to focus your search entirely on independent properties cleared and approved for corporate staff housing use.',
                accent: false,
              },
              {
                icon: <Car size={18} />,
                h3: isAr ? 'تحليل العبور والأسطول' : 'Transit and Fleet Analysis',
                desc: isAr
                  ? 'يُقيّم مستشارونا كل عقار مقابل أنماط سفر فريقك اليومية وعروض الشوارع للحافلات واتصالات الطرق الرئيسية.'
                  : 'Our consultants evaluate every property against your daily team travel patterns, street widths for buses, and main road connections.',
                accent: true,
              },
              {
                icon: <Shield size={18} />,
                h3: isAr ? 'الفحص المسبق التنظيمي الصارم' : 'Strict Regulatory Pre-Screening',
                desc: isAr
                  ? 'نتحقق من جميع خيارات العقارات مسبقاً للتأكد من قدرتها على إتمام شهادات إيجار البلدية الرسمية تحت سجل شركتك.'
                  : 'We check all property options beforehand to confirm they can complete official municipality lease attestations under your company registration.',
                accent: false,
              },
              {
                icon: <Wifi size={18} />,
                h3: isAr ? 'بث وسائط مباشر في الوقت الفعلي' : 'Real-Time Direct Media Streams',
                desc: isAr
                  ? 'تجاوز بوابات الإعلانات المبوبة غير الموثقة عبر الإنترنت. تواصل مباشرةً مع مكتب B2B عبر واتساب لتلقي مقاطع الفيديو الداخلية غير المعدلة وصحف التخطيط على الفور.'
                  : 'Skip unverified online classified portals. Connect directly with our B2B desk via WhatsApp to receive unedited interior videos and layout sheets instantly.',
                accent: false,
              },
            ].map((card, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className={`rounded-2xl p-6 h-full hover:shadow-md transition-shadow ${card.accent ? 'bg-forest text-white' : 'bg-white border border-border'}`}>
                  <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center mb-4">
                    <span className="text-forest">{card.icon}</span>
                  </div>
                  <h3 className={`font-bold mb-2 text-sm ${card.accent ? 'text-white' : 'text-ink'}`}>{card.h3}</h3>
                  <p className={`text-xs leading-relaxed ${card.accent ? 'text-white/70' : 'text-ink-muted'}`}>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 8: PROCESS â"€â"€ */}
      <section className="bg-surface-low py-20">
        <ProcessSteps
          title={isAr ? 'كيف تعمل عملية تأجير فلل الموظفين لدينا' : 'How Our Staff Villa Rental Process Works'}
          steps={[
            {
              num: '01',
              h3: isAr ? 'أرسل طلب عروض الأسعار للإسكان المؤسسي' : 'Submit Your Corporate Housing RFQ',
              desc: isAr
                ? 'شارك حلقة الموقع المستهدفة وإجمالي عدد الموظفين وعدد الغرف المطلوبة وحد الميزانية الشهرية والجدول الزمني المخطط للانتقال.'
                : 'Share your target location loop, total employee headcount, required room count, monthly budget threshold, and planned move-in timeline.',
            },
            {
              num: '02',
              h3: isAr ? 'عزل المحفظة والمطابقة' : 'Portfolio Isolation & Matching',
              desc: isAr
                ? 'يقوم قسمنا التجاري المخصص بفحص المخزونات النشطة لعزل العقارات التي تتطابق مع أهداف طاقتك واحتياجات الوصول للنقل.'
                : 'Our dedicated commercial division screens active inventories to isolate properties that match your capacity goals and transport access needs.',
            },
            {
              num: '03',
              h3: isAr ? 'تسليم صحف البيانات والوسائط' : 'Data Sheet and Media Delivery',
              desc: isAr
                ? 'راجع صور الداخلية غير المعدلة ومصفوفات المخططات وتفاصيل الامتثال الموثقة المرسلة مباشرةً إلى صندوق بريد شركتك.'
                : 'Review unedited interior photographs, floor plan matrices, and verified compliance details sent directly to your corporate inbox.',
            },
            {
              num: '04',
              h3: isAr ? 'جولة معاينة مُشرفة للعقار' : 'Supervised Property Walkthrough',
              desc: isAr
                ? 'أجرِ معاينة ميدانية كاملة للفيلا ومناطق تحميل المركبات جنباً إلى جنب مع مستشار أول من دانية للعقارات قبل الانتهاء من تنفيذ عقد الإيجار.'
                : 'Conduct a complete on-site inspection of the villa and vehicle loading zones alongside a senior Dania real estate advisor before finalizing lease execution.',
            },
          ]}
        />
      </section>

      {/* â"€â"€ SECTION 9: OCCUPANCY & BUSINESS SUITABILITY â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-8">
              {isAr ? 'تخطيط فيلا الموظفين للعمليات التجارية' : 'Staff Villa Planning for Business Operations'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal direction="up" delay={80}>
              <div>
                <p className="text-ink-muted leading-relaxed text-sm mb-4">
                  {isAr
                    ? 'يُعدّ اختيار فيلا موظفين متوافقة أساساً جوهرياً لموثوقية مؤسستك التشغيلية اليومية وسلامتها التنظيمية. توفير إسكان موثق جيد التهوية وحسن الموقع وموثق قانونياً لفرقك التقنية والإشرافية يحمي مؤسستك مباشرةً من مخاطر العقوبات البلدية ويُحسّن مخرجات المشروع اليومية.'
                    : "Selecting a compliant staff villa is a core foundation for your organization's daily operational reliability and regulatory safety. Providing your technical and supervisor teams with properly ventilated, well-located, and legally verified housing directly protects your enterprise from municipal penalty risks and improves daily project output."}
                </p>
                <p className="text-ink-muted leading-relaxed text-sm">
                  {isAr
                    ? 'تساعد دانية للعقارات عملك على التنقل عبر نقاط التحقق من الامتثال هذه بضمان أن جميع نسب الحمامات وأحجام المطابخ ومناطق مواقف السيارات تتطابق مع حدود الإشغال الدقيقة المُعلنة في عقد إيجارك الرسمي.'
                    : 'Dania Real Estate helps your business navigate these compliance checkmarks by ensuring all bathroom ratios, kitchen sizes, and parking bays match the exact occupancy limits declared on your official tenancy contract.'}
                </p>
              </div>
            </Reveal>
            <Reveal direction="up" delay={160}>
              <div className="bg-forest rounded-2xl p-8 text-white">
                <h3 className="font-bold text-xl mb-3">
                  {isAr ? 'هل تبحث عن فلل موظفين لفريق مشروع نشط؟' : 'Sourcing Staff Villas for an Active Project Team?'}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {isAr
                    ? 'تجنب الإعلانات المبوبة غير الموثقة عبر الإنترنت والجولات غير المنسقة. أرسل عدد فريقك الدقيق وحلقات الموقع المطلوبة ومواصفات الميزانية مباشرةً إلى مكتب التأجير التجاري لدينا اليوم للحصول على محفظة عقارية فورية ومُخصصة.'
                    : 'Avoid unverified online classifieds and uncoordinated tours. Send your exact team headcount, required location loops, and budget specifications directly to our commercial leasing desk today for an immediate, customized property portfolio.'}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â"€â"€ SECTION 10: RELATED STAFF HOUSING â"€â"€ */}
      <section className="bg-surface-low py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {isAr ? 'هل تحتاج إلى خيارات أخرى لسكن الموظفين؟' : 'Need Other Staff Accommodation Options?'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-8 max-w-2xl text-sm leading-relaxed">
              {isAr
                ? 'بعض العمليات أو الإعدادات الإدارية أو متطلبات القوى العاملة عالية الحجم تكون أكثر ملاءمة لمجمعات شقق مخصصة أو أنظمة إسكان مركزية. إذا كان تكوين الفيلا المستقلة لا يتطابق مع نموذجك اللوجستي الحالي، استكشف فهرس الإسكان المؤسسي الكامل لدينا أدناه:'
                : "Some operations, administrative setups, or high-volume workforce requirements are better suited for dedicated apartment blocks or centralized housing systems. If an independent villa configuration does not match your current logistics model, explore our complete corporate housing index below:"}
            </p>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <Link
              to="/staff-accommodation/"
              className="inline-flex items-center justify-center bg-forest text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              {isAr ? 'استكشف خيارات سكن الموظفين الرئيسية' : 'Explore Main Staff Accommodation Options'}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ SECTION 11: FAQ â"€â"€ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'أسئلة شائعة حول تأجير فلل الموظفين' : 'Staff Villa Rental FAQs'}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <FaqAccordion faqs={isAr ? staffVillasFaqsAr : staffVillasFaqs} />
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ SECTION 12: FINAL CTA â"€â"€ */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <Reveal direction="up">
          <div className="relative bg-lime rounded-3xl px-8 py-16 text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-light/30 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-light/30 rounded-full" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
                {isAr ? 'احجز فلل عمال متوافقة لفريقك اليوم' : 'Secure Compliant Staff Villas for Your Team Today'}
              </h2>
              <p className="text-forest/70 text-lg mb-10 max-w-2xl mx-auto">
                {isAr
                  ? 'احمِ موثوقية شركتك التشغيلية وكفاءة الخدمات اللوجستية اليومية ومكانتها في الامتثال التنظيمي. تجنب عمليات البحث عن العقارات غير المنسقة وقوائم البوابات الإلكترونية القديمة. تواصل مباشرةً مع متخصصي العقارات التجارية في دانية للعقارات اليوم للحصول على محفظة إسكان فلل مؤسسية موثقة ومتوافقة مع الميزانية.'
                  : "Protect your company's operational reliability, daily logistics efficiency, and regulatory compliance standing. Avoid uncoordinated property searches and outdated online portal listings. Connect directly with the commercial real estate professionals at Dania Real Estate today to receive a vetted, budget-aligned corporate villa housing portfolio."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-forest text-white font-bold px-8 py-4 rounded-full text-base hover:opacity-90 transition-opacity"
                >
                  {isAr ? 'تواصل مع مكتب الشركات الآن' : 'Chat with Our B2B Desk Now'}
                </a>
                <Link
                  to="/contact-us/"
                  className="inline-flex items-center justify-center bg-white text-ink font-bold px-8 py-4 rounded-full text-base hover:bg-white/90 transition-colors"
                >
                  {isAr ? 'تواصل معنا اليوم' : 'Contact Us Today'}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// ROOT EXPORT — route switcher
// â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export function StaffAccommodationPage() {
  const { pathname } = useLocation()
  const isVillas = pathname.includes('/staff-villas')

  const title = isVillas
    ? 'Staff Villas for Rent in Doha | Employee Villa Housing Qatar'
    : 'Staff Accommodation in Doha | Corporate Employee Housing Qatar'
  const desc = isVillas
    ? 'Source verified staff villas for rent in Doha and greater Qatar. Find high-capacity independent villas for technical teams and supervisors with direct B2B WhatsApp desk support.'
    : 'Source compliant staff accommodation in Doha and greater Qatar. Explore vetted corporate housing blocks, supervisor apartments, and staff villas with direct B2B WhatsApp desk support.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      {isVillas ? <StaffVillasPage /> : <StaffAccommodationMain />}
    </>
  )
}

