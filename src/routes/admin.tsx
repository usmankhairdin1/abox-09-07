import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell, useShell } from "@/components/shell/AppShell";
import {
  AclNote,
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WBox,
  WLine,
  WPanel,
  WRow,
} from "@/components/wireframe/primitives";
import {
  FEATURE_FLAGS,
  LABEL_ALTERNATIVES,
  MODULES,
  ROLES,
  WORKSPACES,
  type LabelKey,
} from "@/lib/abox";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & Configuration — ABox Wireframe" },
      {
        name: "description",
        content:
          "Low-fidelity wireframe of the ABox admin shell: ACL controls, label configuration, menu visibility, workspace setup, branding, feature flags and help/FAQ authoring.",
      },
      { property: "og:title", content: "Admin & Configuration — ABox Wireframe" },
      {
        property: "og:description",
        content:
          "Structure-only ABox configuration shell showing what authorized admins can change within global guardrails.",
      },
    ],
  }),
  component: AdminPage,
});

const SECTIONS = [
  { id: "SCR_ACL_CONFIG", label: "ACL & roles" },
  { id: "SCR_LABEL_CONFIG", label: "Labels & terminology" },
  { id: "SCR_MENU_CONFIG", label: "Menu visibility" },
  { id: "SCR_WORKSPACE_CONFIG", label: "Workspaces" },
  { id: "SCR_BRANDING_CONFIG", label: "Branding & white labeling" },
  { id: "SCR_FLAGS_CONFIG", label: "Feature flags" },
  { id: "SCR_HELP_CONFIG", label: "Help & FAQ" },
] as const;

