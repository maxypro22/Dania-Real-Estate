import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  MapPin,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/shared/Reveal'
import { LocationIcon } from '@/components/shared/LocationIcon'
import { company, areas } from '@/data/mockData'

// =====================================================================
// In-file content (spec-accurate). English is verbatim from the content
// spec; Arabic is authored to mirror it for isAr support.
// =====================================================================

type Bi = { en: string; ar: string }

const HERO = {
  h1: { en: 'Rental Areas We Serve in Qatar', ar: 'مناطق الإيجار التي نخدمها في قطر' },
  h3: {
    en: "Navigate curated rental properties across Qatar's premier residential, commercial, and industrial sectors with Dania Real Estate.",
    ar: 'تصفّح عقارات إيجار منتقاة عبر أهم القطاعات السكنية والتجارية والصناعية في قطر مع دانية العقارية.',
  },
  p: {
    en: "Finding the ideal rental property in Qatar requires a strategic approach to local geography. Whether you are an corporate enterprise securing scalable staff accommodation, a business owner checking high-footfall retail shops, or an expat family evaluating residential apartments and villas, location directly impacts your operational and daily lifestyle efficiency. Dania Real Estate organizes Qatar's real estate market into clear, neighborhood-specific directories. Use this centralized geographic hub to bypass generic property listings and navigate straight to verified property inventories mapped across Doha's corporate core, connecting transit networks, and expanding suburban growth rings.",
    ar: 'يتطلب العثور على العقار المثالي للإيجار في قطر نهجاً استراتيجياً تجاه الجغرافيا المحلية. سواء كنت مؤسسة تؤمّن سكناً قابلاً للتوسع للموظفين، أو صاحب عمل يبحث عن محلات تجزئة ذات حركة عالية، أو عائلة مغتربة تقيّم الشقق والفلل السكنية، فإن الموقع يؤثر مباشرة على كفاءة عملك وأسلوب حياتك اليومي. تنظّم دانية العقارية سوق العقارات في قطر ضمن أدلة واضحة خاصة بكل حيّ. استخدم هذا المركز الجغرافي الموحّد لتجاوز القوائم العامة والانتقال مباشرة إلى مخزون عقاري موثّق ممتد عبر قلب الدوحة التجاري وشبكات النقل المتصلة وحلقات النمو الضاحوية المتوسعة.',
  },
  primaryBtn: { en: 'Explore Rental Areas', ar: 'استكشف مناطق الإيجار' },
  secondaryBtn: { en: 'Contact Our Team', ar: 'تواصل مع فريقنا' },
  trust: [
    {
      en: 'Mapped directly along major Doha Metro corridors and primary expressway links.',
      ar: 'مرسومة مباشرة على طول ممرات مترو الدوحة الرئيسية ووصلات الطرق السريعة الأساسية.',
    },
    {
      en: 'Filtered by local municipal zones ensuring full tenancy compliance.',
      ar: 'مُصنّفة حسب المناطق البلدية المحلية لضمان الامتثال الكامل لأنظمة الإيجار.',
    },
    {
      en: 'Transparent neighborhood data regarding local amenities, schools, and transit loops.',
      ar: 'بيانات شفافة عن الأحياء تشمل المرافق المحلية والمدارس وشبكات النقل.',
    },
  ],
}

const OVERVIEW = {
  h2: { en: 'Search Rental Properties by Location', ar: 'ابحث عن عقارات الإيجار حسب الموقع' },
  paragraphs: [
    {
      en: 'Selecting your neighborhood is the single most consequential choice in any property lease journey. Your chosen district determines your daily commute patterns, your direct proximity to crucial transit assets like the Doha Metro, your children’s access to educational institutions, and your business’s exposure to target consumer demographics. A misplaced address leads to unnecessary transit delays and inflated operational overheads.',
      ar: 'اختيار الحيّ هو القرار الأهم في أي رحلة لاستئجار عقار. فالمنطقة التي تختارها تحدد أنماط تنقلك اليومي، وقربك المباشر من أصول النقل الحيوية مثل مترو الدوحة، ووصول أطفالك إلى المؤسسات التعليمية، ومدى وصول عملك إلى الفئات المستهدفة من المستهلكين. والعنوان غير المناسب يؤدي إلى تأخيرات غير ضرورية في التنقل وارتفاع في التكاليف التشغيلية.',
    },
    {
      en: 'To eliminate this friction, Dania Real Estate breaks away from messy, unorganized search configurations. This localized master directory functions as an intuitive geographical router. Instead of forcing users through massive, unfiltered catalogs of unrelated units, we empower families, single professionals, and corporate logistics managers to dive directly into specific target sectors that match their real-world routines.',
      ar: 'للقضاء على هذا التعقيد، تبتعد دانية العقارية عن أساليب البحث الفوضوية وغير المنظمة. ويعمل هذا الدليل المحلي الشامل كموجّه جغرافي بديهي. وبدلاً من إجبار المستخدمين على تصفّح قوائم ضخمة غير مفلترة من الوحدات غير ذات الصلة، نمكّن العائلات والمحترفين الأفراد ومديري الخدمات اللوجستية للشركات من الدخول مباشرة إلى القطاعات المستهدفة التي تناسب روتينهم الواقعي.',
    },
    {
      en: 'Every dedicated neighborhood portal hosted within this framework is tailored around local leasing intent. While our primary service listings focus strictly on structural property configurations, these geographical nodes highlight local infrastructure, highway access, and district-specific availability, creating a perfectly balanced browsing environment for users and search engines alike.',
      ar: 'كل بوابة حيّ مخصصة ضمن هذا الإطار مُصمّمة حول نية الإيجار المحلية. وبينما تركّز قوائم خدماتنا الأساسية على التكوينات الإنشائية للعقارات، تُبرز هذه العقد الجغرافية البنية التحتية المحلية والوصول إلى الطرق السريعة والتوفر الخاص بكل منطقة، مما يخلق بيئة تصفّح متوازنة تماماً للمستخدمين ومحركات البحث على حد سواء.',
    },
  ],
}

