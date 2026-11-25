import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
  return (
    <div ref={ref} className={`reveal ${inView ? 'is-in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
