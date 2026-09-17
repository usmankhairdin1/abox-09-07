/**
 * Phase 11 — readiness registry.
 *
 * DOCUMENTATION ONLY. The single Phase 11 assembly point. It joins by id to the
 * Phase 8 component specification, the Phase 9 dependency graph and the Phase 10
 * pattern registry. It declares no components, screens, foundations, patterns
 * or edges of its own, and it builds no second graph.
 */
import { ALL_SPECS } from "./spec-registry";
import { nodeName, nodeLayer, reachableFrom, GRAPH_NODES } from "./graph-registry";
import { PATTERN_SPECS } from "./pattern-registry";
import { CANONICAL_CANDIDATES } from "./canonical-candidates";
import { DECISION_REGISTER } from "./canonical-decision-register";
import { CANONICAL_BOUNDARIES } from "./canonical-boundaries";
import { CHANGE_GOVERNANCE } from "./change-governance";
import { MIGRATION_STAGES } from "./migration-readiness";
import { REGRESSION_CONTRACT } from "./regression-contract";
import { FIGMA_READINESS } from "./figma-readiness";
import { LIBRARY_GROUPS } from "./figma-library-readiness";
import { NAMING_READINESS } from "./naming-readiness";
import { ACCESSIBILITY_READINESS } from "./accessibility-readiness";
import { CONTENT_READINESS } from "./content-readiness";
import { EXPERIENCE_READINESS } from "./experience-readiness";
import type { ReadinessRecord, ReadinessState } from "./canonical-readiness-types";

/**
 * Subject-level readiness. Every id below is a Phase 9 graph node id or a Phase
 * 10 pattern id, so the registry cannot describe something the earlier phases
 * do not know about — the integrity check below proves it.
 */
