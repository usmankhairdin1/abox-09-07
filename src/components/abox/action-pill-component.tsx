/**
 * Canonical production ActionPill source (Phase 17).
 *
 * This module does NOT define any class strings. It imports the existing
 * ACTION_PILL map from ./action-pill so those strings keep a single owner and
 * the rendered output stays byte-identical to the current application.
 *
 * Two entry points, one source:
 *   ActionPill      — renders a native <button>, for the button call sites.
 *   actionPillClass — returns the class string, for <Link> and other elements
 *                     whose element type must stay at the consumer boundary.
 *
 * Deliberately no Slot / asChild / polymorphism: the emitted DOM, props, event
 * handlers and refs must match the current call sites exactly.
 *
 * File name note: the class map already occupies ./action-pill.ts, so this
 * component lives beside it under an explicit name to avoid module-resolution
 * ambiguity between action-pill.ts and action-pill.tsx.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { ACTION_PILL, type ActionPillVariant } from "./action-pill";

export { ACTION_PILL, type ActionPillVariant };

export interface ActionPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** One of the eight existing ACTION_PILL variants. No default. */
  variant: ActionPillVariant;
}

/**
 * Native <button> carrying the existing pill class string. All other props are
 * spread onto the button untouched — nothing is injected, defaulted or chained.
 */
export const ActionPill = React.forwardRef<HTMLButtonElement, ActionPillProps>(
  ({ variant, className, ...props }, ref) => (
    <button ref={ref} className={cn(ACTION_PILL[variant], className)} {...props} />
  ),
);
ActionPill.displayName = "ActionPill";

/**
 * Class-string entry point for consumers that must keep their own element
 * (TanStack Router <Link>, anchors). Returns the identical string the call site
 * uses today when no extra className is supplied.
 */
export function actionPillClass(variant: ActionPillVariant, className?: string): string {
  return cn(ACTION_PILL[variant], className);
}
