"use client";

import type React from "react";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown, SortAsc, SortDesc } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSortClick = () => {
    const currentSort = column.getIsSorted();

    if (currentSort === false) {
      // No sort → Ascending
      column.toggleSorting(false);
    } else if (currentSort === "asc") {
      // Ascending → Descending
      column.toggleSorting(true);
    } else if (currentSort === "desc") {
      // Descending → No sort (clear sorting)
      column.clearSorting();
    }
  };

  return (
    <div className={cn("flex items-center ml-1 space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 group"
        onClick={handleSortClick}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <SortDesc
            className={`ml-2 h-4 w-4 ${
              column.getIsSorted() === "desc" ? "text-primary/90" : ""
            }`}
          />
        ) : column.getIsSorted() === "asc" ? (
          <SortAsc
            className={`ml-2 h-4 w-4 ${
              column.getIsSorted() === "asc" ? "text-primary/90" : ""
            }`}
          />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 group-hover:text-primary/90" />
        )}
      </Button>
    </div>
  );
}
