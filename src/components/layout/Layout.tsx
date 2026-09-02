import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { FloatingContact } from '@/components/shared/FloatingContact'
import { StickySearchBar } from '@/components/search/StickySearchBar'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Seo } from '@/components/shared/Seo'
import { SeoExtraProvider } from '@/components/shared/seo-context'
import { resolveSeo } from '@/lib/seo'

export function Layout() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [extraSchema, setExtraSchema] = useState<object[]>([])
  const seo = resolveSeo(pathname)

  // The listing detail page carries its own Call/WhatsApp actions (a sticky
  // agent panel on desktop, a fixed action bar on mobile) — the floating
  // widgets would sit right on top of them.
  const isListingDetail = /^\/properties\/[^/]+\/?$/.test(pathname)

  return (
    <SeoExtraProvider value={setExtraSchema}>
      <Seo
        title={seo.title}
        description={seo.description}
        path={pathname}
        image={seo.image}
        jsonLd={extraSchema}
      />
      <div className="min-h-screen flex flex-col">
        {/* Skip link — first focusable element; visible only on keyboard focus (F-002/WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:start-3"
        >
          {isAr ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
        </a>
        <Header />
        {/* Site-wide property search, pinned under the navbar on every page */}
        <StickySearchBar />
        <main id="main-content" className="flex-1">
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
        {!isListingDetail && <FloatingContact />}
      </div>
    </SeoExtraProvider>
  )
}
