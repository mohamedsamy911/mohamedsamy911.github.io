#!/usr/bin/env node
/**
 * Live-render gate for the SPA. The repo's scripts/*.mjs gates load `file://`
 * HTML fixtures; this app needs a server, so this runs the same three checks
 * against the running page:
 *   1. real computed-contrast WCAG on every rendered text node (light + dark)
 *   2. state-aware contrast: every interactive element in default + focus
 *   3. axe-core WCAG 2.2 A/AA, and horizontal-overflow at 280/320/414
 *
 * Usage: node _gate.mjs [url]
 */
import { chromium } from "playwright";

const URL_ = process.argv[2] || "http://localhost:5173/";
const AXE = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";

const browser = await chromium.launch();
let failures = 0;
const log = (ok, msg) => {
  if (!ok) failures++;
  console.log(`${ok ? "pass" : "FAIL"}  ${msg}`);
};

/* ── in-page helpers ─────────────────────────────────────────────────── */
const CONTRAST_FN = `
  const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = ([r, g, b]) =>
    0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(/[,\\s/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg, a) => fg.map((c, i) => c * a + bg[i] * (1 - a));
  // Composite up the ancestor chain until an opaque background is found.
  const bgOf = (el) => {
    let node = el, stack = [];
    while (node && node !== document.documentElement.parentNode) {
      const p = parse(getComputedStyle(node).backgroundColor);
      if (p && p.a > 0) { stack.push(p); if (p.a === 1) break; }
      node = node.parentElement;
    }
    let base = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i].rgb, base, stack[i].a);
    return base;
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
`;

async function contrastAudit(page, label) {
  const bad = await page.evaluate(
    ({ fns }) => {
      const H = new Function(fns + "; return {parse,bgOf,over,ratio,lum};")();
      const out = [];
      const els = document.querySelectorAll("body *");
      for (const el of els) {
        // Only elements that render their own text.
        const own = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 1
        );
        if (!own) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        if (parseFloat(cs.opacity) < 0.15) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const fg = H.parse(cs.color);
        if (!fg) continue;
        const bg = H.bgOf(el);
        const eff = fg.a < 1 ? H.over(fg.rgb, bg, fg.a) : fg.rgb;
        const size = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight, 10) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const need = large ? 3 : 4.5;
        const got = H.ratio(eff, bg);
        if (got < need) {
          out.push({
            tag: el.tagName.toLowerCase(),
            text: el.textContent.trim().slice(0, 48),
            got: +got.toFixed(2),
            need,
            color: cs.color,
          });
        }
      }
      return out;
    },
    { fns: CONTRAST_FN }
  );
  log(bad.length === 0, `${label}: text contrast (${bad.length} failing node(s))`);
  bad.slice(0, 10).forEach((b) =>
    console.log(`        ${b.got}:1 needs ${b.need}  <${b.tag}> "${b.text}"  ${b.color}`)
  );
}

async function focusAudit(page, label) {
  const bad = await page.evaluate(
    ({ fns }) => {
      const H = new Function(fns + "; return {parse,bgOf,over,ratio,lum};")();
      const out = [];
      const els = [...document.querySelectorAll("a, button, input, textarea, select")];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        el.focus();
        const cs = getComputedStyle(el);
        const width = parseFloat(cs.outlineWidth) || 0;
        const style = cs.outlineStyle;
        const offset = parseFloat(cs.outlineOffset) || 0;
        // With a positive offset the ring is drawn on the ancestor surface.
        const bg = offset > 0 && el.parentElement ? H.bgOf(el.parentElement) : H.bgOf(el);
        const oc = H.parse(cs.outlineColor);
        if (style === "none" || width === 0) {
          out.push({ el: el.tagName.toLowerCase(), why: "no focus outline", id: (el.className||"").toString().slice(0,60), txt: el.textContent.trim().slice(0,30) });
          continue;
        }
        const got = H.ratio(oc.rgb, bg);
        if (got < 3) out.push({ el: el.tagName.toLowerCase(), why: `outline ${got.toFixed(2)}:1 style=${style} w=${width} c=${cs.outlineColor} vis=${cs.getPropertyValue("outline")}`, id: (el.className||"").toString().slice(0,60), txt: el.textContent.trim().slice(0,30) });
      }
      document.activeElement?.blur();
      return out;
    },
    { fns: CONTRAST_FN }
  );
  log(bad.length === 0, `${label}: focus indicators (${bad.length} failing)`);
  bad.slice(0, 8).forEach((b) => console.log(`        <${b.el}> "${b.txt}" ${b.why}`));
}

async function targetAudit(page, label) {
  const small = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("a, button, input, textarea, select")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // Visually-hidden controls (skip link) size up on focus; measure then.
      if (r.width <= 1 && r.height <= 1) {
        el.focus();
        const fr = el.getBoundingClientRect();
        el.blur();
        if (fr.width >= 24 && fr.height >= 24) continue;
      }
      // Inline links in a paragraph are exempt (WCAG 2.5.8).
      const inline = getComputedStyle(el).display.startsWith("inline") &&
        el.closest("p, li, dd");
      if (inline) continue;
      if (r.width < 24 || r.height < 24)
        out.push({ tag: el.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height), t: el.textContent.trim().slice(0, 24) });
    }
    return out;
  });
  log(small.length === 0, `${label}: target size >=24px (${small.length} too small)`);
  small.slice(0, 8).forEach((s) => console.log(`        <${s.tag}> ${s.w}x${s.h} "${s.t}"`));
}

/* ── run ─────────────────────────────────────────────────────────────── */
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await page.goto(URL_, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  // Bring every in-view animation to its resting state.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  // Focus first, before any click: a mouse click switches Chrome out of
  // keyboard modality and programmatic .focus() stops matching :focus-visible,
  // which would report false failures on every control.
  await focusAudit(page, theme);
  await targetAudit(page, theme);
  await contrastAudit(page, theme);

  // Then expand collapsed surfaces and re-audit contrast, so hidden code
  // blocks are covered rather than only the resting state.
  const machinery = page.getByRole("button", { name: /Show the machinery/i });
  if (await machinery.count()) {
    await machinery.first().click();
    await page.waitForTimeout(500);
    await contrastAudit(page, `${theme} (expanded)`);
  }

  // axe-core
  await page.addScriptTag({ url: AXE });
  const res = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help }));
  });
  const serious = res.filter((v) => ["serious", "critical"].includes(v.impact));
  log(serious.length === 0, `${theme}: axe WCAG 2.2 AA (${res.length} violation type(s), ${serious.length} serious+)`);
  res.forEach((v) => console.log(`        [${v.impact}] ${v.id} x${v.n} — ${v.help}`));

  await ctx.close();
}

// responsive overflow
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const w of [280, 320, 414]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto(URL_, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    log(over <= 0, `responsive @${w}px: horizontal overflow = ${over}px`);
    if (over > 0) {
      const culprits = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        return [...document.querySelectorAll("body *")]
          .filter((el) => el.getBoundingClientRect().right > vw + 1)
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} right=${Math.round(el.getBoundingClientRect().right)}`);
      });
      culprits.forEach((c) => console.log(`        ${c}`));
    }
  }
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? "\nALL GATES PASS" : `\n${failures} GATE(S) FAILED`);
process.exit(failures ? 1 : 0);
