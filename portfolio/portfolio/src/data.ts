// All site content lives here — edit this file to update the site.

export const profile = {
  name: 'Preston Savey',
  role: 'Full Stack Software Engineer',
  tagline:
    'I build production web apps with Angular, React, TypeScript, C# and Azure — five years of shipping enterprise healthcare software used by thousands.',
  location: 'Open to roles in New York, NY',
  email: 'pcsavey@gmail.com',
  linkedin: 'https://www.linkedin.com/in/preston-savey-b8984a20a/',
  github: 'https://github.com/PrestonSavey',
  // Drop your resume PDF into /public as resume.pdf
  resume: '/resume.pdf',
}

export const about = [
  "I'm a full stack engineer at Medpace, where I've spent the last five years building software for clinical research — from apps patients used in Pfizer's COVID-19 vaccine trials to data visualization tools that changed how the company tracks patient enrollment.",
  "I lead frontend work on my team: setting organization-wide UI standards, representing frontend in architecture discussions, and taking apps from requirements gathering all the way through Azure deployment. I care about interfaces that feel intuitive and codebases that stay easy to change.",
  "Outside work I build things for fun — lately a real-time multiplayer party game app for game nights with friends.",
]

export type Job = {
  title: string
  company: string
  location: string
  dates: string
  bullets: string[]
}

export const experience: Job[] = [
  {
    title: 'Full Stack Software Engineer II',
    company: 'Medpace',
    location: 'Cincinnati, OH',
    dates: 'May 2026 – Present',
    bullets: [
      'Delivered 3 production applications from requirements gathering through deployment, supporting thousands of active users across clinical research operations.',
      'Built patient-enrollment data visualization tools with AG Grid, AG Charts and billboard.js, saving the company millions of dollars in expenses.',
      'Partnered with business stakeholders to find workflow inefficiencies and ship software that streamlined clinical trial operations.',
    ],
  },
  {
    title: 'Full Stack Software Engineer I',
    company: 'Medpace',
    location: 'Cincinnati, OH',
    dates: 'May 2024 – May 2026',
    bullets: [
      'Led frontend development for a cross-functional team and established organization-wide UI standards.',
      'Represented frontend initiatives in IT architecture discussions.',
      'Implemented Azure cloud infrastructure to support scalable application delivery.',
    ],
  },
  {
    title: 'Full Stack Software Engineer Intern',
    company: 'Medpace',
    location: 'Cincinnati, OH',
    dates: 'Aug 2021 – May 2024',
    bullets: [
      'Developed Angular frontends and C# APIs for a cross-platform clinical trial app (web, iOS, Android) used in Pfizer COVID-19 vaccine studies, enabling remote patient participation and data collection.',
      'Built a Patient Engagement project to raise trial participation, including automatic Uber ride scheduling and participant progress tracking.',
    ],
  },
]

export type Project = {
  name: string
  blurb: string
  details: string[]
  stack: string[]
  live?: string
  code?: string
  featured?: boolean
  year: string
}

export const projects: Project[] = [
  {
    name: 'Game Night',
    featured: true,
    year: '2026',
    blurb:
      'A real-time multiplayer party game app. Players join a lobby with a code from their own phones — or pass one device around — and the host picks from four games.',
    details: [
      'Spectrum — one player gets a hidden target on a scale and gives a one-word clue; everyone else guesses the spot.',
      'Last Word — timed elimination: name a valid word from the given start and end letters before the clock runs out.',
      'Impostor — hidden-role game with clue rounds, a majority vote, and one last guess for a caught impostor.',
      'Bluff — invent a convincing fake answer to a trivia question, then spot the real one.',
    ],
    stack: ['React', 'TypeScript', '.NET', 'C#'],
    // TODO: replace with the deployed URL once Game Night is hosted
    live: '',
    code: 'https://github.com/PrestonSavey/Game-Night',
  },
  {
    name: 'Recipe Tracker',
    year: '2024',
    blurb:
      'A social recipe platform — share recipes, manage your pantry, and discover what you can cook with what you already have. Senior capstone.',
    details: [
      'Recognized at the University of Cincinnati Expo for its user experience and interface design.',
    ],
    stack: ['React', 'SQL'],
  },
  {
    name: 'Gamified Canvas',
    year: '2023',
    blurb:
      'A Wild West–themed reskin of assignment tracking that turns coursework into point-based progression and achievements.',
    details: [],
    stack: ['React'],
  },
  {
    name: 'UC Activity App',
    year: '2023',
    blurb:
      'Helps incoming University of Cincinnati students find local activities and each other, with a social feed built on the Google Maps API.',
    details: [],
    stack: ['Angular', 'Google Maps API'],
  },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Frontend',
    items: ['Angular', 'React', 'TypeScript', 'NgRx', 'JavaScript', 'HTML5', 'CSS3', 'AG Grid', 'AG Charts', 'Responsive UI'],
  },
  { group: 'Backend', items: ['C#', '.NET', 'REST APIs', 'SQL'] },
  { group: 'Cloud', items: ['Azure'] },
]

export const education = {
  degree: 'B.S. Computer Science',
  school: 'University of Cincinnati',
  year: '2024',
}
