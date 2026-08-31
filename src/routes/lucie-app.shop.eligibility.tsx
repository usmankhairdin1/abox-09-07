import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Info, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field, PageHeader, Section, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { subsidyEstimate, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/eligibility")({
  head: () => ({
    meta: [
      { title: "Coverage details — Northgate Marketplace" },
      {
        name: "description",
        content: "Tell us who needs cover, where you live and your expected household income to see priced plans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Coverage details" },
      { property: "og:description", content: "A short intake that prices plans for your household." },
    ],
  }),
  component: EligibilityPage,
});

function EligibilityPage() {
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const h = state.household;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const estimate = subsidyEstimate(h);

  const setApplicant = (id: string, patch: Partial<(typeof h.applicants)[number]>) =>
    dispatch({
      type: "household",
      patch: { applicants: h.applicants.map((a) => (a.id === id ? { ...a, ...patch } : a)) },
    });

  const addApplicant = () =>
    dispatch({
      type: "household",
      patch: {
        applicants: [
          ...h.applicants,
          {
            id: `A${h.applicants.length + 1}`,
            name: "",
            age: 0,
            tobacco: false,
            relationship: "Dependent",
          },
        ],
        household: h.household + 1,
      },
    });

  const removeApplicant = (id: string) =>
    dispatch({
      type: "household",
      patch: {
        applicants: h.applicants.filter((a) => a.id !== id),
        household: Math.max(1, h.household - 1),
      },
    });

  const submit = () => {
    const next: Record<string, string> = {};
    if (!/^\d{5}$/.test(h.zip)) next.zip = "Enter a 5 digit zip code.";
    if (!h.income || h.income <= 0) next.income = "Enter the household income you expect this year.";
    h.applicants.forEach((a) => {
      if (!a.name.trim()) next[a.id] = "Add a name.";
      else if (!a.age || a.age < 0 || a.age > 120) next[a.id] = "Add a valid age.";
    });
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Check the highlighted fields before continuing.");
      return;
    }
    dispatch({ type: "household", patch: { submitted: true } });
    toast.success("Prices updated for your household.");
    void navigate({ to: "/lucie-app/shop/plans" });
  };

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={0} />
      <PageHeader
        eyebrow="Step 1 of 9"
        title="Coverage details"
        lede="We use this to price plans and to work out whether you qualify for premium assistance. Nothing is shared with a carrier until you apply."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-6">
          <Section title="Where you live">
            <Card className="grid gap-4 p-5 sm:grid-cols-3">
              <Field label="Zip code" required hint={errors.zip}>
                <Input
                  value={h.zip}
                  inputMode="numeric"
                  maxLength={5}
                  aria-invalid={Boolean(errors.zip)}
                  onChange={(e) => dispatch({ type: "household", patch: { zip: e.target.value } })}
                />
              </Field>
              <Field label="County">
                <Input value={h.county} onChange={(e) => dispatch({ type: "household", patch: { county: e.target.value } })} />
              </Field>
              <Field label="Coverage start">
                <Select
                  value={h.coverageStart}
                  onValueChange={(v) => dispatch({ type: "household", patch: { coverageStart: v } })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026-10-01">1 October 2026</SelectItem>
                    <SelectItem value="2026-11-01">1 November 2026</SelectItem>
                    <SelectItem value="2027-01-01">1 January 2027</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </Card>
          </Section>

          <Section
            title="Who needs coverage"
            actions={
              <Button variant="outline" size="sm" onClick={addApplicant}>
                <Plus className="h-3.5 w-3.5" /> Add person
              </Button>
            }
          >
            <div className="grid gap-3">
              {h.applicants.map((a) => (
                <Card key={a.id} className="grid gap-4 p-4 sm:grid-cols-[minmax(0,2fr)_90px_minmax(0,1fr)_auto] sm:items-end">
                  <Field label="Full name" required hint={errors[a.id]}>
                    <Input
                      value={a.name}
                      aria-invalid={Boolean(errors[a.id])}
                      onChange={(e) => setApplicant(a.id, { name: e.target.value })}
                    />
                  </Field>
                  <Field label="Age" required>
                    <Input
                      value={a.age || ""}
                      inputMode="numeric"
                      onChange={(e) => setApplicant(a.id, { age: Number(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field label="Relationship">
                    <Select value={a.relationship} onValueChange={(v) => setApplicant(a.id, { relationship: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Self">Self</SelectItem>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Dependent">Dependent</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="flex items-center gap-3 pb-1.5">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Switch checked={a.tobacco} onCheckedChange={(v) => setApplicant(a.id, { tobacco: v })} />
                      Tobacco
                    </label>
                    {h.applicants.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${a.name || "person"}`}
                        onClick={() => removeApplicant(a.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Household income">
            <Card className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Expected income this year" required hint={errors.income ?? "Before tax, for everyone on the application."}>
                <Input
                  value={h.income || ""}
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.income)}
                  onChange={(e) => dispatch({ type: "household", patch: { income: Number(e.target.value) || 0 } })}
                />
              </Field>
              <Field label="People in your tax household">
                <Input
                  value={h.household}
                  inputMode="numeric"
                  onChange={(e) => dispatch({ type: "household", patch: { household: Number(e.target.value) || 1 } })}
                />
              </Field>
            </Card>
          </Section>

          <div className="flex justify-end">
            <Button size="lg" onClick={submit}>
              See my plans <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <aside className="grid content-start gap-3">
          <Card className="gap-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assistance estimate</p>
            {estimate.eligible ? (
              <>
                <p className="font-display text-3xl font-semibold tabular-nums text-success">
                  ${estimate.monthly}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {estimate.fplPct}% of the federal poverty level for a household of {h.household}. The final
                  amount is confirmed when you apply.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl font-semibold">Not estimated</p>
                <p className="text-xs text-muted-foreground">
                  At {estimate.fplPct}% of the federal poverty level, premium assistance is unlikely. You can still
                  shop every plan at full price.
                </p>
              </>
            )}
          </Card>
          <Card className="gap-2 border-info/25 bg-info/5 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-info">
              <Info className="h-3.5 w-3.5" /> Why we ask
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Age, location and tobacco use change the price of every plan. Income only affects assistance, and you can
              change it later without losing your progress.
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