function AdminPage() {
  const { labels, setLabel } = useShell();
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("SCR_ACL_CONFIG");
  const [flags, setFlags] = useState(() => FEATURE_FLAGS.map((f) => f.on));
  const [hidden, setHidden] = useState<string[]>([]);

  return (
    <AppShell drawerTitle="Configuration context" assistantContext="platform configuration">
      <PageHeading
        eyebrow="Admin & Configuration"
        title="Admin configuration shell"
        id="SCR_ADMIN_HOME"
        description="What authorized admins can change, always within global platform guardrails. Edits here are what make labels, menus, branding, help content and access behave differently per tenant, workspace and entity."
        actions={<Pill>Changes are versioned & audited</Pill>}
      />

      <div className="grid gap-3 lg:grid-cols-[14rem_1fr]">
        <nav className="space-y-1 rounded-lg border border-border bg-card p-2" aria-label="Configuration sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-2 text-left text-xs hover:bg-muted ${
                section === s.id ? "bg-muted font-medium" : ""
              }`}
            >
              {s.label}
              <span className="font-mono text-[9px] text-muted-foreground">{s.id}</span>
            </button>
          ))}
        </nav>

        <div className="space-y-3">
          {section === "SCR_ACL_CONFIG" ? (
            <>
              <WPanel title="Roles" id="SCR_ACL_CONFIG" meta="Role definitions and data scope; roles are never stored on user or profile records">
                <div className="space-y-1.5">
                  {ROLES.map((r) => (
                    <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-2.5 py-2">
                      <span className="text-xs">
                        <span className="font-medium">{r.label}</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">{r.id}</span>
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5">
                        <Pill>{r.scope}</Pill>
                        {r.audit ? <Pill>audit</Pill> : null}
                        {r.commissions ? <Pill>commissions</Pill> : null}
                      </span>
                    </div>
                  ))}
                </div>
              </WPanel>
              <WPanel title="Permission matrix" id="SCR_ACL_MATRIX" meta="Module and action permissions per role, bounded by platform guardrails">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[32rem] text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-1.5 pr-2 font-normal">Module</th>
                        {["View", "Create", "Edit", "Submit", "Configure"].map((c) => (
                          <th key={c} className="py-1.5 pr-2 font-normal">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MODULES.slice(0, 8).map((m) => (
                        <tr key={m.id} className="border-b border-border/60">
                          <td className="py-1.5 pr-2">{m.label}</td>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <td key={i} className="py-1.5 pr-2">
                              <span className="inline-block size-3.5 rounded border border-border bg-muted" aria-hidden="true" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Annotation className="mt-2">
                  Sensitive grants (paper access, commission visibility, audit export, impersonation)
                  require a second approver and are logged.
                </Annotation>
              </WPanel>
              <WPanel title="Effective permission preview" id="SCR_ACL_PREVIEW" meta="Pick a user, workspace and entity to see exactly what they would see">
                <div className="grid gap-2 sm:grid-cols-3">
                  {["User", "Workspace", "Entity"].map((f) => (
                    <div key={f} className="rounded-md border border-border px-2.5 py-2">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{f}</p>
                      <WLine w="70%" className="mt-1.5" />
                    </div>
                  ))}
                </div>
                <WBox className="mt-2 h-24" label="resulting menu, actions and masked fields" />
              </WPanel>
            </>
          ) : null}

          {section === "SCR_LABEL_CONFIG" ? (
            <WPanel title="Label configuration" id="SCR_LABEL_CONFIG" meta="Edits apply live to the navigation and page copy around you">
              <div className="space-y-2">
                {(Object.keys(LABEL_ALTERNATIVES) as LabelKey[]).map((k) => (
                  <div key={k} className="rounded-md border border-border px-2.5 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs">
                        <span className="font-medium capitalize">{k}</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          LABEL_{k.toUpperCase()} · current: {labels[k]}
                        </span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {LABEL_ALTERNATIVES[k].map((alt) => (
                          <button
                            key={alt}
                            type="button"
                            onClick={() => setLabel(k, alt)}
                            className={`rounded-md border px-2 py-1 text-[11px] ${
                              labels[k] === alt ? "border-foreground/50 bg-muted font-medium" : "border-border hover:bg-muted"
                            }`}
                          >
                            {alt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Annotation className="mt-2">
                Screens render labels, never hardcoded terms. Guardrail: reserved regulatory terms
                (Marketplace as in the federal exchange, ICHRA, EDE) cannot be renamed.
              </Annotation>
            </WPanel>
          ) : null}

          {section === "SCR_MENU_CONFIG" ? (
            <WPanel title="Menu visibility" id="SCR_MENU_CONFIG" meta="Hide, order and rename module entries per workspace within guardrails">
              <div className="space-y-1.5">
                {MODULES.map((m) => {
                  const off = hidden.includes(m.id);
                  return (
                    <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-2.5 py-2">
                      <span className="text-xs">
                        <span className={off ? "text-muted-foreground line-through" : "font-medium"}>{m.label}</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          {m.id}{m.nested ? " · nested only" : ""}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setHidden((prev) => (off ? prev.filter((x) => x !== m.id) : [...prev, m.id]))
                        }
                        className="rounded-md border border-border px-2 py-1 text-[11px] hover:bg-muted"
                      >
                        {off ? "Show" : "Hide"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <Annotation className="mt-2">
                Hiding a menu entry never grants or revokes permission — ACL remains the source of
                truth. Guardrail: My Work and Admin cannot be hidden for admin roles.
              </Annotation>
            </WPanel>
          ) : null}

          {section === "SCR_WORKSPACE_CONFIG" ? (
            <WPanel title="Workspace configuration" id="SCR_WORKSPACE_CONFIG" meta="Enable workspaces, set their labels, default landing and module set">
              <div className="space-y-1.5">
                {WORKSPACES.map((w) => (
                  <div key={w.id} className="rounded-md border border-border px-2.5 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs">
                        <span className="font-medium">{w.name}</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">{w.id}</span>
                      </span>
                      <span className="flex gap-1.5">
                        <Pill>{w.kind === "external" ? "externally branded" : "unified shell"}</Pill>
                        <Pill>{w.modules.length || "—"} modules</Pill>
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {["Display label", "Default landing", "Entity types allowed"].map((f) => (
                        <div key={f} className="rounded-md border border-dashed border-border px-2 py-1.5">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{f}</p>
                          <WLine w="65%" className="mt-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Annotation className="mt-2">
                Workspaces are configuration, not separate applications. No hardcoded portals.
              </Annotation>
            </WPanel>
          ) : null}

          {section === "SCR_BRANDING_CONFIG" ? (
            <>
              <WPanel title="Branding & white labeling" id="SCR_BRANDING_CONFIG" meta="Far beyond a custom URL — fields only at this fidelity, no styling applied">
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Domain & subdomain",
                    "Logo (light / dark / favicon)",
                    "Colour palette",
                    "Typography",
                    "Header & footer content",
                    "Disclaimers",
                    "Legal text & privacy",
                    "Contact information",
                    "Support links",
                    "Marketing copy blocks",
                    "Terminology overrides",
                    "Email & SMS template branding",
                    "Document & output template branding",
                    "Notification sender identity",
                  ].map((f) => (
                    <div key={f} className="rounded-md border border-border px-2.5 py-2">
                      <p className="text-[11px] text-muted-foreground">{f}</p>
                      <WLine w="70%" className="mt-1.5" />
                    </div>
                  ))}
                </div>
              </WPanel>
              <WPanel title="Brand scope & inheritance" id="SCR_BRANDING_SCOPE" meta="Tenant → marketplace → agency → downline, with per-level override rules">
                <WRow trailing={<Pill>Inherited</Pill>} />
                <WRow trailing={<Pill>Overridden</Pill>} />
                <WRow trailing={<Pill>Locked by parent</Pill>} />
                <Annotation className="mt-2">
                  Applies to the consumer marketplace and member workspace as well as internal chrome.
                </Annotation>
              </WPanel>
            </>
          ) : null}

          {section === "SCR_FLAGS_CONFIG" ? (
            <WPanel title="Feature flags" id="SCR_FLAGS_CONFIG" meta="Scope-aware switches; turning one off removes the surface entirely">
              <div className="space-y-1.5">
                {FEATURE_FLAGS.map((f, i) => (
                  <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-2.5 py-2">
                    <span className="text-xs">
                      <span className="font-medium">{f.label}</span>
                      <span className="block font-mono text-[10px] text-muted-foreground">
                        {f.id} · {f.scope} · {f.note}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFlags((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                      className="rounded-md border border-border px-2 py-1 text-[11px] hover:bg-muted"
                    >
                      {flags[i] ? "On" : "Off"}
                    </button>
                  </div>
                ))}
              </div>
              <Annotation className="mt-2">
                Module 1 flags (Plan O, shared quote, EDE handoff) are read-only here in this batch to
                avoid reopening active Module 1 behaviour.
              </Annotation>
            </WPanel>
          ) : null}

          {section === "SCR_HELP_CONFIG" ? (
            <>
              <WPanel title="Help & FAQ configuration" id="SCR_HELP_CONFIG" meta="Authors the right drawer Guidance and Help tabs and the assistant FAQ set">
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Page guidance per screen ID",
                    "FAQ entries per module",
                    "Assistant knowledge scope",
                    "Escalation to human support",
                    "Tone & disclaimer text",
                    "Publish / draft state",
                  ].map((f) => (
                    <div key={f} className="rounded-md border border-border px-2.5 py-2">
                      <p className="text-[11px] text-muted-foreground">{f}</p>
                      <WLine w="70%" className="mt-1.5" />
                    </div>
                  ))}
                </div>
                <Annotation className="mt-2">
                  Content is keyed to stable screen IDs, so guidance survives layout changes. Open the
                  drawer or assistant to see where these entries land.
                </Annotation>
              </WPanel>
              <WPanel title="Content by screen" id="SCR_HELP_INDEX">
                {["SHELL_MAP", "SCR_MY_WORK", "SCR_DASHBOARD", "PATTERN_OBJECT_PAGE", "SCR_ADMIN_HOME"].map(
                  (id) => (
                    <div key={id} className="flex items-center justify-between gap-2 border-b border-border/60 py-2 last:border-b-0">
                      <IdChip>{id}</IdChip>
                      <WLine w="45%" />
                      <Pill>Edit</Pill>
                    </div>
                  ),
                )}
              </WPanel>
            </>
          ) : null}

          <AclNote>
            Admin surfaces are visible only to roles with configure permission, and each admin can
            only configure their own entity subtree — an {labels.agency.toLowerCase()} admin cannot
            change platform guardrails, reserved labels, or another {labels.agency.toLowerCase()}&apos;s
            branding. Every change is versioned, attributed and audited.
          </AclNote>
        </div>
      </div>
    </AppShell>
  );
}
