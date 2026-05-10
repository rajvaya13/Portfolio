# raj-vaya · portfolio

Terminal-aesthetic DevOps/SRE portfolio for **Raj Vaya**.
One `index.html` + your photo + your resume PDF. No build step, no framework.

## Deploy to Vercel

**Option A — drag and drop (easiest)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Upload** and drop the folder containing all three files
3. Deploy. You're live.

**Option B — Git + CLI (recommended for updates)**
```bash
cd this-folder
git init && git add . && git commit -m "init: terminal portfolio"

# push to your existing repo
git remote add origin https://github.com/rajvaya13/portfolio.git
git push -u origin main

# then deploy
npx vercel --prod
```

**Option C — anywhere static**
Netlify, Cloudflare Pages, GitHub Pages, S3 — works on all of them. It's just static HTML.

> **Custom domain tip**: in Vercel → Project → Settings → Domains, add `rajvaya.dev` (or whatever you grab) — takes ~5 min once DNS propagates.

## Files

| file | what it is |
|---|---|
| `index.html` | the whole site — single self-contained file |
| `profile.png` | your headshot (shown in the right sidebar) |
| `resume.pdf` | what the `resume` command opens |

## Try these commands

`help` `whoami` `projects` `platforms` `experience` `certs` `hobbies` `languages` `neofetch` `theme matrix` `chess` `valorant` `summit` `coffee` `matrix` `sudo hire-me`

Up/down for history, Tab to autocomplete, Ctrl+L to clear, Ctrl+C to abort.

## Editing

All your content is in **one place** — open `index.html` and search for `const PROFILE = {`. Everything (bio, skills, projects, experience, education, certs, languages, hobbies, contact) lives in that object. Edit and reload, no build.

To add a project, add another `{ name, meta, desc, stats, stack }` object to `PROFILE.projects`. The renderer handles the rest.

To swap themes, the user can type `theme matrix` or `theme amber` in the terminal. Or hardcode your default by editing the CSS `:root` block at the top.

## License

Yours. Do whatever you want with it.
