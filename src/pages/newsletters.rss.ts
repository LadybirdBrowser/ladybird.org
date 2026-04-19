import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("newsletters");
  return rss({
    title: "Ladybird Browser Newsletters",
    description: "Ladybird is a brand-new browser &amp; web engine",
    site: context.site!,
    items: posts
      .filter((newsletter) => !newsletter.data.draft)
      .map((newsletter) => ({
        title: newsletter.data.title,
        description: newsletter.data.description,
        pubDate: newsletter.data.date,
        link: `/newsletter/${newsletter.slug}`,
      })),
    trailingSlash: false,
  });
}
