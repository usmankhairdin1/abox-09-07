/**
 * /terms — Terms of use.
 */
import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — ABox" },
      { name: "description", content: "The terms that govern your use of the ABox marketplace, Plan-AI guidance, and connected services." },
      { property: "og:title", content: "Terms of Use — ABox" },
      { property: "og:description", content: "The rules for using ABox." },
    ],
  }),
  component: Page,
});

const SECTIONS = [
  { h: "1. Acceptance", body: "By using ABox you agree to these terms. If you do not agree, do not use the service." },
  { h: "2. Nature of the service", body: "ABox is a marketplace that displays coverage options from licensed carriers. Quotes are estimates; actual coverage is issued by the carrier upon enrollment approval." },
  { h: "3. Plan-AI is educational", body: "Plan-AI provides trade-off explanations and general information. It is not legal, tax, medical, or licensed insurance advice. Consult a licensed agent for advice." },
  { h: "4. Eligibility", body: "You must be at least 18 years old and a US resident to create an account. You are responsible for information you provide about your household." },
  { h: "5. Acceptable use", body: "Do not scrape the marketplace, impersonate another person, or attempt to submit false enrollment information. We may suspend accounts for violations." },
  { h: "6. Commissions & disclosures", body: "ABox and its agent partners are compensated by carriers when policies are issued. This does not affect your premium. Full disclosures are available on request." },
  { h: "7. Limitation of liability", body: "ABox is not liable for coverage decisions made by carriers, for network changes made by providers, or for any indirect damages arising from use of the service." },
  { h: "8. Changes", body: "We may update these terms. Material changes will be highlighted at sign-in for 30 days before taking effect." },
];

function Page() {
  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-3xl px-4 pb-14 pt-6 md:px-8 md:pt-8">
        <PageHeader eyebrow="Legal" title="Terms of use" description="Effective July 20, 2026." />
        <div className="mt-8 space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.h} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-display text-xl">{s.h}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          Questions? Contact <a href="mailto:legal@abox.example" className="story-link text-primary">legal@abox.example</a>.
        </p>
      </div>
    </MarketplaceShell>
  );
}
