// Postbuild prerender: render the built SPA in a headless browser and write the
// fully-rendered HTML back to dist/index.html so crawlers / social / AI bots
// (which don't run JS) and first paint get real content. The client bundle
// still boots normally on load (CSR), replacing this snapshot.
//
// The browser is a build-time dependency the host has to provide. GitHub
// Actions installs it explicitly; Cloudflare Pages does not, which is why the
// launch below is guarded: shipping a working SPA without the snapshot beats
// failing the whole deploy. See README, "Deployment".
import { preview } from "vite";
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const server = await preview({ preview: { port: 4183 } });
const url = server.resolvedUrls.local[0];
const closeServer = () =>
  new Promise((resolve) => server.httpServer.close(resolve));

let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  await closeServer();
  const missing = /Executable doesn't exist/i.test(String(error?.message));
  if (!missing) throw error;

  console.warn(
    [
      "",
      "WARNING: prerender skipped, no headless browser on this build host.",
      "",
      "  dist/ is a working SPA, but the static HTML no longer contains the",
      "  rendered page. Crawlers and social scrapers that do not run JavaScript",
      "  will see an empty shell.",
      "",
      "  Fix by installing the browser before the build, e.g. set the build",
      "  command to:",
      "",
      "    npx playwright install chromium --only-shell && npm run build",
      "",
    ].join("\n")
  );
  // Exit 0 on purpose: a deploy without the snapshot is recoverable, a failed
  // deploy is not.
  process.exit(0);
}

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
  console.log("prerendered dist/index.html (" + html.length + " bytes)");
} finally {
  await browser.close();
  await closeServer();
}
