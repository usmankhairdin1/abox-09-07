import { useMemo, useState, type ReactNode } from "react";

import { Search, Section } from "@/components/lucie/ui";
import { Picker, StatusTag } from "@/components/m06/kit";
import type { M06Call, M06Context } from "@/lib/m06/use-m06";
import { useM06Query } from "@/lib/m06/use-m06";

export interface M06ScreenProps {
  call: M06Call;
  ctx: M06Context;
}

export interface Profile {
  workforce_profile_id: string;
  display_name: string;
  legal_first_name: string | null;
  legal_last_name: string | null;
  person_category: string;
  status: string;
  captivity: string;
  invitation_disposition: string;
  work_email: string | null;
  work_phone: string | null;
  npn: string | null;
  external_reference: string | null;
  roster_only: boolean;
  user_account_id: string | null;
  effective_from: string;
  version: number;
}

export function useProfiles(call: M06Call) {
  return useM06Query<Profile>(call, "workforce.profile.list");
}

/** Shared subject selector — every person-scoped screen needs the same control. */
export function PersonPicker({
  profiles,
  value,
  onChange,
  label = "Subject",
  filter,
}: {
  profiles: Profile[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
  filter?: (p: Profile) => boolean;
}) {
  const rows = filter ? profiles.filter(filter) : profiles;
  const options = useMemo(
    () => [
      { value: "", label: rows.length ? "Select a person…" : "No people in scope" },
      ...rows.map((p) => ({
        value: p.workforce_profile_id,
        label: `${p.display_name} · ${p.person_category.replaceAll("_", " ").toLowerCase()}`,
      })),
    ],
    [rows],
  );
  return (
    <div className="grid min-w-[260px] flex-1 gap-1.5">
      <span className="text-eyebrow">{label}</span>
      <Picker value={value} onChange={onChange} options={options} />
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-end gap-3">{children}</div>;
}

export function TextFilter({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="min-w-[220px] flex-1">
      <Search value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

export function useTextFilter<T>(rows: T[], keys: (row: T) => (string | null | undefined)[]) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      keys(r).some((v) => (v ?? "").toLowerCase().includes(q)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query]);
  return { query, setQuery, filtered };
}

export function DefinitionCard({
  title,
  items,
}: {
  title: string;
  items: { k: string; v: ReactNode }[];
}) {
  return (
    <Section title={title}>
      <dl className="grid gap-0">
        {items.map((i) => (
          <div
            key={i.k}
            className="grid gap-0.5 border-b border-hairline py-2 last:border-0 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-3"
          >
            <dt className="text-eyebrow">{i.k}</dt>
            <dd className="min-w-0 text-sm leading-relaxed text-foreground">{i.v}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function personLabel(profiles: Profile[], id: string | null | undefined) {
  if (!id) return "—";
  return profiles.find((p) => p.workforce_profile_id === id)?.display_name ?? id.slice(0, 8);
}

export function CategoryTag({ value }: { value: string }) {
  return <StatusTag value={value} />;
}
