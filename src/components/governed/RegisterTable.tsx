import { useMemo, useState } from "react";

import { Annotation, IdChip } from "@/components/wireframe/primitives";
import { rowsMatching, type RegisterRow } from "@/lib/governed";

/** Accessible, searchable table over one controlled register. */
export function RegisterTable({
  id,
  rows,
  limit = 60,
}: {
  id: string;
  rows: RegisterRow[];
  limit?: number;
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const filtered = useMemo(() => rowsMatching(rows, query), [rows, query]);
  const visible = showAll ? filtered : filtered.slice(0, limit);
  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <IdChip>{id}</IdChip>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {filtered.length} of {rows.length} rows
        </span>
        <label className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="text-eyebrow">Filter</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="stable ID or text"
            className="w-56 rounded-lg border border-hairline bg-background px-2.5 py-1.5 text-xs outline-none transition-shadow focus:ring-2 focus:ring-ring/30"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-left text-[11.5px]">
            <caption className="sr-only">{id} controlled register</caption>
            <thead className="border-b border-hairline bg-surface/60 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="whitespace-nowrap px-3 py-3 font-semibold"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr
                  key={`${id}-${i}`}
                  className="group relative border-b border-hairline/60 align-top transition-colors last:border-0 hover:bg-surface/70"
                >
                  {columns.map((c, ci) => (
                    <td
                      key={c}
                      className="relative max-w-[22rem] px-3 py-2.5 leading-relaxed text-muted-foreground"
                    >
                      {ci === 0 ? (
                        <span
                          aria-hidden
                          className="absolute bottom-0 left-0 top-0 w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-200 group-hover:scale-y-100"
                        />
                      ) : null}
                      {r[c]}
                    </td>
                  ))}
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-10 text-center text-muted-foreground"
                  >
                    No rows match that filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > limit ? (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="rounded-lg border border-hairline bg-card px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {showAll ? "Show first " + limit : `Show all ${filtered.length}`}
        </button>
      ) : null}
      <Annotation>
        Rows are the controlled register verbatim. Stable IDs are evidence anchors and are never
        renamed, renumbered, reused or removed.
      </Annotation>
    </div>
  );
}
