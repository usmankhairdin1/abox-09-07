import { Link } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";

import { Badge, Btn, Card, Disclosure } from "@/components/hf/ui";
import { BRANDS } from "@/lib/hf";
import { cn } from "@/lib/utils";

/**
 * Externally branded consumer chrome. The brand switcher proves the white-label
 * token layer: only --primary, --ring, accent surface and --radius change; every
 * required disclosure, layout rule and contrast floor is platform-locked.
 */
export function HfConsumerShell({
  children,
  variant = "marketplace",
  helpTopics,
  progress,
}: {
  children: ReactNode;
  variant?: "marketplace" | "shared-link" | "focused";
  helpTopics?: string[];
  progress?: ReactNode;
}) {
  const [brandId, setBrandId] = useState(BRANDS[0]!.id);
  const [helpOpen, setHelpOpen] = useState(false);
  const brand = BRANDS.find((b) => b.id === brandId)!;

  const style = {
    "--primary": brand.primary,
    "--primary-foreground": brand.primaryForeground,
    "--ring": brand.ring,
    "--radius": brand.radius,
  } as CSSProperties;

  const topics = helpTopics ?? [
    "Is this the official government exchange?",
    "Who is the licensed agency behind this site?",
    "How is my information used?",
    "Can I talk to a person?",
  ];

  return (
    <div style={style} className="min-h-svh bg-background text-foreground">
      {/* wireframe-only control, not part of the consumer design */}
      <div className="flex flex-wrap items-center gap-2 bg-surface-3 px-4 py-1.5 text-[11px] text-muted-foreground">
        <span className="font-medium">White-label preview</span>
        {BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setBrandId(b.id)}
            className={cn(
              "rounded-full border px-2 py-0.5",
              b.id === brandId
                ? "border-foreground/40 bg-card font-medium text-foreground"
                : "border-hairline",
            )}
          >
            {b.name}
          </button>
        ))}
        <Link to="/hf" className="ml-auto underline underline-offset-2 hover:text-foreground">
          Batch 1 index
        </Link>
      </div>

      <header className="border-b border-hairline bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius)] bg-primary font-display text-xs font-bold text-primary-foreground">
              {brand.mark}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold tracking-tight">
                {brand.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {variant === "shared-link" ? "Quote prepared by your agent" : brand.marketplace}
              </p>
            </div>
          </div>

          {variant === "marketplace" ? (
            <nav className="ml-auto hidden items-center gap-1 md:flex">
              {["How it works", "Products", "Help"].map((n) => (
                <span
                  key={n}
                  className="rounded-[var(--radius)] px-2.5 py-1.5 text-[13px] text-foreground/75"
                >
                  {n}
                </span>
              ))}
              <Btn variant="ghost" size="sm">
                Sign in
              </Btn>
              <Btn size="sm">Get started</Btn>
            </nav>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              {variant === "focused" ? (
                <Btn variant="ghost" size="sm">
                  Save &amp; finish later
                </Btn>
              ) : null}
              <Badge>1-800-555-0142</Badge>
            </div>
          )}
        </div>
        {progress ? (
          <div className="border-t border-hairline bg-surface-2">
            <div className="mx-auto max-w-6xl px-4 py-2.5">{progress}</div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">{children}</main>

      <footer className="border-t border-hairline bg-surface-2">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
          <div className="grid gap-5 md:grid-cols-4">
            <div>
              <p className="font-display text-xs font-semibold">{brand.name}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                Licensed insurance agency. NPN 8842119. Licensed in 34 states; license numbers
                available on request.
              </p>
            </div>
            {[
              ["Shopping", ["Health plans", "Dental", "Guided help", "Talk to an agent"]],
              [
                "Legal",
                ["Privacy notice", "Terms of use", "Non-discrimination", "Language access"],
              ],
              ["Support", ["Contact us", "Help center", "Accessibility", "Report an issue"]],
            ].map(([h, items]) => (
              <div key={h as string}>
                <p className="font-display text-xs font-semibold">{h as string}</p>
                <ul className="mt-1.5 space-y-1">
                  {(items as string[]).map((i) => (
                    <li key={i} className="text-[11px] text-muted-foreground">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Disclosure>
            This site is operated by a licensed insurance agency and is not HealthCare.gov, a state
            exchange, or a government website. Plan availability, pricing and eligibility depend on
            information you provide and are subject to carrier and exchange confirmation. Premium
            amounts shown that reflect advance premium tax credits are estimates.
          </Disclosure>
          <p className="text-[11px] text-muted-foreground">
            Required disclosure blocks are platform-locked: a tenant can restyle this footer but
            cannot remove them.
          </p>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {helpOpen ? (
          <Card className="w-[20rem] overflow-hidden shadow-[var(--shadow-overlay)]">
            <div className="flex items-center gap-2 border-b border-hairline px-3 py-2.5">
              <span className="font-display text-xs font-semibold">How can we help?</span>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                aria-label="Close help"
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="space-y-2 p-3">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="w-full rounded-[var(--radius)] border border-hairline px-2.5 py-2 text-left text-xs hover:bg-accent"
                >
                  {t}
                </button>
              ))}
              <div className="flex h-9 items-center rounded-[var(--radius)] border border-input px-2.5 text-xs text-muted-foreground">
                Type your question…
              </div>
              <Btn variant="outline" size="sm" full>
                Talk to a licensed agent
              </Btn>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                This assistant can explain how things work. It cannot recommend a specific plan,
                decide eligibility or guarantee costs — those go to a licensed agent.
              </p>
            </div>
          </Card>
        ) : null}
        <Btn onClick={() => setHelpOpen((v) => !v)} className="shadow-elevated">
          <MessageCircle className="size-4" />
          Need help?
        </Btn>
      </div>
    </div>
  );
}
