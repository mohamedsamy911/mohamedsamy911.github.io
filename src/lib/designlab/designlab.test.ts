/**
 * Deterministic tests for the Design Lab core. No network, no key, no model.
 *
 * Run: node --experimental-strip-types --test src/lib/designlab/
 */

import test from "node:test";
import assert from "node:assert/strict";

import { REQUIRED, RESPONSE_SCHEMA, type ProposalGraph } from "./schema.ts";
import { validateProposal } from "./validate.ts";
import { toOpenApi } from "./openapi.ts";
import { layout } from "./layout.ts";
import { EXAMPLES } from "./fixtures.ts";

/* Small helper: deep-clone a fixture so a test can corrupt it safely. */
const clone = (): ProposalGraph =>
  structuredClone(EXAMPLES[0].proposal) as ProposalGraph;

/* ── schema / validator agreement ─────────────────────────────────────── */

test("wire schema required keys match the shared REQUIRED lists", () => {
  const props = RESPONSE_SCHEMA.properties;
  assert.deepEqual([...RESPONSE_SCHEMA.required], [...REQUIRED.root]);
  assert.deepEqual([...props.services.items.required], [...REQUIRED.service]);
  assert.deepEqual([...props.entities.items.required], [...REQUIRED.entity]);
  assert.deepEqual(
    [...props.entities.items.properties.fields.items.required],
    [...REQUIRED.field]
  );
  assert.deepEqual([...props.endpoints.items.required], [...REQUIRED.endpoint]);
  assert.deepEqual([...props.decisions.items.required], [...REQUIRED.decision]);
});

test("every root property named in REQUIRED.root exists in the wire schema", () => {
  for (const key of REQUIRED.root) {
    assert.ok(
      key in RESPONSE_SCHEMA.properties,
      `wire schema is missing property "${key}"`
    );
  }
});

/* ── fixtures are valid ───────────────────────────────────────────────── */

for (const example of EXAMPLES) {
  test(`fixture "${example.id}" passes validation with no errors`, () => {
    const result = validateProposal(example.proposal);
    assert.deepEqual(result.errors, [], `errors in ${example.id}`);
    assert.equal(result.ok, true);
  });

  test(`fixture "${example.id}" has no unused entities or bodyless writes`, () => {
    const { warnings } = validateProposal(example.proposal);
    assert.deepEqual(warnings, [], `warnings in ${example.id}`);
  });
}

/* ── validator catches each failure class ─────────────────────────────── */

test("rejects a non-object response", () => {
  const r = validateProposal("nope");
  assert.equal(r.ok, false);
  assert.match(r.errors[0].message, /not an object/);
});

test("rejects an endpoint naming an undeclared service", () => {
  const g = clone();
  g.endpoints[0].service = "ghost-service";
  const r = validateProposal(g);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /Unknown service "ghost-service"/.test(e.message)));
});

test("rejects an endpoint naming an undeclared entity", () => {
  const g = clone();
  g.endpoints[0].responseEntity = "Ghost";
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /Unknown entity "Ghost"/.test(e.message)));
});

test("rejects a duplicate method and path", () => {
  const g = clone();
  g.endpoints.push({ ...g.endpoints[0] });
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /Duplicate route/.test(e.message)));
});

test("rejects a service that depends on itself", () => {
  const g = clone();
  g.services[0].dependsOn = [g.services[0].name];
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /depends on itself/.test(e.message)));
});

test("rejects a service depending on an unknown service", () => {
  const g = clone();
  g.services[0].dependsOn = ["nowhere-service"];
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /Unknown service "nowhere-service"/.test(e.message)));
});

test("rejects a GET that carries a request body", () => {
  const g = clone();
  const get = g.endpoints.find((e) => e.method === "GET")!;
  get.requestEntity = "Booking";
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /must not carry a request body/.test(e.message)));
});

test("rejects an unknown field type", () => {
  const g = clone();
  // deliberately off-schema
  (g.entities[0].fields[0] as { type: string }).type = "blob";
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /Expected one of/.test(e.message)));
});

test("rejects a malformed path parameter", () => {
  const g = clone();
  g.endpoints[0].path = "/clinics/{}";
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /Malformed path parameter/.test(e.message)));
});

test("rejects a missing required root key", () => {
  const g = clone() as Partial<ProposalGraph>;
  delete g.decisions;
  const r = validateProposal(g);
  assert.ok(r.errors.some((e) => /Missing required key "decisions"/.test(e.message)));
});

test("warns rather than errors on an entity no endpoint uses", () => {
  const g = clone();
  g.entities.push({
    name: "Orphan",
    description: "Unreferenced.",
    fields: [{ name: "id", type: "uuid", required: true }],
  });
  const r = validateProposal(g);
  assert.equal(r.ok, true, "an orphan entity must not block");
  assert.ok(r.warnings.some((w) => /"Orphan" is never used/.test(w.message)));
});

