/**
 * Phase 10 — pattern composition.
 * DOCUMENTATION ONLY. This module does not declare relationships of its own.
 * It reads the Phase 9 graph and presents the pattern slice of it, so the two
 * phases can never drift apart. Visual similarity never produces an entry.
 */
import { PATTERN_EDGES } from "./graph-patterns";
import { COMPOUND_EDGES } from "./graph-compounds";
import { GRAPH_EDGES, nodeName, nodeLayer, edgesTo } from "./graph-registry";
import type { SpecLabel } from "./component-spec-types";

export interface CompositionRow {
  patternId: string;
  pattern: string;
  compound: string;
  components: string[];
  roles: string[];
  foundations: string[];
  evidence: string;
  status: SpecLabel;
}

/** Walk backwards from one node to every node in a given layer. */
function ancestorsInLayer(id: string, layer: string, depth = 6): string[] {
  const seen = new Set<string>();
  const found = new Set<string>();
  let frontier = [id];
  for (let i = 0; i < depth && frontier.length > 0; i += 1) {
    const next: string[] = [];
    for (const current of frontier) {
      for (const edge of edgesTo(current)) {
        if (seen.has(edge.from)) continue;
        seen.add(edge.from);
        if (nodeLayer(edge.from) === layer) found.add(edge.from);
        next.push(edge.from);
      }
    }
    frontier = next;
  }
  return Array.from(found).map(nodeName);
}

/** Pattern → compound → component → role → foundation, assembled from Phase 9. */
export const PATTERN_COMPOSITION: CompositionRow[] = PATTERN_EDGES.map((edge) => ({
  patternId: edge.to,
  pattern: nodeName(edge.to),
  compound: nodeName(edge.from),
  components: ancestorsInLayer(edge.from, "core-component"),
  roles: ancestorsInLayer(edge.from, "semantic-role"),
  foundations: ancestorsInLayer(edge.from, "foundation"),
  evidence: edge.evidence,
  status: edge.status,
}));

/** Patterns that contribute to an experience, straight from the graph. */
export const PATTERN_EXPERIENCE_EDGES = GRAPH_EDGES.filter(
  (e) => nodeLayer(e.from) === "pattern" && nodeLayer(e.to) === "experience-pattern",
);

export const COMPOSITION_RULES: string[] = [
  "CURRENT IMPLEMENTATION — every row above is generated from the Phase 9 edges, not written by hand.",
  "CURRENT IMPLEMENTATION — a pattern composes a compound only where an import or a measured usage shows it.",
  "GOVERNANCE RULE — visual similarity between two arrangements never creates a composition row.",
  "GOVERNANCE RULE — where a compound has no component ancestor in the graph, the row shows an empty list instead of a guess.",
  `CURRENT IMPLEMENTATION — ${COMPOUND_EDGES.length} compound edges and ${PATTERN_EDGES.length} pattern edges feed this view.`,
];
