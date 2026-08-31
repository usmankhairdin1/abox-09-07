import { createFileRoute } from "@tanstack/react-router";
import { Globe, Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, Field, PageHeader, Section, StatusChip, Stepper, toneFor } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PLANS } from "@/lib/lucie-app/data";
import { MARKETPLACE_STEPS } from "@/lib/lucie-app/steps";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/agency/marketplaces")({
  head: () => ({
    meta: [
      { title: "Marketplaces — Northgate Insurance Group" },
      { name: "description", content: "Build, brand and publish a white-labelled storefront: domain, look and feel, product shelf, preview and go live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Marketplaces" },
      { property: "og:description", content: "White-label storefront setup from draft to published." },
    ],
  }),
  component: MarketplacesPage,
});

function MarketplacesPage() {
  const { state, dispatch } = useLucie();
  const d = state.marketplaceDraft;
  const [step, setStep] = useState(0);

  const toggleProduct = (id: string) =>
    dispatch({
      type: "mkt:patch",
      patch: { products: d.products.includes(id) ? d.products.filter((p) => p !== id) : [...d.products, id] },
    });

  const canPublish = Boolean(d.name.trim() && d.domain.trim() && d.products.length);

  return (
    <>
      <PageHeader
        eyebrow="Agency"
        title="Marketplaces"
        lede="Each storefront carries your brand, your domain and only the products you choose. Publishing is the moment shoppers can reach it."
      />

      <Section title="Your storefronts">
        <DataTable
          rows={state.marketplaces}
          keyOf={(m) => m.id}
          columns={[
            {
              head: "Storefront",
              cell: (m) => (
                <div className="min-w-0">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.domain}</p>
                </div>
              ),
            },
            { head: "Products", cell: (m) => m.products },
            { head: "Owner", cell: (m) => m.owner },
            { head: "Updated", cell: (m) => m.updated },
            { head: "Status", cell: (m) => <StatusChip tone={toneFor(m.status)}>{m.status.replace("_", " ")}</StatusChip> },
          ]}
        />
      </Section>

      <Section title="Storefront setup" description="Changes are saved to the draft; nothing is public until you publish.">
        <Stepper steps={MARKETPLACE_STEPS} current={step} />
        <Card className="mt-3 grid gap-4 p-5">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Storefront name" required>
                <Input value={d.name} onChange={(e) => dispatch({ type: "mkt:patch", patch: { name: e.target.value } })} />
              </Field>
              <Field label="Domain" required hint="A subdomain of your agency domain, verified before publishing.">
                <Input value={d.domain} onChange={(e) => dispatch({ type: "mkt:patch", patch: { domain: e.target.value } })} />
              </Field>
              <Field label="Support email">
                <Input
                  value={d.supportEmail}
                  onChange={(e) => dispatch({ type: "mkt:patch", patch: { supportEmail: e.target.value } })}
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary colour" hint="Used for buttons, links and the header band.">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label="Primary colour"
                    value={d.primaryColor}
                    onChange={(e) => dispatch({ type: "mkt:patch", patch: { primaryColor: e.target.value } })}
                    className="h-9 w-14 cursor-pointer rounded-md border border-border bg-transparent"
                  />
                  <Input
                    value={d.primaryColor}
                    onChange={(e) => dispatch({ type: "mkt:patch", patch: { primaryColor: e.target.value } })}
                  />
                </div>
              </Field>
              <Field label="Tagline" hint="Shown under the logo on the landing page.">
                <Textarea
                  rows={2}
                  value={d.tagline}
                  onChange={(e) => dispatch({ type: "mkt:patch", patch: { tagline: e.target.value } })}
                />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-2">
              <p className="text-xs text-muted-foreground">
                Pick the products this storefront sells. Producers still need the matching appointment to quote them.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {PLANS.map((p) => (
                  <label key={p.id} className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                    <Checkbox
                      className="mt-0.5"
                      checked={d.products.includes(p.id)}
                      onCheckedChange={() => toggleProduct(p.id)}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.carrier} · {p.kind} · {p.market}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ backgroundColor: d.primaryColor }}>
                <span className="font-display text-base font-semibold text-white">{d.name || "Your storefront"}</span>
                <span className="text-[11px] text-white/80">{d.supportEmail}</span>
              </div>
              <div className="grid gap-3 bg-card p-6">
                <p className="font-display text-2xl font-semibold">{d.tagline || "Add a tagline to greet shoppers."}</p>
                <p className="text-sm text-muted-foreground">
                  {d.products.length} product{d.products.length === 1 ? "" : "s"} on the shelf · served at {d.domain}
                </p>
                <div className="flex gap-2">
                  <span
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                    style={{ backgroundColor: d.primaryColor }}
                  >
                    Get a quote
                  </span>
                  <span className="rounded-lg border border-border px-3 py-1.5 text-xs">Talk to an agent</span>
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-3">
              <div className="grid gap-1.5 text-sm">
                {[
                  ["Storefront name", d.name],
                  ["Domain", d.domain],
                  ["Products", `${d.products.length} selected`],
                  ["Support email", d.supportEmail],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 border-b border-border/60 py-2 last:border-0">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="min-w-0 break-words">{v}</span>
                  </div>
                ))}
              </div>
              {d.published ? (
                <p className="flex items-center gap-2 text-sm text-success">
                  <Globe className="h-4 w-4" /> Live at {d.domain}
                </p>
              ) : (
                <Button
                  className="w-fit"
                  disabled={!canPublish}
                  onClick={() => {
                    dispatch({ type: "mkt:publish" });
                    toast.success(`${d.name} is live at ${d.domain}.`);
                  }}
                >
                  <Rocket className="h-4 w-4" /> Publish storefront
                </Button>
              )}
            </div>
          ) : null}

          <div className="flex justify-between gap-2 border-t border-border pt-4">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <Button
              variant={step === MARKETPLACE_STEPS.length - 1 ? "outline" : "default"}
              disabled={step === MARKETPLACE_STEPS.length - 1}
              onClick={() => setStep((s) => Math.min(MARKETPLACE_STEPS.length - 1, s + 1))}
            >
              Continue
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
