/**
 * Lucie disposition lookup for the legacy wireframe estate.
 *
 * The /m1, /p1 and /hf estates were produced against Phase 1 IA v1.0. IA v2.0
 * plus the Lucie Release control what is actually in scope, so every legacy
 * screen must render its current disposition rather than silently reading as
 * "implemented". This module is the single lookup used by all three estates.
 */
import {
  P1_GROUP_DISPOSITIONS,
  RECONCILIATION_BY_ID,
  type Disposition,
} from "@/lib/lucie";

export interface DispositionInfo {
  disposition: Disposition;
  note: string;
  surfaces: string[];
  seams: string[];
  /** Where the disposition came from: a screen row or a group-level row. */
  basis: "screen" | "group";
  groupName?: string;
}

/** Screen-level disposition (M1 low-fi UX-### and higher-fidelity HF-##). */
export function dispositionForScreen(legacyId: string): DispositionInfo | undefined {
  const entry = RECONCILIATION_BY_ID[legacyId];
  if (!entry) return undefined;
  return {
    disposition: entry.disposition,
    note: entry.note,
    surfaces: entry.surfaces,
    seams: entry.seams,
    basis: "screen",
  };
}

/** Group-level disposition for the broader Phase 1 low-fidelity set. */
export function dispositionForGroup(group: string): DispositionInfo | undefined {
  const entry = P1_GROUP_DISPOSITIONS.find((g) => g.group === group);
  if (!entry) return undefined;
  return {
    disposition: entry.disposition,
    note: entry.note,
    surfaces: entry.surfaces,
    seams: entry.seams,
    basis: "group",
    groupName: entry.group,
  };
}

export const DISPOSITION_LABEL: Record<Disposition, string> = {
  reconciled: "Reconciled to IA v2.0",
  excluded: "Excluded from Lucie",
  "out-of-scope": "Outside Lucie delivery depth",
};

export const DISPOSITION_MEANING: Record<Disposition, string> = {
  reconciled:
    "This legacy screen maps onto live Lucie surface IDs. Treat it as an antecedent for the IA v2.0 surface, not as the delivered surface.",
  excluded:
    "The capability behind this screen sits behind an excluded module or protected seam. It is historical only and must never be presented as in scope or implemented.",
  "out-of-scope":
    "The screen is inside ABox but outside the depth Lucie delivers. It stays visible for continuity and carries no delivery commitment.",
};
