/**
 * AppShell — compatibility wrapper.
 *
 * Historically this rendered its own header and navigation for the
 * wireframe estates. Every surface now shares the product chrome, so
 * this simply delegates to the standard InternalShell.
 */
import type { ReactNode } from "react";

import { InternalShell } from "@/components/abox/internal-shell";
import type { DrawerTab } from "@/lib/abox";
import { ShellProvider, useShell, type ShellState } from "@/components/shell/shell-context";

export { ShellProvider, useShell };
export type { ShellState };

export function AppShell({
  children,
  drawerTitle = "Workspace context",
  drawerBody,
  pageTitle,
  eyebrow,
}: {
  children: ReactNode;
  drawerTitle?: string;
  drawerBody?: Partial<Record<DrawerTab, ReactNode>>;
  assistantContext?: string;
  pageTitle?: string;
  eyebrow?: string;
}) {
  const entries = Object.entries(drawerBody ?? {}).filter(([, v]) => v);
  const drawer =
    entries.length > 0 ? (
      <div className="space-y-5">
        {entries.map(([label, node]) => (
          <section key={label} className="space-y-2">
            <p className="text-eyebrow text-muted-foreground">{label}</p>
            <div className="text-sm leading-relaxed">{node as ReactNode}</div>
          </section>
        ))}
      </div>
    ) : undefined;

  return (
    <InternalShell
      workspace="agent"
      drawerTitle={drawerTitle}
      {...(drawer ? { drawer } : {})}
      {...(pageTitle ? { pageTitle } : {})}
      {...(eyebrow ? { eyebrow } : {})}
    >
      {children}
    </InternalShell>
  );
}
