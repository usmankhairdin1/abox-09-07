/**
 * SCR-M04-006 — Marketplace Assets.
 * Upload, scan, validate, preview and retire fixed asset types
 * (REQ-M04-BRD-004: one logo, one mark, one favicon, one optional hero).
 */
import { surfaceClass } from "@/components/abox/surface";
import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Image, Upload, Trash2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, getAssets, type AssetType } from "@/lib/marketplace-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/assets")({
  head: () => ({ meta: [{ title: "Marketplace Assets — ABox" }, { name: "description", content: "Upload, scan, validate, preview and retire fixed asset types." }] }),
  component: Page,
});

const TYPES: { type: AssetType; label: string; hint: string }[] = [
  { type: "LOGO", label: "Primary logo", hint: "Shown in the marketplace header." },
  { type: "MARK", label: "Compact / square mark", hint: "Used where space is tight." },
  { type: "FAVICON", label: "Favicon", hint: "Browser tab icon." },
  { type: "HERO", label: "Hero image (optional)", hint: "Landing page hero background." },
];

function Page() {
  const mkt = useMarketplaceState();
  const assets = getAssets(mkt);
  const fileRefs = useRef<Record<AssetType, HTMLInputElement | null>>({ LOGO: null, MARK: null, FAVICON: null, HERO: null });

  const onUpload = (type: AssetType, file: File) => {
    const assetId = crypto.randomUUID().slice(0, 8);
    marketplaceStore.addAsset({ asset_id: assetId, marketplace_id: "mkt-cedar-grove", asset_type: type, filename: file.name, status: "SCANNING", uploaded_at: new Date().toISOString() });
    setTimeout(() => marketplaceStore.updateAsset(assetId, { status: "VALID" }), 900);
  };

  return (
    <InternalShell workspace="agency" pageTitle="Marketplace assets" eyebrow="Marketplace Assets · SCR-M04-006">
      <div className="grid gap-4 sm:grid-cols-2">
        {TYPES.map((t) => {
          const existing = assets.filter((a) => a.asset_type === t.type);
          return (
            <section key={t.type} className={surfaceClass()}>
              <header className="mb-2 flex items-center gap-2"><Image className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-lg">{t.label}</h2></header>
              <p className="mb-3 text-xs text-muted-foreground">{t.hint}</p>
              <input ref={(el) => { fileRefs.current[t.type] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(t.type, e.target.files[0])} />
              <ActionPill onClick={() => fileRefs.current[t.type]?.click()} variant="outlineSm">
                <Upload className="h-3.5 w-3.5" aria-hidden /> Upload
              </ActionPill>
              {existing.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">No {t.label.toLowerCase()} uploaded — an approved baseline is used.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {existing.map((a) => (
                    <li key={a.asset_id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
                      <span className="truncate">{a.filename}</span>
                      <span className="flex items-center gap-2">
                        <StatusBadge tone={a.status === "VALID" ? "sage" : a.status === "SCANNING" ? "warning" : "destructive"}>{a.status}</StatusBadge>
                        <button onClick={() => marketplaceStore.retireAsset(a.asset_id)} aria-label="Retire asset" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </InternalShell>
  );
}
