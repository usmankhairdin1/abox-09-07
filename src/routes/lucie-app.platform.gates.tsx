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
      { name: "description", content: "The checks that must clear before a marketplace, tenant or module is allowed to go live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Launch gates" },
      { property: "og:description", content: "Activation control for marketplaces, tenants and modules." },
    ],
  }),
  component: GatesPage,
});

function GatesPage() {
  const { state, dispatch } = useLucie();
  const cleared = state.gates.filter((g) => g.status === "cleared").length;

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Launch gates"
        lede="Nothing goes live because someone said it was ready. Each gate has an owner and evidence, and the activation button stays disabled until they all clear."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Cleared" value={`${cleared} of ${state.gates.length}`} tone={cleared === state.gates.length ? "good" : "warn"} />
        <StatCard label="Blocked" value={state.gates.filter((g) => g.status === "blocked").length} tone="bad" />
        <StatCard label="Pending" value={state.gates.filter((g) => g.status === "pending").length} />
      </div>

      <Section title="Gate register">
        <div className="grid gap-3">
          {state.gates.map((g) => (
            <Card key={g.id} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-semibold">{g.name}</p>
                  <StatusChip tone={toneFor(g.status)}>{g.status}</StatusChip>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{g.criteria}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.id} · owner {g.owner} · evidence: {g.evidence}
                </p>
              </div>
              {g.status !== "cleared" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch({ type: "gate:clear", id: g.id });
                    toast.success(`${g.name} cleared.`);
                  }}
                >
                  Record evidence & clear
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Cleared</span>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
