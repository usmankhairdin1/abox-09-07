/**
 * /privacy — Consumer privacy notice.
 */
import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — ABox" },
      { name: "description", content: "How ABox collects, uses, retains, and shares your information — and the rights you have over it." },
      { property: "og:title", content: "Privacy at ABox" },
      { property: "og:description", content: "Our data practices in plain language." },
    ],
  }),
  component: Page,
});

const SECTIONS = [
  { h: "What we collect", body: "Contact details (name, email, phone, ZIP), household composition, plan preferences, and — only when you provide it — provider and prescription lookups." },
  { h: "Why we collect it", body: "To match you to eligible plans and subsidies, connect you with a licensed agent, and complete enrollment with your chosen carrier." },
  { h: "How long we keep it", body: "Active quotes for 90 days. Enrolled records for the period required by federal and state insurance regulations (typically 7 years)." },
  { h: "Who we share it with", body: "Your selected carrier at enrollment, the licensed agent you consent to work with, and payment or scheduling processors strictly needed to service your quote." },
  { h: "We do not sell your data", body: "ABox never sells personal information. We do not share it with advertisers or brokers outside your consented workflow." },
  { h: "Your rights", body: "You may access, correct, or delete your data at any time from Member → Settings → Privacy. Residents of applicable states may also request a portable copy or opt out of profiling." },
  { h: "Security", body: "TLS in transit, AES-256 at rest, role-based access with least privilege, and immutable audit logging of every access to a customer record." },
];

function Page() {
  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-3xl px-4 pb-14 pt-6 md:px-8 md:pt-8">
        <PageHeader eyebrow="Legal" title="Privacy notice"
          description="Plain-language summary of our privacy practices. Effective July 20, 2026." />

        <div className="mt-8 space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.h} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-display text-xl">{s.h}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          For the full legal notice, request a copy at{" "}
          <a href="mailto:privacy@abox.example" className="story-link text-primary">privacy@abox.example</a>.
        </p>
      </div>
    </MarketplaceShell>
  );
}
