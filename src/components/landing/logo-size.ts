import fs from "node:fs";
import path from "node:path";

// Sponsor logos come in very different shapes. Giving them all the same height
// makes wide logos look tiny and compact ones look huge, so instead we size
// each logo to cover roughly the same area, within limits.
const minHeight = 0.6;
const maxHeight = 1.45;

function aspectRatio(src: string): number {
  const file = path.join(process.cwd(), "public", src);
  if (src.endsWith(".svg")) {
    const svg = fs.readFileSync(file, "utf-8");
    const viewBox = svg.match(/<svg\b[^>]*\sviewBox="([^"]+)"/)?.[1];
    if (!viewBox) throw new Error(`Sponsor logo ${src} has no viewBox`);
    const [, , width, height] = viewBox.split(/[\s,]+/).map(Number);
    return width / height;
  }
  if (src.endsWith(".png")) {
    const png = fs.readFileSync(file);
    return png.readUInt32BE(16) / png.readUInt32BE(20);
  }
  throw new Error(`Sponsor logo ${src} must be an SVG or PNG`);
}

// Returns the logo's width as a multiple of the base logo height.
export function logoWidth(src: string): number {
  const aspect = aspectRatio(src);
  const height = Math.min(
    maxHeight,
    Math.max(minHeight, 2 / Math.sqrt(aspect))
  );
  return Math.round(height * aspect * 1000) / 1000;
}
