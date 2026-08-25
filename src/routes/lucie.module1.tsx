import { createFileRoute } from "@tanstack/react-router";

import { Id, IdList, KV, Note, PageHead, Section, Tag } from "@/components/lucie/ui";
import { M01_CONTROLS, M01_POSTURE, M01_SCOPE_NOTES, MODULE_BY_ID } from "@/lib/lucie";

export const Route = createFileRoute("/lucie/module1")({
  head: () => ({
    meta: [
      { title: "Module 1 Protection Appendix — Frozen Controls in Lucie" },
      {
        name: "description",
        content:
          "Module 1 is the only protected detailed module baseline. Typed consent, safe URL, EDE handoff, audit, PlanAI evidence, stale quote and PHI/PII controls may not be weakened by any Lucie simplification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Module 1 Protection Appendix" },
      {
        property: "og:description",
        content:
          "Strictly frozen: no approved Module 1 delta. Each control lists what weakening it would look like.",
      },
    ],
  }),
  component: Module1Page,
});

function Module1Page() {
  const m01 = MODULE_BY_ID["M01"];
  return (
    <>
      <PageHead
        eyebrow="Protected baseline"
        title="Module 1 protection appendix"
        lede="Module 1 is the only protected detailed module baseline in the whole source set. Lucie inherits it whole. Each control below is paired with the shape a weakening would actually take, because simplifications rarely announce themselves as control removals."
        right={<Tag tone="stop">{M01_POSTURE}</Tag>}
      />

      {m01 ? (
        <Section title="Canonical module record" id="M01">
          <dl className="grid gap-0">
            <KV k="Canonical name" v={m01.canonicalName} />
            <KV k="Ownership" v={m01.canonicalOwnership} />
            <KV k="Lucie posture" v={m01.luciePosture} />
            <KV k="Scope in Lucie" v={m01.lucieScope} />
            <KV k="Simplification / boundary" v={m01.simplificationOrBoundary || "None permitted"} />
            <KV k="Lane" v={<IdList ids={m01.workstream ? [m01.workstream] : []} />} />
          </dl>
        </Section>
      ) : null}

      {M01_CONTROLS.map((c) => (
        <Section key={c.id} title={c.control} id={c.id}>
          <dl className="grid gap-0">
            <KV k="Requirement" v={c.requirement} />
            <KV
              k="Weakening would look like"
              v={<span className="text-foreground/85">{c.weakeningWouldLookLike}</span>}
            />
            <KV k="Surfaces bound by it" v={<IdList ids={c.surfaces} />} />
            <KV k="Lanes accountable" v={<IdList ids={c.workstreams} />} />
          </dl>
        </Section>
      ))}

      <Section title="Module 1 scope notes for Lucie" id="M01-SCOPE-NOTES">
        <ul className="grid gap-2">
          {M01_SCOPE_NOTES.map((n) => (
            <li key={n} className="flex gap-2 text-xs leading-relaxed">
              <span className="text-muted-foreground">·</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
        <Note tone="warn">
          A scope note narrows what Lucie ships. It never narrows a control. If a slice appears to
          need a control relaxed, that goes back as a proposed Module 1 delta with an explicit
          approval — it does not get absorbed as a Lucie simplification.
        </Note>
      </Section>

      <Id>protected_detailed_module_baselines = [M01]</Id>
    </>
  );
}
