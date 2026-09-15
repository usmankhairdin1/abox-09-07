/**
 * OverflowText — renders text with ellipsis when it overflows its container,
 * revealing the full value in a tooltip on hover and keyboard focus. When the
 * text fits cleanly, no tooltip is attached and it behaves like plain text.
 */
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function OverflowText({
  text,
  className,
  as: Comp = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "div";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  // Measure eagerly (mount + resize + text change) so the tooltip trigger is
  // already in place before the pointer arrives — attaching it on hover would
  // swallow the very pointer-enter that should open it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  const inner = (
    <Comp ref={ref as never} className={cn("block truncate", className)}>
      {text}
    </Comp>
  );

  if (!overflowing) return inner;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* tabIndex makes the truncated value discoverable via keyboard */}
          <span tabIndex={0} className="block min-w-0 max-w-full outline-none" aria-label={text}>
            {inner}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs break-words">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
