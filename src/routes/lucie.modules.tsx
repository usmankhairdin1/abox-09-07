import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  Id,
  IdList,
  Note,
  PageHead,
  PostureTag,
  Search,
  Section,
  Table,
  Toolbar,
} from "@/components/lucie/ui";
import {
  capabilitiesForModule,
  MODULE_SLICES,
  SEAMS,
  surfacesForModule,
} from "@/lib/lucie";

export const Route = createFileRoute("/lucie/modules")({
  head: () => ({
    meta: [
      { title: "Canonical Modules M00–M26 — Lucie Posture and Ownership" },
      {
        name: "description",
        content:
          "Stable ABox module IDs M00 through M26 with canonical ownership, Lucie posture, scope in the release, simplification or boundary, owning lane and protected seams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Canonical Modules M00–M26" },
      {
        property: "og:description",
        content:
          "Module IDs are ownership and traceability identifiers, never build order. Excluded modules keep their ID and interface boundary.",
      },
    ],
  }),
  component: ModulesPage,
});

function ModulesPage() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return MODULE_SLICES;
    return MODULE_SLICES.filter((m) =>
      [m.moduleId, m.canonicalName, m.luciePosture, m.lucieScope, m.simplificationOrBoundary]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [q]);

  return (
    <>
      <PageHead
        eyebrow="Ownership spine"
        title="Canonical modules M00–M26"
        lede="Module IDs are ownership and traceability identifiers. They are not build order, and Lucie does not get its own module numbers. A module excluded from Lucie still keeps its ID, its objects and its interface boundary so the replacement work has somewhere to land."
        right={<Id>{`${rows.length} of ${MODULE_SLICES.length} modules`}</Id>}
      />

      <Section title="Module register" id="SPINE-MODULES">
        <Toolbar>
          <Search value={q} onChange={setQ} placeholder="Search module, posture, boundary…" />
        </Toolbar>
        <Table
          rows={rows}
          keyOf={(m) => m.moduleId}
          columns={[
            {
              head: "Module",
              cell: (m) => (
                <>
                  <Id>{m.moduleId}</Id>
                  <div className="mt-1 font-medium">{m.canonicalName}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {m.canonicalOwnership}
                  </div>
                </>
              ),
              className: "min-w-[200px]",
            },
            { head: "Lucie posture", cell: (m) => <PostureTag posture={m.luciePosture} /> },
            { head: "Scope in Lucie", cell: (m) => m.lucieScope || "—" },
            {
              head: "Simplification / boundary",
              cell: (m) => m.simplificationOrBoundary || "—",
              className: "text-muted-foreground",
            },
            { head: "Lane", cell: (m) => <IdList ids={m.workstream ? [m.workstream] : []} /> },
            {
              head: "Load",
              cell: (m) => {
                const caps = capabilitiesForModule(m.moduleId);
                const surfaces = surfacesForModule(m.moduleId);
                const seams = SEAMS.filter((s) => s.moduleId === m.moduleId);
                return (
                  <div className="grid gap-0.5 text-[11px] text-muted-foreground">
                    <span>{caps.length} capabilities</span>
                    <span>{surfaces.length} surfaces</span>
                    {seams.length ? (
                      <span className="text-foreground/80">
                        {seams.length} seam{seams.length === 1 ? "" : "s"}
                      </span>
                    ) : null}
                  </div>
                );
              },
            },
            {
              head: "Stable ID rule",
              cell: (m) => m.stableIdRule || "—",
              className: "text-muted-foreground",
            },
          ]}
        />
      </Section>

      <Note tone="info">
        Zero surfaces against an in-scope module is a signal, not a bug: some modules are entirely
        non-visual controls (tenant isolation, audit substrate, connector health), and some are
        excluded seams whose only Lucie footprint is a preserved field and interface boundary.
      </Note>
    </>
  );
}
