const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const supportsObserver = 'IntersectionObserver' in window;
const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll(root block)');
const supportsViewTimeline =
  CSS.supports('animation-timeline', 'view(block)') &&
  CSS.supports('animation-range', 'entry 0% entry 45%');

const progress = document.querySelector<HTMLElement>('#scroll-progress');
const nav = document.querySelector<HTMLElement>('#main-nav');
let revealObserver: IntersectionObserver | undefined;
let sectionObserver: IntersectionObserver | undefined;
let scrollFrame = 0;

function prepareReveals() {
  revealObserver?.disconnect();
  sectionObserver?.disconnect();
  root.classList.remove('motion-ready', 'native-view-timeline');

  if (reduceMotion.matches || !supportsObserver) return;

  if (supportsViewTimeline) root.classList.add('native-view-timeline');

  revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
    if (supportsViewTimeline && element.hasAttribute('data-scroll-reveal')) return;
    if (!element.classList.contains('active')) revealObserver?.observe(element);
  });

  root.classList.add('motion-ready');
}

function setupSectionNavigation() {
  if (!nav || !supportsObserver) return;

  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[data-section-link]')];
  const sections = [...new Set(links.map((link) => {
    const id = link.hash.slice(1);
    return id ? document.getElementById(id) : null;
  }).filter((section): section is HTMLElement => section instanceof HTMLElement))];

  sectionObserver = new IntersectionObserver(() => {
    const guide = window.innerHeight * 0.38;
    const current = sections
      .filter((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= guide && rect.bottom >= guide;
      })
      .sort((a, b) => Math.abs(a.getBoundingClientRect().top - guide) - Math.abs(b.getBoundingClientRect().top - guide))[0];

    if (!current) return;
    for (const link of links) {
      if (link.hash === `#${current.id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.4, 0.8] });

  sections.forEach((section) => sectionObserver?.observe(section));
}

function updateScrollState() {
  if (nav) nav.dataset.scrolled = String(window.scrollY > 16);

  if (progress && !supportsScrollTimeline && !reduceMotion.matches) {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const amount = distance > 0 ? Math.min(1, window.scrollY / distance) : 0;
    progress.style.transform = `scaleX(${amount})`;
  }
}

function scheduleScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    updateScrollState();
  });
}

function setupMobileMenu() {
  const menu = nav?.querySelector<HTMLDetailsElement>('details');
  if (!menu || menu.dataset.motionBound === 'true') return;
  menu.dataset.motionBound = 'true';

  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary')?.focus();
  });

  menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => { menu.open = false; });
  });
}

function initialize() {
  prepareReveals();
  setupSectionNavigation();
  setupMobileMenu();
  updateScrollState();
}

initialize();
reduceMotion.addEventListener('change', initialize);
window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
