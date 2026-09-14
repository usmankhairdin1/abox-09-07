/**
 * PlaceholderScreen — editorial route stub for Wave 1.
 */
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AboxMark } from "./logo";
import type { ScreenMeta } from "@/lib/screens";
import { cn } from "@/lib/utils";
import { DiagonalWeave } from "./decor";
import { FadeRise } from "./motion";

const PHASE_LABEL: Record<ScreenMeta["phase"], { label: string; tone: string }> = {
  m1: { label: "Module 1 · Active build", tone: "text-primary" },
  "m1-align": { label: "Module 1 · Non-breaking alignment", tone: "text-sage" },
  phase1: { label: "Broader Phase 1", tone: "text-foreground" },
  future: { label: "Future seam", tone: "text-muted-foreground" },
};

interface Props {
  screen: ScreenMeta;
  className?: string;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export function PlaceholderScreen({ screen, className, backTo, backLabel, children }: Props) {
  const phase = PHASE_LABEL[screen.phase];
  return (
    <FadeRise className={cn("mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-14 md:py-20", className)}>
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel ?? "Back"}
        </Link>
      )}
      <div>
        <p className={cn("mb-3 text-eyebrow", phase.tone)}>{phase.label}</p>
        <div className="flex items-start gap-6">
          <AboxMark size={52} tone="primary" />
          <div className="flex-1">
            <h1 className="text-display text-4xl md:text-6xl">{screen.name}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{screen.purpose}</p>
          </div>
        </div>
      </div>
      {children ? (
        <div className="rounded-lg border border-hairline bg-card p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          {children}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface/60 p-10 text-sm text-muted-foreground">
          <DiagonalWeave className="opacity-30" />
          <div className="relative">
            <p className="text-eyebrow mb-4">Coming next</p>
            <p className="max-w-2xl">
              This screen is part of the ABox Phase 1 sitemap and will be built in the next wave.
              Its identity, purpose, and phase posture are already registered so downstream
              requirements, QA, and audit trace stay stable.
            </p>
          </div>
        </div>
      )}
      <div className="text-serial">
        Source · {screen.workspace === "marketplace" ? "Consumer Marketplace" : `${screen.workspace} workspace`} · Registered in <code className="font-mono">src/lib/screens.ts</code>
      </div>
      <a
        href="https://docs.lovable.dev"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
      >
        Design and IA notes <ArrowUpRight className="h-3 w-3" />
      </a>
    </FadeRise>
  );
}
