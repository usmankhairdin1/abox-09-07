/**
 * SCR-M04-010 — Availability Entry Detail.
 * Explain entitlement, product, carrier, geography, participant and
 * integration readiness (REQ-M04-AVL-001).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ListTree } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { useMarketplaceState, getAvailabilityEntry, PRODUCT_LINE_LABEL, CHANNEL_LABEL } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/availability/$availabilityEntryId")({
  loader: ({ params }) => ({ availabilityEntryId: params.availabilityEntryId }),
  head: ({ params }) => ({ meta: [{ title: `Availability — ${params.availabilityEntryId} — ABox` }] }),
  component: Page,
});

const CHECKS = [
  { label: "M00 commercial activation", pass: true },
  { label: "Product-line entitlement", pass: true },
  { label: "Channel entitlement", pass: true },
  { label: "M03 product and plan readiness", pass: true },
  { label: "Carrier pathway readiness", pass: true },
  { label: "Participant readiness", pass: true },
  { label: "M08 authority", pass: true },
];

function Page() {
  const { availabilityEntryId } = Route.useLoaderData();
  const mkt = useMarketplaceState();
  const entry = getAvailabilityEntry(mkt, availabilityEntryId);

  if (!entry) {
    return (
      <InternalShell workspace="agency" pageTitle="Not found" eyebrow="Availability · M04">
        <p>That availability entry doesn't exist. <Link to="/marketplace/admin/availability" className="story-link text-primary">Back to matrix</Link></p>
      </InternalShell>
    );
  }

  const blocked = entry.blockers.length > 0;

  return (
    <InternalShell workspace="agency" pageTitle={`${PRODUCT_LINE_LABEL[entry.product_line]} — ${entry.state_code}`} eyebrow="Availability Entry Detail · SCR-M04-010">
      <Link to="/marketplace/admin/availability" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to matrix
      </Link>

      <section className="rounded-2xl border border-border bg-card p-5">
        <header className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><ListTree className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Entitlement and readiness</h2></span>
          <StatusBadge tone={blocked ? "warning" : entry.status === "ENABLED" ? "sage" : "muted"}>{blocked ? "BLOCKED" : entry.status}</StatusBadge>
        </header>
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <div><dt className="text-eyebrow">Carrier</dt><dd>{entry.carrier_name}</dd></div>
          <div><dt className="text-eyebrow">Channels</dt><dd>{entry.channels.map((c) => CHANNEL_LABEL[c]).join(", ") || "None"}</dd></div>
          <div><dt className="text-eyebrow">Geography</dt><dd>{entry.state_code}</dd></div>
          <div><dt className="text-eyebrow">Version</dt><dd>{entry.version}</dd></div>
        </dl>

        {blocked && (
          <div className="mt-4 rounded-xl border border-warning/40 bg-warning/5 p-3 text-sm">
            <p className="font-medium">Blocking source</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">{entry.blockers.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        )}

        <div className="mt-5">
          <p className="text-eyebrow mb-2">Composed readiness checks</p>
          <ul className="divide-y divide-border">
            {CHECKS.map((c) => (
              <li key={c.label} className="flex items-center justify-between py-2 text-sm">
                <span>{c.label}</span>
                <StatusBadge tone={c.pass && !blocked ? "sage" : "muted"}>{c.pass && !blocked ? "PASS" : "N/A"}</StatusBadge>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </InternalShell>
  );
}
