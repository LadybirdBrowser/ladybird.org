import { test, expect, describe } from "bun:test";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";

const rootDir: string = path.join(__dirname, "../");

describe("RSS Feeds", () => {
  const srcDir = path.join(rootDir, "/src/content/posts");
  const distDir = path.join(rootDir, "/dist/");

  const mdFiles = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith(".mdx"));
  const xmlFile = fs.readFileSync(path.join(distDir, "posts.rss"));

  const parser = new XMLParser();
  const parsedXML = parser.parse(xmlFile);

  test("RSS Channel includes overall metadata", () => {
    expect(parsedXML.rss.channel).toEqual(
      expect.objectContaining({
        title: "Ladybird Browser Posts",
        description: "Ladybird is a brand-new browser &amp; web engine",
        link: "https://ladybird.org",
      })
    );
  });

  test("XML should contain entries for every non-hidden post", async () => {
    const nonHiddenMdFiles = mdFiles.filter((file) => {
      const filePath = path.join(srcDir, file);
      const fileContent = fs.readFileSync(filePath);
      return !fileContent.includes("type: Hidden");
    });
    expect(parsedXML.rss.channel.item).toBeArrayOfSize(nonHiddenMdFiles.length);
    parsedXML.rss.channel.item.forEach((item: any) => {
      const itemAttributes = Object.keys(item);
      expect(itemAttributes).toEqual(
        expect.arrayContaining([
          "title",
          "link",
          "description",
          "pubDate",
          "author",
          "category",
        ])
      );
    });
  });
});
