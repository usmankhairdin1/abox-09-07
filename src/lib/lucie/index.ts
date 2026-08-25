/**
 * Lucie Traceability and Delivery Spine v0.1 — public API.
 *
 * Everything the spine renders is derived from the controlling registers.
 * No route may hardcode scope, posture or IDs.
 */

import { CAPABILITIES, type Capability } from "./capabilities";
import { GATES, type Gate } from "./gates";
import { MODULE_SLICES, type ModuleSlice } from "./module-slices";
import { OPEN_ITEMS, type OpenItem } from "./open-items";
import { RECONCILIATION, type ReconciliationEntry } from "./reconciliation";
import { SEAMS, type Seam } from "./seams";
import { SLICES, type VerticalSlice } from "./slices";
import { SURFACES, type LucieSurface } from "./surfaces";
import { WORKSTREAMS, type Workstream } from "./workstreams";

export * from "./assumptions";
export * from "./authority";
export * from "./capabilities";
export * from "./decisions";
export * from "./gates";
export * from "./ia-acl";
export * from "./ia-config";
export * from "./ia-control-records";
export * from "./ia-delta";
export * from "./ia-module-map";
export * from "./ia-objects";
export * from "./ia-screens";
export * from "./ia-workspace-matrix";
export * from "./module-slices";
export * from "./module1";
export * from "./open-items";
export * from "./pathways";
export * from "./reconciliation";
export * from "./risks";
export * from "./roles";
export * from "./seams";
export * from "./slices";
export * from "./sources";
export * from "./states";
export * from "./surfaces";
export * from "./terminology";
export * from "./workstreams";

/** Registers are comma/semicolon-delimited in the source CSVs. */
export function idList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const SPINE_VERSION = "Lucie Traceability and Delivery Spine v0.1";

export const COUNTS = {
  capabilities: CAPABILITIES.length,
  surfaces: SURFACES.length,
  modules: MODULE_SLICES.length,
  workstreams: WORKSTREAMS.length,
  slices: SLICES.length,
  seams: SEAMS.length,
  gates: GATES.length,
  openItems: OPEN_ITEMS.length,
  legacyScreens: RECONCILIATION.length,
};

export const CAPABILITY_BY_ID: Record<string, Capability> = Object.fromEntries(
  CAPABILITIES.map((c) => [c.capabilityId, c]),
);

export const SURFACE_BY_ID: Record<string, LucieSurface> = Object.fromEntries(
  SURFACES.map((s) => [s.lucieSurfaceId, s]),
);

export const MODULE_BY_ID: Record<string, ModuleSlice> = Object.fromEntries(
  MODULE_SLICES.map((m) => [m.moduleId, m]),
);

export const WORKSTREAM_BY_ID: Record<string, Workstream> = Object.fromEntries(
  WORKSTREAMS.map((w) => [w.workstreamId, w]),
);

export const SEAM_BY_ID: Record<string, Seam> = Object.fromEntries(
  SEAMS.map((s) => [s.seamId, s]),
);

export const GATE_BY_ID: Record<string, Gate> = Object.fromEntries(GATES.map((g) => [g.gateId, g]));

export const SLICE_BY_ID: Record<string, VerticalSlice> = Object.fromEntries(
  SLICES.map((s) => [s.id, s]),
);

export const RECONCILIATION_BY_ID: Record<string, ReconciliationEntry> = Object.fromEntries(
  RECONCILIATION.map((r) => [r.legacyId, r]),
);

/** Capabilities in a delivery lane. */
export function capabilitiesForWorkstream(workstreamId: string): Capability[] {
  return CAPABILITIES.filter((c) => idList(c.workstream).includes(workstreamId));
}

/** Capabilities owned by a canonical module. */
export function capabilitiesForModule(moduleId: string): Capability[] {
  return CAPABILITIES.filter((c) => idList(c.canonicalModules).includes(moduleId));
}

/** Surfaces owned by a canonical module. */
export function surfacesForModule(moduleId: string): LucieSurface[] {
  return SURFACES.filter((s) => idList(s.canonicalModules).includes(moduleId));
}

/** Surfaces belonging to a workspace. */
export function surfacesForWorkspace(workspaceId: string): LucieSurface[] {
  return SURFACES.filter((s) => s.workspaceId === workspaceId);
}

/** Vertical slices that touch a surface. */
export function slicesForSurface(surfaceId: string): VerticalSlice[] {
  return SLICES.filter((s) => s.surfaces.includes(surfaceId));
}

/** Legacy wireframes reconciled onto a surface. */
export function legacyForSurface(surfaceId: string): ReconciliationEntry[] {
  return RECONCILIATION.filter((r) => r.surfaces.includes(surfaceId));
}

/** Open items that block a stage. */
export function openItemsForStage(stage: string): OpenItem[] {
  return OPEN_ITEMS.filter((o) => o.blockingStage.toLowerCase().includes(stage.toLowerCase()));
}

