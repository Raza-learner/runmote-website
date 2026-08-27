import anime from 'animejs';

export function initPhone() {
  if (typeof window === 'undefined') return;
  const phone = document.getElementById('phone');
  const cards = document.querySelectorAll<HTMLElement>('.agent-card');
  const check = document.getElementById('check-opencode');
  const dot = document.getElementById('dot-main');
  const connected = document.getElementById('phone-connected');
  if (!phone || cards.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // initial state
  cards.forEach((c) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(12px) scale(0.98)';
  });
  if (check) {
    check.style.transform = 'scale(0)';
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        // cards stagger in
        anime({
          targets: '#phone-cards .agent-card',
          translateY: [12, 0],
          scale: [0.98, 1],
          opacity: [0, 1],
          duration: 520,
          delay: anime.stagger(90, { start: 120 }),
          easing: 'easeOutCubic',
        });

        // check pop after cards
        if (check) {
          anime({
            targets: check,
            scale: [0, 1],
            duration: 420,
            delay: 620,
            easing: 'easeOutBack',
          });
        }

        // dot pulse loop
        if (dot) {
          anime({
            targets: dot,
            scale: [1, 1.45, 1],
            opacity: [1, 0.7, 1],
            duration: 1200,
            loop: true,
            easing: 'easeInOutSine',
            delay: 800,
          });
        }

        // subtle selection cycle — move selected class every 2.6s to showcase all agents
        const cycle = () => {
          const order = ['card-opencode', 'card-cursor', 'card-claude'];
          let idx = 0;
          setInterval(() => {
            idx = (idx + 1) % order.length;
            cards.forEach((c) => c.classList.remove('selected'));
            const next = document.getElementById(order[idx]);
            if (next) {
              next.classList.add('selected');
              anime({
                targets: next,
                scale: [0.98, 1],
                duration: 300,
                easing: 'easeOutCubic',
              });
            }
            // move check to new card visually
            if (check && next) {
              const action = next.querySelector('.agent-action');
              if (action && !action.contains(check)) {
                // animate check moving
                anime({ targets: check, scale: [1, 0], duration: 160, easing: 'easeInQuad', complete: () => {
                  action.prepend(check);
                  anime({ targets: check, scale: [0, 1], duration: 260, easing: 'easeOutBack' });
                }});
              }
            }
          }, 2600);
        };
        setTimeout(cycle, 1800);

        // bottom nav active hint pulse
        anime({
          targets: '.phone-bottom .nav-item.active .pill',
          scale: [1, 1.04, 1],
          duration: 1600,
          loop: true,
          easing: 'easeInOutSine',
          delay: 1000,
        });

        io.disconnect();
      }
    });
  }, { threshold: 0.3 });

  io.observe(phone);
}
