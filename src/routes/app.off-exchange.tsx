/**
 * SCR_APP_OFF_EXCHANGE — Intake + application scaffolding
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/off-exchange")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_APP_OFF_EXCHANGE.name} — ABox` }, { name: "description", content: SCREENS.SCR_APP_OFF_EXCHANGE.purpose }] }),
  component: Page,
});

const STEPS = ["Applicant", "Household", "Health questions", "Plan & payment", "Review"];

function Page() {
  const [step, setStep] = useState(0);
  return (
    <InternalShell workspace="agent" pageTitle="Off-exchange enrollment" eyebrow="Selling">
      <ol className="mb-6 flex flex-wrap gap-1.5 rounded-full bg-surface p-1 text-xs">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              onClick={() => setStep(i)} aria-current={step === i ? "step" : undefined}
              className={cn("rounded-full px-3 py-1.5",
                step === i ? "bg-primary text-primary-foreground font-medium" :
                i < step ? "text-sage" : "text-muted-foreground")}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6">
        {step === 0 && (
          <FormGrid>
            <TextField label="Legal first name" />
            <TextField label="Legal last name" />
            <TextField label="DOB" type="date" />
            <TextField label="SSN (encrypted)" placeholder="XXX-XX-XXXX" />
            <TextField label="Email" type="email" />
            <TextField label="Mobile" type="tel" />
          </FormGrid>
        )}
        {step === 1 && (
          <FormGrid>
            <TextField label="Household size" type="number" />
            <TextField label="Estimated annual income" prefix="$" />
            <TextField label="Tax filing status" />
            <TextField label="Spouse name" />
          </FormGrid>
        )}
        {step === 2 && (
          <div className="space-y-3">
            {["Currently pregnant","Tobacco use in last 6 months","Diagnosed chronic condition","Take specialty medication"].map((q) => (
              <label key={q} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>{q}</span>
                <span className="flex gap-2">
                  <span className="rounded-full border border-border px-3 py-1 text-xs">Yes</span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs">No</span>
                </span>
              </label>
            ))}
          </div>
        )}
        {step === 3 && (
          <FormGrid>
            <TextField label="Selected plan" defaultValue="Meridian Gold Advantage PPO" />
            <TextField label="Effective date" type="date" />
            <TextField label="Payment method" defaultValue="Bank draft" />
            <TextField label="Routing / Account (encrypted)" />
          </FormGrid>
        )}
        {step === 4 && (
          <div className="space-y-3 text-sm">
            <p className="text-eyebrow">Ready to submit</p>
            <ul className="space-y-1">
              <li>· Applicant + household captured</li>
              <li>· Signature captured (e-sign)</li>
              <li>· Plan Meridian Gold Advantage PPO — $612/mo</li>
              <li>· First-month payment: authorized</li>
            </ul>
            <StatusBadge tone="sage">Submission ready</StatusBadge>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40">← Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
              Continue
            </button>
          ) : (
            <button className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
              Submit application
            </button>
          )}
        </div>
      </div>
    </InternalShell>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
function TextField({ label, prefix, ...rest }: { label: string; prefix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative mt-1">
        {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{prefix}</span>}
        <input {...rest}
          className={cn("h-10 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring",
            prefix && "pl-6")}
        />
      </div>
    </label>
  );
}
