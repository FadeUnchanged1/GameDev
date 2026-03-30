const revealTargets = document.querySelectorAll('.reveal');
const jumpButtons = document.querySelectorAll('[data-jump]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
  revealObserver.observe(element);
});

jumpButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-jump');
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
