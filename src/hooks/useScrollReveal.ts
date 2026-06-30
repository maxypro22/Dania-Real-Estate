import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  // Keep threshold stable so the observer isn't recreated on every parent re-render
  const thresholdRef = useRef(threshold)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: thresholdRef.current,
        rootMargin: '0px 0px -40px 0px', // trigger slightly before the element fully enters viewport
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, []) // empty deps — threshold is read from ref, observer created once per mount

  return { ref, visible }
}
