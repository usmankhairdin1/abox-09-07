/**
 * PageHeader — used inside marketplace/member flows. Big display title,
 * masthead label and hairline underline.
 */
import { cn } from "@/lib/utils";
import { MastheadMark } from "./decor";
import { FadeRise } from "./motion";

interface Props {
  eyebrow?: string;
  scrId?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, scrId, title, description, actions, className }: Props) {
  return (
    <FadeRise as="header" className={cn("relative mb-12", className)}>
      <MastheadMark {...(eyebrow ?? scrId ? { label: (eyebrow ?? scrId)! } : {})} />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0 max-w-3xl">
          <h1 className="text-display text-[42px] font-semibold leading-[0.98] tracking-tight md:text-7xl">{title}</h1>
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
