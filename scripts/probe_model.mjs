#!/usr/bin/env node
/**
 * Does a given model honour the responseSchema contract the Design Lab depends
 * on? Runs the real prompt, then pushes the result through the real validator
 * and the real OpenAPI compiler. Run this before changing MODEL in
 * worker/wrangler.toml -- a model that ignores responseSchema breaks the whole
 * design, and this catches it in one call instead of after a deploy.
 *
 * Usage: node --experimental-strip-types scripts/probe_model.mjs gemini-3.7-flash
 * Reads VITE_GEMINI_API_KEY from .env (local only; production uses the Worker
 * secret).
 */
import { readFileSync } from "node:fs";
import { RESPONSE_SCHEMA, SYSTEM_PROMPT } from "../src/lib/designlab/schema.ts";
import { validateProposal, formatIssues } from "../src/lib/designlab/validate.ts";
import { toOpenApi } from "../src/lib/designlab/openapi.ts";
import { EXAMPLES } from "../src/lib/designlab/fixtures.ts";

const model = process.argv[2] || "gemini-3.7-flash";
const KEY = readFileSync(new URL("../.env", import.meta.url), "utf8")
  .split(/\r?\n/)
  .find((l) => l.startsWith("VITE_GEMINI_API_KEY="))
  .split("=")
  .slice(1)
  .join("=")
  .trim();

const brief = EXAMPLES[2].brief; // municipal licensing: the hardest of the three
const started = Date.now();

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: brief }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    }),
  }
);

console.log(`model:   ${model}`);
console.log(`status:  ${res.status}`);
const body = await res.json();
if (!res.ok) {
  console.log("error:  ", JSON.stringify(body.error?.message ?? body).slice(0, 400));
  process.exit(1);
}

const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
console.log(`latency: ${Date.now() - started} ms`);
console.log(
  `tokens:  in=${body.usageMetadata?.promptTokenCount} out=${body.usageMetadata?.candidatesTokenCount}`
);

if (!text) {
  console.log("FAIL: no text part returned");
  console.log(JSON.stringify(body).slice(0, 600));
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  console.log("FAIL: response was not valid JSON despite responseMimeType");
  console.log(text.slice(0, 400));
  process.exit(1);
}
console.log("parsed:  ok (valid JSON)");

const v = validateProposal(parsed);
console.log(`valid:   ${v.ok ? "ok (0 errors)" : "FAILED"}`);
if (!v.ok) console.log(formatIssues(v.errors));
if (v.warnings.length) console.log(`warnings:\n${formatIssues(v.warnings)}`);

console.log(
  `shape:   ${parsed.services?.length} services, ${parsed.entities?.length} entities, ${parsed.endpoints?.length} endpoints, ${parsed.decisions?.length} decisions`
);
console.log(`name:    ${parsed.systemName}`);

const yaml = toOpenApi(parsed);
const declared = new Set(parsed.entities.map((e) => e.name));
const refs = [...yaml.matchAll(/#\/components\/schemas\/([A-Za-z0-9_]+)/g)].map((m) => m[1]);
const badRefs = refs.filter((r) => !declared.has(r));
console.log(`openapi: ${yaml.split("\n").length} lines, ${refs.length} refs, ${badRefs.length} unresolved`);
console.log(`\nRESULT:  ${v.ok && badRefs.length === 0 ? "PASS" : "FAIL"}`);
