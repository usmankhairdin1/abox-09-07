/**
 * CarrierMark — small circular carrier logo treatment for plan tiles.
 * Uses carrier initials on a neutral tinted disc so it is identifiable
 * without competing with the plan information.
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

export function CarrierMark({
  carrier,
  size = 36,
  className,
}: {
  carrier: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      title={carrier}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-hairline bg-surface font-semibold tracking-tight text-muted-foreground",
        className,
      )}
    >
      {initials(carrier) || "—"}
    </span>
  );
}
