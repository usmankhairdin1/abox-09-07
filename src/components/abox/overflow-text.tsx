/**
 * OverflowText — renders text with ellipsis when it overflows its container,
 * revealing the full value in a tooltip on hover and keyboard focus. When the
 * text fits cleanly, no tooltip content is produced and it behaves like plain
 * text. The trigger is always mounted and overflow is re-measured on
 * pointer/focus so layout timing never suppresses the reveal.
 */
import { useCallback, useEffect, useRef, useState } from "react";
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

  const measure = useCallback(() => {
    const el = ref.current;
    if (el) setOverflowing(el.scrollWidth > el.clientWidth + 1);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, text]);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* tabIndex makes a truncated value discoverable via keyboard */}
          <span
            tabIndex={overflowing ? 0 : undefined}
            aria-label={overflowing ? text : undefined}
            onPointerEnter={measure}
            onFocus={measure}
            className="block min-w-0 max-w-full outline-none"
          >
            <Comp ref={ref as never} className={cn("block min-w-0 max-w-full truncate", className)}>
              {text}
            </Comp>
          </span>
        </TooltipTrigger>
        {overflowing && (
          <TooltipContent side="top" className="max-w-xs break-words">
            {text}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
