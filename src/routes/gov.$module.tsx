import { Link, Outlet, createFileRoute, notFound, useParams } from "@tanstack/react-router";

import { AppShell } from "@/components/shell/AppShell";
import { Annotation, IdChip, WBox } from "@/components/wireframe/primitives";
import {
  MODULE_PACKET,
  MODULE_TITLE,
  isGovernedModule,
  moduleIndex,
  type GovernedModuleKey,
} from "@/lib/governed";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/$module")({
  beforeLoad: ({ params }) => {
    if (!isGovernedModule(params.module)) throw notFound();
  },
  component: GovLayout,
  notFoundComponent: () => (
    <AppShell>
      <WBox className="h-32" label="unknown governed module — try /gov/m04" />
    </AppShell>
  ),
});

const TABS = [
  { to: "/gov/$module", label: "Overview", exact: true },
  { to: "/gov/$module/screens", label: "Screens" },
  { to: "/gov/$module/flows", label: "Flows" },
  { to: "/gov/$module/registers", label: "Registers" },
  { to: "/gov/$module/deltas", label: "Impacts & deltas" },
  { to: "/gov/$module/traceability", label: "Traceability" },
] as const satisfies ReadonlyArray<{ to: string; label: string; exact?: boolean }>;

function GovLayout() {
  const { module } = useParams({ from: "/gov/$module" }) as { module: GovernedModuleKey };
  const idx = moduleIndex(module);

  return (
    <AppShell
      drawerTitle={`${module.toUpperCase()} context`}
      assistantContext={`the ${module.toUpperCase()} governed estate`}
      drawerBody={{
        Context: (
          <Annotation>
            {MODULE_TITLE[module]} · packet {MODULE_PACKET[module]} · version {idx.version}.
          </Annotation>
        ),
        Summary: (
          <Annotation>
            {idx.workspaces.length} workspaces · {idx.screens.length} controlled screens ·{" "}
            {idx.flows.length} governed flows.
          </Annotation>
        ),
        Guidance: (
          <Annotation>
            Source precedence: approved change records and deltas → registry and contracts →
            requirements, rules and acceptance → workbook and CSV registers → narrative → visuals.
          </Annotation>
        ),
        Audit: <Annotation>Every frame carries its SCR, FLOW, REQ and AC identifiers.</Annotation>,
        "Next actions": <Annotation>Open a screen, walk a flow, or browse a register.</Annotation>,
      }}
    >
      <div className="space-y-4">
        <header className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <IdChip>{module.toUpperCase()}</IdChip>
            <IdChip>v{idx.version}</IdChip>
            <h1 className="text-base font-semibold tracking-tight">{MODULE_TITLE[module]}</h1>
          </div>
          <p className="text-xs text-muted-foreground">{MODULE_PACKET[module]}</p>
        </header>

        <nav aria-label="Module sections" className="flex flex-wrap gap-1.5 border-b border-hairline pb-2">
          {TABS.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              params={{ module }}
              activeOptions={{ exact: "exact" in t ? t.exact : false }}
              className="rounded border border-hairline px-2 py-1 text-xs hover:bg-accent"
              activeProps={{ className: cn("bg-muted font-semibold") }}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <Outlet />
      </div>
    </AppShell>
  );
}
