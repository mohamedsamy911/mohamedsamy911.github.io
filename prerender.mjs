// Postbuild prerender: render the built SPA in a headless browser and write the
// fully-rendered HTML back to dist/index.html so crawlers / social / AI bots
// (which don't run JS) and first paint get real content. The client bundle
// still boots normally on load (CSR), replacing this snapshot.
import { preview } from "vite";
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const server = await preview({ preview: { port: 4183 } });
const url = server.resolvedUrls.local[0];

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  // Wait for the last section to exist -> the whole App tree has rendered.
  await page.waitForSelector("#contact", { timeout: 20000 });
  await page.waitForTimeout(600); // let JSON-LD / late children settle
  const html =
    "<!doctype html>\n" +
    (await page.evaluate(() => document.documentElement.outerHTML));
  await writeFile("dist/index.html", html, "utf8");
  console.log("✓ prerendered dist/index.html (" + html.length + " bytes)");
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
