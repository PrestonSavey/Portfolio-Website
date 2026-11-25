import { useLayoutEffect, useRef, useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]
const IDS = LINKS.map((l) => l.id)

/**
 * Sticky nav whose pill indicator slides to the section you're reading.
 * On small screens the links collapse and the ⌘K button becomes the menu.
 */
export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const active = useScrollSpy(IDS)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  // Measure the active link after layout so the pill lands exactly on it.
  useLayoutEffect(() => {
    const measure = () => {
      const el = active ? linkRefs.current[active] : null
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <header className="nav">
      <a href="#top" className="nav-logo" aria-label="Back to top">
        PS
      </a>
      <nav className="nav-links" aria-label="Sections">
        <span
          className="nav-pill"
          aria-hidden="true"
          style={pill ? { transform: `translateX(${pill.left}px)`, width: pill.width, opacity: 1 } : { opacity: 0 }}
        />
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            ref={(el) => {
              linkRefs.current[l.id] = el
            }}
            className={active === l.id ? 'is-active' : ''}
            aria-current={active === l.id ? 'true' : undefined}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className="nav-tools">
        <ThemeToggle />
        <button className="kbd-button" onClick={onOpenPalette} aria-label="Open command menu">
          <span className="kbd-button-desktop">
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </span>
          <span className="kbd-button-mobile">Menu</span>
        </button>
      </div>
    </header>
  )
}
