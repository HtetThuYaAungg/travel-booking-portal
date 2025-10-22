"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./data-table-pagination";
import TableSkeleton from "../table-skeleton";

type Pagination = {
  page: number;
  limit: number;
};
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  // pagination?: {
  //   page: number;
  //   limit: number;
  //   setPage: (page: number) => void;
  //   setLimit: (limit: number) => void;
  // };
  pagination?: Pagination;
  setPagination?: (pagination: Pagination) => void;
  filterColumn?: string;
  filterPlaceholder?: string;
  maxHeight?: string;
  minHeight?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 0,
  pagination,
  setPagination,
  filterColumn = "title",
  filterPlaceholder = "Filter titles...",
  maxHeight = "calc(100vh - 220px)",
  minHeight = "calc(100vh - 220px)",
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // For server-side pagination, we don't use getPaginationRowModel
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: !!pagination,
    pageCount: pageCount,
  });

  return (
    <>
      {isLoading ? (
        <>
        <TableSkeleton columns={columns.length} rows={10} minHeight={minHeight} maxHeight={maxHeight} showHeader={true}/>
        </>
      ) : (
        <>
          <div className="border rounded-sm">
            <div
              className="overflow-auto rounded-sm relative"
              style={{
                maxHeight: maxHeight,
                minHeight: minHeight,
              }}
            >
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-muted sticky top-0 z-20 [&_tr]:border-b">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                    >
                      {headerGroup.headers.map((header, index) => (
                        <th
                          key={header.id}
                          className={`
                        text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]
                        ${
                          index === 0
                            ? "sticky left-0 z-30 bg-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            : ""
                        }
                        ${
                          header.id === "actions"
                            ? "sticky right-0 z-30 bg-muted shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            : ""
                        }
                      `}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="[&_tr:last-child]:border-b bg-background hover:bg-muted/80 h-10 data-[state=selected]:bg-muted border-b transition-colors"
                      >
                        {row.getVisibleCells().map((cell, index) => (
                          <td
                            key={cell.id}
                            className={`
                          px-2   align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]
                          ${
                            index === 0
                              ? "sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                              : ""
                          }
                          ${
                            cell.column.id === "actions"
                              ? "sticky right-0 z-10 bg-background shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                              : ""
                          }
                        `}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted h-full transition-colors">
                      <td
                        colSpan={columns.length}
                        className="h-24 text-center p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                      >
                        No results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {pagination ? (
        <DataTablePagination
          currentPage={pagination.page}
          pageCount={pageCount}
          pageSize={pagination.limit}
          setPagination={setPagination}
          rowSelection={rowSelection}
          rowCount={data.length}
        />
      ) : null}
    </>
  );
}
