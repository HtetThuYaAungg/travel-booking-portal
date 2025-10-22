"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { Badge } from "@/components/ui/badge";
import { Permission } from "@/api-config/services/permission";
import { PermissionTableActions } from "./permission-actions";

export const permissionCols: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Permission Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className=" max-w-[200px] truncate font-medium">
          {row.getValue("name")}
        </div>
      );
    },
    enableSorting: true,
    enableResizing: true,
  },
  {
    accessorKey: "module",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Module" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="w-[100px] flex justify-center">
        {row.getValue("module")}
      </Badge>
    ),
    enableSorting: true,
    enableResizing: true,
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-[100px] flex justify-center">
        {row.getValue("action")}
      </Badge>
    ),
    enableSorting: true,
    enableResizing: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className=" max-w-[300px] truncate">
          {description || "-"}
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
        <div className=" capitalize max-w-[200px] truncate">
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
        <PermissionTableActions row={row} />
      </div>
    ),
  },
];
