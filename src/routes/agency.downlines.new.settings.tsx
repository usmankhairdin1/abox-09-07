/**
 * SCR-M05-011 — Create Downline Agency: Settings.
 * Copied root defaults with editable override (FLOW-M05-005 precedent).
 */
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { loadWizardState, saveWizardState } from "@/lib/downline-wizard-store";
import { useOrgState, getSettings, ROOT_ORGANIZATION_ID } from "@/lib/org-store";

export const Route = createFileRoute("/agency/downlines/new/settings")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Settings — ABox" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const org = useOrgState();
  const [state, setState] = useState(() => loadWizardState());
  const rootDefault = getSettings(org, ROOT_ORGANIZATION_ID).find((s) => s.setting_key === "quote_expiration_days");

  const update = <K extends keyof typeof state.settings>(k: K, v: (typeof state.settings)[K]) => {
    const next = { ...state, settings: { ...state.settings, [k]: v } };
    setState(next); saveWizardState(next);
  };

  const onNext = () => {
    navigate({ to: "/agency/downlines/new/administrator" });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Settings · SCR-M05-011">
      <DownlineWizardStepper />

      <div className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        <label className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm">
          <div>
            <p className="font-medium">Copy root defaults</p>
            <p className="text-xs text-muted-foreground">Start from Cedar Grove Insurance's current settings. The downline can request changes; root approval overrides.</p>
          </div>
          <input
            type="checkbox" checked={state.settings.copy_root_defaults}
            onChange={(e) => update("copy_root_defaults", e.target.checked)}
          />
        </label>

        <label className="block text-sm max-w-xs">
          <span className="text-eyebrow">Quote expiration (days)</span>
          <input
            type="number" min={1} max={30}
            value={state.settings.quote_expiration_days}
            disabled={state.settings.copy_root_defaults}
            onChange={(e) => update("quote_expiration_days", Number(e.target.value))}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
          {state.settings.copy_root_defaults && rootDefault && (
            <p className="mt-1 text-xs text-muted-foreground">Inherited from root: {String(rootDefault.value_json)} days.</p>
          )}
        </label>

        <div className="flex justify-between pt-2">
          <button
            onClick={() => navigate({ to: "/agency/downlines/new/locations" })}
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
