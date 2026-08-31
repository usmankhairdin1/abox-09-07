import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, PageHeader, Section, StatusChip, toneFor } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Tenant } from "@/lib/lucie-app/data";
import { ENTITLEMENTS, TENANTS } from "@/lib/lucie-app/data";

export const Route = createFileRoute("/lucie-app/platform/tenants")({
  head: () => ({
    meta: [
      { title: "Tenants — JET platform" },
      { name: "description", content: "Every agency, employer and carrier partner on the platform, with the workspaces and entitlements they hold." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Tenants" },
      { property: "og:description", content: "Tenant roster with workspace and entitlement detail." },
    ],
  }),
  component: TenantsPage,
});

function TenantsPage() {
  const [selected, setSelected] = useState<Tenant | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Tenants"
        lede="A tenant owns its own data, branding and users. Workspaces decide which parts of the product that tenant sees at all."
        actions={
          <Button onClick={() => toast.success("Provisioning request opened for a new tenant.")}>
            <Building2 className="h-4 w-4" /> Provision tenant
          </Button>
        }
      />

      <Section title={`${TENANTS.length} tenants`}>
        <DataTable
          rows={TENANTS}
          keyOf={(t) => t.id}
          onRowClick={(t) => setSelected(t)}
          columns={[
            {
              head: "Tenant",
              cell: (t) => (
                <div className="min-w-0">
                  <p className="truncate font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.id} · created {t.created}
                  </p>
                </div>
              ),
            },
            { head: "Type", cell: (t) => t.type },
            { head: "Users", cell: (t) => t.users },
            { head: "Workspaces", cell: (t) => t.workspaces.join(", ") },
            { head: "Status", cell: (t) => <StatusChip tone={toneFor(t.status)}>{t.status}</StatusChip> },
          ]}
        />
      </Section>

      <Sheet open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 px-4 pb-8">
                <div className="flex flex-wrap gap-2">
                  <StatusChip tone={toneFor(selected.status)}>{selected.status}</StatusChip>
                  <StatusChip>{selected.type}</StatusChip>
                  <StatusChip>{selected.users} users</StatusChip>
                </div>
                <div className="grid gap-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workspaces</p>
                  <p className="text-sm">{selected.workspaces.join(", ")}</p>
                </div>
                <div className="grid gap-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entitlements</p>
                  {ENTITLEMENTS.filter((e) => e.tenant === selected.name).map((e) => (
                    <p key={e.id} className="text-sm">
                      {e.package} · {e.seatsUsed}/{e.seats} seats · renews {e.renews}
                    </p>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => toast.success(`Impersonation session requested for ${selected.name}.`)}
                >
                  Request support session
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
