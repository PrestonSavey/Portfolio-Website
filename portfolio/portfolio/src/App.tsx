import type { ReactNode } from 'react'
import { about, education, experience, profile, projects, skills } from './data'
import type { Project } from './data'

function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="nav-logo" aria-label="Back to top">
        PS
      </a>
      <nav>
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <p className="eyebrow">{profile.location}</p>
      <h1>
        {profile.name}
        <span className="hero-role">{profile.role}</span>
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
      <div className="spectrum" aria-hidden="true">
        <span className="spectrum-dial" />
      </div>
    </section>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function About() {
  return (
    <Section id="about" title="About">
      <div className="about">
        <div className="about-text">
          {about.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
        <aside className="about-side">
          {skills.map((s) => (
            <div key={s.group} className="skill-group">
              <h3>{s.group}</h3>
              <ul className="tags">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
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
      </div>
    </Section>
  )
}

function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.title} className="job">
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
          </li>
        ))}
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

function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  return (
    <Section id="projects" title="Projects">
      {featured.map((p) => (
        <article key={p.name} className="project-featured">
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
            <ul className="tags">
              {p.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <ProjectLinks p={p} />
          </div>
        </article>
      ))}
      <div className="project-grid">
        {rest.map((p) => (
          <article key={p.name} className="project-card">
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
            <ul className="tags">
              {p.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <ProjectLinks p={p} />
          </article>
        ))}
      </div>
    </Section>
  )
}

function Contact() {
  return (
    <Section id="contact" title="Let's talk">
      <p className="contact-lead">
        I'm looking for full stack or frontend engineering roles in New York. The fastest way to reach me is email.
      </p>
      <a className="contact-email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="hero-actions">
        <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </Section>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.name} · Built with React + Vite
      </footer>
    </>
  )
}
