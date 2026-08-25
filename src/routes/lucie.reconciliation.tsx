import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  Id,
  IdList,
  Note,
  PageHead,
  Search,
  Section,
  Select,
  Stat,
  Table,
  Tag,
  Toolbar,
} from "@/components/lucie/ui";
import {
  P1_GROUP_DISPOSITIONS,
  RECONCILIATION,
  SURFACE_BY_ID,
  type Disposition,
} from "@/lib/lucie";

export const Route = createFileRoute("/lucie/reconciliation")({
  head: () => ({
    meta: [
      { title: "Wireframe Reconciliation — Legacy Sets onto IA v2.0 Surfaces" },
      {
        name: "description",
        content:
          "Every earlier ABox wireframe resolved onto the Lucie surface baseline: reconciled, excluded behind a protected seam, or outside Lucie delivery depth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Wireframe Reconciliation to IA v2.0" },
      {
        property: "og:description",
        content:
          "The earlier wireframe estate is not authoritative. IA v2.0 controls IDs and placement; this register records each disposition.",
      },
    ],
  }),
  component: ReconciliationPage,
});

const ALL = "__all";

const TONE: Record<Disposition, "good" | "stop" | "warn"> = {
  reconciled: "good",
  excluded: "stop",
  "out-of-scope": "warn",
};

function ReconciliationPage() {
  const [disp, setDisp] = useState(ALL);
  const [set, setSet] = useState(ALL);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return RECONCILIATION.filter((r) => {
      if (disp !== ALL && r.disposition !== disp) return false;
      if (set !== ALL && r.legacySet !== set) return false;
      if (!needle) return true;
      return [r.legacyId, r.legacyName, r.note, ...r.surfaces].join(" ").toLowerCase().includes(needle);
    });
  }, [disp, set, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { reconciled: 0, excluded: 0, "out-of-scope": 0 };
    for (const r of RECONCILIATION) c[r.disposition] = (c[r.disposition] ?? 0) + 1;
    return c;
  }, []);

  const sets = Array.from(new Set(RECONCILIATION.map((r) => r.legacySet)));

  return (
    <>
      <PageHead
        eyebrow="Estate cleanup"
        title="Wireframe reconciliation to IA v2.0"
        lede="The earlier /m1, /p1 and /hf wireframe sets were produced against Phase 1 IA v1.0 and the now-retired sequencing pack. They are historical design work, not a baseline. Each legacy screen resolves here to real IA v2.0 surface IDs, to a protected seam, or to an out-of-scope note."
        right={<Id>{`${rows.length} of ${RECONCILIATION.length} screens`}</Id>}
      />

      <div className="grid gap-2 sm:grid-cols-3">
        <Stat
          label="Reconciled"
          value={counts["reconciled"] ?? 0}
          hint="Maps to live Lucie surfaces"
        />
        <Stat
          label="Excluded"
          value={counts["excluded"] ?? 0}
          hint="Behind a protected seam — never shown as built"
        />
        <Stat
          label="Out of scope"
          value={counts["out-of-scope"] ?? 0}
          hint="Inside ABox, outside Lucie depth"
        />
      </div>

      <Section title="Legacy screen dispositions" id="SPINE-RECON">
        <Toolbar>
          <Search value={q} onChange={setQ} placeholder="Search legacy screen, surface, note…" />
          <Select
            label="Disposition"
            value={disp}
            onChange={setDisp}
            options={[
              { value: ALL, label: "All dispositions" },
              { value: "reconciled", label: "Reconciled" },
              { value: "excluded", label: "Excluded" },
              { value: "out-of-scope", label: "Out of scope" },
            ]}
          />
          <Select
            label="Set"
            value={set}
            onChange={setSet}
            options={[{ value: ALL, label: "All sets" }, ...sets.map((s) => ({ value: s, label: s }))]}
          />
        </Toolbar>

        <Table
          rows={rows}
          keyOf={(r) => r.legacyId}
          columns={[
            {
              head: "Legacy screen",
              cell: (r) => (
                <>
                  <Id>{r.legacyId}</Id>
                  <div className="mt-1 font-medium">{r.legacyName}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{r.legacySet}</div>
                  <Link
                    to={r.legacyRoute}
                    className="mt-1 inline-block font-mono text-[10.5px] text-muted-foreground underline decoration-dotted"
                  >
                    {r.legacyRoute}
                  </Link>
                </>
              ),
              className: "min-w-[190px]",
            },
            {
              head: "Disposition",
              cell: (r) => <Tag tone={TONE[r.disposition]}>{r.disposition}</Tag>,
            },
            {
              head: "IA v2.0 surfaces",
              cell: (r) =>
                r.surfaces.length ? (
                  <ul className="grid gap-1">
                    {r.surfaces.map((id) => (
                      <li key={id}>
                        <Id>{id}</Id>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {SURFACE_BY_ID[id]?.surfaceName ?? "not in Lucie baseline"}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-[11px] text-muted-foreground">no Lucie surface</span>
                ),
              className: "min-w-[210px]",
            },
            { head: "Seams", cell: (r) => <IdList ids={r.seams} /> },
            { head: "Note", cell: (r) => r.note, className: "min-w-[250px]" },
          ]}
        />
      </Section>

      <Section
        title="Broader Phase 1 low-fidelity set — group dispositions"
        id="SPINE-RECON-P1"
        meta="The 70-screen /p1 set, resolved by group"
        description="The /p1 set was organised by capability group rather than by IA screen ID, so it reconciles at group level. Excluded groups keep their module boundary and object fields; they lose their UI."
      >
        <Table
          rows={P1_GROUP_DISPOSITIONS}
          keyOf={(g) => g.group}
          columns={[
            { head: "Group", cell: (g) => <span className="font-medium">{g.group}</span> },
            { head: "Disposition", cell: (g) => <Tag tone={TONE[g.disposition]}>{g.disposition}</Tag> },
            { head: "Surfaces", cell: (g) => <IdList ids={g.surfaces} empty="none in Lucie" /> },
            { head: "Seams", cell: (g) => <IdList ids={g.seams} /> },
            { head: "Note", cell: (g) => g.note, className: "min-w-[250px]" },
          ]}
        />
      </Section>

      <Note tone="stop">
        Excluded is not deleted and not implied-later. Commissions, revenue splits, contract sharing,
        referral rewards and dynamic form authoring keep their seam IDs and interface boundaries so
        the real implementation has somewhere to land — but nothing in Lucie may present them as
        available.
      </Note>
    </>
  );
}
