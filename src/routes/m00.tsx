import { createFileRoute, Outlet } from "@tanstack/react-router";

import { InternalShell } from "@/components/abox/internal-shell";
import { ModuleTabs, type ModuleTab } from "@/components/abox/module-tabs";

export const Route = createFileRoute("/m00")({
  component: M00Layout,
});

const NAV: ModuleTab[] = [
  { to: "/m00", label: "Foundation", hint: "Migrations, live status, coverage", exact: true },
  { to: "/m00/api", label: "API register", hint: "82 operations, runtime binding" },
  { to: "/m00/events", label: "Events", hint: "66 contracts, outbox stream" },
  { to: "/m00/console", label: "Runtime console", hint: "Invoke governed operations" },
  { to: "/m00/tests", label: "Tests & tasks", hint: "253 scenarios, 225 tasks" },
];

function M00Layout() {
  return (
    <InternalShell workspace="jet" eyebrow="Governance" pageTitle="M00 · Platform Foundation">
      <ModuleTabs tabs={NAV} />
      <div className="grid min-w-0 gap-4">
        <Outlet />
      </div>
    </InternalShell>
  );
}
