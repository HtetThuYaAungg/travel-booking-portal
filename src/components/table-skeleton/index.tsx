"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  maxHeight?: string;
  minHeight?: string;
}

export default function TableSkeleton({
  columns = 4,
  rows = 5,
  showHeader = true,
  maxHeight = "calc(100vh - 220px)",
  minHeight = "calc(100vh - 220px)",
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-sm">
        <div
          className="overflow-auto rounded-sm relative"
          style={{
            maxHeight: maxHeight,
            minHeight: minHeight,
          }}
        >
          <table className="w-full caption-bottom text-sm">
            {showHeader && (
              <thead className="bg-muted sticky top-0 z-20 [&_tr]:border-b">
                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                  {Array(columns)
                    .fill(null)
                    .map((_, i) => (
                      <th
                        key={i}
                        className={`
                          text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]
                          ${
                            i === 0
                              ? "sticky left-0 z-30 bg-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                              : ""
                          }
                          ${
                            i === columns - 1
                              ? "sticky right-0 z-30 bg-muted shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                              : ""
                          }
                        `}
                      >
                        <Skeleton className="h-4 w-24" />
                      </th>
                    ))}
                </tr>
              </thead>
            )}
            <tbody>
              {Array(rows)
                .fill(null)
                .map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="[&_tr:last-child]:border-b bg-background hover:bg-muted/80 h-10 data-[state=selected]:bg-muted border-b transition-colors"
                  >
                    {Array(columns)
                      .fill(null)
                      .map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className={`
                            px-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]
                            ${
                              colIndex === 0
                                ? "sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                                : ""
                            }
                            ${
                              colIndex === columns - 1
                                ? "sticky right-0 z-10 bg-background shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                                : ""
                            }
                          `}
                        >
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
