import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref and whether that element has scrolled into view.
 * With `once` (default) it stops observing after the first hit, so
 * entrance animations only play one time.
 */
export function useInView<T extends Element>(options: IntersectionObserverInit & { once?: boolean } = {}) {
  const { once = true, ...observerOptions } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        if (once) observer.disconnect()
      } else if (!once) {
        setInView(false)
      }
    }, observerOptions)
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, observerOptions.rootMargin, observerOptions.threshold])

  return [ref, inView] as const
}
