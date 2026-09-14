/**
 * MetalBadge — the existing StatusBadge treatment, tinted per metal tier so
 * Bronze / Silver / Gold / Platinum / Catastrophic are visually distinct.
 * Colors come from design tokens (`--metal-*`) and inherit the badge's own
 * contrast mixing, so light and dark themes both stay accessible.
 */
import { StatusBadge } from "./status-badge";
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
    <StatusBadge className={`${TIER_VAR[tier] ?? TIER_VAR.Silver} ${className ?? ""}`}>{tier}</StatusBadge>
  );
}
