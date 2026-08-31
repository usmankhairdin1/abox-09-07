/**
 * DataTable — editorial table. Uppercase serial headers, hairline
 * dividers, ember left-border on hover.
 */
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  caption?: string;
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
  ariaLabel?: string;
}

export function DataTable<T>({ columns, rows, getRowId, caption, empty, onRowClick, ariaLabel }: Props<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm" aria-label={ariaLabel}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "px-5 py-4 font-semibold",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-muted-foreground">
                  {empty ?? "No results."}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                className={cn(
                  "group border-b border-hairline/60 transition-colors last:border-0 hover:bg-panel/40 relative",
                  onRowClick && "cursor-pointer",
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-5 py-4 relative",
                      c.align === "right" && "text-right tabular-nums",
                      c.align === "center" && "text-center",
                      c.className,
                    )}
                  >
                    {ci === 0 && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 bottom-0 w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-200 group-hover:scale-y-100"
                      />
                    )}
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
