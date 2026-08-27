import { CountUp } from 'countup.js';
import anime from 'animejs';

type GitHubRepo = { stargazers_count: number; forks_count: number; open_issues_count: number };
type GitHubRelease = { tag_name: string };

async function fetchGitHub(): Promise<{ stars: number; forks: number; releases: number } | null> {
  try {
    const [repoRes, relRes] = await Promise.all([
      fetch('https://api.github.com/repos/Raza-learner/Runmote', { headers: { Accept: 'application/vnd.github.v3+json' } }),
      fetch('https://api.github.com/repos/Raza-learner/Runmote/releases?per_page=100', { headers: { Accept: 'application/vnd.github.v3+json' } }),
    ]);
    if (!repoRes.ok) throw new Error('repo fetch failed');
    const repo = (await repoRes.json()) as GitHubRepo;
    const releases = relRes.ok ? ((await relRes.json()) as GitHubRelease[]) : [];
    return { stars: repo.stargazers_count ?? 0, forks: repo.forks_count ?? 0, releases: releases.length };
  } catch {
    return null;
  }
}

export async function initStats() {
  const root = document.getElementById('stats');
  if (!root) return;

  const starsEl = document.getElementById('stat-stars');
  const forksEl = document.getElementById('stat-forks');
  const releasesEl = document.getElementById('stat-releases');
  const latencyEl = document.getElementById('stat-latency');
  const platformsEl = document.getElementById('stat-platforms');

  const live = await fetchGitHub();

  const runCount = (el: HTMLElement | null, end: number, opts: any = {}) => {
    if (!el) return;
    const fallback = Number(el.dataset.value || end);
    const target = Number.isFinite(end) ? end : fallback;
    const cu = new CountUp(el, target, { duration: 1.6, separator: ',', ...opts });
    if (!cu.error) cu.start();
    else el.textContent = String(target);
  };

  const onEnter = () => {
    // stars / forks / releases live
    if (live) {
      runCount(starsEl, live.stars);
      runCount(forksEl, live.forks);
      runCount(releasesEl, live.releases);
    } else {
      runCount(starsEl, Number(starsEl?.dataset.value || 0));
      runCount(forksEl, Number(forksEl?.dataset.value || 0));
      runCount(releasesEl, Number(releasesEl?.dataset.value || 0));
    }
    // fixed stats with anime suffix trick
    runCount(latencyEl, 87, { suffix: 'ms', duration: 1.3 });
    runCount(platformsEl, 6, { duration: 1.2 });

    // ring draw animation
    const rings = document.querySelectorAll<SVGPathElement>('.stat-ring');
    rings.forEach((r) => {
      const len = r.getTotalLength?.() ?? 300;
      r.style.strokeDasharray = String(len);
      r.style.strokeDashoffset = String(len);
      anime({ targets: r, strokeDashoffset: [len, len * 0.18], duration: 1200, easing: 'easeOutCubic', delay: 200 });
    });
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          onEnter();
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(root);
  } else {
    onEnter();
  }

  // tiny sparkline with Chart.js lazily loaded
  const canvas = document.getElementById('sparkline') as HTMLCanvasElement | null;
  if (canvas) {
    const io2 = new IntersectionObserver(async (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          io2.disconnect();
          const { Chart, registerables } = await import('chart.js');
          Chart.register(...registerables);
          new Chart(canvas, {
            type: 'line',
            data: {
              labels: Array.from({ length: 12 }, (_, i) => `${i * 5}m`),
              datasets: [
                {
                  label: 'relay p95 (ms)',
                  data: [92, 88, 84, 90, 78, 82, 76, 71, 74, 68, 72, 67],
                  borderColor: '#7C5CFF',
                  backgroundColor: 'rgba(124,92,255,0.18)',
                  tension: 0.42,
                  fill: true,
                  pointRadius: 0,
                  borderWidth: 2,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 900, easing: 'easeOutQuart' as any },
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              scales: {
                x: { display: false },
                y: { display: false, min: 50, max: 100 },
              },
            },
          });
        }
      }
    }, { threshold: 0.2 });
    io2.observe(canvas);
  }
}
