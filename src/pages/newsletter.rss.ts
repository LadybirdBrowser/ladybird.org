import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const newsletters = await getCollection("newsletters");
  return rss({
    title: "Ladybird Browser Newsletter",
    description: "Ladybird is a brand-new browser &amp; web engine",
    site: context.site!,
    items: newsletters
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
