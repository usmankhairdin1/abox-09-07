/**
 * MetalBadge — solid, distinct color treatment for Bronze / Silver / Gold /
 * Platinum / Catastrophic. Each tier uses its design-token background color and
 * a dark, hue-matched foreground so it stays legible in light and dark themes.
 */
import { cn } from "@/lib/utils";
import type { SamplePlan } from "@/lib/sample-data";

const TIER_VAR: Record<SamplePlan["metalTier"], string> = {
  Bronze: "[--tone:var(--metal-bronze)]",
  Silver: "[--tone:var(--metal-silver)]",
  Gold: "[--tone:var(--metal-gold)]",
  Platinum: "[--tone:var(--metal-platinum)]",
  Catastrophic: "[--tone:var(--metal-catastrophic)]",
};

export function MetalBadge({ tier, className }: { tier: SamplePlan["metalTier"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        TIER_VAR[tier] ?? TIER_VAR.Silver,
        className,
      )}
      style={{
        backgroundColor: "var(--tone)",
        color: "color-mix(in oklch, var(--tone) 45%, oklch(0.15 0 0))",
      }}
    >
      {tier}
    </span>
  );
}
