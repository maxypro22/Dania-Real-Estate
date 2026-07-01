import { useEffect, useRef, type ElementType } from 'react'

interface ScrollRevealTextProps {
  /** The full text; it is split into words that brighten one-by-one on scroll. */
  text: string
  /** Element to render (default <p>). Use 'h2'/'span' for headings/inline. */
  as?: ElementType
  className?: string
  /** Resting opacity of not-yet-revealed words (0 to 1). */
  from?: number
}

/**
 * Pitch/Apple-style scroll text reveal - the same mechanic as the home hero
 * subtitle, generalised so any long paragraph can "write itself" as it scrolls
 * up through the viewport. Each word is a <span> that starts dimmed and
 * brightens in sequence, tied to the element's position between 85% and 35%
 * of the viewport height. Text already in view on load renders fully lit, so
 * above-the-fold hero copy stays readable. Honours prefers-reduced-motion.
 */
export function ScrollRevealText({
  text,
  as: Tag = 'p',
  className = '',
  from = 0.25,
}: ScrollRevealTextProps) {
  const elRef = useRef<HTMLElement | null>(null)
  const setRef = (node: HTMLElement | null) => {
    elRef.current = node
  }
  const words = text.split(' ')

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-w]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => (s.style.opacity = '1'))
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const start = vh * 0.85
      const end = vh * 0.35
      const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1)
      const reveal = p * spans.length
      spans.forEach((s, i) => {
        const wp = Math.min(Math.max(reveal - i, 0), 1)
        s.style.opacity = String(from + (1 - from) * wp)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [text, from])

  return (
    <Tag ref={setRef} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          data-w
          className="transition-opacity duration-150 ease-out"
          style={{ opacity: from }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
