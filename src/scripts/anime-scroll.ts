import anime from 'animejs';

export function initReveals() {
  if (typeof window === 'undefined') return;

  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.classList.add('in');
          const delay = Number(el.dataset.delay || 0);
          anime({
            targets: el,
            translateY: [18, 0],
            opacity: [0, 1],
            duration: 700,
            delay,
            easing: 'easeOutCubic',
          });
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => io.observe(el));

  // hero floating
  const phone = document.querySelector<HTMLElement>('.phone');
  if (phone && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    anime({
      targets: phone,
      translateY: [-6, 6],
      duration: 2600,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });
  }

  // marquee pause on hover enhancement handled by CSS
}
