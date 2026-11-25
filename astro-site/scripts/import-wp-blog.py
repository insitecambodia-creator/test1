#!/usr/bin/env python3
"""Converts the published blog posts in the WordPress export (WXR) into
src/data/blog-posts.json for the Astro blog pages.

Usage (from astro-site/):
  python3 scripts/import-wp-blog.py "../agcambodia.WordPress.2026-11-16 (3).xml"

Re-run it after a fresh export to pick up new posts. Only `publish` posts
are imported; drafts are skipped. Language is taken from the post's
categories (the French WPML categories), since the export drops /fr/.
"""
import html, json, re, sys
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
}
SITE = 'https://www.agcambodia.com'
FR_CATEGORIES = {
    'non-classifiee', 'cambodge', 'assurance-sante-au-cambodge', 'propriete',
    'la-securite-au-cambodge', 'vivre-au-cambodge', 'lois-au-cambodge', 'routes-et-transport',
}
# Known EN <-> FR translation pairs (same article in both languages).
PAIRS = {
    'retiring-in-cambodia-a-guide-for-expats': 'prendre-sa-retraite-au-cambodge-un-guide-pour-les-expatries',
}
# Dead internal links found in old posts -> their current page.
LINK_FIXES = {
    '/health-insurance-in-cambodia.html': '/health-insurance-cambodia/',
    '/health-insurance-cambodia/long-term-insurance-cambodia/': '/health-insurance-cambodia/long-term-insurance-cambodia-for-expats/',
}
QUOTE_FORM = '/health-insurance-cambodia/long-term-insurance-cambodia-for-expats/form/'
BLOCK = r'(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary|audio|video|iframe|noscript|select|option)'


def wpautop(text: str) -> str:
    """Port of WordPress's wpautop(): blank-line-separated text -> <p>."""
    if not text.strip():
        return ''
    text = text.replace('\r\n', '\n').replace('\r', '\n') + '\n'
    pre = {}
    def keep_pre(m):
        key = f'<pre wp-pre-tag-{len(pre)}></pre>'
        pre[key] = m.group(0)
        return key
    text = re.sub(r'<pre[\s\S]*?</pre>', keep_pre, text)
    text = re.sub(r'<br\s*/?>\s*<br\s*/?>', '\n\n', text)
    text = re.sub(r'(<' + BLOCK + r'[\s/>])', r'\n\n\1', text)
    text = re.sub(r'(</' + BLOCK + r'>)', r'\1\n\n', text)
    text = re.sub(r'(<hr\s*?/?>)', r'\1\n\n', text)
    text = re.sub(r'\n\n+', '\n\n', text)
    out = []
    for chunk in re.split(r'\n\s*\n', text):
        chunk = chunk.strip()
        if chunk:
            out.append('<p>' + chunk + '</p>\n')
    text = ''.join(out)
    text = re.sub(r'<p>\s*</p>', '', text)
    text = re.sub(r'<p>([^<]+)</(div|address|form)>', r'<p>\1</p></\2>', text)
    text = re.sub(r'<p>\s*(</?' + BLOCK + r'[^>]*>)\s*</p>', r'\1', text)
    text = re.sub(r'<p>(<li.+?)</p>', r'\1', text)
    text = re.sub(r'<p><blockquote([^>]*)>', r'<blockquote\1><p>', text, flags=re.I)
    text = text.replace('</blockquote></p>', '</p></blockquote>')
    text = re.sub(r'<p>\s*(</?' + BLOCK + r'[^>]*>)', r'\1', text)
    text = re.sub(r'(</?' + BLOCK + r'[^>]*>)\s*</p>', r'\1', text)
    # Single newlines inside paragraphs become <br />.
    def br(m):
        return re.sub(r'(?<!<br />)\s*\n', '<br />\n', m.group(0))
    text = re.sub(r'<p>[\s\S]*?</p>', br, text)
    text = re.sub(r'(</?' + BLOCK + r'[^>]*>)\s*<br />', r'\1', text)
    text = re.sub(r'<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)', r'\1', text)
    for k, v in pre.items():
        text = text.replace(k, v)
    return text.strip()


def caption(m):
    inner = m.group(2)
    img = re.search(r'(<a [^>]*>)?\s*<img[^>]*>\s*(</a>)?', inner)
    media = img.group(0) if img else ''
    cap = inner.replace(media, '').strip()
    return f'<figure class="wp-caption">{media}<figcaption>{cap}</figcaption></figure>'


