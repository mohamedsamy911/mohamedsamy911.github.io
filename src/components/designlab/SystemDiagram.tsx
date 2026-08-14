import { layout } from "../../lib/designlab/layout.ts";
import type { ProposalGraph } from "../../lib/designlab/schema.ts";

/**
 * Service map. Inline SVG on the page's own tokens, so it themes with
 * everything else and needs no chart library. Coordinates come from
 * layout.ts, which is unit-tested, so this component only draws.
 */
const SystemDiagram: React.FC<{ graph: ProposalGraph }> = ({ graph }) => {
  const { nodes, edges, width, height } = layout(graph);
  if (nodes.length === 0) return null;

  return (
    <figure className="m-0">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`Service map: ${nodes
            .map((n) => n.name)
            .join(", ")}. Arrows point from a service to the services it calls.`}
          className="max-w-full"
        >
          <defs>
            <marker
              id="dl-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L8,4 L0,8 z" className="fill-rule-strong" />
            </marker>
          </defs>

          {edges.map((e) => (
            <line
              key={`${e.from}-${e.to}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className="stroke-rule-strong"
              strokeWidth={1}
              markerEnd="url(#dl-arrow)"
            />
          ))}

          {nodes.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={2}
                className="fill-surface stroke-rule-strong"
                strokeWidth={1}
              />
              <text
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + 4}
                textAnchor="middle"
                className="fill-ink font-mono"
                fontSize={12}
              >
                {n.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 font-mono text-xs text-ink-faint">
        Arrows point from a service to the services it calls. Services with no
        dependencies sit at the bottom.
      </figcaption>
    </figure>
  );
};

export default SystemDiagram;
