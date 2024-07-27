import { expect, test, describe } from "bun:test";
import fs from "fs";
import path from "path";

const rootDir: string = path.join(__dirname, "../");

describe("Newsletters", () => {
  const srcDir = path.join(rootDir, "/src/content/newsletters");
  const distDir = path.join(rootDir, "/dist/newsletter");

  const mdFiles = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith(".mdx"));

  test("Draft pages should be excluded in build", () => {
    mdFiles.forEach((file) => {
      const filePath = path.join(srcDir, file);
      const htmlFile = file.replace(".mdx", "/index.html");
      const htmlFilePath = path.join(distDir, htmlFile);

      const fileContent = fs.readFileSync(filePath, "utf-8");
      if (fileContent.includes("draft: true")) {
        expect(fs.existsSync(htmlFilePath)).toBe(false);
      } else {
        expect(fs.existsSync(htmlFilePath)).toBe(true);
      }
    });
  });

  test("Newsletters should include title and description metadata", () => {
    mdFiles.forEach((file) => {
      const filePath = path.join(srcDir, file);
      const htmlFile = file.replace(".mdx", "/index.html");
      const htmlFilePath = path.join(distDir, htmlFile);

      const mdFileContent = fs.readFileSync(filePath, "utf-8");
      if (!mdFileContent.includes("draft: true")) {
        const htmlFileContent = fs.readFileSync(htmlFilePath, "utf-8");
        const expectedTitle =
          mdFileContent.match(/^title:\s*(.*)$/m)?.[1] + " - Ladybird";
        const expectedDescription = mdFileContent.match(
          /^description:\s*(.*)$/m
        )?.[1];

        const metaTitle = `<meta property="og:title" content="${expectedTitle}">`;
        const metaDescription = `<meta property="og:description" content="${expectedDescription}">`;

        expect(htmlFileContent).toContain(metaTitle);
        expect(htmlFileContent).toContain(metaDescription);
      }
    });
  });
});
