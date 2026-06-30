import { memo, useState, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ChevronRight, ArrowUpRight } from 'lucide-react'
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

const triggerBase =
  'inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap'

/* Childless top-level link */
const NavItemLink = memo(function NavItemLink({ item }: Readonly<{ item: NavItem }>) {
  const { t } = useTranslation()
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `${triggerBase} ${isActive ? 'bg-forest text-white shadow-sm' : 'text-ink hover:bg-surface-low'}`}
    >
      {t(item.label)}
    </NavLink>
  )
})

interface DropdownProps {
  item: NavItem
  isOpen: boolean
  onOpen: () => void
  onToggle: () => void
  onCloseSelf: () => void
  onCloseAll: () => void
}

/* Top-level item WITH a submenu.
 *
 * Reliability model — the trigger is a <button>, never a link, so a tap/click
 * only ever TOGGLES the panel; it can never navigate the page away before the
 * user reaches the sub-items (the failure that plagued every hover/link
 * version). The same click path works identically on mouse, touch, and pen.
 * Mouse users additionally get hover-to-open as a convenience. Open state is
 * owned by the Header so only one panel shows at a time; outside-click, Escape,
 * and route changes all close it. The section's own page is reachable via the
 * "Browse the section" row at the top of the panel (keeps the link crawlable). */
const NavDropdown = memo(function NavDropdown({
  item, isOpen, onOpen, onToggle, onCloseSelf, onCloseAll,
}: Readonly<DropdownProps>) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null } }
  // Hover is a mouse-only enhancement; touch/pen drive everything via the click.
  const hoverOpen = (e: ReactPointerEvent) => { if (e.pointerType === 'mouse') { clearTimer(); onOpen() } }
  const hoverClose = (e: ReactPointerEvent) => { if (e.pointerType === 'mouse') { clearTimer(); timer.current = setTimeout(onCloseSelf, 170) } }
  useEffect(() => () => clearTimer(), [])

  return (
    <div className="relative flex items-center" onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`${triggerBase} ${isOpen ? 'bg-forest text-white shadow-sm' : 'text-ink hover:bg-surface-low'}`}
      >
        {t(item.label)}
        <ChevronDown size={13} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* pt-3 = invisible hover bridge so the mouse never crosses a dead gap */}
      <div
        className={`absolute top-full start-0 z-50 pt-3 transition-all duration-200 ease-out ${
          isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1.5 pointer-events-none'
        }`}
      >
        <div className="min-w-[256px] rounded-2xl border border-border/80 bg-white/98 p-2 shadow-2xl shadow-forest/15 ring-1 ring-black/[0.03] backdrop-blur-sm">
          {/* section overview */}
          <NavLink
            to={item.to}
            end={item.to === '/'}
            onClick={onCloseAll}
            className="group flex items-center justify-between gap-3 rounded-xl bg-surface-green/40 px-4 py-2.5 transition-colors hover:bg-surface-green active:bg-surface-green"
          >
            <span className="flex flex-col">
              <span className="text-sm font-bold text-forest">{t(item.label)}</span>
              <span className="text-[11px] text-ink-muted">{isAr ? 'استعراض القسم بالكامل' : 'Browse the full section'}</span>
            </span>
            <ArrowUpRight size={16} className="text-forest/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
          </NavLink>

          <div className="mx-2 my-1.5 h-px bg-border/70" />

          {/* sub-items */}
          {item.children!.map(child => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onCloseAll}
              className={({ isActive }) =>
                `group flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-forest text-white font-semibold'
                    : 'text-ink-muted hover:bg-surface-low hover:text-forest active:bg-surface-low'
                }`}
            >
              {t(child.label)}
              <ChevronRight size={14} className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-60 group-hover:translate-x-0 rtl:-scale-x-100" />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
})

export function Header() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Close everything whenever the route changes.
  useEffect(() => { setOpenKey(null); setMobileOpen(false); setExpandedMobile(null) }, [pathname])

  // Outside-click / Escape close the desktop dropdown.
  useEffect(() => {
    if (!openKey) return
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenKey(null)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenKey(null) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openKey])

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-700 ease-out ${
        loaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/Dania_Real_Estate_logo.png"
            alt="Dania Real Estate Logo"
            className="h-10 sm:h-11 w-auto object-contain"
          />
          <div className="hidden sm:block leading-tight">
            <p className="font-bold text-forest text-base leading-tight">{company.name}</p>
            <p className="text-sm text-ink-muted">{company.nameAr}</p>
          </div>
        </Link>

        {/* Full horizontal nav — shown only at ≥1536px where all items genuinely fit */}
        <nav ref={navRef} className="hidden 2xl:flex items-center gap-0.5 flex-nowrap">
          {navItems.map(item =>
            item.children ? (
              <NavDropdown
                key={item.to}
                item={item}
                isOpen={openKey === item.to}
                onOpen={() => setOpenKey(item.to)}
                onToggle={() => setOpenKey(k => (k === item.to ? null : item.to))}
                onCloseSelf={() => setOpenKey(k => (k === item.to ? null : k))}
                onCloseAll={() => setOpenKey(null)}
              />
            ) : (
              <NavItemLink key={item.to} item={item} />
            )
          )}
        </nav>

        {/* Right cluster — always visible so the icons can never be clipped */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher iconOnly />
          <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="group inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-white bg-gradient-to-br from-[#25D366] to-[#0F8A52] ring-1 ring-white/30 shadow-md shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-700/40 hover:brightness-105">
            <WhatsappIcon size={17} className="transition-transform duration-300 group-hover:scale-110" />
          </a>
          <Link to="/contact-us/"
            className="group relative overflow-hidden hidden 2xl:inline-flex items-center bg-forest text-white text-sm font-semibold px-4 py-2 rounded-full">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('header.contactUs')}</span>
          </Link>
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={mobileOpen}
            className="2xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-ink hover:bg-surface-low active:bg-surface-low transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="2xl:hidden bg-white border-t border-border px-5 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {navItems.map(item => {
            const isExpanded = expandedMobile === item.to
            return (
              <div key={item.to} className="border-b border-border/50 last:border-0">
                {item.children ? (
                  <>
                    <div className="flex items-center">
                      <NavLink to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => `flex-1 px-4 py-3.5 text-base font-medium transition-colors ${isActive ? 'text-lime' : 'text-ink'}`}>
                        {t(item.label)}
                      </NavLink>
                      <button
                        onClick={() => setExpandedMobile(isExpanded ? null : item.to)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        aria-expanded={isExpanded}
                        className="w-11 h-11 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                      >
                        <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-72' : 'max-h-0'}`}>
                      <div className="pb-2">
                        {item.children.map(child => (
                          <NavLink key={child.to} to={child.to} onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => `block ps-6 py-2.5 text-sm transition-colors ${isActive ? 'text-lime font-semibold' : 'text-ink-muted'}`}>
                            {t(child.label)}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <NavLink to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)}
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
            <Link to="/contact-us/" onClick={() => setMobileOpen(false)}
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
