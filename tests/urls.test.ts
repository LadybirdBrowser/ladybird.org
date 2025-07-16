import fs from "fs";
import path from "path";
import { test, expect, describe } from "bun:test";
import { Glob } from "bun";

const srcDir: string = path.join(import.meta.dirname, "../src");

describe("URL Compliance", () => {
  // Handled over raw asset instead of href= or src= due to tailwind bg image embedding
  const files = Array.from(new Glob("**/*.{md,ts,astro}").scanSync(srcDir));

  test('All instances of "assets/" have a proceeding "/"', () => {
    files.forEach((file) => {
      const content = fs.readFileSync(path.join(srcDir, file), "utf-8");
      const base = content.match(/assets\//g);
      const proper = content.match(/\/assets\//g);
      expect(base?.length ?? 0).toBe(proper?.length ?? 0);
    });
  });

  test("Only allow secure outside URLs, properly declared locals, and mailto:", () => {
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
