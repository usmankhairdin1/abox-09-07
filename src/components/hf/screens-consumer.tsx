import { ArrowRight, Check as CheckIcon, ExternalLink, ShieldCheck, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { HfConsumerShell } from "@/components/hf/HfConsumerShell";
import {
  Alert,
  Badge,
  Btn,
  Card,
  Check,
  Disclosure,
  Field,
  Panel,
  PLANS,
  PlanCard,
  Skeleton,
  Stepper,
  Timeline,
} from "@/components/hf/ui";

function Section({
  title,
  sub,
  children,
  actions,
}: {
  title: string;
  sub?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          {sub ? <p className="mt-1 text-sm text-muted-foreground">{sub}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------- HF-04 */

export function MarketplaceLandingScreen() {
  return (
    <HfConsumerShell>
      <div className="space-y-12">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge tone="accent">2027 open enrollment opens 1 November</Badge>
            <h1 className="mt-4 font-display text-[2.25rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.75rem]">
              Health coverage that fits your household — chosen with help, or on your own.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Compare individual and family plans available where you live, see what you would pay
              after any premium tax credit, and talk to a licensed agent whenever you want one.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn size="lg">
                Help me choose <ArrowRight className="size-4" />
              </Btn>
              <Btn size="lg" variant="outline">
                Browse plans myself
              </Btn>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free to use · No obligation · Licensed agents, not a call centre script
            </p>
          </div>

          <Card className="p-5">
            <p className="font-display text-sm font-semibold">Start with your ZIP code</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="ZIP code" placeholder="e.g. 98104" />
              <Field label="Coverage start" value="1 January 2027" />
            </div>
            <Btn full className="mt-4">
              See plans
            </Btn>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              We ask for your ZIP first because plan availability and price are set by county.
            </p>
          </Card>
        </section>

        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ["Licensed agency", "NPN 8842119 · 34 states"],
            ["No cost to you", "Agency is paid by carriers"],
            ["No obligation", "Quote and leave any time"],
            ["Your data", "Used to quote, never sold"],
          ].map(([t, b]) => (
            <Card key={t} className="p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <p className="text-sm font-medium">{t}</p>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{b}</p>
            </Card>
          ))}
        </div>

        <Section
          title="Two ways to shop"
          sub="Both reach the same plans. Guided narrows first and explains why; browse gives you the full list immediately."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col p-6">
              <Badge tone="ai" className="self-start">
                Guided
              </Badge>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Help me choose
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Answer a few questions about budget, doctors and prescriptions. We suggest a short
                list and explain the tradeoff behind each one. You can see all plans at any time.
              </p>
              <Btn className="mt-5 self-start">Start guided shopping</Btn>
            </Card>
            <Card className="flex flex-col p-6">
              <Badge className="self-start">Self-directed</Badge>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Browse all plans
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Go straight to every plan available in your county, with filters for carrier,
                network, deductible and metal level. Compare up to three side by side.
              </p>
              <Btn variant="outline" className="mt-5 self-start">
                Browse plans
              </Btn>
            </Card>
          </div>
        </Section>

        <Section
          title="What you can shop here"
          sub="Availability depends on your state and start date."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Individual & family health", "On-exchange and off-exchange medical plans"],
              ["Dental", "Standalone dental for adults and children"],
              ["More lines coming", "Additional ancillary lines are enabled per marketplace"],
            ].map(([t, b]) => (
              <Card key={t} className="p-4">
                <p className="font-display text-sm font-semibold">{t}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Disclosure>
          Northwind Benefits is a licensed insurance agency. This site is not HealthCare.gov, a
          state exchange, or a government website. Applying for coverage through the health
          insurance exchange is also possible without using an agent.
        </Disclosure>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-05 */

export function ProductSelectionScreen() {
  return (
    <HfConsumerShell variant="focused">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Step 1 of 4
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            What would you like to shop for?
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            You can add more coverage later — this just decides where we start.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              t: "Health insurance through the exchange",
              tag: "Most people start here",
              w: "Households that may qualify for a premium tax credit based on income.",
              c: "Comprehensive medical coverage, all metal levels, essential health benefits.",
              n: "You compare and choose here, then finish the application on the exchange enrollment site with your agent's help.",
              primary: true,
            },
            {
              t: "Health insurance off the exchange",
              tag: "No tax credit",
              w: "Households that do not qualify for, or do not want to use, a tax credit.",
              c: "Carrier medical plans sold directly, sometimes with networks not on the exchange.",
              n: "You apply and submit right here — start to finish in one place.",
            },
            {
              t: "Dental",
              tag: "Standalone",
              w: "Anyone who wants dental coverage with or without a medical plan.",
              c: "Preventive, basic and major services depending on the plan.",
              n: "You apply and submit here, and can add it to the same cart as a medical plan.",
            },
            {
              t: "Vision",
              tag: "Not available in WA yet",
              w: "—",
              c: "—",
              n: "This line is not enabled for your state on this marketplace.",
              disabled: true,
            },
          ].map((p) => (
            <Card key={p.t} className={`flex flex-col p-5 ${p.disabled ? "opacity-70" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-base font-semibold leading-snug tracking-tight">
                  {p.t}
                </h2>
                <Badge tone={p.disabled ? "warning" : p.primary ? "accent" : "neutral"}>
                  {p.tag}
                </Badge>
              </div>
              <dl className="mt-4 space-y-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Who it suits</dt>
                  <dd className="mt-0.5 leading-relaxed">{p.w}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">What it covers</dt>
                  <dd className="mt-0.5 leading-relaxed">{p.c}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">What happens at the end</dt>
                  <dd className="mt-0.5 leading-relaxed font-medium">{p.n}</dd>
                </div>
              </dl>
              <div className="mt-5">
                {p.disabled ? (
                  <Btn variant="outline" size="sm" full>
                    Notify me when available
                  </Btn>
                ) : (
                  <Btn variant={p.primary ? "primary" : "outline"} size="sm" full>
                    Start with this
                  </Btn>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Disclosure>
          Which lines appear here depends on your state, your coverage start date, and what this
          agency is licensed and appointed to sell. Lines that are unavailable are shown with the
          reason rather than hidden.
        </Disclosure>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-06 */

export function QuoteWizardScreen() {
  return (
    <HfConsumerShell
      variant="focused"
      progress={
        <Stepper
          steps={["Where and when", "Who is covered", "Savings check (optional)"]}
          current={1}
        />
      }
    >
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_15rem]">
        <div className="max-w-[45rem] space-y-5">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Who needs coverage?
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Add everyone who should be on the plan. You can leave people off and add them later.
            </p>
          </div>

          <Panel title="Person 1" meta="Primary applicant">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Date of birth" value="04 / 12 / 1988" />
              <Field label="Uses tobacco" value="No" />
              <Field label="Relationship" value="Primary" />
            </div>
          </Panel>

          <Panel title="Person 2">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Date of birth" value="21 / 07 / 1990" />
              <Field label="Uses tobacco" value="No" />
              <Field label="Relationship" value="Spouse" />
            </div>
          </Panel>

          <Panel title="Person 3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field
                label="Date of birth"
                placeholder="MM / DD / YYYY"
                hint="Enter a date to continue"
              />
              <Field label="Uses tobacco" value="No" />
              <Field label="Relationship" value="Child" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Btn size="sm" variant="ghost">
                Remove this person
              </Btn>
            </div>
          </Panel>

          <Btn variant="outline">+ Add another person</Btn>

          <Alert tone="neutral" title="You can stop here and come back">
            We will save what you have entered for 30 days on this device, or email you a link to
            pick up where you left off.
          </Alert>

          <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
            <Btn variant="outline">Back</Btn>
            <Btn>
              Continue <ArrowRight className="size-4" />
            </Btn>
            <Btn variant="quiet">Email me a link to finish later</Btn>
          </div>

          <Panel title="Next step is optional" meta="Savings check">
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you tell us your estimated household income, we can show what you might pay after a
              premium tax credit. Skipping it still shows every plan — just at full price.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn size="sm">Check for savings</Btn>
              <Btn size="sm" variant="outline">
                Skip this step
              </Btn>
            </div>
            <Disclosure className="mt-3">
              Income is used only to estimate a premium tax credit. Any credit shown is an estimate
              and is confirmed by the exchange, not by this site.
            </Disclosure>
          </Panel>
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="font-display text-xs font-semibold">So far</p>
            <dl className="mt-2.5 space-y-2 text-xs">
              {[
                ["ZIP", "98104 · King County, WA"],
                ["Coverage starts", "1 January 2027"],
                ["People", "2 adults, 1 child"],
              ].map(([l, v]) => (
                <div key={l}>
                  <dt className="text-muted-foreground">{l}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <Btn size="sm" variant="ghost" className="mt-2 px-0">
              Change
            </Btn>
          </Card>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            No account is needed to get a quote, and we never ask for a Social Security number at
            this stage.
          </p>
        </aside>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-07 */

export function PlanOScreen() {
  const ranked = [
    {
      ...PLANS[0]!,
      planO:
        "Closest to your $150 monthly target, keeps both of your current doctors in network, and your prescription is on the preferred tier.",
    },
    {
      ...PLANS[1]!,
      planO:
        "Lower deductible than your target plan for $26 more a month — worth it if you expect to use care more than a few times a year.",
    },
    {
      ...PLANS[3]!,
      planO:
        "Costs more monthly but has the lowest out-of-pocket maximum of the plans that keep your doctors — the safest option if something serious happens.",
    },
  ];

  return (
    <HfConsumerShell
      variant="focused"
      helpTopics={[
        "How were these plans chosen?",
        "Why is my doctor not covered on some plans?",
        "Can I see every plan instead?",
        "Can I speak to a licensed agent?",
      ]}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge tone="ai">Guided by PlanAI</Badge>
            <h1 className="mt-2.5 font-display text-2xl font-semibold tracking-tight">
              Three plans worth your attention
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Narrowed from 14 plans available in King County, using what you told us about budget,
              doctors and prescriptions.
            </p>
          </div>
          <Btn variant="outline">Show all 14 plans</Btn>
        </div>

        <Card className="border-ai/30 bg-ai/[0.05] p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="size-1.5 rounded-full bg-ai" aria-hidden="true" />
            How this list was built
          </p>
          <ul className="mt-2 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
            <li>Monthly budget around $150 after any credit</li>
            <li>Keep Dr. Alvarez and Dr. Chen in network</li>
            <li>One ongoing prescription (levothyroxine)</li>
            <li>Expect a few visits a year, no planned procedures</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn size="sm" variant="outline">
              Change my answers
            </Btn>
            <Btn size="sm" variant="ghost">
              Why not the cheapest plan?
            </Btn>
          </div>
        </Card>

        <div className="space-y-3">
          {ranked.map((p, i) => (
            <div key={p.name} className="relative">
              <span className="absolute -left-1 top-4 z-10 hidden size-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground lg:grid">
                {i + 1}
              </span>
              <PlanCard plan={p} />
            </div>
          ))}
        </div>

        <Card className="flex flex-wrap items-center gap-3 p-4">
          <p className="min-w-0 flex-1 text-sm">
            Not sure these fit? A licensed agent can go through them with you — no charge, no
            obligation.
          </p>
          <Btn variant="outline">Request a call</Btn>
          <Btn variant="ghost">See all plans</Btn>
        </Card>

        <Disclosure>
          These suggestions are generated from the answers you gave and are not insurance advice, an
          eligibility determination, or a guarantee of cost. Every plan available to you remains
          viewable at any time. Recommendation activity is logged for quality and compliance review.
        </Disclosure>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-08 */

export function PlanResultsScreen() {
  return (
    <HfConsumerShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              14 plans for your household
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              King County, WA · 2 adults and 1 child · coverage starting 1 January 2027 · prices
              shown after an estimated $344/mo premium tax credit
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="accent">Estimated credit applied</Badge>
            <Btn variant="outline" size="sm">
              Sort: lowest premium
            </Btn>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["Silver ×", "PPO or HMO ×", "Deductible under $5,000 ×"].map((c) => (
            <span
              key={c}
              className="rounded-full border border-primary/30 bg-primary/[0.08] px-2.5 py-1 text-xs font-medium text-primary"
            >
              {c}
            </span>
          ))}
          <Btn size="sm" variant="quiet">
            Clear all
          </Btn>
        </div>

        <div className="grid gap-5 lg:grid-cols-[15rem_1fr]">
          <aside className="space-y-4">
            <Card className="p-4">
              <p className="font-display text-xs font-semibold">Filters</p>
              <div className="mt-3 space-y-4">
                {[
                  ["Metal level", ["Bronze", "Silver", "Gold", "Platinum"], 1],
                  ["Plan type", ["HMO", "PPO", "EPO"], 1],
                  ["Carrier", ["Blue Summit", "Meridian", "Cascade Care"], -1],
                ].map(([label, opts, checked]) => (
                  <div key={label as string}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {label as string}
                    </p>
                    <div className="mt-2 space-y-2">
                      {(opts as string[]).map((o, i) => (
                        <Check key={o} label={o} checked={i === (checked as number)} />
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly premium
                  </p>
                  <div className="mt-2.5 h-1 rounded-full bg-muted">
                    <div className="h-1 w-2/3 rounded-full bg-primary" />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">$0 – $300 after credit</p>
                </div>
              </div>
            </Card>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              On a phone this rail becomes a bottom sheet, and applied filters stay visible as chips
              above the results.
            </p>
          </aside>

          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              {PLANS.map((p, i) => (
                <PlanCard key={p.name} plan={p} selected={i < 2} />
              ))}
              <Card className="space-y-3 p-4">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </Card>
            </div>

            <Card className="sticky bottom-4 flex flex-wrap items-center gap-3 p-3 shadow-[var(--shadow-overlay)]">
              <p className="text-sm font-medium">2 plans selected</p>
              <p className="text-xs text-muted-foreground">Compare up to 3</p>
              <div className="ml-auto flex gap-2">
                <Btn size="sm" variant="ghost">
                  Clear
                </Btn>
                <Btn size="sm">Compare 2 plans</Btn>
              </div>
            </Card>
          </div>
        </div>

        <Disclosure>
          Premiums shown reflect an estimated advance premium tax credit based on the income you
          entered. Final eligibility and amount are determined by the health insurance exchange.
          Plans shown are those available for your county and start date from carriers this agency
          is appointed with.
        </Disclosure>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-09 */

export function PlanCompareScreen() {
  const cols = [PLANS[0]!, PLANS[1]!, PLANS[3]!];
  const rows: [string, string[], number?][] = [
    ["Monthly premium after credit", cols.map((c) => c.net), 0],
    ["Full premium", cols.map((c) => c.gross)],
    ["Deductible", cols.map((c) => c.deductible), 2],
    ["Out-of-pocket maximum", cols.map((c) => c.oopMax), 2],
    ["Plan type", cols.map((c) => c.network)],
    ["Primary care visit", ["$30", "$25", "$15"], 2],
    ["Specialist visit", ["$60", "$55", "$40"], 2],
    ["Generic drugs", ["$10", "$10", "$10"]],
    ["Your doctors in network", ["Both", "Both", "Both"]],
    ["HSA eligible", ["Yes", "No", "No"]],
  ];

  return (
    <HfConsumerShell variant="focused">
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Compare 3 plans</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Rows that are the same across all three are dimmed so the differences stand out.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Btn size="sm" variant="outline">
              Highlight differences: on
            </Btn>
            <Btn size="sm" variant="ghost">
              Back to results
            </Btn>
          </div>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-card px-4 py-4 text-left align-bottom"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Plan details
                  </span>
                </th>
                {cols.map((c) => (
                  <th key={c.name} scope="col" className="px-4 py-4 text-left align-bottom">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {c.carrier}
                    </p>
                    <p className="mt-0.5 font-display text-sm font-semibold leading-snug">
                      {c.name}
                    </p>
                    <Badge className="mt-1.5">{c.metal}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, values, best]) => {
                const same = values.every((v) => v === values[0]);
                return (
                  <tr
                    key={label}
                    className={`border-b border-hairline ${same ? "opacity-45" : ""}`}
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                    >
                      {label}
                    </th>
                    {values.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-sm tabular-nums">
                        <span
                          className={
                            best === i
                              ? "font-semibold underline decoration-primary decoration-2 underline-offset-4"
                              : ""
                          }
                        >
                          {v}
                        </span>
                        {best === i ? (
                          <span className="ml-2 text-[11px] font-medium text-primary">best</span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-card px-4 py-4" />
                {cols.map((c) => (
                  <td key={c.name} className="px-4 py-4">
                    <Btn size="sm" full>
                      Add to cart
                    </Btn>
                    <Btn size="sm" variant="ghost" full className="mt-1.5">
                      Plan details
                    </Btn>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Btn variant="outline">Email this comparison</Btn>
          <Btn variant="outline">Download PDF</Btn>
          <Btn variant="ghost">Ask an agent about these</Btn>
        </div>

        <Disclosure>
          Comparison covers the attributes shown and is not the complete plan document. Refer to
          each plan&apos;s Summary of Benefits and Coverage for full terms. Emailed and downloaded
          copies carry these same disclosures.
        </Disclosure>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-10 */

export function CartScreen() {
  return (
    <HfConsumerShell variant="focused">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_19rem]">
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Your coverage</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Two lines, two different finishes — each one tells you where it ends.
            </p>
          </div>

          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge tone="accent">Health · on-exchange</Badge>
                <p className="mt-2 font-display text-base font-semibold">Summit Silver 3500 HSA</p>
                <p className="text-xs text-muted-foreground">
                  Blue Summit Health · PPO · deductible $3,500
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-semibold tabular-nums">$142</p>
                <p className="text-[11px] text-muted-foreground">per month, estimated</p>
              </div>
            </div>
            <div className="mt-4 rounded-[var(--radius)] bg-surface-2 px-3 py-2.5">
              <p className="text-xs font-medium">Finishes on the exchange</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Your application for this plan is completed on the exchange enrollment site. We will
                explain exactly what happens before you go.
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Btn size="sm" variant="ghost">
                Change plan
              </Btn>
              <Btn size="sm" variant="ghost">
                <Trash2 className="size-3.5" /> Remove
              </Btn>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge>Dental</Badge>
                <p className="mt-2 font-display text-base font-semibold">BrightSmile Dental Plus</p>
                <p className="text-xs text-muted-foreground">
                  Cascade Care · preventive covered 100% · $50 annual deductible
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-semibold tabular-nums">$38</p>
                <p className="text-[11px] text-muted-foreground">per month</p>
              </div>
            </div>
            <div className="mt-4 rounded-[var(--radius)] bg-surface-2 px-3 py-2.5">
              <p className="text-xs font-medium">Finishes here</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                You complete and submit this application on this site, including payment details.
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Btn size="sm" variant="ghost">
                Change plan
              </Btn>
              <Btn size="sm" variant="ghost">
                <Trash2 className="size-3.5" /> Remove
              </Btn>
            </div>
          </Card>

          <Card className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Vision coverage for $12/month?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Suggested because you added dental. Nothing is added until you choose it.
              </p>
            </div>
            <Btn size="sm" variant="outline">
              See vision plans
            </Btn>
          </Card>
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="font-display text-sm font-semibold">Monthly total</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Health plan</dt>
                <dd className="tabular-nums">$142</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Dental</dt>
                <dd className="tabular-nums">$38</dd>
              </div>
              <div className="flex justify-between border-t border-hairline pt-2 font-semibold">
                <dt>Estimated total</dt>
                <dd className="tabular-nums">$180</dd>
              </div>
            </dl>
            <Btn full className="mt-4">
              Continue <ArrowRight className="size-4" />
            </Btn>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
              Next you will create an account so we can save this and pick up where you left off.
            </p>
          </Card>
          <Disclosure>
            Health plan amount includes an estimated premium tax credit and is confirmed by the
            exchange. Dental pricing is final subject to carrier acceptance.
          </Disclosure>
        </aside>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-11 */

export function RegistrationGateScreen() {
  return (
    <HfConsumerShell variant="focused">
      <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[1fr_17rem]">
        <Card className="p-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Create an account to keep going
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            It takes about 30 seconds and keeps everything you have chosen.
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "Your cart and quote are saved for 90 days",
              "Come back on any device and pick up where you left off",
              "Your plan documents and messages live in one place",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-1.5 rounded-[var(--radius)] bg-surface-2 p-1">
            <span className="flex-1 rounded-[calc(var(--radius)-2px)] bg-card px-3 py-1.5 text-center text-xs font-semibold shadow-card">
              Create account
            </span>
            <span className="flex-1 px-3 py-1.5 text-center text-xs text-muted-foreground">
              I already have one
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="First name" value="Maria" />
            <Field label="Last name" value="Delgado" />
            <Field label="Email" value="maria.d@example.com" className="sm:col-span-2" />
            <Field
              label="Password"
              value="••••••••••"
              hint="At least 10 characters"
              className="sm:col-span-2"
            />
            <Field
              label="Mobile number (optional)"
              placeholder="(206) 555-0000"
              className="sm:col-span-2"
            />
          </div>

          <div className="mt-4 space-y-2.5">
            <Check
              checked
              label="I agree to the terms of use and privacy notice."
              hint="Required to create an account."
            />
            <Check
              label="You may contact me by phone, text or email about my quote."
              hint="Optional and separate. You can change this any time."
            />
          </div>

          <Btn full size="lg" className="mt-5">
            Create account and continue
          </Btn>
          <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
            We do not ask for a Social Security number to create an account. Identity details are
            only requested later, during the application itself.
          </p>
        </Card>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="font-display text-xs font-semibold">Still in your cart</p>
            <ul className="mt-2.5 space-y-2.5 text-xs">
              <li>
                <p className="font-medium">Summit Silver 3500 HSA</p>
                <p className="text-muted-foreground">$142/mo · on-exchange</p>
              </li>
              <li>
                <p className="font-medium">BrightSmile Dental Plus</p>
                <p className="text-muted-foreground">$38/mo · dental</p>
              </li>
            </ul>
            <p className="mt-3 border-t border-hairline pt-2 text-sm font-semibold">
              $180{" "}
              <span className="text-xs font-normal text-muted-foreground">/month estimated</span>
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium">Prepared with</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Northwind Benefits · your quote stays with this agency.
            </p>
          </Card>
        </aside>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-12 */

export function EdeHandoffScreen() {
  return (
    <HfConsumerShell variant="focused">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <Badge tone="accent">One more step</Badge>
          <h1 className="mt-2.5 font-display text-2xl font-semibold tracking-tight">
            Your application finishes on the exchange enrollment site
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            On-exchange plans are enrolled through an approved enhanced direct enrollment partner.
            Here is exactly what happens next, before you go anywhere.
          </p>
        </div>

        <Panel title="What happens next">
          <ol className="space-y-3 text-sm">
            {[
              "We hand you to Enroll Bridge, our approved enrollment partner, in this same browser tab.",
              "You confirm your household and income details and complete the exchange application there.",
              "When you finish, you come back here and your status updates automatically.",
            ].map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          <Panel title="What carries over">
            <ul className="space-y-2 text-xs">
              {[
                "Your household members and dates of birth",
                "Your ZIP code and coverage start date",
                "The plan you selected: Summit Silver 3500 HSA",
                "That Northwind Benefits is your agency",
              ].map((i) => (
                <li key={i} className="flex gap-2">
                  <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" />
                  {i}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="What you will need">
            <ul className="space-y-2 text-xs">
              {[
                "Social Security numbers for people applying",
                "Income details, such as a recent pay stub",
                "Immigration document numbers, if applicable",
                "About 15–20 minutes",
              ].map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                  {i}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Alert tone="neutral" title="Your dental plan stays here">
          BrightSmile Dental Plus is not part of the exchange application. You will finish that one
          on this site when you return.
        </Alert>

        <div className="flex flex-wrap items-center gap-3">
          <Btn size="lg">
            Continue to Enroll Bridge <ExternalLink className="size-4" />
          </Btn>
          <Btn size="lg" variant="outline">
            Talk to a licensed agent first
          </Btn>
        </div>

        <Disclosure>
          Enroll Bridge is an approved enhanced direct enrollment partner operating under the health
          insurance exchange. Only the information listed above is transferred, and the transfer is
          recorded. You may also apply directly at HealthCare.gov without using this site or an
          agent.
        </Disclosure>
      </div>
    </HfConsumerShell>
  );
}

/* ------------------------------------------------------------------- HF-13 */

export function SharedQuoteScreen() {
  return (
    <HfConsumerShell
      variant="shared-link"
      helpTopics={[
        "Who prepared this quote?",
        "How long is this quote valid?",
        "Can I change what is on it?",
        "How do I get in touch?",
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <Card className="flex flex-wrap items-center gap-4 p-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-3 font-display text-sm font-semibold">
            DO
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Prepared for you by</p>
            <p className="font-display text-base font-semibold">Dana Okafor</p>
            <p className="text-xs text-muted-foreground">
              Licensed agent · WA license 1104882 · Northwind Benefits
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Prepared 24 August 2026</p>
            <p className="font-medium text-foreground">Valid until 7 September</p>
          </div>
        </Card>

        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Three plans for the Delgado household
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            King County, WA · 2 adults and 1 child · coverage starting 1 January 2027 · prices
            reflect an estimated $344/mo premium tax credit
          </p>
        </div>

        <div className="space-y-3">
          {[PLANS[0]!, PLANS[1]!, PLANS[3]!].map((p) => (
            <PlanCard key={p.name} plan={p} compact />
          ))}
        </div>

        <Card className="flex flex-wrap items-center gap-3 p-4">
          <p className="min-w-0 flex-1 text-sm font-medium">
            Ready to move forward with one of these?
          </p>
          <Btn>Continue this quote</Btn>
          <Btn variant="outline">Ask Dana a question</Btn>
          <Btn variant="ghost">Request a call</Btn>
        </Card>

        <Panel
          title="If this link has expired"
          meta="What the recipient sees after the validity window"
        >
          <div className="rounded-[var(--radius)] border border-dashed border-hairline bg-surface-2 px-4 py-5 text-center">
            <p className="font-display text-sm font-semibold">This quote is no longer current</p>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
              It was prepared on 24 August and prices change with rates and enrollment periods. Dana
              can send you an updated version straight away.
            </p>
            <Btn size="sm" className="mt-3">
              Request an updated quote
            </Btn>
          </div>
          <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
            Expiry and revocation are enforced server-side — a revoked link cannot be reopened from
            a cached page.
          </p>
        </Panel>

        <Panel title="What the agent sees" meta="Engagement written back to the quote timeline">
          <Timeline
            entries={[
              {
                kind: "system",
                title: "Link opened",
                body: "Mobile · Seattle, WA",
                meta: "24 Aug, 11:48",
              },
              {
                kind: "human",
                title: "Quote sent by email and SMS",
                meta: "24 Aug, 09:12",
                actor: "Dana Okafor",
              },
            ]}
          />
        </Panel>

        <Disclosure>
          This quote is read-only and reflects plans and pricing available on the date shown. It is
          not an offer of coverage or a guarantee of eligibility. Viewing this page does not create
          an application.
        </Disclosure>
      </div>
    </HfConsumerShell>
  );
}
