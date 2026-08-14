/**
 * Design Lab proxy.
 *
 * Exists for one non-negotiable reason: the model key must never reach the
 * browser. GitHub Pages is static, so this Worker is the only server in the
 * system. It also owns the things a client cannot be trusted with, namely the
 * spend cap and the rate limit.
 *
 * The request schema and the validator are imported from the site's own source
 * rather than copied, so the contract cannot drift between client and server.
 *
 * Deploy:  cd worker && npx wrangler secret put GEMINI_API_KEY && npx wrangler deploy
 */

import {
  RESPONSE_SCHEMA,
  SYSTEM_PROMPT,
  type ProposalGraph,
} from "../../src/lib/designlab/schema.ts";
import {
  formatIssues,
  validateProposal,
} from "../../src/lib/designlab/validate.ts";

export interface Env {
  /** `wrangler secret put GEMINI_API_KEY`. Never a plain var. */
  GEMINI_API_KEY: string;
  /** KV namespace used for both the cache and the counters. */
  CACHE: KVNamespace;
  /** Comma-separated. Defaults to the portfolio origin plus localhost. */
  ALLOWED_ORIGINS?: string;
  MODEL?: string;
  /** Tried when the primary returns a transient 5xx/429 or times out. Chosen on
   *  measured availability, not version number: see wrangler.toml. */
  FALLBACK_MODEL?: string;
  /** Requests per IP per hour. */
  RATE_PER_HOUR?: string;
  /** Hard ceiling on model calls per UTC day, across everyone. */
  DAILY_CAP?: string;
}

const DEFAULT_ORIGINS = [
  "https://mohamedsamy911.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
const DEFAULT_MODEL = "gemini-3.6-flash";
const DEFAULT_FALLBACK_MODEL = "gemini-3.7-flash";
const MAX_BRIEF = 1200;
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...corsHeaders(origin),
    },
  });

const corsHeaders = (origin: string | null): Record<string, string> =>
  origin
    ? {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        vary: "Origin",
      }
    : {};

const allowedOrigin = (request: Request, env: Env): string | null => {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const allowed = (env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) ??
    DEFAULT_ORIGINS) as string[];
  return allowed.includes(origin) ? origin : null;
};

const sha256 = async (input: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/** Increment a KV counter and report whether it is now over the limit.
 *  KV is eventually consistent, so this is a budget guard rather than a precise
 *  quota; under a burst a handful of extra calls can slip through. That is an
 *  acceptable trade for a demo whose worst case is a few cents. */
async function bumpAndCheck(
  kv: KVNamespace,
  key: string,
  limit: number,
  ttl: number
): Promise<boolean> {
  const current = Number((await kv.get(key)) ?? "0");
  if (current >= limit) return false;
  await kv.put(key, String(current + 1), { expirationTtl: ttl });
  return true;
}

type GeminiResult = {
  text: string;
  model: string;
  tokensIn?: number;
  tokensOut?: number;
};

/** Thrown for statuses worth retrying on a different model (5xx, 429). */
class TransientModelError extends Error {}

/** Per-call ceiling. Without it a hanging primary is unbounded: one measured
 *  request took 78s because the primary stalled before erroring and only then
 *  did the fallback start. */
const MODEL_TIMEOUT_MS = 25_000;

async function callGemini(
  env: Env,
  model: string,
  parts: { role: string; text: string }[]
): Promise<GeminiResult> {
  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: parts.map((p) => ({
            role: p.role,
            parts: [{ text: p.text }],
          })),
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.4,
          },
        }),
        signal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
      }
    );
  } catch (error) {
    // A timeout or network blip is transient: let the fallback take over
    // rather than surfacing a dead end to the reader.
    throw new TransientModelError(
      `${model} did not respond within ${MODEL_TIMEOUT_MS}ms (${String(error)})`
    );
  }

  if (!response.ok) {
    if (response.status >= 500 || response.status === 429)
      throw new TransientModelError(`${model} returned ${response.status}`);
    throw new Error(`${model} returned ${response.status}`);
  }

  const body = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };

  const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Model returned no content");

  return {
    text,
    model,
    tokensIn: body.usageMetadata?.promptTokenCount,
    tokensOut: body.usageMetadata?.candidatesTokenCount,
  };
}

/** Primary model, falling back to the secondary only on transient failures.
 *  A 400 (bad schema, bad key) is not retried: it would fail identically. */
