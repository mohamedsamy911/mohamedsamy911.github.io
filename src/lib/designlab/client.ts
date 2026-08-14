/**
 * Orchestrates one Design Lab run.
 *
 * Degradation is deliberate and visible. With no Worker configured the example
 * briefs still render from recorded output, labelled as such, so the section is
 * never broken in front of a visitor; a custom brief in that state reports
 * honestly that live generation is off rather than pretending.
 */

import { DESIGNLAB_ENDPOINT } from "../../constants";
import { EXAMPLES, findExample } from "./fixtures.ts";
import type { ProposalGraph } from "./schema.ts";
import { validateProposal, type ValidationResult } from "./validate.ts";

export type RunSource = "live" | "recorded";

export type RunMeta = {
  source: RunSource;
  latencyMs: number;
  tokensIn?: number;
  tokensOut?: number;
  /** True when the first response failed validation and a repair pass ran. */
  repaired: boolean;
  /** True when the Worker served this from its cache rather than the model. */
  cached?: boolean;
  model?: string;
};

export type RunOutcome =
  | {
      status: "ok";
      proposal: ProposalGraph;
      meta: RunMeta;
      validation: ValidationResult;
      raw: unknown;
    }
  | { status: "unavailable"; reason: string };

export const MAX_BRIEF = 1200;
export const isLiveConfigured = (): boolean => Boolean(DESIGNLAB_ENDPOINT);

type WorkerResponse = {
  proposal?: unknown;
  meta?: Partial<RunMeta>;
  error?: string;
  /** Present on a 422: the checks the model's design actually failed. */
  issues?: string[];
};

const recorded = (brief: string, latencyMs: number): RunOutcome | null => {
  const example = findExample(brief);
  if (!example) return null;
  return {
    status: "ok",
    proposal: example.proposal,
    meta: { source: "recorded", latencyMs, repaired: false },
    validation: validateProposal(example.proposal),
    raw: example.proposal,
  };
};

/**
 * The initial, network-free state of the section.
 *
 * Seeding used to go through propose(), which meant every single page load
 * fired a model call once a Worker was configured: real spend on every visit,
 * a ~20s wait before the section showed anything, and a non-deterministic
 * first paint. Generation is now strictly user-initiated.
 */
export const seedOutcome = (): RunOutcome => {
  const example = EXAMPLES[0];
  return {
    status: "ok",
    proposal: example.proposal,
    meta: { source: "recorded", latencyMs: 0, repaired: false },
    validation: validateProposal(example.proposal),
    raw: example.proposal,
  };
};

export async function propose(
  brief: string,
  signal?: AbortSignal
): Promise<RunOutcome> {
  const trimmed = brief.trim();
  if (!trimmed) return { status: "unavailable", reason: "Write a brief first." };
  if (trimmed.length > MAX_BRIEF)
    return {
      status: "unavailable",
      reason: `Briefs are capped at ${MAX_BRIEF} characters.`,
    };

  const started = performance.now();

  if (!isLiveConfigured()) {
    const fallback = recorded(trimmed, Math.round(performance.now() - started));
    return (
      fallback ?? {
        status: "unavailable",
        reason:
          "Live generation is not switched on for this deployment. Pick one of the example briefs to see a recorded run.",
      }
    );
  }

  try {
    const response = await fetch(DESIGNLAB_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ brief: trimmed }),
      signal,
    });

    const latencyMs = Math.round(performance.now() - started);
    const body = (await response.json().catch(() => ({}))) as WorkerResponse;

    if (!response.ok || !body.proposal) {
      // A 422 is a real, interesting result -- the model produced something and
      // the validator rejected it -- so report the failed checks rather than
      // silently swapping in a recorded run and pretending it worked.
      if (response.status === 422 && body.error) {
        return {
          status: "unavailable",
          reason: body.issues?.length
            ? `${body.error} Failed checks: ${body.issues.join("; ")}`
            : body.error,
        };
      }

      const fallback = recorded(trimmed, latencyMs);
      if (fallback) return fallback;
      return {
        status: "unavailable",
        reason:
          body.error ??
          (response.status === 429
            ? "The demo's daily limit has been reached. Try an example brief."
            : "The design service did not respond. Try an example brief."),
      };
    }

    return {
      status: "ok",
      proposal: body.proposal as ProposalGraph,
      meta: {
        source: "live",
        latencyMs,
        repaired: Boolean(body.meta?.repaired),
        cached: body.meta?.cached,
        tokensIn: body.meta?.tokensIn,
        tokensOut: body.meta?.tokensOut,
        model: body.meta?.model,
      },
      validation: validateProposal(body.proposal),
      raw: body.proposal,
    };
  } catch (error) {
    if (signal?.aborted) return { status: "unavailable", reason: "Cancelled." };
    console.error("Design Lab request failed:", error);
    const fallback = recorded(trimmed, Math.round(performance.now() - started));
    return (
      fallback ?? {
        status: "unavailable",
        reason: "Could not reach the design service. Try an example brief.",
      }
    );
  }
}
