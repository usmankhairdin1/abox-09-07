import { useState } from "react";

import { Section, Stat, Table, Tag } from "@/components/lucie/ui";
import {
  Btn,
  Field,
  fmtDateTime,
  OwnedElsewhere,
  Picker,
  QueryBlock,
  StatusTag,
  TextArea,
  TextInput,
  Toast,
  type Tone,
} from "@/components/m06/kit";
import { DefinitionCard, FilterBar, useProfiles, type M06ScreenProps } from "@/components/m06/screens/common";
import { describeResult, useM06Query } from "@/lib/m06/use-m06";

interface Job {
  job_id: string;
  job_kind: string;
  status: string;
  file_name: string | null;
  row_count: number;
  requested_at: string;
  completed_at: string | null;
}

function useToast() {
  const [msg, setMsg] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  return { msg, tone, show: (m: string, t: Tone = "info") => (setMsg(m), setTone(t)) };
}

/* ============================ SCR-M06-027 ============================ */

export function ImportRoster({ call }: M06ScreenProps) {
  const toast = useToast();
  const jobs = useM06Query<Job>(call, "job.list", { job_kind: "IMPORT" });
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState("");
  const [paste, setPaste] = useState("");

  const parsed = paste
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  async function upload() {
    const name = fileName || "pasted-roster.csv";
    const count = Number(rows) || Math.max(parsed.length - 1, 0);
    const res = await call("job.create", { job_kind: "IMPORT", file_name: name, row_count: count });
    if (!res.ok) return toast.show(describeResult(res), "stop");
    const id = (res.data as { job_id: string }).job_id;
    await call("job.advance", { job_id: id, status: "VALIDATING" });
    toast.show(`Import ${name} accepted with ${count} rows and is being validated.`, "good");
    setFileName("");
    setRows("");
    setPaste("");
    jobs.reload();
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section
        title="Import a roster"
        description="An import never overwrites silently. Rows that match an existing person are held for duplicate review instead of being merged."
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px_auto] sm:items-end">
          <Field label="File name">
            <TextInput value={fileName} onChange={setFileName} placeholder="west-region-agents.csv" />
          </Field>
          <Field label="Row count">
            <TextInput value={rows} onChange={setRows} placeholder="e.g. 42" />
          </Field>
          <Btn variant="primary" onClick={upload}>
            Start import
          </Btn>
        </div>
        <div className="mt-4">
          <Field label="Or paste rows" hint="name, email, npn — one person per line">
            <TextArea value={paste} onChange={setPaste} rows={4} placeholder="Dana Whitfield, dana@example.com, 18820431" />
          </Field>
        </div>
        {parsed.length ? (
          <p className="mt-2 text-[11px] text-muted-foreground">{parsed.length} line(s) detected.</p>
        ) : null}
      </Section>

      <Section title="Recent imports">
        <QueryBlock query={jobs} empty="No imports have been run.">
          {(list) => (
            <Table
              rows={list}
              keyOf={(j) => j.job_id}
              columns={[
                { head: "File", cell: (j) => j.file_name ?? "—" },
                { head: "Rows", cell: (j) => j.row_count },
                { head: "Status", cell: (j) => <StatusTag value={j.status} /> },
                { head: "Requested", cell: (j) => fmtDateTime(j.requested_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-028 ============================ */

export function ImportResults({ call }: M06ScreenProps) {
  const toast = useToast();
  const jobs = useM06Query<Job>(call, "job.list", { job_kind: "IMPORT" });
  const duplicates = useM06Query<{ duplicate_candidate_id: string; status: string; primary: { display_name: string } }>(
    call,
    "duplicate.list",
  );
  const [jobId, setJobId] = useState("");
  const chosen = jobs.data.find((j) => j.job_id === (jobId || jobs.data[0]?.job_id));

  async function advance(status: string) {
    if (!chosen) return;
    const res = await call("job.advance", { job_id: chosen.job_id, status });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) jobs.reload();
  }

  const held = duplicates.data.filter((d) => d.status !== "RESOLVED").length;
  const accepted = chosen ? Math.max(chosen.row_count - held, 0) : 0;

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section title="Import run">
        <FilterBar>
          <div className="w-80">
            <Field label="Import">
              <Picker
                value={chosen?.job_id ?? ""}
                onChange={setJobId}
                options={
                  jobs.data.length
                    ? jobs.data.map((j) => ({ value: j.job_id, label: `${j.file_name ?? j.job_id.slice(0, 8)} · ${j.status.toLowerCase()}` }))
                    : [{ value: "", label: "No imports yet" }]
                }
              />
            </Field>
          </div>
        </FilterBar>
        {chosen ? (
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Rows submitted" value={chosen.row_count} />
            <Stat label="Would be accepted" value={accepted} />
            <Stat label="Held for review" value={held} />
            <Stat label="Status" value={<StatusTag value={chosen.status} />} />
          </div>
        ) : null}
        {chosen ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Btn onClick={() => advance("PROCESSING")}>Process accepted rows</Btn>
            <Btn variant="primary" onClick={() => advance("COMPLETED")}>
              Mark complete
            </Btn>
            <Btn variant="danger" onClick={() => advance("FAILED")}>
              Abandon import
            </Btn>
          </div>
        ) : null}
      </Section>

      <Section title="Rows held for duplicate review">
        <QueryBlock query={duplicates} empty="No rows were held.">
          {(list) => (
            <Table
              rows={list.filter((d) => d.status !== "RESOLVED")}
              keyOf={(d) => d.duplicate_candidate_id}
              columns={[
                { head: "Matches", cell: (d) => d.primary?.display_name ?? "—" },
                { head: "Status", cell: (d) => <StatusTag value={d.status} /> },
                { head: "Outcome", cell: () => <Tag tone="warn">needs a decision</Tag> },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-029 ============================ */

export function ExportRequest({ call }: M06ScreenProps) {
  const toast = useToast();
  const jobs = useM06Query<Job>(call, "job.list", { job_kind: "EXPORT" });
  const [scope, setScope] = useState("ROSTER");
  const [includePii, setIncludePii] = useState("false");

  async function request() {
    const res = await call("job.create", {
      job_kind: "EXPORT",
      file_name: `${scope.toLowerCase()}-export.csv`,
      row_count: 0,
    });
    if (!res.ok) return toast.show(describeResult(res), "stop");
    await call("job.advance", { job_id: (res.data as { job_id: string }).job_id, status: "PROCESSING" });
    toast.show("Export requested. Sensitive fields are excluded unless separately authorised.", "good");
    jobs.reload();
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section title="Request an export">
        <div className="grid gap-4 sm:grid-cols-[220px_220px_auto] sm:items-end">
          <Field label="Scope">
            <Picker
              value={scope}
              onChange={setScope}
              options={[
                { value: "ROSTER", label: "Roster" },
                { value: "READINESS", label: "Readiness" },
                { value: "STRUCTURE", label: "Business units and teams" },
                { value: "LIFECYCLE", label: "Lifecycle cases" },
              ]}
            />
          </Field>
          <Field label="Protected fields" hint="Date of birth and tokenised identifiers stay out by default">
            <Picker
              value={includePii}
              onChange={setIncludePii}
              options={[
                { value: "false", label: "Exclude protected fields" },
                { value: "true", label: "Request with protected fields" },
              ]}
            />
          </Field>
          <Btn variant="primary" onClick={request}>
            Request export
          </Btn>
        </div>
        {includePii === "true" ? (
          <div className="mt-3">
            <Toast
              tone="warn"
              message="Protected fields require step-up authentication, which is pending DELTA-M06-M00-009. The export will be produced without them."
            />
          </div>
        ) : null}
      </Section>

      <Section title="Export history">
        <QueryBlock query={jobs} empty="No exports requested.">
          {(list) => (
            <Table
              rows={list}
              keyOf={(j) => j.job_id}
              columns={[
                { head: "File", cell: (j) => j.file_name ?? "—" },
                { head: "Status", cell: (j) => <StatusTag value={j.status} /> },
                { head: "Requested", cell: (j) => fmtDateTime(j.requested_at) },
                { head: "Completed", cell: (j) => fmtDateTime(j.completed_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-030 ============================ */

export function FixedReports({ call }: M06ScreenProps) {
  const profiles = useProfiles(call);
  const readiness = useM06Query<{ workforce_profile_id: string; readiness_state: string }>(call, "readiness.list");
  const groups = useM06Query<{ group_id: string; name: string; group_type: string; member_count?: number }>(call, "group.list");
  const cases = useM06Query<{ case_id: string; case_type: string; status: string }>(call, "workforce.lifecycle.case.list");
  const recon = useM06Query<{ reconciliation_run_id: string; scope: string; status: string; drift_count: number; started_at: string }>(
    call,
    "reconciliation.list",
  );
  const [report, setReport] = useState("HEADCOUNT");

  const byCategory = new Map<string, number>();
  profiles.data.forEach((p) => byCategory.set(p.person_category, (byCategory.get(p.person_category) ?? 0) + 1));
  const byReadiness = new Map<string, number>();
  readiness.data.forEach((r) => byReadiness.set(r.readiness_state, (byReadiness.get(r.readiness_state) ?? 0) + 1));
  const byCase = new Map<string, number>();
  cases.data.forEach((c) => byCase.set(`${c.case_type} · ${c.status}`, (byCase.get(`${c.case_type} · ${c.status}`) ?? 0) + 1));

  const table =
    report === "HEADCOUNT"
      ? [...byCategory.entries()]
      : report === "READINESS"
        ? [...byReadiness.entries()]
        : report === "LIFECYCLE"
          ? [...byCase.entries()]
          : groups.data.map((g) => [`${g.name} (${g.group_type.toLowerCase()})`, g.member_count ?? 0] as [string, number]);

  return (
    <div className="space-y-5">
      <Section title="Fixed reports" description="A small set of governed reports. Ad-hoc reporting is out of scope for this module.">
        <FilterBar>
          <div className="w-72">
            <Field label="Report">
              <Picker
                value={report}
                onChange={setReport}
                options={[
                  { value: "HEADCOUNT", label: "Headcount by category" },
                  { value: "READINESS", label: "Readiness distribution" },
                  { value: "STRUCTURE", label: "Placement by group" },
                  { value: "LIFECYCLE", label: "Lifecycle case load" },
                ]}
              />
            </Field>
          </div>
        </FilterBar>
        <Table
          rows={table.map(([k, v]) => ({ k, v }))}
          keyOf={(r) => r.k}
          empty="Nothing to report for this scope."
          columns={[
            { head: "Grouping", cell: (r) => String(r.k).replaceAll("_", " ").toLowerCase() },
            { head: "Count", cell: (r) => r.v },
          ]}
        />
      </Section>

      <Section title="Reconciliation runs">
        <QueryBlock query={recon} empty="No reconciliation has been run.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(r) => r.reconciliation_run_id}
              columns={[
                { head: "Scope", cell: (r) => r.scope.replaceAll("_", " ").toLowerCase() },
                { head: "Status", cell: (r) => <StatusTag value={r.status} /> },
                { head: "Drift", cell: (r) => r.drift_count },
                { head: "Started", cell: (r) => fmtDateTime(r.started_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-031 ============================ */

export function NotificationPreferences({ call }: M06ScreenProps) {
  const notifications = useM06Query<{
    notification_request_id: string;
    channel: string;
    urgency: string;
    template_code: string;
    status: string;
    recipient: string | null;
    created_at: string;
  }>(call, "notification.list");
  const [channel, setChannel] = useState("");

  const rows = notifications.data.filter((n) => !channel || n.channel === channel);

  return (
    <div className="space-y-5">
      <OwnedElsewhere module="the notification platform">
        Delivery preferences and channel opt-outs are held upstream. M06 requests a notification and can
        show what it asked for; it cannot force delivery.
      </OwnedElsewhere>

      <Section title="Requested notifications">
        <FilterBar>
          <div className="w-52">
            <Field label="Channel">
              <Picker
                value={channel}
                onChange={setChannel}
                options={[
                  { value: "", label: "All channels" },
                  { value: "EMAIL", label: "Email" },
                  { value: "SMS", label: "SMS" },
                  { value: "IN_APP", label: "In app" },
                ]}
              />
            </Field>
          </div>
        </FilterBar>
        <QueryBlock query={notifications} empty="No notifications requested.">
          {() => (
            <Table
              rows={rows}
              keyOf={(n) => n.notification_request_id}
              columns={[
                { head: "Recipient", cell: (n) => n.recipient ?? "—" },
                { head: "Template", cell: (n) => <code className="text-[11px]">{n.template_code}</code> },
                { head: "Channel", cell: (n) => n.channel.replaceAll("_", " ").toLowerCase() },
                { head: "Urgency", cell: (n) => <StatusTag value={n.urgency} /> },
                { head: "Status", cell: (n) => <StatusTag value={n.status} /> },
                { head: "Requested", cell: (n) => fmtDateTime(n.created_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-032 ============================ */

export function SupportContext({ call }: M06ScreenProps) {
  const toast = useToast();
  const sessions = useM06Query<{ support_context_id: string; mode: string; reason: string; created_at: string; expires_at: string }>(
    call,
    "support.list",
  );
  const [reason, setReason] = useState("");

  async function start() {
    const res = await call("support.start", { reason });
    toast.show(
      res.ok ? "Support context opened for two hours and written to the audit trail." : describeResult(res),
      res.ok ? "good" : "stop",
    );
    if (res.ok) {
      setReason("");
      sessions.reload();
    }
  }

  async function end(id: string) {
    const res = await call("support.end", { support_context_id: id });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) sessions.reload();
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section
        title="Open a support context"
        description="Support access is time-boxed, reason-bound and always audited. It never silently widens tenant or organization scope."
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <Field label="Reason">
            <TextInput value={reason} onChange={setReason} placeholder="Ticket reference and what needs investigating" />
          </Field>
          <Btn variant="primary" onClick={start}>
            Start session
          </Btn>
        </div>
      </Section>

      <Section title="Sessions">
        <QueryBlock query={sessions} empty="No support sessions recorded.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(s) => s.support_context_id}
              columns={[
                { head: "Opened", cell: (s) => fmtDateTime(s.created_at) },
                { head: "Mode", cell: (s) => <StatusTag value={s.mode} /> },
                { head: "Reason", cell: (s) => s.reason },
                { head: "Expires", cell: (s) => fmtDateTime(s.expires_at) },
                {
                  head: "",
                  cell: (s) => (s.mode === "ACTIVE" ? <Btn variant="danger" onClick={() => end(s.support_context_id)}>End now</Btn> : "—"),
                },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-033 ============================ */

interface DuplicateRow {
  duplicate_candidate_id: string;
  match_outcome: string;
  status: string;
  match_signals: Record<string, unknown>;
  created_at: string;
  primary: { display_name: string; work_email: string | null; npn: string | null; status: string; created_at: string };
  candidate: { display_name: string; work_email: string | null; npn: string | null; status: string; created_at: string } | null;
}

export function DuplicateReview({ call }: M06ScreenProps) {
  const toast = useToast();
  const duplicates = useM06Query<DuplicateRow>(call, "duplicate.list");
  const [openId, setOpenId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const chosen = duplicates.data.find((d) => d.duplicate_candidate_id === openId);

  async function resolve(resolution: string) {
    if (!chosen) return;
    const res = await call("duplicate.resolve", {
      duplicate_candidate_id: chosen.duplicate_candidate_id,
      resolution,
      reason,
    });
    toast.show(
      res.ok ? "Decision recorded. Records are never merged automatically." : describeResult(res),
      res.ok ? "good" : "stop",
    );
    if (res.ok) {
      setReason("");
      setOpenId(null);
      duplicates.reload();
    }
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section title="Possible duplicates" meta={`${duplicates.data.filter((d) => d.status !== "RESOLVED").length} open`}>
        <QueryBlock query={duplicates} empty="No duplicate candidates detected.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(d) => d.duplicate_candidate_id}
              columns={[
                {
                  head: "Record",
                  cell: (d) => (
                    <button
                      type="button"
                      onClick={() => setOpenId(d.duplicate_candidate_id)}
                      className="text-left font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {d.primary?.display_name}
                    </button>
                  ),
                },
                { head: "Possible match", cell: (d) => d.candidate?.display_name ?? "External record" },
                { head: "Signal", cell: (d) => <StatusTag value={d.match_outcome} /> },
                { head: "Status", cell: (d) => <StatusTag value={d.status} /> },
                { head: "Raised", cell: (d) => fmtDateTime(d.created_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      {chosen ? (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <DefinitionCard
              title={`Record A — ${chosen.primary.display_name}`}
              items={[
                { k: "Work email", v: chosen.primary.work_email ?? "—" },
                { k: "NPN", v: chosen.primary.npn ?? "—" },
                { k: "Status", v: <StatusTag value={chosen.primary.status} /> },
                { k: "Created", v: fmtDateTime(chosen.primary.created_at) },
              ]}
            />
            <DefinitionCard
              title={`Record B — ${chosen.candidate?.display_name ?? "External record"}`}
              items={[
                { k: "Work email", v: chosen.candidate?.work_email ?? "—" },
                { k: "NPN", v: chosen.candidate?.npn ?? "—" },
                { k: "Status", v: <StatusTag value={chosen.candidate?.status} /> },
                { k: "Created", v: fmtDateTime(chosen.candidate?.created_at) },
              ]}
            />
          </div>

          <Section title="Decision" description="A reason is mandatory and is stored with the decision.">
            <Field label="Reason">
              <TextArea value={reason} onChange={setReason} rows={2} placeholder="What evidence supports this decision" />
            </Field>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn variant="primary" onClick={() => resolve("SAME_PERSON")}>
                Same person
              </Btn>
              <Btn onClick={() => resolve("DIFFERENT_PEOPLE")}>Different people</Btn>
              <Btn onClick={() => resolve("NEEDS_MORE_INFORMATION")}>Needs more information</Btn>
            </div>
          </Section>
        </>
      ) : null}
    </div>
  );
}
