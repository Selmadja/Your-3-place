
const DEFAULT_SLIDES = [
  { num:' 01', indexLabel:'First³ place', title:'EVENTS',      term:'Events', color:'var(--g1)', href:'cue-01.html', img:'cue-01.jpg',
    desc:'Discover exciting events and unforgettable experiences.Find concerts, festivals, and gatherings that match your interests.' },
  { num:'02', indexLabel:'Second³ place', title:'SPOTS', term:'Spot',     color:'var(--g2)', href:'cue-02.html', img:'cue-02.jpg',
    desc:'Explore amazing places and hidden gems waiting to be discovered. Find beautiful spots for adventures, relaxation, and memories.' },
  { num:'03', indexLabel:'Third³ Place', title:'Exhibitions',     term:'Exhibition',      color:'var(--g3)', href:'cue-03.html', img:'cue-03.jpg',
    desc:'Dive into creative worlds filled with art, culture, and inspiration. Discover exhibitions that spark curiosity and imagination.' },
  { num:'04', indexLabel:'Fourth³ Place', title:'WORkSHOP',    term:'workshop',   color:'var(--g4)', href:'cue-04.html', img:'cue-04.jpg',
    desc:'Learn, create, and grow through inspiring workshops. Join interactive sessions and develop new skills with experts.' },
  { num:'05', indexLabel:'Fifth³ Place', title:'CONTESTS',     term:'Contest',      color:'var(--g5)', href:'cue-05.html', img:'cue-05.jpg',
    desc:'Take part in exciting challenges and showcase your talents. Compete, create, and discover opportunities to stand out.' },
];
const DEFAULT_STRINGS = { playing:'Playing', paused:'Paused' };

// A page can define window.CUE_SLIDES / window.CUE_STRINGS (see index-fr.html,
// index-ar.html) BEFORE this script tag to fully localize the slider.
const slides  = window.CUE_SLIDES  || DEFAULT_SLIDES;
const STRINGS = window.CUE_STRINGS || DEFAULT_STRINGS;

const strip = document.getElementById('filmstrip');
slides.forEach((s, i) => {
  const a = document.createElement('a');
  a.className = 'card';
  a.href = s.href;                      // <-- real navigation target, swap for your own route
  a.style.setProperty('--c', s.color);
  a.dataset.i = i;
  a.innerHTML = `
    <div class="card-thumb">
      <img src="${s.img}" alt="${s.title} — ${s.term}" loading="lazy">
    </div>
    <div class="card-body">
      <span class="card-num">${s.num}</span>
      <span class="card-label">${s.title}</span>
    </div>
    <div class="progress-track"><div class="progress-fill"></div></div>
  `;
  strip.appendChild(a);
});

const washes = Array.from(document.querySelectorAll('.wash'));
washes.forEach((w, i) => {
  if (slides[i]) w.style.backgroundImage = `url('${slides[i].img}')`;
});

const cards = Array.from(document.querySelectorAll('.card'));
const slideIndex = document.getElementById('slide-index');
const slideTitle = document.getElementById('slide-title');
const slideDesc  = document.getElementById('slide-desc');
const hlWord     = document.getElementById('hl-word');
const footStatus = document.getElementById('foot-status');
const navCurtain = document.getElementById('nav-curtain');

let current = 0;
let cycle = 4.2;      // seconds per cue
let progressTween = null;
let paused = false;

function goTo(i) {
  if (i === current) { startProgress(i); return; }
  const prev = current;
  current = i;
  const s = slides[i];

  cards.forEach((c, idx) => c.classList.toggle('active', idx === i));

  // background cross-fade between cue photos
  gsap.to(washes[prev], { opacity: 0, duration: 0.8, ease: 'power2.out' });
  gsap.to(washes[i],    { opacity: 1, duration: 0.8, ease: 'power2.out' });

  // text choreography: exit + staggered entrance
  const tl = gsap.timeline();
  tl.to([slideIndex, slideTitle, slideDesc], {
      opacity: 0, y: -10, duration: 0.28, ease: 'power2.in', stagger: 0.03
    })
    .call(() => {
      slideIndex.textContent = s.indexLabel;
      slideTitle.innerHTML = `${s.title}<span class="slide-term" id="slide-term">— ${s.term}</span>`;
      slideDesc.textContent = s.desc;
      hlWord.textContent = s.term;
      hlWord.style.color = s.color;
    })
    .fromTo([slideIndex, slideTitle, slideDesc],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }
    );

  startProgress(i);
}

function startProgress(i) {
  if (progressTween) progressTween.kill();
  cards.forEach(c => gsap.set(c.querySelector('.progress-fill'), { width: '0%' }));
  const fill = cards[i].querySelector('.progress-fill');
  progressTween = gsap.to(fill, {
    width: '100%',
    duration: cycle,
    ease: 'none',
    onComplete: () => {
      if (!paused) goTo((current + 1) % slides.length);
    }
  });
}

// Hovering / focusing a card previews it. Clicking follows the card's real href.
cards.forEach(card => {
  const i = Number(card.dataset.i);
  card.addEventListener('mouseenter', () => goTo(i));
  card.addEventListener('focus', () => goTo(i));
});

const stageWrap = document.querySelector('.stage-wrap');
stageWrap.addEventListener('mouseenter', () => {
  paused = true;
  if (progressTween) progressTween.pause();
  if (footStatus) footStatus.textContent = STRINGS.paused;
});
stageWrap.addEventListener('mouseleave', () => {
  paused = false;
  if (progressTween) progressTween.resume();
  if (footStatus) footStatus.textContent = STRINGS.playing;
});

// initial state
gsap.set(washes[0], { opacity: 1 });
cards[0].classList.add('active');
gsap.set(hlWord, { color: slides[0].color });
gsap.fromTo('.hero, .stage-wrap', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.12 });
if (navCurtain) gsap.fromTo(navCurtain, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut', delay: 0.15 });
startProgress(0);

// mobile hamburger menu
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