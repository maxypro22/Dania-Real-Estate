import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  MapPin,
  Wifi,
  Banknote,
  Home,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Building2,
  Layers,
  Star,
} from 'lucide-react'
import { company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { ProcessSteps } from '@/components/shared/ProcessSteps'
import { usePageSchema } from '@/components/shared/Seo'
import { faqPageSchema } from '@/lib/seo'

// â"€â"€â"€ Types â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

interface Props { filter: 'all' | 'studio' | 'partition' | '1br' }

interface ComparisonRow { feature: string; left: string; right: string; links?: { label: string; to: string }[] }

interface ContentAll {
  kind: 'all'
  h1: string; h3: string; heroParagraph: string; primaryCta: string; trustPoints: string[]
  overviewH2: string; overviewP1: string; overviewP2: string; overviewP3: string
  overviewInternalLink: { text: string; to: string }
  categoriesH2: string; categoriesIntro: string
  categories: { h3: string; text: string; cta: string; to: string }[]
  benefitsH2: string; benefitsIntro: string
  benefits: { h3: string; text: string }[]
  audienceH2: string; audience: string[]
  areasH2: string; areasParagraph: string
  whyH2: string; whyIntro: string; whyCards: { h3: string; text: string }[]
  processH2: string; steps: { h3: string; text: string }[]
  suitabilityH2: string; suitabilityP1: string; suitabilityP2: string
  calloutH3: string; calloutText: string
  bridgeH2: string; bridgeIntro: string
  bridges: { h3: string; text: string; cta: string; to: string }[]
  faqH2: string; faqs: { q: string; a: string }[]
  finalH2: string; finalParagraph: string; finalPrimaryCta: string
}

interface ContentSub {
  kind: 'sub'
  h1: string; h3: string; heroParagraph: string; primaryCta: string; trustPoints: string[]
  overviewH2: string; overviewP1: string; overviewP2: string; overviewP3: string
  overviewNavLinks: { text: string; to: string }[]
  benefitsH2: string; benefitsIntro: string
  benefits: { h3: string; text: string }[]
  comparisonH2: string; comparisonIntro: string; comparisonRows: ComparisonRow[]
  audienceH2: string; audience: string[]
  areasH2: string; areasParagraph: string
  whyH2: string; whyIntro: string; whyCards: { h3: string; text: string }[]
  processH2: string; steps: { h3: string; text: string }[]
  suitabilityH2: string; suitabilityP1: string; suitabilityP2: string
  calloutH3: string; calloutText: string
  bridgeH2: string; bridgeIntro: string
  bridges: { h3: string; text: string; cta: string; to: string }[]
  faqH2: string; faqs: { q: string; a: string }[]
  finalH2: string; finalParagraph: string; finalPrimaryCta: string
}

type PageContent = ContentAll | ContentSub

// â"€â"€â"€ Sub-filter nav â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

// â"€â"€â"€ Area links per filter â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const areaLinks: Record<'all' | 'studio' | 'partition' | '1br', { h3: string; text: string; link: string }[]> = {
  all: [
    { h3: 'Studio and Partition Rentals in Doha', text: 'High-demand central micro-units and apartments offering unbeatable access to traditional business districts and major workplaces.', link: '/areas/doha/' },
    { h3: 'Studio and Partition Rentals in Al Sadd', text: 'Premium central options placed within walking distance of the Joaan and Al Sadd Metro stations, perfect for corporate employees.', link: '/areas/al-sadd/' },
    { h3: 'Studio and Partition Rentals in Bin Mahmoud', text: 'A vibrant, highly connected residential sector featuring an abundance of budget-conscious studios and partitioned flats.', link: '/areas/bin-mahmoud/' },
    { h3: 'Studio and Partition Rentals in Al Wakra', text: 'Affordable coastal choices offering peaceful living and straightforward access to the southern logistics hubs and industrial zones.', link: '/areas/al-wakra/' },
    { h3: 'Studio and Partition Rentals in Al Aziziya & Abu Hamour', text: 'Strategically placed villa-style studios and partitioned spaces offering quick road access to Salwa Road and local shopping centers.', link: '/areas/al-aziziya/' },
    { h3: 'Studio and Partition Rentals in Old Airport', text: 'Well-established residential streets boasting highly affordable housing options near the Matar Qadeem commercial high street.', link: '/areas/old-airport/' },
    { h3: 'Studio and Partition Rentals in Umm Salal', text: 'Budget-friendly northern suburban micro-units across Umm Salal Mohammed, tailored for individuals working along the Al Shamal highway corridor.', link: '/areas/umm-salal/' },
    { h3: 'Studio and Partition Rentals in Al Kharaitiyat', text: 'Quiet, highly cost-effective residential options offering spacious villa subdivisions with easy access to northern retail destinations.', link: '/areas/al-kharaitiyat/' },
  ],
  studio: [
    { h3: 'Studio for Rent in Doha', text: "Discover premium, independent studio options and micro-flats situated right in the heart of Doha's active commercial core.", link: '/areas/doha/' },
    { h3: 'Studio for Rent in Al Sadd', text: 'Live in a high-density corporate hub featuring modern studio buildings within walking distance of prime dining and retail spots.', link: '/areas/al-sadd/' },
    { h3: 'Studio for Rent in Bin Mahmoud', text: 'Highly sought-after residential studios combining traditional neighborhood charm with excellent access to the Doha Metro network.', link: '/areas/bin-mahmoud/' },
    { h3: 'Studio for Rent in Al Wakra', text: 'Relaxed coastal studio apartments and quiet villa outbuildings that provide an affordable escape from the busy city center.', link: '/areas/al-wakra/' },
    { h3: 'Studio for Rent in Al Aziziya & Abu Hamour', text: 'Conveniently located studio units offering fast road access to Salwa Road and neighboring commercial zones.', link: '/areas/al-aziziya/' },
    { h3: 'Studio for Rent in Old Airport', text: 'Excellent budget-friendly studios nestled within established residential streets near the active Matar Qadeem commercial corridor.', link: '/areas/old-airport/' },
    { h3: 'Studio for Rent in Umm Salal', text: 'Affordable suburban studio layouts across Umm Salal Mohammed, perfect for individuals working along the Al Shamal highway.', link: '/areas/umm-salal/' },
    { h3: 'Studio for Rent in Al Kharaitiyat', text: 'Spacious, budget-conscious villa-style studios located in a peaceful residential community with plenty of open parking access.', link: '/areas/al-kharaitiyat/' },
  ],
  partition: [
    { h3: 'Partition Room for Rent in Doha', text: "Unbeatable central room options placed right inside Doha's historic business zones, giving you direct pedestrian access to major commercial employers.", link: '/areas/doha/' },
    { h3: 'Partition Room for Rent in Al Sadd', text: "Live in Qatar's most connected commercial hub, featuring affordable partition options within walking distance of the Joaan Metro station.", link: '/areas/al-sadd/' },
    { h3: 'Partition Room for Rent in Bin Mahmoud', text: 'A high-demand residential area offering an abundant choice of executive flatshare settings and budget rooms near central metro paths.', link: '/areas/bin-mahmoud/' },
    { h3: 'Partition Room for Rent in Al Wakra', text: 'Cost-conscious room choices in a relaxed coastal community, perfectly suited for logistics professionals working near the southern industrial zones.', link: '/areas/al-wakra/' },
    { h3: 'Partition Room for Rent in Al Aziziya & Abu Hamour', text: 'Spacious villa-subdivided rooms offering single tenants quick road access to the commercial shops along Salwa Road.', link: '/areas/al-aziziya/' },
    { h3: 'Partition Room for Rent in Old Airport', text: 'Highly economical shared apartment setups positioned immediately adjacent to the bustling retail corridors of the Matar Qadeem high street.', link: '/areas/old-airport/' },
    { h3: 'Partition Room for Rent in Umm Salal', text: 'Extremely budget-friendly suburban partition spaces across Umm Salal Mohammed, tailored for individuals working along the Al Shamal highway corridor.', link: '/areas/umm-salal/' },
    { h3: 'Partition Room for Rent in Al Kharaitiyat', text: 'Quiet, highly cost-effective partitioned rooms within villa layouts, offering peaceful residential living and ample free open parking options.', link: '/areas/al-kharaitiyat/' },
  ],
  '1br': [
    { h3: 'One Bedroom for Rent in Doha', text: "Discover functional, centrally located compact 1BHK options and villa portions situated right inside Doha's active business districts.", link: '/areas/doha/' },
    { h3: 'One Bedroom for Rent in Al Sadd', text: 'Premium central units and single-bedroom flats located within easy walking distance of corporate office towers and main metro line connections.', link: '/areas/al-sadd/' },
    { h3: 'One Bedroom for Rent in Bin Mahmoud', text: 'A vibrant residential area offering an excellent choice of budget-aware 1-bedroom spaces near central commuter transit paths.', link: '/areas/bin-mahmoud/' },
    { h3: 'One Bedroom for Rent in Al Wakra', text: 'Highly economical single-bedroom options in a relaxed coastal community, perfectly suited for professionals working near southern industrial hubs.', link: '/areas/al-wakra/' },
    { h3: 'One Bedroom for Rent in Al Aziziya & Abu Hamour', text: 'Spacious villa-style 1-bedroom portions offering residents quiet suburban living and quick road access to the commercial shops along Salwa Road.', link: '/areas/al-aziziya/' },
    { h3: 'One Bedroom for Rent in Old Airport', text: 'Excellent budget-friendly 1BHK options nestled within established residential streets near the active Matar Qadeem commercial corridor.', link: '/areas/old-airport/' },
    { h3: 'One Bedroom for Rent in Umm Salal', text: 'Budget-conscious suburban 1-bedroom layouts across Umm Salal Mohammed, tailored for individuals commuting along the Al Shamal highway corridor.', link: '/areas/umm-salal/' },
    { h3: 'One Bedroom for Rent in Al Kharaitiyat', text: 'Quiet, highly cost-effective 1-bedroom villa portions offering comfortable residential living and ample free open parking options.', link: '/areas/al-kharaitiyat/' },
  ],
}

const areaLinksAr: Record<'all' | 'studio' | 'partition' | '1br', { h3: string; text: string; link: string }[]> = {
  all: [
    { h3: 'استوديوهات وغرف أقسام للإيجار في الدوحة', text: 'وحدات مدمجة وشقق عالية الطلب في المركز توفر وصولاً لا مثيل له إلى أحياء الأعمال التقليدية وأماكن العمل الرئيسية.', link: '/areas/doha/' },
    { h3: 'استوديوهات وغرف أقسام للإيجار في السد', text: 'خيارات مركزية راقية على مسافة مشي من محطتَي جوعان والسد بالمترو، مثالية للموظفين في الشركات.', link: '/areas/al-sadd/' },
    { h3: 'استوديوهات وغرف أقسام للإيجار في بن محمود', text: 'حي سكني حيوي ومترابط يتميز بوفرة الاستوديوهات والشقق المقسّمة الاقتصادية.', link: '/areas/bin-mahmoud/' },
    { h3: 'استوديوهات وغرف أقسام للإيجار في الوكرة', text: 'خيارات ساحلية ميسورة توفر معيشة هادئة وسهولة الوصول إلى المناطق اللوجستية الجنوبية والمناطق الصناعية.', link: '/areas/al-wakra/' },
    { h3: 'استوديوهات وغرف أقسام للإيجار في العزيزية وأبو هامور', text: 'استوديوهات بطراز فيلا وغرف أقسام مُحددة استراتيجياً توفر وصولاً سريعاً عبر طريق سلوى والمراكز التجارية المحلية.', link: '/areas/al-aziziya/' },
    { h3: 'استوديوهات وغرف أقسام للإيجار في المطار القديم', text: 'شوارع سكنية راسخة تتميز بخيارات إسكان اقتصادية للغاية قرب الشارع التجاري الرئيسي لمطار قديم.', link: '/areas/old-airport/' },
    { h3: 'استوديوهات وغرف أقسام للإيجار في أم صلال', text: 'وحدات مدمجة اقتصادية في الضواحي الشمالية عبر أم صلال محمد، مُصممة للأفراد العاملين على طول طريق الشمال.', link: '/areas/umm-salal/' },
    { h3: 'استوديوهات وغرف أقسام للإيجار في الخريطيات', text: 'خيارات سكنية هادئة ووفيرة توفر تقسيمات فيلا فسيحة وسهولة الوصول إلى وجهات التسوق الشمالية.', link: '/areas/al-kharaitiyat/' },
  ],
  studio: [
    { h3: 'استوديو للإيجار في الدوحة', text: 'اكتشف خيارات استوديو راقية مستقلة وميكروشقق تقع في قلب المنطقة التجارية النشطة في الدوحة.', link: '/areas/doha/' },
    { h3: 'استوديو للإيجار في السد', text: 'اسكن في مركز أعمال عالي الكثافة يتميز بمبانٍ استوديو حديثة على مسافة مشي من أفضل مطاعم ومراكز التسوق.', link: '/areas/al-sadd/' },
    { h3: 'استوديو للإيجار في بن محمود', text: 'استوديوهات سكنية مطلوبة بشدة تجمع بين سحر الحي التقليدي وشبكة مترو الدوحة الممتازة.', link: '/areas/bin-mahmoud/' },
    { h3: 'استوديو للإيجار في الوكرة', text: 'شقق استوديو ساحلية هادئة ووحدات ملاحق فيلا توفر ملاذاً اقتصادياً بعيداً عن ضجيج المدينة.', link: '/areas/al-wakra/' },
    { h3: 'استوديو للإيجار في العزيزية وأبو هامور', text: 'وحدات استوديو مريحة الموقع توفر وصولاً سريعاً لطريق سلوى والمناطق التجارية المجاورة.', link: '/areas/al-aziziya/' },
    { h3: 'استوديو للإيجار في المطار القديم', text: 'استوديوهات اقتصادية ممتازة ضمن شوارع سكنية راسخة قرب الممر التجاري النشط لمطار قديم.', link: '/areas/old-airport/' },
    { h3: 'استوديو للإيجار في أم صلال', text: 'تصاميم استوديو ضواحٍ ميسورة عبر أم صلال محمد، مثالية للأفراد العاملين على طول طريق الشمال.', link: '/areas/umm-salal/' },
    { h3: 'استوديو للإيجار في الخريطيات', text: 'استوديوهات بطراز فيلا فسيحة واقتصادية في مجتمع سكني هادئ مع توفر مواقف سيارات مفتوحة وفيرة.', link: '/areas/al-kharaitiyat/' },
  ],
  partition: [
    { h3: 'غرفة قسم للإيجار في الدوحة', text: 'خيارات غرف مركزية لا مثيل لها تقع داخل أحياء الأعمال التاريخية في الدوحة مع وصول مشاة مباشر إلى أكبر أصحاب العمل التجاريين.', link: '/areas/doha/' },
    { h3: 'غرفة قسم للإيجار في السد', text: 'اسكن في أكثر مراكز الأعمال ترابطاً في قطر، مع خيارات أقسام ميسورة على مسافة مشي من محطة جوعان بالمترو.', link: '/areas/al-sadd/' },
    { h3: 'غرفة قسم للإيجار في بن محمود', text: 'منطقة سكنية عالية الطلب توفر وفرة من خيارات غرف المسكن التنفيذي المشترك والغرف الاقتصادية قرب مسارات المترو المركزي.', link: '/areas/bin-mahmoud/' },
    { h3: 'غرفة قسم للإيجار في الوكرة', text: 'خيارات غرف اقتصادية في مجتمع ساحلي هادئ، مثالية لمتخصصي اللوجستيات العاملين قرب المناطق الصناعية الجنوبية.', link: '/areas/al-wakra/' },
    { h3: 'غرفة قسم للإيجار في العزيزية وأبو هامور', text: 'غرف فيلا مقسّمة فسيحة توفر للمستأجرين العزاب وصولاً سريعاً لمحلات طريق سلوى التجارية.', link: '/areas/al-aziziya/' },
    { h3: 'غرفة قسم للإيجار في المطار القديم', text: 'إعدادات شقق مشتركة اقتصادية للغاية مجاورة مباشرة لممرات التسوق الصاخبة في مطار قديم.', link: '/areas/old-airport/' },
    { h3: 'غرفة قسم للإيجار في أم صلال', text: 'مساحات أقسام ضواحٍ اقتصادية للغاية عبر أم صلال محمد، مُصممة للأفراد العاملين على طول طريق الشمال.', link: '/areas/umm-salal/' },
    { h3: 'غرفة قسم للإيجار في الخريطيات', text: 'غرف مقسّمة اقتصادية هادئة ضمن تصاميم فيلا، توفر معيشة سكنية هادئة وخيارات مواقف سيارات مفتوحة وفيرة.', link: '/areas/al-kharaitiyat/' },
  ],
  '1br': [
    { h3: 'غرفة نوم واحدة للإيجار في الدوحة', text: 'اكتشف خيارات 1BHK مدمجة وأجزاء فيلا وظيفية ذات موقع مركزي تقع داخل أحياء الأعمال النشطة في الدوحة.', link: '/areas/doha/' },
    { h3: 'غرفة نوم واحدة للإيجار في السد', text: 'وحدات مركزية راقية وشقق غرفة نوم واحدة على مسافة مشي من أبراج المكاتب التنفيذية وخطوط المترو الرئيسية.', link: '/areas/al-sadd/' },
    { h3: 'غرفة نوم واحدة للإيجار في بن محمود', text: 'منطقة سكنية حيوية توفر مجموعة ممتازة من مساحات الغرفة الواحدة الاقتصادية قرب مسارات النقل العام المركزي.', link: '/areas/bin-mahmoud/' },
    { h3: 'غرفة نوم واحدة للإيجار في الوكرة', text: 'خيارات غرفة نوم واحدة اقتصادية للغاية في مجتمع ساحلي هادئ، مثالية للمهنيين العاملين قرب المناطق الصناعية الجنوبية.', link: '/areas/al-wakra/' },
    { h3: 'غرفة نوم واحدة للإيجار في العزيزية وأبو هامور', text: 'أجزاء فيلا بطراز الغرفة الواحدة الفسيحة توفر للسكان معيشة ضواحٍ هادئة ووصولاً سريعاً لمحلات طريق سلوى.', link: '/areas/al-aziziya/' },
    { h3: 'غرفة نوم واحدة للإيجار في المطار القديم', text: 'خيارات 1BHK اقتصادية ممتازة ضمن شوارع سكنية راسخة قرب الممر التجاري النشط لمطار قديم.', link: '/areas/old-airport/' },
    { h3: 'غرفة نوم واحدة للإيجار في أم صلال', text: 'تصاميم غرفة واحدة اقتصادية في الضواحٍ عبر أم صلال محمد، مُصممة للأفراد المتنقلين على طول طريق الشمال.', link: '/areas/umm-salal/' },
    { h3: 'غرفة نوم واحدة للإيجار في الخريطيات', text: 'أجزاء فيلا ذات غرفة واحدة هادئة واقتصادية للغاية توفر معيشة سكنية مريحة وخيارات مواقف سيارات مفتوحة وفيرة.', link: '/areas/al-kharaitiyat/' },
  ],
}

