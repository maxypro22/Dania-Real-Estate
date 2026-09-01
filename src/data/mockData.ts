import settings from '@/content/settings.json'

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'compound-villa'
  | 'shop'
  | 'staff'
  | 'studio'
  | 'partition'

/** The leasing consultant shown on a listing card / detail page. */
export interface PropertyAgent {
  name: string
  role: string
  /** Display phone, e.g. "+974 3326 0393". */
  phone: string
  /** Digits-only WhatsApp number, e.g. "97433260393". */
  whatsapp: string
  photo: string
}

export interface Property {
  id: number
  /** URL segment for /properties/<slug>/ — stable, unique, lowercase. */
  slug: string
  title: string
  type: PropertyType
  subtype?: string
  price: number
  currency: string
  period: string
  bedrooms: number | null
  bathrooms: number | null
  area: number
  location: string
  district: string
  furnished: boolean
  verified: boolean
  tags: string[]
  /** Cover photo (also the first gallery frame). */
  image: string
  /** Full photo gallery — cover first. */
  images: string[]
  description: string
  amenities: string[]
  agent: PropertyAgent
  /** How long ago the listing went live, in days (drives "Listed x ago"). */
  listedDaysAgo: number
  /** Public listing reference, e.g. "DRE-1042". */
  reference: string
  /** Renders the wide "Premium" row card at the top of the results list. */
  premium?: boolean
  floor?: string
  parking?: number
}

// ── Demo photography ─────────────────────────────────────────────────────────
// Unsplash is the only third-party image host allowed by the CSP in
// vercel.json. Replace these with the client's own photos from /dashboard →
// Images (each src can be overridden without touching this file).
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

const PHOTOS: Record<PropertyType, string[]> = {
  apartment: [
    '1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688', '1545324418-cc1a3fa10c00',
    '1560448204-e02f11c3d0e2', '1493809842364-78817add7ffb', '1512917774080-9991f1c4c750',
    '1484154218962-a197022b5858', '1556909212-d5b604d0c90d', '1600607687939-ce8a6c25118c',
    '1600585154340-be6161a56a0c', '1560185007-cde436f6a4d0', '1502005229762-cf1b2da7c5d6',
  ],
  villa: [
    '1613490493576-7fde63acd811', '1600596542815-ffad4c1539a9', '1568605114967-8130f3a36994',
    '1580587771525-78b9dba3b914', '1600585154526-990dced4db0d', '1583608205776-bfd35f0d9f83',
    '1600607687920-4e2a09cf159d', '1600566753190-17f0baa2a6c3',
  ],
  'compound-villa': [
    '1564013799919-ab600027ffc6', '1512453979798-5ea266f8880c', '1600047509807-ba8f99d2cdde',
    '1613977257363-707ba9348227', '1600210492486-724fe5c67fb0', '1600566753086-00f18fb6b3ea',
  ],
  shop: [
    '1441986300917-64674bd600d8', '1497366216548-37526070297c', '1497366754035-f200968a6e72',
    '1604328698692-f76ea9498e76', '1556742049-0cfed4f6a45d',
  ],
  staff: [
    '1555854877-bab0e564b8d5', '1631049307264-da0ec9d70304', '1522771739844-6a9f6d5f14af',
    '1595526114035-0d45ed16cfbf', '1540518614846-7eded433c457',
  ],
  studio: [
    '1502672260266-1c1ef2d93688', '1554995207-c18c203602cb', '1493809842364-78817add7ffb',
    '1522708323590-d24dbb6b0267', '1586023492125-27b2c045efd7',
  ],
  partition: [
    '1505691938895-1758d7feb511', '1560448204-e02f11c3d0e2', '1522708323590-d24dbb6b0267',
    '1595526114035-0d45ed16cfbf',
  ],
}

/** Deterministic 6-photo gallery per listing, offset so neighbours differ. */
function gallery(type: PropertyType, offset: number, count = 6): string[] {
  const pool = PHOTOS[type]
  return Array.from({ length: Math.min(count, pool.length) }, (_, i) =>
    u(pool[(offset + i) % pool.length]),
  )
}

