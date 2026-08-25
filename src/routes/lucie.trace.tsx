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
  Select,
  Table,
  Toolbar,
} from "@/components/lucie/ui";
import { MODULE_SLICES, TRACE_ROWS, WORKSTREAMS } from "@/lib/lucie";

export const Route = createFileRoute("/lucie/trace")({
  head: () => ({
    meta: [
      { title: "Lucie Traceability Matrix — Capabilities to Modules and Surfaces" },
      {
        name: "description",
        content:
          "Every Lucie capability resolved to its delivery lane, canonical module IDs, IA v2.0 surface IDs, protected seams, explicit boundary and release gate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie Traceability Matrix" },
      {
        property: "og:description",
        content:
          "The no-orphan matrix: capability ID, workstream, canonical module, surface, seam and gate in one row.",
      },
    ],
  }),
  component: TraceMatrix,
});

const ALL = "__all";

function TraceMatrix() {
  const [ws, setWs] = useState(ALL);
  const [mod, setMod] = useState(ALL);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TRACE_ROWS.filter((r) => {
      if (ws !== ALL && !r.workstreams.includes(ws)) return false;
      if (mod !== ALL && !r.modules.includes(mod)) return false;
      if (!needle) return true;
      return [r.capabilityId, r.capability, r.domain, r.posture, r.boundary, r.gate]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [ws, mod, q]);

  const domains = useMemo(() => Array.from(new Set(rows.map((r) => r.domain))).length, [rows]);

  return (
    <>
      <PageHead
        eyebrow="Spine core"
        title="Traceability matrix"
        lede="One row per governed capability. Nothing may enter the backlog, architecture or a test plan without appearing here first, and no row is allowed to exist without a canonical module ID — that is what stops Lucie from growing a second object model."
        right={
          <>
            <Id>{`${rows.length} of ${TRACE_ROWS.length} rows`}</Id>
            <Id>{`${domains} domains`}</Id>
          </>
        }
      />

      <Section title="Capability → lane → module → surface → gate" id="SPINE-TRACE">
        <Toolbar>
          <Search value={q} onChange={setQ} placeholder="Search capability, domain, boundary…" />
          <Select
            label="Lane"
            value={ws}
            onChange={setWs}
            options={[
              { value: ALL, label: "All lanes" },
              ...WORKSTREAMS.map((w) => ({
                value: w.workstreamId,
                label: `${w.workstreamId} · ${w.name}`,
              })),
            ]}
          />
          <Select
            label="Module"
            value={mod}
            onChange={setMod}
            options={[
              { value: ALL, label: "All modules" },
              ...MODULE_SLICES.map((m) => ({
                value: m.moduleId,
                label: `${m.moduleId} · ${m.canonicalName}`,
              })),
            ]}
          />
        </Toolbar>

        <Table
          rows={rows}
          keyOf={(r) => r.capabilityId}
          columns={[
            {
              head: "Capability",
              cell: (r) => (
                <>
                  <Id>{r.capabilityId}</Id>
                  <div className="mt-1 font-medium">{r.capability}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{r.domain}</div>
                </>
              ),
              className: "min-w-[220px]",
            },
            { head: "Posture", cell: (r) => <PostureTag posture={r.posture} /> },
            { head: "Lanes", cell: (r) => <IdList ids={r.workstreams} /> },
            { head: "Modules", cell: (r) => <IdList ids={r.modules} /> },
            {
              head: "Surfaces",
              cell: (r) =>
                r.surfaces.length ? (
                  <details>
                    <summary className="cursor-pointer text-[11px] text-muted-foreground">
                      {r.surfaces.length} surface{r.surfaces.length === 1 ? "" : "s"}
                    </summary>
                    <div className="mt-1.5">
                      <IdList ids={r.surfaces} />
                    </div>
                  </details>
                ) : (
                  <span className="text-[11px] text-muted-foreground">no surface (seam / spec)</span>
                ),
            },
            {
              head: "Seams",
              cell: (r) => <IdList ids={r.seams} empty="—" />,
            },
            {
              head: "Boundary & gate",
              cell: (r) => (
                <>
                  {r.boundary ? <div className="text-foreground/85">{r.boundary}</div> : null}
                  {r.gate ? (
                    <div className="mt-1 text-[11px] text-muted-foreground">Gate: {r.gate}</div>
                  ) : null}
                </>
              ),
              className: "min-w-[220px]",
            },
          ]}
        />
      </Section>

      <Note tone="info">
        Surface columns are derived from module ownership, not authored per capability. That means a
        capability cannot silently acquire a surface that IA v2.0 does not place in its module — and
        a capability with no surface is either a protected seam or a non-visual control, which the
        seam column makes explicit.
      </Note>
    </>
  );
}
