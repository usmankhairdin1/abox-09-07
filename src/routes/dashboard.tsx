import { createFileRoute } from "@tanstack/react-router";

import { AppShell, useShell } from "@/components/shell/AppShell";
import {
  AclNote,
  Annotation,
  PageHeading,
  Pill,
  WBox,
  WChart,
  WLine,
  WPanel,
  WRow,
} from "@/components/wireframe/primitives";
import { ROLES } from "@/lib/abox";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboards & Analytics — ABox Wireframe" },
      {
        name: "description",
        content:
          "Low-fidelity wireframe of the ABox dashboard shell: performance cards, funnel metrics, quote and lead activity, commission projection and marketplace activity.",
      },
      { property: "og:title", content: "Dashboards & Analytics — ABox Wireframe" },
      {
        property: "og:description",
        content:
          "Structure-only ABox analytics shell with workspace, entity, date and product filters.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { labels, roleId } = useShell();
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[1];

  return (
    <AppShell drawerTitle="Dashboard context" assistantContext="this dashboard">
      <PageHeading
        eyebrow="Dashboards & Analytics"
        title="Analytics shell"
        id="SCR_DASHBOARD"
        description="A shell, not a finished dashboard: filter bar plus swappable blocks. Charts are grey placeholders at this fidelity — metric definitions and visual treatment come in a later batch."
        actions={
          <>
            <Pill>Save view</Pill>
            <Pill>Export</Pill>
          </>
        }
      />

      <WPanel title="Filter bar" id="SCR_DASHBOARD_FILTERS" meta="Filters cascade: entity options are limited by workspace, product options by sellability">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {[
            `${labels.workspace}`,
            "Entity / downline",
            "Date range",
            "Product line",
            `${labels.agent} / team`,
          ].map((f) => (
            <div key={f} className="rounded-md border border-border px-2.5 py-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{f}</p>
              <WLine w="70%" className="mt-1.5" />
            </div>
          ))}
        </div>
        <Annotation className="mt-2">
          Filter state is part of the saved view and is reflected in the right drawer Context tab.
        </Annotation>
      </WPanel>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { id: "KPI_QUOTES", label: "Quotes started" },
          { id: "KPI_SUBMITTED", label: "Applications submitted" },
          { id: "KPI_CONVERSION", label: "Conversion rate" },
          { id: "KPI_ACTIVE", label: `Active ${labels.member.toLowerCase()}s` },
        ].map((k) => (
          <div key={k.id} className="rounded-lg border border-border bg-card p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k.id}</p>
            <p className="mt-1 text-sm font-medium">{k.label}</p>
            <WLine w="45%" className="mt-2 h-4" />
            <WLine w="65%" className="mt-2 h-1.5 bg-muted/70" />
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <WPanel title="Funnel" id="SCR_DASHBOARD_FUNNEL" meta="Shop → quote → cart → application → submitted → effectuated">
          <div className="space-y-1.5">
            {["Shopping sessions", "Quotes", "Carts", "Applications", "Submitted", "Effectuated"].map(
              (s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="w-36 shrink-0 text-[11px] text-muted-foreground">{s}</span>
                  <WBox className="h-6 flex-1 justify-start p-0">
                    <div
                      className="h-full rounded bg-muted"
                      style={{ width: `${100 - i * 14}%` }}
                      aria-hidden="true"
                    />
                  </WBox>
                </div>

              ),
            )}
          </div>
          <Annotation className="mt-2">
            Stage names must match the Module 1 event model. Off-exchange and ancillary lines enter
            the same funnel with a product dimension rather than a separate funnel.
          </Annotation>
        </WPanel>

        <WPanel title="Quote activity" id="SCR_DASHBOARD_QUOTES" meta="By day, channel (D2C vs agent assisted) and product">
          <WChart bars={12} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["D2C", "Agent assisted", "Shared quote", "Quick quote"].map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
        </WPanel>

        <WPanel title={`${labels.lead} activity`} id="SCR_DASHBOARD_LEADS" meta="Source, status, ageing and assignment">
          <WChart bars={9} />
          <div className="mt-3">
            <WRow trailing={<Pill>Open</Pill>} />
            <WRow trailing={<Pill>Open</Pill>} />
          </div>
        </WPanel>

        {role.commissions ? (
          <WPanel
            title="Commission projection snapshot"
            id="SCR_DASHBOARD_COMMISSION"
            meta="Projection only — statements and reconciliation live in the Commissions module"
          >
            <div className="grid grid-cols-3 gap-2">
              {["Projected MTD", "Projected annualised", "Pending overrides"].map((k) => (
                <div key={k} className="rounded-md border border-border p-2.5">
                  <p className="text-[11px] text-muted-foreground">{k}</p>
                  <WLine w="60%" className="mt-2 h-3.5" />
                </div>
              ))}
            </div>
            <WChart bars={10} height={100} />
            <Annotation className="mt-2">
              Covers PMPM, PEPM, PCPM, flat fee, contingent, overrides, upline and super bonuses, and
              recurring/annual bonus models as configured on the schedule.
            </Annotation>
          </WPanel>
        ) : (
          <WPanel title="Commission projection" id="SCR_DASHBOARD_COMMISSION">
            <Annotation>
              Block absent for {role.label.toLowerCase()}: commission visibility flag is off. It is
              removed, not blurred — switch role in Profile to compare.
            </Annotation>
          </WPanel>
        )}

        <WPanel
          title={`${labels.marketplace} activity`}
          id="SCR_DASHBOARD_MARKETPLACE"
          meta="Traffic and outcomes per marketplace / storefront"
          className="lg:col-span-2"
        >
          <div className="grid gap-2 md:grid-cols-3">
            <WChart bars={11} />
            <WChart bars={11} />
            <div className="rounded-md border border-border p-3">
              <p className="text-[11px] text-muted-foreground">Top storefronts</p>
              <WRow /> <WRow /> <WRow />
            </div>
          </div>
        </WPanel>
      </div>

      <AclNote>
        Every metric is entity scoped: an {labels.agent.toLowerCase()} sees only their own production,
        an {labels.agency.toLowerCase()} admin sees their entity plus downline, platform admins see
        all. Cross-entity comparison is only available where the relationship grants it. Exports
        inherit the same scope and are logged.
      </AclNote>
    </AppShell>
  );
}