const GRID = {
  h2: { en: 'Explore Rental Areas Across Qatar', ar: 'استكشف مناطق الإيجار في جميع أنحاء قطر' },
  intro: {
    en: 'Select your target neighborhood below to access our verified property index, current leasing rates, and neighborhood-specific property inventories.',
    ar: 'اختر الحيّ المستهدف أدناه للوصول إلى فهرس عقاراتنا الموثّق وأسعار الإيجار الحالية والمخزون العقاري الخاص بكل حيّ.',
  },
}

// 8 area cards — keyed by mockData slug for counts; names/text/button verbatim.
const AREA_CARDS: Array<{
  slug: string
  name: Bi
  text: Bi
  button: Bi
}> = [
  {
    slug: 'doha',
    name: { en: 'Doha', ar: 'الدوحة' },
    text: {
      en: "Secure premium real estate options within Qatar's active capital core, encompassing Al Dafna’s corporate high-rises, Al Hilal, and Al Mamoura’s family communities. Mapped for maximum accessibility.",
      ar: 'احصل على خيارات عقارية مميزة داخل قلب العاصمة النابض، شاملاً أبراج الدفنة التجارية والهلال ومجتمعات المعمورة العائلية. مرسومة لأقصى درجات سهولة الوصول.',
    },
    button: { en: 'View Doha Area Listings', ar: 'عرض قوائم منطقة الدوحة' },
  },
  {
    slug: 'al-sadd',
    name: { en: 'Al Sadd', ar: 'السد' },
    text: {
      en: 'Experience high-density urban convenience inside a prominent commercial and residential sector. Perfect for expats and corporate teams looking for premium apartments near major metro lines.',
      ar: 'استمتع بسهولة حضرية عالية الكثافة داخل قطاع تجاري وسكني بارز. مثالي للمغتربين وفرق الشركات الباحثين عن شقق مميزة قرب خطوط المترو الرئيسية.',
    },
    button: { en: 'View Al Sadd Listings', ar: 'عرض قوائم السد' },
  },
  {
    slug: 'bin-mahmoud',
    name: { en: 'Bin Mahmoud', ar: 'بن محمود' },
    text: {
      en: 'A beautifully integrated central neighborhood balancing traditional charm with modern flat complexes. Highly requested by professionals working near major medical facilities and downtown office towers.',
      ar: 'حيّ مركزي متكامل بجمال يوازن بين السحر التقليدي ومجمعات الشقق الحديثة. مطلوب بشدة من المحترفين العاملين قرب المرافق الطبية الكبرى وأبراج المكاتب وسط المدينة.',
    },
    button: { en: 'View Bin Mahmoud Listings', ar: 'عرض قوائم بن محمود' },
  },
  {
    slug: 'al-wakra',
    name: { en: 'Al Wakra', ar: 'الوكرة' },
    text: {
      en: 'Explore a flourishing coastal sector offering a more relaxed lifestyle outside central Doha. Features highly affordable family villa compounds, standalone flats, and commercial retail logistics setups.',
      ar: 'استكشف قطاعاً ساحلياً مزدهراً يقدّم أسلوب حياة أكثر هدوءاً خارج وسط الدوحة. يتميز بمجمعات فلل عائلية بأسعار معقولة وشقق مستقلة ومنشآت لوجستية وتجارية.',
    },
    button: { en: 'View Al Wakra Listings', ar: 'عرض قوائم الوكرة' },
  },
  {
    slug: 'al-aziziya',
    name: { en: 'Al Aziziya & Abu Hamour', ar: 'العزيزية وأبو هامور' },
    text: {
      en: 'An established, highly practical residential corridor favored for its spacious independent villas, compound communities, and immediate proximity to major corporate roads like Salwa Road.',
      ar: 'ممر سكني راسخ وعملي للغاية يُفضّل لفلله المستقلة الواسعة ومجتمعاته المسوّرة وقربه المباشر من الطرق الرئيسية مثل طريق سلوى.',
    },
    button: { en: 'View Al Aziziya Listings', ar: 'عرض قوائم العزيزية' },
  },
  {
    slug: 'old-airport',
    name: { en: 'Old Airport & Rawdat Al Matar', ar: 'المطار القديم وروضة المطار' },
    text: {
      en: 'Secure an address inside a classic residential and commercial hub. Offers excellent budget-aware flat configurations and retail spaces along the vibrant Matar Qadeem corridor.',
      ar: 'احصل على عنوان داخل مركز سكني وتجاري عريق. يقدّم خيارات شقق ممتازة تراعي الميزانية ومساحات تجزئة على طول ممر المطار القديم النابض.',
    },
    button: { en: 'View Old Airport Listings', ar: 'عرض قوائم المطار القديم' },
  },
  {
    slug: 'umm-salal',
    name: { en: 'Umm Salal', ar: 'أم صلال' },
    text: {
      en: 'Access highly economical suburban layouts, expansive standalone villas, and practical staff housing solutions situated immediately along the Al Shamal highway network.',
      ar: 'استفد من تصاميم ضاحوية اقتصادية للغاية وفلل مستقلة واسعة وحلول سكن عملية للموظفين تقع مباشرة على طول شبكة طريق الشمال.',
    },
    button: { en: 'View Umm Salal Listings', ar: 'عرض قوائم أم صلال' },
  },
  {
    slug: 'al-kharaitiyat',
    name: { en: 'Al Kharaitiyat', ar: 'الخريطيات' },
    text: {
      en: "Perfect for tenants and large families prioritizing peaceful suburban neighborhoods, ample street parking, and highly cost-effective leasing parameters outside Doha's crowded center.",
      ar: 'مثالي للمستأجرين والعائلات الكبيرة الذين يفضّلون الأحياء الضاحوية الهادئة ومواقف السيارات الواسعة وشروط إيجار اقتصادية للغاية خارج مركز الدوحة المزدحم.',
    },
    button: { en: 'View Al Kharaitiyat Listings', ar: 'عرض قوائم الخريطيات' },
  },
]

