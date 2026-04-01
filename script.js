const root = document.documentElement;
const body = document.body;
const revealTargets = document.querySelectorAll('.reveal');
const sectionTargets = document.querySelectorAll('section[id]');
const navButtons = document.querySelectorAll('.toc-link');
const jumpButtons = document.querySelectorAll('[data-jump]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealTargets.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 70, 360)}ms`;
  revealObserver.observe(element);
});

const setActiveNav = (sectionId) => {
  navButtons.forEach((button) => {
    const isActive = button.getAttribute('data-jump') === sectionId;
    button.classList.toggle('active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });
};

const sectionObserver = new IntersectionObserver((entries) => {
  const visibleEntry = entries
    .filter((entry) => entry.isIntersecting)
    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

  if (visibleEntry) {
    setActiveNav(visibleEntry.target.id);
  }
}, {
  threshold: [0.2, 0.35, 0.5],
  rootMargin: '-18% 0px -52% 0px'
});

sectionTargets.forEach((section) => sectionObserver.observe(section));

jumpButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-jump');
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

window.addEventListener('pointermove', (event) => {
  root.style.setProperty('--spot-x', `${event.clientX}px`);
  root.style.setProperty('--spot-y', `${event.clientY}px`);
}, { passive: true });

window.addEventListener('pointerleave', () => {
  root.style.setProperty('--spot-x', '56%');
  root.style.setProperty('--spot-y', '14%');
});
