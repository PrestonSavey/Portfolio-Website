import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { about, education, experience, profile, projects, skills, stats } from './data'
import type { Project } from './data'
import { Nav } from './components/Nav'
import { ScrambleText } from './components/ScrambleText'
import { Stats } from './components/Stats'
import { SpectrumGame } from './components/SpectrumGame'
import { TiltCard } from './components/TiltCard'
import { Reveal } from './components/Reveal'
import { ScrollProgress } from './components/ScrollProgress'
import { CommandPalette } from './components/CommandPalette'
import type { Command } from './components/CommandPalette'
import { ThemeProvider, useTheme } from './hooks/useTheme'
import { ToastProvider, useToast } from './hooks/useToast'

/* ---------- Small pieces ---------- */

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="section" id={id}>
      <Reveal>
        <h2>{title}</h2>
      </Reveal>
      {children}
    </section>
  )
}

function useCopyEmail() {
  const toast = useToast()
  return useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast('Email copied to clipboard ✓')
    } catch {
      toast(profile.email)
    }
  }, [toast])
}

function Hero() {
  return (
    <section className="hero" id="top">
      <p className="eyebrow">{profile.location}</p>
      <h1>
        {profile.name}
        <span className="hero-role">
          <ScrambleText phrases={profile.rolePhrases} />
        </span>
      </h1>
      <p className="hero-tagline">{profile.tagline}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href={profile.resume} target="_blank" rel="noreferrer">
          Résumé
        </a>
        <a className="btn" href={`mailto:${profile.email}`}>
          Email me
        </a>
        <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <Stats stats={stats} />
    </section>
  )
}

/* ---------- Skill filter ---------- */

type FilterProps = { activeSkill: string | null; onToggle: (s: string) => void }

function FilterBanner({ activeSkill, onToggle, count }: FilterProps & { count: number }) {
  if (!activeSkill) return null
  return (
    <div className="filter-banner" role="status">
      <span>
        Highlighting <strong>{count}</strong> {count === 1 ? 'place' : 'places'} I used <strong>{activeSkill}</strong>
      </span>
      <button className="link-button" onClick={() => onToggle(activeSkill)}>
        Clear ✕
      </button>
    </div>
  )
}

