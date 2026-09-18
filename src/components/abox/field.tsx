import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Canonical wrapping-label field composition (Phase 34).
 *
 * Renders exactly:
 *   <label className="block text-sm"><span className="text-eyebrow">{label}</span>{children}</label>
 *
 * The control stays consumer-owned: element, props, value, handlers, validation,
 * required semantics and classes are passed as children and are not touched here.
 * Label association stays implicit through the wrapping <label> — this composition
 * never introduces htmlFor/id pairing or generated ids.
 */
export function LabeledField({
  label,
  className,
  children,
}: {
  label: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block text-sm", className)}>
      <span className="text-eyebrow">{label}</span>
      {children}
    </label>
  );
}
