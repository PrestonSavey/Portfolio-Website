import { useTheme } from '../hooks/useTheme'

const LABEL = { system: 'Auto', light: 'Light', dark: 'Dark' } as const

/** Cycles system → light → dark. The icon morphs between sun, moon and half-moon. */
export function ThemeToggle() {
  const { pref, cycle } = useTheme()
  return (
    <button
      className={`theme-toggle is-${pref}`}
      onClick={cycle}
      aria-label={`Theme: ${LABEL[pref]}. Click to change.`}
      title={`Theme: ${LABEL[pref]}`}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <mask id="theme-mask">
          <rect width="24" height="24" fill="white" />
          <circle className="tt-cut" cx="24" cy="4" r="7" fill="black" />
        </mask>
        <circle className="tt-core" cx="12" cy="12" r="6" mask="url(#theme-mask)" fill="currentColor" />
        <g className="tt-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4
            return (
              <line key={i} x1={12 + Math.cos(a) * 9} y1={12 + Math.sin(a) * 9} x2={12 + Math.cos(a) * 11} y2={12 + Math.sin(a) * 11} />
            )
          })}
        </g>
        <path className="tt-half" d="M12 6a6 6 0 0 1 0 12z" fill="var(--bg)" />
      </svg>
      <span className="theme-toggle-label">{LABEL[pref]}</span>
    </button>
  )
}
