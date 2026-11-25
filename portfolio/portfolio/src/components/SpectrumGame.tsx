import { useReducer, useRef } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'

/**
 * A one-player mini version of Spectrum from Game Night.
 * The page gives a clue; drag the dial to where you think the hidden
 * target sits between two extremes, then reveal it to score.
 */

type Round = { left: string; right: string; clue: string; target: number }

const ROUNDS: Round[] = [
  { left: 'Cold', right: 'Hot', clue: 'Fresh coffee', target: 80 },
  { left: 'Useless', right: 'Essential', clue: 'Semicolons in JavaScript', target: 38 },
  { left: 'Underrated', right: 'Overrated', clue: 'Pineapple on pizza', target: 62 },
  { left: 'Easy', right: 'Hard', clue: 'Naming variables', target: 85 },
  { left: 'Quiet', right: 'Loud', clue: 'A library', target: 8 },
  { left: 'Bad habit', right: 'Good habit', clue: 'Writing tests first', target: 78 },
  { left: 'Boring', right: 'Exciting', clue: 'A merge conflict', target: 30 },
]

type State = {
  order: number[]
  round: number
  guess: number
  phase: 'guessing' | 'revealed'
  total: number
  played: number
}

type Action = { type: 'move'; value: number } | { type: 'reveal' } | { type: 'next' }

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/** Same scoring bands as the real game: closer = more points. */
export function scoreFor(guess: number, target: number) {
  const d = Math.abs(guess - target)
  if (d <= 4) return 4
  if (d <= 10) return 3
  if (d <= 18) return 2
  return 0
}

function shuffle(n: number) {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'move':
      return state.phase === 'guessing' ? { ...state, guess: clamp(action.value) } : state
    case 'reveal': {
      if (state.phase !== 'guessing') return state
      const target = ROUNDS[state.order[state.round]].target
      return {
        ...state,
        phase: 'revealed',
        total: state.total + scoreFor(state.guess, target),
        played: state.played + 1,
      }
    }
    case 'next': {
      const nextRound = state.round + 1
      // Reshuffle once every clue has been seen.
      if (nextRound >= state.order.length) {
        return { ...state, order: shuffle(ROUNDS.length), round: 0, guess: 50, phase: 'guessing' }
      }
      return { ...state, round: nextRound, guess: 50, phase: 'guessing' }
    }
  }
}

const init = (): State => ({ order: shuffle(ROUNDS.length), round: 0, guess: 50, phase: 'guessing', total: 0, played: 0 })

const VERDICT = ['Way off!', '', 'Close!', 'Nice read!', 'Bullseye!']

export function SpectrumGame() {
  const [state, dispatch] = useReducer(reducer, undefined, init)
  const track = useRef<HTMLDivElement>(null)
  const current = ROUNDS[state.order[state.round]]
  const revealed = state.phase === 'revealed'
  const points = revealed ? scoreFor(state.guess, current.target) : 0

  const valueFromPointer = (clientX: number) => {
    const r = track.current!.getBoundingClientRect()
    return ((clientX - r.left) / r.width) * 100
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (revealed) return
    e.currentTarget.setPointerCapture(e.pointerId) // keep dragging even if the pointer leaves the track
    dispatch({ type: 'move', value: valueFromPointer(e.clientX) })
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) dispatch({ type: 'move', value: valueFromPointer(e.clientX) })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    const keys: Record<string, number> = {
      ArrowLeft: state.guess - step,
      ArrowDown: state.guess - step,
      ArrowRight: state.guess + step,
      ArrowUp: state.guess + step,
      Home: 0,
      End: 100,
    }
    if (e.key in keys) {
      e.preventDefault()
      dispatch({ type: 'move', value: keys[e.key] })
    } else if (e.key === 'Enter') {
      dispatch({ type: revealed ? 'next' : 'reveal' })
    }
  }

  return (
    <div className="spectrum-game">
      <div className="sg-header">
        <span className="sg-label">Try a round of Spectrum</span>
        <span className="sg-score" aria-live="polite">
          {state.total} pts · {state.played} played
        </span>
      </div>

      <p className="sg-clue">
        Clue: <strong>“{current.clue}”</strong>
      </p>

      <div className="sg-ends">
        <span>← {current.left}</span>
        <span>{current.right} →</span>
      </div>

      <div
        ref={track}
        className={`sg-track ${revealed ? 'is-revealed' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label={`Where does "${current.clue}" fall between ${current.left} and ${current.right}?`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={state.guess}
        aria-valuetext={`${state.guess} out of 100`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        {/* Scoring bands around the target, hidden until reveal */}
        <div className="sg-target" style={{ '--t': `${current.target}%` } as CSSProperties} aria-hidden="true">
          <span className="band b2" />
          <span className="band b3" />
          <span className="band b4" />
        </div>
        <div className="sg-dial" style={{ left: `${state.guess}%` }} aria-hidden="true">
          <span className="sg-dial-value">{state.guess}</span>
        </div>
      </div>

      <div className="sg-footer">
        <span className="sg-result" aria-live="polite">
          {revealed
            ? `${VERDICT[points] || 'Not bad'} Target was ${current.target}. +${points}`
            : 'Drag the dial to make your guess'}
        </span>
        <button className="btn btn-small" onClick={() => dispatch({ type: revealed ? 'next' : 'reveal' })}>
          {revealed ? 'Next clue →' : 'Lock it in'}
        </button>
      </div>
    </div>
  )
}
