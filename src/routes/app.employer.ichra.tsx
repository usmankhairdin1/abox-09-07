/**
 * SCR_EMPLOYER_ICHRA
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { SCREENS } from "@/lib/screens";
import { Building2, Users, DollarSign } from "lucide-react";

export const Route = createFileRoute("/app/employer/ichra")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_EMPLOYER_ICHRA.name} — ABox` }, { name: "description", content: SCREENS.SCR_EMPLOYER_ICHRA.purpose }] }),
  component: Page,
});

const CENSUS = [
  { class: "Full-time", count: 24, avgAge: 38, allowance: 550 },
  { class: "Part-time", count: 6, avgAge: 41, allowance: 300 },
  { class: "Seasonal",  count: 3, avgAge: 29, allowance: 250 },
];

function Page() {
  const [allowance, setAllowance] = useState(550);
  const total = CENSUS.reduce((s, c) => s + c.count, 0);
  const monthly = CENSUS.reduce((s, c) => s + c.count * c.allowance, 0);
  const projected = monthly * 12;
  return (
    <InternalShell workspace="employer" pageTitle="ICHRA quote" eyebrow="Group">
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Company" value="Cedar Grove HQ" icon={Building2} />
        <KpiCard label="Eligible employees" value={total} icon={Users} tone="primary" />
        <KpiCard label="Est. monthly contribution" value={`$${monthly.toLocaleString()}`} icon={DollarSign} tone="sage" hint={`≈ $${projected.toLocaleString()}/yr`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-border bg-card p-5 card-brackets edge-sheen">
          <p className="text-eyebrow">Census by class</p>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="py-2">Class</th><th>People</th><th>Avg age</th><th>Allowance</th><th>Monthly cost</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CENSUS.map((c) => (
                <tr key={c.class}>
                  <td className="py-2 font-medium">{c.class}</td>
                  <td>{c.count}</td>
                  <td>{c.avgAge}</td>
                  <td className="tabular-nums">${c.allowance}</td>
                  <td className="tabular-nums">${(c.count * c.allowance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 card-brackets edge-sheen" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-eyebrow">Set FT allowance</p>
            <input type="range" min={200} max={1200} step={25}
              value={allowance} onChange={(e) => setAllowance(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--primary)]" aria-label="Full-time monthly allowance" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>$200</span>
              <span className="text-display text-2xl tabular-nums text-foreground">${allowance}</span>
              <span>$1,200</span>
            </div>
            <StatusBadge tone="muted" className="mt-3">Phase 1 · quoting only</StatusBadge>
            <p className="mt-3 text-xs text-muted-foreground">Group enrollment is excluded from Phase 1. Quoting is a foundation for later modules.</p>
          </div>
        </aside>
      </div>
    </InternalShell>
  );
}
