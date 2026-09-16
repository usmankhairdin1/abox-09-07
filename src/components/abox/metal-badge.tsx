/**
 * MetalBadge — solid, distinct color treatment for Bronze / Silver / Gold /
 * Platinum / Catastrophic. Each tier uses its design-token background color and
 * a dark, hue-matched foreground so it stays legible in light and dark themes.
 */
import { cn } from "@/lib/utils";
import type { SamplePlan } from "@/lib/sample-data";

const TIER_VAR: Record<SamplePlan["metalTier"], string> = {
  Bronze: "[--tone:var(--metal-bronze)] [--tone-fg:var(--metal-bronze-fg)]",
  "Expanded Bronze": "[--tone:var(--metal-expanded-bronze)] [--tone-fg:var(--metal-expanded-bronze-fg)]",
  Silver: "[--tone:var(--metal-silver)] [--tone-fg:var(--metal-silver-fg)]",
  Gold: "[--tone:var(--metal-gold)] [--tone-fg:var(--metal-gold-fg)]",
  Platinum: "[--tone:var(--metal-platinum)] [--tone-fg:var(--metal-platinum-fg)]",
  Catastrophic: "[--tone:var(--metal-catastrophic)] [--tone-fg:var(--metal-catastrophic-fg)]",
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
        color: "var(--tone-fg)",
      }}
    >
      {tier}
    </span>
  );
}