// ── Leasing team ─────────────────────────────────────────────────────────────
// Phones intentionally mirror the company's three public lines so every Call /
// WhatsApp button on a listing reaches the real desk.
const AGENTS: PropertyAgent[] = [
  {
    name: 'Dania Leasing Desk',
    role: 'Residential Rentals',
    phone: settings.company.phone,
    whatsapp: settings.company.whatsapp,
    photo: '/Dania_Real_Estate_logo.png',
  },
  {
    name: 'Dania Corporate Desk',
    role: 'Staff & Corporate Housing',
    phone: settings.company.phone2,
    whatsapp: settings.company.whatsapp,
    photo: '/Dania_Real_Estate_logo.png',
  },
  {
    name: 'Dania Commercial Desk',
    role: 'Retail & Commercial Leasing',
    phone: settings.company.officePhone,
    whatsapp: settings.company.whatsapp,
    photo: '/Dania_Real_Estate_logo.png',
  },
]

const TYPE_NOUN: Record<PropertyType, string> = {
  apartment: 'apartment',
  villa: 'villa',
  'compound-villa': 'compound villa',
  shop: 'retail unit',
  staff: 'staff accommodation block',
  studio: 'studio',
  partition: 'partition room',
}

/** Deterministic listing copy built from the unit's own attributes. */
function describe(p: Omit<Property, 'description'>): string {
  const noun = TYPE_NOUN[p.type]
  const size = `${p.area} m²`
  const rooms =
    p.bedrooms === null
      ? ''
      : p.bedrooms === 0
        ? 'Open-plan studio layout'
        : `${p.bedrooms} bedroom${p.bedrooms > 1 ? 's' : ''}${p.bathrooms ? ` and ${p.bathrooms} bathroom${p.bathrooms > 1 ? 's' : ''}` : ''}`
  const furnish = p.furnished ? 'Delivered fully furnished and move-in ready' : 'Handed over unfurnished, ready for your own fit-out'

  return [
    `A ${size} ${noun} in ${p.location}, managed directly by Dania Real Estate.`,
    rooms ? `${rooms} across a practical, well-lit layout.` : 'Configured for shared occupancy with managed common areas.',
    `${furnish}. ${p.amenities.slice(0, 3).join(', ')} are included with the unit.`,
    'Leased with transparent terms and zero hidden commission — the advertised rent is exactly what you pay. WhatsApp our leasing desk to arrange a viewing, usually within 24–48 hours.',
  ].join(' ')
}

type Seed = Omit<Property, 'description' | 'image' | 'images' | 'agent' | 'reference'> & {
  agent?: number
  photoOffset?: number
}

function mk(seed: Seed): Property {
  const { agent = 0, photoOffset, ...rest } = seed
  const images = gallery(rest.type, photoOffset ?? rest.id)
  const full: Omit<Property, 'description'> = {
    ...rest,
    image: images[0],
    images,
    agent: AGENTS[agent],
    reference: `DRE-${1000 + rest.id}`,
  }
  return { ...full, description: describe(full) }
}

