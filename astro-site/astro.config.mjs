import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ag-cambodia-site.franck-a71.workers.dev',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
