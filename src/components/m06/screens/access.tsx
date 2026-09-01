import { useMemo, useState } from "react";

import { Section, Stat, Table, Tag } from "@/components/lucie/ui";
import {
  Btn,
  Field,
  fmtDateTime,
  PendingM00,
  Picker,
  QueryBlock,
  StateBlock,
  StatusTag,
  TextInput,
  Toast,
  type Tone,
} from "@/components/m06/kit";
import {
  DefinitionCard,
  FilterBar,
  PersonPicker,
  TextFilter,
  useProfiles,
  useTextFilter,
  type M06ScreenProps,
} from "@/components/m06/screens/common";
import { useM06Query, useM06Record } from "@/lib/m06/use-m06";

/**
 * Roles are owned by M00. Everything on these screens is either an observable
 * grant read back from the server, or an explicitly draft artefact that cannot
 * be activated until the custom-role and effective-access deltas are approved.
 */

const PERMISSION_GROUPS: { group: string; permissions: string[] }[] = [
  {
    group: "Roster",
    permissions: [
      "workforce.profile.read",
      "workforce.profile.create",
      "workforce.profile.update",
      "workforce.profile.lifecycle",
      "workforce.roster.export",
      "workforce.roster.import",
    ],
  },
  {
    group: "Structure",
    permissions: ["group.read", "group.manage", "membership.manage", "assignment.read"],
  },
  {
    group: "Operating posture",
    permissions: ["availability.manage", "servicescope.manage", "readiness.read", "readiness.evaluate"],
  },
  {
    group: "Governance",
    permissions: ["exception.read", "exception.manage", "duplicate.review", "identity.link.review", "audit.read"],
  },
  {
    group: "Agency",
    permissions: ["agency.profile.read", "agency.profile.manage", "notification.read", "support.context.manage"],
  },
];

const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions);

interface RoleDef {
  code: string;
  name: string;
  kind: "SYSTEM" | "CUSTOM";
  version: number;
  status: string;
  scope: string;
  description: string;
  permissions: string[];
  assigned: number;
}

/** Sample catalogue — illustrative, not the authoritative M00 role registry. */
const SAMPLE_ROLES: RoleDef[] = [
  {
    code: "AGENCY_ADMINISTRATOR",
    name: "Agency Administrator",
    kind: "SYSTEM",
    version: 4,
    status: "ACTIVE",
    scope: "Organization",
    description: "Runs the roster, structure and lifecycle for one agency organization.",
    permissions: ALL_PERMISSIONS.filter((p) => !p.startsWith("support")),
    assigned: 3,
  },
  {
    code: "AGENCY_OPERATIONS",
    name: "Agency Operations",
    kind: "SYSTEM",
    version: 2,
    status: "ACTIVE",
    scope: "Business unit",
    description: "Day-to-day roster maintenance without lifecycle or role authority.",
    permissions: [
      "workforce.profile.read",
      "workforce.profile.update",
      "group.read",
      "membership.manage",
      "readiness.read",
      "exception.read",
      "agency.profile.read",
    ],
    assigned: 6,
  },
  {
    code: "TEAM_LEAD",
    name: "Team Lead",
    kind: "SYSTEM",
    version: 3,
    status: "ACTIVE",
    scope: "Team",
    description: "Sees and supports only the people in their own team.",
    permissions: ["workforce.profile.read", "group.read", "readiness.read", "availability.manage"],
    assigned: 4,
  },
  {
    code: "AGENT_SELF",
    name: "Agent (self service)",
    kind: "SYSTEM",
    version: 5,
    status: "ACTIVE",
    scope: "Self",
    description: "An agent's view of their own record, tasks and availability.",
    permissions: ["workforce.profile.read", "availability.manage", "readiness.read"],
    assigned: 9,
  },
  {
    code: "MEDICARE_DESK_LEAD",
    name: "Medicare Desk Lead",
    kind: "CUSTOM",
    version: 2,
    status: "DRAFT",
    scope: "Team",
    description: "Draft custom role for the Medicare Advantage desk. Cannot be assigned yet.",
    permissions: [
      "workforce.profile.read",
      "group.read",
      "membership.manage",
      "readiness.read",
      "readiness.evaluate",
      "exception.read",
    ],
    assigned: 0,
  },
];

