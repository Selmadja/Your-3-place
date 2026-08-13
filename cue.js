

const ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3l7.2 9.4L4.4 21H7l5.6-6.6L17 21h3l-7.6-9.9L19.8 3h-2.6l-5.1 6L8 3H4z"/></svg>'
};

function buildEventCard(ev){
  const card = document.createElement('article');
  card.className = 'event-card';

  const dateRow = ev.date ? `<span class="event-date">${ev.date}</span>` : '';
  const icon = ICONS[ev.socialIcon] || ICONS.instagram;
  const img = ev.img
    ? `<img src="${ev.img}" alt="${ev.title}" loading="lazy" onload="this.style.opacity=1">`
    : '';

  card.innerHTML = `
    <div class="event-thumb">
      <div class="event-thumb-fallback">+ Add photo</div>
      ${img}
    </div>
    <div class="event-top">
      ${dateRow}
      <span class="event-location">📍 ${ev.location}</span>
    </div>
    <h3 class="event-title">${ev.title}</h3>
    <div class="event-actions">
      <a class="event-btn" href="${ev.buttonHref || '#'}">${ev.buttonLabel || 'Details'}</a>
      <a class="event-social" href="${ev.socialHref || '#'}" target="_blank" rel="noopener" aria-label="${ev.socialLabel || 'Social link'}">
        ${icon}
      </a>
    </div>
  `;
  return card;
}

function initCarousel(){
  const events = window.EVENTS || [];
  const track = document.getElementById('carousel-track');
  if (!track || events.length === 0) return;

  // Build the set twice back-to-back so the loop from -50% back to 0%
  // is seamless (classic marquee technique).
  events.forEach(ev => track.appendChild(buildEventCard(ev)));
  events.forEach(ev => track.appendChild(buildEventCard(ev)));

  // Scale the animation duration to the actual content width so the
  // scroll speed feels consistent regardless of how many cards there are.
  requestAnimationFrame(() => {
    const halfWidth = track.scrollWidth / 2;
    const pxPerSecond = 45;
    const duration = Math.max(halfWidth / pxPerSecond, 10);
    track.style.animationDuration = duration + 's';
  });
}

initCarousel();

// mobile hamburger menu (cue pages don't load script.js, so this lives here)
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