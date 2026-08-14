import { useMemo } from "react";
import { Download } from "lucide-react";
import { toOpenApi } from "../../lib/designlab/openapi.ts";
import type { ProposalGraph } from "../../lib/designlab/schema.ts";
import type { ValidationResult } from "../../lib/designlab/validate.ts";
import SystemDiagram from "./SystemDiagram.tsx";

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="grid gap-x-8 gap-y-3 border-t border-rule pt-6 sm:grid-cols-[7rem_1fr]">
    <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
      {label}
    </h4>
    <div>{children}</div>
  </div>
);

/** Validation summary. Errors and warnings are distinguished by a word and a
 *  rule colour, never by colour alone. */
const ChecksSummary: React.FC<{ validation: ValidationResult }> = ({
  validation,
}) => {
  const { errors, warnings } = validation;
  if (errors.length === 0 && warnings.length === 0) {
    return (
      <p className="border-l-2 border-ok pl-4 text-sm text-ink">
        Passed: every endpoint resolves to a declared service, every request and
        response body names a declared entity, and no route is duplicated.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {[...errors, ...warnings].map((issue) => (
        <li
          key={`${issue.severity}-${issue.path}-${issue.message}`}
          className={`border-l-2 pl-4 text-sm ${
            issue.severity === "error" ? "border-err" : "border-rule-strong"
          }`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
            {issue.severity === "error" ? "Error" : "Warning"}
          </span>
          <span className="mx-2 text-rule-strong" aria-hidden="true">
            /
          </span>
          <span className="font-mono text-xs text-ink-faint">{issue.path}</span>
          <span className="mt-1 block text-ink-muted">{issue.message}</span>
        </li>
      ))}
    </ul>
  );
};

const ProposalView: React.FC<{
  graph: ProposalGraph;
  validation: ValidationResult;
}> = ({ graph, validation }) => {
  const yaml = useMemo(() => toOpenApi(graph), [graph]);
  const href = useMemo(
    () => URL.createObjectURL(new Blob([yaml], { type: "text/yaml" })),
    [yaml]
  );
  const filename = `${graph.systemName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-openapi.yaml`;

  return (
    <div className="space-y-8">
      <div>
        <h3 data-designlab="system-name" className="text-2xl md:text-3xl">
          {graph.systemName}
        </h3>
        <p className="mt-3 max-w-[64ch] leading-relaxed text-ink-muted">
          {graph.summary}
        </p>
      </div>

      <Row label="Services">
        <SystemDiagram graph={graph} />
        <dl className="mt-6 space-y-3">
          {graph.services.map((s) => (
            <div key={s.name} className="grid gap-x-6 gap-y-1 sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-sm text-ink">{s.name}</dt>
              <dd className="text-sm leading-relaxed text-ink-muted">
                {s.responsibility}
              </dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row label="Endpoints">
        <ul className="space-y-3">
          {graph.endpoints.map((e) => (
            <li key={`${e.method} ${e.path}`}>
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-xs font-medium text-accent">
                  {e.method}
                </span>
                <span className="font-mono text-sm break-all text-ink">{e.path}</span>
                <span className="font-mono text-xs text-ink-faint">{e.service}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {e.summary}
                {(e.requestEntity || e.responseEntity) && (
                  <span className="ml-2 font-mono text-xs text-ink-faint">
                    {e.requestEntity ? `in: ${e.requestEntity}` : ""}
                    {e.requestEntity && e.responseEntity ? "  " : ""}
                    {e.responseEntity ? `out: ${e.responseEntity}` : ""}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Entities">
        <dl className="space-y-4">
          {graph.entities.map((entity) => (
            <div key={entity.name}>
              <dt className="text-sm text-ink">
                {entity.name}
                <span className="ml-2 text-ink-muted">{entity.description}</span>
              </dt>
              <dd className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                {entity.fields.map((f) => (
                  <span key={f.name} className="font-mono text-xs text-ink-faint">
                    {f.name}
                    <span className="text-rule-strong">:</span>
                    {f.type}
                    {f.required ? "" : "?"}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row label="Decisions">
        <ul className="space-y-4">
          {graph.decisions.map((d) => (
            <li key={d.choice}>
              <p className="text-sm text-ink">{d.choice}</p>
              <p className="mt-1 max-w-[64ch] text-sm leading-relaxed text-ink-muted">
                {d.because}
              </p>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Checks">
        <ChecksSummary validation={validation} />
        <a
          href={href}
          download={filename}
          className="group mt-6 inline-flex items-center gap-2.5 border-b border-rule-strong pb-1 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Download {filename}
          <Download
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </Row>
    </div>
  );
};

export default ProposalView;