export const WORKSPACE_IDS = Array.from(new Set(SURFACES.map((s) => s.workspaceId))).sort();

export const SURFACE_POSTURES = Array.from(new Set(SURFACES.map((s) => s.luciePosture))).sort();

/**
 * Traceability row: the spine's atomic unit. Every capability resolves to
 * lane, canonical modules, surfaces and gate.
 */
export interface TraceRow {
  capabilityId: string;
  capability: string;
  domain: string;
  posture: string;
  workstreams: string[];
  modules: string[];
  surfaces: string[];
  seams: string[];
  gate: string;
  boundary: string;
}

export const TRACE_ROWS: TraceRow[] = CAPABILITIES.map((c) => {
  const modules = idList(c.canonicalModules);
  const surfaces = SURFACES.filter((s) =>
    idList(s.canonicalModules).some((m) => modules.includes(m)),
  ).map((s) => s.lucieSurfaceId);
  const seams = SEAMS.filter((s) => modules.includes(s.moduleId)).map((s) => s.seamId);
  return {
    capabilityId: c.capabilityId,
    capability: c.capability,
    domain: c.domain,
    posture: c.luciePosture,
    workstreams: idList(c.workstream),
    modules,
    surfaces,
    seams,
    gate: c.releaseGate,
    boundary: c.explicitBoundary,
  };
});

/** Coverage integrity checks — rendered rather than asserted in prose. */
export interface CoverageCheck {
  id: string;
  check: string;
  status: "pass" | "attention";
  detail: string;
}

export const COVERAGE_CHECKS: CoverageCheck[] = (() => {
  const checks: CoverageCheck[] = [];

  const orphanCaps = TRACE_ROWS.filter((r) => r.modules.length === 0);
  checks.push({
    id: "CHK-01",
    check: "Every Lucie capability carries at least one canonical module ID",
    status: orphanCaps.length === 0 ? "pass" : "attention",
    detail:
      orphanCaps.length === 0
        ? `${TRACE_ROWS.length} capabilities mapped to M00–M26.`
        : `${orphanCaps.length} unmapped: ${orphanCaps.map((r) => r.capabilityId).join(", ")}`,
  });

  const noLane = TRACE_ROWS.filter((r) => r.workstreams.length === 0);
  checks.push({
    id: "CHK-02",
    check: "Every capability sits in a delivery lane",
    status: noLane.length === 0 ? "pass" : "attention",
    detail:
      noLane.length === 0
        ? `All capabilities assigned across ${WORKSTREAMS.length} workstreams.`
        : `${noLane.length} without a workstream: ${noLane.map((r) => r.capabilityId).join(", ")}`,
  });

  const unknownSurface = SLICES.flatMap((s) => s.surfaces).filter((id) => !SURFACE_BY_ID[id]);
  checks.push({
    id: "CHK-03",
    check: "Slice surface references resolve to the Lucie surface baseline",
    status: unknownSurface.length === 0 ? "pass" : "attention",
    detail:
      unknownSurface.length === 0
        ? `${SLICES.length} slices reference only baseline surface IDs.`
        : `Unresolved: ${Array.from(new Set(unknownSurface)).join(", ")}`,
  });

  const unknownRecon = RECONCILIATION.flatMap((r) => r.surfaces).filter((id) => !SURFACE_BY_ID[id]);
  checks.push({
    id: "CHK-04",
    check: "Reconciled legacy wireframes point at real IA v2.0 surfaces",
    status: unknownRecon.length === 0 ? "pass" : "attention",
    detail:
      unknownRecon.length === 0
        ? `${RECONCILIATION.length} legacy screens dispositioned with valid surface IDs.`
        : `Unresolved: ${Array.from(new Set(unknownRecon)).join(", ")}`,
  });

  const unknownSeam = RECONCILIATION.flatMap((r) => r.seams).filter((id) => !SEAM_BY_ID[id]);
  checks.push({
    id: "CHK-05",
    check: "Excluded legacy wireframes name a real protected seam",
    status: unknownSeam.length === 0 ? "pass" : "attention",
    detail:
      unknownSeam.length === 0
        ? `Seam references resolve against the ${SEAMS.length}-entry seam register.`
        : `Unresolved: ${Array.from(new Set(unknownSeam)).join(", ")}`,
  });

  const wireframeRequired = SURFACES.filter((s) => /yes/i.test(s.wireframeRequired));
  const covered = wireframeRequired.filter((s) => legacyForSurface(s.lucieSurfaceId).length > 0);
  checks.push({
    id: "CHK-06",
    check: "Wireframe-required surfaces with an existing legacy antecedent",
    status: "attention",
    detail: `${covered.length} of ${wireframeRequired.length} wireframe-required surfaces have a reconciled legacy screen. The remainder need new wireframes in a later pass.`,
  });

  return checks;
})();
