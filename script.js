/* ============================================================
   Shri Balkrishna Maharaj — Website Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initCounterAnimation();
  initServiceFilter();
  initSatsangCountdown();
  initContactForm();
});

/* --- Navigation --- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  const allLinks = links.querySelectorAll('a');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  allLinks.forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  function updateActiveLink() {
    const y = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop;
      if (y >= top && y < top + sec.offsetHeight) {
        allLinks.forEach(a => a.classList.remove('active'));
        const active = links.querySelector(`a[href="#${sec.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* --- Animated Counters --- */
function initCounterAnimation() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  let done = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !done) {
        done = true;
        grid.querySelectorAll('.stat-value').forEach(animate);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(grid);

  function animate(el) {
    const target = parseInt(el.dataset.target, 10);
    const start = performance.now();
    const duration = 1800;

    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(ease * target).toLocaleString() + (target === 24 ? '/' : '+');
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
}

/* --- Service Filter --- */
function initServiceFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.service-card');

  btns.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    cards.forEach((card, i) => {
      const show = f === 'all' || card.dataset.category === f;
      if (show) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 40);
      } else {
        card.style.opacity = '0';
        setTimeout(() => { card.style.display = 'none'; }, 250);
      }
    });
  }));

  // Footer filter links
  document.querySelectorAll('[data-filter-target]').forEach(link => {
    link.addEventListener('click', () => {
      const btn = document.querySelector(`.filter-btn[data-filter="${link.dataset.filterTarget}"]`);
      if (btn) setTimeout(() => btn.click(), 400);
    });
  });
}

/* --- Satsang Countdown --- */
function initSatsangCountdown() {
  const d = document.getElementById('countdown-days');
  const h = document.getElementById('countdown-hours');
  const m = document.getElementById('countdown-minutes');
  const s = document.getElementById('countdown-seconds');
  if (!d) return;

  function nextThursday() {
    const now = new Date();
    let diff = (4 - now.getDay() + 7) % 7;
    if (diff === 0 && now.getHours() >= 19) diff = 7;
    const t = new Date(now);
    t.setDate(now.getDate() + diff);
    t.setHours(19, 0, 0, 0);
    return t;
  }

  function update() {
    const rem = nextThursday() - new Date();
    if (rem <= 0) return;
    d.textContent = Math.floor(rem / 864e5);
    h.textContent = Math.floor((rem % 864e5) / 36e5);
    m.textContent = Math.floor((rem % 36e5) / 6e4);
    s.textContent = Math.floor((rem % 6e4) / 1e3);
  }

  update();
  setInterval(update, 1000);
}

/* --- Contact Form → WhatsApp --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const service = document.getElementById('contact-service').value;
    const msg = document.getElementById('contact-message').value;

    let text = `Pranam Maharaj,\n\nName: ${name}`;
    if (service) text += `\nService: ${service}`;
    if (msg) text += `\nMessage: ${msg}`;

    const btn = form.querySelector('.btn-submit');
    const orig = btn.textContent;
    btn.textContent = 'Opening WhatsApp...';
    btn.style.opacity = '0.6';

    setTimeout(() => {
      window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      btn.textContent = orig;
      btn.style.opacity = '1';
      form.reset();
    }, 600);
  });
}
