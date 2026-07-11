import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { ScrollRevealText } from '@/components/shared/ScrollRevealText'
import { usePageSchema } from '@/components/shared/Seo'
import { faqPageSchema } from '@/lib/seo'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FaqEntry {
  q: string
  a: React.ReactNode
}

interface FaqSection {
  id: string
  heading: string
  intro?: string
  faqs: FaqEntry[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const faqSections: FaqSection[] = [
  {
    id: 'rental-search',
    heading: 'Rental Search and Property Type FAQs',
    intro:
      'Begin your journey by understanding the diverse property structures, legal leasing conditions, and regional availability frameworks operating across Qatar:',
    faqs: [
      {
        q: 'What types of properties can I rent through Dania Real Estate?',
        a: 'Dania Real Estate manages an extensive portfolio of verified residential, commercial, and corporate properties across Qatar. Our active inventory includes modern low-rise apartments (1BHK, 2BHK, 3BHK flats), premium standalone or compound family villas, legally compliant corporate staff accommodation, prime high-footfall retail shops, standalone showrooms, and value-focused compact spaces like standalone studios and managed executive rooms.',
      },
      {
        q: 'Is it better to search for a property by its type or by its localized area?',
        a: 'We recommend filtering by location first if your daily commute, school bus routes, or corporate logistics access points are your primary priorities. If your lifestyle requires a specific configuration—such as a large private backyard or independent commercial storefront zoning—you should start with our dedicated property type service pages. Our platform seamlessly connects both approaches via internal navigation filters.',
      },
      {
        q: 'Can foreign expatriates legally rent residential and commercial property in Doha?',
        a: "Yes, foreign expatriates holding a valid Qatari Residency Permit (QID) can legally rent any residential or commercial property across Qatar. While the legal right to lease is universal, individual landlord criteria, security deposit structures, and corporate documentation requirements can vary depending on the chosen asset type and municipality zoning laws.",
      },
      {
        q: 'Which specific geographic zones and municipalities does Dania Real Estate cover?',
        a: "Our active on-the-ground leasing services cover Qatar's highest-demand residential and commercial sectors. This includes central Doha districts (Al Sadd, Bin Mahmoud, Old Airport, Rawdat Al Matar), southern expansion zones (Al Wakra), western suburban belts (Al Aziziya, Abu Hamour), and the prominent northern growth corridors (Al Kharaitiyat, Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn).",
      },
    ],
  },
  {
    id: 'documents-process',
    heading: 'Rental Documents, Process, and Lease Terms',
    faqs: [
      {
        q: 'What specific legal documents are mandatory to secure a tenancy contract in Qatar?',
        a: "To execute a standard personal lease agreement, you must provide a clear copy of your Qatar ID (QID), a valid passport, active contact credentials, and a book of post-dated cheques corresponding to the lease duration. For corporate leases, commercial retail storefronts, or staff housing blocks, you must also provide a copy of the company's valid Commercial Registration (CR), the fully signed Establishment Card, and the authorized signatory's QID.",
      },
      {
        q: 'Are tenancy contracts in Qatar typically executed on a monthly or annual basis?',
        a: 'The vast majority of residential compounds, standalone family villas, and commercial retail shops in Qatar require a mandatory one-year (12-month) minimum contract. However, certain compact spaces, fully furnished executive studio flats, and managed partition rooms may offer shorter, flexible monthly terms based on individual landlord policies and current real-time vacancies.',
      },
      {
        q: 'What are the absolute most important elements to review before signing my lease?',
        a: 'Before finalizing any tenancy agreement, you must verify the exact lease start and end dates, the specific grace period rules, the penalty terms for early termination, and the maintenance responsibilities. Additionally, ensure the contract explicitly notes whether utilities are included, lists your dedicated shaded parking bays, and details the exact conditions for returnable security deposits.',
      },
      {
        q: 'How does the standard property inquiry and leasing process work with Dania Real Estate?',
        a: 'Our process is designed to save you time and provide absolute transparency through four straightforward steps. First, you share your specific property needs, space requirements, and budget limits with us. Second, our team sends you unedited interior walk-through videos and exact map coordinates. Third, we schedule a physical viewing of your preferred choices. Finally, we handle all landlord negotiations, document collections, and municipal registrations to ensure a secure hand-over.',
      },
    ],
  },
  {
    id: 'fees-costs',
    heading: 'Rental Fees, Costs, and Utilities in Qatar',
    faqs: [
      {
        q: 'Are tenants and business entities required to pay agency brokerage fees in Qatar?',
        a: 'Yes, standard real estate brokerage fees are normal practice across the Qatari rental market. The specific fee amount corresponds directly to the asset type, overall lease length, and specific landlord-broker agreements, typically calculated as a fixed percentage or a half-month rent equivalent. Dania Real Estate explicitly clarifies all associated agency conditions before any property viewing is scheduled.',
      },
      {
        q: 'Are monthly water and electricity (Kahramaa) bills included in the base rental price?',
        a: 'Utility inclusion depends entirely on the building setup and the specific landlord agreement. Many standalone studios, managed partition spaces, low-rise family apartments, and shared staff housing blocks offer all-inclusive rental rates. Conversely, standalone family villas, high-exposure commercial shops, and independent residential flats usually require the tenant to open an independent Kahramaa account and pay monthly consumption fees directly to the state utility provider.',
      },
      {
        q: 'Who holds the legal responsibility for property maintenance repairs during the lease?',
        a: "Under standard Qatari leasing frameworks, major structural maintenance, main air-conditioning overhauls, and plumbing line repairs are the sole responsibility of the landlord or building management. Minor day-to-day wear and tear, cosmetic adjustments, or small appliance bulb changes typically fall under the tenant's responsibility. Every contract we process contains a clear, mutually agreed maintenance clause.",
      },
      {
        q: 'Is dedicated vehicle parking guaranteed and included with all rental properties?',
        a: 'Parking allocations vary based on the specific property configuration, building regulations, and municipality zones. Standalone family villas and master-planned residential compounds naturally offer private multi-car garages or dedicated shaded bays. Urban apartments typically include one assigned basement or courtyard space, while commercial retail shops offer a mix of street parking or shared front plazas. We verify your exact parking allocations before any contract signature.',
      },
    ],
  },
  {
    id: 'viewing-living',
    heading: 'Property Viewing and Daily Living FAQs',
    faqs: [
      {
        q: 'What critical questions should I ask an agent during a live property viewing?',
        a: "During a physical property inspection, you should always ask about the average age of the air-conditioning systems, the compound's maintenance response times, and the typical monthly utility costs if not included. You should also check cell phone signal strength inside the building, inquire about garbage disposal systems, look over the gym or pool rules, and confirm the exact driving distances to your workplace, your children's schools, or nearby transit routes.",
      },
      {
        q: 'Can I review interior photos or media assets before scheduling a physical viewing?',
        a: 'Yes, absolutely. Dania Real Estate actively provides unedited high-definition interior photos, detailed floor layouts, and comprehensive walk-through videos directly via WhatsApp. This digital-first approach ensures you only spend your valuable free time visiting properties that genuinely match your structural preferences and lifestyle standards.',
      },
      {
        q: 'Are domestic pets universally permitted inside rental properties across Doha?',
        a: 'Pet approval policies are decided entirely by individual property landlords, building associations, and compound management groups. Standalone family villas with enclosed outdoor spaces are almost always pet-friendly, whereas high-density residential towers or low-rise apartment blocks often apply strict weight or species limits. Always communicate your pet needs to our team before organizing a viewing.',
      },
      {
        q: 'What is the most practical way to choose the right residential neighborhood in Qatar?',
        a: 'The ideal neighborhood is chosen by finding the perfect balance between your daily work commute, your target budget, and your family\'s educational paths. For instance, professionals working in Lusail or West Bay who value quiet suburban space often favor Al Kharaitiyat or Umm Salal Mohammed. Families seeking established school networks and retail conveniences regularly select Al Aziziya, Abu Hamour, or Old Airport, while those looking for coastal lifestyle value prefer Al Wakra.',
      },
    ],
  },
  {
    id: 'business-staff',
    heading: 'Business, Shops, and Staff Accommodation FAQs',
    faqs: [
      {
        q: 'Can corporate entities and private entrepreneurs easily rent commercial retail shops?',
        a: 'Yes, registered business entities can lease commercial retail storefronts, street-facing showrooms, and office headquarters across designated zoning strips in Qatar. To secure a commercial shop, the lessee must provide a valid Commercial Registration (CR) matching the targeted business activity and obtain final municipal and civil defense approvals, which our corporate asset team helps guide smoothly.',
      },
      {
        q: 'How does corporate staff accommodation structurally differ from standard residential leasing?',
        a: 'Corporate staff accommodation focuses specifically on strict regulatory compliance, workforce capacity metrics, and optimal proximity to industrial transit routes. Unlike standard family tenancies, workforce housing layouts must strictly adhere to Ministry of Labour (MADLSA) regulations regarding living square footage, bathroom ratios, and safety protocols, and are typically leased as standalone blocks, dedicated floors, or multi-villa corporate clusters.',
      },
      {
        q: 'Are companies legally permitted to lease residential villas for staff housing purposes?',
        a: 'Yes, companies can legally lease villas for employee housing, provided the property complies fully with local municipal zoning laws regarding staff housing locations. Qatar applies strict regulations regarding worker accommodation within family residential sectors. Dania Real Estate ensures all corporate villa clusters we represent are properly zoned and cleared for legal workforce occupancy.',
      },
      {
        q: 'What initial operational metrics must a company provide to secure a staff accommodation quote?',
        a: 'To find the most suitable properties quickly, a company should provide the exact total employee headcount, separate supervisor room needs, preferred municipal areas, and targeted monthly budgets. It is also essential to share your main work site locations, required transit parking spaces for corporate buses, and your exact target move-in timeline.',
      },
    ],
  },
  {
    id: 'area-faqs',
    heading: 'Area-Based Rental FAQs in Qatar',
    faqs: [
      {
        q: 'Can your team help me find residential or commercial properties for rent in Al Sadd?',
        a: (
          <>
            Yes, we manage an active inventory of premium rental properties in the vibrant heart of the city. Explore our verified selection of apartments, family flats, commercial offices, and retail storefronts via our dedicated portal for{' '}
            <Link to="/areas/al-sadd/" className="text-forest font-semibold underline hover:text-lime transition-colors">
              Properties for Rent in Al Sadd
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Do you offer localized leasing support for properties for rent in Bin Mahmoud?',
        a: (
          <>
            Yes, we specialize in tracking down properties throughout this highly popular central district. Discover modern residential flats, budget-friendly studios, and commercial units on our specialized page for{' '}
            <Link to="/areas/bin-mahmoud/" className="text-forest font-semibold underline hover:text-lime transition-colors">
              Properties for Rent in Bin Mahmoud
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Is Dania Real Estate fully active in managing properties for rent in Al Wakra?',
        a: (
          <>
            Yes, our leasing network covers both residential and commercial sectors in Qatar's thriving southern hub. View family compounds, coastal flats, and corporate properties directly on our local platform for{' '}
            <Link to="/areas/al-wakra/" className="text-forest font-semibold underline hover:text-lime transition-colors">
              Properties for Rent in Al Wakra
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Can I source family compounds or shops for rent in Al Aziziya & Abu Hamour?',
        a: (
          <>
            Yes, this high-demand western school corridor is one of our main areas of local expertise. Compare active residential family villas, low-rise flats, and busy retail spaces on our localized directory for{' '}
            <Link to="/areas/al-aziziya/" className="text-forest font-semibold underline hover:text-lime transition-colors">
              Properties for Rent in Al Aziziya & Abu Hamour
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Do you track current vacancies for properties for rent in Old Airport & Rawdat Al Matar?',
        a: (
          <>
            Yes, we maintain strong, direct connections with major property owners across these historic and highly accessible transit zones. Browse active listings for apartments, commercial spaces, and staff housing blocks at{' '}
            <Link to="/areas/old-airport/" className="text-forest font-semibold underline hover:text-lime transition-colors">
              Properties for Rent in Old Airport & Rawdat Al Matar
            </Link>
            .
          </>
        ),
      },
      {
        q: 'What property configurations do you support across Umm Salal Mohammed, Ali, and Umm Qarn?',
        a: (
          <>
            We manage an extensive northern portfolio focused on large living spaces and exceptional rental value. Access sprawling independent villas, budget family apartments, and logistics-linked employee housing on our unified platform for{' '}
            <Link to="/areas/umm-salal/" className="text-forest font-semibold underline hover:text-lime transition-colors">
              Properties for Rent in Umm Salal Mohammed
            </Link>
            .
          </>
        ),
      },
      {
        q: 'Can I find verified modern flats, villas, or commercial shops for rent in Al Kharaitiyat?',
        a: (
          <>
            Yes, absolutely. We offer premium coverage throughout this popular suburban neighborhood right next to Doha Festival City. Instantly explore verified local family homes, storefronts, and studios via our dedicated channel for{' '}
            <Link to="/areas/al-kharaitiyat/" className="text-forest font-semibold underline hover:text-lime transition-colors">
              Properties for Rent in Al Kharaitiyat
            </Link>
            .
          </>
        ),
      },
    ],
  },
]

const faqSectionsAr: FaqSection[] = [
  {
    id: 'rental-search',
    heading: 'الأسئلة الشائعة حول البحث عن العقارات وأنواعها',
    intro:
      'ابدأ رحلتك بفهم الهياكل العقارية المتنوعة وشروط الإيجار القانونية وأطر التوافر الإقليمية عبر جميع أنحاء قطر:',
    faqs: [
      {
        q: 'ما أنواع العقارات الإيجارية التي تقدمها دانية للعقارات في قطر؟',
        a: 'تدير دانية للعقارات محفظة شاملة من العقارات السكنية والتجارية للإيجار في جميع أنحاء قطر، تشمل الشقق السكنية (1-2-3 غرف نوم)، والفلل المستقلة والمجمعية، وسكن العمال، والمحلات التجارية، والاستوديوهات وغرف الأقسام.',
      },
      {
        q: 'كيف أبحث عن شقق للإيجار في قطر؟',
        a: 'استخدم تصفح أنواع العقارات للعثور على قائمة الشقق المخصصة لنا. لتصفية النتائج حسب موقعك المفضل، أو الميزانية، أو عدد غرف النوم، تواصل مع فريقنا مباشرة عبر واتساب.',
      },
      {
        q: 'ما الفرق بين الاستوديو وغرفة القسم وشقة غرفة نوم واحدة؟',
        a: 'الاستوديو هو وحدة مستقلة بمساحة معيشة ونوم مفتوحة ومطبخ صغير وحمام خاص. أما غرفة القسم فهي قسم من شقة كبيرة مقسّمة بحواجز داخلية، وتشترك عادةً في المطبخ والحمام مع ساكنين آخرين. وشقة غرفة النوم الواحدة تتضمن غرفة نوم منفصلة وصالة ومطبخاً وحماماً خاصاً — وتوفر خصوصية أكبر من الاستوديو والقسم.',
      },
      {
        q: 'هل يمكنني استئجار فيلا مستقلة في قطر بدون العيش في مجمع سكني؟',
        a: 'نعم. الفلل العادية هي عقارات مستقلة بأسوار حدودية خاصة وبوابات دخول خاصة وساحات خارجية دون أي إدارة مجمع مشتركة. وهي مثالية للعائلات الباحثة عن خصوصية تامة.',
      },
      {
        q: 'ما هو سكن العمال ومن يحتاجه؟',
        a: 'سكن العمال يشير إلى المساكن المخصصة التي تستأجرها الشركات لموظفيها وفرق عملها. ويُعدّ ضرورياً للشركات ذات الاحتياجات السكنية الكبيرة في مجالات البناء والتجزئة والضيافة والخدمات في قطر.',
      },
    ],
  },
  {
    id: 'documents-process',
    heading: 'وثائق الإيجار والإجراءات وشروط العقد',
    faqs: [
      {
        q: 'ما الوثائق المطلوبة لاستئجار شقة في قطر؟',
        a: 'يحتاج المستأجرون الأفراد في قطر عادةً إلى: بطاقة الهوية القطرية (QID) سارية المفعول، ونسخة من جواز السفر، وشيكات مؤجلة التاريخ لفترة الإيجار الكاملة، وتأمين بقيمة شهر إيجار واحد، وشهادة راتب أو خطاب عمل للتحقق من الائتمان.',
      },
      {
        q: 'ما مدة عقد الإيجار القياسي في قطر؟',
        a: 'تُحدد معظم عقود الإيجار السكني في قطر بمدة 12 شهراً مع نظام دفع بشيكات مؤجلة التاريخ. وتوفر بعض العقارات ترتيبات لمدة 6 أشهر. أما عقود سكن العمال المؤسسي فقد تتراوح بين 6 أشهر وسنوات متعددة حسب احتياجات العمل.',
      },
      {
        q: 'ما هو مبلغ التأمين وهل يُردّ؟',
        a: 'مبلغ التأمين يعادل عادةً إيجار شهر واحد يُدفع مقدماً لحماية المالك من التلفيات أو التأخر في الدفع. في قطر، يُردّ مبلغ التأمين بالكامل عند انتهاء العقد شريطة إعادة العقار بحالته الأصلية والوفاء بجميع التزامات الإيجار.',
      },
      {
        q: 'كيف تتعامل دانية للعقارات مع تجديد عقد الإيجار؟',
        a: 'يتواصل فريقنا مع المستأجرين قبل 60 يوماً من انتهاء عقودهم لمناقشة شروط التجديد. وفي حال الرغبة في الانتقال، نتولى تسهيل عملية الانتقال وتقديم خيارات العقارات المتاحة المناسبة.',
      },
    ],
  },
  {
    id: 'fees-costs',
    heading: 'رسوم الإيجار والتكاليف والمرافق في قطر',
    faqs: [
      {
        q: 'هل تتقاضى دانية للعقارات عمولة أو رسوم وساطة؟',
        a: 'لا. لا تتقاضى دانية للعقارات أي عمولة من المستأجرين على جميع عقود الإيجار. خدمتنا مجانية تماماً للمستأجرين — بدون رسوم وساطة أو رسوم إدارية.',
      },
      {
        q: 'هل تشمل الإيجارات رسوم المرافق (كهرمة)؟',
        a: 'يعتمد ذلك على اتفاقية المالك الفردية. كثير من عقاراتنا توفر باقات مرافق شاملة حيث تُضمن فواتير كهرمة الكهرباء والماء ضمن الإيجار الشهري. ونوضح ترتيبات المرافق لكل عقار قبل التوقيع.',
      },
      {
        q: 'ما هي التكاليف الشهرية المعتادة للشقق في الدوحة؟',
        a: 'تتفاوت أسعار الإيجار في الدوحة بشكل ملحوظ حسب الموقع وحجم الشقة ومستوى الأثاث والمرافق المشمولة. كمرجع عام: الاستوديوهات من 2,500-4,500 ريال/شهر؛ الشقق بغرفة نوم واحدة من 3,500-7,000 ريال/شهر؛ الشقق بغرفتين من 5,000-10,000 ريال/شهر؛ الشقق بثلاث غرف من 7,000-15,000 ريال/شهر.',
      },
    ],
  },
  {
    id: 'viewing-living',
    heading: 'الأسئلة الشائعة حول زيارة العقارات والحياة اليومية',
    faqs: [
      {
        q: 'هل يمكنني معاينة العقار قبل الالتزام بعقد الإيجار؟',
        a: 'نعم، بالتأكيد. ننظم زيارات ميدانية لجميع العقارات. تواصل مع فريقنا عبر واتساب لتحديد موعد الزيارة حسب جدولك.',
      },
      {
        q: 'هل يمكنني الحصول على صور أو مقاطع فيديو للعقار قبل الزيارة؟',
        a: 'نعم. يشارك فريقنا صوراً داخلية غير معدّلة ومقاطع جولات عبر واتساب لأي عقار تستفسر عنه — مما يوفر وقتك قبل ترتيب زيارة ميدانية.',
      },
      {
        q: 'ما هو وقت الاستجابة المعتاد بعد إرسال استفسار عبر واتساب؟',
        a: 'يستجيب فريق الإيجار لدينا عادةً خلال ساعة إلى ساعتين في أوقات العمل (السبت-الخميس، 8 صباحاً-8 مساءً). وفي أوقات الذروة أو خارج ساعات العمل، قد يصل وقت الاستجابة إلى 4-6 ساعات.',
      },
    ],
  },
  {
    id: 'business-staff',
    heading: 'الأسئلة الشائعة حول الأعمال والمحلات وسكن العمال',
    faqs: [
      {
        q: 'هل يمكن لدانية للعقارات مساعدة شركتي في إيجاد سكن للموظفين؟',
        a: 'نعم. يتخصص قسم الأعمال المؤسسية لدينا في حلول الإسكان المؤسسي للشركات من جميع الأحجام — من الفرق الصغيرة إلى التجمعات المؤسسية الكبيرة.',
      },
      {
        q: 'ما أنواع المحلات التجارية المتاحة للإيجار في الدوحة؟',
        a: 'تشمل محفظتنا التجارية واجهات محلات في الطوابق الأرضية على الشوارع، ووحدات تجارية داخل المجمعات التجارية، ومساحات تجارية قابلة للتهيئة.',
      },
      {
        q: 'هل يُشترط الحصول على رخصة تجارية (بلدية) لاستئجار محل في قطر؟',
        a: 'نعم. لتشغيل عمل تجاري في قطر، يجب الحصول على رخصة تجارية من بلدية قطر. تمتلك جميع عقاراتنا التجارية شهادات إتمام صالحة وتصنيفات مناطق ملائمة لتسهيل إصدار الرخص.',
      },
    ],
  },
  {
    id: 'area-faqs',
    heading: 'الأسئلة الشائعة حول المناطق الإيجارية في قطر',
    faqs: [
      {
        q: 'أي منطقة في الدوحة الأفضل لاستئجار شقة عائلية؟',
        a: 'للعائلات، نوصي بالسد لقربه من المدارس ومرافق المدينة، وبن محمود لموقعه المركزي، والوكرة لطابعها المجتمعي الهادئ، والعزيزية للقرب من المرافق الترفيهية العائلية.',
      },
      {
        q: 'هل الوكرة منطقة جيدة للإيجار في قطر؟',
        a: 'الوكرة خيار ممتاز للعائلات والمستأجرين الباحثين عن بيئة سكنية هادئة خارج وسط الدوحة مع إيجارات أكثر اقتصادية.',
      },
      {
        q: 'ما خيارات الإيجار المتاحة في الخريطيات؟',
        a: 'الخريطيات منطقة شمالية هادئة توفر مجمعات سكنية اقتصادية وفلل مجمعات عائلية، وهي خيار مثالي للعائلات الكبيرة.',
      },
      {
        q: 'هل توجد عقارات للإيجار قرب منطقة المطار القديم؟',
        a: 'نعم. المطار القديم يُعدّ من أكثر مناطق الإيجار رسوخاً وسهولة الوصول في الدوحة، بأسعار اقتصادية وموقع مميز.',
      },
    ],
  },
]

// Plain-text answers for the area FAQ entries (whose visible answers are JSX),
// used to build valid FAQPage structured data.
const areaFaqPlainText: Record<string, string> = {
  'Can your team help me find residential or commercial properties for rent in Al Sadd?':
    'Yes, we manage an active inventory of premium rental properties in the vibrant heart of the city. Explore our verified selection of apartments, family flats, commercial offices, and retail storefronts via our dedicated portal for Properties for Rent in Al Sadd.',
  'Do you offer localized leasing support for properties for rent in Bin Mahmoud?':
    'Yes, we specialize in tracking down properties throughout this highly popular central district. Discover modern residential flats, budget-friendly studios, and commercial units on our specialized page for Properties for Rent in Bin Mahmoud.',
  'Is Dania Real Estate fully active in managing properties for rent in Al Wakra?':
    "Yes, our leasing network covers both residential and commercial sectors in Qatar's thriving southern hub. View family compounds, coastal flats, and corporate properties directly on our local platform for Properties for Rent in Al Wakra.",
  'Can I source family compounds or shops for rent in Al Aziziya & Abu Hamour?':
    'Yes, this high-demand western school corridor is one of our main areas of local expertise. Compare active residential family villas, low-rise flats, and busy retail spaces on our localized directory for Properties for Rent in Al Aziziya & Abu Hamour.',
  'Do you track current vacancies for properties for rent in Old Airport & Rawdat Al Matar?':
    'Yes, we maintain strong, direct connections with major property owners across these historic and highly accessible transit zones. Browse active listings for apartments, commercial spaces, and staff housing blocks at Properties for Rent in Old Airport & Rawdat Al Matar.',
  'What property configurations do you support across Umm Salal Mohammed, Ali, and Umm Qarn?':
    'We manage an extensive northern portfolio focused on large living spaces and exceptional rental value. Access sprawling independent villas, budget family apartments, and logistics-linked employee housing on our unified platform for Properties for Rent in Umm Salal Mohammed.',
  'Can I find verified modern flats, villas, or commercial shops for rent in Al Kharaitiyat?':
    'Yes, absolutely. We offer premium coverage throughout this popular suburban neighborhood right next to Doha Festival City. Instantly explore verified local family homes, storefronts, and studios via our dedicated channel for Properties for Rent in Al Kharaitiyat.',
}

// Flatten all FAQ entries into plain {q, a} pairs for FAQPage JSON-LD.
const faqSchemaItems = faqSections.flatMap(s =>
  s.faqs.map(f => ({
    q: f.q,
    a: typeof f.a === 'string' ? f.a : areaFaqPlainText[f.q] ?? '',
  })),
).filter(it => it.a)

// ─── FAQ Item ────────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: Readonly<{ q: string; a: React.ReactNode; index: number }>) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={index * 60} direction="up">
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-surface-low transition-colors"
          aria-expanded={open}
        >
          <h3 className="font-semibold text-ink text-sm pr-4">{q}</h3>
          <ChevronDown
            size={18}
            className={`text-forest shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="px-6 pb-5 bg-surface-low">
            <div className="text-ink-muted text-sm leading-relaxed pt-3">{a}</div>
          </div>
        )}
      </div>
    </Reveal>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function FaqPage() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const sections = isAr ? faqSectionsAr : faqSections
  const [openSection, setOpenSection] = useState<string>(faqSections[0].id)

  // FAQPage structured data (per content spec).
  usePageSchema([faqPageSchema(faqSchemaItems)])

  return (
    <>
      <title>Rental Property FAQ Qatar | Tenancy Guide & Rules | Dania Real Estate</title>
      <meta name="description" content="Get expert answers to frequently asked questions about renting apartments, family villas, retail shops, and corporate staff accommodation in Qatar. Learn about Baladiya registration, Kahramaa setup, and leasing laws." />
      {/* S1: Hero */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: text + CTAs */}
            <div>
              <Reveal direction="up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                  {t('faq.hero.h1')}
                </h1>
              </Reveal>
              <Reveal delay={120} direction="up">
                <ScrollRevealText className="text-white/80 text-base md:text-lg leading-relaxed mb-8" text={t('faq.hero.p')} />
              </Reveal>
              <Reveal delay={200} direction="up">
                <div className="flex gap-4 flex-wrap">
                  <Link
                    to="/contact-us/"
                    className="inline-flex items-center gap-2 bg-lime text-forest font-bold px-6 py-3 rounded-full text-sm hover:bg-lime-light transition-colors"
                  >
                    {t('faq.hero.primaryBtn')}
                  </Link>
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 font-bold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-colors"
                  >
                    <MessageCircle size={15} />
                    {t('faq.hero.secondaryBtn')}
                  </a>
                </div>
              </Reveal>
            </div>
            {/* Right: image */}
            <Reveal direction="left" delay={200}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/why-choose-dania-real-estate-qatar.webp"
                  alt="Expert answers to rental property questions in Qatar — Dania Real Estate leasing guide."
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-forest/30" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* S2: Category-Based FAQ Sections */}
      <section className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map(section => {
            const isOpen = openSection === section.id
            return (
              <Reveal key={section.id} direction="up">
                <div className="border border-border rounded-2xl overflow-hidden">
                  {/* Category header / toggle */}
                  <button
                    onClick={() => setOpenSection(isOpen ? '' : section.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-surface-low transition-colors"
                    aria-expanded={isOpen}
                  >
                    <h2 className="text-base md:text-lg font-bold text-ink pr-4">{section.heading}</h2>
                    <ChevronDown
                      size={20}
                      className={`text-forest shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="bg-surface-low px-6 pb-6 pt-2 space-y-3">
                      {section.intro && (
                        <p className="text-ink-muted text-sm leading-relaxed pb-2">{section.intro}</p>
                      )}
                      {section.faqs.map((faq, i) => (
                        <FaqItem key={typeof faq.q === 'string' ? faq.q : i} q={faq.q} a={faq.a} index={i} />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* S3: Final CTA — spec Section 8 "Next Steps" */}
      <section className="bg-forest py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <Reveal direction="up">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
              {isAr
                ? 'هل لا تزال لديك أسئلة حول التنقل في سوق الإيجار في قطر؟'
                : 'Still Have Questions About Navigating the Qatar Rental Market?'}
            </h2>
          </Reveal>
          <Reveal delay={100} direction="up">
            <ScrollRevealText
              className="text-white/75 text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-8"
              text={isAr
                ? 'إيجاد العقار المثالي في قطر لا يجب أن يكون مرهقاً. سواء كنت تبحث عن فيلا مجمعية عائلية قريبة من المدارس الدولية، أو شقة منخفضة الارتفاع في وسط الدوحة، أو سكن عمال مؤسسي متوافق مع اللوائح، أو محل تجاري لتنمية علامتك التجارية، دانية للعقارات هنا لجعل رحلتك سريعة وواضحة وآمنة تماماً.'
                : "Finding the ideal rental property in Qatar shouldn't involve stressful guesswork or endless phone calls to unresponsive numbers. Whether you are searching for a spacious family compound villa close to international schools, a modern low-rise apartment in the center of Doha, a compliant corporate staff housing layout near major industrial expressways, or a high-exposure commercial shop to grow your business brand, Dania Real Estate is here to make your journey fast, clear, and fully secure. Let our team handle the legal administrative tasks, landlord negotiations, and official Baladiya attestation processes on your behalf. Contact our active customer care desk today by phone or send your exact space preferences, target monthly budget, and preferred move-in date straight to our responsive WhatsApp leasing desk for an instantly curated portfolio of verified, active listings."}
            />
          </Reveal>
          <Reveal delay={180} direction="up">
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/contact-us/"
                className="inline-flex items-center gap-2 bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-lime-light transition-colors"
              >
                {isAr ? 'تواصل مع خبرائنا الآن' : 'Connect with Our Leasing Experts Now'}
              </Link>
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/20 transition-colors"
              >
                <MessageCircle size={15} />
                {isAr ? 'تحدث معنا مباشرة عبر واتساب' : 'Chat Live on WhatsApp'}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
