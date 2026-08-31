/**
 * SCR-M05-008 — Create Downline Agency: Legal and Identifiers.
 */
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { step8LegalSchema, loadWizardState, saveWizardState, TIME_ZONES } from "@/lib/downline-wizard-store";
import type { IdentifierType } from "@/lib/org-store";

export const Route = createFileRoute("/agency/downlines/new/legal")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Legal & Identifiers — ABox" }] }),
  component: Page,
});

const IDENTIFIER_TYPES: IdentifierType[] = ["EIN", "AGENCY_NPN", "NAIC_CARRIER_CODE", "JET_CUSTOMER_CODE", "VENDOR_REFERENCE", "PARTNER_REFERENCE", "EXTERNAL_ORGANIZATION_CODE"];

function Page() {
  const navigate = useNavigate();
  const [state, setState] = useState(() => loadWizardState());
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const update = <K extends keyof typeof state.legal>(k: K, v: (typeof state.legal)[K]) => {
    const next = { ...state, legal: { ...state.legal, [k]: v } };
    setState(next); saveWizardState(next);
  };

  const onNext = () => {
    const parsed = step8LegalSchema.safeParse({
      identifier_type: state.legal.identifier_type,
      identifier_value: state.legal.identifier_value,
      time_zone: state.legal.time_zone,
      default_language: state.legal.default_language,
    });
    if (!parsed.success) {
      const errs: Partial<Record<string, string>> = {};
      for (const iss of parsed.error.issues) errs[iss.path.join(".")] = iss.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    navigate({ to: "/agency/downlines/new/contacts" });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Legal & identifiers · SCR-M05-008">
      <DownlineWizardStepper />

      <div className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-eyebrow">Identifier type</span>
            <select
              value={state.legal.identifier_type} onChange={(e) => update("identifier_type", e.target.value as IdentifierType)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            >
              {IDENTIFIER_TYPES.map((t) => <option key={t} value={t}>{t.replaceAll("_", " ")}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-eyebrow">Identifier value</span>
            <input
              value={state.legal.identifier_value} onChange={(e) => update("identifier_value", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              placeholder="12-3456789"
            />
            {errors["identifier_value"] && <p className="mt-1 text-xs text-destructive">{errors["identifier_value"]}</p>}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-eyebrow">Time zone</span>
            <select
              value={state.legal.time_zone} onChange={(e) => update("time_zone", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            >
              {TIME_ZONES.map((tz) => <option key={tz} value={tz}>{tz.replace("_", " ")}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-eyebrow">Default language</span>
            <select
              value={state.legal.default_language} onChange={(e) => update("default_language", e.target.value as "EN" | "ES")}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="EN">English</option>
              <option value="ES">Español</option>
            </select>
          </label>
        </div>

        <p className="text-xs text-muted-foreground">
          Identifier values are masked after submission and verified independently — this environment does not have a real
          verification integration yet, so verification status will show as pending.
        </p>

        <div className="flex justify-between pt-2">
          <button
            onClick={() => navigate({ to: "/agency/downlines/new/identity" })}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={onNext}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </InternalShell>
  );
}
