import { CountUp } from 'countup.js';

async function fetchGitHub(): Promise<{ stars: number; forks: number; releases: number } | null> {
  try {
    const [repoRes, relRes] = await Promise.all([
      fetch('https://api.github.com/repos/Raza-learner/Runmote', { headers: { Accept: 'application/vnd.github.v3+json' } }),
      fetch('https://api.github.com/repos/Raza-learner/Runmote/releases?per_page=100', { headers: { Accept: 'application/vnd.github.v3+json' } }),
    ]);
    if (!repoRes.ok) throw new Error('repo');
    const repo = await repoRes.json() as any;
    const releases = relRes.ok ? (await relRes.json() as any[]) : [];
    return { stars: repo.stargazers_count ?? 0, forks: repo.forks_count ?? 0, releases: releases.length };
  } catch { return null; }
}

export async function initStats() {
  const root = document.getElementById('stats');
  if (!root) return;

  const starsEl = document.getElementById('stat-stars');
  const forksEl = document.getElementById('stat-forks');
  const relEl = document.getElementById('stat-releases');

  const live = await fetchGitHub();

  const run = (el: HTMLElement | null, end: number) => {
    if (!el) return;
    const cu = new CountUp(el, Number.isFinite(end) ? end : Number(el.dataset.value || 0), { duration: 1.2, separator: ',' });
    if (!cu.error) cu.start(); else el.textContent = String(end);
  };

  const start = () => {
    if (live) {
      run(starsEl, live.stars);
      run(forksEl, live.forks);
      run(relEl, live.releases);
    } else {
      run(starsEl, Number(starsEl?.dataset.value || 0));
      run(forksEl, Number(forksEl?.dataset.value || 0));
      run(relEl, Number(relEl?.dataset.value || 0));
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { start(); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(root);
  } else start();
}
