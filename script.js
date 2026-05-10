// ============================================================
// Section loader - fetches each partial from /sections/ and
// injects them into <main id="sections"> in the right order.
// ============================================================

const SECTIONS = [
  'hero',
  'about',
  'education',
  'skills',
  'services',
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
    // Friendly fallback if opened via file:// or sections folder is missing
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
}

// ============================================================
// Bootstrap: load sections first, then initialize everything
// ============================================================
(async function bootstrap() {
  await loadSections();
  initApp();
})();
