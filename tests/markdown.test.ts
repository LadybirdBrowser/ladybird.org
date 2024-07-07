import { expect, test, describe } from "bun:test";
import fs from "fs";
import path from "path";

const rootDir: string = path.join(__dirname, "../");

describe("Markdown Rendering", () => {
  const srcDir = path.join(rootDir, "/src/pages");
  const distDir = path.join(rootDir, "/dist");

  const mdFiles = fs.readdirSync(srcDir).filter((file) => file.endsWith(".md"));
  //<h1>{frontmatter.title}</h1>
  test("Pages Exist", () => {
    mdFiles.forEach((file) => {
      const htmlFile = file.replace(".md", ".html");
      const htmlFilePath = path.join(distDir, htmlFile);
      expect(fs.existsSync(htmlFilePath)).toBe(true);
    });
  });

  test("Layouts Applied", () => {
    mdFiles.forEach((file) => {
      const htmlFile = file.replace(".md", "/index.html");
      const htmlFilePath = path.join(distDir, htmlFile);
      const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
      const fileContent = fs.readFileSync(path.join(srcDir, file), "utf-8");
      const frontMatterMatch = fileContent.match(/^title:\s*(.*)$/m);
      const frontMatterTitle = frontMatterMatch
        ? frontMatterMatch[1]
        : file.replace(".md", "");
      const h1Tag = `<h1>${frontMatterTitle}</h1>`;

      expect(htmlContent.includes(h1Tag)).toBe(true);
    });
  });
});
