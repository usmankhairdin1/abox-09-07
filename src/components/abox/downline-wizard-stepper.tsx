/**
 * FLOW-M05-001 — Create one direct downline. Shared stepper nav across
 * the 8 distinct step routes (SCR-M05-007..014). Each step is its own
 * route (per spec), not a ?step= query param — mirrors the pattern but
 * keeps stable per-screen IDs, as the M05 UX spec requires.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  n: number;
  scr: string;
  label: string;
  to: string;
}

export const DOWNLINE_WIZARD_STEPS: WizardStep[] = [
  { n: 1, scr: "SCR-M05-007", label: "Identity", to: "/agency/downlines/new/identity" },
  { n: 2, scr: "SCR-M05-008", label: "Legal & identifiers", to: "/agency/downlines/new/legal" },
  { n: 3, scr: "SCR-M05-009", label: "Contacts", to: "/agency/downlines/new/contacts" },
  { n: 4, scr: "SCR-M05-010", label: "Addresses & offices", to: "/agency/downlines/new/locations" },
  { n: 5, scr: "SCR-M05-011", label: "Settings", to: "/agency/downlines/new/settings" },
  { n: 6, scr: "SCR-M05-012", label: "Initial administrator", to: "/agency/downlines/new/administrator" },
  { n: 7, scr: "SCR-M05-013", label: "Readiness review", to: "/agency/downlines/new/readiness" },
  { n: 8, scr: "SCR-M05-014", label: "Activation", to: "/agency/downlines/new/activate" },
];

export function DownlineWizardStepper() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentIndex = DOWNLINE_WIZARD_STEPS.findIndex((s) => s.to === pathname);

  return (
    <nav aria-label="Create downline agency progress">
      <ol className="flex flex-wrap items-center gap-1.5">
        {DOWNLINE_WIZARD_STEPS.map((s, i) => {
          const isCurrent = i === currentIndex;
          const isDone = currentIndex >= 0 && i < currentIndex;
          const isReachable = currentIndex >= 0 && i <= currentIndex;
          return (
            <li key={s.to}>
              {isReachable ? (
                <Link
                  to={s.to}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    isCurrent ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" aria-hidden /> : <span className="tabular-nums">{s.n}</span>}
                  {s.label}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground/50">
                  <span className="tabular-nums">{s.n}</span> {s.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
