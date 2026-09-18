/**
 * SCR-M04-008 — Custom Domain Request.
 * Fixed domain ownership, verification, preview and JET submission flow
 * (REQ-M04-ADM-015).
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { marketplaceStore, MARKETPLACE_ID } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/domains/request")({
  head: () => ({ meta: [{ title: "Custom Domain Request — ABox" }] }),
  component: Page,
});

const STEPS = ["Proposed domain", "Ownership confirmation", "Verification steps", "Preview", "Submit"] as const;

function Page() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [hostname, setHostname] = useState("");
  const [ownsConfirmed, setOwnsConfirmed] = useState(false);

  const onSubmit = () => {
    marketplaceStore.addDomain({
      domain_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, domain_type: "CUSTOM",
      hostname, status: "REQUESTED", is_primary: false, requested_at: new Date().toISOString(),
    });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Requested custom domain ${hostname}.` });
    navigate({ to: "/marketplace/admin/domains" });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Request a custom domain" eyebrow="Custom Domain Request · SCR-M04-008">
      <Link to="/marketplace/admin/domains" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to domains
      </Link>

      <div className="mb-6 flex gap-2 text-xs">
        {STEPS.map((s, i) => (
          <span key={s} className={`rounded-full px-3 py-1 ${i === step ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{i + 1}. {s}</span>
        ))}
      </div>

      <div className={cn("max-w-xl", surfaceClass({ padding: "lg" }))}>
        {step === 0 && (
          <div className="space-y-4 text-sm">
            <header className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Proposed domain</h2></header>
            <input value={hostname} onChange={(e) => setHostname(e.target.value)} placeholder="shop.cedargroveinsurance.com" className="h-10 w-full rounded-lg border border-border bg-background px-3" />
            <button onClick={() => setStep(1)} disabled={!hostname.trim()} className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-40">Continue</button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4 text-sm">
            <h2 className="text-display text-xl">Ownership confirmation</h2>
            <p className="text-muted-foreground">You are responsible for domain ownership, external verification and registration maintenance. JET verifies and activates the route; agencies never receive direct routing, certificate or infrastructure administration.</p>
            <label className="flex items-center gap-2"><input type="checkbox" checked={ownsConfirmed} onChange={(e) => setOwnsConfirmed(e.target.checked)} /> I confirm my organization owns {hostname}</label>
            <button onClick={() => setStep(2)} disabled={!ownsConfirmed} className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-40">Continue</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 text-sm">
            <h2 className="text-display text-xl">Required external steps</h2>
            <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Add a TXT record at <code className="font-mono">_abox-verify.{hostname || "yourdomain.com"}</code></li>
              <li>Point a CNAME for {hostname || "yourdomain.com"} to <code className="font-mono">edge.abox.app</code></li>
              <li>JET verifies both records before activation</li>
            </ol>
            <button onClick={() => setStep(3)} className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Continue</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4 text-sm">
            <h2 className="text-display text-xl">Preview and continuity review</h2>
            <p className="text-muted-foreground">Existing journeys retain canonical marketplace context and are not duplicated when the domain changes. A temporary redirect from the previous domain may be applied during transition.</p>
            <button onClick={() => setStep(4)} className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Continue</button>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4 text-sm">
            <h2 className="text-display text-xl">Submit for JET activation</h2>
            <p className="text-muted-foreground">Submitting creates the domain record in REQUESTED status. JET verifies and activates it from the Domains screen.</p>
            <button onClick={onSubmit} className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Submit request</button>
          </div>
        )}
      </div>
    </InternalShell>
  );
}
