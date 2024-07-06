/**
 * This exists to handle the .html route extensions on announcement
 * and why-ladybird, in links added to news sites and videos, as
 * github pages does not support true middleware, This is a temporary
 * patch, do not touch.
 */

import fs from "fs";
import path from "path";

const srcDir = path.join(__dirname, "src/pages");
const distDir = path.join(__dirname, "dist");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.readdir(srcDir, (err, files) => {
  if (err) {
    console.error("Error reading src/pages directory:", err);
    return;
  }

  files.forEach((file) => {
    if (!file.startsWith("index.")) {
      const fileNameWithoutExt = path.parse(file).name;
      const htmlContent = `<meta charset="utf-8" />
<title>Redirecting to https://ladybird.org/${fileNameWithoutExt}/</title>
<meta
  http-equiv="refresh"
  content="0; URL=http://ladybird.org/${fileNameWithoutExt}/"
/>
<link rel="canonical" href="http://ladybird.org/${fileNameWithoutExt}/" />`;
      const distFilePath = path.join(distDir, `${fileNameWithoutExt}.html`);

      fs.writeFile(distFilePath, htmlContent, (err) => {
        if (err) {
          console.error(`Error writing file ${distFilePath}:`, err);
        } else {
          console.log(`Generated ${distFilePath}`);
        }
      });
    }
  });
});
