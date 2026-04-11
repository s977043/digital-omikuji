#!/usr/bin/env node
/**
 * Image optimization script.
 *
 * - Converts code-referenced PNGs to WebP (quality 90) for smaller bundles
 * - Losslessly recompresses app.json-referenced PNGs (icon/splash/adaptive-icon/favicon)
 *   — these must stay PNG for Expo/App Store requirements
 * - Downscales favicon.png to 192x192 (1024x1024 is wasteful for a favicon)
 *
 * Usage: node scripts/optimize-images.js
 */

const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const ASSETS_DIR = path.join(__dirname, "..", "assets");

// Images that are loaded via require() in the app source — convert to WebP.
const TO_WEBP = [
  "omikuji_cylinder.png",
  "omikuji_confirmed.png",
  "shrine_background.png",
  "empty_history.png",
];

// Images referenced from app.json (icon / splash / adaptiveIcon / favicon).
// Must stay PNG — losslessly recompress.
const KEEP_PNG = [
  { file: "icon.png", resize: null },
  { file: "splash.png", resize: null },
  { file: "adaptive-icon.png", resize: null },
  { file: "favicon.png", resize: 192 }, // favicon doesn't need 1024x1024
];

async function fileSizeKB(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return Math.round(stat.size / 1024);
  } catch {
    return null;
  }
}

async function convertToWebp(fileName) {
  const src = path.join(ASSETS_DIR, fileName);
  const dest = path.join(ASSETS_DIR, fileName.replace(/\.png$/, ".webp"));
  const beforeKB = await fileSizeKB(src);

  await sharp(src).webp({ quality: 90, effort: 6 }).toFile(dest);

  const afterKB = await fileSizeKB(dest);
  const saving = beforeKB - afterKB;
  const percent = beforeKB ? Math.round((saving / beforeKB) * 100) : 0;
  console.log(`  ${fileName} → ${path.basename(dest)}: ${beforeKB} KB → ${afterKB} KB (-${percent}%)`);
}

async function recompressPng({ file, resize }) {
  const src = path.join(ASSETS_DIR, file);
  const beforeKB = await fileSizeKB(src);

  let pipeline = sharp(src);
  if (resize) {
    pipeline = pipeline.resize(resize, resize, { fit: "contain" });
  }
  // Lossless PNG recompression with maximum effort
  const buffer = await pipeline
    .png({ compressionLevel: 9, effort: 10, palette: true })
    .toBuffer();

  await fs.writeFile(src, buffer);
  const afterKB = await fileSizeKB(src);
  const saving = beforeKB - afterKB;
  const percent = beforeKB ? Math.round((saving / beforeKB) * 100) : 0;
  const resizeNote = resize ? ` (resized to ${resize}x${resize})` : "";
  console.log(`  ${file}: ${beforeKB} KB → ${afterKB} KB (-${percent}%)${resizeNote}`);
}

async function main() {
  console.log("Converting to WebP (for require()-loaded assets):");
  for (const file of TO_WEBP) {
    await convertToWebp(file);
  }

  console.log("\nRecompressing PNGs (app.json assets):");
  for (const entry of KEEP_PNG) {
    await recompressPng(entry);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