async function generate(
  env: Env,
  parts: { role: string; text: string }[]
): Promise<GeminiResult> {
  const primary = env.MODEL ?? DEFAULT_MODEL;
  const fallback = env.FALLBACK_MODEL ?? DEFAULT_FALLBACK_MODEL;
  try {
    return await callGemini(env, primary, parts);
  } catch (error) {
    if (!(error instanceof TransientModelError) || fallback === primary) throw error;
    console.warn(`${primary} unavailable, falling back to ${fallback}`);
    return await callGemini(env, fallback, parts);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = allowedOrigin(request, env);

    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "POST")
      return json({ error: "Use POST." }, 405, origin);
    if (!origin)
      return json({ error: "Origin not allowed." }, 403, null);

    let brief = "";
    try {
      const body = (await request.json()) as { brief?: unknown };
      brief = typeof body.brief === "string" ? body.brief.trim() : "";
    } catch {
      return json({ error: "Expected a JSON body." }, 400, origin);
    }

    if (!brief) return json({ error: "Write a brief first." }, 400, origin);
    if (brief.length > MAX_BRIEF)
      return json(
        { error: `Briefs are capped at ${MAX_BRIEF} characters.` },
        400,
        origin
      );

    // Cache first: repeated example briefs should cost nothing at all.
    // The model is part of the key, so changing MODEL invalidates naturally.
    // Without it, a model upgrade keeps serving the old model's designs until
    // the 30-day TTL expires -- which is exactly what happened on the first
    // upgrade, and made the eval measure the cache instead of the model.
    const model = env.MODEL ?? DEFAULT_MODEL;
    const cacheKey = `proposal:${model}:${await sha256(brief)}`;
    const cached = await env.CACHE.get(cacheKey, "json");
    if (cached) {
      return json(
        { proposal: cached, meta: { cached: true, repaired: false } },
        200,
        origin
      );
    }

    // Budget guards, cheapest check first.
    const day = new Date().toISOString().slice(0, 10);
    const hour = new Date().toISOString().slice(0, 13);
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";

    const dailyCap = Number(env.DAILY_CAP ?? "300");
    const perHour = Number(env.RATE_PER_HOUR ?? "8");

    if (!(await bumpAndCheck(env.CACHE, `rl:${ip}:${hour}`, perHour, 3600)))
      return json(
        { error: "You have hit the hourly limit for this demo. Try an example brief." },
        429,
        origin
      );
    if (!(await bumpAndCheck(env.CACHE, `cap:${day}`, dailyCap, 86400)))
      return json(
        { error: "The demo's daily limit has been reached. Try an example brief." },
        429,
        origin
      );

    try {
      let repaired = false;
      let result = await generate(env, [{ role: "user", text: brief }]);
      let parsed: unknown = JSON.parse(result.text);
      let validation = validateProposal(parsed);

      // One repair pass. The model gets its own output plus the exact
      // referential errors, which fixes the common "named a service that does
      // not exist" case without an unbounded retry loop.
      if (!validation.ok) {
        repaired = true;
        result = await generate(env, [
          { role: "user", text: brief },
          { role: "model", text: result.text },
          {
            role: "user",
            text: `That design failed validation:\n${formatIssues(
              validation.errors
            )}\n\nReturn the corrected design. Keep everything that was already valid.`,
          },
        ]);
        parsed = JSON.parse(result.text);
        validation = validateProposal(parsed);
      }

      if (!validation.ok) {
        // Return the actual failed checks, not just "it didn't work". This is
        // the honest outcome to show a reader -- the design was rejected for
        // these specific reasons -- and it makes the failure diagnosable
        // without redeploying to add logging.
        return json(
          {
            error:
              "The model's design failed validation twice, so it was rejected rather than shown.",
            issues: validation.errors.map((i) => `${i.path}: ${i.message}`),
            meta: { repaired: true, model: result.model },
          },
          422,
          origin
        );
      }

      const proposal = parsed as ProposalGraph;
      await env.CACHE.put(cacheKey, JSON.stringify(proposal), {
        expirationTtl: CACHE_TTL_SECONDS,
      });

      return json(
        {
          proposal,
          meta: {
            repaired,
            cached: false,
            model: result.model,
            tokensIn: result.tokensIn,
            tokensOut: result.tokensOut,
          },
        },
        200,
        origin
      );
    } catch (error) {
      console.error("Design Lab generation failed:", error);
      return json(
        { error: "The design service is unavailable. Try an example brief." },
        502,
        origin
      );
    }
  },
};
