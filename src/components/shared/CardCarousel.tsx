import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CardCarouselProps {
  items: ReactNode[]
  /** ms between auto-advances */
  interval?: number
  /** tailwind width of each slide (peek of neighbours) */
  slideWidth?: string
  className?: string
}

/**
 * Apple-style horizontal card carousel. Native scroll-snap track so it feels
 * right on touch, with clickable pagination dots, prev/next arrows, and a
 * gentle autoplay that pauses while the user interacts. The active dot tracks
 * whichever card is nearest the centre.
 */
export function CardCarousel({ items, interval = 4200, slideWidth = 'w-[82%]', className = '' }: CardCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = items.length

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const child = track.children[i] as HTMLElement | undefined
    if (!child) return
    const left = child.offsetLeft - (track.clientWidth - child.clientWidth) / 2
    track.scrollTo({ left, behavior: 'smooth' })
  }

  useEffect(() => {
    if (paused || n <= 1) return
    const id = window.setTimeout(() => {
      const next = (active + 1) % n
      setActive(next)
      goTo(next)
    }, interval)
    return () => window.clearTimeout(id)
  }, [active, paused, n, interval])

  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    let best = 0, bestDist = Infinity
    Array.from(track.children).forEach((c, i) => {
      const el = c as HTMLElement
      const cc = el.offsetLeft + el.clientWidth / 2
      const d = Math.abs(cc - center)
      if (d < bestDist) { bestDist = d; best = i }
    })
    if (best !== active) setActive(best)
  }

  const hold = { onPointerDown: () => setPaused(true), onPointerUp: () => setPaused(false), onPointerLeave: () => setPaused(false), onPointerCancel: () => setPaused(false) }

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        {...hold}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it, i) => (
          <div key={i} className={`snap-center shrink-0 ${slideWidth}`}>
            {it}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button type="button" aria-label="Previous" onClick={() => { const p = (active - 1 + n) % n; setActive(p); goTo(p) }}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink hover:bg-surface-low active:scale-95 transition">
          <ChevronLeft size={16} className="rtl:-scale-x-100" />
        </button>
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button key={i} type="button" aria-label={`Go to card ${i + 1}`} onClick={() => { setActive(i); goTo(i) }}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-lime' : 'w-2 bg-forest/25 hover:bg-forest/40'}`} />
          ))}
        </div>
        <button type="button" aria-label="Next" onClick={() => { const nx = (active + 1) % n; setActive(nx); goTo(nx) }}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink hover:bg-surface-low active:scale-95 transition">
          <ChevronRight size={16} className="rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  )
}
