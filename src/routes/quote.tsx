/**
 * UX-003 through UX-008 — Marketplace Quote Wizard.
 *
 * Six steps, URL-synced via ?step=1..6 search param (browser back/forward
 * works). Wizard state persists to sessionStorage between refreshes.
 *
 *   1  UX-003  ZIP & effective date
 *   2  UX-004  Household members
 *   3  UX-005  Plan-AI goals & usage
 *   4  UX-006  Provider & drug lookup (optional)
 *   5  UX-007  Subsidy inputs (optional)
 *   6  UX-008  Subsidy estimate & education → continue to /plans
 *
 * Accessibility posture:
 *  - Progress rendered as an <ol> with aria-label + per-step aria-current.
 *  - Step change fires an aria-live announcement.
 *  - First invalid field is focused on submit.
 *  - Keyboard: Enter submits the current step; Alt+ArrowLeft / Alt+ArrowRight
 *    move between completed steps; the stepper items themselves are buttons.
 *  - Radio/checkbox groups use role="radiogroup"/"group" with labelled fieldsets.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  X,
  Pill,
  Stethoscope,
} from "lucide-react";

import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { AboxMark } from "@/components/abox/logo";
import { SaveContinueButton } from "@/components/abox/save-continue-button";
import { ShoppingPathBar } from "@/components/abox/shopping-path-bar";
import { shoppingModeStore } from "@/lib/shopping-mode";
import { cn } from "@/lib/utils";
import {
  PRIORITIES,
  RELATIONSHIPS,
  RELATIONSHIP_LABEL,
  SEX_OPTIONS,
  USAGE_LEVELS,
  cryptoRandomId,
  defaultQuoteState,
  estimateMonthlyAPTC,
  fplBand,
  loadQuoteState,
  resolveCountyStub,
  saveQuoteState,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  type Drug,
  type Member,
  type PriorityKey,
  type Provider,
  type QuoteState,
  type UsageLevel,
} from "@/lib/quote-store";

/* ------------------------------------------------------------------ */
/* Route                                                                */
/* ------------------------------------------------------------------ */

const STEP_COUNT = 6;

const searchSchema = z.object({
  step: z.coerce.number().int().min(1).max(STEP_COUNT).catch(1),
});

export const Route = createFileRoute("/quote")({
  validateSearch: (input) => searchSchema.parse(input),
  head: () => ({
    meta: [
      { title: "Get a quote — ABox" },
      {
        name: "description",
        content:
          "A guided quote for individual & family health coverage. Six short steps — ZIP, household, goals, optional providers, optional subsidy — then plans.",
      },
    ],
  }),
  component: QuoteWizardPage,
});

/* ------------------------------------------------------------------ */
/* Step metadata                                                        */
/* ------------------------------------------------------------------ */

