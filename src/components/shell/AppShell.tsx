import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  Coins,
  FileText,
  LayoutGrid,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { DotField } from "@/components/abox/decor";
import { AboxMark } from "@/components/abox/logo";
import { PlanAiAssistant } from "@/components/abox/planai-assistant";
import { ThemeToggle } from "@/components/abox/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ENTITIES,
  MODULE_BY_ID,
  ROLES,
  WORKSPACES,
  type DrawerTab,
  type LabelKey,
  type ModuleDef,
} from "@/lib/abox";
import { cn } from "@/lib/utils";
import { ShellProvider, useShell, type ShellState } from "@/components/shell/shell-context";

export { ShellProvider, useShell };
export type { ShellState };

const MODULE_ICONS: Record<string, LucideIcon> = {
  MOD_MY_WORK: CheckSquare,
  MOD_REPORTING: BarChart3,
  MOD_LEADS_CUSTOMERS: Users,
  MOD_MARKETPLACE_SALES: ShoppingBag,
  MOD_FORMS_ENROLLMENT: ClipboardList,
  MOD_PRODUCTS_PLANS: Package,
  MOD_AGENCY_ENTITY: Building2,
  MOD_APPOINTMENTS_PAPER: Calendar,
  MOD_COMMISSIONS: Coins,
  MOD_COMMUNICATIONS: Bell,
  MOD_OUTPUTS_DOCS: FileText,
  MOD_AI: Bot,
  MOD_ADMIN_CONFIG: Settings,
  MOD_SECURITY: ShieldCheck,
};

function useVisibleModules() {
  const { workspaceId, roleId } = useShell();
  const ws = WORKSPACES.find((item) => item.id === workspaceId) ?? WORKSPACES[1] ?? WORKSPACES[0];
  const role = ROLES.find((item) => item.id === roleId) ?? ROLES[1] ?? ROLES[0];
  if (!ws || !role) throw new Error("ABox shell configuration is incomplete");

  const modules = ws.modules
    .filter((id) => id !== "MOD_COMMISSIONS" || role.commissions)
    .filter((id) => id !== "MOD_ADMIN_CONFIG" || role.id !== "ROLE_AGENT")
    .map((id) => MODULE_BY_ID[id])
    .filter((item): item is ModuleDef => Boolean(item));
  return { ws, role, modules };
}

function moduleLabel(id: string, fallback: string, labels: Record<LabelKey, string>) {
  if (id === "MOD_LEADS_CUSTOMERS") return `${labels.member}s & ${labels.lead}s`;
  if (id === "MOD_AGENCY_ENTITY") return `${labels.agency} & Entity Management`;
  if (id === "MOD_MARKETPLACE_SALES") return `${labels.marketplace} & Sales`;
  return fallback;
}

