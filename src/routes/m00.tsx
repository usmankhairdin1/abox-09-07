import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { Id } from "@/components/lucie/ui";

export const Route = createFileRoute("/m00")({
  component: M00Layout,
});

const NAV: { to: string; label: string; hint: string }[] = [
  { to: "/m00", label: "Foundation", hint: "Migrations, live status, coverage" },
  { to: "/m00/api", label: "API register", hint: "82 operations, runtime binding" },
  { to: "/m00/events", label: "Events", hint: "66 contracts, outbox stream" },
  { to: "/m00/console", label: "Runtime console", hint: "Invoke governed operations" },
  { to: "/m00/tests", label: "Tests & tasks", hint: "253 scenarios, 225 tasks" },
];

function M00Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-hairline bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/m00" className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight">ABox · M00 Platform Foundation</span>
            <span className="text-[11px] text-muted-foreground">Build packet v1.1</span>
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Id>environment = LOCAL_DEVELOPMENT</Id>
            <Link
              to="/lucie"
              className="rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              Lucie spine
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              Wireframe estate
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1400px] flex-wrap gap-1 px-4 pb-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              title={n.hint}
              activeOptions={{ exact: n.to === "/m00" }}
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
