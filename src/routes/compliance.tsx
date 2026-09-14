/**
 * /compliance — Regulatory & data compliance overview.
 *
 * This page previously asserted present-tense claims ("Active", "Enforced",
 * "NIPR verified") that the running build did not back up — no RBAC or
 * encryption-at-rest exists yet, and the app's own sample integration
 * data (sample-data-ext.ts) shows the NIPR sync as disconnected. Rewritten
 * to describe actual current state plus target posture, since shipping
 * unqualified compliance claims on a pre-production prototype is a real
 * legal/regulatory risk, not just a copy nit.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck, Lock, Scale, ScrollText } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { StatusBadge } from "@/components/abox/status-badge";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance — ABox" },
      { name: "description", content: "ABox's target compliance posture (ACA display rules, HIPAA, SOC 2, state DOI/NIPR) and what's actually implemented in the current prototype." },
      { property: "og:title", content: "Compliance at ABox" },
      { property: "og:description", content: "Target compliance posture and current implementation status — this build is a pre-production prototype." },
    ],
  }),
  component: Page,
});

const PROGRAMS = [
  {
    icon: Scale, title: "ACA display rules", status: "Partially implemented", tone: "warning" as const,
    body: "On-exchange results show every available QHP with no compensation-based ranking, and off-exchange plans are labeled separately. Not yet built: a visible disclosure of the ranking methodology on the results page, and a compliance/legal review of the non-discrimination requirements end-to-end.",
  },
  {
    icon: Lock, title: "HIPAA safeguards", status: "Not yet implemented", tone: "destructive" as const,
    body: "This prototype has no authentication, role-based access control, or encryption-at-rest — quote and cart data live in the browser's local/session storage in plain form. Real HIPAA safeguards require the backend (auth, database, RLS) that this build doesn't have yet.",
  },
  {
    icon: ShieldCheck, title: "SOC 2 Type II", status: "Not started", tone: "muted" as const,
    body: "No audit engagement exists yet. This is a target for the production build, not an in-progress program — listing a specific audit window before backend infrastructure exists would be premature.",
  },
  {
    icon: ScrollText, title: "State DOI licensing / NIPR", status: "Not connected", tone: "destructive" as const,
    body: "No live NIPR integration exists. This build's own sample integrations data shows the NIPR license sync as disconnected — producer licensing displays are illustrative placeholders, not verified against a real registry.",
  },
];

function Page() {
  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-6 md:px-8 md:pt-8">
        <PageHeader eyebrow="Trust" title="Compliance"
          description="What ABox is built to do, and how far the current build actually gets there." />

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
          <p className="text-sm">
            <span className="font-medium">This is a pre-production prototype.</span>{" "}
            The statuses below reflect what's actually implemented today, not a certified compliance posture.
            Do not rely on this page to represent ABox's regulatory status to carriers, regulators, or shoppers
            until backend infrastructure and a legal/compliance review are complete.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {PROGRAMS.map(({ icon: Icon, title, status, tone, body }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                  <p className="font-medium">{title}</p>
                </div>
                <StatusBadge tone={tone}>{status}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-display text-2xl">Data retention & subject rights</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Target: retention following carrier and regulator requirements, with shopper-initiated access/correction/
            deletion requests. Current state: Member → Settings → Privacy has the request UI, but the "Request
            download" and "Start request" actions aren't wired to any processing yet — there's no backend to fulfill
            them against.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-display text-2xl">Responsible disclosure</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Report a security concern to{" "}
            <a href="mailto:security@abox.example" className="story-link text-primary">security@abox.example</a>.
            We acknowledge within one business day and follow a 90-day coordinated disclosure window.
          </p>
        </section>
      </div>
    </MarketplaceShell>
  );
}
