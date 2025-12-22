const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');

let lastNavToggleFocus = null;

function setNavOpen(open) {
  if (!navToggle || !navMenu) return;
  const wasOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  navMenu.classList.toggle('is-open', open);

  if (!wasOpen && open) {
    lastNavToggleFocus = document.activeElement;
    const firstLink = navMenu.querySelector('a');
    if (firstLink instanceof HTMLElement) firstLink.focus();
  }

  if (wasOpen && !open) {
    if (lastNavToggleFocus instanceof HTMLElement) {
      lastNavToggleFocus.focus();
    } else {
      navToggle.focus();
    }
  }
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!isOpen);
  });
}

if (navMenu) {
  navMenu.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.matches('a')) setNavOpen(false);
  });
}

document.addEventListener('keydown', (e) => {
  if (!navToggle || !navMenu) return;
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  if (!isOpen) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    setNavOpen(false);
  }
});

document.addEventListener('click', (e) => {
  if (!navToggle || !navMenu) return;
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  if (!isOpen) return;

  const target = e.target;
  if (!(target instanceof Node)) return;
  const clickedInside = navMenu.contains(target) || navToggle.contains(target);
  if (!clickedInside) setNavOpen(false);
});

window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.borderBottomColor =
    window.scrollY > 8 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)';
});

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const carousels = document.querySelectorAll('[data-carousel]');

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setupCarousel(root) {
  const track = root.querySelector('[data-carousel-track]');
  const slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  const dots = root.querySelector('[data-carousel-dots]');

  if (!(track instanceof HTMLElement)) return;
  if (!slides.length) return;

  let index = 0;
  let autoplayId = null;
  let isPaused = false;

  function setIndex(nextIndex, opts = {}) {
    const { userInitiated = false } = opts;
    index = clamp(nextIndex, 0, slides.length - 1);
    track.style.transform = `translateX(calc(${index} * -100% - ${index} * 1rem))`;

    slides.forEach((slide, i) => {
      slide.toggleAttribute('aria-hidden', i !== index);
      if (i === index) {
        slide.removeAttribute('inert');
      } else {
        slide.setAttribute('inert', '');
      }
    });

    if (dots instanceof HTMLElement) {
      const dotButtons = Array.from(dots.querySelectorAll('button'));
      dotButtons.forEach((btn, i) => {
        btn.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    if (prevBtn instanceof HTMLButtonElement) prevBtn.disabled = index === 0;
    if (nextBtn instanceof HTMLButtonElement) nextBtn.disabled = index === slides.length - 1;

    if (userInitiated) restartAutoplay();
  }

  function buildDots() {
    if (!(dots instanceof HTMLElement)) return;
    dots.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel__dot';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.setAttribute('aria-current', i === index ? 'true' : 'false');
      b.addEventListener('click', () => setIndex(i, { userInitiated: true }));
      dots.appendChild(b);
    });
  }

  function stopAutoplay() {
    if (autoplayId) window.clearInterval(autoplayId);
    autoplayId = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (prefersReducedMotion()) return;
    autoplayId = window.setInterval(() => {
      if (isPaused) return;
      const next = index + 1;
      setIndex(next > slides.length - 1 ? 0 : next);
    }, 5200);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  if (prevBtn instanceof HTMLButtonElement) {
    prevBtn.addEventListener('click', () => setIndex(index - 1, { userInitiated: true }));
  }

  if (nextBtn instanceof HTMLButtonElement) {
    nextBtn.addEventListener('click', () => setIndex(index + 1, { userInitiated: true }));
  }

  root.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  root.addEventListener('mouseleave', () => {
    isPaused = false;
  });
  root.addEventListener('focusin', () => {
    isPaused = true;
  });
  root.addEventListener('focusout', () => {
    isPaused = false;
  });

  let touchStartX = null;
  root.addEventListener('touchstart', (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    touchStartX = t.clientX;
  }, { passive: true });

  root.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(dx) < 40) return;
    if (dx < 0) setIndex(index + 1, { userInitiated: true });
    if (dx > 0) setIndex(index - 1, { userInitiated: true });
  }, { passive: true });

  buildDots();
  setIndex(0);
  startAutoplay();
}

carousels.forEach((c) => setupCarousel(c));
