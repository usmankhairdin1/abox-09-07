/**
 * SCR-M05-023 — Organization Imports.
 * Fixed M05 template, upload, all-or-nothing row validation, preview and
 * commit (REQ-M05-OPS-007/008/009).
 */
import { useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Download, Upload, FileWarning } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, type ImportRow } from "@/lib/org-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/organization-imports/")({
  head: () => ({ meta: [{ title: "Organization Imports — ABox" }, { name: "description", content: "Template, upload, validation, preview and commit." }] }),
  component: Page,
});

const TEMPLATE_HEADER = "display_name,legal_name,contact_name,contact_email,city,state_code";
const TEMPLATE_SAMPLE = "Example Agency LLC,Example Agency Legal Name LLC,Jordan Rivera,jordan@example.com,Austin,TX";

function downloadTemplate() {
  const blob = new Blob([`${TEMPLATE_HEADER}\n${TEMPLATE_SAMPLE}\n`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "abox-m05-organization-import-template.csv";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRows(text: string, existingNames: Set<string>): ImportRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const [, ...dataLines] = lines; // skip header
  return dataLines.map((line, idx) => {
    const [display_name = "", legal_name = "", contact_name = "", contact_email = "", city = "", state_code = ""] = line.split(",").map((c) => c.trim());
    const errors: string[] = [];
    if (!display_name) errors.push("display_name is required");
    if (!legal_name) errors.push("legal_name is required");
    if (!contact_name) errors.push("contact_name is required");
    if (!contact_email || !EMAIL_RE.test(contact_email)) errors.push("contact_email is invalid");
    if (state_code && state_code.length !== 2) errors.push("state_code must be a 2-letter code");
    if (display_name && existingNames.has(display_name.toLowerCase())) errors.push("possible duplicate of an existing organization name");
    return { row_number: idx + 1, display_name, legal_name, contact_name, contact_email, city, state_code, status: errors.length ? "ERROR" as const : "VALID" as const, errors };
  });
}

function Page() {
  const org = useOrgState();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [rows, setRows] = useState<ImportRow[] | null>(null);

  const onFile = (file: File) => {
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const existingNames = new Set(org.organizations.map((o) => o.display_name.toLowerCase()));
      setRows(validateRows(String(reader.result ?? ""), existingNames));
    };
    reader.readAsText(file);
  };

  const hasErrors = rows?.some((r) => r.status === "ERROR") ?? false;

  const onProceed = () => {
    if (!rows || hasErrors) return;
    const job = {
      import_job_id: crypto.randomUUID().slice(0, 8), tenant_id: "tenant-cedar-grove", filename: filename ?? "import.csv",
      status: "VALIDATED" as const, rows, created_at: new Date().toISOString(),
    };
    orgStore.createImportJob(job);
    navigate({ to: "/agency/organization-imports/$importJobId", params: { importJobId: job.import_job_id } });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Organization imports" eyebrow="Organization Imports · SCR-M05-023">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">1. Download the fixed template</h2>
          <p className="mb-4 text-sm text-muted-foreground">One fixed column layout: display_name, legal_name, contact_name, contact_email, city, state_code.</p>
          <ActionPill onClick={downloadTemplate} variant="outlineMd">
            <Download className="h-4 w-4" aria-hidden /> Download CSV template
          </ActionPill>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">2. Upload and validate</h2>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          <ActionPill onClick={() => fileRef.current?.click()} variant="primaryMd">
            <Upload className="h-4 w-4" aria-hidden /> Choose CSV file
          </ActionPill>
          {filename && <p className="mt-2 text-xs text-muted-foreground">{filename}</p>}
        </section>
      </div>

      {rows && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-display text-xl">Row validation ({rows.length} rows)</h2>
            {hasErrors && (
              <span className="flex items-center gap-1.5 text-sm text-destructive"><FileWarning className="h-4 w-4" aria-hidden /> Blocking errors — no rows will commit until fixed</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <tr><th className="px-3 py-2">Row</th><th className="px-3 py-2">Display name</th><th className="px-3 py-2">Contact</th><th className="px-3 py-2">Location</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Errors</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.row_number}>
                    <td className="px-3 py-2">{r.row_number}</td>
                    <td className="px-3 py-2">{r.display_name || "—"}</td>
                    <td className="px-3 py-2">{r.contact_email || "—"}</td>
                    <td className="px-3 py-2">{r.city}{r.city && r.state_code ? ", " : ""}{r.state_code}</td>
                    <td className="px-3 py-2"><StatusBadge tone={r.status === "VALID" ? "sage" : "destructive"}>{r.status}</StatusBadge></td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{r.errors.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={onProceed} disabled={hasErrors}
            className="mt-4 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            Continue to commit
          </button>
        </section>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        <Link to="/agency/organization-admin" className="story-link text-primary">Back to admin home</Link>
      </p>
    </InternalShell>
  );
}
