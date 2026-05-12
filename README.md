# Raj Vaya - Portfolio

![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

> Personal portfolio website for **Raj Vaya** - DevOps & Platform Engineer specializing in Kubernetes, multi-cloud infrastructure, and CI/CD automation.

🌐 **Live:**[ _add your Vercel URL here once deployed_](https://raj-vaya-portfolio.vercel.app/)

---

## About

A clean, futuristic portfolio built with vanilla HTML, CSS, and JavaScript - no frameworks, no build step, no dependencies beyond Google Fonts. Designed with a "control plane" aesthetic: dark by default, electric-lime accent, glassmorphic surfaces, and subtle DevOps-themed details (terminal blocks, kubectl-style outputs, pod-status pills, animated stat counters).

The site is organized for clarity: a thin `index.html` shell, separate `styles.css` and `script.js`, and **each page section in its own HTML partial under `sections/`**. The shell loads the partials at runtime via `fetch()` and stitches them into the page. Blog articles are rendered dynamically from a `data/articles.json` file - add a new article by editing JSON, no HTML required.

## Features

- **Hero** - large profile portrait with conic-gradient ring, animated aurora background, mouse-tracking spotlight, status pill, rotating-role typewriter, and floating DevOps tags
- **About** - terminal-style profile output (`kubectl get profile`), interest tags, and a 4-card "Principles I work by" panel
- **Education** - degree card with CGPA showcase and a "Core foundations" strip listing CS subjects
- **Skills** - featured "Stack at a glance" panel with branded tech logos plus categorized skill cards
- **Services** - six service cards with thematic icons and per-service deliverables
- **Writing** - blog/article showcase, **dynamically rendered from `data/articles.json`** - layout auto-adapts to article count (1, 2, or 3+)
- **Resume** - live PDF preview embedded inline with summary, stats, and download button
- **Contact** - clean form with email, phone, location, and social links
- **Light/dark mode toggle** - full theme system via CSS variables, persisted to localStorage
- **Fully responsive** - desktop, tablet, mobile
- **Smooth scroll-triggered reveal animations** via IntersectionObserver

## Tech Stack

| Layer | Tools |
|---|---|
| Markup | HTML5 (semantic, modular partials) |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Interactivity | Vanilla JS (no frameworks) |
| Data | JSON (for blog articles) |
| Typography | Bricolage Grotesque · Manrope · JetBrains Mono |
| Hosting | Vercel (free tier) |
| Versioning | Git + GitHub |

## Project Structure

```
Portfolio/
├── index.html                    # shell: <head>, nav, footer, main container
├── styles.css                    # all styling
├── script.js                     # loads sections, renders articles, initializes everything
├── sections/
│   ├── hero.html                 # hero + tech-stack marquee
│   ├── about.html                # about prose, terminal, principles
│   ├── education.html            # degree card + core foundations
│   ├── skills.html               # "Stack at a glance" + skill cards
│   ├── services.html             # six service cards
│   ├── writing.html              # writing section frame (articles render dynamically)
│   ├── resume.html               # summary + inline PDF preview
│   └── contact.html              # contact form + socials
├── data/
│   └── articles.json             # list of blog articles (edit to add new posts)
├── profile.png                   # hero portrait image
├── Raj_Vaya_DevOps_Resume.pdf    # downloadable resume + inline PDF preview
└── README.md
```

## How the section loader works

When the page loads, `script.js` runs a small `loadSections()` function that:

1. Looks for `<main id="sections"></main>` in `index.html`
2. Fetches each file listed in the `SECTIONS` array (`hero`, `about`, `education`, etc.) from the `sections/` folder
3. Concatenates the HTML and injects it into the container
4. Then runs `initApp()` which sets up theme toggle, scroll animations, typewriter, clock, mouse spotlight, dynamic article rendering, and everything else

To add, remove, or reorder sections, edit the `SECTIONS` array at the top of `script.js`:

```js
const SECTIONS = [
  'hero',
  'about',
  'education',
  'skills',
  'services',
  'writing',
  'resume',
  'contact'
];
```

To add a new section called e.g. "experience":
1. Create `sections/experience.html` with your `<section id="experience">…</section>` markup
2. Add `'experience'` to the array in the position you want it
3. Add a link in the `<nav>` inside `index.html`

## Adding a new blog article

Open `data/articles.json` and add a new object to the top of the `articles` array. Push - the site picks it up automatically:

```json
{
  "title": "Your article title",
  "url": "https://medium.com/@rajvaya13/your-article-slug",
  "platform": "Medium",
  "tag": "DevSecOps",
  "date": "Nov 2026",
  "readTime": "7 min read",
  "excerpt": "One or two sentences describing what the article covers.",
  "stack": ["Kubernetes", "Helm", "Golang"],
  "illustration": "k8s-cluster"
}
```

The grid layout adjusts automatically based on article count:

| # of articles | Layout |
|---|---|
| **1** | Featured card + "Follow on Medium" placeholder |
| **2** | Two equal cards side by side |
| **3+** | 3-column grid, all cards equal-sized |

**Available `illustration` values:** `trivy-scan`, `k8s-cluster`, `cicd-pipeline`, or leave empty/use `default` for a generic backdrop. To create a new illustration, add a new key to the `illustrations` object inside `getIllustration()` in `script.js`.

**Supported `platform` values for branded icons:** `Medium`, `Dev.to`, `Hashnode`. Anything else falls back to a generic document icon.

## Where to find things

| Looking for... | File | How |
|---|---|---|
| Hero title, tagline, CTAs | `sections/hero.html` | Edit directly |
| About prose, principles | `sections/about.html` | Edit directly |
| Education details, courses | `sections/education.html` | Edit directly |
| Skill categories, tech logos | `sections/skills.html` | Edit directly |
| Service cards & deliverables | `sections/services.html` | Edit directly |
| Blog articles | `data/articles.json` | Edit JSON, no HTML |
| Writing section heading / lede | `sections/writing.html` | Edit directly |
| Resume summary, stats | `sections/resume.html` | Edit directly |
| Contact info, form fields | `sections/contact.html` | Edit directly |
| Nav links, footer | `index.html` | Edit directly (always-visible chrome) |
| Colors, fonts, spacing | `styles.css` | Top of file: `:root { --accent: ... }` |
| Typewriter roles | `script.js` | Search for `const roles = [` |
| Live clock, counters | `script.js` | Search for `ccClock` / `data-count` |
| Article card markup logic | `script.js` | Search for `articleCard(` or `getIllustration(` |

## Local Development

Clone the repo:

```bash
git clone https://github.com/rajvaya13/Portfolio.git
cd Portfolio
```

⚠️ **A local server is required**, because the section loader and article loader use `fetch()` which is blocked when opening `index.html` directly via the `file://` protocol.

Pick whichever you have:

```bash
# Python (built into macOS / Linux / Git for Windows)
python -m http.server 8000

# Or Node.js
npx serve

# Or VS Code extension
# Install "Live Server" by Ritwick Dey, then right-click index.html → "Open with Live Server"
```

Then visit **http://localhost:8000** in your browser.

If you forget and open the file directly, the site shows a friendly fallback explaining what to do.

## Customization

All visual tokens live in CSS variables at the top of `styles.css`:

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

To swap content: open the relevant file under `sections/` (or `data/articles.json` for blog posts) and edit inline.

## Deployment

Deployed automatically to Vercel on every push to `main`:

1. Push commits to GitHub
2. Vercel webhook triggers a rebuild
3. New version live in ~30 seconds

Want to fork-and-deploy your own? After forking:
1. Sign up at [vercel.com](https://vercel.com) with GitHub
2. **Add New… → Project →** import your forked repo
3. Leave all settings default (it's a static site - no build step)
4. Click **Deploy**

Vercel serves over HTTPS, so the section loader and article loader work out of the box.

## Roadmap

- [ ] Wire the contact form to a real backend (Formspree / Resend)
- [ ] Add Open Graph + Twitter Card meta tags for nicer link previews
- [ ] Lighthouse audit for 100/100/100/100
- [ ] Move skills and services to JSON-driven config like Writing
- [ ] Optional 3D Kubernetes cluster visualization with Three.js

## Credits

- Fonts: [Google Fonts](https://fonts.google.com)
- Icon style: hand-drawn inline SVGs (no icon library)
- Aesthetic inspiration: Linear, Vercel, Resend, modern infrastructure dashboards

## License

MIT - feel free to fork, customize, and use as a starting point for your own portfolio. Attribution appreciated but not required.

---

## Contact

**Raj Vaya** - DevOps & Platform Engineer

- 📧 [raj.vaya2017@gmail.com](mailto:raj.vaya2017@gmail.com)
- 💼 [linkedin.com/in/raj-vaya](https://www.linkedin.com/in/raj-vaya)
- 🐙 [github.com/rajvaya13](https://github.com/rajvaya13)
- ✍️ [medium.com/@rajvaya13](https://medium.com/@rajvaya13)
- 📍 Pune, Maharashtra, India

---

<sub>Engineering scalable cloud-native platforms with reliability and automation.</sub>