import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { company } from '@/data/mockData'

export function Footer() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const quickLinks: [string, string][] = [
    [t('footer.home'), '/'],
    [t('footer.about'), '/about-company/'],
    [t('footer.whyChooseUs'), '/about-company/why-choose-us/'],
    [t('footer.gallery'), '/about-company/gallery/'],
    [t('footer.faq'), '/faq/'],
    [t('footer.contactUs'), '/contact-us/'],
  ]

  const serviceLinks: [string, string][] = [
    [t('footer.apartments'), '/apartments-for-rent/'],
    [t('footer.villas'), '/villas-for-rent/'],
    [t('footer.staff'), '/staff-accommodation/'],
    [t('footer.shops'), '/shops-for-rent/'],
    [t('footer.studios'), '/studio-partition-rentals/'],
  ]

  // Spec footer Column 4 labels (Operational Service Areas) — bilingual.
  const areaLinks: [string, string][] = isAr ? [
    ['مركز الدوحة', 'doha'],
    ['السد', 'al-sadd'],
    ['بن محمود', 'bin-mahmoud'],
    ['الوكرة', 'al-wakra'],
    ['العزيزية', 'al-aziziya'],
    ['المطار القديم', 'old-airport'],
    ['أم صلال', 'umm-salal'],
    ['الخريطيات', 'al-kharaitiyat'],
  ] : [
    ['Doha Center', 'doha'],
    ['Al Sadd', 'al-sadd'],
    ['Bin Mahmoud', 'bin-mahmoud'],
    ['Al Wakra', 'al-wakra'],
    ['Al Aziziya', 'al-aziziya'],
    ['Old Airport', 'old-airport'],
    ['Umm Salal', 'umm-salal'],
    ['Al Kharaitiyat', 'al-kharaitiyat'],
  ]

  return (
    <footer className="bg-forest text-white mt-0">
      <div className="max-w-[1280px] mx-auto px-6 py-10 sm:py-14 grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8 sm:gap-8">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <img
              src="/Dania_Real_Estate_logo.png"
              alt="Dania Real Estate Logo"
              className="h-11 w-auto object-contain"
            />
            <div>
              <p className="font-bold text-white text-base leading-tight">{company.name}</p>
              <p className="text-sm text-white/70">{company.nameAr}</p>
            </div>
          </div>
          <p className="text-white/60 text-xs leading-relaxed mb-5">{t('footer.tagline')}</p>
          <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center gap-2 bg-whatsapp text-white text-xs font-semibold px-4 py-2 rounded-full">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
            <MessageCircle size={13} className="relative z-10 transition-colors duration-300 group-hover:text-forest" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('footer.chatWhatsapp')}</span>
          </a>
          <div className="flex gap-4 mt-4">
            <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-lime text-xs transition-colors">Facebook</a>
            <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-lime text-xs transition-colors">Instagram</a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-4 text-lime">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2">
            {quickLinks.map(([label, href]) => (
              <li key={href}><Link to={href} className="text-white/60 hover:text-white text-xs transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-4 text-lime">{t('footer.specializedServices')}</h4>
          <ul className="space-y-2">
            {serviceLinks.map(([label, href]) => (
              <li key={href}><Link to={href} className="text-white/60 hover:text-white text-xs transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-4 text-lime">{t('footer.serviceAreas')}</h4>
          <ul className="space-y-2">
            {areaLinks.map(([label, slug]) => (
              <li key={slug}><Link to={`/areas/${slug}/`} className="text-white/60 hover:text-white text-xs transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-4 text-lime">{t('footer.contact')}</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2"><MapPin size={13} className="text-lime mt-0.5 shrink-0" /><span className="text-white/60 text-xs leading-relaxed">{company.address}</span></li>
            <li className="flex items-center gap-2"><Phone size={13} className="text-lime shrink-0" /><a href={`tel:${company.phone}`} className="text-white/60 hover:text-white text-xs">{company.phone}</a></li>
            <li className="flex items-center gap-2"><Mail size={13} className="text-lime shrink-0" /><a href={`mailto:${company.email}`} className="text-white/60 hover:text-white text-xs">{company.email}</a></li>
            <li className="flex items-center gap-2"><Clock size={13} className="text-lime shrink-0" /><span className="text-white/60 text-xs">{company.footerHours}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
        <p>{t('footer.copyright')}</p>
        <div className="flex gap-5">
          <Link to="/about-company/" className="hover:text-white transition-colors">{t('footer.about2')}</Link>
          <span className="hover:text-white cursor-pointer transition-colors">{t('footer.privacy')}</span>
          <Link to="/contact-us/" className="hover:text-white transition-colors">{t('footer.contactUs2')}</Link>
        </div>
      </div>
    </footer>
  )
}
