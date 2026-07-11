export interface Property {
  id: number
  title: string
  type: 'apartment' | 'villa' | 'compound-villa' | 'shop' | 'staff' | 'studio' | 'partition'
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
  image: string
}

export const properties: Property[] = [
  { id: 1, title: '1 Bedroom Apartment - Al Sadd', type: 'apartment', subtype: '1-bedroom', price: 4500, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 1, area: 75, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: true, verified: true, tags: ['All Inclusive', 'Zero Commission'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { id: 2, title: '1 Bedroom Apartment - Bin Mahmoud', type: 'apartment', subtype: '1-bedroom', price: 4200, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 1, area: 70, location: 'Bin Mahmoud, Doha', district: 'Bin Mahmoud', furnished: true, verified: true, tags: ['Verified', 'Zero Commission'], image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
  { id: 3, title: '2 Bedroom Apartment - Old Airport', type: 'apartment', subtype: '2-bedroom', price: 6500, currency: 'QAR', period: '/month', bedrooms: 2, bathrooms: 2, area: 110, location: 'Old Airport, Doha', district: 'Old Airport', furnished: true, verified: true, tags: ['All Inclusive', 'Parking'], image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80' },
  { id: 4, title: '2 Bedroom Apartment - Al Aziziya', type: 'apartment', subtype: '2-bedroom', price: 5800, currency: 'QAR', period: '/month', bedrooms: 2, bathrooms: 2, area: 100, location: 'Al Aziziya, Doha', district: 'Al Aziziya', furnished: false, verified: true, tags: ['Zero Commission', 'Balcony'], image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
  { id: 5, title: '3 Bedroom Apartment - Al Wakra', type: 'apartment', subtype: '3-bedroom', price: 9500, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 2, area: 160, location: 'Al Wakra, Qatar', district: 'Al Wakra', furnished: false, verified: true, tags: ['Spacious', 'Verified'], image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },
  { id: 6, title: '3 Bedroom Apartment - Umm Salal Mohammed', type: 'apartment', subtype: '3-bedroom', price: 8800, currency: 'QAR', period: '/month', bedrooms: 3, bathrooms: 3, area: 175, location: 'Umm Salal Mohammed', district: 'Umm Salal Mohammed', furnished: true, verified: true, tags: ['All Inclusive', 'Garden'], image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' },
  { id: 7, title: 'Standard Villa - Al Kharaitiyat', type: 'villa', subtype: 'standard', price: 15000, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 3, area: 320, location: 'Al Kharaitiyat, Qatar', district: 'Al Kharaitiyat', furnished: false, verified: true, tags: ['Private Garden', 'Parking'], image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80' },
  { id: 8, title: 'Standard Villa - Al Wakra', type: 'villa', subtype: 'standard', price: 13500, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 4, area: 350, location: 'Al Wakra, Qatar', district: 'Al Wakra', furnished: false, verified: true, tags: ['Driver Room', 'Maid Room'], image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' },
  { id: 9, title: 'Compound Villa - Al Sadd', type: 'compound-villa', subtype: 'compound', price: 18000, currency: 'QAR', period: '/month', bedrooms: 5, bathrooms: 4, area: 420, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: false, verified: true, tags: ['Shared Pool', 'Security', 'Parking'], image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80' },
  { id: 10, title: 'Compound Villa - Bin Mahmoud', type: 'compound-villa', subtype: 'compound', price: 16500, currency: 'QAR', period: '/month', bedrooms: 4, bathrooms: 3, area: 380, location: 'Bin Mahmoud, Doha', district: 'Bin Mahmoud', furnished: true, verified: true, tags: ['Shared Pool', 'Gym'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 11, title: 'Staff Villa - Industrial Area', type: 'staff', price: 2200, currency: 'QAR', period: '/bed/month', bedrooms: null, bathrooms: null, area: 280, location: 'Industrial Area, Doha', district: 'Doha', furnished: true, verified: true, tags: ['AC', 'Canteen', '24/7 Security'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80' },
  { id: 12, title: 'Staff Accommodation Block - Old Airport', type: 'staff', price: 1900, currency: 'QAR', period: '/bed/month', bedrooms: null, bathrooms: null, area: 200, location: 'Old Airport, Doha', district: 'Old Airport', furnished: true, verified: true, tags: ['WiFi', 'Canteen', 'Laundry'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' },
  { id: 13, title: 'Shop for Rent - Al Sadd', type: 'shop', price: 12000, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: 1, area: 80, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: false, verified: true, tags: ['Ground Floor', 'High Footfall', 'Zero Commission'], image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80' },
  { id: 14, title: 'Office / Shop - Al Aziziya', type: 'shop', price: 9500, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: 1, area: 60, location: 'Al Aziziya, Doha', district: 'Al Aziziya', furnished: false, verified: true, tags: ['Commercial', 'Parking'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { id: 15, title: 'Studio for Rent - Bin Mahmoud', type: 'studio', price: 3200, currency: 'QAR', period: '/month', bedrooms: 0, bathrooms: 1, area: 42, location: 'Bin Mahmoud, Doha', district: 'Bin Mahmoud', furnished: true, verified: true, tags: ['All Inclusive', 'Zero Commission'], image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
  { id: 16, title: 'Partition Room - Al Sadd', type: 'partition', price: 1100, currency: 'QAR', period: '/month', bedrooms: null, bathrooms: null, area: 16, location: 'Al Sadd, Doha', district: 'Al Sadd', furnished: true, verified: false, tags: ['Shared Kitchen', 'Bills Included'], image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },
  { id: 17, title: '1 Bedroom - Studio & Partition Block', type: 'partition', price: 2800, currency: 'QAR', period: '/month', bedrooms: 1, bathrooms: 1, area: 55, location: 'Old Airport, Doha', district: 'Old Airport', furnished: true, verified: true, tags: ['Private', 'Bills Included'], image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
]

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

export const company = {
  name: 'Dania Real Estate',
  nameAr: 'شركة دانية للعقارات',
  tagline: 'Trusted Property Management Company in Doha',
  address: '3rd Floor, Al Muftah Plaza Building, Al Rayyan Road, Doha, Qatar',
  phone: '+974 3326 0393',
  whatsapp: '97433260393',
  whatsappDisplay: '+974 3326 0393',
  email: 'info@dania-realestate.com',
  hours: 'Sat–Thu: 8:00 AM – 5:00 PM (Qatar Standard Time)',
  footerHours: '24/7 Professional Rental Assistance',
  facebook: 'https://www.facebook.com/DaniaRealEstate.qa/',
  instagram: 'https://www.instagram.com/daniarealestate',
  founded: '2010',
  properties: '500+',
  clients: '2,000+',
  experience: '15+',
}
