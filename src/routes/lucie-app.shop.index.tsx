import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

import { Section } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/lucie-app/shop/")({
  head: () => ({
    meta: [
      { title: "Northgate Marketplace — Find your coverage" },
      {
        name: "description",
        content:
          "Answer a few questions, see plans priced for your household with any assistance applied, compare side by side and apply online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Northgate Marketplace — Find your coverage" },
      {
        property: "og:description",
        content: "Individual, dental and vision cover with clear pricing and a guided application.",
      },
    ],
  }),
  component: ShopLanding,
});

const PRODUCTS = [
  {
    icon: HeartPulse,
    name: "Individual & family health",
    body: "Marketplace plans with premium assistance applied automatically when you qualify.",
  },
  {
    icon: Stethoscope,
    name: "Dental",
    body: "Preventive care from day one, with major services and orthodontia options.",
  },
  { icon: ShieldCheck, name: "Vision", body: "Annual exams, frame allowance and contact lens alternatives." },
];

function ShopLanding() {
  return (
    <>
      <Card className="overflow-hidden border-border p-0">
        <div className="grid gap-6 bg-primary p-8 text-primary-foreground sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-4">
            <span className="w-fit rounded-full border border-primary-foreground/25 px-3 py-1 text-[11px] font-medium">
              Northgate Insurance Group
            </span>
            <h1 className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Coverage that fits your household, priced before you commit.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-primary-foreground/80">
              Tell us who needs cover and where you live. We will show real plan pricing, apply any assistance you
              qualify for, and walk you through the application without the paperwork.
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <Button asChild size="lg" variant="secondary">
                <Link to="/lucie-app/shop/eligibility">
                  Get my prices <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/lucie-app/shop/plans">Browse plans first</Link>
              </Button>
            </div>
          </div>
          <div className="grid content-start gap-3 rounded-xl bg-primary-foreground/10 p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" /> Plan match
            </p>
            <p className="text-xs leading-relaxed text-primary-foreground/80">
              Once we know your doctors and prescriptions, every plan gets a fit score so you can see why one plan
              suits you better than another — not just which is cheapest.
            </p>
            <div className="grid gap-2 pt-1">
              {["Your providers checked against each network", "Prescription tiers compared", "Total yearly cost, not just premium"].map(
                (t) => (
                  <p key={t} className="text-xs text-primary-foreground/90">
                    · {t}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>
      </Card>

      <Section title="What you can shop for" description="Add more than one product to the same cart.">
        <div className="grid gap-3 sm:grid-cols-3">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.name} className="gap-2 p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{p.body}</p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="How it works">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ["Tell us about your household", "Zip code, who needs cover and expected income."],
            ["See real prices", "Plans priced for you, with assistance applied where it applies."],
            ["Choose and cart", "Compare up to three plans and add what you want."],
            ["Apply and sign", "One guided application, signed online, tracked to a result."],
          ].map(([t, b], i) => (
            <Card key={t} className="gap-1.5 p-5">
              <span className="font-display text-2xl font-semibold text-primary/40">{i + 1}</span>
              <h3 className="text-sm font-semibold">{t}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{b}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
