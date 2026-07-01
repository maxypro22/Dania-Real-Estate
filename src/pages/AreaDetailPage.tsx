import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Home,
  Building2,
  Users,
  Store,
  BedSingle,
  ArrowRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { areas, company } from '@/data/mockData'
import { Reveal } from '@/components/shared/Reveal'
import { StackedCards } from '@/components/shared/StackedCards'
import { CardCarousel } from '@/components/shared/CardCarousel'
import { LocationIcon } from '@/components/shared/LocationIcon'
import { ScrollRevealText } from '@/components/shared/ScrollRevealText'
import { usePageSchema } from '@/components/shared/Seo'
import { faqPageSchema } from '@/lib/seo'

// ---------------------------------------------------------------------------
// Per-area, spec-accurate content (English — verbatim from the content spec).
// Each entry renders the full set of sections for that area.
// ---------------------------------------------------------------------------

interface NamedBlock {
  h3: string
  text: string
}

interface NearbyLink {
  h3: string
  text: string
  slug: string
}

interface AreaDetail {
  seoTitle: string
  metaDescription: string
  hero: {
    h1: string
    h3: string
    paragraph: string
    primaryBtn: string
    trustPoints: string[]
  }
  overview: {
    h2: string
    paragraphs: string[]
  }
  categories: {
    h2: string
    intro: string
    cards: { h3: string; text: string; button: string }[]
  }
  subAreaFocus?: {
    h2: string
    intro: string
    items: NamedBlock[]
  }
  whyRent: {
    h2: string
    intro: string
    cards: NamedBlock[]
  }
  whoFor?: {
    h2: string
    items: string[]
  }
  localGuidance?: {
    h2: string
    paragraphs: string[]
    callout?: { h3: string; text: string }
  }
  whyChooseDania: {
    h2: string
    intro: string
    cards: NamedBlock[]
  }
  process: {
    h2: string
    steps: NamedBlock[]
  }
  nearby: {
    h2: string
    intro: string
    links: NearbyLink[]
  }
  faqs: { q: string; a: string }[]
  finalCta: {
    h2: string
    paragraph: string
    primaryBtn: string
  }
}

// Service silo hrefs by category card index (apartments, villas, staff, shops, studio).
const CATEGORY_HREFS = [
  '/apartments-for-rent/',
  '/villas-for-rent/',
  '/staff-accommodation/',
  '/shops-for-rent/',
  '/studio-partition-rentals/',
]

const CATEGORY_ICONS = [
  <Home size={22} />,
  <Building2 size={22} />,
  <Users size={22} />,
  <Store size={22} />,
  <BedSingle size={22} />,
]

