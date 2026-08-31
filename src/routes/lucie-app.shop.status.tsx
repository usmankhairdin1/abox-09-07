import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader, Section, StatusChip, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { planById } from "@/lib/lucie-app/data";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/status")({
  head: () => ({
    meta: [
      { title: "Submission status — Northgate Marketplace" },
      { name: "description", content: "Track your application as it moves from submission to carrier acknowledgement and effective coverage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Submission status" },
      { property: "og:description", content: "Live progress of your application with the carrier." },
    ],
  }),
  component: StatusPage,
});

const TRACK = [
  { label: "Application signed", detail: "Your signature and attestations were recorded." },
  { label: "Packaged for the carrier", detail: "Documents and answers were validated and bundled." },
  { label: "Sent to Brightline Assurance", detail: "Delivered over the carrier submission channel." },
  { label: "Carrier acknowledgement", detail: "The carrier has your application in its review queue." },
];

function StatusPage() {
  const { state } = useLucie();
  const navigate = useNavigate();
  const [reached, setReached] = useState(1);

  useEffect(() => {
    if (reached >= TRACK.length) return;
    const t = window.setTimeout(() => setReached((r) => r + 1), 1400);
    return () => window.clearTimeout(t);
  }, [reached]);

  const exchange = state.cart
    .map((l) => planById(l.planId))
    .find((p) => p && p.market === "on-exchange" && p.kind === "medical");
  const done = reached >= TRACK.length;

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={8} />
      <PageHeader
        eyebrow="Step 9 of 9"
        title="Submission status"
        lede="This page updates on its own. You can close it — we email every change to your account too."
        actions={
          state.application.submissionId ? (
            <StatusChip tone="info">Reference {state.application.submissionId}</StatusChip>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Section title="Progress">
          <Card className="grid gap-0 p-5">
            {TRACK.map((s, i) => {
              const complete = i < reached;
              const active = i === reached;
              return (
                <div key={s.label} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3 border-b border-border/60 py-3 last:border-0">
                  <span className="mt-0.5">
                    {complete ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                    ) : active ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground/60" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${complete || active ? "" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                </div>
              );
            })}
          </Card>
        </Section>

        <aside className="grid content-start gap-3">
          {exchange ? (
            <Card className="grid gap-2 p-5">
              <StatusChip tone="warn">One step left off-site</StatusChip>
              <p className="text-sm font-medium">{exchange.name}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                This marketplace medical plan finishes on the public exchange. We pass your details across so you do not
                retype them, and the result comes back to this page.
              </p>
              <Button variant="outline" size="sm" className="w-fit" disabled={!done}>
                <ExternalLink className="h-3.5 w-3.5" /> Continue on the exchange
              </Button>
            </Card>
          ) : null}

          <Card className="grid gap-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Need a hand?</p>
            <p className="text-xs text-muted-foreground">
              Marla Ortiz, your licensed agent, can see this submission and pick it up with the carrier.
            </p>
            <Button variant="ghost" size="sm" className="w-fit">
              Request a call back
            </Button>
          </Card>

          <Button size="lg" disabled={!done} onClick={() => void navigate({ to: "/lucie-app/shop/confirmation" })}>
            {done ? "See confirmation" : "Waiting for the carrier…"} <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/lucie-app">Back to the walkthrough</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