export const properties: Property[] = [
  // ── Apartments ─────────────────────────────────────────────────────────────
  mk({ id: 1, slug: '1-bedroom-apartment-al-sadd-doha', title: '1 Bedroom Apartment with Balcony — Al Sadd', type: 'apartment', subtype: '1-bedroom', price: 4500, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 1, area: 75, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: true, verified: true, listedDaysAgo: 2, floor: '6th floor', parking: 1, premium: true, tags: ['All Inclusive', 'Zero Commission', 'Metro Nearby'], amenities: ['Central A/C', 'Balcony', 'Covered Parking', 'Kahramaa Included', 'High-Speed Internet', '24/7 Security', 'Lift', 'Gym Access'] }),
  mk({ id: 2, slug: '1-bedroom-apartment-bin-mahmoud-doha', title: 'Furnished 1 BHK near Bin Mahmoud Metro', type: 'apartment', subtype: '1-bedroom', price: 4200, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 1, area: 70, location: 'Bin Mahmoud, Doha', district: 'Bin Mahmoud', furnished: true, verified: true, listedDaysAgo: 5, floor: '3rd floor', parking: 1, tags: ['Verified', 'Zero Commission'], amenities: ['Central A/C', 'Furnished', 'Kahramaa Included', 'Lift', 'Security', 'Internet'] }),
  mk({ id: 3, slug: '2-bedroom-apartment-old-airport-doha', title: '2 Bedroom Family Apartment — Old Airport', type: 'apartment', subtype: '2-bedroom', price: 6500, currency: 'QAR', period: '/month', bedrooms: 2, bathrooms: 2, area: 110, location: 'Old Airport, Doha', district: 'Old Airport', furnished: true, verified: true, listedDaysAgo: 1, floor: '4th floor', parking: 1, tags: ['All Inclusive', 'Parking'], amenities: ['Central A/C', 'Covered Parking', 'Kahramaa Included', 'Balcony', 'Lift', 'Maintenance'] }),
  mk({ id: 4, slug: '2-bedroom-apartment-al-aziziya', title: 'Spacious 2 BHK with Balcony — Al Aziziya', type: 'apartment', subtype: '2-bedroom', price: 5800, currency: 'QAR', period: '/month', bedrooms: 2, bathrooms: 2, area: 100, location: 'Al Aziziya, Doha', district: 'Al Aziziya', furnished: false, verified: true, listedDaysAgo: 9, floor: '2nd floor', parking: 1, tags: ['Zero Commission', 'Balcony'], amenities: ['Split A/C', 'Balcony', 'Parking', 'Lift', 'Security'] }),
  mk({ id: 5, slug: '3-bedroom-apartment-al-wakra', title: '3 Bedroom Apartment near Al Wakra Metro', type: 'apartment', subtype: '3-bedroom', price: 9500, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 2, area: 160, location: 'Al Wakra, Qatar', district: 'Al Wakra', furnished: false, verified: true, listedDaysAgo: 14, floor: '5th floor', parking: 2, tags: ['Spacious', 'Verified'], amenities: ['Central A/C', 'Maid Room', 'Covered Parking', 'Balcony', 'Lift', 'Security'] }),
  mk({ id: 6, slug: '3-bedroom-apartment-umm-salal-mohammed', title: '3 BHK with Garden View — Umm Salal Mohammed', type: 'apartment', subtype: '3-bedroom', price: 8800, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 3, area: 175, location: 'Umm Salal Mohammed', district: 'Umm Salal Mohammed', furnished: true, verified: true, listedDaysAgo: 21, floor: '1st floor', parking: 2, tags: ['All Inclusive', 'Garden'], amenities: ['Central A/C', 'Garden View', 'Kahramaa Included', 'Parking', 'Maid Room', 'Storage'] }),
  mk({ id: 18, slug: '1-bedroom-apartment-al-mansoura', title: 'Bright 1 Bedroom Flat — Al Mansoura', type: 'apartment', subtype: '1-bedroom', price: 3900, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 1, area: 62, location: 'Al Mansoura, Doha', district: 'Al Sadd', furnished: true, verified: true, listedDaysAgo: 3, floor: '8th floor', parking: 1, tags: ['All Inclusive', 'Metro Nearby'], amenities: ['Central A/C', 'Furnished', 'Kahramaa Included', 'Lift', 'Internet'] }),
  mk({ id: 19, slug: '1-bedroom-apartment-al-waab', title: 'Modern 1 BHK near Villaggio — Al Waab', type: 'apartment', subtype: '1-bedroom', price: 5200, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 2, area: 84, location: 'Al Waab, Doha', district: 'Al Waab', furnished: true, verified: true, listedDaysAgo: 6, floor: '10th floor', parking: 1, tags: ['Pool', 'Gym', 'Zero Commission'], amenities: ['Central A/C', 'Shared Pool', 'Gym', 'Covered Parking', 'Concierge', 'Balcony'] }),
  mk({ id: 20, slug: '2-bedroom-apartment-al-sadd-doha', title: '2 Bedroom Apartment with Gym & Pool — Al Sadd', type: 'apartment', subtype: '2-bedroom', price: 7400, currency: 'QAR', period: '/month', bedrooms: 2, bathrooms: 2, area: 118, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: true, verified: true, listedDaysAgo: 4, floor: '12th floor', parking: 1, tags: ['Pool', 'Gym', 'All Inclusive'], amenities: ['Central A/C', 'Shared Pool', 'Gym', 'Kahramaa Included', 'Covered Parking', 'Security'] }),
  mk({ id: 21, slug: '2-bedroom-apartment-al-kharaitiyat', title: 'Family 2 BHK near Festival City — Al Kharaitiyat', type: 'apartment', subtype: '2-bedroom', price: 5400, currency: 'QAR', period: '/month', bedrooms: 2, bathrooms: 2, area: 105, location: 'Al Kharaitiyat, Qatar', district: 'Al Kharaitiyat', furnished: false, verified: true, listedDaysAgo: 12, floor: '3rd floor', parking: 1, tags: ['Family Building', 'Parking'], amenities: ['Split A/C', 'Parking', 'Balcony', 'Lift', 'Security'] }),
  mk({ id: 22, slug: '2-bedroom-apartment-bin-mahmoud', title: 'Semi-Furnished 2 BHK — Bin Mahmoud', type: 'apartment', subtype: '2-bedroom', price: 6100, currency: 'QAR', period: '/month', bedrooms: 2, bathrooms: 2, area: 98, location: 'Bin Mahmoud, Doha', district: 'Bin Mahmoud', furnished: true, verified: true, listedDaysAgo: 18, floor: '7th floor', parking: 1, tags: ['Metro Nearby', 'Zero Commission'], amenities: ['Central A/C', 'Semi Furnished', 'Lift', 'Covered Parking', 'Security'] }),
  mk({ id: 23, slug: '3-bedroom-apartment-al-sadd-doha', title: 'Large 3 Bedroom Apartment with Maid Room — Al Sadd', type: 'apartment', subtype: '3-bedroom', price: 11000, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 3, area: 190, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: true, verified: true, listedDaysAgo: 7, floor: '15th floor', parking: 2, premium: true, tags: ['All Inclusive', 'Maid Room', 'Pool'], amenities: ['Central A/C', 'Maid Room', 'Shared Pool', 'Gym', 'Kahramaa Included', 'Covered Parking', 'Concierge', 'Balcony'] }),
  mk({ id: 24, slug: '3-bedroom-apartment-old-airport', title: '3 BHK Family Flat — Rawdat Al Matar', type: 'apartment', subtype: '3-bedroom', price: 7800, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 3, area: 165, location: 'Rawdat Al Matar, Doha', district: 'Old Airport', furnished: false, verified: true, listedDaysAgo: 25, floor: '2nd floor', parking: 1, tags: ['Family Building', 'Spacious'], amenities: ['Split A/C', 'Balcony', 'Parking', 'Storage', 'Lift'] }),
  mk({ id: 25, slug: '3-bedroom-apartment-al-aziziya', title: '3 Bedroom Apartment near Salwa Road — Al Aziziya', type: 'apartment', subtype: '3-bedroom', price: 8200, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 2, area: 155, location: 'Al Aziziya, Doha', district: 'Al Aziziya', furnished: true, verified: true, listedDaysAgo: 30, floor: '9th floor', parking: 1, tags: ['All Inclusive', 'Verified'], amenities: ['Central A/C', 'Kahramaa Included', 'Covered Parking', 'Lift', 'Security', 'Balcony'] }),

  // ── Standard villas ────────────────────────────────────────────────────────
  mk({ id: 7, slug: 'standard-villa-al-kharaitiyat', title: '4 Bedroom Standalone Villa — Al Kharaitiyat', type: 'villa', subtype: 'standard', price: 15000, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 3, area: 320, location: 'Al Kharaitiyat, Qatar', district: 'Al Kharaitiyat', furnished: false, verified: true, listedDaysAgo: 8, parking: 3, tags: ['Private Garden', 'Parking'], amenities: ['Private Garden', 'Driver Room', 'Maid Room', 'Central A/C', 'Covered Parking', 'Storage', 'Majlis'] }),
  mk({ id: 8, slug: 'standard-villa-al-wakra', title: '4 Bedroom Villa with Maid & Driver Rooms — Al Wakra', type: 'villa', subtype: 'standard', price: 13500, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 4, area: 350, location: 'Al Wakra, Qatar', district: 'Al Wakra', furnished: false, verified: true, listedDaysAgo: 16, parking: 3, tags: ['Driver Room', 'Maid Room'], amenities: ['Driver Room', 'Maid Room', 'Private Yard', 'Central A/C', 'Parking', 'Majlis'] }),
  mk({ id: 26, slug: 'standard-villa-umm-salal', title: '5 Bedroom Family Villa — Umm Salal Ali', type: 'villa', subtype: 'standard', price: 17500, currency: 'QAR', period: '/month', bedrooms: 5, bathrooms: 5, area: 420, location: 'Umm Salal Ali, Qatar', district: 'Umm Salal Mohammed', furnished: false, verified: true, listedDaysAgo: 11, parking: 4, tags: ['Spacious', 'Private Garden'], amenities: ['Private Garden', 'Maid Room', 'Driver Room', 'Majlis', 'Central A/C', 'Covered Parking', 'Storage'] }),
  mk({ id: 27, slug: 'standard-villa-al-waab', title: 'Executive 4 Bedroom Villa — Al Waab', type: 'villa', subtype: 'standard', price: 19000, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 4, area: 380, location: 'Al Waab, Doha', district: 'Al Waab', furnished: true, verified: true, listedDaysAgo: 3, parking: 3, premium: true, tags: ['Furnished', 'Private Pool'], amenities: ['Private Pool', 'Private Garden', 'Maid Room', 'Driver Room', 'Central A/C', 'Majlis', 'Covered Parking', 'Smart Home'] }),
  mk({ id: 28, slug: 'standard-villa-old-airport', title: '3 Bedroom Villa near Matar Qadeem — Old Airport', type: 'villa', subtype: 'standard', price: 11500, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 3, area: 260, location: 'Old Airport, Doha', district: 'Old Airport', furnished: false, verified: true, listedDaysAgo: 22, parking: 2, tags: ['Zero Commission', 'Parking'], amenities: ['Private Yard', 'Central A/C', 'Parking', 'Storage', 'Majlis'] }),

  // ── Compound villas ────────────────────────────────────────────────────────
  mk({ id: 9, slug: 'compound-villa-al-sadd', title: '5 Bedroom Compound Villa with Shared Pool — Al Sadd', type: 'compound-villa', subtype: 'compound', price: 18000, currency: 'QAR', period: '/month', bedrooms: 5, bathrooms: 4, area: 420, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: false, verified: true, listedDaysAgo: 5, parking: 2, premium: true, tags: ['Shared Pool', 'Security', 'Parking'], amenities: ['Shared Pool', 'Gym', '24/7 Security', 'Children Play Area', 'Maid Room', 'Central A/C', 'Covered Parking', 'Landscaped Grounds'] }),
  mk({ id: 10, slug: 'compound-villa-bin-mahmoud', title: '4 Bedroom Compound Villa with Gym — Bin Mahmoud', type: 'compound-villa', subtype: 'compound', price: 16500, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 3, area: 380, location: 'Bin Mahmoud, Doha', district: 'Bin Mahmoud', furnished: true, verified: true, listedDaysAgo: 13, parking: 2, tags: ['Shared Pool', 'Gym'], amenities: ['Shared Pool', 'Gym', '24/7 Security', 'Maid Room', 'Central A/C', 'Covered Parking'] }),
  mk({ id: 29, slug: 'compound-villa-al-waab', title: '4 Bedroom Gated Compound Villa — Al Waab', type: 'compound-villa', subtype: 'compound', price: 21000, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 5, area: 400, location: 'Al Waab, Doha', district: 'Al Waab', furnished: true, verified: true, listedDaysAgo: 2, parking: 2, tags: ['Furnished', 'Shared Pool', 'Gym'], amenities: ['Shared Pool', 'Gym', 'Children Play Area', '24/7 Security', 'Maid Room', 'Driver Room', 'Central A/C', 'Covered Parking'] }),
  mk({ id: 30, slug: 'compound-villa-al-kharaitiyat', title: '3 Bedroom Compound Villa — Al Kharaitiyat', type: 'compound-villa', subtype: 'compound', price: 13800, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 3, area: 300, location: 'Al Kharaitiyat, Qatar', district: 'Al Kharaitiyat', furnished: false, verified: true, listedDaysAgo: 19, parking: 2, tags: ['Family Compound', 'Security'], amenities: ['Shared Pool', '24/7 Security', 'Children Play Area', 'Central A/C', 'Parking', 'Landscaped Grounds'] }),
  mk({ id: 31, slug: 'compound-villa-umm-salal', title: '4 Bedroom Compound Villa with Play Area — Umm Salal', type: 'compound-villa', subtype: 'compound', price: 15200, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 4, area: 340, location: 'Umm Salal Mohammed', district: 'Umm Salal Mohammed', furnished: false, verified: true, listedDaysAgo: 27, parking: 2, tags: ['Shared Pool', 'Family Compound'], amenities: ['Shared Pool', 'Children Play Area', '24/7 Security', 'Maid Room', 'Central A/C', 'Covered Parking'] }),

  // ── Staff accommodation ────────────────────────────────────────────────────
  mk({ id: 11, slug: 'staff-villa-industrial-area', title: 'Staff Villa with Canteen — Industrial Area', type: 'staff', price: 2200, currency: 'QAR', period: '/bed/month', bedrooms: null, bathrooms: null, area: 280, location: 'Industrial Area, Doha', district: 'Doha', furnished: true, verified: true, listedDaysAgo: 6, agent: 1, tags: ['AC', 'Canteen', '24/7 Security'], amenities: ['Central A/C', 'Canteen', '24/7 Security', 'Laundry Room', 'Bunk Beds', 'Wi-Fi', 'Bus Parking'] }),
  mk({ id: 12, slug: 'staff-accommodation-old-airport', title: 'Staff Accommodation Block — Old Airport', type: 'staff', price: 1900, currency: 'QAR', period: '/bed/month', bedrooms: null, bathrooms: null, area: 200, location: 'Old Airport, Doha', district: 'Old Airport', furnished: true, verified: true, listedDaysAgo: 15, agent: 1, tags: ['WiFi', 'Canteen', 'Laundry'], amenities: ['Wi-Fi', 'Canteen', 'Laundry Room', 'Split A/C', 'Security', 'Recreation Room'] }),
  mk({ id: 32, slug: 'staff-accommodation-birkat-al-awamer', title: 'Corporate Labour Camp — Birkat Al Awamer', type: 'staff', price: 1650, currency: 'QAR', period: '/bed/month', bedrooms: null, bathrooms: null, area: 520, location: 'Birkat Al Awamer, Qatar', district: 'Doha', furnished: true, verified: true, listedDaysAgo: 10, agent: 1, tags: ['Bulk Capacity', 'Canteen', 'Bus Parking'], amenities: ['Canteen', 'Laundry Room', 'Bus Parking', 'Clinic Room', '24/7 Security', 'Wi-Fi', 'Split A/C'] }),
  mk({ id: 33, slug: 'staff-villa-al-wakra', title: 'Managed Staff Villa — Al Wakra', type: 'staff', price: 2400, currency: 'QAR', period: '/bed/month', bedrooms: null, bathrooms: null, area: 310, location: 'Al Wakra, Qatar', district: 'Al Wakra', furnished: true, verified: true, listedDaysAgo: 20, agent: 1, tags: ['AC', 'Managed', 'Laundry'], amenities: ['Central A/C', 'Laundry Room', 'Canteen', 'Housekeeping', '24/7 Security', 'Wi-Fi'] }),

  // ── Shops & commercial ─────────────────────────────────────────────────────
  mk({ id: 13, slug: 'shop-for-rent-al-sadd', title: 'Ground Floor Shop on Main Road — Al Sadd', type: 'shop', price: 12000, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: 1, area: 80, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: false, verified: true, listedDaysAgo: 4, agent: 2, parking: 2, premium: true, tags: ['Ground Floor', 'High Footfall', 'Zero Commission'], amenities: ['Glass Frontage', 'Ground Floor', 'Customer Parking', 'Split A/C', 'Signage Space', 'Pantry'] }),
  mk({ id: 14, slug: 'office-shop-al-aziziya', title: 'Retail / Office Unit — Al Aziziya', type: 'shop', price: 9500, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: 1, area: 60, location: 'Al Aziziya, Doha', district: 'Al Aziziya', furnished: false, verified: true, listedDaysAgo: 17, agent: 2, parking: 1, tags: ['Commercial', 'Parking'], amenities: ['Split A/C', 'Parking', 'Signage Space', 'Pantry', 'Security'] }),
  mk({ id: 34, slug: 'shop-for-rent-old-airport', title: 'Corner Shop on Matar Qadeem — Old Airport', type: 'shop', price: 14500, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: 1, area: 95, location: 'Old Airport, Doha', district: 'Old Airport', furnished: false, verified: true, listedDaysAgo: 9, agent: 2, parking: 3, tags: ['Corner Unit', 'High Footfall'], amenities: ['Glass Frontage', 'Corner Unit', 'Customer Parking', 'Signage Space', 'Storage', 'Split A/C'] }),
  mk({ id: 35, slug: 'showroom-for-rent-al-wakra', title: 'Showroom with Mezzanine — Al Wakra', type: 'shop', price: 18000, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: 2, area: 150, location: 'Al Wakra, Qatar', district: 'Al Wakra', furnished: false, verified: true, listedDaysAgo: 24, agent: 2, parking: 4, tags: ['Showroom', 'Mezzanine'], amenities: ['Mezzanine Floor', 'Glass Frontage', 'Customer Parking', 'Loading Access', 'Central A/C', 'Storage'] }),

  // ── Studios & partitions ───────────────────────────────────────────────────
  mk({ id: 15, slug: 'studio-for-rent-bin-mahmoud', title: 'All-Inclusive Studio — Bin Mahmoud', type: 'studio', price: 3200, currency: 'QAR', period: '/month', bedrooms: 0, bathrooms: 1, area: 42, location: 'Bin Mahmoud, Doha', district: 'Bin Mahmoud', furnished: true, verified: true, listedDaysAgo: 1, floor: '5th floor', tags: ['All Inclusive', 'Zero Commission'], amenities: ['Split A/C', 'Furnished', 'Kahramaa Included', 'Wi-Fi', 'Kitchenette', 'Lift'] }),
  mk({ id: 36, slug: 'studio-for-rent-al-sadd', title: 'Furnished Studio near Joaan Metro — Al Sadd', type: 'studio', price: 3600, currency: 'QAR', period: '/month', bedrooms: 0, bathrooms: 1, area: 48, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: true, verified: true, listedDaysAgo: 7, floor: '9th floor', tags: ['Metro Nearby', 'All Inclusive'], amenities: ['Split A/C', 'Furnished', 'Kahramaa Included', 'Wi-Fi', 'Kitchenette', 'Security'] }),
  mk({ id: 37, slug: 'studio-for-rent-old-airport', title: 'Budget Studio — Old Airport', type: 'studio', price: 2700, currency: 'QAR', period: '/month', bedrooms: 0, bathrooms: 1, area: 35, location: 'Old Airport, Doha', district: 'Old Airport', furnished: true, verified: true, listedDaysAgo: 12, floor: '2nd floor', tags: ['Budget', 'Bills Included'], amenities: ['Split A/C', 'Furnished', 'Kahramaa Included', 'Kitchenette', 'Wi-Fi'] }),
  mk({ id: 16, slug: 'partition-room-al-sadd', title: 'Partition Room with Shared Kitchen — Al Sadd', type: 'partition', price: 1100, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: null, area: 16, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: true, verified: false, listedDaysAgo: 3, tags: ['Shared Kitchen', 'Bills Included'], amenities: ['Shared Kitchen', 'Shared Bathroom', 'Split A/C', 'Wi-Fi', 'Bills Included'] }),
  mk({ id: 17, slug: 'one-bedroom-partition-old-airport', title: 'Private 1 Bedroom with Bills Included — Old Airport', type: 'partition', price: 2800, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 1, area: 55, location: 'Old Airport, Doha', district: 'Old Airport', furnished: true, verified: true, listedDaysAgo: 8, tags: ['Private', 'Bills Included'], amenities: ['Private Bathroom', 'Split A/C', 'Furnished', 'Wi-Fi', 'Bills Included', 'Shared Kitchen'] }),
  mk({ id: 38, slug: 'partition-room-al-mansoura', title: 'Executive Partition Room — Al Mansoura', type: 'partition', price: 1450, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: null, area: 20, location: 'Al Mansoura, Doha', district: 'Al Sadd', furnished: true, verified: true, listedDaysAgo: 5, tags: ['Bills Included', 'Metro Nearby'], amenities: ['Shared Kitchen', 'Split A/C', 'Wi-Fi', 'Bills Included', 'Housekeeping'] }),
]

