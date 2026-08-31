import { createFileRoute, Link } from "@tanstack/react-router";

import { DispositionBanner } from "@/components/LucieDisposition";
import { dispositionForGroup } from "@/lib/reconciliation-status";

import { AppShell } from "@/components/shell/AppShell";
import {
  AclNote,
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WPanel,
} from "@/components/wireframe/primitives";
import { P1_GROUPS, P1_SCREENS } from "@/lib/p1";

export const Route = createFileRoute("/p1/")({
  head: () => ({
    meta: [
      { title: "Broader Phase 1 Wireframes — ABox Platform Coverage" },
      {
        name: "description",
        content:
          "Low-fidelity wireframes for broader ABox Phase 1: off-exchange enrollment, form configurator, products and rates, agency management, paper and referrals, commissions, communications, outputs, AI governance and admin configuration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Broader Phase 1 Wireframes — ABox" },
      {
        property: "og:description",
        content:
          "Full Phase 1 wireframe coverage beyond active Module 1, organised into ten capability groups with workspace, module, ACL, drawer and assistant annotations.",
      },
    ],
  }),
  component: P1Index,
});

function P1Index() {
  const m2 = P1_SCREENS.filter((s) => s.packet === "M2-Cand").length;

  return (
    <AppShell
      drawerTitle="Phase 1 inventory context"
      assistantContext="the broader Phase 1 wireframe set"
      drawerBody={{
        Context: (
          <Annotation>
            Sources: Abox_phase_1_Blueprint_v2_6.19.26.pdf, ABox_Phase1_IA_Handoff_Package_v1.0 and
            ABox_Module1_Reconciliation_Package_v1.0, under the locked hierarchy with the North Star
            above all.
          </Annotation>
        ),
        Summary: (
          <Annotation>
            {P1_SCREENS.length} broader Phase 1 screens across 10 capability groups. {m2} are Module
            2 candidates; the rest sit in later Phase 1 packets.
          </Annotation>
        ),
        Guidance: (
          <Annotation>
            None of these screens changes active Module 1. Where a screen touches Module 1, the seam
            is recorded read-only on the screen itself.
          </Annotation>
        ),
        Audit: (
          <Annotation>
            Every screen carries its own audit expectations in its drawer notes.
          </Annotation>
        ),
        "Next actions": (
          <Annotation>Open a group, walk its screens, then mark packet sequencing.</Annotation>
        ),
      }}
    >
      <PageHeading
        eyebrow="Broader Phase 1 · beyond active Module 1"
        title="Broader Phase 1 wireframes"
        id="P1-INVENTORY"
        description="Full Phase 1 wireframe coverage for future module packets: off-exchange enrollment, the form configurator, products and rates, agency and agent management, carrier paper and referrals, commissions, communications, outputs and reporting, AI governance, and platform administration."
        actions={
          <>
            <Pill>{P1_SCREENS.length} screens</Pill>
            <Pill>10 groups</Pill>
            <Link
              to="/m1"
              className="rounded-lg border border-hairline px-3 py-1.5 text-xs hover:bg-accent"
            >
              Module 1 set →
            </Link>
          </>
        }
      />

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <WPanel title="Scope fence" id="P1-FENCE" className="lg:col-span-2">
          <AclNote>
            Active Module 1 is untouched. These wireframes describe capability that the
            Reconciliation Package places in Module 2 or a later Phase 1 packet. Where a screen
            configures something Module 1 renders — marketplace setup, routing, help content, the
            EDE integration record, Plan-AI ranking — the Module 1 screen itself is unchanged and the
            seam is annotated.
          </AclNote>
        </WPanel>
        <WPanel title="Packet split" id="P1-PACKETS">
          <div className="flex flex-wrap gap-1.5">
            <Pill>{m2} Module 2 candidates</Pill>
            <Pill>{P1_SCREENS.length - m2} later Phase 1</Pill>
          </div>
        </WPanel>
      </div>

      <div className="mt-4 space-y-4">
        {P1_GROUPS.map(({ group, screens }, n) => (
          <WPanel
            key={group}
            title={`${n + 1}. ${group}`}
            id={`P1-G${n + 1}`}
            meta={`${screens.length} screens`}
          >
            <DispositionBanner
              info={dispositionForGroup(group)}
              legacyId={`P1 group ${n + 1}`}
              className="mb-3"
            />
            <ul className="grid gap-2 md:grid-cols-2">
              {screens.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/p1/$screen"
                    params={{ screen: s.slug }}
                    className="block rounded-lg border border-hairline bg-card p-3 hover:bg-accent/50"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <IdChip>{s.id}</IdChip>
                      <span className="text-sm font-medium tracking-tight">{s.name}</span>
                      <Pill>{s.packet === "M2-Cand" ? "M2 candidate" : "Later P1"}</Pill>
                    </div>
                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {s.purpose}
                    </p>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.module} · {s.shell === "consumer" ? "branded" : "internal shell"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </WPanel>
        ))}
      </div>
    </AppShell>
  );
}
