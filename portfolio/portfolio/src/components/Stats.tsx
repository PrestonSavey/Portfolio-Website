import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'

export type Stat = { value: number; suffix?: string; label: string }

function StatItem({ stat, start, delay }: { stat: Stat; start: boolean; delay: number }) {
  const n = useCountUp(stat.value, start, 1200 + delay)
  return (
    <div className="stat" style={{ transitionDelay: `${delay}ms` }}>
      <span className="stat-value">
        {n}
        {stat.suffix}
      </span>
      <span className="stat-label">{stat.label}</span>
    </div>
  )
}

/** A row of numbers that count up the first time they scroll into view. */
export function Stats({ stats }: { stats: Stat[] }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 })
  return (
    <div ref={ref} className={`stats ${inView ? 'is-in' : ''}`}>
      {stats.map((s, i) => (
        <StatItem key={s.label} stat={s} start={inView} delay={i * 120} />
      ))}
    </div>
  )
}
