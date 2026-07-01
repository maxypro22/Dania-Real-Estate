import { company } from '@/data/mockData'

// Canonical production origin (no trailing slash). Update if the domain changes.
export const SITE_ORIGIN = 'https://www.dania-realestate.com'

export interface SeoEntry {
  title: string
  description: string
  /** Page hero/share image path under /public (defaults to the logo). */
  image?: string
}

// -----------------------------------------------------------------------------
// Per-page SEO Title + Meta Description — verbatim from the content spec.
// Keyed by exact route pathname (with trailing slash, as the routes are defined).
// -----------------------------------------------------------------------------
export const SEO: Record<string, SeoEntry> = {
  '/': {
    title: 'Property Management Company in Doha | Dania Real Estate',
    description:
      'Looking for premium villas or apartments for rent in Doha? Dania Real Estate offers 0% commission, all-inclusive rentals with 24/7 support. View listings!',
    image: '/apartments-for-rent-doha-qatar-dania-real-estate.webp',
  },
  '/about-company/': {
    title: 'About Dania Real Estate | Property Management Experts in Doha',
    description:
      'Discover Dania Real Estate, a certified property management company in Doha, Qatar. We provide trusted, transparent leasing solutions for apartments, villas, and commercial shops.',
    image: '/about-dania-real-estate-qatar.webp',
  },
  '/about-company/why-choose-us/': {
    title: 'Why Choose Dania Real Estate | Trusted Rental Support Qatar',
    description:
      'Discover why tenants, families, and businesses trust Dania Real Estate for direct communication, 100% verified property listings, and premium rental options in Doha.',
    image: '/why-choose-dania-real-estate-qatar.webp',
  },
  '/about-company/gallery/': {
    title: 'Dania Real Estate Gallery | Rental Property Layout Photos Qatar',
    description:
      'Explore verified rental property layouts across Doha and Qatar. View high-quality interior and exterior photos of apartments, villas, shops, and staff housing.',
    image: '/modern-residential-developments-qatar.webp',
  },
  '/apartments-for-rent/': {
    title: 'Apartments for Rent in Doha | Verified Flats Qatar | Dania Real Estate',
    description:
      'Browse verified apartments for rent in Doha and greater Qatar. Discover 1, 2, and 3-bedroom flat layouts with transparent leasing options and direct WhatsApp support.',
    image: '/apartments-for-rent-doha-qatar-dania-real-estate.webp',
  },
  '/apartments-for-rent/1-bedroom/': {
    title: '1 Bedroom Apartments for Rent in Doha | 1 BHK Flats Qatar',
    description:
      'Explore verified 1 bedroom apartments for rent in Doha and greater Qatar. Find modern 1-BHK layouts for single professionals and couples with direct WhatsApp support.',
    image: '/1-bedroom-apartments-for-rent-doha-qatar.webp',
  },
  '/apartments-for-rent/2-bedroom/': {
    title: '2 Bedroom Apartments for Rent in Doha | 2 BHK Flats Qatar',
    description:
      'Browse verified 2 bedroom apartments for rent in Doha and greater Qatar. Find spacious 2-BHK layouts for small families and shared executive living with direct WhatsApp support.',
    image: '/2-bedroom-apartments-for-rent-doha-qatar.webp',
  },
  '/apartments-for-rent/3-bedroom/': {
    title: '3 Bedroom Apartments for Rent in Doha | 3 BHK Family Flats Qatar',
    description:
      'Find verified 3 bedroom apartments for rent in Doha and greater Qatar. Explore spacious 3-BHK floor plans with dedicated family amenities and direct WhatsApp support.',
    image: '/3-bedroom-apartments-for-rent-doha-qatar.webp',
  },
  '/villas-for-rent/': {
    title: 'Villas for Rent in Doha | Luxury & Compound Villas Qatar',
    description:
      'Discover premium villas for rent in Doha and greater Qatar. Explore standalone private properties and managed compound villas with active WhatsApp leasing support.',
    image: '/villas-for-rent-doha-qatar-dania-real-estate.webp',
  },
  '/villas-for-rent/standard-villas/': {
    title: 'Standard Villas for Rent in Doha | Standalone Private Homes Qatar',
    description:
      'Browse verified standard and standalone villas for rent in Doha and greater Qatar. Find independent family homes with private perimeters and direct WhatsApp support.',
    image: '/standard-villas-for-rent-doha-qatar.webp',
  },
  '/villas-for-rent/compound-villas/': {
    title: 'Compound Villas for Rent in Doha | Gated Family Communities Qatar',
    description:
      'Find premium compound villas for rent in Doha and greater Qatar. Explore secure, managed family complexes with shared pools, gyms, and direct WhatsApp support.',
    image: '/compound-villas-for-rent-doha-qatar.webp',
  },
  '/staff-accommodation/': {
    title: 'Staff Accommodation in Doha | Corporate Employee Housing Qatar',
    description:
      'Source compliant staff accommodation in Doha and greater Qatar. Explore vetted corporate housing blocks, supervisor apartments, and staff villas with direct B2B WhatsApp desk support.',
    image: '/staff-accommodation-doha-qatar-dania-real-estate.webp',
  },
  '/staff-accommodation/staff-villas/': {
    title: 'Staff Villas for Rent in Doha | Employee Villa Housing Qatar',
    description:
      'Source verified staff villas for rent in Doha and greater Qatar. Find high-capacity independent villas for technical teams and supervisors with direct B2B WhatsApp desk support.',
    image: '/staff-villas-for-rent-doha-qatar.webp',
  },
  '/shops-for-rent/': {
    title: 'Shops for Rent in Doha | Retail Spaces & Storefronts Qatar',
    description:
      'Source premium shops for rent in Doha and greater Qatar. Explore high-footfall retail storefronts, showrooms, and shell-and-core commercial spaces with direct WhatsApp support.',
    image: '/shops-for-rent-doha-qatar-dania-real-estate.webp',
  },
  '/studio-partition-rentals/': {
    title: 'Studio & Partition Rooms for Rent in Doha | Budget Housing Qatar',
    description:
      'Explore affordable studios, partition rooms, and compact 1-bedroom rentals for rent in Doha and greater Qatar. Find budget-friendly solo expat housing with direct WhatsApp support.',
    image: '/studio-and-partition-rentals-doha-qatar.webp',
  },
  '/studio-partition-rentals/studio-for-rent/': {
    title: 'Studio for Rent in Doha | Private Self-Contained Units Qatar',
    description:
      'Find fully self-contained studios for rent in Doha and greater Qatar. Explore premium private layouts, villa-outbuilding studios, and fully fitted units with WhatsApp support.',
    image: '/studio-for-rent-doha-qatar.webp',
  },
  '/studio-partition-rentals/partition-room-for-rent/': {
    title: 'Partition Room for Rent in Doha | Shared Budget Housing Qatar',
    description:
      'Find affordable partition rooms for rent in Doha and greater Qatar. Explore cost-effective shared villa subdivisions and all-inclusive flatshares with direct WhatsApp support.',
    image: '/partition-room-for-rent-doha-qatar.webp',
  },
  '/studio-partition-rentals/one-bedroom-for-rent/': {
    title: 'One Bedroom for Rent in Doha | Compact 1BHK Rentals Qatar',
    description:
      'Find affordable, compact one-bedroom rentals for rent in Doha and greater Qatar. Explore private budget-conscious 1BHK villa portions with direct WhatsApp support.',
    image: '/one-bedroom-for-rent-doha-qatar.webp',
  },
  '/areas/': {
    title: 'Areas We Serve in Qatar | Dania Real Estate Rental Locations',
    description:
      'Explore the major residential and commercial rental locations served by Dania Real Estate across Qatar. Find apartments, villas, and staff spaces by area.',
    image: '/modern-residential-developments-qatar.webp',
  },
  '/faq/': {
    title: 'Rental Property FAQ Qatar | Tenancy Guide & Rules | Dania Real Estate',
    description:
      'Get expert answers to frequently asked questions about renting apartments, family villas, retail shops, and corporate staff accommodation in Qatar. Learn about Baladiya registration, Kahramaa setup, and leasing laws.',
    image: '/why-choose-dania-real-estate-qatar.webp',
  },
  '/contact-us/': {
    title: 'Contact Dania Real Estate Qatar | Call or WhatsApp Leasing Desk',
    description:
      'Contact Dania Real Estate Doha for verified properties for rent in Qatar. Connect with our leasing desk via Call or WhatsApp for apartments, family villas, storefront shops, and staff housing.',
    image: '/about-dania-real-estate-qatar.webp',
  },
}

