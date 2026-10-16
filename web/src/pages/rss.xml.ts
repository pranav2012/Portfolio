import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, getSite } from '../lib/content';

export async function GET(context: APIContext) {
    const [site, posts] = await Promise.all([getSite(), getPosts()]);
    return rss({
        title: site.title,
        description: site.description ?? '',
        site: context.site!,
        items: posts.map(post => ({
            title: post.title,
            pubDate: new Date(post.publishedAt),
            description: post.excerpt ?? undefined,
            link: `/blog/${post.slug}`
        }))
    });
}
