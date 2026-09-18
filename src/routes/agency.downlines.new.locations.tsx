/**
 * SCR-M05-010 — Create Downline Agency: Addresses and Offices.
 * Headquarters address — required. Mailing/office addresses are part of
 * the broader profile (SCR-M05-018) and not required to activate.
 */
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { step10LocationSchema, loadWizardState, saveWizardState } from "@/lib/downline-wizard-store";
import { ActionPill, actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/downlines/new/locations")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Addresses & Offices — ABox" }] }),
  component: Page,
});

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

function Page() {
  const navigate = useNavigate();
  const [state, setState] = useState(() => loadWizardState());
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const update = <K extends keyof typeof state.location>(k: K, v: (typeof state.location)[K]) => {
    const next = { ...state, location: { ...state.location, [k]: v } };
    setState(next); saveWizardState(next);
  };

  const onNext = () => {
    const parsed = step10LocationSchema.safeParse(state.location);
    if (!parsed.success) {
      const errs: Partial<Record<string, string>> = {};
      for (const iss of parsed.error.issues) errs[iss.path.join(".")] = iss.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    navigate({ to: "/agency/downlines/new/settings" });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Addresses & offices · SCR-M05-010">
      <DownlineWizardStepper />

      <div className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Headquarters address.</p>

        <label className="block text-sm">
          <span className="text-eyebrow">Street address</span>
          <input
            value={state.location.line_1} onChange={(e) => update("line_1", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
          />
          {errors["line_1"] && <p className="mt-1 text-xs text-destructive">{errors["line_1"]}</p>}
        </label>
        <label className="block text-sm">
          <span className="text-eyebrow">Suite / unit (optional)</span>
          <input
            value={state.location.line_2} onChange={(e) => update("line_2", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-eyebrow">City</span>
            <input
              value={state.location.city} onChange={(e) => update("city", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
            {errors["city"] && <p className="mt-1 text-xs text-destructive">{errors["city"]}</p>}
          </label>
          <label className="block text-sm">
            <span className="text-eyebrow">State</span>
            <select
              value={state.location.state_code} onChange={(e) => update("state_code", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select…</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors["state_code"] && <p className="mt-1 text-xs text-destructive">{errors["state_code"]}</p>}
          </label>
          <label className="block text-sm">
            <span className="text-eyebrow">Postal code</span>
            <input
              value={state.location.postal_code} onChange={(e) => update("postal_code", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              inputMode="numeric" maxLength={5}
            />
            {errors["postal_code"] && <p className="mt-1 text-xs text-destructive">{errors["postal_code"]}</p>}
          </label>
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={() => navigate({ to: "/agency/downlines/new/contacts" })}
            className={actionPillClass("outlineLg")}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <ActionPill
            onClick={onNext}
            variant="primaryLg"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </ActionPill>
        </div>
      </div>
    </InternalShell>
  );
}