// Area-detail SEO (per spec). The full per-area body lives in AreaDetailPage;
// these mirror the spec's SEO Title + Meta Description so the head is correct
// for every /areas/<slug>/ route via the central lookup.
export const AREA_SEO: Record<string, SeoEntry> = {
  doha: {
    title: 'Properties for Rent in Doha | Dania Real Estate Qatar',
    description:
      'Explore verified properties for rent in Doha with Dania Real Estate. Browse apartments, residential villas, commercial retail shops, and compact rentals across Central Doha, Al Dafna, Al Hilal, and Al Mamoura.',
  },
  'al-sadd': {
    title: 'Properties for Rent in Al Sadd Doha | Dania Real Estate Qatar',
    description:
      'Find verified properties for rent in Al Sadd, Doha. Explore vertical residential apartments, executive standalone spaces, main-road commercial shops, and compact rentals near Joaan Metro Station with Dania Real Estate.',
  },
  'bin-mahmoud': {
    title: 'Properties for Rent in Bin Mahmoud Doha | Dania Real Estate Qatar',
    description:
      'Explore verified properties for rent in Bin Mahmoud, Doha with Dania Real Estate. Find executive apartments, commercial shops, staff units, and compact studios near the Bin Mahmoud Metro Gold Line.',
  },
  'al-wakra': {
    title: 'Properties for Rent in Al Wakra Qatar | Dania Real Estate',
    description:
      'Find verified properties for rent in Al Wakra, Qatar. Explore spacious family villas, affordable residential apartments, staff housing, and retail shops near Al Wakra Metro Red Line with Dania Real Estate.',
  },
  'al-aziziya': {
    title: 'Properties for Rent in Al Aziziya & Abu Hamour | Dania Real Estate',
    description:
      'Find verified properties for rent in Al Aziziya and Abu Hamour. Explore premium family villas, residential apartments, staff units, and Salwa Road commercial shops with Dania Real Estate.',
  },
  'old-airport': {
    title: 'Properties for Rent in Old Airport & Rawdat Al Matar | Dania Real Estate',
    description:
      'Find properties for rent in Old Airport and Rawdat Al Matar, Doha. Explore low-rise apartments, standalone villas, worker housing, and prime Matar Qadeem commercial shops with Dania Real Estate.',
  },
  'umm-salal': {
    title: 'Properties for Rent in Umm Salal Mohammed | Dania Real Estate Qatar',
    description:
      'Explore properties for rent in Umm Salal Mohammed, Umm Salal Ali, and Umm Qarn. Find premium family villas, budget apartments, retail shops, and corporate staff housing along the Al Shamal Road corridor.',
  },
  'al-kharaitiyat': {
    title: 'Properties for Rent in Al Kharaitiyat | Dania Real Estate Qatar',
    description:
      'Find properties for rent in Al Kharaitiyat, Qatar. Explore spacious family villas, modern low-rise apartments, and retail shops near Doha Festival City and IKEA with Dania Real Estate.',
  },
  'al-waab': {
    title: 'Properties for Rent in Al Waab | Dania Real Estate Qatar',
    description:
      "Explore properties for rent in Al Waab, Qatar with Dania Real Estate. Find family villas, low-rise apartments, staff housing, and retail shops near Aspire Zone and Villaggio Mall.",
  },
}

