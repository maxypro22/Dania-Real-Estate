import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  alt: string
  /** Tailwind aspect / height classes for the frame. */
  className?: string
  /** Intrinsic size hints so the browser reserves layout space (no CLS). */
  width?: number
  height?: number
  eager?: boolean
}

/**
 * The photo frame on a listing card: swipeable-by-arrows gallery with dots.
 * The arrows stop propagation so paging never triggers the card's link.
 */
export function PropertyPhotoStrip({
  images, alt, className = 'aspect-[4/3]', width = 800, height = 600, eager = false,
}: Readonly<Props>) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [index, setIndex] = useState(0)
  const total = images.length

  const go = (delta: number) => (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex((i) => (i + delta + total) % total)
  }

  return (
    <div className={`group/photo relative w-full overflow-hidden bg-surface-low ${className}`}>
      <img
        src={images[index]}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={go(-1)}
            aria-label={isAr ? 'الصورة السابقة' : 'Previous photo'}
            className="absolute start-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/65 focus-visible:opacity-100 group-hover/photo:opacity-100 max-md:opacity-100"
          >
            <ChevronLeft size={17} className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            aria-label={isAr ? 'الصورة التالية' : 'Next photo'}
            className="absolute end-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/65 focus-visible:opacity-100 group-hover/photo:opacity-100 max-md:opacity-100"
          >
            <ChevronRight size={17} className="rtl:-scale-x-100" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1.5">
            {images.slice(0, 7).map((src, i) => (
              <span
                key={src}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/55'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
