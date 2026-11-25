import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'

export type Command = {
  id: string
  label: string
  group: string
  hint?: string
  keywords?: string
  run: () => void
}

/**
 * Fuzzy match: every query character must appear in order.
 * Consecutive matches and word-start matches score higher.
 */
export function fuzzyScore(text: string, query: string): number | null {
  if (!query) return 0
  const t = text.toLowerCase()
  const q = query.toLowerCase()
  let score = 0
  let ti = 0
  let prev = -2
  for (const ch of q) {
    const found = t.indexOf(ch, ti)
    if (found === -1) return null
    score += found === prev + 1 ? 3 : 1
    if (found === 0 || t[found - 1] === ' ') score += 2
    prev = found
    ti = found + 1
  }
  return score
}

/** Opens with Ctrl/⌘+K. Arrow keys to move, Enter to run, Esc to close. */
export function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean
  onClose: () => void
  commands: Command[]
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  const results = useMemo(() => {
    return commands
      .map((c) => ({ c, s: fuzzyScore(`${c.label} ${c.keywords ?? ''}`, query) }))
      .filter((r): r is { c: Command; s: number } => r.s !== null)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c)
  }, [commands, query])

  // Reset and focus on open; give focus back to whatever opened it on close.
  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement as HTMLElement
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      restoreFocus.current?.focus?.()
    }
  }, [open])

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const run = (cmd: Command | undefined) => {
    if (!cmd) return
    onClose()
    // Let the dialog unmount first so scroll/focus changes land cleanly.
    requestAnimationFrame(() => cmd.run())
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'Tab') {
      e.preventDefault() // keep focus inside the dialog
    }
  }

  // Group results for display while keeping one flat index for keyboard nav.
  let flatIndex = 0
  const groups = results.reduce<Record<string, Command[]>>((acc, c) => {
    ;(acc[c.group] ??= []).push(c)
    return acc
  }, {})

  return createPortal(
    <div className="cp-backdrop" onMouseDown={onClose}>
      <div
        className="cp"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="cp-input-row">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="cp-input"
            placeholder="Jump to a section, copy my email, change theme…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="cp-list"
            aria-activedescendant={results[active] ? `cp-${results[active].id}` : undefined}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="cp-list" id="cp-list" role="listbox" ref={listRef}>
          {results.length === 0 && <li className="cp-empty">No matches for “{query}”</li>}
          {Object.entries(groups).map(([group, cmds]) => (
            <li key={group} role="presentation">
              <div className="cp-group">{group}</div>
              <ul role="presentation">
                {cmds.map((c) => {
                  const i = flatIndex++
                  return (
                    <li
                      key={c.id}
                      id={`cp-${c.id}`}
                      data-index={i}
                      role="option"
                      aria-selected={i === active}
                      className={`cp-item ${i === active ? 'is-active' : ''}`}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(c)}
                    >
                      <span>{c.label}</span>
                      {c.hint && <span className="cp-hint">{c.hint}</span>}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
        <div className="cp-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