const RIGHT_AREA = {
  h2: { en: 'Find the Right Location for Your Rental Search', ar: 'اعثر على الموقع المناسب لبحثك عن إيجار' },
  intro: {
    en: 'Different neighborhoods across Qatar serve distinct structural and operational use cases. Match your core requirement against our functional district guide:',
    ar: 'تخدم الأحياء المختلفة في قطر حالات استخدام إنشائية وتشغيلية متمايزة. طابق متطلبك الأساسي مع دليلنا الوظيفي للمناطق:',
  },
  cards: [
    {
      title: { en: 'For Corporate & Transit Access', ar: 'للوصول المؤسسي والنقل' },
      body: {
        en: 'Doha, Al Sadd, and Bin Mahmoud provide optimal urban infrastructure, placing professionals within walking distance of central office blocks, retail complexes, and major Doha Metro intersection nodes.',
        ar: 'توفّر الدوحة والسد وبن محمود بنية تحتية حضرية مثالية، وتضع المحترفين على مسافة قريبة من مجمعات المكاتب المركزية ومجمعات التجزئة وعقد تقاطع مترو الدوحة الرئيسية.',
      },
    },
    {
      title: { en: 'For Family-Oriented Living', ar: 'للحياة العائلية' },
      body: {
        en: 'Al Wakra, Al Aziziya, Abu Hamour, and Al Kharaitiyat feature quiet residential atmospheres, spacious independent villas, compound layouts, and direct proximity to international schools.',
        ar: 'تتميز الوكرة والعزيزية وأبو هامور والخريطيات بأجواء سكنية هادئة وفلل مستقلة واسعة وتصاميم مجمعات وقرب مباشر من المدارس الدولية.',
      },
    },
    {
      title: { en: 'For Commercial Retail & Shops', ar: 'لتجارة التجزئة والمحلات' },
      body: {
        en: 'High-footfall strips across Central Doha, Al Sadd, Old Airport, and Al Wakra offer strategic storefront positioning, high consumer traffic, and excellent roadside visibility for business owners.',
        ar: 'تقدّم الممرات عالية الحركة في وسط الدوحة والسد والمطار القديم والوكرة مواقع استراتيجية للواجهات وحركة مستهلكين عالية ووضوحاً ممتازاً على الطريق لأصحاب الأعمال.',
      },
    },
    {
      title: { en: 'For Scalable Staff Accommodation', ar: 'لسكن الموظفين القابل للتوسع' },
      body: {
        en: 'Drive down corporate logistics costs by evaluating scalable labor housing and employee villas within suburban or industrial-adjacent zones like Umm Salal and Al Wakra.',
        ar: 'قلّل تكاليف الخدمات اللوجستية للشركات من خلال تقييم سكن العمالة القابل للتوسع وفلل الموظفين ضمن المناطق الضاحوية أو المجاورة للصناعات مثل أم صلال والوكرة.',
      },
    },
  ],
}

const PROPERTY_TYPES = {
  h2: { en: 'Explore Property Types Across Served Locations', ar: 'استكشف أنواع العقارات عبر المواقع المخدومة' },
  lead: {
    en: 'Once you have identified a neighborhood that matches your daily commute or corporate logistics paths, you can refine your search by filtering for specific property types. Dania Real Estate maintains specialized portfolios across all core structural categories:',
    ar: 'بمجرد تحديد الحيّ الذي يناسب تنقلك اليومي أو مسارات الخدمات اللوجستية لشركتك، يمكنك تحسين بحثك بالتصفية حسب أنواع عقارات محددة. تحتفظ دانية العقارية بمحافظ متخصصة عبر جميع الفئات الإنشائية الأساسية:',
  },
  links: [
    {
      name: { en: 'Apartments for Rent', ar: 'شقق للإيجار' },
      desc: {
        en: "Browse 1-bedroom, 2-bedroom, and spacious 3-bedroom flat configurations across Qatar's urban centers.",
        ar: 'تصفّح شققاً بغرفة نوم وغرفتين وثلاث غرف نوم واسعة عبر المراكز الحضرية في قطر.',
      },
      href: '/apartments-for-rent/',
    },
    {
      name: { en: 'Villas for Rent', ar: 'فلل للإيجار' },
      desc: {
        en: 'Access premium compound housing, independent family homes, and standalone villas within suburban residential communities.',
        ar: 'احصل على سكن مجمعات مميز ومنازل عائلية مستقلة وفلل منفصلة ضمن المجتمعات السكنية الضاحوية.',
      },
      href: '/villas-for-rent/',
    },
    {
      name: { en: 'Staff Accommodation', ar: 'سكن الموظفين' },
      desc: {
        en: 'Secure compliant corporate housing blocks, corporate bachelors quarters, and scalable employee accommodation.',
        ar: 'أمّن مجمعات سكن مؤسسية متوافقة وأماكن إقامة للعزّاب وسكن موظفين قابل للتوسع.',
      },
      href: '/staff-accommodation/',
    },
    {
      name: { en: 'Shops for Rent', ar: 'محلات للإيجار' },
      desc: {
        en: 'Position your business inside high-visibility retail storefronts, commercial offices, and functional business showrooms.',
        ar: 'ضع عملك داخل واجهات تجزئة عالية الوضوح ومكاتب تجارية وصالات عرض عملية.',
      },
      href: '/shops-for-rent/',
    },
    {
      name: { en: 'Studio & Partition Rentals', ar: 'إيجار استوديوهات وغرف بارتيشن' },
      desc: {
        en: 'Explore cost-efficient compact living spaces, private standalone studios, and budget-friendly partition room options.',
        ar: 'استكشف مساحات معيشة مدمجة اقتصادية واستوديوهات مستقلة خاصة وخيارات غرف بارتيشن بأسعار مناسبة.',
      },
      href: '/studio-partition-rentals/',
    },
  ],
}

