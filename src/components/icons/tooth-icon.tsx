import * as React from "react";

export const Tooth = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function Tooth({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
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
        <path d="M7 6c0-3 2-5 5-5s5 2 5 5c0 2-1 3-1.5 4.5S14 13 14 16c0 2 .5 4 1.5 6 .5 1-.5 2-1.5 1-1-.5-1.5-2-2-3.5-.5-1.5-.5-3-.5-3s-.5 1.5-1 3-1 3-2 3.5c-1 .5-2-.5-1.5-1 1-2 1.5-4 1.5-6 0-3-.5-5-1-6.5S7 8 7 6z" />
      </svg>
    );
  }
);
