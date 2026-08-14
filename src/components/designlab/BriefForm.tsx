import { Loader2 } from "lucide-react";
import { MAX_BRIEF } from "../../lib/designlab/client.ts";
import { EXAMPLES } from "../../lib/designlab/fixtures.ts";

const BriefForm: React.FC<{
  brief: string;
  onBriefChange: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
}> = ({ brief, onBriefChange, onSubmit, busy }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <fieldset className="border-0 p-0">
      <legend className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
        Start from an example
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => onBriefChange(example.brief)}
            className="border border-rule-strong px-3 py-2 font-mono text-xs text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            {example.label}
          </button>
        ))}
      </div>
    </fieldset>

    <div className="mt-8">
      <label
        htmlFor="dl-brief"
        className="block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint"
      >
        Project brief
      </label>
      <textarea
        id="dl-brief"
        value={brief}
        onChange={(e) => onBriefChange(e.target.value.slice(0, MAX_BRIEF))}
        rows={5}
        maxLength={MAX_BRIEF}
        placeholder="A booking system for a chain of physiotherapy clinics..."
        aria-describedby="dl-brief-count"
        className="mt-2 w-full resize-y rounded-sm border border-rule-strong bg-surface px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-faint transition-colors focus:border-accent"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p id="dl-brief-count" className="font-mono text-xs text-ink-faint">
          {/* Measured through the deployed Worker: ~15s typical, ~30s when the
              primary model 503s and the fallback runs. Say so rather than leave
              the reader watching a spinner and assuming it hung. */}
          {busy ? "Usually 15 to 30 seconds" : `${brief.length} / ${MAX_BRIEF}`}
        </p>
        <button
          type="submit"
          disabled={busy || brief.trim().length === 0}
          aria-busy={busy}
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {busy ? "Designing" : "Design the system"}
        </button>
      </div>
    </div>
  </form>
);

export default BriefForm;
