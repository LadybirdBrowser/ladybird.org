import { expect, test, describe } from "bun:test";
import fs from "fs";
import path from "path";

const rootDir: string = path.join(__dirname, "../");

describe("Middleware Compilation", () => {
  const srcDir = path.join(rootDir, "/src/pages");
  const distDir = path.join(rootDir, "/dist");

  const mdFiles = fs.readdirSync(srcDir).filter((file) => file.endsWith(".md"));

  test("HTML Redirects Exist", () => {
    mdFiles.forEach((file) => {
      const htmlFile = file.replace(".md", ".html");
      const htmlFilePath = path.join(distDir, htmlFile);
      expect(fs.existsSync(htmlFilePath)).toBe(true);
    });
  });

  test("Redirects Work", () => {
    mdFiles.forEach((file) => {
      const htmlFile = file.replace(".md", ".html");
      const htmlFilePath = path.join(distDir, htmlFile);
      const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
      const metaTag = `<meta http-equiv="refresh" content="0; URL=http://ladybird.org/${file.replace(".md", "")}/"/>`;
      const linkTag = `<link rel="canonical" href="http://ladybird.org/${file.replace(".md", "")}/"/>`;

      expect(htmlContent.includes(metaTag)).toBe(true);
      expect(htmlContent.includes(linkTag)).toBe(true);
    });
  });
});
