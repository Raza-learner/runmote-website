import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://runmote.dev',
  vite: {
    ssr: { noExternal: ['animejs'] }
  }
});
