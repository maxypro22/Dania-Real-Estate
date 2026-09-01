import { useId } from 'react'
import type { Bounds } from '@/lib/search'

interface Props {
  bounds: Bounds
  /** `null` means "open end" — i.e. the visitor has not narrowed that side. */
  value: [number | null, number | null]
  onChange: (next: [number | null, number | null]) => void
  format: (n: number) => string
  /** Accessible names for the two handles. */
  minLabel: string
  maxLabel: string
}

/**
 * Two-handle range control built from a pair of native range inputs stacked on
 * one track — keyboard-operable and screen-reader friendly for free, unlike a
 * div-and-pointer-events reimplementation. Only the thumbs take pointer events
 * (see `.range-thumb` in index.css), so whichever handle you grab is the one
 * that moves.
 *
 * A handle parked at its end of the scale reports `null`, so an untouched
 * slider adds nothing to the URL and never fences results in by accident.
 */
export function RangeSlider({ bounds, value, onChange, format, minLabel, maxLabel }: Readonly<Props>) {
  const { min, max, step } = bounds
  const id = useId()
  const lo = value[0] ?? min
  const hi = value[1] ?? max
  const span = Math.max(max - min, 1)
  const pct = (n: number) => ((n - min) / span) * 100

  const emit = (nextLo: number, nextHi: number) => {
    onChange([nextLo <= min ? null : nextLo, nextHi >= max ? null : nextHi])
  }

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-lime"
          style={{ insetInlineStart: `${pct(lo)}%`, width: `${Math.max(pct(hi) - pct(lo), 0)}%` }}
        />
        <input
          type="range"
          aria-label={minLabel}
          id={`${id}-min`}
          min={min}
          max={max}
          step={step}
          value={lo}
          // Handles may meet but never cross.
          onChange={(e) => emit(Math.min(Number(e.target.value), hi), hi)}
          className="range-thumb absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
        />
        <input
          type="range"
          aria-label={maxLabel}
          id={`${id}-max`}
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => emit(lo, Math.max(Number(e.target.value), lo))}
          className="range-thumb absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-ink-faint">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}
