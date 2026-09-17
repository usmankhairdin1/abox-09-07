/**
 * Phase 10 — screen to pattern traceability.
 * DOCUMENTATION ONLY. The screen inventory is not rebuilt here: routes come
 * from the Phase 9 screen nodes, and the compound, component, role and
 * foundation columns are walked out of the Phase 9 graph.
 */
import { SCREEN_NODES } from "./graph-screens";
import { nodeName, nodeLayer, edgesTo, edgesFrom } from "./graph-registry";
import type { ScreenPatternTrace, SpecLabel } from "./pattern-spec-types";

function ancestors(id: string, layer: string, depth = 8): string[] {
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

function patternsFor(screenId: string): string[] {
  const experienceIds = edgesTo(screenId)
    .filter((e) => nodeLayer(e.from) === "experience-pattern")
    .map((e) => e.from);
  const patterns = new Set<string>();
  for (const exp of experienceIds) {
    for (const edge of edgesTo(exp)) {
      if (nodeLayer(edge.from) === "pattern") patterns.add(edge.from);
    }
  }
  return Array.from(patterns);
}

export const SCREEN_PATTERN_MAP: ScreenPatternTrace[] = SCREEN_NODES.map((screen) => {
  const experience = edgesTo(screen.id).find((e) => nodeLayer(e.from) === "experience-pattern");
  return {
    route: screen.source ?? screen.name,
    screenId: screen.id,
    experienceId: experience?.from ?? "not established",
    patternIds: patternsFor(screen.id),
    compounds: ancestors(screen.id, "compound"),
    components: ancestors(screen.id, "core-component"),
    roles: ancestors(screen.id, "semantic-role"),
    foundations: ancestors(screen.id, "foundation"),
    status: screen.status as SpecLabel,
  };
});

/** Readable chain for one screen: screen → experience → pattern → compound → component → role → foundation. */
export function chainForScreen(screenId: string): string[] {
  const trace = SCREEN_PATTERN_MAP.find((t) => t.screenId === screenId);
  if (!trace) return [];
  return [
    nodeName(screenId),
    trace.experienceId === "not established" ? "experience not established" : nodeName(trace.experienceId),
    trace.patternIds.map(nodeName).join(" / ") || "no pattern edge",
    trace.compounds.join(" / ") || "no compound edge",
    trace.components.join(" / ") || "no component edge",
    trace.roles.join(" / ") || "no role edge",
    trace.foundations.join(" / ") || "no foundation edge",
  ];
}

export const SCREEN_MAP_RULES: string[] = [
  "CURRENT IMPLEMENTATION — routes are read from the Phase 9 screen nodes; this module declares no screens of its own.",
  "CURRENT IMPLEMENTATION — every column is computed by walking Phase 9 edges, so the two phases cannot disagree.",
  "GOVERNANCE RULE — an empty column means the graph has no edge, not that the screen uses nothing.",
  "GOVERNANCE RULE — Branding & White-Label and Marketplace Asset Management appear as consumers of the foundation; their configuration stays runtime-owned.",
];

/** Kept so the reference page can show that outgoing screen edges are deliberately empty. */
export const SCREEN_LEAF_CHECK = SCREEN_NODES.map((s) => ({
  screen: s.name,
  outgoingEdges: edgesFrom(s.id).length,
  note: "A screen is a leaf: nothing depends on it.",
}));
