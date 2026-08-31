import { Link } from "@tanstack/react-router";

import {
  DISPOSITION_LABEL,
  DISPOSITION_MEANING,
  type DispositionInfo,
} from "@/lib/reconciliation-status";
import { cn } from "@/lib/utils";

const TONE: Record<DispositionInfo["disposition"], string> = {
  reconciled: "border-primary/40 bg-primary/10 text-foreground",
  excluded: "border-destructive/40 bg-destructive/10 text-foreground",
  "out-of-scope": "border-hairline bg-muted text-muted-foreground",
};

/** Compact disposition chip, safe to place in dense index grids. */
export function DispositionChip({
  info,
  className,
}: {
  info: DispositionInfo | undefined;
  className?: string;
}) {
  if (!info) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        TONE[info.disposition],
        className,
      )}
    >
      {info.disposition}
    </span>
  );
}

/**
 * Full disposition banner shown on every legacy wireframe screen so an
 * excluded or out-of-scope screen can never be mistaken for delivered scope.
 */
export function DispositionBanner({
  info,
  legacyId,
  className,
}: {
  info: DispositionInfo | undefined;
  legacyId: string;
  className?: string;
}) {
  if (!info) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed border-hairline bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground",
          className,
        )}
      >
        <span className="font-mono uppercase tracking-wider">{legacyId}</span> has no Lucie
        reconciliation row yet. Until one exists, treat this screen as historical only.{" "}
        <Link to="/lucie/reconciliation" className="underline underline-offset-2">
          Reconciliation register
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border px-3 py-2", TONE[info.disposition], className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
          {DISPOSITION_LABEL[info.disposition]}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
          {legacyId} · {info.basis === "group" ? `group: ${info.groupName}` : "screen-level row"}
        </span>
        <Link
          to="/lucie/reconciliation"
          className="ml-auto text-[11px] underline underline-offset-2"
        >
          Reconciliation register →
        </Link>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed">{DISPOSITION_MEANING[info.disposition]}</p>
      <p className="mt-1 text-[11px] leading-relaxed opacity-80">{info.note}</p>
      {info.surfaces.length || info.seams.length ? (
        <p className="mt-1.5 font-mono text-[10px] leading-relaxed opacity-70">
          {info.surfaces.length ? `surfaces: ${info.surfaces.join(", ")}` : null}
          {info.surfaces.length && info.seams.length ? " · " : null}
          {info.seams.length ? `seams: ${info.seams.join(", ")}` : null}
        </p>
      ) : null}
    </div>
  );
}
