import { createFileRoute, Link } from "@tanstack/react-router";

import { DispositionChip } from "@/components/LucieDisposition";
import { dispositionForScreen } from "@/lib/reconciliation-status";

import { AppShell } from "@/components/shell/AppShell";
import {
  AclNote,
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WPanel,
} from "@/components/wireframe/primitives";
import { M1_GROUPS, M1_REQUEST_MAP, M1_SCREENS } from "@/lib/m1";

export const Route = createFileRoute("/m1/")({
  head: () => ({
    meta: [
      { title: "Module 1 Wireframes — ABox IFP Shopping & EDE Handoff" },
      {
        name: "description",
        content:
          "Low-fidelity Module 1 wireframe set for ABox: IFP shopping, Plan-O, results, compare, cart, registration, shared quote, agent quick quote, lead timeline, minimal agency configuration and EDE handoff (UX-001 to UX-026).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Module 1 Wireframes — ABox" },
      {
        property: "og:description",
        content:
          "The 26 protected Module 1 screens from the V4 Hardening Package, rendered as walkable low-fidelity wireframes.",
      },
    ],
  }),
  component: M1Index,
});

function M1Index() {
  return (
    <AppShell
      drawerTitle="Module 1 index context"
      assistantContext="the Module 1 wireframe set"
      drawerBody={{
        Context: (
          <Annotation>
            Active build source: ABox_Module1_V4_Hardening_Package. Scope fence:
            ABox_Module1_Reconciliation_Package_v1.0. Shell, drawer, assistant and nav framing:
            ABox_Phase1_IA_Handoff_Package_v1.0.
          </Annotation>
        ),
      }}
    >
      <PageHeading
        eyebrow="Module 1 · IFP shopping & EDE handoff"
        title="Module 1 wireframes"
        id="UX-001 … UX-026"
        description="The 26 screens defined by the V4 Hardening Package wireframe deck. Every requested wireframe maps into this set — nothing is invented and no broader Phase 1 capability is added. Screens link forward along the V4 click paths so the set is walkable end to end."
        actions={
          <>
            <Pill>26 screens</Pill>
            <Pill>Protected Module 1 scope</Pill>
          </>
        }
      />

      {M1_GROUPS.map((g) => {
        const screens = M1_SCREENS.filter((s) => s.group === g);
        return (
          <WPanel
            key={g}
            title={g}
            id={`M1-${g.toUpperCase().replace(/[^A-Z]+/g, "-")}`}
            meta={`${screens.length} screen${screens.length === 1 ? "" : "s"}`}
          >
            <div className="grid gap-2 md:grid-cols-2">
              {screens.map((s) => (
                <Link
                  key={s.slug}
                  to="/m1/$screen"
                  params={{ screen: s.slug }}
                  className="rounded-md border border-border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <IdChip>{s.id}</IdChip>
                    <span className="text-sm font-medium">{s.name}</span>
                    <Pill>{s.shell === "consumer" ? "External" : "Internal"}</Pill>
                    <DispositionChip info={dispositionForScreen(s.id)} className="ml-auto" />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{s.purpose}</p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.user}
                  </p>
                </Link>
              ))}
            </div>
          </WPanel>
        );
      })}

      <WPanel
        title="Requested wireframe → V4 screen mapping"
        id="M1-REQUEST-MAP"
        meta="Confirms coverage of all 24 requested wireframes without expanding Module 1"
      >
        <div className="grid gap-2 md:grid-cols-2">
          {M1_REQUEST_MAP.map((m) => (
            <div
              key={m.req}
              className="flex flex-wrap items-center gap-2 border-b border-border/60 py-2"
            >
              <span className="flex-1 text-xs text-foreground/80">{m.req}</span>
              {m.ids.map((id) => (
                <IdChip key={id}>{id}</IdChip>
              ))}
            </div>
          ))}
        </div>
      </WPanel>

      <WPanel title="Explicitly out of scope for Module 1" id="M1-FENCE">
        <div className="flex flex-wrap gap-1.5">
          {[
            "Off-exchange IFP enrollment",
            "Ancillary enrollment / checkout",
            "Form configurator",
            "ICHRA quoting",
            "Commission models",
            "B2B2C paper sharing",
            "Full white labeling",
            "Payment capture",
            "Post-enrollment servicing",
          ].map((x) => (
            <Pill key={x}>{x}</Pill>
          ))}
        </div>
        <Annotation className="mt-2">
          Held for Module 2 or later Phase 1 packets per ABox_Module1_Reconciliation_Package_v1.0.
          None of these appear on any UX-001 … UX-026 screen.
        </Annotation>
      </WPanel>

      <AclNote>
        Internal Module 1 screens (UX-017, 018, 019, 021, 024, 025, 026) render inside the unified
        shell with workspace and entity context and are gated by role: agents reach quick quote,
        send quote and the lead timeline; the configuration screens require agency-admin permission.
        Consumer and member screens are externally branded, carry no internal drawer, and expose
        only the household's own records.
      </AclNote>
    </AppShell>
  );
}
