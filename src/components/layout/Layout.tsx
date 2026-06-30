import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { Seo, SeoExtraProvider } from '@/components/shared/Seo'
import { resolveSeo } from '@/lib/seo'

export function Layout() {
  const { pathname } = useLocation()
  const [extraSchema, setExtraSchema] = useState<object[]>([])
  const seo = resolveSeo(pathname)

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
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </SeoExtraProvider>
  )
}
