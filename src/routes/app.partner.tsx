/**
 * SCR_PARTNER_HOME
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { SCREENS } from "@/lib/screens";
import { Handshake, DollarSign, Users } from "lucide-react";

export const Route = createFileRoute("/app/partner")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_PARTNER_HOME.name} — ABox` }, { name: "description", content: SCREENS.SCR_PARTNER_HOME.purpose }] }),
  component: Page,
});

const REFERRALS = [
  { id: "REF-2044", name: "Anaya Boone", status: "Enrolled", reward: 50, sent: "Jul 10" },
  { id: "REF-2043", name: "Vasco Miretti", status: "Contacted", reward: 0, sent: "Jul 8" },
  { id: "REF-2042", name: "Grace Ndiaye", status: "Quoted", reward: 0, sent: "Jul 6" },
  { id: "REF-2041", name: "Rowan Blake", status: "Enrolled", reward: 50, sent: "Jul 2" },
  { id: "REF-2040", name: "Yasmin Klein", status: "Lost", reward: 0, sent: "Jun 27" },
];

function Page() {
  const earned = REFERRALS.reduce((s, r) => s + r.reward, 0);
  return (
    <InternalShell workspace="partner" pageTitle="Partner referrals" eyebrow="Refer">
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Referrals sent" value={REFERRALS.length} icon={Users} />
        <KpiCard label="Rewards earned" value={`$${earned}`} icon={DollarSign} tone="sage" />
        <KpiCard label="Reward per enrollment" value="$50" icon={Handshake} tone="primary" />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-display text-2xl">Send a referral</h2>
          <StatusBadge tone="muted">Ridgeline Referral Co.</StatusBadge>
        </div>
        <form className="mt-3 grid gap-3 sm:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="First name" className="h-10 rounded-lg border border-border bg-background px-3 text-sm" />
          <input placeholder="Email" type="email" className="h-10 rounded-lg border border-border bg-background px-3 text-sm" />
          <input placeholder="Phone (optional)" type="tel" className="h-10 rounded-lg border border-border bg-background px-3 text-sm" />
          <button className="col-span-full h-10 rounded-full bg-primary text-sm font-medium text-primary-foreground sm:col-span-1">Send referral</button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-display text-2xl">Recent referrals</h2>
        </div>
        <ul className="divide-y divide-border">
          {REFERRALS.map((r) => (
            <li key={r.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.id} · sent {r.sent}</p>
              </div>
              <StatusBadge tone={r.status === "Enrolled" ? "sage" : r.status === "Lost" ? "destructive" : "primary"}>{r.status}</StatusBadge>
              <span className="tabular-nums text-sm">${r.reward}</span>
              <button className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent">View</button>
            </li>
          ))}
        </ul>
      </section>
    </InternalShell>
  );
}
