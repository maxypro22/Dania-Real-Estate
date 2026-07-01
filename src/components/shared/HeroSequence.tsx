import { useEffect, useRef, Fragment, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { company } from '@/data/mockData'

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

export function HeroSequence() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  // H1 carries the brand after a "|" — render it as the animated wordmark.
  const [h1Lead, h1Brand] = t('home.hero.h1').split('|').map(s => s.trim())
  let _li = 0
  const brandWords = (h1Brand ?? '').split(' ').map(word => ({
    word,
    letters: [...word].map(ch => ({ ch, i: _li++ })),
  }))

  // Subtitle split into words for the scroll-scrubbed "written on scroll" reveal
  const subtitleWords = t('home.hero.subtitle').split(' ')

  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const currentRef = useRef(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // ── preload every frame; track which have decoded ──
    const imgs: HTMLImageElement[] = []
    const loaded: boolean[] = new Array(FRAMES.length).fill(false)
    FRAMES.forEach((src, i) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => { loaded[i] = true; if (i <= currentTarget()) draw(true) }
      img.src = src
      imgs[i] = img
    })

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
      }
      // Pitch-style: subtitle words brighten one after another as you scroll,
      // and dim back when you scroll up — the same text, "written" on scroll.
      const sub = subtitleRef.current
      if (sub) {
        const words = sub.querySelectorAll<HTMLElement>('[data-w]')
        if (prefersReduced) {
          words.forEach(el => { el.style.opacity = '1' })
        } else {
          const reveal = Math.min(Math.max(p / 0.42, 0), 1) * words.length
          words.forEach((el, i) => {
            const wp = Math.min(Math.max(reveal - i, 0), 1)
            el.style.opacity = String(0.32 + 0.68 * wp)
          })
        }
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
            <p className="text-lime text-sm font-semibold tracking-widest uppercase mb-4">{t('home.hero.eyebrow')}</p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6 max-w-3xl">
              {h1Lead}{' '}
              {h1Brand && (
                isAr ? (
                  <span className="brand-wordmark inline-block pb-1 tracking-tight">{h1Brand}</span>
                ) : (
                  <span className="inline tracking-tight" aria-label={h1Brand}>
                    {brandWords.map(({ letters }, wi) => (
                      <Fragment key={wi}>
                        {wi > 0 ? ' ' : null}
                        <span className="inline-block whitespace-nowrap pb-1" aria-hidden="true">
                          {letters.map(({ ch, i }) => (
                            <span key={i} className="brand-letter" style={{ '--i': i } as CSSProperties}>
                              {ch}
                            </span>
                          ))}
                        </span>
                      </Fragment>
                    ))}
                  </span>
                )
              )}
            </h1>
            <p ref={subtitleRef} className="text-white text-base sm:text-lg max-w-2xl mb-6 sm:mb-8 leading-relaxed">
              {subtitleWords.map((w, i) => (
                <span key={i} data-w className="transition-opacity duration-150 ease-out" style={{ opacity: 0.32 }}>
                  {w}{i < subtitleWords.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
            <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mb-8">
              <Link to="/apartments-for-rent/"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-lime text-forest font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-sm">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('home.hero.exploreBtn')}</span>
              </Link>
              <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="group relative overflow-hidden hidden md:inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-sm backdrop-blur-sm">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-forest">{t('home.hero.whatsappBtn')}</span>
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[t('home.hero.trust0'), t('home.hero.trust1'), t('home.hero.trust2'), t('home.hero.trust3')].map(v => (
                <span key={v} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle2 size={14} className="text-lime shrink-0" /> {v}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-2xl text-white/55 text-sm leading-relaxed">{t('home.hero.trustLine')}</p>
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
