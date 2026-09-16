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
import { useShoppingMode } from "@/lib/shopping-mode";

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
      aria-label="Shopping mode"
      className="mb-4 rounded-xl border border-border bg-card p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2 md:gap-3">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Shopping mode
          </span>

          <div
            role="group"
            aria-label="Choose shopping mode"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface p-0.5"
          >
            <Link
              to="/quote"
              search={{ step: lastStep }}
              aria-current={current === "guided" ? "page" : undefined}
              className={cn(
                "inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                current === "guided"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Guide me
            </Link>
            <Link
              to="/plans"
              aria-current={current === "browse" ? "page" : undefined}
              className={cn(
                "inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                current === "browse"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent",
              )}
            >
              <Compass className="h-3.5 w-3.5" aria-hidden />
              Browse myself
            </Link>
          </div>
        </div>

      </div>

      {kept.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Carried over: {kept.join(" · ")}
          {current === "browse" && lastStep > 1 ? ` · guided quote at step ${lastStep}` : ""}
        </p>
      )}
    </section>
  );
}
