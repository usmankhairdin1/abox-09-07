import { useState } from "react";

import { Section, Stat, Table, Tag } from "@/components/lucie/ui";
import {
  Btn,
  Field,
  fmtDate,
  fmtDateTime,
  Picker,
  QueryBlock,
  Sheet,
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
  useProfiles,
  type M06ScreenProps,
} from "@/components/m06/screens/common";
import { describeResult, useM06Query, useM06Record } from "@/lib/m06/use-m06";

interface CaseRow {
  case_id: string;
  case_type: string;
  status: string;
  workforce_profile_id: string | null;
  scheduled_for: string | null;
  blocking_reasons: string[];
  created_at: string;
  detail: Record<string, unknown>;
}

function useToast() {
  const [msg, setMsg] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  return { msg, tone, show: (m: string, t: Tone = "info") => (setMsg(m), setTone(t)) };
}

function CaseWorkbench({
  call,
  caseType,
  title,
  intro,
  actions,
}: M06ScreenProps & {
  caseType: string;
  title: string;
  intro: string;
  actions?: { label: string; action: string; tone?: Tone }[];
}) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const cases = useM06Query<CaseRow>(call, "workforce.lifecycle.case.list", { case_type: caseType });
  const [openId, setOpenId] = useState<string | null>(null);
  const [person, setPerson] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [reason, setReason] = useState("");

  const detail = useM06Record<CaseRow>(call, "workforce.lifecycle.case.get", { case_id: openId }, Boolean(openId));
  const history = useM06Query<{ history_id: string; from_status: string; to_status: string; lifecycle_action: string; reason: string; occurred_at: string }>(
    call,
    "workforce.lifecycle.history",
    { workforce_profile_id: detail.record?.workforce_profile_id ?? null },
    Boolean(detail.record?.workforce_profile_id),
  );

  async function openCase() {
    if (!person) return toast.show("Choose the person this case is about.", "warn");
    const res = await call("workforce.lifecycle.case.open", {
      case_type: caseType,
      workforce_profile_id: person,
      scheduled_for: scheduled || null,
      detail: reason ? { reason } : {},
    });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setPerson("");
      setScheduled("");
      setReason("");
      cases.reload();
    }
  }

  async function advance(caseId: string, status: string) {
    const res = await call("workforce.lifecycle.case.update", { case_id: caseId, status });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      cases.reload();
      detail.reload();
    }
  }

  async function complete(caseId: string) {
    const res = await call("workforce.lifecycle.case.complete", { case_id: caseId });
    toast.show(
      res.ok ? "Case completed." : `${describeResult(res)} Clear the blocking reasons first.`,
      res.ok ? "good" : "stop",
    );
    if (res.ok) {
      cases.reload();
      detail.reload();
    }
  }

  async function runAction(profileId: string, action: string) {
    if (!reason.trim()) return toast.show("A reason is required for every lifecycle change.", "warn");
    const res = await call("workforce.lifecycle.transition", {
      workforce_profile_id: profileId,
      action,
      reason,
    });
    if (res.ok) {
      const data = res.data as { status: string; access_revocation: string };
      toast.show(
        data.access_revocation === "AWAITING_M00_CONFIRMATION"
          ? `Status is now ${data.status.toLowerCase()}. Not complete until M00 confirms access and session revocation.`
          : `Status is now ${data.status.toLowerCase()}.`,
        data.access_revocation === "AWAITING_M00_CONFIRMATION" ? "warn" : "good",
      );
      setReason("");
      profiles.reload();
      history.reload();
    } else {
      toast.show(describeResult(res), "stop");
    }
  }

  const open = cases.data.filter((c) => c.status !== "COMPLETED");

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Cases" value={cases.data.length} />
        <Stat label="Open" value={open.length} />
        <Stat label="Blocked" value={cases.data.filter((c) => c.blocking_reasons?.length).length} />
        <Stat label="Completed" value={cases.data.filter((c) => c.status === "COMPLETED").length} />
      </div>

      <Section title={`Open a ${title.toLowerCase()}`} description={intro}>
        <div className="grid gap-4 sm:grid-cols-2">
          <PersonPicker profiles={profiles.data} value={person} onChange={setPerson} label="Person" />
          <Field label="Scheduled for">
            <TextInput value={scheduled} onChange={setScheduled} type="date" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Reason" hint="Recorded on the case and on every status change">
              <TextArea value={reason} onChange={setReason} rows={2} placeholder="Why this case is being opened" />
            </Field>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn variant="primary" onClick={openCase}>
            Open case
          </Btn>
          {actions?.map((a) => (
            <Btn
              key={a.action}
              variant={a.tone === "stop" ? "danger" : "ghost"}
              disabled={!person}
              onClick={() => runAction(person, a.action)}
            >
              {a.label}
            </Btn>
          ))}
        </div>
      </Section>

      <Section title={`${title}s`} meta={`${cases.data.length} total`}>
        <QueryBlock query={cases} empty={`No ${title.toLowerCase()}s have been opened.`}>
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(c) => c.case_id}
              columns={[
                {
                  head: "Person",
                  cell: (c) => (
                    <button
                      type="button"
                      onClick={() => setOpenId(c.case_id)}
                      className="text-left font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {profiles.data.find((p) => p.workforce_profile_id === c.workforce_profile_id)?.display_name ??
                        "Unassigned"}
                    </button>
                  ),
                },
                { head: "Status", cell: (c) => <StatusTag value={c.status} /> },
                { head: "Scheduled", cell: (c) => fmtDate(c.scheduled_for) },
                { head: "Opened", cell: (c) => fmtDate(c.created_at) },
                {
                  head: "Blocking",
                  cell: (c) =>
                    c.blocking_reasons?.length ? <Tag tone="stop">{c.blocking_reasons.length}</Tag> : <Tag tone="good">clear</Tag>,
                },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      <Sheet open={Boolean(openId)} onClose={() => setOpenId(null)} title={title}>
        {detail.record ? (
          <>
            <DefinitionCard
              title="Case"
              items={[
                { k: "Type", v: detail.record.case_type.replaceAll("_", " ").toLowerCase() },
                { k: "Status", v: <StatusTag value={detail.record.status} /> },
                { k: "Scheduled", v: fmtDate(detail.record.scheduled_for) },
                {
                  k: "Person",
                  v:
                    profiles.data.find((p) => p.workforce_profile_id === detail.record?.workforce_profile_id)
                      ?.display_name ?? "—",
                },
                {
                  k: "Blocking reasons",
                  v: detail.record.blocking_reasons?.length ? (
                    <ul className="list-disc pl-4">
                      {detail.record.blocking_reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    "None"
                  ),
                },
                { k: "Detail", v: JSON.stringify(detail.record.detail ?? {}) },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => advance(detail.record!.case_id, "IN_PROGRESS")}>Move to in progress</Btn>
              <Btn onClick={() => advance(detail.record!.case_id, "ON_HOLD")}>Put on hold</Btn>
              <Btn variant="primary" onClick={() => complete(detail.record!.case_id)}>
                Complete
              </Btn>
            </div>
            <Section title="Status history">
              <QueryBlock query={history} empty="No status changes recorded for this person.">
                {(rows) => (
                  <Table
                    rows={rows}
                    keyOf={(h) => h.history_id}
                    columns={[
                      { head: "When", cell: (h) => fmtDateTime(h.occurred_at) },
                      { head: "Change", cell: (h) => `${h.from_status} → ${h.to_status}` },
                      { head: "Reason", cell: (h) => h.reason },
                    ]}
                  />
                )}
              </QueryBlock>
            </Section>
          </>
        ) : null}
      </Sheet>
    </div>
  );
}

/* ============================ SCR-M06-019 ============================ */

export function OnboardingCases(props: M06ScreenProps) {
  return (
    <CaseWorkbench
      {...props}
      caseType="ONBOARDING"
      title="Onboarding case"
      intro="Onboarding tracks a new person from roster entry to being ready to work. Completion is refused while blocking reasons remain."
      actions={[{ label: "Activate person", action: "ACTIVATE" }]}
    />
  );
}

/* ============================ SCR-M06-020 ============================ */

export function TransferCase({ call, ctx }: M06ScreenProps) {
  return (
    <div className="space-y-5">
      <Section title="Transfers across organizations">
        <p className="text-xs leading-relaxed text-muted-foreground">
          A transfer ends the affiliation at the source organization and opens one at the target. The
          person keeps one canonical record; scope, placement and access are re-derived rather than copied.
        </p>
      </Section>
      <CaseWorkbench
        call={call}
        ctx={ctx}
        caseType="TRANSFER"
        title="Transfer case"
        intro="Both the source and target organization must be unambiguous before a transfer can complete."
      />
    </div>
  );
}

/* ============================ SCR-M06-021 ============================ */

export function OffboardingCase(props: M06ScreenProps) {
  return (
    <div className="space-y-5">
      <Section title="Offboarding">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Suspension and offboarding are only shown as complete once M00 confirms that access and open
          sessions have been revoked. Until then the case stays open and the person is marked as awaiting
          confirmation.
        </p>
      </Section>
      <CaseWorkbench
        {...props}
        caseType="OFFBOARDING"
        title="Offboarding case"
        intro="Every lifecycle action requires a reason, which is written to the status history."
        actions={[
          { label: "Suspend", action: "SUSPEND", tone: "stop" },
          { label: "Offboard", action: "OFFBOARD", tone: "stop" },
          { label: "Reactivate", action: "REACTIVATE" },
        ]}
      />
    </div>
  );
}

/* ============================ SCR-M06-022 ============================ */

export function TasksAndExceptions({ call }: M06ScreenProps) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const tasks = useM06Query<{ task_reference_id: string; title: string; status: string; due_at: string | null; subject_id: string | null; owner_module: string }>(
    call,
    "task.list",
  );
  const exceptions = useM06Query<{ exception_id: string; code: string; summary: string; status: string; risk_level: string; subject_id: string | null; created_at: string }>(
    call,
    "exception.list",
  );
  const [tab, setTab] = useState<"tasks" | "exceptions">("tasks");
  const [note, setNote] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [subject, setSubject] = useState("");
  const [risk, setRisk] = useState("STANDARD");

  async function completeTask(id: string) {
    const res = await call("task.update", { task_reference_id: id, status: "COMPLETED" });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) tasks.reload();
  }

  async function openException() {
    if (!newCode.trim() || !newSummary.trim()) return toast.show("Code and summary are both required.", "warn");
    const res = await call("exception.open", {
      code: newCode,
      summary: newSummary,
      subject_id: subject || null,
      risk_level: risk,
    });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setNewCode("");
      setNewSummary("");
      exceptions.reload();
    }
  }

  async function resolve(id: string) {
    const res = await call("exception.resolve", { exception_id: id, resolution_note: note || "Resolved from workbench" });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setNote("");
      exceptions.reload();
    }
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <div className="flex gap-2">
        <Btn variant={tab === "tasks" ? "primary" : "ghost"} onClick={() => setTab("tasks")}>
          Tasks ({tasks.data.filter((t) => t.status !== "COMPLETED").length})
        </Btn>
        <Btn variant={tab === "exceptions" ? "primary" : "ghost"} onClick={() => setTab("exceptions")}>
          Exceptions ({exceptions.data.filter((e) => e.status !== "RESOLVED").length})
        </Btn>
      </div>

      {tab === "tasks" ? (
        <Section title="Tasks" meta="Task orchestration is referenced, not owned, by M06">
          <QueryBlock query={tasks} empty="No tasks are outstanding.">
            {(rows) => (
              <Table
                rows={rows}
                keyOf={(t) => t.task_reference_id}
                columns={[
                  { head: "Task", cell: (t) => t.title },
                  {
                    head: "About",
                    cell: (t) =>
                      profiles.data.find((p) => p.workforce_profile_id === t.subject_id)?.display_name ?? "—",
                  },
                  { head: "Owner", cell: (t) => t.owner_module },
                  { head: "Due", cell: (t) => fmtDate(t.due_at) },
                  { head: "Status", cell: (t) => <StatusTag value={t.status} /> },
                  {
                    head: "",
                    cell: (t) =>
                      t.status === "COMPLETED" ? "—" : <Btn onClick={() => completeTask(t.task_reference_id)}>Complete</Btn>,
                  },
                ]}
              />
            )}
          </QueryBlock>
        </Section>
      ) : (
        <>
          <Section title="Raise an exception">
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Code">
                <TextInput value={newCode} onChange={setNewCode} placeholder="ROSTER_DATA_CONFLICT" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Summary">
                  <TextInput value={newSummary} onChange={setNewSummary} placeholder="What is wrong and what is blocked" />
                </Field>
              </div>
              <Field label="Risk">
                <Picker
                  value={risk}
                  onChange={setRisk}
                  options={["STANDARD", "ELEVATED", "CRITICAL"].map((r) => ({ value: r, label: r.toLowerCase() }))}
                />
              </Field>
              <div className="sm:col-span-3">
                <PersonPicker profiles={profiles.data} value={subject} onChange={setSubject} label="About" />
              </div>
              <div className="flex items-end">
                <Btn variant="primary" onClick={openException}>
                  Raise
                </Btn>
              </div>
            </div>
          </Section>

          <Section title="Exceptions">
            <FilterBar>
              <div className="min-w-[240px] flex-1">
                <Field label="Resolution note">
                  <TextInput value={note} onChange={setNote} placeholder="Applied to the next resolve action" />
                </Field>
              </div>
            </FilterBar>
            <QueryBlock query={exceptions} empty="Nothing has been flagged.">
              {(rows) => (
                <Table
                  rows={rows}
                  keyOf={(e) => e.exception_id}
                  columns={[
                    { head: "Code", cell: (e) => <code className="text-[11px]">{e.code}</code> },
                    { head: "Summary", cell: (e) => e.summary },
                    {
                      head: "About",
                      cell: (e) =>
                        profiles.data.find((p) => p.workforce_profile_id === e.subject_id)?.display_name ?? "—",
                    },
                    { head: "Risk", cell: (e) => <StatusTag value={e.risk_level} /> },
                    { head: "Status", cell: (e) => <StatusTag value={e.status} /> },
                    { head: "Raised", cell: (e) => fmtDate(e.created_at) },
                    {
                      head: "",
                      cell: (e) =>
                        e.status === "RESOLVED" ? "—" : <Btn onClick={() => resolve(e.exception_id)}>Resolve</Btn>,
                    },
                  ]}
                />
              )}
            </QueryBlock>
          </Section>
        </>
      )}
    </div>
  );
}
