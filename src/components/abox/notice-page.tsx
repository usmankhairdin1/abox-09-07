/**
 * NoticePage — Phase 35 canonical opening structure for standalone notice
 * screens (no-options, unavailable pathway/route, agent unavailable).
 *
 * This is NOT a second PageHeader. PageHeader owns the in-shell workspace
 * screen header (eyebrow, left-aligned display title, actions, hairline).
 * NoticePage owns the centred standalone notice opening: medallion glyph,
 * short title, short supporting line, then consumer-owned actions as
 * direct children of the same section — exactly the existing DOM.
 *
 * Class output is byte-identical to the literal markup it replaces.
 */
import type { ComponentType } from "react";

export type NoticeTone = "muted" | "destructive" | "warning" | "primary";

const TONE: Record<NoticeTone, string> = {
  muted: "border-hairline bg-muted text-muted-foreground",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  warning: "border-warning/40 bg-warning/10 text-warning",
  primary: "border-primary/40 bg-primary/10 text-primary",
};

interface Props {
  tone: NoticeTone;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function NoticePage({ tone, icon: Icon, title, description, children }: Props) {
  return (
    <section className="mx-auto max-w-lg px-4 py-32 text-center">
      <span
        className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl border ${TONE[tone]}`}
      >
        <Icon className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="text-display mt-6 text-2xl">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      {children}
    </section>
  );
}
