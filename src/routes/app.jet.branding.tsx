/**
 * SCR_JET_BRANDING — White-label brand tokens
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Palette } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/branding")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_BRANDING.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_BRANDING.purpose }] }),
  component: Page,
});

function Page() {
  const swatches = [
    { name: "Primary (Navy)", var: "--primary", value: "oklch(0.31 0.090 265)" },
    { name: "Teal accent", var: "--sage", value: "oklch(0.55 0.085 195)" },
    { name: "Background", var: "--background", value: "oklch(0.988 0.002 265)" },
    { name: "Sidebar", var: "--sidebar", value: "oklch(0.235 0.060 265)" },
  ];
  return (
    <InternalShell workspace="jet" pageTitle="Branding & white-label" eyebrow="Configuration"
      actions={<StatusBadge tone="primary">Live mode</StatusBadge>}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className={surfaceClass()}>
            <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> <p className="font-medium">Color palette</p></div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {swatches.map((s) => (
                <div key={s.name} className="rounded-xl border border-border p-3">
                  <div className="h-14 w-full rounded-lg" style={{ backgroundColor: `var(${s.var})` }} aria-hidden />
                  <p className="mt-2 text-xs font-medium">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{s.var}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={surfaceClass()}>
            <p className="font-medium">Logo, favicon, and wordmark</p>
            <p className="text-sm text-muted-foreground">Upload SVG/PNG assets. The AboxMark motif adapts to any hue on both light and dark backgrounds.</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl border border-dashed border-border-strong p-4">Wordmark SVG</div>
              <div className="rounded-xl border border-dashed border-border-strong p-4">Mark SVG</div>
              <div className="rounded-xl border border-dashed border-border-strong p-4">Favicon PNG</div>
            </div>
          </div>

          <div className={surfaceClass()}>
            <p className="font-medium">Disclosures</p>
            <textarea rows={4} defaultValue={"PlanAI guidance is educational, not binding. Not a substitute for licensed advice."}
              className="mt-3 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Disclosures" />
          </div>
        </section>

        <aside className="space-y-4">
          <div className={cn("sticky top-24", surfaceClass())}>
            <p className="text-eyebrow">Preview</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <div className="bg-primary p-3 text-primary-foreground">
                <p className="text-sm font-medium">Cedar Grove Marketplace</p>
              </div>
              <div className="p-4">
                <p className="text-display text-lg">Coverage that fits your family</p>
                <div className="mt-3 h-2 w-full rounded-full bg-primary-soft" aria-hidden />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Preview reflects the current tenant tokens.</p>
          </div>
        </aside>
      </div>
    </InternalShell>
  );
}
