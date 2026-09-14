/**
 * Shopping path bar — keeps PlanAI reachable throughout the consumer
 * shopping journey and lets shoppers move between the guided wizard and
 * self-browse without restarting. Progress itself already persists
 * (quote-store, browse-store, cart-store); this bar only exposes the
 * switch and shows what is carried over.
 */
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { loadQuoteState, type QuoteState } from "@/lib/quote-store";
import { useBrowseState } from "@/lib/browse-store";
import { useCart } from "@/lib/cart-store";
import { planAiStore, useShoppingMode } from "@/lib/shopping-mode";

export function ShoppingPathBar({ current }: { current: "guided" | "browse" }) {
  const { lastStep } = useShoppingMode();
  const browse = useBrowseState();
  const cart = useCart();
  const [quote, setQuote] = useState<QuoteState | null>(null);

  useEffect(() => {
    setQuote(loadQuoteState());
  }, []);

  const activeFilters =
    (browse.exchange !== "all" ? 1 : 0) +
    browse.metals.length +
    browse.networks.length +
    browse.carriers.length +
    (browse.hsaOnly ? 1 : 0) +
    (browse.maxPremium !== 1000 ? 1 : 0);

  const kept: string[] = [];
  if (quote?.zip) kept.push(`ZIP ${quote.zip}`);
  if (quote?.members?.length) kept.push(`${quote.members.length} in household`);
  if (activeFilters > 0) kept.push(`${activeFilters} filter${activeFilters === 1 ? "" : "s"}`);
  if (cart.items.length > 0) kept.push(`${cart.items.length} in cart`);

  return (
    <section
      aria-label="PlanAI and shopping path"
      className="mb-6 rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
          >
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">PlanAI is here the whole way</p>
            <p className="text-sm text-muted-foreground">
              Ask for help or recommendations at any point — and switch between guided and
              self-browse without starting over.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => planAiStore.set(true)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Ask PlanAI
          </button>

          <div
            role="group"
            aria-label="Shopping path"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1"
          >
            <Link
              to="/quote"
              search={{ step: lastStep }}
              aria-current={current === "guided" ? "page" : undefined}
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                current === "guided"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent",
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Guide me
            </Link>
            <Link
              to="/plans"
              aria-current={current === "browse" ? "page" : undefined}
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                current === "browse"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent",
              )}
            >
              <Compass className="h-4 w-4" aria-hidden />
              Browse myself
            </Link>
          </div>
        </div>
      </div>

      {kept.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Kept as you switch: {kept.join(" · ")}
          {current === "browse" && lastStep > 1 ? ` · guided quote at step ${lastStep}` : ""}
        </p>
      )}
    </section>
  );
}