/* ── OpenAPI compiler ─────────────────────────────────────────────────── */

for (const example of EXAMPLES) {
  test(`OpenAPI for "${example.id}" resolves every $ref`, () => {
    const yaml = toOpenApi(example.proposal);
    const declared = new Set(example.proposal.entities.map((e) => e.name));
    const refs = [...yaml.matchAll(/#\/components\/schemas\/([A-Za-z0-9_]+)/g)].map(
      (m) => m[1]
    );
    assert.ok(refs.length > 0, "expected at least one $ref");
    for (const ref of refs) {
      assert.ok(declared.has(ref), `$ref points at undeclared schema "${ref}"`);
    }
  });

  test(`OpenAPI for "${example.id}" declares every unique path exactly once`, () => {
    const yaml = toOpenApi(example.proposal);
    const unique = new Set(example.proposal.endpoints.map((e) => e.path));
    for (const path of unique) {
      const occurrences = yaml.split("\n").filter(
        (line) => line.trim() === `"${path}":`
      ).length;
      assert.equal(occurrences, 1, `path ${path} appeared ${occurrences} times`);
    }
  });

  test(`OpenAPI for "${example.id}" is byte-stable across runs`, () => {
    assert.equal(toOpenApi(example.proposal), toOpenApi(example.proposal));
  });
}

test("OpenAPI emits a components.schemas entry per entity", () => {
  const example = EXAMPLES[0];
  const yaml = toOpenApi(example.proposal);
  for (const entity of example.proposal.entities) {
    assert.ok(
      yaml.includes(`    ${entity.name}:`),
      `missing schema block for ${entity.name}`
    );
  }
});

test("OpenAPI maps datetime and uuid to string with a format", () => {
  const yaml = toOpenApi(EXAMPLES[0].proposal);
  assert.match(yaml, /format: date-time/);
  assert.match(yaml, /format: uuid/);
});

test("OpenAPI escapes a quote in a summary instead of breaking the document", () => {
  const g = clone();
  g.endpoints[0].summary = 'A "quoted" summary\nwith a newline';
  const yaml = toOpenApi(g);
  assert.ok(yaml.includes('\\"quoted\\"'), "quote should be escaped");
  assert.ok(
    !yaml.includes("with a newline\n"),
    "newline should be collapsed into the scalar"
  );
});

test("OpenAPI gives DELETE a 204 and POST a 201", () => {
  const yaml = toOpenApi(EXAMPLES[0].proposal);
  assert.match(yaml, /"204":/);
  assert.match(yaml, /"201":/);
});

/* ── layout ───────────────────────────────────────────────────────────── */

for (const example of EXAMPLES) {
  test(`layout for "${example.id}" places every service inside the canvas`, () => {
    const l = layout(example.proposal);
    assert.equal(l.nodes.length, example.proposal.services.length);
    for (const n of l.nodes) {
      assert.ok(n.x >= 0 && n.x + n.w <= l.width, `${n.name} overflows horizontally`);
      assert.ok(n.y >= 0 && n.y + n.h <= l.height, `${n.name} overflows vertically`);
    }
  });

  test(`layout for "${example.id}" never overlaps two boxes in a row`, () => {
    const l = layout(example.proposal);
    const rows = new Map<number, typeof l.nodes>();
    for (const n of l.nodes) {
      const row = rows.get(n.y);
      if (row) row.push(n);
      else rows.set(n.y, [n]);
    }
    for (const row of rows.values()) {
      const sorted = [...row].sort((a, b) => a.x - b.x);
      for (let i = 1; i < sorted.length; i++) {
        assert.ok(
          sorted[i].x >= sorted[i - 1].x + sorted[i - 1].w,
          `${sorted[i - 1].name} and ${sorted[i].name} overlap`
        );
      }
    }
  });

  test(`layout for "${example.id}" points every edge downward`, () => {
    const l = layout(example.proposal);
    for (const e of l.edges) {
      assert.ok(e.y2 >= e.y1, `edge ${e.from} -> ${e.to} does not point down`);
    }
  });
}

test("layout is deterministic", () => {
  assert.deepEqual(layout(EXAMPLES[0].proposal), layout(EXAMPLES[0].proposal));
});

test("layout survives a dependency cycle instead of hanging", () => {
  const g = clone();
  g.services[0].dependsOn = [g.services[1].name];
  g.services[1].dependsOn = [g.services[0].name];
  const l = layout(g);
  assert.equal(l.nodes.length, g.services.length);
  assert.ok(Number.isFinite(l.height));
});

test("layout handles a graph with no services", () => {
  const g = clone();
  g.services = [];
  const l = layout(g);
  assert.deepEqual(l.nodes, []);
  assert.deepEqual(l.edges, []);
});