const ROLE_VERSIONS: Record<string, Record<number, string[]>> = {
  MEDICARE_DESK_LEAD: {
    1: ["workforce.profile.read", "group.read", "readiness.read"],
    2: SAMPLE_ROLES.find((r) => r.code === "MEDICARE_DESK_LEAD")!.permissions,
  },
  AGENCY_OPERATIONS: {
    1: ["workforce.profile.read", "group.read", "readiness.read", "agency.profile.read"],
    2: SAMPLE_ROLES.find((r) => r.code === "AGENCY_OPERATIONS")!.permissions,
  },
};

const M00_BLOCKERS = ["DELTA-M06-M00-003", "DELTA-M06-M00-005", "DELTA-M06-M00-007"];

function useToast() {
  const [msg, setMsg] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  return { msg, tone, show: (m: string, t: Tone = "info") => (setMsg(m), setTone(t)) };
}

/* ============================ SCR-M06-008 ============================ */

export function RolesAndAccessHome({ call }: M06ScreenProps) {
  const grants = useM06Query<{ permission_grant_id: string; permission: string; scope_type: string }>(
    call,
    "access.grant.list",
  );
  const { query, setQuery, filtered } = useTextFilter(SAMPLE_ROLES, (r) => [r.name, r.code, r.description]);

  return (
    <div className="space-y-5">
      <PendingM00 deltas={M00_BLOCKERS}>
        Roles, scoped assignment and effective access are M00 responsibilities. M06 can show the role
        catalogue and the grants it observes, but it will not evaluate access itself.
      </PendingM00>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="System roles" value={SAMPLE_ROLES.filter((r) => r.kind === "SYSTEM").length} />
        <Stat label="Custom drafts" value={SAMPLE_ROLES.filter((r) => r.kind === "CUSTOM").length} />
        <Stat label="Observable grants" value={grants.data.length} hint="Returned by the server" />
        <Stat label="Permission surface" value={ALL_PERMISSIONS.length} />
      </div>

      <Section title="Role catalogue">
        <FilterBar>
          <TextFilter value={query} onChange={setQuery} placeholder="Search roles" />
        </FilterBar>
        <Table
          rows={filtered}
          keyOf={(r) => r.code}
          columns={[
            { head: "Role", cell: (r) => <span className="font-medium text-foreground">{r.name}</span> },
            { head: "Kind", cell: (r) => <Tag tone={r.kind === "SYSTEM" ? "info" : "warn"}>{r.kind.toLowerCase()}</Tag> },
            { head: "Scope", cell: (r) => r.scope },
            { head: "Version", cell: (r) => `v${r.version}` },
            { head: "Status", cell: (r) => <StatusTag value={r.status} /> },
            { head: "Assigned", cell: (r) => r.assigned },
            { head: "Permissions", cell: (r) => r.permissions.length },
          ]}
        />
      </Section>

      <Section title="Grants the server can observe">
        <QueryBlock query={grants} empty="No grants are visible for this scope.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(g) => g.permission_grant_id}
              columns={[
                { head: "Permission", cell: (g) => <code className="text-[11px]">{g.permission}</code> },
                { head: "Scope type", cell: (g) => g.scope_type },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-009 ============================ */

export function SystemRoleDetail() {
  const systemRoles = SAMPLE_ROLES.filter((r) => r.kind === "SYSTEM");
  const [code, setCode] = useState(systemRoles[0].code);
  const role = systemRoles.find((r) => r.code === code)!;

  return (
    <div className="space-y-5">
      <Section title="System role">
        <FilterBar>
          <div className="w-72">
            <Field label="Role">
              <Picker
                value={code}
                onChange={setCode}
                options={systemRoles.map((r) => ({ value: r.code, label: r.name }))}
              />
            </Field>
          </div>
        </FilterBar>
        <p className="text-xs text-muted-foreground">
          System roles are versioned and read-only. To change what a role can do, publish a custom role
          instead of editing the system definition.
        </p>
      </Section>

      <DefinitionCard
        title={role.name}
        items={[
          { k: "Code", v: <code className="text-[11px]">{role.code}</code> },
          { k: "Version", v: `v${role.version}` },
          { k: "Status", v: <StatusTag value={role.status} /> },
          { k: "Scope", v: role.scope },
          { k: "Purpose", v: role.description },
          { k: "People assigned", v: role.assigned },
        ]}
      />

      <Section title="Permission matrix">
        <div className="grid gap-4 sm:grid-cols-2">
          {PERMISSION_GROUPS.map((g) => (
            <div key={g.group} className="rounded-xl border border-hairline p-3">
              <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {g.group}
              </p>
              <ul className="space-y-1">
                {g.permissions.map((p) => (
                  <li key={p} className="flex items-center justify-between gap-2 text-xs">
                    <code className="text-[11px] text-muted-foreground">{p}</code>
                    {role.permissions.includes(p) ? <Tag tone="good">granted</Tag> : <Tag>not granted</Tag>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-010 ============================ */

export function CustomRoleBuilder() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [scope, setScope] = useState("Team");
  const [base, setBase] = useState("TEAM_LEAD");
  const [selected, setSelected] = useState<string[]>(
    SAMPLE_ROLES.find((r) => r.code === "TEAM_LEAD")!.permissions,
  );

  function toggle(p: string) {
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
  }

  function applyBase(code: string) {
    setBase(code);
    setSelected(SAMPLE_ROLES.find((r) => r.code === code)?.permissions ?? []);
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <PendingM00 deltas={["DELTA-M06-M00-003", "DELTA-M06-M00-004"]}>
        A custom role can be drafted and reviewed here, but publishing it requires the versioned
        custom-role and agency-assignable permission metadata to exist in M00.
      </PendingM00>

      <Section title="Define the role">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Role name">
            <TextInput value={name} onChange={setName} placeholder="Retention Desk Lead" />
          </Field>
          <Field label="Assignment scope" hint="Scope is evaluated server-side, never inferred from the name">
            <Picker
              value={scope}
              onChange={setScope}
              options={["Organization", "Business unit", "Team", "Self"].map((s) => ({ value: s, label: s }))}
            />
          </Field>
          <Field label="Start from">
            <Picker
              value={base}
              onChange={applyBase}
              options={SAMPLE_ROLES.map((r) => ({ value: r.code, label: r.name }))}
            />
          </Field>
        </div>
      </Section>

      <Section title="Permissions" meta={`${selected.length} selected`}>
        <div className="grid gap-4 sm:grid-cols-2">
          {PERMISSION_GROUPS.map((g) => (
            <div key={g.group} className="rounded-xl border border-hairline p-3">
              <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {g.group}
              </p>
              <ul className="space-y-1.5">
                {g.permissions.map((p) => (
                  <li key={p}>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={selected.includes(p)}
                        onChange={() => toggle(p)}
                        className="size-3.5 rounded border-input"
                      />
                      <code className="text-[11px]">{p}</code>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn
            onClick={() =>
              toast.show(
                `Draft "${name || "Untitled role"}" saved locally with ${selected.length} permissions at ${scope} scope.`,
                "good",
              )
            }
          >
            Save draft
          </Btn>
          <Btn
            variant="primary"
            disabled
            title="Publishing is blocked until DELTA-M06-M00-003 is approved"
            onClick={() => undefined}
          >
            Publish version
          </Btn>
        </div>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-011 ============================ */

export function RoleVersionCompare() {
  const codes = Object.keys(ROLE_VERSIONS);
  const [code, setCode] = useState(codes[0]);
  const versions = ROLE_VERSIONS[code];
  const nums = Object.keys(versions).map(Number).sort((a, b) => a - b);
  const [left, setLeft] = useState(String(nums[0]));
  const [right, setRight] = useState(String(nums[nums.length - 1]));

  const l = versions[Number(left)] ?? [];
  const r = versions[Number(right)] ?? [];
  const added = r.filter((p) => !l.includes(p));
  const removed = l.filter((p) => !r.includes(p));
  const kept = r.filter((p) => l.includes(p));

  return (
    <div className="space-y-5">
      <Section title="Compare versions">
        <FilterBar>
          <div className="w-64">
            <Field label="Role">
              <Picker
                value={code}
                onChange={(v) => {
                  setCode(v);
                  const ns = Object.keys(ROLE_VERSIONS[v]).map(Number).sort((a, b) => a - b);
                  setLeft(String(ns[0]));
                  setRight(String(ns[ns.length - 1]));
                }}
                options={codes.map((c) => ({ value: c, label: SAMPLE_ROLES.find((r2) => r2.code === c)?.name ?? c }))}
              />
            </Field>
          </div>
          <div className="w-32">
            <Field label="From">
              <Picker value={left} onChange={setLeft} options={nums.map((n) => ({ value: String(n), label: `v${n}` }))} />
            </Field>
          </div>
          <div className="w-32">
            <Field label="To">
              <Picker value={right} onChange={setRight} options={nums.map((n) => ({ value: String(n), label: `v${n}` }))} />
            </Field>
          </div>
        </FilterBar>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Added" value={added.length} />
          <Stat label="Removed" value={removed.length} />
          <Stat label="Unchanged" value={kept.length} />
        </div>
      </Section>

      <Section title="Difference">
        <Table
          rows={[
            ...added.map((p) => ({ p, change: "ADDED" })),
            ...removed.map((p) => ({ p, change: "REMOVED" })),
            ...kept.map((p) => ({ p, change: "UNCHANGED" })),
          ]}
          keyOf={(row) => `${row.change}-${row.p}`}
          columns={[
            { head: "Permission", cell: (row) => <code className="text-[11px]">{row.p}</code> },
            {
              head: "Change",
              cell: (row) => (
                <Tag tone={row.change === "ADDED" ? "good" : row.change === "REMOVED" ? "stop" : "neutral"}>
                  {row.change.toLowerCase()}
                </Tag>
              ),
            },
            {
              head: "Effect on assignees",
              cell: (row) =>
                row.change === "REMOVED"
                  ? "Access is withdrawn immediately on publish"
                  : row.change === "ADDED"
                    ? "Available after reauthorization"
                    : "No change",
            },
          ]}
        />
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-012 ============================ */

export function RoleAssignments({ call }: M06ScreenProps) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const assignments = useM06Query<{
    work_assignment_context_id: string;
    display_name: string;
    business_unit: string | null;
    team: string | null;
    effective_from: string;
    effective_to: string | null;
  }>(call, "assignment.list");
  const [person, setPerson] = useState("");
  const [role, setRole] = useState(SAMPLE_ROLES[0].code);

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <PendingM00 deltas={["DELTA-M06-M00-005", "DELTA-M06-M00-006"]}>
        Scoped direct assignment and inherited business-unit or team assignment are M00 capabilities.
        Assignment intent can be captured, but nothing is granted from this screen.
      </PendingM00>

      <Section title="Propose an assignment">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_240px_auto] sm:items-end">
          <PersonPicker profiles={profiles.data} value={person} onChange={setPerson} label="Person" />
          <Field label="Role">
            <Picker value={role} onChange={setRole} options={SAMPLE_ROLES.map((r) => ({ value: r.code, label: r.name }))} />
          </Field>
          <Btn
            onClick={() =>
              toast.show(
                person
                  ? "Assignment intent recorded for review. It grants nothing until M00 evaluates the scoped assignment."
                  : "Choose a person first.",
                person ? "info" : "warn",
              )
            }
          >
            Record intent
          </Btn>
        </div>
      </Section>

      <Section title="Current work assignment context" meta="Derived from business unit and team placement">
        <QueryBlock query={assignments} empty="No assignment context recorded.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(a) => a.work_assignment_context_id}
              columns={[
                { head: "Person", cell: (a) => a.display_name },
                { head: "Business unit", cell: (a) => a.business_unit ?? "—" },
                { head: "Team", cell: (a) => a.team ?? "—" },
                { head: "From", cell: (a) => a.effective_from },
                { head: "Until", cell: (a) => a.effective_to ?? "open" },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-013 ============================ */

interface EffectiveAccess {
  actor: string;
  tenant_id: string;
  organization_id: string;
  platform_admin: boolean;
  observable_grants: { permission: string; scope_type: string; organization_id: string | null }[];
  authoritative: boolean;
  blocked_by: string;
}

export function EffectiveAccessInspector({ call }: M06ScreenProps) {
  const access = useM06Record<EffectiveAccess>(call, "access.effective");
  const a = access.record;
  const [filter, setFilter] = useState("");

  const grants = useMemo(
    () => (a?.observable_grants ?? []).filter((g) => g.permission.toLowerCase().includes(filter.toLowerCase())),
    [a, filter],
  );

  return (
    <div className="space-y-5">
      <PendingM00 deltas={["DELTA-M06-M00-007", "DELTA-M06-M00-008"]}>
        Authoritative effective-access evaluation and its explanation live in M00. What follows is the
        subset M06 can observe, and it is explicitly marked non-authoritative.
      </PendingM00>

      <StateBlock state={access.state} error={access.error} empty="No access context could be resolved.">
        {a ? (
          <DefinitionCard
            title="Evaluation context"
            items={[
              { k: "Actor", v: <code className="text-[11px]">{a.actor}</code> },
              { k: "Tenant", v: <code className="text-[11px]">{a.tenant_id}</code> },
              { k: "Organization", v: <code className="text-[11px]">{a.organization_id}</code> },
              { k: "Platform administrator", v: a.platform_admin ? "Yes (local development posture)" : "No" },
              {
                k: "Authoritative",
                v: a.authoritative ? <Tag tone="good">yes</Tag> : <Tag tone="warn">no — blocked by {a.blocked_by}</Tag>,
              },
            ]}
          />
        ) : null}
      </StateBlock>

      <Section title="Observable grants" meta={`${grants.length} shown`}>
        <FilterBar>
          <TextFilter value={filter} onChange={setFilter} placeholder="Filter by permission" />
        </FilterBar>
        {grants.length ? (
          <Table
            rows={grants}
            keyOf={(g) => `${g.permission}-${g.scope_type}`}
            columns={[
              { head: "Permission", cell: (g) => <code className="text-[11px]">{g.permission}</code> },
              { head: "Scope type", cell: (g) => g.scope_type },
              { head: "Organization", cell: (g) => g.organization_id ?? "all in tenant" },
            ]}
          />
        ) : (
          <p className="rounded-2xl border border-dashed border-hairline-strong/60 bg-surface/40 px-3 py-10 text-center text-xs text-muted-foreground">
            No grant rows are observable for this actor and scope.
          </p>
        )}
      </Section>

      <Section title="How a decision is reached">
        <ol className="list-decimal space-y-1.5 pl-5 text-xs text-muted-foreground">
          <li>The request must carry an authenticated actor.</li>
          <li>Tenant and organization must each resolve to exactly one value; ambiguity is denied outright.</li>
          <li>The operation is mapped to a permission code — never to a literal role name.</li>
          <li>The permission is checked against grants in scope before any row is read or written.</li>
          <li>A change to access invalidates existing sessions rather than waiting for them to expire.</li>
        </ol>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-014 ============================ */

export function AccessAudit({ call }: M06ScreenProps) {
  const events = useM06Query<{ event_id: string; event_name: string; aggregate_type: string; aggregate_id: string; occurred_at: string; actor_id: string | null }>(
    call,
    "outbox.list",
  );
  const support = useM06Query<{ support_context_id: string; mode: string; reason: string; created_at: string; expires_at: string }>(
    call,
    "support.list",
  );
  const [kind, setKind] = useState("");

  const rows = events.data.filter((e) => !kind || e.event_name.includes(kind));

  return (
    <div className="space-y-5">
      <Section title="Access and change audit" meta={`${rows.length} events`}>
        <FilterBar>
          <div className="w-60">
            <Field label="Event family">
              <Picker
                value={kind}
                onChange={setKind}
                options={[
                  { value: "", label: "All events" },
                  { value: "workforce_profile", label: "Workforce profile" },
                  { value: "lifecycle", label: "Lifecycle" },
                  { value: "group", label: "Groups" },
                  { value: "identity", label: "Identity" },
                  { value: "support_context", label: "Support context" },
                ]}
              />
            </Field>
          </div>
        </FilterBar>
        <QueryBlock query={events} empty="No events recorded yet.">
          {() => (
            <Table
              rows={rows}
              keyOf={(e) => e.event_id}
              columns={[
                { head: "When", cell: (e) => fmtDateTime(e.occurred_at) },
                { head: "Event", cell: (e) => <code className="text-[11px]">{e.event_name}</code> },
                { head: "Object", cell: (e) => e.aggregate_type },
                { head: "Reference", cell: (e) => e.aggregate_id.slice(0, 8) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      <Section title="Elevated support sessions">
        <QueryBlock query={support} empty="No support context has been opened.">
          {(sRows) => (
            <Table
              rows={sRows}
              keyOf={(s) => s.support_context_id}
              columns={[
                { head: "Opened", cell: (s) => fmtDateTime(s.created_at) },
                { head: "Mode", cell: (s) => <StatusTag value={s.mode} /> },
                { head: "Reason", cell: (s) => s.reason },
                { head: "Expires", cell: (s) => fmtDateTime(s.expires_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}
