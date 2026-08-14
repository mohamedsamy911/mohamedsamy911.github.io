/**
 * The contract between the model and the rest of the application.
 *
 * The model is never asked for YAML, Markdown or prose structure. It is asked
 * for a typed graph, and every artefact the UI shows (the diagram, the tables,
 * the OpenAPI document) is compiled from that graph by ordinary deterministic
 * code. That split is the whole point: generation is the unreliable part, so it
 * is confined to one narrow, validated boundary.
 */

export const FIELD_TYPES = [
  "string",
  "number",
  "boolean",
  "datetime",
  "uuid",
  "json",
] as const;

export const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export type FieldType = (typeof FIELD_TYPES)[number];
export type Method = (typeof METHODS)[number];

export type EntityField = {
  name: string;
  type: FieldType;
  required: boolean;
};

export type Entity = {
  name: string;
  description: string;
  fields: EntityField[];
};

export type Service = {
  name: string;
  responsibility: string;
  dependsOn: string[];
};

export type Endpoint = {
  method: Method;
  path: string;
  service: string;
  summary: string;
  requestEntity?: string;
  responseEntity?: string;
};

export type Decision = {
  choice: string;
  because: string;
};

export type ProposalGraph = {
  systemName: string;
  summary: string;
  services: Service[];
  entities: Entity[];
  endpoints: Endpoint[];
  decisions: Decision[];
};

/**
 * Required keys, declared once. Both the wire schema below and the runtime
 * validator in validate.ts read from this, so the two cannot drift apart —
 * and a test asserts the wire schema's `required` arrays match these exactly.
 */
export const REQUIRED = {
  root: [
    "systemName",
    "summary",
    "services",
    "entities",
    "endpoints",
    "decisions",
  ],
  service: ["name", "responsibility", "dependsOn"],
  entity: ["name", "description", "fields"],
  field: ["name", "type", "required"],
  endpoint: ["method", "path", "service", "summary"],
  decision: ["choice", "because"],
} as const;

/**
 * Gemini's `responseSchema` dialect (an OpenAPI 3.0 subset, uppercase type
 * names). Sent with `responseMimeType: "application/json"` so the model is
 * constrained at decode time rather than merely asked nicely in a prompt.
 */
export const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    systemName: {
      type: "STRING",
      description: "Short name for the system, 2-4 words, title case.",
    },
    summary: {
      type: "STRING",
      description:
        "One or two sentences describing what the system does and who uses it.",
    },
    services: {
      type: "ARRAY",
      description: "Between 3 and 6 deployable services.",
      items: {
        type: "OBJECT",
        properties: {
          name: {
            type: "STRING",
            description: "kebab-case service name, e.g. booking-service.",
          },
          responsibility: {
            type: "STRING",
            description: "One sentence. What this service alone is answerable for.",
          },
          dependsOn: {
            type: "ARRAY",
            description:
              "Names of other services in this same list that it calls. Empty if none. Never itself.",
            items: { type: "STRING" },
          },
        },
        required: [...REQUIRED.service],
      },
    },
    entities: {
      type: "ARRAY",
      description: "Between 3 and 8 core domain entities.",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING", description: "PascalCase singular, e.g. Booking." },
          description: { type: "STRING", description: "One short sentence." },
          fields: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING", description: "camelCase field name." },
                type: { type: "STRING", enum: [...FIELD_TYPES] },
                required: { type: "BOOLEAN" },
              },
              required: [...REQUIRED.field],
            },
          },
        },
        required: [...REQUIRED.entity],
      },
    },
    endpoints: {
      type: "ARRAY",
      description: "Between 4 and 12 HTTP endpoints across the services above.",
      items: {
        type: "OBJECT",
        properties: {
          method: { type: "STRING", enum: [...METHODS] },
          path: {
            type: "STRING",
            description:
              "Starts with /. Path parameters in braces, e.g. /bookings/{bookingId}.",
          },
          service: {
            type: "STRING",
            description: "Must exactly match one service name declared above.",
          },
          summary: { type: "STRING", description: "One short sentence." },
          requestEntity: {
            type: "STRING",
            description:
              "Entity name carried in the request body. Omit for GET and DELETE.",
          },
          responseEntity: {
            type: "STRING",
            description: "Entity name returned. Must match a declared entity.",
          },
        },
        required: [...REQUIRED.endpoint],
      },
    },
    decisions: {
      type: "ARRAY",
      description: "Two to four notable design decisions and their rationale.",
      items: {
        type: "OBJECT",
        properties: {
          choice: { type: "STRING", description: "The decision, stated plainly." },
          because: { type: "STRING", description: "Why, in one sentence." },
        },
        required: [...REQUIRED.decision],
      },
    },
  },
  required: [...REQUIRED.root],
};

export const SYSTEM_PROMPT = `You are a senior backend architect. Given a short project brief, produce a pragmatic service-oriented design.

Rules:
- Prefer the smallest design that actually serves the brief. Do not invent microservices for their own sake.
- Every endpoint's "service" must exactly match a declared service name.
- Every requestEntity and responseEntity must exactly match a declared entity name.
- GET and DELETE endpoints must not declare a requestEntity.
- A service must never list itself in dependsOn.
- Ground the decisions in the brief. No generic advice.`;
