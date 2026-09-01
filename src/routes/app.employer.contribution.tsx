import { EmployerFrame } from "@/components/lucie-app/frames";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Money, PageHeader, Section, StatCard } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { contributionTotals, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/app/employer/contribution")({
  head: () => ({
    meta: [
      { title: "Contribution model — Cedarline Logistics" },
      { name: "description", content: "Choose a flat, age-banded or class-based allowance and watch the cost update as you adjust it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Contribution model" },
      { property: "og:description", content: "Design the allowance your employees receive each month." },
    ],
  }),
  component: () => (
    <EmployerFrame title="Contribution model">
      <ContributionPage />
    </EmployerFrame>
  ),
});

const MODELS = [
  { id: "flat", title: "Flat allowance", body: "Everyone gets the same monthly amount. Simplest to explain and administer." },
  { id: "age", title: "Age banded", body: "Older employees get more, tracking how individual premiums rise with age." },
  { id: "class", title: "Class based", body: "Different amounts by employment class, for example full-time versus part-time." },
] as const;

function ContributionPage() {
  const { state, dispatch } = useLucie();
  const c = state.contribution;
  const totals = contributionTotals(state);

  return (
    <>
      <PageHeader
        eyebrow="Step 2 of 4"
        title="Contribution model"
        lede="Set what you contribute; employees keep any difference between your allowance and the plan they choose, or pay the balance themselves."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-6">
          <Section title="How the allowance is calculated">
            <RadioGroup
              value={c.model}
              onValueChange={(v) => dispatch({ type: "contribution", patch: { model: v as typeof c.model } })}
              className="grid gap-3 sm:grid-cols-3"
            >
              {MODELS.map((m) => (
                <Label
                  key={m.id}
                  className={`grid cursor-pointer content-start gap-2 rounded-xl border p-4 transition-colors ${
                    c.model === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <RadioGroupItem value={m.id} />
                    <span className="text-sm font-medium">{m.title}</span>
                  </span>
                  <span className="text-xs font-normal leading-relaxed text-muted-foreground">{m.body}</span>
                </Label>
              ))}
            </RadioGroup>
          </Section>

          <Section title="Amounts">
            <Card className="grid gap-6 p-5">
              <div className="grid gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium">Base monthly allowance</span>
                  <span className="font-display text-lg font-semibold">
                    <Money value={c.base} per="mo" />
                  </span>
                </div>
                <Slider
                  value={[c.base]}
                  min={100}
                  max={900}
                  step={25}
                  onValueChange={([v]) => dispatch({ type: "contribution", patch: { base: v } })}
                />
              </div>

              {c.model === "age" ? (
                <div className="grid gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium">Age curve strength</span>
                    <span className="text-sm tabular-nums">{c.ageFactor.toFixed(1)}×</span>
                  </div>
                  <Slider
                    value={[c.ageFactor * 10]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={([v]) => dispatch({ type: "contribution", patch: { ageFactor: v / 10 } })}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    A stronger curve gives older employees more and younger employees slightly less.
                  </p>
                </div>
              ) : null}

              {c.model === "class" ? (
                <div className="grid gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium">Full-time uplift</span>
                    <span className="text-sm tabular-nums">+${c.classUplift}/mo</span>
                  </div>
                  <Slider
                    value={[c.classUplift]}
                    min={0}
                    max={400}
                    step={25}
                    onValueChange={([v]) => dispatch({ type: "contribution", patch: { classUplift: v } })}
                  />
                </div>
              ) : null}
            </Card>
          </Section>
        </div>

        <aside className="grid content-start gap-3">
          <StatCard label="Monthly cost" value={<Money value={totals.monthly} />} hint={`${state.census.length} employees`} />
          <StatCard label="Annual cost" value={<Money value={totals.annual} />} />
          <StatCard
            label="Average per employee"
            value={<Money value={state.census.length ? Math.round(totals.monthly / state.census.length) : 0} per="mo" />}
          />
          <Button asChild>
            <Link to="/lucie-app/employer/results">
              See cost results <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
