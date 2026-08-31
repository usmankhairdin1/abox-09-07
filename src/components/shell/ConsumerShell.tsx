import { useState, type ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { useShell } from "@/components/shell/AppShell";
import { Annotation, IdChip } from "@/components/wireframe/primitives";
import { cn } from "@/lib/utils";

/**
 * External, agency-branded consumer chrome (IA: WS_CONSUMER_MARKETPLACE and
 * WS_MEMBER are externally branded and simplified — no left module nav, no
 * workspace/entity switcher, no internal right drawer).
 */
export function ConsumerShell({
  children,
  variant = "marketplace",
  assistantContext = "this page",
  faqs,
}: {
  children: ReactNode;
  variant?: "marketplace" | "member" | "shared-link";
  assistantContext?: string;
  faqs?: string[];
}) {
  const { labels } = useShell();
  const [helpOpen, setHelpOpen] = useState(false);

  const nav =
    variant === "member"
      ? ["My coverage", "My quotes", "Documents", "My agent"]
      : variant === "shared-link"
        ? []
        : ["How it works", "Products", "Help"];

  const questions = faqs ?? [
    "Is this the official government exchange?",
    "Who is the agency behind this site?",
    "How is my information used?",
    "Can I talk to a person?",
  ];

  return (
    <div className="min-h-svh bg-background">
      {/* Branded header — configurable per agency in UX-024 */}
      <header className="border-b border-hairline bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-dashed border-hairline bg-muted/50 font-mono text-[10px] uppercase text-muted-foreground"
              aria-hidden="true"
            >
              logo
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                {variant === "member" ? "Member portal" : "Agency marketplace"}
              </p>
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {variant === "shared-link"
                  ? "prepared by your agent"
                  : `${labels.workspace.toLowerCase()} · externally branded`}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {nav.map((n) => (
              <span
                key={n}
                className="hidden rounded-lg px-2 py-1 text-xs text-muted-foreground sm:inline-block"
              >
                {n}
              </span>
            ))}
            <span className="rounded-lg border border-hairline px-2.5 py-1 text-xs">
              {variant === "member" ? "Account" : "Sign in"}
            </span>
            <IdChip tone="prov">
              {variant === "member" ? "SHELL_MEMBER_CHROME" : "SHELL_CONSUMER_CHROME"}
            </IdChip>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-5 pb-24">{children}</main>

      {/* Trust & compliance footer — required content, not decorative */}
      <footer className="border-t border-hairline bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              "Licensed entity & license numbers",
              "Not a government website / not HealthCare.gov",
              "Privacy notice & data use",
              "Non-discrimination & language access",
            ].map((f) => (
              <div key={f} className="rounded-lg border border-dashed border-hairline bg-card/60 p-3">
                <p className="text-xs text-foreground/80">{f}</p>
              </div>
            ))}
          </div>
          <Annotation className="mt-3">
            Footer disclosure text is agency-configured in UX-024 but the required blocks cannot be
            removed — platform guardrail.
          </Annotation>
        </div>
      </footer>

      {/* Bottom-right consumer help bubble */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {helpOpen ? (
          <div className="w-[320px] rounded-lg border border-hairline bg-card p-3 shadow-elevated">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold">Help</span>
              <IdChip tone="prov">SHELL_CONSUMER_HELP</IdChip>
            </div>
            <ul className="mt-2 space-y-1.5">
              {questions.map((q) => (
                <li key={q} className="rounded-lg border border-hairline px-2 py-1.5 text-[11px]">
                  {q}
                </li>
              ))}
            </ul>
            <div className="mt-2 rounded-lg border border-dashed border-hairline px-2 py-2 text-[11px] text-muted-foreground">
              Ask a question about {assistantContext}…
            </div>
            <Annotation className="mt-2">
              Consumer voice only. Cannot give plan advice, eligibility determinations or cost
              guarantees ({"UX-026"} guardrails apply to any generated answer).
            </Annotation>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setHelpOpen((v) => !v)}
          className={cn(
            "rounded-full border border-hairline bg-card px-3 py-2 text-xs font-medium shadow-elevated hover:bg-accent",
          )}
        >
          {helpOpen ? "Close help" : "Need help?"}
        </button>
      </div>

      <div className="fixed bottom-4 left-4 z-40">
        <Link
          to="/m1"
          className="rounded-full border border-hairline bg-card px-3 py-2 text-xs font-medium shadow-elevated hover:bg-accent"
        >
          ← Module 1 index
        </Link>
      </div>
    </div>
  );
}
