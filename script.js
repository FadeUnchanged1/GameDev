const root = document.documentElement;
const body = document.body;
const revealTargets = document.querySelectorAll('.reveal');
const tiltTargets = document.querySelectorAll('.tilt');
const navButtons = document.querySelectorAll('[data-jump]');
const actionButtons = document.querySelectorAll('[data-action]');
const timer = document.getElementById('timer');

let paused = false;
let compactMode = false;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((element, index) => {
  element.style.setProperty('--delay', `${Math.min(index * 45, 360)}ms`);
  revealObserver.observe(element);
});

tiltTargets.forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (paused) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    element.style.setProperty('--tilt-x', `${offsetX * 8}deg`);
    element.style.setProperty('--tilt-y', `${-offsetY * 6}deg`);
  });

  element.addEventListener('pointerleave', () => {
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  });
});

const updateSpotlight = (x, y) => {
  root.style.setProperty('--spot-x', `${x}px`);
  root.style.setProperty('--spot-y', `${y}px`);
};

window.addEventListener('pointermove', (event) => {
  if (paused) {
    return;
  }

  updateSpotlight(event.clientX, event.clientY);
}, { passive: true });

window.addEventListener('pointerleave', () => {
  updateSpotlight(window.innerWidth * 0.58, window.innerHeight * 0.14);
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-jump');
    const element = document.getElementById(target);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');

    if (action === 'motion') {
      paused = !paused;
      body.classList.toggle('motion-paused', paused);
      button.textContent = paused ? 'Resume motion' : 'Pause motion';
      updateSpotlight(window.innerWidth * 0.58, window.innerHeight * 0.14);
      return;
    }

    if (action === 'accent') {
      const hue = Math.floor(Math.random() * 360);
      const accent = `hsl(${hue} 60% 34%)`;
      const accentSoft = `hsla(${hue} 60% 34% / 0.12)`;
      const accent2 = `hsl(${(hue + 24) % 360} 58% 26%)`;
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent-soft', accentSoft);
      root.style.setProperty('--accent-2', accent2);
      return;
    }

    if (button.textContent.includes('Add Project')) {
      const pulse = document.querySelector('.metric.featured');
      if (pulse) {
        pulse.animate([
          { transform: 'translateY(0) scale(1)' },
          { transform: 'translateY(-3px) scale(1.015)' },
          { transform: 'translateY(0) scale(1)' },
        ], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
    }
  });
});

const topJump = document.querySelector('.download-btn');
if (topJump) {
  topJump.addEventListener('click', () => {
    document.getElementById('log')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const toggleCompact = () => {
  compactMode = !compactMode;
  body.classList.toggle('compact-mode', compactMode);
};

setInterval(() => {
  if (!timer) {
    return;
  }

  const current = timer.textContent.split(':').map(Number);
  let seconds = current[0] * 3600 + current[1] * 60 + current[2];
  seconds += paused ? 0 : 1;
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  timer.textContent = `${hours}:${minutes}:${secs}`;
}, 1000);

document.querySelectorAll('.panel-action').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.textContent === '+ Add Member') {
      toggleCompact();
    }
  });
});
