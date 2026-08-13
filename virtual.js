

const ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3l7.2 9.4L4.4 21H7l5.6-6.6L17 21h3l-7.6-9.9L19.8 3h-2.6l-5.1 6L8 3H4z"/></svg>'
};

const ACCENTS = ['var(--g1)', 'var(--g2)', 'var(--g3)', 'var(--g4)', 'var(--g5)'];

function buildCard(ev, i){
  const card = document.createElement('article');
  card.className = 've-card';
  card.style.setProperty('--accent', ACCENTS[i % ACCENTS.length]);

  const dateRow = ev.date ? `<span class="ve-date">${ev.date}</span>` : '';
  const icon = ICONS[ev.socialIcon] || ICONS.instagram;
  const img = ev.img
    ? `<img src="${ev.img}" alt="${ev.title}" loading="lazy" onload="this.style.opacity=1">`
    : '';

  card.innerHTML = `
    <div class="ve-thumb">
      <div class="ve-thumb-fallback">+ Add photo</div>
      ${img}
    </div>
    <div class="ve-body">
      <div class="ve-top">
        ${dateRow}
        <span class="ve-location">💻 ${ev.location}</span>
      </div>
      <h3 class="ve-title">${ev.title}</h3>
      <div class="ve-actions">
        <a class="ve-btn" href="${ev.buttonHref || '#'}">${ev.buttonLabel || 'Details'}</a>
        <a class="ve-social" href="${ev.socialHref || '#'}" target="_blank" rel="noopener" aria-label="${ev.socialLabel || 'Social link'}">
          ${icon}
        </a>
      </div>
    </div>
  `;
  return card;
}

function initVerticalCarousel(){
  const events = window.VIRTUAL_EVENTS || [];
  const track = document.getElementById('ve-track');
  if (!track || events.length === 0) return;

  // build the set twice, stacked, so looping from -50% back to 0% is seamless
  events.forEach((ev, i) => track.appendChild(buildCard(ev, i)));
  events.forEach((ev, i) => track.appendChild(buildCard(ev, i)));

  requestAnimationFrame(() => {
    const halfHeight = track.scrollHeight / 2;
    const pxPerSecond = 28;
    const duration = Math.max(halfHeight / pxPerSecond, 12);
    track.style.animationDuration = duration + 's';
  });
}

initVerticalCarousel();

// mobile hamburger menu (this page loads no other script, so it lives here)
const hamburger = document.getElementById('hamburger');
const mobileNav = document.querySelector('.nav-links');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

// nav curtain draw-in, matching the rest of the site (plain CSS, no GSAP here)
const navCurtain = document.getElementById('nav-curtain');
if (navCurtain) {
  requestAnimationFrame(() => {
    navCurtain.style.transition = 'transform 1s cubic-bezier(.16,1,.3,1)';
    navCurtain.style.transform = 'scaleX(1)';
  });
}