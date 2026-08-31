import { cn } from "@/lib/utils";
type Tone = "sage" | "primary" | "warning" | "muted" | "destructive" | "info";
export function StatusBadge({ tone = "muted", children, className }: { tone?: Tone; children: React.ReactNode; className?: string; }) {
  const tones: Record<Tone, string> = {
    sage:        "[--tone:var(--sage)]",
    primary:     "[--tone:var(--primary)]",
    warning:     "[--tone:var(--warning)]",
    muted:       "[--tone:var(--foreground)]",
    destructive: "[--tone:var(--destructive)]",
    info:        "[--tone:var(--info)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        "border",
        tones[tone],
        className,
      )}
      style={{
        color: "color-mix(in oklch, var(--tone) 88%, var(--foreground))",
        background: "color-mix(in oklch, var(--tone) 12%, var(--card))",
        borderColor: "color-mix(in oklch, var(--tone) 34%, transparent)",
      }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--tone)" }} />
      {children}
    </span>
  );
}