const WHY = {
  h2: { en: 'Why Area-Based Rental Search Helps', ar: 'لماذا يساعدك البحث عن الإيجار حسب المنطقة' },
  intro: {
    en: 'Filtering your property hunt through a strict geographic framework helps you find listings that integrate perfectly with your real-world daily obligations.',
    ar: 'تصفية بحثك العقاري عبر إطار جغرافي صارم يساعدك على إيجاد قوائم تتكامل تماماً مع التزاماتك اليومية الواقعية.',
  },
  cards: [
    {
      title: { en: 'Optimized Commute Controls', ar: 'تحكم محسّن في التنقل' },
      body: {
        en: 'Reduce your daily travel stress by matching your target residential address against your office location or primary Doha Metro lines.',
        ar: 'قلّل ضغط تنقلك اليومي بمطابقة عنوانك السكني المستهدف مع موقع مكتبك أو خطوط مترو الدوحة الرئيسية.',
      },
    },
    {
      title: { en: 'Local Lifestyle Matching', ar: 'مطابقة نمط الحياة المحلي' },
      body: {
        en: 'Match your lifestyle with your neighborhood, balancing the fast-paced energy of urban centers with the quiet comfort of outer suburbs.',
        ar: 'طابق نمط حياتك مع حيّك، موازناً بين طاقة المراكز الحضرية السريعة وراحة الضواحي الخارجية الهادئة.',
      },
    },
    {
      title: { en: 'Efficient Inventory Filtering', ar: 'تصفية فعّالة للمخزون' },
      body: {
        en: 'Save valuable time by isolating your browsing to neighborhoods that actively match your real-world target pricing sweet spots.',
        ar: 'وفّر وقتاً ثميناً بحصر تصفّحك في الأحياء التي تطابق فعلياً نطاقات الأسعار المستهدفة لديك.',
      },
    },
    {
      title: { en: 'Faster Leasing Execution', ar: 'تنفيذ أسرع للإيجار' },
      body: {
        en: 'When you isolate a specific neighborhood, our dedicated area specialists can instantly deliver unedited walkthrough videos of available vacancies.',
        ar: 'عند تحديد حيّ معيّن، يمكن لمختصي المناطق لدينا تقديم مقاطع فيديو غير معدّلة فوراً للوحدات الشاغرة المتاحة.',
      },
    },
  ],
}

const HOW = {
  h2: { en: 'How Our Area-Based Rental Support Works', ar: 'كيف يعمل دعمنا للإيجار القائم على المناطق' },
  steps: [
    {
      title: { en: 'Pinpoint Your Preferred Area', ar: 'حدّد منطقتك المفضّلة' },
      body: {
        en: 'Select the specific neighborhood or geographic corridor that aligns with your professional workplace, commuting paths, or corporate logistical hubs.',
        ar: 'اختر الحيّ المحدد أو الممر الجغرافي الذي يتوافق مع مكان عملك المهني أو مسارات تنقلك أو مراكز شركتك اللوجستية.',
      },
    },
    {
      title: { en: 'Specify Your Structural Property Type', ar: 'حدّد نوع العقار الإنشائي' },
      body: {
        en: 'Inform our team whether your current requirement demands a compact studio, a family flat, an independent villa, a retail shop, or employee housing.',
        ar: 'أبلغ فريقنا ما إذا كان متطلبك الحالي يستدعي استوديو مدمجاً أو شقة عائلية أو فيلا مستقلة أو محل تجزئة أو سكن موظفين.',
      },
    },
    {
      title: { en: 'Define Your Budget and Timeline Parameters', ar: 'حدّد ميزانيتك وإطارك الزمني' },
      body: {
        en: 'State your target monthly rental limit, required move-in date, and any essential neighborhood parameters like metro line proximity.',
        ar: 'حدّد سقف الإيجار الشهري المستهدف وتاريخ الانتقال المطلوب وأي معايير أساسية للحيّ مثل القرب من خط المترو.',
      },
    },
    {
      title: { en: 'Receive Mapped Property Matches', ar: 'استلم مطابقات عقارية على الخريطة' },
      body: {
        en: 'Our location specialists pull matching options from our database, sending unedited media assets and exact coordinate details directly to your mobile device.',
        ar: 'يسحب مختصو المواقع لدينا الخيارات المطابقة من قاعدة بياناتنا، ويرسلون وسائط غير معدّلة وتفاصيل إحداثيات دقيقة مباشرة إلى هاتفك.',
      },
    },
  ],
}

