/**
 * UX-002 — Product Selection & Path Choice
 * Consumers pick a product and choose Plan-AI guided vs Browse Myself.
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Sparkles, Compass, ArrowRight } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

const search = z.object({ product: z.string().optional() });

export const Route = createFileRoute("/select")({
  validateSearch: (input) => search.parse(input),
  head: () => ({
    meta: [
      { title: `Choose your path — ABox` },
      { name: "description", content: SCREENS["UX-002"].purpose },
    ],
  }),
  component: Page,
});

function Page() {
  const { product } = Route.useSearch();
  const navigate = useNavigate();
  const active = SAMPLE_PRODUCTS.find((p) => p.key === product) ?? SAMPLE_PRODUCTS[0];

  return (
    <MarketplaceShell product={active.key}>
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8">
        <PageHeader
          scrId="UX-002"
          eyebrow={`${active.label} · ${active.tagline}`}
          title="How would you like to shop?"
          description="Plan-AI guides you through a short quote and shortlists plans. Or browse everything yourself — you can switch anytime."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate({ to: "/quote", search: { step: 1 } })}
            className="group relative flex flex-col gap-4 rounded-3xl border-2 border-primary/30 bg-card p-6 text-left shadow-[var(--shadow-elevated)] transition-transform hover:-translate-y-0.5"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <div className="text-eyebrow">Recommended</div>
              <h3 className="text-display mt-1 text-2xl">Guide me with Plan-AI</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Answer 6 short questions. Plan-AI narrows the list to plans that fit — with a subsidy check on the way.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm">
                <li>· ZIP, household, priorities</li>
                <li>· Optional doctor + Rx check</li>
                <li>· Subsidy education</li>
              </ul>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Start quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          <Link
            to="/plans"
            className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 text-left transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <Compass className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <div className="text-eyebrow">Self-serve</div>
              <h3 className="text-display mt-1 text-2xl">Let me browse myself</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Jump straight to plans. Add filters, compare, and add to cart — Plan-AI stays available on the side.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm">
                <li>· All available plans</li>
                <li>· On-exchange + off-exchange</li>
                <li>· Filter by carrier, network, deductible</li>
              </ul>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium">
              See all plans <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Plan-AI guidance is educational and non-binding. You can switch between guided and self-serve at any time.
        </p>
      </div>
    </MarketplaceShell>
  );
}
