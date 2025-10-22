"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Pagination = {
  page?: number;
  limit?: number;
};
interface DataTablePaginationProps {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  setPagination: any;
  rowSelection: Record<string, boolean>;
  rowCount: number;
}

export function DataTablePagination({
  currentPage,
  pageCount,
  pageSize,
  setPagination,
  rowSelection,
  rowCount,
}: DataTablePaginationProps) {
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="flex justify-end items-center p-2">
      {selectedCount > 0 && (
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedCount} of {rowCount} row(s) selected.
        </div>
      )}
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPagination({ page: 1, limit: Number(value) }); // Reset to first page when changing page size
            }}
          >
            <SelectTrigger className="h-7 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[25, 50, 100, 200, 500, 1000].map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                  className=" text-xs font-medium"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-xs font-medium">
          Page {currentPage} of {pageCount || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPagination({ page: 1, limit : pageSize })}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={() => setPagination({ page: currentPage - 1, limit: pageSize })}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={() => setPagination({ page: currentPage + 1, limit : pageSize })}
            disabled={currentPage >= pageCount}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPagination({ page: pageCount, limit : pageSize })}
            disabled={currentPage >= pageCount}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
