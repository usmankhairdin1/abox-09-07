import { cn } from "@/lib/utils";
import type { ComponentType } from "react";
import { DiagonalWeave } from "./decor";

interface Props {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}
export function EmptyState({ icon: Icon, title, body, action, className }: Props) {
  return (
    <div className={cn("relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface/60 px-6 py-14 text-center", className)}>
      <DiagonalWeave className="opacity-40" />
      <div className="relative flex flex-col items-center gap-4">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-hairline bg-background">
            <Icon className="h-5 w-5 text-primary" aria-hidden />
          </div>
        )}
        <p className="text-display text-2xl">{title}</p>
        {body && <p className="max-w-md text-sm text-muted-foreground">{body}</p>}
        {action}
      </div>
    </div>
  );
}
