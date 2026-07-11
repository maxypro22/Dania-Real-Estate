import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Search, MessageCircle } from 'lucide-react'
import { company } from '@/data/mockData'

/**
 * Catch-all 404. Because this is an SPA behind a rewrite-everything-to-index.html
 * config, unknown URLs still return HTTP 200 — so we mark the page noindex to keep
 * soft-404s out of the index and give the visitor a real way back.
 */
export function NotFoundPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <>
      <title>Page Not Found | Dania Real Estate</title>
      <meta name="robots" content="noindex, follow" />
      <section className="bg-forest text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-lime text-7xl md:text-8xl font-extrabold mb-4">404</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isAr ? 'الصفحة غير موجودة' : 'This page could not be found'}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            {isAr
              ? 'ربما تم نقل الرابط أو إزالته. تابع تصفح العقارات المتاحة للإيجار في الدوحة أو تواصل مع مكتب الإيجار مباشرة.'
              : 'The link may have moved or been removed. Keep browsing verified properties for rent in Doha, or reach our leasing desk directly.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-lime text-forest font-bold px-6 py-3 rounded-full text-sm hover:bg-white transition-colors"
            >
              <Home size={16} />
              {isAr ? 'الصفحة الرئيسية' : 'Back to Home'}
            </Link>
            <Link
              to="/apartments-for-rent/"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-colors"
            >
              <Search size={16} />
              {isAr ? 'تصفح العقارات' : 'Browse Properties'}
            </Link>
            <a
              href={`https://wa.me/${company.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={16} />
              {isAr ? 'واتساب' : 'WhatsApp Us'}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
