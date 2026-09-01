import { useMemo, useState } from "react";
import { BadgeCheck, CalendarClock, CheckSquare, ShieldCheck } from "lucide-react";

import { KpiCard } from "@/components/abox/kpi-card";

import { Section, Stat, Table, Tag } from "@/components/lucie/ui";
import {
  Btn,
  Field,
  fmtDate,
  fmtDateTime,
  OwnedElsewhere,
  PendingM00,
  Picker,
  QueryBlock,
  Sheet,
  StateBlock,
  StatusTag,
  TextArea,
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
  type Profile,
} from "@/components/m06/screens/common";
import { describeResult, useM06Context, useM06Query, useM06Record } from "@/lib/m06/use-m06";

const CATEGORIES = ["AGENT", "AGENCY_STAFF", "UNLICENSED_STAFF", "PRINCIPAL"];
const CAPTIVITY = ["UNSPECIFIED", "INDEPENDENT", "CAPTIVE", "SEMI_CAPTIVE"];

function useToast() {
  const [msg, setMsg] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  return {
    msg,
    tone,
    show: (m: string, t: Tone = "info") => {
      setMsg(m);
      setTone(t);
    },
    clear: () => setMsg(""),
  };
}

/* ============================ SCR-M06-001 ============================ */

export function AgencyAdministrationHome({ call }: M06ScreenProps) {
  const profiles = useProfiles(call);
  const readiness = useM06Query<{ readiness_state: string; operational_eligibility: string }>(
    call,
    "readiness.list",
  );
  const exceptions = useM06Query<{ exception_id: string; code: string; summary: string; status: string; risk_level: string; created_at: string }>(
    call,
    "exception.list",
  );
  const cases = useM06Query<{ case_id: string; case_type: string; status: string; scheduled_for: string | null; blocking_reasons: string[] }>(
    call,
    "workforce.lifecycle.case.list",
  );
  const duplicates = useM06Query<{ duplicate_candidate_id: string; status: string }>(call, "duplicate.list");

  const active = profiles.data.filter((p) => p.status === "ACTIVE").length;
  const rosterOnly = profiles.data.filter((p) => p.roster_only).length;
  const ready = readiness.data.filter((r) => r.readiness_state === "READY").length;
  const openExceptions = exceptions.data.filter((e) => e.status !== "RESOLVED");
  const openCases = cases.data.filter((c) => c.status !== "COMPLETED");

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="People on roster" value={profiles.data.length} hint="Within this organization" />
        <Stat label="Active" value={active} />
        <Stat label="Ready to work" value={ready} hint="Readiness evaluated" />
        <Stat label="Roster only" value={rosterOnly} hint="No linked account" />
        <Stat label="Open exceptions" value={openExceptions.length} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Work queue" meta={`${openCases.length} open`}>
          <QueryBlock query={cases} empty="No lifecycle work is open.">
            {() => (
              <Table
                rows={openCases}
                keyOf={(c) => c.case_id}
                columns={[
                  { head: "Case", cell: (c) => c.case_type.replaceAll("_", " ").toLowerCase() },
                  { head: "Status", cell: (c) => <StatusTag value={c.status} /> },
                  { head: "Scheduled", cell: (c) => fmtDate(c.scheduled_for) },
                  {
                    head: "Blocking",
                    cell: (c) =>
                      c.blocking_reasons?.length ? (
                        <Tag tone="stop">{c.blocking_reasons.length} blocker(s)</Tag>
                      ) : (
                        <Tag tone="good">clear</Tag>
                      ),
                  },
                ]}
              />
            )}
          </QueryBlock>
        </Section>

        <Section title="Exceptions needing attention">
          <QueryBlock query={exceptions} empty="No exceptions raised.">
            {() => (
              <Table
                rows={openExceptions}
                keyOf={(e) => e.exception_id}
                columns={[
                  { head: "Code", cell: (e) => e.code },
                  { head: "Summary", cell: (e) => e.summary },
                  { head: "Risk", cell: (e) => <StatusTag value={e.risk_level} /> },
                  { head: "Raised", cell: (e) => fmtDate(e.created_at) },
                ]}
              />
            )}
          </QueryBlock>
        </Section>
      </div>

      <Section title="Attention signals">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Duplicate reviews open"
            value={duplicates.data.filter((d) => d.status !== "RESOLVED").length}
          />
          <Stat
            label="Operationally ineligible"
            value={readiness.data.filter((r) => r.operational_eligibility === "OPERATIONALLY_INELIGIBLE").length}
          />
          <Stat
            label="Ready with limitations"
            value={readiness.data.filter((r) => r.readiness_state === "READY_WITH_LIMITATIONS").length}
          />
        </div>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-002 ============================ */

export function AgencyRoster({ call }: M06ScreenProps) {
  const profiles = useProfiles(call);
  const readiness = useM06Query<{ workforce_profile_id: string; readiness_state: string }>(call, "readiness.list");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);
  const { query, setQuery, filtered } = useTextFilter<Profile>(profiles.data, (p) => [
    p.display_name,
    p.work_email,
    p.npn,
    p.external_reference,
  ]);

  const readyBy = useMemo(
    () => new Map(readiness.data.map((r) => [r.workforce_profile_id, r.readiness_state])),
    [readiness.data],
  );

  const rows = filtered.filter(
    (p) => (!category || p.person_category === category) && (!status || p.status === status),
  );

  return (
    <div className="space-y-5">
      <Section title="Roster" meta={`${rows.length} of ${profiles.data.length}`}>
        <FilterBar>
          <TextFilter value={query} onChange={setQuery} placeholder="Search name, email, NPN or reference" />
          <div className="w-44">
            <Field label="Category">
              <Picker
                value={category}
                onChange={setCategory}
                options={[{ value: "", label: "All categories" }, ...CATEGORIES.map((c) => ({ value: c, label: c.replaceAll("_", " ").toLowerCase() }))]}
              />
            </Field>
          </div>
          <div className="w-40">
            <Field label="Status">
              <Picker
                value={status}
                onChange={setStatus}
                options={[
                  { value: "", label: "All statuses" },
                  ...["ACTIVE", "PENDING", "SUSPENDED", "INACTIVE"].map((s) => ({ value: s, label: s.toLowerCase() })),
                ]}
              />
            </Field>
          </div>
        </FilterBar>

        <QueryBlock query={profiles} empty="No one has been added to this roster yet.">
          {() => (
            <Table
              rows={rows}
              keyOf={(p) => p.workforce_profile_id}
              columns={[
                {
                  head: "Person",
                  cell: (p) => (
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      className="text-left font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {p.display_name}
                    </button>
                  ),
                },
                { head: "Category", cell: (p) => p.person_category.replaceAll("_", " ").toLowerCase() },
                { head: "Status", cell: (p) => <StatusTag value={p.status} /> },
                { head: "Captivity", cell: (p) => p.captivity.replaceAll("_", " ").toLowerCase() },
                { head: "Readiness", cell: (p) => <StatusTag value={readyBy.get(p.workforce_profile_id) ?? null} /> },
                { head: "Account", cell: (p) => (p.roster_only ? <Tag tone="warn">roster only</Tag> : <Tag tone="good">linked</Tag>) },
                { head: "NPN", cell: (p) => p.npn ?? "—" },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      <Sheet
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.display_name ?? ""}
        subtitle={
          selected ? (
            <>
              <StatusTag value={selected.status} />
              <span>{selected.person_category.replaceAll("_", " ").toLowerCase()}</span>
            </>
          ) : null
        }
      >
        {selected ? <ProfileBody call={call} profileId={selected.workforce_profile_id} /> : null}
      </Sheet>
    </div>
  );
}

/* ============================ SCR-M06-003 ============================ */

export function AgentProfile({ call, ctx }: M06ScreenProps) {
  const profiles = useProfiles(call);
  const [id, setId] = useState("");
  const chosen = id || profiles.data[0]?.workforce_profile_id || "";

  return (
    <div className="space-y-5">
      <Section title="Select a person">
        <FilterBar>
          <PersonPicker profiles={profiles.data} value={chosen} onChange={setId} />
        </FilterBar>
        <StateBlock state={profiles.state} error={profiles.error} empty="No profiles in scope.">
          <p className="text-xs text-muted-foreground">
            The profile below is assembled from M06 canonical objects plus read-only projections from
            the modules that own licensing, credentials and marketplace routes.
          </p>
        </StateBlock>
      </Section>
      {chosen ? <ProfileBody call={call} profileId={chosen} ctx={ctx} full /> : null}
    </div>
  );
}

function ProfileBody({
  call,
  profileId,
  full,
}: {
  call: M06ScreenProps["call"];
  profileId: string;
  ctx?: M06ScreenProps["ctx"];
  full?: boolean;
}) {
  const toast = useToast();
  const profile = useM06Record<Profile>(call, "workforce.profile.get", { workforce_profile_id: profileId });
  const affiliations = useM06Query<{ affiliation_id: string; status: string; captivity: string; is_primary: boolean; effective_from: string; effective_to: string | null }>(
    call,
    "affiliation.list",
    { workforce_profile_id: profileId },
  );
  const memberships = useM06Query<{ membership_id: string; group_name: string; group_type: string; is_lead: boolean; effective_to: string | null }>(
    call,
    "membership.list",
    { workforce_profile_id: profileId },
  );
  const scopes = useM06Query<{ service_scope_id: string; state_code: string; product_lines: string[]; status: string }>(
    call,
    "servicescope.list",
    { workforce_profile_id: profileId },
  );
  const notes = useM06Query<{ note_id: string; body: string; audience: string; created_at: string }>(
    call,
    "note.list",
    { workforce_profile_id: profileId },
  );
  const docs = useM06Query<{ document_reference_id: string; document_kind: string; owner_module: string; status: string }>(
    call,
    "document.list",
    { subject_id: profileId },
  );
  const history = useM06Query<{ history_entry_id: string; change_kind: string; summary: string; occurred_at: string }>(
    call,
    "history.list",
    { subject_id: profileId },
  );

  const [note, setNote] = useState("");
  const [audience, setAudience] = useState("AGENCY_VISIBLE");

  const p = profile.record;

  async function addNote() {
    if (!note.trim()) return toast.show("A note needs a body.", "warn");
    const res = await call("note.add", { workforce_profile_id: profileId, body: note, audience });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setNote("");
      notes.reload();
    }
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <StateBlock state={profile.state} error={profile.error} empty="Profile not found in this scope.">
        {p ? (
          <DefinitionCard
            title="Identity and contact"
            items={[
              { k: "Display name", v: p.display_name },
              { k: "Legal name", v: [p.legal_first_name, p.legal_last_name].filter(Boolean).join(" ") || "—" },
              { k: "Category", v: p.person_category.replaceAll("_", " ").toLowerCase() },
              { k: "Status", v: <StatusTag value={p.status} /> },
              { k: "Captivity", v: p.captivity.replaceAll("_", " ").toLowerCase() },
              { k: "Work email", v: p.work_email ?? "—" },
              { k: "Work phone", v: p.work_phone ?? "—" },
              { k: "NPN", v: p.npn ?? "—" },
              { k: "External reference", v: p.external_reference ?? "—" },
              { k: "Invitation", v: <StatusTag value={p.invitation_disposition} /> },
              {
                k: "Account linkage",
                v: p.roster_only ? "Roster only — no identity account linked" : "Linked to an identity account",
              },
              { k: "Record version", v: `v${p.version} · effective ${fmtDate(p.effective_from)}` },
            ]}
          />
        ) : null}
      </StateBlock>

      <Section title="Affiliations" meta="M06 canonical">
        <QueryBlock query={affiliations} empty="No affiliation recorded.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(a) => a.affiliation_id}
              columns={[
                { head: "Status", cell: (a) => <StatusTag value={a.status} /> },
                { head: "Captivity", cell: (a) => a.captivity.replaceAll("_", " ").toLowerCase() },
                { head: "Primary", cell: (a) => (a.is_primary ? "Yes" : "No") },
                { head: "From", cell: (a) => fmtDate(a.effective_from) },
                { head: "To", cell: (a) => fmtDate(a.effective_to) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      <Section title="Business unit and team placement">
        <QueryBlock query={memberships} empty="Not placed in a business unit or team.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(m) => m.membership_id}
              columns={[
                { head: "Group", cell: (m) => m.group_name },
                { head: "Type", cell: (m) => m.group_type.replaceAll("_", " ").toLowerCase() },
                { head: "Lead", cell: (m) => (m.is_lead ? <Tag tone="good">lead</Tag> : "—") },
                { head: "Ended", cell: (m) => fmtDate(m.effective_to) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      <Section title="Service scope">
        <QueryBlock query={scopes} empty="No states in service scope.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(s) => s.service_scope_id}
              columns={[
                { head: "State", cell: (s) => s.state_code },
                { head: "Product lines", cell: (s) => s.product_lines?.join(", ") || "—" },
                { head: "Status", cell: (s) => <StatusTag value={s.status} /> },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      {full ? (
        <>
          <Section title="Credential and licence documents">
            <OwnedElsewhere module="M08 and M13">
              Licences, appointments and credential files are surfaced here as references only.
            </OwnedElsewhere>
            <div className="mt-3">
              <QueryBlock query={docs} empty="No document references projected for this person.">
                {(rows) => (
                  <Table
                    rows={rows}
                    keyOf={(d) => d.document_reference_id}
                    columns={[
                      { head: "Document", cell: (d) => d.document_kind.replaceAll("_", " ").toLowerCase() },
                      { head: "Owner", cell: (d) => d.owner_module },
                      { head: "Status", cell: (d) => <StatusTag value={d.status} /> },
                    ]}
                  />
                )}
              </QueryBlock>
            </div>
          </Section>

          <Section title="History">
            <QueryBlock query={history} empty="No recorded changes.">
              {(rows) => (
                <Table
                  rows={rows}
                  keyOf={(h) => h.history_entry_id}
                  columns={[
                    { head: "When", cell: (h) => fmtDateTime(h.occurred_at) },
                    { head: "Change", cell: (h) => h.change_kind.replaceAll("_", " ").toLowerCase() },
                    { head: "Summary", cell: (h) => h.summary },
                  ]}
                />
              )}
            </QueryBlock>
          </Section>
        </>
      ) : null}

      <Section title="Notes">
        <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-end">
          <Field label="New note">
            <TextArea value={note} onChange={setNote} placeholder="Context for whoever picks this up next…" rows={2} />
          </Field>
          <Field label="Audience">
            <Picker
              value={audience}
              onChange={setAudience}
              options={[
                { value: "AGENCY_VISIBLE", label: "Agency visible" },
                { value: "ME_ONLY", label: "Me only" },
                { value: "JET_ONLY", label: "Platform only" },
              ]}
            />
          </Field>
          <Btn variant="primary" onClick={addNote}>
            Add note
          </Btn>
        </div>
        <QueryBlock query={notes} empty="No notes yet.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(n) => n.note_id}
              columns={[
                { head: "When", cell: (n) => fmtDateTime(n.created_at) },
                { head: "Audience", cell: (n) => <Tag tone="info">{n.audience.replaceAll("_", " ").toLowerCase()}</Tag> },
                { head: "Note", cell: (n) => n.body },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-004 / 034 ====================== */

interface AgencyProfileRecord {
  operating_name: string | null;
  captivity_default: string;
  service_states: string[];
  defaults: Record<string, unknown>;
}

export function AgencyProfile({ call }: M06ScreenProps) {
  const agency = useM06Record<AgencyProfileRecord>(call, "agency.profile.get");
  const projections = useM06Query<{ upstream_projection_id: string; owner_module: string; object_type: string; summary: string; observed_at: string }>(
    call,
    "projection.list",
  );
  const a = agency.record;

  return (
    <div className="space-y-5">
      <StateBlock state={agency.state} error={agency.error} empty="No operational profile recorded for this organization.">
        {a ? (
          <DefinitionCard
            title="Operational profile"
            items={[
              { k: "Operating name", v: a.operating_name ?? "—" },
              { k: "Default captivity", v: a.captivity_default.replaceAll("_", " ").toLowerCase() },
              { k: "Service states", v: a.service_states?.join(", ") || "—" },
              { k: "Default team", v: String(a.defaults?.["default_team"] ?? "—") },
              { k: "Invitation policy", v: String(a.defaults?.["invitation_policy"] ?? "—") },
            ]}
          />
        ) : null}
      </StateBlock>

      <Section title="Organization record">
        <OwnedElsewhere module="M05">
          Legal entity, offices and organization hierarchy are owned upstream; M06 stores only the
          operational overlay above.
        </OwnedElsewhere>
        <div className="mt-3">
          <QueryBlock query={projections} empty="No upstream projections cached.">
            {(rows) => (
              <Table
                rows={rows}
                keyOf={(r) => r.upstream_projection_id}
                columns={[
                  { head: "Owner", cell: (r) => r.owner_module },
                  { head: "Object", cell: (r) => r.object_type },
                  { head: "Summary", cell: (r) => r.summary },
                  { head: "Observed", cell: (r) => fmtDateTime(r.observed_at) },
                ]}
              />
            )}
          </QueryBlock>
        </div>
      </Section>
    </div>
  );
}

export function AgencyDefaults({ call }: M06ScreenProps) {
  const toast = useToast();
  const agency = useM06Record<AgencyProfileRecord>(call, "agency.profile.get");
  const [name, setName] = useState("");
  const [captivity, setCaptivity] = useState("");
  const [states, setStates] = useState("");
  const [team, setTeam] = useState("");
  const [policy, setPolicy] = useState("");
  const a = agency.record;

  async function save() {
    const res = await call("agency.profile.upsert", {
      operating_name: name || a?.operating_name,
      captivity_default: captivity || a?.captivity_default || "UNSPECIFIED",
      service_states: (states || (a?.service_states ?? []).join(","))
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      defaults: {
        ...(team ? { default_team: team } : {}),
        ...(policy ? { invitation_policy: policy } : {}),
      },
    });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) agency.reload();
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section
        title="Agency defaults"
        description="Defaults pre-fill the add-person wizards and the roster import. They never override an explicit value on a person."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Operating name">
            <TextInput value={name} onChange={setName} placeholder={a?.operating_name ?? "Agency operating name"} />
          </Field>
          <Field label="Default captivity">
            <Picker
              value={captivity || a?.captivity_default || "UNSPECIFIED"}
              onChange={setCaptivity}
              options={CAPTIVITY.map((c) => ({ value: c, label: c.replaceAll("_", " ").toLowerCase() }))}
            />
          </Field>
          <Field label="Service states" hint="Comma separated two-letter codes">
            <TextInput value={states} onChange={setStates} placeholder={(a?.service_states ?? []).join(", ")} />
          </Field>
          <Field label="Default team">
            <TextInput value={team} onChange={setTeam} placeholder={String(a?.defaults?.["default_team"] ?? "")} />
          </Field>
          <Field label="Invitation policy">
            <Picker
              value={policy || String(a?.defaults?.["invitation_policy"] ?? "MANUAL_REVIEW")}
              onChange={setPolicy}
              options={[
                { value: "MANUAL_REVIEW", label: "Manual review" },
                { value: "AUTO_INVITE", label: "Auto invite on add" },
                { value: "NO_INVITE", label: "Never invite" },
              ]}
            />
          </Field>
        </div>
        <div className="mt-4 flex gap-2">
          <Btn variant="primary" onClick={save}>
            Save defaults
          </Btn>
        </div>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-005 / 006 ====================== */

export function AddPersonWizard({ call, staff }: M06ScreenProps & { staff?: boolean }) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const groups = useM06Query<{ group_id: string; name: string; group_type: string }>(call, "group.list");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    display_name: "",
    legal_first_name: "",
    legal_last_name: "",
    work_email: "",
    work_phone: "",
    npn: "",
    person_category: staff ? "AGENCY_STAFF" : "AGENT",
    captivity: "INDEPENDENT",
    group_id: "",
    state_code: "",
    product_lines: "",
    roster_only: "true",
  });
  const [created, setCreated] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const steps = staff
    ? ["Person", "Placement", "Review"]
    : ["Person", "Selling posture", "Placement", "Review"];

  const dupHint = useMemo(() => {
    const email = form.work_email.trim().toLowerCase();
    const npn = form.npn.trim();
    return profiles.data.filter(
      (p) =>
        (email && p.work_email?.toLowerCase() === email) ||
        (npn && p.npn === npn) ||
        (form.display_name && p.display_name.toLowerCase() === form.display_name.trim().toLowerCase()),
    );
  }, [profiles.data, form.work_email, form.npn, form.display_name]);

  async function submit() {
    if (!form.display_name.trim()) return toast.show("A display name is required.", "warn");
    const res = await call("workforce.profile.create", {
      display_name: form.display_name,
      legal_first_name: form.legal_first_name || null,
      legal_last_name: form.legal_last_name || null,
      work_email: form.work_email || null,
      work_phone: form.work_phone || null,
      npn: staff ? null : form.npn || null,
      person_category: form.person_category,
      captivity: staff ? "UNSPECIFIED" : form.captivity,
      roster_only: form.roster_only === "true",
    });
    if (!res.ok) return toast.show(describeResult(res), "stop");
    const id = (res.data as { workforce_profile_id: string }).workforce_profile_id;
    setCreated(id);
    await call("affiliation.create", {
      workforce_profile_id: id,
      captivity: staff ? "UNSPECIFIED" : form.captivity,
      is_primary: true,
    });
    if (form.group_id) await call("membership.add", { group_id: form.group_id, workforce_profile_id: id });
    if (!staff && form.state_code) {
      await call("servicescope.set", {
        workforce_profile_id: id,
        state_code: form.state_code,
        product_lines: form.product_lines.split(",").map((s) => s.trim()).filter(Boolean),
      });
    }
    await call("readiness.evaluate", { workforce_profile_id: id });
    profiles.reload();
    toast.show("Person added, affiliation opened and readiness evaluated.", "good");
    setStep(steps.length);
  }

  const last = steps.length - 1;

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section title={staff ? "Add staff" : "Add agent"} meta={step <= last ? `Step ${step + 1} of ${steps.length}` : "Complete"}>
        <ol className="mb-5 flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <li key={s}>
              <Tag tone={i === step ? "info" : i < step ? "good" : "neutral"}>
                {i + 1}. {s}
              </Tag>
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Display name">
              <TextInput value={form.display_name} onChange={set("display_name")} placeholder="Dana Whitfield" />
            </Field>
            <Field label="Category">
              <Picker
                value={form.person_category}
                onChange={set("person_category")}
                options={(staff ? ["AGENCY_STAFF", "UNLICENSED_STAFF", "PRINCIPAL"] : ["AGENT", "PRINCIPAL"]).map((c) => ({
                  value: c,
                  label: c.replaceAll("_", " ").toLowerCase(),
                }))}
              />
            </Field>
            <Field label="Legal first name">
              <TextInput value={form.legal_first_name} onChange={set("legal_first_name")} />
            </Field>
            <Field label="Legal last name">
              <TextInput value={form.legal_last_name} onChange={set("legal_last_name")} />
            </Field>
            <Field label="Work email">
              <TextInput value={form.work_email} onChange={set("work_email")} type="email" />
            </Field>
            <Field label="Work phone">
              <TextInput value={form.work_phone} onChange={set("work_phone")} />
            </Field>
            {dupHint.length ? (
              <div className="sm:col-span-2">
                <Toast
                  tone="warn"
                  message={`Possible duplicate: ${dupHint.map((d) => d.display_name).join(", ")}. Continuing will raise a duplicate review rather than silently merging.`}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {!staff && step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="National Producer Number">
              <TextInput value={form.npn} onChange={set("npn")} placeholder="e.g. 18820431" />
            </Field>
            <Field label="Captivity">
              <Picker
                value={form.captivity}
                onChange={set("captivity")}
                options={CAPTIVITY.map((c) => ({ value: c, label: c.replaceAll("_", " ").toLowerCase() }))}
              />
            </Field>
            <Field label="Service state" hint="Two-letter code">
              <TextInput value={form.state_code} onChange={set("state_code")} placeholder="TX" />
            </Field>
            <Field label="Product lines" hint="Comma separated">
              <TextInput value={form.product_lines} onChange={set("product_lines")} placeholder="MEDICARE_ADVANTAGE, PDP" />
            </Field>
            <div className="sm:col-span-2">
              <Toast
                tone="info"
                message="Selling authority is decided by M08 from licences and appointments. What is captured here is intent to serve, not permission to sell."
              />
            </div>
          </div>
        ) : null}

        {step === (staff ? 1 : 2) ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Place in group">
              <Picker
                value={form.group_id}
                onChange={set("group_id")}
                options={[
                  { value: "", label: "No placement yet" },
                  ...groups.data.map((g) => ({ value: g.group_id, label: `${g.name} · ${g.group_type.toLowerCase()}` })),
                ]}
              />
            </Field>
            <Field label="Account linkage">
              <Picker
                value={form.roster_only}
                onChange={set("roster_only")}
                options={[
                  { value: "true", label: "Roster only for now" },
                  { value: "false", label: "Request identity account link" },
                ]}
              />
            </Field>
            <div className="sm:col-span-2">
              <PendingM00 deltas={["DELTA-M06-M00-001", "DELTA-M06-M00-005"]}>
                Sending an invitation and assigning a scoped role happens once the identity and scoped
                assignment deltas are approved.
              </PendingM00>
            </div>
          </div>
        ) : null}

        {step === last ? (
          <DefinitionCard
            title="Review"
            items={[
              { k: "Display name", v: form.display_name || "—" },
              { k: "Category", v: form.person_category.replaceAll("_", " ").toLowerCase() },
              { k: "Work email", v: form.work_email || "—" },
              ...(staff ? [] : [{ k: "NPN", v: form.npn || "—" }, { k: "Captivity", v: form.captivity.toLowerCase() }]),
              {
                k: "Placement",
                v: groups.data.find((g) => g.group_id === form.group_id)?.name ?? "Unplaced",
              },
              ...(staff || !form.state_code ? [] : [{ k: "Service scope", v: `${form.state_code} · ${form.product_lines || "no product lines"}` }]),
              { k: "Account", v: form.roster_only === "true" ? "Roster only" : "Link requested" },
            ]}
          />
        ) : null}

        {step > last ? (
          <div className="space-y-3">
            <Toast tone="good" message="Added to the roster." />
            <p className="text-xs text-muted-foreground">
              Reference {created?.slice(0, 8)} · readiness has been evaluated and an affiliation opened.
            </p>
            <Btn
              onClick={() => {
                setStep(0);
                setCreated(null);
                setForm((f) => ({ ...f, display_name: "", work_email: "", npn: "", state_code: "" }));
              }}
            >
              Add another
            </Btn>
          </div>
        ) : (
          <div className="mt-5 flex gap-2">
            <Btn onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Btn>
            {step < last ? (
              <Btn variant="primary" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Btn>
            ) : (
              <Btn variant="primary" onClick={submit}>
                Add to roster
              </Btn>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-007 ============================ */

export function RosterOnlyConversion({ call }: M06ScreenProps) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const reviews = useM06Query<{ identity_link_review_id: string; display_name: string; match_outcome: string; decision: string | null; created_at: string }>(
    call,
    "identity.review.list",
  );
  const rosterOnly = profiles.data.filter((p) => p.roster_only);

  async function invite(p: Profile) {
    const res = await call("workforce.profile.update", {
      workforce_profile_id: p.workforce_profile_id,
      invitation_disposition: "INVITED",
    });
    toast.show(res.ok ? `Invitation recorded for ${p.display_name}.` : describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) profiles.reload();
  }

  async function decide(id: string, decision: "LINK" | "REJECT") {
    const res = await call("identity.review.decide", { identity_link_review_id: id, decision });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      reviews.reload();
      profiles.reload();
    }
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <PendingM00 deltas={["DELTA-M06-M00-001"]}>
        M06 records the intent to convert a roster-only person into an account holder; the identity
        record and the invitation itself remain M00 owned.
      </PendingM00>

      <Section title="Roster-only people" meta={`${rosterOnly.length} without an account`}>
        <QueryBlock query={profiles} empty="Everyone on this roster already has an account.">
          {() => (
            <Table
              rows={rosterOnly}
              keyOf={(p) => p.workforce_profile_id}
              columns={[
                { head: "Person", cell: (p) => p.display_name },
                { head: "Category", cell: (p) => p.person_category.replaceAll("_", " ").toLowerCase() },
                { head: "Work email", cell: (p) => p.work_email ?? <Tag tone="warn">no email</Tag> },
                { head: "Invitation", cell: (p) => <StatusTag value={p.invitation_disposition} /> },
                {
                  head: "",
                  cell: (p) => (
                    <Btn onClick={() => invite(p)} disabled={!p.work_email}>
                      Record invitation
                    </Btn>
                  ),
                },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      <Section title="Proposed account links">
        <QueryBlock query={reviews} empty="No proposed links are waiting.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(r) => r.identity_link_review_id}
              columns={[
                { head: "Person", cell: (r) => r.display_name },
                { head: "Signal", cell: (r) => <StatusTag value={r.match_outcome} /> },
                { head: "Raised", cell: (r) => fmtDate(r.created_at) },
                { head: "Decision", cell: (r) => <StatusTag value={r.decision} /> },
                {
                  head: "",
                  cell: (r) =>
                    r.decision ? (
                      "—"
                    ) : (
                      <span className="flex gap-2">
                        <Btn variant="primary" onClick={() => decide(r.identity_link_review_id, "LINK")}>
                          Link
                        </Btn>
                        <Btn variant="danger" onClick={() => decide(r.identity_link_review_id, "REJECT")}>
                          Reject
                        </Btn>
                      </span>
                    ),
                },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-035 ============================ */

export function AgentWorkspace({ call }: M06ScreenProps) {
  const toast = useToast();
  const { email } = useM06Context();
  const profiles = useProfiles(call);
  const [override, setOverride] = useState("");

  const agents = profiles.data.filter((p) => p.person_category === "AGENT");
  const mineByEmail = email
    ? agents.find((p) => (p.work_email ?? "").toLowerCase() === email.toLowerCase())
    : undefined;
  const me = override || mineByEmail?.workforce_profile_id || agents[0]?.workforce_profile_id || "";
  const profile = profiles.data.find((p) => p.workforce_profile_id === me);

  const readiness = useM06Query<{ workforce_profile_id: string; readiness_state: string; operational_eligibility: string; reasons: string[]; evaluated_at: string }>(
    call,
    "readiness.list",
  );
  const tasks = useM06Query<{ task_reference_id: string; title: string; status: string; due_at: string | null }>(
    call,
    "task.list",
    { subject_id: me },
    Boolean(me),
  );
  const scopes = useM06Query<{ service_scope_id: string; state_code: string; product_lines: string[]; status: string }>(
    call,
    "servicescope.list",
    { workforce_profile_id: me },
    Boolean(me),
  );
  const availability = useM06Query<{ availability_id: string; availability: string; note: string | null; created_at: string }>(
    call,
    "availability.list",
    { workforce_profile_id: me },
    Boolean(me),
  );
  const [next, setNext] = useState("AVAILABLE");
  const [note, setNote] = useState("");

  const mine = readiness.data.find((r) => r.workforce_profile_id === me);
  const openTasks = tasks.data.filter((t) => t.status !== "COMPLETED");
  const latest = availability.data[0];

  async function declare() {
    const res = await call("availability.declare", { workforce_profile_id: me, availability: next, note });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setNote("");
      availability.reload();
    }
  }

  async function complete(taskId: string) {
    const res = await call("task.update", { task_reference_id: taskId, status: "COMPLETED" });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) tasks.reload();
  }

  return (
    <div className="space-y-6">
      <Toast message={toast.msg} tone={toast.tone} />

      <StateBlock state={profiles.state} error={profiles.error} empty="No workforce record is in scope for your organization yet.">
        <section className="grid gap-4 rounded-2xl border border-hairline bg-card p-6 shadow-card lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-hairline bg-surface text-base font-semibold">
              {(profile?.display_name ?? "?")
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="min-w-0">
              <h2 className="text-display truncate text-2xl">{profile?.display_name ?? "No record selected"}</h2>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="truncate">{profile?.work_email ?? email ?? "\u2014"}</span>
                {profile?.npn ? <span className="truncate">NPN {profile.npn}</span> : null}
                <StatusTag value={profile?.status} />
              </p>
            </div>
          </div>
          {agents.length > 1 ? (
            <Field label="Viewing record" className="min-w-[260px]">
              <Picker
                value={me}
                onChange={setOverride}
                options={agents.map((p) => ({ value: p.workforce_profile_id, label: p.display_name }))}
              />
            </Field>
          ) : null}
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Readiness" value={(mine?.readiness_state ?? "\u2014").replaceAll("_", " ").toLowerCase()} icon={ShieldCheck} tone={mine?.readiness_state === "READY" ? "sage" : "warning"} />
          <KpiCard label="Operational eligibility" value={(mine?.operational_eligibility ?? "\u2014").replaceAll("_", " ").toLowerCase()} icon={BadgeCheck} tone={mine?.operational_eligibility === "OPERATIONALLY_ELIGIBLE" ? "sage" : "warning"} />
          <KpiCard label="Open tasks" value={openTasks.length} icon={CheckSquare} tone={openTasks.length ? "primary" : "default"} hint={openTasks.length ? "Needs your attention" : "All clear"} />
          <KpiCard label="Availability" value={(latest?.availability ?? "NOT SET").replaceAll("_", " ").toLowerCase()} icon={CalendarClock} hint={latest ? fmtDateTime(latest.created_at) : "Declare below"} />
        </div>

        {mine?.reasons?.length ? (
          <Section title="What is holding you back">
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {mine.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        <div className="grid gap-6">
          <DefinitionCard
            title="Profile details"
            items={[
              { k: "Legal name", v: [profile?.legal_first_name, profile?.legal_last_name].filter(Boolean).join(" ") || "\u2014" },
              { k: "Category", v: <StatusTag value={profile?.person_category} /> },
              { k: "Affiliation", v: <StatusTag value={profile?.captivity} /> },
              { k: "Invitation", v: <StatusTag value={profile?.invitation_disposition} /> },
              { k: "Work phone", v: profile?.work_phone ?? "\u2014" },
              { k: "Effective from", v: fmtDate(profile?.effective_from) },
            ]}
          />

          <Section title="My tasks" meta={`${openTasks.length} open`}>
            <QueryBlock query={tasks} empty="Nothing assigned right now.">
              {(rows) => (
                <Table
                  rows={rows}
                  keyOf={(t) => t.task_reference_id}
                  columns={[
                    { head: "Task", cell: (t) => <span className="font-medium">{t.title}</span> },
                    { head: "Due", cell: (t) => fmtDate(t.due_at) },
                    { head: "Status", cell: (t) => <StatusTag value={t.status} /> },
                    {
                      head: "",
                      className: "text-right",
                      cell: (t) =>
                        t.status === "COMPLETED" ? (
                          <span className="text-muted-foreground">\u2014</span>
                        ) : (
                          <Btn variant="primary" onClick={() => complete(t.task_reference_id)}>
                            Complete
                          </Btn>
                        ),
                    },
                  ]}
                />
              )}
            </QueryBlock>
          </Section>
        </div>

        <Section title="My availability" description="Tell your agency when you can take new work. Every declaration is recorded with a timestamp.">
          <div className="mb-6 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_auto] lg:items-end">
            <Field label="Set availability">
              <Picker
                value={next}
                onChange={setNext}
                options={["AVAILABLE", "NOT_ACCEPTING_NEW_WORK", "TEMPORARILY_UNAVAILABLE"].map((v) => ({
                  value: v,
                  label: v.replaceAll("_", " ").toLowerCase(),
                }))}
              />
            </Field>
            <Field label="Note">
              <TextInput value={note} onChange={setNote} placeholder="Optional context for the agency" />
            </Field>
            <Btn variant="primary" onClick={declare} disabled={!me}>
              Declare
            </Btn>
          </div>
          <QueryBlock query={availability} empty="No availability declared.">
            {(rows) => (
              <Table
                rows={rows}
                keyOf={(a) => a.availability_id}
                columns={[
                  { head: "When", cell: (a) => fmtDateTime(a.created_at) },
                  { head: "Availability", cell: (a) => <StatusTag value={a.availability} /> },
                  { head: "Note", cell: (a) => a.note ?? "\u2014" },
                ]}
              />
            )}
          </QueryBlock>
        </Section>

        <Section title="Where I can serve" description="Service scope is granted by your agency and limits the states and product lines you can sell.">
          <QueryBlock query={scopes} empty="No service scope recorded.">
            {(rows) => (
              <Table
                rows={rows}
                keyOf={(s) => s.service_scope_id}
                columns={[
                  { head: "State", cell: (s) => <span className="font-medium">{s.state_code}</span> },
                  { head: "Product lines", cell: (s) => s.product_lines?.join(", ") || "\u2014" },
                  { head: "Status", cell: (s) => <StatusTag value={s.status} /> },
                ]}
              />
            )}
          </QueryBlock>
        </Section>
      </StateBlock>
    </div>
  );
}
