/**
 * Structural and referential validation of a model-produced ProposalGraph.
 *
 * A JSON schema can guarantee shape but not meaning: it cannot say "this
 * endpoint names a service that exists". Those cross-references are where
 * generated designs actually break, so they are checked here. Errors are fed
 * back to the model for one repair pass; warnings are surfaced to the reader
 * but never block.
 */

import {
  FIELD_TYPES,
  METHODS,
  REQUIRED,
  type ProposalGraph,
} from "./schema.ts";

export type Issue = {
  severity: "error" | "warning";
  path: string;
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  errors: Issue[];
  warnings: Issue[];
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const PATH_PARAM = /\{([^}]*)\}/g;
const IDENTIFIER = /^[a-zA-Z][a-zA-Z0-9]*$/;

/**
 * Validates an untrusted parsed-JSON value. Returns issues rather than
 * throwing, so the caller can decide between repairing and reporting.
 */
export function validateProposal(input: unknown): ValidationResult {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const err = (path: string, message: string) =>
    errors.push({ severity: "error", path, message });
  const warn = (path: string, message: string) =>
    warnings.push({ severity: "warning", path, message });

  if (!isObject(input)) {
    return {
      ok: false,
      errors: [{ severity: "error", path: "$", message: "Response is not an object." }],
      warnings: [],
    };
  }

  for (const key of REQUIRED.root) {
    if (!(key in input)) err("$", `Missing required key "${key}".`);
  }

  const arrayAt = (key: string): unknown[] => {
    const v = input[key];
    if (!Array.isArray(v)) {
      if (key in input) err(`$.${key}`, "Expected an array.");
      return [];
    }
    return v;
  };

  if (typeof input.systemName !== "string" || !input.systemName.trim())
    err("$.systemName", "Expected a non-empty string.");
  if (typeof input.summary !== "string" || !input.summary.trim())
    err("$.summary", "Expected a non-empty string.");

  /* ── Services ─────────────────────────────────────────────────────── */
  const rawServices = arrayAt("services");
  const serviceNames = new Set<string>();
  rawServices.forEach((raw, i) => {
    const at = `$.services[${i}]`;
    if (!isObject(raw)) return err(at, "Expected an object.");
    for (const key of REQUIRED.service) {
      if (!(key in raw)) err(at, `Missing required key "${key}".`);
    }
    if (typeof raw.name !== "string" || !raw.name.trim())
      return err(`${at}.name`, "Expected a non-empty string.");
    if (serviceNames.has(raw.name))
      err(`${at}.name`, `Duplicate service name "${raw.name}".`);
    serviceNames.add(raw.name);
    if (!Array.isArray(raw.dependsOn))
      err(`${at}.dependsOn`, "Expected an array (use [] when there are none).");
  });
  if (rawServices.length === 0) err("$.services", "At least one service is required.");

  // dependsOn is resolved in a second pass, once every name is known.
  rawServices.forEach((raw, i) => {
    if (!isObject(raw) || !Array.isArray(raw.dependsOn)) return;
    const at = `$.services[${i}].dependsOn`;
    raw.dependsOn.forEach((dep, j) => {
      if (typeof dep !== "string") return err(`${at}[${j}]`, "Expected a string.");
      if (dep === raw.name) err(`${at}[${j}]`, `"${dep}" depends on itself.`);
      else if (!serviceNames.has(dep))
        err(`${at}[${j}]`, `Unknown service "${dep}".`);
    });
  });

  /* ── Entities ─────────────────────────────────────────────────────── */
  const rawEntities = arrayAt("entities");
  const entityNames = new Set<string>();
  rawEntities.forEach((raw, i) => {
    const at = `$.entities[${i}]`;
    if (!isObject(raw)) return err(at, "Expected an object.");
    for (const key of REQUIRED.entity) {
      if (!(key in raw)) err(at, `Missing required key "${key}".`);
    }
    if (typeof raw.name !== "string" || !raw.name.trim())
      return err(`${at}.name`, "Expected a non-empty string.");
    if (entityNames.has(raw.name))
      err(`${at}.name`, `Duplicate entity name "${raw.name}".`);
    entityNames.add(raw.name);

    if (!Array.isArray(raw.fields)) {
      err(`${at}.fields`, "Expected an array.");
      return;
    }
    if (raw.fields.length === 0) warn(`${at}.fields`, `"${raw.name}" has no fields.`);
    const fieldNames = new Set<string>();
    raw.fields.forEach((f, j) => {
      const fAt = `${at}.fields[${j}]`;
      if (!isObject(f)) return err(fAt, "Expected an object.");
      for (const key of REQUIRED.field) {
        if (!(key in f)) err(fAt, `Missing required key "${key}".`);
      }
      if (typeof f.name === "string") {
        if (fieldNames.has(f.name))
          err(`${fAt}.name`, `Duplicate field "${f.name}" on ${raw.name}.`);
        fieldNames.add(f.name);
      }
      if (typeof f.type !== "string" || !(FIELD_TYPES as readonly string[]).includes(f.type))
        err(`${fAt}.type`, `Expected one of: ${FIELD_TYPES.join(", ")}.`);
      if (typeof f.required !== "boolean")
        err(`${fAt}.required`, "Expected a boolean.");
    });
  });
  if (rawEntities.length === 0) err("$.entities", "At least one entity is required.");

  /* ── Endpoints ────────────────────────────────────────────────────── */
  const rawEndpoints = arrayAt("endpoints");
  const seen = new Set<string>();
  const referencedEntities = new Set<string>();
  rawEndpoints.forEach((raw, i) => {
    const at = `$.endpoints[${i}]`;
    if (!isObject(raw)) return err(at, "Expected an object.");
    for (const key of REQUIRED.endpoint) {
      if (!(key in raw)) err(at, `Missing required key "${key}".`);
    }

    const method = raw.method;
    if (typeof method !== "string" || !(METHODS as readonly string[]).includes(method))
      err(`${at}.method`, `Expected one of: ${METHODS.join(", ")}.`);

    const path = raw.path;
    if (typeof path !== "string" || !path.startsWith("/")) {
      err(`${at}.path`, 'Expected a string beginning with "/".');
    } else {
      const key = `${String(method)} ${path}`;
      if (seen.has(key)) err(`${at}.path`, `Duplicate route "${key}".`);
      seen.add(key);
      for (const m of path.matchAll(PATH_PARAM)) {
        if (!IDENTIFIER.test(m[1]))
          err(`${at}.path`, `Malformed path parameter "{${m[1]}}".`);
      }
    }

    if (typeof raw.service === "string" && !serviceNames.has(raw.service))
      err(`${at}.service`, `Unknown service "${raw.service}".`);

    for (const key of ["requestEntity", "responseEntity"] as const) {
      const v = raw[key];
      if (v === undefined || v === null || v === "") continue;
      if (typeof v !== "string") {
        err(`${at}.${key}`, "Expected a string.");
      } else if (!entityNames.has(v)) {
        err(`${at}.${key}`, `Unknown entity "${v}".`);
      } else {
        referencedEntities.add(v);
      }
    }

    // Semantic checks: shape is legal but the design would be wrong.
    if ((method === "GET" || method === "DELETE") && raw.requestEntity)
      err(`${at}.requestEntity`, `${method} must not carry a request body.`);
    if (
      (method === "POST" || method === "PUT" || method === "PATCH") &&
      !raw.requestEntity
    )
      warn(`${at}.requestEntity`, `${method} usually carries a request body.`);
  });
  if (rawEndpoints.length === 0) err("$.endpoints", "At least one endpoint is required.");

  for (const name of entityNames) {
    if (!referencedEntities.has(name))
      warn("$.entities", `"${name}" is never used by an endpoint.`);
  }

  return { ok: errors.length === 0, errors, warnings };
}

/** Narrowing helper for call sites that have already validated. */
export const asProposal = (input: unknown): ProposalGraph => input as ProposalGraph;

/** Compact, model-readable rendering of the errors, for the repair pass. */
export const formatIssues = (issues: Issue[]): string =>
  issues.map((i) => `- ${i.path}: ${i.message}`).join("\n");
