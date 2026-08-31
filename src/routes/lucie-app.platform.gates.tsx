import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageHeader, Section, StatCard, StatusChip, toneFor } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/platform/gates")({
  head: () => ({
    meta: [
      { title: "Launch gates — JET platform" },
      {
        name: "description",
        content:
          "The checks that must clear before a marketplace, tenant or module is allowed to go live.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Launch gates" },
      {
        property: "og:description",
        content: "Activation control for marketplaces, tenants and modules.",
      },
    ],
  }),
  component: GatesPage,
});

const LABEL: Record<string, string> = {
  open: "open",
  conditional: "conditional",
  closed: "closed",
};

function GatesPage() {
  const { state, dispatch } = useLucie();
  const open = state.gates.filter((g) => g.state === "open").length;

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Launch gates"
        lede="Nothing goes live because someone said it was ready. Each gate has an owner and evidence, and activation stays unavailable while any gate is closed."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Open"
          value={`${open} of ${state.gates.length}`}
          tone={open === state.gates.length ? "good" : "warn"}
        />
        <StatCard
          label="Conditional"
          value={state.gates.filter((g) => g.state === "conditional").length}
          tone="warn"
        />
        <StatCard
          label="Closed"
          value={state.gates.filter((g) => g.state === "closed").length}
          tone="bad"
        />
      </div>

      <Section title="Gate register" description="Move a gate only when its evidence supports it.">
        <div className="grid gap-3">
          {state.gates.map((g) => (
            <Card key={g.id} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-semibold">{g.name}</p>
                  <StatusChip tone={toneFor(g.state)}>{LABEL[g.state]}</StatusChip>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{g.criteria}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.id} · owner {g.owner} · evidence: {g.evidence}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["closed", "conditional", "open"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={g.state === s ? "default" : "outline"}
                    onClick={() => {
                      if (g.state === s) return;
                      dispatch({ type: "gate:set", id: g.id, state: s });
                      toast.success(`${g.name} set to ${s}.`);
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
