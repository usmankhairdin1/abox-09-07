/**
 * Broader Phase 1 wireframe inventory — everything beyond active Module 1.
 *
 * Source hierarchy (locked earlier): North Star > Phase 1 Blueprint >
 * Phase 1 IA Handoff Package > Module 1 V4 Hardening > Module 1 Reconciliation.
 *
 * Nothing in this set changes active Module 1. Module 1 screens live in
 * src/lib/m1.ts and are referenced read-only where a seam exists.
 */

export type P1Group =
  | "Off-exchange enrollment"
  | "Form configurator"
  | "Products, plans & rates"
  | "Agency & agent management"
  | "Appointments, paper, referrals & splits"
  | "Commissions & revenue"
  | "Notifications, comms & scheduling"
  | "Outputs, documents & reporting"
  | "AI, Plan-O & governance"
  | "Admin, configuration, integrations & audit";

/** Which future packet the screen belongs to, per the reconciliation package. */
export type P1Packet = "M2-Cand" | "P1-Later";

export type ZoneKind =
  | "fields"
  | "list"
  | "table"
  | "tabs"
  | "cards"
  | "actions"
  | "box"
  | "tree"
  | "editor"
  | "checks"
  | "timeline"
  | "kv";

export interface P1Zone {
  title: string;
  id: string;
  kind: ZoneKind;
  items?: string[];
  note?: string;
  /** Full-width zone in the two-column canvas grid. */
  wide?: boolean;
}

export interface P1Screen {
  id: string;
  slug: string;
  name: string;
  group: P1Group;
  workspace: string;
  module: string;
  packet: P1Packet;
  shell: "internal" | "consumer";
  user: string;
  purpose: string;
  actions: string[];
  objects: string[];
  config: string[];
  acl: string[];
  drawer: string[];
  assistant: string;
  source: string;
  assumptions: string[];
  canvas: P1Zone[];
  /** Seam into protected Module 1, when one exists. Read-only reference. */
  m1Seam?: string;
}

/** Helper so each screen file stays declarative. */
export function screens(list: P1Screen[]): P1Screen[] {
  return list;
}

export const SRC_BLUEPRINT = "Abox_phase_1_Blueprint_v2_6.19.26.pdf";
export const SRC_IA = "ABox_Phase1_IA_Handoff_Package_v1.0";
export const SRC_RECON = "ABox_Module1_Reconciliation_Package_v1.0";
export const SRC_NORTH = "ABox_Athina_North_Star_Handover_Package_v1.0";
export const SRC_SEQ = "ABox_Product_Architecture_Module_Sequencing_Pack_v1.0";
