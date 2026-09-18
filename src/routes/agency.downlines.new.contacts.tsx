/**
 * SCR-M05-009 — Create Downline Agency: Contacts.
 * Required contact roles — Lucie MVP requires the primary business contact.
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { step9ContactSchema, loadWizardState, saveWizardState } from "@/lib/downline-wizard-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/downlines/new/contacts")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Contacts — ABox" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [state, setState] = useState(() => loadWizardState());
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const update = <K extends keyof typeof state.contact>(k: K, v: (typeof state.contact)[K]) => {
    const next = { ...state, contact: { ...state.contact, [k]: v } };
    setState(next); saveWizardState(next);
  };

  const onNext = () => {
    const parsed = step9ContactSchema.safeParse(state.contact);
    if (!parsed.success) {
      const errs: Partial<Record<string, string>> = {};
      for (const iss of parsed.error.issues) errs[iss.path.join(".")] = iss.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    navigate({ to: "/agency/downlines/new/locations" });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Contacts · SCR-M05-009">
      <DownlineWizardStepper />

      <div className={cn("mt-8 max-w-2xl space-y-5", surfaceClass({ padding: "lg" }))}>
        <p className="text-sm text-muted-foreground">Primary business contact — required for every organization.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-eyebrow">Full name</span>
            <input
              value={state.contact.contact_name} onChange={(e) => update("contact_name", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
            {errors["contact_name"] && <p className="mt-1 text-xs text-destructive">{errors["contact_name"]}</p>}
          </label>
          <label className="block text-sm">
            <span className="text-eyebrow">Job title (optional)</span>
            <input
              value={state.contact.job_title} onChange={(e) => update("job_title", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-eyebrow">Email</span>
            <input
              type="email" value={state.contact.email} onChange={(e) => update("email", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
            {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
          </label>
          <label className="block text-sm">
            <span className="text-eyebrow">Telephone</span>
            <input
              type="tel" value={state.contact.telephone} onChange={(e) => update("telephone", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              placeholder="+1 (555) 123-4567"
            />
            {errors["telephone"] && <p className="mt-1 text-xs text-destructive">{errors["telephone"]}</p>}
          </label>
        </div>

        <label className="block text-sm max-w-xs">
          <span className="text-eyebrow">Preferred language</span>
          <select
            value={state.contact.preferred_language} onChange={(e) => update("preferred_language", e.target.value as "EN" | "ES")}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="EN">English</option>
            <option value="ES">Español</option>
          </select>
        </label>

        <div className="flex justify-between pt-2">
          <ActionPill
            onClick={() => navigate({ to: "/agency/downlines/new/legal" })}
            variant="outlineLg"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </ActionPill>
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
