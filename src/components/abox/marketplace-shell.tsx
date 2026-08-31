/**
 * Marketplace Shell — consumer surface with a FLOATING pill navigation
 * at the top-center (glass, rounded-full), and a monolithic dark footer
 * plate. Full-bleed backgrounds are the norm; noise + aurora provide
 * atmosphere.
 */
import { Link } from "@tanstack/react-router";
import { LifeBuoy, LogIn, ArrowUpRight } from "lucide-react";
import { AboxMark } from "./logo";
import { PlanAiAssistant } from "./planai-assistant";
import { ThemeToggle } from "./theme-toggle";
import { DotField } from "./decor";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  variant?: "landing" | "flow";
  showAssistant?: boolean;
}

export function MarketplaceShell({ children, variant = "flow", showAssistant = true }: Props) {
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
      <header className={cn("sticky top-4 z-30 flex justify-center px-4", variant === "landing" && "top-6")}>
        <div className="glass flex w-full max-w-6xl items-center justify-between gap-2 rounded-full pl-3 pr-2 py-2 md:pl-4">
          <Link to="/" className="group flex items-center gap-2.5" aria-label="ABox home">
            <AboxMark size={34} tone="primary" />
            <div className="hidden flex-col leading-none md:flex">
              <span className="text-display text-base tracking-tight">ABox</span>
              <span className="text-serial mt-0.5">Agency in a Box</span>
            </div>
          </Link>

          <nav aria-label="Marketplace navigation" className="flex items-center gap-1">
            <PillLink to="/select">Shop plans</PillLink>
            <PillLink to="/ichra">For employers</PillLink>
            <PillLink to="/schedule" icon={<LifeBuoy className="h-4 w-4" />}>Agent help</PillLink>
            <ThemeToggle />
            <Link
              to="/auth"
              className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03] min-h-10"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <LogIn className="h-4 w-4" aria-hidden />
              <span>Sign in</span>
            </Link>
          </nav>
        </div>
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
                  <p className="text-display text-xl">ABox</p>
                  <p className="text-serial">A marketplace of marketplaces</p>
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
                © {new Date().getFullYear()} JET / ABox. Plan-O guidance is educational and non-binding.
                Not a substitute for licensed advice. QHP displays follow federal display rules.
              </p>
              <p className="text-serial">v Phase 1 · IA baseline · Module 1 V4</p>
            </div>
          </div>
        </div>
      </footer>

      {showAssistant && <PlanAiAssistant context="your coverage shopping" />}
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
      <p className="text-eyebrow mb-5" style={{ color: "oklch(0.72 0.02 90)" }}>{title}</p>
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
