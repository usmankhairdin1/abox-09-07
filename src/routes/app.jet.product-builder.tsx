/**
 * SCR_JET_PRODUCT_BUILDER — schema, availability, versioning
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/product-builder")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_PRODUCT_BUILDER.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_PRODUCT_BUILDER.purpose }] }),
  component: Page,
});

function Page() {
  const fields = [
    { key: "plan.metalTier", type: "enum", req: true, note: "Bronze/Silver/Gold/Platinum" },
    { key: "plan.deductible", type: "currency", req: true },
    { key: "plan.oopMax", type: "currency", req: true },
    { key: "plan.networkType", type: "enum", req: true, note: "HMO/PPO/EPO/POS" },
    { key: "plan.onExchange", type: "boolean", req: true },
    { key: "plan.hsaEligible", type: "boolean", req: false },
    { key: "plan.pcpCopay", type: "currency", req: false },
    { key: "plan.rxTier1", type: "currency", req: false },
  ];
  return (
    <InternalShell workspace="jet" pageTitle="Product builder" eyebrow="Catalog">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-display text-2xl">IFP — Individual & Family (v1.4)</h2>
            <StatusBadge tone="sage">Live</StatusBadge>
          </div>
          <p className="text-sm text-muted-foreground">Schema fields used by the marketplace, quote wizard, and off-exchange application.</p>
          <ul className="mt-4 divide-y divide-border">
            {fields.map((f) => (
              <li key={f.key} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium tabular-nums text-xs uppercase tracking-widest break-words">{f.key}</p>
                  {f.note && <p className="text-xs text-muted-foreground">{f.note}</p>}
                </div>
                <StatusBadge tone="muted">{f.type}</StatusBadge>
                <StatusBadge tone={f.req ? "primary" : "muted"}>{f.req ? "required" : "optional"}</StatusBadge>
              </li>
            ))}
          </ul>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow">Availability rules</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>· States: 32</li>
              <li>· Effective: 2025-01-01 → 2026-12-31</li>
              <li>· Age eligibility: 0–64</li>
              <li>· ICHRA allowance compatible: yes</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow">Version history</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>v1.4 · Live — Jul 2026</li>
              <li>v1.3 · Retired — Mar 2026</li>
              <li>v1.2 · Retired — Jan 2026</li>
            </ul>
          </div>
        </aside>
      </div>
    </InternalShell>
  );
}
