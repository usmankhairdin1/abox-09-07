import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/shell/AppShell";
import {
  AclNote,
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WBox,
  WPanel,
} from "@/components/wireframe/primitives";
import { MODULES, WORKSPACES } from "@/lib/abox";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABox Platform Shell — Wireframe Map" },
      {
        name: "description",
        content:
          "Annotated low-fidelity wireframe of the ABox internal platform shell: top bar, workspace and entity switchers, left navigation, context drawer and assistant.",
      },
      { property: "og:title", content: "ABox Platform Shell — Wireframe Map" },
      {
        property: "og:description",
        content:
          "Structure-only wireframe of the unified ABox shell with workspaces, permission-driven modules, context drawer and assistant.",
      },
    ],
  }),
  component: ShellMapPage,
});

const REGIONS = [
  {
    id: "SHELL_TOPBAR",
    name: "Top global bar",
    what: "Persistent across every internal screen. Holds brand slot, workspace switcher, entity switcher, global search, notifications, tasks, AI assistant entry, profile and settings.",
    config: "Brand slot and menu visibility from Branding + Menu configuration.",
  },
  {
    id: "SHELL_WS_SWITCH",
    name: "Workspace switcher",
    what: "Switches the experience, not the app. Changes module set, data scope, default landing, available actions and labels. External workspaces are branded and do not use this shell.",
    config: "Workspace labels and availability configurable per tenant.",
  },
  {
    id: "SHELL_ENTITY_SWITCH",
    name: "Entity switcher",
    what: "Relationship-graph tree: tenant, marketplace, parent agency, downline agencies, partners. Selection scopes every read and write on the page.",
    config: "Derived from relationship rules; entity labels configurable.",
  },
  {
    id: "SHELL_SEARCH",
    name: "Global search",
    what: "Cross-object palette grouped by object type. ACL and entity scoped; sensitive fields masked; out-of-scope objects absent from results.",
    config: "Searchable object types configurable per workspace.",
  },
  {
    id: "SHELL_NOTIFS",
    name: "Notifications",
    what: "Tray of recent events with a link to the full notification centre. Channel and template content is admin configured.",
    config: "Templates, channels and branding from Communications config.",
  },
  {
    id: "SHELL_TASKS",
    name: "Tasks",
    what: "Tray of open tasks and follow-ups assigned to the current user in the current entity scope.",
    config: "Task types configurable; assignment follows relationship rules.",
  },
  {
    id: "SHELL_ASSISTANT_ENTRY",
    name: "AI assistant entry",
    what: "Top-bar entry to the same assistant as the bottom-right launcher, so the assistant is reachable from anywhere.",
    config: "Visibility per role; guardrails from AI governance.",
  },
  {
    id: "SHELL_PROFILE",
    name: "Profile & settings",
    what: "User profile, preferences including landing page, language, support access, sign out. Also hosts the wireframe role simulator.",
    config: "Preference set configurable per tenant.",
  },
  {
    id: "SHELL_LEFTNAV",
    name: "Left navigation",
    what: "Module containers for the current workspace, permission filtered. Inaccessible modules are absent, not greyed. Appointments/Paper and AI stay nested. Collapses to an icon rail.",
    config: "Labels, order and visibility from Menu + Label configuration.",
  },
  {
    id: "SHELL_CANVAS",
    name: "Main content canvas",
    what: "Where module screens and object pages render. All page patterns fit inside this one canvas.",
    config: "Page-level widgets and columns configurable where allowed.",
  },
  {
    id: "SHELL_DRAWER",
    name: "Right context drawer",
    what: "Page-level context, object summary, guidance, help and FAQ, audit where permitted, and next actions. Collapsible, present on every internal screen.",
    config: "Content authored in Help & FAQ configuration.",
  },
  {
    id: "SHELL_ASSISTANT",
    name: "Bottom-right assistant / help",
    what: "Chatbot help, FAQs and copilot suggestions, contextual to the current page and object.",
    config: "FAQ set, tone and allowed actions configurable; logged.",
  },
];

