import { useEffect, useState, type ReactNode } from 'react'

interface StackedCardsProps {
  items: ReactNode[]
  /** ms each card stays in front before auto-advancing */
  interval?: number
  className?: string
}

/**
 * Pitch-style stacked card deck: one card sits in front (in flow, so it
 * defines the height), the next cards peek out behind it as coloured
 * shoulders, and the deck auto-advances on a timer. A segmented progress
 * bar underneath fills for the active card and lets you jump to any card.
 * Press-and-hold pauses the rotation.
 */
export function StackedCards({ items, interval = 4200, className = '' }: StackedCardsProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = items.length

  useEffect(() => {
    if (paused || n <= 1) return
    const id = window.setTimeout(() => setActive(a => (a + 1) % n), interval)
    return () => window.clearTimeout(id)
  }, [active, paused, n, interval])

  return (
    <div className={className}>
      <div
        className="relative pt-4"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        {/* peeking shoulders of the cards behind */}
        <div className="pointer-events-none absolute top-0 inset-x-10 h-24 rounded-3xl bg-lime/50" aria-hidden="true" />
        <div className="pointer-events-none absolute top-2 inset-x-5 h-24 rounded-3xl bg-forest/60" aria-hidden="true" />

        {/* active card — kept in normal flow so it sets the deck height */}
        <div key={active} className="relative z-10 stacked-pop">
          {items[active]}
        </div>
      </div>

      {/* segmented progress / jump control */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show card ${i + 1} of ${n}`}
            onClick={() => setActive(i)}
            className="relative h-1.5 rounded-full overflow-hidden bg-forest/15 transition-all duration-300"
            style={{ width: i === active ? 38 : 16 }}
          >
            {i === active && (
              paused
                ? <span className="absolute inset-0 bg-lime" />
                : <span key={active} className="absolute inset-0 origin-left bg-lime stacked-progress" style={{ animationDuration: `${interval}ms` }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
