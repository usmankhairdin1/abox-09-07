/**
 * SCR-M05-012 — Create Downline Agency: Initial Administrator.
 * M00 invitation and membership readiness. M00's real identity/auth
 * backend doesn't exist yet (see governance/m00) — this captures the
 * invitation intent so readiness/activation are meaningful, but no
 * email is actually sent.
 */
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { step12AdministratorSchema, loadWizardState, saveWizardState } from "@/lib/downline-wizard-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/downlines/new/administrator")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Initial Administrator — ABox" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [state, setState] = useState(() => loadWizardState());
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const update = <K extends keyof typeof state.administrator>(k: K, v: (typeof state.administrator)[K]) => {
    const next = { ...state, administrator: { ...state.administrator, [k]: v } };
    setState(next); saveWizardState(next);
  };

  const onNext = () => {
    const parsed = step12AdministratorSchema.safeParse(state.administrator);
    if (!parsed.success) {
      const errs: Partial<Record<string, string>> = {};
      for (const iss of parsed.error.issues) errs[iss.path.join(".")] = iss.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    navigate({ to: "/agency/downlines/new/readiness" });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Initial administrator · SCR-M05-012">
      <DownlineWizardStepper />

      <div className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-2 rounded-xl border border-hairline bg-surface/60 p-3 text-xs text-muted-foreground">
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          This environment doesn't have a real identity/invitation backend yet (M00 platform foundation is still a specification —
          see the Compliance page for current status). The invitation is recorded for readiness purposes only; no email sends.
        </div>

        <label className="block text-sm">
          <span className="text-eyebrow">Administrator name</span>
          <input
            value={state.administrator.admin_name} onChange={(e) => update("admin_name", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
          />
          {errors["admin_name"] && <p className="mt-1 text-xs text-destructive">{errors["admin_name"]}</p>}
        </label>
        <label className="block text-sm">
          <span className="text-eyebrow">Administrator email</span>
          <input
            type="email" value={state.administrator.admin_email} onChange={(e) => update("admin_email", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
          />
          {errors["admin_email"] && <p className="mt-1 text-xs text-destructive">{errors["admin_email"]}</p>}
        </label>

        <div className="flex justify-between pt-2">
          <ActionPill
            onClick={() => navigate({ to: "/agency/downlines/new/settings" })}
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
