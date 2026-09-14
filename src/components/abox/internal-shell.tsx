/**
 * Internal Shell — "Console" layout.
 * Floating, DETACHED left rail as an orbital glass column (icon dots
 * that expand into a flyout panel on hover). Thin top bar with a
 * pill-shaped workspace switcher on the left, floating search in the
 * center, action orbs on the right. The content area is a rounded
 * canvas plate with an aurora backdrop and a numeric route badge.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Search, Bell, CheckSquare, Menu, ChevronsUpDown, Check,
  Building2, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { AboxMark } from "./logo";
import { PlanOAssistant } from "./plan-o-assistant";
import { ThemeToggle } from "./theme-toggle";
import { DotField, Aurora } from "./decor";
import { FadeRise } from "./motion";
import { WORKSPACES, type WorkspaceKey } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SAMPLE_NOTIFICATIONS } from "@/lib/sample-data";

interface Props {
  children: React.ReactNode;
  workspace?: WorkspaceKey;
  entity?: string;
  pageTitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

export function InternalShell({
  children, workspace = "agent", entity = "Cedar Grove Insurance",
  pageTitle, eyebrow, actions,
}: Props) {
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [activeEntity, setActiveEntity] = useState(entity);
  const current = WORKSPACES.find((w) => w.key === workspace) ?? WORKSPACES[0];

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      {/* Global backdrop noise */}
      <DotField className="fixed inset-0 -z-10" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>

      {/* Floating detached rail — only at lg+ where there's room */}
      <FloatingRail
        workspaceKey={workspace}
        current={current}
        collapsed={railCollapsed}
        onToggle={() => setRailCollapsed((v) => !v)}
      />

      <div className={cn("pl-0", railCollapsed ? "lg:pl-[104px]" : "lg:pl-[292px]")}>
        {/* Thin top bar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-3 py-3 sm:px-4 lg:px-8"
          role="banner"
        >
          <div className="glass mx-auto flex w-full max-w-[1500px] min-w-0 items-center gap-2 rounded-full px-2 py-2 sm:gap-3 sm:px-3">

            {/* mobile / tablet menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-accent lg:hidden" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-sidebar p-0 text-sidebar-foreground">
                <div className="flex items-center gap-3 px-5 py-5">
                  <AboxMark size={32} tone="sidebar" />
                  <span className="text-display text-lg">ABox</span>
                </div>
                <MobileNav workspaceKey={workspace} />
              </SheetContent>
            </Sheet>

            <WorkspacePill current={current} entity={activeEntity} onEntityChange={setActiveEntity} />

            <div className="ml-2 hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground lg:flex" style={{ background: "color-mix(in oklab, var(--surface) 60%, transparent)" }}>
              <Search className="h-4 w-4 shrink-0" aria-hidden />
              <input
                className="min-w-0 w-full bg-transparent outline-none placeholder:text-muted-foreground/70"
                placeholder="Search leads, quotes, plans, help…"
                aria-label="Global search"
              />
              <kbd className="hidden xl:inline rounded border border-hairline px-1.5 py-0.5 text-[10px] text-muted-foreground/70">⌘K</kbd>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
              <OrbButton label="Tasks" href="/app/tasks"><CheckSquare className="h-5 w-5" /><Dot /></OrbButton>
              <NotificationsButton />
              <ThemeToggle />
              <UserPill />
            </div>
          </div>
        </header>

        {/* Canvas + page header */}
        <div className="px-4 pb-10 md:px-8 md:pb-16">
          <div className="relative mx-auto max-w-[1500px]">
            {(pageTitle || eyebrow) && (
              <section className="relative overflow-hidden rounded-3xl border border-hairline bg-card">
                <Aurora className="opacity-70" />
                <FadeRise className="relative px-6 pb-10 pt-6 md:px-12 md:pb-12 md:pt-8">
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="min-w-0 max-w-3xl">
                      {eyebrow && <p className="mb-3 text-eyebrow">{eyebrow}</p>}
                      {pageTitle && (
                        <h1 className="text-display text-4xl md:text-6xl leading-[0.98]">
                          {pageTitle}
                        </h1>
                      )}
                    </div>
                    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
                  </div>
                </FadeRise>
              </section>
            )}

            <div className="mt-4 flex min-h-0 gap-6">
              <main id="main" className="min-w-0 flex-1">
                <FadeRise delay={0.06}>{children}</FadeRise>
              </main>
            </div>
          </div>
        </div>
      </div>

      <PlanOAssistant surface="internal" />
    </div>
  );
}

