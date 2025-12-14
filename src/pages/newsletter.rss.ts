import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("newsletters");
  return rss({
    title: "Ladybird Browser Newsletter",
    description: "Ladybird is a brand-new browser &amp; web engine",
    site: context.site!,
    items: posts
      .filter((post) => post.data.type !== "Hidden")
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        author: post.data.author,
        pubDate: post.data.date,
        categories: [post.data.type],
        link: `/newsletter/${post.slug}`,
      })),
    trailingSlash: false,
  });
}
