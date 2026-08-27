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
            translateY: [10, 0],
            opacity: [0, 1],
            duration: 420,
            delay,
            easing: 'easeOutCubic',
          });
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );
  els.forEach((el) => io.observe(el));
}
