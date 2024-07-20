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

  test("Draft pages should be excluded in build", async () => {
    mdFiles.forEach((file) => {
      const filePath = path.join(srcDir, file);
      const htmlFile = file.replace(".mdx", "/index.html");
      const htmlFilePath = path.join(distDir, htmlFile);

      const fileContent = fs.readFileSync(filePath);
      if (fileContent.toString().includes("draft: true")) {
        expect(fs.existsSync(htmlFilePath)).toBe(false);
      } else {
        expect(fs.existsSync(htmlFilePath)).toBe(true);
      }
    });
  });
});
