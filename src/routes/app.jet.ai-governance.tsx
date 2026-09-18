/**
 * SCR_JET_AI_GOV
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_AI_RULES } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/ai-governance")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_AI_GOV.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_AI_GOV.purpose }] }),
  component: Page,
});

function Page() {
  return (
    <InternalShell workspace="jet" pageTitle="AI / PlanAI governance" eyebrow="Governance">
      <p className="mb-4 text-sm text-muted-foreground">
        Enable or disable AI-powered features per tenant, module, or role. Configure disclaimers and escalation paths.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {SAMPLE_AI_RULES.map((r) => (
          <article key={r.id} className={surfaceClass()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-eyebrow">{r.scope} · {r.id}</p>
                <h2 className="text-display mt-1 text-xl">{r.name}</h2>
              </div>
              <StatusBadge tone={r.enabled ? "sage" : "muted"}>{r.enabled ? "Enabled" : "Disabled"}</StatusBadge>
            </div>
            <p className="mt-3 text-sm">Disclaimer: <span className="text-muted-foreground">"{r.disclaimer}"</span></p>
            <p className="mt-1 text-sm">Escalation: <span className="font-medium">{r.escalation}</span></p>
            <div className="mt-4 flex gap-2">
              <button className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">Edit rule</button>
              <button className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">Knowledge sources</button>
            </div>
          </article>
        ))}
      </div>
    </InternalShell>
  );
}
