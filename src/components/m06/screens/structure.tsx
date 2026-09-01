import { useState } from "react";

import { Section, Stat, Table, Tag } from "@/components/lucie/ui";
import {
  Btn,
  Field,
  fmtDate,
  Picker,
  QueryBlock,
  StateBlock,
  StatusTag,
  TextArea,
  TextInput,
  Toast,
  type Tone,
} from "@/components/m06/kit";
import {
  FilterBar,
  PersonPicker,
  TextFilter,
  useProfiles,
  useTextFilter,
  type M06ScreenProps,
} from "@/components/m06/screens/common";
import { describeResult, useM06Query, useM06Record } from "@/lib/m06/use-m06";

interface Group {
  group_id: string;
  name: string;
  description: string | null;
  group_type: string;
  is_active: boolean;
  parent_group_id: string | null;
  member_count?: number;
}

interface GroupDetail extends Group {
  members: {
    membership_id: string;
    workforce_profile_id: string;
    display_name: string;
    person_category: string;
    status: string;
    is_lead: boolean;
    effective_from: string;
  }[];
}

function useToast() {
  const [msg, setMsg] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  return { msg, tone, show: (m: string, t: Tone = "info") => (setMsg(m), setTone(t)) };
}

/* -------------------------- shared list screen ------------------------- */

function GroupList({ call, groupType, label }: M06ScreenProps & { groupType: string; label: string }) {
  const toast = useToast();
  const groups = useM06Query<Group>(call, "group.list", { group_type: groupType });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { query, setQuery, filtered } = useTextFilter(groups.data, (g) => [g.name, g.description]);

  async function create() {
    if (!name.trim()) return toast.show(`A ${label.toLowerCase()} needs a name.`, "warn");
    const res = await call("group.create", { group_type: groupType, name, description });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setName("");
      setDescription("");
      groups.reload();
    }
  }

  const active = filtered.filter((g) => g.is_active);
  const members = groups.data.reduce((n, g) => n + (g.member_count ?? 0), 0);

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={`${label}s`} value={groups.data.length} />
        <Stat label="Active" value={groups.data.filter((g) => g.is_active).length} />
        <Stat label="People placed" value={members} />
      </div>

      <Section title={`Create a ${label.toLowerCase()}`}>
        <div className="grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)_auto] sm:items-end">
          <Field label="Name">
            <TextInput value={name} onChange={setName} placeholder={groupType === "BUSINESS_UNIT" ? "West Region" : "Medicare Advantage"} />
          </Field>
          <Field label="Description">
            <TextInput value={description} onChange={setDescription} placeholder="What this group is responsible for" />
          </Field>
          <Btn variant="primary" onClick={create}>
            Create
          </Btn>
        </div>
      </Section>

      <Section title={`${label}s`} meta={`${active.length} shown`}>
        <FilterBar>
          <TextFilter value={query} onChange={setQuery} placeholder={`Search ${label.toLowerCase()}s`} />
        </FilterBar>
        <QueryBlock query={groups} empty={`No ${label.toLowerCase()}s defined yet.`}>
          {() => (
            <Table
              rows={filtered}
              keyOf={(g) => g.group_id}
              columns={[
                { head: "Name", cell: (g) => <span className="font-medium text-foreground">{g.name}</span> },
                { head: "Description", cell: (g) => g.description ?? "—" },
                { head: "Members", cell: (g) => g.member_count ?? 0 },
                { head: "State", cell: (g) => (g.is_active ? <Tag tone="good">active</Tag> : <Tag tone="stop">inactive</Tag>) },
              ]}
            />
          )}
        </QueryBlock>
      </Section>
    </div>
  );
}

/* -------------------------- shared detail screen ----------------------- */