const FAQS: Array<{ q: Bi; a: Bi }> = [
  {
    q: {
      en: 'Why is it more effective to start my property search by neighborhood rather than property type?',
      ar: 'لماذا يكون بدء بحثي العقاري حسب الحيّ أكثر فعالية من البدء حسب نوع العقار؟',
    },
    a: {
      en: 'Starting your search by area ensures your home or business integrates seamlessly with your daily routine, minimizing traffic delays, securing access to preferred schools, and keeping you close to primary transit options like the Doha Metro.',
      ar: 'بدء بحثك حسب المنطقة يضمن اندماج منزلك أو عملك بسلاسة مع روتينك اليومي، مقللاً تأخيرات المرور، ومؤمّناً الوصول إلى المدارس المفضّلة، ومبقياً إياك قرب خيارات النقل الأساسية مثل مترو الدوحة.',
    },
  },
  {
    q: {
      en: 'Can I filter for both residential and commercial properties within these specific area pages?',
      ar: 'هل يمكنني التصفية للعقارات السكنية والتجارية معاً ضمن صفحات المناطق المحددة هذه؟',
    },
    a: {
      en: 'Yes, absolutely. Dania Real Estate operates across multiple real estate sectors. Each individual area portal covers our complete local inventory, including apartments, family villas, commercial retail shops, and scalable staff housing.',
      ar: 'نعم، بالتأكيد. تعمل دانية العقارية عبر قطاعات عقارية متعددة. وتغطي كل بوابة منطقة مخزوننا المحلي الكامل، بما في ذلك الشقق والفلل العائلية ومحلات التجزئة التجارية وسكن الموظفين القابل للتوسع.',
    },
  },
  {
    q: {
      en: 'Does this master directory show real-time unit vacancies for every neighborhood listed?',
      ar: 'هل يعرض هذا الدليل الرئيسي الوحدات الشاغرة في الوقت الفعلي لكل حيّ مدرج؟',
    },
    a: {
      en: 'This master page functions as a geographic router and structural index. For up-to-the-minute availability, walkthrough videos, and current pricing sheets for any specific neighborhood, connect directly with our active WhatsApp leasing desk.',
      ar: 'تعمل هذه الصفحة الرئيسية كموجّه جغرافي وفهرس إنشائي. للحصول على التوفر اللحظي ومقاطع الفيديو وقوائم الأسعار الحالية لأي حيّ محدد، تواصل مباشرة مع مكتب الإيجار النشط لدينا عبر واتساب.',
    },
  },
  {
    q: {
      en: 'How do rental pricing averages fluctuate across the different areas served by Dania Real Estate?',
      ar: 'كيف تتفاوت متوسطات أسعار الإيجار عبر المناطق المختلفة التي تخدمها دانية العقارية؟',
    },
    a: {
      en: 'High-density urban zones such as Al Sadd and Central Doha usually command higher rates due to their premium transit connections and central locations. Outer suburbs and coastal districts like Umm Salal and Al Wakra offer highly affordable alternatives with larger footprints.',
      ar: 'عادةً ما تتطلب المناطق الحضرية عالية الكثافة مثل السد ووسط الدوحة أسعاراً أعلى بسبب اتصالاتها المميزة بالنقل ومواقعها المركزية. وتقدّم الضواحي الخارجية والمناطق الساحلية مثل أم صلال والوكرة بدائل اقتصادية للغاية بمساحات أكبر.',
    },
  },
  {
    q: {
      en: 'Which specific neighborhoods are recommended for companies requiring large-scale employee housing?',
      ar: 'ما الأحياء المحددة الموصى بها للشركات التي تحتاج إلى سكن موظفين واسع النطاق؟',
    },
    a: {
      en: 'For scalable corporate staff housing, districts like Umm Salal and Al Wakra are highly recommended. They provide excellent road connectivity to primary industrial highways while remaining highly cost-effective.',
      ar: 'لسكن موظفي الشركات القابل للتوسع، يُوصى بشدة بمناطق مثل أم صلال والوكرة. فهي توفّر اتصالاً ممتازاً بالطرق الصناعية الرئيسية مع بقائها اقتصادية للغاية.',
    },
  },
  {
    q: {
      en: 'Can your team support property searches in neighborhoods not explicitly listed on this master index?',
      ar: 'هل يمكن لفريقكم دعم البحث عن عقارات في أحياء غير مدرجة صراحة في هذا الفهرس الرئيسي؟',
    },
    a: {
      en: 'Yes. Our database extends beyond this master list to cover adjacent residential streets and commercial pockets. Contact our team via phone or WhatsApp with your exact location parameters, and we will source matching vacancies.',
      ar: 'نعم. تمتد قاعدة بياناتنا إلى ما هو أبعد من هذه القائمة الرئيسية لتغطية الشوارع السكنية المجاورة والجيوب التجارية. تواصل مع فريقنا عبر الهاتف أو واتساب بمعايير موقعك الدقيقة، وسنوفّر لك الوحدات الشاغرة المطابقة.',
    },
  },
]

const FINAL_CTA = {
  h2: {
    en: 'Need Expert Guidance Choosing Your Next Location in Qatar?',
    ar: 'هل تحتاج إرشاداً خبيراً لاختيار موقعك التالي في قطر؟',
  },
  p: {
    en: 'Banish the frustration of analyzing unverified classified maps and driving through unfamiliar streets. Whether you are an expat professional aligning your home with the Doha Metro, a family looking for a peaceful suburban compound, or a corporate enterprise optimizing employee logistics, the local experts at Dania Real Estate are here to guide you. Contact our active leasing desk right now via WhatsApp. Share your preferred neighborhood, target property configuration, and monthly budget limits to receive a curated portfolio of verified vacancies sent straight to your mobile device.',
    ar: 'تخلّص من إحباط تحليل الخرائط المبوّبة غير الموثّقة والقيادة في شوارع غير مألوفة. سواء كنت محترفاً مغترباً تنسّق منزلك مع مترو الدوحة، أو عائلة تبحث عن مجمع ضاحوي هادئ، أو مؤسسة تحسّن الخدمات اللوجستية لموظفيها، فإن خبراء دانية العقارية المحليين هنا لإرشادك. تواصل مع مكتب الإيجار النشط لدينا الآن عبر واتساب. شارك حيّك المفضّل ونوع العقار المستهدف وسقف ميزانيتك الشهرية لتستلم محفظة منتقاة من الوحدات الشاغرة الموثّقة مباشرة إلى هاتفك.',
  },
  primary: { en: 'Chat with Our Location Specialists Now', ar: 'تحدّث مع مختصي المواقع لدينا الآن' },
  secondary: { en: 'Contact Our Team Today', ar: 'تواصل مع فريقنا اليوم' },
}

