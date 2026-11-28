#!/usr/bin/env python3
"""Copies the blog's images from a folder of uploads into
public/blog-images/<year>/<month>/, matching them to the WordPress
upload paths the posts use. Then re-run import-wp-blog.py, which points
posts at every local copy it finds (missing ones stay on WordPress).

Usage (from astro-site/):
  python3 scripts/sync-blog-images.py ../assets
  python3 scripts/import-wp-blog.py "../agcambodia.WordPress.2026-11-16 (3).xml"

Matching is by file name, ignoring WordPress size suffixes (-300x200),
"-scaled", "-copy" and the extension, so foo-copy.jpg can stand in for
foo-copy.webp. Prints what is still missing.
"""
import json, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'blog-images'
UPLOADS = re.compile(r'https://www\.agcambodia\.com/wp-content/uploads/(\d{4}/\d{2}/[^"\s,<]+)')
# Uploads whose name doesn't match the WordPress one, or is ambiguous.
OVERRIDES = {
    '2026/06/WORDPRESS-FEATURE.jpg': ['DIABETES-FEATURE.jpg', 'WORDPRESS-FEATURE.jpg'],
    '2024/09/WORDPRESS-FEATURE.jpg': ['WORDPRESS-FEATURE-2024.jpg', 'WORDPRESS-FEATURE-2024.jpeg', 'WORDPRESS-FEATURE-2024.webp'],
    '2026/10/Cambodia-Visa-Guide-2026.jpg': ['Cambodia-Visa-Guide-2026-2.jpg', 'Cambodia-Visa-Guide-2026.jpg'],
}


def stem(name: str) -> str:
    """WordPress file name -> the stem used for local copies."""
    n = re.sub(r'\.[A-Za-z0-9]+$', '', name)
    return re.sub(r'-\d+x\d+$', '', n)


def norm(name: str) -> str:
    n = stem(name)
    n = re.sub(r'-scaled$', '', n)
    n = re.sub(r'-copy$', '', n)
    return n.lower()


def needed() -> list[str]:
    posts = json.loads((ROOT / 'src' / 'data' / 'blog-posts.json').read_text(encoding='utf-8'))
    text = '\n'.join((p.get('image') or '') + '\n' + p['html'] for p in posts)
    keys = {m.group(1) for m in UPLOADS.finditer(text)}
    # Images already pointed at local copies.
    for p in posts:
        for m in re.finditer(r'/blog-images/(\d{4}/\d{2}/[^"\s,<]+)', (p.get('image') or '') + '\n' + p['html']):
            keys.add(m.group(1))
    # One local copy per stem (thumbnail sizes share the original).
    by_stem = {}
    for k in sorted(keys):
        d, f = k.rsplit('/', 1)
        by_stem.setdefault(f'{d}/{stem(f)}', k)
    return sorted(by_stem.values())


def main(src: str):
    files = [p for p in Path(src).iterdir() if p.is_file()]
    by_norm, by_stem = {}, {}
    for p in sorted(files):
        by_norm.setdefault(norm(p.name), p)
        by_stem.setdefault(stem(p.name).lower(), p)
    by_name = {p.name: p for p in files}
    missing = []
    for key in needed():
        d, f = key.rsplit('/', 1)
        if key in OVERRIDES:
            match = next((by_name[n] for n in OVERRIDES[key] if n in by_name), None)
            # WORDPRESS-FEATURE.jpg is the 2026 image; never use it for 2024.
        else:
            match = by_stem.get(stem(f).lower()) or by_norm.get(norm(f))
        if not match:
            missing.append(key)
            continue
        dest = OUT / d / (stem(f) + match.suffix.lower())
        dest.parent.mkdir(parents=True, exist_ok=True)
        for old in dest.parent.glob(stem(f) + '.*'):
            if old != dest:
                old.unlink()
        shutil.copyfile(match, dest)
        print(f'ok    {key}  <-  {match.name}')
    for key in missing:
        print(f'MISSING {key}')
    print(f'{len(needed()) - len(missing)} copied, {len(missing)} missing')


if __name__ == '__main__':
    main(sys.argv[1])
