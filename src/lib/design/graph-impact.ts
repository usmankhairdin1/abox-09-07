/**
 * Phase 9 — change-impact model.
 *
 * DOCUMENTATION ONLY. Impact is derived from the graph edges, not written by
 * hand, so the model cannot disagree with the graph. Where impact cannot be
 * determined safely the record says so.
 */
import type { ImpactRecord } from "./graph-types";

/**
 * Seed questions. The reachable layers on each record are computed by
 * `graph-registry.ts` by walking the edges forward from the starting node.
 */
export const IMPACT_QUESTIONS: {
  change: string;
  startNode: string;
  confidence: ImpactRecord["confidence"];
  status: ImpactRecord["status"];
  note?: string;
}[] = [
  {
    change: "The primary action colour changes",
    startNode: "fnd.color",
    confidence: "evidenced",
    status: "CURRENT IMPLEMENTATION",
    note: "Reaches both action paths, so 22 Button files and 35 ACTION_PILL files are in scope together.",
  },
  {
    change: "The focus ring treatment changes",
    startNode: "role.focus",
    confidence: "partial",
    status: "FUTURE DECISION",
    note: "Several primitives set their own ring, so the graph cannot prove it reaches every control.",
  },
  {
    change: "The status tone vocabulary changes",
    startNode: "role.status-tone",
    confidence: "evidenced",
    status: "OBSERVED OVERLAP",
    note: "Four component roles read it; StatusBadge alone appears in 89 files.",
  },
  {
    change: "A metal tier colour changes",
    startNode: "fnd.tier",
    confidence: "evidenced",
    status: "CURRENT IMPLEMENTATION",
    note: "Reaches plan tiles, plan detail and the tier filters, which reuse the same badge treatment.",
  },
  {
    change: "The Button component API changes",
    startNode: "cmp.button",
    confidence: "evidenced",
    status: "CURRENT IMPLEMENTATION",
    note: "22 direct files plus indirect use through overlay primitives.",
  },
  {
    change: "The ACTION_PILL class strings change",
    startNode: "cmp.action-pill",
    confidence: "evidenced",
    status: "CURRENT IMPLEMENTATION",
    note: "35 files and 82 references, spanning web, marketplace and dashboard screens.",
  },
  {
    change: "PageHeader changes",
    startNode: "cmp.page-header",
    confidence: "evidenced",
    status: "OBSERVED DUPLICATE",
    note: "25 files, but two other header implementations would be unaffected — which is itself the risk.",
  },
  {
    change: "DataTable changes",
    startNode: "cmp.data-table",
    confidence: "partial",
    status: "OBSERVED DUPLICATE",
    note: "20 files change; the primitive table and route-local tables do not, so screens can drift apart.",
  },
  {
    change: "The container width changes",
    startNode: "role.container",
    confidence: "evidenced",
    status: "CURRENT IMPLEMENTATION",
    note: "23 occurrences across web-experience routes; dashboards are unaffected by design.",
  },
  {
    change: "Card padding is standardised",
    startNode: "crole.card-surface",
    confidence: "partial",
    status: "FUTURE DECISION",
    note: "p-5 dominates at 187 occurrences but is not universal, so the affected set cannot be enumerated safely.",
  },
  {
    change: "A spacing step changes",
    startNode: "role.rhythm",
    confidence: "not-determinable",
    status: "UNOWNED AREA",
    note: "Spacing is chosen per call site; the graph cannot enumerate consumers from imports.",
  },
  {
    change: "The disabled treatment becomes token-based",
    startNode: "role.disabled",
    confidence: "not-determinable",
    status: "FUTURE DECISION",
    note: "No role exists today, so nothing can be traced.",
  },
  {
    change: "A shell changes its navigation",
    startNode: "shell.internal",
    confidence: "evidenced",
    status: "CURRENT IMPLEMENTATION",
    note: "89 files sit inside the internal shell; the other two shells are untouched.",
  },
  {
    change: "A runtime brand value changes",
    startNode: "scr.branding",
    confidence: "evidenced",
    status: "GOVERNANCE RULE",
    note: "Affects rendered output through the role it fills. It changes no token, component or pattern.",
  },
];
