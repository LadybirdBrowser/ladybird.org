import { test, expect, describe } from "bun:test";
import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";
import path from "node:path";

const rootDir: string = path.join(__dirname, "../");

describe("RSS Feeds", () => {
  const postsDir = path.join(rootDir, "/src/content/posts");
  const newslettersDir = path.join(rootDir, "/src/content/newsletters");
  const distDir = path.join(rootDir, "/dist/");

  const postFiles = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".mdx"));
  const newsletterFiles = fs
    .readdirSync(newslettersDir)
    .filter((file) => file.endsWith(".mdx"));
  const xmlFile = fs.readFileSync(path.join(distDir, "feed.rss"));

  const parser = new XMLParser();
  const parsedXML = parser.parse(xmlFile);

  test("RSS Channel includes overall metadata", () => {
    expect(parsedXML.rss.channel).toEqual(
      expect.objectContaining({
        title: "Ladybird Browser",
        description: "Ladybird is a brand-new browser &amp; web engine",
        link: "https://ladybird.org",
      })
    );
  });

  test("XML should contain entries for every non-hidden post and non-draft newsletter", async () => {
    const nonHiddenPosts = postFiles.filter((file) => {
      const filePath = path.join(postsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return !fileContent.includes("type: Hidden");
    });

    const nonDraftNewsletters = newsletterFiles.filter((file) => {
      const filePath = path.join(newslettersDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return !fileContent.includes("draft: true");
    });

    const expectedItemCount =
      nonHiddenPosts.length + nonDraftNewsletters.length;
    expect(parsedXML.rss.channel.item).toBeArrayOfSize(expectedItemCount);

    for (const item of parsedXML.rss.channel.item) {
      const itemAttributes = Object.keys(item);

      // All items should have these core attributes
      expect(itemAttributes).toEqual(
        expect.arrayContaining(["title", "link", "guid", "pubDate"])
      );

      // Posts should have additional attributes that newsletters don't have
      if (item.link.includes("/posts/")) {
        expect(itemAttributes).toEqual(
          expect.arrayContaining(["description", "category", "author"])
        );
      }
    }
  });
});
