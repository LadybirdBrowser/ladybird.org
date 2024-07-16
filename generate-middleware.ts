/**
 * This exists to handle the .html route extensions on announcement
 * and why-ladybird, in links added to news sites and videos, as
 * github pages does not support true middleware, This is a temporary
 * patch, do not touch.
 */

import fs from "fs";
import path from "path";
import { dim, blue } from "kleur/colors";

function time() {
  return dim(new Date().toTimeString().slice(0, 8));
}

const srcDir = path.join(__dirname, "src/content/posts");
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
      const htmlContent = `<meta charset="utf-8"/>
<title>Redirecting to https://ladybird.org/posts/${fileNameWithoutExt}/</title>
<meta http-equiv="refresh" content="0; URL=http://ladybird.org/posts/${fileNameWithoutExt}/"/>
<link rel="canonical" href="http://ladybird.org/posts/${fileNameWithoutExt}/"/>`;
      for (const distFilePath of [
        path.join(distDir, fileNameWithoutExt),
        path.join(distDir, `${fileNameWithoutExt}.html`),
      ]) {
        fs.writeFile(distFilePath, htmlContent, (err) => {
          if (err) {
            console.error(`Error writing file ${distFilePath}:`, err);
          } else {
            console.log(
              `${time()} ${blue("[middleware]")} ${dim(`generated ${distFilePath.replace(__dirname, "")}`)}`
            );
          }
        });
      }
    }
  });
});
