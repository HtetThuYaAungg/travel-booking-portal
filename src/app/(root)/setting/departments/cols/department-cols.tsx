"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { Badge } from "@/components/ui/badge";
import { DepartmentTableActions } from "./department-actions";
import { Department } from "@/api-config/services/department";

export const departmentCols: ColumnDef<Department>[] = [
  {
    accessorKey: "department_code",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Department Code" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="w-[100px] flex justify-center">
        {row.getValue("department_code")}
      </Badge>
    ),
    enableSorting: true,
    enableResizing: true,
  },
  {
    accessorKey: "department_name",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Department Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className=" max-w-[350px] truncate">
          {row.getValue("department_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      const created_by: any = row.getValue("created_by");
      return (
        <div className=" capitalize max-w-[300px] truncate">
          {created_by ? created_by.full_name : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ table, column }) => (
      <DataTableHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <div className="sticky right-0 bg-background px-1">
        <DepartmentTableActions row={row} />
      </div>
    ),
  },
];