/** Resolve the SEO entry for a given pathname (handles /areas/<slug>/). */
export function resolveSeo(pathname: string): SeoEntry {
  if (SEO[pathname]) return SEO[pathname]
  const areaMatch = pathname.match(/^\/areas\/([^/]+)\/$/)
  if (areaMatch && AREA_SEO[areaMatch[1]]) return AREA_SEO[areaMatch[1]]
  // Fallback to the home entry so the head is never the build placeholder.
  return SEO['/']
}

// -----------------------------------------------------------------------------
// Structured data (JSON-LD)
// -----------------------------------------------------------------------------

/** Sitewide LocalBusiness / RealEstateAgent + WebSite schema (per spec §12128). */
export function organizationSchema(): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: company.name,
      legalName: company.name,
      url: `${SITE_ORIGIN}/`,
      logo: `${SITE_ORIGIN}/Dania_Real_Estate_logo.png`,
      image: `${SITE_ORIGIN}/about-dania-real-estate-qatar.webp`,
      telephone: company.phone,
      email: company.email,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3rd Floor, Al Muftah Plaza Building, Al Rayyan Road',
        addressLocality: 'Doha',
        addressCountry: 'QA',
      },
      areaServed: { '@type': 'Country', name: 'Qatar' },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '08:00',
          closes: '17:00',
        },
      ],
      sameAs: [company.facebook, company.instagram],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: company.name,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    },
  ]
}

/** ContactPage schema (per spec — injected on /contact-us/). */
export function contactPageSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_ORIGIN}/contact-us/#contactpage`,
    url: `${SITE_ORIGIN}/contact-us/`,
    name: 'Contact Dania Real Estate',
    about: { '@id': `${SITE_ORIGIN}/#organization` },
  }
}

/** FAQPage schema from a list of question/answer pairs. */
export function faqPageSchema(items: { q: string; a: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}