export const READINESS_RECORDS: ReadinessRecord[] = [
  {
    id: "pat.page-header",
    subjectType: "pattern",
    subject: "Page header pattern",
    currentImplementation: "PageHeader with default and compact variants.",
    currentConsumers: "25 files",
    ownership: "design-system",
    evidence: "src/components/abox/page-header.tsx; Phase 10 anatomy and variant records.",
    observedVariations: ["Marketing section headings", "Internal shell masthead"],
    duplicateRelationships: ["dec.screen-header"],
    dependencies: ["typography roles", "spacing roles", "hairline token"],
    accessibilityReadiness: "Heading level is set by the consumer; no rule recorded.",
    responsiveReadiness: "Type steps at md; recorded in Phase 10.",
    contentReadiness: "Required title, optional eyebrow, description, icon and actions.",
    namingReadiness: "Name collides conceptually with two unowned placements.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "Used across admin, shopping and member; marketing opts out.",
    figmaReadiness: "PARTIAL",
    governanceStatus: "OBSERVED DUPLICATE",
    unresolvedDecisions: ["dec.screen-header"],
    requiredApprovals: ["design system owner", "experience owner"],
    migrationRisk: "broad — many consumers",
    readiness: "BLOCKED BY DUPLICATE",
  },
  {
    id: "pat.filter-results",
    subjectType: "pattern",
    subject: "Filter and results pattern",
    currentImplementation:
      "Filter rail above lg with a dialog below lg, compact header with count and sort, results list.",
    currentConsumers: "plans route",
    ownership: "business",
    evidence:
      "src/routes/plans.index.tsx rail, trigger and overlay at line 374; results grid at line 345.",
    observedVariations: ["Route-local overlay rather than the Dialog primitive"],
    duplicateRelationships: ["dec.overlay"],
    dependencies: ["StatusBadge", "MetalBadge", "PageHeader compact"],
    accessibilityReadiness:
      "Selection is carried by aria-pressed, including where the visible ring was removed.",
    responsiveReadiness: "Fully transcribed at lg.",
    contentReadiness: "Count, sort and filter groups defined.",
    namingReadiness: "No conflict.",
    foundationReadiness: "Uses tone and tier tokens at full opacity.",
    experienceReadiness: "Shopping only.",
    figmaReadiness: "PARTIAL",
    governanceStatus: "CURRENT IMPLEMENTATION",
    unresolvedDecisions: ["dec.overlay"],
    requiredApprovals: ["design system owner", "accessibility review"],
    migrationRisk: "isolated — single consumer",
    readiness: "NEEDS TECHNICAL DECISION",
  },
  {
    id: "pat.table-screen",
    subjectType: "pattern",
    subject: "Table screen pattern",
    currentImplementation: "DataTable, the table primitive and route-local tables.",
    currentConsumers: "20 files plus route-local screens",
    ownership: "design-system",
    evidence: "src/components/abox/data-table.tsx at min-w-[640px], text-sm, px-5 py-4.",
    observedVariations: ["Cell padding", "Empty-row handling", "Labelling"],
    duplicateRelationships: ["dec.table"],
    dependencies: ["spacing roles", "typography roles", "hairline token"],
    accessibilityReadiness: "Real table markup; labelling is inconsistent across implementations.",
    responsiveReadiness: "Horizontal scroll only; no restructure.",
    contentReadiness: "Headers, rows and empty message; error and loading absent.",
    namingReadiness: "DataTable collides with the Table primitive.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "Admin and member.",
    figmaReadiness: "BLOCKED",
    governanceStatus: "OBSERVED DUPLICATE",
    unresolvedDecisions: ["dec.table", "dec.control-height"],
    requiredApprovals: ["design system owner", "engineering review"],
    migrationRisk: "broad — many consumers",
    readiness: "BLOCKED BY DUPLICATE",
  },
  {
    id: "pat.kpi-grid",
    subjectType: "pattern",
    subject: "Metric group pattern",
    currentImplementation: "KpiCard in a grid, with default, primary, sage and warning tones.",
    currentConsumers: "18 files",
    ownership: "design-system",
    evidence: "src/components/abox/kpi-card.tsx.",
    observedVariations: ["Grid column counts differ by screen"],
    duplicateRelationships: [],
    dependencies: ["tone roles", "card padding"],
    accessibilityReadiness: "No specific concerns recorded.",
    responsiveReadiness: "Column count only.",
    contentReadiness: "Label and value required; delta, hint and icon optional.",
    namingReadiness: "KPI is an internal abbreviation.",
    foundationReadiness: "Bound to tone tokens.",
    experienceReadiness: "Admin primarily.",
    figmaReadiness: "PARTIAL",
    governanceStatus: "CURRENT IMPLEMENTATION",
    unresolvedDecisions: ["dec.card-padding"],
    requiredApprovals: ["design system owner"],
    migrationRisk: "no migration implied",
    readiness: "READY FOR FUTURE DECISION",
  },
  {
    id: "pat.cart-summary",
    subjectType: "pattern",
    subject: "Cart summary pattern",
    currentImplementation: "Coverage list beside a summary card with add-ons and total.",
    currentConsumers: "cart route",
    ownership: "business",
    evidence: "src/routes/cart.tsx; add-ons section; total without the word Illustrative.",
    observedVariations: ["Stacks at lg where member settings stacks at md"],
    duplicateRelationships: ["dec.stacking-breakpoint"],
    dependencies: ["PlanCard", "CarrierMark", "premium formatting"],
    accessibilityReadiness: "No specific gaps recorded.",
    responsiveReadiness: "Split above lg, stacked below.",
    contentReadiness: "Coverage rows, add-ons, total and continue action defined.",
    namingReadiness: "No conflict.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "Shopping only.",
    figmaReadiness: "PARTIAL",
    governanceStatus: "CURRENT IMPLEMENTATION",
    unresolvedDecisions: ["dec.stacking-breakpoint"],
    requiredApprovals: ["design system owner", "experience owner"],
    migrationRisk: "isolated — single consumer",
    readiness: "NEEDS DESIGN DECISION",
  },
  {
    id: "pat.navigation",
    subjectType: "pattern",
    subject: "Navigation pattern",
    currentImplementation: "Three shells implement navigation independently.",
    currentConsumers: "89, 30 and member routes",
    ownership: "business",
    evidence: "internal-shell.tsx, marketplace-shell.tsx, member-shell.tsx.",
    observedVariations: ["Collapse breakpoint", "Account control treatment", "Search presence"],
    duplicateRelationships: ["dec.shells"],
    dependencies: ["shared tokens", "icon set"],
    accessibilityReadiness: "Landmarks present; icon-only controls named case by case.",
    responsiveReadiness: "Each shell collapses at its own breakpoint.",
    contentReadiness: "Destinations and account content defined per shell.",
    namingReadiness: "No conflict; three distinct names for three frames.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "One shell per audience.",
    figmaReadiness: "FUTURE DECISION",
    governanceStatus: "OBSERVED OVERLAP",
    unresolvedDecisions: ["dec.shells"],
    requiredApprovals: ["product owner", "design system owner", "engineering review"],
    migrationRisk: "cross-experience",
    readiness: "BLOCKED BY EXPERIENCE VARIATION",
  },
  {
    id: "pat.empty-loading-error",
    subjectType: "pattern",
    subject: "Absent-content presentation",
    currentImplementation:
      "EmptyState covers empty; skeletons cover some loading; error is written per route.",
    currentConsumers: "10 files and 4 files respectively",
    ownership: "none",
    evidence: "src/components/abox/empty-state.tsx; src/components/ui/skeleton.tsx.",
    observedVariations: ["Inline empty messages on some screens"],
    duplicateRelationships: ["dec.loading-error-owner"],
    dependencies: ["typography roles", "icon set"],
    accessibilityReadiness: "Announcement behaviour varies because error has no shared surface.",
    responsiveReadiness: "No responsive behaviour recorded.",
    contentReadiness: "Empty defined; loading and error unknown.",
    namingReadiness: "No conflict.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "All four experiences are affected.",
    figmaReadiness: "BLOCKED",
    governanceStatus: "UNOWNED AREA",
    unresolvedDecisions: ["dec.loading-error-owner"],
    requiredApprovals: ["design system owner", "product owner"],
    migrationRisk: "unknown until decided",
    readiness: "NEEDS OWNER",
  },
  {
    id: "pat.status-tier",
    subjectType: "pattern",
    subject: "Status and tier badges",
    currentImplementation:
      "StatusBadge and MetalBadge with tone and tier tokens, full opacity, accessible foregrounds.",
    currentConsumers: "89 files",
    ownership: "design-system",
    evidence: "Metal tokens including Expanded Bronze; filter chips reuse the listing treatments.",
    observedVariations: [],
    duplicateRelationships: [],
    dependencies: ["tone roles", "tier roles"],
    accessibilityReadiness: "Foregrounds are chosen for contrast against each background.",
    responsiveReadiness: "None required.",
    contentReadiness: "Label only.",
    namingReadiness: "Two names for one visual concept.",
    foundationReadiness: "Fully token-bound.",
    experienceReadiness: "Used across all experiences.",
    figmaReadiness: "READY",
    governanceStatus: "CURRENT IMPLEMENTATION",
    unresolvedDecisions: [],
    requiredApprovals: ["design system owner"],
    migrationRisk: "no migration implied",
    readiness: "READY FOR FUTURE DECISION",
  },
  {
    id: "pat.hero",
    subjectType: "experience-pattern",
    subject: "Marketing hero",
    currentImplementation: "Viewport-aware hero with centred content and product entry pills.",
    currentConsumers: "landing route",
    ownership: "business",
    evidence: "src/routes/index.tsx min-h calc and centred flex layout.",
    observedVariations: ["Hero pill height differs from the shared pill"],
    duplicateRelationships: ["cand.action-pill"],
    dependencies: ["action pills", "typography roles", "88rem container"],
    accessibilityReadiness: "No gaps recorded.",
    responsiveReadiness: "Four headline steps across breakpoints.",
    contentReadiness: "Headline, paragraph and pills defined.",
    namingReadiness: "No conflict.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "Marketing only.",
    figmaReadiness: "PARTIAL",
    governanceStatus: "OBSERVED VARIATION",
    unresolvedDecisions: ["dec.control-height"],
    requiredApprovals: ["experience owner"],
    migrationRisk: "isolated — single consumer",
    readiness: "NEEDS DESIGN DECISION",
  },
  {
    id: "pat.dialog-drawer",
    subjectType: "pattern",
    subject: "Overlay surfaces",
    currentImplementation: "Dialog primitive plus a route-local filter overlay.",
    currentConsumers: "4 files plus one route",
    ownership: "design-system",
    evidence: "src/components/ui/dialog.tsx; plans route overlay.",
    observedVariations: ["Focus trapping", "Close affordance", "Animation"],
    duplicateRelationships: ["dec.overlay"],
    dependencies: ["surface tokens", "motion"],
    accessibilityReadiness:
      "The primitive announces; the route-local overlay is outside that coverage.",
    responsiveReadiness: "The route-local overlay exists only below lg.",
    contentReadiness: "Defined for the primitive.",
    namingReadiness: "No conflict.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "Admin and shopping.",
    figmaReadiness: "PARTIAL",
    governanceStatus: "OBSERVED VARIATION",
    unresolvedDecisions: ["dec.overlay"],
    requiredApprovals: ["design system owner", "accessibility review"],
    migrationRisk: "isolated — single consumer",
    readiness: "NEEDS TECHNICAL DECISION",
  },
  {
    id: "pat.form-layout",
    subjectType: "pattern",
    subject: "Form layout",
    currentImplementation: "Primitive fields plus independent M06 and M08 kit fields.",
    currentConsumers: "primitives in 5 to 7 files each, plus two kits",
    ownership: "route",
    evidence: "Phase 5 and Phase 8 route-kit records.",
    observedVariations: ["Label placement", "Help and error text", "Validation wiring"],
    duplicateRelationships: ["dec.form-field"],
    dependencies: ["control sizing", "typography roles"],
    accessibilityReadiness: "Labelling consistency depends on the field decision.",
    responsiveReadiness: "Column counts differ per kit.",
    contentReadiness: "No shared error or help model.",
    namingReadiness: "No collision, but three parallel vocabularies.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "Admin governed modules.",
    figmaReadiness: "BLOCKED",
    governanceStatus: "OBSERVED DUPLICATE",
    unresolvedDecisions: ["dec.form-field", "dec.control-height"],
    requiredApprovals: ["design system owner", "product owner", "accessibility review"],
    migrationRisk: "broad — many consumers",
    readiness: "BLOCKED BY DUPLICATE",
  },
  {
    id: "pat.wizard",
    subjectType: "pattern",
    subject: "Stepped flow",
    currentImplementation: "Downline wizard stepper at px-2.5 py-1.5 text-xs.",
    currentConsumers: "downline flow",
    ownership: "business",
    evidence: "src/components/abox/downline-wizard-stepper.tsx.",
    observedVariations: ["Its own density, smaller than other controls"],
    duplicateRelationships: [],
    dependencies: ["tone roles", "typography roles"],
    accessibilityReadiness: "Step state communication is not documented.",
    responsiveReadiness: "Not recorded.",
    contentReadiness: "Step labels only.",
    namingReadiness: "Named for its flow rather than the pattern.",
    foundationReadiness: "Bound to existing tokens.",
    experienceReadiness: "Admin only.",
    figmaReadiness: "PARTIAL",
    governanceStatus: "CURRENT IMPLEMENTATION",
    unresolvedDecisions: [],
    requiredApprovals: ["design system owner"],
    migrationRisk: "isolated — single consumer",
    readiness: "NEEDS EVIDENCE",
    note: "One consumer only; a second would be needed before this is treated as a shared pattern.",
  },
];

