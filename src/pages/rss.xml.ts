import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';

export async function GET(context: APIContext) {
  const modules = import.meta.glob('../content/blog/*.md', { eager: true });
  const items = Object.entries(modules)
    .map(([path, mod]: [string, any]) => ({
      title: mod.frontmatter.title,
      description: mod.frontmatter.description,
      pubDate: new Date(mod.frontmatter.date),
      link: `/blog/${path.split('/').pop()!.replace('.md', '')}/`,
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: '<language>ja</language>',
  });
}
