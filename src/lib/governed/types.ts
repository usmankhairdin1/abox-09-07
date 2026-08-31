/**
 * Shared shape for controlled Lucie build-packet modules (M00, M04, M05).
 *
 * The per-module index files in this folder are generated from each packet's
 * machine-readable registers. Stable IDs (SCR, FLOW, REQ, AC, PMI, PDM) are the
 * evidence anchors and must never be renamed, renumbered, reused or removed.
 */

export interface GovernedWorkspace {
  workspace_id: string;
  code: string;
  name: string;
  actors: string[];
  default_screen: string;
  purpose: string;
}

export interface GovernedScreen {
  id: string;
  slug: string;
  module: string;
  name: string;
  workspace: string;
  route: string;
  roles: string[];
  purpose: string;
  sections: string[];
  actions: string[];
  states: string[];
  requirements: string[];
  responsive: string;
  localization: string;
  accessibility: string;
  status: string;
  capability: string;
}

export interface GovernedFlow {
  id: string;
  slug: string;
  module: string;
  name: string;
  summary: string;
  screens: string[];
  languages: string[];
  accessibility: string;
  status: string;
}

export interface GovernedModuleIndex {
  module: string;
  version: string;
  meta: {
    document_control?: Record<string, unknown>;
    summary_metrics?: Record<string, number>;
  };
  workspaces: GovernedWorkspace[];
  screens: GovernedScreen[];
  flows: GovernedFlow[];
}

/** One row of any controlled CSV register, loaded lazily from /registers. */
export type RegisterRow = Record<string, string>;

export interface RegisterPayload {
  meta: {
    document_control?: Record<string, unknown>;
    summary_metrics?: Record<string, number>;
    workspaces?: GovernedWorkspace[];
  };
  registers: Record<string, RegisterRow[]>;
}
