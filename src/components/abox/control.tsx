/**
 * Canonical ABox form-control surface classes (Phase 33).
 *
 * Class-level only: consumers keep their own native element, props, value,
 * event handlers, label association and accessibility attributes. This helper
 * owns nothing but the repeated control surface string
 * (height + width + radius + border + background + horizontal padding, plus the
 * opt-in focus-ring treatment).
 *
 * Emission order is fixed: height -> base -> focusRing.
 * Anything else (mt-1, custom padding, tabular-nums, disabled variants)
 * stays consumer-owned and is composed with cn() by the consumer.
 */
import { cn } from "@/lib/utils";

const CONTROL_HEIGHT = {
  md: "h-10",
  lg: "h-11",
} as const;

const CONTROL_BASE = "w-full rounded-lg border border-border bg-background px-3";

const CONTROL_FOCUS_RING = "outline-none focus:ring-2 focus:ring-ring";

export type ControlClassOptions = {
  /** Control height: md = h-10, lg = h-11. Defaults to md. */
  height?: keyof typeof CONTROL_HEIGHT;
  /** Opt-in focus ring treatment. Defaults to off. */
  focusRing?: boolean;
};

export function controlClass({ height = "md", focusRing = false }: ControlClassOptions = {}) {
  return cn(CONTROL_HEIGHT[height], CONTROL_BASE, focusRing && CONTROL_FOCUS_RING);
}
