import type { Lang } from './ui';

/** Derives the equivalent URL in the other language, assuming mirrored
 * slugs under a /fr/ prefix (e.g. /about-us/ <-> /fr/about-us/).
 * Pass an explicit override on pages whose translated counterpart
 * doesn't exist yet or uses a different slug. */
export function getAltLangHref(pathname: string, lang: Lang): string {
  if (lang === 'en') {
    return '/fr' + pathname;
  }
  return pathname.replace(/^\/fr(\/|$)/, '/') || '/';
}

export function localizedHome(lang: Lang): string {
  return lang === 'en' ? '/' : '/fr/';
}
