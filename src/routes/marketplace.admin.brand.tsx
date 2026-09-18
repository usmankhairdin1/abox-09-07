/**
 * SCR-M04-004 — Marketplace Identity and Brand.
 * Display identity, fixed assets, colors and accessible validation
 * (REQ-M04-BRD-001..008). Editing creates a DRAFT version; publishing
 * happens from Publication Review (SCR-M04-019).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Palette, Plus } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, getActiveBrand, getDraftBrand, type Brand } from "@/lib/marketplace-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/brand")({
  head: () => ({ meta: [{ title: "Marketplace Brand — ABox" }, { name: "description", content: "Display identity, fixed assets, colors and accessible validation." }] }),
  component: Page,
});

function contrastOk(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return true;
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Rough check against a white background — flag near-white colors as inaccessible.
  return lum < 0.85;
}

function Page() {
  const mkt = useMarketplaceState();
  const active = getActiveBrand(mkt);
  const draft = getDraftBrand(mkt);
  const editing = draft ?? active;
  const [dirty, setDirty] = useState<Partial<Brand>>({});

  if (!editing) return null;
  const current = { ...editing, ...dirty };

  const startDraft = () => { marketplaceStore.createDraftBrand(); setDirty({}); };
  const field = (key: keyof Brand, value: string) => {
    setDirty((d) => ({ ...d, [key]: value }));
    if (draft) marketplaceStore.updateBrand(draft.brand_id, { [key]: value });
  };

  const primaryOk = contrastOk(current.primary_color);
  const accentOk = contrastOk(current.accent_color);

  return (
    <InternalShell
      workspace="agency" pageTitle="Identity and brand" eyebrow="Marketplace Identity and Brand · SCR-M04-004"
      actions={!draft && <ActionPill onClick={startDraft} variant="primaryMd"><Plus className="h-4 w-4" aria-hidden /> Start draft</ActionPill>}
    >
      {!draft && <p className="mb-4 text-sm text-muted-foreground">Viewing the active brand. Start a draft to make changes — publishing happens from Publication Review.</p>}
      {draft && <p className="mb-4 rounded-xl border border-warning/40 bg-warning/5 p-3 text-sm">Editing draft v{draft.version}. <Link to="/marketplace/admin/releases/compare" className="story-link text-primary">Compare with active</Link> or <Link to="/marketplace/admin/releases/review" className="story-link text-primary">review and publish</Link>.</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center gap-2"><Palette className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Display identity</h2></header>
          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-eyebrow">Display name</label>
              <input disabled={!draft} value={current.display_name} onChange={(e) => field("display_name", e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-eyebrow">Tagline (English)</label>
                <input disabled={!draft} value={current.tagline_en} onChange={(e) => field("tagline_en", e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
              </div>
              <div>
                <label className="mb-1 block text-eyebrow">Tagline (Español)</label>
                <input disabled={!draft} value={current.tagline_es} onChange={(e) => field("tagline_es", e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-eyebrow">Headline (English)</label>
                <input disabled={!draft} value={current.headline_en} onChange={(e) => field("headline_en", e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
              </div>
              <div>
                <label className="mb-1 block text-eyebrow">Headline (Español)</label>
                <input disabled={!draft} value={current.headline_es} onChange={(e) => field("headline_es", e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 disabled:bg-muted disabled:text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-eyebrow">Introduction (English)</label>
                <textarea disabled={!draft} value={current.intro_en} onChange={(e) => field("intro_en", e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background p-3 disabled:bg-muted disabled:text-muted-foreground" />
              </div>
              <div>
                <label className="mb-1 block text-eyebrow">Introducción (Español)</label>
                <textarea disabled={!draft} value={current.intro_es} onChange={(e) => field("intro_es", e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background p-3 disabled:bg-muted disabled:text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3"><h2 className="text-display text-xl">Colors</h2></header>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <label className="text-eyebrow">Primary color</label>
              <div className="flex items-center gap-2">
                <input disabled={!draft} type="color" value={current.primary_color} onChange={(e) => field("primary_color", e.target.value)} className="h-9 w-14 rounded border border-border bg-background disabled:opacity-60" />
                <span className="font-mono text-xs">{current.primary_color}</span>
                {!primaryOk && <StatusBadge tone="destructive">Low contrast</StatusBadge>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-eyebrow">Accent color</label>
              <div className="flex items-center gap-2">
                <input disabled={!draft} type="color" value={current.accent_color} onChange={(e) => field("accent_color", e.target.value)} className="h-9 w-14 rounded border border-border bg-background disabled:opacity-60" />
                <span className="font-mono text-xs">{current.accent_color}</span>
                {!accentOk && <StatusBadge tone="destructive">Low contrast</StatusBadge>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Success, warning, error and status colors remain platform-controlled. Typography uses one JET-approved accessible font family (REQ-M04-BRD-006).</p>

            <div className="mt-4 rounded-xl border border-hairline p-4" style={{ background: current.primary_color, color: "#fff" }}>
              <p className="text-sm font-semibold">Live preview</p>
              <p className="text-xs opacity-90">{current.display_name} — {current.tagline_en}</p>
            </div>
          </div>
        </section>
      </div>
    </InternalShell>
  );
}
