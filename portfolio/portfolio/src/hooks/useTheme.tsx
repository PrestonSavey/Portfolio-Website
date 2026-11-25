import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

export type ThemePref = 'light' | 'dark' | 'system'
type ThemeCtx = { pref: ThemePref; resolved: 'light' | 'dark'; setPref: (p: ThemePref) => void; cycle: () => void }

const STORAGE_KEY = 'theme-pref'
const ThemeContext = createContext<ThemeCtx | null>(null)

function readStoredPref(): ThemePref {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* storage unavailable — fall through */
  }
  return 'system'
}

const darkQuery = '(prefers-color-scheme: dark)'
const subscribeSystem = (cb: () => void) => {
  const mql = window.matchMedia(darkQuery)
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(readStoredPref)
  const systemDark = useSyncExternalStore(subscribeSystem, () => window.matchMedia(darkQuery).matches, () => false)
  const resolved = pref === 'system' ? (systemDark ? 'dark' : 'light') : pref

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const setPref = useCallback((p: ThemePref) => {
    setPrefState(p)
    try {
      localStorage.setItem(STORAGE_KEY, p)
    } catch {
      /* ignore */
    }
  }, [])

  const cycle = useCallback(() => {
    const order: ThemePref[] = ['system', 'light', 'dark']
    setPref(order[(order.indexOf(pref) + 1) % order.length])
  }, [pref, setPref])

  const value = useMemo(() => ({ pref, resolved, setPref, cycle }), [pref, resolved, setPref, cycle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
