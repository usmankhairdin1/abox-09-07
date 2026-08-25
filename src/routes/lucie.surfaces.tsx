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
import {
  idList,
  legacyForSurface,
  SURFACES,
  SURFACE_POSTURES,
  slicesForSurface,
  WORKSPACE_LABELS,
  WORKSPACE_IDS,
} from "@/lib/lucie";

export const Route = createFileRoute("/lucie/surfaces")({
  head: () => ({
    meta: [
      { title: "Lucie Surface Baseline — IA v2.0 Screens in the Release" },
      {
        name: "description",
        content:
          "The Lucie surface baseline keyed to Phase 1 IA v2.0 screen IDs: workspace placement, owning modules, posture, route pattern, Lucie adaptation and wireframe need.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie Surface Baseline" },
      {
        property: "og:description",
        content:
          "IA v2.0 controls stable surface IDs and placement. Lucie adapts depth, never identity.",
      },
    ],
  }),
  component: SurfacesPage,
});

const ALL = "__all";

function SurfacesPage() {
  const [wsp, setWsp] = useState(ALL);
  const [posture, setPosture] = useState(ALL);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SURFACES.filter((s) => {
      if (wsp !== ALL && s.workspaceId !== wsp) return false;
      if (posture !== ALL && s.luciePosture !== posture) return false;
      if (!needle) return true;
      return [
        s.lucieSurfaceId,
        s.upstreamIaScreenId,
        s.surfaceName,
        s.purpose,
        s.lucieAdaptation,
        s.canonicalModules,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [wsp, posture, q]);

  return (
    <>
      <PageHead
        eyebrow="Experience structure"
        title="Lucie surface baseline"
        lede="Phase 1 IA v2.0 owns surface identity, workspace placement and canonical object homes. Lucie may reduce a surface's depth or defer it behind a seam, but it may not rename, relocate or fork one — that is how the four-month release stays reconcilable with the full platform."
        right={<Id>{`${rows.length} of ${SURFACES.length} surfaces`}</Id>}
      />

      <Section title="Surfaces" id="SPINE-SURFACES">
        <Toolbar>
          <Search value={q} onChange={setQ} placeholder="Search surface, purpose, adaptation…" />
          <Select
            label="Workspace"
            value={wsp}
            onChange={setWsp}
            options={[
              { value: ALL, label: "All workspaces" },
              ...WORKSPACE_IDS.map((id) => ({
                value: id,
                label: WORKSPACE_LABELS[id] ?? id,
              })),
            ]}
          />
          <Select
            label="Posture"
            value={posture}
            onChange={setPosture}
            options={[
              { value: ALL, label: "All postures" },
              ...SURFACE_POSTURES.map((p) => ({ value: p, label: p })),
            ]}
          />
        </Toolbar>

        <Table
          rows={rows}
          keyOf={(s) => s.lucieSurfaceId}
          columns={[
            {
              head: "Surface",
              cell: (s) => (
                <>
                  <Id>{s.lucieSurfaceId}</Id>
                  <div className="mt-1 font-medium">{s.surfaceName}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    upstream {s.upstreamIaScreenId} · {s.upstreamStableIdStatus}
                  </div>
                </>
              ),
              className: "min-w-[230px]",
            },
            {
              head: "Workspace",
              cell: (s) => (
                <span className="text-xs">{WORKSPACE_LABELS[s.workspaceId] ?? s.workspaceId}</span>
              ),
            },
            { head: "Modules", cell: (s) => <IdList ids={idList(s.canonicalModules)} /> },
            { head: "Posture", cell: (s) => <PostureTag posture={s.luciePosture} /> },
            {
              head: "Purpose & adaptation",
              cell: (s) => (
                <>
                  <div>{s.purpose}</div>
                  {s.lucieAdaptation ? (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Lucie adaptation: {s.lucieAdaptation}
                    </div>
                  ) : null}
                  {s.routePattern ? (
                    <div className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                      {s.routePattern}
                    </div>
                  ) : null}
                </>
              ),
              className: "min-w-[260px]",
            },
            {
              head: "Coverage",
              cell: (s) => {
                const legacy = legacyForSurface(s.lucieSurfaceId);
                const slices = slicesForSurface(s.lucieSurfaceId);
                return (
                  <div className="grid gap-1 text-[11px] text-muted-foreground">
                    <span>
                      wireframe required: {/yes/i.test(s.wireframeRequired) ? "yes" : "no"}
                    </span>
                    {slices.length ? (
                      <span>slices: {slices.map((x) => x.id.replace("SLICE-", "")).join(", ")}</span>
                    ) : (
                      <span>no slice yet</span>
                    )}
                    {legacy.length ? (
                      <span className="text-foreground/80">
                        legacy: {legacy.map((l) => l.legacyId).join(", ")}
                      </span>
                    ) : (
                      <span>no legacy antecedent</span>
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      </Section>

      <Note tone="info">
        &ldquo;No slice yet&rdquo; means the surface exists in the Lucie baseline but is not part of
        an integrated acceptance outcome A–H. Those surfaces are supporting administration and
        monitoring views; they still need requirements, but they are not what the release is
        demonstrated on.
      </Note>
    </>
  );
}
