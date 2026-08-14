/**
 * ProposalGraph -> SVG coordinates for the service map.
 *
 * Layered by dependency depth: a service with no dependencies sits at the
 * bottom, and anything that calls it sits above, so arrows always point down
 * the stack. Deterministic — the same graph produces the same pixels, which is
 * what lets the layout be unit-tested rather than eyeballed.
 */

import type { ProposalGraph } from "./schema.ts";

export const BOX = { w: 176, h: 62 } as const;
const GAP = { x: 28, y: 78 } as const;
const PAD = { x: 8, y: 8 } as const;

export type LayoutNode = {
  id: string;
  name: string;
  responsibility: string;
  level: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LayoutEdge = {
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Layout = {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  width: number;
  height: number;
};

/**
 * Longest-path depth over `dependsOn`. Cycles cannot be layered, so any service
 * caught in one is pinned to level 0 rather than throwing: a generated graph
 * should never crash the page.
 */
function depths(graph: ProposalGraph): Map<string, number> {
  const deps = new Map<string, string[]>();
  for (const service of graph.services) {
    deps.set(
      service.name,
      service.dependsOn.filter((d) => d !== service.name)
    );
  }

  const level = new Map<string, number>();
  const visiting = new Set<string>();

  const resolve = (name: string): number => {
    const cached = level.get(name);
    if (cached !== undefined) return cached;
    if (visiting.has(name)) return 0; // cycle: break here
    visiting.add(name);
    let depth = 0;
    for (const dep of deps.get(name) ?? []) {
      if (!deps.has(dep)) continue;
      depth = Math.max(depth, resolve(dep) + 1);
    }
    visiting.delete(name);
    level.set(name, depth);
    return depth;
  };

  for (const service of graph.services) resolve(service.name);
  return level;
}

export function layout(graph: ProposalGraph): Layout {
  if (graph.services.length === 0) {
    return { nodes: [], edges: [], width: BOX.w, height: BOX.h };
  }

  const level = depths(graph);
  const maxLevel = Math.max(...level.values());

  // Group by level, preserving the model's ordering within each row.
  const rows = new Map<number, string[]>();
  for (const service of graph.services) {
    const l = level.get(service.name) ?? 0;
    const row = rows.get(l);
    if (row) row.push(service.name);
    else rows.set(l, [service.name]);
  }

  const widest = Math.max(
    ...[...rows.values()].map((row) => row.length * BOX.w + (row.length - 1) * GAP.x)
  );
  const width = widest + PAD.x * 2;
  const height = (maxLevel + 1) * BOX.h + maxLevel * GAP.y + PAD.y * 2;

  const byName = new Map(graph.services.map((s) => [s.name, s]));
  const nodes: LayoutNode[] = [];

  for (const [l, row] of rows) {
    const rowWidth = row.length * BOX.w + (row.length - 1) * GAP.x;
    const startX = (width - rowWidth) / 2;
    // Level 0 has no dependencies, so it renders at the bottom.
    const y = PAD.y + (maxLevel - l) * (BOX.h + GAP.y);
    row.forEach((name, i) => {
      nodes.push({
        id: name,
        name,
        responsibility: byName.get(name)?.responsibility ?? "",
        level: l,
        x: startX + i * (BOX.w + GAP.x),
        y,
        w: BOX.w,
        h: BOX.h,
      });
    });
  }

  const position = new Map(nodes.map((n) => [n.id, n]));
  const edges: LayoutEdge[] = [];
  for (const service of graph.services) {
    const from = position.get(service.name);
    if (!from) continue;
    for (const dep of service.dependsOn) {
      const to = position.get(dep);
      if (!to || dep === service.name) continue;
      edges.push({
        from: service.name,
        to: dep,
        x1: from.x + from.w / 2,
        y1: from.y + from.h,
        x2: to.x + to.w / 2,
        y2: to.y,
      });
    }
  }

  return { nodes, edges, width, height };
}
