/**
 * /compliance — Regulatory & data compliance overview.
 */
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, Scale, ScrollText } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { StatusBadge } from "@/components/abox/status-badge";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance — ABox" },
      { name: "description", content: "How ABox meets ACA display rules, HIPAA safeguards, state DOI requirements, SOC 2, and NIPR license validation." },
      { property: "og:title", content: "Compliance at ABox" },
      { property: "og:description", content: "ACA, HIPAA, SOC 2, and state DOI compliance at ABox." },
    ],
  }),
  component: Page,
});

const PROGRAMS = [
  { icon: Scale, title: "ACA display rules", status: "Enforced", body: "QHP results follow federal display, sorting, and non-discrimination requirements. Plan-O guidance is separated from ranked results." },
  { icon: Lock, title: "HIPAA safeguards", status: "Active", body: "Encrypted transit and storage, RBAC, minimum-necessary access. Provider and drug lookups are stored only when the shopper opts in." },
  { icon: ShieldCheck, title: "SOC 2 Type II", status: "In progress", body: "Continuous monitoring for security, availability, and confidentiality controls. Audit window: 2026-Q3 → 2027-Q1." },
  { icon: ScrollText, title: "State DOI licensing", status: "NIPR verified", body: "Every producer is validated against NIPR nightly. Consumers only see agents licensed and appointed in their state." },
];

function Page() {
  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-8">
        <PageHeader eyebrow="Trust" title="Compliance"
          description="ABox is a regulated marketplace. Here's how we meet the standards insurance carriers, regulators, and shoppers expect." />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PROGRAMS.map(({ icon: Icon, title, status, body }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                  <p className="font-medium">{title}</p>
                </div>
                <StatusBadge tone={status === "In progress" ? "warning" : "sage"}>{status}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-display text-2xl">Data retention & subject rights</h2>
          <p className="mt-2 text-sm text-muted-foreground">Retention follows carrier and regulator requirements — typically 7 years for enrolled records. Shoppers can request access, correction, or deletion from Member → Settings → Privacy at any time.</p>
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