const AREA_GRID_ID = 'area-grid'

// -- Interactive Qatar Map ----------------------------------------------------
const QATAR_PATH =
  'M 200,35 L 270,65 L 330,155 L 345,275 L 305,385 L 250,440 L 155,440 L 88,385 L 80,270 L 112,155 L 158,70 Z'

const SHORT_NAMES: Record<string, string> = {
  'doha':           'Central Doha',
  'al-sadd':        'Al Sadd',
  'bin-mahmoud':    'Bin Mahmoud',
  'al-wakra':       'Al Wakra',
  'al-aziziya':     'Al Aziziya',
  'old-airport':    'Old Airport',
  'umm-salal':      'Umm Salal',
  'al-kharaitiyat': 'Al Kharaitiyat',
}

const SHORT_NAMES_AR: Record<string, string> = {
  'doha':           'الدوحة',
  'al-sadd':        'السد',
  'bin-mahmoud':    'بن محمود',
  'al-wakra':       'الوكرة',
  'al-aziziya':     'العزيزية',
  'old-airport':    'المطار القديم',
  'umm-salal':      'أم صلال',
  'al-kharaitiyat': 'الخريطيات',
}

const MAP_PINS = [
  { slug: 'doha',           x: 300, y: 295, anchor: 'start' as const, cardDY:   0 },
  { slug: 'old-airport',    x: 280, y: 255, anchor: 'start' as const, cardDY:   0 },
  { slug: 'al-sadd',        x: 262, y: 280, anchor: 'end'   as const, cardDY:   0 },
  { slug: 'bin-mahmoud',    x: 255, y: 322, anchor: 'end'   as const, cardDY:   0 },
  { slug: 'al-wakra',       x: 252, y: 402, anchor: 'start' as const, cardDY: -38 },
  { slug: 'al-aziziya',     x: 210, y: 355, anchor: 'end'   as const, cardDY:   0 },
  { slug: 'umm-salal',      x: 205, y: 193, anchor: 'end'   as const, cardDY:   0 },
  { slug: 'al-kharaitiyat', x: 182, y: 140, anchor: 'end'   as const, cardDY:   0 },
]

const ARCS = [
  { x1: 300, y1: 295, cpx: 345, cpy: 355, x2: 252, y2: 402 },
  { x1: 300, y1: 295, cpx: 272, cpy: 238, x2: 205, y2: 193 },
  { x1: 300, y1: 295, cpx: 325, cpy: 328, x2: 210, y2: 355 },
  { x1: 205, y1: 193, cpx: 190, cpy: 163, x2: 182, y2: 140 },
  { x1: 300, y1: 295, cpx: 308, cpy: 268, x2: 280, y2: 255 },
]

const CW = 96   // card width
const CH = 30   // card height

