/**
 * ModuleTabs — secondary navigation used by module estates that live
 * inside the standard InternalShell (Lucie spine, M00, M06, governance).
 */
import { Link } from "@tanstack/react-router";

export interface ModuleTab {
  to: string;
  label: string;
  hint?: string;
  exact?: boolean;
}

export function ModuleTabs({ tabs }: { tabs: ModuleTab[] }) {
  return (
    <nav
      aria-label="Module sections"
      className="mb-6 flex flex-wrap gap-1.5 border-b border-hairline pb-3"
    >
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          title={t.hint}
          activeOptions={{ exact: t.exact ?? false }}
          activeProps={{ className: "bg-primary/10 text-foreground border-primary/30" }}
          className="rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
