import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { RESPONSE_SCHEMA } from "../../lib/designlab/schema.ts";
import type { RunMeta } from "../../lib/designlab/client.ts";

/**
 * Shows the parts a chat widget hides: the schema the model was constrained
 * to, what it actually returned, and what the call cost in time and tokens.
 * The point of the section is the mechanism, so the mechanism is inspectable.
 */
const MachineryPanel: React.FC<{ meta: RunMeta; raw: unknown }> = ({
  meta,
  raw,
}) => {
  const [open, setOpen] = useState(false);

  const stats: { label: string; value: string }[] = [
    {
      label: "Source",
      value: meta.source === "live" ? "Model call" : "Recorded run",
    },
    { label: "Latency", value: `${meta.latencyMs} ms` },
    { label: "Repair pass", value: meta.repaired ? "Ran once" : "Not needed" },
  ];
  if (meta.model) stats.push({ label: "Model", value: meta.model });
  if (meta.tokensIn !== undefined)
    stats.push({ label: "Tokens in", value: String(meta.tokensIn) });
  if (meta.tokensOut !== undefined)
    stats.push({ label: "Tokens out", value: String(meta.tokensOut) });
  if (meta.cached !== undefined)
    stats.push({ label: "Cache", value: meta.cached ? "Hit" : "Miss" });

  return (
    <div className="border-t border-rule pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="dl-machinery"
        className="group inline-flex items-center gap-2 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted transition-colors hover:text-accent"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
        {open ? "Hide the machinery" : "Show the machinery"}
      </button>

      {open && (
        <div id="dl-machinery" className="mt-6 space-y-6">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint">
                  {s.label}
                </dt>
                <dd className="mt-1 font-mono text-sm text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Response schema sent to the model
            </h4>
            <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-ink-muted">
              Passed as `responseSchema` with a JSON response type, so the model
              is constrained while decoding rather than merely asked to behave in
              a prompt.
            </p>
            {/* tabIndex makes the scroll container reachable by keyboard;
                without it a keyboard user cannot scroll the block at all
                (axe: scrollable-region-focusable). */}
            <pre
              tabIndex={0}
              aria-label="Response schema JSON"
              className="mt-3 max-h-64 overflow-auto border border-rule bg-sunk p-4 font-mono text-xs leading-relaxed text-ink-muted"
            >
              <code>{JSON.stringify(RESPONSE_SCHEMA, null, 2)}</code>
            </pre>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Graph returned
            </h4>
            <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-ink-muted">
              Everything above is compiled from this by deterministic
              TypeScript. The model never writes YAML, and never positions a box
              on the diagram.
            </p>
            {/* tabIndex makes the scroll container reachable by keyboard;
                without it a keyboard user cannot scroll the block at all
                (axe: scrollable-region-focusable). */}
            <pre
              tabIndex={0}
              aria-label="Returned graph JSON"
              className="mt-3 max-h-64 overflow-auto border border-rule bg-sunk p-4 font-mono text-xs leading-relaxed text-ink-muted"
            >
              <code>{JSON.stringify(raw, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineryPanel;