// â"€â"€â"€ Page content â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const content: Record<'all' | 'studio' | 'partition' | '1br', PageContent> = {
  all: {
    kind: 'all',
    h1: 'Studio and Partition Rentals in Doha and Qatar',
    h3: 'Compact, budget-friendly rental options for single professionals, expats, and small households.',
    heroParagraph: "Sourcing an affordable studio or partition room for rent in Doha requires balancing price and privacy against essential factors like Doha Metro access, transit times, and Kahramaa utility structures. Dania Real Estate manages an active, deeply vetted selection of compact housing units and shared villa subdivisions across Qatar's major residential zones. Whether you need a fully private, self-contained studio apartment with its own kitchen, a budget-conscious partition room with shared amenities, or a cozy one-bedroom layout close to your workplace, our leasing advisors help you bypass inaccurate online portal listings to secure verified, ready-to-move-in rental vacancies.",
    primaryCta: 'Request Compact Rental Availability',
    trustPoints: [
      'Vetted individual units featuring transparent Kahramaa (water/electricity) billing.',
      'Highly strategic locations situated within easy walking distance of Doha Metro stations.',
      'Unedited walk-through videos and layout pictures delivered directly to your WhatsApp.',
    ],
    overviewH2: 'Practical Small-Space Rentals for Everyday Living',
    overviewP1: 'Not every residential search in Qatar requires a multi-bedroom family villa or a premium luxury apartment block. For thousands of single professionals, healthcare staff, hospitality executives, and newly arrived expats, compact real estate configurations offer a highly practical, low-maintenance, and cost-efficient alternative for urban living.',
    overviewP2: 'Dania Real Estate actively monitors and curates a diverse portfolio of small-space residential listings. We screen every rental option based on absolute privacy levels, neighborhood safety parameters, proximity to public transportation, split AC functional status, and overall monthly affordability to ensure a smooth transition into your new home.',
    overviewP3: 'This hub directory is dedicated specifically to standalone studio apartments, partitioned residential spaces, and cozy single-bedroom layouts. If your company or organization requires high-capacity independent properties for large commercial teams, please explore our master staff accommodation resource loop.',
    overviewInternalLink: { text: 'View Main Staff Accommodation Options', to: '/staff-accommodation/' },
    categoriesH2: 'Choose the Right Small-Space Rental Option',
    categoriesIntro: 'Different tenants demand different structural balances between monthly savings and personal privacy. Isolate your ideal residential layout below:',
    categories: [
      { h3: 'Studio for Rent', text: 'Fully independent, self-contained micro-apartments featuring private kitchenettes and en-suite bathrooms. Ideal for tenants prioritizing absolute solo privacy.', cta: 'Explore Studio Rentals', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'Partition Room for Rent', text: 'Highly affordable, cost-efficient personal living rooms created within safely subdivided residential apartments or villas. Perfect for budget-focused renters.', cta: 'Explore Partition Rooms', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: 'One Bedroom for Rent', text: 'Compact residential flats providing a structurally separate sleeping room alongside a small dedicated hall and kitchen space for extra comfort.', cta: 'Explore One Bedroom Rentals', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    benefitsH2: 'Why Compact Rentals Are Popular in Doha',
    benefitsIntro: 'Opting for a micro-residential space allows single expats and urban professionals to maximize their personal savings while maintaining access to premium city hubs.',
    benefits: [
      { h3: 'Optimized Monthly Savings', text: 'Significantly lower your fixed monthly rental expenses, leaving more financial freedom for personal savings and remittance goals.' },
      { h3: 'Low Maintenance Living', text: 'Save valuable time and effort with a compact floor plan that is remarkably easy to clean, furnish, maintain, and manage daily.' },
      { h3: 'Prime Transit Proximity', text: 'Most of our curated micro-units sit immediately adjacent to Doha Metro links, major bus stops, grocery points, and healthcare hubs.' },
      { h3: 'All-Inclusive Rental Terms', text: 'Take advantage of numerous affordable listings where your monthly rent payment already includes full Kahramaa and high-speed Wi-Fi access.' },
    ],
    audienceH2: 'Who Should Consider Studio and Partition Rentals?',
    audience: [
      'Single Expats seeking an affordable, straightforward entry into the Qatar residential rental market.',
      'Corporate Working Professionals wanting to reside immediately adjacent to primary commercial and retail zones.',
      'Budget-Aware Renters looking to minimize overhead costs through shared villa or apartment layouts.',
      'Healthcare and Hospitality Staff needing low-maintenance housing situated near major urban shift loops.',
      'Newly Arrived Residents requiring a simple, immediate, and accessible accommodation base without long-term legal exposure.',
    ],
    areasH2: 'Studio and Partition Rentals in Doha and Key Qatar Areas',
    areasParagraph: 'Monthly rental costs and commuting times are directly dependent on your selected neighborhood zone. Dania Real Estate sources compact housing options across these key transit-friendly sectors:',
    whyH2: 'Why Choose Dania Real Estate for Studio and Partition Rentals',
    whyIntro: 'Sourcing small rental spaces requires navigating complex villa subdivisions. We protect your peace of mind by pre-screening every room.',
    whyCards: [
      { h3: 'Targeted Micro-Housing Knowledge', text: 'We bypass irrelevant luxury family real estate listings to focus your search entirely on efficient, affordable studio and room options.' },
      { h3: 'Total Financial Transparency', text: 'Our agents explicitly clarify all utility structures—clearly outlining whether Kahramaa and Wi-Fi are fully inclusive or billed separately.' },
      { h3: 'Commute Path Mapping', text: 'We match your apartment search against local public transit lines, helping you secure spaces near Doha Metro stations to avoid long commutes.' },
      { h3: 'Direct Real-Time Media Updates', text: 'Save time and avoid misleading ads. Connect directly with our team on WhatsApp to receive unedited walkthrough videos of available units.' },
    ],
    processH2: 'How Our Compact Rental Process Works',
    steps: [
      { h3: 'Submit Your Living Requirements', text: 'Share your preferred residential area, layout choice (studio, partition, or 1BHK), maximum budget, and planned move-in timeline.' },
      { h3: 'Inventory Filtering & Screening', text: 'Our localized rental division sifts through available vacancies to isolate units matching your budget parameters and commute path.' },
      { h3: 'Direct Media and Detail Delivery', text: 'Review unedited interior videos, pricing outlines, and utility details sent straight to your personal WhatsApp or mobile device.' },
      { h3: 'View Property and Finalize Lease', text: 'Complete a physical on-site inspection of the unit alongside a Dania advisor before moving forward with key handover and lease execution.' },
    ],
    suitabilityH2: 'Choosing the Right Compact Rental Option',
    suitabilityP1: 'Selecting your next home in Doha is highly dependent on how you choose to balance personal space against your monthly savings targets. While an independent studio apartment offers an excellent environment for absolute personal privacy, a partitioned living room configuration provides unmatched cost savings that help you keep your monthly housing overhead to an absolute minimum.',
    suitabilityP2: 'Dania Real Estate removes the stress from this decision. We showcase verified options that align perfectly with your daily professional routines and personal lifestyle expectations.',
    calloutH3: 'Seeking an Affordable Studio or Room in Doha?',
    calloutText: "Don't waste hours browsing outdated classified ads. Send your target neighborhood, monthly budget limit, and move-in timeline directly to our active WhatsApp leasing desk right now for an immediate, personalized list of available vacancies.",
    bridgeH2: 'Explore Compact Rental Options',
    bridgeIntro: "Ready to dive deeper into a specific micro-residential layout? Click below to browse targeted inventories across Qatar's leading residential neighborhoods:",
    bridges: [
      { h3: 'Studio for Rent', text: 'View our comprehensive list of fully self-contained studio options featuring private kitchens and private bathrooms.', cta: 'Browse Vetted Studios', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'Partition Room for Rent', text: 'Access highly affordable, budget-conscious partitioned living spaces within shared apartment or villa layouts.', cta: 'Browse Partition Rooms', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: 'One Bedroom for Rent', text: 'Discover compact single-bedroom apartments offering a distinct separation between your sleeping area and living hall.', cta: 'Browse One Bedroom Layouts', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    faqH2: 'Studio and Partition Rentals FAQs',
    faqs: [
      { q: 'What is the core difference between a studio apartment and a partition room in Qatar?', a: 'A studio apartment is a completely self-contained residential unit featuring its own private entrance, private kitchen, and private bathroom. A partition room is an affordable personal living space created within a larger subdivided apartment or villa, typically sharing kitchen and bathroom amenities with other residents.' },
      { q: 'Does the monthly rent for a studio or partition room usually include Kahramaa bills?', a: "In Qatar's rental market, many partition rooms and villa-style studios are offered on an all-inclusive basis—meaning water, electricity (Kahramaa), and high-speed internet are fully included in the monthly rent. Our agents will explicitly verify the utility terms for each property before you sign." },
      { q: 'Can I request unedited interior walkthrough videos of the studio before scheduling a physical tour?', a: 'Yes, absolutely. To save you time, we prioritize digital property screening. You can connect directly with our leasing desk via WhatsApp to receive unedited interior videos, current photos, and exact pricing details for any available unit.' },
      { q: 'Are your compact rental listings located close to Doha Metro stations?', a: 'Yes. We understand that transit convenience is a primary factor for single professionals. Our portfolio highlights compact properties located within easy walking distance or direct feeder bus (Metro Link) routes of major Metro line stations.' },
      { q: 'Is a security deposit required to secure a partition room or studio rental?', a: "Yes. Standard real estate practices in Qatar require a security deposit to secure a rental property. This is usually equivalent to one month's rent, payable in cash or via a post-dated cheque, and is fully refundable upon the successful completion of your lease term." },
      { q: 'How quickly can I complete the inquiry process and move into a compact unit?', a: 'Because our compact rental listings are pre-verified and vacant, the move-in process can move very quickly. Once you select a suitable space and submit your Qatar ID (QID) copies alongside the required deposit, move-in can frequently be coordinated within 24 to 48 hours.' },
    ],
    finalH2: 'Find Your Perfect Budget-Friendly Compact Rental Today',
    finalParagraph: 'Protect your personal savings, enjoy easy access to public transit lines, and find a living space that fits your lifestyle perfectly. Skip unverified online real estate listings and stressful apartment hunting. Connect directly with the residential leasing professionals at Dania Real Estate right now to receive a curated portfolio of available studio and partition options tailored to your monthly budget.',
    finalPrimaryCta: 'Chat with Our Rental Desk Now',
  },

  studio: {
    kind: 'sub',
    h1: 'Studio for Rent in Doha and Qatar',
    h3: 'Private, fully self-contained studio rental options for single professionals and executive expats.',
    heroParagraph: "Securing a standalone studio for rent in Doha requires a property that guarantees absolute personal privacy, independent cooking facilities, and uncompromised structural separation from neighboring units. Dania Real Estate curates a premier, up-to-date index of self-contained studio apartments and independent villa outbuildings across Qatar's core residential hubs. Whether your lifestyle demands a modern, fully furnished open-plan studio in a dedicated high-rise block or a budget-friendly unfitted space near your workplace, our leasing specialists connect you directly with vetted, ready-to-occupy units featuring explicit utility terms and hassle-free leasing execution.",
    primaryCta: 'Request Studio Availability',
    trustPoints: [
      '100% private configurations with zero shared kitchens, bathrooms, or entryways.',
      'Strategic locations placed within immediate walking distance of major Doha Metro lines.',
      'Transparent lease options with clear validation of Kahramaa inclusion statuses.',
    ],
    overviewH2: 'Private Studio Rentals for Simple City Living',
    overviewP1: 'A studio apartment represents the ultimate configuration for modern, efficient, and self-contained urban living. By seamlessly blending your sleeping quarters, lounge space, and integrated kitchenette into a single open-plan footprint—complemented by a completely private en-suite bathroom—a premium studio gives you the structural freedom of independent living without the excessive cost and maintenance overhead of a larger flat.',
    overviewP2: 'For single executives, medical professionals, and hospitality managers across Doha, choosing a standalone studio provides an ideal balance of personal autonomy and financial efficiency. Dania Real Estate streamlines your search by filtering properties based on ceiling heights, natural lighting, parking accessibility, and direct proximity to essential supermarkets and corporate transit loops.',
    overviewP3: 'This targeted showcase highlights exclusively private, independent studio flats. If your current monthly budget requires a more cost-efficient shared living setup, please navigate to our partition room portal. Alternatively, if your lifestyle requires a separate, walled-off sleeping room, feel free to evaluate our spacious one-bedroom rental directory.',
    overviewNavLinks: [
      { text: 'Explore Partition Rooms for Rent', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { text: 'Explore One Bedroom for Rent', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    benefitsH2: 'Why Studios Are a Practical Rental Choice in Doha',
    benefitsIntro: 'Investing in an independent studio unit allows single residents to experience absolute domestic freedom while optimizing their personal monthly savings.',
    benefits: [
      { h3: 'Absolute Personal Privacy', text: 'Enjoy the peace of mind that comes with your own private entrance, private integrated kitchen, and private en-suite bathroom—with absolutely zero shared facilities.' },
      { h3: 'Predictable Monthly Budgets', text: 'Streamline your cash flow by choosing from numerous high-quality listings where water, electricity, and high-speed Wi-Fi are fully bundled into the rent.' },
      { h3: 'Zero Maintenance Stress', text: 'Maximize your free time with an intelligent, efficient layout that requires minimal cleaning, low furnishing costs, and simple daily upkeep.' },
      { h3: 'Elite Transit Connectivity', text: 'Avoid traffic delays by choosing properties strategically positioned near Doha Metro hubs, major expressways, and urban commercial centers.' },
    ],
    comparisonH2: 'Studio vs Partition Room: What Is the Difference?',
    comparisonIntro: 'While both residential options offer compact and budget-aware housing solutions within Qatar, they feature fundamental structural differences regarding personal privacy and facilities:',
    comparisonRows: [
      { feature: 'Architectural Style', left: 'Fully self-contained, independent micro-unit', right: 'Subdivided room inside a shared flat or villa' },
      { feature: 'Privacy Threshold', left: 'Maximum — Private entry and walled separation', right: 'Moderate — Shared structural main apartment entry' },
      { feature: 'Kitchen & Bath Setup', left: '100% Private integrated unit-based installations', right: 'Frequently shared with other residents in the property' },
      { feature: 'Best Suited For', left: 'Executives and singles prioritizing personal space', right: 'Highly budget-focused tenants maximizing savings' },
      { feature: 'Silo Inventory Link', left: 'Current Active Directory', right: '', links: [{ label: 'View Partition Rooms', to: '/studio-partition-rentals/partition-room-for-rent/' }] },
    ],
    audienceH2: 'Who Should Consider a Studio for Rent?',
    audience: [
      'Single Corporate Executives seeking private, self-contained living accommodations close to major business centers.',
      'Healthcare and Educational Professionals who require a quiet, independent, and low-maintenance home near work.',
      'Newly Arrived Expatriates looking for a secure, hassle-free residential home base to start their journey in Qatar.',
      'Budget-Aware Renters who want to keep expenses manageable without giving up the comfort of private amenities.',
      'Solo Residents looking for a standalone studio flat instead of a room in a shared apartment or villa layout.',
    ],
    areasH2: 'Studio Rentals in Doha and Key Qatar Areas',
    areasParagraph: 'Studio layout styles, monthly rental prices, and public transit access naturally vary across different neighborhoods. Dania Real Estate maintains an active inventory of verified private studios across these key residential sectors:',
    whyH2: 'Why Choose Dania Real Estate for Studio Rentals',
    whyIntro: 'We eliminate the frustration from renting a home by thoroughly pre-screening every studio unit for absolute structural independence and billing clarity.',
    whyCards: [
      { h3: 'Specialized Studio Market Focus', text: 'We bypass large family properties and shared spaces to show you only completely self-contained, independent studio listings.' },
      { h3: 'Clear Verification of Utility Terms', text: 'Our leasing agents clearly verify all utility details beforehand, confirming exactly whether Kahramaa and Wi-Fi are fully included in your monthly rent.' },
      { h3: 'Focus on Transit Convenience', text: 'We match your property search against local transit routes, prioritizing studio options near metro stations to save you time on your daily commute.' },
      { h3: 'Real-Time WhatsApp Video Updates', text: 'Avoid misleading online ads. Connect with our team on WhatsApp to receive unedited walkthrough videos and current photos of available studios.' },
    ],
    processH2: 'How Our Studio Rental Process Works',
    steps: [
      { h3: 'Submit Your Studio Requirements', text: 'Let us know your preferred residential area, monthly budget limit, furnishing preference (furnished/unfurnished), and your target move-in date.' },
      { h3: 'Targeted Selection Matching', text: 'Our dedicated rental team searches our active database to pull available private studio options that fit your criteria and commute path.' },
      { h3: 'Media and Property Detail Delivery', text: 'Review unedited walkthrough videos, detailed floor plans, and clear pricing terms sent directly to your mobile device via WhatsApp.' },
      { h3: 'Accompanied On-Site Viewing', text: 'Complete a thorough physical walkthrough of the studio unit, check parking setups, and inspect appliances alongside an experienced Dania advisor.' },
    ],
    suitabilityH2: 'Choosing the Right Studio Rental',
    suitabilityP1: 'Finding your perfect studio space means looking at how a property matches your daily work schedule, transport needs, and budget goals. While choosing a fully furnished studio option lets you enjoy a quick, stress-free move-in experience, selecting an unfurnished layout gives you the creative freedom to design your living space exactly how you want it over the long term.',
    suitabilityP2: 'Dania Real Estate simplifies your rental experience. We ensure your selected studio provides a peaceful, private, and highly affordable environment that supports your professional life and daily routine.',
    calloutH3: 'Ready to Move into a Vetted Private Studio?',
    calloutText: 'Avoid misleading online advertisements and uncoordinated viewings. Send your ideal residential neighborhood, monthly budget limit, and furnishing preferences directly to our active WhatsApp leasing desk right now for a personalized list of available vacancies.',
    bridgeH2: 'Explore More Compact Rental Options',
    bridgeIntro: "If a standalone studio apartment doesn't perfectly fit your current budget or spatial plans, feel free to browse alternative housing setups within our network:",
    bridges: [
      { h3: 'Studio and Partition Rentals Hub', text: 'Head back to our main compact housing category page for an overview of all small-space living options across Qatar.', cta: 'Return to Main Directory', to: '/studio-partition-rentals/' },
      { h3: 'Partition Room for Rent', text: 'Browse highly affordable personal rooms within safely managed shared apartment and villa layouts to maximize your monthly savings.', cta: 'Browse Partition Rooms', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: 'One Bedroom for Rent', text: 'Explore cozy single-bedroom apartments that offer a distinct architectural wall between your sleeping space and living hall area.', cta: 'Browse One Bedroom Layouts', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    faqH2: 'Studio Rental FAQs',
    faqs: [
      { q: 'Does a studio for rent through Dania Real Estate feature completely private facilities?', a: 'Yes, 100%. Every property listed within our dedicated studio directory is completely self-contained. This guarantees you enjoy your own private entrance, private kitchen facilities, and a private bathroom, with absolutely no shared amenities.' },
      { q: 'What is the typical difference in price and layout between a studio and a partition room?', a: 'A studio apartment is a completely independent residential unit with its own private kitchen and bathroom, commanding a slightly higher price point for absolute privacy. A partition room is an affordable personal living room created within a larger subdivided property, where kitchen and bathroom spaces are shared.' },
      { q: 'Are water and electricity bills (Kahramaa) bundled directly into the studio rental cost?', a: 'Many of our villa-style studios and compact residential units are offered on an all-inclusive basis, where Kahramaa utility bills and high-speed Wi-Fi are fully covered in the monthly rent. Our leasing agents will clearly verify these utility terms for each property before you finalize any agreement.' },
      { q: 'Can I choose between fully furnished and unfurnished studio options in Doha?', a: 'Yes. Our active inventory features a balanced mix of fully furnished studios equipped with major appliances and furniture for easy move-ins, as well as unfurnished options that allow you to bring and arrange your own furniture.' },
      { q: 'What core documents do single expatriates need to provide to secure a studio lease in Qatar?', a: "To secure a standard studio rental contract, you will need to provide a clear copy of your valid Qatar ID (QID), a copy of your passport, post-dated cheques matching the duration of the lease term, and a refundable security deposit (usually equivalent to one month's rent)." },
      { q: 'How can I request current walkthrough videos of available studios before scheduling an on-site visit?', a: 'Simply connect with the Dania Real Estate leasing desk directly via WhatsApp. Share your preferred neighborhood and monthly budget, and our team will instantly send you unedited walkthrough videos, recent interior photos, and current availability details.' },
    ],
    finalH2: 'Secure Your Private Self-Contained Studio in Doha Today',
    finalParagraph: 'Enjoy the peace of mind of completely independent living, manage your monthly housing budget effectively, and find a home that fits your daily professional routine perfectly. Skip the stress of dealing with unverified classified ads and repetitive property viewings. Connect directly with the residential leasing professionals at Dania Real Estate right now via WhatsApp to receive a curated list of verified private studios tailored to your lifestyle and budget goals.',
    finalPrimaryCta: 'Chat with Our Studio Leasing Desk Now',
  },

  partition: {
    kind: 'sub',
    h1: 'Partition Room for Rent in Doha and Qatar',
    h3: 'Affordable, cost-effective partition room and shared accommodation support for single professionals.',
    heroParagraph: "Locating a clean, legally structured partition room for rent in Doha is the most practical way to minimize your monthly living overhead while securing a strategic address near the Doha Metro network. Dania Real Estate maintains an active, thoroughly screened directory of partitioned residential spaces and managed shared villa subdivisions across Qatar's major commercial corridors. Whether you are searching for an executive bachelor room with shared kitchen facilities in Al Sadd or a budget-aware room with bundled utilities near your workplace, our team filters through the market noise to connect you with verified, ready-to-move vacancies with transparent utility terms.",
    primaryCta: 'Request Partition Room Availability',
    trustPoints: [],
    overviewH2: 'Affordable Partition Room Rentals for Practical Living',
    overviewP1: 'A partition room represents a highly popular, budget-conscious residential configuration for individual expatriates looking to maximize their financial savings in Qatar. By renting a dedicated, structurally separated private room within a larger shared apartment or family villa footprint, you secure your own personal space while sharing core infrastructure like kitchens and bathrooms with a limited number of flatmates.',
    overviewP2: 'For thousands of retail executives, hospitality professionals, transit workers, and newly arrived expats in Doha, choosing a managed partition setup is the ultimate way to stay competitive. It eliminates the heavy financial burden of independent tenancy contracts, security cheques, and individual utility registrations, allowing you to live comfortably close to your primary workplace or transport lines.',
    overviewP3: 'This directory focuses exclusively on budget-friendly partitioned rooms and shared housing options. If your lifestyle demands absolute solo privacy with private, non-shared cooking and bathroom facilities, please visit our dedicated studio apartment catalog. If you require a larger, independent unit with a completely separate walled bedroom and private hall, explore our cozy one-bedroom rental listings.',
    overviewNavLinks: [
      { text: 'Browse Standalone Studios for Rent', to: '/studio-partition-rentals/studio-for-rent/' },
      { text: 'Browse One Bedroom Rentals', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    benefitsH2: 'Why Partition Rooms Are Popular in Doha',
    benefitsIntro: 'Opting for a partitioned room allows budget-conscious tenants to live in premium, centrally located urban districts without paying premium rental prices.',
    benefits: [
      { h3: 'Lowest Monthly Rental Rates', text: 'Secure the absolute lowest baseline housing costs available in the Qatar real estate market, maximizing your personal remittance and savings potential.' },
      { h3: 'Bundled Utility Expenses', text: 'Avoid unexpected monthly bills. Most of our curated partition listings include your water, electricity (Kahramaa), and high-speed Wi-Fi connectivity inside the fixed rent.' },
      { h3: 'Premium City Access', text: 'Reside in highly sought-after central neighborhoods right next to your workplace, high-street supermarkets, dining spots, and healthcare clinics.' },
      { h3: 'Total Lease Flexibility', text: 'Enjoy simple, direct move-in parameters that require fewer complicated legal procedures and long-term commitments compared to standalone properties.' },
    ],
    comparisonH2: 'Partition Room vs Studio: What Is the Difference?',
    comparisonIntro: 'While both options offer highly practical, compact living accommodations within Doha, understanding their structural and financial differences helps clarify your search:',
    comparisonRows: [
      { feature: 'Architectural Style', left: 'Dedicated private room within a shared flat or villa', right: 'Fully independent, standalone micro-apartment' },
      { feature: 'Privacy Threshold', left: 'Moderate — Shared main apartment access door', right: 'Maximum — Private unit entrance and private walls' },
      { feature: 'Kitchen & Bath Setup', left: 'Typically shared with a limited number of flatmates', right: '100% Private, unit-integrated installations' },
      { feature: 'Utility Commitments', left: 'Usually fully included in the monthly rent payment', right: 'Varies; sometimes billed separately via Kahramaa' },
      { feature: 'Financial Profile', left: 'Maximum Savings — Lowest entry-level cost', right: 'Moderate Cost — Higher pricing for complete autonomy' },
      { feature: 'Silo Inventory Link', left: 'Current Active Directory', right: '', links: [{ label: 'View Studio Rentals', to: '/studio-partition-rentals/studio-for-rent/' }] },
    ],
    audienceH2: 'Who Should Consider a Partition Room?',
    audience: [
      'Single Expatriates looking to minimize fixed monthly domestic living costs inside Doha.',
      'Working Professionals wanting to reside directly along major Doha Metro transit corridors for easy daily commuting.',
      'Budget-Focused Renters who prioritize maximum financial savings over expensive standalone apartment rentals.',
      'Newly Arrived Residents requiring an immediate, accessible, and highly affordable residential base without extensive legal exposure.',
      'Individual Tenants evaluating cost-effective shared room options rather than higher-priced private studio units.',
    ],
    areasH2: 'Partition Rooms in Doha and Key Qatar Areas',
    areasParagraph: 'Monthly rental averages and public transit access points vary by neighborhood. Dania Real Estate actively maps out available partition configurations across these high-demand sectors:',
    whyH2: 'Why Choose Dania Real Estate for Partition Room Rentals',
    whyIntro: 'Finding a clean shared space requires careful screening. We focus on property quality, layout safety, and tenant comfort to protect your peace of mind.',
    whyCards: [
      { h3: 'Budget Market Expertise', text: 'We bypass expensive luxury properties to target your search entirely on practical, cost-efficient, and well-managed room configurations.' },
      { h3: 'Absolute Utility Verification', text: 'We explicitly confirm all lease terms beforehand, ensuring your water, electricity, Kahramaa bills, and Wi-Fi networks are fully covered in the rent.' },
      { h3: 'Transit-Focused Property Matching', text: 'We prioritize properties situated right on metro and feeder bus routes, helping you avoid long commutes and expensive taxi rides.' },
      { h3: 'Direct WhatsApp Walkthroughs', text: 'Avoid wasted journeys and inaccurate ads. Connect with our team via WhatsApp to get unedited walkthrough videos of available partition vacancies.' },
    ],
    processH2: 'How Our Partition Room Rental Process Works',
    steps: [
      { h3: 'Share Your Room Requirements', text: 'Send us your target residential neighborhood, maximum monthly budget limit, move-in timeline, and transport requirements.' },
      { h3: 'Active Database Filtering', text: 'Our localized residential leasing team sifts through our vacant inventories to match your request against clean, well-managed shared setups.' },
      { h3: 'Media Delivery and Detail Review', text: 'Receive unedited interior walkthrough videos, exact pricing structures, and detailed notes on shared facilities sent directly to your WhatsApp.' },
      { h3: 'Scheduled Inspection and Move-In', text: 'Complete a physical tour of the property alongside a Dania representative to verify clean facilities before finalizing your deposit and key handover.' },
    ],
    suitabilityH2: 'Choosing the Right Partition Room',
    suitabilityP1: 'Selecting the ideal partition room means striking the right balance between maximum monthly savings and basic daily comfort. While securing a highly competitive rate helps you optimize your financial budget, ensuring the property features clean shared bathrooms, a well-ventilated kitchen space, and a respectful living environment with flatmates is equally vital for your daily well-being.',
    suitabilityP2: 'Dania Real Estate eliminates the stress of searching through messy classified portals. We showcase only curated shared options that provide a clean, orderly, and transit-friendly home base supporting your professional journey in Qatar.',
    calloutH3: 'Looking for a Verified, Affordable Budget Room?',
    calloutText: "Don't waste time on uncoordinated viewings or outdated online posts. Send your target neighborhood, monthly budget limit, and move-in timeline directly to our active WhatsApp leasing desk right now for a personalized list of clean, available partition vacancies.",
    bridgeH2: 'Explore More Compact Rental Options',
    bridgeIntro: "If a shared partition configuration doesn't perfectly match your privacy expectations or spatial needs, consider alternative options within our network:",
    bridges: [
      { h3: 'Studio and Partition Rentals Hub', text: 'Head back to our main compact housing category page for a complete overview of small-space living across Qatar.', cta: 'Return to Main Directory', to: '/studio-partition-rentals/' },
      { h3: 'Studio for Rent', text: 'Upgrade to an entirely independent, private micro-apartment featuring your own non-shared kitchen and private en-suite bathroom.', cta: 'Browse Vetted Studios', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'One Bedroom for Rent', text: 'Explore compact standalone flats that provide a structural architectural wall between your sleeping zone and separate living hall space.', cta: 'Browse One Bedroom Layouts', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    faqH2: 'Partition Room Rental FAQs',
    faqs: [
      { q: 'What exactly is a partition room rental in Doha?', a: 'A partition room is a private living space created within a larger subdivided apartment or villa layout. It provides a dedicated room for your personal use, while secondary facilities like the kitchen and bathroom are shared with a limited number of flatmates to significantly lower monthly costs.' },
      { q: 'Are water, electricity, and internet bills typically included in the partition rent?', a: 'Yes, in the vast majority of cases. To keep things simple for single professionals, most partition room properties are offered on an all-inclusive basis. This means Kahramaa utility costs (water/electricity) and high-speed Wi-Fi are fully covered inside your fixed monthly payment.' },
      { q: 'How does a partition room differ from an independent studio apartment?', a: 'A partition room sits within a shared apartment environment and involves sharing kitchen or bathroom facilities with flatmates to secure maximum financial savings. A studio apartment is a completely independent, self-contained unit with its own private entrance, private kitchen, and private bathroom.' },
      { q: 'Can I request real walkthrough videos of a room before visiting the location?', a: 'Yes, absolutely. We prioritize digital screening to save you time. Simply connect with the Dania Real Estate team on WhatsApp, share your target area and monthly budget, and we will send you unedited interior walkthrough videos and current photos of available vacancies.' },
      { q: 'Are your partition room listings located close to Doha Metro lines?', a: 'Yes. We understand that transit convenience is essential for budget-conscious tenants. Our portfolio specifically focuses on shared accommodation options placed within easy walking distance or direct feeder bus (Metro Link) routes of major stations.' },
      { q: 'What is required to secure a partition room and move into the property?', a: "Moving in is typically very fast and straightforward. You will need to provide a clear copy of your valid Qatar ID (QID), a refundable security deposit (usually equivalent to one month's rent), and your initial month's rent payment. Move-ins can often be arranged within 24 to 48 hours." },
    ],
    finalH2: 'Find a Clean, Affordable Partition Room in Qatar Today',
    finalParagraph: 'Maximize your monthly personal savings, enjoy straightforward access to central public transport routes, and find an affordable home base that supports your budget goals perfectly. Skip the stress of dealing with unverified online ads and uncoordinated viewings. Connect directly with the residential leasing team at Dania Real Estate right now via WhatsApp to receive a curated portfolio of clean, ready-to-move partition room options tailored directly to your budget.',
    finalPrimaryCta: 'Chat with Our Budget Rental Desk Now',
  },

  '1br': {
    kind: 'sub',
    h1: 'One Bedroom for Rent in Doha and Qatar',
    h3: 'Private, compact one-bedroom rental options for singles, couples, and urban professionals.',
    heroParagraph: "Upgrading to a standalone one-bedroom for rent in Doha gives you the ideal combination of personal privacy and structural separation without the high monthly costs of larger residential flats. Dania Real Estate manages an active, fully screened inventory of compact 1BHK configurations, converted villa portions, and independent outbuildings across Qatar's major transit lines. Whether your routine requires a clean, unfurnished single-bedroom layout with a separate living hall or a fully managed, utility-inclusive property close to the Doha Metro network, our leasing experts help you find verified vacancies tailored directly to your monthly budget limits.",
    primaryCta: 'Request One Bedroom Availability',
    trustPoints: [
      '100% private walled separation between sleeping quarters and living halls.',
      'Strategic locations placed within immediate walking distance of metro and bus paths.',
    ],
    overviewH2: 'Private and Practical One Bedroom Rentals',
    overviewP1: 'A compact one-bedroom rental—frequently referred to as a practical 1BHK—represents the perfect step up for individual residents or corporate couples who outgrow open-plan micro-housing. Unlike a traditional studio setup where your cooking, lounge, and sleeping spaces share a single open footprint, a single-bedroom flat provides a clear architectural wall that separates your private bedroom from the main living area.',
    overviewP2: 'For thousands of mid-level managers, healthcare staff, and corporate couples across Doha, opting for a compact one-bedroom property offers a highly functional, low-maintenance home base. Dania Real Estate simplifies your search by pre-screening listings for practical storage layouts, functional split AC systems, accessible vehicle parking, and direct proximity to local supermarkets.',
    overviewP3: 'This dedicated catalog focuses entirely on budget-aware, compact single-bedroom options and villa portions. If you are looking for larger family apartments or premium residential blocks, please browse our main apartments page. Alternatively, if your current financial targets favor smaller, more affordable micro-housing solutions, explore our standalone studios or managed partition rooms.',
    overviewNavLinks: [
      { text: 'Explore Main Apartments for Rent', to: '/apartments-for-rent/' },
      { text: 'Explore Standalone Studios for Rent', to: '/studio-partition-rentals/studio-for-rent/' },
      { text: 'Explore Partition Rooms for Rent', to: '/studio-partition-rentals/partition-room-for-rent/' },
    ],
    benefitsH2: 'Why One Bedroom Rentals Are Popular in Doha',
    benefitsIntro: 'Stepping up to a compact 1-bedroom property gives solo professionals and couples a more organized domestic environment while keeping monthly housing costs highly affordable.',
    benefits: [
      { h3: 'Structural Walled Privacy', text: 'Enjoy a clear architectural layout with a separate walled bedroom, allowing you to host guests in your living hall while keeping your sleeping area completely private.' },
      { h3: 'Ideal for Singles & Couples', text: 'Secure a highly comfortable, functional home base that easily accommodates two residents without the crowded feel of an open-plan micro-unit.' },
      { h3: 'Balanced Housing Budgets', text: 'Save significantly on monthly rent by choosing compact 1BHK options or managed villa portions instead of expensive, large family flats.' },
      { h3: 'Low-Maintenance Footprint', text: 'Save time on upkeep with an efficient, smart layout that is remarkably simple to clean, organize, and furnish on a reasonable budget.' },
    ],
    comparisonH2: 'One Bedroom vs Studio vs Partition Room',
    comparisonIntro: 'Evaluating the structural layout, privacy levels, and budget profiles of each compact housing option helps you find the right fit for your lifestyle:',
    comparisonRows: [
      { feature: 'Architectural Layout', left: 'Separate walled bedroom and distinct living hall', right: 'Integrated open-plan living and kitchen footprint / Dedicated private room inside a shared flat layout' },
      { feature: 'Privacy Threshold', left: 'Maximum — Full structural separation', right: 'High — Private unit with combined spaces / Moderate — Private room with shared amenities' },
      { feature: 'Kitchen & Bath Setup', left: '100% Private unit-integrated installations', right: '100% Private unit-integrated installations / Frequently shared with a limited number of flatmates' },
      { feature: 'Best Suited For', left: 'Singles, executive couples, professionals', right: 'Solo expats prioritizing independent space / Highly budget-focused tenants maximizing savings' },
      { feature: 'Silo Inventory Link', left: 'Current Active Directory', right: '', links: [{ label: 'View Studio Rentals', to: '/studio-partition-rentals/studio-for-rent/' }, { label: 'View Partition Rooms', to: '/studio-partition-rentals/partition-room-for-rent/' }] },
    ],
    audienceH2: 'Who Should Consider a One Bedroom Rental?',
    audience: [
      'Working Couples needing a comfortable, private, and highly manageable home base in Qatar.',
      'Corporate Professionals who require a distinct separation between their sleeping space and living lounge.',
      'Expatriates Upgrading from shared apartment rooms or open studios to a more organized layout.',
      'Budget-Aware Renters looking for affordable compact 1BHK options instead of expensive family flats.',
      'Solo Residents looking for a low-maintenance property that is easy to manage alongside a busy career.',
    ],
    areasH2: 'One Bedroom Rentals in Doha and Key Qatar Areas',
    areasParagraph: 'Monthly rental averages, layout styles, and public transit access points vary by neighborhood. Dania Real Estate actively monitors available compact 1-bedroom units across these high-demand residential sectors:',
    whyH2: 'Why Choose Dania Real Estate for One Bedroom Rentals',
    whyIntro: 'We eliminate the stress of finding a home by pre-screening every compact 1-bedroom property for clear layout separation and transparent billing terms.',
    whyCards: [
      { h3: 'Targeted Compact Housing Focus', text: 'We filter past massive family properties and shared room setups to show you only efficient, budget-friendly 1-bedroom configurations.' },
      { h3: 'Explicit Verification of Utility Terms', text: 'Our leasing agents confirm all billing details upfront, clearly stating whether Kahramaa utilities and Wi-Fi networks are fully included in your monthly rent.' },
      { h3: 'Transit-Oriented Property Matching', text: 'We prioritize compact 1BHK properties placed right on metro and feeder bus routes, helping you avoid long commutes and heavy traffic.' },
      { h3: 'Direct WhatsApp Walkthrough Videos', text: 'Avoid misleading ads and wasted journeys. Connect directly with our team via WhatsApp to receive unedited walkthrough videos of available units.' },
    ],
    processH2: 'How Our One Bedroom Rental Process Works',
    steps: [
      { h3: 'Submit Your Layout Requirements', text: 'Share your preferred residential neighborhood, maximum monthly budget limit, furnishing preference (furnished/unfurnished), and move-in timeline.' },
      { h3: 'Selection Screening & Matching', text: 'Our localized rental division reviews our active database to pull available compact 1-bedroom options that match your budget parameters.' },
      { h3: 'Direct Media and Detail Delivery', text: 'Review unedited interior walkthrough videos, exact pricing structures, and utility details sent straight to your personal WhatsApp or mobile device.' },
      { h3: 'Accompanied Viewings and Lease Finalization', text: 'Complete a physical tour of the unit alongside an experienced Dania advisor to verify property conditions before moving forward with move-in steps.' },
    ],
    suitabilityH2: 'Choosing the Right One Bedroom Rental',
    suitabilityP1: 'Selecting the ideal compact single-bedroom property means finding a space that matches your daily career schedule, personal comfort goals, and monthly financial targets. While choosing a fully furnished 1BHK option lets you enjoy a quick, stress-free move-in experience, selecting an unfurnished villa portion gives you the creative freedom to design your living space exactly how you want it over the long term.',
    suitabilityP2: 'Dania Real Estate removes the stress from this decision. We showcase verified compact housing options that align perfectly with your daily professional routines and personal lifestyle expectations.',
    calloutH3: 'Ready to Move into a Verified Compact 1-Bedroom Unit?',
    calloutText: "Don't waste time on uncoordinated viewings or outdated online posts. Send your target neighborhood, monthly budget limit, and move-in timeline directly to our active WhatsApp leasing desk right now for a personalized list of clean, available vacancies.",
    bridgeH2: 'Explore More Compact Rental Options',
    bridgeIntro: "If a compact single-bedroom layout doesn't perfectly fit your current budget or spatial plans, feel free to browse alternative housing setups within our network:",
    bridges: [
      { h3: 'Studio and Partition Rentals Hub', text: 'Head back to our main compact housing category page for a complete overview of small-space living options across Qatar.', cta: 'Return to Main Directory', to: '/studio-partition-rentals/' },
      { h3: 'Studio for Rent', text: 'View our comprehensive list of fully self-contained studio options featuring private integrated kitchens and private en-suite bathrooms.', cta: 'Browse Vetted Studios', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'Partition Room for Rent', text: 'Access highly affordable personal rooms within safely managed shared apartment and villa layouts to maximize your monthly savings.', cta: 'Browse Partition Rooms', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: '1 Bedroom Apartments Silo', text: 'Browse larger, standalone 1-bedroom flat listings situated within formal residential tower blocks and residential developments.', cta: 'View Broad Apartment Category', to: '/apartments-for-rent/1-bedroom/' },
    ],
    faqH2: 'One Bedroom Rental FAQs',
    faqs: [
      { q: 'What is the core architectural difference between a studio apartment and a compact one-bedroom rental?', a: 'A studio apartment features an open-plan layout where your sleeping area, living space, and kitchen share a single open footprint. A compact one-bedroom rental provides a structural architectural wall that separates the bedroom from the living hall, giving you extra privacy.' },
      { q: 'How does this page differ from your main 1-bedroom apartment directory?', a: 'This page sits under our compact and budget-aware housing silo, focusing specifically on highly economical 1-bedroom configurations, compact layouts, and villa portions. Our main 1-bedroom apartment page covers broader, standard residential flats inside large tower blocks or major developments.' },
      { q: 'Are water and electricity bills (Kahramaa) included in the monthly rent for a 1-bedroom unit?', a: "In Qatar's rental market, many compact 1-bedroom options and villa-style portions are offered on an all-inclusive basis—meaning water, electricity (Kahramaa), and high-speed Wi-Fi are covered in the rent. Our agents will explicitly verify the utility terms for each property before you sign." },
      { q: 'Can I choose between fully furnished and unfurnished compact 1-bedroom properties?', a: 'Yes. Our active inventory features a balanced mix of fully furnished 1BHK options equipped with major kitchen appliances and furniture for easy move-ins, as well as unfurnished layouts that allow you to bring and arrange your own furniture.' },
      { q: 'What core documents do tenants need to provide to secure a compact 1-bedroom lease in Qatar?', a: "To secure a standard lease agreement, you will need to provide a clear copy of your valid Qatar ID (QID), a copy of your passport, post-dated cheques matching the duration of the lease term, and a refundable security deposit (usually equivalent to one month's rent)." },
      { q: 'How can I request current walkthrough videos of available 1-bedroom units before scheduling an on-site visit?', a: 'Simply connect with the Dania Real Estate leasing desk directly via WhatsApp. Share your preferred neighborhood and monthly budget, and our team will instantly send you unedited walkthrough videos, recent interior photos, and current availability details.' },
    ],
    finalH2: 'Find Your Perfect Budget-Friendly One Bedroom Rental Today',
    finalParagraph: 'Enjoy the comfort of a separate walled bedroom layout, manage your monthly housing budget effectively, and find a home that fits your daily professional routine perfectly. Skip the stress of dealing with unverified classified ads and repetitive property viewings. Connect directly with the residential leasing professionals at Dania Real Estate right now via WhatsApp to receive a curated portfolio of available compact 1-bedroom and villa portion options tailored to your lifestyle and budget goals.',
    finalPrimaryCta: 'Chat with Our Leasing Desk Now',
  },
}

const contentAr: Record<'all' | 'studio' | 'partition' | '1br', PageContent> = {
  all: {
    kind: 'all',
    h1: 'استوديوهات وغرف أقسام للإيجار في الدوحة وقطر',
    h3: 'خيارات إيجار اقتصادية ومدمجة للمهنيين العزاب والمغتربين والأسر الصغيرة.',
    heroParagraph: 'تُعدّ دانية للعقارات محطتك الأولى لاستئجار الاستوديوهات وغرف الأقسام ووحدات الغرفة الواحدة في قطر. نحن متخصصون في توفير خيارات سكنية اقتصادية للمهنيين والعزاب والوافدين، مع ضمان الشفافية الكاملة في شروط الفواتير وإمكانية الوصول إلى المترو وقرب أماكن العمل. تواصل مع فريقنا مباشرة عبر واتساب للحصول على قائمة بالوحدات المتاحة حسب ميزانيتك ومنطقتك.',
    primaryCta: 'اطلب قائمة الوحدات المتاحة',
    trustPoints: [
      'وحدات موثقة مع فواتير كهرماء (ماء وكهرباء) شفافة.',
      'مواقع استراتيجية قريبة من محطات مترو الدوحة.',
      'فيديوهات جولة حقيقية وصور تُرسل مباشرة عبر واتساب.',
    ],
    overviewH2: 'خيارات السكن المدمج في قطر',
    overviewP1: 'ليس كل بحث سكني في قطر يتطلب شقة عائلية فاخرة أو فيلا متعددة الغرف. بالنسبة لآلاف المهنيين العزاب وموظفي القطاع الصحي والضيافة والمغتربين الجدد، توفر الوحدات السكنية المدمجة بديلاً عملياً واقتصادياً وسهل الصيانة للحياة الحضرية.',
    overviewP2: 'تحرص دانية للعقارات على توفير قوائم موثقة لجميع أنواع الوحدات — من الاستوديوهات المستقلة إلى غرف الأقسام الاقتصادية. نفحص كل خيار بناءً على مستوى الخصوصية والأمان وقرب وسائل المواصلات والقدرة الشرائية.',
    overviewP3: 'هذا الدليل مخصص للاستوديوهات المستقلة وغرف الأقسام ووحدات الغرفة الواحدة. إذا كانت شركتك تحتاج إلى وحدات سكنية للموظفين بأعداد كبيرة، يرجى الاطلاع على صفحة سكن الموظفين لدينا.',
    overviewInternalLink: { text: 'استعرض خيارات سكن الموظفين', to: '/staff-accommodation/' },
    categoriesH2: 'اختر الخيار السكني المناسب لك',
    categoriesIntro: 'يختلف المستأجرون في توازنهم بين التوفير الشهري والخصوصية الشخصية. اختر التصميم السكني الأنسب لك:',
    categories: [
      { h3: 'استوديو للإيجار', text: 'وحدات مدمجة مستقلة بالكامل تضم مطبخاً خاصاً وحمامًا خاصاً. مثالية للمستأجرين الذين يُولون الأولوية للخصوصية التامة.', cta: 'استعرض الاستوديوهات', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'غرفة قسم للإيجار', text: 'غرف معيشة شخصية اقتصادية ضمن شقق أو فلل مُقسَّمة بشكل آمن. مثالية للمستأجرين ذوي الميزانية المحدودة.', cta: 'استعرض غرف الأقسام', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: 'غرفة نوم واحدة للإيجار', text: 'شقق سكنية مدمجة توفر غرفة نوم منفصلة وصالة صغيرة ومطبخ لراحة إضافية.', cta: 'استعرض إيجارات الغرفة الواحدة', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    benefitsH2: 'لماذا تشتهر الوحدات السكنية المدمجة في الدوحة؟',
    benefitsIntro: 'يتيح اختيار وحدة سكنية مدمجة للمغتربين العزاب والمهنيين الحضريين تعظيم مدخراتهم مع الحفاظ على إمكانية الوصول إلى مراكز المدينة الحيوية.',
    benefits: [
      { h3: 'توفير شهري مُحسَّن', text: 'خفّض نفقاتك الشهرية الثابتة بشكل ملحوظ، وامنح نفسك مزيداً من الحرية المالية للادخار والتحويلات.' },
      { h3: 'معيشة قليلة الصيانة', text: 'وفّر الوقت والجهد مع تصميم مدمج سهل التنظيف والتأثيث والإدارة اليومية.' },
      { h3: 'قرب المواصلات العامة', text: 'معظم وحداتنا المنتقاة تقع على مقربة من محطات مترو الدوحة ومحطات الحافلات ومراكز البقالة والمستشفيات.' },
      { h3: 'شروط إيجار شاملة', text: 'استفد من قوائم إيجارية ميسورة تشمل فواتير كهرماء والإنترنت عالي السرعة ضمن الإيجار الشهري.' },
    ],
    audienceH2: 'من يجب أن يفكر في استوديو أو غرفة قسم؟',
    audience: [
      'المغتربون العزاب الباحثون عن دخول ميسور وسريع إلى سوق الإيجار السكني في قطر.',
      'المهنيون العاملون في الشركات الراغبون في السكن قرب المناطق التجارية والتسوق الرئيسية.',
      'المستأجرون ذوو الميزانية المحدودة الساعون إلى تقليص التكاليف عبر نظام الشقق المشتركة.',
      'موظفو القطاع الصحي والضيافة المحتاجون لسكن قليل الصيانة قرب مراكز العمل الحضرية.',
      'الوافدون الجدد الذين يحتاجون إلى قاعدة سكنية فورية وميسورة دون التزامات طويلة الأمد.',
    ],
    areasH2: 'استوديوهات وغرف أقسام في الدوحة والمناطق الرئيسية بقطر',
    areasParagraph: 'تتفاوت تكاليف الإيجار الشهرية وأوقات التنقل بحسب الحي السكني المختار. تُوفّر دانية للعقارات خيارات سكنية مدمجة في هذه المناطق الحيوية المرتبطة بالمواصلات:',
    whyH2: 'لماذا تختار دانية للعقارات لإيجار الاستوديوهات وغرف الأقسام؟',
    whyIntro: 'يستلزم البحث عن مساكن صغيرة التنقل في تقسيمات فلل معقدة. نحن نوفر لك راحة البال بفحص كل غرفة مسبقاً.',
    whyCards: [
      { h3: 'خبرة متخصصة في السكن المدمج', text: 'نتجاوز قوائم العقارات الفاخرة لنُركّز بحثك كلياً على خيارات الاستوديو والغرفة الاقتصادية والعملية.' },
      { h3: 'شفافية مالية كاملة', text: 'يُوضّح وكلاؤنا جميع هياكل المرافق — مُحدِّدين بوضوح ما إذا كانت كهرماء والإنترنت مشمولتين أو تُفوتران منفصلتين.' },
      { h3: 'تحديد مسارات التنقل', text: 'نُطابق بحثك مع خطوط المواصلات العامة المحلية، لمساعدتك في الحصول على وحدات قريبة من محطات مترو الدوحة.' },
      { h3: 'تحديثات مباشرة عبر واتساب', text: 'وفّر وقتك وتجنب الإعلانات المضللة. تواصل مع فريقنا عبر واتساب لاستلام فيديوهات جولة حقيقية للوحدات المتاحة.' },
    ],
    processH2: 'كيف تسير عملية إيجار الوحدات المدمجة لدينا؟',
    steps: [
      { h3: 'أرسل متطلباتك السكنية', text: 'شاركنا المنطقة المفضلة لديك ونوع الوحدة (استوديو أو قسم أو غرفة نوم واحدة) والميزانية القصوى وموعد الانتقال.' },
      { h3: 'تصفية قوائم الوحدات وفرزها', text: 'يُفرز قسم الإيجار المحلي لدينا الوحدات الشاغرة المتاحة لعزل الخيارات المناسبة لميزانيتك ومسار تنقلك.' },
      { h3: 'إرسال الوسائط والتفاصيل مباشرة', text: 'راجع فيديوهات داخلية حقيقية وملخصات الأسعار وتفاصيل المرافق تُرسل مباشرة إلى هاتفك عبر واتساب.' },
      { h3: 'معاينة العقار وإتمام عقد الإيجار', text: 'أجرِ معاينة ميدانية للوحدة برفقة أحد مستشاري دانية قبل الانتقال إلى تسليم المفاتيح وتوقيع عقد الإيجار.' },
    ],
    suitabilityH2: 'اختيار الخيار السكني المدمج الأنسب لك',
    suitabilityP1: 'يعتمد اختيار منزلك التالي في الدوحة اعتماداً كبيراً على كيفية موازنتك بين المساحة الشخصية وأهداف التوفير الشهرية. في حين يوفر الاستوديو المستقل بيئة ممتازة للخصوصية التامة، يُقدّم تصميم غرفة القسم توفيراً لا مثيل له يُبقي نفقات سكنك الشهرية في أدنى مستوياتها.',
    suitabilityP2: 'تُزيل دانية للعقارات الضغط عن هذا القرار. نعرض عليك خيارات موثقة تتوافق تماماً مع روتينك المهني اليومي وتوقعات أسلوب حياتك.',
    calloutH3: 'تبحث عن استوديو أو غرفة ميسورة في الدوحة؟',
    calloutText: 'لا تُضيع ساعات في تصفح إعلانات قديمة. أرسل حيّك المستهدف وحد الميزانية الشهرية وموعد الانتقال مباشرة إلى مكتب تأجيرنا على واتساب الآن للحصول على قائمة فورية ومخصصة بالوحدات الشاغرة.',
    bridgeH2: 'استكشف خيارات الإيجار المدمجة',
    bridgeIntro: 'هل أنت مستعد للتعمق في نوع سكن مدمج بعينه؟ انقر أدناه لتصفح قوائم مستهدفة في الأحياء السكنية الرائدة في قطر:',
    bridges: [
      { h3: 'استوديو للإيجار', text: 'اطّلع على قائمتنا الشاملة من الاستوديوهات المستقلة بالكامل التي تتضمن مطابخ خاصة وحمامات خاصة.', cta: 'استعرض الاستوديوهات', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'غرفة قسم للإيجار', text: 'احصل على غرف معيشة مدمجة اقتصادية ضمن شقق أو فلل مُدارة بشكل مشترك.', cta: 'استعرض غرف الأقسام', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: 'غرفة نوم واحدة للإيجار', text: 'اكتشف شققاً مدمجة أحادية الغرفة تُتيح فصلاً واضحاً بين منطقة النوم والصالة.', cta: 'استعرض إيجارات الغرفة الواحدة', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    faqH2: 'أسئلة شائعة — الاستوديوهات وغرف الأقسام',
    faqs: [
      { q: 'ما الفرق الجوهري بين الاستوديو وغرفة القسم في قطر؟', a: 'الاستوديو هو وحدة سكنية مستقلة بالكامل لها مدخل خاص ومطبخ خاص وحمام خاص. أما غرفة القسم فهي مساحة معيشية شخصية ضمن شقة أو فيلا مُقسَّمة أكبر، وعادةً ما تُشارك فيها مرافق المطبخ والحمام مع عدد محدود من السكان.' },
      { q: 'هل يشمل الإيجار الشهري للاستوديو أو غرفة القسم فواتير كهرماء عادةً؟', a: 'في سوق الإيجار القطري، كثير من غرف الأقسام والاستوديوهات ذات طراز الفيلا تُقدَّم على أساس شامل — أي أن المياه والكهرباء (كهرماء) والإنترنت عالي السرعة مشمولة في الإيجار الشهري. سيتحقق وكلاؤنا صراحةً من شروط المرافق لكل عقار قبل توقيعك.' },
      { q: 'هل يمكنني طلب فيديوهات جولة داخلية حقيقية للاستوديو قبل جدولة زيارة ميدانية؟', a: 'نعم، بالتأكيد. لتوفير وقتك، نُعطي الأولوية للفحص الرقمي للعقار. يمكنك التواصل مباشرة مع مكتب تأجيرنا عبر واتساب لاستلام فيديوهات داخلية حقيقية وصور حديثة وتفاصيل الأسعار الحالية لأي وحدة متاحة.' },
      { q: 'هل قوائم الإيجار المدمجة لديكم قريبة من محطات مترو الدوحة؟', a: 'نعم. ندرك أن ملاءمة وسائل النقل عامل أساسي للمهنيين العزاب. تُبرز محفظتنا العقارية الوحدات المدمجة الواقعة على مسافة قريبة من محطات خط المترو الرئيسية أو مسارات حافلات الربط.' },
      { q: 'هل يُشترط دفع وديعة لتأمين غرفة قسم أو استوديو؟', a: 'نعم. تستوجب الممارسات العقارية المعيارية في قطر دفع وديعة تأمين لتأمين العقار الإيجاري. وهي عادةً ما تعادل إيجار شهر واحد، وتُدفع نقداً أو بشيك مؤجل، وتُردّ بالكامل عند إتمام مدة الإيجار بنجاح.' },
      { q: 'كم من الوقت يستغرق إتمام الاستفسار والانتقال إلى الوحدة؟', a: 'نظراً لكون قوائم إيجارنا المدمجة مُتحقّقاً منها وشاغرة، يمكن أن تسير عملية الانتقال بسرعة كبيرة. بمجرد اختيارك للوحدة المناسبة وتقديم نسخ من بطاقة الإقامة القطرية (QID) مع الوديعة المطلوبة، يمكن في الغالب تنسيق الانتقال في غضون 24 إلى 48 ساعة.' },
    ],
    finalH2: 'ابحث عن وحدتك السكنية المدمجة الاقتصادية اليوم',
    finalParagraph: 'احمِ مدخراتك الشخصية واستمتع بسهولة الوصول إلى خطوط المواصلات العامة، وابحث عن مساحة معيشية تتناسب مع أسلوب حياتك تماماً. تجنّب القوائم العقارية غير الموثّقة وصعوبات البحث عن شقق. تواصل مباشرة مع متخصصي التأجير السكني في دانية للعقارات الآن لتلقّي محفظة عقارية منتقاة من الاستوديوهات وغرف الأقسام المتاحة والمُكيَّفة مع ميزانيتك الشهرية.',
    finalPrimaryCta: 'تحدث مع مكتب التأجير لدينا الآن',
  },

  studio: {
    kind: 'sub',
    h1: 'استوديو للإيجار في الدوحة وقطر',
    h3: 'خيارات استوديو خاصة مستقلة بالكامل للمهنيين العزاب والمغتربين التنفيذيين.',
    heroParagraph: 'وحدات استوديو خاصة ومستقلة بالكامل للمهنيين والأفراد الباحثين عن مساحة معيشية مدمجة مستقلة. تُوفّر دانية للعقارات قائمة محدّثة باستمرار من شقق الاستوديو المستقلة ووحدات الملاحق الخاصة في أحياء قطر السكنية الرئيسية، مع ضمان الخصوصية التامة وشروط الفواتير الواضحة وسهولة تنفيذ عقد الإيجار.',
    primaryCta: 'اطلب توفر الاستوديوهات',
    trustPoints: [
      'تصميمات خاصة بالكامل دون مطابخ أو حمامات أو مداخل مشتركة.',
      'مواقع استراتيجية على مقربة من خطوط مترو الدوحة الرئيسية.',
      'خيارات إيجار شفافة مع التحقق الواضح من حالة شمول كهرماء.',
    ],
    overviewH2: 'استوديوهات خاصة للإيجار بأسلوب حياة حضري بسيط',
    overviewP1: 'يمثّل الاستوديو التصميم الأمثل للمعيشة الحضرية الحديثة والفعّالة والمستقلة. بدمج غرفة النوم والصالة والمطبخ الصغير في مساحة مفتوحة واحدة — مع حمام خاص بالكامل — يمنحك الاستوديو المميز حرية الاستقلالية دون التكلفة الزائدة وعناء الصيانة لشقة أكبر.',
    overviewP2: 'بالنسبة للمديرين التنفيذيين العزاب والكوادر الطبية ومديري قطاع الضيافة في الدوحة، يُتيح اختيار استوديو مستقل توازناً مثالياً بين الاستقلالية الشخصية والكفاءة المالية. تُبسّط دانية للعقارات بحثك بتصفية العقارات بناءً على ارتفاعات السقف والإضاءة الطبيعية وإمكانية الوصول إلى مواقف السيارات والقرب من المتاجر وخطوط المواصلات.',
    overviewP3: 'يُبرز هذا الدليل المتخصص شقق الاستوديو الخاصة المستقلة حصراً. إذا كانت ميزانيتك الشهرية تستوجب نظاماً سكنياً مشتركاً أكثر اقتصادية، يُرجى التوجه إلى بوابة غرف الأقسام لدينا. وإذا كان أسلوب حياتك يتطلب غرفة نوم منفصلة بجدار خاص، يمكنك تقييم دليل إيجارات الغرفة الواحدة.',
    overviewNavLinks: [
      { text: 'استكشف غرف الأقسام للإيجار', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { text: 'استكشف غرف النوم الواحدة للإيجار', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    benefitsH2: 'لماذا يُعدّ الاستوديو خياراً إيجارياً عملياً في الدوحة؟',
    benefitsIntro: 'يُتيح الاستثمار في وحدة استوديو مستقلة للسكان العزاب تجربة الحرية السكنية الكاملة مع تحسين مدخراتهم الشخصية الشهرية.',
    benefits: [
      { h3: 'خصوصية شخصية تامة', text: 'استمتع براحة البال الكاملة مع مدخل خاص ومطبخ مدمج خاص وحمام خاص — دون أي مرافق مشتركة إطلاقاً.' },
      { h3: 'ميزانيات شهرية منتظمة', text: 'بسّط تدفقك النقدي باختيار قوائم عالية الجودة تشمل المياه والكهرباء والإنترنت عالي السرعة ضمن الإيجار.' },
      { h3: 'صفر ضغوط صيانة', text: 'عظّم وقت فراغك بتصميم ذكي وفعّال يتطلب تنظيفاً أدنى وتأثيثاً بتكلفة منخفضة وصيانة يومية بسيطة.' },
      { h3: 'اتصال ممتاز بالمواصلات', text: 'تجنّب الازدحام المروري باختيار عقارات مُحددة استراتيجياً بالقرب من محطات مترو الدوحة والطرق السريعة الرئيسية والمراكز التجارية الحضرية.' },
    ],
    comparisonH2: 'الاستوديو مقابل غرفة القسم: ما الفرق؟',
    comparisonIntro: 'على الرغم من أن كلا الخيارين يُقدّمان حلولاً سكنية مدمجة واقتصادية في قطر، إلا أنهما يتميزان باختلافات هيكلية جوهرية في الخصوصية والمرافق:',
    comparisonRows: [
      { feature: 'الطراز المعماري', left: 'وحدة مدمجة مستقلة بالكامل', right: 'غرفة مُقسَّمة ضمن شقة أو فيلا مشتركة' },
      { feature: 'مستوى الخصوصية', left: 'أقصى درجات الخصوصية — مدخل خاص وجدران منفصلة', right: 'متوسط — مدخل رئيسي مشترك للشقة' },
      { feature: 'المطبخ والحمام', left: 'وحدات خاصة بالكامل مدمجة في الوحدة', right: 'مشتركة في الغالب مع سكان آخرين في العقار' },
      { feature: 'الأنسب لـ', left: 'المديرون التنفيذيون والعزاب الذين يُولون الأولوية للمساحة الشخصية', right: 'المستأجرون ذوو الميزانية المحدودة الساعون لأقصى توفير' },
    ],
    audienceH2: 'من يجب أن يفكر في استئجار استوديو؟',
    audience: [
      'المديرون التنفيذيون العزاب الباحثون عن سكن مستقل قريب من مراكز الأعمال الكبرى.',
      'الكوادر الصحية والتعليمية التي تحتاج منزلاً هادئاً ومستقلاً وقليل الصيانة قرب العمل.',
      'المغتربون الجدد الباحثون عن قاعدة سكنية آمنة وسهلة لبدء رحلتهم في قطر.',
      'المستأجرون ذوو الميزانية المحدودة الراغبون في إبقاء نفقاتهم معقولة دون التضحية بالمرافق الخاصة.',
      'السكان العزاب الباحثون عن شقة استوديو مستقلة بدلاً من غرفة في شقة أو فيلا مشتركة.',
    ],
    areasH2: 'استوديوهات للإيجار في الدوحة والمناطق الرئيسية بقطر',
    areasParagraph: 'تتباين أنماط الاستوديو وأسعار الإيجار الشهرية وإمكانية الوصول إلى المواصلات العامة بين الأحياء المختلفة. تحتفظ دانية للعقارات بمخزون نشط من الاستوديوهات الخاصة الموثّقة في هذه القطاعات السكنية الرئيسية:',
    whyH2: 'لماذا تختار دانية للعقارات لإيجار الاستوديوهات؟',
    whyIntro: 'نُزيل الإحباط من تأجير منزل بالفحص الشامل المسبق لكل وحدة استوديو من حيث الاستقلالية الهيكلية ووضوح الفواتير.',
    whyCards: [
      { h3: 'تركيز متخصص على سوق الاستوديو', text: 'نتجاوز العقارات الكبيرة والمشتركة لنُريك فقط قوائم الاستوديوهات المستقلة بالكامل.' },
      { h3: 'التحقق الواضح من شروط المرافق', text: 'يتحقق وكلاؤنا من جميع تفاصيل المرافق مسبقاً، مؤكدين بدقة ما إذا كانت كهرماء والإنترنت مشمولتين في الإيجار الشهري.' },
      { h3: 'التركيز على ملاءمة وسائل النقل', text: 'نُطابق بحثك مع مسارات المواصلات المحلية، مُعطين الأولوية لخيارات الاستوديو القريبة من محطات المترو لتوفير وقتك.' },
      { h3: 'فيديوهات واتساب المباشرة في الوقت الفعلي', text: 'تجنّب الإعلانات المضللة. تواصل مع فريقنا عبر واتساب لاستلام فيديوهات جولة حقيقية وصور حديثة للاستوديوهات المتاحة.' },
    ],
    processH2: 'كيف تسير عملية إيجار الاستوديو لدينا؟',
    steps: [
      { h3: 'أرسل متطلبات استوديوك', text: 'أخبرنا بالمنطقة السكنية المفضلة وحد الميزانية الشهرية وتفضيل التأثيث (مفروش/غير مفروش) وتاريخ الانتقال المستهدف.' },
      { h3: 'المطابقة والاختيار المستهدف', text: 'يبحث فريق التأجير المتخصص لدينا في قاعدة بياناتنا النشطة لاستخراج خيارات استوديو خاصة متاحة تناسب معاييرك ومسار تنقلك.' },
      { h3: 'تسليم الوسائط والتفاصيل', text: 'راجع فيديوهات جولة حقيقية ومخططات طابقية مفصّلة وشروط أسعار واضحة تُرسل مباشرة إلى جهازك المحمول عبر واتساب.' },
      { h3: 'معاينة ميدانية مرفقة', text: 'أجرِ جولة ميدانية شاملة للوحدة وتحقق من أماكن الوقوف والأجهزة المنزلية برفقة أحد مستشاري دانية ذوي الخبرة.' },
    ],
    suitabilityH2: 'اختيار الاستوديو المناسب للإيجار',
    suitabilityP1: 'إيجاد استوديوك المثالي يعني النظر في مدى ملاءمة العقار لجدول عملك اليومي واحتياجات تنقلك وأهدافك الميزانية. في حين يُتيح لك اختيار استوديو مؤثّث بالكامل تجربة انتقال سريعة وخالية من الضغط، يمنحك الاختيار غير المؤثّث الحرية الإبداعية لتصميم مساحتك كما تريد على المدى البعيد.',
    suitabilityP2: 'تُبسّط دانية للعقارات تجربة إيجارك. نضمن أن استوديوك المختار يوفر بيئة هادئة وخاصة واقتصادية للغاية تدعم حياتك المهنية ونمط يومك.',
    calloutH3: 'هل أنت مستعد للانتقال إلى استوديو خاص موثّق؟',
    calloutText: 'تجنّب الإعلانات المضللة والمعاينات غير المنسقة. أرسل حيّك السكني المثالي وحد الميزانية الشهرية وتفضيلاتك مباشرة إلى مكتب تأجيرنا على واتساب الآن للحصول على قائمة مخصصة بالوحدات الشاغرة.',
    bridgeH2: 'استكشف المزيد من خيارات الإيجار المدمجة',
    bridgeIntro: 'إذا لم يتناسب الاستوديو المستقل تماماً مع ميزانيتك الحالية أو خططك، يمكنك استعراض بدائل الإسكان الأخرى في شبكتنا:',
    bridges: [
      { h3: 'مركز الاستوديوهات وغرف الأقسام', text: 'عُد إلى صفحتنا الرئيسية للإسكان المدمج للاطلاع على نظرة عامة على جميع خيارات المعيشة المدمجة في قطر.', cta: 'العودة إلى الدليل الرئيسي', to: '/studio-partition-rentals/' },
      { h3: 'غرفة قسم للإيجار', text: 'تصفّح غرفاً شخصية اقتصادية ضمن شقق وفلل مُدارة بشكل مشترك وآمن لتعظيم مدخراتك الشهرية.', cta: 'استعرض غرف الأقسام', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: 'غرفة نوم واحدة للإيجار', text: 'استكشف شققاً مدمجة أحادية الغرفة توفر جداراً معمارياً مميزاً بين منطقة نومك وصالة المعيشة.', cta: 'استعرض إيجارات الغرفة الواحدة', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    faqH2: 'أسئلة شائعة — إيجار الاستوديو',
    faqs: [
      { q: 'هل الاستوديو المؤجَّر عبر دانية للعقارات يتضمن مرافق خاصة بالكامل؟', a: 'نعم، بنسبة 100%. كل عقار مُدرج في دليل الاستوديو المتخصص لدينا مستقل بالكامل. هذا يضمن لك التمتع بمدخل خاص ومرافق مطبخ خاصة وحمام خاص، دون أي مرافق مشتركة إطلاقاً.' },
      { q: 'ما الفرق الجوهري في السعر والتصميم بين الاستوديو وغرفة القسم؟', a: 'الاستوديو هو وحدة سكنية مستقلة بالكامل بمطبخ وحمام خاصين، بسعر أعلى قليلاً مقابل الخصوصية التامة. أما غرفة القسم فهي غرفة معيشة شخصية اقتصادية ضمن عقار مُقسَّم أكبر، حيث يُشارك المطبخ والحمام مع سكان آخرين.' },
      { q: 'هل فواتير الماء والكهرباء (كهرماء) مدمجة مباشرة في تكلفة إيجار الاستوديو؟', a: 'كثير من استوديوهاتنا ذات طراز الفيلا والوحدات السكنية المدمجة تُقدَّم على أساس شامل، حيث تُغطّي فواتير مرافق كهرماء والإنترنت عالي السرعة ضمن الإيجار الشهري. سيتحقق وكلاؤنا من هذه الشروط بوضوح لكل عقار قبل إتمام أي اتفاقية.' },
      { q: 'هل يمكنني الاختيار بين خيارات الاستوديو المؤثّثة وغير المؤثّثة في الدوحة؟', a: 'نعم. يتضمن مخزوننا النشط مزيجاً متوازناً من الاستوديوهات المؤثّثة بالكامل المزودة بالأجهزة الكبيرة والأثاث لسهولة الانتقال، إضافة إلى خيارات غير مؤثّثة تتيح لك إحضار أثاثك وترتيبه.' },
      { q: 'ما المستندات الجوهرية التي يحتاجها المغتربون العزاب لتأمين عقد إيجار الاستوديو في قطر؟', a: 'لتأمين عقد إيجار استوديو قياسي، ستحتاج إلى نسخة واضحة من بطاقة الإقامة القطرية السارية (QID) ونسخة من جواز السفر وشيكات مؤجّلة بمدة عقد الإيجار ووديعة تأمين مستردة (تعادل عادةً إيجار شهر واحد).' },
      { q: 'كيف يمكنني طلب فيديوهات جولة حديثة للاستوديوهات المتاحة قبل جدولة زيارة ميدانية؟', a: 'ببساطة تواصل مع مكتب تأجير دانية للعقارات مباشرة عبر واتساب. شارك حيّك المفضّل وميزانيتك الشهرية، وسيُرسل فريقنا فوراً فيديوهات جولة حقيقية وصور داخلية حديثة وتفاصيل التوفر الحالية.' },
    ],
    finalH2: 'أمّن استوديوك الخاص المستقل في الدوحة اليوم',
    finalParagraph: 'استمتع براحة البال من المعيشة المستقلة الكاملة، وأدِر ميزانيتك السكنية الشهرية بفاعلية، وابحث عن منزل يناسب روتينك المهني اليومي تماماً. تجنّب ضغوط التعامل مع إعلانات غير موثّقة وعروض عقارية متكررة. تواصل مباشرة مع متخصصي التأجير السكني في دانية للعقارات الآن عبر واتساب لتلقّي قائمة منتقاة من الاستوديوهات الخاصة الموثّقة المُكيَّفة مع أسلوب حياتك وأهدافك الميزانية.',
    finalPrimaryCta: 'تحدث مع مكتب تأجير الاستوديوهات الآن',
  },

  partition: {
    kind: 'sub',
    h1: 'غرفة قسم للإيجار في الدوحة وقطر',
    h3: 'غرف أقسام اقتصادية فعّالة وسكن مشترك للمهنيين العزاب.',
    heroParagraph: 'غرف أقسام اقتصادية للمهنيين والمديرين التنفيذيين في قطر. تحتفظ دانية للعقارات بدليل نشط ومفحوص بدقة من الغرف السكنية المقسّمة والتقسيمات المُدارة للفلل عبر الممرات التجارية الرئيسية في قطر. فريقنا يُصفّي ضجيج السوق للربط بك بشواغر موثّقة وجاهزة للانتقال بشروط مرافق شفافة.',
    primaryCta: 'اطلب توفر غرف الأقسام',
    trustPoints: [],
    overviewH2: 'غرف الأقسام الاقتصادية للإيجار — معيشة عملية',
    overviewP1: 'تمثّل غرفة القسم تصميماً سكنياً شعبياً واقتصادياً للمغتربين الأفراد الساعين لتعظيم مدخراتهم المالية في قطر. باستئجار غرفة خاصة مُقسَّمة هيكلياً ضمن شقة أو فيلا مشتركة أكبر، تُؤمّن مساحتك الشخصية مع مشاركة البنية التحتية الأساسية كالمطابخ والحمامات مع عدد محدود من الشركاء.',
    overviewP2: 'بالنسبة لآلاف المديرين التجاريين وعمال الضيافة وموظفي قطاع النقل والمغتربين الجدد في الدوحة، يُعدّ اختيار نظام قسم مُدار الطريقةَ المثلى للبقاء تنافسياً مالياً. يُزيل هذا الخيار العبء المالي الثقيل لعقود الإيجار المستقلة والشيكات الأمنية وتسجيلات المرافق الفردية.',
    overviewP3: 'يُركّز هذا الدليل حصراً على الغرف المُقسَّمة الاقتصادية وخيارات الإسكان المشترك. إذا كان أسلوب حياتك يتطلب خصوصية فردية تامة مع مرافق طبخ وحمام خاصة غير مشتركة، يُرجى زيارة كتالوج شقق الاستوديو لدينا.',
    overviewNavLinks: [
      { text: 'تصفّح الاستوديوهات المستقلة للإيجار', to: '/studio-partition-rentals/studio-for-rent/' },
      { text: 'تصفّح إيجارات الغرفة الواحدة', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    benefitsH2: 'لماذا تحظى غرف الأقسام بشعبية في الدوحة؟',
    benefitsIntro: 'يُتيح اختيار غرفة مُقسَّمة للمستأجرين ذوي الميزانية المحدودة العيشَ في أحياء حضرية مركزية مرموقة دون دفع أسعار إيجار باهظة.',
    benefits: [
      { h3: 'أدنى معدلات الإيجار الشهري', text: 'أمّن أدنى تكاليف إسكان أساسية متاحة في سوق العقارات القطري، مُعظّماً إمكاناتك في الادخار الشخصي وتحويل الأموال.' },
      { h3: 'نفقات مرافق مجمّعة', text: 'تجنّب الفواتير الشهرية المفاجئة. معظم قوائم الأقسام لدينا تشمل المياه والكهرباء (كهرماء) والإنترنت عالي السرعة ضمن الإيجار الثابت.' },
      { h3: 'وصول ممتاز إلى المدينة', text: 'اسكن في أحياء مركزية مرموقة قريبة جداً من مكان عملك ومتاجر البقالة الكبرى ومطاعم الطعام والعيادات الصحية.' },
      { h3: 'مرونة تامة في عقد الإيجار', text: 'استمتع بمعايير انتقال مباشرة وبسيطة تتطلب إجراءات قانونية أقل تعقيداً والتزامات طويلة الأمد أقل مقارنة بالعقارات المستقلة.' },
    ],
    comparisonH2: 'غرفة القسم مقابل الاستوديو: ما الفرق؟',
    comparisonIntro: 'على الرغم من أن كلا الخيارين يُقدّمان إقامة سكنية عملية ومدمجة في الدوحة، يُساعدك فهم اختلافاتهما الهيكلية والمالية في توضيح بحثك:',
    comparisonRows: [
      { feature: 'الطراز المعماري', left: 'غرفة خاصة مخصصة ضمن شقة أو فيلا مشتركة', right: 'وحدة مدمجة مستقلة بالكامل' },
      { feature: 'مستوى الخصوصية', left: 'متوسط — باب مدخل رئيسي مشترك', right: 'أقصى درجات الخصوصية — مدخل وجدران خاصة' },
      { feature: 'المطبخ والحمام', left: 'مشترك في الغالب مع عدد محدود من الشركاء', right: 'وحدات خاصة بنسبة 100% مدمجة في الوحدة' },
      { feature: 'التزامات المرافق', left: 'مشمولة في الغالب ضمن الإيجار الشهري', right: 'تتفاوت؛ أحياناً تُفوتر منفصلةً عبر كهرماء' },
      { feature: 'الملف المالي', left: 'أقصى توفير — أدنى تكلفة مبدئية', right: 'تكلفة معتدلة — سعر أعلى مقابل الاستقلالية الكاملة' },
    ],
    audienceH2: 'من يجب أن يفكر في غرفة قسم؟',
    audience: [
      'المغتربون العزاب الساعون لتقليص تكاليف المعيشة الشهرية الثابتة داخل الدوحة.',
      'المهنيون العاملون الراغبون في السكن على طول ممرات مترو الدوحة الرئيسية لسهولة التنقل اليومي.',
      'المستأجرون ذوو الميزانية المحدودة الذين يُعطون الأولوية لأقصى توفير مالي بدلاً من الشقق المستقلة الباهظة.',
      'الوافدون الجدد الذين يحتاجون قاعدة سكنية فورية وميسورة وسهلة الوصول دون تعرّض قانوني مكثّف.',
      'المستأجرون الأفراد الذين يُقيّمون خيارات الغرف الاقتصادية المشتركة بدلاً من وحدات الاستوديو الخاصة الأغلى.',
    ],
    areasH2: 'غرف الأقسام في الدوحة والمناطق الرئيسية بقطر',
    areasParagraph: 'تتباين متوسطات الإيجار الشهري ونقاط الوصول إلى المواصلات العامة بين الأحياء. ترصد دانية للعقارات تكوينات الأقسام المتاحة عبر هذه القطاعات عالية الطلب:',
    whyH2: 'لماذا تختار دانية للعقارات لإيجار غرف الأقسام؟',
    whyIntro: 'يتطلب إيجاد مساحة مشتركة نظيفة فحصاً دقيقاً. نُركّز على جودة العقار وسلامة التصميم وراحة المستأجر لضمان راحة بالك.',
    whyCards: [
      { h3: 'خبرة في سوق الإيجار الاقتصادي', text: 'نتجاوز العقارات الفاخرة الباهظة لنُوجّه بحثك كلياً نحو تكوينات الغرف العملية والاقتصادية والمُدارة جيداً.' },
      { h3: 'التحقق المطلق من شروط المرافق', text: 'نُؤكّد جميع شروط الإيجار مسبقاً، لضمان شمول فواتير الماء والكهرباء (كهرماء) وشبكات الإنترنت في الإيجار.' },
      { h3: 'مطابقة العقارات بتركيز على المواصلات', text: 'نُعطي الأولوية للعقارات الواقعة على مسارات المترو وحافلات الربط مباشرةً، لمساعدتك في تجنب رحلات التنقل الطويلة.' },
      { h3: 'جولات واتساب المباشرة', text: 'تجنّب الرحلات الضائعة والإعلانات غير الدقيقة. تواصل مع فريقنا عبر واتساب للحصول على فيديوهات جولة حقيقية للأقسام الشاغرة المتاحة.' },
    ],
    processH2: 'كيف تسير عملية إيجار غرفة القسم لدينا؟',
    steps: [
      { h3: 'شارك متطلبات غرفتك', text: 'أرسل إلينا حيّك السكني المستهدف وحد الميزانية الشهرية القصوى وموعد الانتقال ومتطلبات وسائل النقل.' },
      { h3: 'تصفية قاعدة البيانات النشطة', text: 'يُفرز فريق تأجيرنا السكني المحلي مخزوناتنا الشاغرة لمطابقة طلبك مع تكوينات مشتركة نظيفة ومُدارة جيداً.' },
      { h3: 'تسليم الوسائط ومراجعة التفاصيل', text: 'تلقّ فيديوهات جولة داخلية حقيقية وهياكل أسعار دقيقة وملاحظات مفصّلة عن المرافق المشتركة تُرسل مباشرة إلى واتساب.' },
      { h3: 'المعاينة المجدولة والانتقال', text: 'أجرِ جولة ميدانية للعقار برفقة أحد ممثلي دانية للتحقق من نظافة المرافق قبل إتمام الوديعة وتسليم المفاتيح.' },
    ],
    suitabilityH2: 'اختيار غرفة القسم المناسبة',
    suitabilityP1: 'اختيار غرفة القسم المثالية يعني تحقيق التوازن الصحيح بين أقصى توفير شهري والراحة اليومية الأساسية. بينما يُساعدك تأمين سعر تنافسي للغاية في تحسين ميزانيتك المالية، فإن التأكد من توفر حمامات مشتركة نظيفة ومطبخ جيد التهوية وبيئة معيشية محترمة مع شركاء السكن لا يقل أهمية لرفاهيتك اليومية.',
    suitabilityP2: 'تُزيل دانية للعقارات ضغط البحث في بوابات الإعلانات المزدحمة. نُقدّم فقط خيارات مشتركة منتقاة توفر قاعدة منزلية نظيفة ومنظّمة وقريبة من المواصلات تدعم رحلتك المهنية في قطر.',
    calloutH3: 'تبحث عن غرفة اقتصادية موثّقة؟',
    calloutText: 'لا تُضيع وقتك في معاينات غير منسقة أو منشورات قديمة. أرسل حيّك المستهدف وحد الميزانية الشهرية وموعد الانتقال مباشرة إلى مكتب تأجيرنا على واتساب الآن للحصول على قائمة مخصصة من الأقسام النظيفة الشاغرة.',
    bridgeH2: 'استكشف المزيد من خيارات الإيجار المدمجة',
    bridgeIntro: 'إذا لم يتطابق تكوين القسم المشترك مع توقعاتك في الخصوصية أو احتياجاتك المكانية، جرّب خيارات بديلة في شبكتنا:',
    bridges: [
      { h3: 'مركز الاستوديوهات وغرف الأقسام', text: 'عُد إلى صفحتنا الرئيسية للإسكان المدمج للاطلاع على نظرة عامة شاملة على المعيشة المدمجة في قطر.', cta: 'العودة إلى الدليل الرئيسي', to: '/studio-partition-rentals/' },
      { h3: 'استوديو للإيجار', text: 'ارقَ إلى شقة مدمجة مستقلة بالكامل تتضمن مطبخك الخاص وحمامك الخاص غير المشترك.', cta: 'استعرض الاستوديوهات', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'غرفة نوم واحدة للإيجار', text: 'استكشف شققاً مستقلة مدمجة توفر جداراً معمارياً هيكلياً بين منطقة نومك وصالة المعيشة المنفصلة.', cta: 'استعرض إيجارات الغرفة الواحدة', to: '/studio-partition-rentals/one-bedroom-for-rent/' },
    ],
    faqH2: 'أسئلة شائعة — إيجار غرف الأقسام',
    faqs: [
      { q: 'ما هو بالضبط إيجار غرفة القسم في الدوحة؟', a: 'غرفة القسم هي مساحة معيشية خاصة تُنشأ ضمن شقة أو فيلا مُقسَّمة أكبر. توفر غرفة مخصصة للاستخدام الشخصي، بينما تُشارك مرافق ثانوية كالمطبخ والحمام مع عدد محدود من الشركاء لتخفيض التكاليف الشهرية بشكل ملحوظ.' },
      { q: 'هل تشمل فواتير المياه والكهرباء والإنترنت إيجار القسم عادةً؟', a: 'نعم، في الغالبية العظمى من الحالات. للتبسيط على المهنيين العزاب، تُقدَّم معظم عقارات غرف الأقسام على أساس شامل. هذا يعني أن تكاليف مرافق كهرماء (الماء/الكهرباء) والإنترنت عالي السرعة مشمولة بالكامل في دفعتك الشهرية الثابتة.' },
      { q: 'كيف تختلف غرفة القسم عن شقة الاستوديو المستقلة؟', a: 'تقع غرفة القسم ضمن بيئة شقة مشتركة وتنطوي على مشاركة مرافق المطبخ أو الحمام مع الشركاء لضمان أقصى توفير مالي. أما شقة الاستوديو فهي وحدة مستقلة بالكامل بمدخل خاص ومطبخ خاص وحمام خاص.' },
      { q: 'هل يمكنني طلب فيديوهات جولة حقيقية للغرفة قبل زيارة الموقع؟', a: 'نعم، بالتأكيد. نُعطي الأولوية للفحص الرقمي لتوفير وقتك. ببساطة تواصل مع فريق دانية للعقارات على واتساب، وشارك منطقتك المستهدفة وميزانيتك الشهرية، وسنُرسل لك فيديوهات جولة داخلية حقيقية وصور حديثة للشواغر المتاحة.' },
      { q: 'هل قوائم غرف الأقسام لديكم قريبة من خطوط مترو الدوحة؟', a: 'نعم. نُدرك أن ملاءمة وسائل النقل أمر ضروري للمستأجرين ذوي الميزانية المحدودة. تُركّز محفظتنا تحديداً على خيارات الإقامة المشتركة الواقعة على مقربة من محطات المترو الرئيسية أو مسارات حافلات الربط.' },
      { q: 'ما المطلوب لتأمين غرفة قسم والانتقال إليها؟', a: 'عادةً ما يكون الانتقال سريعاً وبسيطاً جداً. ستحتاج إلى نسخة واضحة من بطاقة الإقامة القطرية السارية (QID) ووديعة تأمين مستردة (تعادل عادةً إيجار شهر واحد) ودفعة الإيجار للشهر الأول. يمكن في الغالب ترتيب الانتقال في غضون 24 إلى 48 ساعة.' },
    ],
    finalH2: 'ابحث عن غرفة قسم نظيفة واقتصادية في قطر اليوم',
    finalParagraph: 'عظّم مدخراتك الشخصية الشهرية، واستمتع بوصول سهل إلى مسارات المواصلات العامة المركزية، وابحث عن قاعدة منزلية اقتصادية تدعم أهدافك الميزانية تماماً. تجنّب ضغوط التعامل مع إعلانات غير موثّقة ومعاينات غير منسقة. تواصل مباشرة مع فريق التأجير السكني في دانية للعقارات الآن عبر واتساب لتلقّي محفظة منتقاة من غرف الأقسام النظيفة والجاهزة للانتقال المُكيَّفة مباشرةً مع ميزانيتك.',
    finalPrimaryCta: 'تحدث مع مكتب الإيجار الاقتصادي الآن',
  },

  '1br': {
    kind: 'sub',
    h1: 'غرفة نوم واحدة للإيجار في الدوحة وقطر',
    h3: 'خيارات إيجار غرفة نوم واحدة خاصة ومدمجة للعزاب والأزواج والمهنيين الحضريين.',
    heroParagraph: 'تخطيطات غرفة نوم واحدة مدمجة للمهنيين والأزواج الباحثين عن سكن مستقل بأسعار معقولة. تُدير دانية للعقارات مخزوناً نشطاً ومفحوصاً بالكامل من تكوينات الغرفة الواحدة المدمجة وأجزاء الفيلا المستقلة عبر خطوط النقل الرئيسية في قطر. سواء احتجت تصميماً نظيفاً غير مؤثّث بصالة وغرفة نوم منفصلة، أو عقاراً مُداراً بالكامل يشمل المرافق قريباً من مترو الدوحة، يُساعدك خبراؤنا في إيجاد الشواغر الموثّقة المُكيَّفة مباشرةً مع حدود ميزانيتك.',
    primaryCta: 'اطلب توفر الغرفة الواحدة',
    trustPoints: [
      'فصل هيكلي خاص بالكامل بين غرف النوم وصالات المعيشة.',
      'مواقع استراتيجية على مقربة من المترو ومسارات الحافلات.',
    ],
    overviewH2: 'إيجارات الغرفة الواحدة الخاصة والعملية',
    overviewP1: 'يمثّل إيجار غرفة النوم الواحدة المدمجة — المعروف غالباً بالـ 1BHK العملي — الخطوة المثلى التالية للسكان الأفراد أو الأزواج التنفيذيين الذين تجاوزوا المساحات المدمجة المفتوحة. على خلاف الاستوديو حيث تشترك مناطق الطبخ والجلوس والنوم في مساحة مفتوحة واحدة، تُوفّر شقة الغرفة الواحدة جداراً معمارياً واضحاً يفصل غرفة نومك الخاصة عن منطقة المعيشة الرئيسية.',
    overviewP2: 'بالنسبة لآلاف المديرين المتوسطين والكوادر الصحية والأزواج التنفيذيين في الدوحة، يُقدّم اختيار عقار مدمج أحادي الغرفة قاعدة منزلية وظيفية وقليلة الصيانة للغاية. تُبسّط دانية للعقارات بحثك بالفحص المسبق للقوائم من حيث تصاميم التخزين العملية وأنظمة التكييف الوظيفية وإمكانية الوصول لمواقف السيارات والقرب من المتاجر.',
    overviewP3: 'يُركّز هذا الكتالوج المخصص كلياً على الخيارات الاقتصادية المدمجة أحادية الغرفة وأجزاء الفيلا. إذا كنت تبحث عن شقق عائلية أكبر أو مجمعات سكنية راقية، يُرجى تصفّح صفحة الشقق الرئيسية لدينا.',
    overviewNavLinks: [
      { text: 'استكشف الشقق الرئيسية للإيجار', to: '/apartments-for-rent/' },
      { text: 'استكشف الاستوديوهات المستقلة للإيجار', to: '/studio-partition-rentals/studio-for-rent/' },
      { text: 'استكشف غرف الأقسام للإيجار', to: '/studio-partition-rentals/partition-room-for-rent/' },
    ],
    benefitsH2: 'لماذا تحظى إيجارات الغرفة الواحدة بشعبية في الدوحة؟',
    benefitsIntro: 'يُتيح الترقي إلى عقار مدمج أحادي الغرفة للمهنيين العزاب والأزواج بيئة منزلية أكثر تنظيماً مع إبقاء التكاليف السكنية الشهرية ميسورة للغاية.',
    benefits: [
      { h3: 'خصوصية هيكلية بجدار خاص', text: 'استمتع بتصميم معماري واضح يضم غرفة نوم منفصلة بجدار، مما يُتيح لك استقبال الضيوف في الصالة مع إبقاء منطقة نومك خاصة تماماً.' },
      { h3: 'مثالي للعزاب والأزواج', text: 'أمّن قاعدة منزلية مريحة للغاية وعملية تستوعب بسهولة ساكنَين دون الضيق الذي توفره الوحدة المدمجة المفتوحة.' },
      { h3: 'ميزانيات إسكان متوازنة', text: 'وفّر بشكل ملحوظ في الإيجار الشهري باختيار خيارات 1BHK المدمجة أو أجزاء الفيلا المُدارة بدلاً من الشقق العائلية الكبيرة الباهظة.' },
      { h3: 'مساحة صغيرة قليلة الصيانة', text: 'وفّر الوقت في الصيانة بتصميم ذكي وفعّال سهل التنظيف والتنظيم والتأثيث بميزانية معقولة.' },
    ],
    comparisonH2: 'الغرفة الواحدة مقابل الاستوديو مقابل غرفة القسم',
    comparisonIntro: 'تقييم التصميم الهيكلي ومستويات الخصوصية والملفات الميزانية لكل خيار إسكان مدمج يُساعدك في إيجاد الخيار المناسب لأسلوب حياتك:',
    comparisonRows: [
      { feature: 'التصميم المعماري', left: 'غرفة نوم منفصلة بجدار وصالة معيشة مستقلة', right: 'مساحة معيشة مفتوحة مدمجة ومطبخ / غرفة خاصة مخصصة ضمن شقة مشتركة' },
      { feature: 'مستوى الخصوصية', left: 'أقصى درجات الخصوصية — فصل هيكلي كامل', right: 'عالٍ — وحدة خاصة بمساحات مدمجة / متوسط — غرفة خاصة بمرافق مشتركة' },
      { feature: 'المطبخ والحمام', left: 'وحدات خاصة بنسبة 100% مدمجة في الوحدة', right: 'وحدات خاصة بنسبة 100% مدمجة في الوحدة / مشتركة في الغالب مع عدد محدود من الشركاء' },
      { feature: 'الأنسب لـ', left: 'العزاب والأزواج التنفيذيون والمهنيون', right: 'المغتربون العزاب الذين يُعطون الأولوية للمساحة المستقلة / المستأجرون الساعون لأقصى توفير' },
    ],
    audienceH2: 'من يجب أن يفكر في إيجار غرفة واحدة؟',
    audience: [
      'الأزواج العاملون الذين يحتاجون قاعدة منزلية مريحة وخاصة وسهلة الإدارة في قطر.',
      'المهنيون التنفيذيون الذين يحتاجون فصلاً واضحاً بين منطقة نومهم وصالة المعيشة.',
      'المغتربون المنتقلون من شقق أو غرف مشتركة إلى تصميم أكثر تنظيماً.',
      'المستأجرون ذوو الميزانية المحدودة الباحثون عن خيارات 1BHK مدمجة اقتصادية بدلاً من الشقق العائلية الباهظة.',
      'السكان العزاب الباحثون عن عقار قليل الصيانة سهل الإدارة بجانب مسيرة مهنية مشغولة.',
    ],
    areasH2: 'إيجارات الغرفة الواحدة في الدوحة والمناطق الرئيسية بقطر',
    areasParagraph: 'تتباين متوسطات الإيجار الشهرية وأنماط التصميم ونقاط الوصول إلى المواصلات العامة بين الأحياء. ترصد دانية للعقارات بنشاط الوحدات المدمجة أحادية الغرفة المتاحة في هذه القطاعات السكنية عالية الطلب:',
    whyH2: 'لماذا تختار دانية للعقارات لإيجار الغرفة الواحدة؟',
    whyIntro: 'نُزيل ضغط إيجاد منزل بالفحص المسبق لكل عقار مدمج أحادي الغرفة من حيث وضوح الفصل التصميمي وشفافية شروط الفواتير.',
    whyCards: [
      { h3: 'تركيز على الإسكان المدمج الاقتصادي', text: 'نتجاوز العقارات العائلية الكبيرة وتكوينات الغرف المشتركة لنُريك فقط تكوينات الغرفة الواحدة الفعّالة والاقتصادية.' },
      { h3: 'التحقق الصريح من شروط المرافق', text: 'يُؤكّد وكلاؤنا جميع تفاصيل الفواتير مسبقاً، مُصرّحين بوضوح ما إذا كانت مرافق كهرماء والإنترنت مشمولة في إيجارك الشهري.' },
      { h3: 'مطابقة العقارات بتوجه نحو المواصلات', text: 'نُعطي الأولوية لعقارات 1BHK المدمجة الواقعة على مسارات المترو وحافلات الربط مباشرةً، لمساعدتك في تجنب التنقلات الطويلة.' },
      { h3: 'فيديوهات واتساب المباشرة', text: 'تجنّب الإعلانات المضللة والرحلات الضائعة. تواصل مباشرة مع فريقنا عبر واتساب لاستلام فيديوهات جولة حقيقية للوحدات المتاحة.' },
    ],
    processH2: 'كيف تسير عملية إيجار الغرفة الواحدة لدينا؟',
    steps: [
      { h3: 'أرسل متطلبات تصميمك', text: 'شارك حيّك السكني المفضّل وحد الميزانية الشهرية القصوى وتفضيل التأثيث (مفروش/غير مفروش) وموعد الانتقال.' },
      { h3: 'الفرز والمطابقة في قاعدة البيانات', text: 'يراجع قسم تأجيرنا المحلي قاعدة بياناتنا النشطة لاستخراج خيارات الغرفة الواحدة المدمجة المتاحة التي تناسب معايير ميزانيتك.' },
      { h3: 'تسليم الوسائط والتفاصيل مباشرة', text: 'راجع فيديوهات جولة داخلية حقيقية وهياكل أسعار دقيقة وتفاصيل المرافق تُرسل مباشرة إلى واتساب أو جهازك المحمول.' },
      { h3: 'معاينات مرفقة وإتمام عقد الإيجار', text: 'أجرِ جولة ميدانية للوحدة برفقة أحد مستشاري دانية ذوي الخبرة للتحقق من حالة العقار قبل الشروع في خطوات الانتقال.' },
    ],
    suitabilityH2: 'اختيار إيجار الغرفة الواحدة المناسبة',
    suitabilityP1: 'اختيار العقار المدمج أحادي الغرفة المثالي يعني إيجاد مساحة تتوافق مع جدول مسيرتك المهنية اليومية وأهداف راحتك الشخصية وأهدافك المالية الشهرية. في حين يُتيح اختيار خيار 1BHK مؤثّث بالكامل تجربة انتقال سريعة وخالية من الضغط، يمنحك اختيار جزء فيلا غير مؤثّث الحرية الإبداعية لتصميم مساحتك كما تريد على المدى البعيد.',
    suitabilityP2: 'تُزيل دانية للعقارات الضغط عن هذا القرار. نُقدّم خيارات سكنية مدمجة موثّقة تتوافق تماماً مع روتينك المهني اليومي وتوقعات أسلوب حياتك.',
    calloutH3: 'هل أنت مستعد للانتقال إلى وحدة مدمجة موثّقة بغرفة واحدة؟',
    calloutText: 'لا تُضيع وقتك في معاينات غير منسقة أو منشورات قديمة. أرسل حيّك المستهدف وحد الميزانية الشهرية وموعد الانتقال مباشرة إلى مكتب تأجيرنا على واتساب الآن للحصول على قائمة مخصصة من الشواغر النظيفة المتاحة.',
    bridgeH2: 'استكشف المزيد من خيارات الإيجار المدمجة',
    bridgeIntro: 'إذا لم يتناسب تصميم الغرفة الواحدة المدمجة تماماً مع ميزانيتك الحالية أو خططك، يمكنك استعراض تكوينات إسكان بديلة في شبكتنا:',
    bridges: [
      { h3: 'مركز الاستوديوهات وغرف الأقسام', text: 'عُد إلى صفحتنا الرئيسية للإسكان المدمج للاطلاع على نظرة عامة شاملة على خيارات المعيشة المدمجة في قطر.', cta: 'العودة إلى الدليل الرئيسي', to: '/studio-partition-rentals/' },
      { h3: 'استوديو للإيجار', text: 'اطّلع على قائمتنا الشاملة من الاستوديوهات المستقلة بالكامل التي تتضمن مطابخ خاصة مدمجة وحمامات خاصة.', cta: 'استعرض الاستوديوهات', to: '/studio-partition-rentals/studio-for-rent/' },
      { h3: 'غرفة قسم للإيجار', text: 'احصل على غرف شخصية اقتصادية ضمن شقق وفلل مُدارة بشكل مشترك وآمن لتعظيم مدخراتك الشهرية.', cta: 'استعرض غرف الأقسام', to: '/studio-partition-rentals/partition-room-for-rent/' },
      { h3: 'قسم شقق غرفة نوم واحدة', text: 'تصفّح قوائم الشقق المستقلة الأكبر ذات الغرفة الواحدة الواقعة ضمن أبراج سكنية رسمية ومجمعات سكنية.', cta: 'استعرض الفئة العامة للشقق', to: '/apartments-for-rent/1-bedroom/' },
    ],
    faqH2: 'أسئلة شائعة — إيجار الغرفة الواحدة',
    faqs: [
      { q: 'ما الفرق المعماري الجوهري بين شقة الاستوديو وإيجار الغرفة الواحدة المدمجة؟', a: 'تتميز شقة الاستوديو بتصميم مفتوح تشترك فيه منطقة النوم وصالة المعيشة والمطبخ في مساحة واحدة. أما إيجار الغرفة الواحدة المدمجة فيُوفّر جداراً معمارياً هيكلياً يفصل غرفة النوم عن صالة المعيشة، مما يمنحك خصوصية إضافية.' },
      { q: 'كيف تختلف هذه الصفحة عن دليل شققكم الرئيسي ذي الغرفة الواحدة؟', a: 'تقع هذه الصفحة ضمن قسم الإسكان المدمج والاقتصادي لدينا، مُركّزةً تحديداً على تكوينات الغرفة الواحدة الاقتصادية للغاية والتصاميم المدمجة وأجزاء الفيلا. أما صفحة شققنا الرئيسية ذات الغرفة الواحدة فتغطي الشقق القياسية الأوسع ضمن أبراج سكنية كبيرة.' },
      { q: 'هل تشمل فواتير الماء والكهرباء (كهرماء) الإيجار الشهري لوحدة الغرفة الواحدة؟', a: 'في سوق الإيجار القطري، كثير من خيارات الغرفة الواحدة المدمجة وأجزاء الفيلا تُقدَّم على أساس شامل — أي أن المياه والكهرباء (كهرماء) والإنترنت عالي السرعة مشمولة في الإيجار. سيتحقق وكلاؤنا صراحةً من شروط المرافق لكل عقار قبل توقيعك.' },
      { q: 'هل يمكنني الاختيار بين خيارات الغرفة الواحدة المؤثّثة وغير المؤثّثة؟', a: 'نعم. يتضمن مخزوننا النشط مزيجاً متوازناً من خيارات 1BHK المؤثّثة بالكامل المزودة بالأجهزة الكبيرة والأثاث لسهولة الانتقال، إضافة إلى تصاميم غير مؤثّثة تُتيح لك إحضار أثاثك وترتيبه.' },
      { q: 'ما المستندات الجوهرية التي يحتاجها المستأجرون لتأمين عقد إيجار غرفة واحدة مدمجة في قطر؟', a: 'لتأمين عقد إيجار قياسي، ستحتاج إلى نسخة واضحة من بطاقة الإقامة القطرية السارية (QID) ونسخة من جواز السفر وشيكات مؤجّلة بمدة عقد الإيجار ووديعة تأمين مستردة (تعادل عادةً إيجار شهر واحد).' },
      { q: 'كيف يمكنني طلب فيديوهات جولة حديثة للوحدات ذات الغرفة الواحدة المتاحة قبل جدولة زيارة ميدانية؟', a: 'ببساطة تواصل مع مكتب تأجير دانية للعقارات مباشرة عبر واتساب. شارك حيّك المفضّل وميزانيتك الشهرية، وسيُرسل فريقنا فوراً فيديوهات جولة حقيقية وصور داخلية حديثة وتفاصيل التوفر الحالية.' },
    ],
    finalH2: 'ابحث عن إيجارك المثالي الاقتصادي لغرفة نوم واحدة اليوم',
    finalParagraph: 'استمتع براحة تصميم غرفة النوم المنفصلة بجدار، وأدِر ميزانيتك السكنية الشهرية بفاعلية، وابحث عن منزل يناسب روتينك المهني اليومي تماماً. تجنّب ضغوط التعامل مع إعلانات غير موثّقة وعروض عقارية متكررة. تواصل مباشرة مع متخصصي التأجير السكني في دانية للعقارات الآن عبر واتساب لتلقّي محفظة منتقاة من خيارات الغرفة الواحدة المدمجة وأجزاء الفيلا المتاحة والمُكيَّفة مع أسلوب حياتك وأهدافك الميزانية.',
    finalPrimaryCta: 'تحدث مع مكتب التأجير لدينا الآن',
  },
}

// â"€â"€â"€ Benefit / trust card icon map â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const benefitIcons = [
  <Banknote className="w-6 h-6 text-forest" />,
  <Home className="w-6 h-6 text-forest" />,
  <MapPin className="w-6 h-6 text-forest" />,
  <Wifi className="w-6 h-6 text-forest" />,
]

const whyIcons = [
  <Star className="w-6 h-6 text-forest" />,
  <ShieldCheck className="w-6 h-6 text-forest" />,
  <MapPin className="w-6 h-6 text-forest" />,
  <MessageCircle className="w-6 h-6 text-forest" />,
]

const categoryIcons = [
  <Building2 className="w-7 h-7 text-forest" />,
  <Layers className="w-7 h-7 text-forest" />,
  <Home className="w-7 h-7 text-forest" />,
]

// â"€â"€â"€ FAQ Accordion â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y divide-border">
      {faqs.map((faq, i) => (
        <div key={i} className="py-4">
          <button
            className="w-full text-left flex justify-between items-start gap-4 font-semibold text-ink"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{faq.q}</span>
            <span className="text-forest text-xl flex-shrink-0 mt-0.5">{open === i ? '-' : '+'}</span>
          </button>
          {open === i && (
            <p className="mt-3 text-ink-muted text-sm leading-relaxed">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// â"€â"€â"€ Main component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

export function StudiosPage({ filter }: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const c = isAr ? contentAr[filter] : content[filter]
  const areas = isAr ? areaLinksAr[filter] : areaLinks[filter]
  const waLink = `https://wa.me/${company.whatsapp}`
  usePageSchema([faqPageSchema(c.faqs)])

  // i18n-derived values
  const i18nKey = filter === '1br' ? 'oneBr' : filter
  const tH1 = t(`studios.${i18nKey}.h1`)
  const tH3 = t(`studios.${i18nKey}.h3`)
  const tPrimaryCta = t(`studios.${i18nKey}.primaryCta`)
  const tTrust = filter === 'all'
    ? (t('studios.all.trust', { returnObjects: true }) as string[])
    : c.trustPoints
  // Route-specific final-CTA keys (fall back to shared defaults)
  const ctaH2Key = filter === 'all' ? 'studios.ctaH2' : `studios.${i18nKey}.ctaH2`
  const ctaPrimaryKey = filter === 'all' ? 'studios.ctaPrimary' : `studios.${i18nKey}.ctaPrimary`
  const isAll = c.kind === 'all'
  const isSub = c.kind === 'sub'

  // Comparison header labels per filter
  const comparisonColLeft = isAr
    ? (filter === 'studio' ? 'استوديو مستقل للإيجار' :
       filter === 'partition' ? 'غرفة قسم مُقسَّمة' :
       'غرفة نوم واحدة مدمجة')
    : (filter === 'studio' ? 'Independent Studio Rental' :
       filter === 'partition' ? 'Subdivided Partition Room' :
       'Compact One Bedroom Rental')

  const comparisonColRight = isAr
    ? (filter === 'studio' ? 'غرفة قسم مُقسَّمة' :
       filter === 'partition' ? 'استوديو مستقل للإيجار' :
       'استوديو مستقل / غرفة قسم')
    : (filter === 'studio' ? 'Subdivided Partition Room' :
       filter === 'partition' ? 'Independent Studio Rental' :
       'Standalone Studio / Partition Room')

  const studiosSeo = {
    all: { title: 'Studio & Partition Rooms for Rent in Doha | Budget Housing Qatar', desc: 'Explore affordable studios, partition rooms, and compact 1-bedroom rentals for rent in Doha and greater Qatar. Find budget-friendly solo expat housing with direct WhatsApp support.' },
    studio: { title: 'Studio for Rent in Doha | Private Self-Contained Units Qatar', desc: 'Find fully self-contained studios for rent in Doha and greater Qatar. Explore premium private layouts, villa-outbuilding studios, and fully fitted units with WhatsApp support.' },
    partition: { title: 'Partition Room for Rent in Doha | Shared Budget Housing Qatar', desc: 'Find affordable partition rooms for rent in Doha and greater Qatar. Explore cost-effective shared villa subdivisions and all-inclusive flatshares with direct WhatsApp support.' },
    '1br': { title: 'One Bedroom for Rent in Doha | Compact 1BHK Rentals Qatar', desc: 'Find affordable, compact one-bedroom rentals for rent in Doha and greater Qatar. Explore private budget-conscious 1BHK villa portions with direct WhatsApp support.' },
  }[filter]

  // Section 2 (Overview) "Feature Focus" visual — clean micro-living interior, distinct from the hero image
  const overviewImg = {
    all: '/studio-for-rent-doha-qatar.webp',
    studio: '/one-bedroom-for-rent-doha-qatar.webp',
    partition: '/studio-for-rent-doha-qatar.webp',
    '1br': '/studio-for-rent-doha-qatar.webp',
  }[filter]
  const overviewAlt = isAr
    ? 'تصميم داخلي مُعتنى به لشقة استوديو عملية للإيجار مخصصة للمحترفين العزاب في الدوحة قطر.'
    : 'Well-maintained interior layout of an efficient studio apartment rental tailored for single professionals.'

  return (
    <>
      <title>{studiosSeo.title}</title>
      <meta name="description" content={studiosSeo.desc} />
      {/* â"€â"€ Section 1: Hero â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="bg-forest text-white py-16 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Reveal direction="up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">{tH1}</h1>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <p className="text-lime text-xl font-semibold mb-4">{tH3}</p>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <p className="text-white/85 text-base max-w-3xl mb-6 leading-relaxed">{c.heroParagraph}</p>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex flex-wrap gap-3 mb-6">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-lime text-forest font-bold px-6 py-3 rounded-full text-sm hover:bg-lime/90 transition-colors inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {tPrimaryCta}
                  </a>
                  <Link
                    to="/contact-us/"
                    className="border border-white text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
                  >
                    {t('studios.contactTeam')}
                  </Link>
                </div>
              </Reveal>
              {tTrust.length > 0 && (
                <Reveal direction="up" delay={320}>
                  <ul className="space-y-2">
                    {tTrust.map((tp, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/85 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-lime mt-0.5 flex-shrink-0" />
                        <span>{tp}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
            <Reveal direction="right" delay={200}>
              <div className="relative pb-6 lg:pb-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={
                      filter === 'all' ? '/studio-and-partition-rentals-doha-qatar.webp' :
                      filter === 'studio' ? '/studio-for-rent-doha-qatar.webp' :
                      filter === 'partition' ? '/partition-room-for-rent-doha-qatar.webp' :
                      '/one-bedroom-for-rent-doha-qatar.webp'
                    }
                    alt={
                      filter === 'all' ? 'Affordable independent studio apartments and partition rooms for rent in Doha Qatar by Dania Real Estate.' :
                      filter === 'studio' ? 'Compact modern studio apartment rental layout configuration for professionals in Doha Qatar.' :
                      filter === 'partition' ? 'Orderly affordable private partition room rental setup for single executives in Doha Qatar.' :
                      'Verified one bedroom apartments for rent in Doha Qatar managed by Dania Real Estate.'
                    }
                    className="w-full h-56 sm:h-80 lg:h-[500px] object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-3 lg:-bottom-5 lg:-left-5 bg-lime text-forest font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl">
                  {isAr
                    ? (filter === 'all' ? 'الاستوديوهات والأقسام · قطر' :
                       filter === 'studio' ? 'استوديوهات للإيجار · الدوحة' :
                       filter === 'partition' ? 'غرف الأقسام · قطر' :
                       'إيجارات غرفة نوم واحدة · الدوحة')
                    : (filter === 'all' ? 'Studios & Partitions · Qatar' :
                       filter === 'studio' ? 'Studio Rentals · Doha' :
                       filter === 'partition' ? 'Partition Rooms · Qatar' :
                       '1BR Rentals · Doha')}
                </div>
                <div className="absolute top-4 right-3 lg:top-5 lg:-right-4 bg-white text-ink font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg">{isAr ? 'بدون عمولة' : 'Zero Commission'}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 2: Overview */}
      <section className="bg-surface-low py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          {isAll ? (
            /* All page — two-column narrative with visual representation */
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <Reveal direction="up">
                  <h2 className="text-3xl font-bold text-ink mb-6">{c.overviewH2}</h2>
                </Reveal>
                <div className="space-y-4 text-ink-muted leading-relaxed">
                  <Reveal direction="up" delay={80}><p>{c.overviewP1}</p></Reveal>
                  <Reveal direction="up" delay={160}><p>{c.overviewP2}</p></Reveal>
                  <Reveal direction="up" delay={240}><p>{c.overviewP3}</p></Reveal>
                </div>
                <Reveal direction="up" delay={320}>
                  <div className="mt-5">
                    <Link
                      to={(c as ContentAll).overviewInternalLink.to}
                      className="text-forest font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      {(c as ContentAll).overviewInternalLink.text}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              </div>
              <Reveal direction="left" delay={160}>
                <div className="rounded-3xl overflow-hidden shadow-xl border border-border">
                  <img
                    src={overviewImg}
                    alt={overviewAlt}
                    className="w-full h-64 sm:h-80 lg:h-[420px] object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          ) : (
            /* Sub pages — centered single-column editorial block with internal nav links */
            <div className="max-w-3xl mx-auto">
              <Reveal direction="up">
                <h2 className="text-3xl font-bold text-ink mb-6 text-center">{c.overviewH2}</h2>
              </Reveal>
              <div className="space-y-4 text-ink-muted leading-relaxed">
                <Reveal direction="up" delay={80}><p>{c.overviewP1}</p></Reveal>
                <Reveal direction="up" delay={160}><p>{c.overviewP2}</p></Reveal>
                <Reveal direction="up" delay={240}><p>{c.overviewP3}</p></Reveal>
              </div>
              <Reveal direction="up" delay={320}>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {(c as ContentSub).overviewNavLinks.map((nl, i) => (
                    <Link
                      key={i}
                      to={nl.to}
                      className="inline-flex items-center gap-1.5 bg-white border border-border rounded-full px-5 py-2.5 text-sm font-semibold text-forest hover:border-forest transition-colors"
                    >
                      {nl.text}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* â"€â"€ Section 3 (all only): Categories â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      {isAll && (
        <section className="py-14">
          <div className="max-w-[1280px] mx-auto px-6">
            <Reveal direction="up">
              <h2 className="text-3xl font-bold text-ink mb-3">{(c as ContentAll).categoriesH2}</h2>
            </Reveal>
            <Reveal direction="up" delay={80}>
              <p className="text-ink-muted mb-8">{(c as ContentAll).categoriesIntro}</p>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(c as ContentAll).categories.map((cat, i) => (
                <Reveal key={i} direction="up" delay={i * 100}>
                  <div
                    className={`rounded-xl p-6 flex flex-col gap-4 border ${
                      i === 0
                        ? 'bg-forest text-white border-forest'
                        : 'bg-white border-border'
                    }`}
                  >
                    <div>{categoryIcons[i]}</div>
                    <h3 className={`text-xl font-bold ${i === 0 ? 'text-white' : 'text-ink'}`}>
                      {cat.h3}
                    </h3>
                    <p className={`text-sm flex-1 ${i === 0 ? 'text-white/85' : 'text-ink-muted'}`}>
                      {cat.text}
                    </p>
                    <Link
                      to={cat.to}
                      className={`text-sm font-semibold px-5 py-2.5 rounded-full text-center transition-colors ${
                        i === 0
                          ? 'bg-lime text-forest hover:bg-lime/90'
                          : 'bg-forest text-white hover:bg-forest/90'
                      }`}
                    >
                      {cat.cta}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Why Choose (benefits) — comes before the comparison per spec */}
      <section className={`py-14 ${isAll ? 'bg-surface-low' : ''}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-bold text-ink mb-3">{c.benefitsH2}</h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-8">{c.benefitsIntro}</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.benefits.map((b, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-border h-full linear-card">
                  <div className="mb-3">{benefitIcons[i % benefitIcons.length]}</div>
                  <h3 className="font-bold text-ink mb-2">{b.h3}</h3>
                  <p className="text-ink-muted text-sm">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 (sub only): Studio vs Partition comparison table */}
      {isSub && (
        <section className="py-14">
          <div className="max-w-[1280px] mx-auto px-6">
            <Reveal direction="up">
              <h2 className="text-3xl font-bold text-ink mb-3">{(c as ContentSub).comparisonH2}</h2>
            </Reveal>
            <Reveal direction="up" delay={80}>
              <p className="text-ink-muted mb-6">{(c as ContentSub).comparisonIntro}</p>
            </Reveal>
            <Reveal direction="up" delay={160}>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-forest text-white">
                      <th className="text-left px-4 py-3 font-semibold">{isAr ? 'ميزة السكن' : 'Living Feature'}</th>
                      <th className="text-left px-4 py-3 font-semibold">{comparisonColLeft}</th>
                      <th className="text-left px-4 py-3 font-semibold">{comparisonColRight}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(c as ContentSub).comparisonRows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-low'}>
                        <td className="px-4 py-3 font-semibold text-ink">{row.feature}</td>
                        <td className="px-4 py-3 text-ink-muted">{row.left}</td>
                        <td className="px-4 py-3 text-ink-muted">
                          {row.links
                            ? row.links.map((lnk, li) => (
                                <span key={lnk.to}>
                                  {li > 0 && <span className="text-ink-muted/50"> | </span>}
                                  <Link to={lnk.to} className="font-semibold text-forest hover:underline">{lnk.label}</Link>
                                </span>
                              ))
                            : row.right}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* â"€â"€ Audience / Who This Is For â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className={`py-14 ${isSub ? 'bg-surface-low' : ''}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-bold text-ink mb-6">{c.audienceH2}</h2>
          </Reveal>
          <ul className="space-y-3 max-w-2xl">
            {c.audience.map((item, i) => (
              <Reveal key={i} direction="up" delay={i * 60}>
                <li className="flex items-start gap-3 text-ink-muted">
                  <CheckCircle2 className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* â"€â"€ Areas â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="bg-surface-low py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-bold text-ink mb-3">{c.areasH2}</h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-8">{c.areasParagraph}</p>
          </Reveal>
          {/* 8 local geography grid components */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {areas.map((area, i) => (
              <Reveal key={i} direction="up" delay={i * 60}>
                <Link
                  to={area.link}
                  className="bg-white rounded-2xl p-5 border border-border group block h-full linear-card"
                >
                  <h3 className="font-bold text-ink mb-2 group-hover:text-forest transition-colors text-sm">
                    {area.h3}
                  </h3>
                  <p className="text-ink-muted text-sm">{area.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ Why Choose Dania â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-bold text-ink mb-3">{c.whyH2}</h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-8">{c.whyIntro}</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.whyCards.map((wc, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div className="bg-surface-low rounded-2xl p-6 border border-border h-full linear-card">
                  <div className="mb-3">{whyIcons[i % whyIcons.length]}</div>
                  <h3 className="font-bold text-ink mb-2">{wc.h3}</h3>
                  <p className="text-ink-muted text-sm">{wc.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ Process â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="bg-surface-low py-14">
        <ProcessSteps
          title={c.processH2}
          steps={c.steps.map((step, i) => ({
            num: String(i + 1).padStart(2, '0'),
            h3: step.h3,
            desc: step.text,
          }))}
        />
      </section>

      {/* â"€â"€ Suitability + Callout â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-bold text-ink mb-5">{c.suitabilityH2}</h2>
          </Reveal>
          <div className="max-w-3xl space-y-4 text-ink-muted leading-relaxed mb-8">
            <Reveal direction="up" delay={80}>
              <p>{c.suitabilityP1}</p>
            </Reveal>
            <Reveal direction="up" delay={160}>
              <p>{c.suitabilityP2}</p>
            </Reveal>
          </div>
          <Reveal direction="up" delay={240}>
            <div className="bg-forest/5 border border-forest/20 rounded-xl p-7 max-w-3xl">
              <h3 className="text-xl font-bold text-forest mb-3">{c.calloutH3}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{c.calloutText}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ Bridge / Related Options â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="bg-surface-low py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-bold text-ink mb-3">{c.bridgeH2}</h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted mb-8">{c.bridgeIntro}</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.bridges.slice(0, 3).map((b, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div
                  className={`rounded-xl p-6 border flex flex-col gap-4 h-full ${
                    i === 0
                      ? 'bg-lime-light border-lime text-ink'
                      : 'bg-white border-border'
                  }`}
                >
                  <h3 className="font-bold text-ink">{b.h3}</h3>
                  <p className="text-ink-muted text-sm flex-1">{b.text}</p>
                  <Link
                    to={b.to}
                    className="text-forest font-semibold text-sm hover:underline inline-flex items-center gap-1"
                  >
                    {b.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          {c.bridges.length > 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {c.bridges.slice(3).map((b, i) => (
                <Reveal key={i} direction="up" delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 border border-border flex flex-col gap-4 h-full linear-card">
                    <h3 className="font-bold text-ink">{b.h3}</h3>
                    <p className="text-ink-muted text-sm flex-1">{b.text}</p>
                    <Link
                      to={b.to}
                      className="text-forest font-semibold text-sm hover:underline inline-flex items-center gap-1"
                    >
                      {b.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* â"€â"€ FAQ â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-bold text-ink mb-8">{c.faqH2}</h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <div className="max-w-3xl">
              <FAQAccordion faqs={c.faqs} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ Final CTA â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <section className="bg-lime-light border-t border-lime py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{t([ctaH2Key, 'studios.ctaH2'])}</h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-ink-muted max-w-2xl mx-auto mb-8 leading-relaxed">{c.finalParagraph}</p>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-forest text-white font-bold px-7 py-3 rounded-full text-sm hover:bg-forest/90 transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {t([ctaPrimaryKey, 'studios.ctaPrimary'])}
              </a>
              <Link
                to="/contact-us/"
                className="border border-forest text-forest font-semibold px-7 py-3 rounded-full text-sm hover:bg-forest/5 transition-colors"
              >
                {t('studios.ctaSecondary')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

