/**
 * OverflowText — renders text with ellipsis when it overflows its container,
 * revealing the full value in a tooltip on hover and keyboard focus. When the
 * text fits cleanly, no tooltip is attached and it behaves like plain text.
 */
import { useCallback, useRef, useState, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

  const check = useCallback(() => {
    const el = ref.current;
    if (el) setOverflowing(el.scrollWidth > el.clientWidth + 1);
  }, []);

  const inner: ReactNode = (
    <Comp
      ref={(node: HTMLElement | null) => {
        ref.current = node;
        check();
      }}
      onMouseEnter={check}
      className={cn("block truncate", className)}
    >
      {text}
    </Comp>
  );

  if (!overflowing) return inner;

  return (
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
  );
}
