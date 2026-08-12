/* about.js — fully standalone script for about.html.
   Not shared with script.js/cue.js on purpose. Handles two things:
   1) the animated logo reveal (fires once, when it scrolls into view)
   2) the mobile hamburger menu (same behavior as the rest of the site) */

// 1) Animated logo reveal
const logoFrame = document.getElementById('logo-frame');
if (logoFrame) {
  const revealLogo = () => logoFrame.classList.add('in-view');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealLogo();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(logoFrame);
  } else {
    // fallback for very old browsers: just show it
    revealLogo();
  }
}

// 2) Mobile hamburger menu
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

// nav curtain draw-in, matching the rest of the site
const navCurtain = document.getElementById('nav-curtain');
if (navCurtain && window.gsap) {
  gsap.fromTo(navCurtain, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut', delay: 0.15 });
} else if (navCurtain) {
  // no GSAP loaded on this page on purpose — plain CSS transition fallback
  requestAnimationFrame(() => {
    navCurtain.style.transition = 'transform 1s cubic-bezier(.16,1,.3,1)';
    navCurtain.style.transform = 'scaleX(1)';
  });
}