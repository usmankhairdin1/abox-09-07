import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { Id } from "@/components/lucie/ui";

export const Route = createFileRoute("/m06")({
  component: M06Layout,
});

const NAV: { to: string; label: string; hint: string }[] = [
  { to: "/m06", label: "Foundation", hint: "Schema, objects, enforcement posture" },
  { to: "/m06/roster", label: "Workforce roster", hint: "Live governed roster and lifecycle" },
  { to: "/m06/console", label: "Runtime console", hint: "Invoke governed M06 operations" },
];

function M06Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-hairline bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/m06" className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight">
              ABox · M06 Agency, Agent and Network Management
            </span>
            <span className="text-[11px] text-muted-foreground">Build packet v1.0</span>
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Id>schema = lucie_m06</Id>
            <Link
              to="/gov/$module"
              params={{ module: "m06" }}
              className="rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              Governed registers
            </Link>
            <Link
              to="/lucie"
              className="rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              Lucie spine
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1400px] flex-wrap gap-1 px-4 pb-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              title={n.hint}
              activeOptions={{ exact: n.to === "/m06" }}
              activeProps={{ className: "bg-primary/10 text-foreground border-primary/30" }}
              className="rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto flex max-w-[1400px] min-w-0 flex-col gap-4 px-4 py-5">
        <Outlet />
      </main>
    </div>
  );
}
