/**
 * Marketplace Shell — consumer surface with a FLOATING pill navigation
 * at the top-center (glass, rounded-full), and a monolithic dark footer
 * plate. Full-bleed backgrounds are the norm; noise + aurora provide
 * atmosphere.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { LifeBuoy, LogIn, LogOut, User, ArrowUpRight, ChevronDown, Settings } from "lucide-react";
import { AboxMark } from "./logo";
import { PlanOAssistant } from "./plan-o-assistant";
import { ThemeToggle } from "./theme-toggle";
import { DotField } from "./decor";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/lib/auth-session";
import { supabase } from "@/integrations/supabase/client";
import { useMarketplaceState, getActiveBrand } from "@/lib/marketplace-store";
import { useCart, cartTotals } from "@/lib/cart-store";
import { ProductSwitcher } from "./product-switcher";
import { ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  children: React.ReactNode;
  variant?: "landing" | "flow";
  showAssistant?: boolean;
  /** Render the product switcher rail under the nav; value marks the active product. */
  product?: string;
  showProducts?: boolean;
}

export function MarketplaceShell({ children, variant = "flow", showAssistant = true, product, showProducts }: Props) {
  const cart = useCart();
  const cartTotal = cartTotals(cart.items);
  const withProducts = showProducts ?? variant === "flow";
  const { session } = useAuthSession();
  const navigate = useNavigate();
  const mkt = useMarketplaceState();
  const brand = getActiveBrand(mkt);
  const brandName = brand?.display_name ?? "ABox";
  const brandTagline = brand?.tagline_en ?? "Agency in a Box";
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <DotField className="fixed inset-0 -z-10" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Floating pill nav */}
      <header className={cn("sticky top-4 z-30 flex flex-col items-center px-4 md:px-8", variant === "landing" && "top-6")}>
        <div className="glass flex w-full items-center justify-between gap-2 rounded-full pl-3 pr-2 py-2 md:pl-4">
          <Link to="/" className="group flex items-center gap-2.5" aria-label={`${brandName} home`}>
            <AboxMark size={34} tone="primary" />
            <div className="hidden flex-col leading-none md:flex">
              <span className="text-display text-base tracking-tight">{brandName}</span>
              <span className="text-serial mt-0.5">{brandTagline}</span>
            </div>
          </Link>

          <nav aria-label="Marketplace navigation" className="flex items-center gap-1">
            {variant === "landing" && <PillLink to="/select">Shop plans</PillLink>}
            <PillLink to="/ichra">For employers</PillLink>
            <PillLink to="/schedule" icon={<LifeBuoy className="h-4 w-4" />}>Agent help</PillLink>
            <Link
              to="/cart"
              className={cn(
                "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                cartTotal.count > 0
                  ? "border border-primary/40 bg-primary-soft text-primary hover:bg-primary-soft/70"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-label={
                cartTotal.count > 0
                  ? `Cart: ${cartTotal.count} item${cartTotal.count === 1 ? "" : "s"}, $${cartTotal.monthly} per month`
                  : "Cart: empty"
              }
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span>Cart</span>
              {cartTotal.count > 0 && (
                <>
                  <span className="tabular-nums">· {cartTotal.count}</span>
                  <span className="hidden tabular-nums sm:inline">· ${cartTotal.monthly}/mo</span>
                </>
              )}
            </Link>
            <ThemeToggle />
            {session ? (
              <button
                onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03] min-h-10"
                style={{ boxShadow: "var(--shadow-glow)" }}
                title={session.user.email ?? session.user.phone ?? "Signed in"}
              >
                <User className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline max-w-[10ch] truncate">{session.user.email ?? session.user.phone ?? "Account"}</span>
                <LogOut className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : (
              <Link
                to="/auth"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03] min-h-10"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                <LogIn className="h-4 w-4" aria-hidden />
                <span>Sign in</span>
              </Link>
            )}
          </nav>
        </div>
        {withProducts && <ProductSwitcher {...(product ? { active: product } : {})} />}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      {/* Monolithic dark footer plate */}
      <footer className="relative mt-24 overflow-hidden">
        <div className="mx-4 mb-4 overflow-hidden rounded-3xl bg-sidebar text-sidebar-foreground md:mx-8">
          <DotField className="opacity-40" tone="hairline" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-12 md:py-20">
            <div>
              <div className="flex items-center gap-3">
                <AboxMark size={40} tone="sidebar" />
                <div>
                  <p className="text-display text-xl">{brandName}</p>
                  <p className="text-serial">{brandTagline}</p>
                </div>
              </div>
              <p className="mt-6 max-w-xs text-sm text-sidebar-foreground/70">
                Insurance shopping with a guide, not a spreadsheet. Powered by JET.
              </p>
              <Link
                to="/schedule"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                Talk to a licensed agent
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <FooterCol title="Shop" links={[["Individual & family", "/select?product=ifp"], ["Dental & vision", "/select?product=dental"], ["Employer ICHRA", "/ichra"]]} />
            <FooterCol title="Help" links={[["Talk to an agent", "/schedule"], ["FAQ", "/faq"], ["Accessibility", "/accessibility"]]} />
            <FooterCol title="Trust" links={[["Privacy", "/privacy"], ["Terms", "/terms"], ["Compliance", "/compliance"]]} />
          </div>
          <div className="border-t border-sidebar-border">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-sidebar-foreground/60 md:flex-row md:items-center md:justify-between md:px-12">
              <p>
                © {new Date().getFullYear()} JET / ABox. Plan-AI guidance is educational and non-binding.
                Not a substitute for licensed advice. QHP displays follow federal display rules.
              </p>
              <p className="text-serial">v Phase 1 · IA baseline · Module 1 V4</p>
            </div>
          </div>
        </div>
      </footer>

      {showAssistant && <PlanOAssistant surface="marketplace" />}
    </div>
  );
}

function PillLink({ to, children, icon }: { to: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
    >
      {icon}
      {children}
    </Link>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <p className="text-eyebrow mb-5 text-sidebar-foreground/60">{title}</p>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="relative inline-block text-sidebar-foreground/85 transition-colors hover:text-primary ember-underline"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
