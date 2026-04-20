#!/usr/bin/env node
/**
 * Image optimization script.
 *
 * - Converts code-referenced PNGs to WebP (quality 90) for smaller bundles.
 * - Losslessly recompresses Expo config-referenced PNGs.
 *   These must stay PNG because Expo/App Store requires PNG for splash, icon,
 *   adaptiveIcon, and web favicon. See app.config.ts for the actual references.
 *
 * IMPORTANT:
 * The KEEP_PNG list must mirror the image references in `app.config.ts` and
 * `app.json`. At the time of writing, `app.config.ts` splash uses
 * `shrine_background.png`, and adaptiveIcon/web.favicon use `icon.png`.
 * Update this list whenever the config changes.
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

// Images referenced from Expo config (app.config.ts / app.json).
// Must stay PNG because Expo/stores require PNG for these slots.
// Keep this list in sync with the config files.
const KEEP_PNG = [
  // app.config.ts: icon / adaptiveIcon.foregroundImage / web.favicon
  { file: "icon.png", resize: null },
  // app.config.ts: splash.image (uses shrine_background.png — keep both PNG+WebP;
  // PNG for the native splash, WebP for in-app ImageBackground runtime use)
  { file: "shrine_background.png", resize: null },
  // app.json: splash, adaptiveIcon fallback (unused by app.config.ts override but
  // referenced in app.json for bookkeeping)
  { file: "splash.png", resize: null },
  { file: "adaptive-icon.png", resize: null },
  { file: "favicon.png", resize: 192 },
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

  // Idempotent: if the source PNG is gone but the WebP exists, it's already optimized.
  if (beforeKB === null) {
    const existingKB = await fileSizeKB(dest);
    if (existingKB !== null) {
      console.log(`  ${fileName} → ${path.basename(dest)}: already optimized (${existingKB} KB)`);
      return;
    }
    throw new Error(`Input file is missing: ${src}`);
  }

  await sharp(src).webp({ quality: 90, effort: 6 }).toFile(dest);

  const afterKB = await fileSizeKB(dest);
  const saving = beforeKB - afterKB;
  const percent = beforeKB ? Math.round((saving / beforeKB) * 100) : 0;
  console.log(
    `  ${fileName} → ${path.basename(dest)}: ${beforeKB} KB → ${afterKB} KB (-${percent}%)`
  );
}

async function recompressPng({ file, resize }) {
  const src = path.join(ASSETS_DIR, file);
  const beforeKB = await fileSizeKB(src);

  let pipeline = sharp(src);
  if (resize) {
    pipeline = pipeline.resize(resize, resize, { fit: "contain" });
  }
  // Lossless PNG recompression with maximum effort.
  // Intentionally avoids `palette: true` because palette quantization is lossy
  // for photographic images (shrine_background, splash, etc.) and can degrade
  // subtle gradients. compressionLevel:9 + effort:10 gives the best lossless
  // result.
  const buffer = await pipeline.png({ compressionLevel: 9, effort: 10 }).toBuffer();

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
