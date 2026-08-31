/**
 * ABox mark — circular orbital badge. A dark disc with a citron
 * inner ring and a single orbital dot, plus the letter A cut from
 * the negative space. Feels like a tuner / dial / satellite icon —
 * a hard visual break from the old ink-stamp.
 */
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: number;
  tone?: "primary" | "sage" | "sidebar" | "foreground";
}

const TONES: Record<NonNullable<Props["tone"]>, { bg: string; ring: string; fg: string; dot: string }> = {
  primary:    { bg: "var(--surface)", ring: "var(--primary)", fg: "var(--foreground)", dot: "var(--primary)" },
  sage:       { bg: "var(--surface)", ring: "var(--sage)",    fg: "var(--foreground)", dot: "var(--sage)" },
  sidebar:    { bg: "var(--sidebar-accent)", ring: "var(--sidebar-primary)", fg: "var(--sidebar-foreground)", dot: "var(--sidebar-primary)" },
  foreground: { bg: "var(--foreground)", ring: "var(--primary)", fg: "var(--background)", dot: "var(--primary)" },
};

export function AboxMark({ className, size = 36, tone = "primary" }: Props) {
  const t = TONES[tone];
  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* disc */}
        <circle cx="20" cy="20" r="19" fill={t.bg} stroke="var(--hairline)" strokeWidth="1" />
        {/* inner ring */}
        <circle cx="20" cy="20" r="13" fill="none" stroke={t.ring} strokeWidth="1.2" opacity="0.9" />
        {/* dashed mid ring */}
        <circle cx="20" cy="20" r="16" fill="none" stroke={t.ring} strokeWidth="0.6" strokeDasharray="1.4 2.4" opacity="0.55" />
        {/* orbital dot */}
        <circle cx="34" cy="20" r="2.2" fill={t.dot} />
        {/* chevron A */}
        <path d="M13.5 25 L20 12 L26.5 25" fill="none" stroke={t.fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.5 21.5 H23.5" stroke={t.fg} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function AboxWordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="text-display leading-none tracking-tight" style={{ fontSize: compact ? 20 : 24 }}>
        ABox
      </span>
      {!compact && <span className="text-eyebrow" style={{ fontSize: 10 }}>Agency in a Box</span>}
    </span>
  );
}