/** Everything Phase 11 knows about one subject, plus its Phase 8/9/10 records. */
export function readinessFor(id: string) {
  return {
    readiness: READINESS_RECORDS.find((r) => r.id === id),
    graphNode: GRAPH_NODES.find((n) => n.id === id),
    layer: nodeLayer(id),
    patternSpec: PATTERN_SPECS.find((p) => p.id === id),
    componentSpec: ALL_SPECS.find((s) => s.name === nodeName(id)),
    decisions: DECISION_REGISTER.filter((d) =>
      READINESS_RECORDS.find((r) => r.id === id)?.unresolvedDecisions.includes(d.id),
    ),
    reach: reachableFrom(id).map(nodeName),
  };
}

/** Which open decisions block a given subject. */
export function decisionsBlocking(id: string) {
  const record = READINESS_RECORDS.find((r) => r.id === id);
  if (!record) return [];
  return DECISION_REGISTER.filter((d) => record.unresolvedDecisions.includes(d.id));
}

/** Decisions that must be settled before a Figma library could be built. */
export function figmaBlockers() {
  return DECISION_REGISTER.filter((d) => d.blocksFigma);
}

function countBy(states: ReadinessState[]) {
  return states.reduce<Record<string, number>>((acc, s) => {
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
}

export const READINESS_STATE_COUNTS = countBy(READINESS_RECORDS.map((r) => r.readiness));

export const READINESS_SUMMARY = {
  subjects: READINESS_RECORDS.length,
  candidates: CANONICAL_CANDIDATES.length,
  openDecisions: DECISION_REGISTER.length,
  decisionsBlockingFigma: figmaBlockers().length,
  decisionsRequiringMigration: DECISION_REGISTER.filter((d) => d.requiresProductionMigration)
    .length,
  boundaries: CANONICAL_BOUNDARIES.length,
  governanceLayers: CHANGE_GOVERNANCE.length,
  migrationStages: MIGRATION_STAGES.length,
  regressionClauses: REGRESSION_CONTRACT.length,
  figmaAreas: FIGMA_READINESS.length,
  figmaReady: FIGMA_READINESS.filter((a) => a.readiness === "READY").length,
  figmaPartial: FIGMA_READINESS.filter((a) => a.readiness === "PARTIAL").length,
  figmaBlocked: FIGMA_READINESS.filter((a) => a.readiness === "BLOCKED").length,
  libraryGroups: LIBRARY_GROUPS.length,
  libraryGroupsJustified: LIBRARY_GROUPS.filter((g) => g.justified).length,
  namingRecords: NAMING_READINESS.length,
  accessibilityAreas: ACCESSIBILITY_READINESS.length,
  contentSubjects: CONTENT_READINESS.length,
  experiences: EXPERIENCE_READINESS.length,
  decisionsSelected: 0,
  migrationsPerformed: 0,
  figmaAssetsCreated: 0,
};

/** Surfaces any readiness subject the earlier phases do not know about. */
export const READINESS_INTEGRITY = {
  subjectsWithoutGraphNode: READINESS_RECORDS.filter(
    (r) => !GRAPH_NODES.some((n) => n.id === r.id),
  ).map((r) => r.id),
  candidatesWithoutEvidence: CANONICAL_CANDIDATES.filter((c) => c.evidence.trim().length === 0).map(
    (c) => c.id,
  ),
  decisionsWithoutOptions: DECISION_REGISTER.filter((d) => d.options.length === 0).map((d) => d.id),
};

export const REGISTRY_SOURCE_RULES: string[] = [
  "CURRENT IMPLEMENTATION — Phase 11 adds readiness and governance records only; components come from Phase 8, relationships from Phase 9 and patterns from Phase 10.",
  "CURRENT IMPLEMENTATION — every readiness subject is keyed to an existing graph node, and the integrity check reports any that is not.",
  "GOVERNANCE RULE — no second graph, component inventory, screen inventory or foundation inventory exists in this phase.",
  "GOVERNANCE RULE — this module is imported only by /design-system and /design-guide.",
  "FUTURE DECISION — zero decisions have been selected, zero migrations performed and zero Figma assets created.",
];
