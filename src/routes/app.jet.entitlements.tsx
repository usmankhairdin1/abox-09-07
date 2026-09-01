import { JetFrame } from "@/components/lucie-app/frames";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { DataTable, PageHeader, Section, StatCard, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { ENTITLEMENTS } from "@/lib/lucie-app/data";

export const Route = createFileRoute("/app/jet/entitlements")({
  head: () => ({
    meta: [
      { title: "Entitlements — JET platform" },
      { name: "description", content: "Packages, seat usage, renewal dates and the modules each tenant is entitled to use." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Entitlements" },
      { property: "og:description", content: "Seat usage and module entitlements per tenant." },
    ],
  }),
  component: () => (
    <JetFrame title="Entitlements">
      <EntitlementsPage />
    </JetFrame>
  ),
});

function EntitlementsPage() {
  const seats = ENTITLEMENTS.reduce((s, e) => s + e.seats, 0);
  const used = ENTITLEMENTS.reduce((s, e) => s + e.seatsUsed, 0);

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Entitlements"
        lede="Entitlements switch whole modules on and off for a tenant. A tenant without ICHRA quoting simply never sees the employer workspace."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Seats sold" value={seats} />
        <StatCard label="Seats in use" value={used} hint={`${Math.round((used / seats) * 100)}% utilisation`} />
        <StatCard label="Packages" value={new Set(ENTITLEMENTS.map((e) => e.package)).size} />
      </div>

      <Section title="By tenant">
        <DataTable
          rows={ENTITLEMENTS}
          keyOf={(e) => e.id}
          columns={[
            {
              head: "Tenant",
              cell: (e) => (
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.tenant}</p>
                  <p className="text-xs text-muted-foreground">{e.package}</p>
                </div>
              ),
            },
            {
              head: "Seats",
              cell: (e) => (
                <span className={e.seatsUsed / e.seats > 0.85 ? "text-warning-foreground" : undefined}>
                  {e.seatsUsed} of {e.seats}
                </span>
              ),
            },
            { head: "Renews", cell: (e) => e.renews },
            {
              head: "Modules",
              cell: (e) => (
                <div className="flex flex-wrap gap-1.5">
                  {e.modules.map((m) => (
                    <StatusChip key={m} tone="info">
                      {m}
                    </StatusChip>
                  ))}
                </div>
              ),
            },
            {
              head: "",
              cell: (e) => (
                <Button variant="ghost" size="sm" onClick={() => toast.success(`Seat change requested for ${e.tenant}.`)}>
                  Adjust seats
                </Button>
              ),
            },
          ]}
        />
      </Section>
    </>
  );
}
