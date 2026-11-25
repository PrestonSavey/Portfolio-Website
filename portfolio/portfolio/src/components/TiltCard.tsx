import { useRef } from 'react'
import type { ReactNode, PointerEvent } from 'react'

/**
 * A card that tilts toward the cursor and shows a spotlight glow.
 * Pointer position is written straight to CSS custom properties on the
 * element, so moving the mouse never triggers a React re-render.
 * Tilt is turned off by CSS for touch devices and reduced-motion users.
 */
export function TiltCard({
  children,
  className = '',
  dimmed = false,
  maxTilt = 6,
}: {
  children: ReactNode
  className?: string
  dimmed?: boolean
  maxTilt?: number
}) {
  const ref = useRef<HTMLElement>(null)

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width // 0..1
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.setProperty('--ry', `${(x - 0.5) * maxTilt * 2}deg`)
    el.style.setProperty('--rx', `${(0.5 - y) * maxTilt * 2}deg`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <article
      ref={ref}
      className={`tilt ${className} ${dimmed ? 'is-dimmed' : ''}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="tilt-glow" aria-hidden="true" />
      {children}
    </article>
  )
}
