#!/usr/bin/env node
/**
 * Generates every brand raster from source, so the assets are reproducible
 * instead of being undocumented binaries nobody can regenerate.
 *
 * The palette and type here are the same tokens the site uses (src/index.css):
 * paper #FAF7F2, ink #1B1917, rust #A33B12, Charter for display, system mono
 * for labels. If the theme changes, change it here and re-run.
 *
 * Usage: node scripts/generate_brand_assets.mjs
 *
 * Note: rendering uses the local system's serif (Charter/Georgia). Regenerating
 * on a machine without those fonts will shift the letterforms, which is why the
 * outputs are committed rather than built in CI.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = (f) => resolve(root, "public", f);

const PAPER = "#FAF7F2";
const INK = "#1B1917";
const RUST = "#A33B12";
const RULE = "#E4DED3";

const SERIF = `Charter, "Bitstream Charter", "Iowan Old Style", "Source Serif 4", Georgia, serif`;
const MONO = `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`;
const SANS = `ui-sans-serif, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

/**
 * The mark: a full-bleed rust field with a paper monogram.
 *
 * Full-bleed matters twice over. A favicon sits on unknown browser chrome, so a
 * solid field keeps it identifiable even when the letters are too small to
 * read; and Android maskable icons crop to a circle, so anything transparent or
 * edge-aligned gets destroyed. Letters stay inside the central 80% safe zone.
 *
 * No decorative rule under the monogram: it was illegible noise at 16px and
 * stole the vertical space the letters needed. Checked at 16/24/32/48px on both
 * light and dark browser chrome.
 */
const markSvg = (size, { radius = 0 } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${radius}" fill="${RUST}"/>
  <text x="50" y="52" fill="${PAPER}" font-family='${SERIF}' font-size="58"
        font-weight="700" letter-spacing="-2.5" text-anchor="middle"
        dominant-baseline="central">MS</text>
</svg>`;

const portraitDataUri = () =>
  `data:image/webp;base64,${readFileSync(resolve(root, "public/me.webp")).toString("base64")}`;

/** Social card. Deliberately the same layout language as the hero: left-aligned
 *  serif name, mono eyebrow in rust, hairline rule, facts in mono. */
const ogHtml = () => `
<!doctype html><meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:${PAPER}; color:${INK};
         font-family:${SERIF}; }
  /* Fixed track widths rather than flex guesswork: the name is the widest
     element on the card and was pushing the portrait and URL off-canvas. */
  .wrap { width:1200px; height:630px; padding:70px 76px;
          display:grid; grid-template-rows:1fr auto; }
  /* Centred in its track so the leftover space sits above and below the
     block rather than pooling into a dead band before the rule. */
  .top { display:grid; grid-template-columns:1fr 246px; column-gap:56px;
         align-items:center; align-self:center; }
  .eyebrow { font-family:${MONO}; font-size:18px; letter-spacing:.2em;
             text-transform:uppercase; color:${RUST}; }
  h1 { font-size:86px; line-height:1.0; letter-spacing:-.03em; margin-top:20px;
       font-weight:600; white-space:nowrap; }
  .lede { font-family:${SANS}; font-size:25px; line-height:1.5; color:#5C554B;
          margin-top:26px; max-width:20ch; }
  .portrait { width:246px; height:308px; object-fit:cover; object-position:top;
              filter:grayscale(1); border:1px solid ${RULE}; display:block; }
  .rule { height:1px; background:${RULE}; margin-bottom:24px; }
  .bottom { display:grid; grid-template-columns:1fr auto; align-items:end; column-gap:40px; }
  .facts { display:flex; gap:52px; font-family:${MONO}; font-size:16px; }
  .facts b { display:block; font-weight:400; color:#6E6659; font-size:12px;
             letter-spacing:.16em; text-transform:uppercase; margin-bottom:8px; }
  .url { font-family:${MONO}; font-size:16px; color:${RUST}; white-space:nowrap; }
</style>
<div class="wrap">
  <div class="top">
    <div>
      <div class="eyebrow">Full Stack Engineer</div>
      <h1>Mohamed&nbsp;Samy</h1>
      <div class="lede">I build web systems and keep them running.</div>
    </div>
    <img class="portrait" src="${portraitDataUri()}" alt="">
  </div>
  <div>
    <div class="rule"></div>
    <div class="bottom">
      <div class="facts">
        <div><b>Experience</b>5+ years</div>
        <div><b>Stack</b>React · NestJS · Docker</div>
        <div><b>Based in</b>Riyadh</div>
      </div>
      <div class="url">mohamedsamy911.github.io</div>
    </div>
  </div>
</div>`;

/**
 * The hero portrait, cut to the size it is actually displayed at.
 *
 * The source is 1280x1055 (1.35 megapixels) rendered into a 224x280 slot. On a
 * mid-range phone that decode was the measured LCP element at ~5s. Emitting it
 * at 2x display size drops it to ~0.25MP, and the grayscale is baked in so the
 * browser is not filtering a large bitmap on every paint.
 */
async function heroPortrait(browser) {
  const W = 448;
  const H = 560;
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(
    `<img id="src" src="${portraitDataUri()}"><canvas id="c" width="${W}" height="${H}"></canvas>`
  );
  await page.waitForFunction(() => document.getElementById("src")?.complete);

  const dataUrl = await page.evaluate(
    ({ W, H }) => {
      const img = document.getElementById("src");
      const c = document.getElementById("c");
      const ctx = c.getContext("2d");
      // Reproduce `object-fit: cover; object-position: top` from the markup.
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.filter = "grayscale(1)";
      ctx.drawImage(img, (W - dw) / 2, 0, dw, dh);
      return c.toDataURL("image/webp", 0.86);
    },
    { W, H }
  );
  await page.close();

  writeFileSync(out("me-hero.webp"), Buffer.from(dataUrl.split(",")[1], "base64"));
  return "me-hero.webp";
}

const browser = await chromium.launch();

async function shoot(html, width, height, file) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out(file), omitBackground: false });
  await page.close();
  return file;
}

const wrapSvg = (svg, size) =>
  `<!doctype html><meta charset="utf-8"><style>*{margin:0;padding:0}
   body{width:${size}px;height:${size}px;overflow:hidden}</style>${svg}`;

// Scalable favicon: modern browsers prefer it and it never pixelates.
writeFileSync(out("favicon.svg"), markSvg(64, { radius: 14 }).trim() + "\n");

const made = [
  // PNG fallback for browsers without SVG favicon support (Safari < 16).
  await shoot(wrapSvg(markSvg(32, { radius: 6 }), 32), 32, 32, "favicon-32.png"),
  // iOS applies its own rounding, so ship square and opaque at exactly 180.
  await shoot(wrapSvg(markSvg(180), 180), 180, 180, "apple-touch-icon.png"),
  // Android maskable: full bleed, content inside the safe zone.
  await shoot(wrapSvg(markSvg(192), 192), 192, 192, "icon-192.png"),
  await shoot(wrapSvg(markSvg(512), 512), 512, 512, "icon-512.png"),
  await shoot(ogHtml(), 1200, 630, "og-image.png"),
  await heroPortrait(browser),
];

await browser.close();

const { statSync } = await import("node:fs");
console.log("Generated:");
for (const f of ["favicon.svg", ...made]) {
  console.log(`  ${f.padEnd(24)} ${(statSync(out(f)).size / 1024).toFixed(1).padStart(7)} KB`);
}
