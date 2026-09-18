/**
 * SCR_JET_FORM_CONFIG — Form configurator
 * Working configurator surface: create drafts, edit form metadata,
 * publish/unpublish and preview the rendered field summary.
 */
import { surfaceClass } from "@/components/abox/surface";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileCog, Eye, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SAMPLE_FORMS, type SampleFormTemplate } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/form-configurator")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_FORM_CONFIG.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_FORM_CONFIG.purpose }] }),
  component: Page,
});

function Page() {
  const [forms, setForms] = useState<SampleFormTemplate[]>(SAMPLE_FORMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [preview, setPreview] = useState<SampleFormTemplate | null>(null);

  function newForm() {
    const form: SampleFormTemplate = {
      id: `F-${2000 + forms.length + 1}`,
      name: "Untitled form",
      version: "v0.1",
      fields: 0,
      conditional: 0,
      requiredDocs: 0,
      signatureRequired: false,
      lastEdited: "just now",
      published: false,
    };
    setForms([form, ...forms]);
    setEditingId(form.id);
    setDraftName(form.name);
    toast.success("Draft form created", { description: form.id });
  }

  function saveName(id: string) {
    if (!draftName.trim()) return;
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: draftName.trim(), lastEdited: "just now" } : f)),
    );
    setEditingId(null);
    toast.success("Form updated");
  }

  function togglePublish(form: SampleFormTemplate) {
    setForms((prev) =>
      prev.map((f) => (f.id === form.id ? { ...f, published: !f.published, lastEdited: "just now" } : f)),
    );
    toast(form.published ? "Form unpublished" : "Form published", { description: form.name });
  }

  return (
    <InternalShell
      workspace="jet"
      pageTitle="Form configurator"
      eyebrow="Configuration"
      actions={
        <button
          type="button"
          onClick={newForm}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <FileCog className="h-4 w-4" /> New form
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {forms.map((f) => (
          <article key={f.id} className={surfaceClass()}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-eyebrow">{f.id} · {f.version}</p>
                {editingId === f.id ? (
                  <div className="mt-1 flex items-center gap-1">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveName(f.id)}
                      className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button type="button" aria-label="Save name" onClick={() => saveName(f.id)} className="rounded-full border border-border p-2 hover:bg-accent">
                      <Check className="h-3 w-3" />
                    </button>
                    <button type="button" aria-label="Cancel" onClick={() => setEditingId(null)} className="rounded-full border border-border p-2 hover:bg-accent">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-display mt-1 text-xl">{f.name}</h2>
                )}
                <p className="text-xs text-muted-foreground">Edited {f.lastEdited}</p>
              </div>
              <button type="button" onClick={() => togglePublish(f)} title="Toggle publish state">
                <StatusBadge tone={f.published ? "sage" : "warning"}>{f.published ? "Published" : "Draft"}</StatusBadge>
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
              <Metric label="Fields" value={f.fields} />
              <Metric label="Conditional" value={f.conditional} />
              <Metric label="Req. docs" value={f.requiredDocs} />
              <Metric label="Signature" value={f.signatureRequired ? "Yes" : "No"} />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(f.id);
                  setDraftName(f.name);
                }}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                type="button"
                onClick={() => setPreview(f)}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent"
              >
                <Eye className="h-3 w-3" /> Preview
              </button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={preview !== null} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{preview ? `Preview · ${preview.name}` : "Preview"}</DialogTitle>
          </DialogHeader>
          {preview && (
          <div className="space-y-3 text-sm">
            <p className="text-xs text-muted-foreground">
              {preview.id} · {preview.version} · {preview.published ? "Published" : "Draft"}
            </p>
            <ul className="space-y-2">
              {Array.from({ length: Math.min(preview.fields, 8) }).map((_, i) => (
                <li key={i} className="rounded-lg border border-border bg-surface p-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Field {i + 1}</p>
                  <div className="mt-1 h-8 rounded-md border border-dashed border-border" />
                </li>
              ))}
              {preview.fields === 0 && <li className="text-xs text-muted-foreground">No fields configured yet.</li>}
            </ul>
            {preview.fields > 8 && (
              <p className="text-xs text-muted-foreground">+{preview.fields - 8} more fields in the full form.</p>
            )}
            <p className="text-xs text-muted-foreground">
              {preview.conditional} conditional rules · {preview.requiredDocs} required documents ·{" "}
              {preview.signatureRequired ? "signature required" : "no signature"}
            </p>
          </div>
          )}
        </DialogContent>
      </Dialog>
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
