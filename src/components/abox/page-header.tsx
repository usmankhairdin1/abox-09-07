/**
 * PageHeader — used inside marketplace/member flows. Big display title,
 * masthead label and hairline underline. The compact variant shrinks the
 * title into a scannable summary line while keeping the same structure.
 */
import { cn } from "@/lib/utils";
import { FadeRise } from "./motion";
import type { ComponentType } from "react";

interface Props {
  eyebrow?: string;
  scrId?: string;
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

export function PageHeader({ eyebrow, scrId, title, description, icon: Icon, actions, className, variant = "default" }: Props) {
  const contextLabel = eyebrow ?? scrId;
  const isCompact = variant === "compact";

  return (
    <FadeRise as="header" className={cn("relative", isCompact ? "mb-6" : "mb-12", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          {!isCompact && contextLabel && <p className="mb-3 text-eyebrow">{contextLabel}</p>}
          <div className="flex items-start gap-4 md:items-center">
            {Icon && (
              <div className={cn(
                "flex shrink-0 items-center justify-center rounded-2xl border border-border bg-surface",
                isCompact ? "h-9 w-9" : "h-12 w-12 md:h-14 md:w-14",
              )}>
                <Icon className={cn("text-primary", isCompact ? "h-4 w-4" : "h-6 w-6 md:h-7 md:w-7")} aria-hidden />
              </div>
            )}
            <h1 className={cn(
              isCompact
                ? "text-xl font-semibold text-foreground md:text-2xl"
                : "text-display text-3xl font-semibold leading-[0.98] tracking-tight md:text-4xl",
            )}>

              {title}
            </h1>

          </div>
          {description && (
            <p className={cn("max-w-2xl text-muted-foreground", isCompact ? "mt-2 text-xs" : "mt-5 text-lg")}>
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {!isCompact && <div className="mt-10 h-px w-full origin-left animate-hairline bg-hairline" aria-hidden />}
    </FadeRise>
  );
}
