import Lenis from 'lenis';

export function initScroll() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    gestureOrientation: 'vertical',
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // expose for debugging
  (window as any).__lenis = lenis;
}
