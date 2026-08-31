import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEFAULT_LABELS, type LabelKey } from "@/lib/abox";


/* ------------------------------------------------------------------ context */

interface ShellState {
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
  entityId: string;
  setEntityId: (id: string) => void;
  roleId: string;
  setRoleId: (id: string) => void;
  labels: Record<LabelKey, string>;
  setLabel: (key: LabelKey, value: string) => void;
  landing: string;
  setLanding: (to: string) => void;
}

const ShellContext = createContext<ShellState | null>(null);

export function useShell(): ShellState {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside <ShellProvider>");
  return ctx;
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState("WS_AGENCY");
  const [entityId, setEntityId] = useState("ENT_AGY_MASTER");
  const [roleId, setRoleId] = useState("ROLE_AGENCY_ADMIN");
  const [labels, setLabels] = useState<Record<LabelKey, string>>(DEFAULT_LABELS);
  const [landing, setLanding] = useState("/my-work");

  // Read stored preferences after hydration so SSR markup stays stable.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("abox.wireframe.prefs");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        workspaceId: string;
        entityId: string;
        roleId: string;
        labels: Record<LabelKey, string>;
        landing: string;
      }>;
      if (parsed.workspaceId) setWorkspaceId(parsed.workspaceId);
      if (parsed.entityId) setEntityId(parsed.entityId);
      if (parsed.roleId) setRoleId(parsed.roleId);
      if (parsed.labels) setLabels({ ...DEFAULT_LABELS, ...parsed.labels });
      if (parsed.landing) setLanding(parsed.landing);
    } catch {
      /* wireframe only — ignore malformed local state */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "abox.wireframe.prefs",
        JSON.stringify({ workspaceId, entityId, roleId, labels, landing }),
      );
    } catch {
      /* ignore */
    }
  }, [workspaceId, entityId, roleId, labels, landing]);

  const value = useMemo<ShellState>(
    () => ({
      workspaceId,
      setWorkspaceId,
      entityId,
      setEntityId,
      roleId,
      setRoleId,
      labels,
      setLabel: (key, v) => setLabels((prev) => ({ ...prev, [key]: v })),
      landing,
      setLanding,
    }),
    [workspaceId, entityId, roleId, labels, landing],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
