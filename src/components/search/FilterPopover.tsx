import {
  useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

interface Props {
  /** Chip text. */
  label: ReactNode
  /** Small count bubble on the chip (e.g. Filters · 2). */
  badge?: number
  /** Chip renders in its "has a value" state. */
  active?: boolean
  /** Which edge of the chip the panel aligns to (logical, RTL-aware). */
  align?: 'start' | 'end'
  /** Tailwind width class for the panel. */
  panelClass?: string
  /** Dark chips for the hero (over photography); light everywhere else. */
  tone?: 'light' | 'dark'
  /** The hero fades on scroll — close the panel with it. */
  closeOnScroll?: boolean
  /** Optional leading icon inside the chip. */
  icon?: ReactNode
  children: (close: () => void) => ReactNode
}

/**
 * A filter chip that opens a panel — the building block of the search bar.
 *
 * The panel is rendered through a portal into <body> and positioned against
 * the chip, NOT nested inside it. That is deliberate: the chip rows scroll
 * horizontally (`overflow-x-auto`), and CSS forces the cross axis of a scroll
 * container to clip too — an in-flow absolute panel gets sliced off at the
 * row's bottom edge and never appears. A fixed, portalled panel escapes that,
 * and also escapes the transformed/fading hero copy it sits inside.
 *
 * Closes on outside pointer-down, Escape, and (optionally) page scroll.
 */
export function FilterPopover({
  label, badge, active, align = 'start', panelClass = 'w-72',
  tone = 'light', closeOnScroll = false, icon, children,
}: Readonly<Props>) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  /** Pin the panel under its chip, kept inside the viewport on both axes. */
  const place = useCallback(() => {
    const anchor = wrapRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return

    const chip = anchor.getBoundingClientRect()
    const width = panel.offsetWidth
    const height = panel.offsetHeight
    const rtl = document.documentElement.dir === 'rtl'
    const GAP = 8

    // "start"/"end" are logical edges, so they swap in Arabic.
    const startEdge = rtl ? chip.right - width : chip.left
    const endEdge = rtl ? chip.left : chip.right - width
    const desired = align === 'end' ? endEdge : startEdge
    const maxLeft = Math.max(GAP, window.innerWidth - width - GAP)
    panel.style.left = `${Math.min(Math.max(desired, GAP), maxLeft)}px`

    // Drop below the chip; flip above when the panel would run off-screen.
    const below = chip.bottom + GAP
    const fitsBelow = below + height <= window.innerHeight - GAP
    const fitsAbove = chip.top - GAP - height >= GAP
    panel.style.top = `${fitsBelow || !fitsAbove ? below : chip.top - GAP - height}px`
  }, [align])

  useLayoutEffect(() => {
    if (open) place()
  }, [open, place])

  useEffect(() => {
    if (!open) return

    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      // The panel lives outside this component's DOM subtree, so it needs its
      // own containment check or clicking inside it would close it.
      if (wrapRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onReflow = () => { if (closeOnScroll) setOpen(false); else place() }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    // Capture phase so scrolling of any ancestor container repositions it too.
    window.addEventListener('scroll', onReflow, { passive: true, capture: true })
    window.addEventListener('resize', onReflow)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onReflow, { capture: true })
      window.removeEventListener('resize', onReflow)
    }
  }, [open, closeOnScroll, place])

  const dark = tone === 'dark'
  const chipTone = active
    ? dark
      ? 'bg-lime text-forest border-lime'
      : 'bg-forest text-white border-forest'
    : dark
      ? 'bg-white/12 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm'
      : 'bg-white text-ink border-border hover:border-forest/40 hover:bg-surface-low'

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-200 sm:px-4 sm:py-2.5 ${chipTone}`}
      >
        {icon}
        <span>{label}</span>
        {badge ? (
          <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
            active ? (dark ? 'bg-forest text-lime' : 'bg-lime text-forest') : 'bg-lime text-forest'
          }`}>
            {badge}
          </span>
        ) : null}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          id={panelId}
          // `left`/`top` are set by place(); start off-screen so the first
          // paint can't flash in the wrong spot while it is being measured.
          style={{ left: -9999, top: 0 }}
          className={`fixed z-[60] max-w-[calc(100vw-1rem)] rounded-2xl border border-border bg-white p-4 text-ink shadow-2xl shadow-forest/25 ring-1 ring-black/[0.03] ${panelClass}`}
        >
          {children(() => setOpen(false))}
        </div>,
        document.body,
      )}
    </div>
  )
}
