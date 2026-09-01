/**
 * Workforce & network page host (Agency workspace).
 *
 * Every workforce surface renders inside the standard InternalShell with the
 * agency workspace navigation. Data is read and written through the governed
 * M06 runtime (`m06Invoke` -> `lucie_m06_api`), which enforces actor, tenant
 * and organization scope plus a server-side permission check before any row is
 * returned or changed.
 */
import type { ComponentType } from "react";

import { InternalShell } from "@/components/abox/internal-shell";
import { ModuleTabs, type ModuleTab } from "@/components/abox/module-tabs";
import type { M06ScreenProps } from "@/components/m06/screens/common";
import { useM06Call, useM06Context } from "@/lib/m06/use-m06";

export const WORKFORCE_TABS: ModuleTab[] = [
  { to: "/agency/workforce", label: "Overview", hint: "Network health and open work", exact: true },
  { to: "/agency/workforce/roster", label: "Roster", hint: "People, affiliation and status" },
  { to: "/agency/workforce/person", label: "Person", hint: "Profile, affiliation and history" },
  { to: "/agency/workforce/onboarding", label: "Onboarding", hint: "Add agents and staff, resolve duplicates" },
  { to: "/agency/workforce/structure", label: "Structure", hint: "Business units and teams" },
  { to: "/agency/workforce/lifecycle", label: "Lifecycle", hint: "Transfers, offboarding, suspension" },
  { to: "/agency/workforce/readiness", label: "Readiness", hint: "Operational eligibility and referral" },
  { to: "/agency/workforce/access", label: "Access", hint: "Roles, assignment and effective access" },
  { to: "/agency/workforce/work", label: "Tasks & exceptions", hint: "Queue, notes and support context" },
  { to: "/agency/workforce/data", label: "Import & reports", hint: "Imports, exports and fixed reports" },
  { to: "/agency/workforce/settings", label: "Agency settings", hint: "Operational profile and defaults" },
];

export function WorkforcePage({
  title,
  lede,
  screens,
}: {
  title: string;
  lede?: string;
  screens: ComponentType<M06ScreenProps>[];
}) {
  const { ctx, hydrated } = useM06Context();
  const call = useM06Call(ctx);

  return (
    <InternalShell workspace="agency" eyebrow="Workforce & network" pageTitle={title}>
      <ModuleTabs tabs={WORKFORCE_TABS} />
      {lede ? <p className="mb-5 max-w-3xl text-sm text-muted-foreground">{lede}</p> : null}
      {!hydrated ? (
        <div className="h-40 animate-pulse rounded-2xl border border-hairline bg-surface/50" />
      ) : (
        <div className="grid gap-6">
          {screens.map((Screen, i) => (
            <Screen key={i} call={call} ctx={ctx} />
          ))}
        </div>
      )}
    </InternalShell>
  );
}
