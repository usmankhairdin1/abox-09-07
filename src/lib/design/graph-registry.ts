/**
 * Phase 9 — the single assembly point for the integrated dependency graph.
 *
 * DOCUMENTATION ONLY. Every node and edge in the model lives here once. The
 * reference pages read from this registry and never restate a relationship
 * inline, so the graph cannot disagree with itself.
 */
import type {
  DependencyEdge,
  DependencyNode,
  GraphLayer,
  ImpactRecord,
  SpecLabel,
  StatusRecord,
  TracedChain,
} from "./graph-types";
import { GRAPH_LAYERS } from "./graph-types";
import { FOUNDATION_NODES, SEMANTIC_ROLE_NODES, FOUNDATION_EDGES } from "./graph-foundation";
import { COMPONENT_ROLE_NODES, ROLE_EDGES } from "./graph-roles";
import { COMPONENT_NODES, COMPONENT_EDGES } from "./graph-components";
import { COMPOUND_NODES, COMPOUND_EDGES } from "./graph-compounds";
import { PATTERN_NODES, PATTERN_EDGES } from "./graph-patterns";
import { EXPERIENCE_NODES, EXPERIENCE_EDGES } from "./graph-experiences";
import { SCREEN_NODES, SCREEN_EDGES } from "./graph-screens";
import { KIT_NODES, SHELL_NODES, KIT_EDGES } from "./graph-kits";
import { IMPACT_QUESTIONS } from "./graph-impact";

export { GRAPH_LAYERS };

export const GRAPH_NODES: DependencyNode[] = [
  ...FOUNDATION_NODES,
  ...SEMANTIC_ROLE_NODES,
  ...COMPONENT_ROLE_NODES,
  ...COMPONENT_NODES,
  ...COMPOUND_NODES,
  ...PATTERN_NODES,
  ...EXPERIENCE_NODES,
  ...KIT_NODES,
  ...SHELL_NODES,
  ...SCREEN_NODES,
];

export const GRAPH_EDGES: DependencyEdge[] = [
  ...FOUNDATION_EDGES,
  ...ROLE_EDGES,
  ...COMPONENT_EDGES,
  ...COMPOUND_EDGES,
  ...PATTERN_EDGES,
  ...EXPERIENCE_EDGES,
  ...KIT_EDGES,
  ...SCREEN_EDGES,
];

const NODE_BY_ID = new Map(GRAPH_NODES.map((n) => [n.id, n]));

export function nodeName(id: string): string {
  return NODE_BY_ID.get(id)?.name ?? id;
}

export function nodeLayer(id: string): GraphLayer | undefined {
  return NODE_BY_ID.get(id)?.layer;
}

/** Edges leaving a node, in registry order. */
export function edgesFrom(id: string): DependencyEdge[] {
  return GRAPH_EDGES.filter((e) => e.from === id);
}

/** Edges arriving at a node, in registry order. */
export function edgesTo(id: string): DependencyEdge[] {
  return GRAPH_EDGES.filter((e) => e.to === id);
}

/** Every node reachable downstream, breadth first, cycle safe. */
export function reachableFrom(id: string): string[] {
  const seen = new Set<string>();
  const queue = [id];
  while (queue.length) {
    const current = queue.shift() as string;
    for (const edge of edgesFrom(current)) {
      if (!seen.has(edge.to)) {
        seen.add(edge.to);
        queue.push(edge.to);
      }
    }
  }
  return [...seen];
}

function reachableInLayer(id: string, layer: GraphLayer): string[] {
  return reachableFrom(id)
    .filter((n) => nodeLayer(n) === layer)
    .map(nodeName);
}

/** Impact records derived from the edges — never hand written. */
export const IMPACT_MODEL: ImpactRecord[] = IMPACT_QUESTIONS.map((q) => ({
  change: q.change,
  layer: nodeLayer(q.startNode) ?? "foundation",
  reachableRoles: reachableInLayer(q.startNode, "semantic-role").concat(
    reachableInLayer(q.startNode, "component-role"),
  ),
  reachableComponents: reachableInLayer(q.startNode, "core-component"),
  reachablePatterns: reachableInLayer(q.startNode, "compound").concat(
    reachableInLayer(q.startNode, "pattern"),
  ),
  reachableExperiences: reachableInLayer(q.startNode, "experience-pattern"),
  reachableScreens: reachableInLayer(q.startNode, "screen"),
  confidence: q.confidence,
  status: q.status,
  note: q.note,
}));

/** Readable chains, assembled from real edges so they cannot drift. */
function chainFrom(id: string, title: string, question: string, path: string[]): TracedChain {
  return {
    id,
    title,
    question,
    steps: path.map((nodeId) => {
      const node = NODE_BY_ID.get(nodeId);
      return {
        layer: node?.layer ?? "foundation",
        label: node?.name ?? nodeId,
        evidence: node?.evidence ?? "not established",
        status: node?.status ?? "FUTURE DECISION",
      };
    }),
  };
}