export function AppShell({
  children,
  drawerTitle = "Workspace context",
  drawerBody,
  assistantContext = "this page",
}: {
  children: ReactNode;
  drawerTitle?: string;
  drawerBody?: Partial<Record<DrawerTab, ReactNode>>;
  assistantContext?: string;
}) {
  const { ws, role, modules } = useVisibleModules();
  const shell = useShell();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const entity = ENTITIES.find((item) => item.id === shell.entityId) ?? ENTITIES[0];
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("Context");
  if (!entity) throw new Error("ABox entity configuration is incomplete");

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <DotField className="fixed inset-0 -z-10 opacity-35" />
      <a href="#main" className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>

      <FloatingRail
        modules={modules}
        pathname={pathname}
        collapsed={railCollapsed}
        onToggle={() => setRailCollapsed((value) => !value)}
        labels={shell.labels}
        workspaceName={ws.name}
      />

      <div className={cn("min-h-dvh transition-[padding] duration-300", railCollapsed ? "lg:pl-[104px]" : "lg:pl-[292px]") }>
        <header className="sticky top-0 z-40 px-3 py-3 sm:px-4 lg:px-8">
          <div className="glass mx-auto flex w-full max-w-[1560px] items-center gap-2 rounded-full px-2 py-2 shadow-card sm:gap-3 sm:px-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label="Open navigation">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[310px] bg-sidebar p-0 text-sidebar-foreground">
                <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
                  <AboxMark size={36} tone="sidebar" />
                  <div>
                    <span className="text-display block text-lg">ABox</span>
                    <span className="block text-xs text-sidebar-foreground/60">{ws.name}</span>
                  </div>
                </div>
                <MobileNavigation modules={modules} pathname={pathname} labels={shell.labels} />
              </SheetContent>
            </Sheet>

            <WorkspaceEntityMenu />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="ml-1 hidden min-w-0 max-w-xl flex-1 justify-start rounded-full bg-surface/70 px-4 text-muted-foreground md:flex">
                  <Search />
                  <span className="truncate">Search people, quotes, plans, help…</span>
                  <kbd className="ml-auto hidden rounded border border-hairline px-1.5 py-0.5 text-[10px] xl:inline">⌘K</kbd>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-[min(560px,calc(100vw-2rem))] rounded-2xl p-3">
                <label className="flex items-center gap-3 rounded-xl border border-input bg-background px-3">
                  <Search className="size-4 text-muted-foreground" />
                  <input autoFocus className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search across your workspace" />
                </label>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {["Members & households", "Quotes & applications", "Agencies & producers", "Products & plans"].map((group) => (
                    <div key={group} className="rounded-xl border border-hairline p-3">
                      <p className="text-xs font-medium">{group}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Search within your permitted entity scope</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="ml-auto flex shrink-0 items-center gap-0.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Tasks">
                    <CheckSquare />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-card" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 rounded-2xl p-0">
                  <TrayHeader title="Priority tasks" detail="11 open" />
                  <ActivityRows type="tasks" />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
                    <Bell />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-card" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 rounded-2xl p-0">
                  <TrayHeader title="Notifications" detail="6 unread" />
                  <ActivityRows type="notifications" />
                </PopoverContent>
              </Popover>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="hidden rounded-full lg:inline-flex"
                onClick={() => setDrawerOpen((value) => !value)}
                aria-label={drawerOpen ? "Close context drawer" : "Open context drawer"}
                aria-expanded={drawerOpen}
              >
                {drawerOpen ? <PanelRightClose /> : <PanelRightOpen />}
              </Button>
              <ProfileMenu roleLabel={role.label} />
            </div>
          </div>
        </header>

        <div className="px-4 pb-16 md:px-8">
          <div className="mx-auto flex max-w-[1560px] gap-6">
            <main id="main" className="min-w-0 flex-1 py-3">
              {children}
            </main>
            {drawerOpen ? (
              <ContextDrawer
                title={drawerTitle}
                activeTab={drawerTab}
                onTabChange={setDrawerTab}
                body={drawerBody?.[drawerTab]}
                showAudit={role.audit}
                workspace={ws.short}
                entity={entity.label}
              />
            ) : null}
          </div>
        </div>
      </div>

      <PlanAiAssistant context={assistantContext} />
    </div>
  );
}

function FloatingRail({ modules, pathname, collapsed, onToggle, labels, workspaceName }: {
  modules: ModuleDef[];
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
  labels: Record<LabelKey, string>;
  workspaceName: string;
}) {
  return (
    <aside
      className={cn(
        "glass fixed bottom-4 left-4 top-4 z-30 hidden flex-col rounded-3xl p-3 shadow-elevated transition-[width] duration-300 lg:flex",
        collapsed ? "w-20" : "w-[268px]",
      )}
      aria-label="Primary navigation"
    >
      <div className={cn("flex items-center gap-3 px-1 py-1", collapsed && "flex-col px-0")}>
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="ABox home">
          <AboxMark size={collapsed ? 44 : 38} />
          {!collapsed ? (
            <span className="min-w-0">
              <span className="text-display block text-lg leading-none">ABox</span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">{workspaceName}</span>
            </span>
          ) : null}
        </Link>
        <Button variant="ghost" size="icon-sm" className={cn("shrink-0", !collapsed && "ml-auto")} onClick={onToggle} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}>
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>
      <div className="my-3 h-px bg-hairline" />
      <nav className="flex-1 overflow-y-auto [scrollbar-width:none]">
        <p className={cn("mb-2 px-2 text-eyebrow", collapsed && "sr-only")}>Workspace</p>
        <ul className="space-y-1">
          {modules.filter((item) => !item.nested).map((item) => {
            const active = pathname === item.to || (item.to !== "/" && Boolean(item.to) && pathname.startsWith(`${item.to}/`));
            const Icon = MODULE_ICONS[item.id] ?? LayoutGrid;
            return (
              <li key={item.id} className="group relative">
                {item.to ? (
                  <Link
                    to={item.to}
                    title={collapsed ? moduleLabel(item.id, item.label, labels) : undefined}
                    className={cn(
                      "flex items-center rounded-xl text-sm font-medium transition-all",
                      collapsed ? "mx-auto size-11 justify-center" : "gap-3 px-3 py-2.5",
                      active ? "bg-primary text-primary-foreground shadow-glow" : "text-foreground/70 hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    {!collapsed ? <span className="truncate">{moduleLabel(item.id, item.label, labels)}</span> : null}
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-3 border-t border-hairline pt-3">
        <Link to="/lucie" className={cn("flex items-center rounded-xl text-sm text-foreground/70 hover:bg-accent", collapsed ? "size-11 justify-center" : "gap-3 px-3 py-2.5")} title="Lucie governance">
          <ShieldCheck className="size-[18px]" />
          {!collapsed ? <span>Lucie governance</span> : null}
        </Link>
      </div>
    </aside>
  );
}

function MobileNavigation({ modules, pathname, labels }: { modules: ModuleDef[]; pathname: string; labels: Record<LabelKey, string> }) {
  return (
    <nav className="p-3">
      <ul className="space-y-1">
        {modules.filter((item): item is ModuleDef & { to: string } => !item.nested && typeof item.to === "string").map((item) => {
          const Icon = MODULE_ICONS[item.id] ?? LayoutGrid;
          const active = pathname === item.to;
          return (
            <li key={item.id}>
              <Link to={item.to} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent")}>
                <Icon className="size-4" />
                {moduleLabel(item.id, item.label, labels)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function WorkspaceEntityMenu() {
  const shell = useShell();
  const workspace = WORKSPACES.find((item) => item.id === shell.workspaceId) ?? WORKSPACES[0];
  const entity = ENTITIES.find((item) => item.id === shell.entityId) ?? ENTITIES[0];
  if (!workspace || !entity) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="min-w-0 rounded-full px-3">
          <Building2 className="shrink-0" />
          <span className="hidden max-w-40 truncate sm:inline">{entity.label}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 rounded-2xl">
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        {WORKSPACES.filter((item) => item.kind === "internal").map((item) => (
          <DropdownMenuItem key={item.id} onSelect={() => shell.setWorkspaceId(item.id)} className="gap-3">
            <Check className={cn("size-4", item.id === workspace.id ? "opacity-100" : "opacity-0")} />
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Entity</DropdownMenuLabel>
        {ENTITIES.map((item) => (
          <DropdownMenuItem key={item.id} onSelect={() => shell.setEntityId(item.id)} className="gap-3">
            <Check className={cn("size-4", item.id === entity.id ? "opacity-100" : "opacity-0")} />
            <span className="min-w-0">
              <span className="block truncate">{item.label}</span>
              <span className="block text-xs text-muted-foreground">{item.type} · {item.relationship}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu({ roleLabel }: { roleLabel: string }) {
  const shell = useShell();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full px-1 lg:pr-3" aria-label="Account menu">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">EA</span>
          <span className="hidden lg:inline">Elena A.</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel>
          <span className="block">Elena Alvarez</span>
          <span className="block text-xs font-normal text-muted-foreground">{roleLabel}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((role) => (
          <DropdownMenuItem key={role.id} onSelect={() => shell.setRoleId(role.id)} className="gap-3">
            <Check className={cn("size-4", role.id === shell.roleId ? "opacity-100" : "opacity-0")} />
            {role.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile & preferences</DropdownMenuItem>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TrayHeader({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-b border-hairline px-4 py-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function ActivityRows({ type }: { type: "tasks" | "notifications" }) {
  const rows = type === "tasks"
    ? [["Review Rivera application", "Due today"], ["Confirm carrier appointment", "Due tomorrow"], ["Follow up with Morgan Lee", "Sep 3"]]
    : [["Application status changed", "2m"], ["New lead assigned", "18m"], ["Commission statement ready", "1h"]];
  return (
    <ul className="divide-y divide-hairline">
      {rows.map(([title, meta]) => (
        <li key={title} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/60">
          <span className="size-2 shrink-0 rounded-full bg-primary" />
          <span className="min-w-0 flex-1 truncate text-sm">{title}</span>
          <span className="text-xs text-muted-foreground">{meta}</span>
        </li>
      ))}
    </ul>
  );
}

function ContextDrawer({ title, activeTab, onTabChange, body, showAudit, workspace, entity }: {
  title: string;
  activeTab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
  body?: ReactNode;
  showAudit: boolean;
  workspace: string;
  entity: string;
}) {
  const tabs: DrawerTab[] = ["Context", "Summary", "Guidance", "Help & FAQ", ...(showAudit ? ["Audit" as const] : []), "Next actions"];
  return (
    <aside className="sticky top-[5.25rem] hidden h-[calc(100dvh-7rem)] w-[330px] shrink-0 overflow-hidden rounded-3xl border border-hairline bg-card shadow-card xl:flex xl:flex-col" aria-label="Page context">
      <div className="relative border-b border-hairline px-6 py-5">
        <span className="absolute bottom-5 left-0 top-5 w-1 rounded-r-full bg-primary" />
        <p className="text-eyebrow">Context</p>
        <h2 className="text-display mt-2 text-2xl">{title}</h2>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-hairline p-2 [scrollbar-width:none]">
        {tabs.map((tab) => (
          <Button key={tab} variant={activeTab === tab ? "secondary" : "ghost"} size="sm" className="shrink-0 rounded-full" onClick={() => onTabChange(tab)}>{tab}</Button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {body ?? <DefaultDrawerBody tab={activeTab} workspace={workspace} entity={entity} />}
      </div>
    </aside>
  );
}

function DefaultDrawerBody({ tab, workspace, entity }: { tab: DrawerTab; workspace: string; entity: string }) {
  const content: Record<DrawerTab, Array<[string, string]>> = {
    Context: [["Workspace", workspace], ["Entity scope", entity], ["Access", "Permission and relationship scoped"]],
    Summary: [["Open work", "11 items"], ["Owner", "Elena Alvarez"], ["Last updated", "Today, 10:24 AM"]],
    Guidance: [["Recommended", "Review priority exceptions first"], ["Policy", "Actions follow entity and role controls"]],
    "Help & FAQ": [["Page help", "Browse contextual guidance"], ["Support", "Contact the platform team"]],
    Audit: [["Recent changes", "4 recorded events"], ["Exports", "Permission controlled"]],
    "Next actions": [["Priority", "Review assigned applications"], ["Follow-up", "Resolve two blocked cases"]],
  };
  return (
    <div className="space-y-3">
      {content[tab].map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-hairline bg-surface/60 p-4">
          <p className="text-eyebrow">{label}</p>
          <p className="mt-2 text-sm leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  );
}
