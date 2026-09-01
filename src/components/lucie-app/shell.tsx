import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  ClipboardList,
  FileSignature,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  type LucideIcon,
  Package,
  RefreshCcw,
  ScrollText,
  ShieldCheck,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PERSONAS, personaById, type Persona } from "@/lib/lucie-app/data";
import { useLucie } from "@/lib/lucie-app/store";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_BY_PERSONA: Record<Persona, NavGroup[]> = {
  consumer: [
    {
      label: "Shop",
      items: [
        { to: "/lucie-app/shop", label: "Marketplace", icon: Store, exact: true },
        { to: "/lucie-app/shop/eligibility", label: "Coverage details", icon: ClipboardList },
        { to: "/lucie-app/shop/plans", label: "Plans", icon: Package },
        { to: "/lucie-app/shop/cart", label: "Cart", icon: ShoppingCart },
      ],
    },
    {
      label: "Apply",
      items: [
        { to: "/lucie-app/shop/application", label: "Application", icon: FileSignature },
        { to: "/lucie-app/shop/status", label: "Submission status", icon: Activity },
      ],
    },
  ],
  agent: [
    {
      label: "Book of business",
      items: [
        { to: "/lucie-app/agency", label: "Overview", icon: LayoutDashboard, exact: true },
        { to: "/lucie-app/agency/producers", label: "Producers", icon: Users },
        { to: "/lucie-app/shop/plans", label: "Quote a shopper", icon: Package },
        { to: "/lucie-app/shop/status", label: "Submissions", icon: Activity },
      ],
    },
  ],
  agency_admin: [
    {
      label: "Agency",
      items: [
        { to: "/lucie-app/agency", label: "Overview", icon: LayoutDashboard, exact: true },
        { to: "/lucie-app/agency/producers", label: "Producers", icon: Users },
        { to: "/lucie-app/agency/marketplaces", label: "Marketplaces", icon: Store },
      ],
    },
    {
      label: "Activity",
      items: [
        { to: "/lucie-app/shop/status", label: "Submissions", icon: Activity },
        { to: "/lucie-app/platform/audit", label: "Activity trail", icon: ScrollText },
      ],
    },
  ],
  employer: [
    {
      label: "Group benefits",
      items: [
        { to: "/lucie-app/employer", label: "Overview", icon: LayoutDashboard, exact: true },
        { to: "/lucie-app/employer/census", label: "Employee census", icon: Users },
        { to: "/lucie-app/employer/contribution", label: "Contribution model", icon: Gauge },
        { to: "/lucie-app/employer/results", label: "Cost results", icon: ListChecks },
        { to: "/lucie-app/employer/proposal", label: "Proposal", icon: FileSignature },
      ],
    },
  ],
  jet_admin: [
    {
      label: "Platform",
      items: [
        { to: "/lucie-app/platform", label: "Operations home", icon: LayoutDashboard, exact: true },
        { to: "/lucie-app/platform/tenants", label: "Tenants", icon: Building2 },
        { to: "/lucie-app/platform/roles", label: "Roles & workspaces", icon: KeyRound },
        { to: "/lucie-app/platform/entitlements", label: "Entitlements", icon: Package },
      ],
    },
    {
      label: "Operate",
      items: [
        { to: "/lucie-app/platform/health", label: "Integration health", icon: Activity },
        { to: "/lucie-app/platform/exceptions", label: "Exception queue", icon: LifeBuoy },
        { to: "/lucie-app/platform/audit", label: "Audit trail", icon: ScrollText },
        { to: "/lucie-app/platform/gates", label: "Launch readiness", icon: ShieldCheck },
      ],
    },
  ],
};

function PersonaSwitcher() {
  const { state, dispatch } = useLucie();
  const active = personaById(state.persona);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2 pl-1.5 pr-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
              {active.initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-xs font-medium">{active.name}</span>
            <span className="block text-[10px] text-muted-foreground">{active.role}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
          View the prototype as
        </DropdownMenuLabel>
        {PERSONAS.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onSelect={() => dispatch({ type: "persona", persona: p.id })}
            className={cn("gap-2", p.id === state.persona && "bg-accent")}
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px]">{p.initials}</AvatarFallback>
            </Avatar>
            <span className="grid">
              <span className="text-xs font-medium">{p.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {p.role} · {p.org}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => dispatch({ type: "reset" })} className="gap-2 text-xs">
          <RefreshCcw className="h-3.5 w-3.5" /> Reset demo data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LucieAppShell({ children }: { children: React.ReactNode }) {
  const { state } = useLucie();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const persona = personaById(state.persona);
  const groups = NAV_BY_PERSONA[state.persona];
  const cartCount = state.cart.length;

  return (
    <InternalShell
      workspace="jet"
      eyebrow="Lucie prototype"
      pageTitle={persona.org}
      actions={
        <>
          <Badge variant="outline" className="text-[10px]">
            Prototype · sample data
          </Badge>
          {state.persona === "consumer" ? (
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/lucie-app/shop/cart">
                <ShoppingCart className="h-4 w-4" />
                <span className="tabular-nums">{cartCount}</span>
              </Link>
            </Button>
          ) : null}
          <PersonaSwitcher />
        </>
      }
    >
      <nav aria-label="Lucie sections" className="mb-6 flex flex-wrap gap-1.5 border-b border-hairline pb-3">
        {groups.flatMap((g) =>
          g.items.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary/30 bg-primary/10 text-foreground"
                    : "border-hairline text-muted-foreground hover:bg-accent",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          }),
        )}
      </nav>

      <div className="grid min-w-0 content-start gap-6">{children}</div>
    </InternalShell>
  );
}

