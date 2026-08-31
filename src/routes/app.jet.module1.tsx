/**
 * UX-024 & UX-025 — Module 1 Config
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/jet/module1")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-024"].name} — ABox` }, { name: "description", content: SCREENS["UX-024"].purpose }] }),
  component: Page,
});

function Page() {
  const [tab, setTab] = useState<"branding" | "routing">("branding");
  return (
    <InternalShell workspace="jet" pageTitle="Module 1 configuration" eyebrow="Configuration">
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-surface p-1 text-sm sm:max-w-md">
        <button onClick={() => setTab("branding")} aria-pressed={tab === "branding"}
          className={cn("rounded-full py-2", tab === "branding" ? "bg-card font-medium shadow-[var(--shadow-card)]" : "text-muted-foreground")}>
          UX-024 · Branding & products
        </button>
        <button onClick={() => setTab("routing")} aria-pressed={tab === "routing"}
          className={cn("rounded-full py-2", tab === "routing" ? "bg-card font-medium shadow-[var(--shadow-card)]" : "text-muted-foreground")}>
          UX-025 · Routing & notifications
        </button>
      </div>

      {tab === "branding" ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-eyebrow">Superseded by Marketplace Management</p>
          <h2 className="text-display mt-2 text-2xl">Marketplace branding now lives in Marketplace Management</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            This early Module 1 mock has been replaced by the real M04 Marketplace Management surfaces, which persist
            changes and drive the live consumer marketplace — editing here would no longer do anything.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/marketplace/admin/brand" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Identity &amp; brand <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/marketplace/admin/availability" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-accent">
              Product availability &amp; ranking <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/marketplace/admin/content" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-accent">
              Content &amp; disclosures <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow">Lead routing</p>
            <div className="mt-3 space-y-3 text-sm">
              <Toggle label="Round robin (default)" defaultChecked />
              <Toggle label="Route by producer specialty" />
              <Toggle label="Route by state license" defaultChecked />
              <Toggle label="Sticky routing per household" defaultChecked />
              <Field label="Fallback owner" defaultValue="Elena Alvarez" />
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow">Notifications</p>
            <div className="mt-3 space-y-3 text-sm">
              <Toggle label="Send shared quote — 48h expiry nudge" defaultChecked />
              <Toggle label="Callback confirmation via SMS" defaultChecked />
              <Toggle label="Enrollment complete email" defaultChecked />
              <Toggle label="Plan-AI abandoned nudge" />
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow">Scheduling availability</p>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} className="rounded-lg border border-border py-2">
                  <p className="font-medium">{d}</p>
                  <p className="mt-1 text-muted-foreground">9–5</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow">Plan-AI</p>
            <Toggle label="Plan-AI on marketplace" defaultChecked />
            <Toggle label="Plan-AI on agent quick quote" defaultChecked />
            <Toggle label="Plan-AI on shared quote (recipient)" />
          </section>
        </div>
      )}
    </InternalShell>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}
function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--primary)]" />
    </label>
  );
}
