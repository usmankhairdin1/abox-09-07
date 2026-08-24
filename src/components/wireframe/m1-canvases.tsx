import type { ReactNode } from "react";

import { Annotation, IdChip, Pill, WBox, WLine, WRow } from "@/components/wireframe/primitives";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Low-fidelity building blocks                                        */
/* ------------------------------------------------------------------ */

function Field({ label, w = "" }: { label: string; w?: string }) {
  return (
    <label className={cn("block", w)}>
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1 h-8 rounded-md border border-border bg-muted/30" />
    </label>
  );
}

function Btn({ label, primary = false }: { label: string; primary?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1.5 text-xs",
        primary ? "border-foreground/50 bg-muted font-medium" : "border-border text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

function Zone({
  title,
  id,
  children,
  className,
  note,
}: {
  title: string;
  id?: string;
  children?: ReactNode;
  className?: string;
  note?: string;
}) {
  return (
    <div className={cn("rounded-md border border-border bg-card p-3", className)}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {id ? <IdChip tone="prov">{id}</IdChip> : null}
      </div>
      {children}
      {note ? <Annotation className="mt-2">{note}</Annotation> : null}
    </div>
  );
}

function Stepper({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <span
          key={s}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px]",
            i === active ? "border-foreground/50 bg-muted font-medium" : "border-border text-muted-foreground",
          )}
        >
          {i + 1}. {s}
        </span>
      ))}
    </div>
  );
}