function QatarMapWidget({ isAr }: { isAr: boolean }) {
  const [active, setActive] = useState<string>('doha')
  const activeArea = areas.find(a => a.slug === active)
  const names = isAr ? SHORT_NAMES_AR : SHORT_NAMES

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none h-[340px] sm:h-[420px] lg:h-[500px]"
      style={{ background: '#180806' }}
    >
      {/* Hex dot grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="qdots" x="0" y="0" width="22" height="19.05" patternUnits="userSpaceOnUse">
            <circle cx="11"   cy="9.525" r="1.2" fill="rgba(196,98,45,0.2)" />
            <circle cx="0"    cy="0"     r="1.2" fill="rgba(196,98,45,0.2)" />
            <circle cx="22"   cy="0"     r="1.2" fill="rgba(196,98,45,0.2)" />
            <circle cx="0"    cy="19.05" r="1.2" fill="rgba(196,98,45,0.2)" />
            <circle cx="22"   cy="19.05" r="1.2" fill="rgba(196,98,45,0.2)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#qdots)" />
      </svg>

      {/* Map SVG */}
      <svg
        viewBox="0 0 400 480"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Qatar glow halo */}
        <path d={QATAR_PATH} fill="none" stroke="#C4622D" strokeWidth="10" strokeOpacity="0.06" />
        {/* Qatar land */}
        <path d={QATAR_PATH} fill="#3D1510" stroke="#C4622D" strokeWidth="1.5" strokeOpacity="0.65" />

        {/* QATAR watermark */}
        <text x="128" y="248" fontSize="27" fill="rgba(196,98,45,0.05)"
          fontWeight="900" fontFamily="sans-serif" letterSpacing="8">QATAR</text>

        {/* Curved arc connections */}
        {ARCS.map((a, i) => (
          <path
            key={i}
            d={`M ${a.x1} ${a.y1} Q ${a.cpx} ${a.cpy} ${a.x2} ${a.y2}`}
            fill="none"
            stroke="#C4622D"
            strokeWidth="1.1"
            strokeOpacity="0.3"
            strokeDasharray="5,6"
          />
        ))}

        {/* Pins */}
        {MAP_PINS.map(pin => {
          const isActive = active === pin.slug
          const area = areas.find(a => a.slug === pin.slug)

          const isRight = pin.anchor === 'start'
          const rx = isRight ? pin.x + 12 : pin.x - 12 - CW
          const ry = pin.y - CH / 2 + pin.cardDY
          const textX = isRight ? rx + 9 : rx + CW - 9

          return (
            <g
              key={pin.slug}
              onMouseEnter={() => setActive(pin.slug)}
              onTouchStart={() => setActive(pin.slug)}
              onClick={() => setActive(pin.slug)}
              style={{ cursor: 'pointer' }}
            >
              {/* outer glow */}
              {isActive && <circle cx={pin.x} cy={pin.y} r="22" fill="#C4622D" opacity="0.14" />}

              {/* ring */}
              <circle
                cx={pin.x} cy={pin.y}
                r={isActive ? 12 : 8}
                fill="none"
                stroke="#C4622D"
                strokeWidth={isActive ? 1.8 : 1}
                strokeOpacity={isActive ? 1 : 0.4}
              />

              {/* icon square */}
              <rect
                x={pin.x - (isActive ? 7 : 4.5)}
                y={pin.y - (isActive ? 7 : 4.5)}
                width={isActive ? 14 : 9}
                height={isActive ? 14 : 9}
                rx={isActive ? 3.5 : 2.5}
                fill={isActive ? '#C4622D' : '#4A1A08'}
                stroke={isActive ? '#FDFAF7' : '#C4622D'}
                strokeWidth={isActive ? 1.5 : 0.8}
                strokeOpacity={isActive ? 1 : 0.6}
              />

              {/* connector line pin→card */}
              <line
                x1={isRight ? pin.x + 12 : pin.x - 12}
                y1={pin.y}
                x2={isRight ? rx : rx + CW}
                y2={ry + CH / 2}
                stroke={isActive ? '#C4622D' : 'rgba(196,98,45,0.25)'}
                strokeWidth="0.8"
              />

              {/* card background */}
              <rect
                x={rx} y={ry} width={CW} height={CH} rx="7"
                fill={isActive ? 'white' : 'rgba(20,7,4,0.88)'}
                stroke={isActive ? '#C4622D' : 'rgba(196,98,45,0.3)'}
                strokeWidth={isActive ? 1.5 : 0.8}
              />

              {/* area name */}
              <text
                x={textX} y={ry + 12}
                fontSize="8.5"
                fill={isActive ? '#1A0808' : 'rgba(255,255,255,0.78)'}
                fontWeight={isActive ? '700' : '500'}
                fontFamily="sans-serif"
                textAnchor={isRight ? 'start' : 'end'}
              >
                {names[pin.slug]}
              </text>

              {/* listing count */}
              <text
                x={textX} y={ry + 23}
                fontSize="7.5"
                fill={isActive ? '#C4622D' : 'rgba(196,98,45,0.65)'}
                fontWeight={isActive ? '700' : '400'}
                fontFamily="sans-serif"
                textAnchor={isRight ? 'start' : 'end'}
              >
                {area?.count} {isAr ? 'عرض' : 'Listings'}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Bottom detail panel */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <div className="h-14 bg-gradient-to-t from-[#180806] to-transparent" />
      </div>

      {activeArea && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-light flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-forest" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-ink text-sm leading-tight">{activeArea.name}</p>
                <span className="bg-lime text-forest text-[9px] font-black px-2 py-0.5 rounded-full shrink-0">
                  {activeArea.count} Listings
                </span>
              </div>
              <p className="text-ink-muted text-[11px] leading-snug line-clamp-1">{activeArea.description}</p>
            </div>
            <Link
              to={`/areas/${activeArea.slug}/`}
              className="inline-flex items-center gap-1.5 bg-forest text-white font-bold text-xs px-4 py-2 rounded-full hover:bg-lime hover:text-forest transition-colors shrink-0"
            >
              View <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      )}

      <p className="absolute top-4 left-4 text-white/18 text-[10px] font-bold tracking-[0.3em] pointer-events-none">
        QATAR
      </p>
    </div>
  )
}

// -- FAQ accordion item -------------------------------------------------------
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-surface-low transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-ink text-base">{q}</span>
        <ChevronDown
          className={`shrink-0 text-forest transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
          size={20}
        />
      </button>
      {open && (
        <div className="px-6 py-5 bg-surface-low border-t border-border">
          <p className="text-ink-muted leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

// -- Page ---------------------------------------------------------------------
export function AreasPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const waLink = `https://wa.me/${company.whatsapp}`
  const L = (b: Bi) => (isAr ? b.ar : b.en)

  return (
    <>
      <title>Areas We Serve in Qatar | Dania Real Estate Rental Locations</title>
      <meta
        name="description"
        content="Explore the major residential and commercial rental locations served by Dania Real Estate across Qatar. Find apartments, villas, and staff spaces by area."
      />

      {/* -- S1 Hero --------------------------------------------------------- */}
      <section className="bg-forest text-white py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Reveal direction="up">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl">
                  {L(HERO.h1)}
                </h1>
              </Reveal>

              <Reveal direction="up" delay={80}>
                <h3 className="text-xl font-semibold text-white/90 max-w-2xl mb-5">
                  {L(HERO.h3)}
                </h3>
              </Reveal>

              <Reveal direction="up" delay={160}>
                <p className="text-white/75 max-w-2xl leading-relaxed mb-8">
                  {L(HERO.p)}
                </p>
              </Reveal>

              <Reveal direction="up" delay={240}>
                <div className="flex flex-wrap gap-4 mb-10">
                  <a
                    href={`#${AREA_GRID_ID}`}
                    className="inline-block bg-lime text-forest font-bold px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
                  >
                    {L(HERO.primaryBtn)}
                  </a>
                  <Link
                    to="/contact-us/"
                    className="inline-block border-2 border-white text-white font-bold px-7 py-3 rounded-full hover:bg-white hover:text-forest transition-colors"
                  >
                    {L(HERO.secondaryBtn)}
                  </Link>
                </div>
              </Reveal>

              <Reveal direction="up" delay={320}>
                <div className="flex flex-col gap-3">
                  {HERO.trust.map(point => (
                    <div key={point.en} className="flex items-start gap-2 text-white/90">
                      <CheckCircle2 size={20} className="text-lime shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold">{L(point)}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <QatarMapWidget isAr={isAr} />
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg z-10">
                  {isAr ? 'بدون عمولة' : 'Zero Commission'}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -- S2 Location Search Overview ------------------------------------ */}
      <section className="py-20 bg-surface-low">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-6">
              {L(OVERVIEW.h2)}
            </h2>
          </Reveal>

          {OVERVIEW.paragraphs.map((para, i) => (
            <Reveal key={i} direction="up" delay={80 + i * 80}>
              <p className="text-ink-muted leading-relaxed max-w-3xl mb-4 last:mb-0">
                {L(para)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -- S3 Area Cards Grid --------------------------------------------- */}
      <section id={AREA_GRID_ID} className="py-20 bg-white scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-2">
              {L(GRID.h2)}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-10 max-w-3xl">
              {L(GRID.intro)}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AREA_CARDS.map((card, i) => {
              const delay = (i % 3) * 80
              return (
                <Reveal key={card.slug} direction="up" delay={delay}>
                  <div className="group relative rounded-2xl border border-border p-6 flex flex-col h-full bg-white overflow-hidden shadow-sm hover:shadow-2xl active:shadow-sm hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300">
                    {/* sweep fill – GPU transform */}
                    <div className="absolute inset-0 bg-forest translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out will-animate" />

                    {/* Luxury location badge */}
                    <div className="relative z-10 mb-4 inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime to-lime-dark text-white shadow-lg shadow-lime/30 ring-1 ring-white/30 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-110 transition-transform duration-300 ease-out">
                      <LocationIcon size={22} />
                    </div>

                    {/* Name */}
                    <h3 className="relative z-10 text-base font-bold mb-2 text-ink group-hover:text-white group-active:text-white transition-colors duration-300">
                      {L(card.name)}
                    </h3>

                    {/* Description */}
                    <p className="relative z-10 text-sm leading-relaxed mb-4 flex-1 text-ink-muted group-hover:text-white/70 group-active:text-white/70 transition-colors duration-300">
                      {L(card.text)}
                    </p>

                    {/* View button */}
                    <Link
                      to={`/areas/${card.slug}/`}
                      className="relative z-10 mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-forest group-hover:text-lime transition-colors duration-300"
                    >
                      {L(card.button)} <ArrowRight size={14} />
                    </Link>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* -- S4 Find the Right Location ------------------------------------- */}
      <section className="py-20 bg-surface-low">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {L(RIGHT_AREA.h2)}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted leading-relaxed max-w-3xl mb-10">
              {L(RIGHT_AREA.intro)}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RIGHT_AREA.cards.map((card, i) => (
              <Reveal key={card.title.en} direction="up" delay={i * 80}>
                <div className="bg-white rounded-2xl border border-border p-6 h-full">
                  <h3 className="text-base font-bold text-ink mb-3">{L(card.title)}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{L(card.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -- S5 Property Types Across Locations ----------------------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {L(PROPERTY_TYPES.h2)}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted leading-relaxed max-w-3xl mb-10">
              {L(PROPERTY_TYPES.lead)}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROPERTY_TYPES.links.map((link, i) => (
              <Reveal key={link.href} direction="up" delay={(i % 3) * 80}>
                <Link
                  to={link.href}
                  className="group flex flex-col h-full rounded-xl border border-border bg-surface-low p-6 hover:border-forest hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-base text-ink group-hover:text-forest transition-colors">
                      {L(link.name)}
                    </span>
                    <ArrowRight size={16} className="text-lime shrink-0" />
                  </div>
                  <p className="text-ink-muted text-sm leading-relaxed">{L(link.desc)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -- S6 Why Area-Based Search Helps --------------------------------- */}
      <section className="py-20 bg-surface-low">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              {L(WHY.h2)}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted leading-relaxed max-w-3xl mb-10">
              {L(WHY.intro)}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.cards.map((card, i) => (
              <Reveal key={card.title.en} direction="up" delay={i * 80}>
                <div className="bg-white rounded-2xl border border-border p-6 h-full">
                  <h3 className="text-base font-bold text-ink mb-3">{L(card.title)}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{L(card.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -- S7 How Our Area-Based Support Works ---------------------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {L(HOW.h2)}
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW.steps.map((step, i) => (
              <Reveal key={step.title.en} direction="up" delay={i * 80}>
                <div className="bg-surface-low rounded-2xl border border-border p-6 h-full">
                  <div className="w-10 h-10 rounded-full bg-forest text-white font-black flex items-center justify-center mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-base font-bold text-ink mb-3">{L(step.title)}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{L(step.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -- S8 FAQ --------------------------------------------------------- */}
      <section className="py-20 bg-surface-low">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-10">
              {isAr ? 'الأسئلة الشائعة حول البحث حسب المنطقة' : 'Area Search FAQs'}
            </h2>
          </Reveal>

          <div className="flex flex-col gap-4 max-w-3xl">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q.en} direction="up" delay={i * 80}>
                <FaqItem q={L(faq.q)} a={L(faq.a)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -- S9 Final CTA --------------------------------------------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <div className="bg-lime rounded-2xl p-10 md:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
                {L(FINAL_CTA.h2)}
              </h2>
              <p className="text-forest/80 max-w-2xl mx-auto leading-relaxed mb-8">
                {L(FINAL_CTA.p)}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-forest text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  {L(FINAL_CTA.primary)}
                </a>
                <Link
                  to="/contact-us/"
                  className="inline-block border-2 border-forest text-forest font-bold px-8 py-3 rounded-full hover:bg-forest hover:text-white transition-colors"
                >
                  {L(FINAL_CTA.secondary)}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
