import React from "react";
import { cn } from "@/lib/cn";

export default function Table({ columns, rows, loading, emptyText }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-muted border-b border-border">
          <tr className="text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-6 text-muted-foreground">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-6 text-muted-foreground">
                {emptyText || "No data found"}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={row._id || row.id || idx}
                className="border-b border-border last:border-b-0 hover:bg-muted/60 transition"
              >
                {columns.map((c) => (
                  <td key={c.key} className="p-3 align-middle text-foreground">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

