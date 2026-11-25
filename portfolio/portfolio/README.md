# Preston Savey — Portfolio

Personal portfolio site built with React, TypeScript and Vite.

## Run locally

```bash
npm install
npm run dev
```

## Edit content

All text — profile, about, experience, projects, skills — lives in `src/data.ts`.
Styles are in `src/index.css`. The résumé button serves `public/resume.pdf`.

## Deploy to Vercel (free)

1. Push this folder to a new GitHub repo (e.g. `PrestonSavey/portfolio`).
2. Go to vercel.com → sign in with GitHub → **Add New → Project** → import the repo.
3. Vercel detects Vite automatically (build: `npm run build`, output: `dist`). Click **Deploy**.
4. Optional: **Settings → Domains** to add a custom domain like `prestonsavey.dev`.

Every push to `main` redeploys the site.
