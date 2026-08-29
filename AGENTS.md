# AGENTS.md

## Stack
- Astro 4 static (`output: 'static'`, `site: https://runmote.dev`) + TypeScript strict (`extends: astro/tsconfigs/strict`).
- Client libs: `animejs@3.2`, `lenis@1.x`, `countup.js@2.x`. No framework UI. No test/lint/typecheck tooling installed.
- `@/*` alias → `src/*` (`tsconfig.json:5`). Vite `ssr.noExternal: ['animejs']` (`astro.config.mjs:8`).

## Commands
```bash
npm install
npm run dev      # astro dev → http://localhost:4321
npm run build    # astro build → dist/
npm run preview  # serve dist
# no lint/test scripts; typecheck ad-hoc: npx tsc --noEmit (1 expected error: missing @types/animejs — build still passes via Vite)
# astro CLI passthrough: npm run astro -- --help
```

## Structure
- `src/pages/index.astro` — single page (Hero + phone screenshot, Why/SSH comparison, How + CLI cmds, Features, Agents matrix, Stats, Architecture pipeline, FAQ). Only route.
- `src/layouts/Layout.astro` — document shell, global CSS import, client `init*` calls (lenis + anime-scroll reveals/pipeline + stats).
- `src/scripts/` — `lenis.ts`, `anime-scroll.ts` (`initReveals` + `initPipeline` scroll-drawn SVG trace), `stats.ts` (GitHub API live fetch with `IntersectionObserver` + graceful fallback to `data-value="0"`).
- `src/styles/global.css` — design tokens (Technical Broadsheet: `--base: #F7F4EE`, `--accent: #C0355D`, Geist Sans + Geist Mono, radius 0, `--max: 1320px`), rule-based list/table/pipeline styles.
- `api/install.js` + `api/install-ps1.js` — Vercel serverless handlers that proxy `raw.githubusercontent.com/Raza-learner/Runmote/{main,dev}/scripts/install.*` and inject `__ACP_RELAY_URL__` / `__ACP_DAEMON_TOKEN__`.
- `vercel.json` — rewrites `/install*` → `/api/install*`; `wrangler.toml` — Cloudflare static fallback (`[assets] directory = "./dist"`).
- `public/` — static assets (`logo.png` + generated favicon/apple-touch pngs from it, `phone.png` hero screenshot). `dist/`, `.astro/`, `.wrangler/` are generated/gitignored.

## Conventions & Gotchas
- **No tests, lint, CI, or opencode.json** in repo — don't expect `npm test`/`npm run lint`/`.github/workflows` to exist.
- **Static only** — don't add SSR/adapters; `astro.config.mjs` is intentionally `output: 'static'`.
- **Motion respects `prefers-reduced-motion`** — `lenis.ts`, `anime-scroll.ts`, and the global CSS all early-return / disable motion if that media query matches; keep it.
- **README mentions Chart.js** but it is not in `package.json` — not currently used (stale doc).
- **Install proxy env** — `ACP_DAEMON_TOKEN_MAIN`, `ACP_DAEMON_TOKEN_DEV`, optional `GITHUB_TOKEN` for rate-limit avoidance. Without them the `/install.sh` handler returns empty token placeholders.
- **`api/` only works on Vercel** — `wrangler.toml` deploy is static-only; `runmote.dev/install.sh` on Cloudflare requires a separate Redirect Rule/Worker (see `README.md:31` / `wrangler.toml:8`).
- **Rewrites are in `vercel.json`**, not Astro redirects — `/install.sh`, `/install.sh/dev`, `/install`, `/install.ps1` variants.

## Deploy
```bash
npm run build
npx wrangler deploy                          # Cloudflare Workers Assets (dist/)
# or
npx wrangler pages deploy dist --project-name=runmote-website
# Vercel: push → auto-deploy (vercel.json buildCommand: npm run build, outputDirectory: dist)
```
