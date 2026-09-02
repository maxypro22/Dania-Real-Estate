import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { QuickSearchPanel } from '@/components/search/QuickSearchPanel'

/* Cinematic luxury-villa walkthrough, exported as a frame sequence and scrubbed
 * by scroll position (Apple-style). Scroll down → walkthrough plays forward;
 * scroll up → it reverses. Frames are hashed/immutable assets via Vite's glob. */
const frameMap = import.meta.glob('../../assets/hero/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const FRAMES = Object.keys(frameMap).sort().map(k => frameMap[k])

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Don't pull ~4.9 MB of walkthrough frames on metered/slow links. On Save-Data
// or a 2G-class connection the hero stays on frame 0 (static), like reduced
// motion — the page is fully usable, just without the scroll-scrub animation.
function shouldSkipHeavyPreload(): boolean {
  if (typeof navigator === 'undefined') return false
  const conn = (navigator as unknown as {
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  return conn?.saveData === true || /2g/.test(conn?.effectiveType ?? '')
}

export function HeroSequence() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const currentRef = useRef(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // ── preload frames progressively; nearestLoaded() covers gaps ──
    // Frame 0 loads immediately (it is the hero's LCP paint). The other 119
    // frames are deferred to idle time in small batches so we don't fire 120
    // parallel image requests that contend with first paint. Under
    // reduced-motion the hero is static and only frame 0 is ever shown, so
    // nothing else is fetched.
    const imgs: HTMLImageElement[] = new Array(FRAMES.length)
    const loaded: boolean[] = new Array(FRAMES.length).fill(false)

    const loadFrame = (i: number) => {
      if (i < 0 || i >= FRAMES.length || imgs[i]) return
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => { loaded[i] = true; if (i <= currentTarget()) draw(true) }
      img.src = FRAMES[i]
      imgs[i] = img
    }

    const requestIdle: (cb: () => void) => number =
      window.requestIdleCallback ?? ((cb) => window.setTimeout(cb, 1))
    const cancelIdle: (h: number) => void =
      window.cancelIdleCallback ?? window.clearTimeout
    let idleHandle = 0
    let nextFrame = 1
    const skipHeavyPreload = shouldSkipHeavyPreload()
    const loadRemaining = () => {
      if (prefersReduced || skipHeavyPreload) return
      const BATCH = 8
      for (let n = 0; n < BATCH && nextFrame < FRAMES.length; n++) loadFrame(nextFrame++)
      if (nextFrame < FRAMES.length) idleHandle = requestIdle(loadRemaining)
    }

    loadFrame(0)
    idleHandle = requestIdle(loadRemaining)

    let cw = 0
    let ch = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function progress() {
      if (prefersReduced) return 0
      const rect = section!.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      if (span <= 0) return 0
      return Math.min(Math.max(-rect.top / span, 0), 1)
    }

    const currentTarget = () =>
      Math.round(progress() * (FRAMES.length - 1))

    function nearestLoaded(idx: number) {
      if (loaded[idx]) return idx
      for (let d = 1; d < FRAMES.length; d++) {
        if (idx - d >= 0 && loaded[idx - d]) return idx - d
        if (idx + d < FRAMES.length && loaded[idx + d]) return idx + d
      }
      return -1
    }

    function drawCover(img: HTMLImageElement) {
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      if (!iw || !ih) return
      const ir = iw / ih
      const cr = cw / ch
      let dw: number, dh: number, dx: number, dy: number
      if (cr > ir) { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2 }
      else { dh = ch; dw = ch * ir; dy = 0; dx = (cw - dw) / 2 }
      ctx!.drawImage(img, dx, dy, dw, dh)
    }

    function applyContent(p: number) {
      const content = contentRef.current
      if (content) {
        // hold, then ease the copy away in the final third for a clean reveal
        const fade = p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.33)
        content.style.opacity = String(fade)
        content.style.transform = `translate3d(0, ${(-p * 64).toFixed(1)}px, 0)`
        // Once the copy has faded out it must stop swallowing clicks — the
        // search bar lives inside this block and the sticky bar takes over.
        content.style.pointerEvents = fade < 0.15 ? 'none' : 'auto'
      }
      const cue = cueRef.current
      if (cue) cue.style.opacity = String(Math.max(0, 1 - p / 0.12))
    }

    function draw(force: boolean) {
      const p = progress()
      const target = Math.round(p * (FRAMES.length - 1))
      applyContent(p)
      if (!force && target === currentRef.current) return
      const idx = nearestLoaded(target)
      if (idx >= 0) { drawCover(imgs[idx]); currentRef.current = target }
    }

    function resize() {
      cw = canvas!.clientWidth
      ch = canvas!.clientHeight
      canvas!.width = Math.round(cw * dpr)
      canvas!.height = Math.round(ch * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      currentRef.current = -1
      draw(true)
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => draw(false))
    }

    resize()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      cancelIdle(idleHandle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative bg-forest ${prefersReduced ? 'min-h-screen' : 'h-[230vh]'}`}
    >
      {/* sticky stage — pins to the viewport while the section scrolls past */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
        {/* legibility tints (kept below the copy, above the frames) */}
        <div className="absolute inset-0 bg-forest/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/70 via-forest/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-forest to-transparent pointer-events-none" />

        {/* hero copy */}
        <div className="relative z-10 h-full flex items-center">
          <div
            ref={contentRef}
            className="max-w-[1280px] mx-auto px-6 w-full text-white will-change-transform"
          >
            <p className="text-lime text-sm font-semibold tracking-widest uppercase mb-3">{t('home.hero.eyebrow')}</p>
            {/* The H1 is screen-reader only: the client specified an H2 for the
                visible banner title, and a page with no H1 at all would be an
                accessibility and SEO regression. */}
            <h1 className="sr-only">{t('home.hero.h1').replace('|', '—')}</h1>
            <h2 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t('home.hero.h2')}
            </h2>
            <h4 className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-white/80 sm:text-lg">
              {t('home.hero.h4')}
            </h4>
            <div className="my-6 sm:my-8">
              <QuickSearchPanel />
            </div>
            {/* The banner now carries a headline, a sub-title and the search
                panel, so the supporting copy steps aside on small screens
                rather than pushing the search below the fold. */}
            <div className="hidden flex-wrap gap-x-6 gap-y-2 sm:flex">
              {[t('home.hero.trust0'), t('home.hero.trust1'), t('home.hero.trust2'), t('home.hero.trust3')].map(v => (
                <span key={v} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle2 size={14} className="text-lime shrink-0" /> {v}
                </span>
              ))}
            </div>
            <p className="mt-5 hidden max-w-2xl text-white/55 text-sm leading-relaxed lg:block">{t('home.hero.trustLine')}</p>
          </div>
        </div>

        {/* scroll cue */}
        {!prefersReduced && (
          <div
            ref={cueRef}
            className="absolute bottom-6 inset-x-0 z-10 flex flex-col items-center gap-1 text-white/70 pointer-events-none"
          >
            <span className="text-[11px] font-medium tracking-widest uppercase">{isAr ? 'مرّر للاستكشاف' : 'Scroll to explore'}</span>
            <ChevronDown size={18} className="animate-bounce" />
          </div>
        )}
      </div>
    </section>
  )
}
