import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ag.insurance-cambodia.com',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
