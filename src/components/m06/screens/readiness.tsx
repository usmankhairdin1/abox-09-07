import { useMemo, useState } from "react";

import { Section, Stat, Table, Tag } from "@/components/lucie/ui";
import {
  Btn,
  Field,
  fmtDateTime,
  OwnedElsewhere,
  Picker,
  QueryBlock,
  StatusTag,
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
import { describeResult, useM06Query } from "@/lib/m06/use-m06";

interface Readiness {
  workforce_profile_id: string;
  readiness_state: string;
  operational_eligibility: string;
  reasons: string[];
  contributing_sources: Record<string, boolean>;
  evaluated_at: string;
  owner_freshness_at: string | null;
}

function useToast() {
  const [msg, setMsg] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  return { msg, tone, show: (m: string, t: Tone = "info") => (setMsg(m), setTone(t)) };
}

/* ============================ SCR-M06-023 ============================ */

export function ReadinessDetail({ call }: M06ScreenProps) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const readiness = useM06Query<Readiness>(call, "readiness.list");
  const [person, setPerson] = useState("");
  const chosen = person || profiles.data[0]?.workforce_profile_id || "";
  const row = readiness.data.find((r) => r.workforce_profile_id === chosen);

  async function evaluate(id: string) {
    const res = await call("readiness.evaluate", { workforce_profile_id: id });
    toast.show(res.ok ? "Readiness re-evaluated from current facts." : describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) readiness.reload();
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section title="Readiness">
        <FilterBar>
          <PersonPicker profiles={profiles.data} value={chosen} onChange={setPerson} />
          <Btn variant="primary" disabled={!chosen} onClick={() => evaluate(chosen)}>
            Re-evaluate
          </Btn>
        </FilterBar>
        <p className="text-xs text-muted-foreground">
          Readiness is derived, never typed in. It is recomputed from profile status, affiliation,
          service scope, account linkage and open exceptions.
        </p>
      </Section>

      {row ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Readiness" value={<StatusTag value={row.readiness_state} />} />
            <Stat label="Operational eligibility" value={<StatusTag value={row.operational_eligibility} />} />
            <Stat label="Evaluated" value={<span className="text-sm">{fmtDateTime(row.evaluated_at)}</span>} />
          </div>

          <DefinitionCard
            title="Contributing facts"
            items={Object.entries(row.contributing_sources ?? {}).map(([k, v]) => ({
              k: k.replaceAll("_", " "),
              v: v ? <Tag tone="good">satisfied</Tag> : <Tag tone="stop">not satisfied</Tag>,
            }))}
          />

          <Section title="Why it is not ready">
            {row.reasons?.length ? (
              <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {row.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">Nothing outstanding — this person is ready to work.</p>
            )}
          </Section>
        </>
      ) : (
        <Section title="Readiness">
          <p className="text-xs text-muted-foreground">
            No readiness result yet for this person. Run an evaluation to produce one.
          </p>
        </Section>
      )}

      <Section title="Roster readiness" meta={`${readiness.data.length} evaluated`}>
        <QueryBlock query={readiness} empty="No readiness results recorded.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(r) => r.workforce_profile_id}
              columns={[
                {
                  head: "Person",
                  cell: (r) =>
                    profiles.data.find((p) => p.workforce_profile_id === r.workforce_profile_id)?.display_name ??
                    r.workforce_profile_id.slice(0, 8),
                },
                { head: "Readiness", cell: (r) => <StatusTag value={r.readiness_state} /> },
                { head: "Eligibility", cell: (r) => <StatusTag value={r.operational_eligibility} /> },
                { head: "Reasons", cell: (r) => r.reasons?.join("; ") || "—" },
                { head: "Evaluated", cell: (r) => fmtDateTime(r.evaluated_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-024 ============================ */

export function OperationalEligibilityDetail({ call }: M06ScreenProps) {
  const profiles = useProfiles(call);
  const readiness = useM06Query<Readiness>(call, "readiness.list");
  const [state, setState] = useState("");

  const rows = readiness.data.filter((r) => !state || r.operational_eligibility === state);
  const buckets = useMemo(() => {
    const m = new Map<string, number>();
    readiness.data.forEach((r) => m.set(r.operational_eligibility, (m.get(r.operational_eligibility) ?? 0) + 1));
    return [...m.entries()];
  }, [readiness.data]);

  return (
    <div className="space-y-5">
      <OwnedElsewhere module="M08">
        Operational eligibility says whether the agency can put someone to work. It is not selling
        authority — licences, appointments and the final authority to sell remain with M08.
      </OwnedElsewhere>

      <div className="grid gap-3 sm:grid-cols-3">
        {buckets.map(([k, v]) => (
          <Stat key={k} label={k.replaceAll("_", " ").toLowerCase()} value={v} />
        ))}
      </div>

      <Section title="Eligibility by person">
        <FilterBar>
          <div className="w-60">
            <Field label="Eligibility">
              <Picker
                value={state}
                onChange={setState}
                options={[
                  { value: "", label: "All" },
                  ...buckets.map(([k]) => ({ value: k, label: k.replaceAll("_", " ").toLowerCase() })),
                ]}
              />
            </Field>
          </div>
        </FilterBar>
        <QueryBlock query={readiness} empty="No eligibility results yet.">
          {() => (
            <Table
              rows={rows}
              keyOf={(r) => r.workforce_profile_id}
              columns={[
                {
                  head: "Person",
                  cell: (r) =>
                    profiles.data.find((p) => p.workforce_profile_id === r.workforce_profile_id)?.display_name ??
                    r.workforce_profile_id.slice(0, 8),
                },
                { head: "Eligibility", cell: (r) => <StatusTag value={r.operational_eligibility} /> },
                { head: "Blockers", cell: (r) => r.reasons?.join("; ") || "None" },
                { head: "Source freshness", cell: (r) => fmtDateTime(r.owner_freshness_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-025 ============================ */

export function ReferralLinkComponent({ call }: M06ScreenProps) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const projections = useM06Query<{ upstream_projection_id: string; owner_module: string; object_type: string; summary: string; subject_id: string | null; observed_at: string }>(
    call,
    "projection.list",
    { owner_module: "M04" },
  );
  const [person, setPerson] = useState("");
  const chosen = profiles.data.find((p) => p.workforce_profile_id === person);
  const token = chosen ? `abx-${chosen.display_name.toLowerCase().replace(/[^a-z]+/g, "-")}-7f2c` : "";
  const link = token ? `https://marketplace.example.com/r/${token}` : "";

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <OwnedElsewhere module="M04">
        Marketplace routes and referral tokens are issued and revoked by M04. M06 shows the person the
        token belongs to and whether that person is still eligible to receive routed work.
      </OwnedElsewhere>

      <Section title="Referral link">
        <FilterBar>
          <PersonPicker profiles={profiles.data} value={person} onChange={setPerson} label="Agent" filter={(p) => p.person_category === "AGENT"} />
        </FilterBar>
        {chosen ? (
          <div className="space-y-4">
            <DefinitionCard
              title={chosen.display_name}
              items={[
                { k: "Referral token", v: <code className="text-[11px]">{token}</code> },
                { k: "Shareable link", v: <code className="break-all text-[11px]">{link}</code> },
                { k: "Profile status", v: <StatusTag value={chosen.status} /> },
                {
                  k: "Routing",
                  v:
                    chosen.status === "ACTIVE" ? (
                      <Tag tone="good">eligible for routed work</Tag>
                    ) : (
                      <Tag tone="stop">routing paused while not active</Tag>
                    ),
                },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              <Btn
                onClick={() => {
                  void navigator.clipboard?.writeText(link);
                  toast.show("Link copied.", "good");
                }}
              >
                Copy link
              </Btn>
              <Btn disabled title="Token issuance and revocation belong to M04">
                Reissue token
              </Btn>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Choose an agent to see their marketplace route.</p>
        )}
      </Section>

      <Section title="Marketplace projections">
        <QueryBlock query={projections} empty="No marketplace projections cached for this tenant.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(r) => r.upstream_projection_id}
              columns={[
                { head: "Object", cell: (r) => r.object_type },
                { head: "Summary", cell: (r) => r.summary },
                { head: "Observed", cell: (r) => fmtDateTime(r.observed_at) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* ============================ SCR-M06-026 ============================ */

export function CredentialSellingSetup({ call }: M06ScreenProps) {
  const toast = useToast();
  const profiles = useProfiles(call);
  const [person, setPerson] = useState("");
  const chosen = person || profiles.data.find((p) => p.person_category === "AGENT")?.workforce_profile_id || "";
  const scopes = useM06Query<{ service_scope_id: string; state_code: string; product_lines: string[]; status: string }>(
    call,
    "servicescope.list",
    { workforce_profile_id: chosen },
    Boolean(chosen),
  );
  const docs = useM06Query<{ document_reference_id: string; document_kind: string; owner_module: string; status: string }>(
    call,
    "document.list",
    { subject_id: chosen },
    Boolean(chosen),
  );
  const [stateCode, setStateCode] = useState("");
  const [lines, setLines] = useState("");

  async function addScope() {
    if (!stateCode.trim()) return toast.show("A two-letter state code is required.", "warn");
    const res = await call("servicescope.set", {
      workforce_profile_id: chosen,
      state_code: stateCode,
      product_lines: lines.split(",").map((s) => s.trim()).filter(Boolean),
    });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setStateCode("");
      setLines("");
      scopes.reload();
      await call("readiness.evaluate", { workforce_profile_id: chosen });
    }
  }

  async function removeScope(id: string) {
    const res = await call("servicescope.remove", { service_scope_id: id });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) scopes.reload();
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <OwnedElsewhere module="M08 and M13">
        Licences, appointments and credential files are recorded upstream. Setting a service scope here
        records where the agency intends this person to work; it does not grant authority to sell.
      </OwnedElsewhere>

      <Section title="Selling setup">
        <FilterBar>
          <PersonPicker profiles={profiles.data} value={chosen} onChange={setPerson} label="Agent" filter={(p) => p.person_category === "AGENT"} />
        </FilterBar>
        <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-end">
          <Field label="State">
            <TextInput value={stateCode} onChange={setStateCode} placeholder="TX" />
          </Field>
          <Field label="Product lines" hint="Comma separated">
            <TextInput value={lines} onChange={setLines} placeholder="MEDICARE_ADVANTAGE, PDP" />
          </Field>
          <Btn variant="primary" onClick={addScope} disabled={!chosen}>
            Add scope
          </Btn>
        </div>
      </Section>

      <Section title="Service scope">
        <QueryBlock query={scopes} empty="No service scope recorded for this person.">
          {(rows) => (
            <Table
              rows={rows}
              keyOf={(s) => s.service_scope_id}
              columns={[
                { head: "State", cell: (s) => s.state_code },
                { head: "Product lines", cell: (s) => s.product_lines?.join(", ") || "—" },
                { head: "Status", cell: (s) => <StatusTag value={s.status} /> },
                {
                  head: "",
                  cell: (s) =>
                    s.status === "ACTIVE" ? <Btn variant="danger" onClick={() => removeScope(s.service_scope_id)}>Remove</Btn> : "—",
                },
              ]}
            />
          )}
        </QueryBlock>
      </Section>

      <Section title="Credential references">
        <QueryBlock query={docs} empty="No credential references projected for this person.">
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
      </Section>
    </div>
  );
}
