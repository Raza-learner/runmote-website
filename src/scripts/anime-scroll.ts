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
            translateY: [8, 0],
            opacity: [0, 1],
            duration: 420,
            delay,
            easing: 'easeOutCubic',
          });
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
}

export function initPipeline() {
  if (typeof window === 'undefined') return;
  const svg = document.getElementById('pipeline');
  if (!svg) return;

  const links = Array.from(svg.querySelectorAll<SVGLineElement>('.link'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  links.forEach((l) => {
    const len = l.getTotalLength();
    l.style.strokeDasharray = `${len}`;
    l.style.strokeDashoffset = `${len}`;
  });

  if (!('IntersectionObserver' in window)) {
    links.forEach((l) => (l.style.strokeDashoffset = '0'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l, i) => {
          anime({
            targets: l,
            strokeDashoffset: [parseFloat(l.style.strokeDashoffset || '0'), 0],
            duration: 900,
            delay: 200 + i * 240,
            easing: 'easeInOutQuad',
          });
        });
        io.disconnect();
      });
    },
    { threshold: 0.4 }
  );
  io.observe(svg);
}