function GroupDetailScreen({ call, groupType, label }: M06ScreenProps & { groupType: string; label: string }) {
  const toast = useToast();
  const groups = useM06Query<Group>(call, "group.list", { group_type: groupType });
  const profiles = useProfiles(call);
  const [groupId, setGroupId] = useState("");
  const chosen = groupId || groups.data[0]?.group_id || "";
  const detail = useM06Record<GroupDetail>(call, "group.get", { group_id: chosen }, Boolean(chosen));
  const [addPerson, setAddPerson] = useState("");
  const [rename, setRename] = useState("");
  const [describe, setDescribe] = useState("");

  const g = detail.record;

  async function add() {
    if (!addPerson) return toast.show("Choose someone to add.", "warn");
    const res = await call("membership.add", { group_id: chosen, workforce_profile_id: addPerson });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setAddPerson("");
      detail.reload();
      groups.reload();
    }
  }

  async function remove(membershipId: string) {
    const res = await call("membership.remove", { membership_id: membershipId });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) detail.reload();
  }

  async function setLead(membershipId: string, isLead: boolean) {
    const res = await call("membership.setlead", { membership_id: membershipId, is_lead: isLead });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) detail.reload();
  }

  async function save() {
    const res = await call("group.update", {
      group_id: chosen,
      ...(rename ? { name: rename } : {}),
      ...(describe ? { description: describe } : {}),
    });
    toast.show(describeResult(res), res.ok ? "good" : "stop");
    if (res.ok) {
      setRename("");
      setDescribe("");
      detail.reload();
      groups.reload();
    }
  }

  return (
    <div className="space-y-5">
      <Toast message={toast.msg} tone={toast.tone} />
      <Section title={`Select a ${label.toLowerCase()}`}>
        <FilterBar>
          <div className="w-80">
            <Field label={label}>
              <Picker
                value={chosen}
                onChange={setGroupId}
                options={
                  groups.data.length
                    ? groups.data.map((x) => ({ value: x.group_id, label: x.name }))
                    : [{ value: "", label: `No ${label.toLowerCase()}s yet` }]
                }
              />
            </Field>
          </div>
        </FilterBar>
      </Section>

      <StateBlock state={detail.state} error={detail.error} empty={`Nothing to show — create a ${label.toLowerCase()} first.`}>
        {g ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Members" value={g.members?.length ?? 0} />
              <Stat label="Leads" value={g.members?.filter((m) => m.is_lead).length ?? 0} />
              <Stat label="State" value={<StatusTag value={g.is_active ? "ACTIVE" : "INACTIVE"} />} />
            </div>

            <Section title="Details">
              <div className="grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)_auto] sm:items-end">
                <Field label="Name">
                  <TextInput value={rename} onChange={setRename} placeholder={g.name} />
                </Field>
                <Field label="Description">
                  <TextArea value={describe} onChange={setDescribe} placeholder={g.description ?? "No description"} rows={2} />
                </Field>
                <Btn variant="primary" onClick={save}>
                  Save
                </Btn>
              </div>
            </Section>

            <Section title="Members" meta={`${g.members?.length ?? 0} placed`}>
              <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <PersonPicker profiles={profiles.data} value={addPerson} onChange={setAddPerson} label="Add person" />
                <Btn variant="primary" onClick={add}>
                  Add to {label.toLowerCase()}
                </Btn>
              </div>
              <Table
                rows={g.members ?? []}
                keyOf={(m) => m.membership_id}
                empty="Nobody has been placed here yet."
                columns={[
                  { head: "Person", cell: (m) => m.display_name },
                  { head: "Category", cell: (m) => m.person_category.replaceAll("_", " ").toLowerCase() },
                  { head: "Status", cell: (m) => <StatusTag value={m.status} /> },
                  { head: "Since", cell: (m) => fmtDate(m.effective_from) },
                  { head: "Lead", cell: (m) => (m.is_lead ? <Tag tone="good">lead</Tag> : "—") },
                  {
                    head: "",
                    cell: (m) => (
                      <span className="flex gap-2">
                        <Btn onClick={() => setLead(m.membership_id, !m.is_lead)}>
                          {m.is_lead ? "Clear lead" : "Make lead"}
                        </Btn>
                        <Btn variant="danger" onClick={() => remove(m.membership_id)}>
                          Remove
                        </Btn>
                      </span>
                    ),
                  },
                ]}
              />
            </Section>
          </div>
        ) : null}
      </StateBlock>
    </div>
  );
}

/* ============================ SCR-M06-015..018 ======================== */

export function BusinessUnits(props: M06ScreenProps) {
  return <GroupList {...props} groupType="BUSINESS_UNIT" label="Business unit" />;
}

export function BusinessUnitDetail(props: M06ScreenProps) {
  return <GroupDetailScreen {...props} groupType="BUSINESS_UNIT" label="Business unit" />;
}

export function Teams(props: M06ScreenProps) {
  return <GroupList {...props} groupType="TEAM" label="Team" />;
}

export function TeamDetail(props: M06ScreenProps) {
  return <GroupDetailScreen {...props} groupType="TEAM" label="Team" />;
}
