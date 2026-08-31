import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Download, Mail } from "lucide-react";

import { Money, PageHeader, Section, StatusChip, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { planById } from "@/lib/lucie-app/data";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { subsidyEstimate, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/confirmation")({
  head: () => ({
    meta: [
      { title: "You are covered — Northgate Marketplace" },
      { name: "description", content: "Your enrolment is confirmed. See your plans, effective dates, documents and what happens next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Enrolment confirmed" },
      { property: "og:description", content: "Plans, effective dates and next steps after enrolment." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { state } = useLucie();
  const assistance = subsidyEstimate(state.household);
  const plans = state.cart
    .map((l) => planById(l.planId))
    .filter((p): p is NonNullable<ReturnType<typeof planById>> => Boolean(p));

  const net = (p: (typeof plans)[number]) =>
    p.kind === "medical" && p.market === "on-exchange" && assistance.eligible
      ? Math.max(0, p.premium - assistance.monthly)
      : p.premium;
  const monthly = plans.reduce((s, p) => s + net(p), 0);

  const start = new Date(state.household.coverageStart).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={8} />

      <Card className="grid gap-3 border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <h1 className="font-display text-3xl font-semibold">You are covered from {start}</h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          Your enrolment is confirmed with the carrier. Member ID cards arrive by post within ten days; digital cards are
          in your account today.
        </p>
        {state.application.submissionId ? (
          <div className="flex justify-center">
            <StatusChip tone="good">Reference {state.application.submissionId}</StatusChip>
          </div>
        ) : null}
      </Card>

      <PageHeader eyebrow="Confirmation" title="What you enrolled in" lede="Keep this for your records." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Section title="Your plans">
          <div className="grid gap-3">
            {plans.map((p) => (
              <Card key={p.id} className="grid gap-2 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip tone="info">{p.kind}</StatusChip>
                    <StatusChip tone="good">Active {start}</StatusChip>
                  </div>
                  <p className="mt-1.5 font-display text-base font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.carrier} · policy issued</p>
                </div>
                <span className="font-display text-lg font-semibold">
                  <Money value={net(p)} per="mo" />
                </span>
              </Card>
            ))}
          </div>
        </Section>

        <aside className="grid content-start gap-3">
          <Card className="grid gap-3 p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Monthly total</span>
              <span className="font-display text-2xl font-semibold">
                <Money value={monthly} per="mo" />
              </span>
            </div>
            {assistance.eligible ? (
              <p className="text-xs text-success">${assistance.monthly}/month assistance applied automatically.</p>
            ) : null}
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Download confirmation pack
            </Button>
            <Button variant="ghost" size="sm">
              <Mail className="h-3.5 w-3.5" /> Email a copy
            </Button>
          </Card>

          <Card className="grid gap-2 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <CalendarCheck className="h-4 w-4 text-primary" /> Next steps
            </p>
            <ul className="grid gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <li>Pay your first premium before {start} to activate cover.</li>
              <li>Register on the carrier portal using your member reference.</li>
              <li>Report any change in income or household within 30 days.</li>
            </ul>
          </Card>

          <Button asChild>
            <Link to="/lucie-app">Return to the walkthrough</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