function ShellMapPage() {
  return (
    <AppShell drawerTitle="Shell map context" assistantContext="the platform shell">
      <PageHeading
        eyebrow="ABox · Batch 1 · Internal platform shell"
        title="Global platform shell"
        id="SHELL_MAP"
        description="Annotated map of the shell you are currently inside. Every region below is live in this wireframe — open the switchers, search, trays, drawer and assistant to walk the structure."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              to="/lucie"
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Lucie delivery spine →
            </Link>
            <Link
              to="/gov"
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Governed build packets →
            </Link>
          </div>
        }

      />


      <div className="grid gap-3 lg:grid-cols-3">
        <WPanel
          title="Region diagram"
          id="SHELL_DIAGRAM"
          meta="One unified shell. Workspaces, not portals."
          className="lg:col-span-2"
        >
          <div className="space-y-2">
            <WBox
              className="h-10"
              label="SHELL_TOPBAR — brand · workspace · entity · search · notifications · tasks · assistant · profile"
            />
            <div className="flex gap-2">
              <WBox className="h-56 w-40 shrink-0" label="SHELL_LEFTNAV" />
              <WBox className="h-56 flex-1" label="SHELL_CANVAS" />
              <WBox className="h-56 w-32 shrink-0" label="SHELL_DRAWER" />
            </div>
            <div className="flex justify-end">
              <WBox className="h-9 w-48" label="SHELL_ASSISTANT" />
            </div>
          </div>
          <Annotation className="mt-3">
            Consumer marketplace and member workspace use a separate, externally branded and
            simplified shell — not this chrome.
          </Annotation>
        </WPanel>

        <div className="space-y-3">
          <WPanel
            title="Batch 1 screens"
            id="BATCH_1"
            meta="Structure only — no colour or branding work"
          >
            <ul className="space-y-1.5 text-xs">
              {[
                { to: "/", label: "Internal platform shell", id: "SHELL_MAP" },
                { to: "/my-work", label: "My Work landing", id: "SCR_MY_WORK" },
                { to: "/dashboard", label: "Dashboards & Analytics shell", id: "SCR_DASHBOARD" },
                { to: "/object", label: "Object page framework", id: "PATTERN_OBJECT_PAGE" },
                { to: "/admin", label: "Admin configuration shell", id: "SCR_ADMIN_HOME" },
              ].map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-2 hover:bg-muted"
                  >
                    <span>{s.label}</span>
                    <IdChip>{s.id}</IdChip>
                  </Link>
                </li>
              ))}
            </ul>
          </WPanel>

          <AclNote>
            Switch the simulated role in Profile &amp; settings. As an agent you lose the
            Commissions and Admin modules from the left nav and the Audit tab from the drawer — they
            vanish rather than appear disabled.
          </AclNote>
        </div>
      </div>

      <WPanel
        title="Shell regions"
        id="SHELL_REGIONS"
        meta="Each region carries a stable ID that later batches reference"
      >
        <div className="grid gap-2 md:grid-cols-2">
          {REGIONS.map((r) => (
            <div key={r.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{r.name}</span>
                <IdChip>{r.id}</IdChip>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.what}</p>
              <Annotation className="mt-1.5">{r.config}</Annotation>
            </div>
          ))}
        </div>
      </WPanel>

      <div className="grid gap-3 lg:grid-cols-2">
        <WPanel title="Workspaces in the switcher" id="WS_REGISTER">
          <ul className="space-y-1.5">
            {WORKSPACES.map((w) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-2.5 py-2"
              >
                <span className="text-xs">
                  <span className="font-medium">{w.name}</span>
                  <span className="block font-mono text-[10px] text-muted-foreground">{w.id}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Pill>{w.kind === "external" ? "external shell" : "unified shell"}</Pill>
                  <Pill>{w.phase}</Pill>
                </span>
              </li>
            ))}
          </ul>
        </WPanel>

        <WPanel
          title="Module containers"
          id="MOD_REGISTER"
          meta="13 containers; nested ones never surface as top-level menu items"
        >
          <ul className="space-y-1.5">
            {MODULES.map((m) => (
              <li key={m.id} className="rounded-md border border-border px-2.5 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium">
                    {m.label}
                    {m.nested ? " (nested)" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IdChip>{m.id}</IdChip>
                    <Pill>{m.packet}</Pill>
                  </span>
                </div>
                <Annotation className="mt-1">{m.acl}</Annotation>
              </li>
            ))}
          </ul>
        </WPanel>
      </div>
    </AppShell>
  );
}
