import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleUser,
  ClipboardList,
  Coins,
  FileText,
  HelpCircle,
  LayoutGrid,
  Lock,
  type LucideIcon,
  Package,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from "lucide-react";

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
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AboxMark } from "@/components/abox/logo";
import { ThemeToggle } from "@/components/abox/theme-toggle";
import { Annotation, IdChip, WLine, WRow } from "@/components/wireframe/primitives";
import {
  DEFAULT_LABELS,
  DRAWER_TABS,
  ENTITIES,
  MODULE_BY_ID,
  MODULES,
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


/* ------------------------------------------------------------------ helpers */

function useVisibleModules() {
  const { workspaceId, roleId } = useShell();
  const ws = WORKSPACES.find((w) => w.id === workspaceId) ?? WORKSPACES[1]!;
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[1]!;

  const ids = ws.modules.filter((id) => {
    if (id === "MOD_COMMISSIONS" && !role.commissions) return false;
    if (id === "MOD_ADMIN_CONFIG" && role.id === "ROLE_AGENT") return false;
    return true;
  });

  return {
    ws,
    role,
    modules: ids.map((id) => MODULE_BY_ID[id]).filter((m): m is ModuleDef => Boolean(m)),
  };
}

function BarButton({
  children,
  onClick,
  active,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent px-2 text-xs text-foreground/80 transition-colors hover:bg-accent",
        active && "border-hairline bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function Tray({
  title,
  id,
  onClose,
  children,
}: {
  title: string;
  id: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="absolute right-0 top-10 z-40 w-80 rounded-2xl border border-hairline bg-popover p-3 shadow-elevated">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">{title}</span>
          <IdChip tone="prov">{id}</IdChip>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* --------------------------------------------------------------------- shell */

export function AppShell({
  children,
  drawerTitle = "Page context",
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("Context");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantTab, setAssistantTab] = useState<"Chat" | "FAQs" | "Copilot">("Chat");
  const [openMenu, setOpenMenu] = useState<
    null | "workspace" | "entity" | "search" | "notifications" | "tasks" | "profile" | "role"
  >(null);

  const entity = ENTITIES.find((e) => e.id === shell.entityId) ?? ENTITIES[0]!;
  const drawerTabs = DRAWER_TABS.filter((t) => t !== "Audit" || role.audit);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* ---------------------------------------------------- SHELL_TOPBAR */}
      <header className="glass sticky top-0 z-30 border-x-0 border-t-0 border-b border-hairline">
        <div className="relative flex h-12 items-center gap-2 px-3">
          <div className="flex items-center gap-2 pr-2">
            <Link to="/" className="flex items-center gap-2">
              <AboxMark size={26} />
              <span className="text-display hidden text-base sm:inline">ABox</span>
            </Link>
            <IdChip>SHELL_TOPBAR</IdChip>
            <Link
              to="/lucie"
              className="hidden rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline"
            >
              Lucie spine
            </Link>
            <Link
              to="/gov"
              className="hidden rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline"
            >
              Build packets
            </Link>

          </div>

          {/* workspace switcher */}
          <div className="relative">
            <BarButton
              active={openMenu === "workspace"}
              onClick={() => setOpenMenu(openMenu === "workspace" ? null : "workspace")}
            >
              <LayoutGrid className="size-3.5" />
              <span className="max-w-[10rem] truncate">
                {ws.short} {shell.labels.workspace.toLowerCase()}
              </span>
              <ChevronDown className="size-3" />
            </BarButton>
            {openMenu === "workspace" ? (
              <Tray
                title="Workspace switcher"
                id="SHELL_WS_SWITCH"
                onClose={() => setOpenMenu(null)}
              >
                <ul className="space-y-1">
                  {WORKSPACES.map((w) => (
                    <li key={w.id}>
                      <button
                        type="button"
                        disabled={w.kind === "external"}
                        onClick={() => {
                          shell.setWorkspaceId(w.id);
                          setOpenMenu(null);
                        }}
                        className={cn(
                          "flex w-full items-start justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
                          w.id === ws.id && "bg-muted",
                        )}
                      >
                        <span>
                          <span className="block font-medium">{w.name}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {w.id}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                          {w.kind === "external" ? "external shell" : w.phase}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <Annotation className="mt-2">
                  Switching changes modules, data scope, labels, defaults and actions. External
                  workspaces are branded experiences and do not use this shell.
                </Annotation>
              </Tray>
            ) : null}
          </div>

          {/* entity switcher */}
          <div className="relative">
            <BarButton
              active={openMenu === "entity"}
              onClick={() => setOpenMenu(openMenu === "entity" ? null : "entity")}
            >
              <Building2 className="size-3.5" />
              <span className="max-w-[9rem] truncate">{entity.label}</span>
              <ChevronDown className="size-3" />
            </BarButton>
            {openMenu === "entity" ? (
              <Tray
                title="Entity switcher"
                id="SHELL_ENTITY_SWITCH"
                onClose={() => setOpenMenu(null)}
              >
                <ul className="space-y-1">
                  {ENTITIES.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => {
                          shell.setEntityId(e.id);
                          setOpenMenu(null);
                        }}
                        style={{ paddingLeft: 8 + e.depth * 14 }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-lg py-1.5 pr-2 text-left text-xs hover:bg-accent",
                          e.id === entity.id && "bg-muted",
                        )}
                      >
                        <span>
                          <span className="block font-medium">{e.label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {e.type} · {e.relationship}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <Annotation className="mt-2">
                  List is derived from the relationship graph — parent, child, upline, downline,
                  partner — not a flat account list.
                </Annotation>
              </Tray>
            ) : null}
          </div>

          {/* global search */}
          <div className="relative ml-auto md:ml-2 md:flex-1">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "search" ? null : "search")}
              className="flex h-8 w-full max-w-md items-center gap-2 rounded-full border border-hairline bg-surface px-3 text-xs text-muted-foreground transition-colors hover:bg-accent"
            >
              <Search className="size-3.5" />
              <span className="truncate">
                Search {shell.labels.lead.toLowerCase()}s, {shell.labels.member.toLowerCase()}s,
                quotes, plans, {shell.labels.agency.toLowerCase()}…
              </span>
            </button>
            {openMenu === "search" ? (
              <div className="absolute left-0 top-10 z-40 w-full max-w-xl rounded-2xl border border-hairline bg-popover p-3 shadow-elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Global search</span>
                    <IdChip tone="prov">SHELL_SEARCH</IdChip>
                  </div>
                  <button type="button" onClick={() => setOpenMenu(null)} aria-label="Close">
                    <X className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="mt-2 space-y-3">
                  {[
                    `${shell.labels.lead}s`,
                    `${shell.labels.member}s / households`,
                    "Quotes & carts",
                    "Applications & submissions",
                    `${shell.labels.agency}s & ${shell.labels.agent}s`,
                    "Products & plans",
                  ].map((group) => (
                    <div key={group}>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {group}
                      </p>
                      <div className="mt-1 space-y-1">
                        <WLine w="72%" />
                        <WLine w="54%" className="h-1.5 bg-muted/70" />
                      </div>
                    </div>
                  ))}
                </div>
                <Annotation className="mt-3">
                  Results are ACL and entity scoped. Sensitive fields render masked; objects outside
                  the current entity subtree do not appear at all.
                </Annotation>
              </div>
            ) : null}
          </div>

          {/* notifications */}
          <ThemeToggle className="size-8 h-8 w-8" />

          <div className="relative">
            <BarButton
              title="Notifications"
              active={openMenu === "notifications"}
              onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
            >
              <Bell className="size-4" />
              <span className="hidden sm:inline">6</span>
            </BarButton>
            {openMenu === "notifications" ? (
              <Tray title="Notifications" id="SHELL_NOTIFS" onClose={() => setOpenMenu(null)}>
                <WRow /> <WRow /> <WRow />
                <Annotation className="mt-2">
                  Tray shows recent items only. Full page target is SCR_NOTIFICATION_CENTER
                  (provisional). Channels: email, SMS, in-app.
                </Annotation>
              </Tray>
            ) : null}
          </div>

          {/* tasks */}
          <div className="relative">
            <BarButton
              title="Tasks"
              active={openMenu === "tasks"}
              onClick={() => setOpenMenu(openMenu === "tasks" ? null : "tasks")}
            >
              <CheckSquare className="size-4" />
              <span className="hidden sm:inline">11</span>
            </BarButton>
            {openMenu === "tasks" ? (
              <Tray title="Tasks" id="SHELL_TASKS" onClose={() => setOpenMenu(null)}>
                <WRow /> <WRow />
                <Annotation className="mt-2">
                  Deep-links to SCR_TASKS in Customers &amp; Leads.
                </Annotation>
              </Tray>
            ) : null}
          </div>

          {/* AI assistant entry */}
          <BarButton
            title="AI assistant"
            active={assistantOpen}
            onClick={() => setAssistantOpen((v) => !v)}
          >
            <Sparkles className="size-4" />
            <span className="hidden lg:inline">Assistant</span>
          </BarButton>

          {/* profile / settings */}
          <div className="relative">
            <BarButton
              title="Profile and settings"
              active={openMenu === "profile"}
              onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
            >
              <CircleUser className="size-4" />
            </BarButton>
            {openMenu === "profile" ? (
              <Tray title="Profile & settings" id="SHELL_PROFILE" onClose={() => setOpenMenu(null)}>
                <ul className="space-y-1 text-xs">
                  {[
                    "Profile",
                    "Preferences & landing page",
                    "Language",
                    "Support access",
                    "Sign out",
                  ].map((i) => (
                    <li key={i} className="rounded-lg px-2 py-1.5 hover:bg-accent">
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-hairline pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Wireframe control · simulated role
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => shell.setRoleId(r.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-accent",
                          r.id === role.id && "bg-muted",
                        )}
                      >
                        <span>{r.label}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {r.scope}
                        </span>
                      </button>
                    ))}
                  </div>
                  <Annotation className="mt-2">
                    Role switch is a wireframe device: it proves modules, drawer tabs and cards
                    disappear rather than grey out.
                  </Annotation>
                </div>
              </Tray>
            ) : null}
          </div>
        </div>

        {/* context strip */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hairline bg-surface/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{ws.id}</span>
          <span aria-hidden="true">·</span>
          <span>{entity.id}</span>
          <span aria-hidden="true">·</span>
          <span>{role.id}</span>
          <span aria-hidden="true">·</span>
          <span>governed estate — meridian design system</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ------------------------------------------------ SHELL_LEFTNAV */}
        <nav
          className={cn(
            "shrink-0 border-r border-hairline bg-surface transition-all",
            navCollapsed ? "w-14" : "w-64",
          )}
          aria-label="Modules"
        >
          <div className="sticky top-[4.25rem] flex h-[calc(100vh-4.25rem)] flex-col overflow-y-auto p-2">
            <div className="mb-2 flex items-center justify-between px-1">
              {navCollapsed ? null : <IdChip>SHELL_LEFTNAV</IdChip>}
              <button
                type="button"
                onClick={() => setNavCollapsed((v) => !v)}
                aria-label={navCollapsed ? "Expand navigation" : "Collapse navigation"}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {navCollapsed ? (
                  <ChevronsRight className="size-4" />
                ) : (
                  <ChevronsLeft className="size-4" />
                )}
              </button>
            </div>

            <ul className="space-y-0.5">
              {modules.map((m) => {
                const active =
                  m.to === pathname || (m.to === "/my-work" && pathname === "/my-work");
                const Icon = MODULE_ICONS[m.id] ?? LayoutGrid;
                const content = (
                  <span className="flex min-w-0 flex-1 items-center gap-2.5">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    {navCollapsed ? null : (
                      <span className="min-w-0 flex-1 truncate">
                        {moduleLabel(m.id, m.label, shell.labels)}
                      </span>
                    )}
                  </span>
                );
                return (
                  <li key={m.id}>
                    {m.to ? (
                      <Link
                        to={m.to}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-colors hover:bg-accent",
                          active &&
                            "bg-primary-soft font-medium text-foreground ring-1 ring-primary/20",
                        )}

                        title={`${m.id} — ${m.acl}`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        className="flex cursor-not-allowed items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground"
                        title={`${m.id} — not in this wireframe batch`}
                      >
                        {content}
                        {navCollapsed ? null : (
                          <span className="font-mono text-[9px] uppercase">stub</span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {navCollapsed ? null : (
              <div className="mt-4 space-y-2 border-t border-hairline pt-3">
                <p className="px-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Nested — never top level
                </p>
                <ul className="space-y-1 px-1">
                  {MODULES.filter((m) => m.nested).map((m) => (
                    <li
                      key={m.id}
                      className="flex items-start gap-2 text-[11px] text-muted-foreground"
                    >
                      <Lock className="mt-0.5 size-3 shrink-0" />
                      <span>
                        {m.label}
                        <span className="block font-mono text-[9px]">{m.id}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Annotation className="px-1">
                  Modules the role cannot access are absent, not greyed. Labels come from Admin →
                  Label configuration.
                </Annotation>
              </div>
            )}
          </div>
        </nav>

        {/* -------------------------------------------------- main canvas */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>

        {/* ------------------------------------------------- SHELL_DRAWER */}
        <aside
          className={cn(
            "hidden shrink-0 border-l border-hairline bg-card transition-all xl:block",
            drawerOpen ? "w-80" : "w-11",
          )}
          aria-label="Context drawer"
        >
          <div className="sticky top-[4.25rem] flex h-[calc(100vh-4.25rem)] flex-col overflow-y-auto">
            <div className="flex items-center justify-between gap-2 border-b border-hairline px-2 py-2">
              {drawerOpen ? (
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-xs font-semibold">{drawerTitle}</span>
                  <IdChip tone="prov">SHELL_DRAWER</IdChip>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setDrawerOpen((v) => !v)}
                aria-label={drawerOpen ? "Collapse drawer" : "Expand drawer"}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {drawerOpen ? (
                  <PanelRightClose className="size-4" />
                ) : (
                  <PanelRightOpen className="size-4" />
                )}
              </button>
            </div>

            {drawerOpen ? (
              <>
                <div className="flex flex-wrap gap-1 border-b border-hairline px-2 py-2">
                  {drawerTabs.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDrawerTab(t)}
                      className={cn(
                        "rounded-lg border border-transparent px-1.5 py-1 text-[11px] text-muted-foreground hover:bg-accent",
                        drawerTab === t && "border-hairline bg-muted text-foreground",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex-1 space-y-3 p-3">
                  {drawerBody?.[drawerTab] ?? <DefaultDrawerBody tab={drawerTab} />}
                  {!role.audit ? (
                    <Annotation>
                      Audit tab is hidden for {role.label.toLowerCase()} — visibility is permission
                      controlled, configured in SCR_ACL_CONFIG.
                    </Annotation>
                  ) : null}
                  <Annotation>
                    Drawer content for every screen is authored in SCR_HELP_CONFIG (page guidance,
                    FAQs, copilot knowledge).
                  </Annotation>
                </div>
              </>
            ) : null}
          </div>
        </aside>
      </div>

      {/* ---------------------------------------------- SHELL_ASSISTANT */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {assistantOpen ? (
          <div className="w-[19rem] rounded-2xl border border-hairline bg-popover shadow-elevated sm:w-80">
            <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">Assistant</span>
                <IdChip tone="prov">SHELL_ASSISTANT</IdChip>
              </div>
              <button
                type="button"
                onClick={() => setAssistantOpen(false)}
                aria-label="Close assistant"
              >
                <X className="size-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-1 border-b border-hairline px-2 py-2">
              {(["Chat", "FAQs", "Copilot"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAssistantTab(t)}
                  className={cn(
                    "rounded-lg border border-transparent px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent",
                    assistantTab === t && "border-hairline bg-muted text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-2 p-3">
              {assistantTab === "Chat" ? (
                <>
                  <div className="rounded-lg border border-dashed border-hairline bg-muted/40 p-2">
                    <WLine w="80%" />
                    <WLine w="60%" className="mt-1.5 h-1.5 bg-muted/70" />
                  </div>
                  <div className="ml-6 rounded-lg border border-hairline bg-background p-2">
                    <WLine w="70%" />
                  </div>
                  <div className="rounded-lg border border-hairline px-2 py-1.5 text-[11px] text-muted-foreground">
                    Ask a question about {assistantContext}…
                  </div>
                </>
              ) : null}
              {assistantTab === "FAQs" ? (
                <ul className="space-y-1.5 text-[11px]">
                  {[
                    "What does this page do?",
                    "Who can see this data?",
                    "How do I change a label?",
                    "Where do notifications come from?",
                  ].map((q) => (
                    <li key={q} className="rounded-lg border border-hairline px-2 py-1.5">
                      {q}
                    </li>
                  ))}
                </ul>
              ) : null}
              {assistantTab === "Copilot" ? (
                <ul className="space-y-1.5 text-[11px]">
                  {[
                    "Summarise this record",
                    "Draft a follow-up message",
                    "Explain the next action",
                    "Check what is blocking submission",
                  ].map((q) => (
                    <li
                      key={q}
                      className="flex items-center gap-2 rounded-lg border border-dashed border-hairline px-2 py-1.5"
                    >
                      <Sparkles className="size-3" /> {q}
                    </li>
                  ))}
                </ul>
              ) : null}
              <Annotation>
                Contextual to {assistantContext}. Guardrails, disclaimers and logging come from
                SCR_AI_GOVERNANCE and SCR_PLANO_CONFIG.
              </Annotation>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setAssistantOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-2 text-xs font-medium shadow-elevated hover:bg-accent"
        >
          <HelpCircle className="size-4" />
          Help &amp; assistant
        </button>
      </div>
    </div>
  );
}

function moduleLabel(id: string, fallback: string, labels: Record<LabelKey, string>) {
  if (id === "MOD_LEADS_CUSTOMERS") return `${labels.member}s & ${labels.lead}s`;
  if (id === "MOD_AGENCY_ENTITY") return `${labels.agency} & Entity Management`;
  if (id === "MOD_MARKETPLACE_SALES") return `${labels.marketplace} & Sales`;
  return fallback;
}

function DefaultDrawerBody({ tab }: { tab: DrawerTab }) {
  const items: Record<DrawerTab, string[]> = {
    Context: [
      "Workspace and entity in effect",
      "Why this page is visible to you",
      "Applied filters",
    ],
    Summary: ["Key fields", "Counts and status", "Owner and dates"],
    Guidance: ["What to do on this page", "Configured page guidance", "Policy reminders"],
    "Help & FAQ": ["Top questions for this page", "Link to full help", "Contact support"],
    Audit: ["Who changed what, when", "Impersonation events", "Export (permission gated)"],
    "Next actions": ["Suggested action 1", "Suggested action 2", "Escalate to a human"],
  };
  return (
    <div className="space-y-2">
      {items[tab].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-dashed border-hairline bg-muted/30 px-2 py-2"
        >
          <p className="text-[11px] text-foreground/80">{i}</p>
          <WLine w="65%" className="mt-1.5 h-1.5 bg-muted/70" />
        </div>
      ))}
    </div>
  );
}
