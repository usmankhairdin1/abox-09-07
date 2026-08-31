import { useQuery } from "@tanstack/react-query";

import { M00_INDEX } from "./m00.index";
import { M04_INDEX } from "./m04.index";
import { M05_INDEX } from "./m05.index";
import { M06_INDEX } from "./m06.index";
import type {
  GovernedFlow,
  GovernedModuleIndex,
  GovernedScreen,
  RegisterPayload,
  RegisterRow,
} from "./types";

export * from "./types";

export const GOVERNED_MODULES = ["m00", "m04", "m05", "m06"] as const;
export type GovernedModuleKey = (typeof GOVERNED_MODULES)[number];

export const MODULE_INDEX: Record<GovernedModuleKey, GovernedModuleIndex> = {
  m00: M00_INDEX,
  m04: M04_INDEX,
  m05: M05_INDEX,
  m06: M06_INDEX,
};

export const MODULE_TITLE: Record<GovernedModuleKey, string> = {
  m00: "M00 — Platform Foundation",
  m04: "M04 — Marketplace Management and White Labeling",
  m05: "M05 — Organization, Relationship and Multi-Tenant Model",
  m06: "M06 — Agency, Agent and Network Management",
};

export const MODULE_PACKET: Record<GovernedModuleKey, string> = {
  m00: "ABox_Lucie_M00_Platform_Foundation_Build_Packet_v1.1",
  m04: "ABox_Lucie_M04_Marketplace_Management_and_White_Labeling_Build_Packet_v1.0",
  m05: "ABox_Lucie_M05_Organization_Relationship_and_Multi_Tenant_Model_Build_Packet_v1.0",
  m06: "ABox_Lucie_M06_Agency_Agent_and_Network_Management_Build_Packet_v1.0",
};

export function isGovernedModule(value: string): value is GovernedModuleKey {
  return (GOVERNED_MODULES as readonly string[]).includes(value);
}

export function moduleIndex(key: GovernedModuleKey): GovernedModuleIndex {
  return MODULE_INDEX[key];
}

export function screenBySlug(key: GovernedModuleKey, slug: string): GovernedScreen | undefined {
  return MODULE_INDEX[key].screens.find((s) => s.slug === slug || s.id === slug);
}

export function screenById(key: GovernedModuleKey, id: string): GovernedScreen | undefined {
  return MODULE_INDEX[key].screens.find((s) => s.id === id);
}

export function flowBySlug(key: GovernedModuleKey, slug: string): GovernedFlow | undefined {
  return MODULE_INDEX[key].flows.find((f) => f.slug === slug || f.id === slug);
}

export function screensForWorkspace(key: GovernedModuleKey, workspaceId: string): GovernedScreen[] {
  return MODULE_INDEX[key].screens.filter((s) => s.workspace === workspaceId);
}

export function flowsForScreen(key: GovernedModuleKey, screenId: string): GovernedFlow[] {
  return MODULE_INDEX[key].flows.filter((f) => f.screens.includes(screenId));
}

/**
 * Full controlled registers are served as static JSON so the client bundle stays
 * small; they are the same CSV rows shipped inside each build packet.
 */
export function useRegisters(key: GovernedModuleKey) {
  return useQuery<RegisterPayload>({
    queryKey: ["registers", key],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await fetch(`/registers/${key}.json`);
      if (!res.ok) throw new Error(`Register load failed for ${key}`);
      return (await res.json()) as RegisterPayload;
    },
  });
}

export function rowsMatching(rows: RegisterRow[], query: string): RegisterRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
  );
}

/** Register names that carry prior-module impact / proposed delta records. */
export const DELTA_REGISTERS = [
  "M00_Impact_Register",
  "Proposed_M00_Delta_Register",
  "M05_Impact_Register",
  "Proposed_M05_Delta_Register",
  "M01_Impact_Register",
  "Proposed_M01_Delta_Register",
  "Prior_Module_Impact_Register",
  "Proposed_M01_Deltas",
  "Proposed_M04_Delta_Register",
  "Upstream_Contract_Consumption_Register",
  "M1D_Review",
];
