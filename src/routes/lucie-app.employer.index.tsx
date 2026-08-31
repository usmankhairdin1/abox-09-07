import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Users } from "lucide-react";

import { Money, PageHeader, Section, StatCard, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contributionTotals, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/employer/")({
  head: () => ({
    meta: [
      { title: "Group benefits overview — Cedarline Logistics" },
      { name: "description", content: "Model an individual coverage allowance for your team: census, contribution rules, cost results and a proposal you can route to your agency." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Group benefits overview" },
      { property: "og:description", content: "Design and cost an individual coverage allowance in four steps." },
    ],
  }),
  component: EmployerHome,
});

const STEPS = [
  { to: "/lucie-app/employer/census", title: "Employee census", body: "Confirm who is eligible, their age band and location." },
  { to: "/lucie-app/employer/contribution", title: "Contribution model", body: "Choose flat, age-banded or class-based allowances." },
  { to: "/lucie-app/employer/results", title: "Cost results", body: "See the monthly and annual cost, per employee." },
  { to: "/lucie-app/employer/proposal", title: "Proposal", body: "Package the design and route it to your agency." },
] as const;

function EmployerHome() {
  const { state } = useLucie();
  const totals = contributionTotals(state);

  return (
    <>
      <PageHeader
        eyebrow="Cedarline Logistics"
        title="Group benefits overview"
        lede="Instead of buying a group plan, you give each employee an allowance to buy their own cover. Work through the four steps and you end with a costed proposal."
        actions={
          <Button asChild>
            <Link to="/lucie-app/employer/census">
              <Users className="h-4 w-4" /> Start with the census
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Eligible employees" value={state.census.length} hint="From your current census" />
        <StatCard label="Model" value={state.contribution.model === "age" ? "Age banded" : state.contribution.model === "class" ? "Class based" : "Flat"} hint="Contribution rule" />
        <StatCard label="Monthly cost" value={<Money value={totals.monthly} />} hint="Employer share" />
        <StatCard label="Annual cost" value={<Money value={totals.annual} />} hint="12 month projection" />
      </div>

      <Section title="Your four steps">
        <div className="grid gap-3 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <Card key={s.to} className="grid gap-2 p-5">
              <StatusChip tone="info">Step {i + 1}</StatusChip>
              <p className="font-display text-base font-semibold">{s.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              <Button variant="ghost" size="sm" className="w-fit" asChild>
                <Link to={s.to}>
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {state.ichraRouted ? (
        <Card className="border-success/30 bg-success/5 p-5">
          <p className="text-sm font-medium text-success">Your proposal has been routed to Northgate Insurance Group.</p>
          <p className="text-xs text-muted-foreground">An agency adviser will follow up to set enrolment dates.</p>
        </Card>
      ) : null}
    </>
  );
}
