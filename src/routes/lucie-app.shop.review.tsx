import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, PencilLine } from "lucide-react";

import { Money, PageHeader, Section, StatusChip, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { planById } from "@/lib/lucie-app/data";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { subsidyEstimate, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/review")({
  head: () => ({
    meta: [
      { title: "Review before you sign — Northgate Marketplace" },
      { name: "description", content: "Check your household, plans, answers and documents before signing your application." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Review before you sign" },
      { property: "og:description", content: "One last check of everything you are about to submit." },
    ],
  }),
  component: ReviewPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-3 border-b border-border/60 py-2 text-sm last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words">{value || <span className="text-muted-foreground">Not provided</span>}</span>
    </div>
  );
}

function ReviewPage() {
  const { state } = useLucie();
  const navigate = useNavigate();
  const app = state.application;
  const assistance = subsidyEstimate(state.household);

  const lines = state.cart
    .map((l) => planById(l.planId))
    .filter((p): p is NonNullable<ReturnType<typeof planById>> => Boolean(p));

  const net = (p: (typeof lines)[number]) =>
    p.kind === "medical" && p.market === "on-exchange" && assistance.eligible
      ? Math.max(0, p.premium - assistance.monthly)
      : p.premium;
  const monthly = lines.reduce((s, p) => s + net(p), 0);

  const gaps: string[] = [];
  if (!app.address.line1) gaps.push("Home address is incomplete.");
  if (!app.answers.citizen) gaps.push("Citizenship question is unanswered.");
  if (app.documents.length === 0) gaps.push("No supporting documents uploaded — the carrier may request them later.");

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={6} />
      <PageHeader
        eyebrow="Step 7 of 9"
        title="Review before you sign"
        lede="Nothing has been sent yet. Check each section and edit anything that looks wrong."
      />

      {gaps.length ? (
        <Card className="flex gap-3 border-warning/30 bg-warning/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div className="grid gap-1 text-xs text-muted-foreground">
            {gaps.map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-6">
          <Section
            title="Household and coverage"
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/lucie-app/shop/eligibility">
                  <PencilLine className="h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
            }
          >
            <Card className="grid gap-0 p-5">
              <Row label="Applicants" value={state.household.applicants.map((a) => `${a.name} (${a.age})`).join(", ")} />
              <Row label="Location" value={`${state.household.zip} · ${state.household.county} County, ${state.household.state}`} />
              <Row label="Household income" value={`$${state.household.income.toLocaleString()} per year`} />
              <Row
                label="Coverage starts"
                value={new Date(state.household.coverageStart).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </Card>
          </Section>

          <Section
            title="Your details"
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/lucie-app/shop/application">
                  <PencilLine className="h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
            }
          >
            <Card className="grid gap-0 p-5">
              <Row label="Legal name" value={app.personal.legalName} />
              <Row label="Date of birth" value={app.personal.dob} />
              <Row label="SSN" value={app.personal.ssnLast4 ? `••• •• ${app.personal.ssnLast4}` : ""} />
              <Row label="Contact" value={[app.personal.email, app.personal.phone].filter(Boolean).join(" · ")} />
              <Row
                label="Address"
                value={[app.address.line1, app.address.city, app.address.state, app.address.zip].filter(Boolean).join(", ")}
              />
              <Row label="Citizen or lawfully present" value={app.answers.citizen} />
              <Row label="Tobacco in last 6 months" value={app.answers.tobacco} />
              <Row label="Other coverage" value={app.answers.otherCoverage} />
              <Row label="Notes for carrier" value={app.answers.conditions} />
            </Card>
          </Section>

          <Section
            title="Documents"
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/lucie-app/shop/documents">
                  <PencilLine className="h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
            }
          >
            <Card className="grid gap-0 p-5">
              {app.documents.length ? (
                app.documents.map((d) => <Row key={d.id} label={d.kind} value={`${d.name} · ${d.size}`} />)
              ) : (
                <p className="text-sm text-muted-foreground">No files uploaded.</p>
              )}
            </Card>
          </Section>
        </div>

        <aside className="grid content-start gap-3">
          <Card className="grid gap-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">You are applying for</p>
            {lines.map((p) => (
              <div key={p.id} className="grid gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <StatusChip tone="info">{p.kind}</StatusChip>
                  <StatusChip tone={p.market === "on-exchange" ? "warn" : "good"}>{p.market}</StatusChip>
                </div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.carrier} · <Money value={net(p)} per="mo" />
                </p>
              </div>
            ))}
            <div className="flex items-baseline justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Monthly total</span>
              <span className="font-display text-2xl font-semibold">
                <Money value={monthly} per="mo" />
              </span>
            </div>
            <Button onClick={() => void navigate({ to: "/lucie-app/shop/esign" })}>
              Continue to signature <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </aside>
      </div>
    </>
  );
}
