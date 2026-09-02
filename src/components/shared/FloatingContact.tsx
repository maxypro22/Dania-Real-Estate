import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, X } from 'lucide-react'
import { company } from '@/data/mockData'
import { WhatsappIcon } from '@/components/shared/WhatsappIcon'
import { Ltr } from '@/components/shared/Ltr'

type Channel = 'call' | 'whatsapp'

/**
 * The floating Call + WhatsApp widgets.
 *
 * The business runs two lines, so neither button can act on its own — tapping
 * one opens a small sheet listing Line 1 and Line 2 and the visitor picks. The
 * sheet is the same on desktop and touch; only one is open at a time, and it
 * closes on outside tap, Escape, or a route change.
 */
export function FloatingContact() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const { pathname } = useLocation()
  const [open, setOpen] = useState<Channel | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Both public mobile lines, in the order the client lists them.
  const lines = [company.phone, company.phone2].filter(Boolean)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Navigating away should never leave a sheet hanging over the new page.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(null) }, [pathname])

  const href = (display: string) =>
    open === 'whatsapp'
      ? `https://wa.me/${display.replace(/\D/g, '')}`
      : `tel:${display.replace(/\s/g, '')}`

  const sheetTitle = open === 'whatsapp'
    ? (isAr ? 'اختر رقم واتساب' : 'Choose a WhatsApp line')
    : (isAr ? 'اختر رقمًا للاتصال' : 'Choose a line to call')

  return (
    <div ref={wrapRef} className="fixed bottom-5 end-5 z-50 flex flex-col items-end gap-2.5 sm:bottom-6 sm:end-6">
      {/* Line picker */}
      {open && (
        <div
          role="dialog"
          aria-label={sheetTitle}
          className="w-[248px] origin-bottom-right animate-[stacked-pop_220ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-2xl border border-border bg-white p-3 shadow-2xl shadow-forest/25"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">{sheetTitle}</p>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={isAr ? 'إغلاق' : 'Close'}
              className="grid h-6 w-6 place-items-center rounded-full text-ink-faint transition-colors hover:bg-surface-low hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {lines.map((display, i) => (
              <a
                key={display}
                href={href(display)}
                {...(open === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => setOpen(null)}
                className={`group flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 transition-colors ${
                  open === 'whatsapp' ? 'hover:border-whatsapp hover:bg-whatsapp/10' : 'hover:border-forest hover:bg-surface-low'
                }`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white ${
                  open === 'whatsapp' ? 'bg-whatsapp' : 'bg-forest'
                }`}>
                  {open === 'whatsapp' ? <WhatsappIcon size={15} /> : <Phone size={14} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-lime">
                    {isAr ? `الخط ${i + 1}` : `Line ${i + 1}`}
                  </span>
                  <span className="block text-sm font-semibold text-ink">
                    <Ltr>{display}</Ltr>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Call */}
      <button
        type="button"
        onClick={() => setOpen((c) => (c === 'call' ? null : 'call'))}
        aria-expanded={open === 'call'}
        aria-label={isAr ? 'اتصل بنا الآن' : 'Call us now'}
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-lime to-lime-dark py-2 pe-2 ps-2 text-sm font-semibold text-white shadow-lg shadow-forest/30 ring-1 ring-white/30 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 active:scale-95 sm:pe-4"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <Phone size={17} className="transition-transform duration-300 group-hover:scale-110" />
        </span>
        <span className="hidden pe-1 sm:inline">{isAr ? 'اتصل بنا الآن' : 'Call Us Now'}</span>
      </button>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={() => setOpen((c) => (c === 'whatsapp' ? null : 'whatsapp'))}
        aria-expanded={open === 'whatsapp'}
        aria-label={isAr ? 'تحدث عبر واتساب' : 'Chat on WhatsApp'}
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#25D366] to-[#0F8A52] py-2 pe-2 ps-2 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 ring-1 ring-white/30 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 active:scale-95 sm:pe-4"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <WhatsappIcon size={18} className="transition-transform duration-300 group-hover:scale-110" />
        </span>
        <span className="hidden pe-1 sm:inline">{isAr ? 'تحدث عبر واتساب' : 'Chat on WhatsApp'}</span>
      </button>
    </div>
  )
}
