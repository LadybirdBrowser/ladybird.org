import fs from "fs";
import path from "path";
import { test, expect, describe } from "bun:test";

const srcDir: string = path.join(__dirname, "../src");

describe("URL Compliance", () => {
  // Handled over raw asset instead of href= or src= due to tailwind bg image embedding
  test('All instances of "assets/" have a proceeding "/"', () => {
    const files = (
      fs.readdirSync(srcDir, { recursive: true }) as string[]
    ).filter(
      (file) =>
        file.endsWith(".mdx") || file.endsWith(".ts") || file.endsWith(".astro")
    );
    files.forEach((file) => {
      const content = fs.readFileSync(path.join(srcDir, file), "utf-8");
      const base = content.match(/assets\//g);
      const proper = content.match(/\/assets\//g);
      expect(base?.length ?? 0).toBe(proper?.length ?? 0);
    });
  });

  test("Only allow secure outside URLs, properly declared locals, and mailto:", () => {
    const files = (
      fs.readdirSync(srcDir, { recursive: true }) as string[]
    ).filter(
      (file) =>
        file.endsWith(".mdx") || file.endsWith(".ts") || file.endsWith(".astro")
    );
    files.forEach((file) => {
      const content = fs.readFileSync(path.join(srcDir, file), "utf-8");
      const hrefs = content.match(/href="([^"]*)"/g) || [];
      // Only allow secure outside URLs, properly declared locals, and mailto:
      hrefs.forEach((href) => {
        expect(
          href.startsWith('href="https://') ||
            href.startsWith('href="/') ||
            href.startsWith('href="mailto:')
        ).toBe(true);
      });
    });
  });
});
