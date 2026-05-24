/* global URL */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '~/config';
import { getPosts, postPath } from '~/utils/posts';

export const GET: APIRoute = async (context) => {
  const { locale } = context.props;
  // BCP 47 language tag for <language>: 'en' → 'en-us', 'zh-tw' → 'zh-tw'.
  const langTag = locale === 'en' ? 'en-us' : locale;
  if (import.meta.env.CI_SKIP_RSS_SITEMAP === 'true') {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const siteWithBase = `${(context.site ?? new URL(SITE.url)).origin}${base}`;
    return rss({
      title: SITE.title,
      description: SITE.description,
      site: siteWithBase,
      items: [],
      customData: `<language>${langTag}</language>`,
    });
  }

  const posts = await getPosts(locale);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const siteWithBase = `${(context.site ?? new URL(SITE.url)).origin}${base}`;
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: siteWithBase,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: postPath(post),
      categories: [...post.data.tags, ...post.data.categories],
    })),
    customData: `<language>${langTag}</language>`,
  });
};

export function getStaticPaths() {
  return SITE.locales.map((l) => ({
    params: { locale: l === SITE.defaultLocale ? undefined : l },
    props: { locale: l },
  }));
}
