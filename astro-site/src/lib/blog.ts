import posts from '../data/blog-posts.json';
import type { Lang } from '../i18n/ui';

/** A blog post imported from the WordPress export by
 * scripts/import-wp-blog.py. `html` is the cleaned post body. */
export interface BlogPost {
  slug: string;
  lang: Lang;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  modified: string;
  categories: string[];
  image: string | null;
  imageAlt: string | null;
  /** Slug of the same article in the other language, if there is one. */
  translation: string | null;
  html: string;
}

/** All posts, newest first. */
export const allPosts = (posts as BlogPost[]).slice().sort((a, b) => b.date.localeCompare(a.date));

export function postsIn(lang: Lang): BlogPost[] {
  return allPosts.filter((p) => p.lang === lang);
}

/** Posts keep their WordPress URLs: /slug/ for English, /fr/slug/ for French. */
export function postHref(post: Pick<BlogPost, 'slug' | 'lang'>): string {
  return post.lang === 'en' ? `/${post.slug}/` : `/fr/${post.slug}/`;
}

export function blogIndexHref(lang: Lang): string {
  return lang === 'en' ? '/blogs/' : '/fr/blogs/';
}

export function formatDate(iso: string, lang: Lang): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Latest posts for the footer: the visitor's language first, topped up
 * with the other language when there aren't enough. */
export function latestPosts(lang: Lang, count = 4): BlogPost[] {
  const own = postsIn(lang);
  if (own.length >= count) return own.slice(0, count);
  return own.concat(allPosts.filter((p) => p.lang !== lang)).slice(0, count);
}