function About({ activeSkill, onToggle }: FilterProps) {
  return (
    <Section id="about" title="About">
      <div className="about">
        <Reveal>
          <div className="about-text">
            {about.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <aside className="about-side">
            <p className="hint">Tap a skill to highlight where I've used it ↓</p>
            {skills.map((s) => (
              <div key={s.group} className="skill-group">
                <h3>{s.group}</h3>
                <div className="tags">
                  {s.items.map((i) => (
                    <button
                      key={i}
                      className={`tag tag-button ${activeSkill === i ? 'is-active' : ''}`}
                      aria-pressed={activeSkill === i}
                      onClick={() => onToggle(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="skill-group">
              <h3>Education</h3>
              <p className="edu">
                {education.degree}
                <br />
                {education.school}, {education.year}
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  )
}

function TagList({ items, activeSkill }: { items: string[]; activeSkill: string | null }) {
  return (
    <ul className="tags">
      {items.map((t) => (
        <li key={t} className={`tag ${activeSkill === t ? 'is-match' : ''}`}>
          {t}
        </li>
      ))}
    </ul>
  )
}

function Experience({ activeSkill, onToggle, matchCount }: FilterProps & { matchCount: number }) {
  return (
    <Section id="experience" title="Experience">
      <FilterBanner activeSkill={activeSkill} onToggle={onToggle} count={matchCount} />
      <ol className="timeline">
        {experience.map((job, i) => {
          const dimmed = !!activeSkill && !job.skills.includes(activeSkill)
          return (
            <li key={job.title} className={`job ${dimmed ? 'is-dimmed' : ''}`}>
              <Reveal delay={i * 80}>
                <div className="job-head">
                  <h3>
                    {job.title} <span className="muted">· {job.company}</span>
                  </h3>
                  <span className="job-dates">{job.dates}</span>
                </div>
                <ul className="job-bullets">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <TagList items={job.skills} activeSkill={activeSkill} />
              </Reveal>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

function ProjectLinks({ p }: { p: Project }) {
  if (!p.live && !p.code) return null
  return (
    <div className="project-links">
      {p.live && (
        <a href={p.live} target="_blank" rel="noreferrer">
          Play it live ↗
        </a>
      )}
      {p.code && (
        <a href={p.code} target="_blank" rel="noreferrer">
          Source code ↗
        </a>
      )}
    </div>
  )
}

function Projects({ activeSkill }: { activeSkill: string | null }) {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const isDimmed = (p: Project) => !!activeSkill && !p.stack.includes(activeSkill)

  return (
    <Section id="projects" title="Projects">
      {featured.map((p) => (
        <Reveal key={p.name}>
          <article className={`project-featured ${isDimmed(p) ? 'is-dimmed' : ''}`}>
            <div className="project-featured-body">
              <p className="eyebrow">Featured · {p.year}</p>
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
              <ul className="game-list">
                {p.details.map((d) => {
                  const [name, ...desc] = d.split(' — ')
                  return (
                    <li key={d}>
                      <strong>{name}</strong>
                      <span>{desc.join(' — ').replace(/^./, (c) => c.toUpperCase())}</span>
                    </li>
                  )
                })}
              </ul>
              <TagList items={p.stack} activeSkill={activeSkill} />
              <ProjectLinks p={p} />
            </div>
            <div className="project-featured-demo" id="spectrum">
              <SpectrumGame />
            </div>
          </article>
        </Reveal>
      ))}
      <div className="project-grid">
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <TiltCard className="project-card" dimmed={isDimmed(p)}>
              <div className="project-card-head">
                <h3>{p.name}</h3>
                <span className="muted">{p.year}</span>
              </div>
              <p>{p.blurb}</p>
              {p.details.map((d) => (
                <p key={d} className="muted small">
                  {d}
                </p>
              ))}
              <TagList items={p.stack} activeSkill={activeSkill} />
              <ProjectLinks p={p} />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function Contact() {
  const copyEmail = useCopyEmail()
  return (
    <Section id="contact" title="Let's talk">
      <Reveal>
        <p className="contact-lead">
          I'm looking for full stack or frontend engineering roles in New York. The fastest way to reach me is email.
        </p>
        <div className="contact-email-row">
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <button className="btn btn-small" onClick={copyEmail}>
            Copy
          </button>
        </div>
        <div className="hero-actions">
          <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </Reveal>
    </Section>
  )
}

/* ---------- Page ---------- */

function Page() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const { setPref } = useTheme()
  const toast = useToast()
  const copyEmail = useCopyEmail()

  const toggleSkill = useCallback((s: string) => setActiveSkill((cur) => (cur === s ? null : s)), [])

  const matchCount = useMemo(() => {
    if (!activeSkill) return 0
    return (
      experience.filter((j) => j.skills.includes(activeSkill)).length +
      projects.filter((p) => p.stack.includes(activeSkill)).length
    )
  }, [activeSkill])

  // Global Ctrl/⌘+K shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const commands = useMemo<Command[]>(() => {
    const goTo = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    const open = (url: string) => () => window.open(url, '_blank', 'noopener')
    // Only offer filters for skills that actually appear somewhere.
    const used = new Set([...experience.flatMap((j) => j.skills), ...projects.flatMap((p) => p.stack)])
    const filterable = skills.flatMap((g) => g.items).filter((s) => used.has(s))

    return [
      { id: 'go-about', group: 'Navigate', label: 'About', hint: 'Section', run: goTo('about') },
      { id: 'go-exp', group: 'Navigate', label: 'Experience', hint: 'Section', keywords: 'work jobs medpace', run: goTo('experience') },
      { id: 'go-proj', group: 'Navigate', label: 'Projects', hint: 'Section', run: goTo('projects') },
      { id: 'go-game', group: 'Navigate', label: 'Play Spectrum', hint: 'Mini-game', keywords: 'game night dial', run: goTo('spectrum') },
      { id: 'go-contact', group: 'Navigate', label: 'Contact', hint: 'Section', run: goTo('contact') },
      { id: 'copy-email', group: 'Contact', label: 'Copy email address', hint: profile.email, run: copyEmail },
      { id: 'resume', group: 'Contact', label: 'Open résumé', hint: 'PDF', keywords: 'resume cv', run: open(profile.resume) },
      { id: 'linkedin', group: 'Contact', label: 'Open LinkedIn', run: open(profile.linkedin) },
      { id: 'github', group: 'Contact', label: 'Open GitHub', run: open(profile.github) },
      { id: 'theme-light', group: 'Theme', label: 'Light theme', run: () => { setPref('light'); toast('Light theme on') } },
      { id: 'theme-dark', group: 'Theme', label: 'Dark theme', run: () => { setPref('dark'); toast('Dark theme on') } },
      { id: 'theme-system', group: 'Theme', label: 'Match system theme', keywords: 'auto', run: () => { setPref('system'); toast('Following system theme') } },
      ...filterable.map((s) => ({
        id: `filter-${s}`,
        group: 'Highlight a skill',
        label: `Where I've used ${s}`,
        keywords: 'filter skill',
        run: () => {
          setActiveSkill(s)
          document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
        },
      })),
    ]
  }, [copyEmail, setPref, toast])

  return (
    <>
      <ScrollProgress />
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero />
        <About activeSkill={activeSkill} onToggle={toggleSkill} />
        <Experience activeSkill={activeSkill} onToggle={toggleSkill} matchCount={matchCount} />
        <Projects activeSkill={activeSkill} />
        <Contact />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.name} · Built from scratch with React + TypeScript — no UI libraries. Press{' '}
        <kbd>Ctrl</kbd> <kbd>K</kbd> to explore.
      </footer>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Page />
      </ToastProvider>
    </ThemeProvider>
  )
}
