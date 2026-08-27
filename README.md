# Runmote Website — Astro + anime.js + Lenis + CountUp

Static scroll-driven marketing site for **Runmote** — https://runmote.dev
New palette (Ink + Neon), Lenis smooth scroll, anime.js reveals, CountUp.js live GitHub stats, Chart.js sparkline.

## Stack
- Astro 4 (static) + TypeScript
- anime.js 3.2 (reveal + floating phone + ring draw)
- Lenis 1.x (smooth scroll, respects `prefers-reduced-motion`)
- CountUp.js 2.x (live stars/forks/releases from `api.github.com`)
- Chart.js 4 (p95 sparkline, lazy-loaded on scroll)

## Dev
```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # -> dist/
npm run preview
```

## Deploy (Cloudflare)
Static `dist/` via Wrangler Assets (or Cloudflare Pages — connect this repo).

```bash
npm run build
npx wrangler deploy
# or
npx wrangler pages deploy dist --project-name=runmote-website
```

Keep the existing Worker at `Raza-learner/Runmote` (`worker.js` for `/install.sh`) on `runmote.dev` — add a Redirect Rule or Route to proxy `/install*` to that Worker after this site goes live.

## Structure
```
src/pages/index.astro   # Hero, Why, How, Features, Stats, Architecture, FAQ
src/layouts/Layout.astro
src/styles/global.css   # new palette tokens
src/scripts/lenis.ts, anime-scroll.ts, stats.ts
public/favicon.svg
```

## Live stats
`src/scripts/stats.ts` fetches `https://api.github.com/repos/Raza-learner/Runmote` on client. Fails gracefully to `data-value="0"` fallbacks. Uses IntersectionObserver — numbers count only when `#stats` enters viewport.

## Notes
- `animejs` 3.2 kept (stable CJS/ESM). Upgrade to v4 is drop-in via `esm.sh`.
- `Lenis` disabled if `prefers-reduced-motion: reduce`.

