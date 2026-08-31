import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Store, Users } from "lucide-react";

import { PageHeader, Section, StatCard } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { personaById } from "@/lib/lucie-app/data";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/")({
  head: () => ({
    meta: [
      { title: "Lucie — Guided walkthrough" },
      {
        name: "description",
        content:
          "Walk the Lucie release journeys end to end: individual shopping and enrollment, producer onboarding, marketplace setup, group contribution modelling and platform operations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie — Guided walkthrough" },
      {
        property: "og:description",
        content: "A connected prototype of the Lucie release journeys with realistic sample data.",
      },
    ],
  }),
  component: LucieHome,
});

const JOURNEYS = [
  {
    icon: Store,
    title: "Shop, apply and enrol",
    body: "Enter coverage details, see priced plans with an assistance estimate, compare, cart, apply, sign and track the submission.",
    to: "/lucie-app/shop",
    cta: "Start shopping",
    persona: "Dana Whitfield · Shopper",
  },
  {
    icon: Users,
    title: "Onboard a producer and launch a marketplace",
    body: "Add a producer, capture licences and appointments, record a readiness decision, then brand and publish a marketplace.",
    to: "/lucie-app/agency",
    cta: "Open agency",
    persona: "Priya Raman · Agency administrator",
  },
  {
    icon: Building2,
    title: "Model group contributions",
    body: "Build a census, model an employer contribution, review costs, generate a proposal and route it to an agency.",
    to: "/lucie-app/employer",
    cta: "Open employer",
    persona: "Alan Duquesne · Benefits lead",
  },
];

function LucieHome() {
  const { state } = useLucie();
  const persona = personaById(state.persona);
  const openExceptions = state.exceptions.filter((e) => e.status === "open").length;

  return (
    <>
      <PageHeader
        eyebrow="Guided walkthrough"
        title={`Welcome back, ${persona.name.split(" ")[0]}`}
        lede="Pick a journey below, or use the workspace navigation. Every action you take is reflected on the next screen, so the walkthrough behaves like the real product."
        actions={
          <Button asChild>
            <Link to={persona.home}>
              Go to my workspace <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Producers ready to sell" value={state.agents.filter((a) => a.status === "ready").length} hint={`${state.agents.length} on the roster`} />
        <StatCard label="Live marketplaces" value={state.marketplaces.filter((m) => m.status === "live").length} hint="Branded storefronts" />
        <StatCard label="Submissions in flight" value={state.submissions.length} hint="Across both channels" />
        <StatCard
          label="Open exceptions"
          value={openExceptions}
          tone={openExceptions ? "warn" : "good"}
          hint="Owned by operations"
        />
      </div>

      <Section title="Journeys" description="Each one runs from first screen to confirmed result.">
        <div className="grid gap-3 lg:grid-cols-3">
          {JOURNEYS.map((j) => {
            const Icon = j.icon;
            return (
              <Card key={j.title} className="justify-between gap-4 p-5">
                <div className="grid gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="font-display text-base font-semibold tracking-tight">{j.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{j.body}</p>
                  <p className="text-[11px] text-muted-foreground">Best viewed as {j.persona}</p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-fit">
                  <Link to={j.to}>
                    {j.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Platform operations" description="Monitoring, audit and launch readiness for the whole estate.">
        <Card className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <p className="text-sm text-muted-foreground">
            Tenants, roles, entitlements, integration health, the exception queue, the activity trail and launch
            readiness all live in the platform workspace.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/lucie-app/platform">
              Open platform operations <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </Card>
      </Section>
    </>
  );
}
