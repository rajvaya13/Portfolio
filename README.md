# Raj Vaya — Portfolio

![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

> Personal portfolio website for **Raj Vaya** — DevOps & Platform Engineer specializing in Kubernetes, multi-cloud infrastructure, and CI/CD automation.

🌐 **Live:** _add your Vercel URL here once deployed_

---

## About

A clean, futuristic, single-file portfolio built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies beyond Google Fonts. Designed with a "control plane" aesthetic: dark by default, electric-lime accent, glassmorphic surfaces, and subtle DevOps-themed details (terminal blocks, kubectl-style outputs, pod-status pills, animated stat counters).

The site is structured as a single `index.html` with all CSS and JS inlined for fast first paint and zero deployment complexity.

## Features

- **Hero** — large profile portrait with conic-gradient ring, animated aurora background, mouse-tracking spotlight, status pill, rotating-role typewriter, and floating DevOps tags (`deploy.success`, `pods · 24/24 running`, `uptime · 99.99%`)
- **About** — terminal-style profile output (`kubectl get profile`), interest tags, and a 4-card "Principles I work by" panel
- **Education** — degree card with CGPA showcase and a "Core foundations" strip listing CS subjects
- **Skills** — featured "Stack at a glance" panel with 10 branded tech logos (K8s, Docker, Terraform, GCP, etc.) plus categorized skill cards
- **Services** — six service cards with thematic icons and per-service deliverables
- **Resume** — live PDF preview embedded inline with summary, stats, and download button
- **Contact** — clean form with email, phone, location, and social links
- **Light/dark mode toggle** — full theme system via CSS variables, persisted to localStorage
- **Fully responsive** — desktop, tablet, mobile
- **Accessibility-friendly** — semantic HTML, high-contrast typography, alt text on images
- **Smooth scroll-triggered reveal animations** via IntersectionObserver

## Tech Stack

| Layer | Tools |
|---|---|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (custom properties, grid, flexbox, container queries) |
| Interactivity | Vanilla JS (no frameworks) |
| Typography | Bricolage Grotesque · Manrope · JetBrains Mono |
| Hosting | Vercel (free tier) |
| Versioning | Git + GitHub |

## Project Structure

```
Portfolio/
├── index.html                    # the entire site (HTML + CSS + JS)
├── profile.png                   # hero portrait image
└── Raj_Vaya_DevOps_Resume.pdf    # downloadable resume + inline PDF preview
```

## Local Development

Clone the repo and open it locally:

```bash
git clone https://github.com/rajvaya13/Portfolio.git
cd Portfolio
```

Because the site is fully static, you have two options:

**Option 1 — Just open the file**
Double-click `index.html`. Works for everything *except* the inline PDF preview, which most browsers block under the `file://` protocol for security.

**Option 2 — Run a local server (recommended)**
```bash
# Python (built into macOS / Linux / Git for Windows)
python -m http.server 8000

# Or Node.js
npx serve
```
Then visit `http://localhost:8000` — everything including the PDF preview will work.

## Customization

All visual tokens (colors, spacing, fonts, shadows) live in CSS variables at the top of the `<style>` block in `index.html`:

```css
:root {
  --accent: #c1f17e;        /* main accent (electric lime) */
  --accent-2: #8be9c9;      /* secondary accent */
  --bg-0: #08090b;          /* primary background */
  --text-0: #f3f4f6;        /* primary text */
  /* ...and many more */
}
```

To rebrand: change `--accent` (used everywhere) and the rest cascades.

To swap content (job titles, role descriptions, skills, etc.): search for the section by its HTML comment (`<!-- HERO -->`, `<!-- ABOUT -->`, etc.) and edit inline.

## Deployment

Deployed automatically to Vercel on every push to `main`:

1. Push commits to GitHub
2. Vercel webhook triggers a rebuild
3. New version live in ~30 seconds

Want to fork-and-deploy your own? After forking:
1. Sign up at [vercel.com](https://vercel.com) with GitHub
2. **Add New… → Project →** import your forked repo
3. Leave all settings default (it's a static site — no build step)
4. Click **Deploy**

## Roadmap

- [ ] Add a blog/articles section for DevOps writeups
- [ ] Wire the contact form to a real backend (Formspree / Resend)
- [ ] Add Open Graph + Twitter Card meta tags
- [ ] Lighthouse audit for 100/100/100/100
- [ ] Optional 3D Kubernetes cluster visualization with Three.js

## Credits

- Fonts: [Google Fonts](https://fonts.google.com)
- Icon style: hand-drawn inline SVGs (no icon library)
- Aesthetic inspiration: Linear, Vercel, Resend, modern infrastructure dashboards

## License

MIT — feel free to fork, customize, and use as a starting point for your own portfolio. Attribution appreciated but not required.

---

## Contact

**Raj Vaya** — DevOps & Platform Engineer

- 📧 [raj.vaya2017@gmail.com](mailto:raj.vaya2017@gmail.com)
- 💼 [linkedin.com/in/raj-vaya](https://www.linkedin.com/in/raj-vaya)
- 🐙 [github.com/rajvaya13](https://github.com/rajvaya13)
- 📍 Pune, Maharashtra, India

---

<sub>Engineering scalable cloud-native platforms with reliability and automation.</sub>