interface StepMeta {
  n: number;
  scr: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const STEPS: StepMeta[] = [
  {
    n: 1,
    scr: "UX-003",
    eyebrow: "Where & when",
    title: "Where do you live, and when do you need coverage?",
    subtitle: "We use your ZIP to find the right rating area and county.",
  },
  {
    n: 2,
    scr: "UX-004",
    eyebrow: "Who's covered",
    title: "Who should this plan cover?",
    subtitle: "Add everyone who will be on the plan. Age and tobacco use affect price.",
  },
  {
    n: 3,
    scr: "UX-005",
    eyebrow: "Priorities",
    title: "What matters most to you?",
    subtitle: "Plan-AI uses this to shortlist plans. Pick up to three.",
  },
  {
    n: 4,
    scr: "UX-006",
    eyebrow: "Optional",
    title: "Any doctors or prescriptions we should check?",
    subtitle: "Skip this if you're not sure — you can add them later on plan detail.",
  },
  {
    n: 5,
    scr: "UX-007",
    eyebrow: "Optional",
    title: "Curious about a subsidy?",
    subtitle: "Federal subsidies (APTC) may lower your monthly premium. Skip if you'd rather not.",
  },
  {
    n: 6,
    scr: "UX-008",
    eyebrow: "Almost there",
    title: "Your subsidy estimate",
    subtitle: "This is an educational estimate — not a promise. Final numbers come from the exchange.",
  },
];

/* ------------------------------------------------------------------ */
/* Root component                                                       */
/* ------------------------------------------------------------------ */

type Errors = Partial<Record<string, string>>;

function QuoteWizardPage() {
  const { step } = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.fullPath });

  const [state, setState] = useState<QuoteState>(() => loadQuoteState() ?? defaultQuoteState());
  const [errors, setErrors] = useState<Errors>({});
  const [maxReached, setMaxReached] = useState<number>(step);
  const [announce, setAnnounce] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstInvalidRef = useRef<HTMLElement | null>(null);

  // Persist on every state change
  useEffect(() => {
    saveQuoteState(state);
  }, [state]);

  // Track farthest reached step so users can jump back and forward
  useEffect(() => {
    setMaxReached((prev) => Math.max(prev, step));
    shoppingModeStore.recordGuidedStep(step);
    // Focus the step heading + announce
    if (headingRef.current) headingRef.current.focus();
    const meta = STEPS[step - 1];
    if (meta) setAnnounce(`Step ${step} of ${STEP_COUNT}: ${meta.title}`);
    setErrors({});
    firstInvalidRef.current = null;
  }, [step]);

  // Alt+Arrow keyboard navigation between completed steps
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "ArrowLeft" && step > 1) {
        e.preventDefault();
        navigate({ search: (prev: { step: number }) => ({ ...prev, step: step - 1 }) });
      } else if (e.key === "ArrowRight" && step < maxReached) {
        e.preventDefault();
        navigate({ search: (prev: { step: number }) => ({ ...prev, step: step + 1 }) });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, maxReached, navigate]);

  const goTo = useCallback(
    (n: number) => {
      if (n < 1 || n > STEP_COUNT) return;
      if (n > maxReached) return; // can't jump ahead
      navigate({ search: (prev: { step: number }) => ({ ...prev, step: n }) });
    },
    [navigate, maxReached],
  );

  const goNext = useCallback(() => {
    if (step >= STEP_COUNT) return;
    navigate({ search: (prev: { step: number }) => ({ ...prev, step: step + 1 }) });
  }, [navigate, step]);

  const goBack = useCallback(() => {
    if (step <= 1) return;
    navigate({ search: (prev: { step: number }) => ({ ...prev, step: step - 1 }) });
  }, [navigate, step]);

  const validateAndAdvance = useCallback(() => {
    const errs: Errors = {};
    let ok = true;

    if (step === 1) {
      const r = step1Schema.safeParse({ zip: state.zip, effectiveDate: state.effectiveDate });
      if (!r.success) {
        for (const iss of r.error.issues) errs[iss.path.join(".")] = iss.message;
        ok = false;
      }
    } else if (step === 2) {
      const r = step2Schema.safeParse({ members: state.members });
      if (!r.success) {
        for (const iss of r.error.issues) errs[iss.path.join(".")] = iss.message;
        ok = false;
      }
    } else if (step === 3) {
      const r = step3Schema.safeParse({
        priorities: state.priorities,
        usage: state.usage,
        keepDoctor: state.keepDoctor,
      });
      if (!r.success) {
        for (const iss of r.error.issues) errs[iss.path.join(".")] = iss.message;
        ok = false;
      }
    } else if (step === 4) {
      const r = step4Schema.safeParse({
        skipLookup: state.skipLookup,
        providers: state.providers,
        drugs: state.drugs,
      });
      if (!r.success) {
        for (const iss of r.error.issues) errs[iss.path.join(".")] = iss.message;
        ok = false;
      }
    } else if (step === 5) {
      const r = step5Schema.safeParse({
        skipSubsidy: state.skipSubsidy,
        income: state.income,
        taxHouseholdSize: state.taxHouseholdSize,
      });
      if (!r.success) {
        for (const iss of r.error.issues) errs[iss.path.join(".")] = iss.message;
        ok = false;
      }
    }

    setErrors(errs);
    if (!ok) {
      // Focus first invalid field
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>("[data-invalid='true']");
        if (el) {
          el.focus();
          firstInvalidRef.current = el;
        }
        const firstMsg = Object.values(errs)[0];
        if (firstMsg) setAnnounce(`Please fix: ${firstMsg}`);
      });
      return;
    }
    goNext();
  }, [state, step, goNext]);

  const currentMeta = STEPS[step - 1];

  return (
    <MarketplaceShell product="ifp">
      {/* Live region for step / error announcements */}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-4 md:px-8 md:pb-12 md:pt-6">
        <ShoppingPathBar current="guided" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <WizardStepper current={step} maxReached={maxReached} goTo={goTo} />
          <SaveContinueButton className="shrink-0" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < STEP_COUNT) validateAndAdvance();
          }}
          noValidate
          className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]"
          aria-labelledby="wizard-heading"
        >
          <section className="min-w-0">
            <p className="text-eyebrow flex items-center gap-2">
              <span>
                {currentMeta.scr} · Step {step} of {STEP_COUNT}
              </span>
              <span className="hidden text-muted-foreground/70 md:inline">
                · {currentMeta.eyebrow}
              </span>
            </p>
            <h1
              id="wizard-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-display mt-2 text-3xl md:text-5xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              {currentMeta.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
              {currentMeta.subtitle}
            </p>

            <div className="mt-8">
              {step === 1 && <Step1 state={state} setState={setState} errors={errors} />}
              {step === 2 && <Step2 state={state} setState={setState} errors={errors} />}
              {step === 3 && <Step3 state={state} setState={setState} errors={errors} />}
              {step === 4 && <Step4 state={state} setState={setState} errors={errors} />}
              {step === 5 && <Step5 state={state} setState={setState} errors={errors} />}
              {step === 6 && <Step6 state={state} />}
            </div>

            <WizardFooter
              step={step}
              goBack={goBack}
              onNext={validateAndAdvance}
              onFinish={() => {
                // Quote answers stay in session so a shopper can return to
                // the guided path (or switch to browse) without restarting.
                // Persist a summary key the plans route can pick up
                if (typeof window !== "undefined") {
                  window.sessionStorage.setItem(
                    "abox_quote_completed",
                    JSON.stringify({ zip: state.zip, effectiveDate: state.effectiveDate }),
                  );
                }
              }}
            />
          </section>

          <SidePanel state={state} step={step} />
        </form>
      </div>
    </MarketplaceShell>
  );
}

