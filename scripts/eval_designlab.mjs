#!/usr/bin/env node
/**
 * Live eval for the Design Lab.
 *
 * Deliberately NOT part of the push build: it spends real tokens and model
 * output is non-deterministic, so gating a deploy on it would make deploys
 * flaky. It runs on demand (workflow_dispatch) and reports a pass rate.
 *
 * The deterministic half -- compiler, validator, layout -- is covered by
 * `npm test`, which needs no network and does gate every push.
 *
 * Usage: node scripts/eval_designlab.mjs [endpoint]
 *        VITE_DESIGNLAB_ENDPOINT=https://... node scripts/eval_designlab.mjs
 */

import { validateProposal } from "../src/lib/designlab/validate.ts";
import { toOpenApi } from "../src/lib/designlab/openapi.ts";
import { EXAMPLES } from "../src/lib/designlab/fixtures.ts";

const endpoint = process.argv[2] || process.env.VITE_DESIGNLAB_ENDPOINT;
if (!endpoint) {
  console.error(
    "No endpoint. Pass one as an argument or set VITE_DESIGNLAB_ENDPOINT."
  );
  process.exit(1);
}

/** Invariants a usable design must satisfy, regardless of wording. */
const INVARIANTS = [
  {
    name: "passes referential validation",
    check: (g) => validateProposal(g).errors.length === 0,
  },
  { name: "declares at least 3 services", check: (g) => g.services.length >= 3 },
  { name: "declares at least 3 entities", check: (g) => g.entities.length >= 3 },
  { name: "declares at least 4 endpoints", check: (g) => g.endpoints.length >= 4 },
  {
    name: "every OpenAPI $ref resolves",
    check: (g) => {
      const yaml = toOpenApi(g);
      const declared = new Set(g.entities.map((e) => e.name));
      return [...yaml.matchAll(/#\/components\/schemas\/([A-Za-z0-9_]+)/g)].every(
        (m) => declared.has(m[1])
      );
    },
  },
  {
    name: "gives a reason for each decision",
    check: (g) => g.decisions.length > 0 && g.decisions.every((d) => d.because?.trim()),
  },
];

let briefsPassed = 0;
const rows = [];

for (const example of EXAMPLES) {
  process.stdout.write(`\n${example.label}\n`);
  let proposal;
  try {
    const started = Date.now();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:5173",
      },
      body: JSON.stringify({ brief: example.brief }),
    });
    const body = await response.json();
    const ms = Date.now() - started;
    if (!response.ok || !body.proposal) {
      console.log(`  request failed: ${response.status} ${body.error ?? ""}`);
      rows.push({ brief: example.label, passed: 0, total: INVARIANTS.length });
      continue;
    }
    proposal = body.proposal;
    // Always report which model answered: a silent fallback to the secondary
    // model roughly doubles latency, and without this the number is unexplained.
    console.log(
      `  ${ms} ms${body.meta?.cached ? ", served from cache" : ` via ${body.meta?.model ?? "unknown"}`}${
        body.meta?.repaired ? ", repair pass ran" : ""
      }`
    );
  } catch (error) {
    console.log(`  unreachable: ${error.message}`);
    rows.push({ brief: example.label, passed: 0, total: INVARIANTS.length });
    continue;
  }

  let passed = 0;
  for (const invariant of INVARIANTS) {
    let ok = false;
    try {
      ok = invariant.check(proposal);
    } catch {
      ok = false;
    }
    if (ok) passed++;
    console.log(`  ${ok ? "pass" : "FAIL"}  ${invariant.name}`);
  }
  if (passed === INVARIANTS.length) briefsPassed++;
  rows.push({ brief: example.label, passed, total: INVARIANTS.length });
}

const totalChecks = rows.reduce((n, r) => n + r.total, 0);
const passedChecks = rows.reduce((n, r) => n + r.passed, 0);

console.log("\n-----");
for (const r of rows) console.log(`${r.passed}/${r.total}  ${r.brief}`);
console.log(
  `\n${passedChecks}/${totalChecks} checks, ${briefsPassed}/${EXAMPLES.length} briefs fully clean`
);

// Only a total failure is treated as broken; partial misses are expected from a
// non-deterministic model and are reported, not enforced.
process.exit(passedChecks === 0 ? 1 : 0);
