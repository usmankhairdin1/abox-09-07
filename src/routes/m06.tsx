import { createFileRoute, Outlet } from "@tanstack/react-router";

import { InternalShell } from "@/components/abox/internal-shell";
import { ModuleTabs, type ModuleTab } from "@/components/abox/module-tabs";

export const Route = createFileRoute("/m06")({
  component: M06Layout,
});

const NAV: ModuleTab[] = [
  { to: "/m06", label: "Foundation", hint: "Schema, objects, enforcement posture", exact: true },
  { to: "/m06/roster", label: "Workforce roster", hint: "Live governed roster and lifecycle" },
  { to: "/m06/screens", label: "Screen directory", hint: "All governed M06 screens" },
  { to: "/m06/console", label: "Runtime console", hint: "Invoke governed M06 operations" },
];

function M06Layout() {
  return (
    <InternalShell
      workspace="jet"
      eyebrow="Governance"
      pageTitle="M06 · Agency, Agent & Network"
    >
      <ModuleTabs tabs={NAV} />
      <div className="grid min-w-0 gap-4">
        <Outlet />
      </div>
    </InternalShell>
  );
}