export const TRACED_CHAINS: TracedChain[] = [
  chainFrom("chain.tier", "Why is a plan tier that colour?", "Screen back to foundation", [
    "scr.plans",
    "exp.shop",
    "pat.filter-results",
    "cpd.plan-card",
    "cmp.metal-badge",
    "crole.tier-indicator",
    "role.tier",
    "fnd.tier",
  ]),
  chainFrom(
    "chain.action",
    "Where does a button's colour come from?",
    "Foundation forward to screen",
    [
      "fnd.color",
      "role.action-surface",
      "crole.primary-action",
      "cmp.button",
      "cpd.page-header",
      "pat.detail-page",
      "exp.dash",
      "scr.org",
    ],
  ),
  chainFrom(
    "chain.status",
    "What decides how a status reads in a table?",
    "Screen back to foundation",
    [
      "scr.org",
      "exp.dash",
      "pat.table-screen",
      "cpd.table",
      "cmp.status-badge",
      "crole.status-indicator",
      "role.status-tone",
      "fnd.status",
    ],
  ),
  chainFrom(
    "chain.field",
    "What connects a form label to its input?",
    "Foundation forward to screen",
    [
      "fnd.type",
      "role.text-primary",
      "crole.field-label",
      "cmp.form",
      "cpd.field",
      "pat.form-layout",
      "exp.member",
      "scr.settings",
    ],
  ),
  chainFrom("chain.container", "Why is the page this wide?", "Foundation forward to screen", [
    "fnd.layout",
    "role.container",
    "shell.marketplace",
    "exp.shop",
    "scr.cart",
  ]),
];

export const GRAPH_SUMMARY = {
  layers: GRAPH_LAYERS.length,
  nodes: GRAPH_NODES.length,
  edges: GRAPH_EDGES.length,
  currentEdges: GRAPH_EDGES.filter((e) => e.status === "CURRENT IMPLEMENTATION").length,
  futureEdges: GRAPH_EDGES.filter((e) => e.status.startsWith("FUTURE")).length,
  openDecisionEdges: GRAPH_EDGES.filter((e) => e.status === "FUTURE DECISION").length,
  duplicateEdges: GRAPH_EDGES.filter(
    (e) => e.status === "OBSERVED DUPLICATE" || e.status === "OBSERVED OVERLAP",
  ).length,
  unownedEdges: GRAPH_EDGES.filter((e) => e.status === "UNOWNED AREA").length,
};

export const EDGE_STATUS_COUNTS: { label: SpecLabel; count: number }[] = Array.from(
  GRAPH_EDGES.reduce((acc, e) => {
    acc.set(e.status, (acc.get(e.status) ?? 0) + 1);
    return acc;
  }, new Map<SpecLabel, number>()),
)
  .map(([label, count]) => ({ label, count }))
  .sort((a, b) => b.count - a.count);

export const STATUS_LEGEND: StatusRecord[] = [
  {
    status: "CURRENT IMPLEMENTATION",
    meaning: "The relationship exists in the code today.",
    readAs: "Evidence.",
  },
  {
    status: "OBSERVED VARIATION",
    meaning: "It exists, and it differs between places.",
    readAs: "Evidence, with a caveat.",
  },
  {
    status: "OBSERVED OVERLAP",
    meaning: "More than one thing fills the same conceptual role.",
    readAs: "Evidence, recorded without ranking.",
  },
  {
    status: "OBSERVED DUPLICATE",
    meaning: "The same idea is built more than once.",
    readAs: "Evidence, recorded without a winner.",
  },
  {
    status: "INSTALLED BUT UNUSED",
    meaning: "Present in the project, imported nowhere.",
    readAs: "Evidence of absence.",
  },
  {
    status: "POSSIBLY UNUSED",
    meaning: "Available with little or no adoption found.",
    readAs: "Evidence, stated cautiously.",
  },
  {
    status: "UNOWNED AREA",
    meaning: "A recurring relationship with no component owner.",
    readAs: "Evidence of a gap.",
  },
  {
    status: "GOVERNANCE RULE",
    meaning: "A rule about how the system should be treated.",
    readAs: "A rule, not a measurement.",
  },
  {
    status: "FUTURE CANONICAL TARGET",
    meaning: "A proposed relationship.",
    readAs: "Does not exist.",
  },
  {
    status: "FUTURE OPPORTUNITY",
    meaning: "A possible improvement with no proposal attached.",
    readAs: "Does not exist.",
  },
  {
    status: "FUTURE FIGMA ORGANIZATION",
    meaning: "A proposed design-file arrangement.",
    readAs: "Does not exist.",
  },
  {
    status: "FUTURE MIGRATION",
    meaning: "Work a future approved phase could do.",
    readAs: "Has not started.",
  },
  {
    status: "FUTURE DECISION",
    meaning: "Evidence is insufficient to state the relationship.",
    readAs: "Unanswered on purpose.",
  },
];
