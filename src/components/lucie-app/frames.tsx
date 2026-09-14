/**
 * Frames that place the group-benefits and platform-operations surfaces inside
 * the standard product shell, under their own workspace navigation.
 */
import type { ReactNode } from "react";

import { InternalShell } from "@/components/abox/internal-shell";
import { ModuleTabs, type ModuleTab } from "@/components/abox/module-tabs";

const EMPLOYER_TABS: ModuleTab[] = [
  { to: "/app/employer/ichra", label: "ICHRA quote", hint: "Group quote entry" },
  { to: "/app/employer/census", label: "Census", hint: "Eligible employees" },
  { to: "/app/employer/contribution", label: "Contribution model", hint: "Allowance by class" },
  { to: "/app/employer/results", label: "Cost results", hint: "ICHRA and employee cost" },
  { to: "/app/employer/proposal", label: "Proposal", hint: "Generate and route" },
];

export function EmployerFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InternalShell workspace="employer" eyebrow="Group benefits" pageTitle={title}>
      <ModuleTabs tabs={EMPLOYER_TABS} />
      <div className="grid gap-6">{children}</div>
    </InternalShell>
  );
}

export function JetFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InternalShell workspace="jet" eyebrow="Platform operations" pageTitle={title}>
      <div className="grid gap-6">{children}</div>
    </InternalShell>
  );
}