def clean(raw: str, title: str) -> str:
    c = raw
    c = re.sub(r'<!--[\s\S]*?-->', '', c)
    # WPForms embed -> link to the new site's quote questionnaire.
    c = re.sub(r'<form[\s\S]*?</form>',
               f'<p><a class="btn btn-gold" href="{QUOTE_FORM}">Get my health insurance quote</a></p>', c)
    c = re.sub(r'<noscript>[\s\S]*?</noscript>', '', c)
    c = re.sub(r'\[caption([^\]]*)\]([\s\S]*?)\[/caption\]', caption, c)
    # WordPress emoji images -> the emoji character itself.
    c = re.sub(r'<img[^>]*src="https://s\.w\.org/images/core/emoji[^"]*"[^>]*alt="([^"]*)"[^>]*>', r'\1', c)
    c = re.sub(r'<img[^>]*alt="([^"]*)"[^>]*src="https://s\.w\.org/images/core/emoji[^"]*"[^>]*>', r'\1', c)
    # Empty decorative hero block from one post.
    c = re.sub(r'<div class="hero">\s*<div class="hero-inner">\s*</div>\s*</div>', '', c)
    c = wpautop(c)
    # Leftover AI-assistant preamble at the top of one French post
    # ("Voici une traduction complète en français de votre texte…").
    c = re.sub(r'^<p>Voici une <strong>traduction[\s\S]*?</p>\s*(<hr />)?\s*', '', c)
    # A repeated <h1> of the post title is dropped; other h1s become h2.
    def h1(m):
        text = re.sub(r'<[^>]+>', '', m.group(1)).strip()
        if html.unescape(text).lower() == html.unescape(title).strip().lower():
            return ''
        return f'<h2>{m.group(1)}</h2>'
    c = re.sub(r'<h1[^>]*>([\s\S]*?)</h1>', h1, c)
    # Internal links become root-relative so they work on any host,
    # except uploaded media, which stays on the WordPress host for now.
    c = re.sub(r'(href|src)="https?://(?:www\.)?agcambodia\.com(?!/wp-content)(/[^"]*)?"',
               lambda m: f'{m.group(1)}="{m.group(2) or "/"}"', c)
    for old, new in LINK_FIXES.items():
        c = c.replace(f'href="{old}"', f'href="{new}"')
    # Links to WordPress attachment pages around images are dropped.
    c = re.sub(r'<a [^>]*href="/[^"]+/[^"/]+/"[^>]*rel="attachment[^"]*"[^>]*>\s*(<img[^>]*>)\s*</a>', r'\1', c)
    c = re.sub(r'<a [^>]*rel="attachment[^"]*"[^>]*href="/[^"]+/[^"/]+/"[^>]*>\s*(<img[^>]*>)\s*</a>', r'\1', c)
    # Lazy-load images and open external links in a new tab.
    c = re.sub(r'<img(?![^>]*\bloading=)', '<img loading="lazy" decoding="async"', c)
    c = re.sub(r'<a ([^>]*href="https?://(?!(?:www\.)?agcambodia\.com)[^"]*"[^>]*)>',
               lambda m: m.group(0) if 'target=' in m.group(1) else f'<a {m.group(1)} target="_blank" rel="noopener">', c)
    c = re.sub(r'(<p>&nbsp;</p>\s*)+', '', c)
    return c.strip()


def text_of(h: str) -> str:
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()


def summary(h: str, n: int) -> str:
    t = text_of(h)
    if len(t) <= n:
        return t
    cut = t[:n].rsplit(' ', 1)[0].rstrip(',;:.')
    return cut + '…'


def main(path: str):
    channel = ET.parse(path).getroot().find('channel')
    items = channel.findall('item')
    attachments = {}
    for it in items:
        if it.findtext('wp:post_type', namespaces=NS) == 'attachment':
            attachments[it.findtext('wp:post_id', namespaces=NS)] = {
                'url': it.findtext('wp:attachment_url', namespaces=NS),
                'alt': next((m.findtext('wp:meta_value', namespaces=NS) for m in it.findall('wp:postmeta', namespaces=NS)
                             if m.findtext('wp:meta_key', namespaces=NS) == '_wp_attachment_image_alt'), '') or '',
            }
    cat_names = {}
    for it in items:
        for c in it.findall('category'):
            name = html.unescape(c.text or '').strip()
            if name == c.get('nicename'):
                name = name.replace('-', ' ')
            cat_names[(c.get('domain'), c.get('nicename'))] = name[:1].upper() + name[1:]
    posts = []
    for it in items:
        if it.findtext('wp:post_type', namespaces=NS) != 'post' or it.findtext('wp:status', namespaces=NS) != 'publish':
            continue
        meta = {m.findtext('wp:meta_key', namespaces=NS): m.findtext('wp:meta_value', namespaces=NS) or ''
                for m in it.findall('wp:postmeta', namespaces=NS)}
        slug = it.findtext('wp:post_name', namespaces=NS)
        title = html.unescape(it.findtext('title') or '').strip()
        cats = [c.get('nicename') for c in it.findall('category') if c.get('domain') == 'category']
        lang = 'fr' if any(c in FR_CATEGORIES for c in cats) else 'en'
        body = clean(it.findtext('content:encoded', namespaces=NS) or '', title)
        desc = (meta.get('rank_math_description') or meta.get('_yoast_wpseo_metadesc') or meta.get('_amt_description')
                or text_of(it.findtext('excerpt:encoded', namespaces=NS) or ''))
        desc = desc.strip() or summary(body, 155)
        thumb = attachments.get(meta.get('_thumbnail_id', ''))
        if not thumb:
            m = re.search(r'<img[^>]*src="(https://www\.agcambodia\.com/wp-content/[^"]+)"[^>]*?(?:alt="([^"]*)")?', body)
            thumb = {'url': m.group(1), 'alt': m.group(2) or ''} if m else None
        posts.append({
            'slug': slug,
            'lang': lang,
            'title': title,
            'description': desc,
            'excerpt': summary(body, 180),
            'date': it.findtext('wp:post_date', namespaces=NS)[:10],
            'modified': (it.findtext('wp:post_modified', namespaces=NS) or '')[:10],
            'categories': [cat_names.get(('category', c), c) for c in cats
                           if c not in ('uncategorized', 'non-classifiee')],
            'image': thumb['url'] if thumb else None,
            'imageAlt': (thumb['alt'] or title) if thumb else None,
            'translation': PAIRS.get(slug) or next((k for k, v in PAIRS.items() if v == slug), None),
            'html': body,
        })
    posts.sort(key=lambda p: p['date'], reverse=True)
    out = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'blog-posts.json'
    out.write_text(json.dumps(posts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    en = sum(p['lang'] == 'en' for p in posts)
    print(f'{len(posts)} posts ({en} EN, {len(posts) - en} FR) -> {out}')


if __name__ == '__main__':
    main(sys.argv[1])
