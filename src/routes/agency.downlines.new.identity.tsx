/**
 * SCR-M05-007 — Create Downline Agency: Identity.
 * Draft identity and duplicate preview (FLOW-M05-001 step 1, FLOW-M05-006).
 */
import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState } from "@/lib/org-store";
import {
  step7IdentitySchema, loadWizardState, saveWizardState,
} from "@/lib/downline-wizard-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/downlines/new/identity")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Identity — ABox" }] }),
  component: Page,
});

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function Page() {
  const org = useOrgState();
  const navigate = useNavigate();
  const [state, setState] = useState(() => loadWizardState());
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const duplicates = useMemo(() => {
    if (!state.identity.legal_name && !state.identity.display_name) return [];
    const target = normalize(state.identity.display_name || state.identity.legal_name);
    if (target.length < 3) return [];
    return org.organizations.filter((o) => {
      const a = normalize(o.legal_name), b = normalize(o.display_name);
      return a.includes(target) || b.includes(target) || target.includes(a) || target.includes(b);
    });
  }, [state.identity, org.organizations]);

  const update = <K extends keyof typeof state.identity>(k: K, v: (typeof state.identity)[K]) => {
    const next = { ...state, identity: { ...state.identity, [k]: v } };
    setState(next); saveWizardState(next);
  };

  const onNext = () => {
    const parsed = step7IdentitySchema.safeParse({
      legal_name: state.identity.legal_name,
      display_name: state.identity.display_name,
      dba_name: state.identity.dba_name,
    });
    if (!parsed.success) {
      const errs: Partial<Record<string, string>> = {};
      for (const iss of parsed.error.issues) errs[iss.path.join(".")] = iss.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    saveWizardState(state);
    navigate({ to: "/agency/downlines/new/legal" });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Identity · SCR-M05-007">
      <DownlineWizardStepper />

      <div className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        <label className="block text-sm">
          <span className="text-eyebrow">Legal business name</span>
          <input
            value={state.identity.legal_name} onChange={(e) => update("legal_name", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            placeholder="Northwind Health Group Inc."
          />
          {errors["legal_name"] && <p className="mt-1 text-xs text-destructive">{errors["legal_name"]}</p>}
        </label>

        <label className="block text-sm">
          <span className="text-eyebrow">Display name</span>
          <input
            value={state.identity.display_name} onChange={(e) => update("display_name", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            placeholder="Northwind Health Group"
          />
          {errors["display_name"] && <p className="mt-1 text-xs text-destructive">{errors["display_name"]}</p>}
        </label>

        <label className="block text-sm">
          <span className="text-eyebrow">DBA name (optional)</span>
          <input
            value={state.identity.dba_name} onChange={(e) => update("dba_name", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        {duplicates.length > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
            <div>
              <p className="font-medium">Possible existing match</p>
              <ul className="mt-1 space-y-1">
                {duplicates.map((d) => (
                  <li key={d.organization_id} className="flex items-center gap-2 text-xs">
                    {d.display_name} <StatusBadge tone="muted">{d.reference_code}</StatusBadge>
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-xs text-muted-foreground">Review before continuing — this does not block you, and no automatic merge occurs.</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
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
