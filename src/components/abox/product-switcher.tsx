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
}

export function ProductSwitcher({ active, variant = "strip", className }: Props) {
  const items = (
    <ul className="flex snap-x items-center gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
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
                "inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-card text-foreground/80 hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span>{variant === "chips" ? p.short : p.label}</span>
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
