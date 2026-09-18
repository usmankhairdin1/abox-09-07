/**
 * SCR-M04-005 — Marketplace Content and Language.
 * English and Spanish general and channel content and controlled legal
 * assignments (REQ-M04-BRD-013..016).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Plus, ShieldCheck } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import {
  marketplaceStore, useMarketplaceState, getActiveContent, getDraftContent,
  type MarketplaceContent, CHANNEL_LABEL, type MarketplaceChannel,
} from "@/lib/marketplace-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/content")({
  head: () => ({ meta: [{ title: "Marketplace Content — ABox" }, { name: "description", content: "English and Spanish general and channel content and controlled legal assignments." }] }),
  component: Page,
});

const CHANNELS: MarketplaceChannel[] = ["CONSUMER_DIRECT", "AGENT", "EMPLOYER"];

function Page() {
  const mkt = useMarketplaceState();
  const active = getActiveContent(mkt);
  const draft = getDraftContent(mkt);
  const editing = draft ?? active;
  if (!editing) return null;

  const startDraft = () => marketplaceStore.createDraftContent();
  const field = (patch: Partial<MarketplaceContent>) => { if (draft) marketplaceStore.updateContent(draft.content_id, patch); };
  const channelField = (lang: "en" | "es", ch: MarketplaceChannel, value: string) => {
    if (!draft) return;
    const key = lang === "en" ? "channel_intro_en" : "channel_intro_es";
    marketplaceStore.updateContent(draft.content_id, { [key]: { ...editing[key], [ch]: value } } as Partial<MarketplaceContent>);
  };

  return (
    <InternalShell
      workspace="agency" pageTitle="Content and language" eyebrow="Marketplace Content and Language · SCR-M04-005"
      actions={!draft && <ActionPill onClick={startDraft} variant="primaryMd"><Plus className="h-4 w-4" aria-hidden /> Start draft</ActionPill>}
    >
      {!draft && <p className="mb-4 text-sm text-muted-foreground">Viewing active content. Start a draft to make changes.</p>}
      {draft && <p className="mb-4 rounded-xl border border-warning/40 bg-warning/5 p-3 text-sm">Editing draft. <Link to="/marketplace/admin/releases/review" className="story-link text-primary">Review and publish</Link> when ready.</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Support introduction</h2></header>
          <div className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-eyebrow">English</label>
              <textarea disabled={!draft} value={editing.support_intro_en} onChange={(e) => field({ support_intro_en: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-background p-3 disabled:bg-muted disabled:text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Español</label>
              <textarea disabled={!draft} value={editing.support_intro_es} onChange={(e) => field({ support_intro_es: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-background p-3 disabled:bg-muted disabled:text-muted-foreground" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Legal and regulated content</h2></header>
          <p className="text-sm text-muted-foreground">
            JET controls legal, privacy, consent, eligibility and PlanAI content through an approved bilingual library (REQ-M04-BRD-016).
            Roots select applicable approved items but cannot rewrite controlled text.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="rounded-lg border border-border p-2">Privacy Policy — <span className="text-muted-foreground">v3, JET-approved</span></li>
            <li className="rounded-lg border border-border p-2">Terms of Use — <span className="text-muted-foreground">v2, JET-approved</span></li>
            <li className="rounded-lg border border-border p-2">Consumer Consent — <span className="text-muted-foreground">v4, JET-approved</span></li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <header className="mb-3"><h2 className="text-display text-xl">Channel introductions</h2></header>
          <div className="grid gap-4 sm:grid-cols-3">
            {CHANNELS.map((ch) => (
              <div key={ch}>
                <p className="mb-2 text-eyebrow">{CHANNEL_LABEL[ch]}</p>
                <textarea
                  disabled={!draft} value={editing.channel_intro_en[ch] ?? ""} onChange={(e) => channelField("en", ch, e.target.value)}
                  rows={2} placeholder="English…" className="mb-2 w-full rounded-lg border border-border bg-background p-2 text-sm disabled:bg-muted disabled:text-muted-foreground"
                />
                <textarea
                  disabled={!draft} value={editing.channel_intro_es[ch] ?? ""} onChange={(e) => channelField("es", ch, e.target.value)}
                  rows={2} placeholder="Español…" className="w-full rounded-lg border border-border bg-background p-2 text-sm disabled:bg-muted disabled:text-muted-foreground"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <header className="mb-3"><h2 className="text-display text-xl">Support identity</h2></header>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-eyebrow">Support display name</label>
              <input disabled={!draft} value={editing.support_display_name} onChange={(e) => field({ support_display_name: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Phone</label>
              <input disabled={!draft} value={editing.support_phone} onChange={(e) => field({ support_phone: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Email</label>
              <input disabled={!draft} value={editing.support_email} onChange={(e) => field({ support_email: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Business hours</label>
              <input disabled={!draft} value={editing.support_hours} onChange={(e) => field({ support_hours: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
            </div>
          </div>
        </section>
      </div>
    </InternalShell>
  );
}
