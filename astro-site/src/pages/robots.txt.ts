import type { APIRoute } from 'astro';

// Staging (workers.dev) blocks all crawlers; the real domain allows
// crawling and advertises the sitemap. Switches automatically when
// `site` in astro.config.mjs changes.
export const GET: APIRoute = ({ site }) => {
  const isStaging = !site || site.hostname.endsWith('.workers.dev');
  const body = isStaging
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
