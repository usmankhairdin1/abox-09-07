import * as React from "react";
import { faTooth } from "@fortawesome/free-solid-svg-icons";

const [width, height, , , pathData] = faTooth.icon;

export const Tooth = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function Tooth({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        fill="currentColor"
        className={className}
        aria-hidden="true"
        {...props}
      >
        {typeof pathData === "string" ? (
          <path d={pathData} />
        ) : (
          pathData.map((path, index) => <path key={index} d={path} />)
        )}
      </svg>
    );
  }
);
