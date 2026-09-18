/**
 * Canonical ABox Surface — one source of truth for the shared plain/elevated
 * card-surface treatment.
 *
 * Renders a native <div> only: no `as`, no Slot, no `asChild`, no polymorphism,
 * no element substitution. Existing <Link>/<button> card consumers must keep
 * their own element type and use `surfaceClass()` instead.
 *
 * Surface owns ONLY: rounded-2xl, border, border-border, bg-card, the selected
 * padding variant, and any explicitly enabled elevated / interactiveHover /
 * decor treatment. Everything else (layout, typography, responsive overrides,
 * sizing, positioning, spacing, colspan) stays consumer-owned via className.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type SurfacePadding = "none" | "sm" | "md" | "lg";

export interface SurfaceClassOptions {
  padding?: SurfacePadding;
  elevated?: boolean;
  interactiveHover?: boolean;
  decor?: boolean;
}

const SURFACE_BASE = "rounded-2xl border border-border bg-card";

const SURFACE_PADDING: Record<SurfacePadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const SURFACE_ELEVATED = "shadow-[var(--shadow-card)]";
const SURFACE_INTERACTIVE_HOVER = "transition-colors hover:bg-accent";
const SURFACE_DECOR = "card-brackets";

/** Shared class definition used by both `Surface` and `surfaceClass`. */
export function surfaceClass(opts: SurfaceClassOptions = {}): string {
  const { padding = "md", elevated = false, interactiveHover = false, decor = false } = opts;
  return cn(
    SURFACE_BASE,
    SURFACE_PADDING[padding],
    elevated && SURFACE_ELEVATED,
    interactiveHover && SURFACE_INTERACTIVE_HOVER,
    decor && SURFACE_DECOR,
  );
}

export type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & SurfaceClassOptions;

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  {
    padding = "md",
    elevated = false,
    interactiveHover = false,
    decor = false,
    className,
    ...divProps
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(surfaceClass({ padding, elevated, interactiveHover, decor }), className)}
      {...divProps}
    />
  );
});
