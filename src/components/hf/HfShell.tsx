import { Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  CheckSquare,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleUser,
  LayoutGrid,
  PanelRightClose,
  PanelRightOpen,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Badge, Btn, Card } from "@/components/hf/ui";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------- nav config */

interface NavItem {
  id: string;
  label: string;
  /** Permission that must be held for this module to appear at all. */
  perm?: "commission.view" | "admin.configure";
}

const NAV: NavItem[] = [
  { id: "MOD_MY_WORK", label: "My Work" },
  { id: "MOD_REPORTING", label: "Dashboards & Analytics" },
  { id: "MOD_LEADS_CUSTOMERS", label: "Customers & Leads" },
  { id: "MOD_MARKETPLACE_SALES", label: "Marketplace & Sales" },
  { id: "MOD_FORMS_ENROLLMENT", label: "Forms & Enrollment" },
  { id: "MOD_PRODUCTS_PLANS", label: "Products, Plans & Rates" },
  { id: "MOD_AGENCY_ENTITY", label: "Agency & Entity Management" },
  { id: "MOD_COMMISSIONS", label: "Commissions & Revenue", perm: "commission.view" },
  { id: "MOD_COMMUNICATIONS", label: "Notifications & Scheduling" },
  { id: "MOD_OUTPUTS_DOCS", label: "Documents & Outputs" },
  { id: "MOD_ADMIN_CONFIG", label: "Admin & Configuration", perm: "admin.configure" },
];

const WORKSPACES = [
  { id: "WS_AGENCY", label: "Agency Workspace" },
  { id: "WS_AGENT", label: "Agent Workspace" },
  { id: "WS_PLATFORM_ADMIN", label: "JET Platform Workspace" },
  { id: "WS_CARRIER", label: "Carrier Workspace" },
  { id: "WS_PARTNER", label: "Partner Workspace" },
];

const ENTITIES = [
  { id: "ENT_AGY_MASTER", label: "Northwind Master", depth: 0, rel: "parent · upline" },
  { id: "ENT_AGY_DOWN_1", label: "Harbor Point", depth: 1, rel: "downline" },
  { id: "ENT_AGY_DOWN_2", label: "Cedar Ridge", depth: 1, rel: "downline" },
  { id: "ENT_PARTNER_1", label: "Bright Referral", depth: 1, rel: "referral partner" },
];

export const ROLE_PRESETS = [
  {
    id: "ROLE_AGENCY_ADMIN",
    label: "Agency admin",
    scope: "Own entity + downline",
    perms: ["commission.view", "admin.configure", "audit.view"],
  },
  {
    id: "ROLE_AGENCY_MANAGER",
    label: "Agency manager",
    scope: "Own entity",
    perms: ["commission.view"],
  },
  { id: "ROLE_AGENT", label: "Agent / producer", scope: "Assigned records only", perms: [] },
  {
    id: "ROLE_SUPPORT",
    label: "Support (impersonating)",
    scope: "Global · banded + logged",
    perms: ["audit.view"],
  },
] as const;

export const DRAWER_SECTIONS = [
  "Context",
  "Summary",
  "Guidance",
  "Help & FAQ",
  "Audit",
  "Next actions",
] as const;

export type DrawerSection = (typeof DRAWER_SECTIONS)[number];

/* -------------------------------------------------------------------- shell */

