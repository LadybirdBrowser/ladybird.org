import { expect, test, describe } from "bun:test";
import fs from "fs";
import path from "path";
import { Glob } from "bun";

const rootDir: string = path.join(import.meta.dirname, "../");

describe("Newsletters", () => {
  const srcDir = path.join(rootDir, "/src/content/newsletters");
  const distDir = path.join(rootDir, "/dist/newsletter");

  const mdFiles = Array.from(new Glob("**/*.md").scanSync(srcDir));

  test("Draft pages should be excluded in build", async () => {
    mdFiles.forEach((file) => {
      const filePath = path.join(srcDir, file);
      const htmlFile = file.replace(".md", "/index.html");
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
