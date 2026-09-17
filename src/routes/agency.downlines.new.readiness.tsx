/**
 * SCR-M05-013 — Create Downline Agency: Readiness Review.
 * Fixed control outcomes and blockers, computed from the wizard state.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { StatusBadge } from "@/components/abox/status-badge";
import { loadWizardState } from "@/lib/downline-wizard-store";
import type { ReadinessResult } from "@/lib/org-store";
import { ACTION_PILL } from "@/components/abox/action-pill";

export const Route = createFileRoute("/agency/downlines/new/readiness")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Readiness Review — ABox" }] }),
  component: Page,
});

const RESULT_TONE: Record<ReadinessResult, "sage" | "warning" | "destructive" | "muted"> = {
  PASS: "sage", WARNING: "warning", FAIL: "destructive", NOT_APPLICABLE: "muted",
};

function Page() {
  const navigate = useNavigate();
  const state = loadWizardState();

  const profileComplete = !!(state.identity.legal_name && state.identity.display_name && state.contact.email && state.location.line_1);
  const adminAssigned = !!(state.administrator.admin_name && state.administrator.admin_email);

  const items: { control_code: string; result: ReadinessResult; owner_module: string; next_action?: string }[] = [
    { control_code: "PROFILE_COMPLETE", result: profileComplete ? "PASS" : "FAIL", owner_module: "M05", next_action: profileComplete ? undefined : "Complete identity, contact and address." },
    { control_code: "ADMINISTRATOR_ASSIGNED", result: adminAssigned ? "PASS" : "FAIL", owner_module: "M00", next_action: adminAssigned ? undefined : "Assign an initial administrator." },
    { control_code: "IDENTIFIER_VERIFIED", result: "WARNING", owner_module: "M05", next_action: "Verification will complete after activation — no live verification integration exists yet." },
  ];

  const hasBlocking = items.some((i) => i.result === "FAIL");
  const hasWarning = items.some((i) => i.result === "WARNING");
  const overall = hasBlocking ? "BLOCKED" : hasWarning ? "READY_WITH_WARNINGS" : "READY";

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Readiness review · SCR-M05-013">
      <DownlineWizardStepper />

      <div className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Overall readiness</p>
          <StatusBadge tone={overall === "READY" ? "sage" : overall === "READY_WITH_WARNINGS" ? "warning" : "destructive"}>
            {overall.replaceAll("_", " ")}
          </StatusBadge>
        </div>

        <ul className="divide-y divide-border rounded-xl border border-border">
          {items.map((item) => (
            <li key={item.control_code} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{item.control_code.replaceAll("_", " ")}</p>
                {item.next_action && <p className="text-xs text-muted-foreground">{item.next_action}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.owner_module}</span>
                <StatusBadge tone={RESULT_TONE[item.result]}>{item.result}</StatusBadge>
              </div>
            </li>
          ))}
        </ul>

        {hasBlocking && (
          <p className="text-xs text-destructive">Resolve blocking items before you can activate this downline.</p>
        )}

        <div className="flex justify-between pt-2">
          <button
            onClick={() => navigate({ to: "/agency/downlines/new/administrator" })}
            className={ACTION_PILL.outlineLg}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={() => navigate({ to: "/agency/downlines/new/activate" })}
            disabled={hasBlocking}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Continue to activation <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </InternalShell>
  );
}
