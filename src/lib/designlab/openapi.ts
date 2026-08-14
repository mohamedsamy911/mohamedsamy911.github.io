/**
 * ProposalGraph -> OpenAPI 3.1 YAML.
 *
 * Deterministic and dependency-free. The model never writes a line of this
 * document; it only supplies the graph. Same graph in, byte-identical YAML out,
 * which is what makes the output testable without a network call.
 */

import type { Entity, FieldType, ProposalGraph } from "./schema.ts";

/** OpenAPI type + format for each of our field types. */
const TYPE_MAP: Record<FieldType, { type: string; format?: string }> = {
  string: { type: "string" },
  number: { type: "number" },
  boolean: { type: "boolean" },
  datetime: { type: "string", format: "date-time" },
  uuid: { type: "string", format: "uuid" },
  json: { type: "object" },
};

const PATH_PARAM = /\{([^}]+)\}/g;

/** YAML double-quoted scalar. Collapses newlines so a value never breaks the
 *  document structure. */
const q = (s: string): string =>
  `"${String(s)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
    .trim()}"`;

const indent = (level: number): string => "  ".repeat(level);

function entitySchema(entity: Entity, level: number): string[] {
  const out: string[] = [];
  out.push(`${indent(level)}${entity.name}:`);
  out.push(`${indent(level + 1)}type: object`);
  if (entity.description)
    out.push(`${indent(level + 1)}description: ${q(entity.description)}`);

  const required = entity.fields.filter((f) => f.required).map((f) => f.name);
  if (required.length) {
    out.push(`${indent(level + 1)}required:`);
    for (const name of required) out.push(`${indent(level + 2)}- ${q(name)}`);
  }

  out.push(`${indent(level + 1)}properties:`);
  if (entity.fields.length === 0) {
    out.push(`${indent(level + 2)}{}`);
    return out;
  }
  for (const field of entity.fields) {
    const mapped = TYPE_MAP[field.type] ?? TYPE_MAP.string;
    out.push(`${indent(level + 2)}${field.name}:`);
    out.push(`${indent(level + 3)}type: ${mapped.type}`);
    if (mapped.format) out.push(`${indent(level + 3)}format: ${mapped.format}`);
  }
  return out;
}

export function toOpenApi(graph: ProposalGraph): string {
  const lines: string[] = [];

  lines.push("openapi: 3.1.0");
  lines.push("info:");
  lines.push(`${indent(1)}title: ${q(graph.systemName)}`);
  lines.push(`${indent(1)}version: "0.1.0"`);
  lines.push(`${indent(1)}description: ${q(graph.summary)}`);

  if (graph.services.length) {
    lines.push("tags:");
    for (const service of graph.services) {
      lines.push(`${indent(1)}- name: ${q(service.name)}`);
      lines.push(`${indent(2)}description: ${q(service.responsibility)}`);
    }
  }

  // Group by path so each path object carries its methods, per the spec.
  const byPath = new Map<string, typeof graph.endpoints>();
  for (const endpoint of graph.endpoints) {
    const bucket = byPath.get(endpoint.path);
    if (bucket) bucket.push(endpoint);
    else byPath.set(endpoint.path, [endpoint]);
  }

  lines.push("paths:");
  if (byPath.size === 0) lines.push(`${indent(1)}{}`);

  for (const [path, endpoints] of byPath) {
    lines.push(`${indent(1)}${q(path)}:`);

    const params = [...path.matchAll(PATH_PARAM)].map((m) => m[1]);
    if (params.length) {
      lines.push(`${indent(2)}parameters:`);
      for (const name of params) {
        lines.push(`${indent(3)}- name: ${q(name)}`);
        lines.push(`${indent(4)}in: path`);
        lines.push(`${indent(4)}required: true`);
        lines.push(`${indent(4)}schema:`);
        lines.push(`${indent(5)}type: string`);
      }
    }

    for (const endpoint of endpoints) {
      lines.push(`${indent(2)}${endpoint.method.toLowerCase()}:`);
      lines.push(`${indent(3)}summary: ${q(endpoint.summary)}`);
      lines.push(`${indent(3)}operationId: ${q(operationId(endpoint.method, path))}`);
      lines.push(`${indent(3)}tags:`);
      lines.push(`${indent(4)}- ${q(endpoint.service)}`);

      if (endpoint.requestEntity) {
        lines.push(`${indent(3)}requestBody:`);
        lines.push(`${indent(4)}required: true`);
        lines.push(`${indent(4)}content:`);
        lines.push(`${indent(5)}application/json:`);
        lines.push(`${indent(6)}schema:`);
        lines.push(
          `${indent(7)}$ref: ${q(`#/components/schemas/${endpoint.requestEntity}`)}`
        );
      }

      lines.push(`${indent(3)}responses:`);
      const status = successStatus(endpoint.method, Boolean(endpoint.responseEntity));
      lines.push(`${indent(4)}${q(status)}:`);
      lines.push(`${indent(5)}description: ${q(statusText(status))}`);
      if (endpoint.responseEntity) {
        lines.push(`${indent(5)}content:`);
        lines.push(`${indent(6)}application/json:`);
        lines.push(`${indent(7)}schema:`);
        lines.push(
          `${indent(8)}$ref: ${q(`#/components/schemas/${endpoint.responseEntity}`)}`
        );
      }
    }
  }

  lines.push("components:");
  lines.push(`${indent(1)}schemas:`);
  if (graph.entities.length === 0) {
    lines.push(`${indent(2)}{}`);
  } else {
    for (const entity of graph.entities) lines.push(...entitySchema(entity, 2));
  }

  return lines.join("\n") + "\n";
}

/** camelCase operationId derived from method and path, e.g. getBookingsByBookingId. */
function operationId(method: string, path: string): string {
  const parts = path
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment.startsWith("{")
        ? `by-${segment.slice(1, -1)}`
        : segment
    )
    .join("-");
  const camel = `${method.toLowerCase()}-${parts}`
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/-([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
  return camel.replace(/-$/, "");
}

const successStatus = (method: string, hasBody: boolean): string => {
  if (method === "POST") return "201";
  if (method === "DELETE") return "204";
  return hasBody ? "200" : "204";
};

const statusText = (status: string): string =>
  ({ "200": "OK", "201": "Created", "204": "No Content" })[status] ?? "OK";
