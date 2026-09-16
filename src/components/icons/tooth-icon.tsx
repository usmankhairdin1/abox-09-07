import * as React from "react";

export const Tooth = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function Tooth({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path d="M12 6.5c-1.5 0 -2.5 1 -3 2.5c-.5 1.5 0 3 1 4c-1 1 -1 2.5 -1 4c0 2.5 1.5 4.5 4 4.5c1.5 0 2.5 -1 3 -2.5c.5 1.5 1.5 2.5 3 2.5c2.5 0 4 -2 4 -4.5c0 -1.5 0 -3 -1 -4c1 -1 1.5 -2.5 1 -4c-.5 -1.5 -1.5 -2.5 -3 -2.5c-1 0 -2 .5 -2.5 1.5c-.5 -1 -1.5 -1.5 -2.5 -1.5z" />
      </svg>
    );
  }
);
