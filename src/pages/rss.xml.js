import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
		items: posts.map((post) => ({
			...post.data,
			link: `/posts/${post.id}/`,
			customData: `<dc:creator>${SITE_AUTHOR}</dc:creator>`,
		})),
	});
}
