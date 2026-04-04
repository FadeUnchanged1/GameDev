const root = document.documentElement;
const body = document.body;
const revealTargets = document.querySelectorAll('.reveal');
const sectionTargets = document.querySelectorAll('header[id], section[id]');
const navButtons = document.querySelectorAll('.toc-link');
const jumpButtons = document.querySelectorAll('[data-jump]');
const motionToggle = document.querySelector('[data-action="motion"]');
const tiltTargets = document.querySelectorAll('.tilt');

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
  rootMargin: '-18% 0px -54% 0px'
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

if (motionToggle) {
  motionToggle.addEventListener('click', () => {
    const paused = body.classList.toggle('motion-paused');
    motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    motionToggle.setAttribute('aria-pressed', String(paused));
    if (!paused) {
      root.style.setProperty('--spot-x', '56%');
      root.style.setProperty('--spot-y', '14%');
    }
  });
}

const resetSpotlight = () => {
  root.style.setProperty('--spot-x', '56%');
  root.style.setProperty('--spot-y', '14%');
};

window.addEventListener('pointermove', (event) => {
  if (body.classList.contains('motion-paused')) {
    return;
  }

  root.style.setProperty('--spot-x', `${event.clientX}px`);
  root.style.setProperty('--spot-y', `${event.clientY}px`);
}, { passive: true });

window.addEventListener('pointerleave', resetSpotlight);

tiltTargets.forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (body.classList.contains('motion-paused')) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    element.style.setProperty('--tilt-x', `${offsetX * 6}deg`);
    element.style.setProperty('--tilt-y', `${-offsetY * 5}deg`);
  });

  element.addEventListener('pointerleave', () => {
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  });
});
