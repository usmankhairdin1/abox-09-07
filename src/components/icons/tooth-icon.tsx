import * as React from "react";
import { IconDental } from "@tabler/icons-react";

export const Tooth = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function Tooth({ className, ...props }, ref) {
    return (
      <IconDental
        ref={ref}
        className={className}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
