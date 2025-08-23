// Subtle entrance animation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(8px)';
    setTimeout(() => {
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 120 + i * 90);
  });
});

(() => {
  const SELECTORS = [
    '.specials h2',
    '.special-card',
    '.split img',
    '.split .split-text',
    '.reviews h2',
    '.review-card'
  ];

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = Array.from(
    new Set(SELECTORS.flatMap(sel => Array.from(document.querySelectorAll(sel))))
  );

  const noIO = typeof window.IntersectionObserver === 'undefined';

  const makeVisibleNow = el => {
    el.style.animation = 'none';
    el.style.opacity = 1;
    el.style.transform = 'none';
  };

  if (prefersReduced || noIO) {
    elements.forEach(makeVisibleNow);
    return;
  }

  elements.forEach(el => {
    const cs = getComputedStyle(el);
    const hasAnimation = cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0;

    if (hasAnimation) {
      el.style.animationPlayState = 'paused';
      if (parseFloat(cs.opacity) === 1) el.style.opacity = 0;
    } else {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 600ms ease, transform 600ms ease';
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const cs = getComputedStyle(el);
        const hasAnimation = cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0;

        if (hasAnimation) {
          el.style.animationPlayState = 'running';
        } else {
          requestAnimationFrame(() => {
            el.style.opacity = 1;
            el.style.transform = 'none';
          });
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.18 }
  );

  elements.forEach(el => observer.observe(el));

  // Click anchors to scroll and trigger staggered animation
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const animElements = Array.from(
        target.querySelectorAll(
          '.specials h2, .special-card, .split img, .split .split-text, .reviews h2, .review-card'
        )
      );

      animElements.forEach((el, i) => {
        const cs = getComputedStyle(el);
        if (cs.animationName !== 'none') {
          el.style.animationPlayState = 'running';
        } else {
          el.style.opacity = 0;
          el.style.transform = 'translateY(20px)';
          setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
          }, i * 100);
        }
      });
    });
  });
})();
