import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");
  const newsletters = await getCollection("newsletters", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
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
  const newsletterItems = newsletters.map((newsletter) => ({
    title: newsletter.data.title,
    description: newsletter.data.description,
    author: "Ladybird",
    pubDate: newsletter.data.date,
    categories: ["Newsletter"],
    link: `/newsletter/${newsletter.data.date.toISOString().split("T")[0]}`,
  }));
  return rss({
    title: "Ladybird Browser Posts",
    description: "Ladybird is a brand-new browser &amp; web engine",
    site: context.site!,
    items: [...postItems, ...newsletterItems],
    trailingSlash: false,
  });
}
