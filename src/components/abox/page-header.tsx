/**
 * PageHeader — used inside marketplace/member flows. Big display title,
 * masthead label and hairline underline.
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
}

export function PageHeader({ eyebrow, scrId, title, description, icon: Icon, actions, className }: Props) {
  const contextLabel = eyebrow ?? scrId;

  return (
    <FadeRise as="header" className={cn("relative mb-12", className)}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0 max-w-3xl">
          {contextLabel && <p className="mb-3 text-eyebrow">{contextLabel}</p>}
          <div className="flex items-start gap-4 md:items-center">
            {Icon && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface md:h-14 md:w-14">
                <Icon className="h-6 w-6 text-primary md:h-7 md:w-7" aria-hidden />
              </div>
            )}
            <h1 className="text-display text-[42px] font-semibold leading-[0.98] tracking-tight md:text-7xl">{title}</h1>
          </div>
          {description && (
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-10 h-px w-full origin-left animate-hairline bg-hairline" aria-hidden />
    </FadeRise>
  );
}
