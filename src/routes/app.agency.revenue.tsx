import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/agency/revenue")({
  head: () => ({ meta: [{ title: "Revenue Splits — ABox" }, { name: "description", content: SCREENS.SCR_AGENCY_REVENUE.purpose }] }),
  component: Page,
});

function Page() {
  const rules = [
    { id: "R-01", name: "Cedar Grove default split", entities: "Cedar Grove → producer", split: "80% producer / 20% agency", override: false },
    { id: "R-02", name: "Northwind sub-agency split", entities: "Northwind → producer", split: "70% producer / 30% Northwind / owner Cedar 5%", override: true },
    { id: "R-03", name: "Referral reward — Ridgeline", entities: "Ridgeline referrer", split: "$50/enrollment cash reward", override: false },
    { id: "R-04", name: "Bonus tier — >10 enrollments/mo", entities: "All producers", split: "+5% override", override: true },
  ];
  return (
    <InternalShell workspace="agency" pageTitle="Revenue splits & referrals" eyebrow="Money">
      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <p className="text-display text-xl">{r.name}</p>
              {r.override && <StatusBadge tone="primary">Override</StatusBadge>}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <p><span className="text-muted-foreground">Applies to:</span> {r.entities}</p>
              <p><span className="text-muted-foreground">Split:</span> <span className="font-medium">{r.split}</span></p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">Edit</button>
              <button className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">Duplicate</button>
            </div>
          </div>
        ))}
      </div>
    </InternalShell>
  );
}