function PlanCard({ rec = false }: { rec?: boolean }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <WLine w="55%" />
          <WLine w="35%" className="h-1.5 bg-muted/70" />
        </div>
        {rec ? <Pill>Plan-O fit</Pill> : <Pill>Compare</Pill>}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {["Premium", "After credit*", "Deductible", "MOOP"].map((m) => (
          <div key={m} className="rounded border border-dashed border-border p-2">
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{m}</p>
            <WLine w="70%" className="mt-1.5" />
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Pill>Doctor match</Pill>
        <Pill>Drug match</Pill>
        <Pill>SBC</Pill>
        <span className="ml-auto flex gap-1.5">
          <Btn label="Details" />
          <Btn label="Add to cart" primary />
        </span>
      </div>
      {rec ? (
        <Annotation className="mt-2">
          Why this plan: ranking basis disclosed inline — required, no unexplained ordering.
        </Annotation>
      ) : null}
    </div>
  );
}

function Disclosure({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-foreground/30 bg-muted/30 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Required disclosure
      </p>
      <p className="mt-1 text-xs leading-relaxed text-foreground/80">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Canvases                                                            */
/* ------------------------------------------------------------------ */

const canvases: Record<string, () => ReactNode> = {
  "ux-001": () => (
    <div className="space-y-3">
      <Zone title="Brand + hero" id="UX-001-HERO">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-2">
            <WLine w="70%" className="h-4" />
            <WLine w="50%" />
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <Field label="ZIP code" w="w-40" />
              <Btn label="See plans" primary />
            </div>
          </div>
          <WBox className="h-32" label="brand image slot (UX-024)" />
        </div>
      </Zone>
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Entry card A — guided" id="UX-001-PLANO-ENTRY" note="Routes to UX-003 then UX-005.">
          <WLine w="60%" />
          <WLine w="80%" className="mt-2 h-1.5 bg-muted/70" />
          <div className="mt-3">
            <Btn label="Help me choose" primary />
          </div>
        </Zone>
        <Zone title="Entry card B — browse" id="UX-001-BROWSE-ENTRY" note="Routes to UX-003 then UX-009 (All plans tab).">
          <WLine w="60%" />
          <WLine w="80%" className="mt-2 h-1.5 bg-muted/70" />
          <div className="mt-3">
            <Btn label="Browse plans myself" />
          </div>
        </Zone>
      </div>
      <Zone title="Enabled product line strip" id="UX-001-PRODUCTS">
        <div className="grid gap-2 sm:grid-cols-4">
          {["IFP on-exchange", "Dental", "Vision", "More"].map((p) => (
            <WBox key={p} className="h-14" label={p} />
          ))}
        </div>
      </Zone>
      <Zone title="Returning visitor strip" id="UX-001-RESUME">
        <div className="flex flex-wrap gap-2">
          <Btn label="Resume my quote" />
          <Btn label="Sign in" />
        </div>
      </Zone>
      <Disclosure>
        Agency licensed-entity identification, "this is not a government website / not
        HealthCare.gov", privacy and non-discrimination notices are visible without scrolling past
        the hero.
      </Disclosure>
    </div>
  ),

  "ux-002": () => (
    <div className="space-y-3">
      <Stepper steps={["Product & path", "Location & date", "Household", "Results"]} active={0} />
      <Zone title="Product line selection" id="UX-002-LINES">
        <div className="grid gap-2 sm:grid-cols-3">
          <WBox className="h-20" label="IFP on-exchange (enabled)" />
          <WBox className="h-20" label="Dental (enabled — display only)" />
          <WBox className="h-20" label="Vision (unavailable: not appointed)" />
        </div>
        <Annotation className="mt-2">
          Unavailable lines render disabled with a stated reason — never hidden silently.
        </Annotation>
      </Zone>
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Guided path (Plan-O entry)" id="UX-002-PATH-GUIDED">
          <WLine w="75%" />
          <WLine w="55%" className="mt-2 h-1.5 bg-muted/70" />
          <div className="mt-3">
            <Btn label="Continue guided" primary />
          </div>
        </Zone>
        <Zone title="Self-directed path (Browse entry)" id="UX-002-PATH-BROWSE">
          <WLine w="75%" />
          <WLine w="55%" className="mt-2 h-1.5 bg-muted/70" />
          <div className="mt-3">
            <Btn label="Continue to browse" />
          </div>
        </Zone>
      </div>
      <Annotation>Path choice is stored on the quote for later audit of how the consumer was guided.</Annotation>
    </div>
  ),

  "ux-003": () => (
    <div className="space-y-3">
      <Stepper steps={["Product & path", "Location & date", "Household", "Results"]} active={1} />
      <Zone title="Location" id="UX-003-LOC">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="ZIP code" />
          <Field label="County (required when ambiguous)" />
          <Field label="State (derived, read-only)" />
        </div>
        <Annotation className="mt-2">
          Multi-county ZIP shows a selectable county list. Defaulting silently is not permitted —
          it changes rating.
        </Annotation>
      </Zone>
      <Zone title="Coverage timing" id="UX-003-DATE">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Effective date" />
          <Field label="Coverage year (derived)" />
          <WBox className="h-[52px]" label="OEP / SEP window note" />
        </div>
      </Zone>
      <Zone title="Validation" id="UX-003-VALIDATION">
        <WBox className="h-12" label="inline error: date outside a valid enrollment window" />
      </Zone>
      <div className="flex justify-between">
        <Btn label="Back" />
        <Btn label="Continue" primary />
      </div>
    </div>
  ),

  "ux-004": () => (
    <div className="space-y-3">
      <Stepper steps={["Product & path", "Location & date", "Household", "Results"]} active={2} />
      <Zone title="Household member rows" id="UX-004-MEMBERS">
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid gap-2 border-b border-border/60 py-2 last:border-b-0 sm:grid-cols-5">
            <Field label="Relationship" />
            <Field label="Date of birth" />
            <Field label="Tobacco" />
            <Field label="Applying?" />
            <div className="flex items-end">
              <Btn label="Remove" />
            </div>
          </div>
        ))}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Btn label="Add member" />
          <Pill>3 in household · 2 applying</Pill>
        </div>
      </Zone>
      <Zone title="Optional subsidy entry point" id="UX-004-SUBSIDY-LINK" note="Routes to UX-007. Skippable.">
        <Btn label="Check if I qualify for savings" />
      </Zone>
      <Disclosure>
        Module 1 collects rating inputs only — no SSN, immigration attestation or health questions.
        Those are asked in the EDE application after handoff. DOB is treated as sensitive and masked
        in internal list views.
      </Disclosure>
    </div>
  ),

  "ux-005": () => (
    <div className="space-y-3">
      <Zone title="Plan-O intake — priorities" id="UX-005-PRIORITIES">
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            "Lowest monthly premium",
            "Lowest cost when I use care",
            "Keep my doctor",
            "Keep my prescriptions",
            "Predictable costs",
            "Balance of both",
          ].map((p) => (
            <WBox key={p} className="h-14" label={p} />
          ))}
        </div>
      </Zone>
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Expected usage" id="UX-005-USAGE">
          <div className="flex flex-wrap gap-2">
            {["Low", "Moderate", "High"].map((u) => (
              <Btn key={u} label={u} />
            ))}
          </div>
          <WLine w="80%" className="mt-3 h-1.5 bg-muted/70" />
        </Zone>
        <Zone title="Budget comfort (optional)" id="UX-005-BUDGET">
          <Field label="Monthly budget range" />
        </Zone>
      </div>
      <Zone title="Optional provider & drug entry" id="UX-005-PROVIDER-LINK" note="Routes to UX-006.">
        <Btn label="Add my doctors and prescriptions" />
      </Zone>
      <Disclosure>
        Plan-O is decision support, not advice. Inputs used for ranking are disclosed on the results
        screen and can be changed at any time. Every run is logged with inputs, ruleset version and
        outputs.
      </Disclosure>
      <div className="flex justify-between">
        <Btn label="Skip to browse" />
        <Btn label="See my recommendations" primary />
      </div>
    </div>
  ),

  "ux-006": () => (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Provider lookup" id="UX-006-PROVIDERS">
          <Field label="Search doctor or facility" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill>Selected provider</Pill>
            <Pill>Selected provider</Pill>
          </div>
          <WRow />
          <WRow />
        </Zone>
        <Zone title="Drug lookup" id="UX-006-DRUGS">
          <Field label="Search prescription" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Field label="Dosage" />
            <Field label="Quantity / refill" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill>Selected drug</Pill>
          </div>
        </Zone>
      </div>
      <Zone title="Empty / skip state" id="UX-006-SKIP">
        <WBox className="h-14" label="this step is optional — continue without adding" />
      </Zone>
      <Disclosure>
        Network and formulary data is carrier-supplied, dated, and subject to change. Source and
        last-refresh date display wherever a match indicator appears; consumers are told to confirm
        with the carrier.
      </Disclosure>
    </div>
  ),

  "ux-007": () => (
    <div className="space-y-3">
      <Zone title="Opt-in explanation" id="UX-007-INTRO">
        <WLine w="70%" />
        <WLine w="50%" className="mt-2 h-1.5 bg-muted/70" />
      </Zone>
      <Zone title="Minimum inputs" id="UX-007-INPUTS">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Estimated annual household income" />
          <Field label="Household size (carried from UX-004)" />
          <Field label="Other coverage available?" />
        </div>
      </Zone>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Btn label="Skip this step" />
        <Btn label="Estimate my savings" primary />
      </div>
      <Disclosure>
        Genuinely optional — results are reachable without it. Income is an estimate for display
        only, not an application attestation. Only the exchange determines actual eligibility.
      </Disclosure>
    </div>
  ),

  "ux-008": () => (
    <div className="space-y-3">
      <Zone title="Estimate result" id="UX-008-RESULT">
        <div className="grid gap-3 sm:grid-cols-2">
          <WBox className="h-24" label="estimated monthly credit (labeled ESTIMATE adjacent to the number)" />
          <WBox className="h-24" label="cost-sharing reduction tier indicator" />
        </div>
      </Zone>
      <Zone title="Assumptions used" id="UX-008-ASSUMPTIONS">
        <WRow primary="60%" secondary="30%" trailing={<Btn label="Edit" />} />
        <WRow primary="45%" secondary="25%" trailing={<Btn label="Edit" />} />
        <WRow primary="52%" secondary="35%" trailing={<Btn label="Edit" />} />
      </Zone>
      <Zone title="Effect on results" id="UX-008-EFFECT">
        <WLine w="75%" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn label="Apply estimate to results" primary />
          <Btn label="Continue without applying" />
        </div>
      </Zone>
      <Disclosure>
        Every figure is labeled an estimate next to the number, not only in a footnote. Assumptions
        travel with any shared quote. Final eligibility is determined by the exchange during the EDE
        application. Inputs, ruleset version and output are written to the audit trail.
      </Disclosure>
    </div>
  ),

  "ux-009": () => (
    <div className="space-y-3">
      <Zone title="Result tabs" id="UX-009-TABS">
        <div className="flex flex-wrap gap-2">
          <Btn label="Recommended for you (Plan-O)" primary />
          <Btn label="All plans (manual browse)" />
          <span className="ml-auto flex gap-1.5">
            <Pill>Sort: estimated total cost</Pill>
            <Pill>42 plans</Pill>
          </span>
        </div>
      </Zone>
      <WBox className="h-10" label="banner: estimated credit from UX-008 applied to displayed premiums" />
      <div className="grid gap-3 lg:grid-cols-[240px_1fr]">
        <Zone title="Filter rail" id="UX-009-FILTERS">
          <div className="space-y-2">
            {[
              "Metal level",
              "Carrier",
              "Monthly premium",
              "Deductible",
              "Plan type (HMO/PPO/EPO)",
              "HSA eligible",
              "Doctor match",
              "Drug match",
            ].map((f) => (
              <WBox key={f} className="h-9" label={f} />
            ))}
          </div>
        </Zone>
        <div className="space-y-3">
          <Zone title="Plan-O recommendation panel" id="UX-009-PLANO" note="Ranking basis disclosed on-screen; consumer can change inputs from here.">
            <div className="space-y-2">
              <PlanCard rec />
              <PlanCard rec />
            </div>
          </Zone>
          <Zone title="Result list (browse)" id="UX-009-LIST">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Pill>Silver ×</Pill>
              <Pill>PPO ×</Pill>
              <Pill>Clear all</Pill>
            </div>
            <div className="space-y-2">
              <PlanCard />
              <PlanCard />
            </div>
            <WBox className="mt-2 h-12" label="no-results state with filter-relaxation suggestions" />
          </Zone>
          <Zone title="Compare tray" id="UX-009-COMPARE-TRAY">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>Plan A</Pill>
              <Pill>Plan B</Pill>
              <Btn label="Compare (max 3)" primary />
            </div>
          </Zone>
        </div>
      </div>
      <Disclosure>
        Both full premium and premium after estimated credit are shown, with the estimate label
        attached. Total-cost figures state their usage assumptions. Only plans the agency can sell
        for this location and effective date appear — suppression is a sellability rule, not
        editorial choice. Filters, sort and the result set at selection time are captured for audit.
      </Disclosure>
    </div>
  ),

  "ux-010": () => (
    <div className="space-y-3">
      <Zone title="Plan header" id="UX-010-HEADER">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <WLine w="45%" className="h-3" />
            <WLine w="30%" className="h-1.5 bg-muted/70" />
          </div>
          <div className="flex gap-1.5">
            <Pill>Metal tier</Pill>
            <Pill>Network type</Pill>
            <Pill>Plan ID</Pill>
          </div>
        </div>
      </Zone>
      <Zone title="Cost summary" id="UX-010-COSTS">
        <div className="grid gap-2 sm:grid-cols-5">
          {["Premium", "After credit*", "Deductible", "MOOP", "Coinsurance"].map((c) => (
            <WBox key={c} className="h-16" label={c} />
          ))}
        </div>
      </Zone>
      <Zone title="Benefit table" id="UX-010-BENEFITS">
        {["Primary care", "Specialist", "Urgent care", "Emergency room", "Generic drugs", "Specialty drugs", "Imaging", "Maternity"].map((b) => (
          <div key={b} className="flex items-center gap-3 border-b border-border/60 py-2 last:border-b-0">
            <span className="w-40 shrink-0 text-xs text-foreground/80">{b}</span>
            <WLine w="40%" />
          </div>
        ))}
      </Zone>
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Doctor & drug match" id="UX-010-MATCH">
          <WRow trailing={<Pill>In network</Pill>} />
          <WRow trailing={<Pill>Not covered</Pill>} />
        </Zone>
        <Zone title="Documents" id="UX-010-DOCS" note="SBC and formulary must be reachable before add-to-cart.">
          <div className="flex flex-wrap gap-2">
            <Btn label="Summary of Benefits & Coverage" />
            <Btn label="Formulary" />
            <Btn label="Plan brochure" />
          </div>
        </Zone>
      </div>
      <Zone title="Sticky action bar" id="UX-010-ACTIONS">
        <div className="flex flex-wrap gap-2">
          <Btn label="Back to results" />
          <Btn label="Add to compare" />
          <Btn label="Share this plan" />
          <Btn label="Add to cart" primary />
        </div>
      </Zone>
    </div>
  ),

  "ux-011": () => (
    <div className="space-y-3">
      <Zone title="Comparison grid (max 3)" id="UX-011-GRID">
        <div className="grid grid-cols-[160px_repeat(3,1fr)] gap-2">
          <div />
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md border border-border p-2">
              <WLine w="80%" />
              <WLine w="50%" className="mt-1.5 h-1.5 bg-muted/70" />
              <div className="mt-2 flex justify-between">
                <Pill>Remove</Pill>
                <Pill>Add to cart</Pill>
              </div>
            </div>
          ))}
          {[
            "Premium",
            "After estimated credit",
            "Deductible",
            "MOOP",
            "Coinsurance",
            "Key copays",
            "Network type",
            "Doctor match",
            "Drug match",
            "HSA eligible",
            "Estimated annual cost*",
          ].map((row) => (
            <ContrastRow key={row} label={row} />
          ))}
        </div>
      </Zone>
      <div className="flex flex-wrap items-center gap-2">
        <Btn label="Highlight differences" />
        <Btn label="Back to results" />
        <Btn label="Share comparison" />
      </div>
      <Disclosure>
        The same attribute set is shown for every plan — selective omission that favors a carrier is
        not permitted. Estimated annual cost carries the estimate label and links to its assumptions.
      </Disclosure>
    </div>
  ),

  "ux-012": () => (
    <div className="space-y-3">
      <Zone title="Additional coverage cards" id="UX-012-CARDS">
        <div className="grid gap-3 md:grid-cols-3">
          {["Dental (enabled)", "Vision (enabled)", "Accident (not enabled)"].map((c) => (
            <div key={c} className="rounded-md border border-border p-3">
              <WBox className="h-16" label={c} />
              <WLine w="70%" className="mt-2" />
              <div className="mt-3">
                <Btn label="I'm interested" />
              </div>
            </div>
          ))}
        </div>
      </Zone>
      <Disclosure>
        Module 1 is display and interest capture only — there is no ancillary enrollment or checkout
        path on this screen. Interest creates a lead activity and the consumer is told an agent will
        follow up. Ancillary enrollment is fenced to a later packet by the reconciliation package.
      </Disclosure>
      <div className="flex justify-end">
        <Btn label="Continue" primary />
      </div>
    </div>
  ),

  "ux-013": () => (
    <div className="space-y-3">
      <Zone title="Cart drawer (right-side overlay on the consumer surface)" id="UX-013-DRAWER">
        <div className="rounded-md border border-dashed border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Your selection</span>
            <Pill>Close</Pill>
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-md border border-border p-2">
              <WLine w="60%" />
              <WLine w="40%" className="mt-1.5 h-1.5 bg-muted/70" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Pill>Medical — enrollable</Pill>
                <Pill>Change plan</Pill>
                <Pill>Remove</Pill>
              </div>
            </div>
            <div className="rounded-md border border-dashed border-border p-2">
              <WLine w="45%" />
              <div className="mt-2 flex gap-1.5">
                <Pill>Dental — interest only</Pill>
                <Pill>Remove</Pill>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <WBox className="h-14" label="household" />
            <WBox className="h-14" label="effective date" />
            <WBox className="h-14" label="estimated monthly total*" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn label="Save quote" />
            <Btn label="Share quote" />
            <Btn label="Continue to review" primary />
          </div>
        </div>
      </Zone>
      <Disclosure>
        The cart is a saved selection, not a purchase. No payment is collected in Module 1 and totals
        are labeled estimated. One medical plan at a time. Add, remove and change events are written
        to the quote audit trail with actor and timestamp.
      </Disclosure>
    </div>
  ),

  "ux-014": () => (
    <div className="space-y-3">
      <Zone title="Read-only review summary" id="UX-014-SUMMARY">
        <div className="grid gap-2 sm:grid-cols-3">
          {["Household", "Location & county", "Effective date", "Selected plan", "Estimated credit*", "Estimated monthly cost*"].map((s) => (
            <WBox key={s} className="h-16" label={s} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill>Edit household</Pill>
          <Pill>Edit location</Pill>
          <Pill>Change plan</Pill>
        </div>
      </Zone>
      <Zone title="Ancillary interest summary" id="UX-014-ANCILLARY">
        <WRow trailing={<Pill>Interest only</Pill>} />
      </Zone>
      <Zone title="What happens next" id="UX-014-NEXT" note="Same wording as UX-023 so the consumer is never surprised.">
        <WLine w="80%" />
        <WLine w="65%" className="mt-2 h-1.5 bg-muted/70" />
      </Zone>
      <Zone title="Consent & acknowledgement block" id="UX-014-CONSENT">
        <div className="space-y-2">
          {["Agent of record acknowledgement (agent-attributed sessions)", "Consent to share information for enrollment", "Consent to contact", "Terms & privacy acknowledgement"].map((c) => (
            <div key={c} className="flex items-start gap-2 rounded-md border border-border p-2">
              <div className="mt-0.5 size-4 shrink-0 rounded border border-border" aria-hidden="true" />
              <p className="text-xs text-foreground/80">{c}</p>
            </div>
          ))}
        </div>
      </Zone>
      <Disclosure>
        Each consent is affirmative and separately recorded with timestamp, IP and the exact
        disclosure text version shown. No coverage is in force until the exchange application is
        completed and the carrier accepts it. The review snapshot is immutable and retained as the
        pre-handoff record.
      </Disclosure>
      <div className="flex flex-wrap justify-end gap-2">
        <Btn label="Save for later" />
        <Btn label="Create account & continue" primary />
      </div>
    </div>
  ),

  "ux-015": () => (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Create account" id="UX-015-REGISTER">
          <div className="space-y-2">
            <Field label="Full name" />
            <Field label="Email" />
            <Field label="Mobile" />
            <Field label="Password" />
          </div>
          <div className="mt-3">
            <Btn label="Create account" primary />
          </div>
        </Zone>
        <Zone title="Sign in (returning)" id="UX-015-LOGIN">
          <div className="space-y-2">
            <Field label="Email" />
            <Field label="Password" />
          </div>
          <div className="mt-3 flex gap-2">
            <Btn label="Sign in" primary />
            <Btn label="Forgot password" />
          </div>
        </Zone>
      </div>
      <Zone title="Verification" id="UX-015-VERIFY">
        <div className="flex flex-wrap items-end gap-2">
          <Field label="Verification code (email or SMS)" w="w-56" />
          <Btn label="Verify" primary />
          <Btn label="Resend" />
        </div>
      </Zone>
      <Zone title="Session merge notice" id="UX-015-MERGE">
        <WBox className="h-14" label="your quote and cart will be attached to this account" />
      </Zone>
      <Disclosure>
        Credentials are held by the platform identity service. Account creation links the anonymous
        session's quote to the member record and stamps the merge in the audit trail. Lead
        attribution (agency, agent, marketplace source) locks at account creation. Consent to contact
        is recorded separately from terms acceptance.
      </Disclosure>
    </div>
  ),

  "ux-016": () => (
    <div className="space-y-3">
      <Zone title="Resume card" id="UX-016-RESUME">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <WLine w="55%" />
            <WLine w="35%" className="h-1.5 bg-muted/70" />
          </div>
          <Pill>Step 3 of 4 · updated 2 days ago</Pill>
          <Btn label="Resume quote" primary />
        </div>
      </Zone>
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Saved quotes" id="UX-016-QUOTES">
          <WRow trailing={<Pill>Draft</Pill>} />
          <WRow trailing={<Pill>Shared</Pill>} />
          <WRow trailing={<Pill>Expired</Pill>} />
          <WRow trailing={<Pill>Handed off</Pill>} />
        </Zone>
        <Zone title="Application status (mirror of handoff state)" id="UX-016-APP-STATUS" note="Labeled as the status ABox received, with the timestamp — not a live exchange determination.">
          <WBox className="h-20" label="status + reference id + received at" />
        </Zone>
        <Zone title="Household" id="UX-016-HOUSEHOLD">
          <WRow />
          <WRow />
        </Zone>
        <Zone title="My agent" id="UX-016-AGENT">
          <WRow trailing={<Btn label="Request a call" />} />
        </Zone>
        <Zone title="Documents & notices" id="UX-016-DOCS" note="Module 1 scope: quote summary and handoff confirmation only.">
          <WRow />
        </Zone>
        <Zone title="Notifications" id="UX-016-NOTIFS">
          <WRow />
          <WRow />
        </Zone>
      </div>
      <Disclosure>
        Members see only their own household's records. Agent-only fields and internal notes never
        render here. Expired shared quotes display as expired rather than disappearing.
      </Disclosure>
    </div>
  ),

  "ux-017": () => (
    <div className="space-y-3">
      <Zone title="Lead lookup first" id="UX-017-LEAD">
        <div className="flex flex-wrap items-end gap-2">
          <Field label="Search by name, phone or email" w="w-72" />
          <Btn label="Search" />
          <Btn label="Create new lead" />
        </div>
        <WRow trailing={<Pill>Attach</Pill>} />
        <WRow trailing={<Pill>Attach</Pill>} />
        <Annotation className="mt-2">Attaching prevents duplicate lead creation.</Annotation>
      </Zone>
      <Zone title="Minimal start form" id="UX-017-START">
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="ZIP / county" />
          <Field label="Effective date" />
          <Field label="Household (quick entry)" />
          <Field label="Writing agency / entity" />
        </div>
        <div className="mt-3">
          <Btn label="Start quick quote" primary />
        </div>
      </Zone>
      <Zone title="Licensing & appointment gate" id="UX-017-GATE">
        <WBox className="h-14" label="blocked: no active appointment for this state / product — with remediation path" />
      </Zone>
      <Zone title="Recent quick quotes" id="UX-017-RECENT">
        <WRow trailing={<Pill>Resume</Pill>} />
        <WRow trailing={<Pill>Resume</Pill>} />
      </Zone>
      <Disclosure>
        License and appointment are verified before the quote proceeds, not only at send time. The
        writing entity chosen determines commission attribution and is recorded on the quote.
      </Disclosure>
    </div>
  ),

  "ux-018": () => (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[300px_1fr]">
        <Zone title="Input rail" id="UX-018-INPUTS">
          <div className="space-y-2">
            <Field label="ZIP / county" />
            <Field label="Effective date" />
            <WBox className="h-16" label="household members (inline editor)" />
            <Field label="Estimated income (subsidy)" />
            <WBox className="h-16" label="Plan-O priorities & usage" />
            <Btn label="Re-run results" primary />
          </div>
        </Zone>
        <div className="space-y-3">
          <Zone title="Live results (same engine and result set as UX-009)" id="UX-018-RESULTS">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Pill>Recommended</Pill>
              <Pill>All plans</Pill>
              <Pill>Filters</Pill>
              <Pill>Sort</Pill>
            </div>
            <div className="space-y-2">
              <PlanCard rec />
              <PlanCard />
            </div>
          </Zone>
          <div className="grid gap-3 md:grid-cols-2">
            <Zone title="Prospect selection" id="UX-018-SELECTION">
              <WRow trailing={<Pill>Remove</Pill>} />
              <div className="mt-2 flex flex-wrap gap-2">
                <Btn label="Send quote" primary />
                <Btn label="Schedule call" />
              </div>
            </Zone>
            <Zone title="Notes → lead timeline" id="UX-018-NOTES">
              <WBox className="h-20" label="note composer (writes to UX-021)" />
            </Zone>
          </div>
        </div>
      </div>
      <Disclosure>
        Agents see the same result set the consumer would for the same inputs — differences can only
        come from sellability rules. Sensitive prospect fields are masked by default and unmasking is
        logged. AI-drafted consumer-facing text must pass UX-026 before it leaves the platform.
        Quote versions are immutable once shared.
      </Disclosure>
    </div>
  ),

  "ux-019": () => (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Zone title="Recipient & channel" id="UX-019-RECIPIENT">
          <div className="space-y-2">
            <Field label="Recipient (from lead record)" />
            <Field label="Email" />
            <Field label="Mobile" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Btn label="Email" primary />
            <Btn label="SMS (requires consent)" />
          </div>
          <WBox className="mt-2 h-12" label="consent state per channel — blocks send when missing" />
        </Zone>
        <Zone title="Included plans & expiry" id="UX-019-CONTENT">
          <WRow trailing={<Pill>Included</Pill>} />
          <WRow trailing={<Pill>Included</Pill>} />
          <WRow trailing={<Pill>Excluded</Pill>} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Field label="Link expiry (within agency bounds)" />
            <Field label="Template" />
          </div>
        </Zone>
      </div>
      <Zone title="Message composer" id="UX-019-MESSAGE">
        <WBox className="h-24" label="agency-approved template body + AI draft option" />
        <div className="mt-2 flex flex-wrap gap-2">
          <Btn label="Draft with AI" />
          <Pill>AI draft must pass UX-026 review</Pill>
        </div>
      </Zone>
      <Zone title="Preview as consumer" id="UX-019-PREVIEW" note="Renders UX-020 exactly as the recipient will see it.">
        <WBox className="h-20" label="read-only shared quote preview" />
      </Zone>
      <div className="flex flex-wrap justify-end gap-2">
        <Btn label="Preview" />
        <Btn label="Send" primary />
      </div>
      <Disclosure>
        Licensing and appointment are re-verified at send time for every included product. Platform
        appends required disclosures and licensed-entity identification — the agent cannot remove
        them. SMS requires its own consent record and opt-out language. Send events record actor,
        channel, recipient, quote version, expiry and message version, and sending locks the version.
      </Disclosure>
    </div>
  ),

  "ux-020": () => (
    <div className="space-y-3">
      <Zone title="Prepared-by header" id="UX-020-HEADER">
        <div className="flex flex-wrap items-center gap-3">
          <WBox className="h-12 w-28" label="agency logo" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <WLine w="45%" />
            <WLine w="30%" className="h-1.5 bg-muted/70" />
          </div>
          <Pill>Expires in 12 days</Pill>
        </div>
      </Zone>
      <Zone title="Read-only quote summary" id="UX-020-SUMMARY">
        <div className="grid gap-2 sm:grid-cols-3">
          {["Household (read-only)", "Location & effective date", "Estimated credit*"].map((s) => (
            <WBox key={s} className="h-14" label={s} />
          ))}
        </div>
      </Zone>
      <Zone title="Included plans" id="UX-020-PLANS">
        <div className="space-y-2">
          <PlanCard rec />
          <PlanCard />
        </div>
        <div className="mt-2">
          <Btn label="Compare included plans" />
        </div>
      </Zone>
      <Zone title="Action bar" id="UX-020-ACTIONS">
        <div className="flex flex-wrap gap-2">
          <Btn label="I'm interested" />
          <Btn label="Request a call" />
          <Btn label="Continue to enroll" primary />
        </div>
      </Zone>
      <Zone title="Expired-link state" id="UX-020-EXPIRED">
        <WBox className="h-14" label="neutral expiry screen — discloses no PII, offers request-a-new-quote" />
      </Zone>
      <Disclosure>
        Read-only by construction: the recipient cannot alter household, rating inputs or the plan
        set. Tokenized link with expiry and revocation. Displayed PII is limited to what the
        recipient supplied, with DOBs masked. Every link open is logged to the lead timeline.
      </Disclosure>
    </div>
  ),

  "ux-021": () => (
    <div className="space-y-3">
      <Zone title="Milestone strip" id="UX-021-MILESTONES">
        <div className="flex flex-wrap gap-2">
          {["Lead created", "Quote started", "Quote shared", "Quote viewed", "Plan selected", "Account created", "Handoff initiated", "Handoff confirmed"].map((m, i) => (
            <span
              key={m}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px]",
                i <= 3 ? "border-foreground/50 bg-muted" : "border-dashed border-border text-muted-foreground",
              )}
            >
              {m}
            </span>
          ))}
        </div>
      </Zone>
      <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
        <Zone title="Activity feed (append-only)" id="UX-021-FEED">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Pill>All</Pill>
            <Pill>Quotes</Pill>
            <Pill>Messages</Pill>
            <Pill>System events</Pill>
            <Pill>Notes</Pill>
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <WRow key={i} trailing={<Pill>{i % 2 ? "System" : "Agent"}</Pill>} />
          ))}
        </Zone>
        <div className="space-y-3">
          <Zone title="Quick actions" id="UX-021-ACTIONS">
            <div className="flex flex-wrap gap-2">
              <Btn label="Log note" />
              <Btn label="Create task" />
              <Btn label="Resume quote" />
              <Btn label="Send quote" />
              <Btn label="Request call" />
            </div>
          </Zone>
          <Zone title="Related objects" id="UX-021-RELATED">
            <WRow trailing={<Pill>Quote</Pill>} />
            <WRow trailing={<Pill>Shared link</Pill>} />
            <WRow trailing={<Pill>Handoff</Pill>} />
          </Zone>
        </div>
      </div>
      <Disclosure>
        Append-only: entries cannot be edited or deleted, only annotated. System events are visually
        distinct from human actions. Visibility follows the relationship graph. Masked values unmask
        only via an audited action. Module 1 covers shopping through handoff — post-enrollment
        servicing events are out of scope.
      </Disclosure>
    </div>
  ),

  "ux-022": () => (
    <div className="space-y-3">
      <Zone title="Interest confirmation" id="UX-022-CONTEXT">
        <WBox className="h-14" label="what you're interested in: quote / specific plan / ancillary line" />
      </Zone>
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Contact preference" id="UX-022-PREF">
          <div className="flex flex-wrap gap-2">
            <Btn label="Call me back" primary />
            <Btn label="Pick a time" />
          </div>
        </Zone>
        <Zone title="Simple availability picker" id="UX-022-SLOTS" note="Time windows, not booked calendar slots.">
          <div className="grid grid-cols-3 gap-2">
            {["Mon AM", "Mon PM", "Tue AM", "Tue PM", "Wed AM", "Wed PM"].map((s) => (
              <WBox key={s} className="h-10" label={s} />
            ))}
          </div>
        </Zone>
      </div>
      <Zone title="Contact details & consent" id="UX-022-CONTACT">
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Name" />
          <Field label="Phone" />
          <Field label="Email" />
        </div>
        <div className="mt-2 flex items-start gap-2 rounded-md border border-border p-2">
          <div className="mt-0.5 size-4 shrink-0 rounded border border-border" aria-hidden="true" />
          <p className="text-xs text-foreground/80">
            Consent to be contacted by phone / SMS, with opt-out language. Recorded per channel.
          </p>
        </div>
        <WBox className="mt-2 h-16" label="optional message" />
      </Zone>
      <Zone title="Confirmation state" id="UX-022-CONFIRM">
        <WBox className="h-14" label="request received · expected response window from UX-025 business hours" />
      </Zone>
      <Disclosure>
        This is a request for a time window, not a confirmed booking — confirmation copy must not
        promise one. Routing follows the agency rules in UX-025 and creates an auditable lead
        activity. No plan or subsidy advice appears in the confirmation copy.
      </Disclosure>
    </div>
  ),

  "ux-023": () => (
    <div className="space-y-3">
      <Zone title="Plain-language explainer" id="UX-023-EXPLAIN">
        <WLine w="80%" className="h-3" />
        <WLine w="65%" className="mt-2" />
        <WLine w="50%" className="mt-2 h-1.5 bg-muted/70" />
      </Zone>
      <div className="grid gap-3 md:grid-cols-3">
        <Zone title="What transfers" id="UX-023-TRANSFERS">
          <WRow primary="60%" secondary="30%" />
          <WRow primary="50%" secondary="35%" />
          <WRow primary="55%" secondary="25%" />
        </Zone>
        <Zone title="What does not transfer" id="UX-023-NOT-TRANSFERS" note="Consumer is told these will be asked again on the exchange application.">
          <WRow primary="45%" secondary="30%" />
          <WRow primary="55%" secondary="25%" />
        </Zone>
        <Zone title="What you'll need" id="UX-023-NEEDS">
          <WRow primary="50%" secondary="30%" />
          <WRow primary="60%" secondary="30%" />
        </Zone>
      </div>
      <Zone title="Agent of record statement" id="UX-023-AOR">
        <WBox className="h-12" label="shown when the session is agent-attributed" />
      </Zone>
      <Zone title="Consent to transfer" id="UX-023-CONSENT">
        <div className="flex items-start gap-2 rounded-md border border-border p-2">
          <div className="mt-0.5 size-4 shrink-0 rounded border border-border" aria-hidden="true" />
          <p className="text-xs text-foreground/80">
            Affirmative consent, with the versioned disclosure text displayed inline (not behind a
            link).
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn label="Save and finish later" />
          <Btn label="Consent and continue to application" primary />
        </div>
      </Zone>
      <div className="grid gap-3 md:grid-cols-2">
        <Zone title="Post-initiation confirmation" id="UX-023-CONFIRM">
          <div className="grid grid-cols-2 gap-2">
            <WBox className="h-14" label="reference id" />
            <WBox className="h-14" label="timestamp & status" />
          </div>
          <div className="mt-2 flex gap-2">
            <Btn label="Copy reference id" />
            <Btn label="Return to my dashboard" />
          </div>
        </Zone>
        <Zone title="Error / unavailable state" id="UX-023-ERROR" note="A failed handoff must never render as success.">
          <WBox className="h-14" label="handoff unavailable — retry / contact my agent" />
        </Zone>
      </div>
      <Disclosure>
        Consent to transfer is affirmative, versioned and logged with timestamp, IP and exact text.
        The consumer is told they are continuing to the enhanced direct enrollment application and
        that eligibility is determined there, not in ABox. No coverage is in force at handoff. The
        payload (fields sent, target, reference id, response) is recorded and replayable for audit
        without re-displaying PII.
      </Disclosure>
    </div>
  ),

  "ux-024": () => (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Zone title="Brand settings" id="UX-024-BRAND">
          <div className="grid gap-2 sm:grid-cols-2">
            <WBox className="h-20" label="logo upload" />
            <WBox className="h-20" label="favicon" />
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Field label="Marketplace display name" />
            <Field label="Primary color token" />
            <Field label="Marketplace URL / subdomain" />
            <Field label="Licensed entity & license numbers" />
          </div>
          <WBox className="mt-2 h-16" label="footer disclosure text (required before publish)" />
        </Zone>
        <Zone title="Product line enablement" id="UX-024-PRODUCTS">
          {["IFP on-exchange", "Dental (display + interest)", "Vision (display + interest)", "Accident"].map((p) => (
            <div key={p} className="flex items-center gap-3 border-b border-border/60 py-2 last:border-b-0">
              <span className="flex-1 text-xs text-foreground/80">{p}</span>
              <Pill>States available</Pill>
              <div className="h-5 w-9 rounded-full border border-border bg-muted" aria-hidden="true" />
            </div>
          ))}
          <Annotation className="mt-2">
            Enablement cannot exceed licensing and appointments — blocked options show why.
          </Annotation>
        </Zone>
      </div>
      <Zone title="Plan-O settings" id="UX-024-PLANO">
        <div className="flex flex-wrap items-center gap-3">
          <Pill>Plan-O enabled</Pill>
          <Field label="Priority set" w="w-60" />
        </div>
      </Zone>
      <div className="flex flex-wrap justify-end gap-2">
        <Btn label="Preview as consumer" />
        <Btn label="Save" primary />
      </div>
      <Disclosure>
        Disclosure and licensed-entity text is required before a marketplace can publish. Every
        change is versioned with the prior value retained. Only Module 1 settings appear here —
        notification/document template theming and full white labeling belong to a later Phase 1
        packet.
      </Disclosure>
    </div>
  ),

  "ux-025": () => (
    <div className="space-y-3">
      <Zone title="Lead routing rules (ordered)" id="UX-025-ROUTING">
        {["By state / licensure", "By product line", "Round robin within team", "Named default owner"].map((r, i) => (
          <div key={r} className="flex items-center gap-3 border-b border-border/60 py-2 last:border-b-0">
            <span className="font-mono text-[10px] text-muted-foreground">{i + 1}</span>
            <span className="flex-1 text-xs text-foreground/80">{r}</span>
            <Pill>Move up</Pill>
            <Pill>Edit</Pill>
          </div>
        ))}
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <Field label="Fallback owner" />
          <Field label="Unassigned queue" />
          <Field label="Business hours / response window" />
        </div>
      </Zone>
      <Zone title="Notification matrix" id="UX-025-NOTIFS">
        <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Event</span>
          {["Consumer", "Agent", "Agency"].map((h) => (
            <span key={h} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {h}
            </span>
          ))}
          {["Quote shared", "Link opened", "Interest expressed", "Call requested", "Handoff initiated", "Handoff confirmed"].map((e) => (
            <MatrixRow key={e} label={e} />
          ))}
        </div>
        <Annotation className="mt-2">
          Each cell = channel toggles (email / SMS / in-app) plus template selection. SMS to
          consumers requires a consent record.
        </Annotation>
      </Zone>
      <div className="flex flex-wrap justify-end gap-2">
        <Btn label="Send test" />
        <Btn label="Save" primary />
      </div>
      <Disclosure>
        Routing can only target agents licensed and appointed for the state and product — invalid
        targets are blocked at configuration time. Platform-required disclosures are appended to
        outbound templates and cannot be removed. All changes are versioned and auditable.
      </Disclosure>
    </div>
  ),

  "ux-026": () => (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <Zone title="Generated output (editable draft)" id="UX-026-DRAFT">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Pill>AI-generated</Pill>
            <Pill>Model / ruleset version</Pill>
            <Pill>Generated 12:04</Pill>
          </div>
          <WBox className="h-32" label="draft body with change tracking against the original generation" />
        </Zone>
        <div className="space-y-3">
          <Zone title="Basis / sources" id="UX-026-BASIS">
            <WRow primary="60%" secondary="30%" />
            <WRow primary="50%" secondary="35%" />
            <Annotation className="mt-2">Records and inputs the output was derived from.</Annotation>
          </Zone>
          <Zone title="Guardrail checks" id="UX-026-GUARDRAILS">
            {["No prohibited advice language", "Required disclosures present", "No unmasked PII", "No eligibility or cost guarantee"].map((g) => (
              <div key={g} className="flex items-center gap-2 border-b border-border/60 py-2 last:border-b-0">
                <div className="size-3 rounded-full border border-border bg-muted" aria-hidden="true" />
                <span className="text-xs text-foreground/80">{g}</span>
              </div>
            ))}
          </Zone>
        </div>
      </div>
      <Zone title="Decision" id="UX-026-DECISION">
        <div className="flex flex-wrap gap-2">
          <Btn label="Regenerate" />
          <Btn label="Reject with reason" />
          <Btn label="Edit & confirm" />
          <Btn label="Confirm and continue" primary />
        </div>
        <WBox className="mt-2 h-14" label="rejection reason capture (retained, never silently discarded)" />
      </Zone>
      <Disclosure>
        No AI output reaches a consumer without explicit human confirmation recorded against a named
        user. Confirmation is blocked when a guardrail check detects advice phrasing, eligibility
        determinations or coverage/cost guarantees. Inputs, output, version, edits and the decision
        are retained for governance review.
      </Disclosure>
    </div>
  ),
};

function ContrastRow({ label }: { label: string }) {
  return (
    <>
      <span className="self-center text-xs text-foreground/80">{label}</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded border border-dashed border-border p-2">
          <WLine w="70%" />
        </div>
      ))}
    </>
  );
}

function MatrixRow({ label }: { label: string }) {
  return (
    <>
      <span className="self-center text-xs text-foreground/80">{label}</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-1 rounded border border-dashed border-border p-2">
          <Pill>Email</Pill>
          <Pill>SMS</Pill>
        </div>
      ))}
    </>
  );
}

export function M1Canvas({ slug }: { slug: string }) {
  const render = canvases[slug];
  if (!render) return <WBox className="h-40" label="canvas not defined" />;
  return <>{render()}</>;
}
