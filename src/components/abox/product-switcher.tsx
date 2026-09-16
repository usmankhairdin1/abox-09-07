/**
 * ProductSwitcher — the available products, shown consistently across the
 * shopping flow so a shopper can switch product from any screen. Purely a
 * navigation surface; it reuses the existing product routes.
 */
import { Link } from "@tanstack/react-router";
import { SHOP_PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

interface Props {
  /** Currently active product key, if the screen knows one. */
  active?: string;
  /** "strip" = full-width flow rail, "chips" = inline hero row. */
  variant?: "strip" | "chips";
  className?: string;
  /** Per-product short-label overrides; used only for the chips variant. */
  labelOverrides?: Record<string, string>;
}

export function ProductSwitcher({ active, variant = "strip", className }: Props) {
  const isChips = variant === "chips";
  const items = (
    <ul className={cn(
      "flex snap-x items-center overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0",
      isChips ? "gap-2 md:gap-3" : "gap-1.5",
    )}>
      {SHOP_PRODUCTS.map((p) => {
        const Icon = p.icon;
        const isActive = active === p.key;
        const to = p.key === "ichra" ? "/ichra" : "/select";
        return (
          <li key={p.key} className="snap-start">
            <Link
              to={to}
              {...(p.key === "ichra" ? {} : { search: { product: p.key } })}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center whitespace-nowrap rounded-full border transition-all",
                isChips
                  ? "min-h-12 md:min-h-14 gap-2 md:gap-2.5 px-5 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-semibold hover:-translate-y-0.5"
                  : "min-h-9 gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary-soft text-primary shadow-card"
                  : isChips
                    ? "border-border-strong bg-card text-foreground/90 shadow-card hover:border-primary/50 hover:bg-primary/[0.04] hover:text-foreground"
                    : "border-border bg-card text-foreground/80 hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className={cn(isChips ? "h-5 w-5 md:h-6 md:w-6" : "h-4 w-4")} aria-hidden />
              <span>{isChips ? p.short : p.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );


  if (variant === "chips") {
    return (
      <nav aria-label="Available products" className={className}>
        {items}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Available products"
      className={cn("mx-auto mt-3 w-full max-w-7xl px-4 md:px-8", className)}
    >
      <div className="glass flex items-center gap-3 rounded-2xl px-3 py-2">
        <span className="text-eyebrow hidden shrink-0 lg:inline">Shop</span>
        {items}
      </div>
    </nav>
  );
}
