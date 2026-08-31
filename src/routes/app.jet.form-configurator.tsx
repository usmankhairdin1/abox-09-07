/**
 * SCR_JET_FORM_CONFIG — Form configurator
 */
import { createFileRoute } from "@tanstack/react-router";
import { FileCog, Eye, Pencil } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_FORMS } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/form-configurator")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_FORM_CONFIG.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_FORM_CONFIG.purpose }] }),
  component: Page,
});

function Page() {
  return (
    <InternalShell workspace="jet" pageTitle="Form configurator" eyebrow="Configuration"
      actions={<button className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"><FileCog className="h-4 w-4" /> New form</button>}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {SAMPLE_FORMS.map((f) => (
          <article key={f.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-eyebrow">{f.id} · {f.version}</p>
                <h2 className="text-display mt-1 text-xl">{f.name}</h2>
                <p className="text-xs text-muted-foreground">Edited {f.lastEdited}</p>
              </div>
              <StatusBadge tone={f.published ? "sage" : "warning"}>{f.published ? "Published" : "Draft"}</StatusBadge>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
              <Metric label="Fields" value={f.fields} />
              <Metric label="Conditional" value={f.conditional} />
              <Metric label="Req. docs" value={f.requiredDocs} />
              <Metric label="Signature" value={f.signatureRequired ? "Yes" : "No"} />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent"><Pencil className="h-3 w-3" /> Edit</button>
              <button className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent"><Eye className="h-3 w-3" /> Preview</button>
            </div>
          </article>
        ))}
      </div>
    </InternalShell>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-surface p-2">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}