/* ------------------------------------------------------------------ */
/* Progress stepper                                                     */
/* ------------------------------------------------------------------ */

function WizardStepper({
  current,
  maxReached,
  goTo,
}: {
  current: number;
  maxReached: number;
  goTo: (n: number) => void;
}) {
  return (
    <nav aria-label="Quote wizard progress">
      <ol className="flex items-center gap-1 overflow-x-auto pb-1 md:gap-2">
        {STEPS.map((s) => {
          const isCurrent = s.n === current;
          const isDone = s.n < maxReached;
          const isReachable = s.n <= maxReached;
          return (
            <li key={s.n} className="flex min-w-fit items-center gap-1 md:gap-2">
              <button
                type="button"
                onClick={() => goTo(s.n)}
                disabled={!isReachable}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${s.n} of ${STEP_COUNT}: ${s.title}${isDone ? " (completed)" : ""}`}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  !isCurrent && isDone && "border-sage/40 bg-sage-soft text-sage",
                  !isCurrent && !isDone && isReachable && "border-border bg-surface text-foreground hover:bg-accent",
                  !isReachable && "border-border bg-surface text-muted-foreground/60 cursor-not-allowed",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums",
                    isCurrent && "bg-primary-foreground text-primary",
                    !isCurrent && isDone && "bg-sage text-sage-foreground",
                    !isCurrent && !isDone && "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" /> : s.n}
                </span>
                <span className="hidden md:inline">{s.eyebrow}</span>
                <span className="md:hidden">{s.eyebrow.split(" ")[0]}</span>
              </button>
              {s.n < STEP_COUNT && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

function WizardFooter({
  step,
  goBack,
  onNext,
  onFinish,
}: {
  step: number;
  goBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const isLast = step === STEP_COUNT;
  return (
    <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-6 md:flex-row md:items-center">
      <button
        type="button"
        onClick={goBack}
        disabled={step === 1}
        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 min-h-11"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </button>
      <p className="hidden text-xs text-muted-foreground md:block" aria-hidden>
        Tip: <kbd className="rounded border border-border px-1 py-0.5">Enter</kbd> to continue ·{" "}
        <kbd className="rounded border border-border px-1 py-0.5">Alt</kbd> +{" "}
        <kbd className="rounded border border-border px-1 py-0.5">←</kbd>/
        <kbd className="rounded border border-border px-1 py-0.5">→</kbd> to move between steps
      </p>
      {isLast ? (
        <a
          href="/plans"
          onClick={onFinish}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-11"
        >
          See my plans
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-11"
        >
          Continue
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Side panel — Plan-AI nudge + summary                                  */
/* ------------------------------------------------------------------ */

function SidePanel({ state, step }: { state: QuoteState; step: number }) {
  const messages: Record<number, string> = {
    1: "I'll use your ZIP to find the right rating area and county — nothing else.",
    2: "Age and tobacco use affect price, but nothing here impacts eligibility.",
    3: "Rank what matters most. I'll narrow to plans that actually fit.",
    4: "Providers and Rx are totally optional — most shoppers skip this.",
    5: "If you'd rather not share income, skip it. You can still shop plans.",
    6: "This is an estimate for education — the exchange makes the final call.",
  };
  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2.5">
        <AboxMark size={30} tone="primary" />
        <div>
          <p className="text-sm font-semibold">Plan-AI</p>
          <p className="text-[11px] text-muted-foreground">Guidance · not binding</p>
        </div>
      </div>
      <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2.5 text-sm">{messages[step]}</p>

      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="ZIP" value={state.zip || "—"} />
        <SummaryRow
          label="Effective"
          value={state.effectiveDate ? formatDate(state.effectiveDate) : "—"}
        />
        <SummaryRow
          label="Household"
          value={
            state.members.length
              ? `${state.members.length} ${state.members.length === 1 ? "person" : "people"}`
              : "—"
          }
        />
        <SummaryRow
          label="Priorities"
          value={
            state.priorities.length
              ? state.priorities
                  .map((k) => PRIORITIES.find((p) => p.key === k)?.label ?? k)
                  .join(", ")
              : "—"
          }
        />
        {(state.providers.length > 0 || state.drugs.length > 0) && (
          <SummaryRow
            label="Checked"
            value={`${state.providers.length} provider${state.providers.length === 1 ? "" : "s"} · ${state.drugs.length} Rx`}
          />
        )}
      </div>
      <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
        Your progress saves as you go. Come back any time to <code className="rounded bg-muted px-1">/quote</code>.
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-eyebrow">{label}</p>
      <p className="mt-0.5 text-foreground truncate">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1 — UX-003                                                      */
/* ------------------------------------------------------------------ */

function Step1({
  state,
  setState,
  errors,
}: {
  state: QuoteState;
  setState: React.Dispatch<React.SetStateAction<QuoteState>>;
  errors: Errors;
}) {
  const county = useMemo(() => resolveCountyStub(state.zip), [state.zip]);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Field
        label="ZIP code"
        htmlFor="zip"
        hint="5-digit US ZIP code"
        error={errors.zip}
      >
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            pattern="\d{5}"
            value={state.zip}
            data-invalid={!!errors.zip || undefined}
            aria-invalid={!!errors.zip || undefined}
            aria-describedby={errors.zip ? "zip-error" : "zip-hint"}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 5);
              setState((s) => ({ ...s, zip: v, county: resolveCountyStub(v) }));
            }}
            className={inputCls(!!errors.zip, "pl-9")}
            placeholder="30301"
          />
        </div>
        {county && !errors.zip && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-sage">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> {county}
          </p>
        )}
      </Field>

      <Field
        label="Coverage start date"
        htmlFor="effective"
        hint="Defaults to the 1st of next month"
        error={errors.effectiveDate}
      >
        <input
          id="effective"
          type="date"
          autoComplete="off"
          value={state.effectiveDate}
          data-invalid={!!errors.effectiveDate || undefined}
          aria-invalid={!!errors.effectiveDate || undefined}
          aria-describedby={errors.effectiveDate ? "effective-error" : "effective-hint"}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setState((s) => ({ ...s, effectiveDate: e.target.value }))}
          className={inputCls(!!errors.effectiveDate)}
        />
      </Field>

      <div className="md:col-span-2">
        <InfoNote>
          Availability, pricing, and network sizes can vary by county — that's why we start here.
        </InfoNote>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2 — UX-004                                                      */
/* ------------------------------------------------------------------ */

function Step2({
  state,
  setState,
  errors,
}: {
  state: QuoteState;
  setState: React.Dispatch<React.SetStateAction<QuoteState>>;
  errors: Errors;
}) {
  const updateMember = (id: string, patch: Partial<Member>) =>
    setState((s) => ({ ...s, members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));

  const addMember = () =>
    setState((s) => ({
      ...s,
      members: [
        ...s.members,
        {
          id: cryptoRandomId(),
          relationship: s.members.length === 1 ? "spouse" : "child",
          dob: "",
          sex: "male",
          tobacco: false,
        },
      ],
    }));

  const removeMember = (id: string) =>
    setState((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) }));

  const rootError = errors["members"];

  return (
    <div className="space-y-4">
      {rootError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {rootError}
        </p>
      )}
      <ul className="space-y-3">
        {state.members.map((m, idx) => {
          const errKey = (k: keyof Member) => errors[`members.${idx}.${k}`];
          return (
            <li
              key={m.id}
              className="rounded-2xl border border-border bg-card p-4 md:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-eyebrow">
                  {m.relationship === "primary" ? "Primary applicant" : `Member ${idx + 1}`}
                </p>
                {m.relationship !== "primary" && (
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-destructive"
                    aria-label={`Remove member ${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Relationship" htmlFor={`rel-${m.id}`}>
                  <select
                    id={`rel-${m.id}`}
                    className={inputCls(false)}
                    value={m.relationship}
                    onChange={(e) => updateMember(m.id, { relationship: e.target.value as Member["relationship"] })}
                    disabled={m.relationship === "primary" && idx === 0 && state.members.length === 1}
                  >
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>
                        {RELATIONSHIP_LABEL[r]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Date of birth" htmlFor={`dob-${m.id}`} error={errKey("dob")}>
                  <input
                    id={`dob-${m.id}`}
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={m.dob}
                    data-invalid={!!errKey("dob") || undefined}
                    aria-invalid={!!errKey("dob") || undefined}
                    onChange={(e) => updateMember(m.id, { dob: e.target.value })}
                    className={inputCls(!!errKey("dob"))}
                  />
                </Field>

                <Field label="Sex" htmlFor={`sex-${m.id}-male`}>
                  <fieldset>
                    <legend className="sr-only">Sex for member {idx + 1}</legend>
                    <div className="flex gap-2" role="radiogroup" aria-label="Sex">
                      {SEX_OPTIONS.map((sx) => (
                        <label
                          key={sx}
                          className={cn(
                            "flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm capitalize transition-colors min-h-11",
                            m.sex === sx
                              ? "border-primary bg-primary-soft text-foreground"
                              : "border-border bg-surface hover:bg-accent",
                          )}
                        >
                          <input
                            id={`sex-${m.id}-${sx}`}
                            type="radio"
                            className="sr-only"
                            name={`sex-${m.id}`}
                            value={sx}
                            checked={m.sex === sx}
                            onChange={() => updateMember(m.id, { sex: sx })}
                          />
                          {sx}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </Field>

                <Field label="Tobacco use" htmlFor={`tob-${m.id}`}>
                  <label className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm min-h-11">
                    <input
                      id={`tob-${m.id}`}
                      type="checkbox"
                      checked={m.tobacco}
                      onChange={(e) => updateMember(m.id, { tobacco: e.target.checked })}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    <span>Uses tobacco (last 6 months)</span>
                  </label>
                </Field>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={addMember}
        disabled={state.members.length >= 10}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-strong bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 min-h-11"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add family member
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3 — UX-005                                                      */
/* ------------------------------------------------------------------ */

function Step3({
  state,
  setState,
  errors,
}: {
  state: QuoteState;
  setState: React.Dispatch<React.SetStateAction<QuoteState>>;
  errors: Errors;
}) {
  const togglePriority = (k: PriorityKey) =>
    setState((s) => {
      const has = s.priorities.includes(k);
      if (has) return { ...s, priorities: s.priorities.filter((p) => p !== k) };
      if (s.priorities.length >= 3) return s; // cap at 3
      return { ...s, priorities: [...s.priorities, k] };
    });

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-lg font-medium text-foreground">Pick up to 3 priorities</legend>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap to select. Rank order follows selection order — top pick is shown first.
        </p>
        {errors.priorities && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {errors.priorities}
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRIORITIES.map((p) => {
            const idx = state.priorities.indexOf(p.key);
            const selected = idx >= 0;
            return (
              <button
                type="button"
                key={p.key}
                onClick={() => togglePriority(p.key)}
                aria-pressed={selected}
                data-invalid={!!errors.priorities || undefined}
                className={cn(
                  "group relative flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all min-h-24",
                  selected
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-surface hover:bg-accent",
                )}
              >
                {selected && (
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground tabular-nums"
                  >
                    {idx + 1}
                  </span>
                )}
                <span className={cn("font-medium", selected && "pr-8")}>{p.label}</span>
                <span className={cn("text-xs text-muted-foreground", selected && "pr-8")}>{p.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-medium text-foreground">How much care do you expect to use?</legend>
        {errors.usage && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {errors.usage}
          </p>
        )}
        <div className="mt-3 grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Expected usage level">
          {USAGE_LEVELS.map((u) => {
            const active = state.usage === u.key;
            return (
              <label
                key={u.key}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-colors",
                  active
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-surface hover:bg-accent",
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="usage"
                  value={u.key}
                  checked={active}
                  onChange={() => setState((s) => ({ ...s, usage: u.key as UsageLevel }))}
                />
                <span className="font-medium">{u.label}</span>
                <span className="text-xs text-muted-foreground">{u.body}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface p-4 min-h-14">
        <input
          type="checkbox"
          checked={state.keepDoctor}
          onChange={(e) => setState((s) => ({ ...s, keepDoctor: e.target.checked }))}
          className="mt-1 h-4 w-4 accent-[var(--primary)]"
        />
        <span>
          <span className="block font-medium">I have a doctor I want to keep</span>
          <span className="text-sm text-muted-foreground">
            We'll ask for them next (optional) so Plan-AI checks the network.
          </span>
        </span>
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 4 — UX-006                                                      */
/* ------------------------------------------------------------------ */

function Step4({
  state,
  setState,
  errors,
}: {
  state: QuoteState;
  setState: React.Dispatch<React.SetStateAction<QuoteState>>;
  errors: Errors;
}) {
  const [providerDraft, setProviderDraft] = useState({ name: "", kind: "pcp" as Provider["kind"] });
  const [drugDraft, setDrugDraft] = useState({ name: "", dosage: "" });

  const addProvider = () => {
    const name = providerDraft.name.trim();
    if (name.length < 2 || state.providers.length >= 10) return;
    setState((s) => ({
      ...s,
      providers: [...s.providers, { id: cryptoRandomId(), name, kind: providerDraft.kind }],
      skipLookup: false,
    }));
    setProviderDraft({ name: "", kind: "pcp" });
  };
  const addDrug = () => {
    const name = drugDraft.name.trim();
    if (name.length < 2 || state.drugs.length >= 20) return;
    setState((s) => ({
      ...s,
      drugs: [...s.drugs, { id: cryptoRandomId(), name, dosage: drugDraft.dosage.trim() }],
      skipLookup: false,
    }));
    setDrugDraft({ name: "", dosage: "" });
  };

  return (
    <div className="space-y-6">
      {errors.skipLookup && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.skipLookup}
        </p>
      )}

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-sage-soft/40 p-4">
        <input
          type="checkbox"
          checked={state.skipLookup}
          onChange={(e) => setState((s) => ({ ...s, skipLookup: e.target.checked }))}
          className="mt-1 h-4 w-4 accent-[var(--sage)]"
        />
        <span>
          <span className="block font-medium">Skip — I'll check networks later</span>
          <span className="text-sm text-muted-foreground">
            You can add doctors and Rx from any plan detail page.
          </span>
        </span>
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="font-medium">Doctors & providers</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={providerDraft.name}
              placeholder="Dr. Sarah Chen, Piedmont Hospital…"
              maxLength={80}
              onChange={(e) => setProviderDraft((d) => ({ ...d, name: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addProvider();
                }
              }}
              className={inputCls(false)}
              aria-label="Provider name"
            />
            <select
              value={providerDraft.kind}
              onChange={(e) => setProviderDraft((d) => ({ ...d, kind: e.target.value as Provider["kind"] }))}
              className={inputCls(false) + " w-32"}
              aria-label="Provider type"
            >
              <option value="pcp">Primary care</option>
              <option value="specialist">Specialist</option>
              <option value="hospital">Hospital</option>
            </select>
            <button
              type="button"
              onClick={addProvider}
              disabled={providerDraft.name.trim().length < 2 || state.providers.length >= 10}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 min-h-11"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {state.providers.length === 0 && (
              <li className="text-sm text-muted-foreground">No providers added yet.</li>
            )}
            {state.providers.map((p) => (
              <ChipRow
                key={p.id}
                title={p.name}
                subtitle={p.kind === "pcp" ? "Primary care" : p.kind === "specialist" ? "Specialist" : "Hospital"}
                onRemove={() =>
                  setState((s) => ({ ...s, providers: s.providers.filter((x) => x.id !== p.id) }))
                }
              />
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="font-medium">Prescriptions</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={drugDraft.name}
              placeholder="Atorvastatin"
              maxLength={80}
              onChange={(e) => setDrugDraft((d) => ({ ...d, name: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDrug();
                }
              }}
              className={inputCls(false)}
              aria-label="Drug name"
            />
            <input
              type="text"
              value={drugDraft.dosage}
              placeholder="20 mg"
              maxLength={60}
              onChange={(e) => setDrugDraft((d) => ({ ...d, dosage: e.target.value }))}
              className={inputCls(false) + " w-24"}
              aria-label="Dosage (optional)"
            />
            <button
              type="button"
              onClick={addDrug}
              disabled={drugDraft.name.trim().length < 2 || state.drugs.length >= 20}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 min-h-11"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {state.drugs.length === 0 && (
              <li className="text-sm text-muted-foreground">No prescriptions added yet.</li>
            )}
            {state.drugs.map((d) => (
              <ChipRow
                key={d.id}
                title={d.name}
                subtitle={d.dosage || "Any dosage"}
                onRemove={() =>
                  setState((s) => ({ ...s, drugs: s.drugs.filter((x) => x.id !== d.id) }))
                }
              />
            ))}
          </ul>
        </div>
      </div>

      <InfoNote>
        Lookup uses public directories (NPPES for providers) and carrier formularies. Coverage details
        are always confirmed by the carrier at enrollment.
      </InfoNote>
    </div>
  );
}

function ChipRow({
  title,
  subtitle,
  onRemove,
}: {
  title: string;
  subtitle: string;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${title}`}
        className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Step 5 — UX-007                                                      */
/* ------------------------------------------------------------------ */

function Step5({
  state,
  setState,
  errors,
}: {
  state: QuoteState;
  setState: React.Dispatch<React.SetStateAction<QuoteState>>;
  errors: Errors;
}) {
  const rootError = errors.income;
  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-sage-soft/40 p-4">
        <input
          type="checkbox"
          checked={state.skipSubsidy}
          onChange={(e) => setState((s) => ({ ...s, skipSubsidy: e.target.checked }))}
          className="mt-1 h-4 w-4 accent-[var(--sage)]"
        />
        <span>
          <span className="block font-medium">Skip — I'll shop without a subsidy check</span>
          <span className="text-sm text-muted-foreground">
            You can still see all plans and prices. Any subsidy applies only to on-exchange plans.
          </span>
        </span>
      </label>

      {rootError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {rootError}
        </p>
      )}

      <div className={cn("grid gap-6 md:grid-cols-2 transition-opacity", state.skipSubsidy && "pointer-events-none opacity-50")}>
        <Field
          label="Estimated annual household income"
          htmlFor="income"
          hint="Whole US dollars, before taxes (MAGI is fine)"
          error={errors.income && !state.skipSubsidy ? errors.income : undefined}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              id="income"
              type="number"
              inputMode="numeric"
              step={1}
              min={0}
              max={2000000}
              value={state.income ?? ""}
              disabled={state.skipSubsidy}
              onChange={(e) =>
                setState((s) => ({ ...s, income: e.target.value === "" ? undefined : Number(e.target.value) }))
              }
              className={inputCls(!!errors.income && !state.skipSubsidy, "pl-7")}
              placeholder="52000"
              data-invalid={!!errors.income && !state.skipSubsidy || undefined}
              aria-invalid={!!errors.income && !state.skipSubsidy || undefined}
            />
          </div>
        </Field>

        <Field
          label="Tax household size"
          htmlFor="hh"
          hint="Everyone on your federal tax return, including dependents"
          error={errors.taxHouseholdSize && !state.skipSubsidy ? errors.taxHouseholdSize : undefined}
        >
          <input
            id="hh"
            type="number"
            inputMode="numeric"
            step={1}
            min={1}
            max={20}
            value={state.taxHouseholdSize ?? ""}
            disabled={state.skipSubsidy}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                taxHouseholdSize: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            className={inputCls(!!errors.taxHouseholdSize && !state.skipSubsidy)}
            placeholder="2"
            data-invalid={!!errors.taxHouseholdSize && !state.skipSubsidy || undefined}
            aria-invalid={!!errors.taxHouseholdSize && !state.skipSubsidy || undefined}
          />
        </Field>
      </div>

      <InfoNote tone="warn">
        We use your income to <em>estimate</em> APTC eligibility. Actual eligibility, subsidy amount, and
        cost-sharing reductions are determined by the federal or state exchange during enrollment.
      </InfoNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 6 — UX-008                                                      */
/* ------------------------------------------------------------------ */

function Step6({ state }: { state: QuoteState }) {
  const monthlyAPTC = estimateMonthlyAPTC(state.income, state.taxHouseholdSize);
  const { band, pctFpl } = fplBand(state.income, state.taxHouseholdSize);
  const skipped = state.skipSubsidy || band === "unknown";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] card-brackets">
          <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-primary/40" />
          {skipped ? (
            <>
              <p className="text-eyebrow">Subsidy check skipped</p>
              <h2 className="text-display mt-2 text-3xl md:text-4xl">
                No subsidy estimate — that's fine.
              </h2>
              <p className="mt-3 text-muted-foreground">
                You'll see every plan available in your area. If you decide to check later, Plan-AI can
                re-run this estimate from your dashboard.
              </p>
            </>
          ) : band === "over" ? (
            <>
              <p className="text-eyebrow">Not likely eligible</p>
              <h2 className="text-display mt-2 text-3xl md:text-4xl">
                Above the subsidy band for now.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Based on {formatCurrency(state.income)} annual income for a household of{" "}
                {state.taxHouseholdSize} (~{pctFpl?.toFixed(0)}% FPL), you likely won't receive APTC.
                Off-exchange plans may fit better and are shown in results.
              </p>
            </>
          ) : band === "below" ? (
            <>
              <p className="text-eyebrow">May qualify for Medicaid / CHIP</p>
              <h2 className="text-display mt-2 text-3xl md:text-4xl">
                Below the marketplace subsidy band.
              </h2>
              <p className="mt-3 text-muted-foreground">
                At ~{pctFpl?.toFixed(0)}% FPL, you may qualify for Medicaid or CHIP depending on your
                state. Plan-AI will still show marketplace options, but a licensed agent can help you
                explore public coverage.
              </p>
            </>
          ) : (
            <>
              <p className="text-eyebrow">Estimated monthly subsidy (APTC)</p>
              <h2 className="text-display mt-2 text-5xl md:text-6xl tabular-nums">
                {formatCurrency(monthlyAPTC ?? 0)}
                <span className="text-lg text-muted-foreground"> / mo</span>
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                At {formatCurrency(state.income)} for a household of {state.taxHouseholdSize} (~
                {pctFpl?.toFixed(0)}% FPL), you may qualify for APTC — applied to premiums on on-exchange
                plans.{" "}
                {band === "cost-share" && (
                  <span>
                    You may also qualify for <strong>cost-sharing reductions (CSR)</strong> on Silver
                    plans — lower deductibles and out-of-pocket max.
                  </span>
                )}
              </p>
            </>
          )}

          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <li className="rounded-lg bg-surface px-3 py-2">
              <p className="text-eyebrow">ZIP</p>
              <p className="font-medium">{state.zip || "—"}</p>
            </li>
            <li className="rounded-lg bg-surface px-3 py-2">
              <p className="text-eyebrow">Effective</p>
              <p className="font-medium">{formatDate(state.effectiveDate)}</p>
            </li>
            <li className="rounded-lg bg-surface px-3 py-2">
              <p className="text-eyebrow">Household</p>
              <p className="font-medium">{state.members.length} on plan</p>
            </li>
            <li className="rounded-lg bg-surface px-3 py-2">
              <p className="text-eyebrow">Priorities</p>
              <p className="font-medium truncate">{state.priorities.length} chosen</p>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" aria-hidden /> Plan-AI will focus on
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {state.priorities.length === 0 && (
                <li className="text-muted-foreground">No specific priorities — I'll balance cost and coverage.</li>
              )}
              {state.priorities.map((k, i) => {
                const p = PRIORITIES.find((x) => x.key === k);
                return (
                  <li key={k} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-medium">{p?.label ?? k}</span>
                      {p && <span className="block text-xs text-muted-foreground">{p.hint}</span>}
                    </span>
                  </li>
                );
              })}
              {state.keepDoctor && (
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] font-semibold text-sage-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="font-medium">Keeping your doctor</span>
                </li>
              )}
            </ul>
          </div>

          <InfoNote>
            The exchange makes the final determination. On-exchange plans are labeled QHP in results;
            off-exchange plans are clearly marked and don't receive APTC.
          </InfoNote>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small primitives                                                     */
/* ------------------------------------------------------------------ */

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function InfoNote({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: "info" | "warn";
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-sm",
        tone === "info" && "border-border bg-surface/70 text-foreground/80",
        tone === "warn" && "border-warning/40 bg-warning/10 text-foreground",
      )}
    >
      <Info className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "warn" ? "text-warning-foreground/80" : "text-muted-foreground")} aria-hidden />
      <p>{children}</p>
    </div>
  );
}

function inputCls(invalid: boolean, extra = "") {
  return cn(
    "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-11",
    invalid ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:border-primary",
    extra,
  );
}

/* ------------------------------------------------------------------ */
/* Formatters                                                           */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatCurrency(v?: number): string {
  if (v === undefined || Number.isNaN(v)) return "—";
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
