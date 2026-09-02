import { memo, useState, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ChevronRight, ArrowUpRight, Phone, Clock, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { company } from '@/data/mockData'
import { Ltr } from '@/components/shared/Ltr'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { WhatsappIcon } from '@/components/shared/WhatsappIcon'
import { InstagramIcon } from '@/components/shared/InstagramIcon'
import { FacebookIcon } from '@/components/shared/FacebookIcon'
import { LinkedInIcon } from '@/components/shared/LinkedInIcon'

/** A leaf link inside a dropdown. */
interface NavChild {
  to: string
  label: string
  /** Second-level links (e.g. Apartments → 1 BHK / 2 BHK / 3 BHK). */
  children?: { to: string; label: string }[]
}

interface NavItem {
  /** Absent = a heading that only opens its panel and never navigates. */
  to?: string
  label: string
  children?: NavChild[]
}

// Menu structure per the client's navigation spec:
//   Home · Properties for Rent · Areas · About Company · Contact Us
// "Properties for Rent" is a non-clickable dropdown title — it has no page of
// its own, so a visitor always lands on the sub-category they actually want.
const navItems: NavItem[] = [
  { to: '/', label: 'nav.home' },
  {
    label: 'nav.propertiesForRent',
    children: [
      { to: '/apartments-for-rent/', label: 'nav.apartments', children: [
        { to: '/apartments-for-rent/1-bedroom/', label: 'nav.bedroom1' },
        { to: '/apartments-for-rent/2-bedroom/', label: 'nav.bedroom2' },
        { to: '/apartments-for-rent/3-bedroom/', label: 'nav.bedroom3' },
      ]},
      { to: '/villas-for-rent/', label: 'nav.villas', children: [
        { to: '/villas-for-rent/standard-villas/', label: 'nav.standardVillas' },
        { to: '/villas-for-rent/compound-villas/', label: 'nav.compoundVillas' },
      ]},
      { to: '/studio-partition-rentals/', label: 'nav.studiosPartitions', children: [
        { to: '/studio-partition-rentals/studio-for-rent/', label: 'nav.studio' },
        { to: '/studio-partition-rentals/partition-room-for-rent/', label: 'nav.partitionRoom' },
        { to: '/studio-partition-rentals/one-bedroom-for-rent/', label: 'nav.oneBedroomRental' },
      ]},
      { to: '/staff-accommodation/', label: 'nav.staff', children: [
        { to: '/staff-accommodation/staff-villas/', label: 'nav.staffVillas' },
      ]},
      { to: '/shops-for-rent/', label: 'nav.shopsForRent' },
    ],
  },
  {
    to: '/areas/',
    label: 'nav.areas',
    children: [
      { to: '/areas/al-sadd/', label: 'nav.alSadd' },
      { to: '/areas/bin-mahmoud/', label: 'nav.binMahmoud' },
      { to: '/areas/al-wakra/', label: 'nav.alWakra' },
      { to: '/areas/', label: 'nav.otherLocations' },
    ],
  },
  {
    to: '/about-company/',
    label: 'nav.about',
    children: [
      { to: '/about-company/', label: 'nav.aboutUs' },
      { to: '/about-company/why-choose-us/', label: 'nav.whyChooseUs' },
      { to: '/about-company/gallery/', label: 'nav.gallery' },
      { to: '/faq/', label: 'nav.faq' },
    ],
  },
  { to: '/contact-us/', label: 'nav.contact' },
]

const triggerBase =
  'inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap'

/* Childless top-level link */
const NavItemLink = memo(function NavItemLink({ item }: Readonly<{ item: NavItem & { to: string } }>) {
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
        <div className="min-w-[268px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/80 bg-white/98 p-2 shadow-2xl shadow-forest/15 ring-1 ring-black/[0.03] backdrop-blur-sm">
          {/* Section overview — only for headings that have a page of their own.
              "Properties for Rent" deliberately has none. */}
          {item.to && (
            <>
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
            </>
          )}

          {/* sub-items, each optionally with its own second level */}
          {item.children!.map(child => (
            <div key={child.to + child.label}>
              <NavLink
                to={child.to}
                onClick={onCloseAll}
                className={({ isActive }) =>
                  `group flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-forest text-white font-semibold'
                      : `${child.children ? 'font-semibold text-forest' : 'text-ink-muted'} hover:bg-surface-low hover:text-forest active:bg-surface-low`
                  }`}
              >
                {t(child.label)}
                <ChevronRight size={14} className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-60 group-hover:translate-x-0 rtl:-scale-x-100" />
              </NavLink>

              {child.children && (
                <div className="mb-1 ms-4 flex flex-col border-s border-border/70 ps-2">
                  {child.children.map(leaf => (
                    <NavLink
                      key={leaf.to}
                      to={leaf.to}
                      onClick={onCloseAll}
                      className={({ isActive }) =>
                        `rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                          isActive
                            ? 'font-semibold text-lime'
                            : 'text-ink-muted hover:bg-surface-low hover:text-forest'
                        }`}
                    >
                      {t(leaf.label)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export function Header() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [topBarH, setTopBarH] = useState(0)
  // The two mobile lines the client wants surfaced in the navbar action area.
  const headerPhones = [company.phone, company.phone2].filter(Boolean)
  const navRef = useRef<HTMLDivElement>(null)
  const topBarRef = useRef<HTMLDivElement>(null)

  // Measure the top utility bar's height. The whole header is sticky with a
  // negative `top` of exactly this height, so as you scroll the top bar slides
  // off-screen and the navbar comes to rest flush at the top of the viewport.
  // Re-measured on resize because the bar is taller on phones (3 stacked rows).
  useEffect(() => {
    const el = topBarRef.current
    if (!el) return
    const measure = () => setTopBarH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Elevate the navbar with a softer shadow once the top bar has scrolled away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (topBarRef.current?.offsetHeight ?? 0) - 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close every menu whenever the route changes. This deliberately sets state
  // from an effect keyed on `pathname`: it synchronises transient UI (open
  // dropdown / mobile menu) with an external system (the router). There is no
  // render-derived equivalent because the menus must also close when the user
  // re-navigates to a path they are already on.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpenKey(null); setMobileOpen(false); setExpandedMobile(null) }, [pathname])

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

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
    <header className="sticky z-40" style={{ top: -topBarH }}>
      {/* Top utility bar — contact details + socials, same dark colour as the site background.
          The header is sticky with top:-topBarH, so this bar scrolls off-screen while the
          navbar below settles at the top of the viewport (only the navbar follows on scroll).
          Phone view stacks into 3 rows: hours / phone lines / socials. Desktop is one line.
          The email was removed from this bar per the client's Developer Note — it still
          lives in the footer and on the contact page. */}
      <div ref={topBarRef} className="bg-forest text-white/80 border-b border-white/10 text-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2 lg:py-0 lg:h-9 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1.5 lg:gap-3">
          {/* Working days & hours. The phone lines used to sit here too; per the
              client's structure plan the office line was dropped and the two
              mobile lines moved down into the navbar's action area, so they are
              not repeated twice within the same header. */}
          <div className="flex flex-col items-center lg:flex-row lg:items-center gap-1.5 lg:gap-5 min-w-0">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-lime shrink-0" />
              <span>{isAr ? company.hoursShortAr : company.hoursShort}</span>
            </span>
          </div>
          {/* Row 3: social links */}
          <div className="flex items-center justify-center lg:justify-end gap-1.5 shrink-0">
            <a href={company.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/90 hover:bg-lime hover:text-forest transition-colors">
              <InstagramIcon size={13} />
            </a>
            <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/90 hover:bg-lime hover:text-forest transition-colors">
              <WhatsappIcon size={13} />
            </a>
            <a href={company.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/90 hover:bg-lime hover:text-forest transition-colors">
              <FacebookIcon size={13} />
            </a>
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/90 hover:bg-lime hover:text-forest transition-colors">
              <LinkedInIcon size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Navbar — the header's negative sticky top leaves this resting at the very
          top of the viewport once the bar above scrolls off. Shadow eases in then. */}
      <div
        className={`bg-white/95 backdrop-blur-sm border-b border-border transition-shadow duration-300 ease-out ${
          scrolled ? 'shadow-lg shadow-forest/10' : 'shadow-sm'
        }`}
      >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/Dania_Real_Estate_logo.png"
            alt="Dania Real Estate Logo"
            width={480}
            height={320}
            className="h-10 sm:h-11 w-auto object-contain"
          />
          <div className="block leading-tight">
            <p className="font-bold text-forest text-sm sm:text-base leading-tight whitespace-nowrap">{company.name}</p>
            <p className="text-[11px] sm:text-sm text-ink-muted whitespace-nowrap">{company.nameAr}</p>
          </div>
        </Link>

        {/* Full horizontal nav — shown at ≥1280px (laptop); hamburger below */}
        <nav ref={navRef} className="hidden xl:flex items-center gap-0 flex-nowrap">
          {navItems.map(item => {
            // A heading with no page of its own is keyed by its label instead.
            const key = item.to ?? item.label
            return item.children ? (
              <NavDropdown
                key={key}
                item={item}
                isOpen={openKey === key}
                onOpen={() => setOpenKey(key)}
                onToggle={() => setOpenKey(k => (k === key ? null : key))}
                onCloseSelf={() => setOpenKey(k => (k === key ? null : k))}
                onCloseAll={() => setOpenKey(null)}
              />
            ) : (
              <NavItemLink key={key} item={{ ...item, to: key }} />
            )
          })}
        </nav>

        {/* Right cluster — always visible so the icons can never be clipped */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* The two business lines, click-to-call, split by a vertical rule.
              Shown from lg up; on smaller screens they live in the mobile menu
              and on the floating call widget. */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-forest">
            <Phone size={15} className="text-lime shrink-0" />
            {headerPhones.map((display, i) => (
              <span key={display} className="inline-flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-border">|</span>}
                <a
                  href={`tel:${display.replace(/\s/g, '')}`}
                  className="whitespace-nowrap transition-colors hover:text-lime"
                >
                  <Ltr>{display}</Ltr>
                </a>
              </span>
            ))}
          </div>

          <LanguageSwitcher iconOnly />

          {/* Find Us On Map — opens the Google Business Profile in a new tab */}
          <a
            href={company.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('header.findUsOnMap')}
            className="group hidden md:inline-flex items-center gap-1.5 rounded-full border border-forest/25 px-3 py-2 text-sm font-semibold text-forest shrink-0 transition-colors hover:border-forest hover:bg-surface-low"
          >
            <MapPin size={15} className="text-lime transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="hidden xl:inline">{t('header.findUsOnMap')}</span>
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
            aria-controls="mobile-menu"
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-ink hover:bg-surface-low active:bg-surface-low transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-menu" aria-label={isAr ? 'التنقل عبر الجوال' : 'Mobile navigation'} className="xl:hidden bg-white border-t border-border px-5 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {navItems.map(item => {
            const key = item.to ?? item.label
            const isExpanded = expandedMobile === key
            return (
              <div key={key} className="border-b border-border/50 last:border-0">
                {item.children ? (
                  <>
                    <div className="flex items-center">
                      {item.to ? (
                        <NavLink to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)}
                          className={({ isActive }) => `flex-1 px-4 py-3.5 text-base font-medium transition-colors ${isActive ? 'text-lime' : 'text-ink'}`}>
                          {t(item.label)}
                        </NavLink>
                      ) : (
                        /* A non-clickable title: tapping anywhere on the row
                           only expands it, so nothing navigates by surprise. */
                        <button
                          type="button"
                          onClick={() => setExpandedMobile(isExpanded ? null : key)}
                          aria-expanded={isExpanded}
                          className="flex-1 px-4 py-3.5 text-start text-base font-medium text-ink transition-colors"
                        >
                          {t(item.label)}
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedMobile(isExpanded ? null : key)}
                        aria-label={isExpanded ? (isAr ? 'طيّ' : 'Collapse') : (isAr ? 'توسيع' : 'Expand')}
                        aria-expanded={isExpanded}
                        className="w-11 h-11 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                      >
                        <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[36rem]' : 'max-h-0'}`}>
                      <div className="pb-2">
                        {item.children.map(child => (
                          <div key={child.to + child.label}>
                            <NavLink to={child.to} onClick={() => setMobileOpen(false)}
                              className={({ isActive }) => `block ps-6 py-2.5 text-sm transition-colors ${
                                isActive ? 'text-lime font-semibold' : child.children ? 'text-ink font-semibold' : 'text-ink-muted'
                              }`}>
                              {t(child.label)}
                            </NavLink>
                            {child.children?.map(leaf => (
                              <NavLink key={leaf.to} to={leaf.to} onClick={() => setMobileOpen(false)}
                                className={({ isActive }) => `block ps-11 py-2 text-[13px] transition-colors ${isActive ? 'text-lime font-semibold' : 'text-ink-muted'}`}>
                                {t(leaf.label)}
                              </NavLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <NavLink to={item.to!} end={item.to === '/'} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `block px-4 py-3.5 text-base font-medium transition-colors ${isActive ? 'text-lime' : 'text-ink'}`}>
                    {t(item.label)}
                  </NavLink>
                )}
              </div>
            )
          })}

          {/* Click-to-call lines — the desktop action area hides these below lg */}
          <div className="mt-3 flex flex-col gap-1.5 rounded-2xl bg-surface-low p-3">
            {headerPhones.map((display, i) => (
              <a
                key={display}
                href={`tel:${display.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest"
              >
                <Phone size={15} className="text-lime shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                  {isAr ? `الخط ${i + 1}` : `Line ${i + 1}`}
                </span>
                <Ltr>{display}</Ltr>
              </a>
            ))}
            <a
              href={company.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest"
            >
              <MapPin size={15} className="text-lime shrink-0" />
              {t('header.findUsOnMap')}
            </a>
          </div>

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
        </nav>
      )}
      </div>
    </header>
  )
}
