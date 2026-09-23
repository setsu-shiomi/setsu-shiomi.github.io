import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://setsu.sh',
  integrations: [sitemap()],
});
