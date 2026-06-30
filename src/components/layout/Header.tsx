import { memo, useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { company } from '@/data/mockData'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { WhatsappIcon } from '@/components/shared/WhatsappIcon'

interface NavItem {
  to: string
  label: string
  children?: { to: string; label: string }[]
}

const navItems: NavItem[] = [
  { to: '/', label: 'nav.home' },
  { to: '/about-company/', label: 'nav.about', children: [
    { to: '/about-company/why-choose-us/', label: 'nav.whyChooseUs' },
    { to: '/about-company/gallery/', label: 'nav.gallery' },
  ]},
  { to: '/apartments-for-rent/', label: 'nav.apartments', children: [
    { to: '/apartments-for-rent/1-bedroom/', label: 'nav.bedroom1' },
    { to: '/apartments-for-rent/2-bedroom/', label: 'nav.bedroom2' },
    { to: '/apartments-for-rent/3-bedroom/', label: 'nav.bedroom3' },
  ]},
  { to: '/villas-for-rent/', label: 'nav.villas', children: [
    { to: '/villas-for-rent/standard-villas/', label: 'nav.standardVillas' },
    { to: '/villas-for-rent/compound-villas/', label: 'nav.compoundVillas' },
  ]},
  { to: '/staff-accommodation/', label: 'nav.staff', children: [
    { to: '/staff-accommodation/staff-villas/', label: 'nav.staffVillas' },
  ]},
  { to: '/shops-for-rent/', label: 'nav.shops' },
  { to: '/studio-partition-rentals/', label: 'nav.studios', children: [
    { to: '/studio-partition-rentals/studio-for-rent/', label: 'nav.studio' },
    { to: '/studio-partition-rentals/partition-room-for-rent/', label: 'nav.partitionRoom' },
    { to: '/studio-partition-rentals/one-bedroom-for-rent/', label: 'nav.oneBedroomRental' },
  ]},
  { to: '/areas/', label: 'nav.areas' },
  { to: '/faq/', label: 'nav.faq' },
]

const NavDropdown = memo(function NavDropdown({ item }: Readonly<{ item: NavItem }>) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const base = 'flex items-center gap-1 px-2 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap'

  const enter = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(true)
  }
  const leave = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 450)
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  if (!item.children) {
    return (
      <NavLink to={item.to} end={item.to === '/'}
        className={({ isActive }) => `${base} ${isActive ? 'bg-forest text-white' : 'text-ink hover:bg-surface-low'}`}>
        {t(item.label)}
      </NavLink>
    )
  }

  return (
    <div
      className="relative flex items-center py-4"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onTouchStart={() => { setOpen(prev => !prev) }}
    >
      <NavLink
        to={item.to}
        className={({ isActive }) => `${base} ${isActive ? 'bg-forest text-white' : 'text-ink hover:bg-surface-low'}`}
      >
        {t(item.label)} <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </NavLink>
      {/* The pt-3 bridge + -mt-1 overlap guarantee the pointer never crosses a
          dead gap between the trigger and the panel on the way down. */}
      <div
        className={`absolute top-full start-0 -mt-1 z-50 pt-3 transition-all duration-150 ${
          open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="bg-white border border-border rounded-lg shadow-lg min-w-44 py-1">
          {item.children.map(child => (
            <NavLink key={child.to} to={child.to}
              className={({ isActive }) => `block px-4 py-3 text-sm transition-colors hover:bg-surface-green rounded-sm ${isActive ? 'text-forest font-semibold' : 'text-ink-muted'}`}>
              {t(child.label)}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
})

export function Header() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-700 ease-out overflow-x-clip ${
        loaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/Dania_Real_Estate_logo.png"
            alt="Dania Real Estate Logo"
            className="h-11 w-auto object-contain"
          />
          <div>
            <p className="font-bold text-forest text-base leading-tight">{company.name}</p>
            <p className="text-sm text-ink-muted">{company.nameAr}</p>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-0 flex-nowrap">
          {navItems.map(item => <NavDropdown key={item.to} item={item} />)}
        </nav>

        <div className="hidden xl:flex items-center gap-2 shrink-0">
          <LanguageSwitcher iconOnly className="ltr:-translate-x-1 rtl:translate-x-1" />
          <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="group inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-white bg-gradient-to-br from-[#25D366] to-[#0F8A52] ring-1 ring-white/30 shadow-md shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-700/40 hover:brightness-105 ltr:-translate-x-1 rtl:translate-x-1">
            <WhatsappIcon size={17} className="transition-transform duration-300 group-hover:scale-110" />
          </a>
          <Link to="/contact-us/"
            className="group relative overflow-hidden hidden 2xl:flex items-center bg-forest text-white text-sm font-semibold px-4 py-2 rounded-full">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('header.contactUs')}</span>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? t('header.closeMenu') : t('header.openMenu')}
          className="xl:hidden p-3 rounded-xl text-ink hover:bg-surface-low active:bg-surface-low transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-border px-5 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {navItems.map(item => {
            const isExpanded = expandedMobile === item.to
            return (
              <div key={item.to} className="border-b border-border/50 last:border-0">
                {item.children ? (
                  <>
                    <div className="flex items-center">
                      <NavLink to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}
                        className={({ isActive }) => `flex-1 px-4 py-3.5 text-base font-medium transition-colors ${isActive ? 'text-lime' : 'text-ink'}`}>
                        {t(item.label)}
                      </NavLink>
                      <button
                        onClick={() => setExpandedMobile(isExpanded ? null : item.to)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        className="w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink transition-colors text-xl font-light"
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="pb-2">
                        {item.children.map(child => (
                          <NavLink key={child.to} to={child.to} onClick={() => { setOpen(false); setExpandedMobile(null) }}
                            className={({ isActive }) => `block ps-6 py-2.5 text-sm transition-colors ${isActive ? 'text-lime font-semibold' : 'text-ink-muted'}`}>
                            {t(child.label)}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}
                    className={({ isActive }) => `block px-4 py-3.5 text-base font-medium transition-colors ${isActive ? 'text-lime' : 'text-ink'}`}>
                    {t(item.label)}
                  </NavLink>
                )}
              </div>
            )
          })}
          <div className="flex gap-2 mt-3">
            <LanguageSwitcher className="flex-1 justify-center" />
            <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-full bg-gradient-to-br from-[#25D366] to-[#0F8A52] ring-1 ring-white/30 shadow-md shadow-emerald-700/30 transition-all duration-300 hover:brightness-105 active:scale-[0.98]">
              <WhatsappIcon size={16} />
              <span>{t('header.whatsapp')}</span>
            </a>
            <Link to="/contact-us/" onClick={() => setOpen(false)}
              className="group relative overflow-hidden flex-1 flex items-center justify-center bg-forest text-white text-sm font-semibold px-4 py-2.5 rounded-full">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('header.contactUs')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
