/**
 * CarrierMark — small circular carrier identity treatment for plan tiles
 * and carrier filter/list contexts.
 *
 * These are illustrative placeholder marks, not official carrier logos:
 * each carrier gets a deterministic initial monogram on a soft tinted disc
 * derived from its name, so the same carrier always renders the same mark.
 * Unknown carriers fall back to a neutral treatment.
 */
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .replace(/[^A-Za-z ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Deterministic 0–359 hue from the carrier name. */
function carrierHue(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

export function CarrierMark({
  carrier,
  size = 36,
  className,
}: {
  carrier: string;
  size?: number;
  className?: string;
}) {
  const label = initials(carrier);
  const hasMark = label.length > 0;
  const hue = carrierHue(carrier);

  return (
    <span
      aria-hidden
      title={carrier}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.34),
        ...(hasMark
          ? {
              backgroundColor: `oklch(0.93 0.05 ${hue})`,
              color: `oklch(0.42 0.12 ${hue})`,
              borderColor: `oklch(0.84 0.06 ${hue})`,
            }
          : undefined),
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-semibold tracking-tight",
        hasMark ? "" : "border-hairline bg-surface text-muted-foreground",
        className,
      )}
    >
      {label || "—"}
    </span>
  );
}