/** Every district that appears in a listing, for the search autocomplete. */
export function propertyDistricts(list: Property[] = properties): string[] {
  return [...new Set(list.map((p) => p.district))].sort((a, b) => a.localeCompare(b))
}

/** Look up a listing by its URL slug. */
export function propertyBySlug(slug: string, list: Property[] = properties): Property | undefined {
  return list.find((p) => p.slug === slug)
}

export const areas = [
  { name: 'Doha', slug: 'doha', description: 'Central Doha — business, retail, and residential hub', count: 42 },
  { name: 'Al Sadd', slug: 'al-sadd', description: 'Well-connected urban district with metro access', count: 38 },
  { name: 'Bin Mahmoud', slug: 'bin-mahmoud', description: 'Quiet residential neighborhood in central Doha', count: 24 },
  { name: 'Al Wakra', slug: 'al-wakra', description: 'Coastal city south of Doha — growing and affordable', count: 19 },
  { name: 'Al Aziziya', slug: 'al-aziziya', description: 'Established residential area popular with families', count: 22 },
  { name: 'Old Airport', slug: 'old-airport', description: 'High-density area with excellent transport links', count: 31 },
  { name: 'Umm Salal Mohammed', slug: 'umm-salal', description: 'Family-friendly suburban community north of Doha', count: 15 },
  { name: 'Al Kharaitiyat', slug: 'al-kharaitiyat', description: 'Spacious villas and compounds — ideal for families', count: 12 },
  { name: 'Al Waab', slug: 'al-waab', description: 'Premium residential hub near Aspire Zone and Villaggio Mall', count: 17 },
]

