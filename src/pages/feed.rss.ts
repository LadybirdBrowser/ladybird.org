import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const newsletters = await getCollection("newsletters");
  const posts = await getCollection("posts");

  const newsletterItems = newsletters
    .filter((post) => post.data.draft === false)
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/newsletter/${post.slug}`,
    }));

  const postItems = posts
    .filter((post) => post.data.type !== "Hidden")
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      author: post.data.author,
      pubDate: post.data.date,
      categories: [post.data.type],
      link: `/posts/${post.slug}`,
    }));

  const allItems = [...newsletterItems, ...postItems].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return rss({
    title: "Ladybird Browser",
    description: "Ladybird is a brand-new browser &amp; web engine",
    site: context.site ?? "https://ladybird.org",
    items: allItems,
    trailingSlash: false,
  });
}
