import anime from 'animejs';

export function initPhone() {
  if (typeof window === 'undefined') return;
  const phone = document.getElementById('phone');
  const cards = document.querySelectorAll<HTMLElement>('#phone-cards .agent-card');
  const check = document.getElementById('check-opencode');
  const dotMain = document.getElementById('dot-main');
  if (!phone || cards.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach((c) => { c.style.opacity = '1'; c.style.transform = 'none'; });
    if (check) check.style.transform = 'scale(1)';
    return;
  }

  // Set initial hidden state — only once, no scale jitter
  cards.forEach((c) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(10px)';
  });
  if (check) check.style.opacity = '0';

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;

      // 1) Cards: realistic stagger as if loading from API — subtle y only, no scale
      anime({
        targets: '#phone-cards .agent-card',
        translateY: [10, 0],
        opacity: [0, 1],
        duration: 480,
        delay: anime.stagger(100, { start: 80 }),
        easing: 'easeOutCubic',
      });

      // 2) Check: just appears with small pop on the already-selected Opencode — stays there
      if (check) {
        anime({
          targets: check,
          scale: [0.6, 1],
          opacity: [0, 1],
          duration: 360,
          delay: 520,
          easing: 'easeOutBack',
        });
      }

      // 3) Dots: very subtle breathing — only main "Connected" dot, not every card
      //    Matches screenshot: solid green, no aggressive pulsing
      if (dotMain) {
        anime({
          targets: dotMain,
          scale: [1, 1.15, 1],
          duration: 2200,
          loop: true,
          easing: 'easeInOutSine',
          delay: 900,
        });
      }

      // 4) Bottom nav: no pulse — screenshot is static. Just ensure no animation noise.

      io.disconnect();
    });
  }, { threshold: 0.28, rootMargin: '0px 0px -40px 0px' });

  io.observe(phone);
}
