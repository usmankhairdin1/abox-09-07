/**
 * SCR_AGENCY_SETUP — Agency home overview
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Users, Percent, Receipt } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { SAMPLE_ENTITIES, SAMPLE_PRODUCERS, SAMPLE_STATEMENTS } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/agency/")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_AGENCY_SETUP.name} — ABox` }, { name: "description", content: SCREENS.SCR_AGENCY_SETUP.purpose }] }),
  component: Page,
});

function Page() {
  const totalProducers = SAMPLE_PRODUCERS.length;
  const totalBooked = SAMPLE_STATEMENTS.reduce((s, x) => s + x.booked, 0);
  return (
    <InternalShell workspace="agency" pageTitle="Agency home" eyebrow="Overview">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Entities" value={SAMPLE_ENTITIES.length} icon={Building2} tone="primary" />
        <KpiCard label="Producers" value={totalProducers} icon={Users} />
        <KpiCard label="Revenue split rules" value={4} icon={Percent} tone="sage" />
        <KpiCard label="Statements YTD" value={`$${totalBooked.toLocaleString()}`} icon={Receipt} />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link to="/app/agency/entities" className="rounded-2xl border border-border bg-card p-5 hover:bg-accent/40">
          <p className="text-eyebrow">Structure</p>
          <p className="mt-1 text-display text-2xl">Entities & hierarchy</p>
          <p className="mt-1 text-sm text-muted-foreground">Agencies, sub-agencies, referrers, and carrier partners.</p>
        </Link>
        <Link to="/app/agency/producers" className="rounded-2xl border border-border bg-card p-5 hover:bg-accent/40">
          <p className="text-eyebrow">People</p>
          <p className="mt-1 text-display text-2xl">Producers & licenses</p>
          <p className="mt-1 text-sm text-muted-foreground">License, appointment tracking, CE hours, NIPR sync.</p>
        </Link>
        <Link to="/app/agency/revenue" className="rounded-2xl border border-border bg-card p-5 hover:bg-accent/40">
          <p className="text-eyebrow">Money</p>
          <p className="mt-1 text-display text-2xl">Revenue splits & referrals</p>
        </Link>
        <Link to="/app/agency/statements" className="rounded-2xl border border-border bg-card p-5 hover:bg-accent/40">
          <p className="text-eyebrow">Statements</p>
          <p className="mt-1 text-display text-2xl">Booked, projected, disputed</p>
        </Link>
      </div>
    </InternalShell>
  );
}
