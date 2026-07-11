import { memo, useEffect, useMemo, useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface CountUpProps {
  value: string
  label: string
  delay?: number
  duration?: number
  className?: string
  labelClassName?: string
}

function parseValue(value: string): { target: number; suffix: string } {
  const stripped = value.replace(/,/g, '')
  const match = stripped.match(/^(\d+)(.*)$/)
  if (!match) return { target: 0, suffix: value }
  return { target: parseInt(match[1], 10), suffix: match[2] }
}

export const CountUp = memo(function CountUp({
  value,
  label,
  delay = 0,
  duration = 1800,
  className = '',
  labelClassName = '',
}: CountUpProps) {
  const { ref, visible } = useScrollReveal(0.3)
  const [count, setCount] = useState(0)

  // Only recompute when value string changes
  const { target, suffix } = useMemo(() => parseValue(value), [value])

  useEffect(() => {
    if (!visible) return

    const startTime = performance.now() + delay
    let raf: number

    const tick = (now: number) => {
      if (now < startTime) { raf = requestAnimationFrame(tick); return }
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, target, delay, duration])

  const display = count >= 1000 ? count.toLocaleString() : count.toString()

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <p className={className}>{display}{suffix}</p>
      <p className={labelClassName}>{label}</p>
    </div>
  )
})