const AREA_DETAIL: Record<string, AreaDetail> = {
  // =====================================================================
  doha: {
    seoTitle: 'Properties for Rent in Doha | Dania Real Estate Qatar',
    metaDescription:
      'Explore verified properties for rent in Doha with Dania Real Estate. Browse apartments, residential villas, commercial retail shops, and compact rentals across Central Doha, Al Dafna, Al Hilal, and Al Mamoura.',
    hero: {
      h1: 'Properties for Rent in Doha',
      h3: 'Comprehensive rental support across Qatar’s central hub for business, retail, and residential communities.',
      paragraph:
        'Navigating the fast-moving real estate market in Qatar’s capital requires accurate local data and structured property inventories. Dania Real Estate provides targeted leasing solutions across Doha’s primary residential zones, high-street retail sectors, and corporate corridors. Whether you are an expat professional aligning your commute with the Doha Metro network, a family searching for compound villas, or an enterprise looking for strategic retail showrooms and staff accommodation blocks, our localized team delivers vetted, compliant listings tailored to your specific spatial needs and operational budgets.',
      primaryBtn: 'Explore Doha Rental Categories',
      trustPoints: [
        'Direct coverage across Central Doha, Al Dafna, Al Hilal, and Al Mamoura.',
        '100% verified lease parameters with transparent municipality (Baladiya) terms.',
        'Rapid, unedited video walk-through support available directly over WhatsApp.',
      ],
    },
    overview: {
      h2: 'Rental Property Support in Doha',
      paragraphs: [
        'As the economic and cultural center of Qatar, Doha experiences consistent, high-velocity rental demand from multi-national corporations, growing families, retail entrepreneurs, and individual single professionals. The city’s dynamic layout offers everything from luxury high-rise flats overlooking the Arabian Gulf to deeply affordable villa subdivisions, managed staff quarters, and high-visibility corporate retail showrooms.',
        'To streamline your exploration, this dedicated portal prioritizes location-first navigation. Instead of scrolling through mismatched property lists across different cities, visitors can use this Doha matrix to isolate the exact structural asset type required for their lifestyle or business operations.',
        'Dania Real Estate eliminates guesswork by bridging the gap between property seekers and land owners. Every active listing in our Doha catalog is pre-vetted for safety, structural maintenance, proximity to public transportation, and accurate market value, ensuring a secure leasing experience from step one.',
      ],
    },
    categories: {
      h2: 'Explore Rental Categories in Doha',
      intro:
        'Select the specific real estate configuration that matches your operational or household goals inside the capital district:',
      cards: [
        {
          h3: 'Apartments for Rent in Doha',
          text: 'Discover functional, light-filled 1-bedroom, 2-bedroom, and spacious 3-bedroom flat configurations built for individual executives and urban families.',
          button: 'View Doha Apartments',
        },
        {
          h3: 'Villas for Rent in Doha',
          text: 'Secure standalone residences, family compounds, and private standalone properties offering maximum square footage, parking space, and domestic comfort.',
          button: 'View Doha Villas',
        },
        {
          h3: 'Staff Accommodation in Doha',
          text: 'Fully compliant, highly scalable corporate labor accommodation and corporate housing blocks positioned close to major transit highways and industrial corridors.',
          button: 'View Doha Staff Housing',
        },
        {
          h3: 'Shops for Rent in Doha',
          text: 'Maximize consumer footfall with premium retail spaces, main-road storefronts, commercial offices, and high-visibility corporate showrooms.',
          button: 'View Doha Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Doha',
          text: 'Economical micro-housing configurations, private self-contained studio flats, and budget-friendly partition room options with bundled utility terms.',
          button: 'View Doha Compact Rentals',
        },
      ],
    },
    subAreaFocus: {
      h2: 'Doha Sub-Areas We Support',
      intro:
        'Our core Doha database focuses heavily on the capital’s most established residential and commercial quadrants, offering robust connectivity to primary commuter expressways:',
      items: [
        {
          h3: 'Central Doha',
          text: 'High-demand inner-city zones placed adjacent to core arterial ring roads, providing immediate access to government hubs, business centers, and old-town retail blocks.',
        },
        {
          h3: 'Al Dafna',
          text: "Qatar's premier corporate skyscraper district, offering professional tenants elegant urban environments, modern flat complexes, and seamless proximity to the Doha Corniche.",
        },
        {
          h3: 'Al Hilal',
          text: 'A beautifully balanced, highly accessible residential community favored by growing families for its independent villas, wide streets, and close proximity to major international academies.',
        },
        {
          h3: 'Al Mamoura',
          text: 'A practical residential and commercial hub positioned near key intersections, offering high-value family apartments, standalone properties, and local retail centers.',
        },
      ],
    },
    whyRent: {
      h2: 'Why Doha Is Qatar’s Key Rental Hub',
      intro:
        'Choosing a base within the capital city ensures your residential home or commercial business operates with maximum structural and logistics advantages.',
      cards: [
        {
          h3: 'Perfect Transit Connectivity',
          text: 'Travel smoothly via the interconnected Doha Metro networks and seamlessly link into major expressways like the C-Ring, D-Ring, and E-Ring Roads.',
        },
        {
          h3: 'Diverse Real Estate Options',
          text: 'Access a complete spectrum of housing scales, from affordable partition setups and studios to luxury standalone corporate villas and retail storefronts.',
        },
        {
          h3: 'Ultimate Daily Convenience',
          text: "Reside within arm's reach of high-street shopping centers, prominent clinical facilities, international schools, and governmental public service complexes.",
        },
        {
          h3: 'Verified Commercial Density',
          text: 'Establish your retail shop or corporate enterprise inside high-footfall business zones built to drive corporate expansion and steady consumer interaction.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Doha Rental Index?',
      items: [
        'Expat Professionals matching their residential home coordinates with central downtown office towers.',
        'Growing Families searching for secure apartment flats or independent villa layouts close to major city schools.',
        'Corporate Procurement Managers sourcing legally compliant, scalable staff housing blocks within Doha municipality boundaries.',
        'Retail Business Owners evaluating main-road visibility for premium commercial shops and consumer storefronts.',
        'Budget-Aware Renters checking affordable studios, private 1BHKs, or managed partition configurations inside central Doha.',
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Doha',
      intro:
        "Navigating the capital's fast-moving market demands transparency, direct communication, and deep neighborhood knowledge.",
      cards: [
        {
          h3: 'Hyper-Local Market Insights',
          text: 'We track local tenancy trends, municipal Baladiya regulations, and accurate pricing points across Central Doha, Al Dafna, Al Hilal, and Al Mamoura.',
        },
        {
          h3: 'Versatile Property Management',
          text: 'Our agents maintain deep portfolios across all sectors, from single budget room shares to complete high-rise commercial structures.',
        },
        {
          h3: 'Streamlined Tenant Compliance',
          text: 'We manage the administrative workload, ensuring clear lease contracts, accurate security deposits, and transparent utility parameters.',
        },
        {
          h3: 'On-Demand WhatsApp Media',
          text: 'Skip time-consuming uncoordinated site visits. We send unedited interior walkthrough videos and high-definition imagery straight to your mobile device.',
        },
      ],
    },
    process: {
      h2: 'How Our Doha Rental Process Works',
      steps: [
        {
          h3: 'Select Your Structural Property Type',
          text: 'Let us know whether your current requirement demands an apartment, independent villa, retail shop, staff housing block, or compact studio setup.',
        },
        {
          h3: 'Refine Your Doha Location Target',
          text: 'Specify your preferred neighborhood perimeter within the capital core, such as Central Doha, Al Dafna, Al Hilal, or Al Mamoura.',
        },
        {
          h3: 'State Your Rental Budget & Timeline',
          text: 'Outline your target monthly financial limits, required furnishing style (furnished vs unfurnished), and exact move-in date.',
        },
        {
          h3: 'Review Curated Property Inventories',
          text: 'Receive immediate, unedited walkthrough videos and direct viewing coordination via our active leasing desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Doha',
      intro:
        'If you are comparing capital city properties with adjacent urban districts, navigate directly to our dedicated neighborhood portals below:',
      links: [
        {
          h3: 'Al Sadd',
          text: 'Access a high-density commercial and residential hub known for premium apartment rentals and immediate access to the Joaan Metro station lines.',
          slug: 'al-sadd',
        },
        {
          h3: 'Bin Mahmoud',
          text: 'Explore elegant residential flats and convenient expat communities positioned perfectly between old-town charms and modern corporate business hubs.',
          slug: 'bin-mahmoud',
        },
        {
          h3: 'Old Airport & Rawdat Al Matar',
          text: 'Navigate established family properties, budget-aware housing solutions, and high-footfall commercial shop spaces along the bustling Matar Qadeem strip.',
          slug: 'old-airport',
        },
        {
          h3: 'Al Wakra',
          text: 'Discover spacious independent villas, compound communities, and affordable seaside residential flats located just south of central Doha city limits.',
          slug: 'al-wakra',
        },
      ],
    },
    faqs: [
      {
        q: 'What specific neighborhoods are covered directly within this Doha area directory?',
        a: 'This primary Doha page focuses heavily on Central Doha, the commercial high-rises of Al Dafna, and the established residential streets of Al Hilal and Al Mamoura. Sibling districts like Al Sadd, Bin Mahmoud, and Old Airport are managed via their own independent, dedicated neighborhood portals.',
      },
      {
        q: 'Can Dania Real Estate support commercial business registrations and retail leasing in Doha?',
        a: 'Yes, absolutely. We manage a diverse commercial portfolio in Doha, including high-visibility roadside retail shops, corporate showrooms, corporate offices, and fully compliant industrial staff housing complexes.',
      },
      {
        q: 'Are Doha properties typically leased on a utility-inclusive or exclusive basis?',
        a: 'It depends entirely on the property type. Compact spaces, such as studios and partition rooms, are generally leased on an all-inclusive basis (covering Kahramaa water/electricity and Wi-Fi). Standard family apartments and independent villas are typically leased exclusive of utility bills, unless stated otherwise.',
      },
      {
        q: 'How can I verify the current availability and pricing of a specific residential unit in Doha?',
        a: 'Because Doha real estate moves incredibly fast, we recommend bypassing outdated classified boards. Connect directly with our leasing desk via WhatsApp, share your target property type and monthly budget, and an expert will immediately deliver a list of active vacancies.',
      },
      {
        q: 'What standard documentation is required to finalize a residential lease in Doha?',
        a: "To execute a standard legal lease agreement, you must provide a clear copy of your valid Qatar ID (QID), a copy of your passport, post-dated cheques for the lease term, and a refundable security deposit (typically equivalent to one month's rent).",
      },
      {
        q: 'Do your Doha property options provide convenient access to the Doha Metro network?',
        a: 'Yes. We understand that transit convenience is essential for both residential comfort and corporate operations. Our database highlights properties situated within comfortable walking distance or direct feeder bus (Metro Link) paths of major stations.',
      },
    ],
    finalCta: {
      h2: 'Secure Your Ideal Property for Rent in Doha Today',
      paragraph:
        "Align your home or business with Qatar's most connected urban hub. Whether you are moving into a sleek high-rise flat in Al Dafna, settling your family into a quiet compound in Al Hilal, launching a business storefront, or scaling employee accommodations, Dania Real Estate makes the process fast and stress-free. Avoid the frustration of dealing with unverified listings and uncoordinated tours. Connect with our Doha leasing desk directly via WhatsApp right now. Share your property type, target sub-area, monthly budget limits, and move-in timeline to receive a personalized portfolio of verified vacancies sent straight to your device.",
      primaryBtn: 'Chat with Our Doha Leasing Desk Now',
    },
  },

  // =====================================================================
  'al-sadd': {
    seoTitle: 'Properties for Rent in Al Sadd Doha | Dania Real Estate Qatar',
    metaDescription:
      'Find verified properties for rent in Al Sadd, Doha. Explore vertical residential apartments, executive standalone spaces, main-road commercial shops, and compact rentals near Joaan Metro Station with Dania Real Estate.',
    hero: {
      h1: 'Properties for Rent in Al Sadd, Doha',
      h3: 'Central Doha’s premier residential and corporate corridor for modern apartments, retail shops, and transit-friendly spaces.',
      paragraph:
        "As one of Doha's most vibrant and hyper-connected downtown districts, Al Sadd stands as the benchmark for premium urban living and corporate visibility in Qatar. Dania Real Estate maintains an active, expertly audited directory of premier lease vacancies throughout this high-density urban sector. Whether you are an expat professional looking for modern 1BHK/2BHK flat towers close to the Joaan and Al Sadd Metro stations, a healthcare specialist requiring close proximity to Hamad Medical City, or a business enterprise launching a flagship storefront on Al Sadd Street, our dedicated area leasing experts connect you directly with verified properties that align with your strategic spatial budgets and lifestyle routines.",
      primaryBtn: 'Explore Al Sadd Rental Categories',
      trustPoints: [],
    },
    overview: {
      h2: 'Rental Property Support in Al Sadd',
      paragraphs: [
        'Al Sadd represents the quintessential vertical heartbeat of Doha, striking a perfect balance between upscale metropolitan residential towers and a sprawling commercial shopping core. Characterized by its iconic avenues—including Suhaim Bin Hamad Street and Al Sadd Street—this high-demand neighborhood serves as a key logistical nexus for mid-to-high-level corporate managers, medical professionals, dynamic retail operations, and international corporate entities.',
        'This dedicated location-first portal is engineered to strip away the clutter of conventional real estate browsing. Rather than evaluating disparate, uncoordinated property categories from across Qatar, visitors to this page can dive straight into Al Sadd’s hyper-local inventory, filtering results by specific architectural layouts and dedicated business requirements.',
        'Navigating a market as fast-moving as Al Sadd requires genuine local insight. Dania Real Estate steps in to bridge this gap, ensuring every featured apartment block, high-street retail storefront, or corporate staff accommodation space is individually validated for structural maintenance quality, explicit utility structures, and legal tenancy clearings.',
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Al Sadd',
      intro:
        'Align your residential life or commercial market expansion with our active, pre-vetted real estate portfolios inside Al Sadd:',
      cards: [
        {
          h3: 'Apartments for Rent in Al Sadd',
          text: 'Explore modern, high-rise 1-bedroom executive flats, 2-bedroom family apartments, and fully serviced 3-bedroom residences featuring integrated cooling systems and gym access.',
          button: 'View Al Sadd Apartments',
        },
        {
          h3: 'Villas for Rent in Al Sadd',
          text: 'Secure premium compound villas or standalone independent properties offering spacious multi-car parking layouts, built for central family living.',
          button: 'View Al Sadd Villas',
        },
        {
          h3: 'Staff Accommodation in Al Sadd',
          text: 'Fully managed, highly accessible employee housing modules and executive apartments tailored for central corporate teams and medical staff.',
          button: 'View Al Sadd Staff Housing',
        },
        {
          h3: 'Shops for Rent in Al Sadd',
          text: 'Position your brand inside prime main-road commercial showrooms, high-footfall retail units, and strategic storefronts across active business streets.',
          button: 'View Al Sadd Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Al Sadd',
          text: 'Practical standalone studios and managed personal room partition options with utility-inclusive leasing, optimized for budget-conscious corporate workers.',
          button: 'View Al Sadd Compact Rentals',
        },
      ],
    },
    whyRent: {
      h2: 'Why Al Sadd Is a Strong Rental Location in Doha',
      intro:
        'Establishing your household base or corporate address inside Al Sadd guarantees structural, financial, and logistical lifestyle advantages over outer city zones.',
      cards: [
        {
          h3: 'Multi-Station Metro Integration',
          text: 'Bypass central city traffic congestion seamlessly by utilizing both the Joaan and Al Sadd Metro stations, completely connecting you to the Gold and Green rapid rail lines.',
        },
        {
          h3: 'Corporate High-Street Footfall',
          text: 'Position commercial enterprises within a highly visible retail market flanked by major banks, corporate headquarters, international hotels, and shopping complexes like Royal Plaza.',
        },
        {
          h3: 'Premium Public Infrastructure',
          text: 'Benefit from immediate adjacency to top-tier health networks including Hamad General Hospital, specialized medical clinics, prestigious academies, and everyday supermarkets.',
        },
        {
          h3: 'High-Value Real Estate Resiliency',
          text: 'Tap into a consistently high-demand market where properties maintain superior upkeep standards, professional facility management, and reliable utility infrastructure.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Al Sadd Rental Portals?',
      items: [
        'Medical Professionals & Healthcare Workers requiring rapid, stress-free access to the Hamad Medical City campus.',
        'Corporate Executives and Urban Couples seeking sleek, modern high-rise apartments equipped with dedicated underground parking facilities.',
        'Retail Entrepreneurs & Established Businesses aiming to maximize consumer traffic via premium main-road storefront exposures.',
        'Corporate Operations Managers looking to base central corporate staff or field personnel near rapid city mass transit lines.',
        'Single Expatriates evaluating private standalone studios or safely managed partition rooms with all-inclusive billing terms near downtown Doha.',
      ],
    },
    localGuidance: {
      h2: 'Local Guidance for Al Sadd Rentals',
      paragraphs: [
        "Due to Al Sadd's status as a central business and residential powerhouse, its real estate ecosystem moves at an incredibly high velocity. Premium multi-family flats, well-positioned commercial shops, and utility-inclusive compact spaces frequently convert within days of listing. Understanding structural nuances—such as whether a building features centralized chiller-inclusive terms or independent Kahramaa meters—is vital to accurately projecting your real monthly outlays.",
        'Dania Real Estate steps in to eliminate this evaluation stress. We work in close coordination with major local landlords to bring you clear, unfiltered data on pricing adjustments, structural floor plans, and parking realties.',
      ],
      callout: {
        h3: 'Looking to Secure an Checked Unit in Fast-Moving Al Sadd?',
        text: "Don't let your time get drained by outdated property listings or uncoordinated real estate calls. Send your exact monthly budget limit, required property configuration, and targeted move-in timeline directly to our active WhatsApp leasing desk right now for a personalized, verified list of active vacancies.",
      },
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Al Sadd',
      intro:
        'We demystify the high-density Al Sadd property market by providing transparent lease structures, direct communication channels, and fully verified property profiles.',
      cards: [
        {
          h3: 'Deep Hyper-Local Sector Expertise',
          text: 'We know Al Sadd’s zoning layouts inside and out, from the bustling commercial towers of Suhaim Bin Hamad to the quieter residential side streets.',
        },
        {
          h3: 'Clear Parking & Utility Audits',
          text: 'We protect our clients from unexpected city costs by verifying dedicated basement parking and clarifying chiller-free vs centralized cooling setups upfront.',
        },
        {
          h3: 'Direct Administrative Management',
          text: 'Our team handles all the heavy lifting, managing Baladiya lease registration, security deposit clearances, and legal contract sign-offs smoothly.',
        },
        {
          h3: 'Real-Time WhatsApp Video Tours',
          text: 'Save valuable time and skip unnecessary site visits. We send unedited interior walkthrough videos and crisp, current media assets straight to your phone.',
        },
      ],
    },
    process: {
      h2: 'How Our Al Sadd Rental Support Works',
      steps: [
        {
          h3: 'Submit Your Target Property Parameters',
          text: 'Inform our specialized team whether your current objective requires an urban flat, a premium retail storefront, employee quarters, or a compact studio.',
        },
        {
          h3: 'Match Transit and Infrastructure Targets',
          text: 'Identify your specific spatial priorities within Al Sadd, such as immediate walking access to the Joaan Metro loop or specific main-road road visibility.',
        },
        {
          h3: 'Lock in Budget and Move-In Windows',
          text: 'Provide your exact monthly rent ceiling, your preferred furnishing style (unfurnished vs fully furnished), and your precise lease activation date.',
        },
        {
          h3: 'Access Curated, Active Opportunities',
          text: 'Review unedited interior walkthrough videos, exact location links, and transparent pricing files delivered directly via our active WhatsApp desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Al Sadd',
      intro:
        'If you are cross-examining real estate parameters between Al Sadd and neighboring central districts, easily jump to our dedicated location portals below:',
      links: [
        {
          h3: 'Doha',
          text: 'Access our overarching capital matrix covering Central Doha, Al Dafna’s corporate skyline, Al Hilal, and Al Mamoura’s family communities.',
          slug: 'doha',
        },
        {
          h3: 'Bin Mahmoud',
          text: 'Explore a neighboring metropolitan residential hub offering premium newly built flat structures and direct connectivity to central commercial lines.',
          slug: 'bin-mahmoud',
        },
        {
          h3: 'Old Airport & Rawdat Al Matar',
          text: 'Navigate classic residential neighborhoods, family-oriented flat buildings, and highly active traditional retail storefronts along the Matar Qadeem corridor.',
          slug: 'old-airport',
        },
        {
          h3: 'Al Aziziya & Abu Hamour',
          text: 'Dive into spacious family compound villas, standalone suburban homes, and highly accessible apartment buildings situated close to Salwa Road.',
          slug: 'al-aziziya',
        },
      ],
    },
    faqs: [
      {
        q: 'Why is Al Sadd considered one of Doha’s most highly requested residential rental locations?',
        a: 'Al Sadd delivers unparalleled urban convenience, placing residents directly alongside two prominent Doha Metro stations (Al Sadd and Joaan), core highway corridors, major retail malls like Royal Plaza, top-tier international schools, and the expansive Hamad Medical City campus.',
      },
      {
        q: 'Is dedicated car parking typically included with residential apartment towers in Al Sadd?',
        a: 'Given the high density of Al Sadd, street parking can be competitive. However, the majority of modern mid-to-high-rise residential apartment blocks we manage feature dedicated, secure basement parking for tenants. Our leasing agents will explicitly confirm parking allocations prior to lease finalization.',
      },
      {
        q: 'What is the core structural difference between properties listed here and those on the parent Doha directory?',
        a: 'This page is a hyper-focused location portal isolating Al Sadd’s specific vertical residential blocks and corporate retail strips. The global Doha directory serves as a broader regional hub managing alternative urban sectors like Al Dafna, Al Hilal, and Al Mamoura.',
      },
      {
        q: 'Can your team assist retail business owners with securing commercial properties along Al Sadd Street?',
        a: 'Yes, absolutely. Dania Real Estate maintains close relationships with prominent local property owners, allowing us to source high-visibility main-road commercial showrooms, retail storefronts, and premium office levels across Al Sadd’s main business tracks.',
      },
      {
        q: 'Do Al Sadd apartment rentals include central AC cooling fees within the standard monthly lease?',
        a: 'Air conditioning configurations vary across Al Sadd. Some modern towers feature central chiller-inclusive contracts where cooling fees are bundled into your rent, while older residential complexes utilize standard split units mapped to independent Kahramaa billing accounts. We provide clear breakdown metrics for every listing.',
      },
      {
        q: 'How can I immediately view available properties in Al Sadd without wasting time on outdated classified ads?',
        a: 'Simply connect with the Dania Real Estate specialized area team via WhatsApp. Provide your target property layout, monthly budget limits, and required move-in window, and an advisor will instantly forward unedited walkthrough videos of verified active vacancies.',
      },
    ],
    finalCta: {
      h2: 'Capitalize on Al Sadd’s Dynamic Real Estate Market Today',
      paragraph:
        'Lock in an address that positions your family or business inside central Doha’s most connected, fast-moving neighborhood. From sleek executive high-rise flats near the Joaan Metro line to flagship main-road commercial showrooms and budget-friendly utility-inclusive studios, Dania Real Estate takes the stress out of your property search. Skip the frustration of dealing with unverified online postings and uncoordinated tours. Connect with our dedicated Al Sadd area leasing desk via WhatsApp right now. Share your targeted property type, monthly financial parameters, and move-in timeline to receive a personalized, verified portfolio of active vacancies sent straight to your device.',
      primaryBtn: 'Chat with Our Al Sadd Leasing Desk Now',
    },
  },

  // =====================================================================
  'bin-mahmoud': {
    seoTitle: 'Properties for Rent in Bin Mahmoud Doha | Dania Real Estate Qatar',
    metaDescription:
      'Explore verified properties for rent in Bin Mahmoud, Doha with Dania Real Estate. Find executive apartments, commercial shops, staff units, and compact studios near the Bin Mahmoud Metro Gold Line.',
    hero: {
      h1: 'Properties for Rent in Bin Mahmoud, Doha',
      h3: 'Central Doha’s most accessible hub for mid-rise family apartments, retail storefronts, and budget-friendly executive rentals.',
      paragraph:
        "Positioned dynamically between Doha's historical business center and the expanding modern capital core, Bin Mahmoud remains a top-tier destination for balanced urban leasing. Dania Real Estate provides an expertly curated, continuously updated inventory of verified lease options across this highly strategic district. Whether you are an expat professional seeking a modern 1BHK/2BHK flat directly on the Doha Metro Gold Line network, a medical specialist requiring immediate access to the Hamad Medical Corporation complex, or a retail brand launching a storefront near the B-Ring and C-Ring road links, our local leasing team coordinates directly with major landlords to secure optimal terms for your lifestyle or commercial operations.",
      primaryBtn: 'Explore Bin Mahmoud Rental Categories',
      trustPoints: [
        'Immediate walking access to the Bin Mahmoud Metro Gold Line Station.',
        'Diverse building choices, balancing newly developed executive complexes with classic budget flatted structures.',
        'Verified rental rates with fully compliant, municipality-registered contract processing.',
      ],
    },
    overview: {
      h2: 'Rental Property Support in Bin Mahmoud',
      paragraphs: [
        "Bin Mahmoud represents one of Central Doha's most mature and practical urban sub-markets. Characterized by its unique mixture of established residential mid-rises, thriving multi-national dining corridors, and essential hypermarkets, the neighborhood provides a highly functional environment. It is a sector where commuting friction is at an absolute minimum, allowing residents to navigate between old-town commercial markets and modern business plazas effortlessly.",
        "This localized digital hub is engineered to prioritize location-first discovery. Instead of wasting hours sorting through broad, mismatched property sheets across unrelated cities, users can utilize this directory to isolate active vacancies exclusively inside Bin Mahmoud's boundaries, sorting by precise structural requirements and monthly target budgets.",
        "The local rental market here moves quickly due to the district's broad demographic appeal and accessible price points. Dania Real Estate safeguards your lease experience by filtering out misleading listings. We perform hands-on structural checkups, verify available building parking allotments, and clarify utility frameworks so you can lease with absolute peace of mind.",
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Bin Mahmoud',
      intro:
        'Match your household living requirements or corporate real estate expansions with our active, pre-vetted property divisions inside Bin Mahmoud:',
      cards: [
        {
          h3: 'Apartments for Rent in Bin Mahmoud',
          text: 'Discover well-proportioned 1-bedroom executive bachelor flats, 2-bedroom family units, and spacious 3-bedroom residences combining competitive pricing with modern floor plans.',
          button: 'View Bin Mahmoud Apartments',
        },
        {
          h3: 'Villas for Rent in Bin Mahmoud',
          text: 'Access rare centrally located compound properties and standalone family residences offering private configurations and immediate connectivity to urban amenities.',
          button: 'View Bin Mahmoud Villas',
        },
        {
          h3: 'Staff Accommodation in Bin Mahmoud',
          text: 'Secure strategically positioned employee housing modules, shared rooms, and corporate flats tailored for medical support groups and central service personnel.',
          button: 'View Bin Mahmoud Staff Housing',
        },
        {
          h3: 'Shops for Rent in Bin Mahmoud',
          text: 'Establish your consumer business within high-visibility roadside retail spaces, street-level retail showrooms, and commercial storefronts experiencing continuous foot traffic.',
          button: 'View Bin Mahmoud Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Bin Mahmoud',
          text: 'Explore highly economical standalone studio apartments, single 1BHKs, and securely managed partition rooms featuring comprehensive utility-inclusive leasing.',
          button: 'View Bin Mahmoud Compact Rentals',
        },
      ],
    },
    whyRent: {
      h2: 'Why Bin Mahmoud Is a Popular Rental Location in Doha',
      intro:
        'Leasing a residential home or commercial storefront inside Bin Mahmoud delivers immense logistical, monetary, and lifestyle advantages over outer municipal sectors.',
      cards: [
        {
          h3: 'Golden Metro Transit Access',
          text: 'Enjoy rapid cross-city transit via the dedicated Bin Mahmoud Metro Station, linking you seamlessly across the Gold Mass Rail Network and central interchange junctions.',
        },
        {
          h3: 'Superior Highway Intersections',
          text: 'Navigate driving routes efficiently with instant access points feeding onto the B-Ring Road, C-Ring Road, and the direct Al Rayyan Road expressway corridors.',
        },
        {
          h3: 'Ultimate Community Proximity',
          text: 'Live steps away from major clinical institutions like Rumailah Hospital, massive retail networks including LuLu Hypermarket, global schools, and a diverse multicultural dining scene.',
        },
        {
          h3: 'High-Value Cost Efficiencies',
          text: 'Secure spacious square-footage layouts and upgraded modern residences at monthly leasing rates that remain highly competitive compared to neighboring high-rise districts.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Bin Mahmoud Rental Indices?',
      items: [
        'Healthcare and Medical Professionals seeking a short, stress-free daily commute to the adjacent Hamad Medical City campus.',
        'Expat Families and Urban Couples searching for practical apartment layouts that maximize square footage without inflating monthly lease costs.',
        'Single Professionals & Executive Personnel evaluating clean standalone studios or managed partition rooms with bundled utility billing near central transit tracks.',
        'Corporate Operations Managers looking to house essential corporate personnel or urban logistics teams inside a centralized, highly connected hub.',
        'Retail Brand Operators and Entrepreneurs wanting to maximize exposure via high-footfall, roadside commercial shops and storefront spaces.',
      ],
    },
    localGuidance: {
      h2: 'Local Guidance for Bin Mahmoud Rentals',
      paragraphs: [
        'The real estate micro-market within Bin Mahmoud operates at an extremely fast pace. Because it represents a highly accessible cost-to-location sweet spot in Central Doha, well-maintained mid-rise apartments and utility-inclusive studios rarely stay on the market long. When exploring Bin Mahmoud, it is essential to pay attention to structural variables—such as whether an older building relies on traditional gas cylinders or modern central gas connections, and whether a dedicated basement parking slot is assigned legally to your lease unit.',
        'Dania Real Estate takes the complexity out of this selection process. We maintain clear, face-to-face communication channels with the area’s primary landlords, providing you with unfiltered data on building ages, historical maintenance responses, parking configurations, and contract flexibilities.',
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Bin Mahmoud',
      intro:
        'We simplify your urban property hunt by combining transparent lease mechanics with real-time on-the-ground neighborhood data.',
      cards: [
        {
          h3: 'Specialized District Mapping',
          text: 'Our agents possess comprehensive knowledge of Bin Mahmoud’s zoning, easily identifying which residential blocks offer the quietest environments vs the best transit access.',
        },
        {
          h3: 'Honest Parking & Facility Audits',
          text: 'We protect our tenants by conducting clear pre-lease vehicle parking audits, isolating properties that feature dedicated basement slots over competitive street parking.',
        },
        {
          h3: 'Comprehensive Legal Registration',
          text: 'We manage the entire municipal administrative workflow, executing compliant Doha Baladiya contracts and clear security deposit terms.',
        },
        {
          h3: 'Unedited WhatsApp Media Support',
          text: 'Eliminate blind property viewings. Our team delivers accurate, current interior walk-through videos and clear floor plan details straight to your mobile device.',
        },
      ],
    },
    process: {
      h2: 'How Our Bin Mahmoud Rental Support Works',
      steps: [
        {
          h3: 'Outline Your Real Estate Target',
          text: 'Notify our localized asset team whether your current requirement requires an executive family flat, a standalone shopfront, corporate rooms, or a compact studio.',
        },
        {
          h3: 'Pinpoint Proximity Priorities',
          text: 'State your target location preferences within Bin Mahmoud, such as direct walking distance to the Metro Gold Line or proximity to specific hypermarkets.',
        },
        {
          h3: 'Establish Budget & Leasing Windows',
          text: 'Provide your target monthly rent ceilings, preferred furnishing state (unfurnished vs fully furnished), and your precise move-in target date.',
        },
        {
          h3: 'Review Vetted, Active Inventory Options',
          text: 'Evaluate unedited property video assets and precise location map pins sent directly from our active WhatsApp customer desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Bin Mahmoud',
      intro:
        'If you are cross-examining rental parameters between Bin Mahmoud and alternative central or suburban districts, navigate directly to our dedicated local portals below:',
      links: [
        {
          h3: 'Doha',
          text: 'Navigate our overarching capital city directory covering Central Doha, Al Dafna’s corporate skyline, Al Hilal, and Al Mamoura’s family communities.',
          slug: 'doha',
        },
        {
          h3: 'Al Sadd',
          text: 'Access central Doha’s high-density urban core, famous for upscale apartment towers, international hotels, and multi-station metro rail connections.',
          slug: 'al-sadd',
        },
        {
          h3: 'Old Airport & Rawdat Al Matar',
          text: 'Explore classic residential neighborhoods, family-focused flat complexes, and highly active traditional storefronts along the busy Matar Qadeem strip.',
          slug: 'old-airport',
        },
        {
          h3: 'Al Aziziya & Abu Hamour',
          text: 'Discover expansive family compound villas, standalone suburban homes, and accessible apartment layouts positioned close to Salwa Road.',
          slug: 'al-aziziya',
        },
      ],
    },
    faqs: [
      {
        q: 'What makes Bin Mahmoud a preferred rental area compared to neighboring Al Sadd?',
        a: 'While Al Sadd features high-density high-rise towers and premium malls, Bin Mahmoud is highly valued for its balanced mid-rise complexes, exceptionally practical access to the Metro Gold Line, and slightly more competitive monthly rental rates for equivalent square footage.',
      },
      {
        q: 'How do I verify vehicle parking arrangements when renting an apartment in Bin Mahmoud?',
        a: 'Street parking can be busy during peak evening hours in central districts. However, the majority of modern executive residential buildings we manage include dedicated basement parking spaces for tenants. Our leasing agents explicitly state the parking infrastructure for every listing before you commit.',
      },
      {
        q: 'Are utility bills typically included in the monthly rent for properties in Bin Mahmoud?',
        a: 'For standard 1-bedroom, 2-bedroom, and 3-bedroom family apartments, utility costs (Kahramaa water/electricity) are usually billed separately based on independent consumption meters. Conversely, compact options like studios and partition rooms are generally leased on an all-inclusive basis, with utilities and Wi-Fi covered in the flat rate.',
      },
      {
        q: 'Can your team help us secure commercial properties and retail shops in Bin Mahmoud?',
        a: 'Yes, absolutely. Dania Real Estate maintains an active commercial portfolio in Bin Mahmoud, including street-level retail showrooms, main-road storefronts, and commercial spaces suited for dining, retail, or office use.',
      },
      {
        q: 'What is the proximity of Bin Mahmoud residential areas to local medical networks?',
        a: 'Bin Mahmoud is exceptionally well-placed for healthcare accessibility, sitting directly adjacent to the expansive Hamad Medical Corporation (HMC) campus, Rumailah Hospital, and numerous localized specialized clinics.',
      },
      {
        q: 'How can I quickly view active property vacancies in Bin Mahmoud today?',
        a: 'Simply click through to our active WhatsApp leasing desk. Share your target property type, monthly financial limit, and move-in timeline, and an area specialist will instantly forward unedited walk-through videos of verified vacancies.',
      },
    ],
    finalCta: {
      h2: 'Seamlessly Align Your Home or Business in Bin Mahmoud Today',
      paragraph:
        'Lock in a central address that balances historical connectivity with modern urban convenience. Whether you are looking for an executive mid-rise apartment steps from the Gold Line Metro station, a high-footfall roadside commercial shopfront, or an affordable, all-inclusive compact studio, Dania Real Estate removes the friction from your search. Stop wasting precious time browsing outdated classified listings or dealing with uncoordinated real estate calls. Connect with our dedicated Bin Mahmoud area leasing desk via WhatsApp right now. Share your preferred property layout, target monthly budget, and move-in timeline to receive a personalized portfolio of verified vacancies sent straight to your device.',
      primaryBtn: 'Chat with Our Bin Mahmoud Leasing Desk Now',
    },
  },

  // =====================================================================
  'al-wakra': {
    seoTitle: 'Properties for Rent in Al Wakra Qatar | Dania Real Estate',
    metaDescription:
      'Find verified properties for rent in Al Wakra, Qatar. Explore spacious family villas, affordable residential apartments, staff housing, and retail shops near Al Wakra Metro Red Line with Dania Real Estate.',
    hero: {
      h1: 'Properties for Rent in Al Wakra, Qatar',
      h3: "Qatar's premier coastal municipality for spacious family compounds, budget-friendly apartments, and highly accessible commercial spaces.",
      paragraph:
        "Moving away from the high-density friction of central downtown Doha doesn't mean compromising on lifestyle, connectivity, or premium infrastructure. As Qatar’s most prominent southern coastal gateway, Al Wakra delivers a self-sustained community environment perfect for expanding households, corporate teams, and thriving retail enterprises. Dania Real Estate hosts an active, thoroughly audited database of verified lease options throughout this booming municipality. Whether your objective is a sprawling 3BHK/4BHK compound villa near the scenic Souq Al Wakra waterfront, a modern low-rise flat close to the Doha Metro Red Line station, or commercial storefronts near the active Al Wakra Main Road, our localized experts guide you straight to verified inventories tailored to your space requirements and budget structures.",
      primaryBtn: 'Explore Al Wakra Rental Categories',
      trustPoints: [
        'Rapid, direct rail access to central Doha and Hamad International Airport via the Al Wakra Metro Red Line.',
        'Highly competitive rental price points, delivering significantly more square footage per QAR compared to central capital sectors.',
        'Comprehensive pre-screening of managed residential compounds and standalone properties for absolute structural safety.',
      ],
    },
    overview: {
      h2: 'Rental Property Support in Al Wakra',
      paragraphs: [
        'Al Wakra has transformed from a historic pearl-fishing settlement into a massive, thriving metropolitan hub that functions as a fully independent ecosystem. Featuring top-tier public works, iconic sporting landmarks like Al Janoub Stadium, and a beautifully preserved coastal culture, it has become the preferred residential choice for families and corporate workforces seeking clean, peaceful, and well-organized environments away from central city congestion.',
        "This dedicated area portal is structurally engineered to prioritize location-first discovery. Instead of dealing with mixed, uncoordinated search results spanning unrelated municipal zones, users can instantly lock onto Al Wakra's specific real estate grid, effortlessly exploring various property layouts, compound estates, and commercial avenues.",
        'Navigating a rapidly growing suburban city like Al Wakra requires reliable on-the-ground intelligence. Dania Real Estate acts as your trusted partner, filtering out outdated listings to ensure every featured apartment layout, family compound, and retail showroom is verified for maintenance standards, parking availability, and municipal leasing compliance.',
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Al Wakra',
      intro:
        'Align your lifestyle requirements or regional business expansion plans with our active, pre-vetted property categories across Al Wakra:',
      cards: [
        {
          h3: 'Apartments for Rent in Al Wakra',
          text: 'Discover spacious 1-bedroom executive flats, affordable 2-bedroom family units, and modern 3-bedroom apartments combining generous layouts with competitive pricing.',
          button: 'View Al Wakra Apartments',
        },
        {
          h3: 'Villas for Rent in Al Wakra',
          text: 'Secure premium standalone family villas or residential compound properties featuring secure private yards, swimming pools, and dedicated multi-car garages.',
          button: 'View Al Wakra Villas',
        },
        {
          h3: 'Staff Accommodation in Al Wakra',
          text: 'Access highly organized, scalable worker housing blocks, corporate team accommodations, and executive lodging close to major southern logistics routes.',
          button: 'View Al Wakra Staff Housing',
        },
        {
          h3: 'Shops for Rent in Al Wakra',
          text: 'Position your retail or corporate brand within high-footfall commercial showrooms, main-road storefronts, and strategic retail spaces across booming local markets.',
          button: 'View Al Wakra Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Al Wakra',
          text: 'Explore budget-friendly standalone studios, single 1BHKs, and securely managed room partition spaces featuring straightforward, utility-inclusive leasing agreements.',
          button: 'View Al Wakra Compact Rentals',
        },
      ],
    },
    whyRent: {
      h2: 'Why Al Wakra Is a Strong Rental Location in Qatar',
      intro:
        'Basing your household or expanding business operations inside Al Wakra provides clear financial, logistical, and community advantages.',
      cards: [
        {
          h3: 'Peaceful Coastal Lifestyle',
          text: 'Enjoy a refreshing, slower-paced alternative to dense downtown environments, with immediate access to family-friendly public beaches, seaside parks, and Souq Al Wakra.',
        },
        {
          h3: 'Rapid Transit Connectivity',
          text: 'Commute to central Doha or Hamad International Airport effortlessly using the dedicated Al Wakra Metro Station (Red Line) and the modern G-Ring/Mesaieed highway networks.',
        },
        {
          h3: 'Superior Square-Foot Value',
          text: 'Maximize your real estate budget by securing significantly larger apartment floor plans, larger rooms, and private villa yards at rates that remain highly competitive.',
        },
        {
          h3: 'Self-Sustained Civic Services',
          text: 'Live completely independent of central Doha with immediate access to world-class medical infrastructure at Al Wakra Hospital (HMC), hypermarkets, and international schools.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Al Wakra Rental Portals?',
      items: [
        'Expat Families & Large Households seeking spacious, secure compound villas or multi-bedroom flats with dedicated play areas.',
        'Healthcare Professionals & Medical Support Teams requiring quick, reliable daily access to the expansive Al Wakra Hospital campus.',
        'Aviation, Logistics, and Corporate Personnel wanting a quick, direct commute to Hamad International Airport and the southern industrial sectors.',
        'Retail Entrepreneurs & Established Local Brands looking to capture high-value market share within a rapidly growing municipal population.',
        'Budget-Minded Single Professionals evaluating safe, clean standalone studios or managed partition rooms with hassle-free all-inclusive utility setups.',
      ],
    },
    localGuidance: {
      h2: 'Local Guidance for Al Wakra Rentals',
      paragraphs: [
        'The real estate dynamics of Al Wakra move quickly as more families and corporate entities discover its lifestyle and cost advantages. While the area offers generous space, properties vary significantly between classic standalone family homes, modern apartment blocks, and expansive compound master developments like Ezdan Villages. Navigating these options requires an accurate understanding of local leasing styles—such as whether a property handles utility connections independently through Kahramaa meters or provides centralized cooling configurations.',
        "Dania Real Estate removes the guesswork from your suburban property search. We maintain close, direct relationships with Al Wakra's leading property owners and compound management teams, providing you with transparent info on precise maintenance responsibilities, amenity access fees, and community guidelines.",
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Al Wakra',
      intro:
        'We simplify the Al Wakra property market by matching transparent lease structures with authentic, on-the-ground local expertise.',
      cards: [
        {
          h3: 'Deep Municipal Specialization',
          text: 'We know Al Wakra’s unique residential layout inside out, easily directing you to the quietest family compound streets or the most strategic transit-friendly blocks.',
        },
        {
          h3: 'Transparent Amenity Audits',
          text: 'We protect our clients by verifying compound gym access, pool rules, dedicated car parking allocations, and clear utility billing structures upfront.',
        },
        {
          h3: 'Stress-Free Lease Registration',
          text: 'Our localized admin team handles the entire workflow smoothly, managing compliant municipality registrations, contract generation, and security deposit clearings.',
        },
        {
          h3: 'Unedited WhatsApp Video Tours',
          text: 'Skip long, unnecessary travel times. We deliver current, unedited interior walk-through videos and clear floor plan details straight to your mobile device.',
        },
      ],
    },
    process: {
      h2: 'How Our Al Wakra Rental Support Works',
      steps: [
        {
          h3: 'Define Your Property Blueprint',
          text: 'Let our dedicated asset team know whether your goal requires a large family compound villa, a modern flat, worker housing, or a compact studio.',
        },
        {
          h3: 'Map Your Location & Transit Targets',
          text: 'Share your specific neighborhood priorities within Al Wakra, such as direct walking distance to the Red Line Metro or quick access to Al Wakra Hospital.',
        },
        {
          h3: 'Confirm Budget & Leasing Windows',
          text: 'Provide your exact monthly rent ceiling, preferred furnishing style (unfurnished vs fully furnished), and your targeted move-in date.',
        },
        {
          h3: 'Review Curated Active Portfolios',
          text: 'Evaluate verified property photos, unedited walk-through video assets, and precise location maps sent straight from our active WhatsApp customer desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Al Wakra',
      intro:
        'If you are comparing real estate features between Al Wakra and alternative central or residential districts across Qatar, easily jump to our local portals below:',
      links: [
        {
          h3: 'Doha',
          text: 'Explore our global capital city index covering Central Doha, Al Dafna’s corporate high-rises, Al Hilal, and Al Mamoura’s family sub-sectors.',
          slug: 'doha',
        },
        {
          h3: 'Old Airport & Rawdat Al Matar',
          text: 'Navigate classic central neighborhoods, family-focused flat developments, and highly active traditional retail spaces along the Matar Qadeem corridor.',
          slug: 'old-airport',
        },
        {
          h3: 'Al Aziziya & Abu Hamour',
          text: 'Discover expansive family compound villas, standalone suburban homes, and highly accessible apartment buildings situated close to Salwa Road.',
          slug: 'al-aziziya',
        },
        {
          h3: 'Al Kharaitiyat',
          text: "Jump to Qatar's booming northern residential district, offering excellent family-centric villa living and direct accessibility to the Al Shamal Road corridor.",
          slug: 'al-kharaitiyat',
        },
      ],
    },
    faqs: [
      {
        q: 'Why are families increasingly choosing to rent properties in Al Wakra over central Doha?',
        a: 'Al Wakra offers an exceptional quality of life for families, combining a relaxed coastal setting and seaside parks with generous property sizes. Tenants secure significantly more square footage and private yard space for their monthly budget compared to dense downtown Doha sectors.',
      },
      {
        q: 'How easy is it to commute to downtown Doha from an apartment or villa in Al Wakra?',
        a: 'Commuting is remarkably efficient. The Al Wakra Metro Station sits on the Doha Metro Red Line, providing direct, high-speed rail access to central hubs like Msheireb, West Bay, and Hamad International Airport. Major expressways like the G-Ring Road also ensure driving routes remain smooth.',
      },
      {
        q: 'What is the core difference between the Al Wakra area page and the global Doha directory?',
        a: "This page functions as a specialized municipal portal focused exclusively on Al Wakra's suburban coastal real estate market. The global Doha directory serves as a wider regional hub managing central urban neighborhoods such as Al Dafna, Al Hilal, and Al Mamoura.",
      },
      {
        q: 'What should I look out for regarding utility billing when renting in Al Wakra?',
        a: 'In standalone villas and independent residential apartments, water and electricity are typically tracked via individual Kahramaa meters and billed separately based on actual use. Conversely, compact choices like managed studios or partition rooms often feature all-inclusive pricing where utilities are bundled into the base rent.',
      },
      {
        q: 'Do residential compound properties in Al Wakra typically charge extra for gym and pool access?',
        a: 'In most established family compound communities and large residential clusters across Al Wakra, access to shared lifestyle facilities—including gyms, swimming pools, and children\'s play zones—is fully covered under the standard tenancy contract. Our team explicitly confirms these details for every listing.',
      },
      {
        q: 'How can I instantly access available, verified property listings in Al Wakra today?',
        a: 'Simply click through to our active WhatsApp leasing desk. Share your required property configuration, monthly budget limit, and target move-in timeline, and an area specialist will instantly forward unedited walk-through videos of verified active vacancies.',
      },
    ],
    finalCta: {
      h2: 'Secure Your Perfect Rental Address in Al Wakra Today',
      paragraph:
        "Experience the ideal balance of coastal tranquility, modern infrastructure, and excellent value for money in one of Qatar's fastest-growing family communities. From expansive compound villas near the historical Souq Al Wakra waterfront to modern apartments steps from the Red Line Metro station and strategic commercial storefronts, Dania Real Estate takes the stress out of your property search. Stop losing time dealing with unverified classified postings or unresponsive real estate listings. Connect with our dedicated Al Wakra area leasing desk via WhatsApp right now. Share your preferred property layout, target monthly budget, and move-in timeline to receive a personalized portfolio of verified active vacancies delivered straight to your device.",
      primaryBtn: 'Chat with Our Al Wakra Leasing Desk Now',
    },
  },

  // =====================================================================
  'al-aziziya': {
    seoTitle: 'Properties for Rent in Al Aziziya & Abu Hamour | Dania Real Estate',
    metaDescription:
      'Find verified properties for rent in Al Aziziya and Abu Hamour. Explore premium family villas, residential apartments, staff units, and Salwa Road commercial shops with Dania Real Estate.',
    hero: {
      h1: 'Properties for Rent in Al Aziziya and Abu Hamour',
      h3: 'Central-Western Doha’s premier residential corridor for family compound villas, affordable low-rise apartments, and high-visibility retail spaces.',
      paragraph:
        "Strategically positioned along Qatar’s primary commercial arteries, the combined districts of Al Aziziya and Abu Hamour offer an unparalleled balance of residential peace and commercial power. Known widely as the educational and recreational heart of Doha's community landscape, this sector is highly favored by families prioritizing school proximity, and retail businesses aiming to leverage the immense traffic of Salwa Road. Dania Real Estate provides an expertly curated portfolio of verified rental listings across these high-demand neighborhoods. Whether you are looking for a spacious standalone villa near the pristine grounds of Aspire Zone, a budget-friendly flat within walking distance of the Al Aziziyah Gold Line Metro Station, or a premium commercial storefront near Dar Al Salam Mall, our localized team delivers verified options aligned with your specific space requirements and financial targets.",
      primaryBtn: 'Explore Al Aziziya Rental Categories',
      trustPoints: [
        'Immediate proximity to Doha’s elite academic institutions and major international school clusters.',
        'Direct transport linkages via Salwa Road, Al Waab Street, and the F-Ring Road network.',
        "100% verified listings ensuring full legal compliance with Qatar's municipality registration laws.",
      ],
    },
    overview: {
      h2: 'Rental Property Support in Al Aziziya and Abu Hamour',
      paragraphs: [
        'Together, Al Aziziya and Abu Hamour form a vital, self-contained residential and business spine in Doha. While Al Aziziya shines as a retail and leisure destination—driven by the iconic Villaggio Mall and Aspire Park—Abu Hamour functions as the premier educational capital of the city, hosting an exceptional concentration of international academies, clinics, and popular community shopping centers.',
        'This dedicated location platform eliminates search confusion by allowing users to focus entirely on the Al Aziziya and Abu Hamour micro-market. Rather than scrolling through mixed listings across distant municipal zones, tenants can immediately filter their hunt by specific property configurations, compound amenities, or retail exposure levels.',
        'Due to the massive appeal of these areas to growing families and regional businesses, premium properties can move quickly. Dania Real Estate protects your investment and time by filtering the local market. We perform hands-on structural verifications, assess peak school-hour traffic patterns, and cross-check compound facility rules so your family or enterprise can settle down with absolute confidence.',
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Al Aziziya and Abu Hamour',
      intro:
        'Match your personal living requirements or corporate real estate expansions with our active, pre-vetted property divisions across these premier districts:',
      cards: [
        {
          h3: 'Apartments for Rent in Al Aziziya and Abu Hamour',
          text: 'Browse highly practical 1BHK, 2BHK, and 3BHK low-rise apartment layouts, offering competitive pricing, family-friendly configurations, and excellent community access.',
          button: 'View Local Apartments',
        },
        {
          h3: 'Villas for Rent in Al Aziziya and Abu Hamour',
          text: 'Secure spacious standalone villas or premium residential compound properties featuring private yards, swimming pools, round-the-clock security, and immediate access to top schools.',
          button: 'View Local Villas',
        },
        {
          h3: 'Staff Accommodation in Al Aziziya and Abu Hamour',
          text: 'Access strategically positioned corporate housing, shared room modules, and compliant employee flats with rapid transit links to Salwa Road and industrial corridors.',
          button: 'View Staff Housing',
        },
        {
          h3: 'Shops for Rent in Al Aziziya and Abu Hamour',
          text: 'Establish your consumer business within high-visibility commercial showrooms, main-road storefronts, and retail spaces enjoying constant local foot traffic.',
          button: 'View Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Al Aziziya and Abu Hamour',
          text: 'Explore highly economical standalone studio apartments, single executive rooms, and managed partition spaces featuring all-inclusive utility contracts.',
          button: 'View Compact Rentals',
        },
      ],
    },
    whyRent: {
      h2: 'Why Al Aziziya and Abu Hamour Are Practical Rental Locations',
      intro:
        'Choosing a rental property within the Al Aziziya or Abu Hamour perimeter provides immense logistical, educational, and financial rewards over central downtown sectors.',
      cards: [
        {
          h3: 'Doha’s Ultimate School District',
          text: 'Minimize morning transit stress. Abu Hamour hosts the city’s highest concentration of premium international schools, making daily drop-offs smooth and efficient for families.',
        },
        {
          h3: 'World-Class Recreation & Shopping',
          text: 'Enjoy unmatched lifestyle conveniences with immediate access to Villaggio Mall, Aspire Zone sports complexes, pristine walking tracks, and Dar Al Salam Mall.',
        },
        {
          h3: 'Unmatched Arterial Highways',
          text: 'Drive effortlessly across Qatar with direct entry points feeding straight onto Salwa Road, Al Waab Street, the F-Ring Road, and the rapid Doha Expressway corridors.',
        },
        {
          h3: 'Superior Space-to-Cost Ratios',
          text: 'Secure expansive multi-bedroom villa compounds and large apartment layouts at monthly rates that offer excellent value compared to dense vertical capital districts.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Al Aziziya & Abu Hamour Rental Directories?',
      items: [
        'Expat Families with School-Aged Children who want to live within minutes of major international schools and family-focused parks.',
        'Athletic Professionals & Outdoor Enthusiasts seeking high-quality residential properties close to the extensive facilities of Aspire Zone.',
        'Retail Brand Managers & Business Owners looking to capitalize on high-exposure commercial shopfronts near Salwa Road’s busy commercial strip.',
        'Corporate Operations Planners aiming to secure legally compliant, well-connected staff housing units with fast access to major transit links.',
        'Budget-Minded Executive Professionals evaluating clean, standalone studios or managed partition spaces with straightforward, all-inclusive utility billing.',
      ],
    },
    localGuidance: {
      h2: 'Local Guidance for Al Aziziya and Abu Hamour Rentals',
      paragraphs: [
        'The real estate market in the Al Aziziya and Abu Hamour corridor is highly dynamic, driven by steady demand from families and commercial operators alike. Because these areas offer a wide range of property types—from modern corporate compounds to standalone villas and subdivided residential units—it is vital to understand local leasing styles. For example, verifying whether a villa apartment features independent Kahramaa tracking or checking assigned parking allocations can make a massive difference in your daily comfort.',
        'Dania Real Estate takes the stress out of this evaluation. We maintain transparent relationships with the area’s primary landlords and asset developers, giving you unedited facts on building histories, maintenance track records, municipal approvals, and contract flexibilities.',
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Al Aziziya and Abu Hamour',
      intro:
        'We streamline your suburban property search by combining honest lease management with real-time, on-the-ground neighborhood data.',
      cards: [
        {
          h3: 'Deep Community Insight',
          text: 'Our localized agents understand the distinct block variations, easily guiding you to the quietest family streets or the most lucrative commercial spots.',
        },
        {
          h3: 'Rigorous Property Inspections',
          text: 'We protect your peace of mind by performing deep property audits, checking utility lines, air conditioning systems, and assigned parking spaces upfront.',
        },
        {
          h3: 'Compliant Legal Frameworks',
          text: 'Our legal compliance team handles the entire administrative process, ensuring properly registered Doha Baladiya contracts and fully transparent security deposit terms.',
        },
        {
          h3: 'Real-Time WhatsApp Media Walkthroughs',
          text: 'Skip unnecessary viewing trips. We deliver current, unedited interior walk-through videos and accurate floor plans directly to your mobile phone.',
        },
      ],
    },
    process: {
      h2: 'How Our Al Aziziya & Abu Hamour Rental Support Works',
      steps: [
        {
          h3: 'Share Your Property Blueprint',
          text: 'Let our dedicated asset team know whether your goal requires a spacious compound villa, a low-rise family apartment, commercial retail space, or a budget studio.',
        },
        {
          h3: 'Detail Your Proximity & Transit Needs',
          text: 'Define your location preferences across Al Aziziya or Abu Hamour, such as walking distance to the Metro Gold Line or immediate proximity to specific international schools.',
        },
        {
          h3: 'Confirm Budget & Leasing Windows',
          text: 'Outline your target monthly rental limits, preferred furnishing state (unfurnished vs fully furnished), and your precise move-in target date.',
        },
        {
          h3: 'Evaluate Vetted Active Vacancies',
          text: 'Review verified property photo portfolios, unedited walk-through video assets, and exact location map pins sent directly from our active WhatsApp customer desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Al Aziziya and Abu Hamour',
      intro:
        'If you are cross-examining real estate variables between this western corridor and alternative central or suburban districts, navigate directly to our dedicated local portals below:',
      links: [
        {
          h3: 'Doha',
          text: 'Navigate our overarching capital city directory covering Central Doha, Al Dafna’s corporate skyline, Al Hilal, and Al Mamoura’s family communities.',
          slug: 'doha',
        },
        {
          h3: 'Al Sadd',
          text: 'Access central Doha’s high-density urban core, famous for upscale apartment towers, international hotels, and multi-station metro rail connections.',
          slug: 'al-sadd',
        },
        {
          h3: 'Old Airport & Rawdat Al Matar',
          text: 'Explore classic residential neighborhoods, family-focused flat complexes, and highly active traditional storefronts along the busy Matar Qadeem strip.',
          slug: 'old-airport',
        },
        {
          h3: 'Al Wakra',
          text: "Jump to Qatar's booming southern coastal city, offering excellent family compound living, public beaches, and direct access to the Metro Red Line.",
          slug: 'al-wakra',
        },
      ],
    },
    faqs: [
      {
        q: 'Why are Al Aziziya and Abu Hamour considered ideal areas for expat family rentals?',
        a: 'These districts combine peaceful, suburban-style residential living with outstanding urban convenience. Abu Hamour features Doha’s largest concentration of international schools, while Al Aziziya offers immediate access to Aspire Zone and Villaggio Mall, greatly reducing daily school commutes and shopping travel times.',
      },
      {
        q: 'What kinds of villa properties are available for rent in these areas?',
        a: 'The market features an excellent mix of standalone family villas and secure residential compounds. Compound options typically include 24/7 security, shared swimming pools, gym access, and dedicated children’s play areas, with costs fully covered in the base rental contract.',
      },
      {
        q: 'How does the Al Aziziyah Metro Station benefit residents in this sector?',
        a: 'The Al Aziziyah Station sits directly on the Doha Metro Gold Line (located next to Villaggio Mall). This gives residents high-speed, direct rail links across central Doha, connecting smoothly to major interchange junctions like Msheireb.',
      },
      {
        q: 'Can your team help us secure commercial shops on Salwa Road?',
        a: 'Yes, absolutely. Dania Real Estate manages an active commercial portfolio along the Salwa Road and Abu Hamour business corridors, including street-level retail showrooms, high-footfall storefronts, and commercial corporate units.',
      },
      {
        q: 'Are utilities typically included in apartment rentals in Al Aziziya?',
        a: 'In standard independent apartments and large family villas, water and electricity are tracked through independent Kahramaa meters and billed based on actual use. For compact choices like managed studios or single partition spaces, utilities are usually bundled directly into a fixed monthly rate.',
      },
      {
        q: 'How can I view verified, active rental openings in Abu Hamour today?',
        a: 'Simply connect with our active WhatsApp leasing desk. Provide your target property layout, monthly budget limits, and move-in timeline, and an area specialist will instantly forward current, unedited interior walk-through videos of active vacancies.',
      },
    ],
    finalCta: {
      h2: 'Secure Your Perfect Home or Business Hub in Al Aziziya & Abu Hamour Today',
      paragraph:
        'Lock in an exceptional address that blends premier family living, world-class school zones, and unparalleled commercial exposure. Whether you are looking for an expansive compound villa close to Aspire Park, a modern low-rise flat near the Gold Line Metro station, or a high-footfall commercial storefront along Salwa Road, Dania Real Estate makes your search seamless. Stop losing your weekends to unverified classified ads or unresponsive real estate brokers. Connect with our dedicated Al Aziziya and Abu Hamour area leasing desk via WhatsApp right now. Share your preferred property layout, target monthly budget, and move-in timeline to receive a personalized portfolio of verified active vacancies sent straight to your device.',
      primaryBtn: 'Chat with Our Area Leasing Desk Now',
    },
  },

  // =====================================================================
  'old-airport': {
    seoTitle: 'Properties for Rent in Old Airport & Rawdat Al Matar | Dania Real Estate',
    metaDescription:
      'Find properties for rent in Old Airport and Rawdat Al Matar, Doha. Explore low-rise apartments, standalone villas, worker housing, and prime Matar Qadeem commercial shops with Dania Real Estate.',
    hero: {
      h1: 'Properties for Rent in Old Airport and Rawdat Al Matar',
      h3: 'Doha’s most established, hyper-connected urban community for low-rise apartments, high-footfall retail shops, and accessible corporate housing.',
      paragraph:
        'For tenants, businesses, and expanding corporate operations seeking central convenience without downtown price inflation, the combined districts of Old Airport (Matar Qadeem) and Rawdat Al Matar remain unmatched. Positioned perfectly between central Doha and major transit corridors, this area is legendary for its vibrant walkability, massive variety of local services, and unbeatable food culture along Old Airport Commercial Street. Dania Real Estate features an active, thoroughly vetted database of verified lease options throughout this highly sought-after urban sector. Whether you are tracking a budget-friendly 1BHK/2BHK apartment near the Oqba Ibn Nafie Metro Station, an established standalone family villa, or a high-exposure retail showroom, our localized team guides you straight to verified inventories tailored to your space requirements and budget structures.',
      primaryBtn: 'Explore Old Airport Rental Categories',
      trustPoints: [
        'Unrivaled transit access via two dedicated rail hubs: Al Matar Al Qadeem and Oqba Ibn Nafie Metro Stations (Red Line).',
        'Immediate driving connectivity to C-Ring, D-Ring, E-Ring Roads, and Hamad International Airport (HIA).',
        'Deeply established local markets ensuring every daily need, hypermarket, and clinic is within walking distance.',
      ],
    },
    overview: {
      h2: 'Rental Property Support in Old Airport and Rawdat Al Matar',
      paragraphs: [
        'Old Airport and Rawdat Al Matar represent the classic heart of Doha’s residential and retail strength. Unlike the newly built vertical towers of northern Doha, this sector features character-filled, low-to-mid-rise residential blocks and traditional family properties, making it one of the most culturally active and consistently high-demand markets in Qatar.',
        'This dedicated area platform eliminates search confusion by focusing entirely on the Old Airport and Rawdat Al Matar geographic micro-market. Rather than wading through irrelevant, mixed results from scattered municipal zones, visitors can instantly evaluate local housing variations, commercial retail strip layouts, and dedicated staff housing blocks.',
        'Navigating a mature and high-density market like Matar Qadeem requires genuine local experience. Dania Real Estate protects your interests by manually screening properties to verify critical local factors—such as dedicated basement parking availability, updated split air-conditioning retrofits, and strict municipality leasing approvals—ensuring a secure and predictable leasing experience.',
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Old Airport and Rawdat Al Matar',
      intro:
        'Align your budget requirements, personal lifestyle preferences, or commercial brand expansion targets with our pre-vetted property categories:',
      cards: [
        {
          h3: 'Apartments for Rent in Old Airport and Rawdat Al Matar',
          text: 'Discover functional 1-bedroom executive flats, affordable 2-bedroom layouts, and large 3-bedroom family apartments close to excellent transit points and schools.',
          button: 'View Local Apartments',
        },
        {
          h3: 'Villas for Rent in Old Airport and Rawdat Al Matar',
          text: 'Secure standalone family villas or traditional residential houses offering expansive floor plans, private compound settings, and quick access to major highway rings.',
          button: 'View Local Villas',
        },
        {
          h3: 'Staff Accommodation in Old Airport and Rawdat Al Matar',
          text: "Source highly accessible corporate team housings, compliant worker rooms, and executive employee buildings with direct road links to Doha's industrial sectors.",
          button: 'View Staff Housing',
        },
        {
          h3: 'Shops for Rent in Old Airport and Rawdat Al Matar',
          text: 'Launch or expand your retail brand within high-footfall commercial showrooms, main-road storefronts, and busy retail spaces along the Matar Qadeem corridor.',
          button: 'View Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Old Airport and Rawdat Al Matar',
          text: 'Explore economical standalone studio flats, single executive rooms, and safely managed partition options featuring simplified, utility-inclusive tenancy agreements.',
          button: 'View Compact Rentals',
        },
      ],
    },
    whyRent: {
      h2: 'Why Old Airport and Rawdat Al Matar Are Practical Rental Locations',
      intro:
        'Setting up your household or commercial operations inside the Old Airport perimeter brings exceptional community advantages and unmatched city-wide connectivity.',
      cards: [
        {
          h3: 'Incredible Urban Walkability',
          text: 'Enjoy an active lifestyle where supermarkets, international restaurants, clinics, local gyms, and retail hubs are fully accessible right outside your front door.',
        },
        {
          h3: 'Dual Metro Station Access',
          text: 'Cut your daily commute time using either Al Matar Al Qadeem or Oqba Ibn Nafie Metro Stations, connecting you directly to Msheireb, West Bay, and Lusail.',
        },
        {
          h3: 'Excellent Logistics & Commutes',
          text: 'Drive seamlessly across Doha and beyond with direct entry points onto C, D, and E-Ring Roads, the Doha Expressway, and Hamad International Airport.',
        },
        {
          h3: 'Practical Cost-to-Location Value',
          text: 'Avoid the high premium rates of modern luxury districts while retaining a central, well-connected Doha address with lower average rental costs.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Old Airport & Rawdat Al Matar Portal?',
      items: [
        'Aviation & Logistics Professionals want a short, traffic-free daily commute to Hamad International Airport and surrounding corporate plazas.',
        'Expat Families & Long-Term Residents seeking spacious, low-rise apartments or classic villas close to established community clinics and schools.',
        "F&B Operators & Retail Brand Owners aiming to capture high-volume consumer footfall on one of Doha's busiest commercial food and retail streets.",
        'Corporate Operations Managers looking to secure highly central, compliant staff housing units that keep transportation routes short and cost-effective.',
        'Budget-Minded Single Executives looking for clean standalone studios or managed partition rooms with straightforward all-inclusive utility bills.',
      ],
    },
    localGuidance: {
      h2: 'Local Guidance for Old Airport and Rawdat Al Matar Rentals',
      paragraphs: [
        'The rental property market across Old Airport and Rawdat Al Matar stays incredibly busy year-round due to its enduring popularity with diverse tenant demographics. Because the building inventory includes a mix of classic constructions and freshly retrofitted apartment blocks, having real local insight is highly beneficial. In this high-density urban sector, confirming whether a listing offers dedicated basement or shaded parking, verifying the condition of the air conditioning units, and checking municipal compliance are crucial steps to ensure a comfortable stay.',
        "Dania Real Estate takes the stress out of your search. We maintain close relationships with the area's top property owners and building managers, providing you with transparent info on precise maintenance responsibilities, parking privileges, and lease renewal terms.",
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Old Airport and Rawdat Al Matar',
      intro:
        'We simplify the mature Doha market by matching transparent lease management with accurate, unedited property insights.',
      cards: [
        {
          h3: 'True Local Market Knowledge',
          text: 'We know the Matar Qadeem residential landscape inside out, directing you away from high-congestion zones toward the most practical, peaceful building blocks.',
        },
        {
          h3: 'Explicit Parking Verifications',
          text: 'We prevent daily parking frustrations by verifying dedicated parking bays, garage gate controllers, and street accessibility before you sign any contract.',
        },
        {
          h3: 'Full Municipal Compliance',
          text: 'Our legal administrative team ensures every contract is officially registered via the Doha Baladiya system, protecting your security deposit and tenant rights.',
        },
        {
          h3: 'Real-Time Mobile Video Tours',
          text: 'Skip unnecessary traffic trips. We deliver unedited, current interior walk-through videos and clear floor plan details straight to your phone.',
        },
      ],
    },
    process: {
      h2: 'How Our Old Airport & Rawdat Al Matar Rental Support Works',
      steps: [
        {
          h3: 'Detail Your Property Profile',
          text: 'Let our dedicated asset team know whether your goal requires a low-rise family apartment, a standalone villa, corporate staff housing, or a compact studio.',
        },
        {
          h3: 'Pinpoint Your Transit Preferences',
          text: 'Confirm your target locations, such as immediate walking distance to the Oqba Ibn Nafie Metro line or direct commercial visibility on Matar Qadeem Street.',
        },
        {
          h3: 'Share Budget & Timeline Clearances',
          text: 'Outline your target monthly rental limit, preferred furnishing state (unfurnished vs fully furnished), and your precise move-in date.',
        },
        {
          h3: 'Review Vetted Property Options',
          text: 'Evaluate active, pre-screened property photos, video walkthrough assets, and exact map locations sent directly from our responsive WhatsApp leasing desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Old Airport and Rawdat Al Matar',
      intro:
        'If you are comparing real estate features between this mature eastern hub and alternative central or suburban districts across Qatar, explore our local portals below:',
      links: [
        {
          h3: 'Doha',
          text: 'Browse our comprehensive capital city directory managing Central Doha, Al Dafna’s corporate skyline, Al Hilal, and Al Mamoura’s family communities.',
          slug: 'doha',
        },
        {
          h3: 'Al Sadd',
          text: "Access central Doha's high-density urban core, famous for premium apartment towers, luxury hotels, and extensive multi-station metro rail networks.",
          slug: 'al-sadd',
        },
        {
          h3: 'Bin Mahmoud',
          text: 'Explore a highly dynamic downtown neighborhood offering modern residential flats, business office complexes, and immediate proximity to major healthcare centers.',
          slug: 'bin-mahmoud',
        },
        {
          h3: 'Al Wakra',
          text: "Jump to Qatar's booming southern coastal city, offering excellent family compound living, public beaches, and direct access to the Metro Red Line.",
          slug: 'al-wakra',
        },
      ],
    },
    faqs: [
      {
        q: 'Why is the Old Airport (Matar Qadeem) area so highly demanded by Doha renters?',
        a: 'The district offers an exceptional combination of central location, excellent walkability, and highly competitive rental rates. Having supermarkets, clinics, and diverse restaurants clustered tightly around residential blocks allows tenants to manage daily tasks easily without long commutes.',
      },
      {
        q: 'Which Doha Metro stations directly serve the Old Airport and Rawdat Al Matar neighborhoods?',
        a: 'This sector is directly served by two primary stations on the Doha Metro Red Line: the Al Matar Al Qadeem Metro Station and the Oqba Ibn Nafie Metro Station, both providing high-speed links to downtown Doha, West Bay, and Lusail.',
      },
      {
        q: 'How does this specific area page differ from the main Doha city directory?',
        a: 'This page functions as a localized neighborhood hub focused exclusively on the distinct real estate conditions of Old Airport and Rawdat Al Matar. The main Doha directory acts as an overarching hub managing distinct central zones like Al Dafna, Al Hilal, and Al Mamoura.',
      },
      {
        q: 'Is dedicated car parking widely available with apartments in the Old Airport district?',
        a: 'Dedicated parking varies significantly by building age. While newer or freshly retrofitted residential blocks provide secure basement or shaded parking slots, older buildings often rely on street parking. The Dania team explicitly confirms parking allocations for every listing before viewing.',
      },
      {
        q: 'Can Dania Real Estate help companies secure large-scale staff accommodation here?',
        a: 'Yes, absolutely. Thanks to its direct road links to major expressways like the F-Ring Road and its central location, Rawdat Al Matar and Old Airport are prime spots for corporate staff housing. We actively manage standalone residential blocks and multi-apartment groupings suitable for corporate teams.',
      },
      {
        q: 'How can I instantly access available, verified rental listings in this area today?',
        a: 'Simply connect with our active WhatsApp leasing desk. Share your required property configuration, targeted monthly budget limit, and move-in timeline, and an area specialist will instantly forward unedited walk-through videos of active vacancies.',
      },
    ],
    finalCta: {
      h2: 'Secure Your Perfect Rental Address in Old Airport or Rawdat Al Matar Today',
      paragraph:
        "Experience the ultimate convenience of central Doha living within one of the city's most vibrant, walkable, and transit-friendly urban communities. From budget-smart apartments steps from the Metro Red Line to prime commercial storefronts on the high-footfall Matar Qadeem commercial street and spacious standalone houses, Dania Real Estate ensures your leasing process is smooth and fully transparent. Stop losing your free time to unverified online classifieds or unresponsive brokers. Connect with our dedicated Old Airport area leasing desk via WhatsApp right now. Share your preferred property layout, target monthly budget, and move-in timeline to receive a personalized portfolio of verified active vacancies delivered straight to your mobile device.",
      primaryBtn: 'Chat with Our Old Airport Leasing Desk Now',
    },
  },

  // =====================================================================
  'umm-salal': {
    seoTitle: 'Properties for Rent in Umm Salal Mohammed | Dania Real Estate Qatar',
    metaDescription:
      'Explore properties for rent in Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn. Find premium family villas, budget apartments, retail shops, and corporate staff housing along the Al Shamal Road corridor.',
    hero: {
      h1: 'Properties for Rent in Umm Salal Mohammed',
      h3: 'Your trusted local gateway to expansive family villas, budget-friendly apartments, and logistics-linked staff housing across Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn.',
      paragraph:
        "Positioned strategically along the vital Al Shamal Road (Highway Q1) corridor, the fast-growing district of Umm Salal Mohammed offers a refreshing escape from central Doha's high-density traffic while retaining immediate access to the capital. Together with its neighboring sister sectors, Umm Salal Ali and Umm Qarn, this expansive northern suburban zone has become highly prized by long-term residents seeking uncompromised living space, modern conveniences, and traditional community charm. Located just minutes north of Doha Festival City and IKEA, and anchored by local treasures like the historic Barzan Towers and the bustling Umm Salal Central Market, the region provides an incredible space-to-cost advantage. Dania Real Estate offers an actively updated, pre-screened inventory of rental listings across these northern neighborhoods. Whether your goal is a sprawling multi-bedroom compound villa with private yard amenities, an affordable independent flat for a growing family, or legally compliant staff accommodation for a corporate logistics workforce, our dedicated team delivers verified options aligned perfectly with your lifestyle preferences and financial benchmarks.",
      primaryBtn: 'Explore Umm Salal Rental Categories',
      trustPoints: [
        'Swift driving access directly feeding into Al Shamal Road, Al Majd Road (Orbital Highway), and the Lusail Expressway link.',
        'Unmatched real estate value offering maximum square footage per Qatari Riyal compared to downtown Doha blocks.',
        '100% verified structural and municipal listings complying fully with Doha and Umm Salal Baladiya registration policies.',
      ],
    },
    overview: {
      h2: 'Rental Property Support in Umm Salal Mohammed, Umm Salal Ali and Umm Qarn',
      paragraphs: [
        'The Umm Salal municipality represents the future of premium suburban living and corporate logistics expansion in Qatar. By anchoring residential communities along primary northern transit routes, Umm Salal Mohammed ensures that residents enjoy clean air, quiet evening environments, and large property plots without sacrificing the vital connection to Doha’s commercial center.',
        'To make your property search seamless, this comprehensive area platform integrates the rental real estate markets of Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn into a unified geographic directory. Instead of searching through fragmented, duplicate pages across different platforms, you can easily compare properties within this single northern corridor to find the exact neighborhood layout that matches your goals.',
        'Navigating suburban property options requires a clear understanding of the local market. Older listings may feature traditional designs with massive courtyard layouts, while newer builds offer modern finishes and energy-efficient designs. Dania Real Estate actively pre-screens every northern listing to verify independent Kahramaa utility connections, private parking provisions, and compound maintenance track records, giving you absolute clarity before signing your lease agreement.',
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Umm Salal Mohammed',
      intro:
        'Select your ideal real estate configuration or commercial venture path from our active, pre-vetted suburban property divisions:',
      cards: [
        {
          h3: 'Apartments for Rent in Umm Salal Mohammed',
          text: 'Explore highly affordable 1BHK, 2BHK, and 3BHK family flats within clean low-rise buildings, offering maximum interior space and quick highway connections.',
          button: 'View Local Apartments',
        },
        {
          h3: 'Villas for Rent in Umm Salal Mohammed',
          text: 'Secure massive standalone estates or family compound villas featuring large private courtyards, swimming pools, dedicated security, and easy school access.',
          button: 'View Local Villas',
        },
        {
          h3: 'Staff Accommodation in Umm Salal Mohammed',
          text: 'Access highly compliant corporate employee housing blocks, shared workforce modules, and supervisor flats with convenient transit access to northern industrial zones.',
          button: 'View Staff Housing',
        },
        {
          h3: 'Shops for Rent in Umm Salal Mohammed',
          text: 'Position your retail brand or local service business inside high-visibility commercial strips and retail storefronts experiencing strong community customer footfall.',
          button: 'View Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Umm Salal Mohammed',
          text: 'Find budget-smart standalone studio apartments, single executive rooms, and managed partition spaces featuring straightforward, all-inclusive monthly utility pricing.',
          button: 'View Compact Rentals',
        },
      ],
    },
    subAreaFocus: {
      h2: 'Geographic Sectors Covered on This Northern Portal',
      intro:
        'By grouping these three closely connected northern sub-markets onto a single page, we help you compare variations in property size, pricing, and transit links across the wider area.',
      items: [
        {
          h3: 'Umm Salal Mohammed Rentals',
          text: 'The primary residential and retail hub of the zone. Positioned closest to the Doha border, it features a rich mix of family compounds, standalone villas, local retail streets, and rapid access to Doha Festival City.',
        },
        {
          h3: 'Umm Salal Ali Rentals',
          text: 'Located slightly further north along Al Shamal Road. This area offers an ideal blend of peaceful, traditional residential streets and highly strategic logistics connections, making it highly favored for corporate staff housing.',
        },
        {
          h3: 'Umm Qarn Rentals',
          text: 'A rapidly expanding residential sector further north near the Al Khor municipality line. It is highly sought after by tenants looking for newly constructed, exceptionally large standalone villas at very economical rental rates.',
        },
      ],
    },
    whyRent: {
      h2: 'Why Umm Salal Mohammed Is a Practical Rental Location',
      intro:
        'Moving your household or business logistics to the Umm Salal corridor offers a wealth of lifestyle space and exceptional transport benefits over central city zones.',
      cards: [
        {
          h3: 'Incredible Living Space Value',
          text: 'Enjoy significantly larger room sizes, expansive outdoor yards, and generous floor plans at monthly rental rates that offer far better value than central Doha options.',
        },
        {
          h3: 'Strategic Northern Transit Hub',
          text: 'Drive easily across the region via Al Shamal Road (Q1) and Al Majd Road, allowing for short, traffic-free commutes to Lusail, West Bay, or the northern industrial hubs.',
        },
        {
          h3: 'Rich Community Convenience',
          text: 'Benefit from excellent everyday local facilities, including the massive Umm Salal Central Market, local health clinics, public schools, and nearby community parks.',
        },
        {
          h3: 'Prime Retail & Entertainment Access',
          text: 'Live just minutes away from world-class shopping, dining, and family entertainment centers at Doha Festival City, IKEA, and the nearby Al Daayen retail zones.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Umm Salal Rental Platform?',
      items: [
        'Large & Multi-Generational Expat Families who need the expansive space of a 4, 5, or 6-bedroom standalone villa with a private yard without paying premium city prices.',
        'Logistics & Corporate Fleet Planners aiming to secure compliant, cost-effective corporate staff accommodation near major industrial highways like Al Majd Road.',
        'Lusail & West Bay Working Professionals who prefer a quiet, suburban home environment with a straightforward highway commute to their offices.',
        'Local Business Entrepreneurs & Retailers looking to establish neighborhood service shops, pharmacies, or local eateries catering to a growing family community.',
        'Value-Focused Single Professionals searching for modern, newly built studios or single partition spaces with simple, all-inclusive monthly billing.',
      ],
    },
    localGuidance: {
      h2: 'Local Guidance for Umm Salal Mohammed, Umm Salal Ali and Umm Qarn Rentals',
      paragraphs: [
        'The rental market across the wider Umm Salal sector moves at a steady pace, driven by consistent demand from families seeking spacious homes and companies looking for logistical property hubs. Because this area features a unique mix of traditional Qatari property designs and modern compound developments, having clear local insights makes a big difference. In this suburban zone, confirming specific features—such as compound maintenance response times, dedicated shaded parking allocations, and the setup of independent utility meters—is essential for a smooth rental experience.',
        'Dania Real Estate takes the complexity out of your suburban search. We maintain trusted relationships with the area’s primary villa owners and property developers, ensuring you get accurate, unedited facts on building conditions, municipality leasing approvals, and contract terms.',
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Umm Salal Mohammed',
      intro:
        'We simplify the northern suburban market by combining honest property management with reliable, on-the-ground local expertise.',
      cards: [
        {
          h3: 'Genuine Local Knowledge',
          text: 'We understand the unique layout of every block across Mohammed, Ali, and Umm Qarn, easily guiding you to the quietest family streets or most efficient logistics routes.',
        },
        {
          h3: 'Thorough Property Screenings',
          text: 'We protect your peace of mind by checking all essential utility lines, air conditioning systems, and structural conditions before any contract is presented.',
        },
        {
          h3: 'Certified Legal Frameworks',
          text: 'Our legal administrative team manages the entire process, ensuring your lease is officially registered via the local Baladiya system to fully protect your rights.',
        },
        {
          h3: 'Direct Mobile Video Tours',
          text: 'Save time on travel. We deliver current, unedited interior walk-through videos and clear floor plan details directly to your phone via WhatsApp.',
        },
      ],
    },
    process: {
      h2: 'How Our Umm Salal Rental Support Works',
      steps: [
        {
          h3: 'Outline Your Space Goals',
          text: 'Let our dedicated asset team know whether you need a sprawling compound villa, an affordable family apartment, retail commercial space, or a budget studio.',
        },
        {
          h3: 'Pinpoint Your Ideal Location',
          text: 'Confirm your geographic preference across Umm Salal Mohammed, Umm Salal Ali, or Umm Qarn based on your school commutes or company logistics paths.',
        },
        {
          h3: 'Define Budget & Timing',
          text: 'Share your target monthly rental limits, preferred furnishing state (unfurnished vs fully furnished), and your precise target move-in date.',
        },
        {
          h3: 'Review Curated Active Openings',
          text: 'Evaluate verified, active property photos, unedited walk-through video walkthroughs, and exact map locations sent straight from our active WhatsApp customer desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Umm Salal Mohammed',
      intro:
        'If you are cross-examining real estate variables between this northern corridor and alternative central or coastal districts across Qatar, navigate directly to our local portals below:',
      links: [
        {
          h3: 'Doha',
          text: 'Browse our comprehensive capital city directory managing Central Doha, Al Dafna’s corporate skyline, Al Hilal, and Al Mamoura’s family communities.',
          slug: 'doha',
        },
        {
          h3: 'Al Kharaitiyat',
          text: 'Access neighboring family-focused suburban communities offering an excellent mix of residential villas, low-rise flats, and direct access to Doha Festival City.',
          slug: 'al-kharaitiyat',
        },
        {
          h3: 'Al Aziziya & Abu Hamour',
          text: "Explore central-western Doha's premium family corridor, famous for established residential compounds, retail strips, and a massive cluster of international schools.",
          slug: 'al-aziziya',
        },
        {
          h3: 'Al Wakra',
          text: "Jump to Qatar's booming southern coastal city, offering excellent family compound living, public beaches, and direct access to the Metro Red Line.",
          slug: 'al-wakra',
        },
      ],
    },
    faqs: [
      {
        q: 'What makes the Umm Salal corridor a preferred choice for family villa rentals?',
        a: 'This region offers an exceptional space-to-cost advantage that is difficult to find in central Doha. Families can rent large standalone or compound villas with private yards and generous floor plans for the same cost as a compact apartment in downtown districts, while enjoying a quiet, traffic-free suburban environment.',
      },
      {
        q: 'How far are Umm Salal Mohammed and Umm Salal Ali from central Doha and Lusail?',
        a: 'Thanks to the direct access via Al Shamal Road (Highway Q1), residents can drive to Lusail City in approximately 15 minutes and reach West Bay or central Doha within 20 to 25 minutes during standard off-peak traffic windows.',
      },
      {
        q: 'What unique property differences exist between Umm Salal Mohammed and Umm Qarn?',
        a: 'Umm Salal Mohammed sits closest to the Doha border, offering established retail streets, supermarkets, and rapid access to Doha Festival City. Umm Qarn is located further north; it is a rapidly developing area known for brand-new, exceptionally large standalone family villas at highly economical rental rates.',
      },
      {
        q: 'Can your team assist companies in acquiring compliant corporate staff housing in Umm Salal Ali?',
        a: 'Yes, absolutely. Due to its direct connection to Al Shamal Road and its strategic proximity to the Al Majd Road corridor, the Umm Salal Ali perimeter is a prime area for corporate logistics and employee housing. We actively manage standalone blocks and multi-villa configurations tailored for corporate operations.',
      },
      {
        q: 'Are local shopping and daily services easily available within the Umm Salal municipality?',
        a: 'Yes. The area features a wealth of local shopping options, including neighborhood hypermarkets, health clinics, local petrol stations, and the major Umm Salal Central Market. In addition, the world-class shopping, dining, and entertainment options of Doha Festival City and IKEA are located just minutes away.',
      },
      {
        q: 'How can I instantly access active, verified property listings in this northern sector today?',
        a: 'Simply connect with our active WhatsApp leasing desk. Share your required property layout, target monthly budget limit, and move-in timeline, and an area specialist will instantly forward unedited walk-through videos of verified, active vacancies.',
      },
    ],
    finalCta: {
      h2: 'Secure Your Ideal Suburban Home or Strategic Business Location in Umm Salal Today',
      paragraph:
        "Enjoy the perfect balance of expansive suburban space, peaceful community living, and exceptional road connectivity along Qatar's premier northern expansion corridor. Whether you are looking for a massive standalone family villa close to the historic Barzan Towers, an affordable apartment near local community schools, or corporate staff accommodation with immediate access to major transport expressways, Dania Real Estate makes your rental search simple and fully transparent. Stop wasting your time on outdated classified ads or unverified listings. Connect with our dedicated Umm Salal area leasing desk via WhatsApp right now. Share your preferred property type, target monthly budget limit, and move-in timeline to receive a personalized portfolio of verified active vacancies sent directly to your mobile device.",
      primaryBtn: 'Chat with Our Umm Salal Leasing Desk Now',
    },
  },

  // =====================================================================
  'al-kharaitiyat': {
    seoTitle: 'Properties for Rent in Al Kharaitiyat | Dania Real Estate Qatar',
    metaDescription:
      'Find properties for rent in Al Kharaitiyat, Qatar. Explore spacious family villas, modern low-rise apartments, and retail shops near Doha Festival City and IKEA with Dania Real Estate.',
    hero: {
      h1: 'Properties for Rent in Al Kharaitiyat',
      h3: 'Premium suburban rental homes, commercial shops, and accessible staff housing perfectly positioned next to Doha Festival City and the Al Shamal corridor.',
      paragraph:
        "For tenants, growing families, and business brands wanting the space and comfort of suburban life without losing touch with Doha's main hubs, Al Kharaitiyat stands out as a prime location. Located right along Al Shamal Road, this highly sought-after district bridges the gap between peaceful residential neighborhoods and major retail zones. Living here puts you right next to Doha Festival City and IKEA, while giving you access to excellent local facilities along Al Kharaitiyat Commercial Street and plenty of green space at Al Kharaitiyat Family Park. Dania Real Estate features an active, pre-vetted selection of rental properties throughout this fast-growing neighborhood. Whether you are searching for a spacious multi-bedroom standalone villa, a budget-friendly family apartment, or a high-exposure retail storefront, our dedicated team will connect you with verified vacancies that fit your budget, timeline, and space needs.",
      primaryBtn: 'Explore Al Kharaitiyat Rental Categories',
      trustPoints: [
        'Unmatched proximity to Doha Festival City, IKEA, and premier international schools.',
        'Immediate driving access onto Al Shamal Road (Highway Q1) for quick commutes into central Doha.',
        'Thoroughly vetted property listings with clear, transparent leasing contracts registered with the local municipality.',
      ],
    },
    overview: {
      h2: 'Rental Property Support in Al Kharaitiyat',
      paragraphs: [
        "Al Kharaitiyat represents one of the most balanced and popular residential districts in Qatar's northern expansion zone. Known for its wide streets, large residential plots, and active local commercial sectors, it provides an excellent alternative for renters who want to step away from the high-density traffic of downtown Doha.",
        'This dedicated location platform focuses entirely on the distinct real estate market of Al Kharaitiyat. By separating this high-demand zone from general municipal searches, visitors can instantly view local housing options, standalone family compounds, and retail spaces without sorting through confusing, unrelated property data.',
        'Finding the right rental in a popular suburban area like Al Kharaitiyat requires authentic local insight. Properties here vary from classic traditional villas to newly built, modern low-rise apartments. Dania Real Estate protects your time by checking every listing firsthand to confirm dedicated parking spaces, air-conditioning quality, and official municipality approvals, ensuring a secure and hassle-free move.',
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Al Kharaitiyat',
      intro:
        'Align your lifestyle goals, space needs, or commercial brand expansion targets with our pre-vetted property categories:',
      cards: [
        {
          h3: 'Apartments for Rent in Al Kharaitiyat',
          text: 'Discover spacious 1-bedroom, 2-bedroom, and 3-bedroom family flats within low-rise buildings, offering maximum square footage and quick highway access.',
          button: 'View Local Apartments',
        },
        {
          h3: 'Villas for Rent in Al Kharaitiyat',
          text: 'Secure premium compound villas or large standalone family homes featuring private yards, dedicated security, shared pools, and easy school access.',
          button: 'View Local Villas',
        },
        {
          h3: 'Staff Accommodation in Al Kharaitiyat',
          text: 'Source compliant corporate employee housing blocks, supervisor rooms, and shared workforce accommodations with direct links to major northern transport routes.',
          button: 'View Staff Housing',
        },
        {
          h3: 'Shops for Rent in Al Kharaitiyat',
          text: 'Launch or expand your business within high-footfall commercial showrooms and retail storefronts along the busy Al Kharaitiyat retail strips.',
          button: 'View Retail Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Al Kharaitiyat',
          text: 'Explore economical standalone studio apartments, single executive rooms, and safely managed partition spaces with simple, all-inclusive monthly utility pricing.',
          button: 'View Compact Rentals',
        },
      ],
    },
    whyRent: {
      h2: 'Why Al Kharaitiyat Is a Practical Rental Location',
      intro:
        'Choosing Al Kharaitiyat for your household or commercial branch provides exceptional lifestyle space and world-class retail convenience right on your doorstep.',
      cards: [
        {
          h3: 'Next Door to World-Class Retail',
          text: 'Live just minutes from premier shopping, dining, entertainment, and everyday essentials at the iconic Doha Festival City and IKEA complexes.',
        },
        {
          h3: 'Excellent Space-to-Cost Value',
          text: 'Rent significantly larger living areas, expansive bedrooms, and private outdoor yards compared to what you would pay for smaller spaces in central Doha.',
        },
        {
          h3: 'Strategic Northern Highway Links',
          text: 'Drive effortlessly across the region with immediate entry points onto Al Shamal Road, allowing for short, direct commutes to central Doha, Lusail, or West Bay.',
        },
        {
          h3: 'Family-Centric Infrastructure',
          text: 'Enjoy a welcoming neighborhood environment with local family parks, reputable international schools, neighborhood hypermarkets, and trusted health clinics close by.',
        },
      ],
    },
    whoFor: {
      h2: 'Who Can Benefit from Our Al Kharaitiyat Rental Portal?',
      items: [
        'Expat & Local Families who want a spacious compound or standalone villa close to northern international schools and family-focused parks.',
        'Retail Executives & Mall Employees working at Doha Festival City or IKEA who want a short, stress-free daily commute to work.',
        'Lusail & Central Doha Professionals who prefer a quieter, suburban home life with a straightforward highway drive to the office.',
        'Business Owners & Entrepreneurs aiming to capture steady customer footfall by opening a local retail shop or neighborhood service center.',
        'Value-Seeking Single Executives looking for modern standalone studios or single rooms with simple, utility-inclusive tenancy terms.',
      ],
    },
    localGuidance: {
      h2: 'Local Guidance for Al Kharaitiyat Rentals',
      paragraphs: [
        'The rental market in Al Kharaitiyat stays busy throughout the year because it is highly favored by families looking for more space and professionals wanting to live near major retail hubs. Since the area features a mix of traditional Qatari property designs and modern compound developments, having clear local insights is a big advantage. In this popular suburban zone, verifying specific details—such as compound maintenance response times, dedicated shaded parking allocations, and the setup of independent utility meters—is essential for a smooth rental experience.',
        "Dania Real Estate takes the complexity out of your suburban search. We maintain trusted relationships with the area's primary villa owners and property developers, ensuring you get accurate, unedited facts on building conditions, municipality leasing approvals, and contract terms.",
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Al Kharaitiyat',
      intro:
        'We simplify the northern suburban market by matching transparent lease management with accurate, unedited property insights.',
      cards: [
        {
          h3: 'Deep Neighborhood Insight',
          text: 'We know the Al Kharaitiyat residential landscape inside out, easily guiding you to the quietest family blocks or the most convenient highway access points.',
        },
        {
          h3: 'Explicit Parking Verifications',
          text: 'We prevent daily parking frustrations by verifying dedicated parking bays, garage gate controllers, and street accessibility before you sign any contract.',
        },
        {
          h3: 'Official Baladiya Registration',
          text: 'Our legal administrative team ensures every contract is officially registered via the municipal system, fully protecting your security deposit and tenant rights.',
        },
        {
          h3: 'Real-Time Mobile Video Tours',
          text: 'Save time on travel. We deliver current, unedited interior walk-through videos and clear floor plan details straight to your phone via WhatsApp.',
        },
      ],
    },
    process: {
      h2: 'How Our Al Kharaitiyat Rental Support Works',
      steps: [
        {
          h3: 'Share Your Property Blueprint',
          text: 'Let our dedicated asset team know whether your goal requires a spacious family villa, a modern low-rise apartment, corporate staff housing, or a budget studio.',
        },
        {
          h3: 'Specify Your Proximity Targets',
          text: 'Confirm your target location needs, such as immediate driving proximity to Al Shamal Road or direct walking distance to Al Kharaitiyat Commercial Street.',
        },
        {
          h3: 'Define Budget & Timeline Clearances',
          text: 'Outline your target monthly rental limit, preferred furnishing state (unfurnished vs fully furnished), and your precise target move-in date.',
        },
        {
          h3: 'Review Vetted Property Options',
          text: 'Evaluate active, pre-screened property photos, video walkthrough assets, and exact map locations sent directly from our responsive WhatsApp leasing desk.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Al Kharaitiyat',
      intro:
        'If you are comparing real estate features between this premium suburban hub and alternative central or northern districts across Qatar, explore our local portals below:',
      links: [
        {
          h3: 'Umm Salal Mohammed',
          text: 'Access our integrated northern directory managing rental properties across the wider Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn communities.',
          slug: 'umm-salal',
        },
        {
          h3: 'Doha',
          text: 'Browse our comprehensive capital city directory managing Central Doha, Al Dafna’s corporate skyline, Al Hilal, and Al Mamoura’s family communities.',
          slug: 'doha',
        },
        {
          h3: 'Al Aziziya & Abu Hamour',
          text: "Explore central-western Doha's premium family corridor, famous for established residential compounds, retail strips, and a massive cluster of international schools.",
          slug: 'al-aziziya',
        },
        {
          h3: 'Al Wakra',
          text: "Jump to Qatar's booming southern coastal city, offering excellent family compound living, public beaches, and direct access to the Metro Red Line.",
          slug: 'al-wakra',
        },
      ],
    },
    faqs: [
      {
        q: 'Why is Al Kharaitiyat highly recommended for families looking for villa rentals?',
        a: 'Al Kharaitiyat offers an exceptional combination of spacious living layouts, a family-friendly atmosphere, and competitive rental rates. Families can secure large standalone or compound villas with private yards right next to Doha Festival City and reputable international schools, avoiding the higher premium costs of downtown Doha.',
      },
      {
        q: 'Is there a direct Doha Metro station located inside Al Kharaitiyat?',
        a: 'While there is no metro station directly inside the residential heart of Al Kharaitiyat, residents enjoy exceptional transit links. The area is served by Metroexpress feeder buses that connect directly to nearby major hub stations like Lusail QNB and Qatar University on the Red Line.',
      },
      {
        q: 'How does this specific area page differ from the nearby Umm Salal Mohammed directory?',
        a: 'This page functions as a localized neighborhood hub focused exclusively on the distinct real estate conditions of Al Kharaitiyat. The nearby Umm Salal Mohammed page serves as a separate directory managing properties further north, including Umm Salal Ali and Umm Qarn.',
      },
      {
        q: 'What should I look out for when renting an independent apartment in Al Kharaitiyat?',
        a: 'It is important to confirm dedicated car parking allocations (such as shaded or gated bays) and check whether the property features modern split air conditioning systems or older window units. The Dania team explicitly pre-screens and clarifies these details before scheduling any viewings.',
      },
      {
        q: 'Can your team assist retail business owners in finding commercial shops here?',
        a: 'Yes, absolutely. Al Kharaitiyat features active, high-footfall commercial strips and retail locations. We work closely with local property owners to source prime commercial shop units, showrooms, and retail spaces with excellent road visibility.',
      },
      {
        q: 'How can I instantly access available, verified rental listings in Al Kharaitiyat today?',
        a: 'Simply connect with our active WhatsApp leasing desk. Share your preferred property layout, target monthly budget limit, and move-in timeline, and an area specialist will instantly forward current interior photos and unedited walk-through videos of active vacancies.',
      },
    ],
    finalCta: {
      h2: 'Secure Your Perfect Rental Address in Al Kharaitiyat Today',
      paragraph:
        'Experience the ultimate balance of expansive suburban comfort, welcoming community parks, and exceptional retail convenience right next to Doha Festival City and IKEA. From spacious family compound villas to modern, budget-friendly low-rise flats and high-exposure commercial storefronts, Dania Real Estate ensures your leasing process is smooth and fully transparent. Stop losing your free time to unverified online classifieds or unresponsive brokers. Connect with our dedicated Al Kharaitiyat area leasing desk via WhatsApp right now. Share your preferred property layout, target monthly budget, and move-in timeline to receive a personalized portfolio of verified active vacancies delivered straight to your mobile device.',
      primaryBtn: 'Chat with Our Al Kharaitiyat Leasing Desk Now',
    },
  },
  // =====================================================================
  'al-waab': {
    seoTitle: 'Properties for Rent in Al Waab | Dania Real Estate Qatar',
    metaDescription:
      'Find properties for rent in Al Waab, Qatar. Explore family villas, modern apartments, staff accommodation, and retail shops near Aspire Zone and Villaggio Mall with Dania Real Estate.',
    hero: {
      h1: 'Properties for Rent in Al Waab: Premium Residential Living',
      h3: "Family-oriented community rentals with strategic access to Aspire Zone, Villaggio Mall, and Al Waab Street — one of Doha's most recognized residential districts.",
      paragraph:
        'Looking for properties for rent in Al Waab, Qatar? Dania Real Estate helps renters and businesses explore diverse rental options in one of Doha\'s most well-known residential areas. Known for its family-oriented atmosphere and practical access to key city landmarks, Al Waab is the perfect choice for those seeking a balanced lifestyle. Start your search by area and find the rental category that fits your residential or commercial needs.',
      primaryBtn: 'Explore Property Types',
      trustPoints: [
        'Premier Residential Hub: Home to some of Doha\'s most popular villa compounds.',
        'Strategic Access: Minutes away from Aspire Zone, Villaggio Mall, and Al Waab Street.',
        'Community Focused: A safe and established environment with top international schools.',
      ],
    },
    overview: {
      h2: 'Your Gateway to Family Living in Al Waab',
      paragraphs: [
        'Al Waab is a top choice for users looking for a residential location with a strong community feel and practical accessibility. Its connection to everyday living needs — from supermarkets to world-class sports facilities — makes it a highly sought-after area for both long-term residents and new arrivals.',
        'By starting your search with a focus on Al Waab, you are prioritizing a location that understands family needs. Whether you are looking for a spacious compound villa or a modern apartment near the metro, we help you navigate the best rental opportunities in this recognized neighborhood.',
      ],
    },
    categories: {
      h2: 'Explore Rental Options in Al Waab',
      intro:
        'Discover the full range of verified rental categories available in Al Waab, from family villas to compact studio rentals:',
      cards: [
        {
          h3: 'Apartments for Rent in Al Waab',
          text: 'Find practical and modern residential apartment options in a well-connected location.',
          button: 'View Apartments',
        },
        {
          h3: 'Villas for Rent in Al Waab',
          text: 'Discover spacious, private, and compound-style villas perfect for family living.',
          button: 'View Villas',
        },
        {
          h3: 'Staff Accommodation in Al Waab',
          text: 'Secure high-quality and strategically located housing for your professional workforce.',
          button: 'View Staff Housing',
        },
        {
          h3: 'Shops for Rent in Al Waab',
          text: 'Establish your business in prime retail spaces along active commercial streets.',
          button: 'View Shops',
        },
        {
          h3: 'Studio & Partition Rentals in Al Waab',
          text: 'Affordable and practical living solutions in an established residential setting.',
          button: 'View Compact Rentals',
        },
      ],
    },
    whyRent: {
      h2: 'Why Al Waab Is a Premier Rental Choice',
      intro:
        'Al Waab attracts steady rental interest because it perfectly balances suburban quiet with rapid city access, making it one of Doha\'s most in-demand residential zones.',
      cards: [
        {
          h3: 'Suburban Quiet with City Connectivity',
          text: 'Residents feel connected to the heart of Doha without the overcrowding of inner-city districts — a rare balance that consistently draws families and professionals.',
        },
        {
          h3: 'Steps from Aspire Zone',
          text: 'Live minutes from Aspire Park, Aspire Academy, and the iconic Torch Hotel — giving you access to world-class sports, leisure, and outdoor facilities.',
        },
        {
          h3: 'Key Road & Expressway Access',
          text: 'Proximity to Salwa Road and the Doha Expressway ensures an efficient daily commute to any district across the city, saving you time every single day.',
        },
        {
          h3: 'Complete Local Amenities',
          text: 'Local essentials — from international supermarkets and reputable schools to healthcare clinics and retail shops — are all within easy reach of your home.',
        },
      ],
    },
    whoFor: {
      h2: 'Tailored Search for Al Waab Renters',
      items: [
        'Families seeking high-quality villas near international schools and parks.',
        'Professionals working in central Doha who prefer a quieter home environment.',
        'Businesses looking for retail visibility in an affluent residential district.',
        'Employers seeking modern staff housing with easy highway connectivity.',
        'Renters who value an established neighborhood identity and location-first searching.',
      ],
    },
    localGuidance: {
      h2: 'Expert Guidance in Al Waab',
      paragraphs: [
        'At Dania Real Estate, we understand the unique demand of the Al Waab property market. Whether you are looking for a luxury villa in a private compound or a practical retail shop, our team provides the localized insight you need to make an informed decision. We guide your search toward the most suitable property category based on your lifestyle and rental priorities.',
      ],
    },
    whyChooseDania: {
      h2: 'Why Choose Dania Real Estate for Rentals in Al Waab',
      intro:
        'We combine deep local knowledge of the Al Waab market with transparent leasing support, ensuring a smooth and verified rental experience.',
      cards: [
        {
          h3: 'Deep Al Waab Market Knowledge',
          text: 'Our team knows every compound, street, and commercial strip in Al Waab, helping you identify the best options based on your specific priorities.',
        },
        {
          h3: 'Verified Listings Only',
          text: 'Every property we present has been personally checked for municipality approvals, parking allocations, and accurate rental pricing — no surprises after you sign.',
        },
        {
          h3: 'Fast Availability Updates',
          text: 'We maintain active relationships with Al Waab landlords and property managers, giving you first access to new vacancies before they reach the open market.',
        },
        {
          h3: 'End-to-End Leasing Support',
          text: 'From your first enquiry to Baladiya contract registration, our team handles every administrative step to protect your rights as a tenant or business owner.',
        },
      ],
    },
    process: {
      h2: 'How Our Al Waab Rental Support Works',
      steps: [
        {
          h3: 'Share Your Property Requirements',
          text: 'Tell our team whether you need a family villa near Aspire Zone, a modern apartment, staff accommodation blocks, or a commercial retail space in Al Waab.',
        },
        {
          h3: 'Confirm Location Preferences',
          text: 'Specify your preferred streets or sub-districts within Al Waab, such as proximity to Al Waab Street, Aspire Zone, or Villaggio Mall.',
        },
        {
          h3: 'Define Your Budget and Move-In Date',
          text: 'Share your monthly rental target, furnishing preference, and exact move-in timeline so we can filter for the most relevant active vacancies.',
        },
        {
          h3: 'Review and Confirm Vetted Options',
          text: 'Receive curated property options with interior photos and video walkthroughs sent directly to your phone, then proceed to viewing and official contract signing.',
        },
      ],
    },
    nearby: {
      h2: 'Explore Other Rental Areas Near Al Waab',
      intro:
        'Comparing your rental options across multiple Doha districts? Browse our dedicated area portals below for verified listings and local insights:',
      links: [
        {
          h3: 'Doha',
          text: 'Browse our comprehensive capital city directory managing Central Doha, Al Dafna\'s corporate skyline, Al Hilal, and Al Mamoura\'s family communities.',
          slug: 'doha',
        },
        {
          h3: 'Al Aziziya & Abu Hamour',
          text: "Explore central-western Doha's premium family corridor, famous for established residential compounds, retail strips, and a cluster of international schools.",
          slug: 'al-aziziya',
        },
        {
          h3: 'Old Airport & Rawdat Al Matar',
          text: 'Access our high-density urban directory covering the Old Airport area and Rawdat Al Matar, known for excellent transport links and diverse rental options.',
          slug: 'old-airport',
        },
        {
          h3: 'Bin Mahmoud',
          text: 'Discover quiet, centrally located residential options in Bin Mahmoud, a well-established neighborhood popular with families and working professionals.',
          slug: 'bin-mahmoud',
        },
      ],
    },
    faqs: [
      {
        q: 'What type of properties are available for rent in Al Waab?',
        a: 'You can explore residential apartments, luxury villas, staff accommodation, and commercial shops. Al Waab is particularly well known for its high-quality family compound villas and modern apartment buildings.',
      },
      {
        q: 'Is Al Waab a good area for families with children?',
        a: 'Yes, it is one of Doha\'s most family-friendly areas, featuring numerous parks, reputable schools, and close proximity to Aspire Park — making it a top choice for families seeking a safe and well-connected environment.',
      },
      {
        q: 'Is this page different from your Doha or Ain Khaled pages?',
        a: 'Yes. This page is dedicated specifically to properties in Al Waab, while our other pages target different local markets and rental intents. Each area page provides localized insights and verified listings for its specific district.',
      },
      {
        q: 'Can Dania Real Estate help me find a villa near the Metro?',
        a: 'Yes, we can help you find villas and apartments within walking distance of the Al Waab and Sport City metro stations, ensuring you have convenient public transport access alongside your residential comforts.',
      },
    ],
    finalCta: {
      h2: 'Secure Your Perfect Rental Address in Al Waab Today',
      paragraph:
        'Al Waab offers an exceptional combination of family-oriented living, premium villa compounds, and rapid access to Aspire Zone, Villaggio Mall, and Doha\'s key business districts. Whether you are looking for a spacious family villa, a modern apartment, corporate staff housing, or a high-visibility retail shop, Dania Real Estate connects you with verified, pre-screened vacancies that match your exact needs. Contact our dedicated Al Waab leasing desk via WhatsApp today. Share your property requirements, budget, and preferred move-in date to receive a personalized selection of active, verified rentals delivered directly to your phone.',
      primaryBtn: 'Chat with Our Al Waab Leasing Desk Now',
    },
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// Spec-exact district display names: full combined names for a page's own FAQ
// heading, short names for outbound "View X Directory" nearby links.
const AREA_FULL_NAME: Record<string, string> = {
  'al-aziziya': 'Al Aziziya & Abu Hamour',
  'old-airport': 'Old Airport & Rawdat Al Matar',
}
const AREA_SHORT_NAME: Record<string, string> = {
  'al-aziziya': 'Al Aziziya',
  'old-airport': 'Old Airport',
  'umm-salal': 'Umm Salal',
}

// Per-area hero visual (right side of the double-column hero). Alt text is taken
// verbatim from the spec's "Image SEO Asset Mapping → Hero Visual Container"; the
// src maps to the closest-matching existing /public asset.
const AREA_HERO: Record<string, { img: string; alt: string }> = {
  'doha': {
    img: '/modern-residential-developments-qatar.webp',
    alt: 'High-definition view of modern residential buildings and the commercial skyline of Doha Qatar.',
  },
  'al-sadd': {
    img: '/apartments-for-rent-doha-qatar-dania-real-estate.webp',
    alt: 'High-rise residential tower complexes and active commercial streets inside Al Sadd Doha.',
  },
  'bin-mahmoud': {
    img: '/2-bedroom-apartments-for-rent-doha-qatar.webp',
    alt: 'Modern residential buildings and vibrant commercial street layouts in Bin Mahmoud Doha.',
  },
  'al-wakra': {
    img: '/villas-for-rent-doha-qatar-dania-real-estate.webp',
    alt: 'Modern family residential compounds and vibrant urban street layouts in Al Wakra Qatar.',
  },
  'al-aziziya': {
    img: '/compound-villas-for-rent-doha-qatar.webp',
    alt: 'Premium family compound villas and clean residential street layouts in Al Aziziya and Abu Hamour Doha.',
  },
  'old-airport': {
    img: '/staff-accommodation-doha-qatar-dania-real-estate.webp',
    alt: 'Bustling commercial streets and classic low-rise residential apartment blocks in Old Airport and Rawdat Al Matar Doha.',
  },
  'umm-salal': {
    img: '/standard-villas-for-rent-doha-qatar.webp',
    alt: 'Spacious family standalone villas and peaceful suburban residential streets in Umm Salal Mohammed Doha.',
  },
  'al-kharaitiyat': {
    img: '/compound-villas-for-rent-doha-qatar.webp',
    alt: 'Modern family compound villas and wide residential streets in Al Kharaitiyat Qatar.',
  },
  'al-waab': {
    img: '/villas-for-rent-doha-qatar-dania-real-estate.webp',
    alt: 'Premium family compound villas and well-maintained residential streets in Al Waab Doha Qatar.',
  },
}

export function AreaDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const area = areas.find((a) => a.slug === slug)
  const detail = area ? AREA_DETAIL[area.slug] : undefined

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // FAQPage structured data for this area (per content spec). Called
  // unconditionally (before the guards) to satisfy the rules of hooks.
  usePageSchema(detail ? [faqPageSchema(detail.faqs)] : [])

  // Unknown / unmapped slug → bounce back to the areas index.
  if (!area || !detail) {
    return <Navigate to="/areas/" replace />
  }

  const whatsappUrl = `https://wa.me/${company.whatsapp}`
  const heroVisual = AREA_HERO[area.slug]

  return (
    <>
      <title>{detail.seoTitle}</title>
      <meta name="description" content={detail.metaDescription} />

      {/* ================================================================
          S1 — Hero
      ================================================================ */}
      <section className="bg-forest text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,#bcef5f_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link to="/areas/" className="hover:text-lime transition-colors">
              {t('areaDetail.breadcrumb')}
            </Link>
            <span>/</span>
            <span className="text-lime">{area.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left: text + CTAs + trust points */}
            <div>
              <Reveal direction="up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
                  {detail.hero.h1}
                </h1>
              </Reveal>

              <Reveal direction="up" delay={100}>
                <h3 className="text-lg md:text-xl text-white/75 mb-5 leading-relaxed">
                  {detail.hero.h3}
                </h3>
              </Reveal>

              <Reveal direction="up" delay={180}>
                <ScrollRevealText className="text-white/60 mb-8 leading-relaxed" text={detail.hero.paragraph} />
              </Reveal>

              <Reveal direction="up" delay={240}>
                <div className="flex flex-wrap gap-3 mb-10">
                  <a
                    href="#rental-categories"
                    className="inline-flex items-center gap-2 bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    {detail.hero.primaryBtn}
                  </a>
                  <Link
                    to="/contact-us/"
                    className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-white/10 transition-colors"
                  >
                    Contact Our Team
                  </Link>
                </div>
              </Reveal>

              {/* Trust points (some areas have none) */}
              {detail.hero.trustPoints.length > 0 && (
                <Reveal direction="up" delay={320}>
                  <div className="flex flex-col gap-4">
                    {detail.hero.trustPoints.map((point) => (
                      <div key={point} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 size={16} className="text-lime shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right: high-definition area visual */}
            {heroVisual && (
              <Reveal direction="left" delay={160}>
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={heroVisual.img}
                    alt={heroVisual.alt}
                    className="w-full h-72 sm:h-96 lg:h-[460px] object-cover object-center"
                    loading="eager"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================
          S2 — Overview
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-6">{detail.overview.h2}</h2>
          </Reveal>
          {detail.overview.paragraphs.map((p, i) => (
            <Reveal key={i} direction="up" delay={80 + i * 80}>
              <ScrollRevealText className="text-ink-muted leading-relaxed mb-5 last:mb-0" text={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================================
          S3 — Rental Categories
      ================================================================ */}
      <section id="rental-categories" className="bg-surface-low py-20 scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-4">{detail.categories.h2}</h2>
          </Reveal>
          <Reveal direction="up" delay={60}>
            <p className="text-ink-muted leading-relaxed mb-10 max-w-3xl">{detail.categories.intro}</p>
          </Reveal>

          {/* Mobile: Pitch-style stacked deck */}
          <div className="lg:hidden max-w-md mx-auto">
            <StackedCards
              items={detail.categories.cards.map((card, i) => {
                const forest = i === 0
                return (
                  <div
                    key={card.h3}
                    className={`rounded-3xl border p-6 min-h-[248px] flex flex-col shadow-xl shadow-forest/10 ${forest ? 'bg-forest border-forest' : 'bg-white border-border'}`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${forest ? 'bg-lime/20 text-lime' : 'bg-lime text-forest'}`}>
                      {CATEGORY_ICONS[i]}
                    </div>
                    <h3 className={`font-bold text-xl mb-2 ${forest ? 'text-lime' : 'text-ink'}`}>{card.h3}</h3>
                    <p className={`text-sm leading-relaxed flex-1 mb-5 ${forest ? 'text-white/75' : 'text-ink-muted'}`}>{card.text}</p>
                    <Link
                      to={CATEGORY_HREFS[i]}
                      className={`inline-flex items-center gap-1.5 font-semibold text-sm mt-auto ${forest ? 'text-lime' : 'text-forest'}`}
                    >
                      {card.button} <ArrowRight size={15} className="rtl:-scale-x-100" />
                    </Link>
                  </div>
                )
              })}
            />
          </div>

          <div className="hidden lg:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {detail.categories.cards.map((card, i) => (
              <Reveal key={card.h3} direction="up" delay={i * 80}>
                <Link
                  to={CATEGORY_HREFS[i]}
                  className={`group flex flex-col gap-4 rounded-2xl border p-7 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full ${
                    i === 0
                      ? 'bg-forest text-white border-forest'
                      : 'bg-white text-ink border-border hover:border-forest/20'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${
                      i === 0 ? 'bg-lime text-forest' : 'bg-lime-light text-forest'
                    }`}
                  >
                    {CATEGORY_ICONS[i]}
                  </span>
                  <h3 className={`font-bold text-lg ${i === 0 ? 'text-white' : 'text-ink'}`}>
                    {card.h3}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      i === 0 ? 'text-white/70' : 'text-ink-muted'
                    }`}
                  >
                    {card.text}
                  </p>
                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${
                      i === 0 ? 'text-lime' : 'text-forest'
                    }`}
                  >
                    {card.button}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          S4 — Sub-Area Focus / Nearby Area Coverage (when present)
      ================================================================ */}
      {detail.subAreaFocus && (
        <section className="max-w-[1280px] mx-auto px-6 py-20">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-4">{detail.subAreaFocus.h2}</h2>
          </Reveal>
          <Reveal direction="up" delay={60}>
            <p className="text-ink-muted leading-relaxed mb-10 max-w-3xl">{detail.subAreaFocus.intro}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {detail.subAreaFocus.items.map((item, i) => (
              <Reveal key={item.h3} direction="up" delay={i * 60}>
                <div className="group relative flex flex-col gap-3 bg-white border border-border rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-2xl active:shadow-md hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 min-h-[190px] sm:min-h-[210px] lg:min-h-[220px]">
                  <div className="absolute inset-0 bg-forest translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out will-animate" />
                  <div className="relative z-10 inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-lime-dark text-white shadow-md shadow-lime/30 ring-1 ring-white/30 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-110 transition-transform duration-300 ease-out">
                    <LocationIcon size={19} />
                  </div>
                  <div className="relative z-10 flex flex-col flex-1 gap-1.5">
                    <h3 className="font-bold text-ink group-hover:text-white group-active:text-white text-sm leading-tight transition-colors duration-300">{item.h3}</h3>
                    <p className="text-ink-muted group-hover:text-white/70 group-active:text-white/70 text-xs leading-relaxed flex-1 transition-colors duration-300 line-clamp-3">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          S5 — Why Rent
      ================================================================ */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-4">{detail.whyRent.h2}</h2>
          </Reveal>
          <Reveal direction="up" delay={60}>
            <p className="text-ink-muted leading-relaxed mb-10 max-w-3xl">{detail.whyRent.intro}</p>
          </Reveal>

          {/* Mobile: Apple-style carousel */}
          <div className="lg:hidden">
            <CardCarousel
              items={detail.whyRent.cards.map((card) => (
                <div key={card.h3} className="bg-white rounded-3xl border border-border p-7 h-full min-h-[224px] shadow-lg shadow-forest/5">
                  <div className="w-11 h-11 bg-lime rounded-xl flex items-center justify-center mb-5">
                    <CheckCircle2 size={18} className="text-forest" />
                  </div>
                  <h3 className="font-bold text-ink mb-2 text-lg">{card.h3}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{card.text}</p>
                </div>
              ))}
            />
          </div>

          <div className="hidden lg:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {detail.whyRent.cards.map((card, i) => (
              <Reveal key={card.h3} direction="up" delay={i * 80}>
                <div
                  className={`flex flex-col items-start gap-4 rounded-2xl border p-7 h-full ${
                    i === 0 ? 'bg-forest text-white border-forest' : 'bg-white border-border'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                      i === 0 ? 'bg-lime' : 'bg-lime-light'
                    }`}
                  >
                    <CheckCircle2 size={18} className="text-forest" />
                  </span>
                  <h3 className={`font-bold ${i === 0 ? 'text-white' : 'text-ink'}`}>{card.h3}</h3>
                  <p className={`text-sm leading-relaxed ${i === 0 ? 'text-white/70' : 'text-ink-muted'}`}>
                    {card.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          S6 — Who This Page Is For (when present)
      ================================================================ */}
      {detail.whoFor && (
        <section className="max-w-[1280px] mx-auto px-6 py-20">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-10">{detail.whoFor.h2}</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 max-w-4xl">
            {detail.whoFor.items.map((item, i) => {
              const forest = i === 2
              return (
                <Reveal key={i} delay={i * 90}>
                  <div className={`group relative overflow-hidden rounded-2xl p-6 sm:p-7 min-h-[220px] h-full flex flex-col transition-all duration-300 hover:-translate-y-1 ${forest ? 'bg-forest' : 'bg-white border border-border hover:shadow-lg hover:shadow-forest/10'}`}>
                    <div className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${forest ? 'bg-lime/40' : 'bg-lime/20'}`} aria-hidden="true" />
                    <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${forest ? 'bg-lime/20' : 'bg-lime-light'}`}>
                      <CheckCircle2 size={20} className={forest ? 'text-lime' : 'text-forest'} />
                    </div>
                    <p className={`relative text-sm leading-relaxed ${forest ? 'text-white/70' : 'text-ink-muted'}`}>{item}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {/* ================================================================
          S7 — Local Guidance (when present)
      ================================================================ */}
      {detail.localGuidance && (
        <section className="bg-surface-low py-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <Reveal direction="up">
              <h2 className="text-3xl font-extrabold text-ink mb-6">{detail.localGuidance.h2}</h2>
            </Reveal>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 max-w-3xl">
                {detail.localGuidance.paragraphs.map((p, i) => (
                  <Reveal key={i} direction="up" delay={60 + i * 80}>
                    <ScrollRevealText className="text-ink-muted leading-relaxed mb-5 last:mb-0" text={p} />
                  </Reveal>
                ))}
              </div>

              {detail.localGuidance.callout && (
                <Reveal direction="up" delay={120}>
                  <div className="bg-forest text-white rounded-3xl p-8">
                    <h3 className="font-bold text-lg mb-3 text-lime">
                      {detail.localGuidance.callout.h3}
                    </h3>
                    <p className="text-sm text-white/75 leading-relaxed mb-6">
                      {detail.localGuidance.callout.text}
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-lime text-forest font-bold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle size={15} /> Chat on WhatsApp
                    </a>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          S8 — Why Choose Dania
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <Reveal direction="up">
          <h2 className="text-3xl font-extrabold text-ink mb-4">{detail.whyChooseDania.h2}</h2>
        </Reveal>
        <Reveal direction="up" delay={60}>
          <p className="text-ink-muted leading-relaxed mb-10 max-w-3xl">{detail.whyChooseDania.intro}</p>
        </Reveal>

        {/* Mobile: Apple-style carousel */}
        <div className="lg:hidden">
          <CardCarousel
            items={detail.whyChooseDania.cards.map((card, i) => (
              <div key={card.h3} className="bg-white rounded-3xl border border-border p-7 h-full min-h-[224px] shadow-lg shadow-forest/5">
                <div className="w-11 h-11 bg-lime rounded-xl flex items-center justify-center mb-5 font-bold text-forest">
                  {i + 1}
                </div>
                <h3 className="font-bold text-ink mb-2 text-lg">{card.h3}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          />
        </div>

        <div className="hidden lg:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {detail.whyChooseDania.cards.map((card, i) => (
            <Reveal key={card.h3} direction="up" delay={i * 80}>
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-7 h-full">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-lime-light text-forest font-bold">
                  {i + 1}
                </span>
                <h3 className="font-bold text-ink">{card.h3}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ================================================================
          S10 — Rental Inquiry Process
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <Reveal direction="up">
          <h2 className="text-3xl font-extrabold text-ink mb-10">{detail.process.h2}</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {detail.process.steps.map((step, i) => (
            <Reveal key={step.h3} direction="up" delay={i * 80}>
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-7 h-full">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-forest text-lime font-extrabold text-lg">
                  {i + 1}
                </span>
                <h3 className="font-bold text-ink">{step.h3}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================================
          S11 — Nearby Area Links
      ================================================================ */}
      <section className="bg-surface-low py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-3xl font-extrabold text-ink mb-4">{detail.nearby.h2}</h2>
          </Reveal>
          <Reveal direction="up" delay={60}>
            <p className="text-ink-muted leading-relaxed mb-10 max-w-3xl">{detail.nearby.intro}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {detail.nearby.links.map((link, i) => (
              <Reveal key={link.slug} direction="up" delay={i * 60}>
                <Link
                  to={`/areas/${link.slug}/`}
                  className="group relative flex flex-col gap-3 bg-white border border-border rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-2xl active:shadow-md hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 min-h-[190px] sm:min-h-[210px] lg:min-h-[220px]"
                >
                  <div className="absolute inset-0 bg-forest translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out will-animate" />
                  <div className="relative z-10 inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-lime-dark text-white shadow-md shadow-lime/30 ring-1 ring-white/30 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-110 transition-transform duration-300 ease-out">
                    <LocationIcon size={19} />
                  </div>
                  <div className="relative z-10 flex flex-col flex-1 gap-1.5">
                    <h3 className="font-bold text-ink group-hover:text-white group-active:text-white text-sm leading-tight transition-colors duration-300">
                      {link.h3}
                    </h3>
                    <p className="text-ink-muted group-hover:text-white/70 group-active:text-white/70 text-xs leading-relaxed flex-1 transition-colors duration-300 line-clamp-3">{link.text}</p>
                    <span className="inline-flex items-center gap-1 text-forest group-hover:text-lime group-active:text-lime font-semibold text-xs transition-colors duration-300">
                      View {AREA_SHORT_NAME[link.slug] ?? link.h3} Directory
                      <ArrowRight size={11} className="group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300 rtl:-scale-x-100" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          S12 — FAQ
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <Reveal direction="up">
          <h2 className="text-3xl font-extrabold text-ink mb-10">{AREA_FULL_NAME[area.slug] ?? area.name} Rental FAQs</h2>
        </Reveal>

        <div className="max-w-3xl flex flex-col gap-3">
          {detail.faqs.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <Reveal key={i} direction="up" delay={i * 60}>
                <div className="rounded-2xl border border-border bg-white overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-ink text-sm md:text-base leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-forest transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-7 pb-6 text-ink-muted text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ================================================================
          S13 — Final CTA
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <Reveal direction="up">
          <div className="bg-lime rounded-3xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-4">
              {detail.finalCta.h2}
            </h2>
            <p className="text-forest/70 max-w-3xl mx-auto mb-8 leading-relaxed">
              {detail.finalCta.paragraph}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-forest text-white font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={16} /> {detail.finalCta.primaryBtn}
              </a>
              <Link
                to="/contact-us/"
                className="inline-flex items-center gap-2 border-2 border-forest text-forest font-bold px-5 py-3 sm:px-8 sm:py-4 rounded-full text-sm hover:bg-forest hover:text-white transition-colors"
              >
                Contact Our Team Today
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
