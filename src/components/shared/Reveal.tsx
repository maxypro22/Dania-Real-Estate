import { memo, useMemo } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: Direction
  className?: string
  threshold?: number
}

const hiddenTranslate: Record<Direction, string> = {
  up:    'translate-y-10',
  down:  '-translate-y-10',
  left:  'translate-x-10',
  right: '-translate-x-10',
  fade:  'translate-y-0',
}

export const Reveal = memo(function Reveal({
  children,
  delay = 0,
  duration = 700,
  direction = 'up',
  className = '',
  threshold,
}: RevealProps) {
  const { ref, visible } = useScrollReveal(threshold)

  const style = useMemo(() => ({
    transitionDuration: `${duration}ms`,
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }), [duration, delay, visible])

  const visibilityClass = visible
    ? 'opacity-100 translate-y-0 translate-x-0'
    : `opacity-0 ${hiddenTranslate[direction]}`

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={style}
      className={`transition-all ease-out ${visibilityClass} ${className}`}
    >
      {children}
    </div>
  )
})
