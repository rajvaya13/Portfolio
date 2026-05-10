// ============================================================
// Section loader - fetches each partial and injects them
// into <main id="sections"> in the right order.
// ============================================================

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

async function loadSections() {
  const container = document.getElementById('sections');
  if (!container) return;

  try {
    const partials = await Promise.all(
      SECTIONS.map(name =>
        fetch(`sections/${name}.html`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to load ${name}: ${res.status}`);
            return res.text();
          })
      )
    );
    container.innerHTML = partials.join('\n');
  } catch (err) {
    console.error('Section loading failed:', err);
    container.innerHTML = `
      <div style="max-width:620px;margin:140px auto;padding:32px;text-align:center;
                  background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);
                  border-radius:18px;font-family:'JetBrains Mono',monospace;">
        <div style="font-size:13px;color:#a8a8b3;margin-bottom:14px;letter-spacing:0.06em;">
          <span style="color:#c1f17e;">⚠</span> sections could not load
        </div>
        <div style="color:#b9bcc4;font-size:13.5px;line-height:1.7;">
          This site uses fetch() to load its sections, which is blocked when opening
          <code style="color:#c1f17e;">index.html</code> directly via the
          <code style="color:#c1f17e;">file://</code> protocol.<br><br>
          Run a local server in this folder:<br>
          <code style="background:#11141a;padding:6px 12px;border-radius:6px;
                       display:inline-block;margin-top:10px;color:#c1f17e;
                       border:1px solid rgba(255,255,255,0.07);">
            python -m http.server 8000
          </code><br>
          <span style="margin-top:14px;display:inline-block;">
            Then visit <a href="http://localhost:8000" style="color:#c1f17e;">
            http://localhost:8000</a>
          </span>
        </div>
      </div>`;
  }
}

// ============================================================
// App initialization - runs AFTER sections are in the DOM.
// ============================================================

function initApp() {

  // ----- Scroll: nav scrolled state -----
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Reveal-on-scroll animations -----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ----- Theme toggle -----
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  const savedTheme = (() => { try { return localStorage.getItem('theme'); } catch(e) { return null; } })();
  setTheme(savedTheme || 'dark');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  // ----- Mobile menu -----
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') navLinks.classList.remove('open');
    });
  }

  // ----- Animated stat counters -----
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || (el.textContent.includes('%') ? '%' : '');
      const duration = 1500;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.floor(target * eased);
        const formatted = val >= 1000 ? val.toLocaleString() : val;
        el.textContent = formatted + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  // ----- Skill card cursor glow -----
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // ----- Smooth-scroll offset for sticky nav -----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ----- Contact form (no backend - opens mailto) -----
  const cfSubmit = document.getElementById('cfSubmit');
  if (cfSubmit) {
    cfSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg = document.getElementById('cf-msg').value.trim();
      if (!name || !email || !msg) {
        alert('Please fill in all fields.');
        return;
      }
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${msg}\n\n- ${name}\n${email}`);
      window.location.href = `mailto:raj.vaya2017@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // ----- HERO: rotating role typewriter -----
  (function () {
    const el = document.getElementById('roleTypewriter');
    if (!el) return;
    const roles = [
      'DevOps Engineer',
      'Platform Engineer',
      'Kubernetes Specialist',
      'Reliability Engineer',
      'Cloud-Native Architect'
    ];
    let i = 0, j = 0, deleting = false;
    const tick = () => {
      const word = roles[i];
      el.textContent = deleting ? word.substring(0, j--) : word.substring(0, j++);
      let delay = deleting ? 40 : 75;
      if (!deleting && j === word.length + 1) {
        deleting = true; delay = 1600;
      } else if (deleting && j === 0) {
        deleting = false; i = (i + 1) % roles.length; delay = 280;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 600);
  })();

  // ----- HERO: live IST clock in the portrait card -----
  (function () {
    const el = document.getElementById('ccClock');
    if (!el) return;
    const update = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 5.5 * 60 * 60000);
      const pad = n => String(n).padStart(2, '0');
      el.textContent = `${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(ist.getSeconds())}`;
    };
    update();
    setInterval(update, 1000);
  })();

  // ----- HERO: mouse spotlight follows cursor -----
  (function () {
    const hero = document.querySelector('.hero');
    const spot = document.getElementById('heroSpotlight');
    if (!hero || !spot) return;
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spot.style.setProperty('--sx', `${x}%`);
      spot.style.setProperty('--sy', `${y}%`);
    });
  })();

  // ----- WRITING: dynamic article rendering from /data/articles.json -----
  renderWriting();
}

// ============================================================
// Writing section renderer
// Reads /data/articles.json and builds the article cards.
// ============================================================

async function renderWriting() {
  const grid = document.getElementById('writingGrid');
  if (!grid) return;

  let data;
  try {
    const res = await fetch('data/articles.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('Could not load articles.json:', err);
    grid.innerHTML = `<div class="article-card placeholder">
      <div class="placeholder-content">
        <h4>Articles unavailable</h4>
        <p style="color:var(--text-2);font-size:13.5px;">
          Could not load <code>data/articles.json</code>. Make sure the file exists and the
          site is being served over HTTP (not opened as <code>file://</code>).
        </p>
      </div>
    </div>`;
    return;
  }

  const articles = data.articles || [];
  const followUrl = data.followUrl || '#';
  const comingSoon = data.comingSoon || '';

  // Adapt grid columns to article count
  if (articles.length >= 3) {
    grid.classList.add('writing-grid-3');
  } else if (articles.length === 2) {
    grid.classList.add('writing-grid-2');
  }

  // Build article cards
  const cards = articles.map((a, i) => articleCard(a, i === 0)).join('');

  // Append placeholder ONLY if there's a single article (the right column would be empty otherwise)
  const placeholder = articles.length === 1
    ? followCard(followUrl, comingSoon)
    : '';

  grid.innerHTML = cards + placeholder;
}

// ----- Article card builder -----
function articleCard(a, isFeatured) {
  const stackHtml = (a.stack || []).map(s => `<span class="article-chip">${escapeHtml(s)}</span>`).join('');
  const meta = [
    a.tag ? `<span class="article-tag">${escapeHtml(a.tag)}</span>` : '',
    a.date ? `<span class="article-meta-divider">·</span><span class="article-date">${escapeHtml(a.date)}</span>` : '',
    a.readTime ? `<span class="article-meta-divider">·</span><span class="article-read-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>${escapeHtml(a.readTime)}</span>` : ''
  ].join('');

  const featuredPill = isFeatured
    ? `<span class="article-featured-pill"><span class="led"></span>Featured</span>`
    : '';

  return `
    <a class="article-card ${isFeatured ? 'featured' : ''} reveal"
       href="${escapeAttr(a.url)}"
       target="_blank" rel="noopener">
      <div class="article-visual">
        <span class="article-platform">${platformIcon(a.platform)}${escapeHtml(a.platform || 'Article')}</span>
        ${featuredPill}
        ${getIllustration(a.illustration)}
      </div>
      <div class="article-body">
        <div class="article-meta">${meta}</div>
        <h3 class="article-title">${escapeHtml(a.title)}</h3>
        <p class="article-excerpt">${escapeHtml(a.excerpt || '')}</p>
        <div class="article-stack">${stackHtml}</div>
        <div class="article-cta">
          <span class="article-read">
            Read on ${escapeHtml(a.platform || 'site')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
          </span>
        </div>
      </div>
    </a>`;
}

function followCard(url, comingSoon) {
  return `
    <div class="article-card placeholder reveal reveal-delay-1">
      <div class="placeholder-content">
        <span class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M9 13h6M9 17h4" stroke-linecap="round"/>
          </svg>
        </span>
        <h4>More articles coming</h4>
        <p>${escapeHtml(comingSoon)}</p>
        <a href="${escapeAttr(url)}" target="_blank" rel="noopener" class="placeholder-link">
          Follow on Medium
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>
      </div>
    </div>`;
}

// ----- Platform-specific icon (defaults to generic) -----
function platformIcon(platform) {
  const p = (platform || '').toLowerCase();
  if (p === 'medium') {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`;
  }
  if (p === 'dev' || p === 'dev.to') {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.826 10.083a.784.784 0 0 0-.468-.13H6.612v4.13h.746c.18 0 .357-.058.504-.187.146-.13.224-.323.234-.516v-2.738a.948.948 0 0 0-.27-.559zM19.236 3H4.764C3.79 3 3 3.79 3 4.764v14.472C3 20.21 3.79 21 4.764 21h14.472c.974 0 1.764-.79 1.764-1.764V4.764C21 3.79 20.21 3 19.236 3zm-9.49 12.057a1.92 1.92 0 0 1-1.488.668H6.157v.012a.51.51 0 0 1-.514-.51v-7.42a.51.51 0 0 1 .514-.512h2.143c.78 0 1.395.215 1.84.643.443.428.665 1.005.665 1.732v3.012c0 .729-.222 1.4-.665 2.018zm5.207-3.738a.51.51 0 0 1-.515.516h-2.013v1.81h2.013a.51.51 0 0 1 .515.514v.024a.51.51 0 0 1-.515.516h-2.013v.024h2.013a.51.51 0 0 1 .515.514v.024a.51.51 0 0 1-.515.516h-2.527a.508.508 0 0 1-.51-.51v-7.42a.51.51 0 0 1 .51-.512h2.527a.51.51 0 0 1 .515.515v.024a.51.51 0 0 1-.515.515h-2.013v1.81h2.013a.51.51 0 0 1 .515.516zm4.62 4.043l-1.418 4.116a.51.51 0 0 1-.488.318h-.012a.51.51 0 0 1-.488-.318l-1.42-4.116a.515.515 0 0 1 .033-.397l.022-.046a.51.51 0 0 1 .468-.293h.024a.51.51 0 0 1 .495.397l.875 2.54.875-2.54a.508.508 0 0 1 .493-.397h.024a.51.51 0 0 1 .468.293l.024.046a.515.515 0 0 1 .025.397z"/></svg>`;
  }
  if (p === 'hashnode') {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z"/></svg>`;
  }
  // Generic document icon
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>`;
}

// ----- Illustration library -----
// Add new entries here and reference by name in articles.json
function getIllustration(name) {
  const illustrations = {
    'trivy-scan': `
      <svg class="article-illustration" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="aw-grad-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#c1f17e" stop-opacity="0.25"/>
            <stop offset="1" stop-color="#6cb1ff" stop-opacity="0.08"/>
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#aw-grad-1)"/>
        <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
          <line x1="0" y1="50" x2="480" y2="50"/>
          <line x1="0" y1="110" x2="480" y2="110"/>
          <line x1="0" y1="170" x2="480" y2="170"/>
          <line x1="0" y1="230" x2="480" y2="230"/>
        </g>
        <g stroke="rgba(108,177,255,0.7)" stroke-width="1.5" fill="rgba(108,177,255,0.05)">
          <rect x="60" y="80" width="80" height="22" rx="2"/>
          <rect x="60" y="108" width="80" height="22" rx="2"/>
          <rect x="60" y="136" width="80" height="22" rx="2"/>
          <rect x="60" y="164" width="80" height="22" rx="2"/>
        </g>
        <g>
          <line x1="155" y1="135" x2="265" y2="135" stroke="#c1f17e" stroke-width="2" stroke-dasharray="6 4"/>
          <polygon points="265,128 280,135 265,142" fill="#c1f17e"/>
        </g>
        <g font-family="JetBrains Mono, monospace" font-size="9" fill="rgba(255,255,255,0.55)">
          <rect x="300" y="85" width="120" height="20" rx="3" fill="rgba(255,90,90,0.15)" stroke="rgba(255,90,90,0.5)" stroke-width="1"/>
          <text x="310" y="99" fill="#ff7a7a">CRITICAL · 3</text>
          <rect x="300" y="115" width="120" height="20" rx="3" fill="rgba(255,193,90,0.12)" stroke="rgba(255,193,90,0.5)" stroke-width="1"/>
          <text x="310" y="129" fill="#ffbd2e">HIGH · 14</text>
          <rect x="300" y="145" width="120" height="20" rx="3" fill="rgba(108,177,255,0.1)" stroke="rgba(108,177,255,0.4)" stroke-width="1"/>
          <text x="310" y="159" fill="#6cb1ff">MEDIUM · 27</text>
          <rect x="300" y="175" width="120" height="20" rx="3" fill="rgba(193,241,126,0.1)" stroke="rgba(193,241,126,0.4)" stroke-width="1"/>
          <text x="310" y="189" fill="#c1f17e">LOW · 8</text>
        </g>
        <text x="30" y="40" fill="rgba(255,255,255,0.55)" font-family="JetBrains Mono, monospace" font-size="11">$ trivy image nginx:stable-perl --format json</text>
        <text x="30" y="250" fill="#c1f17e" font-family="JetBrains Mono, monospace" font-size="11">✓ scan.complete · report.md generated</text>
      </svg>`,

    'k8s-cluster': `
      <svg class="article-illustration" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="aw-grad-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#6cb1ff" stop-opacity="0.22"/>
            <stop offset="1" stop-color="#c1f17e" stop-opacity="0.06"/>
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#aw-grad-2)"/>
        <g stroke="rgba(108,177,255,0.6)" stroke-width="1.4" fill="none">
          <polygon points="240,60 285,85 285,135 240,160 195,135 195,85"/>
          <polygon points="155,140 200,165 200,215 155,240 110,215 110,165"/>
          <polygon points="325,140 370,165 370,215 325,240 280,215 280,165"/>
        </g>
        <g stroke="rgba(193,241,126,0.7)" stroke-width="1.5" stroke-dasharray="4 4">
          <line x1="240" y1="160" x2="155" y2="190"/>
          <line x1="240" y1="160" x2="325" y2="190"/>
        </g>
        <text x="30" y="40" fill="rgba(255,255,255,0.55)" font-family="JetBrains Mono, monospace" font-size="11">$ kubectl get pods -A</text>
        <text x="30" y="250" fill="#c1f17e" font-family="JetBrains Mono, monospace" font-size="11">✓ 24/24 pods running · 0 restarts</text>
      </svg>`,

    'cicd-pipeline': `
      <svg class="article-illustration" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="aw-grad-3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#c1f17e" stop-opacity="0.2"/>
            <stop offset="1" stop-color="#8be9c9" stop-opacity="0.05"/>
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#aw-grad-3)"/>
        <g>
          <circle cx="60" cy="135" r="14" fill="rgba(193,241,126,0.2)" stroke="#c1f17e" stroke-width="1.5"/>
          <circle cx="160" cy="135" r="14" fill="rgba(193,241,126,0.2)" stroke="#c1f17e" stroke-width="1.5"/>
          <circle cx="260" cy="135" r="14" fill="rgba(193,241,126,0.2)" stroke="#c1f17e" stroke-width="1.5"/>
          <circle cx="360" cy="135" r="14" fill="rgba(193,241,126,0.2)" stroke="#c1f17e" stroke-width="1.5"/>
          <circle cx="420" cy="135" r="14" fill="rgba(108,177,255,0.2)" stroke="#6cb1ff" stroke-width="1.5"/>
        </g>
        <g stroke="rgba(193,241,126,0.5)" stroke-width="1.5" fill="none">
          <line x1="74" y1="135" x2="146" y2="135"/>
          <line x1="174" y1="135" x2="246" y2="135"/>
          <line x1="274" y1="135" x2="346" y2="135"/>
          <line x1="374" y1="135" x2="406" y2="135" stroke="#6cb1ff"/>
        </g>
        <g fill="rgba(255,255,255,0.55)" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">
          <text x="60" y="170">build</text>
          <text x="160" y="170">test</text>
          <text x="260" y="170">scan</text>
          <text x="360" y="170">stage</text>
          <text x="420" y="170" fill="#6cb1ff">prod</text>
        </g>
        <text x="30" y="40" fill="rgba(255,255,255,0.55)" font-family="JetBrains Mono, monospace" font-size="11">.github/workflows/release.yml</text>
        <text x="30" y="250" fill="#c1f17e" font-family="JetBrains Mono, monospace" font-size="11">✓ pipeline #2284 · 3m 42s</text>
      </svg>`,

    'default': `
      <svg class="article-illustration" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="aw-grad-default" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#c1f17e" stop-opacity="0.2"/>
            <stop offset="1" stop-color="#6cb1ff" stop-opacity="0.05"/>
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#aw-grad-default)"/>
        <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
          <line x1="0" y1="60" x2="480" y2="60"/>
          <line x1="0" y1="120" x2="480" y2="120"/>
          <line x1="0" y1="180" x2="480" y2="180"/>
        </g>
        <g stroke="rgba(193,241,126,0.7)" stroke-width="1.5" fill="none">
          <rect x="180" y="100" width="120" height="70" rx="8"/>
        </g>
        <g font-family="JetBrains Mono, monospace" font-size="12" fill="#c1f17e" text-anchor="middle">
          <text x="240" y="142">{ devops }</text>
        </g>
      </svg>`
  };
  return illustrations[name] || illustrations['default'];
}

// ----- Safe HTML helpers -----
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeAttr(str) {
  return escapeHtml(str);
}

// ============================================================
// Bootstrap: load sections first, then initialize everything
// ============================================================
(async function bootstrap() {
  await loadSections();
  initApp();
})();