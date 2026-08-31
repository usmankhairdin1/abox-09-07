/**
 * SCR-M04-017 — Draft versus Active Comparison.
 * Business-impact comparison across release components (REQ-M04-ADM-007).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { useMarketplaceState, getActiveBrand, getDraftBrand, getActiveContent, getDraftContent } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/releases/compare")({
  head: () => ({ meta: [{ title: "Compare Draft vs Active — ABox" }, { name: "description", content: "Business-impact comparison across release components." }] }),
  component: Page,
});

function Row({ label, active, draft }: { label: string; active: string; draft: string }) {
  const changed = active !== draft;
  return (
    <tr className={changed ? "bg-warning/5" : undefined}>
      <td className="px-4 py-3 text-sm font-medium">{label}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{active || "—"}</td>
      <td className="px-4 py-3 text-sm">{changed ? <span className="font-medium text-primary">{draft || "—"}</span> : <span className="text-muted-foreground">{draft || "—"}</span>}</td>
    </tr>
  );
}

function Page() {
  const mkt = useMarketplaceState();
  const activeBrand = getActiveBrand(mkt);
  const draftBrand = getDraftBrand(mkt) ?? activeBrand;
  const activeContent = getActiveContent(mkt);
  const draftContent = getDraftContent(mkt) ?? activeContent;

  const hasDraft = !!getDraftBrand(mkt) || !!getDraftContent(mkt);

  return (
    <InternalShell workspace="agency" pageTitle="Draft vs. active comparison" eyebrow="Draft versus Active Comparison · SCR-M04-017">
      {!hasDraft ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No draft exists. Start one from <Link to="/marketplace/admin/brand" className="story-link text-primary">Brand</Link> or <Link to="/marketplace/admin/content" className="story-link text-primary">Content</Link>.
        </p>
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-border text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <tr><th className="px-4 py-3">Field</th><th className="px-4 py-3">Active</th><th className="px-4 py-3">Draft</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeBrand && draftBrand && (
                    <>
                      <Row label="Display name" active={activeBrand.display_name} draft={draftBrand.display_name} />
                      <Row label="Headline (EN)" active={activeBrand.headline_en} draft={draftBrand.headline_en} />
                      <Row label="Introduction (EN)" active={activeBrand.intro_en} draft={draftBrand.intro_en} />
                      <Row label="Primary color" active={activeBrand.primary_color} draft={draftBrand.primary_color} />
                      <Row label="Accent color" active={activeBrand.accent_color} draft={draftBrand.accent_color} />
                    </>
                  )}
                  {activeContent && draftContent && (
                    <>
                      <Row label="Support display name" active={activeContent.support_display_name} draft={draftContent.support_display_name} />
                      <Row label="Support phone" active={activeContent.support_phone} draft={draftContent.support_phone} />
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <p className="mt-4 text-sm text-muted-foreground">Highlighted rows change what consumers see on publish. No sections publish partially.</p>
          <Link to="/marketplace/admin/releases/review" className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Continue to publication review <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </>
      )}
    </InternalShell>
  );
}
