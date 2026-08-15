import { chromium } from "playwright";
const b = await chromium.launch();
let bad = 0;
const check = (ok, m) => { if (!ok) bad++; console.log(`${ok ? "pass" : "FAIL"}  ${m}`); };

// 1. The original bug: OS light + toggle dark must still render dark.
for (const scheme of ["light", "dark"]) {
  const ctx = await b.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem("theme", "dark"));
  await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check(bg === "rgb(19, 18, 17)", `OS=${scheme} + saved theme=dark -> body bg ${bg} (want rgb(19, 18, 17))`);
  await ctx.close();
}

// 2. Theme toggle actually flips, and persists.
{
  const ctx = await b.newContext({ colorScheme: "light", viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const before = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await p.getByRole("button", { name: /Switch to .* theme/ }).first().click();
  await p.waitForTimeout(500);
  const after = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const saved = await p.evaluate(() => localStorage.getItem("theme"));
  check(before !== after, `toggle flips background ${before} -> ${after}`);
  check(saved === "dark", `toggle persists choice (localStorage.theme=${saved})`);
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const afterReload = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check(afterReload === after, `choice survives reload (${afterReload})`);
  await ctx.close();
}

// 3. Mobile menu opens, navigates, closes; Escape closes.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const btn = p.getByRole("button", { name: "Open menu" });
  await btn.click();
  await p.waitForTimeout(400);
  check(await p.locator("#mobile-menu").isVisible(), "mobile menu opens");
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  check((await p.locator("#mobile-menu").count()) === 0, "Escape closes mobile menu");
  await btn.click();
  await p.waitForTimeout(300);
  await p.locator("#mobile-menu").getByText("Contact", { exact: true }).click();
  await p.waitForTimeout(1200);
  const y = await p.evaluate(() => window.scrollY);
  check(y > 500, `nav item scrolls to section (scrollY=${Math.round(y)})`);
  check((await p.locator("#mobile-menu").count()) === 0, "menu closes after navigating");
  await ctx.close();
}

// 4. Skip link appears on first Tab and targets main.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.keyboard.press("Tab");
  const r = await p.evaluate(() => {
    const el = document.activeElement;
    const b = el.getBoundingClientRect();
    return { txt: el.textContent.trim(), w: Math.round(b.width), h: Math.round(b.height), href: el.getAttribute("href") };
  });
  check(r.txt === "Skip to content" && r.w > 40 && r.h >= 24 && r.href === "#main",
    `skip link is first tab stop and visible (${r.txt}, ${r.w}x${r.h}, ${r.href})`);
  await ctx.close();
}

// 5. Reduced motion: no infinite animations left running.
{
  const ctx = await b.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  const infinite = await p.evaluate(() =>
    document.getAnimations().filter((a) => a.effect?.getTiming?.().iterations === Infinity).length
  );
  check(infinite === 0, `no infinite animations under prefers-reduced-motion (${infinite})`);
  await ctx.close();
}

// 6. Design Lab: examples load, a run renders, machinery opens, OpenAPI downloads.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.getElementById("lab").scrollIntoView());
  await p.waitForTimeout(600);

  // Seeded synchronously from the recorded fixture -- deterministic, and it
  // must never cost a model call on page load.
  check(
    (await p.locator("#lab").getByText("Clinic Booking Platform").count()) > 0,
    "lab seeds the recorded proposal on load, without a network call"
  );

  // Switching example brief changes the textarea and then the rendered result.
  await p.getByRole("button", { name: "Fleet telemetry" }).click();
  const briefValue = await p.locator("#dl-brief").inputValue();
  check(/municipal fleet/i.test(briefValue), "example chip fills the brief textarea");

  await p.getByRole("button", { name: "Design the system" }).click();
  // Live generation takes ~20s; a recorded run is instant. Wait for the result
  // rather than a fixed delay so this passes in either mode.
  await p.waitForFunction(
    () => !document.querySelector('#lab button[aria-busy="true"]'),
    { timeout: 60000 }
  );
  // Target the proposal title explicitly: "#lab h3" also matches the "Brief"
  // gutter label, which made this assertion pass without testing anything.
  const title = p.locator('[data-designlab="system-name"]');
  await title.waitFor({ state: "visible", timeout: 60000 });
  const systemName = (await title.innerText()).trim();
  const endpoints = await p.locator("#lab ul li p span.text-accent").count();
  check(
    systemName.length > 0 && systemName !== "Brief" && endpoints >= 4,
    `running a brief renders a proposal ("${systemName}", ${endpoints} endpoints)`
  );

  // The service map draws exactly one box per service actually listed.
  const boxes = await p.locator("#lab svg rect").count();
  const services = await p.locator("#lab dl > div > dt.font-mono").count();
  check(
    boxes > 0 && boxes === services,
    `service map draws one box per service (${boxes} boxes, ${services} services)`
  );

  // Validation summary reports a clean graph for a fixture.
  check(
    (await p.locator("#lab").getByText(/every endpoint resolves/i).count()) > 0,
    "validation summary reports the checks that passed"
  );

  // Machinery panel is collapsed, then reveals the schema.
  check(
    (await p.locator("#dl-machinery").count()) === 0,
    "machinery panel starts collapsed"
  );
  await p.getByRole("button", { name: /Show the machinery/i }).click();
  await p.waitForTimeout(400);
  const machinery = await p.locator("#dl-machinery").innerText();
  check(/responseSchema|Response schema/i.test(machinery), "machinery shows the wire schema");
  // innerText reflects the CSS uppercase transform, so match case-insensitively.
  check(/latency/i.test(machinery), "machinery reports latency");

  // OpenAPI download is wired to a generated blob, not a placeholder.
  const dl = p.locator('#lab a[download$=".yaml"]').first();
  const href = await dl.getAttribute("href");
  const name = await dl.getAttribute("download");
  check(
    Boolean(href?.startsWith("blob:")) && /^[a-z0-9-]+-openapi\.yaml$/.test(name ?? ""),
    `OpenAPI download is generated from the live graph (${name})`
  );

  await ctx.close();
}

await b.close();
console.log(bad === 0 ? "\nALL INTERACTIONS PASS" : `\n${bad} FAILED`);
process.exit(bad ? 1 : 0);
