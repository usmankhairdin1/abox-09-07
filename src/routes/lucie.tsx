import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { Id } from "@/components/lucie/ui";
import { SPINE_VERSION } from "@/lib/lucie";

export const Route = createFileRoute("/lucie")({
  component: LucieLayout,
});

const NAV: { to: string; label: string; hint: string }[] = [
  { to: "/lucie", label: "Spine overview", hint: "Authority, counts, integrity checks" },
  { to: "/lucie/trace", label: "Traceability matrix", hint: "145 capabilities → modules, surfaces" },
  { to: "/lucie/workstreams", label: "Workstreams", hint: "Nine delivery lanes and critical path" },
  { to: "/lucie/slices", label: "Release slices", hint: "Integrated outcomes A–H" },
  { to: "/lucie/modules", label: "Canonical modules", hint: "M00–M26 ownership and posture" },
  { to: "/lucie/surfaces", label: "Surface baseline", hint: "IA v2.0 surfaces in Lucie" },
  { to: "/lucie/states", label: "States & invariants", hint: "Nine states kept separate" },
  { to: "/lucie/module1", label: "Module 1 protection", hint: "Frozen controls appendix" },
  { to: "/lucie/reconciliation", label: "Wireframe reconciliation", hint: "Legacy sets → IA v2.0" },
  { to: "/lucie/governance", label: "Governance registers", hint: "Decisions, seams, gates, items" },
];

function LucieLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/lucie" className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight">ABox · Lucie Release</span>
            <span className="text-[11px] text-muted-foreground">{SPINE_VERSION}</span>
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Id>protected_detailed_module_baselines = [M01]</Id>
            <Link
              to="/"
              className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Wireframe estate
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row">
        <nav
          aria-label="Spine sections"
          className="lg:sticky lg:top-[73px] lg:h-fit lg:w-64 lg:shrink-0"
        >
          <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/lucie" }}
                  activeProps={{ className: "border-primary/40 bg-primary/8" }}
                  className="block rounded-lg border border-transparent px-2.5 py-2 transition-colors hover:bg-muted"
                >
                  <span className="block text-xs font-medium">{n.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {n.hint}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="grid min-w-0 flex-1 gap-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
