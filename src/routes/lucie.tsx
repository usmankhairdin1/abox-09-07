import { createFileRoute, Outlet } from "@tanstack/react-router";

import { InternalShell } from "@/components/abox/internal-shell";
import { ModuleTabs, type ModuleTab } from "@/components/abox/module-tabs";
import { SPINE_VERSION } from "@/lib/lucie";

export const Route = createFileRoute("/lucie")({
  component: LucieLayout,
});

const NAV: ModuleTab[] = [
  { to: "/lucie", label: "Spine overview", hint: "Authority, counts, integrity checks", exact: true },
  { to: "/lucie/trace", label: "Traceability", hint: "145 capabilities → modules, surfaces" },
  { to: "/lucie/workstreams", label: "Workstreams", hint: "Nine delivery lanes and critical path" },
  { to: "/lucie/slices", label: "Release slices", hint: "Integrated outcomes A–H" },
  { to: "/lucie/modules", label: "Modules", hint: "M00–M26 ownership and posture" },
  { to: "/lucie/surfaces", label: "Surfaces", hint: "IA v2.0 surfaces in Lucie" },
  { to: "/lucie/states", label: "States", hint: "Nine states kept separate" },
  { to: "/lucie/module1", label: "Module 1", hint: "Frozen controls appendix" },
  { to: "/lucie/reconciliation", label: "Reconciliation", hint: "Legacy sets → IA v2.0" },
  { to: "/lucie/governance", label: "Governance", hint: "Decisions, seams, gates, items" },
];

function LucieLayout() {
  return (
    <InternalShell workspace="jet" eyebrow="Governance" pageTitle={`Lucie Release Spine · ${SPINE_VERSION}`}>
      <ModuleTabs tabs={NAV} />
      <div className="grid min-w-0 gap-6">
        <Outlet />
      </div>
    </InternalShell>
  );
}
