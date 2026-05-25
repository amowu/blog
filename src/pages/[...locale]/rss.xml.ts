/* global URL */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { SITE } from '~/config';
import { getPosts, postPath } from '~/utils/posts';

export const GET: APIRoute = async (context) => {
  const { locale } = context.props;
  // BCP 47 language tag for <language>: 'en' → 'en-us', 'zh-tw' → 'zh-tw'.
  const langTag = locale === 'en' ? 'en-us' : locale;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const siteOrigin = (context.site ?? new URL(SITE.url)).origin;
  const siteWithBase = `${siteOrigin}${base}`;

  if (import.meta.env.CI_SKIP_RSS_SITEMAP === 'true') {
    return rss({
      title: SITE.title,
      description: SITE.description,
      site: siteWithBase,
      items: [],
      customData: `<language>${langTag}</language>`,
    });
  }

  const posts = await getPosts(locale);
  const container = await AstroContainer.create();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const rawHtml = await container.renderToString(Content);
      const absoluteHtml = rewriteUrlsToAbsolute(rawHtml, siteOrigin);
      const cleanHtml = sanitizeHtml(absoluteHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          'img',
          'figure',
          'figcaption',
          'picture',
          'source',
          'video',
          'audio',
          'iframe',
          'h1',
          'h2',
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          '*': ['id', 'class', 'style'],
          img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding', 'srcset'],
          source: ['src', 'srcset', 'type', 'media'],
          iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
          a: ['href', 'name', 'target', 'rel'],
        },
      });
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: postPath(post),
        categories: [...post.data.tags, ...post.data.categories],
        content: cleanHtml,
      };
    }),
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: siteWithBase,
    items,
    customData: `<language>${langTag}</language>`,
  });
};

/** Rewrite root-relative URLs (src/href starting with `/`) to absolute. */
function rewriteUrlsToAbsolute(html: string, origin: string): string {
  return html.replace(
    /\b(src|href|srcset)\s*=\s*(["'])((?:[^"']|\\["'])*)\2/gi,
    (_match, attr, quote, value) => {
      const rewritten =
        attr.toLowerCase() === 'srcset'
          ? value
              .split(',')
              .map((part: string) => {
                const trimmed = part.trim();
                const [url, ...rest] = trimmed.split(/\s+/);
                return `${absolutize(url, origin)}${rest.length ? ' ' + rest.join(' ') : ''}`;
              })
              .join(', ')
          : absolutize(value, origin);
      return `${attr}=${quote}${rewritten}${quote}`;
    },
  );
}

function absolutize(url: string, origin: string): string {
  if (!url) return url;
  if (url.startsWith('/') && !url.startsWith('//')) return `${origin}${url}`;
  return url;
}

export function getStaticPaths() {
  return SITE.locales.map((l) => ({
    params: { locale: l === SITE.defaultLocale ? undefined : l },
    props: { locale: l },
  }));
}
