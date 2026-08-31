import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeader, Section, StatusChip, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/documents")({
  head: () => ({
    meta: [
      { title: "Supporting documents — Northgate Marketplace" },
      { name: "description", content: "Upload proof of identity and income so the carrier can process your application without delay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Supporting documents" },
      { property: "og:description", content: "Upload the documents your application needs." },
    ],
  }),
  component: DocumentsPage,
});

const REQUESTS = [
  { kind: "Proof of identity", detail: "Driver licence, passport or state ID.", required: true },
  { kind: "Proof of income", detail: "Recent pay stub, tax return or benefit letter.", required: true },
  { kind: "Proof of address", detail: "Utility bill or lease dated in the last 90 days.", required: false },
];

function DocumentsPage() {
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState<string | null>(null);
  const docs = state.application.documents;

  const upload = (kind: string) => {
    setUploading(kind);
    window.setTimeout(() => {
      dispatch({
        type: "app:doc",
        doc: {
          id: `DOC-${Math.floor(Math.random() * 9000 + 1000)}`,
          name: `${kind.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          size: `${(Math.random() * 2 + 0.4).toFixed(1)} MB`,
          kind,
        },
      });
      setUploading(null);
      toast.success(`${kind} uploaded and scanned.`);
    }, 900);
  };

  const missing = REQUESTS.filter((r) => r.required && !docs.some((d) => d.kind === r.kind));

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={5} />
      <PageHeader
        eyebrow="Step 6 of 9"
        title="Supporting documents"
        lede="Uploading now avoids a request later. Files are scanned before they reach the carrier."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Section title="What we need">
          <div className="grid gap-3">
            {REQUESTS.map((r) => {
              const have = docs.filter((d) => d.kind === r.kind);
              return (
                <Card key={r.kind} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="min-w-0 grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{r.kind}</span>
                      {r.required ? <StatusChip tone="warn">Required</StatusChip> : <StatusChip>Optional</StatusChip>}
                      {have.length ? <StatusChip tone="good">Received</StatusChip> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">{r.detail}</p>
                  </div>
                  <Button variant="outline" size="sm" disabled={uploading === r.kind} onClick={() => upload(r.kind)}>
                    <FileUp className="h-3.5 w-3.5" />
                    {uploading === r.kind ? "Uploading…" : have.length ? "Upload another" : "Upload"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section title="Uploaded files">
          {docs.length === 0 ? (
            <Card className="p-8">
              <EmptyState title="Nothing uploaded yet" body="Files you upload appear here with their scan result." />
            </Card>
          ) : (
            <Card className="grid gap-0 p-0">
              {docs.map((d) => (
                <div key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 px-5 py-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.kind} · {d.size} ·{" "}
                      <span className="inline-flex items-center gap-1 text-success">
                        <CheckCircle2 className="h-3 w-3" /> scanned
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${d.name}`}
                    onClick={() =>
                      dispatch({
                        type: "app:patch",
                        patch: { documents: docs.filter((x) => x.id !== d.id) },
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </Card>
          )}
        </Section>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {missing.length ? (
          <p className="text-xs text-muted-foreground">
            {missing.length} required document{missing.length === 1 ? "" : "s"} still outstanding — you can continue and
            add them later.
          </p>
        ) : null}
        <Button variant="outline" asChild>
          <Link to="/lucie-app/shop/application">Back</Link>
        </Button>
        <Button size="lg" onClick={() => void navigate({ to: "/lucie-app/shop/review" })}>
          Review application <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
