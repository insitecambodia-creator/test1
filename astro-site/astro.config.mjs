import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [
    sitemap({
      // Quote-form questionnaires and the 404 page are noindex, so keep
      // them out of the sitemap too.
      filter: (page) => !/\/(form|404)\/?$/.test(new URL(page).pathname),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', fr: 'fr' },
      },
    }),
  ],
});
