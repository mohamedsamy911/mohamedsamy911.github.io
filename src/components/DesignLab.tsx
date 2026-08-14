import { useEffect, useRef, useState } from "react";
import { Reveal, Section, SectionHeader } from "./Section";
import BriefForm from "./designlab/BriefForm.tsx";
import ProposalView from "./designlab/ProposalView.tsx";
import MachineryPanel from "./designlab/MachineryPanel.tsx";
import { EXAMPLES } from "../lib/designlab/fixtures.ts";
import {
  isLiveConfigured,
  propose,
  seedOutcome,
  type RunOutcome,
} from "../lib/designlab/client.ts";

/**
 * The Design Lab: a brief in, a checked system design out.
 *
 * Seeded with a recorded run so the section has something to show before the
 * visitor touches anything, and so it degrades to something real rather than an
 * empty state when live generation is unavailable.
 */
const DesignLab: React.FC = () => {
  const [brief, setBrief] = useState(EXAMPLES[0].brief);
  const [busy, setBusy] = useState(false);
  // Seeded synchronously from the recorded run: no network on page load.
  const [outcome, setOutcome] = useState<RunOutcome>(seedOutcome);
  const resultRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    const result = await propose(brief, controller.signal);
    if (controller.signal.aborted) return;
    setOutcome(result);
    setBusy(false);
  };

  return (
    <Section id="lab" labelledBy="lab-title">
      <SectionHeader
        index="02"
        label="Design lab"
        titleId="lab-title"
        title="Sketch a backend from a brief"
        lede="Describe a system in a sentence or two and this returns a service split, a domain model, an HTTP surface and the reasoning behind it. The model is not asked for a document: it is constrained to a typed graph, that graph is checked for referential integrity, and every artefact below is compiled from it by ordinary TypeScript."
      />

      <Reveal className="mt-14 md:mt-16">
        <div className="grid gap-x-10 gap-y-12 border-t border-rule pt-10 md:grid-cols-[9rem_1fr]">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
            Brief
          </h3>
          <div>
            <BriefForm
              brief={brief}
              onBriefChange={setBrief}
              onSubmit={run}
              busy={busy}
            />

            <div ref={resultRef} className="mt-12" aria-live="polite">
              {outcome.status === "unavailable" && (
                <p className="border-l-2 border-rule-strong pl-4 text-sm text-ink-muted">
                  {outcome.reason}
                </p>
              )}

              {outcome.status === "ok" && (
                <>
                  {outcome.meta.source === "recorded" && (
                    <p className="mb-8 border-l-2 border-rule-strong pl-4 text-sm text-ink-muted">
                      {isLiveConfigured()
                        ? "Recorded run, shown so the section is not empty. Press Design the system for a fresh model call."
                        : "Recorded run. Live generation is off for this deployment, so this is the stored result for that brief rather than a fresh model call."}
                    </p>
                  )}
                  <ProposalView
                    graph={outcome.proposal}
                    validation={outcome.validation}
                  />
                  <div className="mt-10">
                    <MachineryPanel meta={outcome.meta} raw={outcome.raw} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

export default DesignLab;