/* ------------------------ Floating rail ------------------------ */

function FloatingRail({
  workspaceKey, current, collapsed, onToggle,
}: {
  workspaceKey: WorkspaceKey;
  current: (typeof WORKSPACES)[number];
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const w = WORKSPACES.find((x) => x.key === workspaceKey) ?? WORKSPACES[0];
  return (
    <aside
      aria-label={`${current.name} navigation`}
      className={cn(
        "fixed left-4 top-4 bottom-4 z-30 hidden flex-col gap-2 rounded-3xl glass py-4 lg:flex transition-[width] duration-200",
        collapsed ? "w-[80px] items-center px-2" : "w-[268px] px-3",
      )}
      style={{ boxShadow: "var(--shadow-plate)" }}
    >
      <div className={cn("flex items-center gap-2.5", collapsed ? "flex-col" : "px-1")}>
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="ABox home">
          <AboxMark size={collapsed ? 44 : 36} tone="primary" />
          {!collapsed && (
            <span className="min-w-0">
              <span className="block text-display text-lg leading-none">ABox</span>
              <span className="block truncate text-xs text-muted-foreground">{current.name}</span>
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground",
            !collapsed && "ml-auto",
          )}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <div className={cn("my-1 h-px bg-hairline", collapsed ? "w-8 self-center" : "w-full")} aria-hidden />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {w.sections.map((section) => (
          <div key={section.label} className={cn(collapsed ? "mb-2" : "mb-4")}>
            {collapsed ? (
              <div className="mx-auto mb-1.5 h-px w-5 bg-hairline" aria-hidden />
            ) : (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {section.label}
              </p>
            )}
            <ul className={cn("flex flex-col gap-1", collapsed ? "items-center" : "")}>
              {section.items.map((item) => {
                const active = isNavActive(pathname, item.to, w.sections.flatMap((s) => s.items.map((i) => i.to)));
                const Icon = item.icon;
                return (
                  <li key={item.to} className="group/rail relative w-full">
                    <Link
                      to={item.to}
                      className={cn(
                        "relative flex items-center rounded-xl text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground",
                        collapsed ? "mx-auto h-11 w-11 justify-center" : "gap-3 px-2.5 py-2",
                        active && "text-primary-foreground hover:text-primary-foreground",
                      )}
                      style={active ? { background: "var(--primary)", boxShadow: "var(--shadow-glow)" } : undefined}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                    {collapsed && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-full top-1/2 ml-3 z-40 -translate-y-1/2 whitespace-nowrap rounded-full glass px-3 py-1.5 text-xs font-medium opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100"
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn("mt-2 h-px bg-hairline", collapsed ? "w-8 self-center" : "w-full")} aria-hidden />
      <WorkspaceSwitcherOrb current={current} collapsed={collapsed} />
    </aside>
  );
}


function WorkspaceSwitcherOrb({ current, collapsed }: { current: (typeof WORKSPACES)[number]; collapsed?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center rounded-xl border border-hairline text-foreground/80 hover:text-foreground hover:border-primary/40",
            collapsed ? "mx-auto h-11 w-11 justify-center" : "w-full gap-2.5 px-2.5 py-2 text-left",
          )}
          aria-label={`Workspace: ${current.name}. Switch workspace`}
          title={current.name}
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{current.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{current.tagline}</span>
              </span>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" className="w-64">
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WORKSPACES.map((w) => (
          <DropdownMenuItem key={w.key} asChild>
            <Link
              to={w.key === "agent" ? "/app/my-work" : w.key === "jet" ? "/app/jet/products" : w.key === "agency" ? "/app/agency" : w.key === "employer" ? "/app/employer/ichra" : "/app/partner"}
              className="flex flex-col items-start"
            >
              <span className="font-medium">{w.name}</span>
              <span className="text-xs text-muted-foreground">{w.tagline}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function isNavActive(pathname: string, to: string, allPaths: string[]) {
  if (pathname === to) return true;
  if (!pathname.startsWith(to.endsWith("/") ? to : to + "/")) return false;
  // a more specific nav item owns this path
  return !allPaths.some(
    (p) => p !== to && p.length > to.length && (pathname === p || pathname.startsWith(p + "/")),
  );
}

function MobileNav({ workspaceKey }: { workspaceKey: WorkspaceKey }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const w = WORKSPACES.find((x) => x.key === workspaceKey) ?? WORKSPACES[0];
  return (
    <nav className="p-3">
      {w.sections.map((section) => (
        <div key={section.label} className="mb-4">
          <p className="mb-1 flex items-center gap-2 px-2 pt-2 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
            <span className="h-px w-4 bg-sidebar-foreground/30" aria-hidden />
            <span>{section.label}</span>
          </p>

          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isNavActive(pathname, item.to, w.sections.flatMap((s) => s.items.map((i) => i.to)));
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/* ------------------------ Top bar bits ------------------------ */

const ENTITIES = [
  { name: "Cedar Grove Insurance", meta: "Agency · 12 producers" },
  { name: "Northwind Health Group", meta: "Sub-agency · 5 producers" },
  { name: "Union Coast Marketplace", meta: "Partner · 3 producers" },
];

function WorkspacePill({
  current, entity, onEntityChange,
}: {
  current: (typeof WORKSPACES)[number];
  entity: string;
  onEntityChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-10 min-w-0 items-center gap-2 rounded-full px-2 text-sm font-medium hover:bg-accent data-[state=open]:bg-accent sm:px-3"
          aria-label={`Switch entity. Current: ${current.name}, ${entity}`}
        >
          <span className="text-eyebrow hidden xl:inline">{current.name}</span>
          <span className="hidden h-4 w-px bg-hairline xl:block" aria-hidden />
          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="hidden max-w-[100px] truncate sm:inline md:max-w-[150px] xl:max-w-[180px]">{entity}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Entities you can access</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ENTITIES.map((e) => {
          const active = e.name === entity;
          return (
            <DropdownMenuItem
              key={e.name}
              onSelect={() => onEntityChange(e.name)}
              className="flex items-start gap-2"
            >
              <Check className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "opacity-100 text-primary" : "opacity-0")} aria-hidden />
              <span className="min-w-0">
                <span className="block truncate font-medium">{e.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{e.meta}</span>
              </span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-muted-foreground">Manage entity access…</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function OrbButton({ children, label, href, onClick }: { children: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const cls = "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:text-primary hover:bg-accent transition-all";
  if (href) return <Link to={href} className={cls} aria-label={label}>{children}</Link>;
  return <button className={cls} aria-label={label} onClick={onClick}>{children}</button>;
}

function Dot() {
  return <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" aria-hidden />;
}

function NotificationsButton() {
  const unread = SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:text-primary hover:bg-accent"
          aria-label={`Notifications (${unread} unread)`}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && <Dot />}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="border-b border-hairline px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">{unread} unread</p>
        </div>
        <ul className="max-h-96 divide-y divide-hairline overflow-y-auto">
          {SAMPLE_NOTIFICATIONS.map((n) => (
            <li key={n.id} className={cn("px-4 py-3 text-sm", n.unread && "bg-primary-soft/30")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-muted-foreground line-clamp-2">{n.body}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{n.ago}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-hairline px-4 py-2 text-right">
          <Link to="/app/tasks" className="text-xs text-primary hover:underline">View all</Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UserPill() {
  const navigate = useNavigate();
  const [label, setLabel] = useState("Account");
  const [initials, setInitials] = useState("··");

  useEffect(() => {
    let active = true;
    void import("@/integrations/supabase/client").then(async ({ supabase }) => {
      const { data } = await supabase.auth.getUser();
      if (!active || !data.user) return;
      const meta = data.user.user_metadata as { full_name?: string } | null;
      const name = meta?.full_name?.trim() || data.user.email || "Account";
      setLabel(name);
      setInitials(
        name
          .replace(/@.*$/, "")
          .split(/[\s._-]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]!.toUpperCase())
          .join("") || "AB",
      );
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-full px-1 hover:bg-accent lg:pr-3 text-sm font-medium"
          aria-label="Account menu"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
          >
            {initials}
          </span>
          <span className="hidden max-w-[140px] truncate lg:inline">{label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">Signed in as {label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate({ to: "/app/agent-profile" })}>Profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate({ to: "/app/jet/notifications" })}>
          Notification settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void import("@/lib/auth-gate").then(({ signOutAndLeave }) => signOutAndLeave());
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