export const whyChooseUs = [
  { title: 'Deep Local Insights', description: 'Specialized management expertise across neighborhood rental values, municipal laws, and premium local developments.' },
  { title: 'All-Inclusive Utility Programs', description: 'Access comprehensive rental opportunities that completely cover monthly Kahramaa (water and electricity) bills.' },
  { title: 'Verified Listing Procedures', description: 'Say goodbye to fake advertisements. Every apartment or shop on our grid undergoes strict safety and quality screenings.' },
  { title: 'Flexible Corporate Frameworks', description: 'Customized operational processes designed to service corporate personnel housing mandates and commercial retail leases smoothly.' },
  { title: 'Instant WhatsApp Communications', description: 'No complex forms. Interact directly with local leasing professionals via rapid messaging channels.' },
]

export const faqs = [
  { q: 'Do you charge commission?', a: 'No. Dania Real Estate charges zero commission to tenants. The advertised price is exactly what you pay.' },
  { q: 'Are utilities included in the rent?', a: 'Many of our properties are all-inclusive (electricity, water, internet). Each listing clearly states what is included.' },
  { q: 'How quickly can I view a property?', a: 'WhatsApp us at +974 3326 0393 and we\'ll arrange a viewing within 24–48 hours, often the same day.' },
  { q: 'Do you have properties outside Doha?', a: 'Yes — we cover Al Wakra, Umm Salal Mohammed, Al Kharaitiyat, and other areas beyond central Doha.' },
  { q: 'What documents do I need to rent?', a: 'Typically: Qatar ID / Passport, work contract or NOC, and advance payment. We guide you through every step.' },
  { q: 'Can companies rent staff accommodation?', a: 'Absolutely. We specialize in corporate staff housing with flexible arrangements for teams of any size.' },
  { q: 'Are your listings verified?', a: 'Yes. Every property on our platform is physically verified by our team before being listed.' },
  { q: 'What is your refund policy?', a: 'Refund terms depend on the individual lease agreement. Our team will walk you through the specifics before you sign.' },
]

export const steps = [
  { number: '01', title: 'Submit Your Requirements', description: 'Define your target location, room count, budget limits, and expected lease start dates.' },
  { number: '02', title: 'Review Verified Matches', description: 'Our localized leasing desk maps out live, matching properties available on the market right now.' },
  { number: '03', title: 'Schedule Guided Site Viewings', description: 'Coordinate convenient physical property inspections with our transparent on-ground agents.' },
  { number: '04', title: 'Secure Your Lease', description: 'Complete straightforward contract formalities smoothly with zero hidden fees or unexpected commission layers.' },
]

// Company / site settings are managed via the CMS (/admin) as content — see
// src/content/settings.json. Kept exported as `company` so every consumer is
// unchanged and there is a single source of truth the CMS commits to.
export const company = settings.company

/**
 * The three public lines, in the order the client specified, as a single list
 * so the header, footer, contact page and JSON-LD can never drift apart.
 * `tel` is the dial-safe href (digits only, no spaces).
 */
export function companyPhones(c: typeof company = company) {
  return [c.phone, c.phone2, c.officePhone]
    .filter(Boolean)
    .map((display) => ({ display, tel: `tel:${display.replace(/\s/g, '')}` }))
}
