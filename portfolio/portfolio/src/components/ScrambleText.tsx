import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01'

/**
 * Cycles through `phrases`, "decoding" each one from random glyphs
 * left-to-right. Screen readers get the first phrase as a stable label.
 */
export function ScrambleText({ phrases, holdMs = 2600 }: { phrases: string[]; holdMs?: number }) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState(phrases[0])

  // Advance to the next phrase after a pause.
  useEffect(() => {
    if (reduced || phrases.length < 2) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % phrases.length), holdMs)
    return () => window.clearTimeout(id)
  }, [index, holdMs, phrases.length, reduced])

  // Animate the scramble whenever the target phrase changes.
  useEffect(() => {
    const target = phrases[index]
    if (reduced) {
      setDisplay(target)
      return
    }
    const totalFrames = 28
    let frame = 0
    let raf = 0
    const step = () => {
      const revealed = Math.floor((frame / totalFrames) * target.length)
      let out = ''
      for (let i = 0; i < target.length; i++) {
        if (i < revealed || target[i] === ' ') out += target[i]
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setDisplay(out)
      if (frame++ < totalFrames) raf = requestAnimationFrame(step)
      else setDisplay(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [index, phrases, reduced])

  return (
    <span className="scramble" aria-label={phrases[0]}>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
