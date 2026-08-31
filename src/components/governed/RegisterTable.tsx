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
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <IdChip>{id}</IdChip>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {rows.length} rows
        </span>
        <label className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Filter</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="stable ID or text"
            className="w-56 rounded border border-hairline bg-background px-2 py-1 text-xs"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-hairline">
        <table className="w-full min-w-[48rem] border-collapse text-left text-[11px]">
          <caption className="sr-only">{id} controlled register</caption>
          <thead className="bg-muted/40">
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col" className="whitespace-nowrap px-2 py-1.5 font-mono font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={`${id}-${i}`} className="border-t border-hairline align-top">
                {columns.map((c) => (
                  <td key={c} className="max-w-[22rem] px-2 py-1.5 text-muted-foreground">
                    {r[c]}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-2 py-4 text-center text-muted-foreground">
                  No rows match that filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {filtered.length > limit ? (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="rounded border border-hairline px-2 py-1 font-mono text-[10px] uppercase hover:bg-accent"
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