export function HfShell({
  children,
  activeModule,
  drawerTitle = "Page context",
  drawer,
  assistantContext = "this page",
  onRoleChange,
}: {
  children: ReactNode;
  activeModule: string;
  drawerTitle?: string;
  drawer?: Partial<Record<DrawerSection, ReactNode>>;
  assistantContext?: string;
  onRoleChange?: (roleId: string) => void;
}) {
  const [roleId, setRoleId] = useState<string>("ROLE_AGENCY_ADMIN");
  const [workspace, setWorkspace] = useState(WORKSPACES[0]!);
  const [entity, setEntity] = useState(ENTITIES[0]!);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [section, setSection] = useState<DrawerSection>("Context");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [menu, setMenu] = useState<null | "ws" | "entity" | "profile" | "notif" | "tasks">(null);
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  const role = ROLE_PRESETS.find((r) => r.id === roleId)!;
  const has = (p: string) => (role.perms as readonly string[]).includes(p);
  const nav = NAV.filter((n) => !n.perm || has(n.perm));
  const sections = DRAWER_SECTIONS.filter((s) => s !== "Audit" || has("audit.view"));

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* ------------------------------------------------------- global bar */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-card">
        {role.id === "ROLE_SUPPORT" ? (
          <div className="flex items-center justify-center gap-2 bg-warning/20 px-3 py-1 text-[11px] font-medium text-warning-foreground">
            <ShieldCheck className="size-3.5" />
            Support impersonation active — every action on this session is written to the audit log
          </div>
        ) : null}
        <div className="relative flex h-13 items-center gap-2 px-3 py-2.5">
          <Link to="/hf" className="flex items-center gap-2.5 pr-1">
            <span className="grid size-7 place-items-center rounded-md bg-primary font-display text-[11px] font-bold text-primary-foreground">
              AB
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">
              ABox
            </span>
          </Link>

          <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

          {/* workspace switcher */}
          <div className="relative">
            <BarBtn active={menu === "ws"} onClick={() => setMenu(menu === "ws" ? null : "ws")}>
              <LayoutGrid className="size-3.5" />
              <span className="max-w-[9rem] truncate">{workspace.label}</span>
              <ChevronDown className="size-3" />
            </BarBtn>
            {menu === "ws" ? (
              <Menu title="Switch workspace" onClose={() => setMenu(null)}>
                {WORKSPACES.map((w) => (
                  <MenuRow
                    key={w.id}
                    active={w.id === workspace.id}
                    onClick={() => {
                      setWorkspace(w);
                      setMenu(null);
                    }}
                    primary={w.label}
                    secondary={w.id}
                  />
                ))}
                <p className="mt-2 border-t border-hairline pt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Same shell. Switching re-scopes modules, data, labels and defaults — it does not
                  open a different portal.
                </p>
              </Menu>
            ) : null}
          </div>

          {/* entity switcher */}
          <div className="relative">
            <BarBtn
              active={menu === "entity"}
              onClick={() => setMenu(menu === "entity" ? null : "entity")}
            >
              <Building2 className="size-3.5" />
              <span className="max-w-[8rem] truncate">{entity.label}</span>
              <ChevronDown className="size-3" />
            </BarBtn>
            {menu === "entity" ? (
              <Menu title="Entity (relationship graph)" onClose={() => setMenu(null)}>
                {ENTITIES.filter((e) => role.id !== "ROLE_AGENT" || e.depth === 0).map((e) => (
                  <MenuRow
                    key={e.id}
                    active={e.id === entity.id}
                    indent={e.depth}
                    onClick={() => {
                      setEntity(e);
                      setMenu(null);
                    }}
                    primary={e.label}
                    secondary={e.rel}
                  />
                ))}
                <p className="mt-2 border-t border-hairline pt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Derived from parent / child / upline / downline / partner relationships and
                  clipped to your subtree.
                </p>
              </Menu>
            ) : null}
          </div>

          {/* search */}
          <button
            type="button"
            className="ml-auto flex h-8 min-w-0 flex-1 items-center gap-2 rounded-[var(--radius)] border border-hairline bg-background px-2.5 text-xs text-muted-foreground hover:bg-muted md:ml-2 md:max-w-sm"
          >
            <Search className="size-3.5 shrink-0" />
            <span className="truncate">Search leads, members, quotes, plans…</span>
            <span className="ml-auto hidden rounded border border-hairline px-1 font-mono text-[10px] sm:inline">
              ⌘K
            </span>
          </button>

          <div className="relative">
            <BarBtn
              active={menu === "notif"}
              onClick={() => setMenu(menu === "notif" ? null : "notif")}
            >
              <Bell className="size-4" />
              <span className="grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                6
              </span>
            </BarBtn>
            {menu === "notif" ? (
              <Menu title="Notifications" onClose={() => setMenu(null)}>
                {[
                  ["Shared quote viewed", "Maria Delgado opened Q-10428 · 12m ago"],
                  ["Application needs review", "Off-exchange dental · Harbor Point · 1h ago"],
                  ["Rate refresh complete", "Blue Summit 2027 rates loaded · 3h ago"],
                ].map(([a, b]) => (
                  <MenuRow key={a} primary={a!} secondary={b!} />
                ))}
              </Menu>
            ) : null}
          </div>

          <div className="relative">
            <BarBtn
              active={menu === "tasks"}
              onClick={() => setMenu(menu === "tasks" ? null : "tasks")}
            >
              <CheckSquare className="size-4" />
              <span className="hidden text-xs sm:inline">11</span>
            </BarBtn>
            {menu === "tasks" ? (
              <Menu title="My tasks" onClose={() => setMenu(null)}>
                {[
                  ["Call back J. Whitfield", "Requested a call · due today"],
                  ["Follow up on expiring quote", "Q-10391 expires in 2 days"],
                ].map(([a, b]) => (
                  <MenuRow key={a} primary={a!} secondary={b!} />
                ))}
              </Menu>
            ) : null}
          </div>

          <BarBtn active={assistantOpen} onClick={() => setAssistantOpen((v) => !v)}>
            <Sparkles className="size-4" />
            <span className="hidden lg:inline">Assistant</span>
          </BarBtn>

          <div className="relative">
            <BarBtn
              active={menu === "profile"}
              onClick={() => setMenu(menu === "profile" ? null : "profile")}
            >
              <CircleUser className="size-4" />
            </BarBtn>
            {menu === "profile" ? (
              <Menu title="Profile & preferences" onClose={() => setMenu(null)}>
                <div className="space-y-1">
                  {["Profile", "Default landing page", "Language", "Sign out"].map((i) => (
                    <MenuRow key={i} primary={i} />
                  ))}
                </div>
                <div className="mt-2 border-t border-hairline pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Density
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {(["comfortable", "compact"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDensity(d)}
                        className={cn(
                          "rounded-[var(--radius)] border px-2 py-1 text-[11px] capitalize",
                          density === d
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-hairline",
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2 border-t border-hairline pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Simulated role — wireframe control
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {ROLE_PRESETS.map((r) => (
                      <MenuRow
                        key={r.id}
                        active={r.id === role.id}
                        primary={r.label}
                        secondary={r.scope}
                        onClick={() => {
                          setRoleId(r.id);
                          onRoleChange?.(r.id);
                          setMenu(null);
                        }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Switch roles to watch modules and drawer sections disappear rather than grey
                    out.
                  </p>
                </div>
              </Menu>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ----------------------------------------------------- left nav */}
        <nav
          aria-label="Modules"
          className={cn(
            "hidden shrink-0 border-r border-hairline bg-sidebar transition-[width] md:block",
            collapsed ? "w-14" : "w-60",
          )}
        >
          <div className="sticky top-13 flex h-[calc(100svh-3.25rem)] flex-col overflow-y-auto p-2">
            <ul className="space-y-0.5">
              {nav.map((n) => {
                const active = n.id === activeModule;
                return (
                  <li key={n.id}>
                    <span
                      className={cn(
                        "relative flex cursor-default items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-2 text-[13px] transition-colors",
                        active
                          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                      )}
                      title={n.label}
                    >
                      {active ? (
                        <span
                          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span
                        className={cn(
                          "size-4 shrink-0 rounded-sm border",
                          active ? "border-primary/60 bg-primary/20" : "border-hairline",
                        )}
                        aria-hidden="true"
                      />
                      {collapsed ? null : (
                        <span className="min-w-0 flex-1 truncate">{n.label}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            {collapsed ? null : (
              <p className="mt-3 border-t border-hairline px-2.5 pt-3 text-[11px] leading-relaxed text-muted-foreground">
                Modules you cannot access are absent, not greyed. Labels come from the tenant label
                dictionary.
              </p>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="mt-auto flex items-center gap-2 rounded-[var(--radius)] px-2.5 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent/60"
            >
              {collapsed ? (
                <ChevronsRight className="size-4" />
              ) : (
                <ChevronsLeft className="size-4" />
              )}
              {collapsed ? null : "Collapse"}
            </button>
          </div>
        </nav>

        {/* -------------------------------------------------- page canvas */}
        <main
          className={cn("min-w-0 flex-1 px-4 lg:px-6", density === "compact" ? "py-4" : "py-6")}
        >
          <div
            className={cn("mx-auto max-w-5xl", density === "compact" ? "space-y-4" : "space-y-5")}
          >
            {children}
          </div>
        </main>

        {/* --------------------------------------------------- right drawer */}
        <aside
          aria-label="Context drawer"
          className={cn(
            "hidden shrink-0 border-l border-hairline bg-card transition-[width] xl:block",
            drawerOpen ? "w-[19rem]" : "w-11",
          )}
        >
          <div className="sticky top-13 flex h-[calc(100svh-3.25rem)] flex-col overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-hairline px-2.5 py-2.5">
              {drawerOpen ? (
                <span className="truncate font-display text-xs font-semibold">{drawerTitle}</span>
              ) : null}
              <button
                type="button"
                onClick={() => setDrawerOpen((v) => !v)}
                aria-label={drawerOpen ? "Collapse drawer" : "Expand drawer"}
                className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  {sections.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSection(s)}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px]",
                        section === s
                          ? "border-primary bg-primary/10 font-medium text-primary"
                          : "border-transparent text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="space-y-3 p-3 text-xs leading-relaxed">
                  {drawer?.[section] ?? <DefaultDrawer section={section} />}
                  {!has("audit.view") ? (
                    <p className="border-t border-hairline pt-2 text-[11px] text-muted-foreground">
                      Audit section hidden for {role.label.toLowerCase()} — drawer sections are
                      permission-controlled.
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </aside>
      </div>

      {/* --------------------------------------------------------- assistant */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {assistantOpen ? (
          <Card className="w-[20rem] overflow-hidden shadow-[var(--shadow-overlay)]">
            <div className="flex items-center gap-2 border-b border-hairline bg-ai/[0.06] px-3 py-2.5">
              <Sparkles className="size-3.5 text-ai" />
              <span className="font-display text-xs font-semibold">Assistant</span>
              <Badge tone="ai">AI</Badge>
              <button
                type="button"
                onClick={() => setAssistantOpen(false)}
                aria-label="Close assistant"
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="space-y-2.5 p-3">
              <p className="text-[11px] text-muted-foreground">Context: {assistantContext}</p>
              <div className="rounded-[var(--radius)] border border-ai/25 bg-ai/[0.05] p-2.5 text-xs leading-relaxed">
                Three quotes on your list expire this week. Want me to draft follow-ups for the two
                that were viewed but not acted on?
              </div>
              {["Summarise this record", "Draft a follow-up", "What is blocking submission?"].map(
                (q) => (
                  <button
                    key={q}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-[var(--radius)] border border-hairline px-2.5 py-1.5 text-left text-xs hover:bg-muted"
                  >
                    <Sparkles className="size-3 text-ai" /> {q}
                  </button>
                ),
              )}
              <div className="flex h-9 items-center rounded-[var(--radius)] border border-input px-2.5 text-xs text-muted-foreground">
                Ask about {assistantContext}…
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Answers are grounded in records you can already see, logged to the AI interaction
                log, and escalate to a licensed person for advice.
              </p>
            </div>
          </Card>
        ) : null}
        <Btn variant="outline" onClick={() => setAssistantOpen((v) => !v)} className="shadow-elevated">
          <Sparkles className="size-4 text-ai" />
          Help &amp; assistant
        </Btn>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- pieces */

function BarBtn({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--radius)] border border-transparent px-2 text-xs text-foreground/80 transition-colors hover:bg-muted",
        active && "border-hairline bg-muted text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Menu({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="absolute left-0 top-10 z-40 w-72 rounded-[var(--radius)] border border-hairline bg-popover p-2.5 shadow-[var(--shadow-overlay)]">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-display text-xs font-semibold">{title}</span>
        <button type="button" onClick={onClose} aria-label="Close">
          <X className="size-3.5 text-muted-foreground" />
        </button>
      </div>
      {children}
    </div>
  );
}

function MenuRow({
  primary,
  secondary,
  active,
  indent = 0,
  onClick,
}: {
  primary: string;
  secondary?: string;
  active?: boolean;
  indent?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ paddingLeft: 8 + indent * 14 }}
      className={cn(
        "flex w-full flex-col items-start gap-0.5 rounded-[var(--radius)] py-1.5 pr-2 text-left hover:bg-muted",
        active && "bg-muted",
      )}
    >
      <span className="text-xs font-medium">{primary}</span>
      {secondary ? <span className="text-[11px] text-muted-foreground">{secondary}</span> : null}
    </button>
  );
}

function DefaultDrawer({ section }: { section: DrawerSection }) {
  const copy: Record<DrawerSection, string[]> = {
    Context: [
      "Agency Workspace · Northwind Master",
      "You see this page because your role template includes it.",
    ],
    Summary: ["Key fields and counts for the current object or list."],
    Guidance: ["Configured page guidance authored per screen ID."],
    "Help & FAQ": ["Top questions for this page, then a link to full help."],
    Audit: ["Who changed what, when. Export is separately permissioned."],
    "Next actions": ["Suggested next steps, ending in escalate to a person."],
  };
  return (
    <ul className="space-y-2">
      {copy[section].map((c) => (
        <li key={c} className="text-xs leading-relaxed text-foreground/80">
          {c}
        </li>
      ))}
    </ul>
  );
}
