import { expect, test, describe } from "bun:test";
import fs from "fs";
import path from "path";

const rootDir: string = path.join(__dirname, "../");

describe("Markdown Rendering", () => {
  const srcDir = path.join(rootDir, "/src/content/posts");
  const distDir = path.join(rootDir, "/dist/posts");

  const mdFiles = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith(".mdx"));

  test("Content Detected", () => {
    expect(mdFiles.length).toBeGreaterThan(0);
  });

  test("Pages Rendered", () => {
    mdFiles.forEach((file) => {
      const htmlFile = file.replace(".mdx", "/index.html");
      const htmlFilePath = path.join(distDir, htmlFile);
      expect(fs.existsSync(htmlFilePath)).toBe(true);
    });
  });

  test("Layouts Applied", () => {
    mdFiles.forEach((file) => {
      const htmlFile = file.replace(".mdx", "/index.html");
      const htmlFilePath = path.join(distDir, htmlFile);
      const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
      const fileContent = fs.readFileSync(path.join(srcDir, file), "utf-8");
      const frontMatterMatch = fileContent.match(/^title:\s*(.*)$/m);
      const frontMatterTitle = frontMatterMatch
        ? frontMatterMatch[1]
        : file.replace(".mdx", "");
      const h1Tag = `>${frontMatterTitle}</h1>`;

      expect(htmlContent.includes(h1Tag)).toBe(true);
    });
  });
});
