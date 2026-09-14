/**
 * /faq — Consumer-facing FAQ (linked from marketplace footer).
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, HelpCircle } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ABox" },
      { name: "description", content: "Answers to the most common questions about ABox marketplace, quotes, Plan-AI, enrollment, and privacy." },
      { property: "og:title", content: "FAQ — ABox" },
      { property: "og:description", content: "Common questions about shopping insurance on ABox." },
    ],
  }),
  component: FaqPage,
});

const GROUPS = [
  {
    label: "Shopping & quotes",
    items: [
      { q: "Is a quote binding?", a: "No. A quote is an estimate based on the information you provide. Actual premiums, benefits, and eligibility are confirmed at enrollment by the carrier." },
      { q: "How accurate is the subsidy estimate?", a: "The estimate uses federal APTC math on the household you entered. Final subsidy is confirmed by the Marketplace at enrollment." },
      { q: "Can I compare plans across carriers?", a: "Yes. Add up to five plans to the compare tray from any results page to see benefits, premiums, and networks side by side." },
    ],
  },
  {
    label: "Plan-AI (AI guidance)",
    items: [
      { q: "Is Plan-AI giving me advice?", a: "Plan-AI is educational only — it summarizes trade-offs and cannot recommend a specific plan. Licensed agents provide advice." },
      { q: "Can I turn Plan-AI off?", a: "Yes. Plan-AI availability is controlled by the tenant. If Plan-AI is disabled for your marketplace, you'll see standard help copy instead." },
    ],
  },
  {
    label: "Working with an agent",
    items: [
      { q: "How do I request an agent?", a: "Use \"Agent help\" in the header or open the Schedule page from the footer to book a call or callback." },
      { q: "Can an agent finish my quote for me?", a: "Yes. Agents can pick up any shared quote link, resume the wizard, and enroll on your behalf with your consent." },
    ],
  },
  {
    label: "Privacy & security",
    items: [
      { q: "Where is my information stored?", a: "In an encrypted, US-based cloud with role-based access. See our Privacy page for retention, deletion, and sharing details." },
      { q: "Do you sell my data?", a: "No. Contact information is used only to service quotes, appointments, and enrollments." },
    ],
  },
];

function FaqPage() {
  return (
    <MarketplaceShell showAssistant>
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-6 md:px-8 md:pt-8">
        <PageHeader eyebrow="Support" title="Frequently asked questions"
          description="Short answers to the questions we hear most. If yours isn't here, an agent is one click away." />
        <div className="mt-8 space-y-8">
          {GROUPS.map((g) => (
            <section key={g.label}>
              <p className="text-eyebrow mb-3">{g.label}</p>
              <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {g.items.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} />
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-border bg-primary-soft p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
            <div>
              <p className="text-display text-xl">Still need help?</p>
              <p className="mt-1 text-sm text-muted-foreground">Talk to a licensed agent — no charge, no obligation.</p>
              <a href="/schedule" className="mt-3 inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">Schedule a call</a>
            </div>
          </div>
        </div>
      </div>
    </MarketplaceShell>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/40"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-muted-foreground">{a}</div>}
    </li>
  );
}
